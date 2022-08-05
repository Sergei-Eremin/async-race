import './app.scss';

export class App {
  garagePageCounter: number;
  tracksOnPageAmount: number;
  constructor() {
    this.garagePageCounter = 1;
    this.tracksOnPageAmount = 7;
  }

  get garagePage() {
    return this.garagePageCounter;
  }

  set garagePage(pageNumber: number) {
    if (pageNumber < 1) {
      alert('page cant be less 1');
      return;
    }
    this.garagePageCounter = pageNumber;
  }

  get tracksOnPage() {
    return this.tracksOnPageAmount;
  }
}
