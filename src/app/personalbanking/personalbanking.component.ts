import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { personalService } from './personalbanking.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-personalbanking',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './personalbanking.component.html',
  styleUrl: './personalbanking.component.css',
  providers: [personalService]
})
export class PersonalbankingComponent {
  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private personalService: personalService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      personalDetails: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contact: ['', Validators.required],
        dob: ['', Validators.required],
        gender: [''],
        maritalStatus: [''],
        guardianName: [''],
        panAvailable: ['No'],

        panNumber: [''],
        aadharAvailable: ['No'],
        aadharNumber: ['']
      }),
      academicQualifications: this.fb.group({
        qualifications: this.fb.array([this.createQualification()]),
        otherQualification: [''],
        languages: this.fb.group({
          speak: [''],
          read: [''],
          write: ['']
        }),
        skillsHobbies: [''],
        experience: ['']
      }),
      hrDetails: this.fb.group({
        designation: [''],
        employeeType: [''],
        salary: [''],
        grade: [''],
        employeeId: ['']
      })
    });

    this.onPanChange();
    this.onAadharChange();
  }

  createQualification(): FormGroup {
    return this.fb.group({
      course: [''],
      year: [''],
      institution: [''],
      marks: ['']
    });
  }

  get qualifications(): FormArray {
    return this.employeeForm.get('academicQualifications.qualifications') as FormArray;
  }

  addQualification(): void {
    this.qualifications.push(this.createQualification());
  }

  onPanChange(): void {
    this.employeeForm.get('personalDetails.panAvailable')?.valueChanges.subscribe(value => {
      const panNumber = this.employeeForm.get('personalDetails.panNumber');
      if (value === 'Yes') {
        panNumber?.setValidators([Validators.required]);
      } else {
        panNumber?.clearValidators();
        panNumber?.reset();
      }
      panNumber?.updateValueAndValidity();
    });
  }

  onAadharChange(): void {
    this.employeeForm.get('personalDetails.aadharAvailable')?.valueChanges.subscribe(value => {
      const aadharNumber = this.employeeForm.get('personalDetails.aadharNumber');
      if (value === 'Yes') {
        aadharNumber?.setValidators([Validators.required]);
      } else {
        aadharNumber?.clearValidators();
        aadharNumber?.reset();
      }
      aadharNumber?.updateValueAndValidity();
    });
  }

  generateEmployeeId() {
    const empId = 'EMP' + Math.floor(100000 + Math.random() * 900000).toString();
    this.employeeForm.get('hrDetails.employeeId')?.setValue(empId);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      const transformedQualifications = formValue.academicQualifications.qualifications.map((q: any) => ({
        courseName: q.course,
        yearOfPassing: parseInt(q.year),
        institutionName: q.institution,
        marksPercentage: parseFloat(q.marks)
      }));

      const payload = {
        name: formValue.personalDetails.name,
        email: formValue.personalDetails.email,
        contact: formValue.personalDetails.contact,
        dateOfBirth: formValue.personalDetails.dob,
        gender: formValue.personalDetails.gender,
        maritalStatus: formValue.personalDetails.maritalStatus,
        guardianName: formValue.personalDetails.guardianName,
        panAvailable: formValue.personalDetails.panAvailable === 'Yes',
        panNumber: formValue.personalDetails.panNumber,
        aadharAvailable: formValue.personalDetails.aadharAvailable === 'Yes',
        aadharNumber: formValue.personalDetails.aadharNumber,
        qualifications: transformedQualifications,
        otherQualification: formValue.academicQualifications.otherQualification,
        languagesKnown: formValue.academicQualifications.languages,
        skillsHobbies: formValue.academicQualifications.skillsHobbies,
        experience: formValue.academicQualifications.experience,
        designation: formValue.hrDetails.designation,
        employeeType: formValue.hrDetails.employeeType,
        salary: formValue.hrDetails.salary.toString(), // convert to string as expected
        grade: formValue.hrDetails.grade,
        employeeId: formValue.hrDetails.employeeId
      };

      console.log('Final Payload:', payload);

      this.personalService.postpersonalbanking(payload).subscribe(
        (resp: any) => {
          console.log(resp);
          alert('Form submitted successfully!');
        },
        (error) => {
          console.error('Submission failed:', error);
          alert('Submission failed!');
        }
      );
    } else {
      alert('Please fill all required fields correctly.');
    }
  }


}
