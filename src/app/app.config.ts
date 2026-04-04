import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection,importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor, AuthModule, LogLevel} from "angular-auth-oidc-client";
import {FormsModule} from "@angular/forms";
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(FormsModule),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor()])),
            importProvidersFrom(
            AuthModule.forRoot({
                config: {
                    authority: environment.REST_USER,
                    redirectUrl: environment.FRONT_END + '/callback',
                    postLogoutRedirectUri: environment.FRONT_END,
                    clientId: 'techbridge-spa',
                    scope: 'openid profile offline_access',
                    responseType: 'code',
                    silentRenew: false,
                    useRefreshToken: true,
                    secureRoutes: environment.SECURE_ROUTES,
                    logLevel: LogLevel.Debug,
                }
            })
        )
  ]
};
