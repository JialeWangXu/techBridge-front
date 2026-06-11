import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resource-button',
  templateUrl: './resource-button.component.html',
  styleUrls: ['./resource-button.component.css'],
})
export class ResourceButtonComponent {
  @Input() label = 'Ver Recurso Subido';
  @Input() fullWidth = false;
  @Input() size: 'normal' | 'small' = 'normal';
  @Output() resourceClick = new EventEmitter<void>();
}
