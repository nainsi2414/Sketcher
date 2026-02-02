// src/shapes/base/ShapeFactory.ts

import { ShapeType, Point } from "./ShapeTypes";
import { Shape } from "./Shape";

import { LineShape } from "../LineShape";
import { CircleShape } from "../CircleShape";
import { EllipseShape } from "../EllipseShape";
import { PolylineShape } from "../PolylineShape";

import { generateId } from "../../utils/Id";

const DEFAULT_COLOR = "#ff5555";
const DEFAULT_VISIBLE = true;

export class ShapeFactory {
  static createLine(
    start: Point,
    end: Point,
    isPreview = false
  ): LineShape {
    return new LineShape(
      {
        id: generateId(),
        type: ShapeType.Line,
        visible: DEFAULT_VISIBLE,
        color: DEFAULT_COLOR,
        start,
        end,
      },
      isPreview
    );
  }

  static createCircle(
    center: Point,
    radius: number,
    isPreview = false
  ): CircleShape {
    return new CircleShape(
      {
        id: generateId(),
        type: ShapeType.Circle,
        visible: DEFAULT_VISIBLE,
        color: DEFAULT_COLOR,
        center,
        radius,
      },
      isPreview
    );
  }

  static createEllipse(
    center: Point,
    radiusX: number,
    radiusY: number,
    isPreview = false
  ): EllipseShape {
    return new EllipseShape(
      {
        id: generateId(),
        type: ShapeType.Ellipse,
        visible: DEFAULT_VISIBLE,
        color: DEFAULT_COLOR,
        center,
        radiusX,
        radiusY,
      },
      isPreview
    );
  }

  static createPolyline(
    points: Point[],
    isPreview = false
  ): PolylineShape {
    return new PolylineShape(
      {
        id: generateId(),
        type: ShapeType.Polyline,
        visible: DEFAULT_VISIBLE,
        color: DEFAULT_COLOR,
        points,
      },
      isPreview
    );
  }
}