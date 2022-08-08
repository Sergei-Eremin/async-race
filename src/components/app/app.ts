import './app.scss';

export class App {
  garagePageCounter: number;
  tracksOnPageAmount: number;
  winnersPageCounter: number;
  winnersOnPageAmount: number;
  sortValue: 'id' | 'wins' | 'time';
  sortOrder: 'ASC' | 'DESC';
  selectedCarData: { name: string; color: string; id: string };
  createCarData: { name: string; color: string };
  constructor() {
    this.garagePageCounter = 1;
    this.tracksOnPageAmount = 7;
    this.winnersPageCounter = 1;
    this.winnersOnPageAmount = 10;
    this.sortValue = 'id';
    this.sortOrder = 'ASC';
    this.selectedCarData = { name: '', color: '#000000', id: '' };
    this.createCarData = { name: '', color: '#000000' };
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

  get winnersPage() {
    return this.winnersPageCounter;
  }
  set winnersPage(pageNumber: number) {
    if (pageNumber < 1) {
      alert('page cant be less 1');
      return;
    }
    this.winnersPageCounter = pageNumber;
  }
  get tracksOnPage() {
    return this.tracksOnPageAmount;
  }
  get winnersOnPage() {
    return this.winnersOnPageAmount;
  }
  toggleOrder() {
    if (this.sortOrder === 'ASC') {
      this.sortOrder = 'DESC';
    } else {
      this.sortOrder = 'ASC';
    }
  }
  get selectedCar() {
    return this.selectedCarData;
  }

  set selectedCar(dataObj: { id: string; name: string; color: string }) {
    this.selectedCarData = dataObj;
    console.log('changed', this.selectedCarData);
  }

  get createdCar() {
    return this.createCarData;
  }

  set createdCar(dataObj: { name: string; color: string }) {
    this.createCarData = dataObj;
  }
}
