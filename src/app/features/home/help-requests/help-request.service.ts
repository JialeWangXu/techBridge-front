import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HelpRequest, HelpRequestCreate, RequestStatus } from "../../shared/models/helpRequest.model";
import { SessionMethods, SupportSession } from "../../shared/models/supportSession.model";



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

  getAllAvailable():Observable<HelpRequest[]>{
    return this.http.get<HelpRequest[]>(`${this.apiUrl}/available`);
  }

  updateRequestStatus(id:string, status:RequestStatus):Observable<HelpRequest>{
    return this.http.put<HelpRequest>(`${this.apiUrl}/${id}`, {status});
  }

}

@Injectable({
    providedIn: 'root'
})
export class SupportSessionService{
  apiUrl = 'http://localhost:8080/api/techbridge-helprequest/supportsession';
  constructor(private readonly http: HttpClient) { }

  updateSupportSession(supportSessionId:string, supportSession: SupportSession): Observable<SupportSession>{
    return this.http.put<SupportSession>(`${this.apiUrl}/${supportSessionId}`, supportSession);
  }

  saveSessionMethod(supportSessionId:string, sessionMethod: SessionMethods): Observable<SupportSession>{
    return this.http.put<SupportSession>(`${this.apiUrl}/${supportSessionId}`, {sessionMethod});
  }

}