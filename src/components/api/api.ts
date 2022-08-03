export class API {
    async getCars<Type>(url: string, page: number, limit = 7): Promise<Type> {
        const response = await fetch(`${url}?_page=${page}&_limit=${limit}`);
        const cars = await response.json();
        return cars;
    }
    async getCar<Type>(url: string, id: string): Promise<Type> {
        const response = await fetch(`${url}/${id}`);
        const car = await response.json();
        return car;
    }
    getAmountCars(url: string) {
        const res = fetch(url)
            .then((response) => Promise.resolve(response.json()))
            .then((data) => {
                return data.length;
            });
        return res;
    }
    async startEngine(id: string) {
        return fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
            method: 'PATCH',
        }).then((data) => data.json());
    }
    async stopEngine(id: string) {
        return await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
            method: 'PATCH',
        }).then((data) => data.json());
    }
    async startDrive(id: string) {
        return await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
            method: 'PATCH',
        })
            .then((data) => data.json())
    }
}
