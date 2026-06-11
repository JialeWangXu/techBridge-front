import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { AuthService } from '../../../../../core/auth/auth.service';
import { ProfileService } from '../../../profile/profile.service';
import { HelpRequest, PageResponse, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { AvailableHelpRequestsComponent } from './available-help-requests.component';

describe('AvailableHelpRequestsComponent', () => {
  let component: AvailableHelpRequestsComponent;
  let fixture: ComponentFixture<AvailableHelpRequestsComponent>;
  let queryParamsSubject: BehaviorSubject<Params>;
  let helpRequestServiceSpy: jasmine.SpyObj<HelpRequestService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
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
      province: 'Madrid',
      city: 'Madrid',
    },
  };

  const pageResponse: PageResponse<HelpRequest> = {
    content: [request],
    totalPages: 3,
    totalElements: 1,
    size: 5,
    number: 1,
    first: true,
    last: false,
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Params>({});
    activatedRouteStub = { queryParams: queryParamsSubject.asObservable() } as ActivatedRoute;
    helpRequestServiceSpy = jasmine.createSpyObj<HelpRequestService>('HelpRequestService', [
      'getAllAvailable',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserData']);
    profileServiceSpy = jasmine.createSpyObj<ProfileService>('ProfileService', ['getProfile']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authServiceSpy.getUserData.and.returnValue({
      email: 'luis@example.com',
      firstname: 'Luis',
      role: 'VOLUNTEER',
    });
    helpRequestServiceSpy.getAllAvailable.and.returnValue(of(pageResponse));
    profileServiceSpy.getProfile.and.returnValue(
      of({
        firstName: 'Luis',
        lastName: 'Lopez',
        email: 'luis@example.com',
        role: 'VOLUNTEER',
        province: 'Madrid',
        city: 'Madrid',
      }),
    );

    await TestBed.configureTestingModule({
      imports: [AvailableHelpRequestsComponent],
      providers: [
        { provide: HelpRequestService, useValue: helpRequestServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(AvailableHelpRequestsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AvailableHelpRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch available requests using query params', () => {
    queryParamsSubject.next({
      contactPreference: 'TELEPHONE',
      search: 'móvil',
      onlyMyZone: 'true',
      page: '2',
    });

    expect(component.selectedMethod).toBe('TELEPHONE');
    expect(component.searchingText).toBe('móvil');
    expect(component.onlyMyZone).toBeTrue();
    expect(component.currentPage).toBe(2);
    expect(helpRequestServiceSpy.getAllAvailable).toHaveBeenCalledWith(
      'TELEPHONE',
      'Madrid',
      'Madrid',
      'móvil',
      2,
      5,
    );
    expect(component.availableHelpRequests).toEqual([request]);
    expect(component.totalPages).toBe(3);
  });

  it('should redirect non-volunteer users to home', () => {
    authServiceSpy.getUserData.and.returnValue({
      email: 'ana@example.com',
      firstname: 'Ana',
      role: 'SENIOR',
    });

    const localFixture = TestBed.createComponent(AvailableHelpRequestsComponent);
    localFixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should update query params when filters change', () => {
    component.selectedMethod = 'ONLINE_MEETING';
    component.searchingText = 'tablet';
    component.onlyMyZone = true;
    component.currentPage = 1;

    component.applyFilters();

    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        contactPreference: 'ONLINE_MEETING',
        search: 'tablet',
        onlyMyZone: 'true',
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should clear optional query params when filters are empty', () => {
    component.selectedMethod = 'ALL';
    component.searchingText = '';
    component.onlyMyZone = false;

    component.applyFilters();

    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: {
        contactPreference: null,
        search: null,
        onlyMyZone: null,
        page: component.currentPage,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle null backend response as an empty page', () => {
    helpRequestServiceSpy.getAllAvailable.and.returnValue(of(null as any));

    component.fetchFromBackend();

    expect(component.availableHelpRequests).toEqual([]);
    expect(component.totalPages).toBe(1);
    expect(component.isFirst).toBeTrue();
    expect(component.isLast).toBeTrue();
  });

  it('should navigate to detail with origin state', () => {
    component.goToDetail('request-1');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/request-detail', 'request-1'], {
      state: { cameFrom: 'available-requests' },
    });
  });

  it('should update page when pagination changes', () => {
    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
