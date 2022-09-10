import { API } from '../api/api';
import { App } from '../app/app';
import { CarTrack } from '../carTrack/carTrack';

export class Race {
  generateButtons(): string {
    return `
        <div class="fields__buttons">
          <button class="fields__button fields__button-start">Race</button>
          <button class="fields__button fields__button-reset" disabled>Reset</button>
          <button class="fields__button fields__button-generate">Generate Cars</button>
        </div>
        `;
  }
  generateCars(carTrack: CarTrack, count = 100): void {
    const carNames = [
      'Lada',
      'Toyota',
      'BMW',
      'Mercedes',
      'UAZ',
      'GAZ',
      'Mazda',
      'Shevrole',
      'Audi',
      'Mitsubishi',
      'Jaguar',
      'Izusu',
      'Volvo',
      'Opel',
      'Ford',
      'Nissan',
      'Dodge',
      'Porsche',
      'Haval',
    ];
    const carModels = [
      'Camry',
      'Supra',
      'A8',
      'A4',
      'S5',
      'M2',
      'M4',
      'Miata',
      'Focus',
      'X',
      'Kuga',
      'S',
      'Accord',
      '190',
      'S Class',
      'Sonata',
      'Cerato',
      'Lanos',
    ];
    for (let i = 0; i < count; i += 1) {
      const carName = Math.floor(Math.random() * carNames.length);
      const carModel = Math.floor(Math.random() * carModels.length);

      const car = `${carNames[carName]} ${carModels[carModel]}`;
      const color = Math.floor(Math.random() * 16777215).toString(16);
      carTrack.createCar(car, `#${color}`);
    }
  }
  generateRaceListeners(carTrack: CarTrack, api: API, app: App): void {
    const generateCarsButton = document.querySelector('.fields__button-generate');
    generateCarsButton?.addEventListener('click', () => {
      this.generateCars(carTrack);
      carTrack.createTrack(api.getCars(app.garagePage));
      carTrack.updateGarageAmount(api);
      setTimeout(() => carTrack.carHandler(api), 300);
      carTrack.paginationClickableButtons(app, api);
    });
  }
}
