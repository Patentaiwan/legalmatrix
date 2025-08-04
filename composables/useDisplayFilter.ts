export function useDisplayFilter<T>(
  fullItems: Ref<T[]>,
  options?: {
    searchText?: Ref<string>
    withSearch?: boolean
    getTitle?: (item: T) => string
  }
) {
  const searchText = options?.searchText ?? ref('')
  const withSearch = options?.withSearch ?? true
  const getTitle = options?.getTitle ?? ((item: any) => item.title)
  const searchableItems = computed(() => {
    return fullItems.value.map(i => ({
      ...i,
      _title: getTitle(i),
    }))
  })

  const isSearching = ref(false)
  const displayedItems = ref<T[]>([])
  
  // 依據 fullItems + searchText 產出顯示資料
  function updateDisplay() {
    isSearching.value = searchText.value.trim().length > 0
    if (!withSearch || !isSearching.value) {
      displayedItems.value = fullItems.value
    } else {
      displayedItems.value = searchableItems.value.filter(i => 
        i._title.includes(searchText.value)
      )
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  function debounceUpdate() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      updateDisplay()
    }, 200)
  }

  watch(fullItems, debounceUpdate, { immediate: true })

  function setSearchText(keyword: string) {
    searchText.value = keyword
  }

  function clearSearch() {
    searchText.value = ''
    updateDisplay()
  }

  return {
    searchText,
    isSearching,
    displayedItems,
    setSearchText,
    clearSearch,
    updateDisplay,
  }
}
