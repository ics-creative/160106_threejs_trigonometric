///<reference path="../../typings/tsd.d.ts" />
window.addEventListener("load", init);
function init() {
    // 主要都市緯度経度一覧
    var citiesPoints = [
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
    var scene = new THREE.Scene();
    // カメラ
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(-250, 0, -250);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // レンダラー
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // カメラコントローラー
    var controller = new THREE.TrackballControls(camera, renderer.domElement);
    controller.noPan = true;
    controller.minDistance = 200;
    controller.maxDistance = 1000;
    // 地球
    var earth = createEarth();
    scene.add(earth);
    // 日本
    var japan = createPoint(0xff0000, 35, 139);
    scene.add(japan);
    // リスト分のポイントをプロット
    for (var i = 0; i < citiesPoints.length; i++) {
        var latitude = citiesPoints[i][0];
        var longitude = citiesPoints[i][1];
        // ポイント
        var point = createPoint(latitude == 90 ? 0x0000FF : 0x00FF00, latitude, longitude);
        scene.add(point);
        // 線
        var line = createLine(japan.position, point.position);
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
    var texture = THREE.ImageUtils.loadTexture("img/ground.jpg");
    var ground = new THREE.Mesh(new THREE.SphereGeometry(100, 20, 20), new THREE.MeshBasicMaterial({ map: texture }));
    return ground;
}
/**
 * プロットする点を生成します
 * @param {number} color
 * @param {number} latitude
 * @param {number} longitude
 * @returns {THREE.Mesh} 球
 */
function createPoint(color, latitude, longitude) {
    if (latitude === void 0) { latitude = 0; }
    if (longitude === void 0) { longitude = 0; }
    // 球
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({ color: color }));
    // 緯度経度から位置を設定
    sphere.position.copy(translateGeoCoords(latitude, longitude, 102));
    return sphere;
}
/**
 * 二点を結ぶラインを生成します
 * @param {THREE.Vector3} startPoint 開始点
 * @param {THREE.Vector3} endPoint 終了点
 * @returns {THREE.Line} 線
 */
function createLine(startPoint, endPoint) {
    // 線
    var geometry = new THREE.Geometry();
    geometry.vertices = getOrbitPoints(startPoint, endPoint, 15);
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ linewidth: 5, color: 0x00ffff }));
    return line;
}
/**
 * 緯度経度から位置を算出します
 * @param {number} latitude 緯度
 * @param {number} longitude 経度
 * @param {number} radius 半径
 * @returns {THREE.Vector3} 位置
 */
function translateGeoCoords(latitude, longitude, radius) {
    // 仰角
    var phi = (latitude) * Math.PI / 180;
    // 方位角
    var theta = (longitude - 180) * Math.PI / 180;
    var x = -(radius) * Math.cos(phi) * Math.cos(theta);
    var y = (radius) * Math.sin(phi);
    var z = (radius) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}
/**
 * 軌道の座標を配列で返します
 * @param {THREE.Vector3} startPos 開始点
 * @param {THREE.Vector3} endPos 終了点
 * @param {number} segmentNum 頂点の数 (線のなめらかさ)
 * @returns {THREE.Vector3[]} 軌跡座標の配列
 */
function getOrbitPoints(startPos, endPos, segmentNum) {
    // 頂点を格納する配列
    var vertices = [];
    var startVec = startPos.clone();
    var endVec = endPos.clone();
    // ２つのベクトルの回転軸
    var axis = startVec.clone().cross(endVec);
    // 軸ベクトルを単位ベクトルに
    axis.normalize();
    // ２つのベクトルが織りなす角度
    var angle = startVec.angleTo(endVec);
    // ２つの点を結ぶ弧を描くための頂点を打つ
    for (var i = 0; i < segmentNum; i++) {
        // axisを軸としたクォータニオンを生成
        var q = new THREE.Quaternion();
        q.setFromAxisAngle(axis, angle / segmentNum * i);
        // ベクトルを回転させる
        var vertex = startVec.clone().applyQuaternion(q);
        vertices.push(vertex);
    }
    // 終了点を追加
    vertices.push(endVec);
    return vertices;
}
//# sourceMappingURL=sample3.js.map