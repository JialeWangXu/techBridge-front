import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginCallbackComponent } from './features/auth/pages/LoginCallbackComponent';
import { RegisterComponent } from './features/register/register.component';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { ProfileComponent } from './features/home/profile/profile.component';
import { HelpRequestCreateComponent } from './features/home/senior/help-request/create/help-request-create.component';
import { ListHelpRequestsComponent } from './features/home/senior/help-request/my-requests/my-requests.component';
import { MyRequestDetailComponent } from './features/home/senior/help-request/my-request-detail/my-request-detail.component';
import { AvailableHelpRequestsComponent } from './features/home/volunteer/help-request/available-help-requests/available-help-requests.component';
import { RequestDetailComponent } from './features/home/volunteer/help-request/request-detail/request-detail.component';

export const routes: Routes = [
  {
    path:'',
    component:MainLayoutComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children:[
      {path: 'home', component: HomeComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'help-request-posting', component:HelpRequestCreateComponent},
      {path: 'my-requests', component: ListHelpRequestsComponent},
      {path: 'my-requests/:id', component: MyRequestDetailComponent},
      {path: 'available-requests', component: AvailableHelpRequestsComponent},
      {path: 'available-requests/:id', component: RequestDetailComponent},
      {path:'',redirectTo:'home',pathMatch:'full'}
    ]
  },
  {path: 'callback', component: LoginCallbackComponent},
  {path:'register', component:RegisterComponent}
];
