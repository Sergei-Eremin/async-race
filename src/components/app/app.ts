import './app.scss';

export class App {
    garagePageCounter: number;
    tracksOnPageAmount: number;
    winnerPageCounter: number;
    constructor() {
        this.garagePageCounter = 1;
        this.tracksOnPageAmount = 7;
        this.winnerPageCounter = 1;
    }

    get winnerPage() {
        return this.winnerPageCounter;
    }

    set winnerPage(pageNumber: number) {
        if (pageNumber < 1) {
            alert('page cant be less 1');
            return;
        }
        this.winnerPageCounter = pageNumber;
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
