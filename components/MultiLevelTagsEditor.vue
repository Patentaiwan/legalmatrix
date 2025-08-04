<script setup lang="ts">
import { useCascadeSelection } from '~/composables/useCascadeSelection';
import { useDisplayFilter } from '~/composables/useDisplayFilter';

type Item = {
  id: string
  title: string
  preid: string
}

const props = defineProps<{
  modelValue: Item[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Item[]): void
  (e: 'select', id: number): void
}>()

const searchL1Text = ref('')
const searchL2Text = ref('')
const searchL3Text = ref('')

const activeAddLevel = ref<string | null>(null)

const allItems = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const {
  selectedL1,
  selectedL2,
  fullLevel1Items,
  fullLevel2Items,
  fullLevel3Items,
  selectL1,
  selectL2,
} = useCascadeSelection(allItems, true)

const {
  displayedItems: displayedLevel1Items,
  updateDisplay: updateDisplayL1,
  setSearchText: setSearchL1Text
} = useDisplayFilter(fullLevel1Items, { searchText: searchL1Text })
const {
  displayedItems: displayedLevel2Items,
  updateDisplay: updateDisplayL2,
  setSearchText: setSearchL2Text
} = useDisplayFilter(fullLevel2Items, { searchText: searchL2Text})
const {
  displayedItems: displayedLevel3Items,
  updateDisplay: updateDisplayL3,
  setSearchText: setSearchL3Text
} = useDisplayFilter(fullLevel3Items, { searchText: searchL3Text })

function updateItems(updatedSubset, operationType: string) {
  let newItems = []
  if (operationType === 'edit') {
    const updatedMap = new Map(updatedSubset.map(i => [i.id, i]))
    newItems = props.modelValue.map(item =>
      updatedMap.has(item.id) ? updatedMap.get(item.id) : item
    )
  } else if (operationType === 'copy' || operationType === 'delete') {
    newItems = updatedSubset
  }

  emit('update:modelValue', newItems)
}

function onAdd(level: string) {
  activeAddLevel.value = level
}

// Todo: 未有一個子標籤建立成功前取消，需將上層建立資料一併取消
function cancelAdd(level: string, length: number) {
  if ([1, 2].includes(Number(level)) || (level == '3' && length === 1)) {
    activeAddLevel.value = null
  }
}

// 無暫存處理
function confirmAdd(level: string, items, index: number) {
  let preid = null
  let newItems = []
  let maxId = Math.max(...props.modelValue.map(i => Number(i.id)))
  let newId = String(maxId + 1)
  const title = items[index].text
  // 將下層列表清空
  if (level == '1') {
    selectedL1.value = newId
    selectedL2.value = null
    preid = '0'
  } else if (level == '2') {
    selectedL2.value = newId
    preid = selectedL1.value
  } else if (level == '3') {
    preid = selectedL2.value
    if (items.length == 1) {
      activeAddLevel.value = null
    } 
  }
  newItems = [...props.modelValue, {id: newId, title: title, preid: preid}]
  if (Number(level) < 3) {
    activeAddLevel.value = String(Number(level) + 1)
  }
  emit('update:modelValue', newItems)
}

function handleSearchL1(keyword: string) {
  setSearchL1Text(keyword)
  updateDisplayL1()
}

function handleSearchL2(keyword: string) {
  setSearchL2Text(keyword)
  updateDisplayL2()
}

function handleSearchL3(keyword: string) {
  setSearchL3Text(keyword)
  updateDisplayL3()
}
</script>

<template>
  <div class="bg-gray-100 ring-1 ring-gray-200 rounded-lg p-3 my-1">
    <div class="grid grid-cols-[1fr_2fr_2fr]">
      <div class="h-96 px-4">
        <InteractiveListPanel
          level="1"
          label="大分類"
          :items="displayedLevel1Items"
          :allItems="allItems"
          :selectedId="selectedL1"
          :activeAddLevel="activeAddLevel"
          @select="selectL1"
          @update:items="updateItems"
          @on-add="onAdd"
          @cancel-add="cancelAdd"
          @confirm-add="confirmAdd"
          @search="handleSearchL1"
        />
      </div>
      <div class="px-4 border-l border-r border-gray-300">
        <InteractiveListPanel
          level="2"
          label="母標籤"
          :items="displayedLevel2Items"
          :allItems="allItems"
          :selectedId="selectedL2"
          :activeAddLevel="activeAddLevel"
          @select="selectL2"
          @update:items="updateItems"
          @on-add="onAdd"
          @cancel-add="cancelAdd"
          @confirm-add="confirmAdd"
          @search="handleSearchL2"
        />
      </div>
      <div class="px-4">
        <InteractiveListPanel
          level="3"
          label="子標籤"
          :items="displayedLevel3Items"
          :allItems="allItems"
          :activeAddLevel="activeAddLevel"
          @update:items="updateItems"
          @on-add="onAdd"
          @cancel-add="cancelAdd"
          @confirm-add="confirmAdd"
          @search="handleSearchL3"
        />
      </div>
    </div>
  </div>
</template>