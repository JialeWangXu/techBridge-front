import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    if (!this.authService.authenticated) {
        this.authService.login();
    }
  }

}