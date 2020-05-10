<template>
  <div class="modal-panel">
    <div class="edit-form">
      <div>
        <label>Id:</label>
        {{ customer.Id }}
      </div>
      <div class="i-group">
        <input type="text" v-model="customer.FirstName" placeholder="First Name" />
        <label>First Name:</label>
      </div>
      <div class="i-group">
        <input type="text" v-model="customer.LastName" placeholder="Last Name" />
        <label>Last Name:</label>
      </div>
      <div>
        <button @click="saveRecord" class="pull-right">Save</button>
        <button @click="cancel" class="pull-right">Cancel</button>
        <button @click="deleteRecord" :disabled="!canDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as _customerService from "@/services/customerOfflineService.js";
import * as _utility from "@/utility";

export default {
  name: "cCustomerEdit",
  props: ["customerId"],
  components: {},
  data: () => ({
    customer: {
      Id: _utility.emptyGuid,
      FirstName: "",
      LastName: "",
    },
  }),
  methods: {
    load(customerId) {
      console.log("cCustomer:load fired..");
      if (customerId == null || customerId === _utility.emptyGuid) return;
      _customerService
        .getCustomer(customerId)
        .then((response) => {
          if (response.Success === true) {
            this.customer = response.Customer;
          } else alert(response.Message);
        })
        .catch((e) => {
          alert(e.Message);
        });
    },
    saveRecord() {
      console.log("cCustomer:save fired..");
      _customerService
        .saveCustomer(this.customer)
        .then((response) => {
          if (response.Success === true) {
            this.customer.Id = response.CustomerId;
            this.cancel();
          } else alert(response.Message);
        })
        .catch((e) => {
          alert(e.Message);
        });
    },
    deleteRecord() {
      console.log("cCustomer:delete fired..");
      _customerService
        .deleteCustomer(this.customer.Id)
        .then((response) => {
          if (response.Success === true) {
            this.cancel();
          } else alert(response.Message);
        })
        .catch((e) => {
          alert(e.Message);
        });
    },
    cancel() {
      this.$emit("close");
    },
  },
  computed: {
    canDelete: function() {
      return this.customer.Id != _utility.emptyGuid;
    },
  },
  mounted: function() {
    this.load(this.customerId);
  },
};
</script>

<style>
button {
  margin: 5px;
}
label {
  margin-right: 10px;
}
.pull-right {
  float: right;
}
.modal-panel {
  background-color: rgba(0, 0, 0, 0.35);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.edit-form {
  background-color: white;
  width: 400px;
  padding: 30px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
}
</style>
