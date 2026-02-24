<template>
  <section id="feature-formatter" class="wrapper grid border-t md:grid-cols-2">
    <div class="px-5 py-6 md:p-10 flex flex-col justify-center gap-15">
      <div class="flex flex-col gap-5">
        <span class="text-grey text-xs font-mono uppercase tracking-wide"
          >Formatter<span class="text-aqua"> (Beta)</span></span
        >
        <h4 class="text-white">Oxfmt: Prettier-compatible formatter</h4>
        <p class="text-white/70 text-base max-w-[25rem] text-pretty">
          Enforce consistent code styles
        </p>
        <ul class="checkmark-list">
          <li>
            30x faster than <code class="mx-1 outline-none bg-nickel/50 text-aqua">Prettier</code>
          </li>
          <li>
            3x faster than <code class="mx-1 outline-none bg-nickel/50 text-aqua">Biome</code>
          </li>
          <li>Tailwind class sorting support</li>
        </ul>
        <a href="/docs/guide/usage/formatter" class="button w-fit mt-6">Usage Guide</a>
      </div>
    </div>
    <div class="flex flex-col">
      <div
        class="h-full overflow-clip flex justify-end items-center py-5 px-5 md:py-20 md:pl-10 md:pr-0"
      >
        <img
          loading="lazy"
          src="@assets/oxc/oxc-formatter-terminal.png"
          alt="Linter"
          class="[mask-image:linear-gradient(to_bottom,black_50%,transparent),linear-gradient(to_right,black_50%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
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
