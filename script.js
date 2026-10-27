
const backdrop = document.getElementById('modalBackdrop');
const title = document.getElementById('modalTitle');
const description = document.getElementById('modalDescription');
const emailInput = document.getElementById('email');
const form = document.getElementById('demoForm');
const submit = document.getElementById('formSubmit');
const message = document.getElementById('formMessage');

const SUPABASE_URL = 'https://tfcpmylfdgctmjrijedz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5Evrro5ZdtN-2lpdpNEw5w_A6phH5Gm';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let currentMode = 'signup';
let pendingEmail = '';

const otpBox = document.createElement('div');
otpBox.id = 'otpVerificationBox';
otpBox.style.display = 'none';
otpBox.style.marginTop = '16px';

otpBox.innerHTML = `
    <div class="field">
        <label for="otpInput">Email verification code</label>
        <input
            id="otpInput"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="8"
            placeholder="Enter your OTP"
        >
    </div>
    <button type="button" id="verifyOtpButton" class="btn btn-primary">
        Verify OTP
    </button>
`;

form.appendChild(otpBox);

const otpInput = document.getElementById('otpInput');
const verifyButton = document.getElementById('verifyOtpButton');

document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', () => {
        currentMode = button.dataset.modal;
        title.textContent =
            currentMode === 'login' ? 'Welcome back' : 'Join Veylqora';
        description.textContent =
            'Enter your email to receive a verification code.';
        message.textContent = '';
        form.reset();
        pendingEmail = '';
        otpBox.style.display = 'none';
        submit.disabled = false;
        submit.textContent = 'Send OTP';
        backdrop.classList.add('open');
    });
});

function closeModal() {
    backdrop.classList.remove('open');
}

document.getElementById('closeModal').addEventListener('click', closeModal);

backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeModal();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        message.textContent = 'Please enter your email address.';
        return;
    }

    submit.disabled = true;
    message.textContent = 'Sending OTP...';

    try {
        const { error } = await supabaseClient.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: currentMode !== 'login'
            }
        });

        if (error) throw error;

        pendingEmail = email;
        otpBox.style.display = 'block';
        otpInput.value = '';

        message.textContent =
            'OTP sent! Check your email and enter the code below.';
        submit.textContent = 'Resend OTP';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submit.disabled = false;
    }
});

verifyButton.addEventListener('click', async () => {
    const token = otpInput.value.trim();

    if (!pendingEmail) {
        message.textContent = 'Please request an OTP first.';
        return;
    }

    if (!/^\d{6,8}$/.test(token)) {
        message.textContent = 'Enter the verification code from your email.';
        return;
    }

    verifyButton.disabled = true;
    message.textContent = 'Verifying OTP...';

    try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
            email: pendingEmail,
            token,
            type: 'email'
        });

        if (error) throw error;

        message.textContent =
            'Email verified successfully! You are logged in.';
        otpBox.style.display = 'none';

        console.log('Verified user:', data.user);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        verifyButton.disabled = false;
    }
});

document.getElementById('year').textContent = new Date().getFullYear();
