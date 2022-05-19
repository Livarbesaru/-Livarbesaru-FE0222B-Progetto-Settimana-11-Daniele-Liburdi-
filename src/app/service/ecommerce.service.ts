import { Injectable } from '@angular/core';
import { Smartphone } from '../smartphone';
import { HttpClient } from '@angular/common/http';
import { MarketCount } from '../market-count';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/* variables */
export class EcommerceService {
  linkPhone:string='http://localhost:4201'
  arrayMarket!:Smartphone[]
  cart:Smartphone[]=[]
  tot:number=0
  sub!:Subscription
  marketCount:MarketCount[]=[]
  onOff:boolean=false
  check!:boolean

  constructor(private http:HttpClient) { }

  /* this function need to take all the market products and keep them in an array */
  setMarket(arrayPhone:Smartphone[]){
      this.arrayMarket=arrayPhone
      this.setMarketCount(false)
  }

  /* this function do a sort of clone from the market array taking only the products names and adding a count to it, needed to calculate
  how much product of the same type the client added */
  setMarketCount(expt:boolean){
    if(expt===true){
      this.marketCount=[]
      for(let i=this.arrayMarket.length;i--;i>-1){
        this.marketCount.push({name:this.arrayMarket[i].name.trim(),count:0})
      }
    }
    else{
      if(this.marketCount.length===0){
        for(let i=this.arrayMarket.length;i--;i>-1){
          this.marketCount.push({name:this.arrayMarket[i].name.trim(),count:0})
        }
      }
    }
  }

  /* returned countable array */
  getMarketcount(){
    return this.marketCount
  }

  /* all the products gets taken from db.json*/
  getPhones(){
   return this.http.get<Smartphone[]>(this.linkPhone+'/products')
  }

  /* single product get taken */
  getPhoneProduct(id:number){
    return this.http.get<Smartphone>(this.linkPhone+'/products'+'/'+id)
  }

  /* a bundle of response,the first give back the cart the user is filling, while the second is the total amount he is spending */
  getCart(){
  return [this.cart,this.tot]
  }

  /* function used to calculate the total amount of money to pay based on the type of products and their respective amounts */
  countTot(){
    this.tot=0
    for(let i=(this.cart.length);i--;i>-1){
      for(let b=(this.marketCount.length);b--;b>-1){
        if(this.cart[i].name.trim()===this.marketCount[b].name.trim()){
          this.tot+=(this.cart[i].price*this.marketCount[b].count)
        }
      }
    }
  }

  /* last step of sorting items in case the principals 2 ways don't fill the requirments */
  elseSort(obj:Smartphone){
    let val=this.marketCount.findIndex(x=>x.name.trim()===obj.name.trim())
      if(obj.name.trim()===this.marketCount[val].name.trim()){
          this.marketCount[val].count+=1
          this.cart.push(obj)
      }
    this.countTot()
  }

  /* first step of sorting items*/
  sortingCart(obj:Smartphone){
    this.check=false
    if(this.cart.length===0){
      this.check=true
      for(let i=(this.marketCount.length);i--;i>-1){
        if(obj.name.trim()===this.marketCount[i].name.trim()){
          this.marketCount[i].count+=1
        }
      }
      this.cart.push(obj)
        this.countTot()
    }
    else if(this.cart.length>0){
      for(let i=this.cart.length;i--;i>=0){
        if(obj.name.trim()===this.cart[i].name.trim()){
          this.check=true
          for(let c=(this.marketCount.length);c--;c>=0){
            if(this.cart[i].name.trim()===this.marketCount[c].name.trim()){
              this.check=true
              this.marketCount[c].count+=1
            }
          }
        }
      }
        this.countTot()
        console.log(this.check)
    }
    if(this.check===false){
      this.elseSort(obj)
    }
  }

  //return status of adding item to cart for turning of buttons
  onOffstatus(){
    return this.onOff
  }

  /* the single product get added to the cart*/

  addProductCart(id:number){
    return new Promise<boolean>(()=>{
     this.http.get<Smartphone>(this.linkPhone+'/products'+'/'+id).subscribe((Obj)=>{
        this.tot=0
        this.sortingCart(Obj)
      })
    })
  }

  /* the product or their respective amount get diminished based on the amount quantity */
  deleteProduct(product:string){
    if(this.cart.length>0){
      for(let i=(this.marketCount.length);i--;i>=0){
        if(product.trim()===this.marketCount[i].name.trim()){
          if(this.marketCount[i].count<=1){
            let pos=this.cart.findIndex(x=>x.name.trim()===product.trim())
            this.cart.splice(pos,1)
          }
          else if(this.marketCount[i].count>1){
            this.marketCount[i].count!-=1
          }
        }
      }
      this.countTot()
    }
    else{
      let pos=this.cart.findIndex(x=>x.name===product)
      this.cart.splice(pos,1)
      this.countTot()
    }
  }

  /* after the purchase all the cart gets a reset */
  clearCart(){
    this.cart=[]
    this.setMarketCount(true)
  }
}
