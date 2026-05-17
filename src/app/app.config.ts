import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
    importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    AbstractSecurityStorage,
    authInterceptor,
    OidcSecurityService,
    provideAuth,
    withAppInitializerAuthCheck,
    DefaultSessionStorageService
} from 'angular-auth-oidc-client';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export function initAuth(oidc: OidcSecurityService) {
    return () => oidc.checkAuth();
}

export const appConfig: ApplicationConfig = {
    providers: [
    importProvidersFrom(FormsModule),
    provideAnimations(),
    provideToastr({
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth(
    {
        config: {
        authority: environment.REST_USER,
        redirectUrl: `${environment.FRONT_END}/callback`,
        postLogoutRedirectUri: environment.FRONT_END,
        clientId: 'techbridge-spa',
        scope: 'openid profile',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: false,
        silentRenewUrl: `${globalThis.location.origin}/silent-renew.html`,
        secureRoutes: environment.SECURE_ROUTES,
        logLevel: 3,
        },
    },
    withAppInitializerAuthCheck(),
    ),

    {
        provide: AbstractSecurityStorage,
        useClass: DefaultSessionStorageService,
    },
],
};
