<script setup lang="ts">
import { object, string } from "yup";
import { handleErrorMessages } from "~/common/errorHandlers";
const toast = useToast();
const companyServiceStore = useCompanyServiceStore();

await companyServiceStore.fetchCompanyServices();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(["close"]);

const { isOpen } = props;

const sendingInvitation = ref(false)
const emailsToInvite = ref([])

async function inviteUsers(event: any) {
  try {
    sendingInvitation.value = true;
    await useNuxtApp().$axios.post("/company/invite-users", { emails: emailsToInvite.value });
    toast.add({
      title: "Invitation sent",
      color: "green"
    })
    emailsToInvite.value = []
    emit("close")
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    sendingInvitation.value = false;
  }
}

let emailSchema = object({
  email: string().email(),
});
const singleEmail = ref("")
const isSingleEmailValid = ref(false)
const addToEmailList = async () => {
  try {
    isSingleEmailValid.value = await emailSchema.isValid({ email: singleEmail.value });
    if (isSingleEmailValid.value) {
      emailsToInvite.value = [...emailsToInvite.value, singleEmail.value];
      singleEmail.value = undefined
    } else {
      throw new Error("Enter a valid email")
    }
  } catch (error) {
    toast.add({
      title: "Enter a valid email",
      color: "orange",
    });
  } finally {
    isSingleEmailValid.value = false
  }
};

const removeEmailFromList = (email: string) => {
  emailsToInvite.value = emailsToInvite.value.filter(e => e !== email);
};
</script>
<template>
  <UModal v-model="isOpen">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Invite Users to join your facility
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="emit('close')" />
        </div>
      </template>
      <div>
        <UForm class="space-y-4" @submit="inviteUsers">
          <div class="flex flex-row gap-4 items-end">
            <UFormGroup label="Enter email address" name="name" class="w-full">
              <UInput v-model="singleEmail" />
            </UFormGroup>

            <UButton class="w-[50px] h-[40px]" type="button" :onclick="addToEmailList" color="white">
              Add
            </UButton>
          </div>

          <div v-if="emailsToInvite.length > 0">
            <h4 class="font-bold">Invite the following people</h4>
            <ol>
              <li v-for="(email, index) in emailsToInvite" class="flex flex-row justify-between my-2">
                <span>{{ index + 1 }}. {{ email }}</span>
                <UButton color="red" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                  @click="removeEmailFromList(email)" />
              </li>

            </ol>
          </div>
          <UButton :loading="sendingInvitation" :disabled="emailsToInvite.length < 1 || sendingInvitation" type="submit"
            block>
            Send Invitation
          </UButton>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
