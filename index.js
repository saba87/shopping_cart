const shoppingButton =document.querySelector('.shopping-cart');
const backDrop=document.querySelector('.backdrop');
const contentSection=document.querySelector('.content');
const cartCounter=document.querySelector('.cart-counter');
const totalPrice=document.querySelector('.total-price');
const cartItems=document.querySelector('.cart-items');
const clearButton=document.querySelector('.cart-clear');
const confirmed=document.querySelector('.cart-confirmed');


let cart=[];
import { productsData } from "./products.js ";
//1.get product
class Products{

    getProducts(){
        return productsData;
    }

}
//2.get ui
class Ui{
  displayProducts(Products){
      let result='';
      Products.forEach((item)=>{
          result+=`<div id=${item.id} class="item">
               
          <img src=${item.src} alt="">
       
       <div class="decription">
           <div class="item-price">${item.price}</div>
           <div class="item-name">${item.name}</div>
       </div>
       <button type="submit" class="add-to-cart" id=${item.id}>
          add to cart
       </button>
   </div>`;
   contentSection.innerHTML=result;
      })
  }
  getAddToButtons(){
      const addButtons=document.querySelectorAll('.add-to-cart');
      const addButtonsArray=[...addButtons];
      addButtonsArray.forEach((btn)=>{
          const btnId=btn.id;
          cart=Storage.getCart();
          const isInCart=cart.find((item)=>item.id === btnId);
          if(isInCart){
              btn.textContent='In cart';
              btn.disabled=true;
          }

          btn.addEventListener('click',(e)=>{
             e.target.textContent="In cart";
             e.target.disabled=true;
             const searchProduct=Storage.getData(e.target.id);
              cart=[...cart,{...searchProduct,quantity:1}];
              Storage.saveCart(cart);
              //changing total price and cartcounter
              const findedProduct={...searchProduct,quantity:1};
              
              this.setCartValue(cart);
              this.addCartItem(findedProduct);
              this.removeItem();
              
          })
        
      })
  }
 setCartValue(cart){
     let counter=0;
    const total= cart.reduce((p,c)=>{
         counter+=c.quantity;
         return p + c.price * c.quantity;
     },0);
     cartCounter.textContent=counter;
     totalPrice.textContent=`total price is : ${total.toFixed(2)}$`;
 }
 addCartItem(cartItem){
     const div=document.createElement('div');
     div.classList.add('cart-item');
     div.innerHTML=` <img class="cart-image" src=${cartItem.src}>
     <div class="description-item" >
         <div class="cart-price">${cartItem.price}$</div>
         <div class="cart-name">${cartItem.name}</div>
     </div>
     <div class="cart-up-down"><i class="fa fa-chevron-up" data-id="${cartItem.id}" aria-hidden="true"></i><span class="counter">${cartItem.quantity}</span><i class="fa fa-chevron-down" data-id="${cartItem.id}" aria-hidden="true"></i></div>
     <div class="trash"><i class="fa fa-trash-alt" data-id="${cartItem.id}" aria-hidden="true"></i></div>`
      cartItems.appendChild(div);
     
    
 }
 setUpApp(){
     Storage.getCart().forEach((cartitem)=>{
         this.addCartItem(cartitem);
     });
     this.setCartValue(Storage.getCart());
 }
 removeItem(cart){
   const trashes= [...cartItems.querySelectorAll('.fa-trash-alt')];
   
   trashes.forEach((t)=>{
       t.addEventListener('click',(e)=>{
           const parent=e.target.parentElement.parentElement;
           const itemId=e.target.dataset.id;
           Storage.removeItemCart(itemId);
            parent.remove();
            cart=Storage.getCart();
            this.setCartValue(cart);
            const addButtons=document.querySelectorAll('.add-to-cart');
            const addButtonsArray=[...addButtons];
            addButtonsArray.forEach((btn)=>{
              if(btn.id === itemId){
                btn.textContent='add to cart'
                btn.disabled=false;
              }  
              
            })

       })
   })

 }
logicCart(){
    cartItems.addEventListener('click',(e)=>{
        const itemId=e.target.dataset.id;
        const counter=e.target.nextSibling;
        const counterBefor=e.target.previousElementSibling
        
        if(e.target.classList.contains('fa-chevron-up')){
           
           const i=cart.find(p=> p.id===itemId);
           i.quantity++;
           this.setCartValue(cart);
           Storage.saveCart(cart);
           counter.textContent=i.quantity;

        }
        else if(e.target.classList.contains('fa-chevron-down')){
           
            const i=cart.find(p=> p.id===itemId);
            if(i.quantity ==1){
               const parent=e.target.parentElement.parentElement;
               parent.remove();
               Storage.removeItemCart(itemId);
               cart=Storage.getCart();
               this.setCartValue(cart);
               this.findAddbutton(itemId);
           
            }else{
            i.quantity--;
            this.setCartValue(cart);
            Storage.saveCart(cart);
            counterBefor.textContent=i.quantity;
            }
 
         }
    })
}
 
 clearButton(){
    clearButton.addEventListener('click',()=>{
        cartItems.replaceChildren();
        cart=[];
        const ui=new Ui();
        ui.setCartValue(cart);
        Storage.deleteCart();
        const addButtons=document.querySelectorAll('.add-to-cart');
         const addButtonsArray=[...addButtons];
         addButtonsArray.forEach((btn)=>{
                    btn.textContent='add to cart'
                    btn.disabled=false; 
     });
     backDrop.style.transform="translateY(-100vh)";
     const content=document.querySelector('.cart-container');
     content.style.display='none';
     
 });

}   

 
 findAddbutton(itemId){
    const addButtons=document.querySelectorAll('.add-to-cart');
    const addButtonsArray=[...addButtons];
    addButtonsArray.forEach((btn)=>{
      if(btn.id === itemId){
        btn.textContent='add to cart'
        btn.disabled=false;
      }  
      
    })

 }


}

//3.storage
class Storage{
   static saveData(products){
       localStorage.setItem('products',JSON.stringify(products));
   }
   static getData(productId){
       const _product=JSON.parse(localStorage.getItem('products'));
      return( _product.find((p)=>p.id=== productId));  
   }
   static saveCart(cart){
       localStorage.setItem('cart',JSON.stringify(cart));
   }
   static getCart(){
        cart=JSON.parse(localStorage.getItem('cart'))|| [];
        return cart;
       
   }
   static removeItemCart(itemId){
       cart=JSON.parse(localStorage.getItem('cart'))|| [];
      const newCart= cart.filter((p)=>p.id !== itemId);
       localStorage.setItem('cart',JSON.stringify(newCart));
   }
   static deleteCart(){
    localStorage.removeItem('cart');
     
   }
}


document.addEventListener('DOMContentLoaded',()=>{
   const newproducts=new Products();
   const products=newproducts.getProducts(); 
   const ui=new Ui();
   ui.displayProducts(products);
   ui.getAddToButtons();
   ui.setUpApp();
   ui.removeItem();
   ui.logicCart();
   ui.clearButton();
  
  
   
   
   

   Storage.saveData(products);
  
})

shoppingButton.addEventListener('click',showCart);


confirmed.addEventListener('click',()=>{
    backDrop.style.transform="translateY(-100vh)";
    const content=document.querySelector('.cart-container');
    content.style.display='none';

})

function closecart(){
    backDrop.style.transform="translateY(-100vh)";
    const content=document.querySelector('.cart-container');
    content.style.display='none';
}

function showCart(){
    backDrop.style.transform="translateY(100vh)";
    const content=document.querySelector('.cart-container');
    content.style.display='flex';
    
    
   
};


