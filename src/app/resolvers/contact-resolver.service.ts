import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LustDataService } from '../services/lust-data.service';
import { ContactAffilGet } from '../models/contact-affil-get';

@Injectable({
  providedIn: 'root'
})
export class ContactResolver implements Resolve<Observable<ContactAffilGet>> {
  constructor(private lustDataService: LustDataService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContactAffilGet> {
    console.log('ContactResolverService() +route.parent.paramMap.get');
    console.log(+route.parent.paramMap.get('affilid'));
    console.log(+route.paramMap.get('affilid'));
    return this.lustDataService.getLustContact(+route.paramMap.get('affilid'));
  }
}
