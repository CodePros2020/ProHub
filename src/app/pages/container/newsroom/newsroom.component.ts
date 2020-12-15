import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddEditNewsDialogComponent} from './add-edit-news-dialog/add-edit-news-dialog.component';
import {NewsModel} from './manager/news.model';
import {NewsService} from '../../../shared-services/news.service';
import {map} from 'rxjs/operators';
import {HideNewsDialogComponent} from './hide-news-dialog/hide-news-dialog.component';
import {PropertyService} from '../../../shared-services/property.service';
import {AuthService} from '../../../shared-services/auth.service';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
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

  async exportNewsForm(news: NewsModel){
    const prop: PropertyModel =  this.propertyService.GetPropertyInSession();
    const imageData = news.imageUrl ? await this.getBase64ImageFromURL(news.imageUrl) : null;
    const newsDocumentBody = [
      // message header
      {
        text: prop.name,
        alignment: 'left',
        bold: true,
        fontSize: 14,
        color: "#999999",
        margin: [ 0, 0, 0, 10 ]
      },
      {
        text: news.newsTitle,
        alignment: 'left',
        style: 'h1',
        margin: [ 0, 0, 0, 10 ]
      },
      {
        text: `Post At: ${news.createTime}`,
        alignment: 'left',
        style: 'postedDate',
        margin: [ 0, 0, 0, 10 ]
      },
      // optional attachment
      news.fileUrl ?
      {
        text:  [
          {
            text: `Attachment: `,
          },
          {
            text: 'Open Attached File',
            link: news.fileUrl,
            decoration:"underline",
          },
        ],
        alignment: 'left',
        style: 'postedDate',
        margin: [ 0, 0, 0, 10 ]
      } : {},
      // optional image
      imageData ?
      {
        image: imageData,
        width: 400,
        margin: [ 0, 0, 0, 20 ]
      } : {},
      {
        text: news.content,
        alignment: 'left',
        style: 'body',
        margin: [ 0, 10, 0, 10 ]
      },
    ];

    // define document
    let documentDefinition = {
      content: [
        newsDocumentBody
      ],
      footer: function (currentPage, pageCount) {
        return {
          text: `Page ${currentPage.toString()} of ${pageCount}`,
          alignment: 'right',
          style: 'normalText',
          margin: [0, 20, 20, 10]
        }
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 30, 0, 30],
          // decoration: 'underline'
        },
        h1: {
          fontSize: 24,
          bold: true,
          margin: [0, 20, 10, 20],
        },
        postedDate: {
          fontSize: 12,
        },
        body: {
          fontSize: 14,
          margin: [0, 20, 10, 20],
        },
      }
    };
    // generate pdf and download
    pdfMake.createPdf(documentDefinition).download(
      // Filename format: YYYYMMDD-newsTitle
      (new Date).toISOString().slice(0,10).replace(/-/g,"")
      + '_' + news.newsTitle.replace(/[\\\/:\*\?\"\<\>\|]/gi, '_')
    );
  }

  // download image data from url
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      // events
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
    });
  }

}
