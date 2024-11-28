import { LANG, TAGS_VIEW } from '@/constant'
import { getItem, setItem } from '@/utils/storage'
export default {
  namespaced: true,
  state: () => ({
    /**
     * 侧边栏展开/收起
     */
    sidebarOpened: true,
    /**
     * 当前应用的语言： <br>
     * 默认从本地存储（通过 getItem(LANG)）获取，如果没有则默认为 'zh'（简体中文）。
     */
    language: getItem(LANG) || 'zh',
    /**
     * 存储标签视图列表：<br>
     * 默认从本地存储获取（getItem(TAGS_VIEW)），如果本地存储中没有值，则初始化为空数组。
     */
    tagsViewList: getItem(TAGS_VIEW) || []
  }),
  mutations: {
    /**
     * 切换 sidebarOpened 状态（控制侧边栏展开/收起）
     * @param state
     */
    triggerSidebarOpened(state) {
      state.sidebarOpened = !state.sidebarOpened
    },
    /**
     * 设置语言：
     * 1. 设置应用的语言，并将语言保存到本地存储中。
     * 2. 它接受一个 lang 参数，表示要设置的语言，并通过 setItem(LANG, lang) 将语言保存到本地存储。
     */
    setLanguage(state, lang) {
      setItem(LANG, lang)
      state.language = lang
    },
    /**
     * 添加一个标签视图到 tagsViewList 中：
     * 1. 检查标签路径是否已存在，如果没有则将标签添加到列表中
     * 2. 将更新后的标签列表存入本地存储。
     */
    addTagsViewList(state, tag) {
      const isFind = state.tagsViewList.find(item => {
        return item.path === tag.path
      })
      // 处理重复
      if (!isFind) {
        state.tagsViewList.push(tag)
        setItem(TAGS_VIEW, state.tagsViewList)
      }
    },
    /**
     * 为指定的 tag 修改 title
     * 1. 修改指定索引位置的标签视图
     * 2. 它接受一个 index 和一个 tag 对象，更新指定位置的标签
     * 3. 将更新后的标签列表存入本地存储。
     */
    changeTagsView(state, { index, tag }) {
      state.tagsViewList[index] = tag
      setItem(TAGS_VIEW, state.tagsViewList)
    },
    /**
     * 删除 tag(标签视图)<br>
     * 删除逻辑分为三种情况：
     * * index：删除指定索引位置的标签。
     * * other：删除当前标签之后的所有标签，并删除当前标签之前的所有标签。
     * * right：删除当前标签右侧的所有标签。
     * * 操作完成后，更新后的标签列表会被存储到本地存储。
     * @param {type: 'other'||'right'||'index', index: index} payload
     */
    removeTagsView(state, payload) {
      if (payload.type === 'index') {
        state.tagsViewList.splice(payload.index, 1)
        return
      } else if (payload.type === 'other') {
        state.tagsViewList.splice(
          payload.index + 1,
          state.tagsViewList.length - payload.index + 1
        )
        state.tagsViewList.splice(0, payload.index)
      } else if (payload.type === 'right') {
        state.tagsViewList.splice(
          payload.index + 1,
          state.tagsViewList.length - payload.index + 1
        )
      }
      setItem(TAGS_VIEW, state.tagsViewList)
    }
  },
  actions: {}
}
