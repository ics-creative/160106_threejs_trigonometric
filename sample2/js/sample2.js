///<reference path="../../typings/tsd.d.ts" />
window.addEventListener("load", init);
function init() {
    /** 主要都市一覧 **/
    var cities = [];
    /** 主要都市緯度経度一覧 **/
    var citiesPoints = [
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
    // リスト分のポイントをプロット
    for (var i = 0; i < citiesPoints.length; i++) {
        var latitude = citiesPoints[i][0];
        var longitude = citiesPoints[i][1];
        // ポイント
        var point = createPoint(i == 0 ? 0xff0000 : latitude == 90 ? 0x0000FF : 0x00FF00, latitude, longitude);
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
//# sourceMappingURL=sample2.js.map