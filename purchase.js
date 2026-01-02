// purchase.js - كود صفحة الشراء الكامل

// ==== تعريف المتغيرات ====
let purchaseState;

// ==== تهيئة حالة الطلب ====
function initializePurchaseState() {
    purchaseState = {
        currentStep: 1,
        totalSteps: 5,
        products: [],
        paymentMethod: 'vodafone',
        shippingAddress: '',
        signatureData: null,
        agreedToTerms: false,
        subtotal: 0,
        shipping: 50,
        discount: 50,
        total: 0
    };
}

// ==== تحميل بيانات المنتجات ====
function loadProductsFromStorage() {
    const savedProduct = localStorage.getItem('selectedProduct');
    const savedCart = localStorage.getItem('cartItems');
    
    if (savedProduct) {
        const product = JSON.parse(savedProduct);
        purchaseState.products = [product];
    } else if (savedCart) {
        purchaseState.products = JSON.parse(savedCart);
    } else {
        purchaseState.products = [{
            id: 1,
            name: "تيشيرت CLAZZY",
            brand: "CLAZZY",
            price: 500,
            image: "tshirt",
            selected: true
        }];
    }
    
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
        purchaseState.shippingAddress = savedAddress;
        const addressDisplay = document.getElementById('current-address-display');
        if (addressDisplay) {
            addressDisplay.textContent = savedAddress;
        }
    }
    
    calculatePrices();
    renderProducts();
}

// ==== حساب الأسعار ====
function calculatePrices() {
    const selectedProducts = purchaseState.products.filter(p => p.selected);
    purchaseState.subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    purchaseState.total = purchaseState.subtotal + purchaseState.shipping - purchaseState.discount;
    
    updatePriceDisplay('subtotal-price', purchaseState.subtotal);
    updatePriceDisplay('total-price', purchaseState.total);
    updatePriceDisplay('invoice-subtotal', purchaseState.subtotal);
    updatePriceDisplay('invoice-total', purchaseState.total);
    updatePriceDisplay('invoice-shipping', purchaseState.shipping);
    updatePriceDisplay('invoice-discount', -purchaseState.discount);
}

function updatePriceDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `$${value}`;
    }
}

// ==== عرض المنتجات ====
function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    productList.innerHTML = '';
    
    purchaseState.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-checkbox">
                <input type="checkbox" id="product-${product.id}" ${product.selected ? 'checked' : ''}>
            </div>
            <div class="product-image">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="product-details">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-brand">${product.brand}</div>
            </div>
            ${product.selected ? `<button class="remove-product" data-id="${product.id}">
                <i class="fas fa-times"></i>
            </button>` : ''}
        `;
        productList.appendChild(productItem);
    });
    
    document.querySelectorAll('.product-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const productId = parseInt(this.id.split('-')[1]);
            const product = purchaseState.products.find(p => p.id === productId);
            if (product) {
                product.selected = this.checked;
                calculatePrices();
                renderProducts();
            }
        });
    });
    
    document.querySelectorAll('.remove-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            purchaseState.products = purchaseState.products.filter(p => p.id !== productId);
            calculatePrices();
            renderProducts();
        });
    });
}

// ==== التنقل بين المراحل ====
function updateProgress() {
    const stepCircles = document.querySelectorAll('.step');
    if (!stepCircles.length) return;
    
    stepCircles.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < purchaseState.currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === purchaseState.currentStep) {
            step.classList.add('active');
        }
    });
}

function showCurrentStep() {
    const stepContents = document.querySelectorAll('.step-content');
    if (!stepContents.length) return;
    
    stepContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const currentStepContent = document.getElementById(`step${purchaseState.currentStep}`);
    if (currentStepContent) {
        currentStepContent.classList.add('active');
    }
    
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const confirmBtn = document.getElementById('confirm-order');
    
    if (prevBtn) prevBtn.classList.toggle('hidden', purchaseState.currentStep === 1);
    if (nextBtn) nextBtn.classList.toggle('hidden', purchaseState.currentStep === purchaseState.totalSteps);
    if (confirmBtn) confirmBtn.classList.toggle('hidden', purchaseState.currentStep !== purchaseState.totalSteps);
    
    updateProgress();
}

function goToPrevStep() {
    if (purchaseState.currentStep > 1) {
        purchaseState.currentStep--;
        showCurrentStep();
    }
}

function goToNextStep() {
    if (purchaseState.currentStep < purchaseState.totalSteps) {
        if (purchaseState.currentStep === 1) {
            const hasSelectedProducts = purchaseState.products.some(p => p.selected);
            if (!hasSelectedProducts) {
                showErrorMessage('يجب اختيار منتج واحد على الأقل للمتابعة');
                return;
            }
        } else if (purchaseState.currentStep === 3) {
            if (!purchaseState.shippingAddress || purchaseState.shippingAddress.trim() === '') {
                showErrorMessage('يجب تحديد عنوان التوصيل للمتابعة');
                return;
            }
        } else if (purchaseState.currentStep === 5) {
            const termsAgreed = document.getElementById('terms-agree')?.checked;
            if (!termsAgreed) {
                showErrorMessage('يجب الموافقة على الشروط والأحكام للمتابعة');
                return;
            }
        }
        
        purchaseState.currentStep++;
        showCurrentStep();
    }
}

// ==== طريقة الدفع ====
function setupPaymentMethods() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            purchaseState.paymentMethod = this.dataset.method;
        });
    });
}

// ==== العنوان ====
function getGovernorateName(value) {
    const governorates = {
        'cairo': 'القاهرة',
        'giza': 'الجيزة',
        'alexandria': 'الإسكندرية',
        'sharqia': 'الشرقية',
        'daqahlia': 'الدقهلية',
        'gharbia': 'الغربية'
    };
    return governorates[value] || value;
}

function setupAddressEvents() {
    const useCurrentBtn = document.getElementById('use-current-address');
    if (useCurrentBtn) {
        useCurrentBtn.addEventListener('click', function() {
            const currentAddress = document.getElementById('current-address-display').textContent;
            purchaseState.shippingAddress = currentAddress;
            showSuccessMessage('تم استخدام العنوان الحالي بنجاح');
        });
    }
    
    const saveAddressBtn = document.getElementById('save-new-address');
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', function() {
            const governorate = document.getElementById('governorate')?.value;
            const city = document.getElementById('city')?.value;
            const street = document.getElementById('street')?.value;
            const details = document.getElementById('details')?.value;
            
            if (!governorate || !city || !street) {
                showErrorMessage('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            let newAddress = `${city}, ${getGovernorateName(governorate)}`;
            if (street) newAddress += `, ${street}`;
            if (details) newAddress += `, ${details}`;
            
            const addressDisplay = document.getElementById('current-address-display');
            if (addressDisplay) {
                addressDisplay.textContent = newAddress;
            }
            purchaseState.shippingAddress = newAddress;
            
            showSuccessMessage('تم حفظ العنوان الجديد بنجاح');
            
            const cityInput = document.getElementById('city');
            const streetInput = document.getElementById('street');
            const detailsInput = document.getElementById('details');
            
            if (cityInput) cityInput.value = '';
            if (streetInput) streetInput.value = '';
            if (detailsInput) detailsInput.value = '';
        });
    }
}

// ==== التوقيع ====
function setupSignature() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    const paths = [];
    let currentPath = [];
    const signatureColor = '#FF6D1F';
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    function redrawSignature() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        paths.forEach(path => {
            if (path.length > 0) {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.strokeStyle = signatureColor;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        });
    }
    
    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getTouchPos(e);
        lastX = pos.x;
        lastY = pos.y;
        currentPath = [{x: lastX, y: lastY}];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const pos = getTouchPos(e);
        const x = pos.x;
        const y = pos.y;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = signatureColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        currentPath.push({x, y});
        lastX = x;
        lastY = y;
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            if (currentPath.length > 0) {
                paths.push([...currentPath]);
            }
        }
    }
    
    function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    canvas.addEventListener('touchmove', function(e) {
        if (isDrawing) {
            e.preventDefault();
        }
    }, { passive: false });
    
    const clearBtn = document.getElementById('clear-signature');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            paths.length = 0;
            currentPath = [];
        });
    }
    
    const undoBtn = document.getElementById('undo-signature');
    if (undoBtn) {
        undoBtn.addEventListener('click', function() {
            if (paths.length > 0) {
                paths.pop();
                redrawSignature();
            }
        });
    }
}

// ==== رسائل النظام ====
function addMessageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function showErrorMessage(message) {
    hideMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        left: 20px;
        background: rgba(237, 63, 39, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px rgba(237, 63, 39, 0.3);
        font-family: 'IBM Plex Sans Arabic', sans-serif;
    `;
    
    document.body.appendChild(errorDiv);
    setTimeout(hideMessages, 3000);
}

function showSuccessMessage(message) {
    hideMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-popup';
    successDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        left: 20px;
        background: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px rgba(46, 204, 113, 0.3);
        font-family: 'IBM Plex Sans Arabic', sans-serif;
    `;
    
    document.body.appendChild(successDiv);
    setTimeout(hideMessages, 3000);
}

function hideMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message-popup');
    messages.forEach(msg => {
        msg.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        }, 300);
    });
}

// ==== تأكيد الطلب ====
function confirmOrder() {
    const confirmDialog = document.getElementById('confirm-dialog');
    if (confirmDialog) {
        confirmDialog.style.display = 'flex';
    }
}

function sendOrder() {
    const confirmDialog = document.getElementById('confirm-dialog');
    if (confirmDialog) {
        confirmDialog.style.display = 'none';
    }
    
    const progressSteps = document.querySelector('.progress-steps');
    const stepButtons = document.getElementById('step-buttons');
    const stepContents = document.querySelectorAll('.step-content');
    const successMessage = document.getElementById('success-message');
    
    if (progressSteps) progressSteps.style.display = 'none';
    if (stepButtons) stepButtons.style.display = 'none';
    stepContents.forEach(content => content.style.display = 'none');
    if (successMessage) successMessage.style.display = 'block';
    
    console.log('تم إرسال الطلب:', {
        products: purchaseState.products.filter(p => p.selected),
        payment: purchaseState.paymentMethod,
        address: purchaseState.shippingAddress,
        total: purchaseState.total,
        timestamp: new Date().toISOString()
    });
}

// ==== التنقل ====
function backToHome() {
    window.removeEventListener('beforeunload', () => {});
    window.location.href = 'index.html';
}


// ==== رسالة تأكيد عند الخروج ====
function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    hideMessages();
    
    const dialog = document.createElement('div');
    dialog.className = 'biyala-confirm-dialog';
    
    dialog.innerHTML = `
        <div class="dialog-overlay"></div>
        <div class="dialog-content">
            <div class="dialog-header">
                <i class="fas fa-question-circle"></i>
                <h3>${title}</h3>
            </div>
            <div class="dialog-body">
                <p>${message}</p>
            </div>
            <div class="dialog-footer">
                <button class="dialog-btn cancel-btn">
                    <i class="fas fa-times"></i> إلغاء
                </button>
                <button class="dialog-btn confirm-btn">
                    <i class="fas fa-check"></i> تأكيد
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    const style = document.createElement('style');
    style.textContent = `
        .biyala-confirm-dialog {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .biyala-confirm-dialog .dialog-overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(12, 15, 23, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .biyala-confirm-dialog .dialog-content {
            background: #161B26;
            border-radius: 20px;
            padding: 25px;
            max-width: 400px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            position: relative;
        }
        
        .biyala-confirm-dialog .dialog-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .biyala-confirm-dialog .dialog-header i {
            font-size: 40px;
            color: #FF6D1F;
            margin-bottom: 15px;
        }
        
        .biyala-confirm-dialog .dialog-header h3 {
            color: #E6E6E6;
            font-size: 20px;
            margin: 0;
            font-weight: 600;
        }
        
        .biyala-confirm-dialog .dialog-body p {
            color: #B0B5C2;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 25px;
            font-size: 15px;
        }
        
        .biyala-confirm-dialog .dialog-footer {
            display: flex;
            gap: 12px;
        }
        
        .biyala-confirm-dialog .dialog-btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            font-weight: 600;
            cursor: pointer;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .biyala-confirm-dialog .cancel-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #E6E6E6;
        }
        
        .biyala-confirm-dialog .cancel-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .biyala-confirm-dialog .confirm-btn {
            background: #FF6D1F;
            color: #0C0F17;
        }
        
        .biyala-confirm-dialog .confirm-btn:hover {
            background: #FF8A4D;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const confirmBtn = dialog.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(dialog);
        document.head.removeChild(style);
        if (onCancel) onCancel();
    });
    
    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(dialog);
        document.head.removeChild(style);
        onConfirm();
    });
}

// ==== إغلاق صفحة الشراء ====
function closePurchase() {
    showConfirmDialog(
        'تأكيد الخروج',
        'سيتم فقد بيانات الشراء الحالية. هل تريد المتابعة؟',
        function() {
            // عند التأكيد - استدعاء دالة الرجوع للبيت
            backToHome();
        },
        function() {
            // عند الإلغاء
            console.log('تم الإبقاء على صفحة الشراء');
        }
    );
}

// ==== إعداد الأزرار ====
function setupButtons() {
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const confirmBtn = document.getElementById('confirm-order');
    const closeBtn = document.getElementById('close-purchase');
    const cancelConfirmBtn = document.getElementById('cancel-confirm');
    const confirmSendBtn = document.getElementById('confirm-send');
    const backToHomeBtn = document.getElementById('back-to-home');
    
    if (prevBtn) prevBtn.addEventListener('click', goToPrevStep);
    if (nextBtn) nextBtn.addEventListener('click', goToNextStep);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closePurchase();
        });
    }
    if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', () => {
        const confirmDialog = document.getElementById('confirm-dialog');
        if (confirmDialog) confirmDialog.style.display = 'none';
    });
    if (confirmSendBtn) confirmSendBtn.addEventListener('click', sendOrder);
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', backToHome);
}

// ==== تهيئة الصفحة ====
function initPurchasePage() {
    addMessageStyles();
    initializePurchaseState();
    loadProductsFromStorage();
    showCurrentStep();
    setupPaymentMethods();
    setupSignature();
    setupAddressEvents();
    setupButtons();
    
    setTimeout(() => {
        showSuccessMessage('مرحباً! ابدأ باختيار المنتجات وتأكيد العنوان');
    }, 10);
}

// ==== بدء التطبيق ====
document.addEventListener('DOMContentLoaded', initPurchasePage);