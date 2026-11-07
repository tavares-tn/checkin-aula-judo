import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Aluno } from '../../models/aluno.model';
import { FaixaGraduacao } from '../../models/faixa-graduacao';
import { AlunoService } from '../../services/aluno-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-aluno-cadastro',
  styleUrl: './aluno-cadastro.css',
  templateUrl: './aluno-cadastro.html',
})
export class AlunoCadastro {
  readonly faixasGraduacao = Object.values(FaixaGraduacao);
  erro = signal('');
  cadastrado = signal(false);
  salvando = signal(false);
  private alunoService = inject(AlunoService);
  formAluno: FormGroup<{
    cpf: FormControl<number>;
    nome: FormControl<string>;
    graduacao: FormControl<FaixaGraduacao>;
  }>;

  constructor() {
    this.formAluno = new FormGroup({
      cpf: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(99999999999)],
      }),
      nome: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      graduacao: new FormControl<FaixaGraduacao>(FaixaGraduacao.BRANCA, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  salvar() {
    this.erro.set('');
    this.cadastrado.set(false);

    if (this.formAluno.invalid) {
      this.formAluno.markAllAsTouched();
      return;
    }

    this.salvando.set(true);

    const aluno: Aluno = this.formAluno.getRawValue();
    this.alunoService
      .addAluno(aluno)
      .then(() => {
        this.formAluno.reset({
          cpf: 0,
          nome: '',
          graduacao: FaixaGraduacao.BRANCA,
        });
        this.cadastrado.set(true);
      })
      .catch((erro: unknown) => {
        if (erro instanceof Error && erro.name === 'ConstraintError') {
          this.erro.set('Já existe um aluno cadastrado com esse CPF.');
        } else {
          this.erro.set('Não foi possível cadastrar o aluno. Tente novamente.');
        }
      })
      .finally(() => this.salvando.set(false));
  }
}
