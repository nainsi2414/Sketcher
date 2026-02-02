// src/tools/CircleTool.ts
import { Tool } from "./base/Tool";
import { Point, ShapeType } from "../shapes/base/ShapeTypes";
import { CircleShape } from "../shapes/CircleShape";
import { generateId } from "../utils/Id";

export class CircleTool extends Tool {
  private center: Point | null = null;
  private isDrawing = false;

  /* Mouse Down → set center */
  onMouseDown(point: Point): void {
    if (this.isDrawing) return;

    this.center = point;
    this.isDrawing = true;

    const previewCircle = new CircleShape(
      {
        id: "preview-circle",
        type: ShapeType.Circle,
        center: point,
        radius: 0,
        visible: true,
        color: "#ff0000",
      },
      true // preview
    );

    this.appState.setPreview(previewCircle);
  }

  /* Mouse Move → update radius */
  onMouseMove(point: Point): void {
    if (!this.isDrawing || !this.center) return;

    const preview = this.appState.previewShape as CircleShape | null;
    if (!preview) return;

    preview.radius = Math.hypot(
      point.x - this.center.x,
      point.y - this.center.y
    );

    this.appState.requestRender();
  }

  /* Mouse Up → finalize */
  onMouseUp(point: Point): void {

    function distance(a: Point, b: Point) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

     const MIN_DISTANCE = 3;

    if (!this.isDrawing || !this.center) return;

    const radius = Math.hypot(
      point.x - this.center.x,
      point.y - this.center.y
    );

    const r = distance(this.center, point);

    if (r < MIN_DISTANCE) {
      // ❌ click only → cancel
      this.appState.clearPreview();
      this.center = null;
      return;
    }

    const finalCircle = new CircleShape({
      id: generateId(),
      type: ShapeType.Circle,
      center: this.center,
      radius,
      visible: true,
      color: "#000000",
    });

    this.appState.shapeManager.addShape(finalCircle);
    this.appState.clearPreview();
    this.appState.requestRender();

    this.center = null;
    this.isDrawing = false;
  }

  override cancel(): void {
    this.center = null;
    this.isDrawing = false;
    this.appState.clearPreview();
  }
}