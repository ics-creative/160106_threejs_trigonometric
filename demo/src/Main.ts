import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { createEarth, updateEarth, EarthData } from "./objects/Earth";
import {
  createCityPoint,
  getCityPointCoords,
  CityPointData,
} from "./objects/CityPoint";
import {
  createCityLine,
  updateCityLine,
  CityLineData,
} from "./objects/CityLine";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { applyGpsPosition } from "./utils/applyGpsPosition";
import "./style.css";
import starImage from "./assets/images/star.jpg";

/**
 * Three.jsを用いた三角関数デモの関数です。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */

interface AppState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: WebGPURenderer;
  controller: TrackballControls;
  containerElement: HTMLElement;
  earth: EarthData;
  japan: CityPointData;
  cities: CityPointData[];
  citiesLine: CityLineData[];
  satellite: CityPointData;
}

/** 主要都市緯度経度一覧 **/
const citiesPoints: [number, number][] = [
  [51.2838, 0], // イギリス
  [39, -116], // 北京
  [34, 118], // ロサンゼルス
  [-33, 151], // シドニー
  [-23, -46], // サンパウロ
  [1, 103], // シンガポール
  [90, 0], // 北極
  [-90, 0], // 南極
];

/**
 * アプリケーションを初期化します。
 */
async function initApp(): Promise<AppState> {
  const containerElement = document.createElement("div");
  document.body.appendChild(containerElement);

  // シーン
  const scene = new THREE.Scene();

  // カメラ
  const camera = new THREE.PerspectiveCamera(
    45,
    innerWidth / innerHeight,
    1,
    2000,
  );
  camera.position.set(-250, 0, -250);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // レンダラー
  const renderer = new WebGPURenderer({});

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  containerElement.appendChild(renderer.domElement);

  // カメラコントローラー
  const controller = new TrackballControls(camera, renderer.domElement);
  controller.noPan = true;
  controller.minDistance = 200;
  controller.maxDistance = 1000;
  controller.dynamicDampingFactor = 0.05;

  // 環境光
  const ambientLight = new THREE.AmbientLight(0x111111, 6);
  scene.add(ambientLight);

  // スポットライト
  const spotLight = new THREE.SpotLight(0xffffff, 100);
  spotLight.position.set(-10000, 0, 0);
  spotLight.castShadow = true; //影
  scene.add(spotLight);

  // 地球
  const earth = createEarth();
  scene.add(earth.group);

  // 背景
  const geometry2 = new THREE.SphereGeometry(1000, 60, 40);
  const texture = new THREE.TextureLoader().load(starImage);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material2 = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });

  const background = new THREE.Mesh(geometry2, material2);
  scene.add(background);

  // 日本
  const japan = createCityPoint(0xffff00, [35.658651, 139.742689]);
  // 日本を更新
  applyGpsPosition(japan.group, getCityPointCoords(japan));
  scene.add(japan.group);

  // 主要都市をプロットして線を引く
  const cities: CityPointData[] = [];
  const citiesLine: CityLineData[] = [];

  citiesPoints.forEach((point) => {
    // 都市
    const city = createCityPoint(0xff00ff, point);
    cities.push(city);
    scene.add(city.group);
    applyGpsPosition(city.group, getCityPointCoords(city));

    // 線を引く
    const line = createCityLine(japan.group, city.group);
    updateCityLine(line);
    citiesLine.push(line);
    scene.add(line.group);
  });

  // 赤道上衛星3
  const satellite = createCityPoint(0xff0000, [0, 0]);
  scene.add(satellite.group);

  await renderer.init();

  return {
    scene,
    camera,
    renderer,
    controller,
    containerElement,
    earth,
    japan,
    cities,
    citiesLine,
    satellite,
  };
}

/**
 * フレーム毎にさせる処理
 */
function render(state: AppState): void {
  // 地球を更新
  updateEarth(state.earth);

  // 人工衛星の位置を移動
  state.satellite.longitude = Date.now() / 100;
  applyGpsPosition(state.satellite.group, getCityPointCoords(state.satellite));

  // カメラコントローラーの更新
  state.controller.update();

  state.renderer.render(state.scene, state.camera);
  requestAnimationFrame(() => {
    render(state);
  });
}

/**
 * リサイズ処理
 */
function onResize(state: AppState): void {
  // サイズを取得
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーのサイズを調整する
  state.renderer.setPixelRatio(window.devicePixelRatio);
  state.renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
}

/**
 * アプリケーションを開始します。
 */
addEventListener("DOMContentLoaded", async () => {
  const state = await initApp();

  window.addEventListener("resize", () => {
    onResize(state);
  });

  // フレーム毎のレンダーを登録
  render(state);
});
