import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTutorialPanelComponent } from './ai-tutorial-panel.component';

describe('AiTutorialPanelComponent', () => {
  let component: AiTutorialPanelComponent;
  let fixture: ComponentFixture<AiTutorialPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTutorialPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiTutorialPanelComponent);
    component = fixture.componentInstance;
    component.tutorial = {
      id: 'tutorial-1',
      title: 'Configurar WhatsApp',
      generalDescription: 'Guía básica',
      steps: [
        { number: 1, instruction: 'Abre la aplicación', advice: 'Busca el icono verde' },
        { number: 2, instruction: 'Pulsa Ajustes' },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tutorial title, description and steps', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Configurar WhatsApp');
    expect(element.textContent).toContain('Guía básica');
    expect(element.textContent).toContain('Abre la aplicación');
    expect(element.textContent).toContain('Consejo');
    expect(element.querySelectorAll('.tutorial-step').length).toBe(2);
  });

  it('should render generation state while tutorial is being generated', () => {
    component.isGenerating = true;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Generando');
    expect(element.querySelector('.spinner-status')).toBeTruthy();
  });

  it('should apply volunteer class for volunteer role', () => {
    component.role = 'volunteer';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.tutorial-container').classList).toContain(
      'volunteer',
    );
  });
});
