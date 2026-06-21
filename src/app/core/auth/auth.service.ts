import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private loginInProgress = false;

  // Este método lanzará la redirección al login de Spring
  login() {
    if (this.loginInProgress) {
      return;
    }

    this.loginInProgress = true;
    this.oidcSecurityService.authorize();
  }

  getUserData(): { email: string, firstname: string, role: string } | null {
    // Obtenemos el payload decodificado del Access Token
    const data ={
      email: '',
      firstname: '',
      role: ''
    };
    this.oidcSecurityService.getPayloadFromAccessToken().subscribe(payload => {
      data['email'] = payload['sub'];
      data['firstname'] = payload['name'];
      data['role'] = payload['role'];
    });
    return data;
  }

  logout(): void {
    this.oidcSecurityService.getIdToken().pipe(take(1)).subscribe((idToken) => {
      if (idToken) {
        this.oidcSecurityService.logoff().subscribe();
        return;
      }

      this.oidcSecurityService.logoffLocal();
      globalThis.location.assign(environment.FRONT_END);
    });
  }
}
