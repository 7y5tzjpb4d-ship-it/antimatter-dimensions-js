import { BigNumber } from "./BigNumber.js";

// tickspeedのクラス
export class TickSpeed {
  // コンストラクタ
  // cost:コスト
  // costMultiplier:コスト上昇倍率
  constructor(cost, costMultiplier) {
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    
    // tickspeedの個数
    this.amount = new BigNumber(0);
    // tickspeedの購入数
    this.bought = 0;
    // tickspeedの倍率
    this.multiplier = new BigNumber(1);
    
    // リセット用に値を保持しておくための変数
    this.tickMultiplier = new BigNumber(1);
    this._initialCost = new BigNumber(cost.mantissa, cost.exponent);
    this._initialCostMultiplier = new BigNumber(costMultiplier.mantissa, costMultiplier.exponent);
  }

  // 現在のtickspeedのコスト
  currentCost() {
    return this.cost.multiply(this.costMultiplier.power(Math.floor(this.bought)));
  }

  // tickspeed購入処理
  buyTickspeed() {
    this.amount = this.amount.add(new BigNumber(1));
    this.bought++;

    this.multiplier = this.multiplier.multiply(this.tickMultiplier);
  }

  // リセット処理
  reset() {
    this.cost = this._initialCost;
    this.costMultiplier = this._initialCostMultiplier;

    this.amount = new BigNumber(0);
    this.bought = 0;
    this.multiplier = new BigNumber(1);
  }
}