import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'about', 
        loadComponent: () => import('./public/about/about.component').then(m => m.AboutComponent) 
      },
      { 
        path: 'projects', 
        loadComponent: () => import('./public/projects/projects.component').then(m => m.ProjectsComponent) 
      },
      { 
        path: 'skills', 
        loadComponent: () => import('./public/skills/skills.component').then(m => m.SkillsComponent) 
      },
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
