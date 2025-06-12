
let currentUser = null;
let cart = [];
let currentProducts = [];
let currentFilters = {
    category: '',
    priceRange: '',
    rating: '',
    search: '',
    sort: 'featured'
};
let currentPage = 1;
const productsPerPage = 12;


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadUserData();
    loadCartData();
    updateCartCount();
    updateUserInterface();
    setupEventListeners();
    
    
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            initHomePage();
            break;
        case 'products':
            initProductsPage();
            break;
        case 'product-detail':
            initProductDetailPage();
            break;
        case 'cart':
            initCartPage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'signup':
            initSignupPage();
            break;
        case 'checkout':
            initCheckoutPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    return filename || 'index';
}

function loadUserData() {
    const userData = localStorage.getItem('shopixo_user');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('shopixo_user', JSON.stringify(currentUser));
    }
}

function updateUserInterface() {
    const userGreeting = document.getElementById('userMenu')?.querySelector('.user-greeting');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userGreeting) {
        if (currentUser) {
            userGreeting.textContent = `Hello, ${currentUser.firstName}`;
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
            }
        } else {
            userGreeting.textContent = 'Hello, Sign in';
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
        }
    }
}

function loadCartData() {
    const cartData = localStorage.getItem('shopixo_cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

function saveCartData() {
    localStorage.setItem('shopixo_cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1, options = {}) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return false;

    const existingItem = cart.find(item => 
        item.id === productId && 
        JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity,
            options: options,
            addedAt: new Date().toISOString()
        });
    }

    saveCartData();
    updateCartCount();
    showNotification('Product added to cart successfully!', 'success');
    return true;
}

function removeFromCart(productId, options = {}) {
    cart = cart.filter(item => 
        !(item.id === productId && JSON.stringify(item.options) === JSON.stringify(options))
    );
    saveCartData();
    updateCartCount();
    showNotification('Product removed from cart', 'info');
}

function updateCartQuantity(productId, quantity, options = {}) {
    const item = cart.find(item => 
        item.id === productId && 
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId, options);
        } else {
            item.quantity = quantity;
            saveCartData();
            updateCartCount();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = PRODUCTS_DB.find(p => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
    const count = getCartItemCount();
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

function clearCart() {
    cart = [];
    saveCartData();
    updateCartCount();
}

function getProductById(id) {
    return PRODUCTS_DB.find(product => product.id === id);
}

function getProductsByCategory(category) {
    if (!category) return PRODUCTS_DB;
    return PRODUCTS_DB.filter(product => product.category === category);
}

function getFeaturedProducts(limit = 8) {
    return PRODUCTS_DB.filter(product => product.featured).slice(0, limit);
}

function searchProducts(query) {
    if (!query) return PRODUCTS_DB;
    const searchQuery = query.toLowerCase();
    return PRODUCTS_DB.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery)
    );
}

function filterProducts(filters) {
    let filtered = [...PRODUCTS_DB];

    if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.search) {
        const searchQuery = filters.search.toLowerCase();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery)
        );
    }

 
    if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
            filtered = filtered.filter(product => product.price >= min && product.price <= max);
        } else if (filters.priceRange === '100+') {
            filtered = filtered.filter(product => product.price >= 100);
        }
    }

    if (filters.rating) {
        const minRating = parseFloat(filters.rating.replace('+', ''));
        filtered = filtered.filter(product => product.rating >= minRating);
    }

    filtered = sortProducts(filtered, filters.sort);

    return filtered;
}

function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'featured':
        default:
            return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
}

function generateProductCard(product) {
    const discountHtml = product.discount ? 
        `<div class="product-badge">${product.discount}% OFF</div>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    const discountBadgeHtml = product.discount ? 
        `<span class="discount">${product.discount}% OFF</span>` : '';

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${discountHtml}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${originalPriceHtml}
                    ${discountBadgeHtml}
                </div>
                <button class="add-to-cart" onclick="addToCartFromCard(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

function addToCartFromCard(productId) {
    addToCart(productId, 1);
}

function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const category = this.value;
            if (category) {
                window.location.href = `products.html?category=${category}`;
            }
        });
    }
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.closest('.add-to-cart')) {
            const productId = productCard.dataset.productId;
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    
    if (searchInput) {
        const query = searchInput.value.trim();
        const category = categorySelect ? categorySelect.value : '';
        
        let url = 'products.html';
        const params = new URLSearchParams();
        
        if (query) params.append('search', query);
        if (category) params.append('category', category);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        window.location.href = url;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('shopixo_user');
    updateUserInterface();
    showNotification('You have been logged out successfully', 'info');
    window.location.href = 'index.html';
}


function initHomePage() {
    loadFeaturedProducts();
    setupCategoryLinks();
}

function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;

    const featuredProducts = getFeaturedProducts(8);
    featuredProductsContainer.innerHTML = featuredProducts.map(generateProductCard).join('');
}

function setupCategoryLinks() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                window.location.href = `products.html?category=${category}`;
            }
        });
    });
}

// Products Page
function initProductsPage() {
    parseUrlParameters();
    setupFilters();
    setupSorting();
    loadProducts();
    updateBreadcrumb();
}

function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    currentFilters = {
        category: urlParams.get('category') || '',
        search: urlParams.get('search') || '',
        priceRange: '',
        rating: '',
        sort: 'featured'
    };

    const categorySelect = document.getElementById('categorySelect');
    const searchInput = document.getElementById('searchInput');

    if (categorySelect && currentFilters.category) {
        categorySelect.value = currentFilters.category;
    }

    if (searchInput && currentFilters.search) {
        searchInput.value = currentFilters.search;
    }
}

function setupFilters() {
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        if (filter.value === currentFilters.category) {
            filter.checked = true;
        }
        
        filter.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.category = this.value;
                loadProducts();
            }
        });
    });

    const priceFilters = document.querySelectorAll('input[name="price"]');
    priceFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.priceRange = this.value;
                loadProducts();
            }
        });
    });

    const ratingFilters = document.querySelectorAll('input[name="rating"]');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.rating = this.value;
                loadProducts();
            }
        });
    });

    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function setupSorting() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sort = this.value;
            loadProducts();
        });
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    if (!productsGrid) return;

    currentProducts = filterProducts(currentFilters);
    
    if (currentProducts.length === 0) {
        productsGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        if (resultsCount) resultsCount.textContent = '0 results';
        return;
    }

    productsGrid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
 
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = currentProducts.slice(0, endIndex);

    productsGrid.innerHTML = paginatedProducts.map(generateProductCard).join('');
    
    if (resultsCount) {
        resultsCount.textContent = `${currentProducts.length} results`;
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex < currentProducts.length) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.onclick = loadMoreProducts;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

function loadMoreProducts() {
    currentPage++;
    loadProducts();
}

function clearAllFilters() {
    currentFilters = {
        category: '',
        priceRange: '',
        rating: '',
        search: currentFilters.search, 
        sort: 'featured'
    };

    document.querySelectorAll('input[name="category"], input[name="price"], input[name="rating"]')
        .forEach(input => input.checked = input.value === '');

    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'featured';

    currentPage = 1;
    loadProducts();
}

function updateBreadcrumb() {
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    if (breadcrumbCategory && currentFilters.category) {
        const category = CATEGORIES[currentFilters.category];
        if (category) {
            breadcrumbCategory.textContent = category.name;
        }
    }
}

function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProductDetail(productId);
        loadRelatedProducts(productId);
    } else {
        window.location.href = 'products.html';
    }
}

function loadProductDetail(productId) {
    const product = getProductById(productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    updateProductDetailBreadcrumb(product);
    renderProductDetail(product);
    setupProductDetailEvents(product);
}

function updateProductDetailBreadcrumb(product) {
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    const breadcrumbNav = document.getElementById('breadcrumbNav');
    
    if (productBreadcrumb) {
        productBreadcrumb.textContent = product.name;
    }
    
    if (breadcrumbNav && product.category) {
        const category = CATEGORIES[product.category];
        if (category) {
            const categoryLink = document.createElement('a');
            categoryLink.href = `products.html?category=${product.category}`;
            categoryLink.textContent = category.name;
            
            const separator = document.createElement('span');
            separator.textContent = ' > ';
            
            const productSpan = breadcrumbNav.querySelector('#productBreadcrumb');
            if (productSpan) {
                breadcrumbNav.insertBefore(separator, productSpan);
                breadcrumbNav.insertBefore(categoryLink, separator);
            }
        }
    }
}

function renderProductDetail(product) {
    const productDetailContainer = document.getElementById('productDetail');
    if (!productDetailContainer) return;

    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    const discountHtml = product.discount ? 
        `<span class="discount">${product.discount}% OFF</span>` : '';

    const featuresHtml = product.features ? 
        product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('') : '';

    productDetailContainer.innerHTML = `
        <div class="product-images">
            <div class="main-image" onclick="openImageZoom('${product.image}')">
                <img src="${product.image}" alt="${product.name}" id="mainProductImage">
            </div>
            <div class="thumbnail-images">
                ${product.images ? product.images.map((img, index) => 
                    `<div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                        <img src="${img}" alt="${product.name}">
                    </div>`
                ).join('') : ''}
            </div>
        </div>
        <div class="product-details">
            <h1>${product.name}</h1>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-count">(${product.reviewCount} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${originalPriceHtml}
                ${discountHtml}
            </div>
            <div class="product-description">
                <h3>Description</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-options">
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button type="button" class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="10" id="productQuantity">
                        <button type="button" class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-primary" onclick="addToCartFromDetail(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn-wishlist" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            ${featuresHtml ? `
                <ul class="product-features">
                    ${featuresHtml}
                </ul>
            ` : ''}
        </div>
    `;
}

function setupProductDetailEvents(product) {
    const imageZoomModal = document.getElementById('imageZoomModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeImageZoom);
    }
    
    if (imageZoomModal) {
        imageZoomModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageZoom();
            }
        });
    }
}

function changeMainImage(imageSrc, thumbnailElement) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
}

function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    
    if (modal && zoomedImage) {
        zoomedImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, Math.min(10, currentValue + delta));
        quantityInput.value = newValue;
    }
}

function addToCartFromDetail(productId) {
    const quantityInput = document.getElementById('productQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    addToCart(productId, quantity);
}

function toggleWishlist(productId) {

    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn) {
        wishlistBtn.classList.toggle('active');
        const icon = wishlistBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        }
    }
    showNotification('Wishlist feature coming soon!', 'info');
}

function loadRelatedProducts(currentProductId) {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer) return;

    const currentProduct = getProductById(currentProductId);
    if (!currentProduct) return;

    const relatedProducts = PRODUCTS_DB
        .filter(product => product.category === currentProduct.category && product.id !== currentProductId)
        .slice(0, 4);

    relatedProductsContainer.innerHTML = relatedProducts.map(generateProductCard).join('');
}

function initCartPage() {
    renderCartItems();
}

function renderCartItems() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');

    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    cartContent.style.display = 'block';

    const cartItemsHtml = cart.map(item => {
        const product = getProductById(item.id);
        if (!product) return '';

        const itemTotal = product.price * item.quantity;

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>$${product.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button type="button" class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" onchange="updateCartItemQuantity(${item.id}, this.value)">
                        <button type="button" class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" onclick="removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const cartSummary = generateCartSummary();

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cartItemsHtml}
        </div>
        <div class="cart-summary">
            ${cartSummary}
            <div class="cart-actions">
                <a href="products.html" class="btn-secondary">Continue Shopping</a>
                <a href="checkout.html" class="btn-primary">Proceed to Checkout</a>
            </div>
        </div>
    `;
}

function generateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; 
    const total = subtotal + shipping + tax;

    return `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax:</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function updateCartItemQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
        removeCartItem(productId);
    } else {
        updateCartQuantity(productId, quantity);
        renderCartItems();
    }
}

function removeCartItem(productId) {
    removeFromCart(productId);
    renderCartItems();
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('password', this);
        });
    }
}

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('password', this);
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmPassword', this);
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordRequirements);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    clearFormErrors();



    let isValid = true;

    if (!email || !isValidEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!password || password.length < 6) {
        showFieldError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!isValid) return;

   
    const users = JSON.parse(localStorage.getItem('shopixo_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = { ...user };
        delete currentUser.password; 
        saveUserData();
        updateUserInterface();
        
        showFormMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showFormMessage('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        agreeTerms: formData.get('agreeTerms')
    };

    
    clearFormErrors();

   
    if (!validateSignupForm(userData)) return;

    const users = JSON.parse(localStorage.getItem('shopixo_users') || '[]');
    if (users.some(u => u.email === userData.email)) {
        showFormMessage('An account with this email already exists', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('shopixo_users', JSON.stringify(users));

    showFormMessage('Account created successfully! Redirecting to login...', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function validateSignupForm(userData) {
    let isValid = true;

    if (!userData.firstName || userData.firstName.trim().length < 2) {
        showFieldError('firstNameError', 'First name must be at least 2 characters');
        isValid = false;
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
        showFieldError('lastNameError', 'Last name must be at least 2 characters');
        isValid = false;
    }

    if (!userData.email || !isValidEmail(userData.email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!isValidPassword(userData.password)) {
        showFieldError('passwordError', 'Password does not meet requirements');
        isValid = false;
    }

    if (userData.password !== userData.confirmPassword) {
        showFieldError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    if (!userData.agreeTerms) {
        showFieldError('termsError', 'You must agree to the terms and conditions');
        isValid = false;
    }

    return isValid;
}

function validatePasswordRequirements() {
    const password = document.getElementById('password').value;
    
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password)
    };

    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(req + 'Req');
        if (element) {
            element.classList.toggle('valid', requirements[req]);
        }
    });
}

function isValidPassword(password) {
    if (!password || password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function togglePasswordVisibility(inputId, toggleButton) {
    const input = document.getElementById(inputId);
    const icon = toggleButton.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
    }
}

function initCheckoutPage() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    setupCheckoutSteps();
    loadOrderSummary();
    setupCheckoutForm();
}

function setupCheckoutSteps() {
    const continueToPayment = document.getElementById('continueToPayment');
    const continueToReview = document.getElementById('continueToReview');
    const placeOrder = document.getElementById('placeOrder');

    if (continueToPayment) {
        continueToPayment.addEventListener('click', function() {
            if (validateShippingForm()) {
                showCheckoutStep(2);
            }
        });
    }

    if (continueToReview) {
        continueToReview.addEventListener('click', function() {
            if (validatePaymentForm()) {
                loadReviewSection();
                showCheckoutStep(3);
            }
        });
    }

    if (placeOrder) {
        placeOrder.addEventListener('click', processOrder);
    }
}

function showCheckoutStep(step) {
 
    document.querySelectorAll('.checkout-section').forEach(section => {
        section.style.display = 'none';
    });


    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        stepEl.classList.toggle('active', index + 1 === step);
        stepEl.classList.toggle('completed', index + 1 < step);
    });

   
    const sections = ['shippingSection', 'paymentSection', 'reviewSection', 'confirmationSection'];
    const currentSection = document.getElementById(sections[step - 1]);
    if (currentSection) {
        currentSection.style.display = 'block';
    }
}

function loadOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');

    if (!summaryItems) return;

    const itemsHtml = cart.map(item => {
        const product = getProductById(item.id);
        if (!product) return '';

        return `
            <div class="summary-item">
                <div class="summary-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="summary-item-info">
                    <h4>${product.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="summary-item-price">
                    $${(product.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    }).join('');

    summaryItems.innerHTML = itemsHtml;


    const subtotalAmount = getCartTotal();
    const shippingAmount = subtotalAmount > 50 ? 0 : 5.99;
    const taxAmount = subtotalAmount * 0.08;
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;

    if (subtotal) subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    if (shipping) shipping.textContent = shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`;
    if (tax) tax.textContent = `$${taxAmount.toFixed(2)}`;
    if (total) total.textContent = `$${totalAmount.toFixed(2)}`;
}

function setupCheckoutForm() {
    if (currentUser) {
        const firstNameInput = document.getElementById('shippingFirstName');
        const lastNameInput = document.getElementById('shippingLastName');
        
        if (firstNameInput) firstNameInput.value = currentUser.firstName || '';
        if (lastNameInput) lastNameInput.value = currentUser.lastName || '';
    }

    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            console.log('Payment method changed to:', this.value);
        });
    });
}

function validateShippingForm() {
    const requiredFields = [
        'shippingFirstName',
        'shippingLastName', 
        'shippingAddress',
        'shippingCity',
        'shippingState',
        'shippingZip',
        'shippingPhone'
    ];

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (field) {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required shipping information', 'error');
    }

    return isValid;
}

function validatePaymentForm() {
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (field) {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required payment information', 'error');
    }

    return isValid;
}

function loadReviewSection() {
    const reviewItems = document.getElementById('reviewItems');
    const reviewShippingAddress = document.getElementById('reviewShippingAddress');
    const reviewPaymentMethod = document.getElementById('reviewPaymentMethod');

    if (reviewItems) {
        const itemsHtml = cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return '';

            return `
                <div class="review-item">
                    <div class="review-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="review-item-info">
                        <h4>${product.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: $${(product.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join('');

        reviewItems.innerHTML = itemsHtml;
    }

    if (reviewShippingAddress) {
        const firstName = document.getElementById('shippingFirstName')?.value || '';
        const lastName = document.getElementById('shippingLastName')?.value || '';
        const address = document.getElementById('shippingAddress')?.value || '';
        const city = document.getElementById('shippingCity')?.value || '';
        const state = document.getElementById('shippingState')?.value || '';
        const zip = document.getElementById('shippingZip')?.value || '';

        reviewShippingAddress.innerHTML = `
            <p>${firstName} ${lastName}</p>
            <p>${address}</p>
            <p>${city}, ${state} ${zip}</p>
        `;
    }

    if (reviewPaymentMethod) {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'credit';
        const cardNumber = document.getElementById('cardNumber')?.value || '';
        const maskedCard = cardNumber ? '**** **** **** ' + cardNumber.slice(-4) : '';

        reviewPaymentMethod.innerHTML = `
            <p>${paymentMethod === 'credit' ? 'Credit/Debit Card' : 'PayPal'}</p>
            ${maskedCard ? `<p>${maskedCard}</p>` : ''}
        `;
    }
}

function processOrder() {

    const orderNumber = 'SPX' + Date.now().toString().slice(-8);
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const orderNumberElement = document.getElementById('orderNumber');
    const deliveryDateElement = document.getElementById('deliveryDate');
    
    if (orderNumberElement) {
        orderNumberElement.textContent = orderNumber;
    }
    
    if (deliveryDateElement) {
        deliveryDateElement.textContent = deliveryDate.toLocaleDateString();
    }

    // Save order to localStorage (for order history)
    const orders = JSON.parse(localStorage.getItem('shopixo_orders') || '[]');
    const newOrder = {
        id: orderNumber,
        userId: currentUser?.id || null,
        items: [...cart],
        total: getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99) + (getCartTotal() * 0.08),
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        deliveryDate: deliveryDate.toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem('shopixo_orders', JSON.stringify(orders));

    clearCart();
    showCheckoutStep(4);
    showNotification('Order placed successfully!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

   
    document.body.appendChild(notification);

    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-content {
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-success {
                border-left: 4px solid #27ae60;
            }
            .notification-error {
                border-left: 4px solid #e74c3c;
            }
            .notification-info {
                border-left: 4px solid #3498db;
            }
            .notification-success .notification-content i {
                color: #27ae60;
            }
            .notification-error .notification-content i {
                color: #e74c3c;
            }
            .notification-info .notification-content i {
                color: #3498db;
            }
        `;
        document.head.appendChild(styles);
    }

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});
