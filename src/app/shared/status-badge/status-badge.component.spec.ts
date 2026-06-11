import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    component.config = { text: 'Abierta', color: '#008000', icon: 'bi-check-circle' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render status text and colors', () => {
    const badge = fixture.nativeElement.querySelector('.status-badge') as HTMLElement;

    expect(badge.textContent).toContain('Abierta');
    expect(badge.style.borderColor).toBe('rgb(0, 128, 0)');
    expect(badge.style.color).toBe('rgb(0, 128, 0)');
  });

  it('should render solid variant with icon', () => {
    component.solid = true;
    component.icon = true;
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge') as HTMLElement;
    const icon = fixture.nativeElement.querySelector('i') as HTMLElement;

    expect(badge.classList).toContain('solid');
    expect(badge.style.backgroundColor).toBe('rgb(0, 128, 0)');
    expect(icon.classList).toContain('bi-check-circle');
  });
});
