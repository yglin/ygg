export abstract class Router {
  abstract navigate(commands: string[]);
  abstract navigateByUrl(url: string);
}
