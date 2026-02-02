// src/panels/PropertyPanel.ts

import { AppState } from "../app/AppState";
import { Shape } from "../shapes/base/Shape";

export class PropertyPanel {
  private container!: HTMLElement;

  private draftColor: string = "#000000";

  // 🔥 NEW: local draft state
  private draftPoints: Map<number, { x: number; y: number }> = new Map();
  private draftNumbers: Map<string, number> = new Map();

  constructor(private appState: AppState) {}

  mount(container: HTMLElement) {
    this.container = container;

    // 🔥 auto-sync with app state
    this.appState.subscribe(() => this.render());

    this.render();
  }

    private render() {
        this.container.innerHTML = "";

        const shape = this.appState.selectedShape;

        if (!shape) {
            this.container.innerHTML = `
            <div class="empty">
              Select a shape to see properties
            </div> `;
            return;
        }

      this.draftPoints.clear();
      this.draftNumbers.clear();
      this.draftColor = shape.color ?? "#000000";

      shape.getEditablePoints().forEach((p, i) => {
        this.draftPoints.set(i, { x: p.x, y: p.y });
      });


      shape.getEditableNumbers().forEach(n => {
        this.draftNumbers.set(n.key, n.value);
      });

      const header = document.createElement("div");
      header.innerHTML = `
  <div class="prop-header">Properties</div>
`;
      this.container.appendChild(header);

        this.container.appendChild(this.renderHeader(shape));
        this.container.appendChild(this.renderVisibility(shape));
        this.container.appendChild(this.renderColor(shape));


      const pointEditor = this.renderEditablePoints(shape);
      pointEditor && this.container.appendChild(pointEditor);

      const numberEditor = this.renderEditableNumbers(shape);
      numberEditor && this.container.appendChild(numberEditor);

      this.container.appendChild(this.renderUpdateButton(shape));

      this.container.appendChild(this.renderDelete(shape));
    }

  /* ---------- UI Blocks ---------- */

  private renderHeader(shape: Shape): HTMLElement {
    const el = document.createElement("div");
    el.className = "prop-section";
    el.innerHTML = `<strong>Type:</strong> ${shape.type}`;
    return el;
  }

  private renderVisibility(shape: Shape): HTMLElement {
    const el = document.createElement("div");
    el.className = "prop-section";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = shape.visible;
    checkbox.onchange = () => {
      shape.visible = checkbox.checked;
      this.appState.requestRender();
    };

    const label = document.createElement("label");
    label.textContent = " Visible";
    label.prepend(checkbox);

    el.appendChild(label);
    return el;
  }

  private renderColor(shape: Shape): HTMLElement {
    const el = document.createElement("div");
    el.className = "prop-section";

    const input = document.createElement("input");
    input.type = "color";
    // input.value = shape.color ?? "#000000";

    input.value = this.draftColor;

    input.oninput = () => {
      this.draftColor = input.value; // only store
    };


    el.innerHTML = `<div>Color:</div>`;
    el.appendChild(input);

    return el;
  }

  private renderEditablePoints(shape: Shape): HTMLElement | null {
  const points = shape.getEditablePoints();
  if (!points.length) return null;

  const el = document.createElement("div");
  el.className = "prop-section";
  el.innerHTML = `<strong>Points:</strong>`;

    points.forEach((p, i) => {
      const group = document.createElement("div");
      group.className = "point-group";

      const title = document.createElement("div");
      title.className = "point-title";
      title.textContent = p.label;

      // --- X row ---
      const xRow = document.createElement("div");
      xRow.className = "axis-row";

      const xLabel = document.createElement("span");
      xLabel.textContent = "X :";

      const xInput = document.createElement("input");
      xInput.type = "number";
      xInput.value = p.x.toFixed(1);
      xInput.oninput = () => {
        const d = this.draftPoints.get(i)!;
        d.x = parseFloat(xInput.value);
      };

      xRow.append(xLabel, xInput);

      // --- Y row ---
      const yRow = document.createElement("div");
      yRow.className = "axis-row";

      const yLabel = document.createElement("span");
      yLabel.textContent = "Y :";

      const yInput = document.createElement("input");
      yInput.type = "number";
      yInput.value = p.y.toFixed(1);
      yInput.oninput = () => {
        const d = this.draftPoints.get(i)!;
        d.y = parseFloat(yInput.value);
      };

      yRow.append(yLabel, yInput);

      group.append(title, xRow, yRow);
      el.appendChild(group);
    });

  return el;
}

private renderEditableNumbers(shape: Shape): HTMLElement | null {
  const nums = shape.getEditableNumbers();
  if (!nums.length) return null;

  const el = document.createElement("div");
  el.className = "prop-section";
  el.innerHTML = `<strong>Dimensions:</strong>`;

  nums.forEach(n => {
    const row = document.createElement("div");
    row.className = "number-row";

    const label = document.createElement("label");
    label.textContent = n.label;

    const input = document.createElement("input");
    input.type = "number";
    input.value = n.value.toFixed(1);
    input.onchange = () => {
      this.draftNumbers.set(n.key, parseFloat(input.value));
    };

    row.append(label, input);
    el.appendChild(row);
  });

  return el;
}

  private renderDelete(shape: Shape): HTMLElement {
    const el = document.createElement("div");
    // el.className = "prop-section";

    const btn = document.createElement("button");
    btn.className = "delete-danger";
    btn.textContent = "Delete Shape";

    btn.onclick = () => {
      this.appState.shapeManager.removeShape(shape.id);
      this.appState.selectShape(null);
      this.appState.requestRender();
    };

    el.appendChild(btn);
    return el;
  }

  private renderUpdateButton(shape: Shape): HTMLElement {
    const el = document.createElement("div");
    // el.className = "prop-section";

    const btn = document.createElement("button");
    btn.className = "update-primary";
    btn.textContent = "Update";

    btn.onclick = () => {
      // apply points
      this.draftPoints.forEach((p, i) => {
        shape.updateEditablePoint(i, p.x, p.y);
      });

      // apply numbers
      this.draftNumbers.forEach((value, key) => {
        shape.updateEditableNumber(key, value);
      });

      // ✅ apply color
      if (this.draftColor !== null) {
        shape.color = this.draftColor;
      }

      this.appState.requestRender();
    };


    el.appendChild(btn);
    return el;
  }
}