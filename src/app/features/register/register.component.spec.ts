import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RegisterComponent } from './register.component';
import { RegisterService } from './register.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let queryParamsSubject: BehaviorSubject<Params>;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Params>({});
    registerServiceSpy = jasmine.createSpyObj<RegisterService>('RegisterService', ['create']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: RegisterService, useValue: registerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.infoModal = jasmine.createSpyObj('ModalComponent', ['show', 'close']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use senior role by default when the URL has no rol query param', () => {
    expect(component.rol).toBe('SENIOR');
    expect(component.registerForm.controls.role.value).toBe('SENIOR');
    expect(component.registerForm.controls.contactPreference.enabled).toBeTrue();
    expect(component.registerForm.controls.contactPreference.hasError('required')).toBeTrue();
  });

  it('should apply volunteer role when the URL contains rol=VOLUNTEER', () => {
    queryParamsSubject.next({ rol: 'VOLUNTEER' });

    expect(component.rol).toBe('VOLUNTEER');
    expect(component.registerForm.controls.role.value).toBe('VOLUNTEER');
    expect(component.registerForm.controls.contactPreference.disabled).toBeTrue();
  });

  it('should apply senior role when the URL contains rol=SENIOR after being volunteer', () => {
    queryParamsSubject.next({ rol: 'VOLUNTEER' });
    queryParamsSubject.next({ rol: 'SENIOR' });

    expect(component.rol).toBe('SENIOR');
    expect(component.registerForm.controls.role.value).toBe('SENIOR');
    expect(component.registerForm.controls.contactPreference.enabled).toBeTrue();
  });

  it('should update the rol query param when changing role from the UI', () => {
    component.setRole('VOLUNTEER');

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { rol: 'VOLUNTEER' },
      queryParamsHandling: 'merge',
    });
  });

  it('should mark password mismatch and avoid calling the service', () => {
    fillValidSeniorForm();
    component.registerForm.controls.confirmPassword.setValue('different-password');

    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(component.matchError).toBeTrue();
    expect(registerServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should not call the service when privacy consent is missing', () => {
    fillValidSeniorForm();
    component.registerForm.controls.privacyConsent.setValue(false);

    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(component.registerForm.controls.privacyConsent.invalid).toBeTrue();
    expect(registerServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should send senior registration data without confirmPassword', () => {
    registerServiceSpy.create.and.returnValue(of(void 0));
    queryParamsSubject.next({ rol: 'SENIOR' });
    fillValidSeniorForm();

    component.onSubmit();

    expect(registerServiceSpy.create).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana@example.com',
        password: 'secret123',
        telephone: '600123456',
        contactPreference: 'TELEPHONE',
        role: 'SENIOR',
        privacyConsent: true,
      }),
    );
    expect(registerServiceSpy.create.calls.mostRecent().args[0]).not.toEqual(
      jasmine.objectContaining({ confirmPassword: jasmine.anything() }),
    );
    expect(component.submitted).toBeFalse();
    expect(component.modalConfig.type).toBe('success');
    expect(component.infoModal.show).toHaveBeenCalled();
  });

  it('should send volunteer registration data when URL role is volunteer', () => {
    registerServiceSpy.create.and.returnValue(of(void 0));
    queryParamsSubject.next({ rol: 'VOLUNTEER' });
    fillValidVolunteerForm();

    component.onSubmit();

    expect(registerServiceSpy.create).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        firstName: 'Luis',
        lastName: 'Lopez',
        email: 'luis@example.com',
        password: 'secret123',
        telephone: '611123456',
        role: 'VOLUNTEER',
        privacyConsent: true,
      }),
    );
    expect(registerServiceSpy.create.calls.mostRecent().args[0]).not.toEqual(
      jasmine.objectContaining({ confirmPassword: jasmine.anything() }),
    );
  });

  it('should show duplicated email message when the backend returns conflict', () => {
    registerServiceSpy.create.and.returnValue(throwError(() => ({ status: 409 })));
    fillValidSeniorForm();

    component.onSubmit();

    expect(component.modalConfig.message).toContain('correo');
    expect(component.infoModal.show).toHaveBeenCalled();
  });

  it('should show generic error message for non-conflict backend errors', () => {
    registerServiceSpy.create.and.returnValue(throwError(() => ({ status: 500 })));
    fillValidSeniorForm();

    component.onSubmit();

    expect(component.modalConfig.message).toContain('demasiadas veces');
    expect(component.infoModal.show).toHaveBeenCalled();
  });

  function fillValidSeniorForm(): void {
    component.registerForm.setValue({
      firstName: 'Ana',
      lastName: 'Garcia',
      email: 'ana@example.com',
      password: 'secret123',
      telephone: '600123456',
      contactPreference: 'TELEPHONE',
      confirmPassword: 'secret123',
      role: 'SENIOR',
      privacyConsent: true,
    });
  }

  function fillValidVolunteerForm(): void {
    component.registerForm.patchValue({
      firstName: 'Luis',
      lastName: 'Lopez',
      email: 'luis@example.com',
      password: 'secret123',
      telephone: '611123456',
      confirmPassword: 'secret123',
      role: 'VOLUNTEER',
      privacyConsent: true,
    });
  }
});
