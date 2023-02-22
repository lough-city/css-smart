import { IGit, IPackage } from './typings';

/**
 * 语言包配置
 */
export interface LanguagePackageConfig {
  /**
   * 变量路径
   */
  variablePath: Array<string>;
  /**
   * 主题包
   */
  themePackage: Array<string>;
  /**
   * 类名路径
   */
  classNamePath: Array<string>;
  /**
   * 生命周期
   */
  lifeCycle: {
    mount?: (params: { pack: IPackage; git: IGit }) => any;
    func?: (params: {
      name: 'VariableCompletion' | 'VariableCodelens' | 'ClassNameCompletion';
      event: 'show' | 'use';
      value?: string;
      branchId: string;
      targetValue: string;
      pack: IPackage;
      git: IGit;
    }) => any;
  };
}

/**
 * 定义语言包配置
 */
export const defineLanguagePackageConfig = (config: Partial<LanguagePackageConfig>) => config;
