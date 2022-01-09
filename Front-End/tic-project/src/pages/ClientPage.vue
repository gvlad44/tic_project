<template>
  <q-page class="flex flex-center">
    <q-card bordered class="width q-mt-lg q-mb-lg">
      <q-card-section class="flex">
        <q-btn
          align="left"
          class="btn-fixed-width float-left q-ml-md"
          color="primary"
          icon="arrow_back"
          v-on:click="returnToHomepage"
        >
          <q-tooltip class="bg-primary">Return to homepage</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="bg-white">
        <p class="text-h3 text-center text-weight-medium">Client details</p>
      </q-card-section>
      <q-separator color="primary" />
      <q-card-section>
        <div class="flex justify-around">
          <div class="column items-center q-mr-sm">
            <p class="text-h5 text-center text-weight-medium">
              Name: {{ client.name }}
            </p>
            <p class="text-h5 text-center text-weight-medium">
              Phone: {{ client.phone }}
            </p>
            <p class="text-h5 text-center text-weight-medium">
              Address: {{ client.address }}
            </p>
          </div>
          <div class="column items-center q-ml-sm">
            <p class="text-h5 text-center text-weight-medium">
              Job: {{ client.job }}
            </p>
            <p class="text-h5 text-center text-weight-medium">
              Email: {{ client.email }}
            </p>
            <p class="text-h5 text-center text-weight-medium">
              City: {{ client.city }}
            </p>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <p class="text-h4 text-center text-weight-medium">Client accounts</p>
        <div class="flex flex-center">
          <AccountCard
            v-for="account in accounts"
            :id="account.id"
            :key="account.id"
            :accountName="account.accountName"
            :accountNo="account.accountNo"
            :balance="account.balance"
            :iban="account.iban"
            :clientId="clientId"
            @deleteAccount="deleteAccount"
            @editAccount="editAccount"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="addDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <p class="q-ma-md text-h6">
            Are you sure you want to add a new account?
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Confirm"
            color="primary"
            v-close-popup
            v-on:click="addAccount"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[10, 10]">
      <q-btn fab icon="add" color="primary" v-on:click="addDialog = true" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import AccountCard from "../components/AccountCard.vue";

export default defineComponent({
  components: {
    AccountCard,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const $store = useStore();

    const jwt = ref("");
    const client = ref({
      name: "",
      job: "",
      phone: "",
      email: "",
      address: "",
      city: "",
    });
    const accounts = ref([]);
    const clientId = ref("");
    clientId.value = route.params.id;
    const addDialog = ref(false);

    const checkAuth = async () => {
      const value = $store.getters.getJWT;
      jwt.value = value;
      if (!jwt.value) {
        jwt.value = localStorage.getItem("jwt");
        $store.commit("setJWT", jwt.value);
        if (!jwt.value) {
          router.push("/");
        }
      }
    };

    const returnToHomepage = () => {
      router.push("/home");
    };

    const getClientAccounts = async () => {
      try {
        const res = await api.get("client/" + clientId.value);
        client.value = res.data.data;
        const resAccounts = await api.get("account/" + clientId.value);
        accounts.value = [];
        resAccounts.data.data.forEach((account) => {
          accounts.value.push({
            id: account.id,
            accountName: account.account.accountName,
            accountNo: account.account.accountNo,
            balance: account.account.balance,
            iban: account.account.iban,
          });
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
    };

    const addAccount = async () => {
      try {
        const res = await api.post(
          "/account/" + clientId.value,
          {},
          {
            headers: {
              Authorization: "Bearer " + jwt.value,
            },
          }
        );
        $q.notify({
          type: "positive",
          position: "top-right",
          message: "Added account successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        getClientAccounts();
        accounts.value.filter((el) => el.id == el.id);
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

    const deleteAccount = (id) => {
      accounts.value = accounts.value.filter((account) => account.id !== id);
    };

    const editAccount = (id, accountName, accountNo, balance, iban) => {
      accounts.value.find((a) => a.id === id).accountName = accountName;
      accounts.value.find((a) => a.id === id).accountNo = accountNo;
      accounts.value.find((a) => a.id === id).balance = balance;
      accounts.value.find((a) => a.id === id).iban = iban;
      accounts.value.filter((el) => el.id == el.id);
    };

    checkAuth();
    getClientAccounts();

    return {
      jwt,
      client,
      clientId,
      accounts,
      addDialog,
      getClientAccounts,
      returnToHomepage,
      deleteAccount,
      editAccount,
      addAccount,
    };
  },
});
</script>

<style scoped>
.width {
  width: 90%;
}

.bg-white {
  background-color: white;
}
</style>
