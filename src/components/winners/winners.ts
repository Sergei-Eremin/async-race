import { IWinnerWithCars } from '../../types';
import { API } from '../api/api';
import { App } from '../app/app';
import { Generate } from '../generate/generate';
import './table.scss';

export class Winners {
  createTable(): string {
    return `
    <table class="table">
      <thead>
        <tr class="table__header table__row">
          <th class="table__header">number</th>
          <th class="table__header">car</th>
          <th class="table__header">name</th>
          <th class="table__header">wins</th>
          <th class="table__header">best time</th>
        </tr>
      </thead>
      <tbody class="table__body">

      </tbody>
    </table>
    <div class="pagination">
      <button disabled class="pagination__prev">prev</button>
      <button class="pagination__next">next</button>
    </div>`;
  }

  createRow(obj: IWinnerWithCars, index: number, app: App): string {
    const { color, name, wins, time } = obj;
    return `
      <td class="table__ceil">${app.winnersOnPage * (app.winnersPage - 1) + index + 1}</td>
      <td class="table__ceil">
        <svg><use xlink:href="./sprite.svg#car" fill="${color}"></use></svg>
      </td>
      <td class="table__ceil">${name}</td>
      <td class="table__ceil">${wins}</td>
      <td class="table__ceil">${time}</td>
    `;
  }

  createTr(winnerObj: IWinnerWithCars, index: number, app: App): HTMLTableRowElement {
    const tr = document.createElement('tr');
    tr.classList.add('table__row');
    tr.innerHTML = this.createRow(winnerObj, index, app);
    return tr;
  }
  isClickablePagination(app: App, api: API): void {
    const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;
    app.winnersPage === 1 ? (btnPrev.disabled = true) : (btnPrev.disabled = false);
    (async () => {
      const amount = await api.getWinnersAmount();
      const pages = Math.ceil(amount / app.winnersOnPage);
      pages > app.winnersPage ? (btnNext.disabled = false) : (btnNext.disabled = true);
    })();
  }
  sortListener(app: App, generate: Generate, api: API, winners: Winners): void {
    const header = document.querySelector('thead tr');
    header?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.innerText === 'wins') {
        if (app.sortValue === 'wins') {
          app.toggleOrder();
        } else {
          app.sortOrder = 'ASC';
        }
        app.sortValue = 'wins';
      }
      if (target.innerText === 'best time') {
        if (app.sortValue === 'time') {
          app.toggleOrder();
        } else {
          app.sortOrder = 'ASC';
        }
        app.sortValue = 'time';
      }
      if (target.innerText === 'number') {
        if (app.sortValue === 'id') {
          app.toggleOrder();
        } else {
          app.sortOrder = 'ASC';
        }
        app.sortValue = 'id';
      }
      generate.generateWinners(winners, api, app, app.sortValue, app.sortOrder);
    });
  }
}
