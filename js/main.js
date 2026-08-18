import { BigNumber } from "./BigNumber.js";
import { Dimension } from "./Dimension.js";
import { Sacrifice } from "./Sacrifice.js";
import { TickSpeed } from "./TickSpeed.js";
import { DimensionBoost } from "./DimensionBoost.js";
import { Galaxy } from "./Galaxy.js";

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
const tickSpeedElement = document.getElementById("tickspeed");
const tickSpeedCostElement = document.getElementById("tickspeed-cost");
const dimensionBoostCount = document.getElementById("dimension-boost-count");
const dimensionBoostRequires = document.getElementById("dimension-boost-requires");
const dimensionBoostButtonRequires = document.getElementById("dimension-boost-button-requires");
const dimensionBoostButtonMultiplier = document.getElementById("dimension-boost-button-multiplier");
const galaxyCount = document.getElementById("galaxy-count");
const galaxyRequires = document.getElementById("galaxy-requires");
const sacrificeElement = document.getElementById("sacrifice");
const sacrificeText = document.getElementById("sacrifice-text");

const tickSpeedButton = document.getElementById("tickspeed-button");
const dimensionBoostButton = document.getElementById("dimension-boost-button");
const galaxyButton = document.getElementById("galaxy-button");
const sacrificeButton = document.getElementById("sacrifice-button");

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
const tickSpeed = new TickSpeed(new BigNumber(1, 3), new BigNumber(1, 1));
const dimensionBoost = new DimensionBoost();
const galaxy = new Galaxy();
const sacrifice = new Sacrifice();

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

tickSpeedButton.addEventListener("click", ()=>{
  const cost = tickSpeed.current_cost();

  if (antimatter.greaterThanOrEqual(cost)) {
    tickSpeed.buy_tickspeed();
    antimatter = antimatter.subtract(cost);
  }
});

dimensionBoostButton.addEventListener("click", ()=>{
  antimatter = dimensionBoost.boost(dimensions, antimatter, tickSpeed);
});

galaxyButton.addEventListener("click", ()=>{
  antimatter = galaxy.galaxy(dimensions, antimatter, tickSpeed, dimensionBoost);
});

sacrificeButton.addEventListener("click", ()=>{
  antimatter = sacrifice.sacrifice(antimatter, dimensions, dimensionBoost);
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
  // 生産処理の前にTickSpeed倍率の更新
  tickSpeed.tick_multiplier = galaxy.get_galaxy_multiplier()
  for (let i = dimensions.length - 1; i > 0; i--) {
    // 未解禁のDimensionは生産処理をしない
    if (dimensions[i].tier <= dimensionBoost.max_unlocked_tier()) {
      dimensions[i-1].amount = dimensions[i-1].amount.add(
        dimensions[i].produce(dt, dimensions[i].tier)
        .multiply(dimensionBoost.get_multiplier(dimensions[i].tier))
        .multiply(tickSpeed.multiplier));
    }
  }
  antimatter = antimatter.add(dimensions[0].produce(dt, dimensions[0].tier));
}

function render() {
  // 必要な値をあらかじめ取得
  const tier = dimensionBoost.max_unlocked_tier();
  const tickSpeedCost = tickSpeed.current_cost();
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
      if ((dimensionBoost.boosts <= 0 && dimensions[i-1].bought <= 0) || !(dimensions[i].tier <= tier)) {
        dimensionRow[i].classList.add("hide");
      } else {
        dimensionRow[i].classList.remove("hide");
      }
    }
  }

  // tickspeedの描画
  // 2nd Dimension解禁時にボタン表示する
  if (dimensions[0].bought < 1) {
    tickSpeedElement.classList.add("hidden");
  } else {
    tickSpeedElement.classList.remove("hidden");
  }

  tickSpeedCostElement.textContent = `Tickspeed Cost: ${tickSpeed.current_cost().toDisplayString(0)}`;

  // ボタンの色クラスをリセット
  tickSpeedButton.classList.remove("can-tickspeed", "cannot-tickspeed");
    
  // ボタンの色をtickspeed購入可否によって変更
  if (antimatter.greaterThanOrEqual(tickSpeedCost)) {
    tickSpeedButton.classList.add("can-tickspeed");
  } else {
    tickSpeedButton.classList.add("cannot-tickspeed");
  }

  // DimensionBoostの描画
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
  dimensionBoostButton.classList.remove("can-reset", "cannot-reset");
    
  // ボタンの色をDimensionBoost可否によって変更
  if (dimensionBoost.can_boost(dimensions)) {
    dimensionBoostButton.classList.add("can-reset");
  } else {
    dimensionBoostButton.classList.add("cannot-reset");
  }

  // Galaxyの描画
  galaxyCount.textContent = `Antimatter Galaxies (${galaxy.galaxies})`;
  galaxyRequires.textContent = `Requires: ${galaxy.required_amount()} 8th Antimatter D`;

  // ボタンの色クラスをリセット
  galaxyButton.classList.remove("can-reset", "cannot-reset");
    
  // ボタンの色をGalaxy可否によって変更
  if (galaxy.can_galaxy(dimensions[7])) {
    galaxyButton.classList.add("can-reset");
  } else {
    galaxyButton.classList.add("cannot-reset");
  }

  // Sacrificeの描画
  if (dimensionBoost.boosts <= 4) {
    sacrificeText.textContent = `Dimensional Sacrifice Disabled (Requires 5 Dimension Boosts)`;
  } else if (dimensions[7].bought <= 0) {
    sacrificeText.textContent = `Dimensional Sacrifice Disabled (No 8th Antimatter Dimensions)`;
  } else {
    sacrificeText.textContent = `Dimensional Sacrifice (x${sacrifice.next_gain(dimensions).toDisplayString(2)})`;
  }

  // ボタンの色クラスをリセット
  sacrificeButton.classList.remove("can-reset", "cannot-reset");
    
  // ボタンの色をSacrifice可否によって変更
  if (sacrifice.can_sacrifice(dimensions, dimensionBoost)) {
    sacrificeButton.classList.add("can-reset");
  } else {
    sacrificeButton.classList.add("cannot-reset");
  }
}

requestAnimationFrame(gameLoop);
