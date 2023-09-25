export type Sujet = {
  id:number;
  name: string;
  thumb:string;
  objet:Objet[];
  totaltime: number;

}
export type Objet = {
  id:number;
  name: string;

  strokes:[];
}
