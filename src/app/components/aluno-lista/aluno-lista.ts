import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Aluno } from '../../models/aluno.model';
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
  readonly alunos = signal<Aluno[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarAlunos();
    }
  }

  private async carregarAlunos(): Promise<void> {
    this.erro.set('');

    try {
      this.alunos.set(await this.alunoService.listar());
    } catch {
      this.erro.set('Não foi possível carregar os alunos. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }
}
