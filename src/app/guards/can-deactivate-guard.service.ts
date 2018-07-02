import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    console.log(' CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate>');
    console.log(component.canDeactivate);
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}