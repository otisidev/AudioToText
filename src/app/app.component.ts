import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.services';
declare let $: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  moduleId: module.id,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;
  file: File;
  result: string;
  loading: boolean;
  // default constructor
  constructor(private service: AppService) {
    this.title = 'Audio 2 Text';
    this.result = '';
    this.loading = false;
  }


  ngOnInit(): void {
    this.file = null;
  }
  // choose file
  onFile(fileInput: any) {
    this.file = fileInput.target.files[0];
  }

  // send to server
  transcript() {

    if (this.file) {
this.result = '';
      // set loading to true
      this.loading = true;
      // post file to server
      this.service.postFile(this.file)
        .subscribe(item => {
          this.loading = false;
          this.result = item;
        }, (err) => {
          this.loading = false;
          if (err._body) {
             this.result = JSON.parse(err._body).message;
          }
          this.result =  'An error occurred, please try again later.';
          // console.log(JSON.stringify(JSON.parse(err._body), null, 2));
        });
    }
  }
}
