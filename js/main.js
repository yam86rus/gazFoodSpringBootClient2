'use strict';
const urlCafeterias = 'http://169.168.9.136:8077/api/cafeterias';
const urlDishes = 'http://169.168.9.136:8077/api/trololo/';
const urlOrders = 'http://169.168.9.136:8077/api/orders';

const cartButton = document.querySelector("#cart-button"),
    modal = document.querySelector(".modal"),
    close = document.querySelector(".close"),
    buttonAuth = document.querySelector(".button-auth"),
    modalAuth = document.querySelector(".modal-auth"),
    closeAuth = document.querySelector(".close-auth"),
    logInForm = document.querySelector("#logInForm"),
    loginInput = document.querySelector("#login"),
    userName = document.querySelector(".user-name"),
    buttonOut = document.querySelector(".button-out"),
    buttonOrder = document.querySelector(".button-order"),
    cardsRestaurants = document.querySelector(".cards-restaurants"),
    containerPromo = document.querySelector(".container-promo"),
    restaurants = document.querySelector(".restaurants"),
    menu = document.querySelector(".menu"),
    logo = document.querySelector(".logo"),
    cardsMenu = document.querySelector(".cards-menu"),
    restaurantTitle = document.querySelector(".restaurant-title"),
    rating = document.querySelector(".rating"),
    minPrice = document.querySelector(".price"),
    category = document.querySelector(".category"),
    inputSearch = document.querySelector(".input-search"),
    modalBody = document.querySelector(".modal-body"),
    modalPrice = document.querySelector(".modal-pricetag"),
    buttonClearCart = document.querySelector(".clear-cart");


let login = localStorage.getItem("logName");

const cart = JSON.parse(localStorage.getItem("allCart")) || [];

const saveCart = function () {
    localStorage.setItem("allCart", JSON.stringify(cart));
}

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url},
			статус ошибки ${response, status}`);
    }
    return await response.json();

}


const validName = function (str) {
    // const nameReg = /^[а-яА-Я][a-zA-z0-9-_\.]{1,20}$/;
    const nameReg = /^[а-яА-я][а-яА-я0-9-_\.]{1,20}$/;
    return nameReg.test(str);
};


function toggleModal() {
    modal.classList.toggle("is-open");
}


function toggleModalAuth() {
    loginInput.style.borderColor = "";
    modalAuth.classList.toggle('is-open');
}


function returnMain() {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
}


function returnRestaurants() {
    cardsMenu.textContent = "";
    containerPromo.classList.add("hide");
    restaurants.classList.add("hide");
    menu.classList.remove("hide");
}


function authorized() {

    function logOut() {
        login = null;
        localStorage.removeItem("logName");

        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        cartButton.style.display = "";
        buttonOut.removeEventListener("click", logOut);
        checkAuth();
        returnMain();
    }

    console.log("Авторизован");

    userName.textContent = login;

    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "flex";
    cartButton.style.display = "flex";

    buttonOut.addEventListener("click", logOut);

}


function notAuthorized() {
    console.log("не авторизован");

    function logIn(event) {
        event.preventDefault();
        login = (loginInput.value).trim();

        if (!validName(login)) {
            event.preventDefault();
            loginInput.style.borderColor = "red";
        } else {

            localStorage.setItem("logName", login);

            toggleModalAuth();
            buttonAuth.removeEventListener("click", toggleModalAuth);
            closeAuth.removeEventListener("click", toggleModalAuth);
            logInForm.removeEventListener("submit", logIn);
            checkAuth();
        }

    }

    buttonAuth.addEventListener("click", toggleModalAuth);
    closeAuth.addEventListener("click", toggleModalAuth);
    logInForm.addEventListener("submit", logIn);
}


function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}


function createCardRestaurant({
                                  id, image, kitchen, name, price, stars,
                                  products, timeOfDelivery: timeOfDelivery
                              }) {

    const card = document.createElement("a");
    card.className = "card card-restaurant";
    card.products = products;
    card.id = id;
    card.info = [name, price, stars, kitchen];

    card.insertAdjacentHTML("beforeend", `
		<img src="${image}" alt="${name}" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title">${name}</h3>
				<span class="card-tag tag">${timeOfDelivery} мин</span>
			</div>
			<div class="card-info">
				<div class="rating">
					${stars}
				</div>
<!--				<div class="price">От ${price} ₽</div>-->
				<div class="price">От ${price}</div>
				<div class="category">${kitchen}</div>
			</div>
		</div>
	`);
    cardsRestaurants.insertAdjacentElement("beforeend", card);
}


function createCardGood({description, image, name, price, id, cafeteriaId}) {
    const card = document.createElement("div");
    card.className = "card";

    card.insertAdjacentHTML("beforeend", `
		<img src="${image}" alt="${name}" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
				<div style="display: none" class="card-cafeteriaId">${cafeteriaId}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart" id="${id}">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price card-price-bold">${price} ₽</strong>
<!--				<strong class="card-price card-price-bold">${price}</strong>-->
			</div>
		</div>
	`);

    cardsMenu.insertAdjacentElement("beforeend", card);
}


function openGoods(event) {
    const target = event.target;

    if (login) {

        const restaurant = target.closest(".card-restaurant");

        if (restaurant) {

            const [name, price, stars, kitchen] = restaurant.info;

            returnRestaurants();

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `От ${price} Р`;
            category.textContent = "";

            // getData(`./db/${restaurant.id}`).then(function(data) {
            // sendRequest('GET',urlDishes+`${restaurant.id}`)
            // getData(sendRequest('GET','http://localhost:8077/api/trololo/1'+`${restaurant.id}`)).then(function(data) {
            getData(urlDishes + `${restaurant.id}`).then(function (data) {
                data.forEach(createCardGood);
            });
        }

    } else {
        toggleModalAuth();
    }

}


function searchAllGoods(event) {
    if (event.keyCode == 13) {
        const target = event.target;

        const value = target.value.toLowerCase().trim();

        if (!value || value.length < 3) {
            target.style.backgroundColor = "red";
            setTimeout(function () {
                target.style.backgroundColor = "";
            }, 2000);
            return;
        }

        target.value = "";

        const goods = [];

        getData("./db/partners.json")
            .then(function (data) {
                const products = data.map(function (item) {
                    return item.products;
                });

                products.forEach(function (product) {
                    getData(`./db/${product}`)
                        .then(function (data) {
                            goods.push(...data);

                            const searchGoods = goods.filter(function (item) {
                                return item.name.toLowerCase().includes(value);
                            });

                            returnRestaurants();

                            restaurantTitle.textContent = "Результат поиска";
                            rating.textContent = "";
                            minPrice.textContent = "";
                            category.textContent = "";

                            return searchGoods;

                        })
                        .then(function (data) {
                            data.forEach(createCardGood);
                        });
                });
            });

    }
}


function addToCart(event) {
    const target = event.target;

    const buttonAddToCard = target.closest(".button-add-cart");

    if (buttonAddToCard) {
        const card = target.closest(".card");
        const title = card.querySelector(".card-title-reg").textContent;
        const cost = parseFloat(card.querySelector(".card-price").textContent);
        const cafeteriaId = parseInt(card.querySelector(".card-cafeteriaId").textContent);
        const id = buttonAddToCard.id;
        const cafeteriaName = restaurantTitle.innerHTML;
        const userName = document.querySelector(".user-name").textContent;


        const food = cart.find(function (item) {
            return item.id === id;
        });

        if (food) {
            food.count += 1;
        } else {
            cart.push({
                id: id,
                title: title,
                cost: cost,
                cafeteriaId: cafeteriaId,
                count: 1,
                cafeteriaName: cafeteriaName,
                userName: userName,
            });
        }
    }
    saveCart();
}


function renderCart() {
    modalBody.textContent = "";

    cart.forEach(function ({id, title, cost, count}) {
        const itemCart = `
			<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${cost}</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id="${id}">-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id="${id}">+</button>
				</div>
			</div>
		`;

        modalBody.insertAdjacentHTML("afterbegin", itemCart);
    });

    const totalPrice = cart.reduce(function (result, item) {
        return result + parseFloat(item.cost) * item.count;
    }, 0);

    modalPrice.textContent = totalPrice;// + " ₽";
}


function changeCount(event) {
    const target = event.target;

    if (target.classList.contains("counter-button")) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains("counter-minus")) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        }

        if (target.classList.contains("counter-plus")) food.count++;
        renderCart();
    }
    saveCart();
}


function init() {
    getData(sendRequest('GET', urlCafeterias).then(function (data) {
        data.forEach(createCardRestaurant);
    }));

    cardsRestaurants.addEventListener("click", openGoods);

    logo.addEventListener("click", returnMain);

    cardsMenu.addEventListener("click", addToCart);

    cartButton.addEventListener("click", function () {
        renderCart();
        toggleModal();
    });

    modalBody.addEventListener("click", changeCount);

    close.addEventListener("click", toggleModal);

    buttonClearCart.addEventListener("click", function () {
        cart.length = 0;
        renderCart();
    });

    inputSearch.addEventListener("keydown", searchAllGoods);

    checkAuth();

    new Swiper(".swiper-container",
        {
            loop: true,
            autoplay: {
                delay: 3000
            },
            sliderPerView: 1
        });
}

function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)

        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
        xhr.send(JSON.stringify(body))
    })
}


const requestBody = {
    "dishesId": 1,
    "dishesName": "Тестовое блюдо",
    "cafeteriaId": 1,
    "cafeteriaName": "Название кафе",
    "price": 123.20,
    "count": 1,
    "data": "2021-06-11"
}

// По нажатию кнопки "Оформить заказ"
buttonOrder.addEventListener("click", function () {
    close.click();
    console.log(localStorage.getItem("allCart"));
    var data = JSON.parse(localStorage.getItem("allCart"));
    console.log(data);
    // sendRequest('POST', urlOrders, requestBody)
    sendRequest('POST', urlOrders, data);
    localStorage.removeItem("allCart");
    buttonClearCart.click();
    console.log('userName ' + userName.innerHTML);
    console.log('Request ушел');
});


// маска ввода сотового
window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('.tel'), function(input) {
        var keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ __ __",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5)  this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

});
init();

