import { Injectable } from "@angular/core";
import { UserDto } from "../shared/models/userDto.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private readonly http: HttpClient) { }

  create( user: UserDto): Observable<void>{
    return this.http.post<void>('http://localhost:8080/api/techbridge-user/users', user);

  }
}