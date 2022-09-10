import { IWinner, IWinnerWithCars, ICar, IStartEngine, IStopEngine, IStartDrive } from '../../types';

export class API {
  SERVER_URL = 'http://127.0.0.1:3000';

  async getCars(page: number, limit = 7): Promise<ICar[]> {
    const response = await fetch(`${this.SERVER_URL}/garage?_page=${page}&_limit=${limit}`);
    return response.json();
  }

  async getCar(id: string): Promise<ICar> {
    const response = await fetch(`${this.SERVER_URL}/garage/${id}`);
    return response.json();
  }

  async getAmountCars(): Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/garage`);
    return (await Promise.resolve(response.json())).length;
  }

  async startEngine(id: string): Promise<IStartEngine> {
    const data = await fetch(`${this.SERVER_URL}/engine?id=${id}&status=started`, { method: 'PATCH' });
    return data.json();
  }

  async stopEngine(id: string): Promise<IStopEngine> {
    const data = await fetch(`${this.SERVER_URL}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
    return data.json();
  }

  async startDrive(id: string): Promise<IStartDrive> {
    const data = await fetch(`${this.SERVER_URL}/engine?id=${id}&status=drive`, { method: 'PATCH' });
    return data.json();
  }

  async getWinner(id: string): Promise<IWinner> {
    const data = await fetch(`${this.SERVER_URL}/winners/${id}`);
    return data.json();
  }

  async updateWinner(id: string, winnerObj: { wins: number; time: number }): Promise<IWinner> {
    const data = await fetch(`${this.SERVER_URL}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerObj),
    });

    return data.json();
  }

  async createWinner(winnerObj: { id: number; wins: number; time: number }): Promise<IWinner> {
    const data = await fetch(`${this.SERVER_URL}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerObj),
    });

    return data.json();
  }
  async getWinnersAmount(): Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/winners`);
    return (await Promise.resolve(response.json())).length;
  }
  async getAllWinners() {
    const response = await fetch(`${this.SERVER_URL}/winners`);
    return response.json();
  }
  async getWinners(
    page: number = 1,
    limit: number = 10,
    sort: string = 'id',
    order: string = 'ASC'
  ): Promise<IWinner[]> {
    const data = await fetch(`${this.SERVER_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    return data.json();
  }
  async getWinnersWithCars(
    page: number = 1,
    limit: number = 10,
    sort: string = 'id',
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<IWinnerWithCars[]> {
    const resultArr: IWinnerWithCars[] = [];

    const winnerData: IWinner[] = await this.getWinners(page, limit, sort, order);

    winnerData.forEach(async (winnerElem) => {
      const carData = await this.getCar(winnerElem.id.toString());

      const resultDataObj = {
        id: winnerElem.id,
        wins: winnerElem.wins,
        time: winnerElem.time,
        name: carData.name,
        color: carData.color,
      };

      resultArr.push(resultDataObj);
    });

    return resultArr;
  }
}
