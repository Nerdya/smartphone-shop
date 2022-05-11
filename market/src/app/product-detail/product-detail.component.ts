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
    {name: '128GB', price: '10000000'},
    {name: '256GB', price: '10500000'},
    {name: '512GB', price: '11000000'}
  ];

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
            console.log(this.productData);
          }
        });
      },
      error => {
        this.notifierService.showNotification('There was an error in receiving data from server!', 'OK', 'error');
      }
    );
  }

  getPhoneImage(imageName: string): string {
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

}

