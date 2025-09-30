# @talentia/angular-in-viewport

A lightweight library for Angular that detects when an element is within the browser viewport.

## Build & Run

Run `npm run build` to build the library. The build artifacts will be stored in the `dist/angular-in-viewport` directory.
Run `npm run start` to build the library and run the demo.
Run `npm run watch` to run the in watch mode the library and demo.

## Install

```bash
npm i @talentia/angular-in-viewport
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
    if (event.intersectionRatio >= 0.5) {
      image.show = true;
    }
  }
```

#### Flags

1. Trigger only one time : `[oneTime]="true"` use case: image loading.
2. Server-Side Rendering : By default, loads the elements on the server.
   > If you do not want to pre-render the elements in server, you can set `preRender to false. i.e.,`[preRender]="false"`

### InViewport Service

> You can use `InViewportService` itself in any Component

```typescript
import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { untilDestroy, InViewportService } from '@talentia/angular-in-viewport';

export class ViewportDemoComponent implements OnInit, OnDestroy {
  public constructor(private element: ElementRef, private viewportService: InViewportService) {}

  public ngOnInit(): void {
    this.viewportService
      .observe(this.element.nativeElement)
      .pipe(untilDestroy(this))
      .subscribe((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          this.show();
        } else {
          this.hide();
        }
      });
  }

  ngOnDestroy() {}

  private show(): void {
    // => Animation
  }

  private hide(): void {
    // <= Animation
  }
}
```

## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.14.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Reference

- [@ngx-starter-kit/ngx-utils](https://www.npmjs.com/package/@ngx-starter-kit/ngx-utils) 
- [@ngrx-utils/store](https://www.npmjs.com/package/@ngrx-utils/store)
