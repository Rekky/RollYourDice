export interface Tutorial {
    id: string;
    name: string;
    active: boolean;
    steps: Step[];
}

export interface Step {
    order: number;
    title: string;
    description: string;
    area: {x: number, y: number, width: number, height: number};
    complete: boolean;
}
