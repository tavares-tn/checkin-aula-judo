import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Aula } from '../../models/aula.model';
import { AulaService } from '../../services/aula-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-aula-edicao',
  styleUrl: './aula-edicao.css',
  templateUrl: './aula-edicao.html',
})
export class AulaEdicao implements OnInit {
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly rota = inject(ActivatedRoute);
  private readonly aulaService = inject(AulaService);
  aula: Aula = { id: 0, tema: '', data: '' };
  carregando = signal(true);
  naoEncontrada = signal(false);
  erro = signal('');
  atualizada = signal(false);
  salvando = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataforma)) {
      void this.carregarAula();
    }
  }

  async atualizar(formulario: NgForm): Promise<void> {
    this.erro.set('');
    this.atualizada.set(false);
    this.salvando.set(true);

    try {
      if (this.aula.id === undefined) {
        this.naoEncontrada.set(true);
        return;
      }

      const encontrada = await this.aulaService.atualizarAula({
        ...this.aula,
        id: this.aula.id,
      });
      if (!encontrada) {
        this.naoEncontrada.set(true);
        return;
      }

      this.atualizada.set(true);
      formulario.form.markAsPristine();
    } catch {
      this.erro.set('Não foi possível atualizar a aula. Tente novamente.');
    } finally {
      this.salvando.set(false);
    }
  }

  private async carregarAula(): Promise<void> {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.naoEncontrada.set(true);
      this.carregando.set(false);
      return;
    }

    try {
      const aula = await this.aulaService.buscarAula(id);
      if (aula) {
        this.aula = { ...aula };
      } else {
        this.naoEncontrada.set(true);
      }
    } catch {
      this.erro.set('Não foi possível carregar a aula. Tente atualizar a página.');
    } finally {
      this.carregando.set(false);
    }
  }
}
