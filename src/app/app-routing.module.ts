import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './Modules/Users/homepage/homepage.component';
import { AddproductsComponent } from './Modules/Products/addproducts/addproducts.component';
import { AdminComponent } from './Modules/Users/admin/admin.component';
import { AllproductsComponent } from './Modules/Products/allproducts/allproducts.component';
import { LoginComponent } from './Modules/Users/login/login.component';
import { ProfileComponent } from './Modules/Users/profile/profile.component';
import { RegisterComponent } from './Modules/Users/register/register.component';
import { AuthGuard } from 'C:/xampp/htdocs/warehouse/src/app/auth.guard';
import {RoleGuard} from './role.guard'


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
