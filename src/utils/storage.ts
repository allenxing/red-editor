/**
 * 设置 localStorage 项
 * @param {string} key 键名
 * @param {any} value 值 (会自动转为JSON字符串)
 * @param {number} [expire] 过期时间(毫秒)
 */
export function setLocalStorage(key: string, value:any, expire?: number) {
  const data = {
    value,
    timestamp: Date.now(),
    expire: expire ? Date.now() + expire : null
  }
  window.localStorage.setItem(key, JSON.stringify(data))
}

/**
 * 获取 localStorage 项
 * @param {string} key 键名
 * @returns {any} 存储的值 (自动从JSON解析)
 */
export function getLocalStorage(key: string) {
  const item = window.localStorage.getItem(key)
  if (!item) return null
  
  try {
    const data = JSON.parse(item)
    // 检查是否过期
    if (data.expire && Date.now() > data.expire) {
      removeLocalStorage(key)
      return null
    }
    return data.value
  } catch (e) {
    console.error('解析 localStorage 数据失败:', e)
    return item // 返回原始字符串
  }
}

/**
 * 移除 localStorage 项
 * @param {string} key 键名
 */
export function removeLocalStorage(key: string) {
  window.localStorage.removeItem(key)
}

/**
 * 清空 localStorage
 */
export function clearLocalStorage() {
  window.localStorage.clear()
}

/**
 * 检查 localStorage 中是否存在某个键
 * @param {string} key 键名
 * @returns {boolean}
 */
export function hasLocalStorage(key: string) {
  return window.localStorage.getItem(key) !== null
}

export const storageKey = 'red-content';