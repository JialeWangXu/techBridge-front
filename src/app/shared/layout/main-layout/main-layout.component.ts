import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [RouterOutlet]
})
export class MainLayoutComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  userRole: string = '';

  ngOnInit() {
    this.userRole = this.authService.role;
  }

  logout(): void {
      this.authService.logout();
  }

  navigateTo(rute: string) {
    this.router.navigate([rute]);
  }

}
