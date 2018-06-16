import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { ProjectManager } from '../models/project-manager';
import { ZipCode } from '../models/zipcode';

@Injectable({
  providedIn: 'root'
})
export class ZipCodesResolver implements Resolve<Observable<ZipCode[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ZipCode[]> {
    return this.lustDataService.getZipCodes();
  }
}
