import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AiTutorial } from '../../features/shared/models/aiTutorial.model';

@Component({
  selector: 'app-ai-tutorial-panel',
  imports: [CommonModule],
  templateUrl: './ai-tutorial-panel.component.html',
  styleUrls: ['./ai-tutorial-panel.component.css'],
})
export class AiTutorialPanelComponent {
  @Input() tutorial?: AiTutorial;
  @Input() isGenerating = false;
  @Input() role: 'senior' | 'volunteer' = 'senior';
}
