import { extend } from 'lodash';
import { strings } from '@angular-devkit/core';
import {
  chain,
  externalSchematic,
  Rule,
  Tree,
  apply,
  url,
  filter,
  applyTemplates,
  move,
  noop,
  mergeWith,
  MergeStrategy,
  SchematicContext
} from '@angular-devkit/schematics';
import { parseName } from '../utility/parse-name';
import { getWorkspace, buildDefaultPath } from "../utility/workspace";

enum Style {
  Css = "css",
  Scss = "scss",
  Sass = "sass",
  Less = "less",
  Styl = "styl"
};

function buildSelector(options: any, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export default function(options: any): Rule {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }
    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || buildSelector(options, project && project.prefix || '');

    // todo remove these when we remove the deprecations
    options.style = (
      options.style && options.style !== Style.Css
        ? options.style : options.styleext as Style
    ) || Style.Css;
    options.skipTests = options.skipTests || !options.spec;

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter(path => !path.endsWith('.spec.ts.template'))
        : noop(),
      options.inlineStyle
        ? filter(path => !path.endsWith('.__style__.template'))
        : noop(),
      options.inlineTemplate
        ? filter(path => !path.endsWith('.html.template'))
        : noop(),
      applyTemplates({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...options
      }),
      move(parsedPath.path)
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'component', extend(options, {
        name: options.name + '-control'
      })),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);
  };
}
