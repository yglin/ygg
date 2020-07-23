export abstract class Router {
  abstract navigate(commands: string[], options?: { queryParams?: any });
  abstract navigateByUrl(url: string);
}
