<template>
  <q-page class="column items-center image">
    <div class="q-mt-lg column items-center q-mb-lg width">
      <p class="text-h2 text-weight-medium">TIC Bank</p>
      <q-card bordered v-if="!signUpBool" class="height">
        <q-card-section class="column items-center">
          <div class="text-h4">Log in</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input outlined v-model="email" label="Email" class="input" />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="password"
            outlined
            label="Password"
            class="input"
            :type="isPwd ? 'password' : 'text'"
            hint="Password with toggle"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="column items-center q-pt-none">
          <q-btn
            color="primary"
            label="Log in"
            v-on:click="logIn"
            :disable="isLoading"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="column items-center">
          <div class="text-body1">Don't have an account?</div>
          <q-btn
            color="primary"
            label="Sign Up"
            v-on:click="toSignUp"
            :disable="isLoading"
          />
        </q-card-section>
      </q-card>
      <q-card bordered v-if="signUpBool" class="height">
        <q-card-section class="column items-center">
          <div class="text-h4">Sign Up</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            outlined
            v-model="firstName"
            label="First Name"
            class="input"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            v-model="lastName"
            label="Last Name"
            class="input"
          />
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="email" label="Email" class="input" />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="password"
            outlined
            label="Password"
            class="input"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="confirmPassword"
            outlined
            label="Confirm password"
            class="input"
            :type="isConfirmPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="column items-center">
          <q-btn
            color="primary"
            label="Sign up"
            v-on:click="signUp"
            :disable="isLoading"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="column items-center">
          <div class="text-body1">Already have an account?</div>
          <q-btn
            color="primary"
            label="Log In"
            v-on:click="toLogIn"
            :disable="isLoading"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const $store = useStore();

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const isPwd = ref(true);
    const isConfirmPwd = ref(true);
    const signUpBool = ref(false);
    const isLoading = ref(false);

    localStorage.removeItem("jwt");

    const toSignUp = () => {
      signUpBool.value = true;
      resetValues();
    };

    const toLogIn = () => {
      signUpBool.value = false;
      resetValues();
    };

    const resetValues = () => {
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";
      isPwd.value = true;
      isConfirmPwd.value = true;
    };

    const signUp = async () => {
      let bool = true;
      var regex = /\S+@\S+\.\S+/;
      var regex2 = /^[A-Za-z]\w{7,15}$/;
      if (firstName.value.length < 2) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: `First name too short`,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        bool = false;
      }
      if (lastName.value.length < 2) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: `Last name too short`,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        bool = false;
      }
      if (email.value.length < 10 && !regex.test(email.value)) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: `Invalid email`,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        bool = false;
      }
      if (!regex2.test(password.value)) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: `Password too weak! Password must be between 8 and 16 characters and contain only characters, numeric digits, underscore and first character must be a letter`,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        bool = false;
      }
      if (password.value.localeCompare(confirmPassword.value)) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: `Passwords must match`,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        bool = false;
      }

      if (bool) {
        const newUser = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
        };
        try {
          isLoading.value = true;
          setTimeout(() => {
            isLoading.value = false;
          }, 5000);
          const res = await api.post("/user/register", newUser);
          toLogIn();
          $q.notify({
            type: "positive",
            position: "top-right",
            message: "User registered with success",
            multiLine: true,
            actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
          });
        } catch (err) {
          $q.notify({
            type: "negative",
            position: "top-right",
            message: err.response.data.msg,
            multiLine: true,
            actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
          });
        }
      }
    };

    const logIn = async () => {
      try {
        const authUser = {
          email: email.value,
          password: password.value,
        };
        isLoading.value = true;
        setTimeout(() => {
          isLoading.value = false;
        }, 5000);
        const res = await api.post("/user/login", authUser);
        $q.notify({
          type: "positive",
          position: "top-right",
          message: "Logged in successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        $store.commit("setJWT", res.data.data);
        localStorage.setItem("jwt", res.data.data);
        router.push("/home");
      } catch (err) {
        $q.notify({
          type: "negative",
          position: "top-right",
          message: err.response.data.msg,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
      }
    };

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isPwd,
      isConfirmPwd,
      signUpBool,
      isLoading,
      toSignUp,
      toLogIn,
      signUp,
      logIn,
    };
  },
};
</script>

<style scoped>
* {
  overflow: hidden;
}

.image {
  background: url("https://wallpaperaccess.com/full/3161112.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.width {
  width: 90%;
}

.input {
  width: 15rem;
  margin-left: 2rem;
  margin-right: 2rem;
}

.height {
  height: 30rem;
  overflow: auto;
}
</style>
