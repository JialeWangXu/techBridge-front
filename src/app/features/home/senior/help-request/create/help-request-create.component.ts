import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpRequestCreate } from '../../../../shared/models/helpRequest.model';
import { HelpRequestService } from '../../../help-requests/help-request.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-request',
  templateUrl: './help-request-create.component.html',
  styleUrls: ['./help-request-create.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class HelpRequestCreateComponent implements OnInit {

  submitted:boolean = false;
  loading: boolean = false;

  constructor(private readonly helpRequestService: HelpRequestService, private readonly router: Router, 
    private readonly authService:AuthService
  ) { }

  ngOnInit(){
        if(this.authService.getUserData()?.role!== 'SENIOR' ){
      this.router.navigate(['/']);
    }
  }

  helpRequestForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl('OPEN', [Validators.required]),
  });

  onSubmit(){
    this.submitted = true;
    if(this.helpRequestForm.valid){
      this.helpRequestService.create(this.helpRequestForm.getRawValue() as HelpRequestCreate).subscribe({
        next: () => {
          alert('Tu solicitud de ayuda ha sido creada exitosamente.');
          this.helpRequestForm.reset({ status: 'OPEN' });
          this.submitted = false;
        },
        error: (err) => {
          console.error('Error al crear la solicitud de ayuda:', err);
          this.submitted = false;
        }
      });
      
    }
  }

  onCancel() {
    this.loading = false;
    this.submitted = false;
  }

}
