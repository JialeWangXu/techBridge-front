import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (shouldRedirectToLogin(req.url, error)) {
        authService.login();
      }

      return throwError(() => error);
    }),
  );
};

function shouldRedirectToLogin(url: string, error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
    return false;
  }

  if (globalThis.location.pathname === '/register') {
    return false;
  }

  return environment.SECURE_ROUTES.some((secureRoute) => url.startsWith(secureRoute));
}
