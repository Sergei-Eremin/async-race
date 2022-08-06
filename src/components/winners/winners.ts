import { IWinnerWithCars } from '../../types';

import './table.scss';

export class Winners {
    createTabel() {
        const tableLayout = `
        <h1>Winners ${1}</h1>
        <table class="table">
          <tbody class="table__body">
            <tr class=" table__header table__row">
              <th class="table__header">number</th>
              <th class="table__header">car</th>
              <th class="table__header">name</th>
              <th class="table__header">wins</th>
              <th class="table__header">best time</th>
            </tr>     
          </tbody>
        </table>`;

        return tableLayout;
    }

    createRow(obj: IWinnerWithCars, index: number) {
        const { color, name, wins, time } = obj;
        return `
      <td class="table__ceil">${index + 1}</td>
      <td class="table__ceil">${color}</td>
      <td class="table__ceil">${name}</td>
      <td class="table__ceil">${wins}</td>
      <td class="table__ceil">${time}</td>
    `;
    }

    createTr(winnerObj: IWinnerWithCars, index: number) {
        const tr = document.createElement('tr');
        tr.classList.add('table__row');

        tr.innerHTML = this.createRow(winnerObj, index);

        return tr;
    }

    createPaginationBlock() {
        const markup = `
          <div class="pagination">
            <button disabled class="pagination__prev">Туды</button>
            <span class="page">1</span>
            <button class="pagination__next">Сюды</button>
          </div>
        `;
        return markup;
    }

    pagination() {
        // const app = document.querySelector('.app') as HTMLElement;
        // app.
    }
}
