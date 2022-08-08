import { ICar } from '../../types';
import { API } from '../api/api';
import { App } from '../app/app';

export class CarTrack {
  createInputs() {
    return `
        <div class="field__create create">
          <input class="create__input" type="text">
          <input class="create__input" type="color">
          <button>create</button>
        </div>
        `;
  }
  updateInputs() {
    return `
        <div class="field__update update">
          <input class="update__input" type="text" disabled>
          <input class="update__input" type="color" disabled>
          <button disabled class="update__button">update</button>
        </div>
        `;
  }
  generateTrackWrapper(api: API, app: App) {
    const main = document.createElement('main');
    main.classList.add('garage');
    (document.querySelector('.fields') as HTMLElement).after(main);
    const trackList = document.createElement('div') as HTMLElement;
    const h1 = document.createElement('h1');
    (async () => {
      const garageAmount = await api.getAmountCars();
      h1.innerHTML = `Garage (${garageAmount})`;
    })();
    trackList.classList.add('trackList');
    const page = document.createElement('h2');
    page.innerHTML = `Page <span class="page__number">${app.garagePage}</span>`;
    const pagination = document.createElement('div');
    pagination.innerHTML = `
        <button disabled class="pagination__prev">prev</button>
        <button class="pagination__next">next</button>
        `;
    pagination.classList.add('pagination');
    main.append(page, h1, trackList, pagination);
  }
  paginationHandler(api: API, app: App) {
    const pagination = document.querySelector('.pagination');
    pagination?.addEventListener('click', (event) => {
      const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
      const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;
      const target = event.target as HTMLElement;

      if (target.className === 'pagination__prev' && !btnPrev.disabled) app.garagePage -= 1;
      if (target.className === 'pagination__next' && !btnNext.disabled) app.garagePage += 1;

      this.createTrack(api.getCars(app.garagePage));
      setTimeout(() => this.carHandler(api), 100);

      this.paginationClickableButtons(app, api);
      this.updatePageNumber(app);
      (document.querySelector('.fields__button-reset') as HTMLButtonElement).disabled = true;
      (document.querySelector('.fields__button-start') as HTMLButtonElement).disabled = false;
    });
  }
  updatePageNumber(app: App, number = app.garagePage) {
    const page = document.querySelector('.page__number') as HTMLSpanElement;
    page.innerText = String(number);
  }
  paginationClickableButtons(app: App, api: API, num = app.garagePage) {
    const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;

    num === 1 ? (btnPrev.disabled = true) : (btnPrev.disabled = false);
    (async () => {
      const amount = await api.getAmountCars();
      const pages = Math.ceil(amount / app.tracksOnPage);

      pages > app.garagePage ? (btnNext.disabled = false) : (btnNext.disabled = true);
      if (pages < app.garagePage) {
        app.garagePage -= 1;
        this.createTrack(api.getCars(app.garagePage));
        this.updatePageNumber(app);
        setTimeout(() => this.carHandler(api), 100);
      }
    })();
  }
  updateGarageAmount(api: API) {
    const h1 = document.querySelector('h1') as HTMLElement;
    (async () => {
      const garageAmount = await api.getAmountCars();
      h1.innerHTML = `Garage (${garageAmount})`;
    })();
  }

  markupTrack(data: ICar) {
    const { name, color, id } = data;
    return `
          <div class="car-track">
          <h3 class="car__title">${name}</h3>
          <div class="car__buttons">
          <button class="car__button car__button-select">select</button>
          <button class="car__button car__button-remove">remove</button>
          <button class="button-start">A</button>
          <button class="button-stop" disabled>B</button>
          </div>
  
          <div class="car" id="${id}">
            <svg><use xlink:href="./sprite.svg#car" fill="${color}"></use></svg>
          </div>
          <div class="finish">
          <svg><use xlink:href="./sprite.svg#finish"></use></svg>
          </div>
      </div>
      `;
  }
  createTrack(cars: Promise<ICar[]>) {
    const trackList = document.querySelector('.trackList') as HTMLElement;
    cars.then((data) => {
      const res = data.map((elem) => this.markupTrack(elem)).join('');
      trackList.innerHTML = res;
    });
  }
  deleteCar(id: string) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
    });
    fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'DELETE',
    });
  }
  createCar(name: string, color: string) {
    fetch(`http://127.0.0.1:3000/garage/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
  }
  updateCar(name: string, color: string, id: string) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
  }
  carHandler(api: API) {
    const carTracks = document.querySelectorAll('.car-track') as NodeList;
    carTracks.forEach((element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target as HTMLButtonElement;
        const id = (event.target as HTMLElement).parentElement?.nextElementSibling?.id as string;
        const car = (event.target as HTMLElement).parentElement?.nextElementSibling as HTMLElement;
        const btnStart = target.closest('.car-track')?.querySelector('.button-start') as HTMLButtonElement;
        const btnStop = target.closest('.car-track')?.querySelector('.button-stop') as HTMLButtonElement;

        if (target.className === 'button-start') {
          this.engineOperation(id, car, api, btnStart, btnStop);
        }
        if (target.className === 'button-stop') {
          btnStop.disabled = true;
          car?.classList.remove('drive');
          btnStart.disabled = false;
        }
      });
    });
  }
  async engineOperation(
    id: string,
    car: HTMLElement,
    api: API,
    btnStart: HTMLButtonElement,
    btnStop: HTMLButtonElement
  ) {
    btnStart.disabled = true;
    const { velocity, distance } = await api.startEngine(id);
    const time = (distance / velocity / 1000).toFixed(1);
    car?.classList.add('drive');
    car.style.cssText = `animation-duration: ${time}s;`;
    btnStop.disabled = false;

    try {
      const { success } = await api.startDrive(id);
      return { time, success, id };
    } catch (error) {
      if (error instanceof Error) {
        car.style.animationPlayState = 'paused';
        await api.stopEngine(id);
      }
    }
  }
}
