import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaidInterface } from '../interface/paid.interface';
import { ResponseInterface } from '../interface/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  //URL de la API
  private _dominio = 'http://127.0.0.1:8000/api/orders/';

  constructor(private http: HttpClient) {}

  /**
   * Permite guardar la orden en la base de datos
   * @param form formulario con los datos de la orden
   * @returns Json ordenes
   */
  createOrder(form: PaidInterface): Observable<ResponseInterface> {
    form.status = 'CREATED';
    return this.http.post<ResponseInterface>(this._dominio, form);
  }

  /**
   * Permite consultar la orden en la API
   * @param id id de la orden
   * @returns Json ordenes
   */
  getOrdersId(id: any) {
    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(this._dominio + id, {
      headers: header,
    });
  }

  /**
   * Permite consultar la url del pago en la base de datos
   * @param id id de la orden
   * @returns Json ordenes
   */
  getURlReturnPaid(id: any) {
    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(this._dominio + 'db/' + id, {
      headers: header,
    });
  }

  /**
   * Permite consulta todas las ordenes en la base de datos
   * @returns Json ordenes
   */
  getOrders() {
    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(this._dominio, {
      headers: header,
    });
  }

  /**
   * Permite actualizar el estado de la orden
   * @param id id de la orden
   * @param status 
   * @returns 
   */
  updateStatusOrdersId(id: any, status: any) {
    return this.http.put<ResponseInterface>(
      this._dominio + 'update-status/' + id,
      { id: id, status: status }
    );
  }
}
