import * as vscode from 'vscode';
import { join } from 'path';
import { getWorkspaceRootPath } from '../util/path';
import { ColorfullyConfig } from 'colorfully';

class ColorFilly {
  private map: Record<string, ColorfullyConfig> = {};

  initTheme(name: string) {
    if (this.map[name]) return;

    const p = join(getWorkspaceRootPath(), 'node_modules', name, 'lib/index.js');

    import(p).then(theme => {
      this.map[name] = theme.default.exportConfig();
    });
  }

  getThemeCompletionItem(name: string) {
    const config = this.map[name];
    if (!config) return [];
    const schema = config.schemas.find(i => i.code === 'default') || config.schemas[0];

    const variables: Array<vscode.CompletionItem> = [];

    for (const scope in schema.map) {
      const typeCode = schema.map[scope];

      const style = config.styles.find(i => i.code === scope);
      if (!style) continue;
      let type = style.types.find(i => i.code === typeCode);
      if (!type?.variables?.length) type = style.types.find(i => !!i.variables.length);
      if (!type) continue;

      variables.push(
        ...type.variables.map(variable => {
          const completionItem = new vscode.CompletionItem(
            variable.code,
            isNaN(parseFloat(variable.value)) ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Value
          );

          completionItem.insertText = `var(${variable.code})`;
          completionItem.detail = `${variable.code}: ${variable.value};`;
          completionItem.filterText = `${variable.code}: ${variable.value};`;
          completionItem.documentation = `${style.name} ${type?.name} ${variable.name}：${variable.value}`;

          return completionItem;
        })
      );
    }

    return variables;
  }
}

const colorfully = new ColorFilly();

export default colorfully;
