import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Objeto preparado para lo que espera tu Backend
  nuevoUsuario = {
    username: '',
    email: '',
    password: '',
    role: 'MIEMBRO' // Valor por defecto
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
  if (this.nuevoUsuario.username && this.nuevoUsuario.password && this.nuevoUsuario.email) {
    
    this.authService.register(this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('¡Registro exitoso!', res);
        alert('¡Bienvenido a la familia MacPato! Cuenta de ' + this.nuevoUsuario.role + ' creada con éxito.');
        this.router.navigate(['/login']);
      },
      
      error: (err) => {
        console.error('Error al registrar:', err);
        alert('Hubo un error al crear la cuenta. Revisa los datos.');
      }
    });

  } else {
    alert('Por favor, completa todos los campos.');
  }
}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}