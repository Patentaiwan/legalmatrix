<script setup lang="ts">
type Item = {
  id: string
  title: string
  preid: string
}

const props = defineProps<{
  item: Item,
  selected: Boolean,
}>()

const emits = defineEmits(['copy', 'delete', 'update', 'selected'])

const isEditing = ref(false)
const editableText = ref(props.item.title)
const popoverOpen = ref(false)

function startEdit() {
  isEditing.value = true
  editableText.value = props.item.title
}

function confirmEdit() {
  if (editableText.value !== props.item.title) {
    emits('update', props.item.id, editableText)
  }
  isEditing.value = false
}

function confirmDelete() {
  emits('delete', props.item)
  popoverOpen.value = false
}
</script>

<template>
  <div
    class="flex justify-between px-2 py-1 border-b border-slate-200 last:border-b-0 items-center cursor-pointer" 
    :class="{ 'bg-white shadow-sm rounded': props.selected }"
    @click="$emit('selected', props.item.id)"
  >
    <span class="text-sm" v-if="!isEditing">{{ props.item.title }}</span>
    <UInput
      v-else
      v-model="editableText"
      class="flex-1"
      size="sm"
    >
      <template #trailing>
        <UIcon name="i-heroicons-check" class="size-5 cursor-pointer" @click="confirmEdit" />
      </template>
    </UInput>
    <div class="flex gap-1 ml-2">
      <TooltipIconTrigger tooltip="修改" icon="i-ion-md-create" v-if="!isEditing" @click="startEdit" />
      <TooltipIconTrigger tooltip="複製" icon="i-material-symbols-copy-all-outline" @click="$emit('copy', item)" />
      <TooltipIconTrigger
        tooltip="刪除"
        icon="i-material-symbols-delete-outline"
        @update:open="open => (popoverOpen = open)"
      >
        <template #popover>
          <div class="p-3">
            <div class="flex gap-1 items-center text-sm">
              <UIcon name="i-tabler-alert-triangle-filled" class="w-4 h-4 min-w-4 text-red-500" />
              <span>確定刪除此標籤？</span>
            </div>
            <p class="text-sm text-left text-muted">附屬的標籤將一起刪除。</p>
            <div class="flex gap-1 justify-between mt-2">
              <UButton size="xs" color="gray" variant="outline" label="取消" @click="popoverOpen = false" />
              <UButton size="xs" color="rose" variant="solid" label="刪除" @click="confirmDelete" />
            </div>
          </div>
        </template>
      </TooltipIconTrigger>
    </div>
  </div>
</template>
