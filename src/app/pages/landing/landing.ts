import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

type Benefit = { icon: string; title: string; text: string };
type Step = { title: string; text: string };
type Testimonial = { quote: string; author: string; role?: string };

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class LandingPage {
  readonly benefits: Benefit[] = [
    {
      icon: 'storefront',
      title: 'Para comerciantes',
      text: 'Registro de ventas, control de deudas y reportes claros en segundos.',
    },
    {
      icon: 'account_circle',
      title: 'Para clientes',
      text: 'Consulta de deudas y pagos en tiempo real desde cualquier dispositivo.',
    },
    {
      icon: 'verified',
      title: 'Para la asociación',
      text: 'Transparencia, trazabilidad y eficiencia administrativa con información centralizada.',
    },
  ];

  readonly steps: Step[] = [
    { title: '1. Regístrate', text: 'Crea tu cuenta como comerciante, cliente o asociación.' },
    { title: '2. Gestiona', text: 'Registra ventas, consulta deudas y controla tus operaciones.' },
    { title: '3. Paga y reporta', text: 'Realiza pagos y genera reportes para toma de decisiones.' },
  ];

  readonly testimonials: Testimonial[] = [
    {
      quote:
        'Ahora veo mis ventas del día y mis pagos pendientes en un solo lugar. Mucho más ordenado.',
      author: 'Comerciante',
      role: 'Vendedor',
    },
    {
      quote:
        'Puedo consultar mis deudas y comprobar mis pagos sin ir a la oficina. Es rápido.',
      author: 'Cliente',
      role: 'Miembro',
    },
    {
      quote:
        'La asociación tiene reportes claros y control total. Mejoró la transparencia para todos.',
      author: 'Administración',
      role: 'Asociación',
    },
  ];
}

