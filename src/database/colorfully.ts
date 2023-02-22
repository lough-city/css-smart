import * as vscode from 'vscode';
import { join } from 'path';
import { getWorkspaceRootPath } from '../util/path';
import { ColorfullyConfig } from 'colorfully';
import { IVariable } from '../typings';
import { globalThemePackageConfig } from '../util/config';

export class Colorfully {
  private map: Record<string, ColorfullyConfig> = {};

  private loadThemeExport(pack: string) {
    if (this.map[pack]) return;

    const p = join(getWorkspaceRootPath(), 'node_modules', pack, 'lib/index.js');

    return import(p).then(theme => {
      this.map[pack] = theme.default.export();
    });
  }

  private options: { paths?: Array<string> } = {};

  init(parameters: { paths: Array<string> }) {
    this.options = parameters;

    return this;
  }

  async loadData() {
    for (const path of this.options.paths || []) {
      await this.loadThemeExport(path);
    }
  }

  getAll() {
    const variables: Array<IVariable & { packName: string; styleName?: string; typeName?: string }> = [];

    for (const pack in this.map) {
      const config = this.map[pack];
      if (!config) continue;
      const schema = config.schemas.find(i => i.code === 'default') || config.schemas[0];

      for (const scope in schema.map) {
        const typeCode = schema.map[scope];

        const style = config.styles.find(i => i.code === scope);
        if (!style) continue;
        let type = style.types.find(i => i.code === typeCode);
        if (!type?.variables?.length) type = style.types.find(i => !!i.variables.length);
        if (!type) continue;

        variables.push(
          ...type.variables.map(v => ({ ...v, packName: pack, styleName: style?.name, typeName: type?.name }))
        );
      }
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
      completionItem.documentation = `${variable.packName}\n${variable?.styleName} ${variable?.typeName} ${variable.name}：${variable.value}`;

      return completionItem;
    });
  }
}

const colorfullyBase = new Colorfully();

colorfullyBase.init({ paths: globalThemePackageConfig.get() });

export default colorfullyBase;
