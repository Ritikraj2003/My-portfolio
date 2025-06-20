import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password);
      if (!success) {
        this.errorMessage = 'Invalid credentials';
      }
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
