<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> TIC Bank </q-toolbar-title>
        <q-btn flat class="q-pa-md" v-on:click="logOut"> Log out </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import router from "src/router";
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const router = useRouter();
    const route = useRoute();
    const $store = useStore();

    const logOut = () => {
      localStorage.removeItem("jwt");
      $store.commit("setJWT", "");
      router.push("/");
    };
    return { logOut };
  },
});
</script>
