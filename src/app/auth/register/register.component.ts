import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData: RegisterData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    surgeryDate: undefined,
    userProfile: {
      activityLevel: 'moderate'
    }
  };
  
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  hasSurgeryDate = false;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Check if passwords match
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }
    
    // If no surgery date is selected, set to undefined
    if (!this.hasSurgeryDate) {
      this.registerData.surgeryDate = undefined;
    }

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        // Registration successful
        this.isLoading = false;
        this.router.navigate(['/recovery-journey']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred during registration. Please try again.';
      }
    });
  }
}
