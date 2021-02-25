import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TesoreriaService } from '../../services/tesoreria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  UsuarioValido = false;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, public ServicioDatos: TesoreriaService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

      this.registerForm = this.formBuilder.group(
      {
        // title: ['', Validators.required],
        // firstName: ['', Validators.required],
        // lastName: ['', Validators.required],
        // validates date format yyyy-mm-dd
        // dob: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
        user: ['', [Validators.required]],
        password: ['', [Validators.required]]
        // confirmPassword: ['', Validators.required],
        // acceptTerms: [false, Validators.requiredTrue]
      },
      {
          // validator: MustMatch('password', 'confirmPassword')
      });

  }

  // tslint:disable-next-line: typedef
  get f() { return this.registerForm.controls; }

  // tslint:disable-next-line: typedef
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    // console.warn('XXXXX');
    // console.log(this.registerForm.value);
    // console.log(this.f.user.value);
    // console.log(this.f.password.value);

    // alert('SUCCESS!! :-)');

    this.ValidarUsuario(this.f.user.value, this.f.password.value);
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

    // tslint:disable-next-line: typedef
    ValidarUsuario(usuario, pwd) {
      this.ServicioDatos.ValidarUsuario1(usuario, pwd)
      .subscribe( (resp: boolean) => {
        // console.log('Respuesta Usuario: ' + resp);
        // this.UsuarioValido = resp;

        if (resp)
        {
          console.log('Respuesta Usuario: ' + resp);

          // this.router.navigate(['notificaciones'], { relativeTo: this.route });
          this.router.navigate(['/notificaciones']);
          // this.router.navigateByUrl('/notificaciones}');
        }
        else
        {
          console.log('Respuesta Usuario: ' + resp);

          this.showSnackbarAction('Usuario o contraeña incorrecta', 'OK');
        }

        // return resp;
      });

    }

  // tslint:disable-next-line: typedef
  showSnackbarAction(content, action) {
    const snack = this.snackBar.open(content, action);
    // snack.afterDismissed().subscribe(() => {
    //     console.log('This will be shown after snackbar disappeared');
    //   });
    snack.onAction().subscribe(() => {
        console.log('OK');
      });
  }


}
