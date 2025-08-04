export function useSelectedItems<T>(
  source: Ref<T[]> | T[]
) {
  const items = computed(() => isRef(source) ? source.value : source)

  const selectedIds = ref<string[]>([])
  const selectedItems = computed(() =>{
    const selectedSet = new Set(selectedIds.value)
    return items.value.filter(item => selectedSet.has(item.id))
  })

  return {
    selectedIds,
    selectedItems,
  }
}