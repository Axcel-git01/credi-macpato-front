import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appRequireRole]',
  standalone: true,
})
export class RequireRoleDirective {
  private tpl = inject(TemplateRef<unknown>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(AuthService);

  @Input('appRequireRole') set requiredRoles(value: string[] | string) {
    const required = Array.isArray(value) ? value : [value];
    const roles = this.auth.getCurrentUserRoles();
    const set = new Set(roles);
    const ok = required.some(r => set.has(r));

    this.vcr.clear();
    if (ok) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}

