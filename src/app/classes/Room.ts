import {User} from './User';

export class Room {
    id: string;
    players: User[];

    constructor(id?: string, players?: User[]) {
        this.id = id ? id : null;
        this.players = players ? players : [];
    }
}
