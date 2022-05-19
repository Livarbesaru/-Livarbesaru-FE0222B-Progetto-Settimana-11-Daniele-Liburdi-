import { Component, OnInit } from '@angular/core';
import { EcommerceService } from '../../service/ecommerce.service';
import { Subscription } from 'rxjs';
import { Smartphone } from 'src/app/smartphone';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  arrayPhone!:Smartphone[]
  sub!:Subscription
  offOn!:boolean


  constructor(private EcomSrv:EcommerceService) { }

  ngOnInit():void{
    this.sub = this.EcomSrv.getPhones().subscribe(arrayPhone=>{
      this.EcomSrv.setMarket(arrayPhone)
      this.arrayPhone=arrayPhone
    })
  }

  addCart(id:number){
    this.offOn=true
    this.EcomSrv.addProductCart(id)
    setTimeout(()=>{
      this.offOn=this.EcomSrv.onOffstatus()
    },500)
  }

  ngOnChanges(){
    this.sub.unsubscribe()
  }

}
