import { trigger, animate, style, query, transition, AnimationTriggerMetadata } from '@angular/animations';

export const routerTransition: AnimationTriggerMetadata = trigger('routerTransition', [
  transition('* <=> *', [
    // Initial state of new route
    query(
      ':enter',
      style({
        position: 'fixed',
        width: '100%',
        transform: 'translateX(-100%)'
      }),
      { optional: true }
    ),

    // move page off screen right on leave
    query(
      ':leave',
      animate(
        '0.25s ease',
        style({
          position: 'fixed',
          width: '100%',
          transform: 'translateX(100%)'
        })
      ),
      { optional: true }
    ),

    // move page in screen from left to right
    query(
      ':enter',
      animate(
        '0.25s ease',
        style({
          opacity: 1,
          transform: 'translateX(0%)'
        })
      ),
      { optional: true }
    )
  ])
]);
