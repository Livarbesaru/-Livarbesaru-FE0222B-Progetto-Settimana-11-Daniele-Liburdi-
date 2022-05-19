import { Component, OnInit, OnChanges } from '@angular/core';
import { EcommerceService } from 'src/app/service/ecommerce.service';
import { Smartphone } from 'src/app/smartphone';
import { Subscription } from 'rxjs';
import { MarketCount } from 'src/app/market-count';
import { compileDeclareFactoryFunction } from '@angular/compiler';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  sort!:(number|Smartphone[])[]
  cart!:Smartphone[]
  tot:number=0
  sub!:Subscription
  arrayMarket:Smartphone[]=[]
  marketCount:MarketCount[]=[]

  constructor(private EcomSrv:EcommerceService) { }

  ngOnInit(): void {
    this.getCart()
  }

  getCart(){
    setInterval(()=>{
      this.EcomSrv.countTot()
      this.sort=this.EcomSrv.getCart()
      this.cart=<Smartphone[]>this.sort[0]
      this.tot=<number>this.sort[1]
      this.marketCount=this.EcomSrv.getMarketcount()
    },500)
  }

  submit(object:any){
    object.value.cart=this.cart
    object.value.cartAmount=this.marketCount.filter(x=>x.count >0)
    if(object.value.name!=''&& object.value.address!='' && object.value.email.trim()!=''){
      alert(`Il tuo ordine è stato preso in consegna`)
      this.EcomSrv.clearCart()
      console.log(object.value)
    }
    else{
      alert('riempi tutti i campi')
    }
  }

  deleteProduct(product:string){
    this.EcomSrv.deleteProduct(product)
  }

}
