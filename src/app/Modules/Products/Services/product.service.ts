import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IApiResponse, IProduct } from '../Interfaces/Products_interface';
import { AuthService } from '../../Users/Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // URL of the backend API
  private apiUrl = 'http://localhost/warehouse/php/index.php';

  // BehaviorSubject to store and emit the list of products
  private productsSubject = new BehaviorSubject<IProduct[]>([]);

  // Observable of the products$ subject for components to subscribe to
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Retrieves all products from the backend API
  getAllProducts(): Observable<IApiResponse> {
    const payload = { action: 'getAllProducts' };
    return this.http.post<IApiResponse>(this.apiUrl, payload);
  }

  // Adds a new product to the backend API
  addProduct(productData: any): Observable<IApiResponse> {
    // Get the current user ID from the AuthService
    const id = this.authService.getCurrentUserId();
    console.log('User ID:', id);

    // Prepare the payload to send to the backend API
    const payload = {
      name: productData.productName,
      category: productData.productCategory,
      quantity: productData.productQuantity,
      id: id,
      action: 'addProduct',
    };
    console.log('Sending payload to backend:', payload);

    // Send the POST request to the backend API and log the response
    return this.http.post<IApiResponse>(this.apiUrl, payload).pipe(
      tap((response) => console.log('Received response from backend:', response))
    );
  }

  // Retrieves all product instances from the backend API
  getAllProductInstances(): Observable<IApiResponse> {
    const payload = { action: 'getAllProductInstances' };
    return this.http.post<IApiResponse>(this.apiUrl, payload).pipe(
      tap((response) =>
        console.log('Received response for all product instances:', response)
      )
    );
  }

  // Deletes selected products from the backend API
  deleteSelectedProducts(ids: number[]): Observable<any> {
    const payload = {
      action: 'deleteSelectedProducts',
      ids: ids,
    };

    // Send the POST request to the backend API with the selected product IDs and log the response
    return this.http.post(this.apiUrl, payload, { responseType: 'text' }).pipe(
      tap((response) => console.log('Received response from backend:', response))
    );
  }
}