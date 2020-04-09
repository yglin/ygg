import { Routes } from '@angular/router';
import { ShoppingCartEditorComponent } from './cart/shopping-cart-editor/shopping-cart-editor.component';

export const routes: Routes = [
  {
    path: 'shopping',
    children: [{ path: 'cart', component: ShoppingCartEditorComponent }]
  }
];
