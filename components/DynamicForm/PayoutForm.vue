<template>
  <UContainer class="lg:px-6">
    <Transition class="fade-slide">
      <UForm
        v-if="isVisible"
        :schema="schema"
        class="flex flex-col mt-8 gap-6"
        :state="formState"
        @submit="onSubmit"
      >
        <!-- Country -->
        <div>
          <UFormGroup label="Country Name" name="countryName">
            <div class="i-famicons:globe-outline"></div>
            <InputField
              icon=""
              type="text"
              :disabled="true"
              v-model="formState.countryName"
              placeholder="Nigeria"
            >
              <template #leading>
                <img src="../../assets/icons/world.svg" alt="world icon" />
              </template>
            </InputField>
          </UFormGroup>
        </div>

        <!--  Bank Name -->
        <div>
          <UFormGroup label="Bank Name" name="bankName">
            <SelectField
              :options="bankOptions"
              option-attribute="name"
              v-model="formState.bankCode"
              placeholder="E.g Zenith Bank PLC"
            />
          </UFormGroup>
        </div>

        <!-- Account Number -->
        <div>
          <UFormGroup label="Account Number" name="accountNumber">
            <InputField
              type="number"
              v-model="formState.accountNumber"
              placeholder="e.g 0123345345"
            />
          </UFormGroup>

          <div></div>
        </div>

        <!--  Button -->
        <div class="flex justify-between mt-6">
          <BaseButton
            type="submit"
            :disabled="isDisabled"
            :class="
              isDisabled
                ? 'bg-grey-green cursor-not-allowed'
                : 'bg-primary-green hover:bg-[#0D7F32]'
            "
            >Continue</BaseButton
          >
        </div>
      </UForm>
    </Transition>
  </UContainer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();

const formState = ref({
  bankCode: "",
  accountNumber: 0,
  countryName: "Nigeria",
});
const props = defineProps<{
  isVisible: boolean;
}>();
const emit = defineEmits(["next-step"]);
const optionAttribute = "name";
// Period options

const bankOptions = ref([{}]);
const schema = object({
  bankCode: string(),
  accountNumber: number().min(
    10,
    "Account number cannot be less than 10 digits!"
  ),
  countryName: string().required("Country is required"),
});
const isDisabled = computed(() => {
  return (
    !formState.value.bankCode ||
    !formState.value.accountNumber ||
    !formState.value.countryName
  );
});

onMounted(async () => {
  const banksListResponse = await useNuxtApp().$axios.get(
    "/settlement-account/list-banks"
  );
  bankOptions.value = banksListResponse.data;
  const bankDetailsCut = banksListResponse.data.map((bank: unknown) => ({
    name: bank?.name,
    value: bank?.code,
  }));

  bankOptions.value = bankDetailsCut;
});

watchEffect(()=>{
  if (formState.value.accountNumber){
    try {
      
    } catch (error) {
      
    }
  }
})

const onSubmit = async () => {
  emit("next-step");
  try {
    const banksListResponse = await useNuxtApp().$axios.get(
      "/settlement-account/list-banks"
    );
  } catch (error) {}
  toast.add({
    title: "Form Submitted",
    description: "Your service has been created successfully!",
    color: "green",
  });
};
</script>

<style scoped></style>
