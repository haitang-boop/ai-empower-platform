import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const username = computed(() => user.value?.username || '')
  const avatar = computed(() => user.value?.avatar || '')

  async function doLogin(credentials) {
    const res = await login(credentials)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res
  }

  async function doRegister(data) {
    const res = await register(data)
    return res
  }

  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      user.value = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    } catch (error) {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    username,
    avatar,
    doLogin,
    doRegister,
    fetchUserInfo,
    logout
  }
})