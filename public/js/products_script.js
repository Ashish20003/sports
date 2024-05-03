document.addEventListener('DOMContentLoaded', () => {
   
    const addToCartButtons = document.querySelectorAll('.addToCartButton');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            addToCart(button.dataset.userId, button.dataset.itemId);
        });
    });

   
    const wishlistButtons = document.querySelectorAll('.wishlistButton');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            addToWishlist(button.dataset.userId, button.dataset.itemId);
        });
    });

    function addToCart(userId, itemId) {
        sendData('/add-to-cart', { userId, itemId });
    }

    function addToWishlist(userId, itemId) {
        sendData('/add-to-wishlist', { userId, itemId });
    }

    function sendData(url, data) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }

      
        document.body.appendChild(form);
        form.submit();
    }
});
