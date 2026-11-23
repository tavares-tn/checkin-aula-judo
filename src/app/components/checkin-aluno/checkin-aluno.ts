import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno-service';
import { AulaService } from '../../services/aula-service';
import { CheckinService } from '../../services/checkin-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-checkin-aluno',
  styleUrl: './checkin-aluno.css',
  templateUrl: './checkin-aluno.html',
})
export class CheckinAluno implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly alunoService = inject(AlunoService);
  private readonly aulaService = inject(AulaService);
  private readonly checkinService = inject(CheckinService);
  readonly alunos = this.alunoService.alunos;
  readonly aulas = this.aulaService.aulas;
  alunoId: number | null = null;
  aulaId: number | null = null;
  carregando = signal(true);
  erro = signal('');
  mensagem = signal('');
  salvando = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarDados();
    }
  }

  async marcar(): Promise<void> {
    if (this.alunoId === null || this.aulaId === null) {
      return;
    }

    this.erro.set('');
    this.mensagem.set('');
    this.salvando.set(true);

    try {
      const marcado = await this.checkinService.marcarCheckin(this.alunoId, this.aulaId);
      if (!marcado) {
        this.erro.set('Este aluno já está marcado para essa aula.');
        return;
      }

      this.mensagem.set('Check-in realizado com sucesso.');
    } catch {
      this.erro.set('Não foi possível realizar o check-in. Tente novamente.');
    } finally {
      this.salvando.set(false);
    }
  }

  private async carregarDados(): Promise<void> {
    try {
      await Promise.all([
        this.alunoService.carregarAlunos(),
        this.aulaService.carregarAulas(),
      ]);
    } catch {
      this.erro.set('Não foi possível carregar os alunos e as aulas. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }
}
