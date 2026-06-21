import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AiTutorial } from '../../features/shared/models/aiTutorial.model';

@Component({
  selector: 'app-ai-tutorial-panel',
  imports: [CommonModule],
  templateUrl: './ai-tutorial-panel.component.html',
  styleUrls: ['./ai-tutorial-panel.component.css'],
})
export class AiTutorialPanelComponent implements OnChanges {
  @Input() tutorial?: AiTutorial;
  @Input() isGenerating = false;
  @Input() role: 'senior' | 'volunteer' = 'senior';

  readonly stepsPerPage = 3;
  currentPageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tutorial']) {
      this.currentPageIndex = 0;
    }

    this.clampCurrentPage();
  }

  get visibleSteps() {
    const start = this.currentPageIndex * this.stepsPerPage;
    return this.steps.slice(start, start + this.stepsPerPage);
  }

  get showPaginationControls(): boolean {
    return this.steps.length > this.stepsPerPage;
  }

  get canGoPrevious(): boolean {
    return this.currentPageIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentPageIndex < this.lastPageIndex;
  }

  goPrevious(): void {
    if (!this.canGoPrevious) {
      return;
    }

    this.currentPageIndex--;
  }

  goNext(): void {
    if (!this.canGoNext) {
      return;
    }

    this.currentPageIndex++;
  }

  private get steps() {
    return this.tutorial?.steps ?? [];
  }

  private get lastPageIndex(): number {
    return Math.max(Math.ceil(this.steps.length / this.stepsPerPage) - 1, 0);
  }

  private clampCurrentPage(): void {
    this.currentPageIndex = Math.min(this.currentPageIndex, this.lastPageIndex);
  }
}
