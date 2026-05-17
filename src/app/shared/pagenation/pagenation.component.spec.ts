/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PagenationComponent } from './pagenation.component';

describe('PagenationComponent', () => {
  let component: PagenationComponent;
  let fixture: ComponentFixture<PagenationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagenationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagenationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
