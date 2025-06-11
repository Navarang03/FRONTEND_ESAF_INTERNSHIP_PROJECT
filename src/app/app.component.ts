import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import this

@Component({
  selector: 'app-root',
  imports: [ CommonModule,RouterOutlet,HeaderComponent,FooterComponent,SidebarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  constructor(public router: Router) {}
  isAuthPage(): boolean {
    const route = this.router.url;
    return route === '/login' || route === '/signup';
  }
  title = 'testapp';
}
