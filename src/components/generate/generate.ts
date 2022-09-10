import { Control } from '../control/control';
import { Race } from '../race/race';
import { CarTrack } from '../carTrack/carTrack';
import { API } from '../api/api';
import { IWinner } from '../../types';
import { App } from '../app/app';
import { Winners } from '../winners/winners';

export class Generate {
  generateApp(): void {
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
  generateGarage(control: Control, race: Race, carTrack: CarTrack, api: API, app: App): void {
    control.generateControl(race, carTrack);
    carTrack.generateTrackWrapper(api, app);
    carTrack.paginationHandler(api, app);
    carTrack.paginationClickableButtons(app, api);
    setTimeout(() => carTrack.carHandler(api), 100);
  }
  generateGarageListeners(carTrack: CarTrack, api: API, app: App): void {
    const trackList = document.querySelector('.trackList');
    trackList?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (
        (target.closest('.car-track') && target.classList.contains('car__button-remove')) ||
        target.classList.contains('car__button-select')
      ) {
        if (target.classList.contains('car__button-remove')) {
          const carId = target.parentElement?.nextElementSibling?.id;
          carTrack.deleteCar(carId as string);
        }
        if (target.classList.contains('car__button-select')) {
          this.selectButton(target, api, carTrack, app);
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
      this.createInputListeners(event, carTrack, api, app, createInput);
      app.createdCar = { name: '', color: '' };
    });

    const createInputName = document.querySelector('.create__input[type=text]') as HTMLInputElement;
    const createInputColor = document.querySelector('.create__input[type=color]') as HTMLInputElement;
    let nameValue = '';
    let colorValue = '';

    createInputName.addEventListener('input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      nameValue = value;
      app.createdCar = { name: nameValue, color: colorValue };
    });

    createInputColor.addEventListener('input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      colorValue = value;
      app.createdCar = { name: nameValue, color: colorValue };
    });

    const startRaceBtn = document.querySelector('.fields__button-start') as HTMLButtonElement;
    const stopRaceBtn = document.querySelector('.fields__button-reset') as HTMLButtonElement;
    startRaceBtn.addEventListener('click', () => {
      this.startRaceBtnListener(carTrack, api, startRaceBtn, stopRaceBtn);
    });
    stopRaceBtn.addEventListener('click', () => {
      this.stopRaceBtnListener(carTrack, api, app, startRaceBtn, stopRaceBtn);
    });
  }
  selectButton(target: HTMLElement, api: API, carTrack: CarTrack, app: App): void {
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
      app.selectedCar = { name: result.name, color: result.color, id: carId as string };
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
          app.selectedCar.name = '';
          app.selectedCar.color = '#000000';
          app.selectedCar.id = '';
          carTrack.createTrack(api.getCars(app.garagePage));
          setTimeout(() => carTrack.carHandler(api), 100);
        }
      }
    });
  }
  createInputListeners(event: Event, carTrack: CarTrack, api: API, app: App, createInput: Element): void {
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
  }
  startRaceBtnListener(carTrack: CarTrack, api: API, startBtn: HTMLButtonElement, stopBtn: HTMLButtonElement): void {
    const arrOfWinners: { id: string; success: boolean; time: string }[] = [];
    let finished = false;
    const allCarsOnPage = document.querySelectorAll('.car') as NodeList;
    startBtn.disabled = true;
    stopBtn.disabled = false;
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
          const winnersList = await api.getAllWinners();
          const winnerName = (await api.getCar(winner.id)).name;
          alert(`Win ${winnerName} with time ${winner.time}`);
          if (
            winnersList.find(
              (elem: { id: number; name: string; time: string }) => Number(elem.id) === Number(winner.id)
            )
          ) {
            const winnerObj = await api.getWinner(winner.id);
            const bestTime = Number(winner.time) < winnerObj.time ? winner.time : winnerObj.time;
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
  }
  stopRaceBtnListener(carTrack: CarTrack, api: API, app: App, startBtn: HTMLButtonElement, stopBtn: HTMLButtonElement): void {
    startBtn.disabled = false;
    stopBtn.disabled = true;

    const allCarsOnPage = document.querySelectorAll('.car') as NodeList;
    allCarsOnPage.forEach((car) => {
      const carElem = car as HTMLElement;
      api.stopEngine(carElem.id);
      const btnStart = carElem.closest('.car-track')?.querySelector('.button-start') as HTMLButtonElement;
      const btnStop = carElem.closest('.car-track')?.querySelector('.button-stop') as HTMLButtonElement;

      btnStop.disabled = true;
      carElem?.classList.remove('drive');
      btnStart.disabled = false;
    });
    carTrack.createTrack(api.getCars(app.garagePage));
    setTimeout(() => carTrack.carHandler(api), 500);
  }
  generatePageWinners(api: API, app: App): void {
    const appContainer = document.querySelector('.app') as HTMLElement;
    const h1 = document.createElement('h1');
    (async () => {
      const winnersAmount = await api.getWinnersAmount();
      h1.innerHTML = `Winners (${winnersAmount})`;
      const h2 = document.createElement('h2');
      h2.innerHTML = `Page <span class="page__number">${app.winnersPage}</span>`;
      appContainer.prepend(h2, h1);
    })();
  }
  async generateWinners(
    winners: Winners,
    api: API,
    app: App,
    valueSort: 'id' | 'wins' | 'time' = 'id',
    orderSort: 'ASC' | 'DESC' = 'ASC'
  ): Promise<void> {
    const arrOfWinnersWithCars = await api.getWinnersWithCars(app.winnersPage, app.winnersOnPage, valueSort, orderSort);
    const tableBody = document.querySelector('.table__body') as HTMLElement;
    tableBody.innerHTML = '';
    setTimeout(() => arrOfWinnersWithCars.forEach((elem, i) => tableBody?.append(winners.createTr(elem, i, app))), 250);
  }

  generateWinnersListeners(winners: Winners, api: API, app: App, carTrack: CarTrack): void {
    const pagination = document.querySelector('.pagination');
    pagination?.addEventListener('click', (event) => {
      const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
      const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;
      const target = event.target as HTMLElement;

      if (target.className === 'pagination__prev' && !btnPrev.disabled) app.winnersPage -= 1;
      if (target.className === 'pagination__next' && !btnNext.disabled) app.winnersPage += 1;

      this.generateWinners(winners, api, app, app.sortValue, app.sortOrder);
      winners.isClickablePagination(app, api);
      carTrack.updatePageNumber(app, app.winnersPage);
    });
  }
  inputsFiller(app: App, api: API, carTrack: CarTrack): void {
    const createName = document.querySelector('.create__input[type=text]') as HTMLInputElement;
    const createColor = document.querySelector('.create__input[type=color]') as HTMLInputElement;
    let tempName = '',
      tempColor = '#000000';
    if (app.createdCar.name !== '') {
      const valueCreateName = app.createdCar.name;
      createName.value = valueCreateName;
      tempName = valueCreateName;
    }
    if (app.createdCar.color !== '#000000') {
      const valueCreateColor = app.createdCar.color;
      createColor.value = valueCreateColor;
      tempColor = valueCreateColor;
    }
    app.createdCar = { name: tempName, color: tempColor };
    if (app.selectedCar.id === '') return;
    const name = app.selectedCar.name;
    const color = app.selectedCar.color;
    const target = document.getElementById(app.selectedCar.id)?.parentElement?.querySelector('.car__button-select');

    this.selectButton(target as HTMLElement, api, carTrack, app);
    setTimeout(() => {
      const updateName = document.querySelector('.update__input[type=text]') as HTMLInputElement;
      const updateColor = document.querySelector('.update__input[type=color]') as HTMLInputElement;
      updateName.value = name;
      updateColor.value = color;
      app.selectedCar = { id: app.selectedCar.id, name, color };
    }, 100);
  }

  inputListeners(app: App): void {
    const createInput = document.querySelector('.field__create .create__input[type=text]') as HTMLInputElement;
    createInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      app.createdCar.name = target.value;
    });
    const createColor = document.querySelector('.field__create .create__input[type=color]') as HTMLInputElement;
    createColor?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      app.createdCar.color = target.value;
    });
    const updateColor = document.querySelector('.field__update .update__input[type=color]') as HTMLInputElement;
    updateColor?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      app.selectedCar = { id: app.selectedCar.id, name: app.selectedCar.name, color: target.value };
    });

    const updateInput = document.querySelector('.field__update .update__input[type=text]') as HTMLInputElement;
    updateInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      app.selectedCar = { id: app.selectedCar.id, name: target.value, color: app.selectedCar.color };
    });
    updateColor.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      updateColor.value = target.value;
    });

    updateInput.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      updateInput.value = target.value;
    });
  }
}
