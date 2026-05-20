<template>
  <div class="d-flex" style="height: calc(100vh - 120px)">
    <!-- Sidebar -->
    <div class="pa-2" style="overflow-y: auto">
      <SidebarFilters
        ref="sidebarRef"
        :baustellen="baustellenStore.baustellen"
        :maengel="maengelStore.maengel"
        @focus-baustelle="focusBaustelle"
        @focus-mangel="focusMangel"
      />
    </div>

    <!-- Map -->
    <div class="flex-grow-1">
      <MapView
        :baustellen="visibleBaustellen"
        :maengel="visibleMaengel"
        :center="mapCenter"
        :zoom="mapZoom"
        @baustelle-detail="(id: string) => router.push(`/sb/baustellen/${id}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import MapView from '../../components/MapView.vue'
import SidebarFilters from '../../components/SidebarFilters.vue'
import type { Baustelle, Mangel } from '../../types/types'

const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()

const sidebarRef = ref<InstanceType<typeof SidebarFilters> | null>(null)
const mapCenter = ref<[number, number]>([48.3974, 10.001])
const mapZoom = ref(13)

const visibleBaustellen = computed(() =>
  sidebarRef.value?.show.baustellen !== false ? baustellenStore.baustellen : []
)
const visibleMaengel = computed(() =>
  sidebarRef.value?.show.maengel !== false ? maengelStore.maengel : []
)

function focusBaustelle(b: Baustelle) {
  mapCenter.value = [b.lat, b.lng]
  mapZoom.value = 16
}
function focusMangel(m: Mangel) {
  mapCenter.value = [m.lat, m.lng]
  mapZoom.value = 17
}
</script>
