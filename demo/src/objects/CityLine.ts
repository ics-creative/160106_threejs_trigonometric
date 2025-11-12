import * as THREE from "three";
import { GeoUtil } from "../utils/GeoUtil";

/**
 * ポイントを結ぶ線分の表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export class CityLine extends THREE.Group {
  /** 線 **/
  private readonly _line: THREE.Line;

  private readonly _geometry: THREE.BufferGeometry;

  /**
   * コンストラクタ
   * @param {CityPoint} _startTarget 始点となる衛星
   * @param {CityPoint} _endTarget 終点となる衛星
   */
  constructor(
    private _startTarget: THREE.Object3D,
    private _endTarget: THREE.Object3D,
  ) {
    super();

    this._geometry = new THREE.BufferGeometry();

    this._line = new THREE.Line(
      this._geometry,
      new THREE.LineBasicMaterial({
        linewidth: 2,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
      }),
    );
    this.add(this._line);
  }

  /**
   * 更新
   */
  public update() {
    const points = GeoUtil.createOrbitPoints(
      this._startTarget.position,
      this._endTarget.position,
    );

    // 頂点を更新
    this._geometry.setFromPoints(points);
  }
}
