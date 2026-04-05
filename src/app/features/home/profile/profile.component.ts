import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../shared/models/userDto.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from './profile.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PROVINCES } from '../../shared/models/provinces.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule,FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {

  userInfo: UserDto ={
    firstName: '',
    lastName: '',
    email: '',
    role: 'SENIOR'
  };
  initialUserInfo: UserDto ={
    firstName: '',
    lastName: '',
    email: '',
    role: 'SENIOR'
  };
  editable:boolean = false;
  submitted:boolean = false;
  provinces = PROVINCES;

  specialitiesList: string[] = [];
  newSpeciality: string = '';

  loadSpecialties(specialtiesString: string) {
    if (specialtiesString) {
      this.specialitiesList = specialtiesString.split(',').map(s => s.trim());
    }
  }

  addSpecialty() {
    const val = this.newSpeciality.trim();
    if (val && !this.specialitiesList.includes(val)) {
      this.specialitiesList.push(val);
      this.newSpeciality = '';
      this.updateSpecialtiesControl();
    }
  }

  removeSpecialty(index: number) {
    this.specialitiesList.splice(index, 1);
    this.updateSpecialtiesControl();
  }

  private updateSpecialtiesControl() {
    // Convertimos la lista de vuelta a un String para el formulario
    this.profileForm.get('specialties')?.setValue(this.specialitiesList.join(', '));
  }

  profileForm = new FormGroup({
    firstName: new FormControl(this.userInfo.firstName, [Validators.required]),
    lastName: new FormControl(this.userInfo.lastName, [Validators.required]),
    telephone: new FormControl(this.userInfo.telephone, [Validators.pattern('^[0-9]{9}$')]),
    contactPreference: new FormControl(this.userInfo.contactPreference, [Validators.required]),
    address: new FormControl(this.userInfo.address),
    city: new FormControl(this.userInfo.city),
    province: new FormControl(this.userInfo.province),
    postalCode: new FormControl(this.userInfo.postalCode, [Validators.pattern('^[0-9]{5}$')]),
    specialties: new FormControl(this.userInfo.specialties),
    role: new FormControl(this.userInfo.role)
  });

  toggleEdit(){
    if(this.editable && !this.submitted){
      this.profileForm.patchValue({
        firstName: this.initialUserInfo.firstName,
        lastName: this.initialUserInfo.lastName,
        telephone: this.initialUserInfo.telephone,
        contactPreference: this.initialUserInfo.contactPreference,
        address: this.initialUserInfo.address,
        city: this.initialUserInfo.city,
        province: this.initialUserInfo.province,
        postalCode: this.initialUserInfo.postalCode,
        specialties: this.initialUserInfo.specialties,
        role: this.initialUserInfo.role
      });
      this.loadSpecialties(this.initialUserInfo.specialties || '');
    }
    this.editable = !this.editable;
    if(this.editable){
      this.profileForm.enable();
    }else{
      this.profileForm.disable();
    }
  }

  saveProfile() {
    if(this.initialUserInfo.role === 'VOLUNTEER'){
      this.profileForm.get('contactPreference')?.disable();
    }else{
      this.profileForm.get('contactPreference')?.enable();
      this.profileForm.get('contactPreference')?.setValidators(Validators.required);
    }
    if (this.profileForm.valid) {
      let updatedUser = this.profileForm.getRawValue();
      this.submitted = true;
      console.log('Guardando cambios...', updatedUser);
      this.profileService.editProfile(updatedUser as UserDto).subscribe((response) => {
        console.log('Perfil actualizado:', response);
        this.userInfo = response;
        this.initialUserInfo = response;
        this.toggleEdit();
        console.log('Perfil actualizado y editado:', this.editable);
      });
    }
  }

  constructor(private readonly profileService: ProfileService, private readonly authService: AuthService) { }

  ngOnInit() {
    this.profileService.getProfile().subscribe((user) => {
      this.userInfo = user;
      this.initialUserInfo = user;
      console.log('Perfil cargado:', this.userInfo);
      this.profileForm.patchValue({
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        telephone: this.userInfo.telephone,
        contactPreference: this.userInfo.contactPreference,
        address: this.userInfo.address,
        city: this.userInfo.city,
        province: this.userInfo.province,
        postalCode: this.userInfo.postalCode,
        specialties: this.userInfo.specialties,
        role: this.userInfo.role
      });
      this.loadSpecialties(this.userInfo.specialties || '');
      this.profileForm.disable();   
    });
  }

}
