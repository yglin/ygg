export abstract class Router {
  abstract navigate(commands: string[], options?: any);
  abstract navigateByUrl(url: string);
}
