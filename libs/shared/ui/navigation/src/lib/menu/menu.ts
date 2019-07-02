import { isEmpty, values, extend } from 'lodash';
import { Image } from '@ygg/shared/types';
import { Type } from '@angular/core';
import { Route } from '@angular/router';
import { throwError } from 'rxjs';
import { __values } from 'tslib';
import { GridMenuComponent } from './grid-menu/grid-menu.component';

export interface MenuItem {
  id: string;
  link: string;
  label: string;
  icon: Image;
  tooltip: string;
  component?: Type<any>;
  children?: { [id: string]: MenuItem };
  routeConfig?: Partial<Route>;
}

export class MenuTree {
  root: MenuItem;

  constructor(root?: MenuItem) {
    if (root) {
      this.root = root;
    } else {
      this.root = {
        id: 'root',
        link: '',
        label: 'Menu Top',
        icon: null,
        tooltip: 'Back to the menu top'
      };
    }
  }

  findItem(id: string, findIn?: MenuItem): MenuItem {
    if (!findIn) {
      findIn = this.root;
    }
    if (id === findIn.id) {
      return findIn;
    }
    if (!isEmpty(findIn.children)) {
      for (const childId in findIn.children) {
        if (findIn.children.hasOwnProperty(childId)) {
          const childItem = findIn.children[childId];
          const found = this.findItem(id, childItem);
          if (found) {
            return found;
          }
        }
      }
    }
    return null;
  }

  addItem(item: MenuItem, parentId?: string) {
    let parentItem: MenuItem;
    if (parentId) {
      parentItem = this.findItem(parentId);
    }
    if (!parentItem) {
      parentItem = this.root;
    }
    if (!parentItem.children) {
      parentItem.children = {};
    }
    parentItem.children[item.id] = item;
  }

  addMenu(menu: MenuTree, parentId?: string) {
    this.addItem(menu.root, parentId);
  }

  removeItem(item: MenuItem, parentId?: string) {
    let parentItem: MenuItem;
    if (parentId) {
      parentItem = this.findItem(parentId);
    }
    if (!parentItem) {
      parentItem = this.root;
    }
    if (!parentItem.children) {
      parentItem.children = {};
    }
    if (item.id in parentItem.children) {
      delete parentItem.children[item.id];
    }
  }

  getPath(toId: string, fromId?: string): string {
    if (!fromId) {
      fromId = this.root.id;
    }
    if (fromId === toId) {
      return fromId;
    }
    const fromItem = this.findItem(fromId);
    if (fromItem && !isEmpty(fromItem.children)) {
      for (const childId in fromItem.children) {
        const subPath = this.getPath(toId, childId);
        if (subPath) {
          return fromId + '/' + subPath;
          break;
        }
      }
    }
    return null;
  }

  toRoute(item?: MenuItem): Route {
    if (!item) {
      item = this.root;
    }
    const result: Route = {
      path: item.link
    };
    if (item.routeConfig) {
      extend(result, item.routeConfig);
    }
    if (isEmpty(item.children)) {
      if (item.component) {
        result.component = item.component;
      } else {
        const error = new TypeError(`Leaf menu item should has component`);
        throwError(error);
      }
    } else {
      result.children = [];
      for (const id in item.children) {
        if (item.children.hasOwnProperty(id)) {
          const childItem = item.children[id];
          result.children.push(this.toRoute(childItem));
        }
      }
      const defaultRoute: Route = {
        path: '',
        pathMatch: 'full',
        // resolve: {
        //   menuItems: values(item.children)
        // },
        data: { menuItems: values(item.children) }
      };
      if (item.component) {
        defaultRoute.component = item.component;
      } else {
        defaultRoute.component = GridMenuComponent;
      }
      result.children.push(defaultRoute);
    }
    return result;
  }
}
