import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { HelpRequestCreateComponent } from './help-request-create.component';

describe('HelpRequestCreateComponent', () => {
  let component: HelpRequestCreateComponent;
  let fixture: ComponentFixture<HelpRequestCreateComponent>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const createdRequest: HelpRequest = {
    id: 'request-1',
    title: 'Ayuda con móvil',
    description: 'No puedo configurar WhatsApp',
    status: RequestStatus.OPEN,
    createdAt: new Date('2026-01-01T10:00:00'),
    updatedAt: new Date('2026-01-01T10:00:00'),
    senior: {
      firstName: 'Ana',
      lastName: 'Garcia',
      email: 'ana@example.com',
      role: 'SENIOR',
    },
  };

  beforeEach(async () => {
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'create',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });
    helpRequestServiceSpy.create.and.returnValue(of(createdRequest));

    await TestBed.configureTestingModule({
      imports: [HelpRequestCreateComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideComponent(HelpRequestCreateComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(HelpRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.errorModal = jasmine.createSpyObj('ModalComponent', ['show']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect non-senior users to home', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });

    const localFixture = TestBed.createComponent(HelpRequestCreateComponent);
    localFixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not create a request when the form is invalid', () => {
    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(helpRequestServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should create a help request and navigate to its detail', () => {
    component.helpRequestForm.setValue({
      title: 'Ayuda con móvil',
      description: 'No puedo configurar WhatsApp',
      status: RequestStatus.OPEN,
    });

    component.onSubmit();

    expect(helpRequestServiceSpy.create).toHaveBeenCalledOnceWith({
      title: 'Ayuda con móvil',
      description: 'No puedo configurar WhatsApp',
      status: RequestStatus.OPEN,
    });
    expect(component.isGenerating).toBeFalse();
    expect(component.submitted).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-requests', 'request-1']);
  });

  it('should show the error modal when create fails', () => {
    helpRequestServiceSpy.create.and.returnValue(throwError(() => new Error('backend error')));
    component.helpRequestForm.setValue({
      title: 'Ayuda con móvil',
      description: 'No puedo configurar WhatsApp',
      status: RequestStatus.OPEN,
    });

    component.onSubmit();

    expect(component.errorModal.show).toHaveBeenCalled();
    expect(component.isGenerating).toBeFalse();
    expect(component.submitted).toBeFalse();
  });

  it('should navigate home when cancelled', () => {
    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
