import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InViewportDirective } from './in-view-port.directive';
import { InViewportService } from './in-view-port.service';

@NgModule({
  imports: [ CommonModule],
  declarations: [ InViewportDirective ],
  exports: [ InViewportDirective ]
})
export class InViewportModule { }
