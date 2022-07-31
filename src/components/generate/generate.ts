import { Controll } from '../controll/controll';
import { Race } from '../race/race';
import { CarTrack } from '../car-track/carTrack';
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
    generateGarage(controll: Controll, race: Race, carTrack: CarTrack) {
        const field = document.createElement('div');
        field.classList.add('fields');
        (document.querySelector('.app') as HTMLElement).after(field);
        const arr: string[] = controll.generateControll(race, carTrack);
        field.innerHTML = `${arr.map((elem) => elem).join('')}`;

        const main = document.createElement('main');
        main.classList.add('garage');
        (document.querySelector('.fields') as HTMLElement).after(main);
        const trackList = document.createElement('div') as HTMLElement;
        const h1 = document.createElement('h1');
        h1.innerHTML = `Garage (?)`;
        trackList.classList.add('trackList');
        const page = document.createElement('h2');
        page.innerHTML = `Page <span class="page__number">${1}</span>`;
        main.append(h1);
        h1.append(page);
        main.append(trackList);
    }
}
