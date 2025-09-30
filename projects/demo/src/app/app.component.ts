import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Talentia InViewport Directive';
  debugInfo = '';
  showElement = false;
  
  show(event: Partial<IntersectionObserverEntry>) {
    if (event && event.intersectionRatio && event.intersectionRatio >= 0.5) {
      const element = event.target as Element;
      this.debugInfo = `Element block with id "${element.id}" is in viewport (timestamp: ${Date.now()})`;
      this.showElement = true;
    }   
  }
}
