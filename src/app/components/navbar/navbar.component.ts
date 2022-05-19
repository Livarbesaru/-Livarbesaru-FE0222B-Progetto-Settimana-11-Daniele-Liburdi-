import { Component, OnInit } from '@angular/core';
import { EcommerceService } from 'src/app/service/ecommerce.service';
import { Smartphone } from 'src/app/smartphone';
import { MarketCount } from 'src/app/market-count';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  sortArray:(number | Smartphone[])[]=[]
  cart!:Smartphone[]
  numberList!:number
  marketCount:MarketCount[]=[]
  numberCount:number=0
  arrayPhone:Smartphone[]=[]
  sub!:Subscription

  constructor(private EcomSrv:EcommerceService) { }

  ngOnInit(): void {
    this.getCart()
  }

  getCart(){
    this.sub = this.EcomSrv.getPhones().subscribe(arrayPhone=>{
      this.arrayPhone=arrayPhone
    })
    setInterval(()=>{
      this.EcomSrv.setMarket(this.arrayPhone)
      this.sortArray=this.EcomSrv.getCart()
      this.cart=<Smartphone[]>this.sortArray[0]
      this.marketCount=this.EcomSrv.getMarketcount()
      this.checkNumber()
    },1000)
  }

  checkNumber(){
    this.numberCount=0
    if(this.cart.length>=1){
      for(let i=(this.cart.length);i--;i>=0){
        for(let b=(this.marketCount.length);b--;b>=0){
          if(this.cart[i].name.trim()===this.marketCount[b].name.trim()){
            this.numberCount+=(1*this.marketCount[b].count)
          }
        }
      }
    }
  }

}
