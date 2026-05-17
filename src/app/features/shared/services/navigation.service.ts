import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private readonly router: Router) {
    // Guardamos la URL inicial con la que arranca la app
    this.currentUrl = this.router.url;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // SOLO actualizamos si la URL de destino realmente ha cambiado
      if (this.currentUrl !== event.urlAfterRedirects) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  public getPreviousUrl(): string | null {
    // Si entraste directamente a la app desde esa página, previousUrl será null o "/"
    return this.previousUrl === '/' ? null : this.previousUrl;
  }
}