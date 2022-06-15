import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListOrderComponent } from './components/list-order/list-order.component';
import { PaidComponent } from './components/paid/paid.component';
import { StatusOrderComponent } from './components/status-order/status-order.component';

const routes: Routes = [
  {
    path: 'status-order/:id',
    component: StatusOrderComponent
  },
  {
    path: 'list-order',
    component: ListOrderComponent
  },
  {
    path: '',
    component: PaidComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
