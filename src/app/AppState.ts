// src/app/AppState.ts
import { Shape } from "../shapes/base/Shape";
import { ShapeManager } from "../managers/ShapeManager";
import { Tool } from "../tools/base/Tool";
import { Renderer } from "../renderer/Renderer";
import { SelectTool } from "../tools/SelectTool";

export type Theme = "light" | "dark";

export class AppState {

  theme: Theme = "light";

  
  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("theme-dark", theme === "dark");
  }

  private listeners: (() => void)[] = [];

  subscribe(fn: () => void) {
    this.listeners.push(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  shapeManager: ShapeManager;

  private _activeTool: Tool | null = null;
  private _previewShape: Shape | null = null;
  private _renderer: Renderer | null = null;
  private _selectedShapeId: string | null = null;

  constructor() {
    this.shapeManager = new ShapeManager();
    

    this.setActiveTool(new SelectTool(this));

    const saved = localStorage.getItem("theme") as Theme;
    if (saved) this.setTheme(saved);
  }

  /* Renderer binding */
  bindRenderer(renderer: Renderer) {
    this._renderer = renderer;
  }

  requestRender() {
    this._renderer?.render();
    this.notify(); // 🔥 NEW
  }

  /* Tool handling */
  setActiveTool(tool: Tool) {
    this._activeTool?.cancel();
    this._activeTool = tool;
  }

  get activeTool(): Tool | null {
    return this._activeTool;
  }

  /* Preview handling */
  setPreview(shape: Shape) {
    this._previewShape = shape;
    this.requestRender();
  }

  clearPreview() {
    this._previewShape = null;
    this.requestRender();
  }

  get previewShape(): Shape | null {
    return this._previewShape;
  }


  // Particular shape selection
  selectShape(id: string | null) {
    this._selectedShapeId = id;
    this.requestRender(); // already correct
  }


  get selectedShape() {
    if (!this._selectedShapeId) return null;
    return this.shapeManager.getShape(this._selectedShapeId) ?? null;
  }


  get selectedShapeId() {
    return this._selectedShapeId;
  }

  saveToFile() {
    const shapes = this.shapeManager.getAllShapes().map(s => s.toJSON());

    const blob = new Blob(
      [JSON.stringify(shapes, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  loadFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result as string);

        this.shapeManager.clear();

        data.forEach((obj: any) => {
          const shape = this.shapeManager.createFromJSON(obj);
          if (shape) this.shapeManager.addShape(shape);
        });

        this.selectShape(null);
        this.requestRender();
      };

      reader.readAsText(file);
    };

    input.click();
  }
  
}