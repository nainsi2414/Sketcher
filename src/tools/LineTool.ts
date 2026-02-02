// src/tools/LineTool.ts

import { Tool } from "./base/Tool";
import { Point, ShapeType } from "../shapes/base/ShapeTypes";
import { LineShape } from "../shapes/LineShape";
import { generateId } from "../utils/Id";

export class LineTool extends Tool {
  private startPoint: Point | null = null;
  private isDrawing = false;
  

  /* Mouse Down → capture start */
  onMouseDown(point: Point): void {
    if (this.isDrawing) return;

    this.startPoint = point;
    this.isDrawing = true;

    const previewLine = new LineShape(
      {
        id: "preview-line",
        type: ShapeType.Line,
        start: point,
        end: point,
        visible: true,
        color: "#ff0000",
      },
      true // preview
    );

    this.appState.setPreview(previewLine);
  }

  /* Mouse Move → update preview */
  onMouseMove(point: Point): void {
    if (!this.isDrawing || !this.startPoint) return;

    const preview = this.appState.previewShape as LineShape | null;
    if (!preview) return;

    preview.end = point;
    this.appState.requestRender();
  }

  /* Mouse Up → finalize */
  onMouseUp(point: Point): void {

    function distance(a: Point, b: Point) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    if (!this.isDrawing || !this.startPoint) return;

    const MIN_DISTANCE = 3;

    if (distance(this.startPoint, point) < MIN_DISTANCE) {
      // ❌ treat as click, not draw
      this.appState.clearPreview();
      this.startPoint = null;
      this.isDrawing = false;
      return;
    }

    const finalLine = new LineShape({
      id: generateId(),
      type: ShapeType.Line,
      start: this.startPoint,
      end: point,
      visible: true,
      color: "#000000",
    });

    this.appState.shapeManager.addShape(finalLine);
    this.appState.clearPreview();
    this.appState.requestRender();

    this.startPoint = null;
    this.isDrawing = false;
  }

  /* Cancel (ESC / tool switch) */
  override cancel(): void {
    this.startPoint = null;
    this.isDrawing = false;
    this.appState.clearPreview();
  }
}