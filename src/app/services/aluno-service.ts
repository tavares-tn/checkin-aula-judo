import { PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Aluno } from '../models/aluno.model';

@Service()
export class AlunoService {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly alunosSignal = signal<Aluno[]>([]);
  readonly alunos = this.alunosSignal.asReadonly();

  async listar(): Promise<Aluno[]> {
    const banco = await this.abrirBanco();

    return new Promise((resolve, reject) => {
      const requisicao = banco
        .transaction('alunos', 'readonly')
        .objectStore('alunos')
        .getAll();

      requisicao.onsuccess = () => {
        banco.close();
        this.alunosSignal.set(requisicao.result);
        resolve(requisicao.result);
      };

      requisicao.onerror = () => {
        banco.close();
        reject(requisicao.error ?? new Error('Não foi possível listar os alunos.'));
      };
    });
  }

  async cadastrar(aluno: Aluno): Promise<void> {
    const banco = await this.abrirBanco();

    return new Promise((resolve, reject)   => {
      const transacao = banco.transaction('alunos', 'readwrite');
      transacao.objectStore('alunos').add(aluno);

      transacao.oncomplete = () => {
        banco.close();
        this.alunosSignal.update((alunos) => [...alunos, aluno]);
        resolve();
      };

      transacao.onerror = () => {
        banco.close();
        reject(transacao.error ?? new Error('Não foi possível cadastrar o aluno.'));
      };

      transacao.onabort = () => {
        banco.close();
        reject(transacao.error ?? new Error('O cadastro do aluno foi cancelado.'));
      };
    });
  }

  private abrirBanco(): Promise<IDBDatabase> {
    if (!isPlatformBrowser(this.plataforma)) {
      return Promise.reject(new Error('O banco de dados só está disponível no navegador.'));
    }

    return new Promise((resolve, reject) => {
      const requisicao = indexedDB.open('checkin-aula-judo', 1);

      requisicao.onupgradeneeded = () => {
        requisicao.result.createObjectStore('alunos', { keyPath: 'cpf' });
      };

      requisicao.onsuccess = () => resolve(requisicao.result);
      requisicao.onerror = () =>
        reject(requisicao.error ?? new Error('Não foi possível abrir o banco de dados.'));
    });
  }
}
