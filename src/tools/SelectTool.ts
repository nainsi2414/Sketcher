import { Tool } from "./base/Tool";
import { Point } from "../shapes/base/ShapeTypes";

export class SelectTool extends Tool {
  onMouseDown(point: Point): void {
    const shape = this.appState.shapeManager.hitTest(point.x, point.y);

    if (shape) {
      this.appState.selectShape(shape.id);
    } else {
      this.appState.selectShape(null);
    }
  }

  onMouseMove(): void {}
  onMouseUp(): void {}
}
