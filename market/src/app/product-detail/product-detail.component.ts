import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product.service";
import { NotifierService } from '../services/notifier.service';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productID: any;
  productData: any;
  versions: any;
  currentPrice: any;
  originalPrice: any;
  quantity: any;
  imageUrl = '';

  constructor(
    private productService: ProductService,
    private notifierService: NotifierService,
    private router: Router,
    private actRoute: ActivatedRoute) { }

  ngOnInit() {
    this.productID = this.actRoute.snapshot.params['id'];
    this.loadProductDetails(this.productID);
  }

  loadProductDetails(productID) {
    // Chưa có api get, giải pháp tạm thời là getAll và lọc trên FE
    this.productService.getPhones().subscribe(
      response => {
        let allData = response.data;
        allData.map(item => {
          if (productID === item._id) {
            this.productData = item;
            this.getPhoneImage(this.productData?.imageName);
            this.versions = this.productData?.versions;
            this.currentPrice = this.versions[0]?.current_price;
            this.originalPrice = this.versions[0]?.original_price;
            this.quantity = this.versions[0]?.quantity;
          }
        });
      },
      error => {
        this.notifierService.showNotification('There was an error in receiving data from server!', 'OK', 'error');
      }
    );
  }

  getPhoneImage(imageName: string) {
    this.imageUrl = environment.API_URL + 'images/phones/' + imageName + '.jpg';
  }

  toShop() {
    this.router.navigate(['/shop']);
  }

  pipePrice(value) {
    let str = value?.toString();
    let res = str?.slice(0, 0 - (str?.length - (str?.length % 3)));
    str = str?.slice(res.length);
    while (str?.length >= 3) {
      let endIndex = 0 - (str?.length - 3);
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

  updatePrice(event) {
    let id: Number = +event.value;
    this.versions.map(item => {
      if (id === item.id) {
        this.currentPrice = item.current_price;
        this.originalPrice = item.original_price;
        this.quantity = item.quantity;
      }
    });
  }

  addToCart() {
    if (localStorage.getItem(this.productID)) {
      let count = Number(localStorage.getItem(this.productID)) + 1;
      localStorage.setItem(this.productID, count.toString());
    } else {
      localStorage.setItem(this.productID, '1');
    }
    this.notifierService.showNotification('Đã thêm sản phẩm vào giỏ hàng', 'OK', 'success');
  }

}

