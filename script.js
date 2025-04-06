// משתנים גלובליים
let currentStep = 1;
let referralCount = 0;
let basePrice = 3900;
let finalPrice = basePrice;
let referralDiscount = 0;
let registrationFee = 100;
let totalParticipants = 150;
let userReferralLink = '';
let userReferralCode = '';

// אתחול האתר
// משתנה גלובלי לרשימת המצטרפים
let initialParticipantsList = [];

// פונקציה גלובלית לסנכרון מספר המשתתפים והמחיר בכל הדפים
function syncParticipantsAndPrice() {
    // עדכון המחיר בהתאם לכמות המשתתפים
    updatePriceBasedOnParticipants();
}

// פונקציה לעדכון כל המחירים בכל הדפים באופן אוטומטי
function updateAllPricesInAllPages() {
    // עדכון המידע בדף 1 (דף הנחיתה)
    const currentParticipantsElement = document.getElementById('current-participants');
    const currentPriceElement = document.getElementById('current-price');
    
    if (currentParticipantsElement) {
        currentParticipantsElement.textContent = totalParticipants;
    }
    
    if (currentPriceElement) {
        currentPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // עדכון המידע בדף 2 (מילוי פרטים)
    const totalParticipantsElement = document.getElementById('totalParticipants');
    const currentPriceElement2 = document.getElementById('currentPrice');
    
    if (totalParticipantsElement) {
        totalParticipantsElement.textContent = totalParticipants;
    }
    
    if (currentPriceElement2) {
        currentPriceElement2.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // עדכון המידע בדף 3 (סיכום)
    const summaryParticipantsElement = document.getElementById('summaryParticipants');
    const summaryGroupPriceElement = document.getElementById('summaryGroupPrice');
    
    if (summaryParticipantsElement) {
        summaryParticipantsElement.textContent = totalParticipants;
    }
    
    if (summaryGroupPriceElement) {
        summaryGroupPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // חישוב היתרה לתשלום בדף הסיכום
    const remainingPayment = finalPrice - registrationFee - referralDiscount;
    const summaryRemainingPaymentElement = document.getElementById('summaryRemainingPayment');
    
    if (summaryRemainingPaymentElement) {
        summaryRemainingPaymentElement.textContent = `₪${Math.max(0, remainingPayment).toLocaleString()}`;
    }
}

// פונקציה ליצירת קישור הפניה אקראי
function generateReferralLink() {
    // יצירת קוד הפניה אקראי בן 6 תווים
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < 6; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // שמירת הקוד במשתנה גלובלי
    userReferralCode = referralCode;
    
    // יצירת הקישור המלא
    const baseUrl = 'https://vipoconnect.github.io/';
    userReferralLink = `${baseUrl}?ref=${referralCode}`;
    
    // עדכון הקישור בדף הסיכום אם האלמנט קיים
    const referralLinkInput = document.getElementById('referral-link');
    if (referralLinkInput) {
        referralLinkInput.value = userReferralLink;
    }
}

// פונקציה להתקנת כפתור העתקת הקישור
function setupCopyButton() {
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const referralLinkInput = document.getElementById('referral-link');
            if (referralLinkInput) {
                // בחירת הטקסט בתיבה
                referralLinkInput.select();
                referralLinkInput.setSelectionRange(0, 99999); // למכשירים ניידים
                
                // העתקת הטקסט ללוח
                document.execCommand('copy');
                
                // שינוי טקסט הכפתור לאישור
                const originalText = copyLinkBtn.textContent;
                copyLinkBtn.textContent = 'הועתק!';
                
                // החזרת הטקסט המקורי לאחר 2 שניות
                setTimeout(function() {
                    copyLinkBtn.textContent = originalText;
                }, 2000);
                
                // הצגת הודעה
                showMessage('הקישור הועתק בהצלחה!', 'success');
            }
        });
    }
}

// פונקציה להתקנת כפתורי שיתוף בדף הסיכום
function setupSummaryShareButtons() {
    // שיתוף בווטסאפ
    const summaryWhatsappShare = document.getElementById('summary-whatsapp-share');
    if (summaryWhatsappShare) {
        summaryWhatsappShare.addEventListener('click', function() {
            const message = `הצטרפתי לרכישה קבוצתית של כורסת עיסוי במחיר משתלם! הצטרפו גם אתם ותקבלו מחיר משתלם במיוחד: ${userReferralLink}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // שיתוף בפייסבוק
    const summaryFacebookShare = document.getElementById('summary-facebook-share');
    if (summaryFacebookShare) {
        summaryFacebookShare.addEventListener('click', function() {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userReferralLink)}`;
            window.open(facebookUrl, '_blank');
        });
    }
    
    // שיתוף בטלגרם
    const summaryTelegramShare = document.getElementById('summary-telegram-share');
    if (summaryTelegramShare) {
        summaryTelegramShare.addEventListener('click', function() {
            const message = `הצטרפתי לרכישה קבוצתית של כורסת עיסוי במחיר משתלם! הצטרפו גם אתם:`;
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(userReferralLink)}&text=${encodeURIComponent(message)}`;
            window.open(telegramUrl, '_blank');
        });
    }
}

// פונקציה להצגת חלון הסיסמה
function showPasswordPrompt() {
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    
    // איפוס שדה הסיסמה והסתרת הודעת שגיאה
    passwordInput.value = '';
    passwordError.style.display = 'none';
    
    // הצגת המודאל
    passwordModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // מניעת גלילה ברקע
    
    // מיקוד על שדה הסיסמה
    setTimeout(() => {
        passwordInput.focus();
    }, 100);
}

// פונקציה לבדיקת הסיסמה ומעבר לשלב התשלום
function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    const passwordModal = document.getElementById('password-modal');
    
    // בדיקת הסיסמה
    if (passwordInput.value === '1234') {
        // סיסמה נכונה - סגירת המודאל ומעבר לשלב התשלום
        passwordModal.style.display = 'none';
        document.body.style.overflow = ''; // החזרת הגלילה
        
        // מעבר לשלב התשלום
        showStep(4);
    } else {
        // סיסמה שגויה - הצגת הודעת שגיאה
        passwordError.style.display = 'block';
        passwordInput.focus();
    }
}

// פונקציה לאתחול חלון הסיסמה
function setupPasswordModal() {
    const closePasswordModal = document.getElementById('close-password-modal');
    const passwordModal = document.getElementById('password-modal');
    const submitPassword = document.getElementById('submit-password');
    const passwordInput = document.getElementById('password-input');
    
    // סגירת המודאל בלחיצה על X
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', function() {
            passwordModal.style.display = 'none';
            document.body.style.overflow = ''; // החזרת הגלילה
        });
    }
    
    // סגירת המודאל בלחיצה מחוץ לתוכן
    window.addEventListener('click', function(event) {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
            document.body.style.overflow = ''; // החזרת הגלילה
        }
    });
    
    // בדיקת הסיסמה בלחיצה על כפתור האישור
    if (submitPassword) {
        submitPassword.addEventListener('click', checkPassword);
    }
    
    // בדיקת הסיסמה בלחיצה על Enter
    if (passwordInput) {
        passwordInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
}

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
    
    // אתחול כפתורי שיתוף בדף הסיכום
    setupSummaryShareButtons();
    
    // אתחול חלון הסיסמה
    setupPasswordModal();
    
    // הוספת מאזינים לכפתורים
    setupEventListeners();
    
    // אתחול טופס מילוי פרטים
    setupUserDetailsForm();
    
    // עדכון מספר הנרשמים והמחיר הנוכחי
    updateParticipantsCounter();
    
    // אתחול כפתור רשימת המצטרפים
    setupParticipantsListModal();
    
    // יצירת רשימת המצטרפים הראשונים
    generateInitialParticipantsList();
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
        
        // אם זה שלב 2, אתחל את טופס מילוי הפרטים
        if (stepNumber === 2) {
            // אין צורך לעשות כלום מיוחד כי הטופס כבר מוצג
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
    
    // עדכון כמות ההפניות
    document.getElementById('referralCount').textContent = referralCount;
    
    // עדכון ההנחה שנצברה
    referralDiscount = referralCount * 150;
    document.getElementById('referralDiscount').textContent = `₪${referralDiscount}`;
    
    // סנכרון מספר המשתתפים והמחיר בכל הדפים
    syncParticipantsAndPrice();
    
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
    
    // סנכרון מספר המשתתפים והמחיר בכל הדפים
    syncParticipantsAndPrice();
}

// פונקציה לעדכון המחיר בהתאם לכמות המשתתפים
function updatePriceBasedOnParticipants() {
    // טבלת מחירים לפי מספר משתתפים
    const priceTable = [
        { participants: 500, price: 2850 },
        { participants: 400, price: 2900 },
        { participants: 300, price: 3000 },
        { participants: 200, price: 3250 },
        { participants: 100, price: 3500 },
        { participants: 0, price: 3900 }
    ];
    
    // מציאת המחיר המתאים לפי מספר המשתתפים
    for (const entry of priceTable) {
        if (totalParticipants >= entry.participants) {
            finalPrice = entry.price;
            break;
        }
    }
    
    // עדכון המחיר בכל הדפים
    updateAllPricesInAllPages();
}

// פונקציה לעדכון הסיכום (שלב 3)
function updateSummary() {
    // סנכרון מספר המשתתפים והמחיר בכל הדפים
    syncParticipantsAndPrice();
    
    // עדכון תשלום ההרשמה
    document.getElementById('summaryRegistrationFee').textContent = `₪${registrationFee.toLocaleString()}`;
    
    // עדכון ההנחה שנצברה
    document.getElementById('summaryDiscount').textContent = `₪${referralDiscount.toLocaleString()}`;
    
    // בדיקה אם הקמפיין הסתיים
    const now = new Date();
    const campaignEnded = window.campaignEndDate && now >= window.campaignEndDate;
    
    // עדכון כפתור התשלום בהתאם
    const paymentButton = document.getElementById('payment-proceed-btn');
    if (paymentButton) {
        paymentButton.disabled = !campaignEnded;
        
        // הצגת או הסתרת הודעת הטיימר
        const timerMessage = document.getElementById('timer-message');
        if (timerMessage) {
            timerMessage.style.display = campaignEnded ? 'none' : 'block';
        }
    }
}

// פונקציה לעדכון התשלום (שלב 4)
function updatePayment() {
    // חישוב היתרה לתשלום
    const remainingPayment = finalPrice - registrationFee - referralDiscount;
    document.getElementById('finalPayment').textContent = `₪${Math.max(0, remainingPayment).toLocaleString()}`;
}

// פונקציה להוספת הפניה
function addReferral() {
    referralCount++;
    
    // עדכון ההנחה שנצברה
    referralDiscount = referralCount * 150;
    
    // עדכון התצוגה
    document.getElementById('referralCount').textContent = referralCount;
    document.getElementById('referralDiscount').textContent = `₪${referralDiscount.toLocaleString()}`;
    
    // הצגת הודעת הצלחה
    showMessage('הפניה נוספה בהצלחה! ההנחה שלך גדלה ב-150 ש"ח');
}

// פונקציה להצגת הודעה
function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('message');
    if (!messageElement) {
        console.error('אלמנט ההודעה לא נמצא');
        return;
    }
    
    // הסרת כל המחלקות הקודמות
    messageElement.classList.remove('error', 'success');
    
    // הוספת מחלקה לפי סוג ההודעה
    if (type === 'error') {
        messageElement.classList.add('error');
    }
    
    messageElement.textContent = message;
    messageElement.classList.add('show');
    
    // הסתרת ההודעה אחרי 3 שניות
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
    
    // החזרת ההודעה לצורך שרשור פונקציות
    return message;
}

// פונקציה לאתחול הטיימר
function startCountdown() {
    // תאריך סיום הקמפיין - 31 יום מהיום
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 31);
    
    // שמירת תאריך הסיום כמשתנה גלובלי
    window.campaignEndDate = endDate;
    
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
        // עדכון הטיימר הראשי
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        
        // עדכון הטיימר בשלב הסיכום
        if (document.getElementById('summary-days')) {
            document.getElementById('summary-days').textContent = '0';
            document.getElementById('summary-hours').textContent = '0';
            document.getElementById('summary-minutes').textContent = '0';
            document.getElementById('summary-seconds').textContent = '0';
        }
        
        // הפעלת כפתור התשלום
        const paymentButton = document.getElementById('payment-proceed-btn');
        if (paymentButton) {
            paymentButton.disabled = false;
            
            // הסתרת הודעת הטיימר
            const timerMessage = document.getElementById('timer-message');
            if (timerMessage) {
                timerMessage.style.display = 'none';
            }
        }
        
        return;
    }
    
    // חישוב הזמן שנותר
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // עדכון התצוגה בטיימר הראשי
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    // עדכון התצוגה בטיימר של שלב הסיכום
    if (document.getElementById('summary-days')) {
        document.getElementById('summary-days').textContent = days;
        document.getElementById('summary-hours').textContent = hours;
        document.getElementById('summary-minutes').textContent = minutes;
        document.getElementById('summary-seconds').textContent = seconds;
        
        // וידוא שכפתור התשלום מושבת כל עוד הטיימר רץ
        const paymentButton = document.getElementById('payment-proceed-btn');
        if (paymentButton) {
            paymentButton.disabled = true;
            
            // הצגת הודעת הטיימר
            const timerMessage = document.getElementById('timer-message');
            if (timerMessage) {
                timerMessage.style.display = 'block';
            }
        }
    }
    
    // עדכון גם בשדה הימים הנותרים
    if (document.getElementById('daysRemaining')) {
        document.getElementById('daysRemaining').textContent = days;
    }
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
    });
}

// פונקציה לסימולציה של הצטרפות משתתפים חדשים בזמן אמת
function startRealTimeParticipantsSimulation() {
    // הגדרת משתנה גלובלי לזיהוי האינטרוול
    window.participantsSimulationInterval = setInterval(function() {
        // הגרלת מספר אקראי בין 0 ל-2 לקביעת האם יצטרף משתתף חדש
        const randomChance = Math.floor(Math.random() * 3); // 0, 1, או 2
        
        // בסיכוי של 1/3 יצטרף משתתף חדש
        if (randomChance === 0) {
            // הוספת משתתף חדש
            totalParticipants++;
            
            // עדכון המחיר בהתאם למספר המשתתפים החדש
            updatePriceBasedOnParticipants();
            
            // יצירת שם אקראי למשתתף החדש
            const randomFirstNames = ["יוסי", "דני", "מיכל", "רות", "אילן", "שירה", "אור", "יעל", "אבי", "גיל"];
            const randomLastNames = ["כהן", "לוי", "אברהם", "שרון", "דוד", "חיים", "שמש", "אדלר", "פרץ", "אזולאי"];
            
            const randomFirstName = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
            const randomLastName = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
            
            // הוספת המשתתף החדש לרשימת המשתתפים אם היא מוצגת
            const participantsList = document.getElementById('participants-list');
            if (participantsList) {
                const newParticipant = document.createElement('li');
                const joinTime = new Date();
                const timeString = joinTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
                newParticipant.textContent = `${randomFirstName} ${randomLastName} - הצטרף/ה בשעה ${timeString}`;
                participantsList.appendChild(newParticipant);
            }
            
            // הצגת הודעה קטנה על הצטרפות משתתף חדש
            showNewParticipantNotification(randomFirstName, randomLastName);
        }
    }, 5000); // בדיקה כל 5 שניות
}

// פונקציה להצגת הודעה קטנה על הצטרפות משתתף חדש
function showNewParticipantNotification(firstName, lastName) {
    // בדיקה אם כבר קיים אלמנט להודעות
    let notificationContainer = document.getElementById('notification-container');
    
    // אם האלמנט לא קיים, ניצור אותו
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.left = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // יצירת הודעה חדשה
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.marginTop = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    notification.style.direction = 'rtl';
    notification.textContent = `${firstName} ${lastName} הצטרף/ה לרכישה הקבוצתית!`;
    
    // הוספת ההודעה למכל
    notificationContainer.appendChild(notification);
    
    // הצגת ההודעה באנימציה
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // הסרת ההודעה לאחר 3 שניות
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 3000);
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
    const joinNowBtn = document.getElementById('join-now-btn');
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

// פונקציה לאתחול טופס מילוי פרטים
function setupUserDetailsForm() {
    const form = document.getElementById('user-details-form');
    if (!form) return;
    
    const submitButton = document.getElementById('submit-details-btn');
    if (!submitButton) return;
    
    // הוספת מאזין לשליחת הטופס
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // בדיקת תקינות הטופס
        if (!validateForm()) {
            return;
        }
        
        // שמירת פרטי המשתמש
        saveUserDetails();
        
        // הצגת הודעת הצלחה
        showMessage('הפרטים נשמרו בהצלחה!');
        
        // מעבר לשלב הבא
        setTimeout(() => {
            showStep(3);
        }, 1500);
    });
    
    // פונקציה לבדיקת תקינות הטופס
    function validateForm() {
        // בדיקת שדות חובה
        const requiredFields = [
            'first-name',
            'last-name',
            'phone',
            'email',
            'city',
            'street',
            'house-number'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // בדיקת תקינות דוא"ל
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !validateEmail(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
        }
        
        // בדיקת תקינות טלפון
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim() && !validatePhone(phoneField.value)) {
            phoneField.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) {
            showMessage('אנא מלא את כל השדות המסומנים ב-*', 'error');
        }
        
        return isValid;
    }
    
    // פונקציה לבדיקת תקינות דוא"ל
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // פונקציה לבדיקת תקינות טלפון
    function validatePhone(phone) {
        // מספר טלפון ישראלי - 9-10 ספרות
        const re = /^0[2-9]\d{7,8}$/;
        return re.test(phone);
    }
    
    // פונקציה לשמירת פרטי המשתמש
    function saveUserDetails() {
        // יצירת אובייקט עם פרטי המשתמש
        const userDetails = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            street: document.getElementById('street').value,
            houseNumber: document.getElementById('house-number').value,
            deliveryMethod: document.querySelector('input[name="delivery-method"]:checked').value
        };
        
        // שמירת הפרטים ב-localStorage (לצורך הדגמה)
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        
        console.log('User details saved:', userDetails);
    }
}

// פונקציה לעדכון מונה הנרשמים והמחיר הנוכחי
function updateParticipantsCounter() {
    // עדכון מספר הנרשמים בדף
    const participantsElement = document.getElementById('current-participants');
    if (participantsElement) {
        participantsElement.textContent = totalParticipants;
    }
    
    // חישוב המחיר הנוכחי לפי טבלת המחירים
    let currentPrice = 3900; // מחיר בסיסי
    
    if (totalParticipants >= 550) {
        currentPrice = 2900;
    } else if (totalParticipants >= 450) {
        currentPrice = 3150;
    } else if (totalParticipants >= 350) {
        currentPrice = 3400;
    } else if (totalParticipants >= 250) {
        currentPrice = 3650;
    } else if (totalParticipants >= 150) {
        currentPrice = 3900;
    }
    
    // עדכון המחיר הנוכחי בדף
    const priceElement = document.getElementById('current-price');
    if (priceElement) {
        priceElement.textContent = `₪${currentPrice.toLocaleString()}`;
    }
    
    // עדכון המחיר הסופי במשתנה הגלובלי
    finalPrice = currentPrice;
}

// פונקציה לטיפול בשליחת טופס פרטי המשתמש
function submitUserDetails() {
    console.log('בודק טופס פרטים...');
    
    // בדיקת תקינות הטופס
    const requiredFields = [
        'first-name',
        'last-name',
        'phone',
        'email',
        'city',
        'street',
        'house-number'
    ];
    
    let isValid = true;
    
    // בדיקת שדות חובה
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // בדיקת תקינות דוא"ל
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
        }
    }
    
    // בדיקת תקינות טלפון
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value.trim()) {
        const phoneRegex = /^0[2-9]\d{7,8}$/;
        if (!phoneRegex.test(phoneField.value)) {
            phoneField.classList.add('error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showMessage('אנא מלא את כל השדות המסומנים ב-*', 'error');
        return;
    }
    
    try {
        // בדיקת שיטת משלוח נבחרה
        let deliveryMethod = "";
        const deliveryMethodRadios = document.querySelectorAll('input[name="delivery-method"]');
        let deliveryMethodSelected = false;
        
        // בדיקה ידנית של כל הרדיו באטום
        for (let i = 0; i < deliveryMethodRadios.length; i++) {
            if (deliveryMethodRadios[i].checked) {
                deliveryMethod = deliveryMethodRadios[i].value;
                deliveryMethodSelected = true;
                break;
            }
        }
        
        if (!deliveryMethodSelected) {
            showMessage('אנא בחר שיטת משלוח', 'error');
            return;
        }
        
        // שמירת פרטי המשתמש
        const userDetails = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            street: document.getElementById('street').value,
            houseNumber: document.getElementById('house-number').value,
            deliveryMethod: deliveryMethod
        };
        
        // שמירת הפרטים ב-localStorage (לצורך הדגמה)
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        console.log('User details saved:', userDetails);
        
        // הגדלת מספר הנרשמים ב-1
        totalParticipants++;
        
        // עדכון מונה הנרשמים והמחיר הנוכחי
        updateParticipantsCounter();
        
        // הכנת קישור ווצאפ עם פרטי הנרשם
        sendWhatsAppNotification(userDetails);
        
        // הצגת הודעת הצלחה
        showMessage('הפרטים נשמרו בהצלחה!');
        
        // מעבר לשלב הבא - השהייה קצרה להצגת ההודעה
        setTimeout(function() {
            // הצגת שלב 3 באופן מפורש
            const steps = document.querySelectorAll('.step');
            steps.forEach(step => {
                step.classList.remove('active');
            });
            
            const step3Element = document.getElementById('step3');
            if (step3Element) {
                step3Element.classList.add('active');
                currentStep = 3;
                
                // עדכון סרגל ההתקדמות
                updateProgressBar(3);
                
                // עדכון הסיכום
                updateSummary();
                
                // גלילה לראש העמוד
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 1500);
    } catch (error) {
        console.error('Error in submitUserDetails:', error);
        showMessage('אירעה שגיאה בשמירת הפרטים. אנא נסה שוב.', 'error');
    }
}

// פונקציה לשליחת הודעת ווצאפ עם פרטי הנרשם
function sendWhatsAppNotification(userDetails) {
    try {
        // מספר הטלפון שיקבל את ההודעה
        const adminPhone = '972587009938'; // המספר שסיפקת, עם קידומת ישראל
        
        // בניית הודעה עם פרטי הנרשם
        let message = `נרשם חדש לרכישה קבוצתית!%0A%0A`;
        message += `שם: ${userDetails.firstName} ${userDetails.lastName}%0A`;
        message += `טלפון: ${userDetails.phone}%0A`;
        message += `אימייל: ${userDetails.email}%0A`;
        message += `כתובת: ${userDetails.city}, ${userDetails.street} ${userDetails.houseNumber}%0A`;
        message += `אופן קבלה: ${userDetails.deliveryMethod === 'self-pickup' ? 'איסוף עצמי' : 'התקנה והובלה בתשלום'}%0A%0A`;
        message += `מספר נרשמים נוכחי: ${totalParticipants}%0A`;
        message += `מחיר נוכחי: ₪${finalPrice.toLocaleString()}`;
        
        // יצירת קישור לשליחת הודעת ווצאפ
        const whatsappLink = `https://wa.me/${adminPhone}?text=${message}`;
        
        // שמירת הקישור במשתנה גלובלי לצורך בדיקה
        window.lastWhatsAppLink = whatsappLink;
        
        // יצירת כפתור ווצאפ בשלב הסיכום
        setTimeout(() => {
            // בדיקה אם אנחנו בשלב הסיכום
            if (currentStep === 3) {
                // בדיקה אם הכפתור כבר קיים
                let whatsappButton = document.getElementById('whatsapp-admin-button');
                if (!whatsappButton) {
                    // מציאת כפתור התשלום כדי להוסיף לידו את כפתור הווצאפ
                    const paymentButton = document.getElementById('payment-proceed-btn');
                    if (paymentButton && paymentButton.parentNode) {
                        // יצירת כפתור חדש
                        whatsappButton = document.createElement('button');
                        whatsappButton.id = 'whatsapp-admin-button';
                        whatsappButton.className = 'whatsapp-button';
                        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i> שלח פרטים לאיש קשר';
                        whatsappButton.onclick = function() {
                            window.open(whatsappLink, '_blank');
                        };
                        
                        // הוספת הכפתור לפני כפתור התשלום
                        paymentButton.parentNode.insertBefore(whatsappButton, paymentButton);
                    }
                }
            }
        }, 1000);
        
        console.log('נשמר קישור ווצאפ עם פרטי הנרשם:', userDetails);
        console.log('קישור הווצאפ:', whatsappLink);
    } catch (error) {
        console.error('שגיאה בשליחת הודעת ווצאפ:', error);
    }
}

// פונקציה לאתחול כפתור רשימת המצטרפים והמודאל
function setupParticipantsListModal() {
    // הוספת מאזין לכפתור רשימת המצטרפים
    const participantsListBtn = document.getElementById('participants-list-btn');
    const participantsModal = document.getElementById('participants-modal');
    const closeParticipantsModal = document.getElementById('close-participants-modal');
    const participantsSearchInput = document.getElementById('participants-search-input');
    
    if (participantsListBtn && participantsModal) {
        // פתיחת המודאל בלחיצה על הכפתור
        participantsListBtn.addEventListener('click', function(e) {
            e.preventDefault(); // מניעת התנהגות ברירת מחדל
            participantsModal.style.display = 'block';
            // ווידוא שהמודאל נראה גם במובייל
            document.body.style.overflow = 'hidden'; // מניעת גלילה ברקע
            
            // הצגת הרשימה רק אחרי שהמודאל מוצג
            setTimeout(() => {
                displayParticipantsList(initialParticipantsList);
            }, 50);
        });
        
        // סגירת המודאל בלחיצה על X
        if (closeParticipantsModal) {
            closeParticipantsModal.addEventListener('click', function() {
                participantsModal.style.display = 'none';
                document.body.style.overflow = ''; // החזרת הגלילה
            });
        }
        
        // סגירת המודאל בלחיצה מחוץ לתוכן
        window.addEventListener('click', function(event) {
            if (event.target === participantsModal) {
                participantsModal.style.display = 'none';
                document.body.style.overflow = ''; // החזרת הגלילה
            }
        });
        
        // חיפוש ברשימת המצטרפים
        if (participantsSearchInput) {
            participantsSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.trim().toLowerCase();
                const filteredList = initialParticipantsList.filter(participant => {
                    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
                    return fullName.includes(searchTerm);
                });
                displayParticipantsList(filteredList);
            });
        }
    }
}

// פונקציה ליצירת רשימת המצטרפים הראשונים
function generateInitialParticipantsList() {
    // שמות פרטיים נפוצים בציבור החרדי והדתי
    const firstNames = [
        'משה', 'יעקב', 'אברהם', 'יצחק', 'יוסף', 'דוד', 'חיים', 'יהודה', 'ישראל', 'שמואל',
        'אהרן', 'אליהו', 'נתנאל', 'יהושע', 'דניאל', 'שלמה', 'מנחם', 'אריה', 'אלעזר', 'מרדכי',
        'שרה', 'רחל', 'לאה', 'חנה', 'אסתר', 'ריקי', 'מיכל', 'יפה', 'חיה', 'רבקה',
        'אילה', 'ציפורה', 'בתיה', 'טובה', 'שירה', 'שיפרה', 'אביגיל', 'אדל', 'ברכה', 'גאולה'
    ];
    
    // שמות משפחה נפוצים בציבור החרדי והדתי
    const lastNames = [
        'כהן', 'לוי', 'פרידמן', 'שפירא', 'רוזנברג', 'גולדברג', 'גרינברג', 'הורביץ', 'שטרן', 'שוארץ',
        'ברקוביץ', 'גליקמן', 'וייס', 'פרץ', 'ביטון', 'אברמוביץ', 'רוזנפלד', 'קליין', 'פישר', 'רובין',
        'ברון', 'גולד', 'שפירא', 'שולמן', 'רוזנבלום', 'הירש', 'בלום', 'פלדמן', 'קרליבך', 'ברנשטיין',
        'אייזנשטיין', 'פינקלשטיין', 'גרינשטיין', 'שיף', 'ברק', 'ציון', 'אבוחצירא', 'אדלשטיין', 'אוירבך', 'אליהו'
    ];
    
    // יצירת רשימה של 150 מצטרפים עם שמות אקראיים
    initialParticipantsList = [];
    for (let i = 0; i < 150; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        initialParticipantsList.push({
            firstName: firstName,
            lastName: lastName
        });
    }
    
    // מיון הרשימה לפי שם משפחה ושם פרטי
    initialParticipantsList.sort((a, b) => {
        if (a.lastName === b.lastName) {
            return a.firstName.localeCompare(b.firstName);
        }
        return a.lastName.localeCompare(b.lastName);
    });
}

// פונקציה להצגת רשימת המצטרפים במודאל
function displayParticipantsList(participants) {
    const participantsList = document.getElementById('participants-list');
    if (!participantsList) return;
    
    // ניקוי הרשימה הקיימת
    participantsList.innerHTML = '';
    
    // אם אין מצטרפים, הצג הודעה
    if (participants.length === 0) {
        participantsList.innerHTML = '<div class="no-results">לא נמצאו מצטרפים מתאימים</div>';
        return;
    }
    
    // הוספת כל מצטרף לרשימה
    participants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';
        participantItem.textContent = `${participant.firstName} ${participant.lastName}`;
        participantsList.appendChild(participantItem);
    });
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
