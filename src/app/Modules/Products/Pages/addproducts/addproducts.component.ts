import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { ProductMessageService } from '../../Messages/product-message.service';

@Component({
  selector: 'app-addproducts',
  templateUrl: './addproducts.component.html',
  styleUrls: ['./addproducts.component.css']
})
export class AddproductsComponent implements OnInit {
  productForm: FormGroup;
  allProducts: any[] = [];
  productCategories: string[] = ['Food', 'Clothes', 'Medicine', 'Household'];
  products: { [key: string]: string[] } = {
    Food: ['Apples', 'Bread', 'Cheese', 'Milk', 'Eggs'],
    Clothes: ['Shirts', 'Pants', 'Jackets', 'Socks', 'Hat'],
    Medicine: ['Aspirin', 'Ibuprofen', 'Antibiotics', 'Cough Syrup', 'Band-Aids'],
    Household: ['Soap', 'Shampoo', 'Toothpaste', 'Detergent', 'Sponges']
  };
  currentProducts: string[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private msgService: ProductMessageService
  ) {
    this.productForm = this.fb.group({
      productCategory: ['', Validators.required],
      productName: ['', Validators.required],
      productQuantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to changes in the productCategory form control
    this.productForm.get('productCategory')?.valueChanges.subscribe(value => {
      const productNameControl = this.productForm.get('productName');
      if (productNameControl) {
        value ? productNameControl.enable() : productNameControl.disable();
      }
      this.currentProducts = this.products[value] || [];
    });

    // Fetch all products on component initialization
    this.fetchAllProducts();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const quantity = this.productForm.get('productQuantity')?.value;

      if (quantity < 1 || quantity > 99) {
        this.msgService.showInvalidQuantity();
        return;
      }

      // Add the product using the product service
      this.productService.addProduct(this.productForm.value).subscribe({
        next: (response: any) => {
          this.successMessage = 'Product added successfully';
          this.msgService.showProductAdded();
          this.fetchAllProducts();
        },
        error: (error) => {
          console.error('An error occurred:', error);
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
    }
  }

  fetchAllProducts(): void {
    // Fetch all products using the product service
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.products) {
          this.allProducts = response.products;
        } else {
          console.error('Failed to load products', response.message);
          this.allProducts = [];
        }
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.errorMessage = 'Error fetching products. Please try again.';
        this.allProducts = [];
      },
    });
  }
}