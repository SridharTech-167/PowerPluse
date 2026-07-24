document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // Toggle between Login and Register View
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Registration Form Submission Validation
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const mobile = document.getElementById('regMobile').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Mobile Number Validation Pattern (Exactly 10 Digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number containing only numbers.");
            return;
        }

        // Password Length Check (Minimum 8 Characters)
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        // Password Matching Check
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Success Action
        alert(`Registration successful for ${name}!`);
        registerForm.reset();
        
        // Switch to login after registration
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Login Form Submission Validation
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userCredential = document.getElementById('loginUser').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Success simulation
        alert(`Logging in to PowerPulse with: ${userCredential}`);
    });
});
