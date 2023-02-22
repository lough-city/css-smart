import { join } from 'path';
import * as vscode from 'vscode';
import { IClassName } from '../typings';
import { globalClassNameConfig } from '../util/config';
import findCssClassName from '../util/findCssClassName';
import { getWorkspaceRootPath } from '../util/path';

export class ClassName {
  private options: { paths?: Array<string> } = {};

  init(parameters: { paths: Array<string> }) {
    this.options = parameters;

    return this;
  }

  getAll(): Array<IClassName> {
    if (!this.options.paths?.length) return [];

    const map = Object.assign(
      {},
      ...this.options.paths.map(path => findCssClassName(join(getWorkspaceRootPath(), path)))
    );

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

classNameBase.init({ paths: globalClassNameConfig.get() });

export default classNameBase;
