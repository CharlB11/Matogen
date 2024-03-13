import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductMessageService {

  constructor(private toastr: ToastrService) { }

  showProductAdded(): void {
    this.toastr.success('Product successfully added');
  }

  showProductDeleted(): void {
    this.toastr.success('Product successfully deleted');
  }

  showDuplicateEmail(): void {
    this.toastr.error('Email already exists. Please choose a different email.');
  }

  showInvalidQuantity(): void {
    this.toastr.error('Invalid quantity. Please enter a value between 1 and 99.');
  }
}