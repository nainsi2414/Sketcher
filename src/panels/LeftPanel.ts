// src/panels/LeftPanel.ts

import { AppState } from "../app/AppState";
import { Shape } from "../shapes/base/Shape";

export class LeftPanel {
  private container!: HTMLElement;

  constructor(private appState: AppState) {}

  mount(container: HTMLElement) {
    this.container = container;
    this.appState.subscribe(() => this.render());
    this.render();
  }

  private render() {
    this.container.innerHTML = "";

    const shapes = this.appState.shapeManager.getAllShapes();

    if (!shapes.length) {
      this.container.innerHTML = `<div class="empty">No shapes</div>`;
      return;
    }

    shapes.forEach((shape) => {
      const row = document.createElement("div");
      row.className = "shape-row";

      if (shape.id === this.appState.selectedShapeId) {
        row.classList.add("selected");
      }

      row.onclick = () => this.appState.selectShape(shape.id);

      const label = document.createElement("span");
      label.className = "shape-label";
      label.textContent = shape.type;

      const visibilityBtn = document.createElement("button");
      visibilityBtn.className = "visibility-btn";
      visibilityBtn.textContent = shape.visible ? "👁" : "🚫";
      visibilityBtn.onclick = (e) => {
        e.stopPropagation();
        shape.visible = !shape.visible;
        this.appState.requestRender();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.appState.shapeManager.removeShape(shape.id);
        this.appState.selectShape(null);
        this.appState.requestRender();
      };

      row.append(label, visibilityBtn, deleteBtn);
      this.container.appendChild(row);
    });
  }
}