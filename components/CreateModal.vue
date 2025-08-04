<script setup lang="ts">
//案件種類假資料 -----------
import { topicData } from '~/data/topic';
//科假資料 -----------
import { regionData } from '~/data/region';
//屬假資料 -----------
import { categoryData } from '~/data/category';
//種假資料 -----------
import { phaseData } from '~/data/phase';
import { taskTags } from '~/data/task-tags';

const form = useTemplateRef('form')

const props = defineProps<{
  items: []
}>()

const emit = defineEmits<{ close: [boolean] }>()

const activePanel = ref<'select' | 'edit' | null>(null)
const showTaskPanel = ref<Boolean>(false)
// null = 預設（欄位沒填好）
// false = 無重複
// object = 重複的資料物件
const duplicateBlock = ref<null | false | typeof props.items[0]>(null)

const payload = ref({
  topic: null,
  region: null,
  category: null,
  phase: null,
  parentTags: [],
  childTags: [],
  rules: [{ text: '' }],
  publicInfo: '',
  tasks: [],
  links: [{ name: '',link: '' }],
  files: [{ file: '', note: '' }],
})

watch(
  () => ({
    topic: payload.value.topic,
    region: payload.value.region,
    category: payload.value.category,
    phase: payload.value.phase,
    parentTags: payload.value.parentTags.map(tag => tag.id).sort(),
    childTags: payload.value.childTags.map(tag => tag.id).sort()
  }),
  (newVal) => {
    const allFilled = newVal.topic && newVal.region && newVal.category && newVal.phase &&
      newVal.parentTags.length > 0 && newVal.childTags.length > 0

    if (allFilled) {
      duplicateBlock.value = checkForDuplicate()
    } else {
      duplicateBlock.value = null
    }
  },
  { deep: true }
)

function isEqualUnordered(a: any[], b: any[]) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i].id !== sortedB[i].id) return false
  }
  return true
}

function checkForDuplicate() {
  const found = props.items.find(item =>
    item.topic === payload.value.topic &&
    item.region === payload.value.region &&
    item.category === payload.value.category &&
    item.phase === payload.value.phase &&
    isEqualUnordered(item.parentTags, payload.value.parentTags) &&
    isEqualUnordered(item.childTags, payload.value.childTags)
  )
  
  return found ?? false
}

const colorTags = ref<{id: string, title: string, preid: string, color: string}[]>([])
// 選擇母子標籤確認後
const handleTagConfirm = (l2, l3) => {
  // 已選擇母子標籤搭配顏色
  colorTags.value = [
    ...l2.map(item => ({ ...item, color: 'bg-[#c29341]' })),
    ...l3.map(item => ({ ...item, color: 'bg-[#a38ed0]' }))
  ]
  activePanel.value = null
  payload.value.parentTags = l2
  payload.value.childTags = l3
}

function togglePanel(panel: 'select' | 'edit') {
  activePanel.value = activePanel.value === panel ? null : panel
}

function handleTaskConfirm(confirmTasks) {
  payload.value.tasks = confirmTasks
  showTaskPanel.value = false
}

async function onSubmit() {
  console.log(payload.value)
}
</script>

<template>
  <UModal
    ref="form"
    title="新增法制規定"
    :dismissible="false"
    :close="{ onClick: () => emit('close', false) }"
     :ui="{ content: 'max-w-6xl bg-white' }"
  >
    <template #description>
      <div id="modal-desc" class="sr-only"> </div>
    </template>

    <template #body>
      <UForm :state="payload">
        <div class="flex flex-col gap-6">
          <div class="grid grid-cols-4 gap-2">
            <UFormField label="案件種類" required>
              <SelectValueBind
                v-model="payload.topic"
                :items="topicData"
                placeholder="請選擇"
              />
            </UFormField>
            <UFormField label="科" required>
              <SelectValueBind
                v-model="payload.region"
                :items="regionData"
                placeholder="請選擇"
              />
            </UFormField>
            <UFormField label="屬" required>
              <SelectValueBind
                v-model="payload.category"
                :items="categoryData"
                placeholder="請選擇"
              />
            </UFormField>
            <UFormField label="種" required>
              <SelectValueBind
                v-model="payload.phase"
                :items="phaseData"
                placeholder="請選擇"
              />
            </UFormField>
          </div>
          <div>
            <div class="flex gap-2 items-center">
              <UFormField label="母子標籤" required />
              <UButton label="選擇標籤" color="cyan" size="sm" @click="togglePanel('select')" />
              <UButton label="編輯標籤" color="cyan" size="sm" @click="togglePanel('edit')" />
            </div>
            <MultiLevelTagsSelector
              v-show="activePanel === 'select'"
              :allItems="taskTags"
              @confirm="handleTagConfirm"
            />
            <MultiLevelTagsEditor v-show="activePanel === 'edit'" v-model="taskTags" />
            <div class="mt-2 flex items-center">
              <span class="text-xs text-slate-500">已選擇：</span>
              <div class="flex-1 px-2 flex gap-1">
                <SelectedBadge v-for="tag in colorTags" :label="tag.title" :color="tag.color" bordered />
              </div>
            </div>
          </div>
          <div v-if="!duplicateBlock && duplicateBlock !== null" class="flex flex-col gap-6">
            <div>
              <UFormField label="法制規定" required>
                <RepeatableRow
                  v-model="payload.rules"
                  :default-row="{ text: '' }"
                >
                  <template #default="{ item }">
                    <UTextarea
                      v-model="item.text"
                      class="w-full"
                      autoresize
                      placeholder="請輸入內容"
                      :ui="{ base: 'focus-visible:ring-1 focus-visible:ring-blue-600'}"
                    />
                  </template>
                </RepeatableRow>
              </UFormField>
            </div>
            <div>
              <UFormField label="可對外公開資訊">
                <UTextarea
                  autoresize
                  size="lg"
                  placeholder="請輸入內容"
                  class="w-full"
                  :ui="{ base: 'focus-visible:ring-1 focus-visible:ring-blue-600'}"
                />
              </UFormField>
            </div>
            <div>
              <div class="flex gap-2 items-center">
                <UFormField label="對應任務" />
                <UButton label="選擇任務" color="cyan" size="sm" @click="showTaskPanel = !showTaskPanel" />
              </div>
              <MultiLevelTasksSelector :allTags="taskTags" @confirm="handleTaskConfirm" v-if="showTaskPanel" />
              <div class="mt-2 flex items-center">
                <span class="text-xs text-slate-500">已選擇：</span>
                <div class="flex-1 px-2 flex gap-1">
                  <SelectedBadge v-for="task in payload.tasks" :label="task.flowname" size="sm" />
                </div>
              </div>
            </div>
            <div>
                <UFormField label="對應法條與連結" />
                  <RepeatableRow
                    v-model="payload.links"
                    :default-row="{ name: '',link: '' }"
                  >
                  <template #default="{ item }">
                    <UButtonGroup orientation="vertical" class="w-full">
                      <UInput
                        v-model="item.name"
                        placeholder="請輸入法條名稱"
                        :ui="{
                          base: 'pl-11',
                          leading: 'pointer-events-none'
                        }"
                      >
                        <template #leading>
                          <p class="text-xs text-muted">法條</p>
                        </template>
                      </UInput>
                      <UInput
                        v-model="item.link"
                        placeholder="請輸入法條連結"
                        :ui="{
                          base: 'pl-11',
                          leading: 'pointer-events-none'
                        }"
                      >
                        <template #leading>
                          <p class="text-xs text-muted">法條</p>
                        </template>
                      </UInput>
                    </UButtonGroup>
                  </template>
                </RepeatableRow>
            </div>
            <div>
              <UFormField label="附件" />
              <RepeatableRow
                  v-model="payload.files"
                  :default-row="{ file: '', note: '' }"
                >
                <template #default="{ item }">
                  <div class="space-y-1 w-full">
                    <UInput v-model="item.file" type="file" class="w-full" />
                    <UTextarea
                      autoresize
                      v-model="item.note"
                      size="lg"
                      placeholder="檔案備註說明"
                      class="w-full"
                      :ui="{ base: 'focus-visible:ring-1 focus-visible:ring-blue-600'}"
                    />
                  </div>
                </template>
              </RepeatableRow>
            </div>
          </div>
          <div v-else-if="duplicateBlock">
            <p class="text-rose-500 mb-2">※ 此法制規定已經有建立過了喔！</p>
            <div class="border border-slate-300">
              <div class="bg-black text-white p-2">法制規定</div>
              <div class="px-2 py-3">
                <div v-for="rule in duplicateBlock.rules" class="border-b border-gray-300 mb-3 last:mb-0 last:border-b-0 pb-3">
                  <pre class="whitespace-pre-line py-1 px-2 overflow-y-scroll max-h-32 scrollbar">
                    {{ rule.text }}
                  </pre>
                </div>
              </div>
              <span class="text-gray-400 text-xs flex flex-wrap gap-x-3 px-2 pb-3">
                建立人：{{ duplicateBlock.created_user }} · {{ duplicateBlock.created_at }}
              </span>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton color="gray" label="取消新增" variant="outline" @click="emit('close', false)" v-if="duplicateBlock === null" />
      <div class="flex justify-between w-full" v-else-if="!duplicateBlock && duplicateBlock !== null">
        <UButton color="gray" label="取消" variant="outline" @click="emit('close', false)" />
        <UButton label="確定送出" @click="onSubmit" />
      </div>
      <div class="flex justify-between w-full" v-else>
        <UButton color="gray" label="取消新增" variant="outline" @click="emit('close', false)" />
        <UButton label="前往編輯此法治規定" color="gray" />
      </div>
    </template>
  </UModal>
</template>
