import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PaidInterface } from 'src/app/interface/paid.interface';
import Swal from 'sweetalert2';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-status-order',
  templateUrl: './status-order.component.html',
  styleUrls: ['./status-order.component.css'],
})
export class StatusOrderComponent implements OnInit {
  public numOperation: number = 0;
  public resultOperation: Array<any> = [];
  public newPaid: boolean = false;
  public continuePaid: boolean = false;
  public spinnerShow: boolean = false;
  public urlReturnPaid: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinnerShow = true;
    let idOrder = this.activatedRoute.snapshot.paramMap.get('id');
    this.statusOperation(idOrder);
  }

  /**
   * Permite consultar las ordenes por ID
   * @param idOrder id de la orden
   */
  statusOperation(idOrder: any) {
    this.apiService.getOrdersId(idOrder).subscribe((rsp: any) => {
      console.log(rsp);
      this.spinnerShow = false;      
      this.numOperation = rsp.status.status.length;
      if (this.numOperation > 0) {

        this.updateStatusOrder(rsp.status.status, idOrder);
        if(rsp.status.status=="REJECTED"){
          this.newPaid = true;
        }
        if(rsp.status.status=="PENDING"){
          this.continuePaid = true;
          this.getURlReturnPaid(idOrder);
        }
        this.resultOperation.push({
          transaction_state: rsp.status.status,
          name: (rsp.request.buyer) ? rsp.request.buyer.name : '',
          email: (rsp.request.buyer) ? rsp.request.buyer.email : '',
          mobile: (rsp.request.payer) ? rsp.request.payer.mobile : '',
          nro_order: rsp.requestId,
          message: rsp.status.message,
          date: rsp.status.date,
          amount: (rsp.request.payment) ? rsp.request.payment.amount.total : '',
          document_type: (rsp.request.buyer) ? rsp.request.buyer.documentType : '',
          document: (rsp.request.buyer) ? rsp.request.buyer.document : '',
        });
      } else {
        Swal.fire({
          title: 'No se encontrarón detalles de la transacción',
          icon: 'info',
          confirmButtonColor: '#00acc1',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }

  /**
   * Permite redirigir a la pagina de inicio
   */
  back() {
    this.router.navigate(['/']);
  }

  /**
   * Permite retornar el color del texto segun el estado
   * @param status estado de la transaccion
   * @returns 
   */
  getColor(status: string) {
    switch (status) {
      case 'PAYED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'CREATED':
        return 'coral';
      default:
        return 'coral';
    }
  }

  /**
   * Permite actualziar el estado de la orden 
   * @param idOrder id de la transaccion
   * @param status estado de la transaccion
   */
  updateStatusOrder(status: string, idOrder: any) {
    this.apiService.updateStatusOrdersId(idOrder, status).subscribe((rsp: any) => {
      // console.log(rsp);
    });

  }
  
  /**
   * Permite enviar una nueva peticion de pago cuando el primer pago fue rechazado
   */
  newpaid() {
    let data: PaidInterface;
    
    data = {
      custumer_ducument_type : this.resultOperation[0].document_type,
      custumer_ducument : this.resultOperation[0].document,
      custumer_email : this.resultOperation[0].email,
      custumer_name : this.resultOperation[0].name,
      custumer_mobile : this.resultOperation[0].mobile,
      status : 'CREATED',
    };

    this.apiService.createOrder(data).subscribe(data => {
      if(data.result.status.status === 'FAILED'){
        Swal.fire({
          title: data.result.status.message,
          icon: 'info',
          confirmButtonColor: '#00acc1',
          confirmButtonText: 'Aceptar',
        });
      }

      if(data.result.status.status === 'OK'){
        document.location.href = data.result.processUrl;
      }

    });
  }

  /**
   * Permite consultar la url en la base de datos para retornar al pago pendiente
   * @param idOrder 
   */
  getURlReturnPaid(idOrder: any){
    this.apiService.getURlReturnPaid(idOrder).subscribe((rsp: any) => {
      console.log(rsp);
      
      this.urlReturnPaid = rsp.result.process_url;
    });
  }

  /**
   * Permite enviar una nueva peticion de pago cuando el primer pago fue rechazado
   */
  continuepaid() {
    document.location.href = this.urlReturnPaid;
  }
}
