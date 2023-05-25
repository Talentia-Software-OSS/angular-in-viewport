import { NgModule } from '@angular/core';
import { InViewportDirective } from './in-view-port.directive';

@NgModule({
  declarations: [ InViewportDirective ],
  exports: [ InViewportDirective ]
})
export class InViewportModule { }
