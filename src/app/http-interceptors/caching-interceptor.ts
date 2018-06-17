import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHeaders, HttpRequest, HttpResponse,
  HttpInterceptor, HttpHandler
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { RequestCache } from '../services/request-cache.service';
import { environment } from '../../environments/environment';

/**
 * If request is cachable (e.g., package search) and
 * response is in cache return the cached response as observable.
 * If has 'x-refresh' header that is true,
 * then also re-run the package search, using response from next(),
 * returning an observable that emits the cached response first.
 *
 * If not in cache or not cachable,
 * pass request through to next()
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!isCachable(req)) { return next.handle(req); }
    console.log('******req.url is cacheable');
    const cachedResponse = this.cache.get(req);
    console.log(cachedResponse);
    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = sendRequest(req, next, this.cache);
      return cachedResponse ?
        results$.pipe( startWith(cachedResponse) ) :
        results$;
    }
    // cache-or-fetch
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}


/** Is this request cachable? */
function isCachable(req: HttpRequest<any>) {
  console.log('******IS cacheable req.url');
  console.log(req.url);
  return (req.method === 'GET') &&
  (-1 < req.url.indexOf(environment.olprrapi_confirmationtype)
  || -1 < req.url.indexOf(environment.olprrapi_sitetype)
  || -1 < req.url.indexOf(environment.olprrapi_discoverytype)
  || -1 < req.url.indexOf(environment.olprrapi_streettype)
  || -1 < req.url.indexOf(environment.olprrapi_county)
  || -1 < req.url.indexOf(environment.olprrapi_state)
  || -1 < req.url.indexOf(environment.olprrapi_sourcetype)
  || -1 < req.url.indexOf(environment.olprrapi_releasecausetype)
  || -1 < req.url.indexOf(environment.olprrapi_deqoffice)
  || -1 < req.url.indexOf(environment.olprrapi_incidentstatus)
  || -1 < req.url.indexOf(environment.olprrapi_datecompare)
  || -1 < req.url.indexOf(environment.olprrapi_region)
  || -1 < req.url.indexOf(environment.olprrapi_cleanupsitetype)
  || -1 < req.url.indexOf(environment.olprrapi_filestatus)
  || -1 < req.url.indexOf(environment.olprrapi_tankstatus)
  || -1 < req.url.indexOf(environment.olprrapi_city)
  || -1 < req.url.indexOf(environment.olprrapi_projectmanager)
  || -1 < req.url.indexOf(environment.olprrapi_zipcode)
  );
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache): Observable<HttpEvent<any>> {

  // No headers allowed in npm search request
  // const noHeaderReq = req.clone({ headers: new HttpHeaders() });
  // const noHeaderReq = req.clone({ headers: new HttpHeaders() });

  return next.handle(req).pipe(
    tap(event => {
      console.log('****in tap');
      console.log(req.url);
      console.log(event);
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        console.log('****in tap about to update cache');
        console.log(req.url);
        console.log(event);
        cache.put(req, event); // Update the cache.
        console.log(cache);
      }
    })
  );
}

