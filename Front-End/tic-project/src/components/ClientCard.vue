<template>
  <q-card bordered class="card">
    <q-card-section class="column items-center">
      <div class="text-h5">{{ name }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section class="column items-start">
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> No of bank accounts</b>: {{ noOfAccounts }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Job</b>: {{ job }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Phone</b>: {{ phone }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Email</b>: {{ email }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Address</b>: {{ address }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> City</b>: {{ city }}
      </div>
    </q-card-section>
    <q-card-section class="flex fit justify-around">
      <q-btn
        color="primary"
        label="View client details"
        v-on:click="toClientPage"
        class="q-mt-sm"
      />
      <q-btn
        color="amber"
        icon="edit"
        v-on:click="editDialog = true"
        class="q-mt-sm"
      />
      <q-btn
        color="red"
        icon="delete"
        v-on:click="deleteDialogOpen"
        class="q-mt-sm"
      />
    </q-card-section>
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row justify-center">
          <p class="q-ma-md text-h6">
            Are you sure you want to delete {{ name }}'s account?
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Confirm"
            color="primary"
            v-close-popup
            v-on:click="deleteClient"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card>
        <q-card-section class="column items-center">
          <p class="q-ml-sm text-h4 q-mt-md">Edit client details</p>
        </q-card-section>
        <q-separator inset color="primary" />
        <q-card-section class="column items-center">
          <q-input
            outlined
            label-color="primary"
            v-model="jobU"
            label="Job"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="phoneU"
            label="Phone"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="emailU"
            label="Email"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="addressU"
            label="Address"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="cityU"
            label="City"
            class="updateWidth"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Confirm"
            color="primary"
            v-on:click="editClient"
            v-close-popup
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "ClientCard",

  props: {
    id: String,
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    job: String,
    noOfAccounts: Number,
    accounts: Array,
  },

  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const $store = useStore();

    const jwt = ref("");
    jwt.value = $store.getters.getJWT;
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const jobU = ref(props.job);
    const phoneU = ref(props.phone);
    const emailU = ref(props.email);
    const addressU = ref(props.job);
    const cityU = ref(props.city);

    const toClientPage = () => {
      router.push("/client/" + props.id);
    };

    const deleteDialogOpen = () => {
      deleteDialog.value = true;
    };

    const deleteClient = async () => {
      try {
        const res = await api.delete("/client/" + props.id, {
          headers: {
            Authorization: "Bearer " + jwt.value,
          },
        });
        $q.notify({
          type: "positive",
          position: "top-right",
          message: "Deleted client successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        emit("deleteClient", props.id);
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

    const editClient = async () => {
      try {
        const res = await api.patch(
          "/client/" + props.id,
          {
            email: emailU.value,
            job: jobU.value,
            phone: phoneU.value,
            address: addressU.value,
            city: cityU.value,
          },
          {
            headers: {
              Authorization: "Bearer " + jwt.value,
            },
          }
        );
        $q.notify({
          type: "positive",
          position: "top-right",
          message: "Edited client successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        emit(
          "editClient",
          props.id,
          jobU.value,
          phoneU.value,
          emailU.value,
          addressU.value,
          cityU.value
        );
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
      editDialog,
      deleteDialog,
      jobU,
      phoneU,
      cityU,
      emailU,
      addressU,
      deleteDialogOpen,
      deleteClient,
      editClient,
      toClientPage,
    };
  },
});
</script>

<style scoped>
.card {
  width: 25em;
  margin: 1.5em 3em;
}

.updateWidth {
  width: 20rem;
  margin: 0.5rem 4rem;
}
</style>
