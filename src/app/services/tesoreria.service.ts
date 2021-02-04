import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule, HttpResponse, HttpRequest } from '@angular/common/http';
import { Proveedores } from '../interfaces/proveedores.interfaz';
import { Pagos } from '../interfaces/pagos.interfaz';
import { Empresas } from '../interfaces/empresas.interfaz';
import { NotificacionComponent } from '../pages/notificacion/notificacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TesoreriaService {
  [x: string]: any;
  authService: any;
  httpClient: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    // this.cargarProveedores();
    this.CargarEmpresas();
  }

  private ruta = 'https://localhost:44355/api/';

  proveedores: Proveedores[] = [];
  empresas: Empresas[] = [];
  pagos: Pagos[] = [];
  cargando = true;
  enviado = true;
  contador = 0;
  enviarData = 0;
  // tslint:disable-next-line: typedef
  public cargarProveedores(empresa) {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise<void>( ( resolve, reject ) => {
      this.http.get(this.ruta + 'PagosProveedores/Proveedores/' + empresa)
      .subscribe((resp: Proveedores[]) => {
          this.proveedores = resp;
          this.cargando = false;
          resolve();
        }
      );
    });
  }

  // tslint:disable-next-line: typedef
  cargarProveedores1( empresa: string ) {
    return this.http.get(this.ruta + 'PagosProveedores/Proveedores/' + empresa);
    }

  // tslint:disable-next-line: typedef
  public CargarEmpresas() {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise<void>( ( resolve, reject ) => {
      this.http.get(this.ruta + 'PagosProveedores/Empresas')
      .subscribe((resp: Empresas[]) => {
          this.empresas = resp;
          this.cargando = false;
          // console.log(this.empresas);
          resolve();
        }
      );
    });
  }

  // tslint:disable-next-line: typedef
  getPagos( rif: string, empresa: string ) {
    return this.http.get(this.ruta + 'PagosProveedores/PagosProveedores/' + rif + '/' + empresa);
    }

  // tslint:disable-next-line: typedef
  EnviarData(body: Pagos[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const progreso = 100 / body.length;
    this.contador = 0;
    this.contador_porcentaje = '';
    this.enviado = true;
    this.enviarData = 1;

    // // Ciclo para recorrer los item seleccionados para enviar las notificaciones
    body.forEach(element => {
      // this.pagos[] = element;
      this.enviado = true;
      while (this.enviado) {
          const data = JSON.stringify(element);
          return new Promise<void>( ( resolve, reject ) => {
            this.http.post(this.ruta + 'PagosProveedores/EnviarCorreo', element, { headers })
            .subscribe((resp: any) => {
                this.contador = this.contador + progreso;
                const ValorRedondeado = Math.ceil(this.contador);
                this.contador_porcentaje = ValorRedondeado.toString() + '%';
                // this.contador_porcentaje = Math.ceil(this.contador).toString() + '%';
                if (this.contador >= 99)
                {
                  this.showSnackbarAction('Las notificaciones fueron enviadas satisfactoriamente', 'OK');
                }

                this.enviado = resp;
                resolve();
            }
          );
        });
      }
    });

    // body.forEach(groceryItem => console.log(groceryItem));

  //   body.forEach(Item => {
  //     console.log(Item);
  //     const data = JSON.stringify(Item);
  //     while (this.enviado) {
  //         return new Promise<void>( ( resolve, reject ) => {

  //           this.http.post(this.ruta + 'PagosProveedores/EnviarCorreo', data, { headers })
  //           .subscribe((resp: any) => {
  //               this.contador = this.contador + progreso;

  //               if (this.contador >= 99)
  //               {
  //                 this.showSnackbarAction('Las notificaciones fueron enviadas satisfactoriamente', 'OK');
  //               }

  //               this.enviado = resp;
  //               resolve();

  //           }
  //         );
  //       });
  //     }
  //   });
  }

// tslint:disable-next-line: typedef
showSnackbarAction(content, action) {
  const snack = this.snackBar.open(content, action);
  // snack.afterDismissed().subscribe(() => {
  //     console.log('This will be shown after snackbar disappeared');
  //   });
  snack.onAction().subscribe(() => {
      console.log('OK');
      this.enviarData = 0;
    });
}
// https://localhost:44355/api/PagosProveedores/EnviarCorreo
}
