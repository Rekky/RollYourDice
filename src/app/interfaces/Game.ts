export interface Game {
  id: string;
  pages: Page[];
}

export interface Page {
  id: string;
  name: string;
  layers: Layer[];
}

export interface Layer {
  id: string;
  type: string;
  content: any;
}
