import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {PropertyService} from './property.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerGuardService implements CanActivate{

  constructor(private router: Router,
              private propertyService: PropertyService,
              private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.GetUserInSession().userType.toUpperCase() === 'BUSINESS'){
      if (this.propertyService.GetPropertyInSession() === null) {
        this.router.navigate(['container/property-list']);
        return false;
      }
    }
    return true;
  }
}
