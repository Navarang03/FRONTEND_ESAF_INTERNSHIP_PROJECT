import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { loginService } from './loginservice';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true, // ✅ This is required for routing and bootstrapping
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // fix 'styleUrl' → 'styleUrls'
  providers: [loginService]
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginservice: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      EmailOrPhone: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loginservice.login(this.loginForm.value.EmailOrPhone, this.loginForm.value.password).subscribe({
        next: () => this.router.navigate(['/home']),
        error: err => this.errorMessage = err.error || alert('Login failed')
      });
    }
  }

  onForgotPassword(): void {
    alert('Redirecting to forgot password...');
  }

  onSignup(): void {
    this.router.navigate(['/signup']);
  }

  showPassword = false;
togglePasswordVisibility(field: 'password' | 'confirm'): void {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  }
}
  

  
}
