import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LustDataService } from '../services/lust-data.service';
import { ContactAffilGet } from '../models/contact-affil-get';

@Injectable({
  providedIn: 'root'
})

export class LustContactResolver implements Resolve<Observable<ContactAffilGet>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContactAffilGet> {
    let lustId = +route.parent.params['lustid'];
    if (isNaN(lustId)) {
      lustId = +route.pathFromRoot[2].params['lustid'];
    }
    return this.lustDataService.getLustContact(lustId);
  }
}