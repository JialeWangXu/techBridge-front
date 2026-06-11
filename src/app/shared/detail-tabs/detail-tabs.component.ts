import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DetailTabOption<T = string> {
  label: string;
  value: T;
  icon?: string;
}

@Component({
  selector: 'app-detail-tabs',
  imports: [CommonModule],
  templateUrl: './detail-tabs.component.html',
  styleUrls: ['./detail-tabs.component.css'],
})
export class DetailTabsComponent<T = string> {
  @Input() tabs: DetailTabOption<T>[] = [];
  @Input() activeValue?: T;
  @Input() role: 'senior' | 'volunteer' = 'senior';
  @Output() tabChange = new EventEmitter<T>();
}
