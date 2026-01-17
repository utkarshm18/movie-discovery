import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit(): void {
    const img = this.el.nativeElement as HTMLImageElement;
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement;
            if (lazyImage.dataset['src']) {
              lazyImage.src = lazyImage.dataset['src'];
              lazyImage.removeAttribute('data-src');
            }
            observer.unobserve(lazyImage);
          }
        });
      });

      observer.observe(img);
    } else {
      // Fallback for older browsers
      if (img.dataset['src']) {
        img.src = img.dataset['src'];
      }
    }
  }
}


