import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';

import { ErrorObject } from 'app/core/models';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {
  errorObject = of(
    new ErrorObject({
      type: 'E',
      errorTitle: 'Page not found',
      errorDescription: 'Sorry, the page you are looking for is not found. Please verify the URL.'
    })
  );
  constructor() {}

  ngOnInit() {}
}
