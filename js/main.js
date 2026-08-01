import { BigNumber } from "./BigNumber.js";

let antimatter = new BigNumber(10);

const antimatterDisplay = document.getElementById("antimatter-display");
const dimension1_multiplier = document.getElementById("dimension1-multiplier");
const dimension1_amount = document.getElementById("dimension1-amount");
const dimension1_buy_count = document.getElementById("dimension1-buy-count");
const dimension1_cost = document.getElementById("dimension1-cost");
const dimension1_buy_button = document.getElementById("dimension1-buy-button");

// 各dimension1
const dimension1 = {multiplier: new BigNumber(1), amount: new BigNumber(0), cost: new BigNumber(10)};

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
  // Dimensionが未実装のため、仮の固定生産量(1秒あたり1)で動作確認する
  antimatter = antimatter.add(new BigNumber(1).multiply(dt));
}

function render() {
  antimatterDisplay.textContent = `${antimatter.toDisplayString(1)} Antimatter`;
  dimension1_multiplier.textContent = `x${dimension1.multiplier.toDisplayString(0)}`;
  dimension1_amount.textContent = dimension1.amount.toDisplayString(0);
  dimension1_buy_count.textContent = `Buy 1`;
  dimension1_cost.textContent = `Cost: ${dimension1.cost.toDisplayString(0)}`;
}

requestAnimationFrame(gameLoop);
