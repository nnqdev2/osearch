import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {
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
            link: '/osearch',
            index: 2
        }, {
            label: 'UST Search',
            link: '/osearch',
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
      console.log('******************');
      console.log(this.router);

        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
}

}
