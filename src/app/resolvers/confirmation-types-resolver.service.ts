import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmationType } from '../models/confirmation-type';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationTypesResolver implements Resolve<Observable<ConfirmationType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ConfirmationType[]> {
    return this.lustDataService.getConfirmationTypes();
  }
}
