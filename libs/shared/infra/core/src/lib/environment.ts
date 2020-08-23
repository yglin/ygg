import * as env from "@ygg/env/environments.json";
import { get } from 'lodash';

export function getEnv(path: string): any {
  // console.log(env);
  return get((env as any).default, path, null);
}