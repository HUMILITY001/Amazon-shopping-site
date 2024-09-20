import {cart, removeFromCart, updateDeliveryOption} from '../data/cart.js';

import{products} from '../data/products.js';

import{formatCurrency} from './utils/money.js';

import {deliveryOptions} from './utils/DeliveryOption.js';



let cartSummaryHTML = '';

const getCarts = () =>{
  return JSON.parse(window.localStorage.getItem('cart'))
}

const updateCheckoutHeader = () => {
    const carts = getCarts()
  
    const header = document.getElementById('count')
    header.innerHTML = `${carts?.length} item(s)`
  }

window.addEventListener('load', updateCheckoutHeader)

cart.forEach((cartItem) =>{
  const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) =>{
      if (product.id === productId){
      matchingProduct = product;
    }
    });
    
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option)=>{
      if (option.id === deliveryOptionId){
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'Days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML +=`
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link js-delete-link link-primary" data-product-id = ${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>

                      </div>
          </div>
    `;
});


function deliveryOptionHTML(matchingProduct, cartItem){
  let html = '';
  deliveryOptions.forEach((deliveryOption)=> {
    

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'Days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOption.priceCents)} -`

    const ischecked = deliveryOption.id === cartItem.deliveryOptionId;

    html +=`
      <div class="delivery-option  js-delivery-option"
      data-product-id = ${matchingProduct.id}
      data-delivery-option-id = ${deliveryOption.id}
      >
        <input type="radio"

        ${ischecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  });

  return html;
}
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    console.log('clickes')
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    console.log(container)

    container.remove();

    updateCheckoutHeader()

  });
});

document.querySelectorAll('.js-delivery-option').forEach((element)=>{
  element.addEventListener('click', ()=>{
    const productId = element.dataset.productId;
    const deliveryOptionId = element.dataset.deliveryOptionId;
    updateDeliveryOption (productId, deliveryOptionId);
  });
});