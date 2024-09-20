import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = ( route: ActivatedRouteSnapshot,  state: RouterStateSnapshot ) => {
  return checkAuthStatus();
};

export const authGuardFn: CanMatchFn = (route : Route , segments: UrlSegment[]): Observable<boolean> => {
    return checkAuthStatus();
};


const checkAuthStatus = ()  => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuthentication()
  .pipe(
    tap(isAuthenticated => {

      if (!isAuthenticated) {
        router.navigate(['./auth/login']);  
      }
    })

  );
}


// @Injectable()
// class UserToken {}
// @Injectable()
// class PermissionsService {
//   canActivate(currentUser: UserToken, userId: string): boolean {
//     return true;
//   }
//   canMatch(currentUser: UserToken): boolean {
//     return true;
//   }
// }
// const canActivateTeam: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot,
// ) => {
//   return inject(PermissionsService).canActivate(inject(UserToken), route.params['id']);
// };
