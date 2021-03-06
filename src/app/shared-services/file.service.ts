// Reference:
// https://medium.com/linkit-intecs/upload-and-view-files-in-firebase-storage-using-angular-firebase-realtime-database-b7da8bdfb20a
import {Inject, Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../shared-components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class FileService {

// Image upload
  fireRef: AngularFireStorageReference;
  localUrl: string | ArrayBuffer;
  uploadProgress: Observable<number>;
  imgToUpload: any;
  task: AngularFireUploadTask;
  public downloadURL: string;
  public isUploaded = false;

  imageDetailList: AngularFireList<any>;
  fileList: any[];
  dataSet: Data = {
    id: '',
    url: ''
  };
  msg = 'error';
  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });
  constructor(@Inject(AngularFireDatabase) private firebase: AngularFireDatabase,
              private afStorage: AngularFireStorage,
              private overlay: Overlay) {
  }
  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }
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
        if (this.msg === 'error') {
          alert('No record found');
        } else {
          window.open(this.msg);
          this.msg = 'error';
        }
      }
    );
  }

  // async downloadPhoto(param: string) {
  //   this.afStorage.storage.refFromURL("https://firebasestorage.googleapis.com/v0/b/prohub-410f4.appspot.com/o/chat%2Fyycb08p9f2?alt=media&token=4bf30600-f6d7-4162-8510-72237f94507f")
  //     .getDownloadURL().then(x=>{
  //       fetch(x)
  //         .then(response => response.blob())
  //         .then(blob=>{
  //           new Promise((resolve, reject) => {
  //             const reader = new FileReader;
  //             reader.onerror = reject;
  //             reader.onload = () => {
  //               resolve(reader.result);
  //             };
  //             reader.readAsDataURL(blob);
  //           })
  //         })
  //         .then(doubleBase64EncodedFile=>{
  //           console.log(doubleBase64EncodedFile);
  //         })
  //
  //   })

  //
  //   const doubleBase64EncodedFile = await convertBlobToBase64(blob)
  //   const doubleEncodedBase64String:string = (doubleBase64EncodedFile).split(',')[1]
  //   const myBase64 = atob(doubleEncodedBase64String)
  // }

  // }


  uploadPhoto(event, ref: string) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.localUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    this.imgToUpload = event.target.files[0];
    // console.log('what is image to upload: ', this.imgToUpload);
    if (this.imgToUpload !== undefined) {
      const id = Math.random().toString(36).substring(2);
      this.fireRef = this.afStorage.ref(ref + id);
      this.task = this.fireRef.put(this.imgToUpload);
      this.uploadProgress = this.task.percentageChanges();
      this.uploadProgress.subscribe( res => {
        if (res === 100) {
          this.task.snapshotChanges().pipe(
            finalize(() => {
              this.fireRef.getDownloadURL().subscribe(url => {
                // console.log('what is url: ', url);
                this.downloadURL = url !== undefined ? url : '';
                this.hideOverLay();
              });
            })
          ).subscribe();
          this.hideOverLay();
          this.isUploaded = true;
        } else {
          this.hideOverLay();
          this.isUploaded = false;
        }
      });
      return this.isUploaded;
    }
  }

}

export interface Data{
  id: string;
  url: string;

}
