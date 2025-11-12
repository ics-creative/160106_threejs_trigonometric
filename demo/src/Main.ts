import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { Earth } from "./objects/Earth";
import { CityPoint } from "./objects/CityPoint";
import { CityLine } from "./objects/CityLine";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { applyGpsPosition } from "./utils/applyGpsPosition";
import "./style.css";
import starImage from "./assets/images/star.jpg";

addEventListener("DOMContentLoaded", () => {
  new Main();
});

/**
 * Three.jsを用いた三角関数デモのクラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export class Main {
  /** シーンオブジェクト */
  scene: THREE.Scene;
  /** カメラオブジェクト */
  camera: THREE.PerspectiveCamera;
  /** レンダラーオブジェクト */
  renderer: WebGPURenderer;
  /** コントローラー **/
  controller: TrackballControls;
  /** HTML要素 */
  containerElement: HTMLElement;

  /** 地球 **/
  earth: Earth;

  /** 日本 **/
  japan: CityPoint;

  /** 主要都市一覧 **/
  cities: CityPoint[] = [];
  citiesLine: CityLine[] = [];

  /** 主要都市緯度経度一覧 **/
  citiesPoints: [number, number][] = [
    [51.2838, 0], // イギリス
    [39, -116], // 北京
    [34, 118], // ロサンゼルス
    [-33, 151], // シドニー
    [-23, -46], // サンパウロ
    [1, 103], // シンガポール
    [90, 0], // 北極
    [-90, 0], // 南極
  ];

  /** 人工衛星 **/
  satellite: CityPoint;

  constructor() {
    this.containerElement = document.createElement("div");
    document.body.appendChild(this.containerElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      1,
      2000,
    );
    this.camera.position.set(-250, 0, -250);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダラー
    this.renderer = new WebGPURenderer({});

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.containerElement.appendChild(this.renderer.domElement);

    // カメラコントローラー
    this.controller = new TrackballControls(
      this.camera,
      this.renderer.domElement,
    );
    this.controller.noPan = true;
    this.controller.minDistance = 200;
    this.controller.maxDistance = 1000;
    this.controller.dynamicDampingFactor = 0.05;

    // 環境光
    const ambientLight = new THREE.AmbientLight(0x111111, 6);
    this.scene.add(ambientLight);

    // スポットライト
    const spotLight = new THREE.SpotLight(0xffffff, 100);
    spotLight.position.set(-10000, 0, 0);
    spotLight.castShadow = true; //影
    this.scene.add(spotLight);

    // 地球
    this.earth = new Earth();
    this.scene.add(this.earth);

    // 背景
    const geometry2 = new THREE.SphereGeometry(1000, 60, 40);
    const texture = new THREE.TextureLoader().load(starImage);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material2 = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    const background = new THREE.Mesh(geometry2, material2);
    this.scene.add(background);

    // 日本
    this.japan = new CityPoint(0xffff00, [35.658651, 139.742689]);
    // 日本を更新
    applyGpsPosition(this.japan, this.japan.getCoords());
    this.scene.add(this.japan);

    // 主要都市をプロットして線を引く
    this.citiesPoints.forEach((point) => {
      // 都市
      const city = new CityPoint(0xff00ff, point);
      this.cities.push(city);
      this.scene.add(city);
      applyGpsPosition(city, city.getCoords());

      // 線を引く
      const line = new CityLine(this.japan, city);
      line.update();
      this.citiesLine.push(line);
      this.scene.add(line);
    });

    // 赤道上衛星3
    this.satellite = new CityPoint(0xff0000, [0, 0]);
    this.scene.add(this.satellite);

    window.addEventListener("resize", () => {
      this.onResize();
    });

    this.init();
  }

  async init() {
    await this.renderer.init();
    // フレーム毎のレンダーを登録
    this.render();
  }

  /**
   * フレーム毎にさせる処理
   */
  render() {
    // 地球を更新
    this.earth.update();

    // 人工衛星の位置を移動
    this.satellite.longitude = Date.now() / 100;
    applyGpsPosition(this.satellite, this.satellite.getCoords());

    // カメラコントローラーの更新
    this.controller.update();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.render();
    });
  }

  onResize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
