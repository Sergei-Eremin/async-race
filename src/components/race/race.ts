import { ICar } from '../../types';
import { API } from '../api/api';
import { App } from '../app/app';
import { CarTrack } from '../carTrack/carTrack';

export class Race {
  generateButtons() {
    const block = `
        <div class="fields__buttons">
          <button class="fields__button fields__button-start">Race</button>
          <button class="fields__button fields__button-reset">Reset</button>
          <button class="fields__button fields__button-generate">Generate Cars</button>
        </div>
        `;
    return block;
  }

  generateCars(carTrack: CarTrack, count = 100) {
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
    for (let i = 0; i < count; i += 1) {
      const car = Math.floor(Math.random() * carNames.length);
      const color = Math.floor(Math.random() * 16777215).toString(16);
      carTrack.createCar(carNames[car], `#${color}`);
    }
  }

  generateRaceListeners(carTrack: CarTrack, api: API, app: App) {
    const generateCarsButton = document.querySelector('.fields__button-generate');

    generateCarsButton?.addEventListener('click', () => {
      this.generateCars(carTrack);
      carTrack.createTrack(api.getCars(1));
      carTrack.updateGarageAmount(api);
      setTimeout(() => carTrack.carHandler(api), 300);
      carTrack.paginationClickableButtons(app, api);
    });
  }
}
