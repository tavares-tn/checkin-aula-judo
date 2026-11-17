import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AulaService } from '../../services/aula-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-aula-cadastro',
  styleUrl: './aula-cadastro.css',
  templateUrl: './aula-cadastro.html',
})
export class AulaCadastro {
  erro = signal('');
  cadastrada = signal(false);
  salvando = signal(false);
  private aulaService = inject(AulaService);
  formAula: FormGroup<{
    tema: FormControl<string>;
    data: FormControl<string>;
  }>;

  constructor() {
    this.formAula = new FormGroup({
      tema: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      data: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  salvar() {
    this.erro.set('');
    this.cadastrada.set(false);

    if (this.formAula.invalid) {
      this.formAula.markAllAsTouched();
      return;
    }

    this.salvando.set(true);

    this.aulaService
      .addAula(this.formAula.getRawValue())
      .then(() => {
        this.formAula.reset({
          tema: '',
          data: '',
        });
        this.cadastrada.set(true);
      })
      .catch(() => {
        this.erro.set('Não foi possível cadastrar a aula. Tente novamente.');
      })
      .finally(() => this.salvando.set(false));
  }
}
