import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';
import { NotifierService } from '../services/notifier.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
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

  constructor(
    private breakpointObserver: BreakpointObserver,
    public productService: ProductService,
    private notifierService: NotifierService,
    private router: Router) { }

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

    this.productService.getPhones().subscribe(
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
    return environment.API_URL + 'images/phones/' + imageName + '.jpg';
  }

  getImage(imageName: string): string {
    return 'url(' + environment.API_URL + 'images/' + imageName + '.jpg' + ')';
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

  viewPhone(id) {
    this.router.navigate(['/shop/' + id]);
  }
}
