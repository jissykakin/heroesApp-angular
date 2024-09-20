import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, Observable, of, tap } from 'rxjs';

import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl: string = environments.baseURL;
  private user?: User;

  constructor(
    private http: HttpClient
  ) { }

  get currentUser():User | undefined {
    if ( !this.user ) return undefined;
    return structuredClone( this.user ); // ... para no hacer una referencia a la variable
  }

  login( email: string, password: string):Observable<User>{

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
     tap( user => this.user = user),
     tap( user => localStorage.setItem('x-token', 'fdgdgd6545dhg.gdye5edhg.dy65dtddyfd') )
    );

  }

  checkAuthentication():Observable<boolean> {
    // si no tiene token no esta logeado
    if ( !localStorage.getItem('x-token') ) return of(false);

    const token = localStorage.getItem('x-token')

    // llamar al backend para hacer la autenticacion pasando el token
    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
      tap( user => this.user = user ),
      map( user => !!user),
      catchError( err => of(false))
    );

  }

  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}
