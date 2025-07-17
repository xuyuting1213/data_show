<template>
  <el-date-picker
    v-model="date"
    type="date"
    :placeholder="selectvalue.name"
    value-format="yyyy-MM-dd"
    style="width: 100%"
    class="filtercom"
    @change="changedate"
    :clearable="true"
  >
  </el-date-picker>
</template>

<script>
export default {
  props: ["selectvalue"],
  data() {
    return {
      date: "",
    };
  },
  methods: {
    changedate() {
      this.$emit("selectval", this.date ? [this.date + " 00:00:00"] : []);
    },
  },
};
</script>

<style></style>
