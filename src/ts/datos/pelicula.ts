import * as moment from "moment";
import { Formato, Valoracion } from "./index";

export class Pelicula {
  private fecha: moment.Moment;
  public formato: Formato;
  public valoracion: Valoracion;

  constructor(
    public id: number,
    public titulo: string,
    public director: string,
    fecha: string,
    public cartel: string,
    public vista: boolean,
    formato: string,
    public oscars: number,
    valoracion: number,
  ) {
    this.fecha = moment(fecha, "DD-MM-YYYY");
    this.formato = Formato[formato];
    this.valoracion = valoracion as Valoracion;
  }

  public getFormato(): string {
    return Formato[this.formato];
  }

  public getYear(): string {
    return this.fecha.year().toString();
  }

  public isAfter(p: Pelicula): boolean {
    return this.fecha.isAfter(p.fecha);
  }
}
