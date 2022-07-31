export class API {
    async getCars<T>(url: string, page = 1, limit = 7): Promise<T> {
        const response = await fetch(`${url}?_page=${page}&_limit=${limit}`);
        const cars = await response.json();

        return cars;
    }
}
