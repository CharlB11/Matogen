import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, Product } from './models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost/warehouse/php/index.php';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse> {
    const payload = { action: 'getAllProducts' };
    return this.http.post<ApiResponse>(this.apiUrl, payload);
  }

// productService addProduct method
addProduct(productData: any): Observable<any> {
  const payload = {
    name: productData.productName, 
    category: productData.productCategory, 
    quantity: productData.productQuantity, 
    action: 'addProduct'
  };
  console.log('Sending payload to backend:', payload);

  return this.http.post(this.apiUrl, payload, { responseType: 'text' }).pipe(
    tap(response => console.log('Received response from backend:', response)) // Log the response
  );
}
getAllProductInstances(): Observable<ApiResponse> {
  const payload = { action: 'getAllProductInstances' };
  return this.http.post<ApiResponse>(this.apiUrl, payload).pipe(
    tap(response => console.log('Received response for all product instances:', response))
  );
}

deleteSelectedProducts(ids: number[]): Observable<any> {
  const payload = {
    action: 'deleteSelectedProducts',
    ids: ids
  };
  return this.http.post(this.apiUrl, payload, { responseType: 'text' })
    .pipe(tap(response => console.log('Received response from backend:', response)));
    
}



 
}