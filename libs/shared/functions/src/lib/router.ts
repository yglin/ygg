import { Router } from '@ygg/shared/infra/core';

export class RouterFunctions extends Router {
  navigate(commands: string[], options?: { queryParams?: any; }) {
    throw new Error("Method not implemented.");
  }
  navigateByUrl(url: string) {
    throw new Error("Method not implemented.");
  }
}