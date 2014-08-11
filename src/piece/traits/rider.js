import { Mobility } from '../mobility';

class RiderMobility extends Mobility {
  *adjacentPoints() {
    const { m, n } = this;
  }

  toString() {
    return `(${this.scope}) rider`;
  }
}

export function Rider(m, n) {
	this.mobility.push(new RiderMobility(m, n));
}
