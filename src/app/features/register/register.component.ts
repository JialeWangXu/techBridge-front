import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { UserDto } from '../shared/models/userDto.model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports:[ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {

  rol:'SENIOR'|'VOLUNTEER' = 'SENIOR';
  submitted = false;
  matchError = false;
  constructor(private readonly registerService: RegisterService, 
    private readonly router: Router,
    private readonly authService: AuthService) { }


  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telephone: new FormControl('', [Validators.pattern('^[0-9]{9}$')]),
    contactPreference: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl(this.rol, [Validators.required]),
    }, { validators: passwordMatchValidator });

    setRole=(rol:'SENIOR'|'VOLUNTEER')=>{
      this.rol = rol;
      if(rol === 'VOLUNTEER'){
        this.registerForm.get('contactPreference')?.disable();
      }else{
        this.registerForm.get('contactPreference')?.enable();
        this.registerForm.get('contactPreference')?.setValidators(Validators.required);
      }
    }

    onSubmit(){
      this.submitted = true;
      if(this.registerForm.hasError('passwordMismatch')){
        this.matchError = true;
      }else{
        this.matchError = false;
      }
      if(this.registerForm.valid){
        this.matchError = false;
        this.registerForm.get('confirmPassword')?.disable();

        const { confirmPassword, ...userData } = this.registerForm.getRawValue();
        const userDto = {
        ...userData,
        role: this.rol
        } as UserDto;

        console.log(userDto);

        this.registerService.create(userDto).subscribe({
          next:(response)=>{
            console.log('Usuario registrado con éxito', response);
            this.registerForm.reset();
            this.submitted = false;
            this.authService.login();
          },
          error:(e)=>{
            console.error('Error al registrar el usuario', e);
          }
        });
        console.log(this.registerForm.value);
      }else{
        return
      }
    };
}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Si los campos aún no existen o están vacíos, no validamos
  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};
