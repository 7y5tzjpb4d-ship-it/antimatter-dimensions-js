import { BigNumber } from "./BigNumber.js";

// Normal Dimensionのクラス
export class Dimension {
  // コンストラクタ
  // cost:コスト
  // cost_multiplier:コスト上昇倍率
  // tier:次元数
  constructor(cost, cost_multiplier, tier) {
    this.cost = cost;
    this.cost_multiplier = cost_multiplier;
    this.tier = tier;

    // Dimensionの個数
    this.amount = new BigNumber(0);
    // Dimensionの購入数
    this.bought = 0;
    // Dimensionの倍率
    this.multiplier = new BigNumber(1);

    // リセット用に値を保持しておくための変数
    this._initial_cost = new BigNumber(cost.mantissa, cost.exponent);
    this._initial_cost_multiplier = new BigNumber(cost_multiplier.mantissa, cost_multiplier.exponent);
  }

  // 現在のDimensionのコスト
  current_cost() {
    return this.cost.multiply(this.cost_multiplier.power(Math.floor(this.bought / 10)));
  }

  // countの数だけDimensionを購入
  buy_dimensions(count) {

    for (let i = 0; i < count; i++) {
        this.amount = this.amount.add(new BigNumber(1));
        this.bought++;

        if (this.bought % 10 === 0) {
            this.multiplier = this.multiplier.multiply(new BigNumber(2));
        }
    }
  }

  // リセット処理
  reset() {
    this.cost = this._initial_cost;
    this.cost_multiplier = this._initial_cost_multiplier;

    this.amount = new BigNumber(0);
    this.bought = 0;
    this.multiplier = new BigNumber(1);
  }

  // 次の10の倍数まで買える数を計算
  next_multiple_need() {
    return 10 - this.bought % 10;
  }

  // 現在の所持antimatterで買える数を計算
  buyable_count(antimatter) {
    let count = 0;

    // 計算に必要な値のコピーを作成
    let temp_antimatter = antimatter;
    let temp_cost = this.current_cost();
    let temp_bought = this.bought;

    while (temp_antimatter.greaterThanOrEqual(temp_cost)) {
        temp_antimatter = temp_antimatter.subtract(temp_cost);

        count++;
        temp_bought++;

        if (temp_bought % 10 === 0) {
            temp_cost = temp_cost.multiply(this.cost_multiplier);
        }
    }

    return count;
  } 

  // 購入可能数を計算
  buy_count(antimatter) {
    return Math.min(this.next_multiple_need(), this.buyable_count(antimatter));
  }

  // Dimensionの生産量を計算
  produce(dt, tier) {

    const result = this.amount
      .multiply(this.multiplier
      .multiply(dt));
    
    if (tier === 1) {
        return result;
    } else {
        return result.multiply(0.1);
    }
  }
}

