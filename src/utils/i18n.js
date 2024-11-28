import { watch } from 'vue'
import store from '@/store'
import i18n from '@/i18n'
export function generateTitle(title) {
  return i18n.global.t('msg.route.' + title)
}

/**
 * 监听语言的变化
 * * 监听 Vuex store 中的 language（即当前选择的语言）。
 * @param  {...any} cbs 所有的回调
 */
export function watchSwitchLang(...cbs) {
  watch(
    () => store.getters.language,
    () => {
      cbs.forEach(cb => cb(store.getters.language))
    }
  )
}
