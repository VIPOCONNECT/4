// משתנים גלובליים
let currentStep = 1;
let basePrice = 5000;
let finalPrice = basePrice;
let registrationFee = 100;
let totalParticipants = 0;

// אתחול האתר
document.addEventListener('DOMContentLoaded', function() {
    // הצגת השלב הראשון
    showStep(1);
    
    // אתחול הטיימר
    startCountdown();
    
    // עדכון מספר המשתתפים והמחיר
    updateTotalParticipants();
    updateParticipantsDisplay();
    
    // הוספת מאזינים לכפתורים
    setupEventListeners();
    
    // אתחול טופס מילוי פרטים
    setupUserDetailsForm();
});

// פונקציה להצגת שלב מסוים
function showStep(stepNumber) {
    // עדכון מספר המשתתפים והמחירים לפני מעבר בין שלבים
    updateTotalParticipants();
    updateParticipantsDisplay();
    
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
        
        // אם זה שלב 2, אתחל את טופס מילוי הפרטים ועדכן את האזור האישי
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
    }
    
    // גלילה לראש העמוד
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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



// פונקציה לעדכון האזור האישי (שלב 2)
function updateUserArea() {
    // עדכון כל התצוגות של מספר המשתתפים והמחירים
    updateTotalParticipants();
    updateParticipantsDisplay();
}

// פונקציה לעדכון כמות המשתתפים
function updateTotalParticipants() {
    // בדיקה אם יש מספר משתתפים שמור ב-localStorage
    const savedParticipants = localStorage.getItem('totalParticipants');
    
    if (savedParticipants) {
        // אם יש מספר שמור, נשתמש בו
        totalParticipants = parseInt(savedParticipants);
    } else {
        // אחרת, ניצור מספר חדש
        // סימולציה של גידול במשתתפים לאורך זמן
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 5); // נניח שהקמפיין התחיל לפני 5 ימים
        
        const now = new Date();
        const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        
        // נתחיל מ-125 רשומים ונוסיף עוד משתתפים לפי הזמן שעבר
        totalParticipants = 125 + (daysPassed * 15);
        
        // שמירת מספר המשתתפים ב-localStorage
        localStorage.setItem('totalParticipants', totalParticipants.toString());
    }
    
    // הגבלה למקסימום 500 משתתפים
    totalParticipants = Math.min(totalParticipants, 500);
    
    console.log('מספר המשתתפים הנוכחי:', totalParticipants);
}

// פונקציה לעדכון כל התצוגות של מספר המשתתפים והמחירים באתר
function updateParticipantsDisplay() {
    // עדכון המחיר בהתאם לכמות המשתתפים
    updatePriceBasedOnParticipants();
    
    // עדכון השעון בכותרת הראשית
    const participantsCountElement = document.getElementById('participants-count');
    if (participantsCountElement) {
        participantsCountElement.textContent = totalParticipants;
    }
    
    // עדכון השעונים בכל השלבים
    const participantsCountSteps = [
        document.getElementById('participants-count-step2'),
        document.getElementById('participants-count-step3'),
        document.getElementById('participants-count-step4')
    ];
    
    participantsCountSteps.forEach(element => {
        if (element) {
            element.textContent = totalParticipants;
        }
    });
    
    // עדכון התצוגה בשלב הראשון
    const totalParticipantsElement = document.getElementById('totalParticipants');
    if (totalParticipantsElement) {
        totalParticipantsElement.textContent = totalParticipants;
    }
    
    // עדכון התצוגה בשלב הסיכום
    const summaryParticipantsElement = document.getElementById('summaryParticipants');
    if (summaryParticipantsElement) {
        summaryParticipantsElement.textContent = totalParticipants;
    }
    
    // עדכון המחיר בכל הדפים
    
    // 1. עדכון המחיר ברכישה קבוצתית בכותרת
    const currentGroupPriceElement = document.getElementById('current-group-price');
    if (currentGroupPriceElement) {
        currentGroupPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // 2. עדכון המחיר בשלב הראשון
    const currentPriceElement = document.getElementById('currentPrice');
    if (currentPriceElement) {
        currentPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // 3. עדכון המחיר בשלב הסיכום
    const summaryGroupPriceElement = document.getElementById('summaryGroupPrice');
    if (summaryGroupPriceElement) {
        summaryGroupPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
    
    // 4. חישוב ועדכון היתרה לתשלום בשלב הסיכום
    const remainingPayment = finalPrice - registrationFee;
    const summaryRemainingPaymentElement = document.getElementById('summaryRemainingPayment');
    if (summaryRemainingPaymentElement) {
        summaryRemainingPaymentElement.textContent = `₪${Math.max(0, remainingPayment).toLocaleString()}`;
    }
    
    // 5. עדכון היתרה לתשלום בשלב התשלום
    const finalPaymentElement = document.getElementById('finalPayment');
    if (finalPaymentElement) {
        finalPaymentElement.textContent = `₪${Math.max(0, remainingPayment).toLocaleString()}`;
    }
}

// פונקציה לעדכון המחיר בהתאם לכמות המשתתפים
function updatePriceBasedOnParticipants() {
    if (totalParticipants >= 500) {
        finalPrice = 3000;
    } else if (totalParticipants >= 400) {
        finalPrice = 3100;
    } else if (totalParticipants >= 300) {
        finalPrice = 3200;
    } else if (totalParticipants >= 200) {
        finalPrice = 3300;
    } else if (totalParticipants >= 150) {
        finalPrice = 3500;
    } else if (totalParticipants >= 100) {
        finalPrice = 4500;
    } else if (totalParticipants >= 50) {
        finalPrice = 5000;
    } else {
        finalPrice = 5000;
    }
}

// פונקציה לעדכון הסיכום (שלב 3)
function updateSummary() {
    // עדכון כל התצוגות של מספר המשתתפים והמחירים
    updateTotalParticipants();
    updateParticipantsDisplay();
    
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
    // עדכון כל התצוגות של מספר המשתתפים והמחירים
    updateTotalParticipants();
    updateParticipantsDisplay();
}



// פונקציה להוספת משתתף חדש ועדכון כל המחירים
function addNewParticipant() {
    // הוספת משתתף חדש
    totalParticipants++;
    
    // הגבלה למקסימום 500 משתתפים
    totalParticipants = Math.min(totalParticipants, 500);
    
    // שמירת מספר המשתתפים המעודכן ב-localStorage
    localStorage.setItem('totalParticipants', totalParticipants.toString());
    console.log('מספר המשתתפים המעודכן:', totalParticipants);
    
    // עדכון כל המחירים בכל הדפים
    updateParticipantsDisplay();
    
    // הצגת הודעה למשתמש
    showMessage('משתתף חדש הצטרף! המחיר עודכן.', 'success');
    
    // בדיקה אם המחיר השתנה בעקבות ההצטרפות
    checkPriceThresholds();
}

// פונקציה לבדיקת ספי מחיר
// מציגה הודעה מיוחדת כאשר המחיר יורד לרמה חדשה
function checkPriceThresholds() {
    // בדיקת ספי מחיר שונים
    if (totalParticipants === 100) {
        showMessage('הגענו ל-100 משתתפים! המחיר ירד ל-₪4,500', 'success');
    } else if (totalParticipants === 150) {
        showMessage('הגענו ל-150 משתתפים! המחיר ירד ל-₪3,500', 'success');
    } else if (totalParticipants === 200) {
        showMessage('הגענו ל-200 משתתפים! המחיר ירד ל-₪3,300', 'success');
    } else if (totalParticipants === 300) {
        showMessage('הגענו ל-300 משתתפים! המחיר ירד ל-₪3,200', 'success');
    } else if (totalParticipants === 400) {
        showMessage('הגענו ל-400 משתתפים! המחיר ירד ל-₪3,100', 'success');
    } else if (totalParticipants === 500) {
        showMessage('הגענו למקסימום המשתתפים! המחיר הסופי הוא ₪3,000', 'success');
    }
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
    
    // עדכון הטיימר מיידית
    updateCountdown(endDate);
    
    // ניקוי האינטרוול הקודם אם קיים
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
    
    // הגדרת אינטרוול חדש ושמירתו במשתנה גלובלי
    window.countdownInterval = setInterval(function() {
        updateCountdown(endDate);
    }, 1000);
    
    console.log('הטיימר הופעל בהצלחה');
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
        
        // עדכון הטיימר בכותרת הראשית
        if (document.getElementById('header-days')) {
            document.getElementById('header-days').textContent = '0';
            document.getElementById('header-hours').textContent = '0';
            document.getElementById('header-minutes').textContent = '0';
            document.getElementById('header-seconds').textContent = '0';
        }
        
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
    
    // עדכון התצוגה בטיימר של הכותרת הראשית
    if (document.getElementById('header-days')) {
        document.getElementById('header-days').textContent = days;
        document.getElementById('header-hours').textContent = hours;
        document.getElementById('header-minutes').textContent = minutes;
        document.getElementById('header-seconds').textContent = seconds;
    }
    
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
    
    // שמירת פרטי המשתמש
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
    
    // הוספת משתתף חדש
    totalParticipants++;
    
    // הגבלה למקסימום 500 משתתפים
    totalParticipants = Math.min(totalParticipants, 500);
    
    // שמירת מספר המשתתפים המעודכן ב-localStorage
    localStorage.setItem('totalParticipants', totalParticipants.toString());
    console.log('מספר המשתתפים המעודכן אחרי רישום:', totalParticipants);
    
    // עדכון מספר המשתתפים והמחירים
    updateParticipantsDisplay();
    
    // הצגת הודעת הצלחה
    showMessage('הפרטים נשמרו בהצלחה!');
    
    // מעבר לשלב הבא - שימוש בפונקציה ישירות במקום setTimeout
    console.log('מעבר לשלב הסיכום');
    setTimeout(function() {
        showStep(3);
    }, 1000);
}

// פונקציה לסימולציה של תשלום
function simulatePayment() {
    // הצגת הודעת טעינה
    showMessage('מעבד תשלום...', 'info');
    
    // סימולציה של עיבוד תשלום
    setTimeout(() => {
        // הצגת הודעת הצלחה
        showMessage('התשלום בוצע בהצלחה!', 'success');
        
        // מעבר לשלב האחרון לאחר השהייה קצרה
        setTimeout(() => {
            showStep(5);
        }, 1000);
    }, 1500);
}
