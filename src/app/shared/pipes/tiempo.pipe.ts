import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempo'
})
export class TiempoPipe implements PipeTransform {

  transform(value: Date | string): string {
    const fecha: Date = new Date(value);
    const fechaActual: Date = new Date();

    const diferenciaEnMilisegundos: number = fechaActual.getTime() - fecha.getTime();

    const milisegundosEnDia: number = 1000 * 60 * 60 * 24;
    const dias: number = Math.floor(diferenciaEnMilisegundos / milisegundosEnDia);

    let text: string = '';

    if (dias === 0) {
      text = 'hoy';
    } else if (dias > 0 && dias < 7) {
      text = 'hace ' + dias + ' días';
    } else if (dias >= 7 && dias < 30) {
      text = 'hace ' + Math.floor(dias / 7) + ' semanas';
      text += (dias % 7 !== 0) ? (' y ' + dias % 7 + ' días') : '';
    } else if (dias >= 30 && dias < 365) {
      text = 'hace ' + Math.floor(dias / 30) + ' meses';
      text += (dias % 30 !== 0) ? (' y ' + (dias % 30) + ' días') : '';
    } else if (dias >= 365) {
      text = 'hace ' + Math.floor(dias / 365) + ' años';
      const diasRestantes = dias % 365;
      if (diasRestantes > 0) {
        const mesesRestantes = Math.floor(diasRestantes / 30);
        text += (mesesRestantes !== 0) ? (' y ' + mesesRestantes + ' meses') : '';
      }
    }

    return text;
  }

}
