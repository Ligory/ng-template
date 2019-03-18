import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MdModule } from './md.module';
import { MomentModule } from 'ngx-moment';

import { MessagePageComponent } from './components/message-page/message-page.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';

@NgModule({
  imports: [CommonModule, MdModule, MomentModule],
  declarations: [MessagePageComponent, MessageBoxComponent],
  exports: [CommonModule, MdModule, MomentModule, FormsModule, HttpClientModule, MessagePageComponent, MessageBoxComponent],
  providers: []
})
export class SharedModule {}
