<template>
  <v-app>
    <!-- Password Gate -->
    <div v-if="!authenticated" class="gate">
      <div class="gate-card">
        <div class="gate-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" fill="none" stroke="#2563EB" stroke-width="1.5"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#2563EB" fill-opacity="0.12" stroke="#2563EB" stroke-width="1"/>
            <circle cx="14" cy="14" r="2.5" fill="#2563EB"/>
          </svg>
          <span class="gate-app-name">NeuBautUlm</span>
        </div>

        <div class="gate-heading">Demo-Zugang</div>
        <div class="gate-sub">Diese Anwendung ist passwortgeschützt.</div>

        <form class="gate-form" @submit.prevent="tryLogin">
          <div class="gate-input-wrap">
            <input
              ref="inputRef"
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              class="gate-input"
              :class="{ 'gate-input--error': error }"
              placeholder="Passwort"
              autocomplete="current-password"
            />
            <button type="button" class="gate-eye" @click="showPw = !showPw" tabindex="-1">
              <v-icon size="16" color="#94A3B8">{{ showPw ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}</v-icon>
            </button>
          </div>
          <div v-if="error" class="gate-error">Falsches Passwort</div>
          <button type="submit" class="gate-btn">Einloggen</button>
        </form>

        <div class="gate-footer">Kommunales Baustellen- und Mängelmanagement · Neu-Ulm</div>
      </div>
    </div>

    <!-- App -->
    <v-main v-else>
      <PillNav />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PillNav from './components/PillNav.vue'

const SESSION_KEY = 'neubautulm_auth'
const CORRECT_PW = 'DemoKanu2026'

const authenticated = ref(false)
const password = ref('')
const showPw = ref(false)
const error = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    authenticated.value = true
  }
})

function tryLogin() {
  if (password.value === CORRECT_PW) {
    sessionStorage.setItem(SESSION_KEY, '1')
    authenticated.value = true
    error.value = false
  } else {
    error.value = true
    password.value = ''
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
.gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
}

.gate-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 40px 40px 32px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.gate-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.gate-app-name {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #08122B;
  letter-spacing: -0.02em;
}

.gate-heading {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  align-self: flex-start;
}

.gate-sub {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  color: #94A3B8;
  margin-bottom: 24px;
  align-self: flex-start;
}

.gate-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gate-input-wrap {
  position: relative;
  width: 100%;
}

.gate-input {
  width: 100%;
  height: 42px;
  padding: 0 40px 0 14px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #0F172A;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.gate-input:focus {
  border-color: #2563EB;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.gate-input--error {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.gate-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.gate-error {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #EF4444;
  letter-spacing: 0.04em;
  margin-top: -4px;
}

.gate-btn {
  width: 100%;
  height: 42px;
  background: #08122B;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;
}

.gate-btn:hover {
  background: #0D1A38;
}

.gate-btn:active {
  background: #1e3a5f;
}

.gate-footer {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.06em;
  color: #CBD5E1;
  text-align: center;
  margin-top: 28px;
  text-transform: uppercase;
}
</style>
