<template>
  <div style="height: calc(100vh - 120px)">
    <MapView :maengel="maengelStore.maengel" :baustellen="[]" />
  </div>
</template>

<script setup lang="ts">
import MapView from '../../components/MapView.vue'
import { useMaengelStore } from '../../stores/maengelStore'
const maengelStore = useMaengelStore()
</script>
