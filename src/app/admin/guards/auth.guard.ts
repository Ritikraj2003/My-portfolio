import { CanActivate, Router } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Allow pre-rendering to proceed
    }

    const token = sessionStorage.getItem('token');
    
    if (token) {
      return true;
    }
    
    this.router.navigate(['/admin/login']);
    return false;
  }
} 