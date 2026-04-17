import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../../help-requests/help-request.service';
import { HelpRequest } from '../../../../shared/models/helpRequest.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { HelpStatus } from '../../../../shared/models/supportSession.model';

@Component({
  selector: 'app-my-help-requests',
  templateUrl: './my-helps.component.html',
  styleUrls: ['./my-helps.component.css'],
  imports: [CommonModule]
})
export class ListVolunteerHelpRequestsComponent implements OnInit {


  constructor(private readonly helpRequestService: HelpRequestService, private readonly router: Router, 
    private readonly authService:AuthService
  ) { }

  helpRequests: HelpRequest[] = [];
  status:HelpStatus = HelpStatus.ACTIVE;
  public HelpStatus = HelpStatus;
  ngOnInit() {
    if(this.authService.getUserData()?.role!== 'VOLUNTEER' ){
      this.router.navigate(['/']);
    }
    this.updateStatus(HelpStatus.ACTIVE);
  }

  statusConfig: any = {
    'ACTIVE': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
    'FINISHED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
    'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };

  updateStatus(status: HelpStatus) {

    this.status = status;

    this.helpRequestService.getAllByVolunteerEmail().subscribe({
      next: (data) => {
        console.log('Solicitudes de ayuda obtenidas:', data);
        this.helpRequests = this.filterByStatus(data, status);
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes de ayuda:', err);
      }
    });
  }

  filterByStatus(requests: HelpRequest[], status: HelpStatus): HelpRequest[] {
    return requests.filter(request => request.supportSession?.status === status);
  }

  navigateToDetail(requestId: string) {
    this.router.navigate(['/request-detail', requestId], { state: { cameFrom: 'my-helps' } });
  }

}
