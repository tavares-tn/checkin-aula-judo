import { Service } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Aluno } from '../models/aluno.model';

@Service()
export class DbService extends Dexie {
  alunos!: Table<Aluno, number>;

  constructor() {
    super('checkin-aula-judo');
    this.version(1).stores({
      alunos: 'cpf',
    });
  }
}
