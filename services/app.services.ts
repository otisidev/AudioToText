import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {

    constructor(private http: Http) {
    }
    // getGoogleReview
    postFile(file: any): Observable<string> {
        // instance of  formData
        const formData: FormData = new FormData();
        // header
        const headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        const body = JSON.stringify({ headers: headers });

        const ext = file.name.split('.');
        const filename = 'audio.' + ext[ext.length - 1];
        formData.append('file', file, filename);

        return this.http.post('/api/upload', formData, body)
            .map(items => items.json())
            .catch((e) => {
                return Observable.throw(e);
                });
        }
}
