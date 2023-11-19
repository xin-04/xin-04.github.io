let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close')
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct')
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

//adding products 
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProduct.length > 0){
        listProduct.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="price">RM${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
        })
    }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    //cart empty
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            qty: 1
        }];
    //add new item in non-empty cart
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            qty: 1
        });
    //item alr exists
    }else{
        carts[positionThisProductInCart].qty = carts[positionThisProductInCart].qty + 1;  
    }
    console.log(carts);
    addCartToHTML();
    addCartToMemory();
}

//store cart data in local storage
const addCartToMemory = () => {
    //local does not store array
    localStorage.setItem('cart', JSON.stringify(carts));
}

//adding items in carts
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.qty;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            //plus & minus btn
            newCart.dataset.id = cart.product_id;
            //to locate data by finding index
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            if (positionProduct !== -1) {
            let info = listProduct[positionProduct];
            newCart.innerHTML = 
            `<div class="image">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">${info.title}</div>
            <div class="total-price">RM${info.price * cart.qty}</div>
            <div class="qty">
                <span class="minus"><</span>
                <span>${cart.qty}</span>
                <span class="plus">></span>
            </div>`;
            listCartHTML.appendChild(newCart);
            }else{
                console.error(`Product with ID ${cart.product_id} not found.`);
            }
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

//make plus & minus btn in cart usable
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        //default
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQty(product_id, type);
    }
})

const changeQty = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch(type){
            case 'plus':
                carts[positionItemInCart].qty = carts[positionItemInCart].qty + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].qty - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].qty = valueChange;
                }else{
                    //delete item in cart with splice
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const checkout = () => {
    localStorage.clear();
    alert("Thank you for your purchase!");
    location.reload();
}

const initApp = () => {
    //fetch data from json
    fetch('js/art.json')
    .then(response => response.json())
    .then(data => {
        listProduct = data;
        console.log(listProduct);
        addDataToHTML();
        
        //get cart from memory
        if(localStorage.getItem('cart')){
            //convert str to json
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}

initApp();

