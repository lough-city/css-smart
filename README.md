# CSS Smart

A smart css helper.

[Email](mailto:city@nanzc.com 'send to email')

[Github](https://github.com/AnCIity/css-smart 'open home in github')

[VSCode](https://marketplace.visualstudio.com/items?itemName=City.css-smart 'open home in vscode')



## Function

`vscode command` 面板可以使用 `ctrl+shift+p` 打开。

The `vscode command` panel can be opened using `ctrl+shift+p`.



### 主题包 Colorfully

> [`Colorfully`](https://www.npmjs.com/package/colorfully 'Colorfully') 主题包智能代码补全。
>
> [`Colorfully`](https://www.npmjs.com/package/colorfully 'Colorfully') Theme pack intelligent code completion.

`vscode command`: `CSS Smart: Set Global Theme Package`

`support`: `colorfully theme package`

`effect`: 

![colorfully.gif](https://raw.githubusercontent.com/AnCIity/css-smart/main/images/example/colorfully.gif)



### 变量补全 Variable Completion

> 自动检测可补全的变量。
>
> Automatically detects completable variables.

`vscode command`: `CSS Smart: Set Global Variable Path`

`support`: `.css` `.less` `.scss`

`explain`: 打开全局变量文件设置。（Open global variable file Settings.）

`effect`: 

![variable.gif](https://www.hualigs.cn/image/60641d89d8b7f.jpg)



### 变量映射 Variable  Codelens

> 自动检测可使用变量的值。
>
> Automatically detects the value of a usable variable.

`support`: `.css` `.less` `.scss`

`explain`: 读取主题包以及变量补全设置的变量进行匹配。Read Colorfully and Variable Completion Settings for variable matching.

`effect`: 

![codelens.gif](https://www.hualigs.cn/image/60641d89c6f8a.jpg)



### 类名补全 ClassName Completion

> 自动检测可提示补全的类名。
>
> Automatic detection prompts for completion of class names.

`vscode command`: `CSS Smart: Set Global Class Name`

`support`: `.jsx` `.tsx`

`explain`: 打开全局类名文件设置。（Open global class name file Settings.）

`effect`: 

![colorfully.gif](https://raw.githubusercontent.com/AnCIity/css-smart/main/images/example/classname.gif)



> 通过工作区配置我们可以很好的让配置跟随项目同步，但是如何跟随 `NPM` 包统一配置统一更新呢？
>
> Workspace configuration is a good way to synchronize the configuration with the project, but how to update it with the 'NPM' package unified configuration?



## 语言包 Language Package

为支持 `CSS Smart` 语言支持的模块化，使其可复用，更符合现代工程化规范，我们将通过以下方案进行。

In order to support the modularity supported by 'CSS Smart' language, make it reusable and more in line with modern engineering specifications, we will adopt the following scheme.



### 开发 Develop

我们可以在包（可以是你的主题包内、又或者是定制语言包）内进行以下操作：

We can do the following in a package (either in your theme package or in a custom language package) :

1. install `@css-smart/config`

   ```bash
   npm i @css-smart/config
   ```

2. create `css.smart.config.js`

   ```javascript
   const { defineLanguagePackageConfig } = require('@css-smart/config');
   
   module.exports = defineLanguagePackageConfig({
     themePackage: ['@lyrical/theme'],
     classNamePath: ['./class.css'],
     variablePath: ['./variable.css'],
     lifeCycle: {
       mount(...args) {
         console.log('mount', args);
       },
       func(...args) {
         console.log('func', args);
       }
     }
   });
   ```

3. Publish your language package.



### 使用 USE

1. install your language package.
2. `vscode command`: `CSS Smart: Set Global Language Package`



## 关于 About

相关问题请在 [ISSUES](https://github.com/AnCIity/css-smart/issues) 提出。

Related ISSUES, please put forward in [ISSUES] (https://github.com/AnCIity/css-smart/issues).

