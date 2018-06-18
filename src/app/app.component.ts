// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'app';
// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  routeLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router) {
    this.routeLinks = [
        {
            label: 'OLPRR Reporting',
            link: '/incident',
            index: 0
        }, {
            label: 'OLPRR Review',
            link: '/osearch',
            index: 1
        }, {
            label: 'LUST Search',
            link: '/lsearch',
            index: 2
        }, {
            label: 'UST Search',
            link: '/usearch',
            index: 3
        }, {
            label: 'LUST',
            link: '/osearch',
            index: 4
        }
    ];
}

ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
}

}
