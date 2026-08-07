import * as vscode from "vscode";
import { PetWebviewProvider } from "./PetWebviewProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new PetWebviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      PetWebviewProvider.viewType,
      provider,
    ),
  );
}

export function deactivate() {}
