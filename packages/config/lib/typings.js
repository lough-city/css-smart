"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPM_LIFE_CYCLE = void 0;
var NPM_LIFE_CYCLE;
(function (NPM_LIFE_CYCLE) {
    /**
     * 准备好前
     */
    NPM_LIFE_CYCLE["prepare"] = "prepare";
    /**
     * 发布前
     */
    NPM_LIFE_CYCLE["prepublish"] = "prepublish";
    /**
     * 只是发布前
     */
    NPM_LIFE_CYCLE["prepublishOnly"] = "prepublishOnly";
    /**
     * 打包前
     */
    NPM_LIFE_CYCLE["prepack"] = "prepack";
    /**
     * 打包后
     */
    NPM_LIFE_CYCLE["postpack"] = "postpack";
    /**
     * 依赖改变
     */
    NPM_LIFE_CYCLE["dependencies"] = "dependencies";
})(NPM_LIFE_CYCLE = exports.NPM_LIFE_CYCLE || (exports.NPM_LIFE_CYCLE = {}));
