///<reference path="../../typings/tsd.d.ts" />
///<reference path="Earth.ts" />
///<reference path="Point.ts" />
///<reference path="Line.ts" />
window.addEventListener("load", function () {
    new demo.Main();
});
var demo;
(function (demo) {
    /**
     * Three,jsを用いた三角関数モーションのクラスです。
     * @author Takayoshi Sawada
     */
    var Main = (function () {
        function Main() {
            /** 主要都市一覧 **/
            this.cities = [];
            this.citiesLine = [];
            /** 主要都市緯度経度一覧 **/
            this.citiesPoints = [
                [51.2838, 0],
                [39, -116],
                [34, 118],
                [-33, 151],
                [-23, -46],
                [1, 103],
                [90, 0],
                [-90, 0],
            ];
            this.setup();
        }
        /**
         * セットアップ
         */
        Main.prototype.setup = function () {
            var _this = this;
            this.containerElement = document.createElement('div');
            document.body.appendChild(this.containerElement);
            // シーン
            this.scene = new THREE.Scene();
            // カメラ
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
            this.camera.position.set(-250, 0, -250);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            // レンダラー
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 1);
            this.renderer.shadowMap.enabled = true;
            this.containerElement.appendChild(this.renderer.domElement);
            // カメラコントローラー
            this.controller = new THREE.TrackballControls(this.camera, this.renderer.domElement);
            this.controller.noPan = true;
            this.controller.minDistance = 200;
            this.controller.maxDistance = 1000;
            // 環境光
            var ambientLight = new THREE.AmbientLight(0x111111);
            this.scene.add(ambientLight);
            // スポットライト
            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-10000, 0, 0);
            spotLight.castShadow = true; //影
            this.scene.add(spotLight);
            // 地球
            this.earth = new demo.Earth();
            this.scene.add(this.earth);
            // 背景
            var geometry2 = new THREE.SphereGeometry(1000, 60, 40);
            geometry2.scale(-1, 1, 1);
            var material2 = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/star.jpg")
            });
            var background = new THREE.Mesh(geometry2, material2);
            this.scene.add(background);
            // 日本
            this.japan = new demo.Point(0xFFFF00);
            this.japan.setLatitude(35.658651);
            this.japan.setLongitude(139.742689);
            this.scene.add(this.japan);
            // 主要都市をプロットして線を引く
            this.citiesPoints.forEach(function (point) {
                // 都市
                var place = new demo.Point(0xFF00FF);
                place.setLatitude(point[0]);
                place.setLongitude(point[1]);
                _this.cities.push(place);
                _this.scene.add(place);
                // 線を引く
                var line = new demo.Line(_this.japan, place);
                _this.citiesLine.push(line);
                _this.scene.add(line);
            });
            // 赤道上衛星3
            this.satellite = new demo.Point(0xFF0000);
            this.scene.add(this.satellite);
            // フレーム毎のレンダーを登録
            this.render();
        };
        /**
         * フレーム毎にさせる処理
         */
        Main.prototype.render = function () {
            requestAnimationFrame(_.bind(this.render, this));
            // 公転させる
            this.satellite.setLongitude(this.satellite.getLongitude() + 1);
            // 地球を更新
            this.earth.update();
            // 日本を更新
            this.japan.update();
            // 主要都市を更新
            for (var index = 0; index < this.cities.length; index++) {
                this.cities[index].update();
                this.citiesLine[index].update();
            }
            // 人工衛星を更新
            this.satellite.update();
            // カメラコントローラーの更新
            this.controller.update();
            this.renderer.render(this.scene, this.camera);
        };
        return Main;
    })();
    demo.Main = Main;
})(demo || (demo = {}));
//# sourceMappingURL=demo.js.map