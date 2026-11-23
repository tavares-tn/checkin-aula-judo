import { inject, Service, signal } from '@angular/core';
import { Checkin } from '../models/checkin.model';
import { DbService } from './db-service';

@Service()
export class CheckinService {
  private dbService = inject(DbService);
  private readonly checkinsSignal = signal<Checkin[]>([]);
  checkins = this.checkinsSignal.asReadonly();

  carregarCheckins() {
    return this.dbService.checkin.toArray().then((checkins) => {
      this.checkinsSignal.set(checkins);
    });
  }

  marcarCheckin(alunoId: number, aulaId: number) {
    return this.dbService.checkin
      .where('[alunoId+aulaId]')
      .equals([alunoId, aulaId])
      .first()
      .then((checkinExistente) => {
        if (checkinExistente) {
          return false;
        }

        const novoCheckin = { alunoId, aulaId };
        return this.dbService.checkin.add(novoCheckin).then((id) => {
          this.checkinsSignal.update((checkins) => [...checkins, { ...novoCheckin, id }]);
          return true;
        });
      });
  }

  deletarCheckin(id: number) {
    return this.dbService.checkin.delete(id).then(() => {
      this.checkinsSignal.update((checkins) => checkins.filter((checkin) => checkin.id !== id));
    });
  }
}
