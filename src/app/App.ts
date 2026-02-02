// src/app/App.ts

import { AppState } from "./AppState";
import { Renderer } from "../renderer/Renderer";
import { InputHandler } from "../input/InputHandler";
import { LeftPanel } from "../panels/LeftPanel";
import { LineTool } from "../tools/LineTool";

interface AppOptions {
  canvas: HTMLElement;
  leftPanel: HTMLElement;
}

export class App {
  private appState: AppState;

  constructor(options: AppOptions) {
    this.appState = new AppState();

    // Renderer
    new Renderer(options.canvas, this.appState);

    // Input
    new InputHandler(options.canvas, this.appState);

    // Left panel
    new LeftPanel(this.appState);

    // TEMP: default tool (required to draw anything)
    this.appState.setActiveTool(new LineTool(this.appState));
  }
}