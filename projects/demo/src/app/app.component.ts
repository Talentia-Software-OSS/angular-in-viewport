import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewportModule } from '@talentia/angular-in-viewport';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [InViewportModule, RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Talentia InViewport Directive';
  elements = Array.from({ length: 20 }).map((_, i) => {
    return { id: i + 1, name: `Element ${i + 1}` };
  });

  onInViewport(event: Partial<IntersectionObserverEntry>) {
    if (event && event.intersectionRatio && event.intersectionRatio >= 0.5) {
      const element = event.target as Element;
      console.log(`Element with id "${element.id}" is in viewport (timestamp: ${Date.now()})`);
    }
  }
}
