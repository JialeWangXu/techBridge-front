import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BehaviorSubject, of } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest, PageResponse, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { ListSeniorHelpRequestsComponent } from './my-requests.component';

registerLocaleData(localeEs);

describe('ListSeniorHelpRequestsComponent', () => {
  let component: ListSeniorHelpRequestsComponent;
  let fixture: ComponentFixture<ListSeniorHelpRequestsComponent>;
  let queryParamsSubject: BehaviorSubject<Params>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: ActivatedRoute;

  const request: HelpRequest = {
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
      'getSeniorFilteredHelpRequests',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });
    helpRequestServiceSpy.getSeniorFilteredHelpRequests.and.returnValue(of(pageResponse));

    await TestBed.configureTestingModule({
      imports: [ListSeniorHelpRequestsComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(ListSeniorHelpRequestsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ListSeniorHelpRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch senior requests using query params', () => {
    queryParamsSubject.next({
      category: 'AI_ONLY',
      status: RequestStatus.COMPLETED,
      page: '2',
    });

    expect(component.category).toBe('AI_ONLY');
    expect(component.status).toBe(RequestStatus.COMPLETED);
    expect(component.currentPage).toBe(2);
    expect(helpRequestServiceSpy.getSeniorFilteredHelpRequests).toHaveBeenCalledWith(
      RequestStatus.COMPLETED,
      'AI_ONLY',
      2,
      3,
    );
    expect(component.helpRequests).toEqual([request]);
    expect(component.totalPages).toBe(2);
  });

  it('should redirect non-senior users to home', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });

    const localFixture = TestBed.createComponent(ListSeniorHelpRequestsComponent);
    localFixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update filters and reset page by default', () => {
    component.currentPage = 3;

    component.updateCategoryOrStatus('VOLUNTEER', RequestStatus.IN_PROGRESS);

    expect(component.currentPage).toBe(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        category: 'VOLUNTEER',
        status: RequestStatus.IN_PROGRESS,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should preserve page when page changes', () => {
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        category: component.category,
        status: component.status,
        page: 2,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should navigate to request detail', () => {
    component.navigateToDetail('request-1');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-requests', 'request-1']);
  });

  it('should build request metadata lines', () => {
    const lines = component.getRequestMetaLines(request);

    expect(lines[0].icon).toBe('bi-clock');
    expect(lines[0].text).toContain('Publicado');
  });
});
