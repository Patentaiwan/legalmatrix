<script setup lang="ts">
const props = defineProps<{
  label?: string
  color?: string
  bordered?: boolean
  size?: 'sm' | 'md'
}>()

const color = props.color || 'bg-black'
const sizeClass = props.size === 'sm' ? 'size-1.5 mt-2 mr-1' : 'size-2.5 mt-[5px]'
</script>

<template>
  <span
    class="inline-flex items-start gap-1 pl-1.5 pr-2 py-[1px] text-[13px]"
    :class="[
      props.bordered !== false ? 'border border-gray-300 rounded-xl' : '',
    ]"
  >
    <span
      class="rounded-full mt-1.5 shrink-0"
      :class="[sizeClass, color]"
    />
    <slot name="label">
      {{ label }}
    </slot>
  </span>
</template>
