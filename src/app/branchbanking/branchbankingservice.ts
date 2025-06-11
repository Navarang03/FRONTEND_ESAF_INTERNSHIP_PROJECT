import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class branchService {

    constructor(private httpClient: HttpClient) { }

    postpersonalbanking(form: any) {
        return this.httpClient.post('http://localhost:5000/api/employee', form)
    }

     getersonalbanking() {
        return this.httpClient.get('http://localhost:5000/api/employee')
    }

    deleteEmployee(employeeId: string){
  return this.httpClient.delete(`http://localhost:5000/api/employee/${employeeId}`);
}


}