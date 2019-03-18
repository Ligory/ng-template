import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from 'app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  iconSet = this.appService.iconSet;

  constructor(private router: Router, private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit() {}
}
