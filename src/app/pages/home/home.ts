import { Component, computed, inject } from '@angular/core';
import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>

      <div class="content">
      </div>
    </app-shell>
  `,
})
export class HomePage {
  private auth = inject(AuthService);

  private roles = computed(() => this.auth.getCurrentUserRoles());
}


