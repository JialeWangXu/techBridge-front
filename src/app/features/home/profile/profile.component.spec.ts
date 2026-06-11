import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { UserDto } from '../../shared/models/userDto.model';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const seniorProfile: UserDto = {
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana@example.com',
    telephone: '600123456',
    contactPreference: 'TELEPHONE',
    city: 'Madrid',
    province: 'Madrid',
    postalCode: 28001,
    role: 'SENIOR',
  };

  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj<ProfileService>('ProfileService', [
      'getProfile',
      'editProfile',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    profileServiceSpy.getProfile.and.returnValue(of(seniorProfile));
    profileServiceSpy.editProfile.and.returnValue(of(seniorProfile));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    })
      .overrideComponent(ProfileComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the profile and disable the form on init', () => {
    expect(profileServiceSpy.getProfile).toHaveBeenCalled();
    expect(component.userInfo).toEqual(seniorProfile);
    expect(component.profileForm.disabled).toBeTrue();
    expect(component.profileForm.controls.firstName.value).toBe('Ana');
  });

  it('should enable and disable edit mode', () => {
    component.toggleEdit();

    expect(component.editable).toBeTrue();
    expect(component.profileForm.enabled).toBeTrue();

    component.toggleEdit();

    expect(component.editable).toBeFalse();
    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should restore initial values when cancelling edition', () => {
    component.toggleEdit();
    component.profileForm.controls.firstName.setValue('Changed');

    component.toggleEdit();

    expect(component.profileForm.controls.firstName.value).toBe('Ana');
  });

  it('should manage volunteer specialties without duplicates', () => {
    component.loadSpecialties('Móviles, Ordenadores');
    component.newSpeciality = 'Móviles';
    component.addSpecialty();
    component.newSpeciality = 'Tablets';
    component.addSpecialty();

    expect(component.specialitiesList).toEqual(['Móviles', 'Ordenadores', 'Tablets']);
    expect(component.profileForm.controls.specialties.value).toBe('Móviles, Ordenadores, Tablets');

    component.removeSpecialty(1);

    expect(component.specialitiesList).toEqual(['Móviles', 'Tablets']);
    expect(component.profileForm.controls.specialties.value).toBe('Móviles, Tablets');
  });

  it('should save a valid senior profile', () => {
    component.toggleEdit();
    component.profileForm.patchValue({ firstName: 'Ana María' });
    profileServiceSpy.editProfile.and.returnValue(
      of({ ...seniorProfile, firstName: 'Ana María' }),
    );

    component.saveProfile();

    expect(profileServiceSpy.editProfile).toHaveBeenCalledWith(
      jasmine.objectContaining({ firstName: 'Ana María', role: 'SENIOR' }),
    );
    expect(component.userInfo.firstName).toBe('Ana María');
    expect(component.editable).toBeFalse();
  });

  it('should disable contact preference before saving volunteer profile', () => {
    const volunteerProfile: UserDto = {
      ...seniorProfile,
      role: 'VOLUNTEER',
      contactPreference: undefined,
      specialties: 'Móviles',
    };
    component.initialUserInfo = volunteerProfile;
    component.profileForm.patchValue(volunteerProfile);
    component.toggleEdit();
    profileServiceSpy.editProfile.and.returnValue(of(volunteerProfile));

    component.saveProfile();

    expect(component.profileForm.controls.contactPreference.disabled).toBeTrue();
    expect(profileServiceSpy.editProfile).toHaveBeenCalled();
  });
});
