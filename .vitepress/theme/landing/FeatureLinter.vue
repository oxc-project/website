<template>
  <section id="feature-linter" class="wrapper grid md:grid-cols-2">
    <div class="px-5 py-6 md:p-10 flex flex-col justify-center gap-15">
      <div class="flex flex-col gap-5">
        <span class="text-grey text-xs font-mono uppercase tracking-wide">Linter</span>
        <h4 class="text-white">Oxlint: ESLint-compatible linter</h4>
        <p class="text-white/70 text-base max-w-[25rem] text-pretty">
          Catch bugs before they make it to production
        </p>
        <ul class="checkmark-list">
          <li>
            50~100x faster than <code class="mx-1 outline-none bg-nickel/50 text-aqua">ESLint</code>
          </li>
          <li>800+ rules and growing</li>
          <li>
            True type-aware Linting powered by
            <code class="mx-1 outline-none bg-nickel/50 text-aqua">tsgo</code>
          </li>
          <li>
            Support for <code class="mx-1 outline-none bg-nickel/50 text-aqua">ESLint</code> JS
            Plugins
          </li>
        </ul>
        <a href="/docs/guide/usage/linter" class="button w-fit mt-6">Usage Guide</a>
      </div>
    </div>
    <div class="flex flex-col">
      <div
        class="card-bg h-full overflow-clip flex justify-end items-center py-20 px-5 md:pl-10 md:pr-0"
      >
        <img
          loading="lazy"
          src="@assets/oxc/oxc-linter-terminal.png"
          alt="Linter"
          class="w-full md:w-auto"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.card-bg {
  background-image: url("@assets/oxc/oxc-feature-background.jpg");
  background-size: cover;
  background-position: center;
}
</style>
