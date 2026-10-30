import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Aluno } from '../../models/aluno.model';
import { FaixaGraduacao } from '../../models/faixa-graduacao';
import { AlunoService } from '../../services/aluno-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-aluno-cadastro',
  styleUrl: './aluno-cadastro.css',
  templateUrl: './aluno-cadastro.html',
})
export class AlunoCadastro {
  readonly faixasGraduacao = Object.values(FaixaGraduacao);
  aluno: Aluno = { cpf: 0, nome: '', graduacao: FaixaGraduacao.BRANCA };
  erro = signal('');
  cadastrado = signal(false);
  salvando = signal(false);

  constructor(private readonly alunoService: AlunoService) {}

  async cadastrar(formulario: NgForm): Promise<void> {
    this.erro.set('');
    this.cadastrado.set(false);
    this.salvando.set(true);

    try {
      await this.alunoService.cadastrar({ ...this.aluno });
      this.aluno = { cpf: 0, nome: '', graduacao: FaixaGraduacao.BRANCA };
      formulario.resetForm(this.aluno);
      this.cadastrado.set(true);
    } catch (erro: unknown) {
      if (erro instanceof DOMException && erro.name === 'ConstraintError') {
        this.erro.set('Já existe um aluno cadastrado com esse CPF.');
      } else {
        this.erro.set('Não foi possível cadastrar o aluno. Tente novamente.');
      }
    } finally {
      this.salvando.set(false);
    }
  }
}
