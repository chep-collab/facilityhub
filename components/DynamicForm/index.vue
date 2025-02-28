<template>
  <div class="dynamic-form w-full md:w-3/5 lg:w-2/5">
    <!-- Stepper Component -->
    <Stepper :currentStep="currentStep" :steps="steps" />
    <!-- Facility Text  -->
    <section class="mt-[52px] gap-3 flex items-center flex-col">
      <h1 class="font-semibold text-[24px]">
        {{ formsInformation[currentStep - 1]?.text.header }}
      </h1>
      <p class="text-center text-[18px]">
        {{ formsInformation[currentStep - 1]?.text.sub }}
      </p>
      <hr class="w-full mt-5 h-[1px] bg-[#98A2B3]" />
    </section>

    <!-- Form Component -->

    <div class="pt-8">
      <h2 class="text-sm px-6 text-grey-border font-semibold">
        {{ formsInformation[currentStep - 1]?.text.sub }}*
      </h2>

      <keep-alive>
        <Transition name="fade-slide" mode="out-in">
          <component
            :is="formsInformation[currentStep - 1].formComponent"
            v-if="isVisible"
            v-model:isVisible="isVisible"
            @next-step="handleNextStep"
            @setup-success="handleSetupSuccess"
          />
        </Transition>
      </keep-alive>
    </div>

    <hr class="w-full mt-6 h-[1px] bg-[#98A2B3]" />

    <div class="flex w-full justify-between ml-auto mt-7 self-end">
      <div>
        <BaseButton
          @click="goBack"
          class="bg-transparent focus:bg-black focus:bg-opacity-5 hover:bg-opacity-5 hover:bg-black border md:min-w-[30%] border-grey-green text-grey-green p-[40px] w-fit"
          v-show="currentStep > 1"
        >
          <img src="../../assets/icons/arrowleft.svg" alt="back arrow" />
          Back
        </BaseButton>
      </div>
      <div>
        <BaseButton
          class="p-[40px] md:min-w-[30%] w-fit hover:bg-red-500 focus:bg-red-500 bg-error"
          >Logout</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";

type formsInformation = {
  text: { header: string; sub: string; formHeader: string };
  formComponent: any;
}[];

const emit = defineEmits(["next"]);
const router = useRouter();
const formsInformation: formsInformation = [
  {
    text: {
      header: "Facility Admin Setup",
      sub: "Complete setup to manage your facility",
      formHeader: "Add at least one service",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/SetupForm.vue")
    ),
  },
  {
    text: {
      header: "Facility Admin Payout",
      sub: "Allows users to see the account details to pay when subscribing to your facility",
      formHeader: "Provide settlement account",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/PayoutForm.vue")
    ),
  },
  {
    text: {
      header: "Facility Admin Profile Policy",
      sub: "Should users of your facility provide profile picture when joining your facility?",
      formHeader: "Set profile picture policy",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/ProfilePolicyForm.vue")
    ),
  },
  {
    text: {
      header: "Facility Admin Amenities",
      sub: "Select the amenities available in your facility",
      formHeader: "Select amenities",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/AmenitiesForm.vue")
    ),
  },
  {
    text: {
      header: "Facility Service Application Policy",
      sub: "Defines how users access and start using facility services",
      formHeader: "Set service application policy",
    },
    formComponent: defineAsyncComponent(
      () => import("../../components/DynamicForm/ServiceApplicationForm.vue")
    ),
  },
];

const steps = ref(["1", "2", "3", "4", "5"]);
const currentStep = ref(1);
const isVisible = ref(true);
watch(currentStep, async () => {
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
function handleNextStep() {
  isVisible.value = false;
  if (currentStep.value < formsInformation.length) {
    setTimeout(() => {
      currentStep.value++;
      isVisible.value = true;
    }, 500);
  }
}
function handleSetupSuccess() {
  
  router.push("/dashboard");
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
