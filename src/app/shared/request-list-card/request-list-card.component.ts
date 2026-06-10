import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatusVisualConfig } from '../../features/shared/config/status-config';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

export interface RequestListMetaLine {
  icon?: string;
  text: string;
}

@Component({
  selector: 'app-request-list-card',
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './request-list-card.component.html',
  styleUrls: ['./request-list-card.component.css'],
})
export class RequestListCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) statusConfig!: StatusVisualConfig;
  @Input() role: 'senior' | 'volunteer' = 'senior';
  @Input() metaLines: RequestListMetaLine[] = [];
  @Input() actionText = 'Ver detalle';
  @Output() viewDetail = new EventEmitter<void>();
}
