import { BigNumber } from "./BigNumber.js";

// tickspeedのクラス
export class TickSpeed {
  // コンストラクタ
  // cost:コスト
  // cost_multiplier:コスト上昇倍率
  constructor(cost, cost_multiplier) {
    this.cost = cost;
    this.cost_multiplier = cost_multiplier;
    
    // tickspeedの個数
    this.amount = new BigNumber(0);
    // tickspeedの購入数
    this.bought = 0;
    // tickspeedの倍率
    this.multiplier = new BigNumber(1);
    
    // リセット用に値を保持しておくための変数
    this._initial_cost = new BigNumber(cost.mantissa, cost.exponent);
    this._initial_cost_multiplier = new BigNumber(cost_multiplier.mantissa, cost_multiplier.exponent);
  }

  // 現在のtickspeedのコスト
  current_cost() {
    return this.cost.multiply(this.cost_multiplier.power(Math.floor(this.bought)));
  }

  // tickspeed購入処理
  buy_tickspeed() {
    this.amount = this.amount.add(new BigNumber(1));
    this.bought++;

    this.multiplier = this.multiplier.multiply(new BigNumber(1.1245));
  }

  // リセット処理
  reset() {
    this.cost = this._initial_cost;
    this.cost_multiplier = this._initial_cost_multiplier;

    this.amount = new BigNumber(0);
    this.bought = 0;
    this.multiplier = new BigNumber(1);
  }
}