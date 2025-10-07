import { Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { InViewportService } from './in-viewport.service';
import { isPlatformBrowser } from '@angular/common';
import { filter, take } from 'rxjs';
import { untilDestroy } from '../operators/until-destroy.operator';

@Directive({
  standalone: false,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngxInViewPort]'
})
export class InViewportDirective implements OnInit, OnDestroy {
  @Input() preRender: boolean;
  @Input() oneTime: boolean;
  @Output() inViewport: EventEmitter<IntersectionObserverEntry>;

  constructor(
    private elementRef: ElementRef, 
    private viewportService: InViewportService, 
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.preRender = true;
    this.oneTime = false;
    this.inViewport = new EventEmitter();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
        if (this.oneTime) {
            this.viewportService
                .observe(this.elementRef.nativeElement)
                .pipe(
                  untilDestroy(this), 
                  filter((entry: IntersectionObserverEntry) => { 
                    return entry.intersectionRatio >= 0.5; 
                  }), 
                  take(1)
                )
                .subscribe((entry: IntersectionObserverEntry) => {
                  this.inViewport.emit(entry);
              });
        }
        else {
            this.viewportService
                .observe(this.elementRef.nativeElement)
                .pipe(untilDestroy(this))
                .subscribe((entry: IntersectionObserverEntry) => {
                  this.inViewport.emit(entry);
            });
        }
    }
    else {
      if (this.preRender) {
        const entry: Partial<IntersectionObserverEntry> = {
          isIntersecting: true, 
          intersectionRatio: 1
        };
        this.inViewport.emit(entry as IntersectionObserverEntry);
      }
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnDestroy(): void {}
}
