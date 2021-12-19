import {User} from './User';
import { ulid } from 'ulid';

export class Room {
    id: string;
    players: User[];

    constructor(id?: string, players?: User[]) {
        this.id = id ? id : ulid();
        this.players = players ? players : [];
    }
}
