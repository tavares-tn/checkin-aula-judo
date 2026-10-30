import { Component, signal } from '@angular/core';
import { Header } from './shared/components/layout/header/header';
import { Footer } from './shared/components/layout/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [Header, Footer, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('checkin-aula-judo');
}
