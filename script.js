// משתנים גלובליים
let currentStep = 1;
let basePrice = 5000;
let finalPrice = basePrice;
let registrationFee = 100;
let totalParticipants = 0;
let isValid = false;

// אתחול האתר
document.addEventListener('DOMContentLoaded', function() {
    // בדיקה אם המכשיר הוא מובייל
    checkIfMobile();
    
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
    
    // הוספת מאזינים לאירועי מגע במובייל
    setupTouchEvents();
    
    // הוספת מאזין לאירוע סנכרון מותאם
    window.addEventListener('participantSync', function(e) {
        if (e.detail && e.detail.participants) {
            console.log('קיבלתי אירוע סנכרון משתתפים:', e.detail.participants);
            totalParticipants = e.detail.participants;
            updateParticipantsDisplay();
            updatePriceBasedOnParticipants();
        }
    });
});

// פונקציה לבדיקה אם המכשיר הוא מובייל
function checkIfMobile() {
    window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (window.isMobile) {
        document.body.classList.add('mobile-device');
        console.log('זוהה מכשיר מובייל');
    } else {
        document.body.classList.add('desktop-device');
        console.log('זוהה מחשב');
    }
}

// פונקציה להוספת מאזינים לאירועי מגע במובייל
function setupTouchEvents() {
    // אם זה מכשיר מובייל, הוסף מאזינים לאירועי מגע
    if (window.isMobile) {
        // הוספת התנהגות מיוחדת למובייל אם צריך
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            button.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}

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
    // בדיקה אם יש פרטי משתמש שמורים
    const savedUserDetails = localStorage.getItem('userDetails');
    if (savedUserDetails) {
        const userDetails = JSON.parse(savedUserDetails);
        // מילוי הטופס בפרטים השמורים
        document.getElementById('first-name').value = userDetails.firstName || '';
        document.getElementById('last-name').value = userDetails.lastName || '';
        document.getElementById('phone').value = userDetails.phone || '';
        document.getElementById('email').value = userDetails.email || '';
        document.getElementById('city').value = userDetails.city || '';
        document.getElementById('street').value = userDetails.street || '';
        document.getElementById('house-number').value = userDetails.houseNumber || '';
        
        // בחירת אפשרות משלוח
        if (userDetails.deliveryMethod) {
            document.querySelector(`input[name="delivery-method"][value="${userDetails.deliveryMethod}"]`).checked = true;
        }
    }
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
    
    // הוספת מאזין לשינויים ב-localStorage לסנכרון בין טאבים/מכשירים
    // מאזין זה יוגדר רק פעם אחת
    if (!window.storageListenerAdded) {
        window.addEventListener('storage', function(e) {
            if (e.key === 'totalParticipants' && e.newValue) {
                console.log('סנכרון מספר משתתפים בין מכשירים:', e.newValue);
                totalParticipants = parseInt(e.newValue);
                updateParticipantsDisplay();
                updatePriceBasedOnParticipants();
            }
        });
        window.storageListenerAdded = true;
    }
}

// פונקציה לעדכון כל התצוגות של מספר המשתתפים והמחירים באתר
function updateParticipantsDisplay() {
    // עדכון מספר המשתתפים בכל המקומות באתר
    document.getElementById('participants-count').textContent = totalParticipants;
    
    // עדכון בשלב 2
    const step2Counter = document.getElementById('participants-count-step2');
    if (step2Counter) {
        step2Counter.textContent = totalParticipants;
    }
    
    // עדכון בשלב 3
    const step3Counter = document.getElementById('participants-count-step3');
    if (step3Counter) {
        step3Counter.textContent = totalParticipants;
    }
    
    // עדכון בשלב 4
    const step4Counter = document.getElementById('participants-count-step4');
    if (step4Counter) {
        step4Counter.textContent = totalParticipants;
    }
    
    // עדכון המחיר בהתאם למספר המשתתפים
    updatePriceBasedOnParticipants();
}

// פונקציה לעדכון המחיר בהתאם לכמות המשתתפים
function updatePriceBasedOnParticipants() {
    // חישוב המחיר לפי מספר המשתתפים
    if (totalParticipants <= 100) {
        finalPrice = 5000;
    } else if (totalParticipants <= 200) {
        finalPrice = 4500;
    } else if (totalParticipants <= 300) {
        finalPrice = 4000;
    } else if (totalParticipants <= 400) {
        finalPrice = 3500;
    } else {
        finalPrice = 3000;
    }
    
    // עדכון המחיר המוצג
    const currentPriceElement = document.getElementById('current-price');
    if (currentPriceElement) {
        currentPriceElement.textContent = `₪${finalPrice.toLocaleString()}`;
    }
}

// פונקציה לעדכון הסיכום (שלב 3)
function updateSummary() {
    // בדיקה אם יש פרטי משתמש שמורים
    const savedUserDetails = localStorage.getItem('userDetails');
    if (!savedUserDetails) {
        // אם אין פרטים, חזור לשלב 2
        showStep(2);
        return;
    }
    
    const userDetails = JSON.parse(savedUserDetails);
    
    // עדכון פרטי המשתמש בסיכום
    document.getElementById('summary-name').textContent = `${userDetails.firstName} ${userDetails.lastName}`;
    document.getElementById('summary-phone').textContent = userDetails.phone;
    document.getElementById('summary-email').textContent = userDetails.email;
    document.getElementById('summary-address').textContent = `${userDetails.street} ${userDetails.houseNumber}, ${userDetails.city}`;
    
    // עדכון פרטי המשלוח
    const deliveryMethod = userDetails.deliveryMethod === 'express' ? 'משלוח מהיר (₪100)' : 'משלוח רגיל (₪50)';
    document.getElementById('summary-delivery').textContent = deliveryMethod;
    
    // עדכון המחירים
    const shippingCost = userDetails.deliveryMethod === 'express' ? 100 : 50;
    const discount = 7000 - finalPrice;
    
    document.getElementById('summary-discount').textContent = `₪${discount.toLocaleString()}`;
    document.getElementById('summary-price').textContent = `₪${finalPrice.toLocaleString()}`;
    document.getElementById('summary-shipping').textContent = `₪${shippingCost}`;
    document.getElementById('summary-total').textContent = `₪${(finalPrice + shippingCost).toLocaleString()}`;
}

// פונקציה לעדכון התשלום (שלב 4)
function updatePayment() {
    // עדכון הסכום לתשלום
    const savedUserDetails = localStorage.getItem('userDetails');
    if (savedUserDetails) {
        const userDetails = JSON.parse(savedUserDetails);
        const shippingCost = userDetails.deliveryMethod === 'express' ? 100 : 50;
        document.getElementById('finalPayment').textContent = `₪${(finalPrice + shippingCost).toLocaleString()}`;
    }
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
    
    // התאמה למובייל - שינוי סוג ההודעה בהתאם לסוג המכשיר
    let messageType = 'success';
    let messageText = 'משתתף חדש הצטרף! המחיר עודכן.';
    
    // הוספת מידע נוסף למשתמשי מובייל
    if (window.isMobile) {
        messageText += ' השינוי יסונכרן בכל המכשירים שלך.';
    }
    
    // הצגת הודעה למשתמש
    showMessage(messageText, messageType);
    
    // בדיקה אם המחיר השתנה בעקבות ההצטרפות
    checkPriceThresholds();
    
    // שליחת אירוע מותאם לסנכרון בין חלונות באותו מכשיר
    try {
        // יצירת אירוע מותאם לסנכרון מיידי בין חלונות פתוחים
        const syncEvent = new CustomEvent('participantSync', { 
            detail: { participants: totalParticipants } 
        });
        window.dispatchEvent(syncEvent);
    } catch (e) {
        console.log('שגיאה בשליחת אירוע סנכרון:', e);
    }
}

// פונקציה לבדיקת ספי מחיר
// מציגה הודעה מיוחדת כאשר המחיר יורד לרמה חדשה
function checkPriceThresholds() {
    const thresholds = [100, 200, 300, 400];
    
    // בדיקה אם חצינו סף
    thresholds.forEach(threshold => {
        if (totalParticipants === threshold + 1) {
            // חישוב המחיר החדש
            let newPrice;
            if (threshold === 100) newPrice = 4500;
            else if (threshold === 200) newPrice = 4000;
            else if (threshold === 300) newPrice = 3500;
            else if (threshold === 400) newPrice = 3000;
            
            // הצגת הודעה על הורדת מחיר
            showMessage(`מזל טוב! הגענו ל-${totalParticipants} משתתפים והמחיר ירד ל-₪${newPrice}!`, 'success');
        }
    });
}

// פונקציה להצגת הודעה
function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('message');
    
    // הגדרת סוג ההודעה
    messageElement.className = 'message';
    if (type) {
        messageElement.classList.add(type);
    }
    
    // הגדרת תוכן ההודעה
    messageElement.textContent = message;
    
    // הצגת ההודעה
    messageElement.style.display = 'block';
    
    // הסתרת ההודעה אחרי 3 שניות
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// פונקציה לאתחול הטיימר
function startCountdown() {
    // הגדרת תאריך סיום הקמפיין - 7 ימים מהיום
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 0);
    
    // עדכון הטיימר בפעם הראשונה
    updateCountdown(endDate);
    
    // עדכון הטיימר כל שנייה
    setInterval(() => {
        updateCountdown(endDate);
    }, 1000);
}

// פונקציה לעדכון הטיימר
function updateCountdown(endDate) {
    const now = new Date();
    const distance = endDate - now;
    
    // חישוב ימים, שעות, דקות ושניות
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // עדכון הערכים בממשק
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // אם הקמפיין הסתיים
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // הצגת הודעה שהקמפיין הסתיים
        showMessage('הקמפיין הסתיים! ניתן עדיין להצטרף במחיר הנוכחי.', 'info');
    }
}

// פונקציה להחלפת התמונה הראשית
function changeMainImage(src) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        // שמירת התמונה הנוכחית
        const currentSrc = mainImage.src;
        
        // החלפת התמונה
        mainImage.src = src;
        
        // הוספת אפקט החלפה
        mainImage.classList.add('fade');
        setTimeout(() => {
            mainImage.classList.remove('fade');
        }, 300);
    }
}

// פונקציה לאתחול טופס מילוי פרטים
function setupUserDetailsForm() {
    // קבלת כל השדות בטופס
    const formInputs = document.querySelectorAll('#user-details-form input, #user-details-form textarea');
    
    // הוספת מאזינים לשינויים בשדות
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });
    
    // פונקציה לבדיקת תקינות הטופס
    function validateForm() {
        isValid = true;
        
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
            if (!validateEmail(emailField.value)) {
                emailField.classList.add('error');
                isValid = false;
            }
        }
        
        // בדיקת תקינות טלפון
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            if (!validatePhone(phoneField.value)) {
                phoneField.classList.add('error');
                isValid = false;
            }
        }
    }
    
    // פונקציה לבדיקת תקינות דוא"ל
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // פונקציה לבדיקת תקינות טלפון
    function validatePhone(phone) {
        const phoneRegex = /^0[2-9]\d{7,8}$/;
        return phoneRegex.test(phone);
    }
    
    // פונקציה לשמירת פרטי המשתמש
    function saveUserDetails() {
        const userDetails = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            street: document.getElementById('street').value,
            houseNumber: document.getElementById('house-number').value,
            notes: document.getElementById('notes').value,
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
        notes: document.getElementById('notes').value,
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
    
    // שליחת אירוע מותאם לסנכרון בין חלונות באותו מכשיר
    try {
        // יצירת אירוע מותאם לסנכרון מיידי בין חלונות פתוחים
        const syncEvent = new CustomEvent('participantSync', { 
            detail: { 
                participants: totalParticipants,
                userDetails: userDetails
            } 
        });
        window.dispatchEvent(syncEvent);
    } catch (e) {
        console.log('שגיאה בשליחת אירוע סנכרון:', e);
    }
    
    // הצגת הודעת הצלחה
    showMessage('הפרטים נשמרו בהצלחה!');
    
    // מעבר לשלב הבא - שימוש בפונקציה ישירות במקום setTimeout
    console.log('מעבר לשלב הסיכום');
    setTimeout(function() {
        showStep(3);
    }, 1000);
}

// פונקציה להוספת מאזינים לכפתורים
function setupEventListeners() {
    // מאזין לכפתור סגירת המודאל
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            document.getElementById('info-modal').classList.remove('active');
        });
    }
    
    // סגירת המודאל בלחיצה מחוץ לתוכן
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('info-modal');
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
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
