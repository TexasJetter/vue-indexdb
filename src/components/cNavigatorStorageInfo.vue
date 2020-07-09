<template>
	<div>
		<button @click="load">Refresh Stats</button>

		<!-- <div>Browser Version: {{ navigatorInfo.appVersion }}</div> -->
		<div>IndexDb Supported: {{ navigatorInfo.indexDbSupported }}</div>
		<div>Quota: {{ navigatorInfo.quota }}</div>
		<div>Used: {{ navigatorInfo.usage }}</div>
		<div>Percent: {{ navigatorInfo.percentUsed }}%</div>
	</div>
</template>

<script>
const navigatorInfoDefault = {
	appVersion: "",
	indexDbSupported: false,
	quota: "",
	usage: "",
	percentUsed: 0,
};
export default {
	name: "cNavigatorStorageInfo",
	components: {},
	data: () => ({
		navigatorInfo: navigatorInfoDefault,
	}),
	methods: {
		load() {
			const that = this;
			this.navigatorInfo = navigatorInfoDefault;
			that.navigatorInfo.appVersion = navigator.appVersion;
			that.navigatorInfo.indexDbSupported = window.indexedDB != null;
			if ("storage" in navigator && "estimate" in navigator.storage) {
				navigator.storage
					.estimate()
					.then(function(estimate) {
						let q = estimate.quota / 100000000;
						let uom = " Mb";
						if (q > 999) {
							q = q / 1000;
							uom = " Gb";
						}
						that.navigatorInfo.quota = q.toFixed(2) + uom;
						that.navigatorInfo.usage = (estimate.usage / 100000000).toFixed(2) + " Mb";
						that.navigatorInfo.percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(2).toString();
					})
					.catch((error) => {
						that.$store.commit("dispatchMessage", {
							color: "danger",
							text: "navigator.storage exception: " + error.Message,
						});
					});
			} else {
				that.appInfo += "<div>Navigator Storage estimage not supported on this device.</div>";
			}
		},
	},
	computed: {},
	mounted: function() {
		this.load();
	},
};
</script>

<style></style>
