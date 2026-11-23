import { Service } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Aula } from '../models/aula.model';
import { Aluno } from '../models/aluno.model';
import { Checkin } from '../models/checkin.model';

@Service()
export class DbService extends Dexie {
  alunos!: Table<Aluno, number>;
  aula!: Table<Aula, number>;
  checkin!: Table<Checkin, number>;

  constructor() {
    super('checkin-aula-judo');
    this.version(1).stores({
      alunos: 'cpf',
    });
    this.version(2).stores({
      aula: '++id',
    });
    this.version(3).stores({
      checkin: '++id, &[alunoId+aulaId]',
    });
  }
}
