import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { HelpRequest } from '../../../../shared/models/helpRequest.model';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpStatus } from '../../../../shared/models/supportSession.model';
import { PagenationComponent } from "../../../../../shared/pagenation/pagenation.component";
import { HELP_STATUS_CONFIG } from '../../../../shared/config/status-config';
import { PageHeaderComponent } from '../../../../../shared/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../../shared/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../../shared/status-badge/status-badge.component';
import { FilterBarComponent, FilterOption } from '../../../../../shared/filter-bar/filter-bar.component';

@Component({
  selector: 'app-my-help-requests',
  templateUrl: './my-helps.component.html',
  styleUrls: ['./my-helps.component.css'],
  imports: [
    CommonModule,
    PagenationComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    FilterBarComponent
  ]
})
export class ListVolunteerHelpRequestsComponent implements OnInit {


  constructor(private readonly helpRequestService: HelpRequestService, private readonly router: Router, 
    private readonly authService:AuthService,
    private readonly route:ActivatedRoute
  ) { }

  helpRequests: HelpRequest[] = [];
  status:HelpStatus = HelpStatus.ACTIVE;
  public HelpStatus = HelpStatus;
  currentPage:number =1;
  pageSize:number = 3;
  totalPages:number = 1;
  isFirst: boolean = false;
  isLast: boolean = false;
  statusConfig = HELP_STATUS_CONFIG;
  statusOptions: FilterOption<HelpStatus>[] = [
    { label: 'Abiertas', value: HelpStatus.ACTIVE },
    { label: 'Canceladas', value: HelpStatus.CANCELLED },
    { label: 'Completadas', value: HelpStatus.FINISHED },
  ];

  ngOnInit() {
    if(this.authService.getUserData()?.role!== 'VOLUNTEER' ){
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] || HelpStatus.ACTIVE;
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.fetchFromBackend();
    });
    this.updateStatus(this.status);
  }

  updateStatus(status: HelpStatus){
    this.status = status;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: this.status,
        page: this.currentPage
      },
      queryParamsHandling: 'merge'
    });
  }

  fetchFromBackend() {
    this.helpRequestService.getVolunteerFilteredHelpRequests(this.status, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.helpRequests = data.content;
        this.totalPages = data.totalPages;
        this.isFirst = data.first;
        this.isLast = data.last;
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes de ayuda:', err);
      }
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.updateStatus(this.status);
  }

  navigateToDetail(requestId: string) {
    this.router.navigate(['/request-detail', requestId], { state: { cameFrom: 'my-helps' } });
  }

}
