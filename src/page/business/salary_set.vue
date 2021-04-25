<template>
  <div class="salary_set_container">
    <div class="radio_work" v-if="!editNum">
      <span>配送类型 ： </span>
      <!-- <el-radio-group> -->
        <el-radio v-model="resource" label="1">全职</el-radio>
        <el-radio v-model="resource" label="2">兼职</el-radio>
      <!-- </el-radio-group> -->
    </div>
    <div class="radio_work" v-else>
      <span>配送类型 ： </span>
      <span v-if="resource==2">兼职</span>
      <span v-else>全职</span>
    </div>
    <div class="container_km" v-for="(item, index) in elementList" :key="index" v-loading="loading">
      <div class="delivery_km" v-if="index==0">
        <div class="lists">
          <div>选择班期 ：</div>
          <div>
            <el-time-select v-model="item.startTime" :disabled="editNum==1" :picker-options="{start: '00:00', step: '00:10', end: '23:59'}" placeholder="请选择时间" size="small">
            </el-time-select>
            <span class="gray_line">—</span>
            <el-time-select v-model="item.endTime" :disabled="editNum==1" :picker-options="{start: '00:00', step: '00:10', end: '23:59'}" placeholder="请选择时间" size="small">
            </el-time-select>
          </div>
        </div>
        <div class="list">
          <div>每分酬薪 ：</div>
          <div :class="{disableBtn: editNum==1}">
            <input :disabled="editNum==1" v-model="item.salary" placeholder="" />
            <span>P</span>
          </div>
        </div>
        <el-button type="text" @click="addSalary" v-if="editNum!=1">添加</el-button>
      </div>
      <div class="add" v-if="index>0">
        <div>第{{chinanum(`${index}`)}}时段</div>
        <div class="add_km">
          <div class="lists">
            <div>
              <el-time-select v-model="item.startTime" :disabled="editNum==1" :picker-options="{start: '00:00', step: '00:10', end: '23:59'}" placeholder="请选择时间" size="small">
              </el-time-select>
              <span class="gray_line">—</span>
              <el-time-select v-model="item.endTime" :disabled="editNum==1" :picker-options="{start: '00:00', step: '00:10', end: '23:59'}" placeholder="请选择时间" size="small">
              </el-time-select>
            </div>
          </div>
          <div class="list">
            <div>每分酬薪 ：</div>
            <div :class="{disableBtn: editNum==1}">
              <input :disabled="editNum==1" v-model="item.salary" placeholder="请输入酬薪" />
              <span>P</span>
            </div>
          </div>
          <el-button type="text" @click="deleteSalary(index)" v-if="editNum!=1">删除</el-button>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" size="small" @click="submit" v-if="editNum!=1">提交</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import store from "../../store";
export default {
  data() {
    return {
      resource: "1",
      elementList: [
        {
          startTime: "",
          endTime: "",
          salary: ""
        }
      ],
      editNum: "",
      loading: false
    };
  },
  computed: {
    ...mapState(["salary_partTime", "salary_fullTime"]),
    salary_time() {
      if (this.resource == "1") {
        return this.salary_partTime;
      } else {
        return this.salary_fullTime;
      }
    }
  },
  mounted() {
    this.resource = this.$route.query.id.toString();
    this.editNum = this.$route.query.edit;
    if (this.editNum) {
      this.getDeliverySalaryInfo();
    }
  },
  watch: {
    resource() {
      if (this.resource == "1") {
        this.getSalaryFullTime({ data: this.elementList });
      } else {
        this.getSalaryPartTime({ data: this.elementList });
      }
      this.elementList = this.salary_time;
      console.log(this.elementList, "@@@@@@@@@@@@");
    }
  },
  methods: {
    ...mapMutations(["getSalaryPartTime", "getSalaryFullTime"]),
    chinanum(num) {
      var china = new Array(
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十",
        "二十一",
        "二十二",
        "二十三",
        "二十四"
      );
      var arr = new Array();
      var english = (num + ",").split(",");
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]];
      }
      return arr.join("");
    },
    getDeliverySalaryInfo() {
      this.loading = true
      let resource;
      if (this.resource == 2) {
        resource = 0;
      } else {
        resource = 1;
      }
      store
        .dispatch("getDeliverySalaryInfo", {
          type: resource,
          id: this.$route.query.salaryId
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = false
            this.elementList = JSON.parse(res.data.data.salaryRule);
          } else {
            this.loading = false
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err);
        });
    },
    addSalary() {
      if (this.elementList.length >= 24) {
        this.$message.warning("只能添加24个时段");
        return;
      } else {
        this.elementList.push({
          startTime: "",
          endTime: "",
          salary: ""
        });
      }
    },
    deleteSalary(index) {
      this.elementList.splice(index, 1);
    },
    submit() {
      let elementList = JSON.stringify(this.elementList);
      let resource;
      if (this.resource == 2) {
        resource = 0;
      } else {
        resource = 1;
      }
      if (this.editNum) {
        store.dispatch("updateDeliverySalaryInfo", {
          type: resource,
          id: this.$route.query.salaryId,
          salaryRule: JSON.stringify(this.elementList)
        }).then(res=> {
          console.log(res)
          if (res.data.code==1) {
            this.$message.success(res.data.message)
            this.$router.replace("/salary_list");
          } else {
            this.$message.error(res.data.message);
          }
        })
      } else {
        store
          .dispatch("deliverySalaryConfigure", {
            deliveryType: resource,
            salaryRule: elementList
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success(res.data.message);
              this.elementList = [
                {
                  startTime: "",
                  endTime: "",
                  salary: ""
                }
              ];
              this.getSalaryFullTime({ data: this.elementList });
              this.getSalaryPartTime({ data: this.elementList });
              this.$router.replace("/salary_list");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.salary_set_container {
  background: #ffffff;
  border-radius: 2px;
  margin-left: 20px;
  padding: 15px 12px;
  overflow-x: auto;
  .radio_work {
    padding: 10px 20px 20px;
    color: #333;
    span {
      font-size: 14px;
    }
  }
  .delivery_km {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .lists {
      display: flex;
      align-items: center;
      margin-right: 0.4rem;
      div {
        font-size: 14px;
      }
      .gray_line {
        color: #d9d9d9;
      }
    }
    .list {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);
      div {
        font-size: 14px;
        &:nth-child(2) {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 32px;
          line-height: 32px;
          padding: 0 8px;
          margin-right: 23px;
        }
        span {
          color: #464646;
          font-size: 14px;
        }
      }
      .disableBtn {
        cursor: no-drop;
        input {
          cursor: no-drop;
        }
      }
    }
  }
  .add {
    background: #fbfbfb;
    margin-left: 73px;
    padding: 3px 17px 10px;
    margin: 17px 0 20px 90px;
    // min-width: 700px;
    max-width: 750px;
    div {
      &:first-child {
        height: 32px;
        line-height: 32px;
      }
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .add_km {
      display: flex;
      align-items: center;
      .lists {
        display: flex;
        align-items: center;
        margin-right: 0.4rem;
        div {
          font-size: 14px;
        }
        .gray_line {
          color: #d9d9d9;
        }
      }
      .list {
        display: flex;
        align-items: center;
        div {
          &:nth-child(2) {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 32px;
            line-height: 32px;
            padding: 0 8px;
            margin-right: 23px;
            background: #ffffff;
          }
        }
        .disableBtn {
          cursor: no-drop;
          input {
            cursor: no-drop;
          }
        }
      }
    }
  }
  input {
    border: none;
    font-size: 14px;
    width: 0.8rem;
    background: #fff;
  }
  .btn {
    margin: 30px 100px 10px;
  }
}
</style>
