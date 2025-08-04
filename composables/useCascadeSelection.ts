export interface CascadeItem {
  id: string
  title: string
  preid: string
}

export function useCascadeSelection(source: Ref<CascadeItem[] | CascadeItem[]>, autoSelectLevel2 = false) {
  const items = computed(() => isRef(source) ? source.value : source)

  // 選擇狀態
  const selectedL1 = ref<string | null>(null)
  const selectedL2 = ref<string | null>(null)
  
  const levelMap = computed(() => {
    const map = new Map<string, CascadeItem[]>()
    for (const item of items.value) {
      if (!map.has(item.preid)) {
        map.set(item.preid, [])
      }
      map.get(item.preid)!.push(item)
    }
    return map
  })

  // 取得各層資料
  const fullLevel1Items = computed(() => levelMap.value.get('0') || [])
  const fullLevel2Items = computed(() => levelMap.value.get(selectedL1.value!) || [])
  const fullLevel3Items = computed(() => {
    if (!selectedL2.value) return []
    return levelMap.value.get(selectedL2.value) || []
  })

  // Todo: 切換第一層時也切換第二層讓第三層資料怪怪的
  function selectL1(id: string) {
    selectedL1.value = id
    selectedL2.value = null
  }

  function selectL2(id: string) {
    selectedL2.value = id
  }

  // 預設初始化選取
  onMounted(() => {
    if (fullLevel1Items.value.length > 0) {
      selectedL1.value = fullLevel1Items.value[0].id
      const firstL2 = items.value.find(i => i.preid === selectedL1.value)
      if (autoSelectLevel2 && firstL2) selectedL2.value = firstL2.id
    }
  })

  return {
    // 狀態
    selectedL1,
    selectedL2,

    // 資料
    fullLevel1Items,
    fullLevel2Items,
    fullLevel3Items,

    // 方法
    selectL1,
    selectL2,
  }
}
