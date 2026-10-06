<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <div class="login-card-body">
        <div class="portal-brand">
          <span class="brand-mark" aria-hidden="true">
            <img class="brand-logo" :src="pesoLogo" alt="">
          </span>
          <span class="brand-copy">
            <strong>PESO</strong>
            <small>Employment services</small>
          </span>
        </div>

        <div class="welcome-copy">
          <p class="eyebrow">ADMINISTRATOR PORTAL</p>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>

        <div v-if="resetNotice" class="form-notice" role="status">
          <i class="bi bi-info-circle" aria-hidden="true"></i>
          <span>{{ resetNotice }}</span>
          <button type="button" aria-label="Dismiss message" @click="resetNotice = ''">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <form class="login-form" @submit.prevent="signIn">
          <div class="form-field">
            <label for="email">Email address</label>
            <div class="input-wrap">
              <i class="bi bi-envelope" aria-hidden="true"></i>
              <input
                id="email"
                v-model.trim="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="username"
                required
              >
            </div>
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <div class="input-wrap password-wrap">
              <i class="bi bi-lock" aria-hidden="true"></i>
              <input
                id="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                minlength="6"
                required
              >
              <button
                class="password-toggle"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <i :class="`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`" aria-hidden="true"></i>
                <span>{{ showPassword ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
            <small class="field-hint">Your password must be at least 6 characters.</small>
          </div>

          <div class="form-options">
            <label class="remember-option" for="remember">
              <input id="remember" v-model="rememberMe" type="checkbox" name="remember">
              <span>Remember me</span>
            </label>
            <button class="text-action" type="button" @click="showPasswordHelp">
              Forgot password?
            </button>
          </div>

          <button class="sign-in-button" type="submit">
            <span>Sign in</span>
            <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </form>

        <div class="secure-note">
          <i class="bi bi-shield-check" aria-hidden="true"></i>
          <span>For authorized PESO personnel</span>
        </div>

        <footer class="login-footer">
          <span class="footer-rule"></span>
          <span>Public Employment Service Office</span>
          <span class="footer-rule"></span>
        </footer>
      </div>
    </section>

    <p class="demo-note">
      <i class="bi bi-info-circle" aria-hidden="true"></i>
      Static preview — authentication is not connected.
    </p>
  </main>
</template>

<script>
import pesoLogo from '../assets/pics/image-Picsart-AiImageEnhancer.png';

export default {
  name: 'Login',
  computed: {
    pesoLogo() {
      return pesoLogo;
    },
  },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      resetNotice: '',
    };
  },
  methods: {
    signIn(event) {
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      this.$router.push('/dashboard');
    },
    showPasswordHelp() {
      this.resetNotice = 'Password recovery is not available in this static preview. Please contact your PESO administrator.';
    },
  },
};
</script>

<style scoped>
.login-page {
  --login-navy: #0b2a6b;
  --login-blue: #1565d8;
  --login-blue-dark: #0d47a1;
  --login-green: #1f5e4d;
  --login-muted: #718096;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  padding: 2rem clamp(1rem, 5vw, 5rem);
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: #dfeffc;
  background-image:
    linear-gradient(110deg, rgba(232, 245, 255, 0.1), rgba(237, 247, 255, 0.3)),
    url("../assets/pics/bglogin1.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.login-card {
  width: min(100%, 440px);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--login-navy);
  -webkit-backdrop-filter: blur(18px) saturate(155%);
  backdrop-filter: blur(18px) saturate(155%);
  box-shadow:
    0 24px 70px rgba(13, 71, 161, 0.2),
    0 3px 12px rgba(13, 71, 161, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  animation: card-enter 450ms ease-out both;
}

.login-card::before {
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, var(--login-blue-dark) 0 55%, #fcd116 55% 78%, #e8112d 78% 100%);
  content: "";
}

.login-card-body {
  padding: clamp(1.5rem, 5vw, 2.5rem);
}

.portal-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-mark {
  width: 58px;
  height: 52px;
  display: block;
  flex: 0 0 auto;
}

.brand-logo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  mix-blend-mode: multiply;
}

.brand-copy {
  display: grid;
  gap: 0.1rem;
}

.brand-copy strong {
  color: var(--login-navy);
  font-size: 0.82rem;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.brand-copy small {
  color: var(--login-muted);
  font-size: 0.65rem;
}

.welcome-copy {
  margin: 1.9rem 0 1.55rem;
}

.eyebrow {
  margin: 0 0 0.55rem;
  color: #53749a;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.welcome-copy h1 {
  margin: 0;
  color: var(--login-navy);
  font-size: clamp(1.65rem, 5vw, 1.95rem);
  font-weight: 700;
  letter-spacing: -0.045em;
}

.welcome-copy > p:last-child {
  margin: 0.45rem 0 0;
  color: #657b96;
  font-size: 0.86rem;
}

.login-form {
  display: grid;
  gap: 1.05rem;
}

.form-field label,
.field-hint {
  display: block;
}

.form-field > label {
  margin-bottom: 0.42rem;
  color: #223b61;
  font-size: 0.75rem;
  font-weight: 650;
}

.input-wrap {
  min-height: 48px;
  padding: 0 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid rgba(21, 101, 216, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.62);
  color: #7c91a9;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.input-wrap:focus-within {
  border-color: var(--login-blue);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 4px rgba(21, 101, 216, 0.11);
}

.input-wrap > i {
  flex: 0 0 auto;
  font-size: 0.9rem;
}

.input-wrap input {
  width: 100%;
  min-width: 0;
  min-height: 45px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--login-navy);
  font: inherit;
  font-size: 0.8rem;
}

.input-wrap input::placeholder {
  color: #97a8bc;
}

.input-wrap input:-webkit-autofill {
  -webkit-text-fill-color: var(--login-navy);
  box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.75) inset;
}

.password-wrap {
  padding-right: 0.45rem;
}

.password-toggle {
  min-height: 34px;
  padding: 0 0.45rem;
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  flex: 0 0 auto;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--login-blue-dark);
  font: inherit;
  font-size: 0.68rem;
  font-weight: 600;
}

.password-toggle:hover {
  background: rgba(21, 101, 216, 0.08);
}

.password-toggle:focus-visible,
.text-action:focus-visible,
.sign-in-button:focus-visible {
  outline: 3px solid rgba(21, 101, 216, 0.25);
  outline-offset: 2px;
}

.field-hint {
  margin-top: 0.4rem;
  color: #8293a8;
  font-size: 0.64rem;
}

.form-options {
  margin-top: -0.15rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.remember-option {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #50647e;
  font-size: 0.72rem;
  cursor: pointer;
}

.remember-option input {
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: var(--login-blue);
  cursor: pointer;
}

.text-action {
  padding: 0.2rem 0;
  border: 0;
  background: transparent;
  color: var(--login-blue-dark);
  font: inherit;
  font-size: 0.7rem;
  font-weight: 650;
  text-decoration: none;
}

.text-action:hover {
  color: var(--login-navy);
  text-decoration: underline;
}

.sign-in-button {
  width: 100%;
  min-height: 48px;
  margin-top: 0.15rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 10px;
  background: linear-gradient(135deg, #1b6bd6, var(--login-blue-dark));
  color: #fff;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 650;
  box-shadow: 0 7px 18px rgba(13, 71, 161, 0.25);
  transition: transform 150ms ease, box-shadow 150ms ease, filter 150ms ease;
  cursor: pointer;
}

.sign-in-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
  box-shadow: 0 10px 22px rgba(13, 71, 161, 0.3);
}

.sign-in-button:active {
  transform: translateY(0);
}

.secure-note {
  margin-top: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #6f8798;
  font-size: 0.65rem;
}

.secure-note i {
  color: var(--login-green);
  font-size: 0.75rem;
}

.login-footer {
  margin-top: 1.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  color: #8190a2;
  font-size: 0.6rem;
  white-space: nowrap;
}

.footer-rule {
  width: 22px;
  height: 1px;
  background: rgba(11, 42, 107, 0.17);
}

.form-notice {
  margin-bottom: 1rem;
  padding: 0.65rem 0.7rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  border: 1px solid rgba(21, 101, 216, 0.16);
  border-radius: 9px;
  background: rgba(237, 245, 253, 0.8);
  color: #45617f;
  font-size: 0.68rem;
  line-height: 1.5;
}

.form-notice > i {
  margin-top: 0.1rem;
  color: var(--login-blue);
}

.form-notice button {
  margin-left: auto;
  padding: 0.1rem;
  border: 0;
  background: transparent;
  color: #6c8198;
}

.demo-note {
  position: absolute;
  right: 1rem;
  bottom: 0.85rem;
  left: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: rgba(11, 42, 107, 0.68);
  font-size: 0.62rem;
  text-align: center;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 575.98px) {
  .login-page {
    padding: 1.25rem 1rem 3rem;
    background-position: 43% center;
  }

  .login-card {
    border-radius: 18px;
  }

  .login-card-body {
    padding: 1.5rem 1.25rem;
  }

  .welcome-copy {
    margin: 1.5rem 0 1.25rem;
  }

  .login-form {
    gap: 0.9rem;
  }

  .demo-note {
    bottom: 0.7rem;
  }
}

@media (max-height: 680px) and (min-width: 576px) {
  .login-page {
    padding-block: 1rem 2.25rem;
  }

  .login-card-body {
    padding-block: 1.5rem;
  }

  .welcome-copy {
    margin-block: 1.25rem 1rem;
  }

  .login-form {
    gap: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card {
    animation: none;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .login-card {
    background: rgba(255, 255, 255, 0.94);
  }
}
</style>
