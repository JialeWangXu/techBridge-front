import { Component, OnInit, ViewChild } from '@angular/core';
import { HelpRequestService, SupportSessionService } from '../../../help-requests/help-request.service';
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
    private readonly router: Router,
    private readonly supportSessionService: SupportSessionService
  ) {
      this.cameFrom = history.state?.cameFrom || 'available-requests';
      console.log('Came from:', this.cameFrom);
  }

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
  meetUrl: string = '';  
  statusConfig: any = {
    'OPEN': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
    'FINDING_VOLUNTEER': { color: '#0d6efd', icon: 'bi-person-check-fill', text: 'Encontrando voluntario' },
    'IN_PROGRESS': { color: '#ffc107', icon: 'bi-hourglass-split', text: 'En curso' },
    'COMPLETED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
    'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };

  sessionMethodTranslations: any ={
    'TELEPHONE': 'Teléfono',
    'ONLINE_MEETING': 'Reunión online',
    'IN_PERSON': 'Presencial'
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
  isNotesEditable: boolean = false;
  selectedFile: File | null = null;
  fileErrorMessage: string | null = null;
  volunteerNotes: string = this.helpRequest.supportSession?.volunteerNotes || '';
  cameFrom:string = '';

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
        this.volunteerNotes = this.helpRequest.supportSession?.volunteerNotes || '';
      },
      error: (err) => {
        console.error('Error al obtener el detalle de la solicitud de ayuda:', err);
      }
    });
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

  saveSessionMethod() {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }
    this.supportSessionService.updateSupportSession(this.helpRequest.supportSession.id!, { sessionMethod: this.selectedSessionMethod }).subscribe({
      next: (updatedSession) => {
        console.log('Método de sesión actualizado:', updatedSession);
        if (this.helpRequest.supportSession) {
          console.log('Actualizando el método de sesión en la solicitud de ayuda...', this.helpRequest.supportSession);
          this.helpRequest.supportSession = updatedSession;
        }
      },
      error: (err) => {
        console.error('Error al actualizar el método de sesión:', err);
      }
    });
  }

  saveNotes() {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }

    this.supportSessionService.updateSupportSession(this.helpRequest.supportSession.id!, { volunteerNotes: this.volunteerNotes }).subscribe({
      next: (updatedSession) => {
        console.log('Notas de voluntario actualizadas:', updatedSession);   
        if (this.helpRequest.supportSession) {
          console.log('Actualizando las notas de voluntario en la solicitud de ayuda...', this.helpRequest.supportSession);
          this.helpRequest.supportSession = updatedSession;
          this.volunteerNotes = updatedSession.volunteerNotes || '';
          this.isNotesEditable = false;
        }
      },error: (err) => {
        console.error('Error al actualizar las notas de voluntario:', err);
      }
    });   
  }

  saveRecordingConsent(consent: boolean) {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }

    this.supportSessionService.updateSupportSession(this.helpRequest.supportSession.id!, { recordingConsent: consent }).subscribe({
      next: (updatedSession) => {
        console.log('Consentimiento de grabación actualizado:', updatedSession);  
        if (this.helpRequest.supportSession) {
          console.log('Actualizando el consentimiento de grabación en la solicitud de ayuda...', this.helpRequest.supportSession);
          this.helpRequest.supportSession = updatedSession;
        } 
      },
      error: (err) => {
        console.error('Error al actualizar el consentimiento de grabación:', err);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileErrorMessage = null;
    this.selectedFile = null;

    if (file) {
      // Validar Tamaño (ejemplo 10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      
      // Validar Tipos (MIME Types)
      const allowedTypes = ['application/pdf', 'audio/mpeg', 'video/mp4', 'video/quicktime'];

      if (!allowedTypes.includes(file.type)) {
        this.fileErrorMessage = 'Formato no permitido. Usa PDF, MP3 o Video.';
        return;
      }

      if (file.size > maxSize) {
        this.fileErrorMessage = 'El archivo es demasiado grande (Máx. 10MB).';
        return;
      }

      // Si pasa las validaciones
      this.selectedFile = file;
    }
  } 

  saveRecordingUrl(url: string) {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }

    this.supportSessionService.updateSupportSession(this.helpRequest.supportSession.id!, { s3RecordingUrl: url }).subscribe({
      next: (updatedSession) => {
        console.log('URL de grabación actualizado:', updatedSession);
        if (this.helpRequest.supportSession) {
          console.log('Actualizando la URL de grabación en la solicitud de ayuda...', this.helpRequest.supportSession);
          this.helpRequest.supportSession = updatedSession;
        } 
      },
      error: (err) => {
        console.error('Error al actualizar la URL de grabación:', err);
      }
    });
  }

  saveMeetingUrl(url: string) {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }
    this.supportSessionService.updateSupportSession(this.helpRequest.supportSession.id!, { meetingUrl: url }).subscribe({
      next: (updatedSession) => {
        console.log('URL de reunión actualizado:', updatedSession);
        if (this.helpRequest.supportSession) {
          console.log('Actualizando la URL de reunión en la solicitud de ayuda...', this.helpRequest.supportSession);
          this.helpRequest.supportSession = updatedSession;
        } 
      },
      error: (err) => {
        console.error('Error al actualizar la URL de reunión:', err);
      }
    });
  }

  generateMeetLink() {
    const roomName = `TechBridge-${this.helpRequest.id.substring(0, 8)}`;
    this.meetUrl = `https://meet.jit.si/${roomName}`;
  
    this.saveMeetingUrl(this.meetUrl);
  
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('¡Enlace copiado al portapapeles!');
  }

  goBack() {
    if(this.cameFrom === 'my-helps'){
      this.router.navigate(['/my-helps']);
    }else if(this.cameFrom === 'available-requests'){
      this.router.navigate(['/available-requests']);
    }
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
