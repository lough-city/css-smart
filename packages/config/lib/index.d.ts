import { IGit, IPackage } from './typings';
interface Config {
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
        mount?: (params: {
            pack: IPackage;
            git: IGit;
        }) => any;
        func?: (params: {
            name: 'VariableCompletion' | 'VariableCodelens' | 'ClassNameCompletion' | 'FileSkip';
            event: 'show' | 'use';
            value?: string;
            branchId: string;
            targetValue: string;
            pack: IPackage;
            git: IGit;
        }) => any;
    };
}
export declare const defineConfig: (config: Partial<Config>) => Partial<Config>;
export {};
