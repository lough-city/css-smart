export enum NPM_LIFE_CYCLE {
  /**
   * 准备好前
   */
  prepare = 'prepare',
  /**
   * 发布前
   */
  prepublish = 'prepublish',
  /**
   * 只是发布前
   */
  prepublishOnly = 'prepublishOnly',
  /**
   * 打包前
   */
  prepack = 'prepack',
  /**
   * 打包后
   */
  postpack = 'postpack',
  /**
   * 依赖改变
   */
  dependencies = 'dependencies'
}

/**
 * 作者
 */
interface Author {
  /**
   * 名称
   */
  name: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 主页
   */
  url: string;
}

/**
 * 必需配置
 */
interface RequiredConfig {
  /**
   * 名称
   */
  name: string;
  /**
   * 版本
   */
  version: string;
}

/**
 * 描述配置
 */
interface DescriptionConfig {
  /**
   * 描述
   */
  description: string;
  /**
   * 关键词
   */
  keywords: string;
  /**
   * 作者
   */
  author: string | Author;
  /**
   * 贡献者们
   */
  contributors: Array<string | Author>;
  /**
   * 主页
   */
  homepage: string;
  /**
   * 仓库
   */
  repository: {
    /**
     * 类型
     * @example "git"
     */
    type: string;
    /**
     * 地址
     */
    url: string;
    /**
     * 目录
     * @example "packages/cli"
     * @description 如果 `package.json`，不在仓库根目录中(例如，如果它是 `monorepo` 的一部分)，你可以指定它所在的目录:
     */
    directory?: string;
  };
  /**
   * 问题
   */
  bugs: string;
  /**
   * 捐助
   */
  funding: {
    /**
     * 类型
     */
    type: 'individual' | 'patreon';
    /**
     * 地址
     */
    url: string;
  };
}

/**
 * 规范配置
 */
interface NormConfig {
  /**
   * 类型
   * @description 定义 `node` 环境下，包规范是 `module` 还是 `commonjs`。
   */
  type: 'module' | 'commonjs';
  /**
   * 包含文件
   * @description 包在发布时包含的文件。
   */
  files: Array<string>;
  /**
   * 入口
   * @description 定义了 `NPM` 包的入口文件，`browser` 环境和 `node` 环境均可使用。
   */
  main: string;
  /**
   * 浏览器入口
   * @description 定义 npm 包在 browser 环境下的入口文件。
   */
  browser: string;
  /**
   * 模块入口
   * @description 定义 `NPM` 包在 `ES Module` 规范的入口文件，`browser` 环境和 `node` 环境均可使用。
   * @tripartite `构建工具`
   */
  module: string;
  /**
   * 条件导出
   * @description `NodeJS` 条件导出提供了一种根据特定条件映射到不同路径的方法。
   */
  exports: any;
  /**
   * 类型入口
   * @description 指定 `typescript` 类型入口文件，帮助包提供更好的类型服务
   * @tripartite `typescript`
   */
  types: string;
  /**
   * 分发入口
   * @description 提供一个给 [UNPKG](https://www.unpkg.com/)，用于支持 CDN 服务。
   * @tripartite `unpkg`
   */
  unpkg: string;
  /**
   * 可执行文件
   * @example {"lough": "./bin/index.js"}
   */
  bin: Record<string, string>;
  /**
   * 规范目录
   * @example {"lib": "src/lib/"}
   */
  directories: Record<string, string>;
  /**
   * 工作区
   * @description 描述了本地文件系统中的位置，安装客户端应该查找这些位置，以找到需要用符号链接到顶级 node_modules 文件夹的每个工作空间。
   */
  workspaces: Array<string>;
}

/**
 * 脚本配置
 */
interface ScriptConfig {
  /**
   * 脚本
   * @description 包含在包生命周期的不同时间运行的脚本命令。
   */
  scripts: Partial<{ [K in NPM_LIFE_CYCLE]: string }> & Record<string, string>;
  /**
   * 配置
   * @description 存在一个包含 `npm_package_config_*` 环境变量的 `start` 命令
   */
  config: Record<string, any>;
}

/**
 * 依赖配置
 */
interface DependenciesConfig {
  /**
   * 依赖
   */
  dependencies: Record<string, string>;
  /**
   * 开发依赖
   */
  devDependencies: Record<string, string>;
  /**
   * 重写依赖关系
   */
  overrides: Record<string, any>;
}

/**
 * 发布配置
 */
interface PublishConfig {
  /**
   * 私有的
   * @description 如果你在包中设置了 `true`。那么 NPM 将拒绝发布它。
   * @default false
   */
  private: boolean;
  /**
   * 发布配置
   */
  publishConfig: {
    /**
     * 注册表地址，如：`https://registry.npmjs.org/`
     */
    registry?: string;
    /**
     * 包公开还是受限私有的
     * @default 'restricted'
     */
    access?: 'restricted' | 'public';
  };
  /**
   * 许可证
   */
  license: string;
  /**
   * 操作系统
   */
  os: NodeJS.Platform;
  /**
   * 主机架构
   */
  // cpu: NodeJS.Architecture;
  /**
   * 工作环境
   */
  engines: Partial<{ node: string; npm: string }> & Record<string, string>;
}

/**
 * 第三方配置
 */
interface TripartiteConfig {
  'lint-staged': Record<string, Array<string>>;
}

/**
 * package.json
 */
export type IPackage = RequiredConfig &
  Partial<DescriptionConfig> &
  Partial<NormConfig> &
  Partial<ScriptConfig> &
  Partial<DependenciesConfig> &
  Partial<PublishConfig> &
  Partial<TripartiteConfig> &
  Partial<TripartiteConfig>;

export interface IGit {
  name: string;
  email: string;
}
