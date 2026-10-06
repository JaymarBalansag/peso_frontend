<template>

<div class="container-fluid  min-vh-100 d-flex align-items-center justify-content-center py-4">
    <div class="card login-card shadow-sm border-0">
      <div class="card-body p-4 p-md-5">
        <h1 class="h4 fw-bold mb-1">Welcome back</h1>
        <p class="text-body-secondary mb-4">Sign in to your account</p>

        <div id="alert" class="alert alert-danger d-none" role="alert"></div>

        <form id="loginForm" novalidate>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" placeholder="you@example.com" autocomplete="email" required>
            <div class="invalid-feedback">Please enter a valid email address.</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group has-validation">
              <input type="password" class="form-control" id="password" placeholder="••••••••" autocomplete="current-password" minlength="6" required>
              <button class="btn btn-outline-secondary" type="button" id="togglePassword">Show</button>
              <div class="invalid-feedback">Password must be at least 6 characters.</div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="remember">
              <label class="form-check-label" for="remember">Remember me</label>
            </div>
            <a href="#" class="small text-decoration-none">Forgot password?</a>
          </div>

          <RouterLink to="/dashboard"  type="submit" class="btn btn-primary w-100" id="submitBtn">
            <span class="spinner-border spinner-border-sm d-none me-2" id="spinner" aria-hidden="true"></span>
            <span id="submitText">Sign in</span>
          </RouterLink>
        </form>

        <p class="text-center text-body-secondary small mt-4 mb-0">
          Don't have an account? <a href="#" class="text-decoration-none">Sign up</a>
        </p>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    // async login() {
    //   try {
    //     // Replace this with your actual login logic
    //     if (this.username === 'admin' && this.password === 'password') {
    //       this.$router.push('/dashboard');
    //     } else {
    //       this.errorMessage = 'Invalid username or password';
    //     }
    //   } catch (error) {
    //     this.errorMessage = 'An error occurred during login';
    //   }
    // },
  },
};

</script>

<style>
/* Your original background - unchanged */
body {
background-image: url("../assets/pics/bglogin1.png");
background-repeat: no-repeat;
background-position: center;
background-attachment: fixed;
background-size: cover;
    
}

:root {
    --brand-navy: #0b2a6b;
    --brand-blue: #1565d8;
    --brand-blue-dark: #0d47a1;
    --brand-red: #e8112d;
    --brand-yellow: #fcd116;
}

/* Keep the centered logo in the background visible:
    card sits on the right on large screens, centered on small ones */
@media (min-width: 992px) {
    .login-wrap { justify-content: flex-end !important; padding-right: 8vw; }
}

/* Glassmorphism card tuned for a light background */
.login-card {
    max-width: 400px;
    width: 100%;
    position: relative;
    overflow: hidden;
    color: var(--brand-navy);
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.75) !important;
    border-radius: 1.5rem;
    -webkit-backdrop-filter: blur(10px) saturate(170%);
    backdrop-filter: blur(10px) saturate(170%);
    box-shadow: 0 10px 40px rgba(13, 71, 161, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Thin blue / yellow / red bar echoing the swooshes in the background */
.login-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--brand-blue-dark) 0 55%, var(--brand-yellow) 55% 78%, var(--brand-red) 78% 100%);
}

.login-card .text-body-secondary { color: rgba(11, 42, 107, 0.7) !important; }
.login-card .form-label { color: var(--brand-navy); font-weight: 500; }

.login-card .form-control {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(21, 101, 216, 0.25);
    color: var(--brand-navy);
}
.login-card .form-control::placeholder { color: rgba(11, 42, 107, 0.4); }
.login-card .form-control:focus {
    background: rgba(255, 255, 255, 0.85);
    border-color: var(--brand-blue);
    box-shadow: 0 0 0 0.25rem rgba(21, 101, 216, 0.2);
    color: var(--brand-navy);
}
.login-card .form-control:-webkit-autofill {
    -webkit-text-fill-color: var(--brand-navy);
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.7) inset;
    transition: background-color 9999s ease-in-out 0s;
}

.login-card .btn-outline-secondary {
    color: var(--brand-blue-dark);
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(21, 101, 216, 0.25);
}
.login-card .btn-outline-secondary:hover {
    background: rgba(21, 101, 216, 0.12);
    border-color: var(--brand-blue);
    color: var(--brand-blue-dark);
}

.login-card .form-check-input {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(21, 101, 216, 0.4);
}
.login-card .form-check-input:checked {
    background-color: var(--brand-blue);
    border-color: var(--brand-blue);
}
.login-card .form-check-input:focus { box-shadow: 0 0 0 0.25rem rgba(21, 101, 216, 0.2); }

.login-card a { color: var(--brand-blue-dark); font-weight: 500; }
.login-card a:hover { color: var(--brand-navy); text-decoration: underline !important; }

.login-card .btn-primary {
    background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-dark));
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    font-weight: 600;
    border-radius: 0.75rem;
    padding: 0.65rem 1rem;
    box-shadow: 0 6px 18px rgba(13, 71, 161, 0.35);
    transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.login-card .btn-primary:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(13, 71, 161, 0.45);
}

.login-card .invalid-feedback { color: #c1121f; }
.login-card .alert-danger {
    color: #8b0d1a;
    background: rgba(232, 17, 45, 0.12);
    border: 1px solid rgba(232, 17, 45, 0.35);
}

/* Browsers without backdrop-filter get a more opaque card */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .login-card { background: rgba(255, 255, 255, 0.9); }
}
</style>