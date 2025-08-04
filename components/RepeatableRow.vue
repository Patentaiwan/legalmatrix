<script setup lang="ts">
const props = defineProps<{
  modelValue: any[]
  defaultRow: any
}>()

const emit = defineEmits(['update:modelValue'])

const add = () => {
  emit('update:modelValue', [...props.modelValue, { ...props.defaultRow }])
}

const remove = (index: number) => {
  if (props.modelValue.length <= 1) return
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="flex items-end gap-1"
    >
      <slot :item="item" :index="index" />

      <!-- 刪除按鈕 -->
      <UButton
        v-if="modelValue.length > 1"
        class="border rounded-full border-gray-300"
        icon="i-heroicons-trash"
        size="sm"
        color="gray"
        variant="link"
        @click="remove(index)"
      />
      <div v-else class="w-[30px] h-[30px]"></div>

      <!-- 新增按鈕 -->
      <UButton
        v-if="index === modelValue.length - 1"
        class="border rounded-full border-gray-300"
        icon="i-heroicons-plus"
        size="sm"
        color="gray"
        variant="link"
        @click="add"
      />
      <div v-else class="w-[30px] h-[30px]"></div>
    </div>
  </div>
</template>
