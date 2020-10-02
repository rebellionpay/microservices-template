import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  move,
  Rule,
  template,
  url,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { Observable } from '@angular-devkit/core/node_modules/rxjs/internal/Observable'
import { prompt } from 'inquirer';
import { basename, parse } from 'path';
import {
  DEFAULT_AUTHOR,
  DEFAULT_DESCRIPTION,
  DEFAULT_VERSION,
  DEFAULT_LICENSE,
} from '../defaults';
import { ApplicationOptions } from './application.schema';
import schema from './schema';

export function main(options: ApplicationOptions): Rule {
  return (host: Tree, ctx: SchematicContext) => {
    const observer = new Observable<Tree>((observer) => {
      let path;

      prompt(schema.questions).then((answers) => {
        options = { ...answers };
        options.name = strings.dasherize(options.name);
  
        path =
          !options.directory || options.directory === 'undefined'
            ? options.name
            : options.directory;
    
        options = transform(options);
        
        return generate(options, path, ctx).toPromise<Tree>();
      }).then((tree: Tree) => {

        if(!options.persistence || (options.persistenceDB && options.persistenceDB === 'other')) {
          tree.delete(`/${path}/src/config/MongoConfigService.ts`);
          tree.delete(`/${path}/src/config/TypeOrmConfigService.ts`);
        } else if (options.persistenceDB && options.persistenceDB === 'mongodb') {
          tree.delete(`/${path}/src/config/TypeOrmConfigService.ts`);
        } else {
          tree.delete(`/${path}/src/config/MongoConfigService.ts`);
        }

        if(options.pure) {
          tree.delete(`/${path}/src/filters/ExceptionsFilter.ts`)
        }

        observer.next(tree);

        observer.complete();
      }).catch(err => {
        console.error("ERROR BUILDING THE TREE", err);
        observer.error(err);
      })
    });
  
    return observer;
  }
}

function transform(options: ApplicationOptions): ApplicationOptions {
  const target: ApplicationOptions = Object.assign({}, options);

  target.author = !!target.author ? target.author : DEFAULT_AUTHOR;
  target.description = !!target.description
    ? target.description
    : DEFAULT_DESCRIPTION;
  target.language = 'ts';
  target.name = resolvePackageName(target.name);
  target.version = !!target.version ? target.version : DEFAULT_VERSION;

  target.license = target.license || DEFAULT_LICENSE;

  target.packageManager =
    !target.packageManager || target.packageManager === 'undefined'
      ? 'npm'
      : target.packageManager;
  target.dependencies = !!target.dependencies ? target.dependencies : '';
  target.devDependencies = !!target.devDependencies
    ? target.devDependencies
    : '';

  if (target.spinnakerUrl !== undefined && target.spinnakerUrl.endsWith('/')) {
    target.spinnakerUrl = target.spinnakerUrl.slice(0, target.spinnakerUrl.length - 1);
  }

  return target;
}

function resolvePackageName(path: string) {
  const { name } = parse(path);
  if (name === '.') {
    return basename(process.cwd());
  }
  return name;
}

function generate(options: ApplicationOptions, path: string, ctx: SchematicContext): Observable<Tree> {
  return apply(url(join('./files' as Path, options.language)), [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ])(ctx) as Observable<Tree>;
}
