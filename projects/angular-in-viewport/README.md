# @talentia/angular-in-viewport

An Angular directive to detect when an element is within the browser viewport.

## Build & Run

Run `npm run build` to build the library. The build artifacts will be stored in the `dist/angular-in-viewport` directory.
Run `npm run start` to build the library and run the demo.
Run `npm run watch` to run the library and the demo in watch mode.

## Compatibility

| @talentia/angular-in-viewport | Angular |
| ----------------------------- | ------- |
| 1.0.11                        | 21.x    |
| 1.0.10                        | 20.x    |
| 1.0.7 - 1.0.9                 | 19.x    |
| 1.0.5 - 1.0.6                 | 18.x    |
| 1.0.4                         | 17.x    |
| 1.0.2 - 1.0.3                 | 16.x    |
| 1.0.0 - 1.0.1                 | 15.x    |

## Install

```bash
npm i @talentia/angular-in-viewport
```

Import `InViewportModule` in your `NgModule` (or in the `imports` of a standalone component):

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InViewportModule } from '@talentia/angular-in-viewport';

@NgModule({
  imports: [CommonModule, InViewportModule],
  declarations: [MyComponent]
})
export class MyModule { }
```

## Usage

### InViewport Directive

**Directive selector:** ngxInViewPort

```html
<div ngxInViewPort (inViewport)="showElement=true">
  <ng-container *ngIf="showElement"> <div>Hello World!</div> </ng-container>
</div>
```

> If `entry.intersectionRatio >= 0.5` ==> `Inside Viewport` > <br/>
> If `entry.intersectionRatio < 0.5` ==> `Outside Viewport`

> lazy loading images example

```html
<div *ngFor="let image of images" ngxInViewPort [oneTime]="true" (inViewport)="show($event, image)">
  <ng-container *ngIf="image.show"> <img src="{{ image.url }}" /> </ng-container>
</div>
```

```ts
  show(event: Partial<IntersectionObserverEntry>, image: ImageItem) {
    if ((event.intersectionRatio ?? 0) >= 0.5) {
      image.show = true;
    }
  }
```

#### Flags

1. Trigger only one time : `[oneTime]="true"` use case: image loading.
2. Server-Side Rendering : By default, loads the elements on the server.
   > If you do not want to pre-render the elements in server, you can set `preRender` to false, i.e. `[preRender]="false"`

### InViewport Service

> You can use `InViewportService` itself in any Component

```typescript
import { Component, DestroyRef, ElementRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InViewportService } from '@talentia/angular-in-viewport';

@Component({
  standalone: false,
  selector: 'app-viewport-demo',
  template: '...'
})
export class ViewportDemoComponent implements OnInit {
  public constructor(
    private element: ElementRef,
    private destroyRef: DestroyRef,
    private viewportService: InViewportService
  ) {}

  public ngOnInit(): void {
    this.viewportService
      .observe(this.element.nativeElement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          this.show();
        } else {
          this.hide();
        }
      });
  }

  private show(): void {
    // => Animation
  }

  private hide(): void {
    // <= Animation
  }
}
```

## Further help

This project currently uses [Angular CLI](https://github.com/angular/angular-cli) version 21.2.25.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Reference

- [@ngx-starter-kit/ngx-utils](https://www.npmjs.com/package/@ngx-starter-kit/ngx-utils) 
- [@ngrx-utils/store](https://www.npmjs.com/package/@ngrx-utils/store)
