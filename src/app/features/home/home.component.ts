import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { AiTutorialService } from './services/ai-tutorial.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router,
    private readonly aiTutorialService: AiTutorialService
  ) { }
  userName: string = '';
  userRole: string = '';
  userEmail: string = '';
  globalAiLimitReached: boolean = false;
  userAiLimitRemaining: number = 0;

  ngOnInit() {

    const userData =this.authService.getUserData();
    if (userData) {
      this.userRole = userData['role'];
      this.userEmail = userData['email'];
      this.userName = userData['firstname'];
    }
    
    this.aiTutorialService.aiLimitCheck()
    .subscribe({
      next: (result) => {
        this.globalAiLimitReached = result.globalLimitReached;
        this.userAiLimitRemaining = result.userLimitRemaining;
      },
      error: (err) => {
        console.error('Error al obtener el límite global de IA:', err);
      }
    });
    
  };

  showAiLimitWarining(){
    return this.globalAiLimitReached || this.userAiLimitRemaining == 0;
  }
    
  navigateTo(rute: string) {
    this.router.navigate([rute]);
  }

  get greetingMessage(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días, '
    } else if (hour >= 12 && hour < 20) {
      return 'Buenas tardes, '
    } else {
      return 'Buenas noches, '
    }
  } 
}