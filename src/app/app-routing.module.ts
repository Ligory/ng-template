import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { RouteActivator, AppResolver } from 'app/core/services/gaurds-and-resolvers';

const routes: Routes = [
  {
    path: 'index.html',
    component: HomeComponent,
    canActivate: [RouteActivator],
    resolve: {
      user: AppResolver
    },
    data: {
      state: 'home',
      title: 'Title'
    }
  },
  {
    path: '',
    redirectTo: '/index.html',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
