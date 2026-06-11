import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpRequest } from '../../../../shared/models/helpRequest.model';
import { Router,ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../profile/profile.service';
import { PagenationComponent } from "../../../../../shared/pagenation/pagenation.component";
import { PageHeaderComponent } from '../../../../../shared/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../../shared/empty-state/empty-state.component';
import { sessionMethodTranslations } from '../../../../shared/models/supportSession.model';

@Component({
  selector: 'app-available-help-requests',
  templateUrl: './available-help-requests.component.html',
  styleUrls: ['./available-help-requests.component.css'],
  imports:[CommonModule, PagenationComponent, PageHeaderComponent, EmptyStateComponent]
})
export class AvailableHelpRequestsComponent implements OnInit {

  constructor( private readonly helpRequestService: HelpRequestService
    , private readonly authService: AuthService, private readonly router:Router,
    private readonly profileService: ProfileService,
    private readonly route: ActivatedRoute
  ) { }

  availableHelpRequests:HelpRequest[] = []; 

  selectedMethod: 'ALL' | 'TELEPHONE' | 'ONLINE_MEETING' | 'IN_PERSON' = 'ALL';
  onlyMyZone: boolean = false;
  searchingText: string = '';

  volunteerProvince: string|undefined = undefined;
  volunteerCity: string|undefined = undefined;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isFirst: boolean = false;
  isLast: boolean = false;

  public sessionMethodTranslations = sessionMethodTranslations;

  onMethodChange(event: any) {
    this.selectedMethod = event.target.value;
    this.applyFilters();
  }

  toggleMyZone(event: any) {
    this.onlyMyZone = event.target.checked;
    this.applyFilters();
  }

  onSearchTextChange(event: any) {
    this.searchingText = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
    // Actualizamos la URL del navegador de Angular con Router.navigate
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        contactPreference: this.selectedMethod === "ALL" ? null : this.selectedMethod,
        search: this.searchingText ? this.searchingText : null,
        onlyMyZone: this.onlyMyZone ? 'true' : null,
        page: this.currentPage
      },
      queryParamsHandling: 'merge' // Mantiene otros parámetros si existieran
    });
  }

  fetchFromBackend() {
    let method = this.selectedMethod&& this.selectedMethod !== 'ALL' ? this.selectedMethod : '';
    let province = this.onlyMyZone && this.volunteerProvince ? this.volunteerProvince : '';
    let city = this.onlyMyZone && this.volunteerCity ? this.volunteerCity : '';

    this.helpRequestService.getAllAvailable(method, province, city, this.searchingText, this.currentPage, this.pageSize).subscribe((requests) => {
      if(requests===null){
        this.availableHelpRequests = [];
        this.totalPages = 1;
        this.isFirst = true;
        this.isLast = true;
      }else{
        this.availableHelpRequests = requests.content;
        this.totalPages = requests.totalPages;
        this.isFirst = requests.first;
        this.isLast = requests.last;
      }
    }
    );
  }

  goToDetail(id: string) {
    this.router.navigate(['/request-detail', id], {state:{cameFrom:'available-requests'}});
  }

  ngOnInit() {
    if(this.authService.getUserData()?.role !== 'VOLUNTEER'){
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(params => {
      this.selectedMethod = params['contactPreference'] || 'ALL';
      this.searchingText = params['search'] || '';
      this.onlyMyZone = params['onlyMyZone'] === 'true'; // Vienen como string
      this.currentPage = params['page'] ? Number(params['page']) : 1;

      this.fetchFromBackend();
    });
    this.applyFilters();
    this.profileService.getProfile().subscribe(profile => {
      this.volunteerProvince = profile.province;
      this.volunteerCity = profile.city;
    });
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

}
