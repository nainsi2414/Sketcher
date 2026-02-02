// src/renderer/Renderer.ts

import * as THREE from "three";
import { AppState } from "../app/AppState";
import { ShapeRenderer } from "./ShapeRenderer";

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;

  private shapeRenderer: ShapeRenderer;
  private appState: AppState;

  private container: HTMLElement;

  constructor(container: HTMLElement, appState: AppState) {
    this.container = container;
    this.appState = appState;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);


    // After creating the scene
    this.scene.scale.y = -1;
    this.scene.position.y = container.clientHeight;

    const width = container.clientWidth;
    const height = container.clientHeight;

//     console.log(
//   "container size:",
//   container.clientWidth,
//   container.clientHeight
// );
    this.camera = new THREE.OrthographicCamera(
      0,
      width,
      height,
      0, -1000, 1000
    );

    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.shapeRenderer = new ShapeRenderer(this.scene);

    this.render();
  }

  /* Public API           */
  render(): void {
    this.clearScene();

    // Render final shapes
    this.appState.shapeManager
      .getAllShapes()
      .forEach((shape) => {
        if (shape.visible) {
          this.shapeRenderer.renderShape(shape);
        }
      });

    // Render preview shape on top
    const preview = this.appState.previewShape;
    if (preview && preview.visible) {
      this.shapeRenderer.renderShape(preview, true);
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* Internal helpers     */
  private clearScene(): void {
      for (const child of [...this.scene.children]) {
          this.scene.remove(child);
      }
  }

  resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.right = width;
    this.camera.bottom = height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.render();
  }
}