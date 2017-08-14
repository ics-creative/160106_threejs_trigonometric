///<reference path="../../typings/tsd.d.ts" />
///<reference path="Util.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var demo;
(function (demo) {
    /**
     * 地球クラス
     * @author Takayoshi Sawada
     */
    var Earth = (function (_super) {
        __extends(Earth, _super);
        /**
         * コンストラクタ
         */
        function Earth() {
            _super.call(this);
            // 球
            var groundGeometry = new THREE.SphereGeometry(100, 35, 35);
            var groundTexture = THREE.ImageUtils.loadTexture("img/ground.jpg");
            var groundBump = THREE.ImageUtils.loadTexture("img/bump.jpg");
            var specular = THREE.ImageUtils.loadTexture("img/specular.png");
            var groundMaterial = new THREE.MeshPhongMaterial({ map: groundTexture, bumpMap: groundBump, bumpScale: 0.5, specularMap: specular });
            this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
            this.ground.receiveShadow = true;
            this.add(this.ground);
            // 雲
            var cloudGeometry = new THREE.SphereGeometry(102, 35, 35);
            var cloudTexture = THREE.ImageUtils.loadTexture("img/cloud.jpg");
            var cloudMaterial = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true, blending: THREE.AdditiveBlending });
            this.cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            this.cloud.castShadow = true;
            this.add(this.cloud);
        }
        /**
         * 更新
         */
        Earth.prototype.update = function () {
            this.cloud.rotation.y += 0.0005;
        };
        return Earth;
    })(THREE.Group);
    demo.Earth = Earth;
})(demo || (demo = {}));
//# sourceMappingURL=Earth.js.map