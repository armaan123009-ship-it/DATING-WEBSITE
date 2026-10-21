
const backdrop = document.getElementById('modalBackdrop');
const title = document.getElementById('modalTitle');
const description = document.getElementById('modalDescription');
const submit = document.getElementById('formSubmit');
const message = document.getElementById('formMessage');
const emailInput = document.getElementById('email');

// Add your Supabase project details here
const SUPABASE_URL = 'https://tfcpmylfdgctmjrijedz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5Evrro5ZdtN-2lpdpNEw5w_A6phH5Gm';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
let currentMode = 'login';

function openModal(mode) {
    currentMode = mode;
    const isLogin = mode === 'login';

    title.textContent = isLogin ? 'Welcome back' : 'Join Veylqora';
    description.textContent = 'Enter your email to receive a verification code.';
    submit.textContent = 'Send OTP';
    message.textContent = '';

    backdrop.classList.add('open');
    emailInput.focus();
}

function closeModal() {
    backdrop.classList.remove('open');
    message.textContent = '';
}

document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', () => {
        openModal(button.dataset.modal);
    });
});

document.getElementById('closeModal').addEventListener('click', closeModal);

backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeModal();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
});

document.getElementById('demoForm').addEventListener('submit', async event => {
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
            email: email,
            options: {
                shouldCreateUser: currentMode !== 'login'
            }
        });

        if (error) throw error;

        message.textContent =
            'OTP sent! Check your email for the verification code.';

        submit.textContent = 'OTP Sent';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submit.disabled = false;
    }
});

document.getElementById('year').textContent = new Date().getFullYear();
