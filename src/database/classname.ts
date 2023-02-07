import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from 'path';
import { IClassName } from '../typings';
import { globalClassNameConfig } from '../util/config';
import { getWorkspaceRootPath } from '../util/path';
import findCssClassName from '../util/findCssClassName';

const findFilePath = (path: string) => {
  const isDir = fs.existsSync(join(getWorkspaceRootPath(), path));
  if (isDir) return join(getWorkspaceRootPath(), path);

  const json = JSON.parse(
    fs.readFileSync(join(getWorkspaceRootPath(), 'node_modules', path, 'package.json'), { encoding: 'utf-8' })
  );

  return join(getWorkspaceRootPath(), 'node_modules', path, json.style);
};

class ClassName {
  getAll(): Array<IClassName> {
    if (!globalClassNameConfig.get()) return [];
    const paths = globalClassNameConfig.get();
    const map = Object.assign({}, ...paths.map(path => findCssClassName(findFilePath(path))));

    return Object.keys(map).map(code => ({ code, value: map[code] }));
  }

  getAllCompletionItems() {
    return this.getAll().map(variable => {
      const completionItem = new vscode.CompletionItem(variable.code, vscode.CompletionItemKind.Variable);

      completionItem.insertText = variable.code;
      completionItem.detail = variable.code;
      completionItem.filterText = variable.code;
      completionItem.documentation = variable.value
        .replaceAll(';', '\n')
        .replaceAll(':', ': ')
        .replaceAll(`*/`, '*/\n');

      return completionItem;
    });
  }
}

const classNameBase = new ClassName();

export default classNameBase;
