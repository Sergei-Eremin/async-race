import { Control } from '../control/control';
import { Race } from '../race/race';
import { CarTrack } from '../car-track/carTrack';
import { API } from '../api/api';
import { ICar } from '../../types';
import { App } from '../app/app';

export class Generate {
  generateApp() {
    const app = `
        <div class="app">
            <nav class="nav">
            <button class="nav__button nav__button-garage">garage</button>
            <button class="nav__button nav__button-winners">winners</button>
            </nav>
        </div>
        `;
    const body = document.querySelector('body') as HTMLBodyElement;
    body.innerHTML = `${app}`;
  }
  generateGarage(control: Control, race: Race, carTrack: CarTrack, api: API, app: App) {
    control.generateControl(race, carTrack);
    carTrack.generateTrackWrapper(api, app);
    carTrack.paginationHandler(api, app);
    carTrack.carHandler(api);
  }
  generateGarageListeners(carTrack: CarTrack, api: API, app: App) {
    const trackList = document.querySelector('.trackList');
    trackList?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.car-track') && target.tagName === 'BUTTON') {
        if (target.classList.contains('car__button-remove')) {
          const carId = target.parentElement?.nextElementSibling?.id;
          carTrack.deleteCar(carId as string);
        }
        if (target.classList.contains('car__button-select')) {
          const carId = target.parentElement?.nextElementSibling?.id;
          const updateInput = document.querySelector('.field__update.update');
          const updateButton = updateInput?.querySelector('button');
          updateInput?.childNodes.forEach((elem) => {
            (elem as HTMLInputElement).disabled = false;
          });
          const name = updateInput?.querySelector('.update__input[type=text]') as HTMLInputElement;
          const color = updateInput?.querySelector('.update__input[type=color]') as HTMLInputElement;
          const currentCar = api.getCar<ICar>('http://127.0.0.1:3000/garage', carId as string);
          currentCar.then((result) => {
            name.value = result.name;
            color.value = result.color;
          });
          updateButton?.addEventListener('click', () => {
            if (target.tagName === 'BUTTON') {
              if (name.value && color.value) {
                carTrack.updateCar(name.value, color.value, carId as string);
                updateInput?.childNodes.forEach((elem) => {
                  (elem as HTMLInputElement).disabled = true;
                });
                name.value = '';
                color.value = '#000000';
              }
            }
          });
        }
        setTimeout(() => {
          carTrack.createTrack(api.getCars<ICar[]>('http://127.0.0.1:3000/garage', app.garagePage));
          carTrack.updateGarageAmount(api);
          carTrack.paginationClickableButtons(app, api);
        }, 100);
      }
    });
    const createInput = document.querySelector('.field__create.create');
    createInput?.addEventListener('click', (event) => {
      const target = event?.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        const name = (createInput.querySelector('.create__input[type=text]') as HTMLInputElement).value;
        const color = (createInput.querySelector('.create__input[type=color]') as HTMLInputElement).value;
        if (name && color) {
          carTrack.createCar(name, color);
          carTrack.createTrack(api.getCars<ICar[]>('http://127.0.0.1:3000/garage', app.garagePage));
          carTrack.updateGarageAmount(api);
          carTrack.paginationClickableButtons(app, api);
        }
        (createInput.querySelector('.create__input[type=text]') as HTMLInputElement).value = '';
        (createInput.querySelector('.create__input[type=color]') as HTMLInputElement).value = '#000000';
      }
    });
  }
}
