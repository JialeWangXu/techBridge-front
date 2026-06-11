import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AiTutorialService } from '../shared/services/ai-tutorial.service';
import { HelpRequestService } from '../shared/services/help-request.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let aiTutorialServiceSpy: jasmine.SpyObj<AiTutorialService>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    aiTutorialServiceSpy = jasmine.createSpyObj<AiTutorialService>('AiTutorialService', [
      'aiLimitCheck',
    ]);
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'countVolunteerInProgressRequest',
    ]);

    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });
    aiTutorialServiceSpy.aiLimitCheck.and.returnValue(
      of({ globalLimitReached: false, userLimitRemaining: 2 }),
    );
    helpRequestServiceSpy.countVolunteerInProgressRequest.and.returnValue(of(0));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AiTutorialService, useValue: aiTutorialServiceSpy },
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
      ],
    })
      .overrideComponent(HomeComponent, { set: { template: '' } })
      .compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should load senior user data and AI limit information', () => {
    createComponent();

    expect(component.userRole).toBe('SENIOR');
    expect(component.userEmail).toBe('ana@example.com');
    expect(component.userName).toBe('Ana');
    expect(component.userAiLimitRemaining).toBe(2);
    expect(component.globalAiLimitReached).toBeFalse();
    expect(aiTutorialServiceSpy.aiLimitCheck).toHaveBeenCalled();
  });

  it('should load volunteer in-progress request count for volunteer users', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });
    helpRequestServiceSpy.countVolunteerInProgressRequest.and.returnValue(of(3));

    createComponent();

    expect(component.userRole).toBe('VOLUNTEER');
    expect(component.volunteerInProgressRequestCount).toBe(3);
    expect(helpRequestServiceSpy.countVolunteerInProgressRequest).toHaveBeenCalled();
    expect(aiTutorialServiceSpy.aiLimitCheck).not.toHaveBeenCalled();
  });

  it('should show senior warning when global AI limit is reached', () => {
    createComponent();
    component.globalAiLimitReached = true;

    expect(component.showLimitWarning()).toBeTrue();
    expect(component.limitWarningTitle).toContain('practicar');
  });

  it('should show volunteer warning when there are in-progress requests', () => {
    createComponent();
    component.userRole = 'VOLUNTEER';
    component.volunteerInProgressRequestCount = 1;

    expect(component.showLimitWarning()).toBeTrue();
    expect(component.limitWarningTitle).toContain('1 solicitud');
  });

  it('should navigate to the requested route', () => {
    createComponent();

    component.navigateTo('profile');

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['profile']);
  });

  it('should keep default data when user data is missing', () => {
    authServiceSpy.getUserData.and.returnValue(null);
    aiTutorialServiceSpy.aiLimitCheck.and.returnValue(
      throwError(() => new Error('backend unavailable')),
    );

    createComponent();

    expect(component.userRole).toBe('');
    expect(component.userName).toBe('');
  });
});
