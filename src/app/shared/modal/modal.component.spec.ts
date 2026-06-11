import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalInstanceSpy: jasmine.SpyObj<{ show: () => void; hide: () => void }>;

  beforeEach(async () => {
    modalInstanceSpy = jasmine.createSpyObj('bootstrapModalInstance', ['show', 'hide']);
    (globalThis as any).bootstrap = {
      Modal: jasmine.createSpy('Modal').and.returnValue(modalInstanceSpy),
    };

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and show the bootstrap modal', () => {
    component.show();

    expect((globalThis as any).bootstrap.Modal).toHaveBeenCalled();
    expect(modalInstanceSpy.show).toHaveBeenCalled();
  });

  it('should reuse the same bootstrap modal instance', () => {
    component.show();
    component.show();

    expect((globalThis as any).bootstrap.Modal).toHaveBeenCalledTimes(1);
    expect(modalInstanceSpy.show).toHaveBeenCalledTimes(2);
  });

  it('should hide the modal when close is called after show', () => {
    component.show();
    component.close();

    expect(modalInstanceSpy.hide).toHaveBeenCalled();
  });

  it('should emit confirm and cancel events', () => {
    spyOn(component.Confirm, 'emit');
    spyOn(component.Cancel, 'emit');

    component.confirm();
    component.cancel();

    expect(component.Confirm.emit).toHaveBeenCalled();
    expect(component.Cancel.emit).toHaveBeenCalled();
  });
});
