<template>
  <div class="admin">
    <div class="nav">
      <van-button type="info" @click="$router.push('/child')" size="small"
        >添加时间线</van-button
      >
      <van-button type="warning" @click="$router.push('/')" size="small"
        >返回首页</van-button
      >
   </div>
    <div class="item" >
      <div class="ctime">创建时间</div>
      <div class="title">标题</div>
      <div class="btn">操作</div>
    </div>
    <div class="item" v-for="(v, i) in dataList" :key="i">
      <div class="ctime">{{ v.ctime | setTime }}</div>
      <div class="title">{{ v.title }}</div>
      <div class="btn">
        <van-button type="primary" @click="linkType(v.id)" size="small"
          >修改</van-button
        >
        <van-button type="warning" @click="del(v.id)" size="small"
          >删除</van-button
        >
      </div>
    </div>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import { getDataList, delDataList } from "@/api/dataList";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      loading: false,
      dataList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    linkType(id) {
      this.$router.push("/child?p=" + id);
    },
    del(id) {
      Dialog.confirm({
        title: "标题",
        message: "弹窗内容",
      })
        .then(() => {
          this.loading = true;
          delDataList(id)
            .then((res) => {
              this.loading = false;
              Toast.success("删除成功");
              this.getList();
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    getList() {
      getDataList()
        .then((res) => {
          this.dataList = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.admin {
  padding: 0 0.625rem;
  padding-top: .625rem;
}
.nav {
  padding-bottom: 1.25rem;
  padding-top: .625rem
}
.item {
  display: flex;
  align-items: flex-end;
  padding-bottom: 0.3125rem;
  border-bottom: 0.0625rem solid #eee;
}
.item > div {
  flex: 1;
  /* text-align: center; */
}
.item .title {
  max-width: 30%;
  overflow: hidden;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-left: 0.0625rem solid #eee;
  border-right: 0.0625rem solid #eee;
}
.item .btn {
  /* display: flex;
  justify-content: space-between; */
}
</style>
