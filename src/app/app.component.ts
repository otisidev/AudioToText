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
  contentTypes: string[];
  // default constructor
  constructor(private service: AppService) {
    this.title = 'Audio 2 Text';
    this.result = '';
    this.loading = false;
    this.contentTypes = [
      'audio/basic',
      'audio/flac',
      'audio/l16',
      'audio/mp3',
      'audio/mpeg',
      'audio/mulaw',
      'audio/ogg',
      'audio/webm'
    ];
  }

  ngOnInit(): void {
    this.file = null;
  }
  // choose file
  onFile(fileInput: any) {
    this.file = fileInput.target.files[0];
    if (!this.isFileVaild(this.file.type)) {
      this.result = 'Media type not supported!';
    } else {
      this.result = '';
    }
  }

  // send to server
  transcript() {
    if (this.file) {
      this.result = '';
      // set loading to true
      this.loading = true;
      // post file to server
      this.service.postFile(this.file).subscribe(
        item => {
          this.loading = false;
          this.result = item;
        },
        err => {
          this.loading = false;
          if (err._body) {
            this.result = JSON.parse(err._body).message;
          }
          this.result = 'An error occurred, please try again later.';
          // console.log(JSON.stringify(JSON.parse(err._body), null, 2));
        }
      );
    }
  }
  isFileVaild(type): boolean {
    const matched = this.contentTypes.filter(item => item === type);
    return matched.length > 0;
  }
}
