import * as vscode from 'vscode';
import { join } from 'path';
import { getWorkspaceRootPath } from '../util/path';
import { ColorfullyConfig } from 'colorfully';
import { globalThemePackageConfig } from '../util/config';
import { IVariable } from '../typings';

class Colorfully {
  private map: Record<string, ColorfullyConfig> = {};

  initTheme(name: string) {
    if (this.map[name]) return;

    const p = join(getWorkspaceRootPath(), 'node_modules', name, 'lib/index.js');

    import(p).then(theme => {
      this.map[name] = theme.default.export();
    });
  }

  getAll() {
    const themePackage = globalThemePackageConfig.get();
    const config = this.map[themePackage];
    if (!config) return [];
    const schema = config.schemas.find(i => i.code === 'default') || config.schemas[0];

    const variables: Array<IVariable & { styleName?: string; typeName?: string }> = [];

    for (const scope in schema.map) {
      const typeCode = schema.map[scope];

      const style = config.styles.find(i => i.code === scope);
      if (!style) continue;
      let type = style.types.find(i => i.code === typeCode);
      if (!type?.variables?.length) type = style.types.find(i => !!i.variables.length);
      if (!type) continue;

      variables.push(...type.variables.map(v => ({ ...v, styleName: style?.name, typeName: type?.name })));
    }

    return variables;
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
      completionItem.documentation = `${variable?.styleName} ${variable?.typeName} ${variable.name}：${variable.value}`;

      return completionItem;
    });
  }
}

const colorfullyBase = new Colorfully();

export default colorfullyBase;
