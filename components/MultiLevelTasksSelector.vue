<script setup lang="ts">
import { useCascadeSelection } from '~/composables/useCascadeSelection';
import { useDisplayFilter } from '~/composables/useDisplayFilter';
import { useSelectedItems } from '~/composables/useSelectedItems';
import { taskData } from '~/data/task';

type Item = {
  id: string
  title: string
  preid: string
}
const props = defineProps<{
  allTags: Item[]
}>()

const emit = defineEmits(['confirm'])

const {
  selectedL1,
  selectedL2,
  fullLevel1Items,
  fullLevel2Items,
  fullLevel3Items,
  selectL1 : handleSelectL1,
} = useCascadeSelection(props.allTags)

const {
  selectedIds: selectedL3Ids,
  selectedItems: selectedL3Items
} = useSelectedItems(props.allTags)
const {
  selectedIds: selectedL4Ids,
  selectedItems: selectedL4Items
} = useSelectedItems(taskData)

const {
  displayedItems: displayedLevel1Items,
} = useDisplayFilter(fullLevel1Items, { withSearch: false })
const {
  displayedItems: displayedLevel2Items,
} = useDisplayFilter(fullLevel2Items)
const {
  displayedItems: displayedLevel3Items,
} = useDisplayFilter(fullLevel3Items)

const selectedL3Labels = computed(() => [...new Set(selectedL3Items.value.map(i => i.title))])

const tasks = computed(() => {
  if (selectedL3Labels.value.length === 0) {
    return taskData.value
  }
  return taskData.value.filter(task =>
    selectedL3Labels.value.some(tag => task.tags.includes(tag))
  )
})

const {
  searchText: searchTaskText,
  displayedItems: displayedLevel4Items,
  updateDisplay: searchTask,
  clearSearch: clearTaskSearch
} = useDisplayFilter(tasks, { getTitle: i => i.flowname })

function toggleL2Selection(id: string) {
  selectedL2.value = selectedL2.value == id ? null : id
}

// 搜尋文本
const searchTagText = ref('')
const hasSearchTag = ref<Boolean>(false)

const keywordBtnColor = ref<string[]>(['fuchsia', 'lime', 'orange', 'teal', 'violet', 'grenn', 'blue', 'red'])
const showKeywordMenu = ref<Boolean>(false)

const keywordTasks = ref<{ id: string; title: string }[]>([])

watch(searchTagText, () => {
  if (searchTagText.value == '') {
    hasSearchTag.value = false
  }
})

function toggleL3Selection(id: string, checked: string | boolean) {
  const title = props.allTags.find(task => task.id == id).title
  const fullLevel2Ids = fullLevel2Items.value.map(item => item.id)
  const sameL3Items = props.allTags.filter(task => fullLevel2Ids.includes(task.preid) && task.title == title)
  sameL3Items.forEach(item => {
    if (checked && !selectedL3Ids.value.includes(item.id)) {
      selectedL3Ids.value.push(item.id)
    } else if (!checked) {
      selectedL3Ids.value = selectedL3Ids.value.filter(i => i !== item.id)
    }
  })
}

function cancelSelectedL3Labels(title: string, checked: string | boolean) {
  if (!checked) {
    const sameL3Items = props.allTags.filter(task => task.title == title)
    sameL3Items.forEach(item => {
      selectedL3Ids.value = selectedL3Ids.value.filter(i => i !== item.id)
    })
  }
}

function isIndeterminate(id: string) {
  const childTasks = props.allTags.filter(task => task.preid === id)
  return childTasks.filter(task => selectedL3Ids.value.includes(task.id)).length > 0
}

function showL2CheckboxIcon(id: string) {
  const childTasks = props.allTags.filter(task => task.preid === id)
  const selectedChildren = childTasks.filter(task => selectedL3Ids.value.includes(task.id))
  return childTasks.length == selectedChildren.length ? 'i-heroicons-check' : 'i-heroicons-minus'
}

function closeKeywordMenu() {
  showKeywordMenu.value = false
  searchTagText.value = ''
}

function searchKeyword() {
  const keyword = searchTagText.value
  hasSearchTag.value = true
  if (keyword == '') {
    keywordTasks.value = []
    return
  }
  const idMap = new Map(props.allTags.map(i => [i.id, i]))
  const seen = new Set<string>()
  const results = []

  for (const third of props.allTags) {
    const second = idMap.get(third.preid)
    const first = second && idMap.get(second.preid)

    // 必須是第三層節點（有祖父）
    if (!second || !first) continue

    // 第二或第三層的 title 符合 keyword（模糊）
    if (
      !second.title.includes(keyword) &&
      !third.title.includes(keyword)
    ) continue

    // 找 tags 包含第三層 title
    for (const task of taskData.value) {
      if (task.tags.includes(third.title)) {
        const id = task.id
        const title = `${second.title}/${third.title}/${task.flowname}`
        if (!seen.has(id)) { // 去重複
          seen.add(id)
          results.push({
            id: id,
            title
          })
        }
      }
    }
  }
  
  keywordTasks.value = results
}

function clearTagSearch() {
  searchTagText.value = ''
  searchKeyword()
}

function toggleKeywordTask(id: string, checked: string | boolean) {
  if (checked && !selectedL4Ids.value.includes(id)) {
    selectedL4Ids.value.push(id)
  } else if (!checked) {
    selectedL4Ids.value = selectedL4Ids.value.filter(i => i !== id)
  }
}

function cancelSelectedL4Labels(id: string, checked: string | boolean) {
  if (!checked) {
    selectedL4Ids.value = selectedL4Ids.value.filter(i => i !== id)
  }
}

function clear() {
  selectedL4Ids.value = []
}

function confirmSelected() {
  emit('confirm', selectedL4Items.value)
}
</script>

<template>
  <div class="bg-gray-100 ring-1 ring-gray-200 rounded-lg p-3 my-1">
    <div class="mb-3 pb-3 border-b border-gray-300 flex items-start">
      <div class="flex w-full">
        <div class="flex-1">
          <p class="text-sm text-gray-600 font-bold mb-0 whitespace-nowrap">已選擇任務：</p>
          <div class="py-2 h-20 max-h-20 overflow-auto grid grid-cols-2 gap-2">
            <UCheckbox
              v-for="item in selectedL4Items"
              :label="item.flowname"
              :value="item.id"
              color="info"
              :model-value="true"
              @update:model-value="checked => cancelSelectedL4Labels(item.id, checked)"
            />
          </div>
        </div>
        <div class="flex items-start justify-end gap-xl-3">
          <UButton color="green" variant="link" class="underline" @click="clear">清除</UButton>
          <UButton color="emerald" @click="confirmSelected">確定送出</UButton>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <UInput
        placeholder="標籤搜尋"
        icon="i-heroicons-magnifying-glass-20-solid"
        class="w-full"
        v-model="searchTagText"
        @click="showKeywordMenu = true"
        @keydown.enter="searchKeyword"
      >
        <template v-if="searchTagText !== ''" #trailing>
          <UButton
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="clearTagSearch"
          />
        </template>
      </UInput>
      <UButton color="gray" label="返回選單" variant="outline" class="bg-white font-normal justify-self-start" v-if="showKeywordMenu" @click="closeKeywordMenu" />
      <UInput
        v-else
        placeholder="任務搜尋"
        icon="i-heroicons-magnifying-glass-20-solid"
        class="w-full"
        v-model="searchTaskText"
        @keydown.enter="searchTask"
      >
        <template v-if="searchTaskText !== ''" #trailing>
          <UButton
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="clearTaskSearch"
          />
        </template>
      </UInput>
    </div>
    <div class="grid grid-cols-2 gap-4" v-if="!showKeywordMenu">
      <div>
        <div class="flex ps-1 items-center whitespace-nowrap">
          <div class="text-sm text-gray-600 font-bold my-4">已選擇標籤：</div>
          <div class="flex flex-row gap-2 overflow-scroll">
            <UCheckbox
              color="info"
              v-for="item in selectedL3Labels"
              :label="item"
              :value="item"
              :model-value="true"
              @update:model-value="checked => cancelSelectedL3Labels(item, checked)"
            />
          </div>
        </div>
        <div class="space-y-2 border-r border-gray-300 grid grid-cols-[1fr_5fr]">
          <div class="border-r border-gray-300 ps-3 pe-2 flex flex-col gap-2 max-h-74 overflow-auto">
            <UButton
              v-for="item in displayedLevel1Items"
              :key="item.id"
              :class="['w-full justify-center', { 'bg-white text-black': selectedL1 == item.id }]"
              color="neutral" 
              variant="link"
              @click="handleSelectL1(item.id)"
            >
              {{ item.title }}
            </UButton>
          </div>
          <div class="px-6 flex flex-col gap-2 max-h-74 overflow-auto">
            <div v-for="parent in displayedLevel2Items">
              <UCheckbox disabled color="gray" :value="parent.id" :ui="{ base: 'bg-gray-500'}" :model-value="isIndeterminate(parent.id)" :icon="showL2CheckboxIcon(parent.id)">
                <template #label>
                  <span class="block font-medium text-default" @click="toggleL2Selection(parent.id)">{{ parent.title }}</span>
                </template>
              </UCheckbox>
              <div class="mt-2 ml-2 mb-3 flex flex-wrap" v-show="selectedL2 == parent.id">
                <UCheckbox
                  v-for="child in displayedLevel3Items"
                  class="mr-4 mb-1"
                  color="info"
                  :key="child.id"
                  :label="child.title"
                   :ui="{ base: 'bg-white'}"
                  :model-value="selectedL3Ids.includes(child.id)"
                  @update:model-value="checked => toggleL3Selection(child.id, checked)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="max-h-86 overflow-auto">
        <div class="text-sm text-gray-600 font-bold my-4">任務項目搜尋結果：</div>
        <UCheckboxGroup
          color="info"
          label-key="flowname"
          value-key="id"
          :items="displayedLevel4Items"
          :ui="{ base: 'bg-white', fieldset: 'gap-y-2'}"
          v-model="selectedL4Ids"
        />
      </div>
    </div>
    <div class="flex items-center gap-1" v-if="searchTagText === '' && showKeywordMenu">
      <div class="text-sm text-gray-500">常用關鍵字：</div>
      <div class="flex gap-1">
        <UButton
          variant="outline"
          size="sm"
          class="bg-white"
          v-for="(item, index) in fullLevel1Items"
          :label="item.title"
          :color="keywordBtnColor[index]"
          @click="() => {
            searchTagText = item.title
            searchKeyword()
          }"
        />
      </div>
    </div>
    <div class="px-3 pt-3 max-h-80 overflow-auto grid grid-cols-2 gap-2 flex-wrap" v-if="hasSearchTag && searchTagText !== ''">
      <UCheckbox
        color="info"
        v-for="task in keywordTasks"
        :key="task.id"
        :label="task.title"
        :value="task.id"
        :ui="{ base: 'bg-white' }"
        @update:model-value="checked => toggleKeywordTask(task.id, checked)"
      />
    </div>
  </div>
</template>