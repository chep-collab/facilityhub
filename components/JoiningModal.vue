<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";
const companyStore = useCompanyStore();
const { getJoiningCompanyStatus } = storeToRefs(companyStore);
const toast = useToast();
const router = useRouter();

const props = defineProps({
  selectedCompany: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { selectedCompany, isOpen } = props;

const joinSelectedCompnay = async () => {
  try {
    const response = await companyStore.JoinACompnay(selectedCompany.id);
    toast.add({
      title: response.data.message || "Successful",
      color: "green",
    });
    emit("close");
    router.push("/dashboard/joined-centers");
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  }
};
</script>
<template>
  <div>
    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Please confirm
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="emit('close')"
            />
          </div>
        </template>
        <div>
          <div class="space-y-4">
            <div>
              Are you sure you want to join {{ selectedCompany.name }} ?
            </div>

            <UButton
              :loading="getJoiningCompanyStatus"
              @click="joinSelectedCompnay"
            >
              Join now
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
