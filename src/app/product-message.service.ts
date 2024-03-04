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
}