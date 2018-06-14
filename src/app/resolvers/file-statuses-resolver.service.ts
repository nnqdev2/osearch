import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LustDataService } from '../services/lust-data.service';
import { Observable } from 'rxjs';
import { FileStatus } from '../models/file-status';

@Injectable({
  providedIn: 'root'
})
export class FileStatusesResolver implements Resolve<Observable<FileStatus[]>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FileStatus[]> {
    return this.lustDataService.getFileStatuses();
  }
}
