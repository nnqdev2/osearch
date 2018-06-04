import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DeqOffice } from '../models/deq-office';
import { LustDataService } from '../service/lust-data.service';

@Injectable()
export class DeqOfficesResolver implements Resolve<Observable<DeqOffice[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DeqOffice[]> {
    return this.lustDataService.getDeqOffices();
  }
}
