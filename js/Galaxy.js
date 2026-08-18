import { BigNumber } from "./BigNumber.js";

// Galaxyのクラス
export class Galaxy {
  // コンストラクタ
  constructor() {
    this.galaxies = 0;
    this.base_multipliers = [
        1/1.1245,
        1/1.11888888,
        1/1.11267177,
        0.8
    ];
    this.galaxy_strength = 1;
  }

  // Galaxyできるか判定
  can_galaxy(dimension) {
    return dimension.bought >= this.required_amount();
  }

  // Galaxyの強さを計算
  set_galaxy_strength() {
    // 仮作成
    this.galaxy_strength = 1;
  }

  // Galaxy要求数計算
  required_amount() {
    return 80 + 60 * this.galaxies;
  }

  // Galaxy実処理
  galaxy(dimensions, antimatter, tickspeed, boost) {
    if (!this.can_galaxy(dimensions[7])) {
        return antimatter;
    }

    this.galaxies++;

    for (let i = 0; i < dimensions.length; i++) {
        dimensions[i].reset();
        // 倍率の更新
        dimensions[i].multiplier = dimensions[i].multiplier.multiply(boost.get_multiplier(dimensions[i].tier));
    }

    tickspeed.reset();

    boost.reset();

    return new BigNumber(10);
  }

  // Galaxyの倍率を計算
  get_galaxy_multiplier() {
    if(this.galaxies <= 2) {
        return new BigNumber(1 / (this.base_multipliers[this.galaxies] - 0.02 * this.galaxies * this.galaxy_strength));
    } else {
        return new BigNumber(1 / (this.base_multipliers[3] * 0.965 ** ((this.galaxies - 2) * this.galaxy_strength - 2)));
    }
  }

  // Galaxyのリセット
  reset() {
    this.galaxies = 0;
  }
}