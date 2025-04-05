// משתנים גלובליים
let currentStep = 1;
let referralCount = 0;
let basePrice = 3500;
let finalPrice = basePrice;
let referralDiscount = 0;
let registrationFee = 100;
let totalParticipants = 0;
let userReferralLink = '';

// אתחול האתר
document.addEventListener('DOMContentLoaded', function() {
    // יצירת קישור הפניה אקראי
    generateReferralLink();
    
    // הצגת השלב הראשון
    showStep(1);
    
    // אתחול הטיימר
    startCountdown();
    
    // אתחול גרף ויזואלי
    initializeGraph();
    
    // אתחול כפתורי שיתוף
    setupShareButtons();
    
    // אתחול כפתור העתקה
    setupCopyButton();
    
    // הוספת מאזינים לכפתורים
    setupEventListeners();
});

// פונקציה להצגת שלב מסוים
function showStep(stepNumber) {
    // הסתרת כל השלבים
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // הצגת השלב הנבחר
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStep = stepNumber;
        
        // עדכון סרגל ההתקדמות
        updateProgressBar(stepNumber);
        
        // אם זה שלב 2, עדכן את הנתונים
        if (stepNumber === 2) {
            updateUserArea();
        }
        
        // אם זה שלב 3, עדכן את הסיכום
        if (stepNumber === 3) {
            updateSummary();
        }
        
        // אם זה שלב 4, עדכן את התשלום
        if (stepNumber === 4) {
            updatePayment();
        }
        
        // גלילה לראש העמוד
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// פונקציה לעדכון סרגל ההתקדמות
function updateProgressBar(stepNumber) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        // מספר השלב הוא index + 1
        const stepNum = index + 1;
        
        // איפוס כל הסטטוסים
        step.classList.remove('active', 'completed');
        
        // אם זה השלב הנוכחי
        if (stepNum === stepNumber) {
            step.classList.add('active');
        }
        // אם זה שלב שכבר הושלם
        else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
}

// פונקציה ליצירת קישור הפניה אקראי
function generateReferralLink() {
    const randomId = Math.random().toString(36).substring(2, 8);
    userReferralLink = `https://groupbuy.co.il/?ref=${randomId}`;
    
    // עדכון כל שדות הקישור בדף
    const referralLinkInputs = document.querySelectorAll('.referral-link');
    referralLinkInputs.forEach(input => {
        input.value = userReferralLink;
    });
}

// פונקציה לעדכון האזור האישי (שלב 2)
function updateUserArea() {
    // עדכון כמות המשתתפים הכללית
    updateTotalParticipants();
    
    // עדכון מחיר בהתאם לכמות המשתתפים
    updatePriceBasedOnParticipants();
    
    // עדכון כמות ההפניות
    document.getElementById('referralCount').textContent = referralCount;
    
    // עדכון ההנחה שנצברה
    referralDiscount = referralCount * 150;
    document.getElementById('referralDiscount').textContent = `₪${referralDiscount}`;
    
    // עדכון המחיר הנוכחי
    document.getElementById('currentPrice').textContent = `₪${finalPrice}`;
    
    // עדכון הגרף הויזואלי
    updateGraph();
}

// פונקציה לעדכון כמות המשתתפים
function updateTotalParticipants() {
    // סימולציה של גידול במשתתפים לאורך זמן
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // נניח שהקמפיין התחיל לפני 5 ימים
    
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
    // נוסחה פשוטה לסימולציה של גידול
    totalParticipants = 50 + (daysPassed * 30);
    
    // הגבלה למקסימום 500 משתתפים
    totalParticipants = Math.min(totalParticipants, 500);
    
    // עדכון התצוגה
    document.getElementById('totalParticipants').textContent = totalParticipants;
}

// פונקציה לעדכון המחיר בהתאם לכמות המשתתפים
function updatePriceBasedOnParticipants() {
    if (totalParticipants >= 500) {
        finalPrice = 2850;
    } else if (totalParticipants >= 400) {
        finalPrice = 2900;
    } else if (totalParticipants >= 300) {
        finalPrice = 3000;
    } else if (totalParticipants >= 200) {
        finalPrice = 3250;
    } else if (totalParticipants >= 100) {
        finalPrice = 3500;
    } else {
        finalPrice = 3500;
    }
}

// פונקציה לעדכון הסיכום (שלב 3)
function updateSummary() {
    // עדכון כמות המשתתפים
    document.getElementById('summaryParticipants').textContent = totalParticipants;
    
    // עדכון המחיר הסופי לקבוצה
    document.getElementById('summaryGroupPrice').textContent = `₪${finalPrice}`;
    
    // עדכון תשלום ההרשמה
    document.getElementById('summaryRegistrationFee').textContent = `₪${registrationFee}`;
    
    // עדכון ההנחה שנצברה
    document.getElementById('summaryDiscount').textContent = `₪${referralDiscount}`;
    
    // חישוב היתרה לתשלום
    const remainingPayment = finalPrice - registrationFee - referralDiscount;
    document.getElementById('summaryRemainingPayment').textContent = `₪${remainingPayment}`;
}

// פונקציה לעדכון התשלום (שלב 4)
function updatePayment() {
    // חישוב היתרה לתשלום
    const remainingPayment = finalPrice - registrationFee - referralDiscount;
    document.getElementById('finalPayment').textContent = `₪${remainingPayment}`;
}

// פונקציה להוספת הפניה
function addReferral() {
    referralCount++;
    updateUserArea();
    
    // הצגת הודעת הצלחה
    showMessage('הפניה נוספה בהצלחה! ההנחה שלך גדלה ב-150 ש"ח');
}

// פונקציה להצגת הודעה
function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.add('show');
    
    // הסתרת ההודעה אחרי 3 שניות
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// פונקציה לאתחול הטיימר
function startCountdown() {
    // תאריך סיום הקמפיין - 31 יום מהיום
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 31);
    
    // עדכון הטיימר כל שנייה
    updateCountdown(endDate);
    setInterval(() => updateCountdown(endDate), 1000);
}

// פונקציה לעדכון הטיימר
function updateCountdown(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    // אם הקמפיין הסתיים
    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }
    
    // חישוב הזמן שנותר
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // עדכון התצוגה
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    // עדכון גם בשדה הימים הנותרים
    document.getElementById('daysRemaining').textContent = days;
}

// פונקציה לאתחול הגרף הויזואלי
function initializeGraph() {
    // יצירת הגרף
    const graphContainer = document.getElementById('discount-graph');
    
    // יצירת 6 שורות בגרף (0-5 הפניות)
    for (let i = 0; i <= 5; i++) {
        const discount = i * 150;
        const percentage = (discount / 3500) * 100; // אחוז ההנחה מהמחיר המקורי
        
        const graphBar = document.createElement('div');
        graphBar.className = 'graph-bar';
        graphBar.style.width = `${percentage}%`;
        graphBar.id = `graph-bar-${i}`;
        
        const graphLabel = document.createElement('div');
        graphLabel.className = 'graph-label';
        graphLabel.textContent = `${i} הפניות`;
        
        const graphValue = document.createElement('div');
        graphValue.className = 'graph-value';
        graphValue.textContent = `₪${discount}`;
        
        graphBar.appendChild(graphLabel);
        graphBar.appendChild(graphValue);
        graphContainer.appendChild(graphBar);
    }
}

// פונקציה לעדכון הגרף הויזואלי
function updateGraph() {
    // הדגשת השורה הרלוונטית בגרף
    const graphBars = document.querySelectorAll('.graph-bar');
    graphBars.forEach((bar, index) => {
        if (index === referralCount && index <= 5) {
            bar.classList.add('pulse');
        } else {
            bar.classList.remove('pulse');
        }
    });
}

// פונקציה לאתחול כפתורי שיתוף
function setupShareButtons() {
    // כפתור שיתוף בוואטסאפ
    document.getElementById('whatsapp-share').addEventListener('click', function() {
        const text = `הצטרפו איתי לרכישה קבוצתית של כורסת עיסוי במחיר מוזל! ${userReferralLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // כפתור שיתוף בפייסבוק
    document.getElementById('facebook-share').addEventListener('click', function() {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userReferralLink)}`;
        window.open(facebookUrl, '_blank');
    });
    
    // כפתור שיתוף בטלגרם
    document.getElementById('telegram-share').addEventListener('click', function() {
        const text = `הצטרפו איתי לרכישה קבוצתית של כורסת עיסוי במחיר מוזל! ${userReferralLink}`;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(userReferralLink)}&text=${encodeURIComponent(text)}`;
        window.open(telegramUrl, '_blank');
    });
}

// פונקציה לאתחול כפתור העתקה
function setupCopyButton() {
    document.getElementById('copy-link').addEventListener('click', function() {
        const referralLinkInput = document.querySelector('.referral-link');
        
        // העתקת הטקסט
        referralLinkInput.select();
        document.execCommand('copy');
        
        // הצגת הודעת הצלחה
        const copySuccess = document.getElementById('copy-success');
        copySuccess.classList.add('show');
        
        // הסתרת ההודעה אחרי 2 שניות
        setTimeout(() => {
            copySuccess.classList.remove('show');
        }, 2000);
    });
}

// פונקציה להוספת מאזינים לכפתורים
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // כפתורי מעבר בין שלבים
    const stepButtons = document.querySelectorAll('[data-step]');
    console.log('Found ' + stepButtons.length + ' step buttons');
    
    stepButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const stepNumber = parseInt(this.getAttribute('data-step'));
            console.log('Clicked button to go to step ' + stepNumber);
            showStep(stepNumber);
        });
    });
    
    // כפתור הוספת הפניה (לצורך הדגמה)
    const addReferralBtn = document.getElementById('add-referral');
    if (addReferralBtn) {
        addReferralBtn.addEventListener('click', function() {
            addReferral();
        });
    }
    
    // כפתור פתיחת מודאל מידע
    const infoBtn = document.getElementById('info-button');
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            document.getElementById('info-modal').classList.add('active');
        });
    }
    
    // כפתור סגירת מודאל
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('info-modal').classList.remove('active');
        });
    }
    
    // סגירת מודאל בלחיצה מחוץ לתוכן
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('info-modal');
        if (modal && event.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // הוספת מאזינים ישירים לכפתורים ספציפיים
    const joinNowBtn = document.querySelector('.cta[data-step="2"]');
    if (joinNowBtn) {
        console.log('Found join now button');
        joinNowBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Join now button clicked');
            showStep(2);
        };
    }
}

// פונקציה להחלפת התמונה הראשית
function changeMainImage(src) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        // הוספת אפקט התפוגגות לפני החלפת התמונה
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = src;
            mainImage.style.opacity = '1';
        }, 300);
    }
}

// פונקציה לסימולציה של תשלום
function simulatePayment() {
    // הצגת אנימציית טעינה
    document.getElementById('payment-button').textContent = 'מעבד תשלום...';
    document.getElementById('payment-button').disabled = true;
    
    // סימולציה של עיבוד תשלום
    setTimeout(() => {
        // מעבר לשלב האחרון
        showStep(5);
        
        // איפוס כפתור התשלום
        document.getElementById('payment-button').textContent = 'לתשלום מאובטח';
        document.getElementById('payment-button').disabled = false;
    }, 2000);
}
