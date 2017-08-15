window.addEventListener('load', init);

function init() {
  // 主要都市緯度経度一覧
  const citiesPoints = [
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
  // 日本
  const japan = createPoint(0xff0000, 35, 139);
  scene.add(japan);
  // リスト分のポイントをプロット
  for (let i = 0; i < citiesPoints.length; i++) {
    const latitude = citiesPoints[i][0];
    const longitude = citiesPoints[i][1];
    // ポイント
    const point = createPoint(
      latitude === 90 ? 0x0000FF : 0x00FF00,
      latitude,
      longitude);
    scene.add(point);
    // 線
    const line = createLine(japan.position, point.position);
    scene.add(line);
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
  const texture = (new THREE.TextureLoader).load('img/ground.jpg');
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
 * @see https://ics.media/entry/10657
 */
function createPoint(color, latitude = 0, longitude = 0) {
  // 球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshBasicMaterial({color: color}));
  // 緯度経度から位置を設定
  sphere.position.copy(translateGeoCoords(latitude, longitude, 102));
  return sphere;
}

/**
 * 二点を結ぶラインを生成します
 * @param {THREE.Vector3} startPoint 開始点
 * @param {THREE.Vector3} endPoint 終了点
 * @returns {THREE.Line} 線
 * @see https://ics.media/entry/10657
 */
function createLine(startPoint, endPoint) {
  // 線
  const geometry = new THREE.Geometry();
  geometry.vertices = getOrbitPoints(startPoint, endPoint, 15);
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({linewidth: 5, color: 0x00ffff}));
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

/**
 * 軌道の座標を配列で返します。
 * @param {Vector3} startPos 開始点です。
 * @param {Vector3} endPos 終了点です。
 * @param {number} segmentNum セグメント分割数です。
 * @returns {Vector3[]} 軌跡座標の配列です。
 * @see https://ics.media/entry/10657
 */
function getOrbitPoints(startPos, endPos, segmentNum) {
  // 頂点を格納する配列
  const vertices = [];
  const startVec = startPos.clone();
  const endVec = endPos.clone();

  // ２つのベクトルの回転軸
  const axis = startVec.clone().cross(endVec);
  // 軸ベクトルを単位ベクトルに
  axis.normalize();
  // ２つのベクトルが織りなす角度
  const angle = startVec.angleTo(endVec);

  // ２つの点を結ぶ弧を描くための頂点を打つ
  for (let i = 0; i < segmentNum; i++) {
    // axisを軸としたクォータニオンを生成
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(axis, angle / segmentNum * i);
    // ベクトルを回転させる
    const vertex = startVec.clone().applyQuaternion(q);
    vertices.push(vertex);
  }

  // 終了点を追加
  vertices.push(endVec);
  return vertices;
}

