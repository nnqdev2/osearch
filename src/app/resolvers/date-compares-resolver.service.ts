import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { DateCompare } from '../models/date-compare';

@Injectable({
  providedIn: 'root'
})
export class DateComparesResolver implements Resolve<Observable<DateCompare[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DateCompare[]> {
    return this.lustDataService.getDateCompares();
  }
}
