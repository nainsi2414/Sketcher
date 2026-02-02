// src/renderer/ShapeRenderer.ts

import * as THREE from "three";

import { Shape } from "../shapes/base/Shape";
import { ShapeType } from "../shapes/base/ShapeTypes";

import { LineShape } from "../shapes/LineShape";
import { CircleShape } from "../shapes/CircleShape";
import { EllipseShape } from "../shapes/EllipseShape";
import { PolylineShape } from "../shapes/PolylineShape";

export class ShapeRenderer {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  renderShape(shape: Shape, isPreview = false): void {
    switch (shape.type) {
      case ShapeType.Line:
        this.renderLine(shape as LineShape, isPreview);
        break;

      case ShapeType.Circle:
        this.renderCircle(shape as CircleShape, isPreview);
        break;

      case ShapeType.Ellipse:
        this.renderEllipse(shape as EllipseShape, isPreview);
        break;

      case ShapeType.Polyline:
        this.renderPolyline(shape as PolylineShape, isPreview);
        break;
    }
  }

  /* Line                 */
  private renderLine(line: LineShape, isPreview: boolean): void {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(line.start.x, line.start.y, 0),
      new THREE.Vector3(line.end.x, line.end.y, 0),
    ]);

    const material = this.createLineMaterial(line.color, isPreview);

    const mesh = new THREE.Line(geometry, material);
    this.scene.add(mesh);
  }

  /* Circle               */
  private renderCircle(circle: CircleShape, isPreview: boolean): void {
    const segments = 64;
    const geometry = new THREE.CircleGeometry(
      circle.radius,
      segments
    );

    geometry.translate(circle.center.x, circle.center.y, 0);

    const material = this.createLineMaterial(circle.color, isPreview);

    const mesh = new THREE.LineLoop(geometry, material);
    this.scene.add(mesh);
  }

  /* Ellipse              */
  private renderEllipse(ellipse: EllipseShape, isPreview: boolean): void {
    const curve = new THREE.EllipseCurve(
      ellipse.center.x,
      ellipse.center.y,
      ellipse.radiusX,
      ellipse.radiusY,
      0,
      Math.PI * 2,
      false,
      0
    );

    const points = curve.getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );

    const material = this.createLineMaterial(ellipse.color, isPreview);

    const mesh = new THREE.LineLoop(geometry, material);
    this.scene.add(mesh);
  }

  /* Polyline             */
  private renderPolyline(polyline: PolylineShape, isPreview: boolean): void {
    if (polyline.points.length < 2) return;

    const points = polyline.points.map(
      (p) => new THREE.Vector3(p.x, p.y, 0)
    );

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = this.createLineMaterial(polyline.color, isPreview);

    const mesh = new THREE.Line(geometry, material);
    this.scene.add(mesh);
  }

  /* Shared helpers       */
  private createLineMaterial(
    color: string,
    isPreview: boolean
  ): THREE.LineBasicMaterial {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      linewidth: isPreview ? 1 : 2,
      opacity: isPreview ? 0.5 : 1,
      transparent: isPreview,
    });
  }
}