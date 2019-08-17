import { extend } from 'lodash';
import * as ts from 'typescript';
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
  SchematicContext,
  SchematicsException
} from '@angular-devkit/schematics';
import {
  addDeclarationToModule,
  addEntryComponentToModule,
  addExportToModule
} from '../utility/ast-utils';
import { InsertChange } from '../utility/change';
import { parseName } from '../utility/parse-name';
import { getWorkspace, buildDefaultPath } from '../utility/workspace';
import {
  buildRelativePath,
  findModuleFromOptions
} from '../utility/find-module';
import { applyLintFix } from '../utility/lint-fix';

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(
    modulePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );
}

function addDeclarationToNgModule(options: any): Rule {
  return (host: Tree) => {
    if (options.skipImport || !options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const componentPath =
      options.componentPath ||
      `/${options.path}/` +
        (options.flat ? '' : strings.dasherize(options.name) + '/') +
        strings.dasherize(options.name) +
        '.component';
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`${options.name}Component`);
    const declarationChanges = addDeclarationToModule(
      source,
      modulePath,
      classifiedName,
      relativePath
    );

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    if (options.export) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source = readIntoSourceFile(host, modulePath);

      const exportRecorder = host.beginUpdate(modulePath);
      const exportChanges = addExportToModule(
        source,
        modulePath,
        strings.classify(`${options.name}Component`),
        relativePath
      );

      for (const change of exportChanges) {
        if (change instanceof InsertChange) {
          exportRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(exportRecorder);
    }

    if (options.entryComponent) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source = readIntoSourceFile(host, modulePath);

      const entryComponentRecorder = host.beginUpdate(modulePath);
      const entryComponentChanges = addEntryComponentToModule(
        source,
        modulePath,
        strings.classify(`${options.name}Component`),
        relativePath
      );

      for (const change of entryComponentChanges) {
        if (change instanceof InsertChange) {
          entryComponentRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(entryComponentRecorder);
    }
    return host;
  };
}

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
    options.selector =
      options.selector ||
      buildSelector(options, (project && project.prefix) || '');

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
      addDeclarationToNgModule(extend({}, options, {
        name: `${options.name}-control`,
        componentPath: `/${options.path}/${strings.dasherize(options.name)}`
      })),
      addDeclarationToNgModule(extend({}, options, {
        name: `${options.name}-view`,
        componentPath: `/${options.path}/${strings.dasherize(options.name)}`
      })),
      mergeWith(templateSource),
      options.lintFix ? applyLintFix(options.path) : noop()
    ]);
  };
}
