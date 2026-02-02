// src/shapes/CircleShape.ts

import { Shape } from "./base/Shape";
import { BaseShapeProps, Point, ShapeType } from "./base/ShapeTypes";

export interface CircleShapeProps extends BaseShapeProps {
  center: Point;
  radius: number;
}

export class CircleShape extends Shape {
  private _center: Point;
  private _radius: number;

  constructor(props: CircleShapeProps, isPreview = false) {
    super(
      {
        id: props.id,
        type: ShapeType.Circle,
        visible: props.visible,
        color: props.color,
      },
      isPreview
    );

    this._center = props.center;
    this._radius = props.radius;
  }

  /* Geometry accessors   */

  get center(): Point {
    return this._center;
  }

  set center(value: Point) {
    this._center = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = Math.max(0, value); // safety
  }

  containsPoint(x: number, y: number): boolean {
    const dx = x - this.center.x;
    const dy = y - this.center.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
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
      { label: "Radius", value: this.radius, key: "radius" },
    ];
  }

  updateEditableNumber(key: string, value: number) {
    if (key === "radius") this.radius = Math.max(1, value);
  }

  /* Serialization        */
  static fromJSON(data: any): CircleShape {
  return new CircleShape(
    {
      id: data.id,
      type: ShapeType.Circle,
      center: data.center,
      radius: data.radius,
      visible: data.visible,
      color: data.color,
    },
    false
  );
}

  override toJSON() {
    return {
      ...super.toJSON(),
      center: this.center,
      radius: this.radius,
    };
  }
}