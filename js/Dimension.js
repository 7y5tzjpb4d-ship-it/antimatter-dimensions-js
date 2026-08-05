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
  }

  // 現在のDimensionのコスト
  current_cost() {
    return this.cost.multiply(this.cost_multiplier.power(Math.floor(this.bought / 10)));
  }

  // Dimension購入時の処理
  buy_dimension() {
    this.amount = this.amount.add(new BigNumber(1));
    this.bought++;

    if (this.bought % 10 === 0) {
        this.multiplier = this.multiplier.multiply(new BigNumber(2));
    }
  }
}

