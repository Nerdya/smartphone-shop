import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product.service";
import { NotifierService } from '../services/notifier.service';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productList: any;
  cart: any = [];

  constructor(
    private productService: ProductService,
    private notifierService: NotifierService,
    private router: Router,
    private actRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadProductList();
  }

  loadProductList() {
    // Chưa có api get, giải pháp tạm thời là getAll và lọc trên FE
    this.productService.getPhones().subscribe(
      response => {
        this.productList = response.data;
        this.loadCartItems();
      },
      error => {
        this.notifierService.showNotification('There was an error in receiving data from server!', 'OK', 'error');
      }
    );
  }

  loadCartItems() {
    this.productList.map(res => {
      if (localStorage.getItem(res._id)) {
        let item = res;
        item['purchase'] = Number(localStorage.getItem(res._id));
        this.cart.push(item);
      }
    });
  }

  getPhoneImage(imageName: string) {
    return environment.API_URL + 'images/phones/' + imageName + '.jpg';
  }

  toShop() {
    this.router.navigate(['/shop']);
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

  calcPrice(item) {
    return item.purchase * item.versions[0].current_price;
  }

  increase(item) {
    item.purchase++;
  }

  decrease(item) {
    if (item.purchase > 0) {
      item.purchase--;
    }
  }

  remove(item) {
    this.cart.
    localStorage.removeItem(item._id);
  }

  purchase() {
    this.notifierService.showNotification('Đã xác nhận thanh toán', 'OK', 'success');
  }

}

