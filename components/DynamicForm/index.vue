<template>
  <div class="dynamic-form w-full md:w-3/5 lg:w-2/5">
    <!-- Stepper Component -->
    <template v-if="loading">
      <USkeleton class="h-8 w-full mb-4" />
    </template>
    <template v-else>
      <Stepper :currentStep="currentStep" :steps="steps" />
    </template>

    <!-- Facility Text  -->
    <section class="mt-[52px] gap-3 flex items-center flex-col">
      <template v-if="loading">
        <USkeleton class="h-8 w-3/4 mb-4" />
        <USkeleton class="h-6 w-2/3 mb-4" />
      </template>
      <template v-else>
        <h1 class="font-semibold text-[24px]">
          {{ formsInformation[currentStep ? currentStep - 1 : 0]?.text.header }}
        </h1>
        <p class="text-center text-[18px]">
          {{ formsInformation[currentStep ? currentStep - 1 : 0]?.text.sub }}
        </p>
        <hr class="w-full mt-5 h-[1px] bg-[#98A2B3]" />
      </template>
    </section>

    <!-- Form Component -->
    <div class="">
      <template v-if="loading">
        <USkeleton class="h-6 w-full mb-4" />
        <USkeleton class="h-6 w-full mb-4" />
      </template>
      <template v-else>
        <keep-alive>
          <Transition name="fade-slide" mode="out-in">
            <component
              :is="
                formsInformation[currentStep ? currentStep - 1 : 0]
                  .formComponent
              "
              v-if="isVisible"
              v-model:isVisible="isVisible"
              @next-step="handleNextStep"
              @setup-success="handleSetupSuccess"
            />
          </Transition>
        </keep-alive>
      </template>
    </div>

    <hr class="w-full mt-6 h-[1px] bg-[#98A2B3]" />

    <div class="flex w-full justify-between ml-auto mt-7 self-end">
      <template v-if="loading">
        <USkeleton class="h-10 w-1/3" />
        <USkeleton class="h-10 w-1/3" />
      </template>
      <template v-else>
        <!-- <div>
          <BaseButton
            v-if="canGoBack"
            @click="goBack"
            class="bg-transparent focus:bg-black focus:bg-opacity-5 hover:bg-opacity-5 hover:bg-black border md:min-w-[30%] border-grey-green text-grey-green p-[40px] w-fit"
            v-show="currentStep > 1"
          >
            <img src="../../assets/icons/arrowleft.svg" alt="back arrow" />
            Back
          </BaseButton>
        </div> -->
        <div class="w-fit flex ml-auto justify-end">
          <BaseButton
            @click="logout"
            class="p-[40px] md:min-w-[30%] w-fit hover:bg-red-500 focus:bg-red-500 bg-error"
            >Logout</BaseButton
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanyServiceStore } from "@/stores/companyServiceStore";
import { storeToRefs } from "pinia";

type formsInformation = {
  text: { header: string; sub: string; formHeader: string };
  formComponent: any;
}[];

const emit = defineEmits(["next"]);
const router = useRouter();
const formsInformation: formsInformation = [
  {
    text: {
      header: "Add A Service",
      sub: "Add the information for one service you provide. You will be able to add more later.",
      formHeader: "Add at least one service",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/SetupForm.vue")
    ),
  },
  {
    text: {
      header: "Settlement Account",
      sub: "Provide a bank account that payments can be made into.",
      formHeader: "Provide settlement account",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/PayoutForm.vue")
    ),
  },
  {
    text: {
      header: "Profile Picture Policy",
      sub: "Should users of your facility provide profile picture when joining your facility?",
      formHeader: "Set profile picture policy",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/ProfilePolicyForm.vue")
    ),
  },
  {
    text: {
      header: "Facility Amenities",
      sub: "Select the amenities that are available in your facility",
      formHeader: "Select amenities",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/AmenitiesForm.vue")
    ),
  },
  {
    text: {
      header: "User Access",
      sub: "Do you need to approve users before they can join your company and start using your service?",
      formHeader: "Set service application policy",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/ServiceApplicationForm.vue")
    ),
  },
];
const { logout } = useLogout();
const isVisible = ref(true);
const loading = ref(true);
const companyServiceStore = useCompanyServiceStore();
const { getCompanyOnboardingStatus } = companyServiceStore;
const { onboardingStatus } = storeToRefs(companyServiceStore);
const nextOnboardingStep = ref(onboardingStatus.value?.next_step || null);
const stepsWithNumber = [
  { name: "add_service", step: 1 },
  { name: "settlement_account", step: 2 },
  { name: "profile_picture_policy", step: 3 },
  { name: "select_amenities", step: 4 },
  { name: "service_application_policy", step: 5 },
];

const steps = stepsWithNumber.map((item) => item.step);

const currentStep = ref(
  stepsWithNumber.find((item) => item.name === nextOnboardingStep.value)?.step
);
watch(currentStep, async () => {
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(nextOnboardingStep, () => {
  currentStep.value = stepsWithNumber.find(
    (item) => item.name === nextOnboardingStep.value
  )?.step;
});

onMounted(async () => {
  const isOnboardingStatusEmpty =
    Object.keys(onboardingStatus.value).length === 0;

  if (isOnboardingStatusEmpty) {
    const response = await getCompanyOnboardingStatus();
    if (response?.result === "success") {
      nextOnboardingStep.value = response?.data.next_step || null;
    } else {
    }
  } else {
    nextOnboardingStep.value = onboardingStatus.value.next_step || null;
  }

  loading.value = false;
});

function handleNextStep() {
  isVisible.value = false;

  if (currentStep?.value < formsInformation.length) {
    setTimeout(() => {
      currentStep.value++;
      isVisible.value = true;
    }, 500);
  }
}
function handleSetupSuccess() {
  navigateTo("/dashboard");
}
function goBack() {
  currentStep.value--;
}
</script>

<style scoped>
.dynamic-form {
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0px 2px 8px 1px #0000001a;
  border-radius: 12px;
  padding: 40px 24px;
  min-height: 100vh;
  animation: fade-in 0.5s ease-in;
  /* margin-block: 96px; */
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }
    ,
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input,
textarea {
  margin-bottom: 10px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
