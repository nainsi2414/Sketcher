// src/shapes/base/Shape.ts

import { BaseShapeProps, ShapeType } from './ShapeTypes';

/* Abstract base class for all shapes. Contains only shared data & behavior. */
export abstract class Shape {
  readonly id: string;
  readonly type: ShapeType;

  protected _visible: boolean;
  protected _color: string;

  /* Preview shapes are temporary. They are NOT saved or selectable */
  readonly isPreview: boolean;

  protected constructor(props: BaseShapeProps, isPreview = false) {
    this.id = props.id;
    this.type = props.type;
    this._visible = props.visible;
    this._color = props.color;
    this.isPreview = isPreview;
  }

  abstract containsPoint(x: number, y: number): boolean;

  getEditablePoints(): { label: string; x: number; y: number }[] {
    return [];
  }

  updateEditablePoint(index: number, x: number, y: number): void { }

  getEditableNumbers(): { label: string; value: number; key: string }[] {
    return [];
  }

  updateEditableNumber(key: string, value: number): void { }



  /* Visibility handling  */
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /* Color handling       */

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  /* Serialization        */

  /* Convert shape to plain JSON object. Geometry-specific data is added in subclasses. */
  toJSON(): BaseShapeProps & Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      visible: this.visible,
      color: this.color,
    };
  }
}