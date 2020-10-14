export class User {
    id: string;
    username: string;
    email: string;
    password: string;

    constructor(id?: string, username?: string, email?: string, password?: string) {
        this.id = id ? id : '-' + Math.floor(Math.random() * 1000);
        this.username = username ? username : null;
        this.email = email ? email : null;
        this.password = password ? password : null;
    }

    static fromJSON(json: any): User {
        const user = new User();
        user.id = json.id;
        user.username = json.username;
        user.email = json.email;
        user.password = json.password;
        return user;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.username = this.username;
        json.email = this.email;
        json.password = this.password;
        return json;
    }

}
