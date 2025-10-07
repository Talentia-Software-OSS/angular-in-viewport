import { NgModule } from '@angular/core';
import { InViewportDirective } from './in-viewport.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [ CommonModule],
  declarations: [ InViewportDirective ],
  exports: [ InViewportDirective ]
})
export class InViewportModule { }
