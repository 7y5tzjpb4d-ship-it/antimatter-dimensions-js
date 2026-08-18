import { BigNumber } from "./BigNumber.js";

// Normal Dimensionのクラス
export class Dimension {
  // コンストラクタ
  // cost:コスト
  // costMultiplier:コスト上昇倍率
  // tier:次元数
  constructor(cost, costMultiplier, tier) {
    this.cost = cost;
    this.costMultiplier = costMultiplier;
    this.tier = tier;

    // Dimensionの個数
    this.amount = new BigNumber(0);
    // Dimensionの購入数
    this.bought = 0;
    // Dimensionの倍率
    this.multiplier = new BigNumber(1);

    // リセット用に値を保持しておくための変数
    this._initialCost = new BigNumber(cost.mantissa, cost.exponent);
    this._initialCostMultiplier = new BigNumber(costMultiplier.mantissa, costMultiplier.exponent);
  }

  // 現在のDimensionのコスト
  currentCost() {
    return this.cost.multiply(this.costMultiplier.power(Math.floor(this.bought / 10)));
  }

  // countの数だけDimensionを購入
  buyDimensions(count) {

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
    this.cost = this._initialCost;
    this.costMultiplier = this._initialCostMultiplier;

    this.amount = new BigNumber(0);
    this.bought = 0;
    this.multiplier = new BigNumber(1);
  }

  // 次の10の倍数まで買える数を計算
  nextMultipleNeed() {
    return 10 - this.bought % 10;
  }

  // 現在の所持antimatterで買える数を計算
  buyableCount(antimatter) {
    let count = 0;

    // 計算に必要な値のコピーを作成
    let tempAntimatter = antimatter;
    let tempCost = this.currentCost();
    let tempBought = this.bought;

    while (tempAntimatter.greaterThanOrEqual(tempCost)) {
        tempAntimatter = tempAntimatter.subtract(tempCost);

        count++;
        tempBought++;

        if (tempBought % 10 === 0) {
            tempCost = tempCost.multiply(this.costMultiplier);
        }
    }

    return count;
  } 

  // 購入可能数を計算
  buyCount(antimatter) {
    return Math.min(this.nextMultipleNeed(), this.buyableCount(antimatter));
  }

  // MaxAllボタンでの最大購入
  buyMax(antimatter) {
    let cost = this.currentCost();
    let remainingInBlock = this.nextMultipleNeed();

    while(true) {
      const blockCost = cost.multiply(remainingInBlock);
      if(antimatter.greaterThanOrEqual(blockCost)) {
        antimatter = antimatter.subtract(blockCost);
        this.buyDimensions(remainingInBlock);
        cost = this.currentCost();  // bought % 10 == 0 で自動的に次のコストになる
        remainingInBlock = 10;
      } else {
        let n = 0;
        while(antimatter.greaterThanOrEqual(cost) && n < remainingInBlock) {
          antimatter = antimatter.subtract(cost);
          n++;
        }
        if (n > 0) {
          this.buyDimensions(n);
        }
        break;
      }
    }

    return antimatter;
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

