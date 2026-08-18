import { BigNumber } from "./BigNumber.js";

// Sacrificeのクラス
export class Sacrifice {
  // コンストラクタ
  constructor() {
    this.multiplier = new BigNumber(1)
    this.total_sacrificed_amount = new BigNumber(0)
    this.m = 2;
  }

  // sacrifice可能判定
  can_sacrifice(dimensions, boost) {
    return (
      boost.boosts >= 5 &&
      dimensions[7].bought > 0 &&
      this.next_gain(dimensions).greaterThanOrEqual(new BigNumber(1.01))
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
  next_gain(dimensions) {
    const current_value = this.formula(this.total_sacrificed_amount);

    const next_value = this.formula(this.total_sacrificed_amount.add(dimensions[0].amount));

    return new BigNumber(next_value / current_value);
  }

  // sacrifice実処理
  sacrifice(antimatter, dimensions, boost) {
    if(!this.can_sacrifice(dimensions, boost)) {
      return antimatter
    }

    const current_value = this.formula(this.total_sacrificed_amount);

    const next_value = this.formula(this.total_sacrificed_amount.add(dimensions[0].amount));

    const gain = next_value / current_value;

    this.total_sacrificed_amount = this.total_sacrificed_amount.add(dimensions[0].amount);
    this.multiplier = this.multiplier.multiply(gain);

    for(let i = 0; i < dimensions.length - 1; i++) {
      dimensions[i].amount = new BigNumber(0);
    }

    // 倍率の更新
    dimensions[7].multiplier = dimensions[7].multiplier.multiply(this.multiplier);

    return antimatter;
  }
}