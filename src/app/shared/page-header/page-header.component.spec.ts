import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title, subtitle, eyebrow and icon', () => {
    component.eyebrow = 'Solicitudes';
    component.title = 'Mis ayudas';
    component.subtitle = 'Gestiona tus solicitudes';
    component.icon = 'bi-list-check';
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Solicitudes');
    expect(element.textContent).toContain('Mis ayudas');
    expect(element.textContent).toContain('Gestiona tus solicitudes');
    expect(element.querySelector('i')?.classList).toContain('bi-list-check');
  });

  it('should not render optional blocks when inputs are empty', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.section-label')).toBeNull();
    expect(element.querySelector('.app-subtitle')).toBeNull();
    expect(element.querySelector('i')).toBeNull();
  });
});
