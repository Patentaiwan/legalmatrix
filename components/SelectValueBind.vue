<script setup lang="ts">
  const props = defineProps<{
    modelValue: string | number | null
    items: Array<{ label: string, value: string | number }>
  }>()

  const emit = defineEmits(['update:modelValue'])

  const selected = computed({
    get() {
      return props.items.find(option => option.value === props.modelValue) ?? null
    },
    set(val) {
      emit('update:modelValue', val?.value ?? null)
    }
  })
</script>

<template>
  <USelectMenu class="w-full" v-model="selected" :items="props.items" :ui="{ content: 'min-w-fit' }" />
</template>
