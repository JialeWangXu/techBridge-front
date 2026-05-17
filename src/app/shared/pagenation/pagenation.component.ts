import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-pagenation',
  templateUrl: './pagenation.component.html',
  styleUrls: ['./pagenation.component.css'],
  imports: [NgClass]
})
export class PagenationComponent {

  @Input() currentPage: number = 1;
  @Input() currentPageRange: number = 1;
  pagesToShow: number = 5;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  
  constructor() { }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - Math.floor(this.pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.currentPageRange = Math.ceil(this.currentPage / this.pagesToShow);
      this.pageChange.emit(this.currentPage);
    }
  }

  goToPrevious() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNext() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
