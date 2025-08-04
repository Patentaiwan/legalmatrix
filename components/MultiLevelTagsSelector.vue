<script setup lang="ts">
import { useCascadeSelection } from '~/composables/useCascadeSelection';
import { useDisplayFilter } from '~/composables/useDisplayFilter';
import { useSelectedItems } from '~/composables/useSelectedItems';

type Item = {
  id: string
  title: string
  preid: string
}

const props = defineProps<{
  allItems: Item[]
}>()

const emit = defineEmits(['confirm'])

const {
  selectedL1,
  selectedL2,
  fullLevel1Items,
  fullLevel2Items,
  fullLevel3Items,
  selectL1,
} = useCascadeSelection(props.allItems)

const allLevel3Items = computed(() => {
  const allLevel2Ids = props.allItems
    .filter(item => item.preid !== '0' && props.allItems.some(p => p.id === item.preid && p.preid === '0'))
    .map(item => item.id)
  const level2IdSet = new Set(allLevel2Ids)
  return props.allItems.filter(item => level2IdSet.has(item.preid))
})

const level3Source = computed(() =>
  selectedL2.value ? fullLevel3Items.value : allLevel3Items.value
)

const {
  displayedItems: displayedLevel1Items,
} = useDisplayFilter(fullLevel1Items, { withSearch: false })
const {
  searchText: searchL2Text,
  displayedItems: displayedLevel2Items,
  updateDisplay: updateDisplayL2
} = useDisplayFilter(fullLevel2Items)
const {
  searchText: searchL3Text,
  displayedItems: displayedLevel3Items,
  updateDisplay: updateDisplayL3
} = useDisplayFilter(level3Source)

const {
  selectedIds: selectedL2Ids,
  selectedItems: selectedL2Items
} = useSelectedItems(props.allItems)
const {
  selectedIds: selectedL3Ids,
  selectedItems: selectedL3Items
} = useSelectedItems(props.allItems)

function toggleL2Selection(id: string, checked: string | Boolean) {
  const index = selectedL2Ids.value.indexOf(id)
  if (checked && index == -1) {
    selectedL2Ids.value.push(id)
    selectedL2.value = id
  } else {
    selectedL2Ids.value.splice(index, 1)
    selectedL2.value = null
  }
}

function toggleL3Selection(id: string, checked: string | Boolean) {
  const index = selectedL3Ids.value.indexOf(id)
  if (checked && index === -1) {
    selectedL3Ids.value.push(id)
    const existingItem = selectedL3Items.value.find(item => item.id === id)
    const l2Index = selectedL2Ids.value.indexOf(existingItem.preid)
    if (l2Index === -1) {
      selectedL2Ids.value.push(existingItem.preid)
    }
  } else {
    selectedL3Ids.value.splice(index, 1)
  }
}

function clear() {
  selectedL2Ids.value = []
  selectedL3Ids.value = []
}

function confirmSelected() {
  emit('confirm', selectedL2Items.value, selectedL3Items.value)
}
</script>

<template>
  <div class="bg-gray-100 ring-1 ring-gray-200 rounded-lg p-3 my-1">
    <div class="mb-3 pb-3 border-b border-gray-300 flex items-start">
      <div class="flex w-full">
        <div class="flex-[3] flex">
          <div class="basis-1/2">
            <p class="text-sm text-gray-600 font-bold mb-0 whitespace-nowrap">已選擇母標籤：</p>
            <div class="py-2 h-16 max-h-20 overflow-auto">
              <UCheckboxGroup
                label-key="title"
                value-key="id"
                color="info"
                v-model="selectedL2Ids"
                :items="selectedL2Items"
                :ui="{ base: 'bg-white' }"
              />
            </div>
          </div>
          <div class="basis-1/2">
            <p class="text-sm text-gray-600 font-bold mb-0 whitespace-nowrap">已選擇子標籤：</p>
            <div class="py-2 h-16 max-h-20 overflow-auto">
              <UCheckboxGroup
                label-key="title"
                value-key="id"
                color="info"
                v-model="selectedL3Ids"
                :items="selectedL3Items"
                :ui="{ base: 'bg-white' }"
              />
            </div>
          </div>
        </div>
        <div class="flex-[1] flex items-start justify-end gap-xl-3">
          <UButton color="green" variant="link" class="underline" @click="clear">清除</UButton>
          <UButton color="emerald" @click="confirmSelected">確定送出</UButton>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-[1fr_2fr_2fr] h-75">
      <div class="px-4 space-y-2 max-h-74 overflow-auto">
        <UButton
          v-for="item in displayedLevel1Items"
          :key="item.id"
          :class="['w-full justify-center', { 'bg-white text-black': selectedL1 == item.id }]"
          color="neutral"
          variant="link"
          @click="selectL1(item.id)"
        >
          {{ item.title }}
        </UButton>
      </div>
      <div class="px-4 border-l border-r border-gray-300">
        <UInput
          placeholder="母標籤搜尋"
          icon="i-heroicons-magnifying-glass-20-solid"
          class="w-full"
          v-model="searchL2Text"
          @keydown.enter="updateDisplayL2"
        />
        <div class="text-sm text-gray-600 font-bold my-4">母標籤：</div>
        <div class="max-h-52 overflow-auto">
          <div class="flex gap-x-2 flex-col gap-y-1">
            <UCheckbox
              v-for="item in displayedLevel2Items"
              :label="item.title"
              :value="item.id"
              :model-value="selectedL2Ids.includes(item.id)"
              :ui="{ base: 'bg-white' }"
              color="info"
              @update:model-value="checked => toggleL2Selection(item.id, checked)"
            />
          </div>
        </div>
      </div>
      <div class="px-4">
        <UInput
          placeholder="子標籤搜尋"
          icon="i-heroicons-magnifying-glass-20-solid"
          class="w-full"
          v-model="searchL3Text"
          @keydown.enter="updateDisplayL3"
        />
        <div class="text-sm text-gray-600 font-bold my-4">子標籤：</div>
        <div class="max-h-52 overflow-auto flex flex-col gap-1">
          <UCheckbox
            v-for="item in displayedLevel3Items"
            :label="item.title"
            :value="item.id"
            color="info"
            :ui="{ base: 'bg-white' }"
            :model-value="selectedL3Ids.includes(item.id)"
            @update:model-value="checked => toggleL3Selection(item.id, checked)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
