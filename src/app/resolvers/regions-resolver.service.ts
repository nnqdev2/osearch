import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { ProjectManager } from '../models/project-manager';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class RegionsResolver implements Resolve<Observable<Region[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Region[]> {
    return this.lustDataService.getRegions();
  }
}
