import { Component, ElementRef, Input, ViewChild } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent{

  @Input() message: string = '';
  @ViewChild('toastElement') toastElement!: ElementRef;
  private toastInstance: any;

  show(){
    if (!this.toastInstance) {
      this.toastInstance = new bootstrap.Toast(this.toastElement.nativeElement);
    }
    this.toastInstance.show();
    setTimeout(() => {
      this.toastInstance.hide();
    }, 5000);
  }
  constructor() { }
}
