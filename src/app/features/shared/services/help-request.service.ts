import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HelpRequest, HelpRequestCreate, PageResponse, RequestStatus } from "../models/helpRequest.model";
import { HelpStatus, SessionMethods, SupportSession } from "../models/supportSession.model";
import { environment } from "../../../../environments/environment";



@Injectable({
    providedIn: 'root'
})
export class HelpRequestService{

  apiUrl = `${environment.BACK_END}/api/techbridge-helprequest/helprequests`;
  constructor(private readonly http: HttpClient) { }

  create(helpRequestCreate: HelpRequestCreate): Observable<HelpRequest>{
    return this.http.post<HelpRequest>(this.apiUrl, helpRequestCreate);
  }

  getSeniorFilteredHelpRequests(status: RequestStatus, category: ''|'AI_ONLY'|'VOLUNTEER', page:number, pageSize:number)
  :Observable<PageResponse<HelpRequest>>{
      let param = new HttpParams()
      .set('status', status.toString())
      .set('category', category)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PageResponse<HelpRequest>>(this.apiUrl+'/senior/my', { params: param })
  }

  getVolunteerFilteredHelpRequests(status: HelpStatus, page:number, pageSize:number)
  :Observable<PageResponse<HelpRequest>>{
    let param = new HttpParams()
      .set('status', status.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PageResponse<HelpRequest>>(this.apiUrl+'/volunteer/my', { params: param });
  }

  getById(id:string):Observable<HelpRequest>{
    return this.http.get<HelpRequest>(`${this.apiUrl}/${id}`);
  }

  deleteById(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllAvailable(method:string, province:string, city:string, search:string ,page:number, pageSize:number):Observable<PageResponse<HelpRequest>>{
    let param = new HttpParams()
      .set('contactPreference', method)
      .set('province', province)
      .set('city', city)
      .set('search', search)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PageResponse<HelpRequest>>(`${this.apiUrl}/available`, { params: param });
  }

  updateRequestStatus(id:string, status:RequestStatus):Observable<HelpRequest>{
    return this.http.put<HelpRequest>(`${this.apiUrl}/${id}`, {status});
  }

  checkVolunteerInProgressRequests():Observable<boolean>{
    return this.http.get<boolean>(`${this.apiUrl}/inProgress/check`);
  }

  countVolunteerInProgressRequest():Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/inProgress/count`);
  }

}

@Injectable({
    providedIn: 'root'
})
export class SupportSessionService{
  apiUrl = `${environment.BACK_END}/api/techbridge-helprequest/supportsession`;
  constructor(private readonly http: HttpClient) { }

  updateSupportSession(supportSessionId:string, supportSession: SupportSession): Observable<SupportSession>{
    return this.http.put<SupportSession>(`${this.apiUrl}/${supportSessionId}`, supportSession);
  }

  saveSessionMethod(supportSessionId:string, sessionMethod: SessionMethods): Observable<SupportSession>{
    return this.http.put<SupportSession>(`${this.apiUrl}/${supportSessionId}`, {sessionMethod});
  }

  uploadResource(supportSessionId:string, file: File): Observable<void>{
    const formData = new FormData();
      formData.append('file', file, supportSessionId);
    return this.http.post<void>(`${this.apiUrl}/${supportSessionId}`, formData);
  }

  downloadResource(supportSessionId:string): Observable<string>{
    return this.http.get(`${this.apiUrl}/${supportSessionId}`, { responseType: 'text' });
  }

}