
/**
 * All supported shape types in Sketcher
 * This enum is the single source of truth for shape identity
 */
export enum ShapeType {
  Line = "line",
  Circle = "circle",
  Ellipse = "ellipse",
  Polyline = "polyline",
}

/**
 * Basic 2D point
 * Used across shapes, tools, renderer, panels
 */
export type Point = {
  x: number;
  y: number;
}

/**
 * Common properties shared by all shapes
 * Geometry-specific properties are NOT included here
 */
export interface BaseShapeProps {
  id: string;
  type: ShapeType;
  visible: boolean;
  color: string;
}