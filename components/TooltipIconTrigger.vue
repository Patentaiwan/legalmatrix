<script setup lang="ts">
const props = withDefaults(defineProps<{
  tooltip: string
  icon?: string
  color?: string
  variant?: string
}>(), {
  color: 'gray',
  variant: 'link'
})
defineEmits(['click'])
const open = defineModel<boolean>('open')
</script>

<template>
  <UPopover v-model:open="open" arrow>
    <UTooltip 
      :text="props.tooltip"
      :delay-duration="0"
      :content="{
        align: 'center',
        side: 'top',
        sideOffset: 8
      }"
      :ui="{ 
        content: 'h-auto px-2 py-2 bg-gray-700 text-white',
        arrow: 'fill-gray-700'
      }"
      arrow
    >
      <UButton
        class="text-gray-500"
        size="xs"
        :color="props.color"
        :variant="props.variant"
        :icon="props.icon"
        square 
        @click="$emit('click')"
      />
    </UTooltip>

    <template #content v-if="$slots.popover">
      <slot name="popover" />
    </template>
  </UPopover>
</template>
