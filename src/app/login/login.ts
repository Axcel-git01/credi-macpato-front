import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
// Asegúrate de que esta ruta sea la correcta hacia tu servicio
import { AuthService } from '../services/auth.services'; 
import { LoginRequestDTO } from '../models/loginrequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {


  // Aquí es donde el 'private' funciona correctamente
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}
  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
  
  if (this.usuario && this.password) {
    // CREAMOS EL OBJETO QUE ESPERA EL BACKEND
    const datosLogin: LoginRequestDTO = {
      username: "",
      password: "",
    };

    // SE LO PASAMOS COMO UN SOLO ARGUMENTO
    this.authService.login(datosLogin).subscribe({
      next: (response) => {
        console.log('¡Login exitoso!', response);
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMsj = 'Usuario o contraseña incorrectos.';
      }
    });
  } else {
    this.errorMsj = 'Por favor, completa todos los campos.';
  }
}
}