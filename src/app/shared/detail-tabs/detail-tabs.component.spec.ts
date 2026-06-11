import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTabsComponent } from './detail-tabs.component';

describe('DetailTabsComponent', () => {
  let component: DetailTabsComponent<string>;
  let fixture: ComponentFixture<DetailTabsComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTabsComponent<string>);
    component = fixture.componentInstance;
    component.tabs = [
      { label: 'Tutorial', value: 'TUTORIAL', icon: 'bi-robot' },
      { label: 'Gestionar', value: 'MANAGE', icon: 'bi-tools' },
    ];
    component.activeValue = 'TUTORIAL';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tabs and active state', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Tutorial');
    expect(buttons[0].classList).toContain('active');
    expect(buttons[0].querySelector('i')?.classList).toContain('bi-robot');
  });

  it('should emit tabChange when a tab is clicked', () => {
    spyOn(component.tabChange, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    buttons[1].click();

    expect(component.tabChange.emit).toHaveBeenCalledOnceWith('MANAGE');
  });

  it('should apply volunteer class', () => {
    component.role = 'volunteer';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.detail-tabs').classList).toContain('volunteer');
  });
});
