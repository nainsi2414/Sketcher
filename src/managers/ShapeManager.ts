// src/managers/ShapeManager.ts

import { Shape } from "../shapes/base/Shape";
import { CircleShape } from "../shapes/CircleShape";
import { EllipseShape } from "../shapes/EllipseShape";
import { LineShape } from "../shapes/LineShape";
import { PolylineShape } from "../shapes/PolylineShape";

export class ShapeManager {
  private shapes: Map<string, Shape> = new Map();
  private _selectedShapeId: string | null = null;

  hitTest(x: number, y: number): Shape | null {
  const shapes = Array.from(this.shapes.values());

  // iterate top → bottom
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];

    // 🛡 safety check
    if (!shape) continue;

    if (shape.visible && shape.containsPoint(x, y)) {
      return shape;
    }
  }

  return null;
}

  /* Shape lifecycle      */
  addShape(shape: Shape): void {
    this.shapes.set(shape.id, shape);
  }

  removeShape(shapeId: string): void {
    this.shapes.delete(shapeId);

    // clear selection if deleted
    if (this._selectedShapeId === shapeId) {
      this._selectedShapeId = null;
    }
  }

  clear(): void {
    this.shapes.clear();
    this._selectedShapeId = null;
  }

  /* Accessors            */
  getShape(shapeId: string): Shape | undefined {
    return this.shapes.get(shapeId);
  }

  getAllShapes(): Shape[] {
    return Array.from(this.shapes.values());
  }

  /* Visibility            */
  toggleVisibility(shapeId: string): void {
    const shape = this.shapes.get(shapeId);
    if (!shape) return;

    shape.visible = !shape.visible;
  }

  setVisibility(shapeId: string, visible: boolean): void {
    const shape = this.shapes.get(shapeId);
    if (!shape) return;

    shape.visible = visible;
  }

  /* Selection             */
  selectShape(shapeId: string | null): void {
    this._selectedShapeId = shapeId;
  }

  get selectedShape(): Shape | null {
    if (!this._selectedShapeId) return null;
    return this.shapes.get(this._selectedShapeId) ?? null;
  }

  get selectedShapeId(): string | null {
    return this._selectedShapeId;
  }

  createFromJSON(data: any) {
  switch (data.type) {
    case "circle":
      return CircleShape.fromJSON(data);
    case "ellipse":
      return EllipseShape.fromJSON(data);
    case "line":
      return LineShape.fromJSON(data);
    case "polyline":
      return PolylineShape.fromJSON(data);
    default:
      return null;
  }
}

getShapeAt(x: number, y: number): Shape | null {
  const shapes = Array.from(this.shapes.values());

  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (!shape) continue; // 👈 tells TS it's safe

    if (shape.visible && shape.containsPoint(x, y)) {
      return shape;
    }
  }

  return null;
}


}