import { Component } from '@angular/core';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.css']
})
export class AllproductsComponent {
  // Declare a property named 'categories' of type object
  // The object has string keys representing category names
  // Each category is an array of objects representing products
  categories: {[category: string]: any[]} = {
    // Food category with an array of product objects
    Food: [
      { name: 'Apples', imageUrl: 'assets/img/applesimg.jpg' },
      { name: 'Bread', imageUrl: 'assets/img/breadimg.jpg' },
      { name: 'Cheese', imageUrl: 'assets/img/cheeseimg.jpg' },
      { name: 'Milk', imageUrl: 'assets/img/milkimg.jpg' },
      { name: 'Eggs', imageUrl: 'assets/img/eggsimg.jpg' }
    ],
    // Clothes category with an array of product objects
    Clothes: [
      { name: 'Shirts', imageUrl: 'assets/img/shirtsimg.jpg' },
      { name: 'Pants', imageUrl: 'assets/img/pantsimg.jpg' },
      { name: 'Jackets', imageUrl: 'assets/img/jacketsimg.jpg' },
      { name: 'Socks', imageUrl: 'assets/img/socksimg.jpg' },
      { name: 'Hats', imageUrl: 'assets/img/hatimg.jpg' }
    ],
    // Medicine category with an array of product objects
    Medicine: [
      { name: 'Aspirin', imageUrl: 'assets/img/aspirinimg.jpg' },
      { name: 'Ibuprofen', imageUrl: 'assets/img/ibuprofenimg.jpg' },
      { name: 'Antibiotics', imageUrl: 'assets/img/antibioticsimg.jpg' },
      { name: 'Cough Syrup', imageUrl: 'assets/img/cough syrupimg.jpg' },
      { name: 'Band-Aids', imageUrl: 'assets/img/band-aidsimg.jpg' }
    ],
    // Household category with an array of product objects
    Household: [
      { name: 'Soap', imageUrl: 'assets/img/soapimg.jpg' },
      { name: 'Shampoo', imageUrl: 'assets/img/shampooimg.jpg' },
      { name: 'Toothpaste', imageUrl: 'assets/img/toothpasteimg.jpg' },
      { name: 'Detergent', imageUrl: 'assets/img/detergentimg.jpg' },
      { name: 'Sponges', imageUrl: 'assets/img/spongesimg.jpg' }
    ]
  };
}