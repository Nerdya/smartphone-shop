import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productID: any;
  productData: any;
  constructor(
      private productService: ProductService,
      private router: Router,
      private actRoute: ActivatedRoute) { }

  ngOnInit() {
    this.productID = this.actRoute.snapshot.params['id'];
    this.loadProductDetails(this.productID);
  }

  loadProductDetails(productID){
    // this.productService.getProductDetails(productID).subscribe(product => {
    //   this.productData = product;
    // });
    console.log(productID);
  }

  navigation(link){
    this.router.navigate([link]);
  }

}

