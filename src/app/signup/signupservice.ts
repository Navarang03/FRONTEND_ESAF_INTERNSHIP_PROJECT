import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class signupService {

    constructor(private httpClient: HttpClient) { }

    postsignup(form: any) {
        return this.httpClient.post('http://localhost:5000/api/Signup', form)
    }


}
