import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signupService } from './signupservice';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [signupService]
})
export class SignupComponent {
  signupForm!: FormGroup;
  signupService: any;
  serverErrors = {email: '', phone: ''};
  maxDate!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private SignupService: signupService,
   ) {}

  ngOnInit(): void {
    this.setMaxDate();

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', [Validators.required, this.minimumAgeValidator(18)]],
      gender: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  setMaxDate() {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = maxDate.toISOString().split('T')[0]; // format: yyyy-mm-dd
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { underage: true };
    };
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.serverErrors = { email: '', phone: '' };
    console.log('signup')
    if (this.signupForm.valid) {
      this.SignupService.postsignup(this.signupForm.value).subscribe(
        (resp: any) =>{
          console.log(resp)
          alert('signed up sucessfully!');
          this.router.navigate(['/login'])

        },

      (error) => {
  const errMsg = error.error;

  if (errMsg && typeof errMsg === 'object') {
    if (errMsg.field === 'email') {
      this.serverErrors.email = errMsg.message;
    } else if (errMsg.field === 'phoneNumber') {
      this.serverErrors.phone = errMsg.message;
    }
  } else {
    alert('Signup failed. Please try again.');
  }
}


        )
      } else {
        
        alert('Please fill all fields correctly.');
    }
  }

showPassword = false;
showConfirmPassword = false;
togglePasswordVisibility(field: 'password' | 'confirm'): void {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else if (field === 'confirm') {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}


}
