import { BigNumber } from "./BigNumber.js";

// Galaxyのクラス
export class Galaxy {
  // コンストラクタ
  constructor() {
    this.galaxies = 0;
    this.baseMultipliers = [
        1/1.1245,
        1/1.11888888,
        1/1.11267177,
        0.8
    ];
  }

  // Galaxyできるか判定
  canGalaxy(dimension) {
    return dimension.bought >= this.requiredAmount();
  }

  // Galaxy要求数計算
  requiredAmount() {
    return 80 + 60 * this.galaxies;
  }

  // Galaxy実処理
  galaxy(dimensions, antimatter, tickspeed, boost) {
    if (!this.canGalaxy(dimensions[7])) {
        return antimatter;
    }

    this.galaxies++;

    for (let i = 0; i < dimensions.length; i++) {
        dimensions[i].reset();
        // 倍率の更新
        dimensions[i].multiplier = dimensions[i].multiplier.multiply(boost.getMultiplier(dimensions[i].tier));
    }

    tickspeed.reset();

    boost.reset();

    return new BigNumber(10);
  }

  // Galaxyの倍率を計算
  getGalaxyMultiplier() {
    if(this.galaxies <= 2) {
        return new BigNumber(1 / (this.baseMultipliers[this.galaxies] - 0.02 * this.galaxies));
    } else {
        return new BigNumber(1 / (this.baseMultipliers[3] * 0.965 ** ((this.galaxies - 2) - 2)));
    }
  }

  // Galaxyのリセット
  reset() {
    this.galaxies = 0;
  }
}