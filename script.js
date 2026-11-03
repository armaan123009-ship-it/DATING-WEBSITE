
// ==================================================
// VEYLQORA WEBSITE JAVASCRIPT
// SIGN UP + EMAIL OTP + LOGIN + PASSWORD RESET
// ==================================================


// ==================================================
// 1. SUPABASE CONFIGURATION
// ==================================================

// Your existing Supabase project URL
const SUPABASE_URL =
    "https://tfcpmylfdgctmjrijedz.supabase.co";

// Your existing Supabase publishable key.
// This key is intended for browser use.
// Never put a Supabase service-role key in frontend code.
const SUPABASE_ANON_KEY =
    "sb_publishable_5Evrro5ZdtN-2lpdpNEw5w_A6phH5Gm";

// Create the Supabase client.
// The Supabase library is loaded before this file in index.html.
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==================================================
// 2. GET HTML ELEMENTS
// ==================================================

// Main popup elements
const backdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const closeButton = document.getElementById("closeModal");

// Forms
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const emailOtpForm = document.getElementById("emailOtpForm");

// Form switching elements
const switchArea = document.getElementById("switchArea");
const switchPrompt = document.getElementById("switchPrompt");
const switchModeButton = document.getElementById("switchMode");

// Message area for errors and success messages
const formMessage = document.getElementById("formMessage");

// OTP buttons
const verifyEmailButton =
    document.getElementById("verifyEmailButton");

const resendEmailOtpButton =
    document.getElementById("resendEmailOtp");


// ==================================================
// 3. AUTHENTICATION VARIABLES
// ==================================================

// Stores the currently visible form
let currentMode = "signup";

// Stores the email waiting for OTP verification
let pendingEmail = "";

// Prevents accidental repeated submissions
let isSubmitting = false;


// ==================================================
// 4. DISPLAY A MESSAGE
// ==================================================

// This function displays a message inside the popup.
// The message can be an error or a success message.
function showMessage(message, type = "success") {

    formMessage.textContent = message;

    if (type === "error") {
        formMessage.style.color = "#ff8b9b";
    } else {
        formMessage.style.color = "#70e2b0";
    }
}


// ==================================================
// 5. SWITCH BETWEEN SIGNUP, LOGIN AND OTP FORMS
// ==================================================

function showForm(mode) {

    // Save the currently selected form
    currentMode = mode;

    // Show only the selected form
    signupForm.hidden = mode !== "signup";
    loginForm.hidden = mode !== "login";
    emailOtpForm.hidden = mode !== "emailOtp";

    // Hide the switch link while entering OTP
    switchArea.hidden = mode === "emailOtp";

    // Clear previous messages
    formMessage.textContent = "";

    // Update popup heading and description
    if (mode === "signup") {

        modalTitle.textContent = "Join Veylqora";

        modalDescription.textContent =
            "Create your account and start making meaningful connections.";

        switchPrompt.textContent =
            "Already have an account? ";

        switchModeButton.textContent = "Log in";

    } else if (mode === "login") {

        modalTitle.textContent = "Welcome back";

        modalDescription.textContent =
            "Log in to your Veylqora account.";

        switchPrompt.textContent =
            "New to Veylqora? ";

        switchModeButton.textContent = "Sign up";

    } else if (mode === "emailOtp") {

        modalTitle.textContent = "Verify your email";

        modalDescription.textContent =
            "Enter the 8-digit verification code sent to your email.";
    }
}


// ==================================================
// 6. OPEN AND CLOSE THE POPUP
// ==================================================

// Opens the popup and displays the selected form
function openPopup(mode) {

    backdrop.classList.add("open");

    showForm(mode);
}

// Closes the popup
function closePopup() {

    backdrop.classList.remove("open");
}


// ==================================================
// 7. CONNECT HOMEPAGE BUTTONS TO POPUP
// ==================================================

// Every button with data-modal="signup" opens Sign Up
document.querySelectorAll('[data-modal="signup"]')
    .forEach(button => {

        button.addEventListener("click", () => {

            // Reset the signup form
            signupForm.reset();

            pendingEmail = "";

            openPopup("signup");
        });
    });


// Every button with data-modal="login" opens Log In
document.querySelectorAll('[data-modal="login"]')
    .forEach(button => {

        button.addEventListener("click", () => {

            // Reset the login form
            loginForm.reset();

            openPopup("login");
        });
    });


// ==================================================
// 8. CLOSE POPUP EVENTS
// ==================================================

// Close when the close button is clicked
closeButton.addEventListener("click", closePopup);


// Close when the user clicks outside the popup box
backdrop.addEventListener("click", event => {

    if (event.target === backdrop) {
        closePopup();
    }
});


// Close when Escape key is pressed
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closePopup();
    }
});


// ==================================================
// 9. SWITCH BETWEEN SIGNUP AND LOGIN
// ==================================================

switchModeButton.addEventListener("click", () => {

    // If currently on signup, open login.
    // Otherwise, return to signup.
    if (currentMode === "signup") {

        loginForm.reset();

        showForm("login");

    } else {

        signupForm.reset();

        showForm("signup");
    }
});


// ==================================================
// 10. SIGN UP WITH SUPABASE
// ==================================================

signupForm.addEventListener("submit", async event => {

    // Stop the browser from refreshing the page
    event.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Get the user's first name
    const firstName =
        document.getElementById("firstName").value.trim();

    // Get the user's last name
    const lastName =
        document.getElementById("lastName").value.trim();

    // Get the email address
    const email =
        document.getElementById("signupEmail").value.trim();

    // Get the phone number
    const phone =
        document.getElementById("signupPhone").value.trim();

    // Get the password
    const password =
        document.getElementById("signupPassword").value;

    // Get the confirm password
    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check whether both passwords match
    if (password !== confirmPassword) {

        showMessage("Passwords do not match.", "error");

        return;
    }


    // Check minimum password length
    if (password.length < 8) {

        showMessage(
            "Password must contain at least 8 characters.",
            "error"
        );

        return;
    }


    // Check that required details are entered
    if (!firstName || !lastName || !email || !phone) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;
    }


    // Get the signup button
    const signupButton =
        document.getElementById("signupSubmit");

    // Change button state while sending request
    isSubmitting = true;

    signupButton.disabled = true;
    signupButton.textContent = "Creating account...";

    showMessage("Creating your Veylqora account...");


    try {

        // Create a new user in Supabase Authentication
        const { data, error } =
            await supabaseClient.auth.signUp({

                // User's email address
                email: email,

                // User's password
                password: password,

                // Additional profile details
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: phone
                    }
                }
            });


        // If Supabase returns an error, show it
        if (error) {
            throw error;
        }


        // Save the email for the OTP verification step
        pendingEmail = email;


        // Clear the OTP input
        document.getElementById("emailOtp").value = "";


        // Show the email verification form
        showForm("emailOtp");


        // Display success message
        showMessage(
            "Account request submitted. Check your email for the verification code."
        );


        // Helpful information for debugging
        console.log("Signup response:", data);


    } catch (error) {

        // Display Supabase error
        showMessage(error.message, "error");

        console.error("Signup error:", error);

    } finally {

        // Restore the signup button
        isSubmitting = false;

        signupButton.disabled = false;
        signupButton.textContent = "Create account";
    }
});


// ==================================================
// 11. VERIFY EMAIL OTP
// ==================================================

emailOtpForm.addEventListener("submit", async event => {

    // Prevent page refresh
    event.preventDefault();

    // Prevent repeated requests
    if (isSubmitting) return;

    // Get the OTP entered by the user
    const token =
        document.getElementById("emailOtp").value.trim();


    // Check if there is an email waiting for verification
    if (!pendingEmail) {

        showMessage(
            "Please create your account first.",
            "error"
        );

        return;
    }


    // Check the OTP format.
    // Your Supabase setting uses an 8-digit code.
    if (!/^\d{8}$/.test(token)) {

        showMessage(
            "Please enter your 8-digit verification code.",
            "error"
        );

        return;
    }


    // Change button state
    isSubmitting = true;

    verifyEmailButton.disabled = true;
    verifyEmailButton.textContent = "Verifying...";

    showMessage("Verifying your email...");


    try {

        // Verify the signup OTP through Supabase
        const { data, error } =
            await supabaseClient.auth.verifyOtp({

                // Email address used during signup
                email: pendingEmail,

                // OTP entered by the user
                token: token,

                // This OTP is for signup confirmation
                type: "signup"
            });


        // Display Supabase error if verification fails
        if (error) {
            throw error;
        }


        // Email verification was successful
        showMessage(
            "Email verified successfully! Welcome to Veylqora."
        );


        // Display verified user in browser console
        console.log("Verified user:", data.user);


        // Clear pending email
        pendingEmail = "";


        // Clear the OTP form
        emailOtpForm.reset();


        // Close the popup after a short delay
        setTimeout(() => {

            closePopup();

        }, 1800);


    } catch (error) {

        // Display verification error
        showMessage(error.message, "error");

        console.error("OTP verification error:", error);

    } finally {

        // Restore verification button
        isSubmitting = false;

        verifyEmailButton.disabled = false;
        verifyEmailButton.textContent = "Verify email";
    }
});


// ==================================================
// 12. RESEND EMAIL OTP
// ==================================================

resendEmailOtpButton.addEventListener("click", async () => {

    // Do not resend if there is no pending email
    if (!pendingEmail) {

        showMessage(
            "Please start the signup process again.",
            "error"
        );

        return;
    }


    // Prevent repeated requests
    if (isSubmitting) return;

    isSubmitting = true;

    resendEmailOtpButton.disabled = true;

    showMessage("Sending a new verification code...");


    try {

        // Resend signup confirmation email
        const { error } =
            await supabaseClient.auth.resend({

                type: "signup",

                email: pendingEmail
            });


        if (error) {
            throw error;
        }


        showMessage(
            "A new verification code has been sent to your email."
        );


    } catch (error) {

        showMessage(error.message, "error");

        console.error("Resend OTP error:", error);

    } finally {

        isSubmitting = false;

        resendEmailOtpButton.disabled = false;
    }
});


// ==================================================
// 13. LOGIN WITH EMAIL AND PASSWORD
// ==================================================

loginForm.addEventListener("submit", async event => {

    // Stop browser refresh
    event.preventDefault();

    // Prevent duplicate login requests
    if (isSubmitting) return;

    // Get registered email
    const email =
        document.getElementById("loginEmail").value.trim();

    // Get password
    const password =
        document.getElementById("loginPassword").value;


    // Get login button
    const loginButton =
        document.getElementById("loginSubmit");


    // Change button state
    isSubmitting = true;

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    showMessage("Checking your account...");


    try {

        // Authenticate the user through Supabase
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password
            });


        // Show login error if authentication fails
        if (error) {
            throw error;
        }


        // Login successful
        showMessage("Login successful! Welcome back.");


        // Display logged-in user in console
        console.log("Logged-in user:", data.user);


        // Close popup after successful login
        setTimeout(() => {

            closePopup();

        }, 1500);


        // Later, you can redirect the user to their dashboard here.
        // Example:
        // window.location.href = "dashboard.html";


    } catch (error) {

        // Display login error
        showMessage(error.message, "error");

        console.error("Login error:", error);

    } finally {

        // Restore login button
        isSubmitting = false;

        loginButton.disabled = false;
        loginButton.textContent = "Log in";
    }
});


// ==================================================
// 14. FORGOT PASSWORD
// ==================================================

document.getElementById("forgotPassword")
    .addEventListener("click", async () => {

        // Get the email from the login form
        const email =
            document.getElementById("loginEmail").value.trim();


        // User must enter email before requesting reset
        if (!email) {

            showMessage(
                "Please enter your registered email address first.",
                "error"
            );

            return;
        }


        showMessage("Sending password reset email...");


        try {

            // Ask Supabase to send password reset instructions
            const { error } =
                await supabaseClient.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: window.location.origin
                    }
                );


            // Check for errors
            if (error) {
                throw error;
            }


            // Display success message
            showMessage(
                "Password reset instructions have been sent to your email."
            );


        } catch (error) {

            showMessage(error.message, "error");

            console.error("Password reset error:", error);
        }
    });


// ==================================================
// 15. UPDATE FOOTER YEAR
// ==================================================

// Automatically display the current year in the footer
const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();
}


// ==================================================
// END OF VEYLQORA JAVASCRIPT
// ==================================================
