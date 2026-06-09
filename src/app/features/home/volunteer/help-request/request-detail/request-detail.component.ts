import { Component, OnInit, ViewChild } from '@angular/core';
import {
  HelpRequestService,
  SupportSessionService,
} from '../../../../shared/services/help-request.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule,Location } from '@angular/common';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import {
  HelpStatus,
  SessionMethods,
  sessionMethodTranslations,
} from '../../../../shared/models/supportSession.model';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { REQUEST_STATUS_CONFIG } from '../../../../shared/config/status-config';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css'],
  imports: [CommonModule, FormsModule, ModalComponent],
})
export class RequestDetailComponent implements OnInit {
  @ViewChild(ModalComponent) confirmModal!: ModalComponent;

  constructor(
    private readonly helpRequestService: HelpRequestService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly supportSessionService: SupportSessionService,
    private readonly location: Location,
    private readonly toastr: ToastrService
  ) {
    this.cameFrom = history.state?.cameFrom || 'available-requests';
  }

  requestId: string = '';
  helpRequest: HelpRequest = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    senior: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'SENIOR',
      active: false,
    },
    title: '',
    description: '',
    status: RequestStatus.FINDING_VOLUNTEER
  };
  meetUrl: string = '';
  statusConfig = REQUEST_STATUS_CONFIG;

  public sessionMethodTranslations = sessionMethodTranslations;
  currentView: 'TUTORIAL' | 'MANAGE' = 'MANAGE';
  selectedSessionMethod: SessionMethods = SessionMethods.TELEPHONE;
  public SessionMethods = SessionMethods;
  public HelpStatus = HelpStatus;
  public RequestStatus = RequestStatus;
  modalConfig = {
    title: '',
    message: '',
    type: 'info' as 'danger' | 'success' | 'info',
  };
  toastMessage: string = '';
  isNotesEditable: boolean = false;
  selectedFile: File | null = null;
  fileErrorMessage: string | null = null;
  volunteerNotes: string = this.helpRequest.supportSession?.volunteerNotes || '';
  cameFrom: string = '';
  volunteerReachedIngProgressLimit: boolean = false;

  hasMethod(req: HelpRequest): boolean {
    let hasMethod = !!(
      req.supportSession?.sessionMethod && req.supportSession?.sessionMethod.trim() !== ''
    );
    return hasMethod;
  }

  ngOnInit() {
    if (this.authService.getUserData()?.role !== 'VOLUNTEER') {
      this.router.navigate(['/']);
    }
    this.requestId = this.route.snapshot.params['id'];

    this.helpRequestService.getById(this.requestId).subscribe({
      next: (data) => {
        this.helpRequest = data;
        this.selectedSessionMethod = this.helpRequest.senior.contactPreference as SessionMethods;
        this.volunteerNotes = this.helpRequest.supportSession?.volunteerNotes || '';

        this.helpRequestService.checkVolunteerInProgressRequests().subscribe({
          next: (hasInProgress) => {
            this.volunteerReachedIngProgressLimit = hasInProgress;
          },
          error: (err) => {
            console.error('Error al verificar solicitudes en curso del voluntario:', err);
          } 
          });
      },
      error: (err) => {
        console.error('Error al obtener el detalle de la solicitud de ayuda:', err);
      },
    });
  }

  updateStatus(newStatus: RequestStatus) {
    this.helpRequestService.updateRequestStatus(this.requestId, newStatus).subscribe({
      next: (updatedRequest) => {
        this.helpRequest = updatedRequest;
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
      },
    });
  }

  formatSeniorAddress() {
    if (this.helpRequest.senior) {
      return [
        this.helpRequest.senior.province,
        this.helpRequest.senior.city,
        this.helpRequest.senior.postalCode,
      ]
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
    this.supportSessionService
      .updateSupportSession(this.helpRequest.supportSession.id!, {
        sessionMethod: this.selectedSessionMethod,
      })
      .subscribe({
        next: (updatedSession) => {
          if (this.helpRequest.supportSession) {
            this.helpRequest.supportSession = updatedSession;
          }
        },
        error: (err) => {
          console.error('Error al actualizar el método de sesión:', err);
        },
      });
  }

  saveNotes() {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }

    this.supportSessionService
      .updateSupportSession(this.helpRequest.supportSession.id!, {
        volunteerNotes: this.volunteerNotes,
      })
      .subscribe({
        next: (updatedSession) => {
          if (this.helpRequest.supportSession) {
            this.helpRequest.supportSession = updatedSession;
            this.volunteerNotes = updatedSession.volunteerNotes || '';
            this.isNotesEditable = false;
          }
        },
        error: (err) => {
          console.error('Error al actualizar las notas de voluntario:', err);
        },
      });
  }

  saveRecordingConsent(consent: boolean) {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }

    this.supportSessionService
      .updateSupportSession(this.helpRequest.supportSession.id!, { recordingConsent: consent })
      .subscribe({
        next: (updatedSession) => {
          if (this.helpRequest.supportSession) {
            this.helpRequest.supportSession = updatedSession;
          }
        },
        error: (err) => {
          console.error('Error al actualizar el consentimiento de grabación:', err);
        },
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileErrorMessage = null;
    this.selectedFile = null;

    if (file) {
      // Validar Tamaño (ejemplo 25MB = 25 * 1024 * 1024 bytes)
      const maxSize = 25 * 1024 * 1024;

      // Validar Tipos (MIME Types)
      const allowedTypes = [
        'application/pdf',
        'audio/mpeg',
        'video/mp4',
        'video/quicktime',
        'image/jpeg',
        'image/png',
      ];

      if (!allowedTypes.includes(file.type)) {
        this.fileErrorMessage = 'Formato no permitido. Usa PDF, MP3, imagen o Video.';
        return;
      }

      if (file.size > maxSize) {
        this.fileErrorMessage = 'El archivo es demasiado grande (Máx. 25MB).';
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

    this.supportSessionService.uploadResource(url, this.selectedFile!).subscribe({
      next: () => {
        if (this.helpRequest.supportSession) {
          this.helpRequest.supportSession.s3RecordingUrl = url;
          this.toastr.success('Recurso subido exitosamente.', '¡Completado!');
        }
      },
      error: (err) => {
        console.error('Error al actualizar la URL de grabación:', err);
        this.toastr.error('Error al subir el recurso. Inténtalo más tarde.', 'Error');
      },
    });
  }

  downloadResource() {
    if (this.helpRequest.supportSession?.s3RecordingUrl) {
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.document.body.innerHTML = '<h2>Preparando la descarga...</h2>';
      } else {
        alert(
          'No se pudo abrir una nueva pestaña para descargar el recurso. Por favor, revisa tu configuración de ventanas emergentes.',
        );
        return;
      }

      this.supportSessionService.downloadResource(this.helpRequest.supportSession.id!).subscribe({
        next: (url) => {
          newTab.location.href = url;
        },
        error: (err) => {
          this.toastr.error('No se ha podido descargar el recurso, intentalo de nuevo.', 'Error');
          console.error('Error al descargar el recurso:', err);
        },
      });
    }
  }

  saveMeetingUrl(url: string) {
    if (!this.helpRequest.supportSession) {
      console.error('No hay una sesión de soporte asociada a esta solicitud de ayuda.');
      return;
    }
    this.supportSessionService
      .updateSupportSession(this.helpRequest.supportSession.id!, { meetingUrl: url })
      .subscribe({
        next: (updatedSession) => {
          if (this.helpRequest.supportSession) {
            this.helpRequest.supportSession = updatedSession;
          }
        },
        error: (err) => {
          console.error('Error al actualizar la URL de reunión:', err);
        },
      });
  }

  generateMeetLink() {
    const roomName = `TechBridge-${this.helpRequest.id.substring(0, 8)}`;
    this.meetUrl = `https://meet.jit.si/${roomName}`;

    this.saveMeetingUrl(this.meetUrl);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toastr.success('Enlace copiado al portapapeles.', '¡Copiado!');
  }

  goBack() {
    this.location.back();
  }

  handleCancel() {
    this.modalConfig = {
      title: '¿Deseas cancelar?',
      message: 'Esta acción liberará la petición para otros voluntarios.',
      type: 'danger',
    };
    this.confirmModal.show();
  }
}
