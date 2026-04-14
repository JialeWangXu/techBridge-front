import { Component, OnInit, ViewChild } from '@angular/core';
import { HelpRequestService } from '../../../help-requests/help-request.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpStatus, SessionMethods } from '../../../../shared/models/supportSession.model';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css'],
  imports: [CommonModule, FormsModule, ModalComponent]
})
export class RequestDetailComponent implements OnInit {
  @ViewChild(ModalComponent) confirmModal!: ModalComponent;

  constructor(private readonly helpRequestService: HelpRequestService,
    private readonly route:ActivatedRoute, private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  requestId:string = '';
  helpRequest:HelpRequest = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    senior: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'SENIOR'
    },
    title: '',
    description: '',
    status: RequestStatus.FINDING_VOLUNTEER,
    }; 
  statusConfig: any = {
    'OPEN': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
    'FINDING_VOLUNTEER': { color: '#0d6efd', icon: 'bi-person-check-fill', text: 'Encontrando voluntario' },
    'IN_PROGRESS': { color: '#ffc107', icon: 'bi-hourglass-split', text: 'En curso' },
    'COMPLETED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
    'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };
  currentView: 'TUTORIAL'|'MANAGE' = 'MANAGE';
  selectedSessionMethod: SessionMethods= SessionMethods.TELEPHONE;
  public SessionMethods = SessionMethods;
  public HelpStatus = HelpStatus; 
  public RequestStatus = RequestStatus;
  modalConfig = {
  title: '',
  message: '',
  type: 'info' as 'danger' | 'success' | 'info'
  };

  hasMethod(req: HelpRequest): boolean {
  let hasMethod = !!( req.supportSession?.sessionMethod && req.supportSession?.sessionMethod.trim() !== '');
  return hasMethod;
  }

  ngOnInit() {
    if(this.authService.getUserData()?.role!== 'VOLUNTEER' ){
      this.router.navigate(['/']);
    }
    this.requestId = this.route.snapshot.params['id'];

    this.helpRequestService.getById(this.requestId).subscribe({
      next: (data) => {
        console.log('Detalle de solicitud de ayuda obtenido:', data);
        this.helpRequest = data;
        this.selectedSessionMethod = this.helpRequest.senior.contactPreference as SessionMethods;
      },
      error: (err) => {
        console.error('Error al obtener el detalle de la solicitud de ayuda:', err);
      }
    });
    
  }

  saveSessionMethod() {
  throw new Error('Method not implemented.');
  }

  updateStatus(newStatus: RequestStatus) {
    this.helpRequestService.updateRequestStatus(this.requestId, newStatus).subscribe({
      next: (updatedRequest) => {
        console.log('Estado actualizado:', updatedRequest);
        this.helpRequest = updatedRequest;
        console.log('Estado actualizado en el componente:', this.helpRequest);
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
      }
    });
  }

  formatSeniorAddress(){
    if(this.helpRequest.senior){
      return [this.helpRequest.senior.province, this.helpRequest.senior.city, this.helpRequest.senior.postalCode]
        .filter((x): x is string => !!x)
        .join(', ');
    }
    return '';
  }

  goBack() {
    this.router.navigate(['/available-requests']);
  }

  handleCancel() {
    this.modalConfig = {
      title: '¿Deseas cancelar?',
      message: 'Esta acción liberará la petición para otros voluntarios.',
      type: 'danger'
    };
    this.confirmModal.show();
  }

}
