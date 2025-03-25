document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form'); // Fix: Correct ID
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default submission
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            const successDiv = document.getElementById('success-message');
            
            errorDiv.innerHTML = '';
            successDiv.innerHTML = '';

            // Form validation
            if (!/^[A-Za-z0-9]+$/.test(username)) {
                errorDiv.innerHTML = 'Username must contain only letters and digits';
                return;
            }
            if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}/.test(password)) {
                errorDiv.innerHTML = 'Password must be 4+ chars with at least 1 letter and 1 digit';
                return;
            }

            // Send data to server
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (response.ok) {
                    successDiv.innerHTML = result.message; // Display success message
                    form.reset(); // Clear form
                } else {
                    errorDiv.innerHTML = result.message; // Display error message
                }
            } catch (err) {
                errorDiv.innerHTML = 'An error occurred. Please try again.';
            }
        });
    }
});

