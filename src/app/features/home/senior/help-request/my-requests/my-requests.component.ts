import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { CommonModule } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { PagenationComponent } from "../../../../../shared/pagenation/pagenation.component";

@Component({
  selector: 'app-my-help-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css'],
  imports: [CommonModule, PagenationComponent]
})
export class ListSeniorHelpRequestsComponent implements OnInit {


  constructor(private readonly helpRequestService: HelpRequestService, private readonly router: Router, 
    private readonly authService:AuthService,
    private readonly route:ActivatedRoute
  ) { 
  }

  helpRequests: HelpRequest[] = [];
  category: 'ALL'|'AI_ONLY'|'VOLUNTEER' = 'ALL';
  status:RequestStatus = RequestStatus.OPEN;
  public RequestStatus = RequestStatus;
  currentPage:number =1;
  pageSize:number = 3;
  totalPages:number = 1;
  isFirst: boolean = false;
  isLast: boolean = false;

  ngOnInit() {
    if(this.authService.getUserData()?.role!== 'SENIOR' ){
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.status = params['status'] || RequestStatus.OPEN;
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.fetchFromBackend();
    });
    this.updateCategoryOrStatus(this.category, this.status, false);
  }

  statusConfig: any = {
    'OPEN': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
    'FINDING_VOLUNTEER': { color: '#0d6efd', icon: 'bi-person-check-fill', text: 'Encontrando voluntario' },
    'IN_PROGRESS': { color: '#ffc107', icon: 'bi-hourglass-split', text: 'En curso' },
    'COMPLETED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
    'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };

  fetchFromBackend(){
    this.helpRequestService.getSeniorFilteredHelpRequests(this.status, this.category, this.currentPage, this.pageSize).subscribe({
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

  updateCategoryOrStatus(
    category: 'ALL'|'AI_ONLY'|'VOLUNTEER',
    status: RequestStatus,
    resetPage: boolean = true
  ) {

    this.category = category;
    this.status = status;
    if (resetPage) {
      this.currentPage = 1;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.category === 'ALL'|| this.category === null ? null : this.category,
        status: this.status,
        page: this.currentPage
      },
      queryParamsHandling: 'merge' // Mantiene otros parámetros si existieran
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateCategoryOrStatus(this.category, this.status, false);
  }

  navigateToDetail(requestId: string) {
    this.router.navigate(['/my-requests', requestId]);
  }

}
