import * as vscode from 'vscode';
import { existsSync } from 'fs';
import { IVariable } from '../typings';
import { globalPathConfig } from '../util/config';
import findCssVariables from '../util/findCssVariables';
import { getWorkspaceRootPath } from '../util/path';

class Variables {
  getAll(): Array<IVariable> {
    if (!globalPathConfig.get()) return [];
    const path = getWorkspaceRootPath() + globalPathConfig.get();
    if (!existsSync(path)) return [];

    const map = Object.assign({}, findCssVariables(path, path.split('.')?.[1] || 'css'));

    return Object.keys(map).map(code => ({ code, value: map[code] }));
  }

  getAllCompletionItems() {
    return this.getAll().map(variable => {
      const completionItem = new vscode.CompletionItem(
        variable.code,
        isNaN(parseFloat(variable.value)) ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Value
      );

      completionItem.insertText = `var(${variable.code})`;
      completionItem.detail = `${variable.code}: ${variable.value};`;
      completionItem.filterText = `${variable.code}: ${variable.value};`;
      completionItem.documentation = variable.value;

      return completionItem;
    });
  }
}

const variableBase = new Variables();

export default variableBase;
