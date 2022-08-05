import { ICar } from '../../types';

import { API, CarTrack, Control, Race, App } from '../index';

export class Generate {
  generateApp() {
    const app = `
      <div class="app">
        <nav class="nav">
        <button class="nav__button nav__button-garage">garage</button>
        <button class="nav__button nav__button-winners">winners</button>
        </nav>
      </div>`;
    const body = document.querySelector('body') as HTMLBodyElement;
    body.innerHTML = `${app}`;
  }

  generateGarage(control: Control, race: Race, carTrack: CarTrack, api: API, app: App) {
    control.generateControl(race, carTrack);
    carTrack.generateTrackWrapper(api, app);
    carTrack.paginationHandler(api, app);
    carTrack.paginationClickableButtons(app, api);
    setTimeout(() => carTrack.carHandler(api), 100);
  }

  generateGarageListeners(carTrack: CarTrack, api: API, app: App) {
    const trackList = document.querySelector('.trackList');
    trackList?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.closest('.car-track') && target.tagName === 'BUTTON' && target.classList.contains('car__button')) {
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
          const currentCar = api.getCar(carId as string);

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

                carTrack.createTrack(api.getCars(app.garagePage));
                setTimeout(() => carTrack.carHandler(api), 100);
              }
            }
          });
        }

        setTimeout(() => {
          carTrack.createTrack(api.getCars(app.garagePage));
          setTimeout(() => carTrack.carHandler(api), 100);
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
          carTrack.createTrack(api.getCars(app.garagePage));
          setTimeout(() => carTrack.carHandler(api), 100);
          carTrack.updateGarageAmount(api);
          carTrack.paginationClickableButtons(app, api);
        }
        (createInput.querySelector('.create__input[type=text]') as HTMLInputElement).value = '';
        (createInput.querySelector('.create__input[type=color]') as HTMLInputElement).value = '#000000';
      }
    });

    const startRaceBtn = document.querySelector('.fields__button-start') as HTMLButtonElement;
    startRaceBtn.addEventListener('click', () => {
      const arrOfWinners: { id: string; success: boolean; time: string }[] = [];
      let finished = false;
      const allCarsOnPage = document.querySelectorAll('.car') as NodeList;
      startRaceBtn.disabled = true;
      stopRaceBtn.disabled = false;

      allCarsOnPage.forEach((car) => {
        const carElem = car as HTMLElement;
        const id = carElem.id;

        const btnStart = carElem.closest('.car-track')?.querySelector('.button-start') as HTMLButtonElement;
        const btnStop = carElem.closest('.car-track')?.querySelector('.button-stop') as HTMLButtonElement;

        (async () => {
          const carData = await carTrack.engineOperation(id, car as HTMLElement, api, btnStart, btnStop);
          if (!carData) return;
          arrOfWinners.push(carData);

          if (arrOfWinners.length && !finished) {
            const winner = arrOfWinners[0];
            finished = true;

            const winnerObj = await api.getWinner(winner.id);

            if (Number(winnerObj.id)) {
              const bestTime = winner.time < winnerObj.time ? winner.time : winnerObj.time;

              const newWinnerData = {
                wins: ++winnerObj.wins,
                time: Number(bestTime),
              };

              api.updateWinner(id, newWinnerData);
            } else {
              const newWinner = {
                id: Number(winner.id),
                time: Number(winner.time),
                wins: 1,
              };
              api.createWinner(newWinner);
            }
          }
        })();
      });
    });

    const stopRaceBtn = document.querySelector('.fields__button-reset') as HTMLButtonElement;
    stopRaceBtn.addEventListener('click', () => {
      startRaceBtn.disabled = false;
      stopRaceBtn.disabled = true;

      const allCarsOnPage = document.querySelectorAll('.car') as NodeList;
      allCarsOnPage.forEach((car) => {
        const carElem = car as HTMLElement;

        const btnStart = carElem.closest('.car-track')?.querySelector('.button-start') as HTMLButtonElement;
        const btnStop = carElem.closest('.car-track')?.querySelector('.button-stop') as HTMLButtonElement;

        btnStop.disabled = true;
        carElem?.classList.remove('drive');
        btnStart.disabled = false;
      });
      carTrack.createTrack(api.getCars(app.garagePage));
    });
  }
}
