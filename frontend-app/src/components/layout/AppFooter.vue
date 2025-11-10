<template>
  <footer class="mt-10 border-t border-slate-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
    <div class="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
      <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-center sm:text-left">© {{ year }} Frontend App</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-slate-700">Privacy</a>
          <a href="#" class="hover:text-slate-700">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>


