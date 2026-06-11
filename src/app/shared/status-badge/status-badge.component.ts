import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusVisualConfig } from '../../features/shared/config/status-config';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
})
export class StatusBadgeComponent {
  @Input({ required: true }) config!: StatusVisualConfig;
  @Input() solid = false;
  @Input() icon = false;
}
