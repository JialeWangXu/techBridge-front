import { CommonModule,Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HelpRequestService, SupportSessionService } from '../../../../shared/services/help-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { sessionMethodTranslations } from '../../../../shared/models/supportSession.model';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-help-request-detail',
  templateUrl: './my-request-detail.component.html',
  styleUrls: ['./my-request-detail.component.css'],
  imports: [CommonModule, ModalComponent]
})
export class MyRequestDetailComponent implements OnInit {

  @ViewChild(ModalComponent) deleteModal!: ModalComponent; 
  constructor(private readonly helpRequestService: HelpRequestService, 
    private readonly supportSessionService: SupportSessionService,
    private readonly route:ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly toastr: ToastrService) {
    }

  cameFrom: string ='';  
  helpRequest:HelpRequest = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    senior: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'SENIOR',
    },
    title: '',
    description: '',
    status: RequestStatus.OPEN,
  };
  requestId:string|null = null;
  currentView: 'TUTORIAL'|'VOLUNTEER' = 'TUTORIAL';
  role:string ='';
  public RequestStatus = RequestStatus;
  public sessionMethodTranslations = sessionMethodTranslations;
  isGenerating: boolean = false;

  statusConfig: any = {
  'OPEN': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
  'FINDING_VOLUNTEER': { color: '#0d6efd', icon: 'bi-person-check-fill', text: 'Encontrando voluntario' },
  'IN_PROGRESS': { color: '#ffc107', icon: 'bi-hourglass-split', text: 'En curso' },
  'COMPLETED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
  'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };

  modalConfig = {
    title: 'Esta seguro de eliminar esta solicitud de ayuda?',
    message: 'Esta acción no se puede deshacer.',
    type: 'danger' as 'danger' | 'success' | 'info',
    showCancel: true,
    cancelText: 'Cancelar',
    confirmText: 'Eliminar'
  };

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    let userData = this.authService.getUserData();
    if(userData){
      this.role = userData['role'];
    }
    if(this.requestId){
      this.helpRequestService.getById(this.requestId).subscribe({
        next: (data) => {
          this.helpRequest = data;
        },
        error: (err) => {
          console.error('Error al obtener el detalle de la solicitud de ayuda:', err);
        }
      });
    }
  }

  deleteRequest(){
    if(this.requestId){
      this.helpRequestService.deleteById(this.requestId).subscribe({
        next: () => {
          this.toastr.success('Solicitud de ayuda eliminada exitosamente.', '¡Completado!');
          this.router.navigate(['/my-requests']);
        },
        error: (err) => {
          console.error('Error al eliminar la solicitud de ayuda:', err);
        }
      });
    }
  }

  formatVolunteerAddress(){
    if(this.helpRequest.volunteer){
      return [this.helpRequest.volunteer.province, this.helpRequest.volunteer.city, this.helpRequest.volunteer.postalCode]
        .filter((x): x is string => !!x)
        .join(', ');
    }
    return '';
  }

  goBack() {
    this.location.back();
  }

  updateRequestStatus(newStatus: RequestStatus) {
    if(this.requestId){
      this.helpRequestService.updateRequestStatus(this.requestId, newStatus).subscribe({
        next: (updatedRequest) => {
          this.helpRequest = updatedRequest;
          this.currentView = 'VOLUNTEER';
        },
        error: (err) => {
          console.error('Error al actualizar la solicitud de ayuda:', err);
        }
      });
    }
  }

  downloadResource() {
    if(this.helpRequest.supportSession?.s3RecordingUrl){
      const newTab = window.open('', '_blank');
      if(newTab){
        newTab.document.body.innerHTML = '<h2>Preparando la descarga...</h2>';
      }else{
        alert('No se pudo abrir una nueva pestaña para descargar el recurso. Por favor, revisa tu configuración de ventanas emergentes.');
        return;
      }
      
      this.supportSessionService.downloadResource(this.helpRequest.supportSession.id!).subscribe({
        next: (url) => {
          newTab.location.href = url; 
        },
        error: (err) => {
          console.error('Error al descargar el recurso:', err);
        }
      }); 
    }
  }

}
