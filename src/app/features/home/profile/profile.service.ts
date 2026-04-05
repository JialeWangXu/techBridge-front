import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDto } from "../../shared/models/userDto.model";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private readonly http: HttpClient) { }
    apiUrl = 'http://localhost:8080/api/techbridge-user/users/me';

    getProfile():Observable<UserDto> {
      return this.http.get<UserDto>(this.apiUrl);
    }

    editProfile(user: UserDto): Observable<UserDto> {
      return this.http.put<UserDto>(this.apiUrl, user);
    }
}