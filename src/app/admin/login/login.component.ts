import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.username && this.password) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData = { username: this.username, password: this.password };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Assuming the API returns a token in the response body
          if (response && response.token) {
            sessionStorage.setItem('token', response.token);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.errorMessage = 'Login failed: No token received.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
