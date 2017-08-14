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
     * ポイントクラス
     * @author Takayoshi Sawada
     */
    var Point = (function (_super) {
        __extends(Point, _super);
        /**
         * コンストラクタ
         * @param color ポイントの色
         */
        function Point(color) {
            _super.call(this);
            /** 地球からポイントまでの距離 **/
            this._radius = 110;
            /** 緯度 **/
            this._latitude = 0;
            /** 経度 **/
            this._longitude = 0;
            // 球
            var geometry2 = new THREE.SphereGeometry(2, 35, 35);
            var material2 = new THREE.MeshLambertMaterial({ color: color });
            this.sphere = new THREE.Mesh(geometry2, material2);
            this.sphere.receiveShadow = true;
            this.add(this.sphere);
            // 点光源
            this.pointLight = new THREE.PointLight(color, 2, 0);
            this.add(this.pointLight);
        }
        /** 地球からポイントまでの距離を取得 **/
        Point.prototype.getRadius = function () {
            return this._radius;
        };
        /**
         * 緯度を取得
         */
        Point.prototype.getLatitude = function () {
            return this._latitude;
        };
        /**
         * 緯度を設定
         * @param {number} latitude 緯度
         */
        Point.prototype.setLatitude = function (latitube) {
            this._latitude = latitube;
        };
        /**
         * 経度を取得
         */
        Point.prototype.getLongitude = function () {
            return this._longitude;
        };
        /**
         * 経度を設定
         * @param {number} longitude 経度
         */
        Point.prototype.setLongitude = function (longitude) {
            this._longitude = longitude;
        };
        /**
         * 更新
         */
        Point.prototype.update = function () {
            var position = demo.Util.translateGeoCoords(this._latitude, this._longitude, this._radius);
            this.position.copy(position);
        };
        return Point;
    })(THREE.Group);
    demo.Point = Point;
})(demo || (demo = {}));
//# sourceMappingURL=Point.js.map