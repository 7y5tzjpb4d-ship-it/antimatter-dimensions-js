import { BigNumber } from "./BigNumber.js";

// Sacrificeのクラス
export class Sacrifice {
  // コンストラクタ
  constructor() {
    this.multiplier = new BigNumber(1)
    this.totalSacrificedAmount = new BigNumber(0)
    this.m = 2;
  }

  // sacrifice可能判定
  canSacrifice(dimensions, boost) {
    return (
      boost.boosts >= 5 &&
      dimensions[7].bought > 0 &&
      this.nextGain(dimensions).greaterThanOrEqual(new BigNumber(1.01))
    );
  }

  // sacrificeの数式
  formula(amount) {
    if (amount.mantissa === 0) {
      return 1.0;
    }

    return Math.pow(Math.max(amount.log10() / 10.0, 1), this.m);
  }

  // sacrificeで得られる倍率
  nextGain(dimensions) {
    const currentValue = this.formula(this.totalSacrificedAmount);

    const nextValue = this.formula(this.totalSacrificedAmount.add(dimensions[0].amount));

    return new BigNumber(nextValue / currentValue);
  }

  // sacrifice実処理
  sacrifice(antimatter, dimensions, boost) {
    if(!this.canSacrifice(dimensions, boost)) {
      return antimatter
    }

    const currentValue = this.formula(this.totalSacrificedAmount);

    const nextValue = this.formula(this.totalSacrificedAmount.add(dimensions[0].amount));

    const gain = nextValue / currentValue;

    this.totalSacrificedAmount = this.totalSacrificedAmount.add(dimensions[0].amount);
    this.multiplier = this.multiplier.multiply(gain);

    for(let i = 0; i < dimensions.length - 1; i++) {
      dimensions[i].amount = new BigNumber(0);
    }

    // 倍率の更新
    dimensions[7].multiplier = dimensions[7].multiplier.multiply(this.multiplier);

    return antimatter;
  }
}