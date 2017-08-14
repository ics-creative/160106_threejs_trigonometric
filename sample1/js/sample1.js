///<reference path="../../typings/tsd.d.ts" />
window.addEventListener("load", init);
function init() {
    // シーン
    var scene = new THREE.Scene();
    // カメラ
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // レンダラー
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var degree = 0; // 角度
    var radius = 300; // 半径
    // 球
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    scene.add(sphere);
    var earth = new THREE.Mesh(new THREE.SphereGeometry(250), new THREE.MeshBasicMaterial({ wireframe: true }));
    scene.add(earth);
    // フレーム毎の再描画
    function tick() {
        requestAnimationFrame(tick);
        // 球を回転させる
        degree += 5;
        // 角度をラジアンに変換します
        var rad = degree * Math.PI / 180;
        // X座標 = 半径 x Cosθ
        var x = radius * Math.cos(rad);
        // Y座標 = 半径 x Sinθ
        var y = radius * Math.sin(rad);
        sphere.position.set(x, y, 0);
        renderer.render(scene, camera);
    }
    tick();
}
//# sourceMappingURL=sample1.js.map