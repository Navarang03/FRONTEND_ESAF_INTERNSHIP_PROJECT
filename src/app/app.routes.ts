import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonalbankingComponent } from './personalbanking/personalbanking.component';
import { MicrofinanceComponent } from './microfinance/microfinance.component';
import { FinanceComponent } from './finance/finance.component';
import { AssetComponent } from './asset/asset.component';

export const routes: Routes = [
    {path :'home', component:HomeComponent},
    {path :'personalbanking', component:PersonalbankingComponent},
    {path :'microfinance', component:MicrofinanceComponent},
    {path :'finance', component:FinanceComponent},
    {path :'asset', component:AssetComponent}

    
    
    
];
