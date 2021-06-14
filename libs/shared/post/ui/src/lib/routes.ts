import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { PostFindResolver } from './post-find-resolver.service';
import { PostResolver } from './post-resolver.service';
import { CreateComponent } from './post/create/create.component';
import { ListComponent } from './post/list/list.component';
import { ViewComponent } from './post/view/view.component';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'list',
    component: ListComponent,
    resolve: {
      posts: PostFindResolver
    }
  },
  {
    path: ':id',
    component: ViewComponent,
    resolve: {
      post: PostResolver
    }
  }
];
