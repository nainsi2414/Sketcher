import { AppState } from "./app/AppState";
import { Renderer } from "./renderer/Renderer";
import { InputHandler } from "./input/InputHandler";
import { Toolbar } from "./panels/Toolbar";
import { LeftPanel } from "./panels/LeftPanel";
import { PropertyPanel } from "./panels/PropertyPanel";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas")!;
  const toolbarEl = document.getElementById("toolbar")!;
  const leftPanelEl = document.getElementById("left-panel")!;
  const propertyPanelEl = document.getElementById("property-panel")!;

  const appState = new AppState();

  const renderer = new Renderer(canvas, appState);
  appState.bindRenderer(renderer);

  new InputHandler(canvas, appState);

  new Toolbar(appState).mount(toolbarEl);
  new LeftPanel(appState).mount(leftPanelEl);
  new PropertyPanel(appState).mount(propertyPanelEl);

  renderer.render();
});