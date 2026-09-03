import { BigNumber } from "./BigNumber.js";

// Infinityのクラス
export class Infinity {
    // コンストラクタ
    constructor() {
        this.infinities = new BigNumber(0);
        this.IP = new BigNumber(0);
        this.firstInfinityFlg = true;
    }

    // Infinity可能判定
    canInfinity(antimatter) {
        return antimatter.greaterThanOrEqual(new BigNumber(1.8, 308));
    }

    // Infinity実行
    infinity(dimensions, antimatter, tickspeed, boost, galaxy, sacrifice) {
        if (!this.canInfinity(antimatter)) {
            return antimatter;
        }

        this.infinities = this.infinities.add(new BigNumber(1));
        this.IP = this.IP.add(new BigNumber(1));

        for (let i = 0; i < dimensions.length; i++) {
            dimensions[i].reset();
            // 倍率の更新
            dimensions[i].multiplier = dimensions[i].multiplier.multiply(boost.getMultiplier(dimensions[i].tier));
        }

        tickspeed.reset();

        galaxy.reset();

        sacrifice.reset();

        if (this.firstInfinityFlg) {
            this.firstInfinityFlg = false;
        }

        return new BigNumber(10);
    }
}