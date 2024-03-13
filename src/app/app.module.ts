import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Router Outlet/navbar/navbar.component';
import { FooterComponent } from './Router Outlet/footer/footer.component';
import { HomepageComponent } from './Modules/Users/Pages/homepage/homepage.component';
import { RegisterComponent } from './Modules/Users/Pages/register/register.component';
import { LoginComponent } from './Modules/Users/Pages/login/login.component';
import { ProfileComponent } from './Modules/Users/Pages/profile/profile.component';
import { AllproductsComponent } from './Modules/Products/Pages/allproducts/allproducts.component';
import { AdminComponent } from './Modules/Users/Pages/admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './Modules/Users/Interceptors/jwt.interceptor';
import { AddproductsComponent } from './Modules/Products/Pages/addproducts/addproducts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


  

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomepageComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AddproductsComponent,
    AllproductsComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    CommonModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
   
    
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
