import { Race } from '../race/race';
import { CarTrack } from '../carTrack/carTrack';

export class Control {
  generateControl(race: Race, carTrack: CarTrack) {
    const field = document.createElement('div');
    field.classList.add('fields');
    (document.querySelector('.app') as HTMLElement).append(field);
    const arr: string[] = [carTrack.createInputs(), carTrack.updateInputs(), race.generateButtons()];
    field.innerHTML = `${arr.map((elem) => elem).join('')}`;
  }
}
