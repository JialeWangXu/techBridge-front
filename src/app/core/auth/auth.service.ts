import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  authenticated: boolean = false;
  email: string = '';
  firstname:string ='';
  role: string = '';

  // Este método lanzará la redirección al login de Spring
  login() {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
      this.oidcSecurityService.logoff().subscribe(() => {
          this.firstname = '';
          this.email = '';
          this.role = '';
          this.authenticated = false;
      });
  }
}