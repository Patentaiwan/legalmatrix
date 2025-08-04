<script setup lang="ts">
type Item = {
  id: string
  title: string
  preid: string
}

const props = defineProps<{
  level: string
  label: string
  allItems: Item[]
  items: Item[]
  selectedId?: string | null
  activeAddLevel: string | null
}>()

const emit = defineEmits(['update:items', 'select', 'on-add', 'cancel-add', 'confirm-add', 'search'])

const updateItem = (id, newTitle) => {
  const target = props.items.find(item => item.id === id)
  if (target) {
    target.title = newTitle
  }
  emit('update:items', [target], 'edit')
}

const showAlert = ref<Boolean>(false)

function copy(item) {
  const newIdStart = generateNewId(props.allItems)
  const cloned = deepCloneItemWithChildren(item, props.allItems, newIdStart)

  const indexInLevel = props.items.findIndex(i => i.id === item.id)
  const beforeId = props.items[indexInLevel + 1]?.id
  const insertIndex = props.allItems.findIndex(i => i.id === beforeId)

  const updated = [
    ...props.allItems.slice(0, insertIndex === -1 ? props.allItems.length : insertIndex),
    ...cloned,
    ...props.allItems.slice(insertIndex === -1 ? props.allItems.length : insertIndex),
  ]

  emit('update:items', updated, 'copy')
}

function deepCloneItemWithChildren(root, allItems, startId) {
  const idMap = new Map()
  const queue = [root]
  const result = []
  let id = startId

  while (queue.length) {
    const current = queue.shift()
    const newItem = {
      ...current,
      id: String(id++),
      title: current.title + '（複製）',
      preid: idMap.get(current.preid) ?? current.preid,
    }

    idMap.set(current.id, newItem.id)
    result.push(newItem)

    queue.push(...allItems.filter(i => i.preid === current.id))
  }

  return result
}

function generateNewId(items) {
  return Math.max(...items.map(i => i.id)) + 1
}

function deleteItem(item) {
  const queue = [item]
  const toDelete = []

  while (queue.length) {
    const current = queue.shift()
    toDelete.push(current)
    const children = props.allItems.filter(i => i.preid === current.id)
    queue.push(...children)
  }
  const idsToDelete = new Set(toDelete.map(i => i.id))
  const newItem = props.allItems.filter(i => !idsToDelete.has(i.id))
  emit('update:items', newItem, 'delete')
}

const pendingRows = ref([{text: ''}])

function onAdd() {
  if (props.activeAddLevel == '3' && props.activeAddLevel == props.level) {
    pendingRows.value.push({text: ''})
  }
  emit('on-add', props.level)
}

const confirmAdd = (index: number) => {
  if (!pendingRows.value[index].text.trim()) {
    showAlert.value = true
    return
  }
  showAlert.value = false
  emit('confirm-add', props.level, pendingRows.value, index)
  if (pendingRows.value.length == 1) {
    pendingRows.value[index].text = ''
  } else {
    pendingRows.value.splice(index, 1)
  }
}

const cancelAdd = (index: number) => {
  emit('cancel-add', props.level, pendingRows.value.length)
  if (pendingRows.value.length == 1) {
    pendingRows.value[index].text = ''
  } else {
    pendingRows.value.splice(index, 1)
  }
}

const searchText = ref('')
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <div class="space-y-2">
      <div class="text-sm text-gray-600 font-bold my-4">{{ props.label }}</div>
      <UInput
        v-model="searchText"
        :placeholder="props.label + '搜尋'"
        icon="i-heroicons-magnifying-glass-20-solid"
        class="w-full"
        @keydown.enter="emit('search', searchText)"
      />
      <div class="max-h-60 overflow-auto">
        <div
          class="flex flex-col gap-1"
          :class="{ 'pointer-events-none opacity-50': activeAddLevel !== null}"
        >
          <RowWithActions
            v-for="item in items"
            :key="item.id"
            :item="item"
            :selected="item.id === props.selectedId"
            @selected="(id) => emit('select', id)"
            @update="updateItem"
            @copy="copy"
            @delete="deleteItem"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1 max-h-60 overflow-auto">
        <div class="flex items-center gap-1" v-if="activeAddLevel == level" v-for="(item, index) in pendingRows" :key="index">
          <UInput
            v-model="item.text"
            class="flex-1"
            size="sm"
          >
            <template #trailing>
              <UIcon name="i-heroicons-check" class="size-5 cursor-pointer" @click="confirmAdd(index)" />
            </template>
          </UInput>
          <UIcon name="i-material-symbols-delete-outline" @click="cancelAdd(index)" />
        </div>
        <UAlert class="mt-2 p-2 text-center" color="rose" variant="subtle" v-if="level == '3' && showAlert">
          <template #description>
            <div class="flex justify-center items-center gap-2">
              <UIcon name="i-lucide-triangle-alert" class="size-4" />
              <p class="mb-0 text-sm">請至少新增一個子標籤</p>
            </div>
          </template>
        </UAlert>
      </div>
    </div>
    <UButton
      class="w-full border border-dashed border-gray-300 font-normal mt-2 bg-white"
      color="gray"
      variant="ghost"
      v-if="activeAddLevel == null || (activeAddLevel == '3' && activeAddLevel == level)"
    >
      <div class="flex justify-center items-center gap-1 w-full" @click="onAdd">
        新增
        <UIcon name="i-material-symbols-add" class="size-5" />
      </div>
    </UButton>
  </div>
</template>