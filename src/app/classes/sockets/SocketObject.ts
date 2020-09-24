export class SocketObject {
    mapId: string | number;
    objectID: string | number;
    action: string; // update, create, delete
    object: object | null;

    constructor(mapId: string | number, objectID: string | number, action: string, object?: object | null) {
        this.mapId = mapId ? mapId : null;
        this.objectID = objectID ? objectID : null;
        this.action = action ? action : null;
        this.object = object ? object : null;
    }
}
