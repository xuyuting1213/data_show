<template>
  <el-select
    v-model="value"
    filterable
    :placeholder="selectvalue.name"
    class="filtercom"
    popper-class="filtercomselect"
    multiple
    collapse-tags
    @change="changValue"
    v-loading="loading"
    :clearable="true"
    :filterMethod="filterMethod"
  >
    <el-option
      v-for="item in filteredOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import api from "@/api/api";

export default {
  props: ["selectvalue"],
  data() {
    return {
      originalOptions: [], // 保存原始选项
      options: [],
      value: [],
      loading: false,
      searchQuery: "", // 搜索关键字
    };
  },
  methods: {
    filterMethod(query) {
      this.searchQuery = query; // 更新搜索关键字
      console.log(this.searchQuery)
      this.filterOptions(); // 根据新的查询字符串过滤选项
    },
    changValue() {
      this.$emit("selectval", this.value);
    },
    getFilterdata() {
      this.loading = true;
      api.filterDeviceinfo({ key: this.selectvalue.value }).then((res) => {
        console.log(res.data);

        let processedData = res.data.data.map((item) => {
          if (this.selectvalue.name == "运行状态") {
            return {
              label: item == 1 ? "在用" : item == 2 ? "停用" : "报废",
              value: item,
            };
          } else {
            return {
              label: item,
              value: item,
            };
          }
        });

        this.originalOptions = [...processedData]; // 保存原始选项
        this.options = [...processedData];

        this.loading = false;
      });
    },
    filterOptions() {
      if (!this.searchQuery) {
        this.options = [...this.originalOptions];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.options = this.originalOptions.filter(option =>
        option.label.toString().toLowerCase().includes(query)
      );
      console.log(this.searchQuery,this.options)
    },
  },
  mounted() {
    this.getFilterdata();
  },
  computed: {
    device_change() {
      return this.$store.state.device_change;
    },
    filteredOptions() {
      // 返回当前过滤后的选项
      return this.options;
    }
  },
  watch: {
    device_change() {
      this.getFilterdata();
    },
    searchQuery(newVal) {
      this.filterOptions();
    },
    value(newVal) {
      // 如果用户选择了新的值，则清除搜索框以显示全部选项
      if (newVal.length > 0) {
        this.searchQuery = "";
        this.filterOptions();
      }
    }
  }
};
</script>