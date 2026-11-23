import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AulaService } from '../../services/aula-service';

@Component({
  imports: [RouterLink],
  selector: 'app-aula-lista',
  styleUrl: './aula-lista.css',
  templateUrl: './aula-lista.html',
})
export class AulaLista implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly aulaService = inject(AulaService);
  readonly aulas = this.aulaService.aulas;
  carregando = signal(true);
  erro = signal('');
  erroExclusao = signal('');
  removendo = signal<number | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarAulas();
    }
  }

  private async carregarAulas(): Promise<void> {
    this.erro.set('');

    try {
      await this.aulaService.carregarAulas();
    } catch {
      this.erro.set('Não foi possível carregar as aulas. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }

  async excluir(id: number, tema: string): Promise<void> {
    if (
      !isPlatformBrowser(this.plataforma) ||
      this.removendo() !== null ||
      !window.confirm(`Deseja excluir a aula ${tema}?`)
    ) {
      return;
    }

    this.erroExclusao.set('');
    this.removendo.set(id);

    try {
      await this.aulaService.deletarAula(id);
    } catch {
      this.erroExclusao.set('Não foi possível excluir a aula. Tente novamente.');
    } finally {
      this.removendo.set(null);
    }
  }
}
