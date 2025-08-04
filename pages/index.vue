<script setup lang="ts">
import { LazyCreateModal } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyCreateModal)

const search = ref('')
const selected = ref<string[]>([]);

const columnFilters = [
  { label: '全選', value: 'all' },
  { label: '對應任務設定', value: 'tasks' },
  { label: '對應法條與連結', value: 'links' },
  { label: '可對外公開資訊', value: 'publicInfo' },
  { label: '附件', value: 'files' }
]

const items = [
  {
    id: 1,
    topic: 'p',
    region: 'tw',
    category: 'inv',
    phase: 'app',
    parentTags: [{id: '9', preid: '1', title: '內專'},],
    childTags: [{id: '35', preid: '9', title: '核稿'}],
    rules: [
      { text: `申請人為國內法人
【POA】：公司蓋大小章(代表人簽章或蓋章)。
**申請人若在台灣有住居所，無須委任代理人，若有多位申請人，須指定其中1位申請人為「應受送達人」，或委由第三人為「送達代收人」。
【簽章之審核】：簽章需具有可比對簽署人簽名、蓋章或電子簽名之形式外觀，亦即簽章與申請書上的名字一致。EX: 申請人 廖光陽，簽章需中文""廖光陽""，不可簽英文(Xavier)。(根據2022年12月01日生效之專利審查基準第一篇1.2.4)
【申請地址】申請地址為官方聯繫申請人之方式之一，若變更原則上要向官方進行登記。若申請地址與現址不同，可能會變成第三方攻擊的點，需要去證明地址雖然不同，但專利人都是A公司，另外若未來做專利權讓與時，地址需與登記的相同，若不同則須於讓與的同時辦理變更。` },
      { text: `申請人為中國大陸、香港、澳門地區法人
【POA】：可僅由其代表人或有權簽章之人簽名，或依各國法令規定得僅蓋法人印章(EX:中國大陸)
**申請人若在台灣有住居所，無須委任代理人，若有多位申請人，須指定其中1位申請人為「應受送達人」，或委由第三人為「送達代收人」。
【簽章之審核】：簽章需具有可比對簽署人簽名、蓋章或電子簽名之形式外觀，亦即簽章與申請書上的名字一致。EX: 申請人 廖光陽，簽章需中文""廖光陽""，不可簽英文(Xavier)。(根據2022年12月01日生效之專利審查基準第一篇1.2.4)
【申請地址】申請人為外國籍者，中文地址填寫國名或地區名即可，無庸將英文地址翻譯為中文。但為維護申請人基本資料之完整性，英文地址欄位請務必填寫完整。
但由於國外申請人除非在台灣有住居所，否則一定要委託專利代理人，且專利公開時，國外申請人的地址也僅會顯示出國籍，故國外申請人的地址不至於會造成影響。
申請地址為官方聯繫申請人之方式之一，若變更原則上要向官方進行登記。申請地址與現址不同，可能會變成第三方攻擊的點，需要去證明地址雖然不同，但專利人都是A公司，另外若未來做專利權讓與時，地址需與登記的相同，若不同則須於讓與的同時辦理變更。` },
      { text: `申請人為外國法人
【POA】：得僅由其代表人或有權簽章之人簽名，或依各國法令規定得僅蓋法人印章(EX:中國大陸)
**申請人若在台灣有住居所，無須委任代理人，若有多位申請人，須指定其中1位申請人為「應受送達人」，或委由第三人為「送達代收人」。
【簽章之審核】簽章需具有可比對簽署人簽名、蓋章或電子簽名之形式外觀，亦即客戶的簽名要讓官方可以跟申請書上的名字對的起來。EX: 外國人Xavier，簽名形式外觀要看的出來是Xavier,若官方無法比對兩者，會被要求補正重簽。(根據2022年12月01日生效之專利審查基準第一篇1.2.4)
【申請地址】外國人之中文姓名必須填，但中文地址填寫國名或地區名即可，英文地址欄位請務必填寫完整。
但由於國外申請人除非在台灣有住居所，否則一定要委託專利代理人，且專利公開時，國外申請人的地址也僅會顯示出國籍，故國外申請人的地址不至於會造成影響。
申請地址為官方聯繫申請人之方式之一，若變更原則上要向官方進行登記。申請地址與現址不同，可能會變成第三方攻擊的點，需要去證明地址雖然不同，但專利人都是A公司，另外若未來做專利權讓與時，地址需與登記的相同，若不同則須於讓與的同時辦理變更。` }
    ],
    publicInfo: '自然人、學校、中小企業，規費每年減免1200',
    tasks: [
      {id: '173', tags: Array(2), flowname: 'D設計變更-發包採購', prelimit: '7', prepoint: '120'},
      {id: '590', tags: Array(2), flowname: 'P更新案件狀態(非本所)', prelimit: '3', prepoint: '90'}
    ],
    links: [{ name: 'N1',link: 'L1' }],
    files: [{ file: '給這個法規的附件檔案1.jpg', note: 'D1' }],
    created_user: 'Tina',
    created_at: '2024-09-18 18:01:12'
  },
]

function isSelected(value) {
  return selected.value.some(i => i === value)
}

function isAllSelected() {
  return selected.value.length === columnFilters.length
}

function toggleSelection(value: string) {
  if (isSelected(value)) {
    selected.value = selected.value.filter(i => i !== value)
  } else {
    selected.value.push(value)
  }
}

function toggleAll() {
  selected.value = isAllSelected() ? [] : [...columnFilters.map(column => column.value)]
}

function handleClick(event, value: string) {
  event.preventDefault()
  event.stopPropagation()

  if (value === 'all') {
    toggleAll()
  } else {
    toggleSelection(value)
  }
}

async function openModal() {
  const instance = modal.open({ items: items })
}
</script>

<template>
  <div class="w-full p-5">
    <h1 class="text-2xl font-medium mb-3 flex items-center gap-2">
      法制表管理
      <span class="text-xs fw-normal px-2 py-1 bg-rose-100 rounded text-rose-600">非公開資訊</span>
    </h1>
    <!-- Action column -->
    <div class="hidden sm:flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UInput
          :ui="{ base: 'w-80', trailing: 'pe-1' }"
          v-model="search"
          placeholder="法制規定關鍵字搜尋..."
          icon="i-heroicons-magnifying-glass-20-solid"
        >
          <template v-if="search !== ''" #trailing>
            <UButton
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="search = ''"
            />
          </template>
        </UInput>
        <UButton
          class="font-normal"
          size="md"
          icon="i-material-symbols-add"
          color="green"
          trailing
          :ui="{ base: 'text-white' }"
          @click="openModal"
        >
          新增法制規定
        </UButton>
      </div>
      <UDropdownMenu
        :ui="{ content: 'w-48' }"
        :items="columnFilters"
        :close-on-select="false"
        class="hover:bg-transparent cursor-pointer"
      >
        <template #default>
          <UButton 
            color="neutral"
            variant="outline"
            class="w-40"
          >
            <template #default>
              <div class="flex justify-between items-center w-full">
                <span>{{ selected.length === 0 ? '欄位篩選' : `已開啟 ${selected.length} 個欄位` }}</span>
                <UIcon name="i-lucide-chevron-down" class="size-5" />
              </div>
            </template>
          </UButton>
        </template>
        <template #item="{ item }">
          <div class="flex justify-between items-center cursor-pointer w-full" @click="(e) => handleClick(e, item.value)">
            <span>{{ item.label }}</span>
            <span class="ms-auto inline-flex gap-1.5 items-center">
              <UIcon name="i-lucide-check" class="size-5" 
                v-show="item.value === 'all'
                  ? isAllSelected()
                  : isSelected(item.value)"
              />
            </span>
          </div>
        </template>
      </UDropdownMenu>
    </div>
    <!-- End action column -->

    <!-- 手機版篩選區塊 -->
    <!-- 上方分頁 -->
    <!-- 表格 -->
    <table class="table w-full mt-2 overflow-x-auto">
      <thead class="bg-lime-950 text-[15px]">
        <tr>
          <th class="table-th" width="80px">
            <div class="table-filter">
              種類
              <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th" width="65px">
            <div class="table-filter">
              科
              <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th" width="65px">
            <div class="table-filter">
              屬
              <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th" width="65px">
            <div class="table-filter">
              種
              <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th" width="130px">
            <div class="table-filter">
            母標籤
            <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th">
            <div class="table-filter">
            子標籤
            <UButton color="white" variant="link" icon="i-flowbite-caret-down-solid" size="xs" class="filter-popover" />
            </div>
          </th>
          <th class="table-th">法制規定</th>
          <th class="table-th" v-show="selected.includes('tasks')">對應任務</th>
          <th class="table-th" v-show="selected.includes('links')">對應法條與連結</th>
          <th class="table-th" v-show="selected.includes('publicInfo')">可對外公開資訊</th>
          <th class="table-th" v-show="selected.includes('files')">附件</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in items" :key="key" class="text-neutral-900 border-b border-l border-r border-slate-300 text-sm leading-5">
          <td class="table-td">{{ item.topic }}</td>
          <td class="table-td">{{ item.region }}</td>
          <td class="table-td">{{ item.category }}</td>
          <td class="table-td">{{ item.phase }}</td>
          <td class="table-td">
            <SelectedBadge v-for="tag in item.parentTags" :label="tag.title" color="bg-[#c29341]" bordered />
          </td>
          <td class="table-td">
            <SelectedBadge v-for="tag in item.childTags" :label="tag.title" color="bg-[#a38ed0]" bordered />
          </td>
          <td class="table-td">
            <div>
              <div v-for="rule in item.rules" class="border-b border-gray-300 mb-3 last:mb-0 last:border-b-0 pb-3">
                <pre class="whitespace-pre-line py-1 px-2 overflow-y-scroll max-h-32 scrollbar">
                  {{ rule.text }}
                </pre>
              </div>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-gray-400 text-xs flex flex-wrap gap-x-3">
                <UIcon name="i-ion-md-person" class="size-3 relative top-0.5" />
                建立人：{{ item.created_user }} · {{ item.created_at }}
              </span>
              <UButton
                class="rounded-full hover:bg-gray-500 hover:text-white cursor-pointer p-1.5 transition-colors duration-200"
                icon="i-ion-md-create"
                size="xs"
                color="gray"
                variant="soft"
              />
            </div>
          </td>
          <td class="table-td" v-show="selected.includes('tasks')">
            <SelectedBadge v-for="task in item.tasks" :label="task.flowname" size="sm" class="mb-2" />
          </td>
          <td class="table-td" v-show="selected.includes('links')">
            <SelectedBadge v-for="link in item.links" size="sm" color="bg-green-800" class="mb-2 text-green-800 w-full cursor-pointer">
              <template #label>
                <div class="flex justify-between w-full">
                  {{ link.name }}
                  <UIcon name="i-material-symbols-open-in-new" class="w-4 h-4 min-w-4 relative top-0.5" />
                </div>
              </template>
            </SelectedBadge>
          </td>
          <td class="table-td" v-show="selected.includes('publicInfo')">{{ item.publicInfo }}</td>
          <td class="table-td" v-show="selected.includes('files')">
            <SelectedBadge v-for="file in item.files" size="sm" color="bg-green-800" class="mb-2 text-green-800 w-full cursor-pointer">
              <template #label>
                <div class="flex justify-between w-full">
                  {{ file.file }}
                  <UIcon name="i-material-symbols-open-in-new" class="w-4 h-4 min-w-4 relative top-0.5" />
                </div>
              </template>
            </SelectedBadge>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 下方分頁 -->
  </div>
</template>

<style scoped>
.table-th {
  padding: 8px;
  white-space: nowrap;
  font-weight: 400;
  color: white;

}
.table-filter {
  @apply flex justify-between;
}
.filter-popover {
  position: relative;
  padding-bottom: 0;
  top: calc(var(--spacing) * 0.5)
}
.table-td {
  border-right: 1px solid #cbd5e1;
  padding: 8px;
  vertical-align: top;
}
.table-td:last-child {
  border-right: none;
}
</style>