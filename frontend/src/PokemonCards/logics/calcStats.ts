// src/components/PokemonCards/logics/calcStats.ts

/** HP最小値 */
export function calculateHpMin(base: number): number {
    return Math.floor(((2 * base + 31 + 0) * 50) / 100) + 50 + 10;
  }
  
  /** HP最大値 */
  export function calculateHpMax(base: number): number {
    return Math.floor(((2 * base + 31 + 63) * 50) / 100) + 50 + 10; // 252/4 = 63
  }
  
  /** A/B/C/D/S の最小値 */
  export function calculateStatMin(base: number): number {
    const tmp = Math.floor(((2 * base + 31 + 0) * 50) / 100) + 5;
    return Math.floor(tmp * 1.0);
  }
  
  /** A/B/C/D/S の最大値 */
  export function calculateStatMax(base: number): number {
    const tmp = Math.floor(((2 * base + 31 + 63) * 50) / 100) + 5;
    return Math.floor(tmp * 1.1);
  }
  