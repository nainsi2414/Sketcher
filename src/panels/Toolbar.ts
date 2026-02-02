import { AppState } from "../app/AppState";
import { LineTool } from "../tools/LineTool";
import { CircleTool } from "../tools/CircleTool";
import { EllipseTool } from "../tools/EllipseTool";
import { PolylineTool } from "../tools/PolylineTool";
import { SelectTool } from "../tools/SelectTool";

/* ---------- ICONS ---------- */

const SELECT_ICON = `
<svg viewBox="0 0 24 24">
  <path d="M4 4l6 14 2-6 6-2z"/>
</svg>`;

const LINE_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <line x1="4" y1="20" x2="20" y2="4"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"/>
</svg>`;

const CIRCLE_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="7"
    stroke="currentColor"
    stroke-width="1.8"/>
</svg>`;

const ELLIPSE_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <ellipse cx="12" cy="12" rx="8" ry="5"
    stroke="currentColor"
    stroke-width="1.8"/>
</svg>`;

const POLYLINE_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <polyline points="4,16 10,8 16,12 20,6"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"/>
</svg>`;

const SAVE_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <path d="M5 3h12l2 2v16H5z"
    stroke="currentColor"
    stroke-width="1.8"/>
  <rect x="7" y="3" width="8" height="5"
    stroke="currentColor"
    stroke-width="1.8"/>
</svg>`;

const LOAD_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 3v12" stroke="currentColor" stroke-width="1.8"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="1.8"/>
  <path d="M4 21h16" stroke="currentColor" stroke-width="1.8"/>
</svg>`;

const THEME_ICON = `
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="4"
    stroke="currentColor"
    stroke-width="1.8"/>
  <path d="M12 2v2M12 20v2M2 12h2M20 12h2"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"/>
</svg>`;

/* ---------- TOOLBAR ---------- */

export class Toolbar {
  constructor(private appState: AppState) {}

  mount(container: HTMLElement) {
    container.className = "toolbar";

    // -------- Tools (active) --------
    container.appendChild(
      this.createButton("Select", SELECT_ICON, () =>
      this.appState.setActiveTool(new SelectTool(this.appState)), true
    ));

    container.appendChild(
      this.createButton("Line", LINE_ICON, () =>
        this.appState.setActiveTool(new LineTool(this.appState)), true)
    );

    container.appendChild(
      this.createButton("Circle", CIRCLE_ICON, () =>
        this.appState.setActiveTool(new CircleTool(this.appState)), true)
    );

    container.appendChild(
      this.createButton("Ellipse", ELLIPSE_ICON, () =>
        this.appState.setActiveTool(new EllipseTool(this.appState)), true)
    );

    container.appendChild(
      this.createButton("Polyline", POLYLINE_ICON, () =>
        this.appState.setActiveTool(new PolylineTool(this.appState)), true)
    );

    // -------- Divider --------
    container.appendChild(document.createElement("div")).className = "toolbar-divider";

    // -------- Actions (no active) --------
    container.appendChild(
      this.createButton("Save", SAVE_ICON, () =>
        this.appState.saveToFile())
    );

    container.appendChild(
      this.createButton("Load", LOAD_ICON, () =>
        this.appState.loadFromFile())
    );

    container.appendChild(
      this.createButton("Theme", THEME_ICON, () => {
        const next = this.appState.theme === "light" ? "dark" : "light";
        this.appState.setTheme(next);
      })
    );
  }

  private createButton(
    label: string,
    svg: string,
    onClick: () => void,
    isTool: boolean = false
  ) {
    const btn = document.createElement("button");
    btn.className = `tool-btn ${isTool ? "tool" : "action"}`;

    btn.innerHTML = `
      <span class="tool-icon">${svg}</span>
      ${label ? `<span class="tool-label">${label}</span>` : ""}
    `;

    btn.onclick = () => {
      onClick();

      if (isTool) {
        document
          .querySelectorAll(".tool-btn.tool")
          .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }
    };

    return btn;
  }
}