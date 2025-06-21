import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      // User is authenticated
      return true;
    }
    
    // User is not authenticated, redirect to login
    this.router.navigate(['/admin/login']);
    return false;
  }
} 