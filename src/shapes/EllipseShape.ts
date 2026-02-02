// src/shapes/EllipseShape.ts

import { Shape } from "./base/Shape";
import { BaseShapeProps, Point, ShapeType } from "./base/ShapeTypes";

export interface EllipseShapeProps extends BaseShapeProps {
  center: Point;
  radiusX: number;
  radiusY: number;
}

export class EllipseShape extends Shape {
  private _center: Point;
  private _radiusX: number;
  private _radiusY: number;

  constructor(props: EllipseShapeProps, isPreview = false) {
    super(
      {
        id: props.id,
        type: ShapeType.Ellipse,
        visible: props.visible,
        color: props.color,
      },
      isPreview
    );

    this._center = props.center;
    this._radiusX = props.radiusX;
    this._radiusY = props.radiusY;
  }

  /* Geometry accessors   */
  get center(): Point {
    return this._center;
  }

  set center(value: Point) {
    this._center = value;
  }

  get radiusX(): number {
    return this._radiusX;
  }

  set radiusX(value: number) {
    this._radiusX = Math.max(0, value);
  }

  get radiusY(): number {
    return this._radiusY;
  }

  set radiusY(value: number) {
    this._radiusY = Math.max(0, value);
  }

  containsPoint(x: number, y: number): boolean {
    const dx = (x - this.center.x) / this.radiusX;
    const dy = (y - this.center.y) / this.radiusY;
    return dx * dx + dy * dy <= 1;
  }

  getEditablePoints() {
    return [
      { label: "Center", x: this.center.x, y: this.center.y },
    ];
  }

  updateEditablePoint(_: number, x: number, y: number) {
    this.center = { x, y };
  }

  getEditableNumbers() {
    return [
      { label: "Radius X", value: this.radiusX, key: "rx" },
      { label: "Radius Y", value: this.radiusY, key: "ry" },
    ];
  }

  updateEditableNumber(key: string, value: number) {
    if (key === "rx") this.radiusX = Math.max(1, value);
    if (key === "ry") this.radiusY = Math.max(1, value);
  }

  static fromJSON(data: any): EllipseShape {
    return new EllipseShape(
      {
        id: data.id,
        type: ShapeType.Ellipse,
        center: data.center,
        radiusX: data.radiusX,
        radiusY: data.radiusY,
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
      center: this.center,
      radiusX: this.radiusX,
      radiusY: this.radiusY,
    };
  }
}