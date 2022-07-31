// import '~normalize.css';

import { App } from './components/app/app';
import { Generate } from './components/generate/generate';
import { Controll } from './components/controll/controll';
import { Race } from './components/race/race';
import { CarTrack } from './components/car-track/carTrack';
import { API } from './components/api/api';
import { ICar } from './types';

const app = new App();
const generate = new Generate();
const controll = new Controll();
const race = new Race();
const carTrack = new CarTrack();
const api = new API();
generate.generateApp();
generate.generateGarage(controll, race, carTrack);

carTrack.createTrack(api.getCars<ICar[]>('http://127.0.0.1:3000/garage'));
