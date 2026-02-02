// src/input/InputHandler.ts

import { AppState } from "../app/AppState";
import { Point } from "../shapes/base/ShapeTypes";

export class InputHandler {
  private appState: AppState;
  private container: HTMLElement;

  constructor(container: HTMLElement, appState: AppState) {
    this.container = container;
    this.appState = appState;

    this.bindEvents();
  }

  /* Event binding        */
  private bindEvents(): void {
    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mouseup", this.onMouseUp);

    this.container.addEventListener("dblclick", this.onDoubleClick);
  }

  private onMouseDown = (event: MouseEvent): void => {
    const tool = this.appState.activeTool;
    if (!tool) return;

    tool.onMouseDown(this.getMousePosition(event));
  };

  private onMouseMove = (event: MouseEvent): void => {
    const tool = this.appState.activeTool;
    if (!tool) return;

    tool.onMouseMove(this.getMousePosition(event));
  };

  private onMouseUp = (event: MouseEvent): void => {
    const tool = this.appState.activeTool;
    if (!tool) return;

    tool.onMouseUp(this.getMousePosition(event));
  };

  private onDoubleClick = (_event: MouseEvent): void => {
    const tool = this.appState.activeTool;
    if (!tool) return;


    tool.onDoubleClick();
  };

  /* Coordinate mapping   */
  private getMousePosition(event: MouseEvent): Point {
    const rect = this.container.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}