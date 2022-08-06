// import '~normalize.css';

import { App } from './components/app/app';
import { Generate } from './components/generate/generate';
import { Control } from './components/control/control';
import { Race } from './components/race/race';
import { CarTrack } from './components/carTrack/carTrack';
import { API } from './components/api/api';
import { Winners } from './components/winners/winners';

const app = new App();
const generate = new Generate();
const control = new Control();
const race = new Race();
const carTrack = new CarTrack();
const api = new API();
const winners = new Winners();

const navLayout = `<nav class="nav">
<button class="nav__button nav__button-garage">garage</button>
<button class="nav__button nav__button-winners">winners</button>
</nav>
<div class='app'></div>`;

const body = document.querySelector('body') as HTMLElement;
body.innerHTML = navLayout;

const garageBtn = document.querySelector('.nav__button-garage') as HTMLButtonElement;
const winnerBtn = document.querySelector('.nav__button-winners') as HTMLButtonElement;

garageBtn?.addEventListener('click', () => {
    const appElement = document.querySelector('.app') as HTMLElement;
    appElement.innerHTML = '';
    generate.generateGarage(control, race, carTrack, api, app);
    generate.generateGarageListeners(carTrack, api, app);
    race.generateRaceListeners(carTrack, api, app);
    carTrack.createTrack(api.getCars(app.garagePage));
    garageBtn.disabled = true;
    winnerBtn.disabled = false;
});
garageBtn.click();

winnerBtn.addEventListener('click', () => {
    garageBtn.disabled = false;
    winnerBtn.disabled = true;

    const appElement = document.querySelector('.app') as HTMLElement;
    appElement.innerHTML = '';

    generate.generateWinners(winners, api);
});

// carTrack.carHandler(api);
// (async () => {
//     let res = await api.startEngine('1');
//     console.log(res, 'завели двигатель');
//     let dr = await api.startDrive('1');
//     console.log(dr, 'ну чё народ, погнали нахуй?');
//     let stop = await api.stopEngine('1');
//     console.log(stop, 'остановили');
// })();
// setTimeout(()=>{
//     carTrack.drive('5', "3");
// } ,2000)
