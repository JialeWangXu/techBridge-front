import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData', 'logout']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy.getUserData.and.returnValue({
      email: 'volunteer@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideComponent(MainLayoutComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read user role on init', () => {
    expect(component.userRole).toBe('VOLUNTEER');
  });

  it('should logout through auth service', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should navigate to the requested route', () => {
    component.navigateTo('/profile');

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/profile']);
  });
});
