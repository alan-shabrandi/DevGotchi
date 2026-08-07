import * as vscode from "vscode";

export class PetWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "devgotchi.petView";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevGotchi</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          canvas {
            image-rendering: pixelated;
            border-bottom: 2px solid var(--vscode-panel-border);
          }
        </style>
      </head>
      <body>
        <canvas id="petCanvas" width="200" height="150"></canvas>

        <script>
          const canvas = document.getElementById('petCanvas');
          const ctx = canvas.getContext('2d');

          let pet = {
            x: 80,
            y: 90,
            width: 32,
            height: 32,
            direction: 1,
            speed: 0.5,
            frame: 0,
            tick: 0
          };

          function update() {
            pet.tick++;
            
            pet.x += pet.speed * pet.direction;
            if (pet.x > canvas.width - pet.width - 10 || pet.x < 10) {
              pet.direction *= -1;
            }

            if (pet.tick % 15 === 0) {
              pet.frame = (pet.frame + 1) % 2;
            }
          }

          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(pet.x, pet.y - (pet.frame * 2), pet.width, pet.height);

            ctx.fillStyle = '#FFFFFF';
            const eyeOffset = pet.direction === 1 ? 20 : 4;
            ctx.fillRect(pet.x + eyeOffset, pet.y + 6, 6, 6);
          }

          function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
          }

          loop();
        </script>
      </body>
      </html>
    `;
  }
}
