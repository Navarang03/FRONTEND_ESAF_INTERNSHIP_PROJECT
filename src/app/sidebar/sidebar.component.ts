import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router:Router){
    
  }


selectDepartment(dept: string) {
    console.log('Selected Department:', dept);
    this.router.navigate([dept])
    // You can use a shared service or Output event to notify the parent component
  }
}