import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonalbankingComponent } from './personalbanking/personalbanking.component';
import { MicrofinanceComponent } from './microfinance/microfinance.component';
import { FinanceComponent } from './finance/finance.component';
import { AssetComponent } from './asset/asset.component';
import { BranchbankingComponent } from './branchbanking/branchbanking.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    // ✅ Default path redirects to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path :'signup', component:SignupComponent},
    {path :'login', component:LoginComponent},


     // ✅ Protect all below routes with authGuard
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'personalbanking', component: PersonalbankingComponent, canActivate: [authGuard] },
  { path: 'personalbanking/:id', component: PersonalbankingComponent, canActivate: [authGuard] },
  { path: 'microfinance', component: MicrofinanceComponent, canActivate: [authGuard] },
  { path: 'finance', component: FinanceComponent, canActivate: [authGuard] },
  { path: 'asset', component: AssetComponent, canActivate: [authGuard] },
  { path: 'branchbanking', component: BranchbankingComponent, canActivate: [authGuard] }
  


 


    


    
    
    
];
