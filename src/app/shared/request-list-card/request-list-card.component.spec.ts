import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListCardComponent } from './request-list-card.component';

describe('RequestListCardComponent', () => {
  let component: RequestListCardComponent;
  let fixture: ComponentFixture<RequestListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListCardComponent);
    component = fixture.componentInstance;
    component.title = 'Ayuda con móvil';
    component.statusConfig = {
      text: 'Abierta',
      color: '#008000',
      icon: 'bi-check-circle',
    };
    component.metaLines = [
      { icon: 'bi-clock', text: 'Publicado: 01/01/2026' },
      { text: 'Solicitante: Ana Garcia' },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title, metadata, status and action text', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Ayuda con móvil');
    expect(element.textContent).toContain('Publicado');
    expect(element.textContent).toContain('Solicitante');
    expect(element.textContent).toContain('Abierta');
    expect(element.textContent).toContain('Ver detalle');
  });

  it('should emit viewDetail when clicked', () => {
    spyOn(component.viewDetail, 'emit');

    fixture.nativeElement.querySelector('button').click();

    expect(component.viewDetail.emit).toHaveBeenCalled();
  });

  it('should apply volunteer class and custom action text', () => {
    component.role = 'volunteer';
    component.actionText = 'Gestionar';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList).toContain('volunteer');
    expect(button.textContent).toContain('Gestionar');
  });
});
