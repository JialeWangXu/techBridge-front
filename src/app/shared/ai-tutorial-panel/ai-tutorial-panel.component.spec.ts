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

  it('should render a maximum of three steps at a time', () => {
    component.tutorial = {
      id: 'tutorial-2',
      title: 'Tutorial largo',
      generalDescription: 'Descripcion',
      steps: [
        { number: 1, instruction: 'Paso 1' },
        { number: 2, instruction: 'Paso 2' },
        { number: 3, instruction: 'Paso 3' },
        { number: 4, instruction: 'Paso 4' },
      ],
    };
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.tutorial-step').length).toBe(3);
    expect(element.textContent).toContain('Paso 1');
    expect(element.textContent).not.toContain('Paso 4');
    expect(element.querySelectorAll('.tutorial-page-btn').length).toBe(2);
  });

  it('should navigate tutorial steps with arrow buttons', () => {
    component.tutorial = {
      id: 'tutorial-3',
      title: 'Tutorial largo',
      generalDescription: 'Descripcion',
      steps: [
        { number: 1, instruction: 'Paso 1' },
        { number: 2, instruction: 'Paso 2' },
        { number: 3, instruction: 'Paso 3' },
        { number: 4, instruction: 'Paso 4' },
        { number: 5, instruction: 'Paso 5' },
      ],
    };
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector(
      '[aria-label="Ver pasos siguientes"]',
    ) as HTMLButtonElement;

    nextButton.click();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.tutorial-step').length).toBe(2);
    expect(element.textContent).not.toContain('Paso 1');
    expect(element.textContent).toContain('Paso 4');
    expect(element.textContent).toContain('Paso 5');
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
