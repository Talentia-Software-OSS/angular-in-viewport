import { Injectable } from '@angular/core';
import { filter, finalize, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InViewportService {
  private options: IntersectionObserverInit;
  private callback$: Subject<IntersectionObserverEntry>
  private observer: IntersectionObserver;

  constructor() {
    this.options = { rootMargin: '0px 0px 0px 0px', threshold: [0.5] };
    this.callback$ = new Subject<IntersectionObserverEntry>();
    this.observer = new IntersectionObserver(this.handler.bind(this), this.options);
  }

  private handler(entries: IntersectionObserverEntry[] = []): void {
    entries.forEach((entry: IntersectionObserverEntry) => this.callback$.next(entry));
  }

  observe(element: Element) {
    this.observer.observe(element);
    return this.callback$
      .asObservable()
      .pipe (
        filter((entry: IntersectionObserverEntry) => entry.target === element),
        finalize(() => this.observer.unobserve(element))
      );
  }
}

