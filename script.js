document.addEventListener('DOMContentLoaded', () => {
    const payBtn = document.getElementById('pay-btn');
    const offerSection = document.getElementById('offer-section');
    const linksSection = document.getElementById('links-section');
    const btnText = payBtn.querySelector('span');
    const loader = payBtn.querySelector('.loader-ring');

    payBtn.addEventListener('click', async () => {
        // Show loading state
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        payBtn.classList.remove('pulse');
        payBtn.disabled = true;
        
        try {
            // Fetch the secure order ID from our backend
            const response = await fetch('/api/createOrder', { method: 'POST' });
            const orderData = await response.json();

            if (!response.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Configure Razorpay Options
            const options = {
                "key": orderData.key_id, // Dynamically pulled from our backend!
                "amount": orderData.amount, // 100 paise = 1 INR
                "currency": orderData.currency,
                "name": "Premium Betting Access",
                "description": "Unlock Personal Betting Link",
                "image": "https://cdn-icons-png.flaticon.com/512/9187/9187588.png", // Generic premium icon
                "order_id": orderData.id, 
                "handler": function (response) {
                    // Payment was successful!
                    console.log('Payment ID:', response.razorpay_payment_id);
                    handleSuccessfulPayment();
                },
                "prefill": {
                    "name": "", 
                    "email": "",
                    "contact": ""
                },
                "theme": {
                    "color": "#4f46e5" 
                }
            };

            const razorpayInstance = new Razorpay(options);
            
            razorpayInstance.on('payment.failed', function (response) {
                alert("Payment failed! Reason: " + response.error.description);
                resetButton();
            });

            razorpayInstance.open();

        } catch (error) {
            console.error("Payment initialization error:", error);
            alert("Payment error: Please make sure you added your Razorpay Keys to the .env file.");
            resetButton();
        }
    });

    function resetButton() {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        payBtn.classList.add('pulse');
        payBtn.disabled = false;
    }

    function handleSuccessfulPayment() {
        // Smoothly hide the offer section
        offerSection.style.opacity = '0';
        offerSection.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            offerSection.classList.add('hidden');
            
            // Show links section
            linksSection.classList.remove('hidden');
            
            // Force a reflow so the transition animation actually plays
            void linksSection.offsetWidth; 
            
            // Bring in the success section smoothly
            linksSection.style.opacity = '1';
            linksSection.style.transform = 'scale(1)';
        }, 400); 
    }
});
