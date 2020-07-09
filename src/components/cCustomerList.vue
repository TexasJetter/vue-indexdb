<template>
	<div>
		<button @click="addRecord">Add Record</button>
		<cCustomerEdit v-if="showEdit" v-on:close="closeEdit" v-bind:customerId="selectedCustomerId" />
		<div v-if="customers.length === 0">No customers found</div>
		<ul class="customer-list">
			<li v-for="c in customers" :key="c.Id" @click="selectCustomer(c.Id)">{{ c.LastName }}, {{ c.FirstName }}</li>
		</ul>
	</div>
</template>

<script>
import * as _customerService from "@/services/customerOfflineService.js";
import * as _utility from "@/utility";
import cCustomerEdit from "@/components/cCustomerEdit.vue";

export default {
	name: "cCustomerList",
	components: { cCustomerEdit },
	data: () => ({
		showEdit: false,
		selectedCustomerId: null,
		customers: [],
	}),
	methods: {
		load() {
			console.log("cCustomerList:load fired..");
			_customerService
				.getCustomers()
				.then((response) => {
					if (response.Success === true) {
						this.customers = response.Customers;
					} else alert(response.Message);
				})
				.catch((e) => {
					alert(e.Message);
				});
		},
		addRecord() {
			this.selectedCustomerId = _utility.emptyGuid;
			this.showEdit = true;
		},
		selectCustomer(customerId) {
			this.selectedCustomerId = customerId;
			this.showEdit = true;
		},
		closeEdit() {
			this.showEdit = false;
			this.load();
		},
	},
	computed: {},
	mounted: function() {
		this.load();
	},
};
</script>

<style></style>
