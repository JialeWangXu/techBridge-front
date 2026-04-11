import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../../help-requests/help-request.service';
import { HelpRequest, RequestStatus } from '../../../../shared/models/helpRequest.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-help-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css'],
  imports: [CommonModule]
})
export class ListHelpRequestsComponent implements OnInit {


  constructor(private readonly helpRequestService: HelpRequestService) { }

  helpRequests: HelpRequest[] = [];
  category: 'ALL'|'AI_ONLY'|'VOLUNTEER' = 'ALL';
  status:RequestStatus = RequestStatus.OPEN;
  public RequestStatus = RequestStatus;
  ngOnInit() {
    this.updateCategortOrStatus('ALL', RequestStatus.OPEN);
  }

  statusConfig: any = {
    'OPEN': { color: '#28a745', icon: 'bi-door-open-fill', text: 'Abierta' },
    'ACCEPTED': { color: '#0d6efd', icon: 'bi-person-check-fill', text: 'Aceptada' },
    'IN_PROGRESS': { color: '#ffc107', icon: 'bi-hourglass-split', text: 'En curso' },
    'COMPLETED': { color: '#6c757d', icon: 'bi-check-circle-fill', text: 'Completada' },
    'CANCELLED': { color: '#dc3545', icon: 'bi-x-circle-fill', text: 'Cancelada' }
  };

  updateCategortOrStatus( category: 'ALL'|'AI_ONLY'|'VOLUNTEER', status: RequestStatus) {

    this.category = category;
    this.status = status;

    this.helpRequestService.getAllBySeniorEmail().subscribe({
      next: (data) => {
        console.log('Solicitudes de ayuda obtenidas:', data);
        this.helpRequests = this.filterByStatusAndCategory(data, status, category);
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes de ayuda:', err);
      }
    });
  }

  filterByStatusAndCategory(requests: HelpRequest[], status: RequestStatus, category: 'ALL'|'AI_ONLY'|'VOLUNTEER'): HelpRequest[] {

    if(category === 'AI_ONLY'){
      requests = requests.filter(request => !request.supportSession);
    }else if(category === 'VOLUNTEER'){
      requests = requests.filter(request => request.supportSession);
    }
    return requests.filter(request => request.status === status );
  }

}
