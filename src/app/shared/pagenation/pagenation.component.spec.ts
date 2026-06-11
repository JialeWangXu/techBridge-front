import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagenationComponent } from './pagenation.component';

describe('PagenationComponent', () => {
  let component: PagenationComponent;
  let fixture: ComponentFixture<PagenationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagenationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagenationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate visible page numbers around the current page', () => {
    component.currentPage = 4;
    component.totalPages = 10;

    expect(component.pageNumbers).toEqual([2, 3, 4, 5, 6]);
  });

  it('should not show pages outside the available range', () => {
    component.currentPage = 1;
    component.totalPages = 3;

    expect(component.pageNumbers).toEqual([1, 2, 3]);
  });

  it('should emit page changes for valid pages', () => {
    spyOn(component.pageChange, 'emit');
    component.totalPages = 8;

    component.goToPage(3);

    expect(component.currentPage).toBe(3);
    expect(component.currentPageRange).toBe(1);
    expect(component.pageChange.emit).toHaveBeenCalledOnceWith(3);
  });

  it('should ignore invalid pages', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 3;

    component.goToPage(0);
    component.goToPage(4);

    expect(component.currentPage).toBe(2);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should navigate to previous and next pages inside bounds', () => {
    spyOn(component, 'goToPage');
    component.currentPage = 2;
    component.totalPages = 3;

    component.goToPrevious();
    component.goToNext();

    expect(component.goToPage).toHaveBeenCalledWith(1);
    expect(component.goToPage).toHaveBeenCalledWith(3);
  });
});
