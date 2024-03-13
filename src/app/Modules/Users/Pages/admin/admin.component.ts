import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Products/Services/product.service';
import { ScaleType } from '@swimlane/ngx-charts';
import { ProductMessageService } from '../../../Products/Messages/product-message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3FC060']
  };

  allProducts: any[] = [];
  view: [number, number] = [700, 400];
  chartData: any[] = [];

  constructor(private productService: ProductService, private msgService: ProductMessageService) {}

  ngOnInit(): void {
    this.fetchAllProductInstances();
  }

  // Fetch all product instances from the product service
  fetchAllProductInstances(): void {
    this.productService.getAllProductInstances().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.products) {
          this.allProducts = response.products;
          this.prepareChartData();
        } else {
          console.error('Failed to load product instances', response.message);
          this.allProducts = []; // Reset to avoid template errors
        }
      },
      error: (error) => {
        console.error('Error fetching product instances', error);
      },
    });
  }

  // Prepare the chart data based on the fetched products
  prepareChartData(): void {
    const productQuantities: { [name: string]: number } = {};
    
    // Sum up the quantities for each product
    this.allProducts.forEach(product => {
      if (!productQuantities[product.name]) {
        productQuantities[product.name] = 0;
      }
      productQuantities[product.name] += product.quantity;
    });

    // Prepare the chart data
    this.chartData = Object.keys(productQuantities).map(name => {
      return { name: name, value: productQuantities[name] };
    });
    this.chartData.sort((a, b) => b.value - a.value);
  }

  // Delete the selected products
  deleteSelectedProducts(): void {
    const selectedProductIds = this.allProducts.filter(product => product.selected).map(product => product.prod_id);
    console.log('Selected product IDs for deletion:', selectedProductIds);

    if (selectedProductIds.length > 0) {
      this.productService.deleteSelectedProducts(selectedProductIds).subscribe({
        next: (response) => {
          console.log('Raw backend response:', response);
          let parsedResponse = response;
          
          // If response is a string, attempt to parse it
          if (typeof response === 'string') {
            try {
              parsedResponse = JSON.parse(response);
            } catch (error) {
              console.error('Error parsing response:', error);
              return;
            }
          }

          if (parsedResponse.status === 'success') {
            console.log('Products deleted successfully');
            this.fetchAllProductInstances();
            this.msgService.showProductDeleted();
          } else {
            console.error('Failed to delete products:', parsedResponse.message || 'No error message provided');
          }
        },
        error: (error) => {
          console.error('Error deleting products:', error);
        },
      });
    } else {
      console.error('No products selected for deletion');
    }
  }

  // Confirm the deletion of selected products
  confirmDelete(): void {
    const confirmation = confirm('Are you sure you want to delete the selected product(s)?');
    if (confirmation) {
      // Proceed with deletion only if the user confirms
      this.deleteSelectedProducts();
    }
  }
}
