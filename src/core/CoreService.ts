const baseURL = 'http://localhost:5000';

interface CoreServiceInterface {
    uRLPath: string;
}

class CoreService implements CoreServiceInterface {
    constructor(public uRLPath: string) {}

    get: () => any = async () => {
        const res = await fetch(`${baseURL}/${this.uRLPath}`);
        const data = await res.json();
        return data;
    }

    find: (id: number) => any = async (id: number) => {
        const res = await fetch(`${baseURL}/${this.uRLPath}/${id}`);
        const data = await res.json();
        return data;
    }
}

export default CoreService;