<template>
  <div class="al-view">
    <div class="al-empty">
      <div class="al-icon">
        <v-icon size="40" color="#CBD5E1">mdi-book-open-outline</v-icon>
      </div>
      <h2 class="bp-heading al-title">Anleitung</h2>
      <p class="al-subtitle bp-mono">Inhalte folgen in Kürze</p>
    </div>
  </div>
</template>

<style scoped>
.al-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  background: #F8FAFC;
}
.al-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.al-icon {
  width: 72px;
  height: 72px;
  background: #F1F5F9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.al-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}
.al-subtitle {
  font-size: 10px;
  color: #CBD5E1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
