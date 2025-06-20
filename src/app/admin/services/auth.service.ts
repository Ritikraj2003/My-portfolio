import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check token validity on service initialization
    if (this.hasToken()) {
      this.validateToken();
    }
  }

  login(username: string, password: string): boolean {
    // Simulate API call - replace with actual API integration later
    if (username === 'admin' && password === 'admin') {
      const token = this.generateDummyToken();
      sessionStorage.setItem('token', token);
      this.isAuthenticatedSubject.next(true);
      this.router.navigate(['/admin/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  private validateToken(): void {
    // Simulate token validation - replace with actual validation later
    const token = this.getToken();
    if (!token) {
      this.logout();
    }
  }

  private generateDummyToken(): string {
    // Simulate token generation - replace with actual token from backend
    return 'dummy-jwt-token-' + new Date().getTime();
  }
}
