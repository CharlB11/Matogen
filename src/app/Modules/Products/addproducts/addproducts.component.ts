import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '/xampp/htdocs/warehouse/src/product.service';
import { ProductMessageService } from 'C:/xampp/htdocs/warehouse/src/app/product-message.service';

@Component({
  selector: 'app-addproducts',
  templateUrl: './addproducts.component.html',
  styleUrl: './addproducts.component.css'
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
  errorMessage: string = ''; // For displaying error messages
  successMessage: string = ''; // For displaying success messages

  constructor(private fb: FormBuilder, private productService: ProductService, private msgService: ProductMessageService) {
    this.productForm = this.fb.group({
      productCategory: ['', Validators.required],
      productName: ['', Validators.required],
      productQuantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.productForm.get('productCategory')?.valueChanges.subscribe(value => {
      const productNameControl = this.productForm.get('productName');
      if (value) {
        // Ensure productNameControl is not null before calling enable()
        if (productNameControl !== null) {
          productNameControl.enable();
        }
      } else {
        // Ensure productNameControl is not null before calling disable()
        if (productNameControl !== null) {
          productNameControl.disable();
        }
      }
      this.currentProducts = this.products[value] || [];
    });
    this.fetchAllProducts();
  }
  
fetchAllProducts(): void {
  this.productService.getAllProducts().subscribe({
    next: (response) => {
      if (response.status === 'success' && response.products) {
        this.allProducts = response.products;
      } else {
        console.error('Failed to load products', response.message);
        this.allProducts = []; // Reset to avoid template errors
      }
    },
    error: (error) => {
      console.error('Error fetching products', error);
      this.errorMessage = 'Error fetching products. Please try again.';
      this.allProducts = []; // Reset to avoid template errors
    },
  });
}

onSubmit(): void {
  console.log('Form Submitted', this.productForm.value); // Log form values

  if (this.productForm.valid) {
    this.productService.addProduct(this.productForm.value).subscribe({
      next: (response: any) => {
        console.log('Product added successfully:', response); // Success log
        this.successMessage = 'Product added successfully';
        this.msgService.showProductAdded();
        
    
        if (response && response.status === 'success' && response.product) {
         
          this.allProducts.push(response.product);
        } 
        else {
          this.fetchAllProducts();
            const newProduct = {...this.productForm.value,};
          this.allProducts.push(newProduct);
        }
        
      },
      error: (error) => {
        console.error('An error occurred:', error); // Error log
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    });
  } else {
    this.errorMessage = 'Please correct the errors in the form.';
    console.error('Form is invalid:', this.productForm.errors); // Log form errors if any
  }
}
}