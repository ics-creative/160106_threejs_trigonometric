///<reference path="../../typings/tsd.d.ts" />
///<reference path="Util.ts" />

module demo {

    /**
     * ポイントクラス
     * @author Takayoshi Sawada
     */
    export class Point extends THREE.Group {

        /** 地球からポイントまでの距離 **/
        private _radius: number = 110;

        /** 地球からポイントまでの距離を取得 **/
        public getRadius(): number {
            return this._radius;
        }

        /** 緯度 **/
        private _latitude: number = 0;

        /**
         * 緯度を取得
         */
        public getLatitude(): number {
            return this._latitude;
        }

        /**
         * 緯度を設定
         * @param {number} latitude 緯度
         */
        public setLatitude(latitube:number) {
            this._latitude = latitube;
        }


        /** 経度 **/
        private _longitude:number = 0;

        /**
         * 経度を取得
         */
        public getLongitude():number {
            return this._longitude;
        }

        /**
         * 経度を設定
         * @param {number} longitude 経度
         */
        public setLongitude(longitude:number) {
            this._longitude = longitude;
        }


        /** 球 **/
        public sphere:THREE.Mesh;
        /** 点光源 **/
        public pointLight:THREE.PointLight;

        /**
         * コンストラクタ
         * @param color ポイントの色
         */
        constructor(color:number) {
            super();

            // 球
            let geometry2:THREE.SphereGeometry = new THREE.SphereGeometry(2, 35, 35);
            let material2:THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color: color});
            this.sphere = new THREE.Mesh(geometry2, material2);
            this.sphere.receiveShadow = true;
            this.add(this.sphere);

            // 点光源
            this.pointLight = new THREE.PointLight(color, 2, 0);
            this.add(this.pointLight);
        }

        /**
         * 更新
         */
        public update() {
            let position:THREE.Vector3 = Util.translateGeoCoords(this._latitude, this._longitude, this._radius);
            this.position.copy(position);
        }
    }
}