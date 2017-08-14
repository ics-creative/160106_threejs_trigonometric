///<reference path="../../typings/tsd.d.ts" />
var demo;
(function (demo) {
    var Util = (function () {
        function Util() {
        }
        /**
         * 緯度経度から位置を算出
         * @param {number} latitude 緯度
         * @param {number} longitude 経度
         * @param {number} radius 半径
         */
        Util.translateGeoCoords = function (latitude, longitude, radius) {
            // 仰角
            var phi = (latitude) * Math.PI / 180;
            // 方位角
            var theta = (longitude - 180) * Math.PI / 180;
            var x = -(radius) * Math.cos(phi) * Math.cos(theta);
            var y = (radius) * Math.sin(phi);
            var z = (radius) * Math.cos(phi) * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
        };
        /**
         * 軌道の座標を配列で返します
         * @param startPos 開始点
         * @param endPos 終了点
         * @param segmentNum セグメント分割数
         */
        Util.getOrbitPoints = function (startPos, endPos, segmentNum) {
            if (segmentNum === void 0) { segmentNum = 100; }
            // 頂点を格納する配列
            var vertices = [];
            var startVec = startPos.clone();
            var endVec = endPos.clone();
            // ２つのベクトルの回転軸
            var axis = startVec.clone().cross(endVec);
            axis.normalize();
            // ２つのベクトルが織りなす角度
            var angle = startVec.angleTo(endVec);
            // ２つの衛星を結ぶ弧を描くための頂点を打つ
            for (var i = 0; i < segmentNum; i++) {
                // axisを軸としたクォータニオンを生成
                var q = new THREE.Quaternion();
                q.setFromAxisAngle(axis, angle / segmentNum * i);
                // ベクトルを回転させる
                vertices.push(startVec.clone().applyQuaternion(q));
            }
            // 終了点を追加
            vertices.push(endVec);
            return vertices;
        };
        return Util;
    })();
    demo.Util = Util;
})(demo || (demo = {}));
//# sourceMappingURL=Util.js.map