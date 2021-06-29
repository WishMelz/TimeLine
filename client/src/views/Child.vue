<template>
  <div class="child">
    <van-nav-bar
      :title="addoredit == 'add' ? '添加' : '修改'"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-field v-model="dataMsg.title" label="标题" />
      <van-field v-model="dataMsg.text" type="textarea" label="内容" />
      <van-field v-model="dataMsg.site" label="地点" />
      <van-field
        v-model="dataMsg.date"
        label="时间"
        placeholder="格式:2021-12-12"
      />
    </van-cell-group>
    <div class="upimg">
      <van-uploader
        accept="image/*"
        v-model="fileList"
        :before-read="befUpload"
      />
    </div>
    <van-button style="margin-top: 20px" type="primary" block @click="submit"
      >完成</van-button
    >
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import { getDataListById, putDataList, addDataList } from "@/api/dataList";
import { Dialog, Toast } from "vant";
import { getSts } from "@/api/com";
import oss from "@/api/oss";
export default {
  data() {
    return {
      dataMsg: {
        title: "",
        text: "",
        annex: [],
        site: "",
        date: "",
      },
      loading: false,
      addoredit: "add",
      fileList: [],
      thisId: "",
    };
  },
  created() {
    let thisId = this.$route.query.p;

    if (thisId) {
      this.thisId = thisId;
      this.getDataMsg(thisId);
      this.addoredit = "edit";
    } else {
      this.addoredit = "add";
    }
  },
  methods: {
    submit() {
      if (this.addoredit == "add") {
        this.add();
      } else {
        this.edit();
      }
    },
    add() {
      if (this.dataMsg.title == "") {
        Toast("标题必填");
        return;
      }
      let clone = JSON.parse(JSON.stringify(this.dataMsg));
      delete clone.id;
      let str = [];
      this.fileList.forEach((v) => {
        str.push(v.url);
      });
      clone.annex = str.join(",");
      this.loading = true;
      addDataList(clone)
        .then((res) => {
          Toast.success("添加成功!");
          this.dataMsg = {
            title: "",
            text: "",
            annex: [],
            site: "",
            date: "",
          };
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    edit() {
      let clone = JSON.parse(JSON.stringify(this.dataMsg));
      delete clone.id;
      let str = [];
      this.fileList.forEach((v) => {
        str.push(v.url);
      });
      clone.annex = str.join(",");
      this.loading = true;
      putDataList(this.thisId, clone)
        .then((res) => {
          Toast.success("更新成功!");
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    befUpload(file) {
      this.loading = true;
      getSts()
        .then((res) => {
          oss(res, file)
            .then((res2) => {
              this.loading = false;
              this.fileList.push({
                url: res2,
              });
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    onClickLeft() {
      this.$router.back("-1");
    },
    getDataMsg(id) {
      getDataListById(id)
        .then((res) => {
          this.dataMsg = res;
          if (res.annex == "") {
            return;
          }
          let clone = JSON.parse(JSON.stringify(res));
          clone.annex = clone.annex.split(",");
          clone.annex.forEach((v) => {
            this.fileList.push({
              url: v,
            });
          });
          console.log(this.fileList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.child {
  padding: 0 0.625rem;
}
</style>