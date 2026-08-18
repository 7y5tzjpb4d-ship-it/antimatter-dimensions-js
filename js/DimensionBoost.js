import { BigNumber } from "./BigNumber.js";

// DimensionBoostのクラス
export class DimensionBoost {
  // コンストラクタ
  constructor() {
    this.boosts = 0;
  }

  // DimensionBoostできるか判定
  can_boost(dimensions) {
    let index = 0;

    if (this.boosts <= 3) {
        index = this.boosts + 3;
    } else {
        index = 7;
    }

    return dimensions[index].bought >= this.required_amount();
  }

  // DimensionBoost時に必要なantimatterの個数を計算
  required_amount() {
    if (this.boosts <= 3) {
        return 20;
    } else {
        return 20 + 15 * (this.boosts - 4);
    }
  }

  // 現時点でアンロックされている最大のdimensionを求める
  max_unlocked_tier() {
    return Math.min(8, 4 + this.boosts);
  }

  // DimensionBoostの実処理
  boost (dimensions, antimatter, tickSpeed) {
    // DimensionBoost不可の場合何もせず終了
    if (!this.can_boost(dimensions)) {
        return antimatter;
    }

    this.boosts++;

    for (let i = 0; i < dimensions.length; i++) {
        dimensions[i].reset();
        // 倍率の更新
        dimensions[i].multiplier = dimensions[i].multiplier.multiply(this.get_multiplier(dimensions[i].tier));
    }

    tickSpeed.reset();

    return new BigNumber(10);
  }

  // DimensionBoostによるボーナス倍率の計算
  get_multiplier(tier) {
    if (this.boosts < tier){
        return 1;
    } else {
        return Math.pow(2, this.boosts - tier + 1);
    }
  }

  // DimensionBoostのリセット
  reset() {
    this.boosts = 0;
  }
}