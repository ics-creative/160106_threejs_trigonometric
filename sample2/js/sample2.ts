///<reference path="../../typings/tsd.d.ts" />

window.addEventListener("load", init);

function init() {
  /** 主要都市一覧 **/
  let cities = [];

  /** 主要都市緯度経度一覧 **/
  const citiesPoints = [
    [35, 139],     // 日本
    [51.2838, 0],   // イギリス
    [39, -116],      // 北京
    [34, 118],     // ロサンゼルス
    [-33, 151],    // シドニー
    [-23, -46],      // サンパウロ
    [1, 103],       // シンガポール
    [90, 0],       // 北極
    [-90, 0],       // 南極
  ];

  // シーン
  let scene = new THREE.Scene();

  // カメラ
  let camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 1, 2000
  );
  camera.position.set(-250, 0, -250);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // レンダラー
  let renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // カメラコントローラー
  let controller = new THREE.TrackballControls(camera, renderer.domElement);
  controller.noPan = true;
  controller.minDistance = 200;
  controller.maxDistance = 1000;

  // 地球
  let earth = createEarth();
  scene.add(earth);

  // リスト分のポイントをプロット
  for (let i = 0; i < citiesPoints.length; i++) {
    let latitude:number = citiesPoints[i][0];
    let longitude:number = citiesPoints[i][1];
    // ポイント
    let point = createPoint(i == 0 ? 0xff0000 : latitude == 90 ? 0x0000FF : 0x00FF00, latitude, longitude);
    scene.add(point);
    cities.push(point);
  }

  // フレーム毎のレンダーを登録
  tick();

  function tick() {
    requestAnimationFrame(tick);

    // カメラコントローラーの更新
    controller.update();

    renderer.render(scene, camera);
  }
}

/**
 * 地球を生成します
 * @returns {THREE.Mesh} 球
 */
function createEarth():THREE.Mesh {
  // 球
  let texture = THREE.ImageUtils.loadTexture("img/ground.jpg");
  let ground = new THREE.Mesh(
    new THREE.SphereGeometry(100, 20, 20),
    new THREE.MeshBasicMaterial({map: texture}));

  return ground;
}

/**
 * プロットする点を生成します
 * @param {number} color
 * @param {number} latitude
 * @param {number} longitude
 * @returns {THREE.Mesh} 球
 */
function createPoint(color:number, latitude:number = 0, longitude:number = 0):THREE.Mesh {
  // 球
  let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshBasicMaterial({color: color}));

  // 緯度経度から位置を設定
  sphere.position.copy(translateGeoCoords(latitude, longitude, 100));

  return sphere;
}


/**
 * 緯度経度から位置を算出します
 * @param {number} latitude 緯度
 * @param {number} longitude 経度
 * @param {number} radius 半径
 * @returns {THREE.Vector3} 位置
 */
function translateGeoCoords(latitude:number, longitude:number, radius:number):THREE.Vector3 {
  // 仰角
  let phi = (latitude) * Math.PI / 180;
  // 方位角
  let theta = (longitude - 180) * Math.PI / 180;

  let x = -(radius) * Math.cos(phi) * Math.cos(theta);
  let y = (radius) * Math.sin(phi);
  let z = (radius) * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}