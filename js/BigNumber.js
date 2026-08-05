// 巨大数を扱うためのクラス
export class BigNumber {
  // コンストラクタ
  // mantissa:仮数部
  // exponent;指数部
  constructor(mantissa, exponent = 0) {
    this.mantissa = mantissa;
    this.exponent = exponent;
    this.normalize();
  }

  // 正規化
  // 仮数部を1以上10未満に調整する
  normalize() {
    if (this.mantissa === 0) {
      this.exponent = 0;
      return;
    }

    while (Math.abs(this.mantissa) >= 10) {
      this.mantissa /= 10;
      this.exponent += 1;
    }

    while (Math.abs(this.mantissa) > 0 && Math.abs(this.mantissa) < 1) {
      this.mantissa *= 10;
      this.exponent -= 1;
    }
  }

  // 足し算
  add(other) {
    if (this.exponent === other.exponent) {
      return new BigNumber(this.mantissa + other.mantissa, this.exponent);
    } else if (this.exponent > other.exponent) {
      const diff = this.exponent - other.exponent;
      if (diff > 15) {
        return new BigNumber(this.mantissa, this.exponent);
      }
      const mantissa = other.mantissa / 10 ** diff;
      return new BigNumber(this.mantissa + mantissa, this.exponent);
    } else {
      const diff = other.exponent - this.exponent;
      if (diff > 15) {
        return new BigNumber(other.mantissa, other.exponent);
      }
      const mantissa = this.mantissa / 10 ** diff;
      return new BigNumber(mantissa + other.mantissa, other.exponent);
    }
  }

  // 引き算
  subtract(other) {
    if (other.exponent - this.exponent >= 15) {
      return new BigNumber(-other.mantissa, other.exponent);
    } else if (this.exponent === other.exponent) {
      return new BigNumber(this.mantissa - other.mantissa, this.exponent);
    } else if (this.exponent > other.exponent) {
      const diff = this.exponent - other.exponent;
      const mantissa = other.mantissa / 10 ** diff;
      return new BigNumber(this.mantissa - mantissa, this.exponent);
    } else {
      const diff = other.exponent - this.exponent;
      const mantissa = other.mantissa * 10 ** diff;
      return new BigNumber(this.mantissa - mantissa, this.exponent);
    }
  }

  // 掛け算
  multiply(other) {
    if (other instanceof BigNumber) {
      return new BigNumber(this.mantissa * other.mantissa, this.exponent + other.exponent);
    }
    return new BigNumber(this.mantissa * other, this.exponent);
  }

  // 割り算
  divide(other) {
    if (other instanceof BigNumber) {
      if (other.mantissa === 0) {
        throw new Error("division by zero");
      }
      return new BigNumber(this.mantissa / other.mantissa, this.exponent - other.exponent);
    }
    if (other === 0) {
      throw new Error("division by zero");
    }
    return new BigNumber(this.mantissa / other, this.exponent);
  }

  // 累乗
  power(num) {
    if (num === 0) {
      return new BigNumber(1);
    }
    return new BigNumber(this.mantissa ** num, this.exponent * num);
  }

  // 以上以下
  greaterThanOrEqual(other) {
    if (this.exponent === other.exponent) {
      return this.mantissa >= other.mantissa;
    }
    return this.exponent >= other.exponent;
  }

  // 大なり小なり
  greaterThan(other) {
    if (this.exponent === other.exponent) {
      return this.mantissa > other.mantissa;
    }
    return this.exponent > other.exponent;
  }

  // 常用対数
  log10() {
    if (this.mantissa === 0) {
      throw new Error("log10(0) is undefined");
    }
    return this.exponent + Math.log10(this.mantissa);
  }

  // 指定の桁数分、少数以下を表示する
  // digits:小数点以下表示桁数
  toDisplayString(digits) {
    if (this.exponent < 3) {
      return (this.mantissa * 10 ** this.exponent).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
    }
    return (
      this.mantissa.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }) + "e" + this.exponent.toFixed(0)
    );
  }
}

