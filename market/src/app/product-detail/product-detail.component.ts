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
  versions: any = [
    {id: 1, name: '128GB', current_price: '10000000', original_price: '12000000'},
    {id: 2, name: '256GB', current_price: '10500000', original_price: '12500000'},
    {id: 3, name: '512GB', current_price: '11000000', original_price: '13000000'}
  ];
  currentPrice = 10000000;
  originalPrice = 12000000;
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
    // this.productService.getProductDetails(productID).subscribe(product => {
    //   this.productData = product;
    // });
    this.productService.getPhones().subscribe(
      response => {
        let allData = response.data;
        allData.map(item => {
          if (productID === item._id) {
            this.productData = item;
            this.getPhoneImage(this.productData?.imageName);
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

  updatePrice(event) {
    let id: Number = +event.value;
    this.versions.map(item => {
      if (id === item.id) {
        this.currentPrice = item.current_price;
        this.originalPrice = item.original_price;
      }
    });
  }

  purchase() {
    alert('Chưa hoàn thiện chức năng!');
  }

}

