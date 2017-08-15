window.addEventListener('load', init);

function init() {
  /** 主要都市一覧 **/
  const cities = [];
  /** 主要都市緯度経度一覧 **/
  const citiesPoints = [
    [35, 139],
    [51.2838, 0],
    [39, -116],
    [34, 118],
    [-33, 151],
    [-23, -46],
    [1, 103],
    [90, 0],
    [-90, 0],
  ];

  // シーン
  const scene = new THREE.Scene();

  // カメラ
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(-250, 0, -250);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // レンダラー
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // カメラコントローラー
  const controller = new THREE.TrackballControls(camera, renderer.domElement);
  controller.noPan = true;
  controller.minDistance = 200;
  controller.maxDistance = 1000;

  // 地球
  const earth = createEarth();
  scene.add(earth);

  // リスト分のポイントをプロット
  for (let i = 0; i < citiesPoints.length; i++) {
    const latitude = citiesPoints[i][0];
    const longitude = citiesPoints[i][1];
    // ポイント
    const point = createPoint(
      i === 0
        ? 0xff0000
        : (latitude === 90 ? 0x0000FF : 0x00FF00),
      latitude,
      longitude);
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
function createEarth() {
  // 球
  const texture = new THREE.TextureLoader().load('img/ground.jpg');
  return new THREE.Mesh(
    new THREE.SphereGeometry(100, 40, 40),
    new THREE.MeshBasicMaterial({map: texture}));
}

/**
 * プロットする点を生成します
 * @param {number} color
 * @param {number} latitude
 * @param {number} longitude
 * @returns {THREE.Mesh} 球
 */
function createPoint(color, latitude = 0, longitude = 0) {
  // 球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshBasicMaterial({color: color}));
  // 緯度経度から位置を設定
  sphere.position.copy(translateGeoCoords(latitude, longitude, 100));
  return sphere;
}


/**
 * 緯度経度から位置を算出します。
 * @param {number} latitude 緯度です。
 * @param {number} longitude 経度です。
 * @param {number} radius 半径です。
 * @returns {Vector3} 3Dの座標です。
 * @see https://ics.media/entry/10657
 */
function translateGeoCoords(latitude, longitude, radius) {
  // 仰角
  const phi = (latitude) * Math.PI / 180;
  // 方位角
  const theta = (longitude - 180) * Math.PI / 180;

  const x = -(radius) * Math.cos(phi) * Math.cos(theta);
  const y = (radius) * Math.sin(phi);
  const z = (radius) * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
