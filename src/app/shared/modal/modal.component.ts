import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' | 'info' = 'info';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  @Output() Confirm = new EventEmitter<void>();
  @Output() Cancel = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  private modalInstance: any;

  show() {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
    this.modalInstance.show();
  }

  constructor() { }

  confirm() {
    this.Confirm.emit();
  }

  cancel() {
    this.Cancel.emit();
  }

}
