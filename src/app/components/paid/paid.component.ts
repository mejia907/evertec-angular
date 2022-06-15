import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaidInterface } from '../../interface/paid.interface';
import { ApiService } from '../../services/api.service';

/**
 * Se crea un array con los tipos de documentos
 */
const documents_type = [
  {
    code: 'CC',
    name: 'Cédula de ciudadanía',
  },
  {
    code: 'CE',
    name: 'Cédula de extranjería',
  },
  {
    code: 'TI',
    name: 'Tarjeta de identidad',
  },
]

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
})
export class PaidComponent implements OnInit {

  public formPaid: FormGroup = Object.create(null);
  public isPaid: boolean = true;
  public loading: boolean = false;
  public documents_type = documents_type;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.formPaid = this.fb.group({
      custumer_ducument_type: [null, Validators.compose([Validators.required])],
      custumer_ducument: [null, Validators.compose([Validators.required])],
      custumer_name: [null, Validators.compose([Validators.required])],
      custumer_email: [null, Validators.compose([Validators.required, Validators.email])],
      custumer_mobile: [null, Validators.compose([Validators.required])]
    });
  }

  get custumer_name() {
    return this.formPaid.controls['custumer_name'];
  }

  get custumer_email() {
    return this.formPaid.controls['custumer_email'];
  }

  get custumer_mobile() {
    return this.formPaid.controls['custumer_mobile'];
  }

  get custumer_ducument_type() {
    return this.formPaid.controls['custumer_ducument_type'];
  }

  get custumer_ducument() {
    return this.formPaid.controls['custumer_ducument'];
  }

  /**
   * Permite generar el pago por la API
   * @param form Formulario de pago
   * @returns 
   */
  paid(form: PaidInterface) {
  
    if (this.formPaid.invalid) {
      return;
    }
    this.loading = true;

    this.apiService.createOrder(form).subscribe(data => {
     
      // console.log(data.result);
      if(data.result.status.status === 'FAILED'){
        alert(data.result.status.message);
      }
      if(data.result.status.status === 'OK'){
        document.location.href = data.result.processUrl;
      }
      this.loading = false;

    });
  }

  /**
   * Permite habilitar el formulario donde muestra el detalle del pago
   */
  validateData(){
    this.isPaid = !this.isPaid;
  }

  /**
   * Permite redirigir a la pagina de inicio
   */
  cancelTransaction(){
    this.isPaid = !this.isPaid;
  }

}
