export class API {
  BASE_URL = 'http://127.0.0.1:3000';

  async getCars(page: number, limit = 7) {
    const response = await fetch(`${this.BASE_URL}/garage?_page=${page}&_limit=${limit}`);
    return await response.json();
  }

  async getCar(id: string) {
    const response = await fetch(`${this.BASE_URL}/garage/${id}`);
    return await response.json();
  }

  async getAmountCars() {
    const response = await fetch(`${this.BASE_URL}/garage`);
    const data = await Promise.resolve(response.json());
    return data.length;
  }

  async startEngine(id: string) {
    const data = await fetch(`${this.BASE_URL}/engine?id=${id}&status=started`, { method: 'PATCH' });
    return data.json();
  }

  async stopEngine(id: string) {
    const data = await fetch(`${this.BASE_URL}/engine?id=${id}&status=stopped`, { method: 'PATCH' });
    return data.json();
  }

  async startDrive(id: string) {
    const data = await fetch(`${this.BASE_URL}/engine?id=${id}&status=drive`, { method: 'PATCH' });
    return data.json();
  }

  async getWinner(id: string) {
    const data = await fetch(`${this.BASE_URL}/winners/${id}`);
    return data.json();
  }

  async updateWinner(id: string, winnerObj: { wins: number; time: number }) {
    const data = await fetch(`${this.BASE_URL}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerObj),
    });

    return data.json();
  }

  async createWinner(winnerObj: { id: number; wins: number; time: number }) {
    const data = await fetch(`${this.BASE_URL}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerObj),
    });

    return data.json();
  }

  async getWinners(page: number = 1, limit: number = 10, sort: string = 'id', order: string = 'ASC') {
    const data = await fetch(`${this.BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    return data.json();
  }
}
