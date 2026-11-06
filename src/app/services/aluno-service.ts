import { inject, Service, signal } from '@angular/core';
import { Aluno } from '../models/aluno.model';
import { DbService } from './db-service';

@Service()
export class AlunoService {
  private dbService = inject(DbService);
  private readonly alunosSignal = signal<Aluno[]>([]);
  alunos = this.alunosSignal.asReadonly();

  carregarAlunos() {
    return this.dbService.alunos.toArray().then((alunos) => {
      this.alunosSignal.set(alunos);
    });
  }

  buscarAluno(cpf: number) {
    return this.dbService.alunos.get(cpf);
  }

  addAluno(novoAluno: Aluno) {
    return this.dbService.alunos.add(novoAluno).then(() => {
      this.alunosSignal.update((alunos) => [...alunos, novoAluno]);
    });
  }

  atualizarAluno(aluno: Aluno) {
    return this.dbService.alunos
      .update(aluno.cpf, {
        nome: aluno.nome,
        graduacao: aluno.graduacao,
      })
      .then((quantidadeAtualizada) => {
        if (quantidadeAtualizada === 0) {
          return false;
        }

        this.alunosSignal.update((alunos) =>
          alunos.map((atual) => (atual.cpf === aluno.cpf ? aluno : atual)),
        );
        return true;
      });
  }

  deletarAluno(cpf: number) {
    return this.dbService.alunos.delete(cpf).then(() => {
      this.alunosSignal.update((alunos) => alunos.filter((aluno) => aluno.cpf !== cpf));
    });
  }
}
