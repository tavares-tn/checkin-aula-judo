import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AlunoCadastro } from './components/aluno-cadastro/aluno-cadastro';
import { AlunoEdicao } from './components/aluno-edicao/aluno-edicao';
import { AlunoLista } from './components/aluno-lista/aluno-lista';
import { AulaCadastro } from './components/aula-cadastro/aula-cadastro';
import { AulaEdicao } from './components/aula-edicao/aula-edicao';
import { AulaLista } from './components/aula-lista/aula-lista';
import { CheckinAluno } from './components/checkin-aluno/checkin-aluno';
import { CheckinVisualizar } from './components/checkin-visualizar/checkin-visualizar';

export const routes: Routes = [
  { path: '', component: Home, title: 'Início' },
  { path: 'alunos', component: AlunoLista, title: 'Alunos cadastrados' },
  { path: 'alunos/cadastrar', component: AlunoCadastro, title: 'Cadastrar aluno' },
  { path: 'alunos/editar/:cpf', component: AlunoEdicao, title: 'Editar aluno' },
  { path: 'aulas', component: AulaLista, title: 'Aulas cadastradas' },
  { path: 'aulas/cadastrar', component: AulaCadastro, title: 'Cadastrar aula' },
  { path: 'aulas/editar/:id', component: AulaEdicao, title: 'Editar aula' },
  { path: 'checkin-aluno', component: CheckinAluno, title: 'Check-in do aluno' },
  { path: 'checkin-visualizar', component: CheckinVisualizar, title: 'Check-ins realizados' },
  { path: '**', redirectTo: '' },
];
