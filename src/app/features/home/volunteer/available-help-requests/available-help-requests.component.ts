import { Component, OnInit } from '@angular/core';
import { HelpRequestService } from '../../help-requests/help-request.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { HelpRequest } from '../../../shared/models/helpRequest.model';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile/profile.service';
import { UserDto } from '../../../shared/models/userDto.model';

@Component({
  selector: 'app-available-help-requests',
  templateUrl: './available-help-requests.component.html',
  styleUrls: ['./available-help-requests.component.css'],
  imports:[CommonModule]
})
export class AvailableHelpRequestsComponent implements OnInit {

  constructor( private readonly helpRequestService: HelpRequestService
    , private readonly authService: AuthService, private readonly router:Router,
    private readonly profileService: ProfileService) { }

  availableHelpRequests:HelpRequest[] = []; 
  filteredRequests:HelpRequest[] = [];

  selectedMethod: 'ALL' | 'TELEPHONE' | 'ONLINE_MEETING' | 'IN_PERSON' = 'ALL';
  onlyMyZone: boolean = false;
  searchingText: string = '';

  volunteerProvince: string|undefined = undefined;
  volunteerCity: string|undefined = undefined;

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
    this.filteredRequests = this.availableHelpRequests.filter(req => {
      const matchesMethod = (this.selectedMethod && this.selectedMethod !== "ALL") ? req.senior.contactPreference === this.selectedMethod : true;
      const matchesZone = this.onlyMyZone ? this.filterByZone(req.senior) : true;
      const matchesSearch = req.title.toLowerCase().includes(this.searchingText.toLowerCase()) || 
                            req.description.toLowerCase().includes(this.searchingText.toLowerCase());
      return matchesMethod && matchesZone && matchesSearch;
    });
  }

  private filterByZone(senior:UserDto): boolean {
    if(this.volunteerCity && this.volunteerProvince){
      if(senior.city && senior.province){
        return senior.city.toLowerCase() === this.volunteerCity.toLowerCase() && senior.province === this.volunteerProvince;
      }else if(senior.province){
        return senior.province === this.volunteerProvince;
      }else if(senior.city){
        return senior.city.toLowerCase() === this.volunteerCity.toLowerCase();
      }
    }else if(this.volunteerProvince){
      return senior.province === this.volunteerProvince;
    }else if(this.volunteerCity){
      return senior.city?.toLowerCase() === this.volunteerCity.toLowerCase();
    }
    return false;
  }

  goToDetail(id: string) {
    this.router.navigate(['/home/volunteer/help-request', id]);
  }

  ngOnInit() {
    if(this.authService.getUserData()?.role !== 'VOLUNTEER'){
      this.router.navigate(['/']);
    }
    this.helpRequestService.getAllAvailable().subscribe((requests) => {
      this.availableHelpRequests = requests;
      this.filteredRequests = requests;
    });
    this.profileService.getProfile().subscribe(profile => {
      this.volunteerProvince = profile.province;
      this.volunteerCity = profile.city;
    });
  }

}
