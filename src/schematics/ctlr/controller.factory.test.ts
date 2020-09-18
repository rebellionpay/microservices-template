import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ControllerOptions } from './controller.schema';

describe('Controller Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should manage name only', async () => {
    const options: ControllerOptions = {
      name: 'foo',
      skipImport: true,
      pure: false,
      spec: false,
      flat: false,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;

    expect(
      files.find(filename => filename === '/foo/foo.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/foo/foo.controller.spec.ts'),
    ).not.toBeDefined();
    expect(tree.readContent('/foo/foo.controller.ts')).toEqual(
      "import { Controller, UseInterceptors } from '@nestjs/common';\n" +
      "import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';\n" +
      "import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';\n" +
      "\n" +
      "@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)\n" +
      "@Controller('foo')\n" +
      "export class FooController {}"
    );
  });

  it('should manage pure app', async () => {
    const options: ControllerOptions = {
      name: 'foo',
      skipImport: true,
      pure: true,
      spec: false,
      flat: false,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;

    expect(
      files.find(filename => filename === '/foo/foo.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/foo/foo.controller.spec.ts'),
    ).not.toBeDefined();
    expect(tree.readContent('/foo/foo.controller.ts')).toEqual(
      "import { Controller } from '@nestjs/common';\n" +
      "\n" +
      "@Controller('foo')\n" +
      "export class FooController {}"
    );
  });


  it('should manage name has a path', async () => {
    const options: ControllerOptions = {
      name: 'bar/foo',
      skipImport: true,
      pure: false,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar/foo/foo.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/bar/foo/foo.controller.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar/foo/foo.controller.ts')).toEqual(
      "import { Controller, UseInterceptors } from '@nestjs/common';\n" +
      "import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';\n" +
      "import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';\n" +
      "\n" +
      "@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)\n" +
      "@Controller('foo')\n" +
      "export class FooController {}"
    );
  });
  it('should manage name and path', async () => {
    const options: ControllerOptions = {
      name: 'foo',
      path: 'bar',
      skipImport: true,
      pure: false,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar/foo/foo.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/bar/foo/foo.controller.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar/foo/foo.controller.ts')).toEqual(
      "import { Controller, UseInterceptors } from '@nestjs/common';\n" +
      "import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';\n" +
      "import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';\n" +
      "\n" +
      "@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)\n" +
      "@Controller('foo')\n" +
      "export class FooController {}"
    );
  });
  it('should manage name to dasherize', async () => {
    const options: ControllerOptions = {
      name: 'fooBar',
      skipImport: true,
      pure: false
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo-bar/foo-bar.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(
        filename => filename === '/foo-bar/foo-bar.controller.spec.ts',
      ),
    ).toBeDefined();
    expect(tree.readContent('/foo-bar/foo-bar.controller.ts')).toEqual(
      "import { Controller, UseInterceptors } from '@nestjs/common';\n" +
      "import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';\n" +
      "import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';\n" +
      "\n" +
      "@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)\n" +
      "@Controller('foo-bar')\n" +
      "export class FooBarController {}"
    );
  });
  it('should manage path to dasherize', async () => {
    const options: ControllerOptions = {
      name: 'barBaz/foo',
      skipImport: true,
      pure: false
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('ctlr', options).toPromise<UnitTestTree>();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar-baz/foo/foo.controller.ts'),
    ).toBeDefined();
    expect(
      files.find(
        filename => filename === '/bar-baz/foo/foo.controller.spec.ts',
      ),
    ).toBeDefined();
    expect(tree.readContent('/bar-baz/foo/foo.controller.ts')).toEqual(
      "import { Controller, UseInterceptors } from '@nestjs/common';\n" +
      "import { MetricsInterceptor } from '../interceptors/MetricsInterceptor';\n" +
      "import { InjectMetadataInterceptor } from '../interceptors/InjectMetadataInterceptor';\n" +
      "\n" +
      "@UseInterceptors(MetricsInterceptor, InjectMetadataInterceptor)\n" +
      "@Controller('foo')\n" +
      "export class FooController {}"
    );
  });
});