<template>
  <q-card bordered class="card">
    <q-card-section class="column items-center">
      <div class="text-h6">{{ accountName }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section class="column items-start">
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Account number</b>: {{ accountNo }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Balance</b>: {{ balance }}
      </div>
      <div class="text-subtitle1 text-left text-weight-regular">
        <b> Iban</b>: {{ iban }}
      </div>
    </q-card-section>
    <q-card-section class="flex fit justify-around">
      <q-btn
        color="amber"
        icon="edit"
        v-on:click="editDialog = true"
        class="q-mt-sm"
      />
      <q-btn
        color="red"
        icon="delete"
        v-on:click="deleteDialog = true"
        class="q-mt-sm"
      />
    </q-card-section>
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row justify-center">
          <p class="q-ma-md text-h6">
            Are you sure you want to delete "{{ accountName }}" account?
            (Account No: {{ accountNo }})
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Confirm"
            color="primary"
            v-close-popup
            v-on:click="deleteAccount"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card>
        <q-card-section class="column items-center">
          <p class="q-ml-sm text-h4 q-mt-md">Edit account details</p>
        </q-card-section>
        <q-separator inset color="primary" />
        <q-card-section class="column items-center">
          <q-input
            outlined
            label-color="primary"
            v-model="accNameU"
            label="Account name"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="accNoU"
            label="Account number"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="balanceU"
            label="Balance"
            class="updateWidth"
          />
          <q-input
            outlined
            label-color="primary"
            v-model="ibanU"
            label="Iban"
            class="updateWidth"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Confirm"
            color="primary"
            v-on:click="editAccount"
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
  name: "AccountCard",
  props: {
    id: String,
    accountName: String,
    accountNo: String,
    balance: String,
    iban: String,
    clientId: String,
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
    const accNoU = ref(props.accountNo);
    const accNameU = ref(props.accountName);
    const balanceU = ref(props.balance);
    const ibanU = ref(props.iban);

    const deleteAccount = async () => {
      try {
        const res = await api.delete("/account/" + props.id, {
          headers: {
            Authorization: "Bearer " + jwt.value,
          },
        });
        $q.notify({
          type: "positive",
          position: "top-right",
          message: "Deleted account successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        emit("deleteAccount", props.id);
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

    const editAccount = async () => {
      try {
        const res = await api.patch(
          "/account/" + props.id,
          {
            accountName: accNameU.value,
            accountNo: accNoU.value,
            balance: balanceU.value,
            iban: ibanU.value,
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
          message: "Edited account successfully",
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
        emit(
          "editAccount",
          props.id,
          accNameU.value,
          accNoU.value,
          balanceU.value,
          ibanU.value
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
      accNameU,
      accNoU,
      balanceU,
      ibanU,
      deleteAccount,
      editAccount,
    };
  },
});
</script>

<style>
.card {
  width: 25em;
  margin: 1.5em 3em;
}

.updateWidth {
  width: 20rem;
  margin: 0.5rem 4rem;
}
</style>
