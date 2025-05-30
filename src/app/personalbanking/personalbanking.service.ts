import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class personalService {

    constructor(private httpClient: HttpClient) { }

    postpersonalbanking(form: any) {
        return this.httpClient.post('http://localhost:5000/api/employee', form)
    }

     getersonalbanking(form: any) {
        return this.httpClient.get('http://localhost:5000/api/employee')
    }

}