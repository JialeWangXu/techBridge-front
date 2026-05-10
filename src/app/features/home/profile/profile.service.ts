import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDto } from "../../shared/models/userDto.model";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private readonly http: HttpClient) { }
    apiUrl = `${environment.BACK_END}/api/techbridge-user/users/me`;

    getProfile():Observable<UserDto> {
      return this.http.get<UserDto>(this.apiUrl);
    }

    editProfile(user: UserDto): Observable<UserDto> {
      return this.http.put<UserDto>(this.apiUrl, user);
    }
}