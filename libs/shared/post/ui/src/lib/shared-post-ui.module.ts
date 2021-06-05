import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './post/create/create.component';
import { routes } from './routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [CreateComponent]
})
export class SharedPostUiModule {}
