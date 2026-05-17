import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { AiLimitCheck } from "../models/aiTutorial.model";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AiTutorialService {
  apiUrl = `${environment.BACK_END}/api/techbridge-aitutorial/aitutorial`;
  constructor(private readonly http: HttpClient) { }

  aiLimitCheck():Observable<AiLimitCheck>{
    return this.http.get<AiLimitCheck>(`${this.apiUrl}/check`);
  }

}