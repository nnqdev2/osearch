import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { ProjectManager } from '../models/project-manager';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagersResolver implements Resolve<Observable<ProjectManager[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProjectManager[]> {
    return this.lustDataService.getProjectManagers();
  }
}
