import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { path: '/admin/dashboard', icon: 'bi bi-speedometer2', title: 'Overview' },
    { path: '/admin/projects', icon: 'bi bi-folder', title: 'Manage Projects' },
    { path: '/admin/skills', icon: 'bi bi-star', title: 'Skills Management' },
    { path: '/admin/settings', icon: 'bi bi-gear', title: 'Settings' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }

  logout(): void {
    this.authService.logout();
  }
}
