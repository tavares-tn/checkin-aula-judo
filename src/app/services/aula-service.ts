import { inject, Service, signal } from '@angular/core';
import { Aula } from '../models/aula.model';
import { DbService } from './db-service';

@Service()
export class AulaService {
  private dbService = inject(DbService);
  private readonly aulasSignal = signal<Aula[]>([]);
  aulas = this.aulasSignal.asReadonly();

  carregarAulas() {
    return this.dbService.aula.toArray().then((aulas) => {
      this.aulasSignal.set(aulas);
    });
  }

  buscarAula(id: number) {
    return this.dbService.aula.get(id);
  }

  addAula(novaAula: Aula) {
    return this.dbService.aula.add(novaAula).then((id) => {
      this.aulasSignal.update((aulas) => [...aulas, { ...novaAula, id }]);
      return id;
    });
  }
  
  atualizarAula(aula: Aula & { id: number }) {
    return this.dbService.aula
      .update(aula.id, {
        tema: aula.tema,
        data: aula.data,
      })
      .then((quantidadeAtualizada) => {
        if (quantidadeAtualizada === 0) {
          return false;
        }

        this.aulasSignal.update((aulas) =>
          aulas.map((atual) => (atual.id === aula.id ? aula : atual)),
        );
        return true;
      });
  }

  deletarAula(id: number) {
    return this.dbService.aula.delete(id).then(() => {
      this.aulasSignal.update((aulas) => aulas.filter((aula) => aula.id !== id));
    });
  }
}
