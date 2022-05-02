// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { graphviz } from "@hpcc-js/wasm";
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "jac" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let viewGraphCommand = vscode.commands.registerCommand(
    "jac.viewGraph",
    async () => {
      const activeDocument = vscode.window.activeTextEditor?.document;
      const documentText = activeDocument?.getText();
      try {
        const svg = await graphviz.layout(documentText as string, "svg", "dot");

        const panel = vscode.window.createWebviewPanel(
          "jacGraph",
          "Jac Graph",
          vscode.ViewColumn.Two
        );

        panel.webview.html = getWebviewContent(svg);
      } catch (err: any) {
        vscode.window.showErrorMessage(err);
      }
    }
  );

  // run a jac file
  let generateGraphCommand = vscode.commands.registerCommand(
    "jac.run",
    async () => {
      const extension = vscode.extensions.getExtension("ms-python.python")!;
      if (!extension.isActive) {
        await extension.activate();
      }
      const pythonPath = extension.exports.settings.getInterpreterPath();
      const currentFileName =
        vscode.window?.activeTextEditor?.document?.fileName;
      const jacTerm = vscode.window.createTerminal();
      jacTerm.sendText(`jsctl jac run ${currentFileName}`);
    }
  );

  context.subscriptions.concat([viewGraphCommand, generateGraphCommand]);
}

const getWebviewContent = (graphSvg: string) => {
  return `
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
  ${graphSvg}
</body>
</html>
	`;
};

// this method is called when your extension is deactivated
export function deactivate() {}
