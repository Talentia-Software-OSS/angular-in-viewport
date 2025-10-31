import { Directive, ElementRef, OnInit, PLATFORM_ID, DestroyRef, inject, EventEmitter, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InViewportService } from './in-viewport.service';

@Directive({
  standalone: false,
  selector: '[ngxInViewPort]'
})
export class InViewportDirective implements OnInit {
  @Input() preRender = true;
  @Input() oneTime = false;
  @Output() inViewport = new EventEmitter<IntersectionObserverEntry>();

  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);
  private viewportService = inject(InViewportService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.oneTime) {
        this.viewportService
          .observe(this.elementRef.nativeElement)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            filter((entry: IntersectionObserverEntry) => entry.intersectionRatio >= 0.5),
            take(1)
          )
          .subscribe((entry: IntersectionObserverEntry) => {
            this.inViewport.emit(entry);
          });
      }
      else {
        this.viewportService
          .observe(this.elementRef.nativeElement)
          .pipe(takeUntilDestroyed(this.destroyRef))
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
}
