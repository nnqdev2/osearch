import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { Brownfield } from '../models/brownfield';

@Injectable({
  providedIn: 'root'
})
export class BrownfieldsResolver implements Resolve<Observable<Brownfield[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Brownfield[]> {
    return this.lustDataService.getBrownfields();
  }
}