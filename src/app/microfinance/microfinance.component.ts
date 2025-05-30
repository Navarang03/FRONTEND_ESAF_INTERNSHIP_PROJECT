import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-microfinance',
  templateUrl: './microfinance.component.html',
  styleUrls: ['./microfinance.component.css'],
  imports:[FormsModule,ReactiveFormsModule]
})
export class MicrofinanceComponent {

    microfinanceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.microfinanceForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.microfinanceForm.valid) {
      console.log('Form submitted:', this.microfinanceForm.value);
      // TODO: send to backend API using HttpClient
    } else {
      console.log('Form is invalid');
      this.microfinanceForm.markAllAsTouched(); // trigger validation UI
    }
  }
}
