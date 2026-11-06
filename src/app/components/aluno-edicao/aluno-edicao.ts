import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Aluno } from '../../models/aluno.model';
import { FaixaGraduacao } from '../../models/faixa-graduacao';
import { AlunoService } from '../../services/aluno-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-aluno-edicao',
  styleUrl: './aluno-edicao.css',
  templateUrl: './aluno-edicao.html',
})
export class AlunoEdicao implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly rota = inject(ActivatedRoute);
  private readonly alunoService = inject(AlunoService);
  readonly faixasGraduacao = Object.values(FaixaGraduacao);
  aluno: Aluno = { cpf: 0, nome: '', graduacao: FaixaGraduacao.BRANCA };
  carregando = signal(true);
  naoEncontrado = signal(false);
  erro = signal('');
  atualizado = signal(false);
  salvando = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarAluno();
    }
  }

  async atualizar(formulario: NgForm): Promise<void> {
    this.erro.set('');
    this.atualizado.set(false);
    this.salvando.set(true);

    try {
      const encontrado = await this.alunoService.atualizarAluno({ ...this.aluno });
      if (!encontrado) {
        this.naoEncontrado.set(true);
        return;
      }

      this.atualizado.set(true);
      formulario.form.markAsPristine();
    } catch {
      this.erro.set('Não foi possível atualizar o aluno. Tente novamente.');
    } finally {
      this.salvando.set(false);
    }
  }

  private async carregarAluno(): Promise<void> {
    const cpf = Number(this.rota.snapshot.paramMap.get('cpf'));
    if (!Number.isSafeInteger(cpf) || cpf <= 0) {
      this.naoEncontrado.set(true);
      this.carregando.set(false);
      return;
    }

    try {
      const aluno = await this.alunoService.buscarAluno(cpf);
      if (aluno) {
        this.aluno = { ...aluno };
      } else {
        this.naoEncontrado.set(true);
      }
    } catch {
      this.erro.set('Não foi possível carregar o aluno. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }
}
