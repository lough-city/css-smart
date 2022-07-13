import * as vscode from 'vscode';

/**
 * 获取工作空间根目录
 */
export const getWorkspaceRootPath = () => vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
