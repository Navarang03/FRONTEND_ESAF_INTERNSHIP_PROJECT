import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class loginService {

    constructor(private httpClient: HttpClient) { }

    postlogin(form: any) {
        return this.httpClient.post('http://localhost:5000/api/login', form);
    }




}
