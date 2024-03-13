import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './Modules/Users/Pages/homepage/homepage.component';
import { AddproductsComponent } from './Modules/Products/Pages/addproducts/addproducts.component';
import { AdminComponent } from './Modules/Users/Pages/admin/admin.component';
import { AllproductsComponent } from './Modules/Products/Pages/allproducts/allproducts.component';
import { LoginComponent } from './Modules/Users/Pages/login/login.component';
import { ProfileComponent } from './Modules/Users/Pages/profile/profile.component';
import { RegisterComponent } from './Modules/Users/Pages/register/register.component';
import { AuthGuard } from './Modules/Users/Guards/auth.guard';
import {RoleGuard} from './Modules/Users/Guards/role.guard'


const routes: Routes = [
{path: 'homepage', component:HomepageComponent},
{path: 'addproducts', component:AddproductsComponent, canActivate: [AuthGuard] },
{path: 'admin', component:AdminComponent, canActivate: [RoleGuard]},
{path: 'allproducts', component:AllproductsComponent},
{path: 'login', component:LoginComponent},
{path: 'profile', component:ProfileComponent, canActivate: [AuthGuard]},
{path: 'register', component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
