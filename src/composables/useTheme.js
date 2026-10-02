import { ref, watchEffect } from 'vue'

const dark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

watchEffect(() => {
  const theme = dark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.bsTheme = theme
})

export function useTheme() {
  const toggle = () => (dark.value = !dark.value)
  return { dark, toggle }
}
