// src/shapes/PolylineShape.ts

import { Shape } from "./base/Shape";
import { BaseShapeProps, Point, ShapeType } from "./base/ShapeTypes";

export interface PolylineShapeProps extends BaseShapeProps {
  points: Point[];
}

export class PolylineShape extends Shape {
  private _points: Point[];

  constructor(props: PolylineShapeProps, isPreview = false) {
    super(
      {
        id: props.id,
        type: ShapeType.Polyline,
        visible: props.visible,
        color: props.color,
      },
      isPreview
    );

    // clone to avoid external mutation
    this._points = [...props.points];
  }

  /* Geometry accessors   */
  get points(): Point[] {
    return this._points;
  }

  set points(value: Point[]) {
    this._points = [...value];
  }

  addPoint(point: Point): void {
    this._points.push(point);
  }

  updateLastPoint(point: Point): void {
    if (this._points.length === 0) return;
    this._points[this._points.length - 1] = point;
  }

  get pointCount(): number {
    return this._points.length;
  }

  containsPoint(): boolean {
    return false; // selection via bounding box later
  }

  getEditablePoints() {
    return this.points.map((p, i) => ({
      label: `Point ${i+1}`,
      x: p.x,
      y: p.y,
    }));
  }

  updateEditablePoint(index: number, x: number, y: number) {
    this.points[index] = { x, y };
  }
  static fromJSON(data: any): PolylineShape {
    return new PolylineShape(
      {
        id: data.id,
        type: ShapeType.Polyline,
        points: data.points,
        visible: data.visible,
        color: data.color,
      },
      false
    );
  }

  /* Serialization        */

  override toJSON() {
    return {
      ...super.toJSON(),
      points: this.points,
    };
  }
}