// src/types/lunar-javascript.d.ts
declare module 'lunar-javascript' {
  export class Lunar {
    static fromDate(date: Date): Lunar;
    toString(): string;
    getYearInGanZhi(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    // 添加你需要的其他方法声明
  }
}