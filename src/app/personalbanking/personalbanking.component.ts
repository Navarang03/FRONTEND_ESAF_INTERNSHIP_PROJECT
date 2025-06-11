import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { personalService } from './personalbanking.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-personalbanking',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './personalbanking.component.html',
  styleUrl: './personalbanking.component.css',
  providers: [personalService]
})
export class PersonalbankingComponent {
  
  
  employeeForm!: FormGroup;
  actiontype = 'create';
  employeeId :any;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private personalService: personalService,
    private router: Router
  ) { }


 ngOnInit(): void {
  this.employeeId = this.route.snapshot.paramMap.get('id');
  console.log(this.employeeId);

  // Initialize the form first
  this.employeeForm = this.fb.group({
    personalDetails: this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      guardianName: ['', Validators.required],
      panAvailable: ['No', Validators.required],
      panNumber: [''],
      aadharAvailable: ['No', Validators.required],
      aadharNumber: ['']
    }),
    academicQualifications: this.fb.group({
      qualifications: this.fb.array([this.createQualification()]),
      otherQualification: ['', Validators.required],
      languages: this.fb.group({
        speak: ['', Validators.required],
        read: ['', Validators.required],
        write: ['', Validators.required]
      }),
      skillsHobbies: ['', Validators.required],
      experience: ['', Validators.required]
    }),
    hrDetails: this.fb.group({
      designation: ['', Validators.required],
      employeeType: ['', Validators.required],
      salary: ['', Validators.required],
      grade: ['', Validators.required],
      employeeId: ['', Validators.required]
    })
  });

  // Patch data if in update mode
  if (this.employeeId) {
    this.personalService.getEmployeeById(this.employeeId).subscribe((data) => {
      console.log(data);
      this.populateForm(data);
      this.actiontype = 'update';
    });
  }

  // Set conditional validators
  this.onPanChange();
  this.onAadharChange();
}


  populateForm(data: any) {
    // Patch everything except the qualifications array
    this.employeeForm.patchValue({
      personalDetails: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        dob: data.dateOfBirth?.split('T')[0],
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        guardianName: data.guardianName,
        panAvailable: data.panAvailable ? 'Yes' : 'No',
        panNumber: data.panNumber,
        aadharAvailable: data.aadharAvailable ? 'Yes' : 'No',
        aadharNumber: data.aadharNumber
      },
      academicQualifications: {
        otherQualification: data.otherQualification,
        languages: {
          speak: data.languagesKnown?.speak,
          read: data.languagesKnown?.read,
          write: data.languagesKnown?.write
        },
        skillsHobbies: data.skillsHobbies,
        experience: data.experience
      },
      hrDetails: {
        designation: data.designation,
        employeeType: data.employeeType,
        salary: data.salary,
        grade: data.grade,
        employeeId: data.employeeId
      }
    });

    // Clear and re-add qualifications
    this.qualifications.clear(); // Remove existing blank row

    data.qualifications.forEach((q: any) => {
      this.qualifications.push(this.fb.group({
        course: [q.courseName],
        year: [q.yearOfPassing],
        institution: [q.institutionName],
        marks: [q.marksPercentage]
      }));
    });
    
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

  removeQualification(index: number): void {
  this.qualifications.removeAt(index);
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
    this,this.employeeForm.markAllAsTouched();
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
      if (this.actiontype == 'create') {

        this.personalService.postpersonalbanking(payload).subscribe(
          (resp: any) => {
            console.log(resp);
            alert('Form submitted successfully!');
             this.router.navigate(['/branchbanking']);
          },
          (error) => {
            console.error('Submission failed:', error);
            alert('Submission failed!');
          }
        )
      } else if (this.actiontype == 'update') {
        this.personalService.updateEmployee(this.employeeId, payload ).subscribe(
          (resp: any) =>{
            console.log(resp);
            alert('from submitted successfully!');
            // Navigate back to branch banking page
            this.router.navigate(['/branchbanking']);
          },
          (error) => {
            console.error('Submission failed:', error);
            alert('Submission failed!');
          }
          
        )

      };
    }
    
    else {

      
      alert('Please fill all required fields correctly.');
    }

  }


get personalDetails() {
  return this.employeeForm.get('personalDetails') as FormGroup;
}

}


