<template>
  <div>
    <cCustomerList />
  </div>
</template>

<script>
// @ is an alias to /src
import cCustomerList from "@/components/cCustomerList.vue";

export default {
  name: "home",
  components: {
    cCustomerList
  },
  data: () => ({}),
  methods: {}
};
</script>
