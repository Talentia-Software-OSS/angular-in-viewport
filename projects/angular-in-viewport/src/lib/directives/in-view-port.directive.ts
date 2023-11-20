import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, PLATFORM_ID, inject } from '@angular/core';
import { InViewportService } from './in-view-port.service';
import { isPlatformBrowser } from '@angular/common';
import { filter, take } from 'rxjs';
import { untilDestroy } from '../operators/until-destroy.operator';

@Directive({
  selector: '[ngxInViewPort]'
})
export class InViewportDirective implements OnInit, OnDestroy {
  @Input() preRender: boolean;
  @Input() oneTime: boolean
  @Output() inViewport: EventEmitter<any>;

  private elementRef: ElementRef;
  private inViewportService: InViewportService;
  private isBrowser: boolean;
  
  constructor() {
    const platformId = inject<string>(PLATFORM_ID);    
    this.elementRef = inject<ElementRef<Element>>(ElementRef);
    this.inViewportService = inject(InViewportService);
    this.isBrowser = isPlatformBrowser(platformId);
    this.preRender = true;
    this.oneTime = false;
    this.inViewport = new EventEmitter();
  }
  
  ngOnInit(): void {
    const _this = this;
    if (this.isBrowser) {
        if (this.oneTime) {
            this.inViewportService
                .observe(this.elementRef.nativeElement)
                .pipe(
                  untilDestroy(this), 
                  filter((entry: any) => { 
                    return entry.intersectionRatio >= 0.5; 
                  }), 
                  take(1)
                )
                .subscribe((entry) => {
                  _this.inViewport.emit(entry);
              });
        }
        else {
            this.inViewportService
                .observe(this.elementRef.nativeElement)
                .pipe(untilDestroy(this))
                .subscribe((entry: any) => {
                  _this.inViewport.emit(entry);
            });
        }
    }
    else {
        if (this.preRender) {
            this.inViewport.emit({ isIntersecting: true, intersectionRatio: 1 });
        }
    }
  }

  ngOnDestroy(): void {
    
  }
}

