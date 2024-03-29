import { ulid } from 'ulid';

export class User {
    id: string;
    username: string;
    avatar: string;
    email: string;
    password: string;
    hash: string;

    constructor(id?: string, username?: string, hash?: string, email?: string, password?: string, avatar?: string) {
        this.id = id ? id : ulid();
        this.username = username ? username : null;
        this.avatar = avatar ? avatar : null;
        this.email = email ? email : null;
        this.password = password ? password : null;
        this.hash = hash ? hash : null;
    }

    static fromJSON(json: any): User {
        const user = new User();
        user.id = json.id;
        user.username = json.username;
        user.email = json.email;
        user.password = json.password;
        user.hash = json.hash;
        return user;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.username = this.username;
        json.email = this.email;
        json.password = this.password;
        json.hash = this.hash;
        return json;
    }
}

export class Player {
    id: string;
    name: string;
    hash: string;

    constructor(id?: string, name?: string, hash?: string) {
        this.id = id ? id : ulid();
        this.name = name ? name : null;
        this.hash = hash ? hash : null;
    }

    public fromJSON(json: any): void {
        this.id = json.id;
        this.name = json.username;
        this.hash = json.hash;
    }

    toJSON(): any {
        const json: any = {};
        json.id = this.id;
        json.username = this.name;
        json.hash = this.hash;
        return json;
    }

    public fromUserToPlayer(user: User): void {
        this.id = user.id;
        this.name = user.username;
        this.hash = user.hash;
    }
}
