import {
    ApplicationConfig,
    LOCALE_ID,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
    importProvidersFrom,
    inject,
    provideAppInitializer,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    AbstractSecurityStorage,
    authInterceptor,
    OidcSecurityService,
    provideAuth,
    DefaultSessionStorageService
} from 'angular-auth-oidc-client';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authExpiredInterceptor } from './core/auth/auth-expired.interceptor';

registerLocaleData(localeEs);

export function initAuth(oidc: OidcSecurityService) {
    return () => oidc.checkAuth().pipe(
        catchError((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);

            if (message.includes('could not find matching config for state')) {
                globalThis.history.replaceState(null, '', '/register');
            } else {
                console.error('Auth initialization failed', error);
            }

            return of(null);
        }),
    );
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
    provideHttpClient(withInterceptors([authInterceptor(), authExpiredInterceptor])),
    {
        provide: LOCALE_ID,
        useValue: 'es-ES',
    },
    provideAuth(
    {
        config: {
        authority: environment.REST_USER,
        redirectUrl: `${environment.FRONT_END}/callback`,
        postLogoutRedirectUri: environment.FRONT_END,
        clientId: 'techbridge-spa',
        scope: 'openid profile',
        responseType: 'code',
        postLoginRoute: '/home',
        unauthorizedRoute: '/register',
        silentRenew: true,
        useRefreshToken: false,
        silentRenewUrl: `${globalThis.location.origin}/silent-renew.html`,
        secureRoutes: environment.SECURE_ROUTES,
        logLevel: 3,
        },
    },
    ),
    provideAppInitializer(() => initAuth(inject(OidcSecurityService))()),

    {
        provide: AbstractSecurityStorage,
        useClass: DefaultSessionStorageService,
    },
],
};
