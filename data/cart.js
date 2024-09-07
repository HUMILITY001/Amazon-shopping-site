export const cart = [];

export function addToCart(productId){

    let matchingItem;

        cart.forEach((cartItem) =>{
            if(productId === cartItem.productId){
                matchingItem = cartItem;
            }
        });

        const quantitySeletor = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantityValue = quantitySeletor.value;
        const quantity = Number(quantityValue);

        

        if(matchingItem){
            matchingItem.quantity += quantity;
        }else{
            cart.push({
                productId: productId,
                quantity: quantity
            });
        }
}