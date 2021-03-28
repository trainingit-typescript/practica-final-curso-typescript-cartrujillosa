import _ = require("lodash");
import { ControladorPeliculas } from "./controlador-peliculas";
import { Formato, Pelicula } from "./datos";
import { IHTML } from "./interface-html";
// js-cabecera-pendientes
// js-cabecera-vistas
// js-n-peliculas-pendientes
// js-n-peliculas-vistas
// js-lista-directores
// js-lista-peliculas-directores
// js-hay-peliculas
// js-cartel
// js-oscars
// js-formato-vhs
// js-formato-dvd
// js-formato-archivo
// js-director-base
// js-pelicula-director-base
// js-valoracion
// js-valoracion-1
// js-valoracion-2
// js-valoracion-3
// js-valoracion-4
// js-valoracion-5
// js-mejor-valorada
// js-mas-oscars
// js-mas-reciente
export class VistaPeliculas {
  private HTML: IHTML;

  constructor(private controladorPeliculas: ControladorPeliculas) {
    this.cargarHTML();
    this.pintarLista(true);
    this.pintarLista(false);
    this.pintarTotales(true);
    this.pintarTotales(false);
    this.pintarEstadisticas();
    this.pintarDirectores();
  }

  public cargarHTML(): void {
    this.HTML = {
      pendientesLista: document.querySelector(".js-lista-pendientes") as HTMLElement,
      pendientesTotal: document.querySelector(".js-cabecera-pendientes .js-n-peliculas-pendientes"),
      vistasLista: document.querySelector(".js-lista-vistas"),
      vistasTotal: document.querySelector(".js-cabecera-vistas .js-n-peliculas-vistas") as HTMLElement,
      peliculaBase: document.querySelector(".js-pelicula-base"),
      mejorValorada: document.querySelector(".js-mejor-valorada"),
      masOscars: document.querySelector(".js-mas-oscars"),
      masReciente: document.querySelector(".js-mas-reciente"),
      directoresLista: document.querySelector(".js-lista-directores"),
      peliculasDirectorLista: document.querySelector(".js-lista-directores .js-lista-peliculas-directores"),
      directorBaseNode: document.querySelector(".js-director-base").cloneNode(true) as HTMLElement,
      peliculaDirectorBaseNode: document.querySelector(".js-pelicula-director-base").cloneNode(true) as HTMLElement,
    };
  }

  private limpiarLista(vistas: boolean): void {
    const listaParaBorrar: HTMLElement = vistas ? this.HTML.vistasLista : this.HTML.pendientesLista;
    _.forEach(listaParaBorrar.querySelectorAll(".js-pelicula"), i => i.remove());
  }

  private limpiarDirectores(): void {
    // _.forEach(this.HTML.peliculasDirectorLista.querySelectorAll("li"), i => i.remove());
    _.forEach(this.HTML.directoresLista.querySelectorAll("li"), i => i.remove());
  }

  public pintarLista(vistas: boolean): void {
    this.limpiarLista(vistas);

    const listaHTML: HTMLElement = vistas ? this.HTML.vistasLista : this.HTML.pendientesLista;

    _.forEach(this.controladorPeliculas.getPeliculas(vistas), p => {
      const pNode = this.HTML.peliculaBase.cloneNode(true) as HTMLElement;

      // titulo, director y anyo

      pNode.querySelector(".js-titulo").textContent = p.titulo;
      pNode.querySelector(".js-director").textContent = p.director;
      pNode.querySelector(".js-anyo").textContent = p.getYear();

      // cartel

      const cartel: HTMLImageElement = pNode.querySelector(".js-cartel") as HTMLImageElement;
      cartel.src = p.cartel;
      cartel.title = p.titulo;
      cartel.alt = p.titulo;

      // oscars

      if (p.oscars === 0) { pNode.querySelector(".js-oscars").remove(); }

      // formato

      (p.formato === Formato.DVD ? pNode.querySelector(".js-formato-dvd") :
        p.formato === Formato.VHS ? pNode.querySelector(".js-formato-vhs") :
          pNode.querySelector(".js-formato-archivo"))
        .classList.remove("hide");

      listaHTML.appendChild(pNode);

      // valoracion

      const valoracion: HTMLElement = pNode.querySelector(".js-valoracion");
      valoracion.dataset.puntos = p.vista ? p.valoracion.toString() : "";
      for (let i = 1; i <= 5; i++) {
        pNode.querySelector(`.js-valoracion-${i}`).classList.remove("glyphicon-star", "glyphicon-star-empty");
        p.vista && i <= p.valoracion
          ? pNode.querySelector(`.js-valoracion-${i}`).classList.add("glyphicon-star")
          : pNode.querySelector(`.js-valoracion-${i}`).classList.add("glyphicon-star-empty");
      }

    });
  }

  private pintarTotales(vistas: boolean): void {
    const totalElem: HTMLElement = vistas ? this.HTML.pendientesTotal : this.HTML.vistasTotal;
    totalElem.textContent = this.controladorPeliculas.getPeliculas(vistas).length.toString();
  }

  private pintarEstadisticas(): void {
    const mejorValorada: Pelicula = this.controladorPeliculas.getMejorValorada();
    pintarEstadistica(this.HTML.mejorValorada, mejorValorada);
    const masOscars: Pelicula = this.controladorPeliculas.getMasOscars();
    pintarEstadistica(this.HTML.masOscars, masOscars);
    const masReciente: Pelicula = this.controladorPeliculas.getMasReciente();
    pintarEstadistica(this.HTML.masReciente, masReciente);
  }

  private pintarDirectores(): void {
    this.limpiarDirectores();

    _.forEach(this.controladorPeliculas.getDirectores(), d => {
      const directorNode: HTMLElement = this.HTML.directorBaseNode.cloneNode(true) as HTMLElement;
      this.HTML.directorBaseNode.querySelector(".js-director").textContent = d;
      this.HTML.directoresLista.appendChild(directorNode);

      _.forEach(this.controladorPeliculas.getPeliculasByDirector(d), p => {
        const peliculaDirectorNode: HTMLElement = this.HTML.peliculaDirectorBaseNode.cloneNode(true) as HTMLElement;
        this.HTML.peliculaDirectorBaseNode.querySelector(".js-titulo").textContent = p.titulo;
        this.HTML.peliculaDirectorBaseNode.querySelector(".js-anyo").textContent = p.getYear();
        this.HTML.peliculasDirectorLista.appendChild(peliculaDirectorNode);
      });
    });
  }
}

function pintarEstadistica(element: HTMLElement, pelicula: Pelicula): void {
  element.querySelector(".js-titulo").textContent = pelicula.titulo;

  const cartel: HTMLImageElement = element.querySelector(".js-cartel") as HTMLImageElement;
  cartel.src = pelicula.cartel;
  cartel.title = pelicula.titulo;
  cartel.alt = pelicula.titulo;
}
