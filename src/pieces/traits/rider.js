import { Mobility } from '../../mobility';

class RiderMobility extends Mobility {
  adjacentPoints() {
    const { m, n } = this;

    console.log(String(this));
    return [];
  }

  toString() {
    return `(${this.scope}) rider`;
  }
}

export function Rider(m, n) {
	this.mobility.push(new RiderMobility(m, n));
}
