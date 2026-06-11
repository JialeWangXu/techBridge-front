import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message and icon', () => {
    component.message = 'No hay solicitudes';
    component.icon = 'bi-inbox';
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('No hay solicitudes');
    expect(element.querySelector('i')?.classList).toContain('bi-inbox');
  });

  it('should not render icon when icon input is empty', () => {
    component.message = 'No hay datos';
    component.icon = '';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('i')).toBeNull();
  });
});
