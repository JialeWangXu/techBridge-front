import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpRequestCreate } from '../../../../shared/models/helpRequest.model';
import { HelpRequestService } from '../../../../shared/services/help-request.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-help-request',
  templateUrl: './help-request-create.component.html',
  styleUrls: ['./help-request-create.component.css'],
  imports: [ReactiveFormsModule, CommonModule, ModalComponent]
})
export class HelpRequestCreateComponent implements OnInit {
  @ViewChild(ModalComponent) errorModal!: ModalComponent; 
  submitted:boolean = false;
  loading: boolean = false;
  isGenerating: boolean = false;
  constructor(private readonly helpRequestService: HelpRequestService, private readonly router: Router, 
    private readonly authService:AuthService
  ) { }

  ngOnInit(){
        if(this.authService.getUserData()?.role!== 'SENIOR' ){
      this.router.navigate(['/']);
    }
  }

  modalConfig = {
    title: 'Error al generar tutorial personalizada',
    message: 'Hubo un error al intentar generar el tutorial personalizado. Por favor, revisar el contenido de la solicitud.',
    type: 'danger' as 'danger' | 'success' | 'info',
    showCancel: false,
    confirmText: 'Aceptar'
  };
  helpRequestForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl('OPEN', [Validators.required]),
  });

  onSubmit(){
    this.submitted = true;
    this.isGenerating = true;
    if(this.helpRequestForm.valid){
      this.helpRequestService.create(this.helpRequestForm.getRawValue() as HelpRequestCreate).subscribe({
        next: (helpRequest) => {
          this.helpRequestForm.reset({ status: 'OPEN' });
          this.submitted = false;
          this.isGenerating = false;
          this.router.navigate(['/my-requests', helpRequest.id]);
        },
        error: (err) => {
          console.error('Error al crear la solicitud de ayuda:', err);
          this.errorModal.show();
          this.submitted = false;
          this.isGenerating = false;
        }
      });
      
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

}
