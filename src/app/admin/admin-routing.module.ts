import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  // Public-facing route
  { path: 'login', component: LoginComponent },
  
  // Protected routes
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      // Add other protected admin routes here with the guard
      
      // Redirect to dashboard by default if authenticated
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
