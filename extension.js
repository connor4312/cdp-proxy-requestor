const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'js-debug-proxy-requestor.getProxy',
    async () => {
      const session = vscode.debug.activeDebugSession;
      if (!session) {
        vscode.window.showErrorMessage('No active debug session');
        return;
      }

      try {
        const addr = await vscode.commands.executeCommand(
          'extension.js-debug.requestCDPProxy',
          session.id,
        );
        const formed = `ws://${addr.host}:${addr.port}${addr.path || ''}`;
        vscode.env.clipboard.writeText(formed);
        vscode.window.showInformationMessage(`Address copied to your clipboard (${formed})`);
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
      }
    },
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
