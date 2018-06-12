import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SourceType } from '../models/source-type';
import { LustDataService } from '../services/lust-data.service';

@Injectable({
  providedIn: 'root'
})
export class SourceTypesResolver implements Resolve<Observable<SourceType[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SourceType[]> {
    return this.lustDataService.getSourceTypes();
  }
}
