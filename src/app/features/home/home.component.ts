import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router) { }
  userName: string = '';
  userRole: string = '';
  userEmail: string = '';

  ngOnInit() {
    this.userName = this.authService.firstname;
    this.userRole = this.authService.role;
    this.userEmail = this.authService.email;

    console.log('User Info:', {
      name: this.userName,
      role: this.userRole,
      email: this.userEmail
    });
  }

  navigateTo(rute: string) {
    this.router.navigate([rute]);
  }

  get greetingMessage(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días, '
    } else if (hour >= 12 && hour < 20) {
      return 'Buenas tardes, '
    } else {
      return 'Buenas noches, '
    }
  } 
}