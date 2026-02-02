//src/tools/CircleTool.ts
import { Tool } from "./base/Tool";
import { Point, ShapeType } from "../shapes/base/ShapeTypes";
import { EllipseShape } from "../shapes/EllipseShape";
import { generateId } from "../utils/Id";

export class EllipseTool extends Tool {
    private center: Point | null = null;
    private isDrawing = false;

    // Mouse Down
    onMouseDown(point: Point): void {
        if (this.isDrawing) return;

        this.center = point;
        this.isDrawing = true;

        const previewEllipse = new EllipseShape(
            {
                id: "preview-ellipse",
                type: ShapeType.Ellipse,
                center: point,
                radiusX: 0,
                radiusY: 0,
                visible: true,
                color: "#ff0000",
            },
            true // preview
        );

        this.appState.setPreview(previewEllipse);
    }

    // Mouse move
    onMouseMove(point: Point): void {
        if (!this.isDrawing || !this.center) return;

        const preview = this.appState.previewShape as EllipseShape | null;
        if (!preview) return;

        preview.radiusX = Math.abs(point.x - this.center.x);  // Remaining

        preview.radiusY = Math.abs(point.y - this.center.y); // Remaining

        this.appState.requestRender();
    }

    // Mouse Up
    onMouseUp(point: Point): void {

        function distance(a: Point, b: Point) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        const MIN_DISTANCE = 3;

        if (!this.isDrawing || !this.center) return;

        const radiusX = Math.abs(point.x - this.center.x);

        const radiusY = Math.abs(point.y - this.center.y);

        if (radiusX < MIN_DISTANCE && radiusY < MIN_DISTANCE) {
            // ❌ click only
            this.appState.clearPreview();
            this.center = null;
            return;
        }

        const finalEllipse = new EllipseShape({
            id: generateId(),
            type: ShapeType.Ellipse,
            center: this.center,
            radiusX,
            radiusY,
            visible: true,
            color: "#000000",
        });

        this.appState.shapeManager.addShape(finalEllipse);
        this.appState.clearPreview();
        this.appState.requestRender();

        this.center = null;
        this.isDrawing = false;
    }

    override cancel(): void {
    this.center = null;
    this.isDrawing = false;
    this.appState.clearPreview();
  }
}