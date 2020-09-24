import * as env from "@ygg/env/environments.json";
import { get } from 'lodash';

export function getEnv(path: string, defaultValue: any = null): any {
  // console.log(env);
  return get((env as any).default, path, defaultValue);
}