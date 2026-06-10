import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-filter-bar',
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css'],
})
export class FilterBarComponent<T = string> {
  @Input() options: FilterOption<T>[] = [];
  @Input() activeValue?: T;
  @Input() variant: 'primary' | 'subtle' = 'subtle';
  @Input() role: 'senior' | 'volunteer' = 'senior';
  @Output() filterChange = new EventEmitter<T>();
}
