import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BehaviorSubject, of } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, PageResponse, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpStatus } from '../../../../shared/models/supportSession.model';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { ListVolunteerHelpRequestsComponent } from './my-helps.component';

registerLocaleData(localeEs);

describe('ListVolunteerHelpRequestsComponent', () => {
  let component: ListVolunteerHelpRequestsComponent;
  let fixture: ComponentFixture<ListVolunteerHelpRequestsComponent>;
  let queryParamsSubject: BehaviorSubject<Params>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: ActivatedRoute;

  const request: HelpRequest = {
    id: 'request-1',
    title: 'Ayuda con móvil',
    description: 'Descripción',
    status: RequestStatus.IN_PROGRESS,
    createdAt: new Date('2026-01-01T10:00:00'),
    updatedAt: new Date('2026-01-01T11:00:00'),
    senior: {
      firstName: 'Ana',
      lastName: 'Garcia',
      email: 'ana@example.com',
      role: 'SENIOR',
    },
    supportSession: {
      id: 'session-1',
      status: HelpStatus.ACTIVE,
      createdAt: new Date('2026-01-01T10:30:00'),
    },
  };

  const pageResponse: PageResponse<HelpRequest> = {
    content: [request],
    totalPages: 2,
    totalElements: 1,
    size: 3,
    number: 1,
    first: true,
    last: false,
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Params>({});
    activatedRouteStub = { queryParams: queryParamsSubject.asObservable() } as ActivatedRoute;
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'getVolunteerFilteredHelpRequests',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });
    helpRequestServiceSpy.getVolunteerFilteredHelpRequests.and.returnValue(of(pageResponse));

    await TestBed.configureTestingModule({
      imports: [ListVolunteerHelpRequestsComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(ListVolunteerHelpRequestsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ListVolunteerHelpRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch volunteer requests using query params', () => {
    queryParamsSubject.next({ status: HelpStatus.FINISHED, page: '2' });

    expect(component.status).toBe(HelpStatus.FINISHED);
    expect(component.currentPage).toBe(2);
    expect(helpRequestServiceSpy.getVolunteerFilteredHelpRequests).toHaveBeenCalledWith(
      HelpStatus.FINISHED,
      2,
      3,
    );
    expect(component.helpRequests).toEqual([request]);
  });

  it('should redirect non-volunteer users to home', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });

    const localFixture = TestBed.createComponent(ListVolunteerHelpRequestsComponent);
    localFixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update status in the query params', () => {
    component.updateStatus(HelpStatus.CANCELLED);

    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        status: HelpStatus.CANCELLED,
        page: component.currentPage,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should update page through query params', () => {
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        status: component.status,
        page: 2,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should build request metadata lines for active support sessions', () => {
    const lines = component.getRequestMetaLines(request);

    expect(lines[0].text).toContain('Solicitante');
    expect(lines[1].text).toContain('Aceptado');
  });

  it('should navigate to request detail with origin state', () => {
    component.navigateToDetail('request-1');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/request-detail', 'request-1'], {
      state: { cameFrom: 'my-helps' },
    });
  });
});
