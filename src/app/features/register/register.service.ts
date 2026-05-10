import { Injectable } from "@angular/core";
import { UserDto } from "../shared/models/userDto.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private readonly http: HttpClient) { }

  create( user: UserDto): Observable<void>{
    return this.http.post<void>(`${environment.BACK_END}/api/techbridge-user/users`, user);

  }
}