<template>
  <div>
    <NuxtLink to="/company/login">
      <UCard>
        Workspace <span class="text-yellow-400">Admin</span>
        <template #footer>
          <div class="text-xs">You own a workspace or study center</div>
        </template>
      </UCard>
    </NuxtLink>
    <br />
    <NuxtLink to="/user/login">
      <UCard>
        Workspace <span class="text-yellow-400">User</span>
        <template #footer>
          <div class="text-xs">Find and subscribe to workspaces</div>
        </template>
      </UCard>
    </NuxtLink>
  </div>
</template>
