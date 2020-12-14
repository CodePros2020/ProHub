import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddEditNewsDialogComponent} from './add-edit-news-dialog/add-edit-news-dialog.component';
import {NewsModel} from './manager/news.model';
import {NewsService} from '../../../shared-services/news.service';
import {map} from 'rxjs/operators';
import {HideNewsDialogComponent} from './hide-news-dialog/hide-news-dialog.component';
import {PropertyService} from '../../../shared-services/property.service';
import {AuthService} from '../../../shared-services/auth.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {ChatModel} from "../chat/manager/chat.model";
import {PropertyModel} from "../property-list/manager/property.model";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-newsroom',
  templateUrl: './newsroom.component.html',
  styleUrls: ['./newsroom.component.scss']
})
export class NewsroomComponent implements OnInit {
  panelOpenState = false;
  allNewsList: NewsModel[];
  newsList: NewsModel[];
  news: NewsModel;
  propertyId: string;
  phoneNumber: string;
  userType;
  pdfSrc;

  constructor(public dialog: MatDialog,
              public propertyService: PropertyService,
              private authService: AuthService,
              private newsService: NewsService) { }

  ngOnInit(): void {

    if (this.propertyService.GetPropertyInSession() !== null) {
      this.propertyId = this.propertyService.GetPropertyInSession().propId;
    }
    this.phoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.userType = this.authService.GetUserInSession().userType;
   this.getNews();
  }
  getNews(){
    if (this.propertyId !== null && this.propertyId !== undefined) {
      this.newsService.getAll().snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          key: c.payload.key, ...c.payload.val()
        })))
      ).subscribe(data => {
        this.newsList = data.reverse().filter(a => !a.hideFlag).filter(a => a.propId === this.propertyId);
        this.allNewsList = this.newsList;
      });
    }

  }


  public openAddNewsDialog(){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '90%',
      width: '70%',
      data: {news: null, propId: this.propertyId, phoneNumber: this.phoneNumber},
      disableClose: false
    });
  }

  public openEditDialog(newsObject: NewsModel){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '90%',
      width: '70%',
      data: {news: newsObject},
      disableClose: false
    });
  }

  public openHideDialog(newsObject: NewsModel){
    const dialogFilter = this.dialog.open(HideNewsDialogComponent, {
      height: '200px',
      width: '400px',
      data: {news: newsObject},
      disableClose: false
    });
  }

  public searchNews(event: Event){
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.newsList = this.allNewsList.filter
      (a => (a.newsTitle.toLowerCase().includes(filterValue) || a.content.toLowerCase().includes(filterValue)));
  }
  async exportNewsForm(){
  //   const newsProcessor = this.newsList.map(async (n:NewsModel) => {
  //     let imageData = null;
  //
  //     // download image when included
  //     if(n.imageUrl !== undefined) {
  //       imageData = await this.getBase64ImageFromURL(n.imageUrl);
  //     }
  //
  //     if(imageData){
  //       return [
  //         // message header
  //         {
  //           text: "[" + this.formatDateTime(n.createTime) + "] "
  //             + n.newsTitle + " sent: ",
  //           alignment: 'left',
  //           margin: [ 0, 0, 0, 10 ]
  //         },
  //         // image
  //         {
  //           image: imageData,
  //           width: 250,
  //           margin: [ 0, 0, 0, 20 ]
  //         }
  //       ]
  //     } else {
  //       return [
  //         // message header
  //         {
  //           text: "[" + this.formatDateTime(n.createTime) + "] "
  //             + n.newsTitle + ": " + n.content,
  //           alignment: 'left',
  //           margin: [ 0, 0, 0, 10 ]
  //         }
  //       ]
  //
  //     }
  //   })
  //   // run chatMessageProcessor to each message and make pdf
  //   Promise.all(newsProcessor).then(async arrayOfResponses => {
  //     // let logo = await this.getBase64ImageFromURL("../../../../../../assets/logo-medium.png");
  //
  //     // get property information
  //     let prop: PropertyModel =  this.propertyService.GetPropertyInSession();
  //
  //     // define document
  //     let documentDefinition = {
  //       header:  function (currentPage, pageCount) {
  //         return {
  //           margin: [18,18,18,30],
  //           columns: [
  //             // {
  //             //   image: logo,
  //             //   width:30,
  //             //   alignment: "right"
  //             // },
  //             // {
  //             //   text: "ProHub - Chat History"
  //             // }
  //           ],
  //         }
  //       },
  //       footer: function (currentPage, pageCount) {
  //         return {
  //           text: `Page ${currentPage.toString()} of ${pageCount}`,
  //           alignment: 'right',
  //           style: 'normalText',
  //           margin: [0, 20, 20, 10]
  //         }
  //       },
  //       content: [
  //         {
  //           margin: [0, 0, 0, 5],
  //           text: [
  //             { text: prop.name + "\n",
  //               style: {
  //                 fontSize: 20,
  //                 bold: true,
  //                 margin: [0, 20, 10, 25],
  //                 // decoration: 'underline'
  //               },
  //             },
  //             { text: `${prop.streetLine1}\n`},
  //             prop.streetLine2 ? { text: `${prop.streetLine2}\n`} : {},
  //             { text: `${prop.city}, ${prop.province}, ${prop.postalCode}`},
  //           ],
  //           alignment: 'center',
  //         },
  //         {
  //           columns: [
  //             // TENANT Name
  //             {
  //               text: `Tenant: ${this.chatMessageName}`,
  //               style: 'h3',
  //             },
  //             {
  //               text: `Lessor: ${this.chatModel.fullName}`,
  //               style: 'h3',
  //             },
  //           ],
  //           alignment: 'center',
  //           margin: [0,0,0,5]
  //         },
  //
  //         // BODY
  //         // HEADER
  //         {
  //           text: 'Download PDF',
  //           style: 'h3_chathistory'
  //         },
  //         // print chat messages
  //         arrayOfResponses
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 30, 0, 30],
  //           // decoration: 'underline'
  //         },
  //         h3_chathistory: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 20, 10, 20],
  //           // decoration: 'underline'
  //         },
  //         h3: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 20, 10, 20],
  //           decoration: 'underline'
  //         },
  //         name: {
  //           fontSize: 16,
  //           bold: true
  //         },
  //         sign: {
  //           margin: [0, 50, 0, 10],
  //           alignment: 'right',
  //           italics: true
  //         },
  //       }
  //     };
  //     // generate pdf and download
  //     pdfMake.createPdf(documentDefinition).download(
  //       // Filename format: YYYYMMDD-PropertyName-TenantName
  //       (new Date).toISOString().slice(0,10).replace(/-/g,"")
  //       + '_' + prop.name
  //       + '_' + this.chatMessageName.fullName
  //     );
  //   })
   }
  // // format date for chat export history
  // formatDateTime(dateString) {
  //   let date: Date = new Date(dateString);
  //   let day = date.getDate();
  //   let monthIndex = date.getMonth();
  //   let year = date.getFullYear();
  //   let minutes = ('0'+date.getMinutes()).slice(-2);
  //   let hours = ('0'+date.getHours()).slice(-2);
  //   let seconds = ('0'+date.getSeconds()).slice(-2);
  //   let myFormattedDate = year+"-"+(monthIndex+1)+"-"+day+" "+ hours+":"+minutes+":"+seconds;
  //   return myFormattedDate;
  //
  // }
  //
  // // download image data from url
  // getBase64ImageFromURL(url) {
  //   return new Promise((resolve, reject) => {
  //     let img = new Image();
  //     img.setAttribute("crossOrigin", "anonymous");
  //     img.onload = () => {
  //       let canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       let ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);
  //       let dataURL = canvas.toDataURL("image/png");
  //       // let dataURL = canvas.toDataURL("image/jpeg");
  //       resolve(dataURL);
  //     };
  //     img.onerror = error => {
  //       reject(error);
  //     };
  //     img.src = url;
  //   });
  // }
}
