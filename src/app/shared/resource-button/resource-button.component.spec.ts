import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceButtonComponent } from './resource-button.component';

describe('ResourceButtonComponent', () => {
  let component: ResourceButtonComponent;
  let fixture: ComponentFixture<ResourceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render custom label and classes', () => {
    component.label = 'Descargar recurso';
    component.fullWidth = true;
    component.size = 'small';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent).toContain('Descargar recurso');
    expect(button.classList).toContain('w-100');
    expect(button.classList).toContain('small');
  });

  it('should emit resourceClick when clicked', () => {
    spyOn(component.resourceClick, 'emit');

    fixture.nativeElement.querySelector('button').click();

    expect(component.resourceClick.emit).toHaveBeenCalled();
  });
});
