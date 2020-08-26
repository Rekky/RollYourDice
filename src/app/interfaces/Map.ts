export interface Map {
  columns: number;
  rows: number;
  scale: number;
  cellWidth: number;
  background: string;
}

export interface EditorObjectSelected {
  ev: any | null;
  object: any | null;
  type: string | null;
}
