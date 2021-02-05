import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { TesoreriaService } from '../../services/tesoreria.service';
import { Pagos } from '../../interfaces/pagos.interfaz';
import { MatSort } from '@angular/material/sort';

import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Components/Shared/confirm-dialog/confirm-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';



@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss']
})

export class NotificacionComponent implements AfterViewInit {
    // tslint:disable-next-line: variable-name
    pagos_pro: any[] = [];
    pagos1: Pagos;
    HabilitarProveedores = false;

    // tslint:disable-next-line: max-line-length
    displayedColumns: string[] = ['select', 'VCHRNMBR', 'VENDORID', 'DOCTYPE', 'DOCDATE', 'DOCNUMBR', 'Monto_Factura', 'TRXDSCRN', 'CURNCYID'];
    dataSource = new MatTableDataSource<Pagos>();
    selection = new SelectionModel<Pagos>(true, []);
    @ViewChild(MatSort) sort: MatSort;

    /* Progress bar */
    color: ThemePalette = 'primary';
    mode: ProgressBarMode = 'determinate';
    value = 0;
    bufferValue = 0;

  // tslint:disable-next-line: max-line-length
  constructor(public ServicioDatos: TesoreriaService, public dialogo: MatDialog, private snackBar: MatSnackBar, private SpinnerService: NgxSpinnerService, private MatDatepicker: MatDatepickerModule ) {
    // this.ServicioDatos.proveedores
   }

  // tslint:disable-next-line: typedef
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // tslint:disable-next-line: typedef
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

    checkboxLabel(row?: Pagos): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.POS + 1}`;
    }

  // tslint:disable-next-line: typedef
  Cargar_Pagos(rif, empresa) {
    this.SpinnerService.show();
    // console.log(rif.value);
    this.pagos_pro = [];
    // this.selection = null;

    this.ServicioDatos.getPagos(rif.value, empresa)
    .subscribe( (pagos1: any[]) => {
        this.pagos_pro = pagos1;
        this.dataSource = new MatTableDataSource<Pagos>(pagos1);
        this.SpinnerService.hide();
    });
  }

  // tslint:disable-next-line: typedef
  Cargar_Proveedores(pempresa) {
    this.SpinnerService.show();
    // console.log(pempresa.value);
    this.ServicioDatos.cargarProveedores1(pempresa.value)
    .subscribe( (proveedores: any[]) => {
        this.ServicioDatos.proveedores = proveedores;
        // console.log(this.ServicioDatos.proveedores);
        this.SpinnerService.hide();
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  enviar(): void {
    if (this.selection.selected.length > 0)
    {
      this.value = this.ServicioDatos.contador;
      // this.enviarData = 1;
      this.bufferValue = 0;
      this.ServicioDatos.EnviarData(this.selection.selected);

      // mandar mensaje

    }
    else
    {
      this.ServicioDatos.enviarData = 0;
    }
  }


  /***********************/
// tslint:disable-next-line: typedef
openDialog() {

  const dialogRef = this.dialogo.open(ConfirmDialogComponent, {
    maxWidth: '400px',
    data: {
        title: '',
        message: 'Está seguro que desea enviar las notificaciones?'}
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult)
      {
        this.enviar();
        //  console.log(dialogResult);
        // if (this.ServicioDatos.contador >= 99)
        // {
        //   this.showSnackbarAction('Las notificaciones fueron enviadas satisfactoriamente', 'OK');
        // }
      }

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
