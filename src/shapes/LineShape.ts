// src/shapes/LineShape.ts

import { Shape } from "./base/Shape";
import { BaseShapeProps, Point, ShapeType } from "./base/ShapeTypes";

export interface LineShapeProps extends BaseShapeProps {
  start: Point;
  end: Point;
}

export class LineShape extends Shape {
  private _start: Point;
  private _end: Point;

  constructor(props: LineShapeProps, isPreview = false) {
    super(
      {
        id: props.id,
        type: ShapeType.Line,
        visible: props.visible,
        color: props.color,
      },
      isPreview
    );

    this._start = props.start;
    this._end = props.end;
  }

  /* Geometry accessors   */
  get start(): Point {
    return this._start;
  }

  set start(value: Point) {
    this._start = value;
  }

  get end(): Point {
    return this._end;
  }

  set end(value: Point) {
    this._end = value;
  }

  containsPoint(x: number, y: number): boolean {
    const { start, end } = this;

    const A = x - start.x;
    const B = y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const t = Math.max(0, Math.min(1, dot / lenSq));

    const px = start.x + t * C;
    const py = start.y + t * D;

    const dx = x - px;
    const dy = y - py;

    return Math.sqrt(dx * dx + dy * dy) < 6; // tolerance
  }

  getEditablePoints() {
    return [
      { label: "Starting Point", x: this.start.x, y: this.start.y },
      { label: "Ending Point", x: this.end.x, y: this.end.y },
    ];
  }

  updateEditablePoint(index: number, x: number, y: number) {
    if (index === 0) this.start = { x, y };
    if (index === 1) this.end = { x, y };
  }

  static fromJSON(data: any): LineShape {
    return new LineShape(
      {
        id: data.id,
        type: ShapeType.Line,
        start: data.start,
        end: data.end,
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
      start: this.start,
      end: this.end,
    };
  }
}