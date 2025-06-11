import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';  // ✅ Use AppComponent
import { routes } from './app/app.routes';           // ✅ Defined separately
import { AuthInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes), // ✅ Use the complete route config
  ]
}).catch(err => console.error(err));
