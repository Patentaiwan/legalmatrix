每個區塊內部的寫作順序建議
<script setup> 區域內建議順序：
import 區塊

props / emit

composables (useXXX)

ref / reactive 狀態

computed 

watch / WatchEffect

methods / function

lifecycle hooks（onMounted 等）

<template>
  <!-- HTML 模板 -->
</template>

<script setup lang="ts">
/** 1. Import */
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

/** 2. Define Props / Emits */
const props = defineProps<{
  title: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

/** 3. Composables (useXXX) */
const route = useRoute()
const router = useRouter()

/** 4. State / Refs */
const count = ref(0)

/** 5. Computed */
const double = computed(() => count.value * 2)

/** 6. Watch / WatchEffect */
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    count.value = 0
  }
})

/** 7. Methods */
function increment() {
  count.value++
}

/** 8. Lifecycle Hooks */
onMounted(() => {
  console.log('Mounted')
})

onUnmounted(() => {
  console.log('Unmounted')
})
</script>

<style scoped>
/* CSS 樣式 */
</style>


引入順序建議（import group）
// 第三方函式庫
import { ref } from 'vue'

// Nuxt composables
import { useRoute } from 'nuxt/app'

// 自家 composables / utils
import { useMyComposable } from '~/composables/useMyComposable'

// Types
import type { MyType } from '~/types'

// 元件
import MyComponent from '~/components/MyComponent.vue'


.vue 結構順序建議
<script setup lang="ts"> -> <template> -> <style>


v-for, v-if, v-show：結構性指令，會影響 DOM 出現與否或重複渲染，放最前面。

ref, key：跟元素識別或 DOM 互動相關，也建議放前面。

v-model / :modelValue：資料綁定主體，放在邏輯結構指令之後。

普通 props（例如 :label, :icon, placeholder 等）：控制元件屬性設定。

class / :class, style / :style：外觀樣式，放在屬性後面。

事件監聽（例如 @click, @input 等）：行為處理放最後。

組件分類
components/
├── base/            # 通用元件，例如按鈕、輸入框
├── layout/          # 導覽列、頁腳、側邊欄等版型元件
├── forms/           # 表單相關元件（驗證、欄位、步驟）
├── user/            # 跟使用者相關的功能性元件
├── modals/          # modal 專用元件
├── shared/          # 可複用但非基礎元件


類型	命名風格
元件、類別名稱	PascalCase
函式與變數	camelCase
資料夾與檔名（非元件）	kebab-case
Composable	useCamelCase
路由頁面與 middleware	kebab-case
CSS/SCSS partial	_kebab-case.scss