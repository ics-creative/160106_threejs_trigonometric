///<reference path="../../typings/tsd.d.ts" />
///<reference path="Util.ts" />
///<reference path="Point.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var demo;
(function (demo) {
    /**
     * ポイントを結ぶ線分クラス
     * @author Takayoshi Sawada
     */
    var Line = (function (_super) {
        __extends(Line, _super);
        /**
         * コンストラクタ
         * @param startTarget 1個目の衛生
         * @param endTarget 2個目の衛生
         */
        function Line(startTarget, endTarget) {
            _super.call(this);
            this._startTarget = startTarget;
            this._endTarget = endTarget;
            this._geometry = new THREE.Geometry();
            this._line = new THREE.Line(this._geometry, new THREE.LineBasicMaterial({ linewidth: 2, color: 0x00FFFF, transparent: true, opacity: 0.5 }));
            this.add(this._line);
        }
        /**
         * 更新
         */
        Line.prototype.update = function () {
            // 頂点を更新することをフレーム毎に伝える
            this._geometry.verticesNeedUpdate = true;
            this._geometry.vertices = demo.Util.getOrbitPoints(this._startTarget.position, this._endTarget.position);
        };
        return Line;
    })(THREE.Group);
    demo.Line = Line;
})(demo || (demo = {}));
//# sourceMappingURL=Line.js.map