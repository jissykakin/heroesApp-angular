import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, CanActivateFn, CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard {
  constructor(
    private authService : AuthService,
    private router: Router
  ) { }


    canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> =>
    {
     return this.checkAuthStatus();
    }

    canMatch:  CanMatchFn = (route : Route , segments: UrlSegment[]): Observable<boolean> => {
      return this.checkAuthStatus();
    }


   checkAuthStatus(): Observable<boolean>  {

    return this.authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {

        if (isAuthenticated) {
          this.router.navigate(['./']);  
        }
      }),
      map( isAuthenticated => !isAuthenticated)
    );
  }

}



