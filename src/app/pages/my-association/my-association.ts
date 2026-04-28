import { Component } from '@angular/core';
import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';

@Component({
  selector: 'app-my-association-page',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>
      <div>
        <!-- Contenido en blanco por ahora (Mi Asociación) -->
      </div>
    </app-shell>
  `,
})
export class MyAssociationPage {}

