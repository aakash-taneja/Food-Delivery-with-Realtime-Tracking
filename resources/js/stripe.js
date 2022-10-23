import axios from 'axios'
 import Noty from 'noty'
 import {loadStripe} from '@stripe/stripe-js';
 import {placeOrder} from './apiService'

export async function initStripe(){
    const stripe = await loadStripe('pk_test_51HibeqLJ3XGEsnynMCX03xAk6tD6EMVJvjQrS4cCefHkHNzP70fycsJc5eocar1LcAxWKjTRJJJqNfDGktmB2KTj000Z60YE3d');
    let card=null;
    function initMount(){
        const elements=stripe.elements();

        card=elements.create('card',{style:{},hidePostalCode:true})
        card.mount('#card-element')
    }
    const paymentType=document.querySelector('#paymentType')

    if(paymentType){
        paymentType.addEventListener('change',(e)=>{
            if(e.target.value === 'card'){
                //display Widget
                initMount();
                
            }else{
                card.destroy();
            }
        })
    }

   


    //Ajax call
    const paymentForm=document.querySelector("#payment-form");
    if(paymentForm){

    paymentForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formData=new FormData(paymentForm);
    
        let formObject={}
        for(let [key,value] of formData.entries()){
            formObject[key]=value;
        }

        //Cash on delivery
        if(!card){
            placeOrder(formObject);
            return;
        }

        // Verify Card
        stripe.createToken(card).then((result)=>{
            formObject.stripeToken=result.token.id;
            placeOrder(formObject);
        }).catch((error)=>{
            console.log(error);
        })


    
       
    })
}

}