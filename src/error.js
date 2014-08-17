export class ChessError {
  constructor() {
    this.name = this.constructor.name;
  }
}
export class MobilityError extends ChessError {}
export class CheckError extends ChessError {}
export class PromotionError extends ChessError {}
