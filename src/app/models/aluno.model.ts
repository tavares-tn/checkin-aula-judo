import { FaixaGraduacao } from './faixa-graduacao';

export interface Aluno {
  cpf: number;
  nome: string;
  graduacao: FaixaGraduacao;
}
