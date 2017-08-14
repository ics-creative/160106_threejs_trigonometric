///<reference path="../../typings/tsd.d.ts" />
///<reference path="Util.ts" />
///<reference path="Point.ts" />

module demo {

    /**
     * ポイントを結ぶ線分クラス
     * @author Takayoshi Sawada
     */
    export class Line extends THREE.Group {

        /** 線 **/
        private _line: THREE.Line;
        private _geometry: THREE.Geometry;

        /** 始点となる衛生 **/
        private _startTarget: Point;
        /** 終点となる衛生 **/
        private _endTarget: Point;

        /**
         * コンストラクタ
         * @param startTarget 1個目の衛生
         * @param endTarget 2個目の衛生
         */
        constructor(startTarget, endTarget) {
            super();
            this._startTarget = startTarget;
            this._endTarget = endTarget;

            this._geometry = new THREE.Geometry();

            this._line = new THREE.Line(this._geometry, new THREE.LineBasicMaterial({linewidth: 2, color: 0x00FFFF, transparent: true, opacity: 0.5}));
            this.add(this._line);
        }

        /**
         * 更新
         */
        public update() {
            // 頂点を更新することをフレーム毎に伝える
            this._geometry.verticesNeedUpdate = true;
            this._geometry.vertices = Util.getOrbitPoints(this._startTarget.position, this._endTarget.position);
        }
    }
}