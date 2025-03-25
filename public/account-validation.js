// Client-side form validation for registration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');
            
            errorDiv.innerHTML = '';
            let isValid = true;
            
            // Username validation
            if (!/^[A-Za-z0-9]+$/.test(username)) {
                errorDiv.innerHTML = 'Username must contain only letters and digits';
                isValid = false;
            }
            
            // Password validation
            else if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}/.test(password)) {
                errorDiv.innerHTML = 'Password must be 4+ chars with at least 1 letter and 1 digit';
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});