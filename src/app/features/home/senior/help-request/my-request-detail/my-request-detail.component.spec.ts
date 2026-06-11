import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpStatus, SessionMethods } from '../../../../shared/models/supportSession.model';
import {
  HelpRequestService,
  SupportSessionService,
} from '../../../../shared/services/help-request.service';
import { MyRequestDetailComponent } from './my-request-detail.component';

describe('MyRequestDetailComponent', () => {
  let component: MyRequestDetailComponent;
  let fixture: ComponentFixture<MyRequestDetailComponent>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let supportSessionServiceSpy: jasmine.SpyObj<SupportSessionService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const helpRequest: HelpRequest = {
    id: 'request-1',
    title: 'Ayuda con móvil',
    description: 'Descripción',
    status: RequestStatus.OPEN,
    createdAt: new Date('2026-01-01T10:00:00'),
    updatedAt: new Date('2026-01-01T10:00:00'),
    senior: {
      firstName: 'Ana',
      lastName: 'Garcia',
      email: 'ana@example.com',
      role: 'SENIOR',
    },
    volunteer: {
      firstName: 'Luis',
      lastName: 'Lopez',
      email: 'luis@example.com',
      role: 'VOLUNTEER',
      province: 'Madrid',
      city: 'Madrid',
      postalCode: 28001,
    },
    supportSession: {
      id: 'session-1',
      sessionMethod: SessionMethods.TELEPHONE,
      status: HelpStatus.ACTIVE,
      s3RecordingUrl: 's3://resource',
    },
  };

  beforeEach(async () => {
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'getById',
      'deleteById',
      'updateRequestStatus',
    ]);
    supportSessionServiceSpy = jasmine.createSpyObj<SupportSessionService>(
      'SupportSessionService',
      ['downloadResource'],
    );
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj<Location>('Location', ['back']);
    toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['success', 'error']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });
    helpRequestServiceSpy.getById.and.returnValue(of(helpRequest));
    helpRequestServiceSpy.deleteById.and.returnValue(of(void 0));
    helpRequestServiceSpy.updateRequestStatus.and.returnValue(
      of({ ...helpRequest, status: RequestStatus.CANCELLED }),
    );
    supportSessionServiceSpy.downloadResource.and.returnValue(of('https://download.example/file'));

    await TestBed.configureTestingModule({
      imports: [MyRequestDetailComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: SupportSessionService, useValue: supportSessionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'request-1' : null),
              },
            },
          },
        },
      ],
    })
      .overrideComponent(MyRequestDetailComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(MyRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.deleteModal = jasmine.createSpyObj('ModalComponent', ['show']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the request detail and user role', () => {
    expect(component.requestId).toBe('request-1');
    expect(component.role).toBe('SENIOR');
    expect(component.helpRequest).toEqual(helpRequest);
    expect(helpRequestServiceSpy.getById).toHaveBeenCalledWith('request-1');
  });

  it('should delete request and navigate to my requests', () => {
    component.deleteRequest();

    expect(helpRequestServiceSpy.deleteById).toHaveBeenCalledWith('request-1');
    expect(toastrSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-requests']);
  });

  it('should format volunteer address', () => {
    expect(component.formatVolunteerAddress()).toBe('Madrid, Madrid, 28001');
  });

  it('should return empty address when there is no volunteer', () => {
    component.helpRequest = { ...helpRequest, volunteer: undefined };

    expect(component.formatVolunteerAddress()).toBe('');
  });

  it('should update request status and switch to volunteer view', () => {
    component.updateRequestStatus(RequestStatus.CANCELLED);

    expect(helpRequestServiceSpy.updateRequestStatus).toHaveBeenCalledWith(
      'request-1',
      RequestStatus.CANCELLED,
    );
    expect(component.helpRequest.status).toBe(RequestStatus.CANCELLED);
    expect(component.currentView).toBe('VOLUNTEER');
  });

  it('should go back using browser location', () => {
    component.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should open delete confirmation modal', () => {
    component.handleDelete();

    expect(component.isDeleteModal).toBeTrue();
    expect(component.modalConfig.confirmText).toBe('Eliminar');
    expect(component.deleteModal.show).toHaveBeenCalled();
  });

  it('should open cancel confirmation modal', () => {
    component.handleCancel();

    expect(component.isDeleteModal).toBeFalse();
    expect(component.modalConfig.confirmText).toContain('Cancelar');
    expect(component.deleteModal.show).toHaveBeenCalled();
  });
});
