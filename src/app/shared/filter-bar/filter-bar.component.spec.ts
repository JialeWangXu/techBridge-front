import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent<string>;
  let fixture: ComponentFixture<FilterBarComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent<string>);
    component = fixture.componentInstance;
    component.options = [
      { label: 'Abiertas', value: 'OPEN' },
      { label: 'Finalizadas', value: 'COMPLETED' },
    ];
    component.activeValue = 'OPEN';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options and mark active option', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Abiertas');
    expect(buttons[0].classList).toContain('active');
    expect(buttons[1].classList).not.toContain('active');
  });

  it('should emit selected filter value on click', () => {
    spyOn(component.filterChange, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    buttons[1].click();

    expect(component.filterChange.emit).toHaveBeenCalledOnceWith('COMPLETED');
  });

  it('should apply primary and volunteer classes', () => {
    component.variant = 'primary';
    component.role = 'volunteer';
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('.filter-group') as HTMLElement;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(group.classList).toContain('volunteer');
    expect(button.classList).toContain('primary');
  });
});
