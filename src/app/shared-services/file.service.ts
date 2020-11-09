// Reference:
// https://medium.com/linkit-intecs/upload-and-view-files-in-firebase-storage-using-angular-firebase-realtime-database-b7da8bdfb20a
import {Inject, Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  imageDetailList: AngularFireList<any>;
  fileList: any[];
  dataSet: Data = {
    id: '',
    url: ''
  };
  msg = 'error';
  constructor(@Inject(AngularFireDatabase) private firebase: AngularFireDatabase){}

  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetails(id, url) {
    this.dataSet = {
      id,
      url
    };
    this.imageDetailList.push(this.dataSet);
  }

  getImage(value) {
    this.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.fileList = list.map(item => item.payload.val());
        this.fileList.forEach(element => {
          if (element.id === value) {
            this.msg = element.url;
          }
        });
        if (this.msg === 'error'){
          alert('No record found');
        }
        else {
          window.open(this.msg);
          this.msg = 'error';
        }
      }
    );
  }

}

export interface Data{
  id: string;
  url: string;
}
