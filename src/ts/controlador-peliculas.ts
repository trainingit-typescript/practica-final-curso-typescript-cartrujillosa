
import * as _ from "lodash";
import { IPeliculaJSON, Pelicula } from "./datos/index";
import * as archivo from "./peliculas.json";
export class ControladorPeliculas {
  private peliculas: Pelicula[]; // inicializar
  private peliculasVistas: Pelicula[]; // inicializar
  private peliculasPendientes: Pelicula[]; // inicializar

  // contructor  ??

  public getPeliculas(vistas: boolean): Pelicula[] { return vistas ? this.peliculasVistas : this.peliculasPendientes; }

  public cargarPeliculasFromJSON(): void {

    this.peliculas = _.map(archivo.peliculas, p => {

      // obtener películas del fichero .json

      const pJSON: IPeliculaJSON = {
        id: p.id,
        titulo: p.titulo,
        director: p.director,
        fecha: p.fecha,
        cartel: p.cartel,
        vista: p.vista,
        formato: p.formato,
        valoracion: p.valoracion,
        oscars: p.oscars,
      };

      // convertir el .json de cada película en un objeto de la clase Pelicula
      // y guardarlo en la propiedad peliculas

      return new Pelicula(
        pJSON.id,
        pJSON.titulo,
        pJSON.director,
        pJSON.fecha,
        pJSON.cartel,
        pJSON.vista,
        pJSON.formato,
        pJSON.oscars,
        pJSON.valoracion,
      );
    });

    this.separarPeliculas();
  }

  private separarPeliculas(): void {
    const grouped: _.Dictionary<Pelicula[]> = _.groupBy(this.peliculas, "vista");
    this.peliculasVistas = grouped.true;
    this.peliculasPendientes = grouped.false;
  }

  public getMejorValorada(): Pelicula {
    return _.maxBy(this.peliculasVistas, "valoracion");
  }

  public getMasOscars(): Pelicula {
    return _.maxBy(this.peliculas, "oscars");
  }

  public getMasReciente(): Pelicula {
    return _.reduce(this.peliculas, (last, p) => last = last.isAfter(p) ? last : p);
  }

  public getDirectores(): string[] {
    return _.uniq(_.map(this.peliculas, p => p.director));
  }

  public getPeliculasByDirector(director: string): Pelicula[] {
    return _.groupBy(this.peliculas, "director")[director];
  }
}
