import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterService } from './register.service';
import { UserDto } from '../shared/models/userDto.model';
import { AuthService } from '../../core/auth/auth.service';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
})
export class RegisterComponent {
  rol: 'SENIOR' | 'VOLUNTEER' = 'SENIOR';
  submitted = false;
  matchError = false;
  userConsent: boolean = false;
  @ViewChild(ModalComponent) errorModal!: ModalComponent;
  constructor(
    private readonly registerService: RegisterService,
    public readonly authService: AuthService,
  ) {}

    modalConfig = {
    title: 'Error al registrar el usuario',
    message: 'Se ha intentado demasiadas veces. Inténtalo de nuevo más tarde.',
    type: 'danger' as 'danger' | 'success' | 'info',
    showCancel: false,
    confirmText: 'Aceptar'
  };

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      telephone: new FormControl('', [Validators.pattern('^[0-9]{9}$'), Validators.required]),
      contactPreference: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl(this.rol, [Validators.required]),
      privacyConsent: new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: passwordMatchValidator },
  );

  setRole = (rol: 'SENIOR' | 'VOLUNTEER') => {
    this.rol = rol;
    if (rol === 'VOLUNTEER') {
      this.registerForm.get('contactPreference')?.disable();
    } else {
      this.registerForm.get('contactPreference')?.enable();
      this.registerForm.get('contactPreference')?.setValidators(Validators.required);
    }
  };

  viewPrivacityPolicy() {
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.body.innerHTML = '<h2>Preparando la descarga...</h2>';
      newTab.location.href = "/privacy-consent.html";
    } else {
      alert(
        'No se pudo abrir una nueva pestaña para descargar la politíca de privacidad. Por favor, revisa tu configuración de ventanas emergentes.',
      );
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.hasError('passwordMismatch')) {
      this.matchError = true;
    } else {
      this.matchError = false;
    }
    if (this.registerForm.valid) {
      this.matchError = false;
      this.registerForm.get('confirmPassword')?.disable();

      const { confirmPassword, ...userData } = this.registerForm.getRawValue();
      const userDto = {
        ...userData,
        role: this.rol,
      } as UserDto;

      this.registerService.create(userDto).subscribe({
        next: (response) => {
          this.registerForm.reset();
          this.submitted = false;
          this.authService.login();
          this.modalConfig.title = `¡Casi listo, ${userData.firstName}!`; 
          this.modalConfig.message = `Para activar su cuenta, haz click en el email que te acabamos de enviar: ${userDto.email}. Vaya a su bandeja de entrada y siga las instrucciones para completar el proceso de registro.`;
          this.modalConfig.type = 'success';
          this.errorModal.show();
        },
        error: (e) => {
          console.error('Error al registrar el usuario', e);
          if(e.status === 409){
            this.modalConfig.message = 'El correo electrónico ya está registrado. Por favor, utiliza otro correo o inicia sesión.';
            this.errorModal.show();
          }else{
            this.modalConfig.message = 'Se ha intentado demasiadas veces. Inténtalo de nuevo más tarde.';
            this.errorModal.show();
          }
        },
      });
    } else {
      return;
    }
  }
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Si los campos aún no existen o están vacíos, no validamos
  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};
