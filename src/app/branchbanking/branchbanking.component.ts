import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { branchService } from './branchbankingservice';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-branchbanking',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './branchbanking.component.html',
  styleUrls: ['./branchbanking.component.css'],
  providers: [branchService]
})
export class BranchbankingComponent implements OnInit {
  employees: any;

  constructor(private router: Router, private branchbankingservice: branchService) { }

  ngOnInit(): void {
    this.getPersonalBanking();
  }


  getPersonalBanking() {
    this.branchbankingservice.getersonalbanking().subscribe((data: any) => {
      this.employees = data
      console.log(data)
    })

  }

  // onView(emp: any) {
  //   console.log('Navigating to view page for employee:', emp);
  //   this.router.navigate(['/view-employee', emp.employeeId]);
  // }

  onAddNew() {
    console.log('Navigating to add new employee form...');
    this.router.navigate(['/branchnew']);
  }

  selectAddnew(department: string) {
    console.log('Selected Department:', department);
    this.router.navigate([department]);
  }

  selectView(department: string) {
    console.log('Selected Department:', department);
    this.router.navigate([department]);
  }

  onView(employeeId: string) {
    this.router.navigate(['/personalbanking', employeeId]);
  }

  onDelete(employeeId: string) {
    console.log(employeeId)
    this.branchbankingservice.deleteEmployee(employeeId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.getPersonalBanking();
        console.log(data);

      }

    },
      (error) => {
        console.log("Error something went wrong")
      })
  }




}
