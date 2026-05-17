import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { AiTutorialService } from '../shared/services/ai-tutorial.service';
import { HelpRequestService } from '../shared/services/help-request.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NgClass],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly aiTutorialService: AiTutorialService,
    private readonly helpRequestService: HelpRequestService
  ) {}
  userName: string = '';
  userRole: string = '';
  userEmail: string = '';
  globalAiLimitReached: boolean = false;
  userAiLimitRemaining: number = 0;
  volunteerInProgressRequestCount:number =0;

  ngOnInit() {
    const userData = this.authService.getUserData();
    if (userData) {
      this.userRole = userData['role'];
      this.userEmail = userData['email'];
      this.userName = userData['firstname'];
    }

    if (userData?.role === 'VOLUNTEER') {
      this.helpRequestService.countVolunteerInProgressRequest().subscribe({
        next: (count) => {
          this.volunteerInProgressRequestCount = count;
        },
        error: (err) => {
          console.error('Error al obtener el número de solicitudes en curso:', err);
        }
      });
    } else {
      this.aiTutorialService.aiLimitCheck().subscribe({
        next: (result) => {
          this.globalAiLimitReached = result.globalLimitReached;
          this.userAiLimitRemaining = result.userLimitRemaining;
        },
        error: (err) => {
          console.error('Error al obtener el límite global de IA:', err);
        },
      });
    }
  }

  showLimitWarning() {
    return(this.userRole === 'SENIOR' && (this.globalAiLimitReached || this.userAiLimitRemaining == 0))
    ||(this.userRole === 'VOLUNTEER' && this.volunteerInProgressRequestCount > 0);
  }

  get limitWarningMessage(): string {
    if (this.userRole === 'SENIOR') {
      return "Ya no podemos crear más guías hoy, pero puede seguir estudiando con los tutoriales que ya tiene en sus solicitudes. ¡Mañana más!";
    }else{
      return "";
    }
  }

  get limitWarningTitle(): string {
    if (this.userRole === 'SENIOR') {
      return "¡A practicar lo aprendido!";
    }else{
      return `Tiene ${this.volunteerInProgressRequestCount} solicitud(es) en curso`;
    }
  }

  get HomeMessage():string{
    if(this.userRole === 'SENIOR'){
      return `Hoy todavía podemos prepararle ${this.userAiLimitRemaining} tutoriales personalizados.`;
    }else{
      return "No tiene solicitudes en curso, ¡empiece su primera ayuda de hoy!";
    }
  }

  navigateTo(rute: string) {
    this.router.navigate([rute]);
  }

  get greetingMessage(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días, ';
    } else if (hour >= 12 && hour < 20) {
      return 'Buenas tardes, ';
    } else {
      return 'Buenas noches, ';
    }
  }
}
