import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno-service';

@Component({
  imports: [RouterLink],
  selector: 'app-aluno-lista',
  styleUrl: './aluno-lista.css',
  templateUrl: './aluno-lista.html',
})
export class AlunoLista implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly alunoService = inject(AlunoService);
  readonly alunos = this.alunoService.alunos;
  carregando = signal(true);
  erro = signal('');
  erroExclusao = signal('');
  removendo = signal<number | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarAlunos();
    }
  }

  private async carregarAlunos(): Promise<void> {
    this.erro.set('');

    try {
      await this.alunoService.carregarAlunos();
    } catch {
      this.erro.set('Não foi possível carregar os alunos. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }

  async excluir(cpf: number, nome: string): Promise<void> {
    if (
      !isPlatformBrowser(this.plataforma) ||
      this.removendo() !== null ||
      !window.confirm(`Deseja excluir o aluno ${nome}?`)
    ) {
      return;
    }

    this.erroExclusao.set('');
    this.removendo.set(cpf);

    try {
      await this.alunoService.deletarAluno(cpf);
    } catch {
      this.erroExclusao.set('Não foi possível excluir o aluno. Tente novamente.');
    } finally {
      this.removendo.set(null);
    }
  }
}
