import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { ProjectManager } from '../models/project-manager';
import { Region } from '../models/region';
import { TankStatus } from '../models/tank-status';

@Injectable({
  providedIn: 'root'
})
export class TankStatusesResolver implements Resolve<Observable<TankStatus[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TankStatus[]> {
    return this.lustDataService.getTankStatuses();
  }
}
