import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { EcommerceService } from 'src/app/service/ecommerce.service';
import { Smartphone } from 'src/app/smartphone';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  sub!:Subscription
  id!:number
  product!:Smartphone
  offOn!:boolean

  constructor(private EcomSrv:EcommerceService,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.router.params.subscribe((params: Params) =>{
      this.id = +params['id'];
      this.EcomSrv.getPhoneProduct(this.id).subscribe((product)=>{
        this.product=product
      })
    });
  }

  addCart(id:number){
    this.offOn=true
    this.EcomSrv.addProductCart(id)
    setTimeout(()=>{
      this.offOn=this.EcomSrv.onOffstatus()
    },500)
  }

}
