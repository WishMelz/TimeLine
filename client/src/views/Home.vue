<template>
  <div class="home">
      <van-icon class="addTime" name="plus"  @click="clickLinkAdmin" />
    <div class="nav">
      <div class="nav-item">
        <div class="smtitle">2021-05-18</div>
        <div class="text">{{ overDay.Together }}天</div>
      </div>
      <div class="nav-item center">
        <div class="smtitle">
          {{ `${values.GTime[0]}-${values.GTime[1]}` }}
        </div>
        <div class="text">{{ overDay.GDay }}天</div>
      </div>
      <div class="nav-item">
        <div class="smtitle">{{ `${values.MTime[0]}-${values.MTime[1]}` }}</div>
        <div class="text">{{ overDay.MDay }}天</div>
      </div>
    </div>
    <div class="main">
      <el-timeline>
        <el-timeline-item v-for="(v, index) in dataList" :key="index">
          <div class="timeline">
            <div class="title">{{v.title}}</div>
            <div class="conten">
              {{v.text}}
            </div>
            <div class="annex" v-if="v.annex[0] != ''">
              <div class="annex-item" v-for="(vv, ii) in v.annex" :key="ii">
                <video
                  @click="viewImage(vv)"
                  v-if="
                    vv.split('.').reverse()[0] == 'mp4' ||
                    vv.split('.').reverse()[0] == 'MP4'
                  "
                  :src="vv"
                  :poster="
                    vv + '?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast'
                  "
                ></video>
                <img v-else @click="viewImage(vv)" :src="vv" alt="" />
                <van-icon
                  @click="viewImage(vv)"
                  v-if="
                    vv.split('.').reverse()[0] == 'mp4' ||
                    vv.split('.').reverse()[0] == 'MP4'
                  "
                  name="play-circle-o"
                />
              </div>
            </div>
            <div class="site">{{v.site}}</div>
            <!-- <div class="ctime" v-if="v.date == ''">{{ v.ctime | setTime }}</div>
            <div class="ctime" v-else>{{ v.date }}</div> -->
            <div class="ctime">{{ setCtiem(v.date, v.ctime) }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="viewVideo" v-if="viewVideoDia">
      <div class="close" @click="closeVideo">
        <van-icon name="cross" />
      </div>
      <div class="info">
        <video controls :src="thisVideoUrl"></video>
      </div>
    </div>
    <van-dialog
      v-model="showPsd"
      title="密钥"
      show-cancel-button
      @confirm="linkAdmin"
      @cancel="showPsd = false"
    >
      <van-field v-model="psd" placeholder="请输入密钥!" />
    </van-dialog>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { getDataList } from "@/api/dataList";
import { login } from "@/api/com";
export default {
  data() {
    return {
      psd: "",
      showPsd: false,
      viewVideoDia: false,
      thisVideoUrl: "",
      values: {
        addTime: "2021-05-18",  // 在一起日期
        GTime: ["08", "26"],  // 女方生日
        MTime: ["11", "07"],   // 男方生日
      },
      overDay: {
        Together: "",
        GDay: "",
        MDay: "",
      },
      dataList: [],
    };
  },
  created() {
    this.init();
    this.togetherDays();
    this.getList();
  },
  methods: {
    clickLinkAdmin() {
      // showPsd = true
      let token = localStorage.getItem("yyt-token");
      if (token) {
        this.$router.push("/admin");
      } else {
        this.showPsd = true;
      }
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
    linkAdmin() {
      login({ key: this.psd })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    init() {
      this.overDay.GDay = this.getDaysToBirthday(
        this.values.GTime[0],
        this.values.GTime[1]
      );
      this.overDay.MDay = this.getDaysToBirthday(
        this.values.MTime[0],
        this.values.MTime[1]
      );
    },
    viewImage(v) {
      let lastName = v.split(".").reverse()[0];
      if (lastName == "mp4" || lastName == "MP4") {
        this.openVideo(v);
      } else {
        ImagePreview([v]);
      }
    },
    closeVideo() {
      this.viewVideoDia = false;
      this.thisVideoUrl = "";
    },
    openVideo(v) {
      this.thisVideoUrl = v;
      this.viewVideoDia = true;
    },
    togetherDays() {
      var date1 = new Date(this.values.addTime);
      var date2 = new Date();
      var date = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
      this.overDay.Together = Math.floor(date);
    },
    getDaysToBirthday(month, day) {
      var nowTime = new Date();
      var thisYear = nowTime.getFullYear();
      //今年的生日
      var birthday = new Date(thisYear, month - 1, day);

      //今年生日已过，则计算距离明年生日的天数
      if (birthday < nowTime) {
        birthday.setFullYear(nowTime.getFullYear() + 1);
      }
      var timeDec = birthday - nowTime;
      var days = timeDec / (24 * 60 * 60 * 1000);
      return Math.ceil(days);
    },
    setCtiem(v, ctime) {
      if (v != "") {
        return v;
      } else {
        let newZDate = new Date(Number(ctime));
        let strTime = `${newZDate.getFullYear()}-${
          newZDate.getMonth() + 1 > 9
            ? newZDate.getMonth() + 1
            : "0" + (newZDate.getMonth() + 1)
        }-${
          newZDate.getDate() > 9 ? newZDate.getDate() : "0" + newZDate.getDate()
        }`;
        return strTime;
      }
    },
  },
};
</script>
<style scoped>
.addTime {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 999999999999;
}
.nav {
  display: flex;
  padding-top: 0.625rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3125rem;
}
.nav-item {
  flex: 1;
  text-align: center;
}
.nav-item .text {
  font-size: 1.25rem;
  color: blueviolet;
}
.nav .center {
  border-left: 0.0625rem solid #eee;
  border-right: 0.0625rem solid #eee;
}
.main {
  margin-top: 1.25rem;
  padding: 0 1.25rem;
}
.timeline .title {
  font-size: 22px;
  font-weight: 400;
}
.timeline .annex {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
}
.timeline .annex img {
  width: 3.125rem;
  height: 3.125rem;
  flex-shrink: 0;
}
.timeline .annex video {
  width: 3.125rem;
  height: 3.125rem;
  flex-shrink: 0;
}
.timeline .site {
  margin-top: 0.5rem;
}
.timeline .ctime {
  margin-top: 8px;
  color: #909399;
  line-height: 1;
  font-size: 13px;
}
.annex-item {
  width: 3.125rem;
  height: 3.125rem;
  border: 0.125rem solid #eee;
  border-radius: 0.25rem;
  margin-right: 0.125rem;
  position: relative;
}
.annex-item .van-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #eee;
  font-size: 40px;
}
.viewVideo {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #000;
}
.viewVideo .info {
}
.viewVideo .info video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
}
.viewVideo .close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 24px;
  color: #fff;
}
</style>
