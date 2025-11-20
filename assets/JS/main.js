document.addEventListener('DOMContentLoaded', function() {
    class BannerSlider {
        constructor(container, slides = [], visibleSlides = 4, interval = 3000) {
            this.container = container;
            this.slides = slides;
            this.visibleSlides = visibleSlides;
            this.interval = interval;
            this.currentIndex = 0;

            this.init();
        }

        init() {
            this.createSlides();
            this.startAutoPlay();
        }

        createSlides() {
            const container = this.container.querySelector('.banner-slider__container');

            // Добавляем дополнительные слайды для бесконечной прокрутки
            const extendedSlides = [
                ...this.slides.slice(-this.visibleSlides),
                ...this.slides,
                ...this.slides.slice(0, this.visibleSlides)
            ];

            container.innerHTML = extendedSlides.map(slide =>
                `<div class="banner-slider__slide">
                    <img src="${slide}" class="banner-slider__image">
                </div>`
            ).join('');

            this.slideWidth = 100 / this.visibleSlides;
            this.totalSlides = extendedSlides.length;
            this.realSlidesCount = this.slides.length;

            // Стартовая позиция
            this.currentIndex = this.visibleSlides;
            container.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
        }

        next() {
            this.currentIndex++;
            this.updateSlider();
        }

        updateSlider() {
            const container = this.container.querySelector('.banner-slider__container');
            container.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
            this.checkBoundaries();
        }

        checkBoundaries() {
            const container = this.container.querySelector('.banner-slider__container');

            if (this.currentIndex >= this.totalSlides - this.visibleSlides) {
                setTimeout(() => {
                    container.style.transition = 'none';
                    this.currentIndex = this.visibleSlides;
                    container.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
                    setTimeout(() => container.style.transition = 'transform 0.5s ease-in-out', 50);
                }, 500);
            }
        }

        startAutoPlay() {
            setInterval(() => this.next(), this.interval);
        }
    }

    // Использование
    const slides = [
        './assets/images/main__slider/slider-image__1.jpg',
        './assets/images/main__slider/slider-image__4.jpg',
        './assets/images/main__slider/slider-image__2.jpg',
        './assets/images/main__slider/slider-image__3.jpg',
    ];

    // Проверяем, что элемент существует
    const sliderElement = document.querySelector('.banner-slider');
    if (sliderElement) {
        new BannerSlider(sliderElement, slides, 4, 2000);
    } else {
        console.error('Элемент .banner-slider не найден');
    }
});

// UP SCROLL BOTTOM
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка "Наверх"
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    // Показ/скрытие кнопки при скролле
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Плавный скролл наверх
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// FEEDBACKS
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.fb__item');

    faqItems.forEach(item => {
        const title = item.querySelector('.fb__item-title');

        title.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });
});


// Функциональность фильтра каталога
document.addEventListener('DOMContentLoaded', function() {
    // Элементы фильтра
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceRange = document.getElementById('priceRange');
    const sortSelect = document.getElementById('sortSelect');
    const resetButtons = document.querySelectorAll('.reset-filters, .reset-filters-btn');
    const applyButton = document.querySelector('.apply-filters');

    // Синхронизация полей цены
    function syncPriceInputs() {
        priceMin.value = priceRange.value;
        updatePriceDisplay();
    }

    function updatePriceDisplay() {
        const min = parseInt(priceMin.value) || 0;
        const max = parseInt(priceMax.value) || 1000;
        priceRange.min = min;
        priceRange.max = max;
    }

    // Обработчики событий для цены
    priceMin.addEventListener('change', updatePriceDisplay);
    priceMax.addEventListener('change', updatePriceDisplay);
    priceRange.addEventListener('input', syncPriceInputs);

    // Сброс фильтров
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Сброс чекбоксов
            document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Сброс цены
            priceMin.value = 100;
            priceMax.value = 500;
            priceRange.value = 100;
            updatePriceDisplay();

            // Сброс сортировки
            sortSelect.value = 'popular';

            // Применение сброса
            applyFilters();
        });
    });

    // Применение фильтров
    applyButton.addEventListener('click', applyFilters);

    function applyFilters() {
        const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
            .map(cb => cb.value);

        const dietFilters = Array.from(document.querySelectorAll('input[name="diet"]:checked'))
            .map(cb => cb.value);

        const excludeFilters = Array.from(document.querySelectorAll('input[name="exclude"]:checked'))
            .map(cb => cb.value);

        const volumeFilters = Array.from(document.querySelectorAll('input[name="volume"]:checked'))
            .map(cb => cb.value);

        const minPrice = parseInt(priceMin.value);
        const maxPrice = parseInt(priceMax.value);
        const sortBy = sortSelect.value;

        // Здесь будет логика фильтрации товаров
        filterProducts({
            types: selectedTypes,
            diets: dietFilters,
            excludes: excludeFilters,
            volumes: volumeFilters,
            minPrice: minPrice,
            maxPrice: maxPrice,
            sortBy: sortBy
        });

        console.log('Фильтры применены:', {
            types: selectedTypes,
            diets: dietFilters,
            excludes: excludeFilters,
            volumes: volumeFilters,
            priceRange: `${minPrice}-${maxPrice}`,
            sortBy: sortBy
        });
    }

    function filterProducts(filters) {
        // Реальная логика фильтрации будет зависеть от структуры данных
        const products = document.querySelectorAll('.mini-catalog__card');

        products.forEach(product => {
            // Здесь должна быть логика показа/скрытия товаров
            // на основе примененных фильтров
            let shouldShow = true;

            // Пример простой фильтрации (нужно адаптировать под ваши данные)
            const productPrice = parseInt(product.querySelector('.mini-catalog__price').textContent);

            if (productPrice < filters.minPrice || productPrice > filters.maxPrice) {
                shouldShow = false;
            }

            product.style.display = shouldShow ? 'block' : 'none';
        });

        // Сортировка товаров
        sortProducts(filters.sortBy);
    }

    function sortProducts(sortBy) {
        const container = document.querySelector('.catalog-cards');
        const products = Array.from(container.querySelectorAll('.mini-catalog__card'));

        products.sort((a, b) => {
            switch(sortBy) {
                case 'price-asc':
                    return getProductPrice(a) - getProductPrice(b);
                case 'price-desc':
                    return getProductPrice(b) - getProductPrice(a);
                case 'name':
                    return getProductName(a).localeCompare(getProductName(b));
                default:
                    return 0;
            }
        });

        // Перемещение отсортированных элементов
        products.forEach(product => container.appendChild(product));
    }

    function getProductPrice(productElement) {
        const priceText = productElement.querySelector('.mini-catalog__price').textContent;
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }

    function getProductName(productElement) {
        return productElement.querySelector('.title_h3').textContent;
    }

    // Инициализация
    updatePriceDisplay();
});

document.addEventListener('DOMContentLoaded', function() {
    // Gallery functionality
    const thumbs = document.querySelectorAll('.thumb');
    const mainImage = document.getElementById('mainImage');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbs
            thumbs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumb
            this.classList.add('active');

            // Update main image
            const newImage = this.getAttribute('data-image');
            mainImage.src = newImage;
        });
    });

    // Tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    addToCartBtn.addEventListener('click', function() {
        const productName = document.querySelector('.product-title').textContent;
        const productPrice = document.querySelector('.product-price').textContent.split(' ')[0];

        // Animation effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        // Show success message (you can replace this with actual cart logic)
        const originalText = this.querySelector('p').textContent;
        this.querySelector('p').textContent = 'Добавлено в запасы!';

        setTimeout(() => {
            this.querySelector('p').textContent = originalText;
        }, 2000);

        console.log('Товар добавлен в корзину:', {
            name: productName,
            price: productPrice
        });

        // Here you would typically update the cart count in header
        // updateCartCount();
    });

    // Quantity functionality (if needed in future)
    function updateQuantity(change) {
        const quantityInput = document.querySelector('.quantity-input');
        if (quantityInput) {
            let currentValue = parseInt(quantityInput.value);
            currentValue += change;
            if (currentValue < 1) currentValue = 1;
            quantityInput.value = currentValue;
        }
    }

    // Image zoom functionality (optional)
    mainImage.addEventListener('click', function() {
        this.classList.toggle('zoomed');
    });

    // Smooth scroll to tabs
    const tabLinks = document.querySelectorAll('a[href^="#"]');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product features animation
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100 + 500);
    });


});

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cartItems = document.querySelectorAll('.cart-item');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const plusBtns = document.querySelectorAll('.plus-btn');
    const minusBtns = document.querySelectorAll('.minus-btn');
    const removeBtns = document.querySelectorAll('.cart-item__remove');
    const cartCount = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total-cost');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Update cart totals
    function updateCartTotals() {
        let subtotal = 0;
        let totalItems = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const total = price * quantity;

            // Update item total
            item.querySelector('.total-price').textContent = `${total} ₽`;

            subtotal += total;
            totalItems += quantity;
        });

        // Update display
        subtotalEl.textContent = `${subtotal} ₽`;
        totalEl.textContent = `${subtotal} ₽`;
        cartCount.textContent = totalItems;

        // Update items count in header
        document.querySelector('.items-count').textContent = `${totalItems} товара`;
    }

    // Quantity controls
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            if (value < 99) {
                input.value = value + 1;
                updateCartTotals();
            }
        });
    });

    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartTotals();
            }
        });
    });

    // Input change handler
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 99) {
                this.value = 99;
            }
            updateCartTotals();
        });
    });

    // Remove item
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                item.remove();
                updateCartTotals();

                // Show empty cart message if no items left
                if (document.querySelectorAll('.cart-item').length === 0) {
                    showEmptyCart();
                }
            }, 300);
        });
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        const totalItems = parseInt(cartCount.textContent);
        if (totalItems === 0) {
            alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
            return;
        }

        // Animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        // Simulate checkout process
        const originalText = this.querySelector('p').textContent;
        this.querySelector('p').textContent = 'Оформляем...';

        setTimeout(() => {
            this.querySelector('p').textContent = originalText;
            alert('Заказ успешно оформлен! С вами свяжется наш специалист для подтверждения.');
        }, 1000);
    });

    // Empty cart state
    function showEmptyCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <h2 class="title_h2">Запасы пусты</h2>
                <p class="description">Добавьте варенье в корзину, чтобы сделать заказ</p>
                <a href="catalog.html" class="btn-hover">
                    <p class="nav_title">В закрома</p>
                    <img class="btn-hover__overlay-default" src="./assets/icons/cart_bottom__hover.png" alt="">
                    <img class="btn-hover__overlay" src="./assets/icons/cart_bottom.png" alt="">
                </a>
            </div>
        `;

        // Update order summary for empty cart
        document.querySelector('.order-summary').style.display = 'none';
    }

    // Initialize cart totals
    updateCartTotals();

    // Keyboard support for quantity inputs
    quantityInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                let value = parseInt(this.value);
                if (value < 99) {
                    this.value = value + 1;
                    updateCartTotals();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                let value = parseInt(this.value);
                if (value > 1) {
                    this.value = value - 1;
                    updateCartTotals();
                }
            }
        });
    });
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal script loaded'); // Debug log

    // Elements
    const loginNavItem = document.getElementById('loginButton');
    const modalOverlay = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const modalTabs = document.querySelectorAll('.modal-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const socialBtns = document.querySelectorAll('.social-btn');

    console.log('Elements:', { loginNavItem, modalOverlay, closeModal, modalTabs, loginForm, registerForm }); // Debug log

    // Open modal when clicking login nav item
    if (loginNavItem) {
        loginNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked'); // Debug log
            openModal();
        });
    } else {
        console.error('Login button not found');
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    // Close modal when clicking outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModalFunc();
            }
        });
    }

    // Tab switching
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            console.log('Tab clicked:', targetTab); // Debug log

            // Remove active class from all tabs
            modalTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding form
            if (targetTab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted'); // Debug log
            handleLogin();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Register form submitted'); // Debug log
            handleRegister();
        });
    }

    // Social login buttons
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('vk-btn') ? 'VK' : 'Google';
            console.log('Social login:', provider); // Debug log
            handleSocialLogin(provider);
        });
    });

    // Functions
    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Modal opened'); // Debug log

            // Reset forms
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();

            // Show login form by default
            if (modalTabs[0]) modalTabs[0].click();
        } else {
            console.error('Modal overlay not found');
        }
    }

    function closeModalFunc() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Modal closed'); // Debug log
        }
    }

    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simple validation
        if (!email || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }

        // Simulate API call
        simulateAPICall('login')
            .then(() => {
                showSuccess('Вход выполнен успешно!');
                // Update UI to show user is logged in
                updateLoginState(true);
            })
            .catch(error => {
                showError('Неверный email или пароль');
            });
    }

    function handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Пожалуйста, заполните все поля');
            return;
        }

        if (password.length < 6) {
            showError('Пароль должен содержать не менее 6 символов');
            return;
        }

        if (password !== confirmPassword) {
            showError('Пароли не совпадают');
            return;
        }

        if (!acceptTerms) {
            showError('Необходимо принять условия использования');
            return;
        }

        // Simulate API call
        simulateAPICall('register')
            .then(() => {
                showSuccess('Регистрация завершена! Проверьте вашу почту для подтверждения.');
                // Switch to login tab after successful registration
                setTimeout(() => {
                    if (modalTabs[0]) modalTabs[0].click();
                }, 2000);
            })
            .catch(error => {
                showError('Пользователь с таким email уже существует');
            });
    }

    function handleSocialLogin(provider) {
        // Simulate social login
        simulateAPICall(`social_${provider.toLowerCase()}`)
            .then(() => {
                showSuccess(`Вход через ${provider} выполнен успешно!`);
                updateLoginState(true);
            })
            .catch(error => {
                showError(`Ошибка входа через ${provider}`);
            });
    }

    function simulateAPICall(action) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // For demo purposes, randomly succeed or fail
                const success = Math.random() > 0.3; // 70% success rate
                if (success) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`${action} failed`));
                }
            }, 1500);
        });
    }

    function showError(message) {
        alert(message); // Temporary solution
    }

    function showSuccess(message) {
        alert(message); // Temporary solution
        closeModalFunc();
    }

    function updateLoginState(isLoggedIn) {
        const loginItem = document.getElementById('loginButton');
        if (loginItem && isLoggedIn) {
            loginItem.querySelector('.nav-item__title').textContent = 'Профиль';
        }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModalFunc();
        }
    });
});

// Бургер-меню functionality
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (burgerMenu && mobileMenu) {
        // Открытие/закрытие меню
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие по клику на оверлей
        mobileMenuOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });

        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Закрытие при ресайзе (на десктопе)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1000 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
});

// Функция закрытия мобильного меню
function closeMobileMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (burgerMenu && mobileMenu) {
        burgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие меню при клике на ссылку (добавьте к существующим обработчикам)
document.querySelectorAll('.mobile-nav__item').forEach(item => {
    item.addEventListener('click', function() {
        closeMobileMenu();
    });
});