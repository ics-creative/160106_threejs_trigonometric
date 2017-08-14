///<reference path="../../typings/tsd.d.ts" />

module demo {

  export class Util {

    constructor() {
    }

    /**
     * 緯度経度から位置を算出
     * @param {number} latitude 緯度
     * @param {number} longitude 経度
     * @param {number} radius 半径
     */
    static translateGeoCoords(latitude:number, longitude:number, radius:number):THREE.Vector3 {
      // 仰角
      let phi = (latitude) * Math.PI / 180;
      // 方位角
      let theta = (longitude - 180) * Math.PI / 180;

      let x = -(radius) * Math.cos(phi) * Math.cos(theta);
      let y = (radius) * Math.sin(phi);
      let z = (radius) * Math.cos(phi) * Math.sin(theta);

      return new THREE.Vector3(x, y, z);
    }

    /**
     * 軌道の座標を配列で返します
     * @param startPos 開始点
     * @param endPos 終了点
     * @param segmentNum セグメント分割数
     */
    static getOrbitPoints(startPos:THREE.Vector3, endPos:THREE.Vector3, segmentNum:number = 100):THREE.Vector3[] {

      // 頂点を格納する配列
      let vertices:THREE.Vector3[] = [];

      let startVec:THREE.Vector3 = startPos.clone();
      let endVec:THREE.Vector3 = endPos.clone();

      // ２つのベクトルの回転軸
      let axis:THREE.Vector3 = startVec.clone().cross(endVec);
      axis.normalize();

      // ２つのベクトルが織りなす角度
      let angle:number = startVec.angleTo(endVec);

      // ２つの衛星を結ぶ弧を描くための頂点を打つ
      for (let i:number = 0; i < segmentNum; i++) {
        // axisを軸としたクォータニオンを生成
        let q:THREE.Quaternion = new THREE.Quaternion();
        q.setFromAxisAngle(axis, angle / segmentNum * i);
        // ベクトルを回転させる
        vertices.push(startVec.clone().applyQuaternion(q));
      }

      // 終了点を追加
      vertices.push(endVec);

      return vertices;
    }


  }
}