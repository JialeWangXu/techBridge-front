import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpStatus, SessionMethods, SupportSession } from '../../../../shared/models/supportSession.model';
import {
  HelpRequestService,
  SupportSessionService,
} from '../../../../shared/services/help-request.service';
import { RequestDetailComponent } from './request-detail.component';

describe('RequestDetailComponent', () => {
  let component: RequestDetailComponent;
  let fixture: ComponentFixture<RequestDetailComponent>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let supportSessionServiceSpy: jasmine.SpyObj<SupportSessionService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const supportSession: SupportSession = {
    id: 'session-1',
    sessionMethod: SessionMethods.TELEPHONE,
    status: HelpStatus.ACTIVE,
    volunteerNotes: 'Initial notes',
    s3RecordingUrl: 's3://resource',
  };

  function createHelpRequest(): HelpRequest {
    return {
      id: 'request-12345678',
      title: 'Ayuda con móvil',
      description: 'Descripción',
      status: RequestStatus.IN_PROGRESS,
      createdAt: new Date('2026-01-01T10:00:00'),
      updatedAt: new Date('2026-01-01T10:00:00'),
      senior: {
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana@example.com',
        role: 'SENIOR',
        contactPreference: SessionMethods.ONLINE_MEETING,
        province: 'Madrid',
        city: 'Madrid',
        postalCode: 28001,
      },
      supportSession: { ...supportSession },
    };
  }

  beforeEach(async () => {
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'getById',
      'updateRequestStatus',
      'checkVolunteerInProgressRequests',
    ]);
    supportSessionServiceSpy = jasmine.createSpyObj<SupportSessionService>(
      'SupportSessionService',
      ['updateSupportSession', 'uploadResource', 'downloadResource'],
    );
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj<Location>('Location', ['back']);
    toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['success', 'error']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });
    helpRequestServiceSpy.getById.and.returnValue(of(createHelpRequest()));
    helpRequestServiceSpy.checkVolunteerInProgressRequests.and.returnValue(of(false));
    helpRequestServiceSpy.updateRequestStatus.and.returnValue(
      of({ ...createHelpRequest(), status: RequestStatus.CANCELLED }),
    );
    supportSessionServiceSpy.updateSupportSession.and.returnValue(
      of({ ...supportSession, volunteerNotes: 'Updated notes' }),
    );
    supportSessionServiceSpy.uploadResource.and.returnValue(of(void 0));
    supportSessionServiceSpy.downloadResource.and.returnValue(of('https://download.example/file'));

    await TestBed.configureTestingModule({
      imports: [RequestDetailComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: SupportSessionService, useValue: supportSessionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'request-12345678' } } } },
      ],
    })
      .overrideComponent(RequestDetailComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(RequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.confirmModal = jasmine.createSpyObj('ModalComponent', ['show']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load request detail and volunteer progress state', () => {
    expect(component.requestId).toBe('request-12345678');
    expect(component.helpRequest).toEqual(createHelpRequest());
    expect(component.selectedSessionMethod).toBe(SessionMethods.ONLINE_MEETING);
    expect(component.volunteerNotes).toBe('Initial notes');
    expect(component.volunteerReachedIngProgressLimit).toBeFalse();
  });

  it('should redirect non-volunteer users to home', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });

    const localFixture = TestBed.createComponent(RequestDetailComponent);
    localFixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update request status', () => {
    component.updateStatus(RequestStatus.CANCELLED);

    expect(helpRequestServiceSpy.updateRequestStatus).toHaveBeenCalledWith(
      'request-12345678',
      RequestStatus.CANCELLED,
    );
    expect(component.helpRequest.status).toBe(RequestStatus.CANCELLED);
  });

  it('should format senior address', () => {
    expect(component.formatSeniorAddress()).toBe('Madrid, Madrid, 28001');
  });

  it('should save selected session method', () => {
    component.selectedSessionMethod = SessionMethods.IN_PERSON;

    component.saveSessionMethod();

    expect(supportSessionServiceSpy.updateSupportSession).toHaveBeenCalledWith('session-1', {
      sessionMethod: SessionMethods.IN_PERSON,
    });
  });

  it('should save volunteer notes and leave edit mode', () => {
    component.volunteerNotes = 'Updated notes';
    component.isNotesEditable = true;

    component.saveNotes();

    expect(supportSessionServiceSpy.updateSupportSession).toHaveBeenCalledWith('session-1', {
      volunteerNotes: 'Updated notes',
    });
    expect(component.volunteerNotes).toBe('Updated notes');
    expect(component.isNotesEditable).toBeFalse();
  });

  it('should validate selected files', () => {
    const validFile = new File(['content'], 'notes.pdf', { type: 'application/pdf' });

    component.onFileSelected({ target: { files: [validFile] } });

    expect(component.selectedFile).toBe(validFile);
    expect(component.fileErrorMessage).toBeNull();
  });

  it('should reject unsupported files', () => {
    const invalidFile = new File(['content'], 'notes.exe', { type: 'application/x-msdownload' });

    component.onFileSelected({ target: { files: [invalidFile] } });

    expect(component.selectedFile).toBeNull();
    expect(component.fileErrorMessage).toContain('Formato no permitido');
  });

  it('should generate and save a meeting link', () => {
    component.generateMeetLink();

    expect(component.meetUrl).toBe('https://meet.jit.si/TechBridge-request-');
    expect(supportSessionServiceSpy.updateSupportSession).toHaveBeenCalledWith('session-1', {
      meetingUrl: 'https://meet.jit.si/TechBridge-request-',
    });
  });

  it('should upload selected resource and show success toast', () => {
    component.selectedFile = new File(['content'], 'notes.pdf', { type: 'application/pdf' });

    component.saveRecordingUrl('session-1');

    expect(supportSessionServiceSpy.uploadResource).toHaveBeenCalledWith(
      'session-1',
      component.selectedFile,
    );
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('should go back using browser location', () => {
    component.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should open cancel confirmation modal', () => {
    component.handleCancel();

    expect(component.modalConfig.type).toBe('danger');
    expect(component.confirmModal.show).toHaveBeenCalled();
  });
});
