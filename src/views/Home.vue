<template>
	<div>
		<cCustomerList />
		<cNavigatorStorageInfo />
	</div>
</template>

<script>
// @ is an alias to /src
import cCustomerList from "@/components/cCustomerList.vue";
import cNavigatorStorageInfo from "@/components/cNavigatorStorageInfo.vue";

export default {
	name: "home",
	components: {
		cCustomerList,
		cNavigatorStorageInfo,
	},
	data: () => ({}),
	methods: {},
};
</script>
