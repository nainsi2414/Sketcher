import { Tool } from "./base/Tool";
import { Point, ShapeType } from "../shapes/base/ShapeTypes";
import { PolylineShape } from "../shapes/PolylineShape";
import { generateId } from "../utils/Id";

export class PolylineTool extends Tool {
  private points: Point[] = [];
  private isDrawing = false;

  /* Click → add point */
  onMouseDown(point: Point): void {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.points = [point];

      const preview = new PolylineShape(
        {
          id: "preview-polyline",
          type: ShapeType.Polyline,
          points: [...this.points, point],
          visible: true,
          color: "#ff0000",
        },
        true
      );

      this.appState.setPreview(preview);
      return;
    }

    this.points.push(point);
  }

  /* Move → update last preview segment */
  onMouseMove(point: Point): void {
    if (!this.isDrawing) return;

    const preview = this.appState.previewShape as PolylineShape | null;
    if (!preview) return;

    preview.points = [...this.points, point];
    this.appState.requestRender();
  }

  /* Double click → finalize */
  onDoubleClick(): void {
    if (this.points.length < 2) return;

    const finalPolyline = new PolylineShape({
      id: generateId(),
      type: ShapeType.Polyline,
      points: [...this.points],
      visible: true,
      color: "#000000",
    });

    this.appState.shapeManager.addShape(finalPolyline);
    this.appState.clearPreview();
    this.appState.requestRender();

    this.points = [];
    this.isDrawing = false;
  }
  onMouseUp(point: Point): void {
      
  }

  override cancel(): void {
    this.points = [];
    this.isDrawing = false;
    this.appState.clearPreview();
  }
}