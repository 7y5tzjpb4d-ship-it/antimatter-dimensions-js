import { BigNumber } from "./BigNumber.js";
import { Dimension } from "./Dimension.js";
import { DimensionBoost } from "./DimensionBoost.js";

let antimatter = new BigNumber(10);

const antimatterDisplay = document.getElementById("antimatter-display");

const dimensionMultiplier = [
  document.getElementById("dimension1-multiplier"),
  document.getElementById("dimension2-multiplier"),
  document.getElementById("dimension3-multiplier"),
  document.getElementById("dimension4-multiplier"),
  document.getElementById("dimension5-multiplier"),
  document.getElementById("dimension6-multiplier"),
  document.getElementById("dimension7-multiplier"),
  document.getElementById("dimension8-multiplier")
];

const dimensionAmount = [
  document.getElementById("dimension1-amount"),
  document.getElementById("dimension2-amount"),
  document.getElementById("dimension3-amount"),
  document.getElementById("dimension4-amount"),
  document.getElementById("dimension5-amount"),
  document.getElementById("dimension6-amount"),
  document.getElementById("dimension7-amount"),
  document.getElementById("dimension8-amount")
];

const dimensionBuyCount = [
  document.getElementById("dimension1-buy-count"),
  document.getElementById("dimension2-buy-count"),
  document.getElementById("dimension3-buy-count"),
  document.getElementById("dimension4-buy-count"),
  document.getElementById("dimension5-buy-count"),
  document.getElementById("dimension6-buy-count"),
  document.getElementById("dimension7-buy-count"),
  document.getElementById("dimension8-buy-count")
];

const dimensionCost = [
  document.getElementById("dimension1-cost"),
  document.getElementById("dimension2-cost"),
  document.getElementById("dimension3-cost"),
  document.getElementById("dimension4-cost"),
  document.getElementById("dimension5-cost"),
  document.getElementById("dimension6-cost"),
  document.getElementById("dimension7-cost"),
  document.getElementById("dimension8-cost")
];

const dimensionBuyButton = [
  document.getElementById("dimension1-buy-button"),
  document.getElementById("dimension2-buy-button"),
  document.getElementById("dimension3-buy-button"),
  document.getElementById("dimension4-buy-button"),
  document.getElementById("dimension5-buy-button"),
  document.getElementById("dimension6-buy-button"),
  document.getElementById("dimension7-buy-button"),
  document.getElementById("dimension8-buy-button")
];

const dimensionRow = [
  document.getElementById("dimension1-row"),
  document.getElementById("dimension2-row"),
  document.getElementById("dimension3-row"),
  document.getElementById("dimension4-row"),
  document.getElementById("dimension5-row"),
  document.getElementById("dimension6-row"),
  document.getElementById("dimension7-row"),
  document.getElementById("dimension8-row")
];
const dimensionBoostCount = document.getElementById("dimension-boost-count");
const dimensionBoostRequires = document.getElementById("dimension-boost-requires");
const dimensionBoostButtonRequires = document.getElementById("dimension-boost-button-requires");
const dimensionBoostButtonMultiplier = document.getElementById("dimension-boost-button-multiplier");

const dimensionBoostButton = document.getElementById("dimension-boost-button");

// 各dimensions
const dimensions = [
  new Dimension(new BigNumber(1, 1), new BigNumber(1, 3), 1),
  new Dimension(new BigNumber(1, 2), new BigNumber(1, 4), 2),
  new Dimension(new BigNumber(1, 4), new BigNumber(1, 5), 3),
  new Dimension(new BigNumber(1, 6), new BigNumber(1, 6), 4),
  new Dimension(new BigNumber(1, 9), new BigNumber(1, 8), 5),
  new Dimension(new BigNumber(1, 13), new BigNumber(1, 10), 6),
  new Dimension(new BigNumber(1, 18), new BigNumber(1, 12), 7),
  new Dimension(new BigNumber(1, 24), new BigNumber(1, 15), 8)
];
const dimensionBoost = new DimensionBoost();

for (let i = 0; i < dimensions.length; i++) {
  dimensionBuyButton[i].addEventListener("click", ()=>{
    if (dimensions[i].tier <= dimensionBoost.max_unlocked_tier()) {
      const count = dimensions[i].buy_count(antimatter);
      if (count > 0) {
        antimatter = antimatter.subtract(dimensions[i].current_cost().multiply(count));
        dimensions[i].buy_dimensions(count);
      }
    }
  });
}

dimensionBoostButton.addEventListener("click", ()=>{
  antimatter = dimensionBoost.boost(dimensions, antimatter)
});

let lastTimestamp = null;

function gameLoop(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  const dt = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  for (let i = dimensions.length - 1; i > 0; i--) {
    // 未解禁のDimensionは生産処理をしない
    if (dimensions[i].tier <= dimensionBoost.max_unlocked_tier()) {
      dimensions[i-1].amount = dimensions[i-1].amount.add(
        dimensions[i].produce(dt, dimensions[i].tier)
        .multiply(dimensionBoost.get_multiplier(dimensions[i].tier)));
    }
  }
  antimatter = antimatter.add(dimensions[0].produce(dt, dimensions[0].tier));
}

function render() {
  // antimatterの描画
  antimatterDisplay.textContent = `${antimatter.toDisplayString(1)} Antimatter`;

  // Dimensionの描画
  for (let i = 0; i < dimensions.length; i++) {
    // Dimensionのコスト取得
    const cost = dimensions[i].current_cost();
    const count = dimensions[i].buy_count(antimatter);
    // 各Dimensionのテキスト
    dimensionMultiplier[i].textContent = `x${dimensions[i].multiplier.toDisplayString(2)}`;
    dimensionAmount[i].textContent = dimensions[i].amount.toDisplayString(0);
    dimensionBuyCount[i].textContent = `Buy ${count}`;
    if (count < 1) { // 買えない場合
      dimensionCost[i].textContent = `Cost: ${cost.toDisplayString(0)}`;
    } else { // 買える場合
      dimensionCost[i].textContent = `Cost: ${(cost.multiply(count)).toDisplayString(0)}`;
    }

    // ボタンの色クラスをリセット
    dimensionBuyButton[i].classList.remove("can-buy", "cannot-buy");
    
    // ボタンの色を購入可否によって変更
    if (antimatter.greaterThanOrEqual(cost)) {
      dimensionBuyButton[i].classList.add("can-buy");
    } else {
      dimensionBuyButton[i].classList.add("cannot-buy");
    }

    // Dimensionの表示非表示
    if (i > 0) {
      if (dimensions[i-1].bought <= 0) {
        dimensionRow[i].classList.add("hide");
      } else {
        dimensionRow[i].classList.remove("hide");
      }
    }
  }

  // DimensionBoostの描画
  const tier = dimensionBoost.max_unlocked_tier();
  dimensionBoostCount.textContent = `Dimension Boost (${dimensionBoost.boosts})`;
  dimensionBoostRequires.textContent = `Requires: ${dimensionBoost.required_amount()} ${tier}th Antimatter D`;
  dimensionBoostButtonRequires.textContent = `${tier}th Dimension and give a ×2.0`;

  if (dimensionBoost.boosts === 0) {
    dimensionBoostButtonMultiplier.textContent = `multiplier to the 1st Dimension`;
  } else if (dimensionBoost.boosts <= 6) {
    dimensionBoostButtonMultiplier.textContent = `multiplier to Dimensions 1-${dimensionBoost.boosts + 1}`;
  } else {
    dimensionBoostButtonMultiplier.textContent = `multiplier to all Dimensions`;
  }

  // ボタンの色クラスをリセット
  dimensionBoost.classList.remove("can-boost", "cannot-boost");
    
  // ボタンの色をDimensionBoost可否によって変更
  if (dimensionBoost.can_boost(dimensions)) {
    dimensionBoost.classList.add("can-boost");
  } else {
    dimensionBoost.classList.add("cannot-boost");
  }
}

requestAnimationFrame(gameLoop);
