import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HelpRequest, HelpRequestCreate } from "../../shared/models/helpRequest.model";



@Injectable({
    providedIn: 'root'
})
export class HelpRequestService{

  apiUrl = 'http://localhost:8080/api/techbridge-helprequest/helprequests';
  constructor(private readonly http: HttpClient) { }

  create(helpRequestCreate: HelpRequestCreate): Observable<void>{
    return this.http.post<void>(this.apiUrl, helpRequestCreate);
  }

  getAllBySeniorEmail():Observable<HelpRequest[]>{
    return  this.http.get<HelpRequest[]>(this.apiUrl);
  }

  getById(id:string):Observable<HelpRequest>{
    return this.http.get<HelpRequest>(`${this.apiUrl}/${id}`);
  }

  deleteById(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}