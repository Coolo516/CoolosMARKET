const cart = [];

// Function to add an item to the cart
function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, price, quantity: 1 });
    }
    alert(`${product} added to cart!`);
    updateCartButton();
    displayCartItems();
}

// Function to update the cart button text
function updateCartButton() {
    const cartButton = document.getElementById('cart-button');
    cartButton.style.display = cart.length > 0 ? 'block' : 'none';
    cartButton.textContent = `Cart (${cart.length})`;
}

// Function to display cart items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <span>${item.product} - $${item.price} (x${item.quantity})</span>
            <div class="quantity-adjust">
                <button onclick="updateQuantity('${item.product}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.product}', 1)">+</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
}

// Function to update item quantity
function updateQuantity(product, change) {
    const item = cart.find(i => i.product === product);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart.splice(cart.indexOf(item), 1);
        }
        displayCartItems();
        updateCartButton();
    }
}

// Function to toggle cart visibility
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'none' ? 'flex' : 'none';
}

// Function to toggle checkout modal visibility
function toggleCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.style.display = checkoutModal.style.display === 'none' ? 'flex' : 'none';
}

// Function to handle checkout
function checkout() {
    const discordUsername = document.getElementById('discord-username').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!discordUsername || !paymentMethod) {
        alert("Please enter your Discord username and select a payment method.");
        return;
    }

    const products = cart.map(item => `${item.product} (x${item.quantity})`).join(", ");

    // Replace this URL with your actual Discord Webhook URL
    const webhookURL = 'https://discord.com/api/webhooks/1294757427870175292/k7ihT_PnQ7-RJ9-RtsYjT6gG45xLNsJtuTwtEHe4P_o0j3NTdQSf8VMuQEDpdyikeVwd';

    const webhookData = {
        content: `New Checkout!\nDiscord Username: ${discordUsername}\nProducts: ${products}\nTotal Price: $${totalPrice}\nPayment Method: ${paymentMethod}`
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
    }).then(response => {
        alert("Please make a ticket in COOLOS Market / Services to pay and receive items.");
        cart.length = 0; // Clear cart
        displayCartItems();
        updateCartButton();
        toggleCart();
        toggleCheckout();
    }).catch(error => {
        console.error("Error sending webhook:", error);
    });
}

// Function to search for products
function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h2').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block'; // Show the product if it matches
        } else {
            product.style.display = 'none'; // Hide the product if it doesn't match
        }
    });
}

// Initializing modals to be hidden
document.getElementById('cart-modal').style.display = 'none';
document.getElementById('checkout-modal').style.display = 'none';
