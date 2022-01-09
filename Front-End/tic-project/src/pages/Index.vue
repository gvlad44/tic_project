<template>
  <q-page class="flex flex-center">
    <q-card bordered class="width q-mt-lg q-mb-lg">
      <q-card-section class="flex flex-center bg-white">
        <p class="text-h3 text-weight-medium">Homepage</p>
      </q-card-section>
      <q-card-section>
        <div class="flex justify-end">
          <q-btn
            color="primary"
            icon="person"
            label="Sort by name"
            v-on:click="sortClients"
          />
        </div>
      </q-card-section>
      <q-card-section class="flex flex-center bg-white">
        <ClientCard
          v-for="client in clients"
          :id="client.id"
          :key="client.id"
          :name="client.name"
          :phone="client.phone"
          :email="client.email"
          :address="client.address"
          :city="client.city"
          :job="client.job"
          :noOfAccounts="client.noOfAccounts"
          :accounts="client.accounts"
          @deleteClient="deleteClient"
          @editClient="editClient"
        />
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
            v-on:click="addClient"
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
import { defineComponent, ref, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import ClientCard from "../components/ClientCard.vue";

export default defineComponent({
  components: {
    ClientCard,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const $store = useStore();

    const jwt = ref("");
    const clients = ref([]);
    const addDialog = ref(false);
    const sort = ref(1);
    const copyClients = ref([]);

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

    const toggleSort = () => {
      if (sort.value === 1) {
        sort.value = -1;
        return clients.value.sort((a, b) => (a.name < b.name ? -1 : 1));
      } else {
        if (sort.value === -1) {
          sort.value = 0;
          return clients.value.sort((a, b) => (a.name > b.name ? -1 : 1));
        } else {
          sort.value = 1;
          clients.value = copyClients.value.slice(0);
          return clients.value;
        }
      }
    };

    const sortClients = () => {
      clients.value = toggleSort();
      clients.value.filter((el) => el.id == el.id);
    };

    const getClients = async () => {
      try {
        const res = await api.get("client/");
        clients.value = [];
        res.data.data.forEach((client) => {
          clients.value.push({
            id: client.id,
            name: client.client.name,
            phone: client.client.phone,
            email: client.client.email,
            address: client.client.address,
            city: client.client.city,
            job: client.client.job,
            noOfAccounts: client.client.accounts.length,
            accounts: client.client.accounts,
          });
        });
        copyClients.value = clients.value.slice(0);
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

    const addClient = async () => {
      try {
        const res = await api.post(
          "/client/",
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
          message: "Added client successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        getClients();
        clients.value.filter((el) => el.id == el.id);
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

    const deleteClient = (id) => {
      clients.value = clients.value.filter((client) => client.id !== id);
    };

    const editClient = (id, job, phone, email, address, city) => {
      clients.value.find((a) => a.id === id).job = job;
      clients.value.find((a) => a.id === id).phone = phone;
      clients.value.find((a) => a.id === id).email = email;
      clients.value.find((a) => a.id === id).address = address;
      clients.value.find((a) => a.id === id).city = city;
      clients.value.filter((el) => el.id == el.id);
    };

    checkAuth();
    getClients();

    return {
      jwt,
      clients,
      addDialog,
      deleteClient,
      editClient,
      addClient,
      sortClients,
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
