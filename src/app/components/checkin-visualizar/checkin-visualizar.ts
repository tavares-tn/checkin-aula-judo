import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno-service';
import { AulaService } from '../../services/aula-service';
import { CheckinService } from '../../services/checkin-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-checkin-visualizar',
  styleUrl: './checkin-visualizar.css',
  templateUrl: './checkin-visualizar.html',
})
export class CheckinVisualizar implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly alunoService = inject(AlunoService);
  private readonly aulaService = inject(AulaService);
  private readonly checkinService = inject(CheckinService);
  readonly alunos = this.alunoService.alunos;
  readonly aulas = this.aulaService.aulas;
  readonly checkins = this.checkinService.checkins;
  alunoFiltro: number | null = null;
  aulaFiltro: number | null = null;
  carregando = signal(true);
  erro = signal('');
  erroExclusao = signal('');
  removendo = signal<number | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarDados();
    }
  }

  checkinsFiltrados() {
    return this.checkins().filter(
      (checkin) =>
        (this.alunoFiltro === null || checkin.alunoId === this.alunoFiltro) &&
        (this.aulaFiltro === null || checkin.aulaId === this.aulaFiltro),
    );
  }

  nomeAluno(alunoId: number): string {
    return this.alunos().find((aluno) => aluno.cpf === alunoId)?.nome ?? 'Aluno não encontrado';
  }

  descricaoAula(aulaId: number): string {
    const aula = this.aulas().find((item) => item.id === aulaId);
    return aula ? `${aula.tema} - ${aula.data}` : 'Aula não encontrada';
  }

  async excluir(id: number, alunoId: number, aulaId: number): Promise<void> {
    if (
      !isPlatformBrowser(this.plataforma) ||
      this.removendo() !== null ||
      !window.confirm(
        `Deseja excluir o check-in de ${this.nomeAluno(alunoId)} na aula ${this.descricaoAula(aulaId)}?`,
      )
    ) {
      return;
    }

    this.erroExclusao.set('');
    this.removendo.set(id);

    try {
      await this.checkinService.deletarCheckin(id);
    } catch {
      this.erroExclusao.set('Não foi possível excluir o check-in. Tente novamente.');
    } finally {
      this.removendo.set(null);
    }
  }

  private async carregarDados(): Promise<void> {
    try {
      await Promise.all([
        this.alunoService.carregarAlunos(),
        this.aulaService.carregarAulas(),
        this.checkinService.carregarCheckins(),
      ]);
    } catch {
      this.erro.set('Não foi possível carregar os check-ins. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }
}
