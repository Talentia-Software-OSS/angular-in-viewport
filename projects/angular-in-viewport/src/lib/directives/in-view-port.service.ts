import { Injectable } from '@angular/core';
import { Subject, filter, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InViewportService {
  private options: any;
  private callback: Subject<IntersectionObserverEntry>;
  private observer: IntersectionObserver;
  
  constructor() {
    this.options = { rootMargin: '0px 0px 0px 0px', threshold: [0.5] };
    this.callback = new Subject();
    this.observer = new IntersectionObserver(this.handler.bind(this), this.options);
   }

   private handler(entries: IntersectionObserverEntry[] = []) {
    const _this = this;
    entries.forEach((entry: IntersectionObserverEntry) => { 
      return _this.callback.next(entry); 
    });
   }

   observe(element: any) {
    const _this = this;
    this.observer.observe(element);
    return this.callback.asObservable().pipe(
      filter(function(entry) { 
        return entry.target === element; 
      }), 
      finalize(function() {
       return _this.observer.unobserve(element); 
      }));
   }

}
