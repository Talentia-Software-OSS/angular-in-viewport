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
  elements = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: `Element ${i + 1}`
  }));
  visibleIds = new Set<number>();  

  onInViewport(event: IntersectionObserverEntry, id: number): void {
    if (event.isIntersecting) {
      this.visibleIds.add(id);
    } else {
      this.visibleIds.delete(id);
    }
  }
}
