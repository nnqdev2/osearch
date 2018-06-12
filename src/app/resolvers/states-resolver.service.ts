import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { State } from '../models/state';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class StatesResolver implements Resolve<Observable<State[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<State[]> {
    return this.lustDataService.getStates();
  }
}
