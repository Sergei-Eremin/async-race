// import '~normalize.css';

import { App } from './components/app/app';
import { Generate } from './components/generate/generate';
import { Control } from './components/control/control';
import { Race } from './components/race/race';
import { CarTrack } from './components/car-track/carTrack';
import { API } from './components/api/api';
import { ICar } from './types';

const app = new App();
const generate = new Generate();
const control = new Control();
const race = new Race();
const carTrack = new CarTrack();
const api = new API();
generate.generateApp();
generate.generateGarage(control, race, carTrack, api, app);
generate.generateGarageListeners(carTrack, api, app);
race.generateRaceListeners(carTrack, api);
carTrack.createTrack(api.getCars<ICar[]>('http://127.0.0.1:3000/garage', app.garagePage));

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
