import { Race } from '../race/race';
import { CarTrack } from '../car-track/carTrack';

export class Control {
    generateControl(race: Race, carTrack: CarTrack) {
        const field = document.createElement('div');
        field.classList.add('fields');
        (document.querySelector('.app') as HTMLElement).after(field);
        const arr: string[] = [carTrack.createInputs(), carTrack.updateInputs(), race.generateButtons()];
        field.innerHTML = `${arr.map((elem) => elem).join('')}`;
    }
}
