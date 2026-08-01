import { BigNumber } from "./BigNumber.js";

let antimatter = new BigNumber(10);

const antimatterDisplay = document.getElementById("antimatter-display");

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
}

requestAnimationFrame(gameLoop);
