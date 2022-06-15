import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css'],
})
export class ListOrderComponent implements OnInit {
  public displayedColumns: string[] = [
    'id',
    'ducument_type',
    'ducument',
    'name',
    'email',
    'mobile',
    'status',
  ];
  public dataSource: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.listOrder();
  }

  /**
   * Permite consultar las ordenes
   */
  listOrder() {
    this.apiService.getOrders().subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
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
}
