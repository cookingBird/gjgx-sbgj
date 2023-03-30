<template>
  <div class="page-controller">
    <el-popover placement="left" trigger="click" width="300">
      <ul class="page-list">
        <el-scrollbar>
          <li :class="{ active: item.id === currentId }" v-for="item in list" :key="item.id"
            @click="setCurrentId(item.id)">
            <span>{{ item.name }}</span>
          </li>
        </el-scrollbar>
      </ul>
      <i v-show="list.length" slot="reference" class="el-icon-arrow-left"></i>
    </el-popover>
  </div>
</template>

<script>
import {
  getViewPageList
} from "@/api/base";

export default {
  name: 'page-controller',
  created() {
    this.getPageList();
  },
  data() {
    return {
      list: [],
    }
  },
  computed: {
    currentId() {
      return this.$store.state.auth.viewPageId;
    }
  },
  methods: {
    async getPageList() {
      const { code, data } = await getViewPageList();
      if (code === 200) {
        this.list = data;
        if (!this.currentId) {
          const current = data.filter(item => item.defaultFlag === 1)[0];
          current && this.$store.commit('auth/SET_VIEWPAGE_ID', current.id);
        }
      }
      this.$emit('loaded');
    },
    setCurrentId(id) {
      this.$store.commit('auth/SET_VIEWPAGE_ID', id);
    }
  }
}
</script>

<style lang="scss" scoped>
.page-controller {
  width: 40px;
  height: 40px;
  line-height: 46px;
  position: absolute;
  right: 4%;
  bottom: 10%;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0px 0px 5px gray;
  color: #000;
  text-align: center;

  i {
    font-size: 20px;
    cursor: pointer;
  }

}

.page-list {
  .el-scrollbar {
    max-height: 400px;
  }

  li {
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;

    border-radius: 6px;
    margin-bottom: 6px;

  }

  li.active {
    background-color: #36C3FF;
    color: #fff;
  }

}
</style>