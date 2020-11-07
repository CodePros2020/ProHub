import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {UploadFormDialogComponent} from "./upload-form-dialog/upload-form-dialog.component";
import {FormService} from "../../../shared-services/form.service";
import {finalize, map} from "rxjs/operators";
import {FormModel} from "./manager/form.model";
import {GenericDeleteDialogComponent} from "../../../shared-components/generic-delete-dialog/generic-delete-dialog.component";
import {AuthService} from "../../../shared-services/auth.service";
import {FileService} from "../../../shared-services/file.service";
import {AngularFireStorage} from "@angular/fire/storage";
import {PropertyModel} from "../property-list/manager/property.model";
import {CreateUpdatePropertyComponent} from "../property-list/create-update-property/create-update-property.component";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements AfterViewInit  {
  // property decorators
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  forms = [];
  form: FormModel;
   propId ="temp";


//  displayedColumns: string[] = ['filename', 'upload_date', 'size', 'action'];
  displayedColumns: string[] = ['filename', 'upload_date', 'action'];
  dataSource = new MatTableDataSource(this.forms)
  // constructor
  constructor(public dialog: MatDialog,
              private formService: FormService,
              private storage: AngularFireStorage,
              @Inject(FileService) private fileService: FileService
              ) {
  }

  // life cycle hooks
  ngOnInit(): void {
    this.retrieveForms();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  retrieveForms() {
    this.forms = [];
    this.formService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c=>({
        key: c.payload.key, ...c.payload.val()
      })))
    ).subscribe(data =>{
      data.forEach(res=>{
        this.form = new FormModel();
        this.form.key = res.key;
        this.form.formTitle = res.formTitle;
        this.form.dateCreated = res.dateCreated;
        this.form.contentUrl = res.contentUrl;
        this.form.propId = res.propId;
        // this.form.size = 1024;
        this.forms.push(this.form);
      });
      // this.properties = data;
      console.log('Forms retrieved: ', this.forms);
      // this.dataSource = new MatTableDataSource(this.forms);
      this.dataSource = new MatTableDataSource(this.forms);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  public openUploadFormDialog() {
    const dialogFilter = this.dialog.open(UploadFormDialogComponent, {
      height: '400px',
      width: '850px',
      disableClose: true,
      data: { update: false, form: new FormModel()}
    });
    // dialogFilter.componentInstance.propId = this.propId;
    dialogFilter.afterClosed().subscribe(res => {
      if (res) {
          this.retrieveForms();
      }
    });

  }

  updateForm(element: FormModel) {
    const dialogFilter = this.dialog.open(UploadFormDialogComponent, {
      height: '400px',
      width: '850px',
      disableClose: true,
      data: { update: true, form: element}
    });

    // dialogFilter.componentInstance.propId = this.propId;
    dialogFilter.afterClosed().subscribe(res => {
      if (res) {
        this.retrieveForms();
      }
    });

  }

  deleteForm(element: FormModel) {
    console.log(JSON.stringify(element));
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: { currentDialog: element.formTitle }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.formService.delete(element.key).then(() => {
          const deleteRef = this.storage.ref("form/" + this.propId + "/"  + element.key);
          deleteRef.delete()

          this.retrieveForms();
        });
      }
    });
  }

}
