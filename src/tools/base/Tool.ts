// src/tools/base/Tool.ts

import { Point } from "../../shapes/base/ShapeTypes";
import { AppState } from "../../app/AppState";
import { Shape } from "../../shapes/base/Shape";

export abstract class Tool {
  protected appState: AppState;
  protected previewShape: Shape | null = null;

  constructor(appState: AppState) {
    this.appState = appState;
  }

  /* Mouse events         */

  abstract onMouseDown(point: Point): void;
  abstract onMouseMove(point: Point): void;
  abstract onMouseUp(point: Point): void;

  onDoubleClick(): void {}

  /* Keyboard / cancel    */

  cancel(): void {
    if (this.previewShape) {
      this.appState.clearPreview();
      this.previewShape = null;
    }
  }

  /* Helpers              */

  protected setPreview(shape: Shape): void {
    this.previewShape = shape;
    this.appState.setPreview(shape);
  }

  protected commitShape(shape: Shape): void {
    this.appState.shapeManager.addShape(shape);
    this.appState.clearPreview();
    this.previewShape = null;
  }
}