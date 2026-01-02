// بيانات المنتجات
const products = [
    { id: 1, brand: "CLAZZY", price: "$500", originalPrice: "$715", discount: 30, likes: 1245, size: "large", desc: "تيشيرت بوليستر عالي الجودة بتصميم عصري", colors: ["أسود", "أزرق", "رمادي"], sizes: "S, M, L, XL", delivery: "3-5 أيام", fabric: "قطن 100%" },
    { id: 2, brand: "GO K", price: "$350", originalPrice: "$350", discount: 0, likes: 850, size: "medium", desc: "بنطال جينز كلاسيكي يناسب جميع المناسبات", colors: ["أزرق", "أسود"], sizes: "28-38", delivery: "2-4 أيام", fabric: "دينيم" },
    { id: 3, brand: "mmm brand", price: "$280", originalPrice: "$330", discount: 15, likes: 920, size: "small", desc: "هودي قطني دافئ مع جيب كانغر", colors: ["رمادي", "أسود", "أبيض"], sizes: "M, L, XL", delivery: "4-6 أيام", fabric: "قطن فرنسي" },
    { id: 4, brand: "AMB", price: "$420", originalPrice: "$420", discount: 0, likes: 750, size: "medium", desc: "قميص رسمي أنيق للمناسبات الخاصة", colors: ["أبيض", "أزرق فاتح"], sizes: "S, M, L", delivery: "3-5 أيام", fabric: "كتان" },
    { id: 5, brand: "T", price: "$190", originalPrice: "$240", discount: 20, likes: 640, size: "large", desc: "تنورة ميدي بتصميم كلاسيكي وعصري", colors: ["أسود", "بيج", "أحمر"], sizes: "XS, S, M", delivery: "2-3 أيام", fabric: "صوف" },
    { id: 6, brand: "CLAZZY", price: "$600", originalPrice: "$750", discount: 20, likes: 1100, size: "medium", desc: "جاكت جلد طبيعي بتصميم متميز", colors: ["بني", "أسود"], sizes: "M, L, XL", delivery: "5-7 أيام", fabric: "جلد طبيعي" },
    { id: 7, brand: "GO K", price: "$310", originalPrice: "$310", discount: 0, likes: 720, size: "small", desc: "شورت صيفي مريح بتصميم رياضي", colors: ["أزرق", "رمادي", "أخضر"], sizes: "S, M, L", delivery: "1-3 أيام", fabric: "بوليستر" },
    { id: 8, brand: "mmm brand", price: "$270", originalPrice: "$360", discount: 25, likes: 880, size: "large", desc: "بدلة رياضية كاملة بتصميم عصري", colors: ["أسود", "رمادي"], sizes: "S, M, L, XL", delivery: "4-5 أيام", fabric: "مزيج قطني" },
    { id: 9, brand: "AMB", price: "$390", originalPrice: "$390", discount: 0, likes: 690, size: "medium", desc: "بلوزة نسائية بتطريز يدوي مميز", colors: ["أبيض", "وردي"], sizes: "XS, S, M", delivery: "3-4 أيام", fabric: "حرير" },
    { id: 10, brand: "T", price: "$220", originalPrice: "$260", discount: 15, likes: 530, size: "small", desc: "حقيبة يد نسائية بتصميم فاخر", colors: ["أسود", "بني", "أحمر"], sizes: "واحد", delivery: "2-4 أيام", fabric: "جلد صناعي" }
];

// توليد شبكة المنتجات
function generateProductGrid() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        createProductCard(product, grid);
    });
}

function createProductCard(product, container) {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.dataset.id = product.id;
    
    const bgColors = [
        'linear-gradient(135deg, #2A2F3C, #3A2F4C)',
        'linear-gradient(135deg, #3A2F4C, #4A2F5C)',
        'linear-gradient(135deg, #2A3F4C, #3A4F5C)',
        'linear-gradient(135deg, #3A3F3C, #4A4F4C)'
    ];
    const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    
    const icons = ['fa-tshirt', 'fa-tshirt', 'fa-tshirt', 'fa-vest', 'fa-shoe-prints', 'fa-bag-shopping', 'fa-glasses', 'fa-hat-cowboy'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    item.innerHTML = `
        <div class="product-img" style="background: ${randomColor}; display: flex; align-items: center; justify-content: center; font-size: 48px; color: rgba(255, 255, 255, 0.15);">
            <i class="fas ${randomIcon}"></i>
        </div>
        <div class="product-info">
            <div class="brand-name">
                <span>${product.brand}</span>
                <div class="brand-logo">${product.brand.charAt(0)}</div>
            </div>
            ${product.discount > 0 ? `<div class="discount-badge">%${product.discount} خصم</div>` : ''}
            <div class="price-section">
                <div class="price">${product.price}</div>
                <div class="likes">
                    <i class="fas fa-heart"></i>
                    <span>${product.likes.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    item.addEventListener('click', () => openProductCard(product));
    container.appendChild(item);
    
    // إضافة زر إضافة للسلة داخل كارت المنتج
    addCartButtonToCard(item, product);
}

// ==== زر إضافة للسلة داخل كارت المنتج ====
function addCartButtonToCard(cardElement, product) {
    const productImg = cardElement.querySelector('.product-img');
    
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn-in-card';
    cartBtn.innerHTML = '<i class="fas fa-cart-plus"></i>';
    cartBtn.title = 'أضف إلى السلة';
    
    cartBtn.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(255, 109, 31, 0.9);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s;
        z-index: 10;
        opacity: 0;
        transform: scale(0.8);
    `;
    
    productImg.style.position = 'relative';
    
    cardElement.addEventListener('mouseenter', function() {
        cartBtn.style.opacity = '1';
        cartBtn.style.transform = 'scale(1)';
    });
    
    cardElement.addEventListener('mouseleave', function() {
        cartBtn.style.opacity = '0';
        cartBtn.style.transform = 'scale(0.8)';
    });
    
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart(product);
        
        this.style.background = '#2ecc71';
        this.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            this.style.background = 'rgba(255, 109, 31, 0.9)';
            this.innerHTML = '<i class="fas fa-cart-plus"></i>';
        }, 1000);
    });
    
    productImg.appendChild(cartBtn);
}

// ==== دالة إضافة منتج للسلة ====
function addToCart(product) {
    const currentCart = JSON.parse(localStorage.getItem('biyalaCart') || '[]');
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentCart.push({
            id: product.id,
            name: product.desc || `منتج ${product.brand}`,
            brand: product.brand,
            price: parseInt(product.price.replace('$', '')),
            quantity: 1
        });
    }
    
    localStorage.setItem('biyalaCart', JSON.stringify(currentCart));
    updateCartCounter();
    
    // تأثير إشعار بصري
    showCartNotification(product);
}

// ==== عرض إشعار إضافة للسلة ====
function showCartNotification(product) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>تمت إضافة ${product.brand} إلى السلة</span>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius-sm);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        box-shadow: 0 5px 20px rgba(46, 204, 113, 0.4);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 1.7s forwards;
        font-weight: 600;
    `;
    
    // إضافة الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 2 ثانية
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 2000);
}

// ==== تحديث عداد السلة ====
function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('biyalaCart') || '[]');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        const oldCounter = cartIcon.querySelector('.cart-counter');
        if (oldCounter) oldCounter.remove();
        
        if (totalItems > 0) {
            const counter = document.createElement('span');
            counter.className = 'cart-counter';
            counter.textContent = totalItems > 9 ? '9+' : totalItems;
            counter.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #FF6D1F;
                color: white;
                font-size: 12px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(counter);
        }
    }
}

// ==== فتح بطاقة المنتج ====
function openProductCard(product) {
    const overlay = document.getElementById('product-card-overlay');
    const card = document.getElementById('flip-card');
    
    document.querySelector('.brand-name-large').textContent = product.brand;
    document.querySelector('.brand-logo-large').textContent = product.brand.charAt(0);
    document.querySelector('.product-price').innerHTML = `
        ${product.originalPrice !== product.price ? `<span class="original-price">${product.originalPrice}</span>` : ''}
        ${product.price}
    `;
    document.querySelector('.likes-large span').textContent = product.likes.toLocaleString();
      const brandLink = document.getElementById('view-brand-profile');
    if (brandLink) {
        brandLink.href = `brand-profile.html?brand=${encodeURIComponent(product.brand)}`;
    }
    const discountBadge = document.querySelector('.product-price-section .discount-badge');
    if (product.discount > 0) {
        discountBadge.textContent = `%${product.discount} خصم`;
        discountBadge.style.display = 'inline-block';
    } else {
        discountBadge.style.display = 'none';
    }
    
    document.querySelector('.card-back p').textContent = product.desc;
    
    const detailsHTML = `
        <div class="detail-item">
            <span>المقاسات المتاحة</span>
            <span>${product.sizes}</span>
        </div>
        <div class="detail-item">
            <span>الألوان</span>
            <span>${product.colors.join(', ')}</span>
        </div>
        <div class="detail-item">
            <span>نوع القماش</span>
            <span>${product.fabric}</span>
        </div>
        <div class="detail-item">
            <span>وقت التوصيل</span>
            <span>${product.delivery}</span>
        </div>
    `;
    document.querySelector('.product-details').innerHTML = detailsHTML;
    
    setupFrontFace(product);
    setupBackFace(product);
    setupFrontCartButton(product); // استدعاء الدالة الجديدة
    
    card.classList.remove('flipped');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==== إعداد الوجه الأمامي ====
function setupFrontFace(product) {
    const frontContent = document.querySelector('.card-front .front-content');
    if (!frontContent) return;
    
    const oldButtons = frontContent.querySelectorAll('.front-button');
    oldButtons.forEach(btn => btn.remove());
}

// ==== إعداد زر إضافة إلى السلة في الوجه الأمامي ====
function setupFrontCartButton(product) {
    const frontCartBtn = document.getElementById('front-cart-btn');
    if (!frontCartBtn) return;
    
    // إعادة تعيين الزر
    frontCartBtn.classList.remove('added');
    frontCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i><span>أضف إلى السلة</span>';
    
    // إضافة حدث النقر
    frontCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // إضافة المنتج للسلة
        addToCart(product);
        
        // تغيير مظهر الزر للإشارة إلى النجاح
        this.classList.add('added');
        this.innerHTML = '<i class="fas fa-check"></i><span>تمت الإضافة</span>';
        
        // إرجاع الزر إلى حالته الأصلية بعد 1.5 ثانية
        setTimeout(() => {
            this.classList.remove('added');
            this.innerHTML = '<i class="fas fa-cart-plus"></i><span>أضف إلى السلة</span>';
        }, 1500);
    });
}

// ==== إعداد الوجه الخلفي ====
function setupBackFace(product) {
    const backContent = document.querySelector('.card-back');
    
    // إعداد زر المشاركة
    const shareBtn = document.querySelector('.card-back .action-btn[title="مشاركة"]');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navigator.share) {
                navigator.share({
                    title: product.brand,
                    text: product.desc,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(product.desc);
                this.style.background = '#2ecc71';
                this.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                    this.innerHTML = '<i class="fas fa-share-alt"></i>';
                }, 1000);
            }
        });
    }
    
    // إعداد زر الإعجاب في الوجه الخلفي
    const favoriteBtn = document.querySelector('.card-back .action-btn[title="إضافة إلى المفضلة"]');
    if (favoriteBtn) {
        let isFavorite = false;
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            isFavorite = !isFavorite;
            
            if (isFavorite) {
                this.style.background = '#e74c3c';
                this.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }
}

// ==== التنقل بين الصفحات ====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        const pageId = this.dataset.page + '-page';
        document.getElementById('product-card-overlay').classList.remove('active');
        
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
    });
});

// ==== أيقونة الحساب ====
document.getElementById('account-icon').addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelector('[data-page="settings"]').classList.add('active');
    document.getElementById('settings-page').classList.add('active');
    this.style.transform = 'scale(0.9)';
    setTimeout(() => this.style.transform = 'scale(1)', 150);
});

// ==== أيقونة السلة ====
document.getElementById('cart-icon').addEventListener('click', function() {
    window.location.href = 'cart.html';
    this.style.transform = 'scale(0.9)';
    setTimeout(() => this.style.transform = 'scale(1)', 150);
});

// ==== إغلاق بطاقة المنتج ====
document.getElementById('close-card').addEventListener('click', closeProductCard);
function closeProductCard() {
    document.getElementById('product-card-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}
document.getElementById('product-card-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeProductCard();
});

// ==== تقليب البطاقة ====
document.getElementById('flip-to-back').addEventListener('click', function() {
    document.getElementById('flip-card').classList.add('flipped');
});
document.getElementById('flip-to-front').addEventListener('click', function() {
    document.getElementById('flip-card').classList.remove('flipped');
});

// ==== زر الشراء ====
document.getElementById('buy-button').addEventListener('click', function() {
    const currentProduct = products.find(p => p.brand === document.querySelector('.brand-name-large').textContent);
    if (currentProduct) {
        localStorage.setItem('selectedProduct', JSON.stringify({
            id: currentProduct.id,
            name: currentProduct.desc,
            brand: currentProduct.brand,
            price: parseInt(currentProduct.price.replace('$', '')),
            selected: true
        }));
        window.location.href = 'Purchase page.html';
        closeProductCard();
    }
});

// ==== البحث ====
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.masonry-item').forEach(item => {
        const brand = item.querySelector('.brand-name span').textContent.toLowerCase();
        item.style.display = brand.includes(searchTerm) || searchTerm === '' ? 'block' : 'none';
    });
});

// ==== التصنيفات السريعة ====
document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
    });
});

// ==== تهيئة التطبيق ====
document.addEventListener('DOMContentLoaded', function() {
    generateProductGrid();
    updateCartCounter();
    
    setTimeout(() => {
        const messagesContainer = document.getElementById('chat-messages');
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message bella';
        welcomeMessage.innerHTML = `
            <div class="message-content">مرحباً بك في بيالة! 🪐 أنا بيلا، مساعدتك الشخصية في اكتشاف أفضل منتجات الموضة المصرية. كيف يمكنني مساعدتك اليوم؟</div>
            <div class="message-time">الآن</div>
        `;
        messagesContainer.appendChild(welcomeMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800);
    
    document.getElementById('home-page').classList.add('active');
    document.querySelector('[data-page="home"]').classList.add('active');
});


// ==== إدارة صفحة تعديل البيانات ====

// فتح صفحة تعديل البيانات
document.getElementById('edit-profile').addEventListener('click', function() {
    // إخفاء الصفحات الحالية
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    // إظهار صفحة تعديل البيانات
    document.getElementById('edit-profile-page').classList.add('active');
    
    // تحميل البيانات الحالية
    loadUserData();
});

// العودة إلى صفحة الإعدادات
document.getElementById('back-to-settings').addEventListener('click', function() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    document.getElementById('settings-page').classList.add('active');
    document.querySelector('[data-page="settings"]').classList.add('active');
});

// إلغاء التعديل
document.getElementById('cancel-edit').addEventListener('click', function() {
    if (confirm('هل تريد إلغاء التعديلات؟')) {
        document.getElementById('back-to-settings').click();
    }
});

// حفظ التغييرات
document.getElementById('save-changes').addEventListener('click', function() {
    saveUserData();
});

// تحميل بيانات المستخدم
function loadUserData() {
    // بيانات المستخدم (يمكن جلبها من localStorage أو API)
    const userData = {
        fullName: "أحمد محمد علي",
        phone: "+20 123 456 7890",
        email: "ahmed@example.com",
        location: "القاهرة، مصر",
        birthdate: "15/03/1995",
        gender: "male"
    };
    
    // تعبئة الحقول
    document.getElementById('full-name').value = userData.fullName;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('email').value = userData.email;
    document.getElementById('location').value = userData.location;
    document.getElementById('birthdate').value = userData.birthdate;
    
    // تحديد الجنس
    document.querySelector(`input[name="gender"][value="${userData.gender}"]`).checked = true;
}

// حفظ بيانات المستخدم
function saveUserData() {
    // جمع البيانات من الحقول
    const userData = {
        fullName: document.getElementById('full-name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        location: document.getElementById('location').value.trim(),
        birthdate: document.getElementById('birthdate').value.trim(),
        gender: document.querySelector('input[name="gender"]:checked').value
    };
    
    // التحقق من صحة البيانات
    if (!userData.fullName || !userData.phone || !userData.email) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showAlert('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // التحقق من كلمة المرور إذا تم تغييرها
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
            showAlert('يرجى إدخال كلمة المرور الحالية', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showAlert('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showAlert('كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        
        // هنا يمكنك إضافة التحقق من كلمة المرور الحالية مع الخادم
    }
    
    // حفظ البيانات في localStorage (أو إرسالها للخادم)
    localStorage.setItem('biyalaUserData', JSON.stringify(userData));
    
    // عرض رسالة النجاح
    showAlert('تم حفظ التغييرات بنجاح!');
    
    // تحديث صفحة الإعدادات
    updateSettingsPage(userData);
    
    // العودة إلى صفحة الإعدادات بعد ثانيتين
    setTimeout(() => {
        document.getElementById('back-to-settings').click();
    }, 2000);
}

// تحديث صفحة الإعدادات بالبيانات الجديدة
function updateSettingsPage(userData) {
    // تحديث القيم في صفحة الإعدادات
    document.querySelectorAll('.settings-value')[0].textContent = userData.fullName;
    document.querySelectorAll('.settings-value')[1].textContent = userData.phone;
    document.querySelectorAll('.settings-value')[2].textContent = userData.email;
    document.querySelectorAll('.settings-value')[3].textContent = userData.location;
    document.querySelectorAll('.settings-value')[4].textContent = userData.birthdate;
    document.querySelectorAll('.settings-value')[5].textContent = userData.gender === 'male' ? 'ذكر' : 'أنثى';
}

// عرض رسائل التنبيه
function showAlert(message, type = 'success') {
    // إنشاء عنصر التنبيه إذا لم يكن موجوداً
    let alertElement = document.querySelector('.alert-message');
    
    if (!alertElement) {
        alertElement = document.createElement('div');
        alertElement.className = 'alert-message';
        document.body.appendChild(alertElement);
    }
    
    // تعيين الرسالة والنوع
    alertElement.textContent = message;
    alertElement.className = `alert-message ${type}`;
    
    // إظهار التنبيه
    alertElement.style.display = 'block';
    
    // إخفاء التنبيه بعد 3 ثوانٍ
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// إدارة عرض كلمة المرور
document.querySelectorAll('.show-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
});

// إدارة صورة الملف الشخصي
document.getElementById('profile-pic-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
        showAlert('يرجى اختيار صورة فقط', 'error');
        return;
    }
    
    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
        return;
    }
    
    // عرض معاينة الصورة
    const reader = new FileReader();
    reader.onload = function(event) {
        const profilePic = document.getElementById('profile-pic');
        profilePic.innerHTML = '';
        profilePic.style.backgroundImage = `url(${event.target.result})`;
        profilePic.style.backgroundSize = 'cover';
        profilePic.style.backgroundPosition = 'center';
        
        // حفظ الصورة في localStorage
        localStorage.setItem('profilePicture', event.target.result);
        
        showAlert('تم تحديث الصورة بنجاح!');
    };
    reader.readAsDataURL(file);
});

// تحميل صورة الملف الشخصي المحفوظة
window.addEventListener('load', function() {
    const savedImage = localStorage.getItem('profilePicture');
    if (savedImage) {
        const profilePic = document.getElementById('profile-pic');
        profilePic.innerHTML = '';
        profilePic.style.backgroundImage = `url(${savedImage})`;
        profilePic.style.backgroundSize = 'cover';
        profilePic.style.backgroundPosition = 'center';
    }
});