import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { NotifierService } from '../notifier.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = [];
  rowspan = 1;
  colspan = 1;
  // cardsForHandset = [];
  // cardsForWeb = [];

  isHandset: boolean = false;
  isHandsetObserver: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true;
      }
      return false;
    })
  );

  constructor(private breakpointObserver: BreakpointObserver,
    public appService: AppService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    console.log(this.pipePrice(1000000));
    this.isHandsetObserver.subscribe(currentObserverValue => {
      this.isHandset = currentObserverValue;
      if (this.isHandset) {
        this.rowspan = this.colspan = 2;
      } else {
        this.rowspan = this.colspan = 1;
      }
      // this.loadCards();
    });

    this.appService.getDeals().subscribe(
      response => {
        this.cards = response.data;
        // this.cardsForHandset = response.handsetCards;
        // this.cardsForWeb = response.webCards;
        // this.loadCards();
        // this.notifierService.showNotification('Todays deals loaded successfully. Click on any deal!', 'OK', 'success');
      },
      error => {
        // alert('There was an error in receiving data from server. Please come again later!');
        this.notifierService.showNotification('There was an error in receiving data from server!', 'OK', 'error');
      }
    );
  }

  // loadCards() {
  //   this.cards = this.isHandset ? this.cardsForHandset : this.cardsForWeb;
  // }

  getPhoneImage(imageName: string): string {
    return 'http://localhost:3000/images/phones/' + imageName + '.jpg';
  }

  getImage(imageName: string): string {
    return 'url(' + 'http://localhost:3000/images/' + imageName + '.jpg' + ')';
  }

  pipePrice(value) {
    let str = value.toString();
    let res = str.slice(0, 0 - (str.length - (str.length % 3)));
    str = str.slice(res.length);
    while (str.length >= 3) {
      let endIndex = 0 - (str.length - 3);
      if (endIndex === 0) {
        res += '.' + str.slice(0);
      } else {
        res += '.' + str.slice(0, endIndex);
      }
      str = str.slice(3);
    }
    res += ' ₫';
    return res;
  }
}
