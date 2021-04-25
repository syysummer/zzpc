<template>
  <div class="compensation_container">
    <div class="container_km" v-for="(item, index) in elementList" :key="index">
      <div class="delivery_km" v-if="index == 0">
        <div class="list">
          <div>配送里程 ：</div>
          <div>
            <input v-model="item.deliveryKm" placeholder="请输入里程" />
            <span>km</span>
          </div>
        </div>
        <div class="list">
          <div>送达时间 ：</div>
          <div>
            <input v-model="item.maxTime" placeholder="" />
            <span>min</span>
          </div>
        </div>
        <div class="list">
          <div>提前预警 ：</div>
          <div>
            <input v-model="item.warnTime" placeholder="请输入里程" />
            <span>km</span>
          </div>
        </div>
        <el-button type="text" @click="addKm">添加</el-button>
      </div>
      <div class="add" v-if="index > 0">
        <div>第{{chinanum(`${index + 1}`)}}时段</div>
        <div class="add_km">
          <div class="list">
            <div>配送里程 ：</div>
            <div>
              <input v-model="item.deliveryKm" placeholder="请输入里程" />
              <span>km</span>
            </div>
          </div>
          <div class="list">
            <div>送达时间 ：</div>
            <div>
              <input v-model="item.maxTime" placeholder="请输入里程" />
              <span>km</span>
            </div>
          </div>
          <div class="list">
            <div>提前预警 ：</div>
            <div>
              <input v-model="item.warnTime" placeholder="请输入里程" />
              <span>km</span>
            </div>
          </div>
          <el-button type="text" @click="deleteKm(index)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="limit_cancel">
      <div class="title">预约取消限制 : </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="每日">
          <el-input v-model="formInline.dayCancelNumber" placeholder="请输入次数"></el-input>
        </el-form-item>
        <el-form-item label="每周">
          <el-input v-model="formInline.weekCancelNumber" placeholder="请输入次数"></el-input>
        </el-form-item>
        <el-form-item label="每月">
          <el-input v-model="formInline.monthCancelNumber" placeholder="请输入次数"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="limit_cancels">
      <div class="title">预约取消时间 ：</div>
      <div class="list">
        <div>预约班次提前</div>
        <div>
          <input v-model="beforeCancelTime" />
          <span>H</span>
        </div>
        <div>取消</div>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">无法配送设置 ：</div>
      <div class="list">
        <el-input v-model="deliveryCancelNumber" placeholder="请输入每人每日取消次数" size="small"></el-input>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">配送奖励设置 : </div>
      <div class="time_set">
        <div class="line_for" v-for="(item, index) in rewardList" :key="index">
          <div class="line" v-if="index==0">
            <div>
              送达时间提前
              <div class="box">
                <input type="text" v-model="item.advanceTime" />
                <div>min</div>
              </div>
            </div>
            <div>
              奖励配送费
              <div class="box">
                <input type="text" v-model="item.percent" placeholder="请输入百分比" />
                <div>%</div>
              </div>
            </div>
            <el-button type="text" @click="addReward">添加</el-button>
          </div>
          <div class="notes" v-if="index==0">注：准时送达即可获得订单显示的全额配送费收入，提前送达将获得额外奖励</div>
          <div class="lines" v-if="index > 0">
            <div>
              送达时间提前
              <div class="box">
                <input type="text" v-model="item.advanceTime" />
                <div>min</div>
              </div>
            </div>
            <div>
              奖励配送费
              <div class="box">
                <input type="text" v-model="item.percent" placeholder="请输入百分比" />
                <div>%</div>
              </div>
            </div>
            <el-button type="text" @click="deleteReward(index)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">配送惩罚设置 : </div>
      <div class="time_set">
        <div class="line_for" v-for="(item, index) in punishList" :key="index">
          <div class="line" v-if="index==0">
            <div>
              送达时间超出
              <div class="box">
                <input type="text" v-model="item.beyondTime" />
                <div>min</div>
              </div>
            </div>
            <div>
              扣除配送费
              <div class="box">
                <input type="text" v-model="item.percent" placeholder="请输入百分比" />
                <div>%</div>
              </div>
            </div>
            <el-button type="text" @click="addPunish">添加</el-button>
          </div>
          <div class="notes" v-if="index==0">注：准时送达即可获得订单显示的全额配送费收入，提前送达将获得额外奖励</div>
          <div class="lines" v-if="index > 0">
            <div>
              送达时间超出
              <div class="box">
                <input type="text" v-model="item.beyondTime" />
                <div>min</div>
              </div>
            </div>
            <div>
              扣除配送费
              <div class="box">
                <input type="text" v-model="item.percent" placeholder="请输入百分比" />
                <div>%</div>
              </div>
            </div>
            <el-button type="text" @click="deletePunish(index)">删除</el-button>
          </div>
        </div>
        <div class="button"><el-button type="primary" @click="submit">提交</el-button></div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center top="30vh" class="compensation_dialog">
      <span>确定要保存该信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "../../store";
export default {
  data() {
    return {
      formInline: {
        dayCancelNumber: "",
        weekCancelNumber: "",
        monthCancelNumber: ""
      },
      beforeCancelTime: "",
      deliveryCancelNumber: "",
      elementList: [
        {
          deliveryKm: "",
          maxTime: "",
          warnTime: ""
        }
      ],
      rewardList: [
        {
          advanceTime: "",
          percent: ""
        }
      ],
      punishList: [
        {
          beyondTime: "",
          percent: ""
        }
      ],
      centerDialogVisible: false
    };
  },
  mounted() {},
  methods: {
    chinanum(num) {
      var china = new Array(
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      );
      var arr = new Array();
      var english = num.split("");
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]];
      }
      return arr.join("");
    },
    addKm() {
      this.elementList.push({
        deliveryKm: "",
        maxTime: "",
        warnTime: ""
      });
      console.log(this.elementList, "--------");
    },
    deleteKm(index) {
      console.log(this.elementList, "================++");
      this.elementList.splice(index, 1);
    },
    addReward() {
      this.rewardList.push({ advanceTime: "", percent: "" });
    },
    deleteReward(index) {
      this.rewardList.splice(index, 1);
    },
    addPunish() {
      this.punishList.push({ beyondTime: "", percent: "" });
    },
    deletePunish(index) {
      this.punishList.splice(index, 1);
    },
    submit() {
      if (this.formInline.dayCancelNumber && this.formInline.weekCancelNumber) {
        if (parseInt(this.formInline.dayCancelNumber) >= parseInt(this.formInline.weekCancelNumber)) {
          this.$message.warning("每日取消预约次数必须小于每周取消预约次数");
          return;
        }
      }
      if (this.formInline.dayCancelNumber && this.formInline.monthCancelNumber) {
        if (parseInt(this.formInline.dayCancelNumber) >= parseInt(this.formInline.monthCancelNumber)) {
          this.$message.warning("每日取消预约次数必须小于每月取消预约次数");
          return;
        }
      }
      if (this.formInline.weekCancelNumber && this.formInline.monthCancelNumber) {
        if (parseInt(this.formInline.weekCancelNumber) >= parseInt(this.formInline.monthCancelNumber)) {
          this.$message.warning("每周取消预约次数必须小于每月取消预约次数");
          return;
        }
      }
      if (this.formInline.dayCancelNumber && this.formInline.weekCancelNumber && this.formInline.monthCancelNumber) {
        if (parseInt(this.formInline.dayCancelNumber) >= parseInt(this.formInline.weekCancelNumber) >= parseInt(this.formInline.monthCancelNumber)) {
          this.$message.warning("取消预约次数必须是：每日 < 每周 < 每月");
          return;
        }
      }
      this.centerDialogVisible = true
    },
    confirm() {
      store
        .dispatch("deliveryConfigure", {
          deliveryRule: JSON.stringify(this.elementList),
          rewardRule: JSON.stringify(this.rewardList),
          punishRule: JSON.stringify(this.punishList),
          dayCancelNumber: this.formInline.dayCancelNumber,
          weekCancelNumber: this.formInline.weekCancelNumber,
          monthCancelNumber: this.formInline.monthCancelNumber,
          beforeCancelTime: this.beforeCancelTime,
          deliveryCancelNumber: this.deliveryCancelNumber
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message.success(res.data.message);
            this.$router.go(0);
            this.centerDialogVisible = false
          } else {
            this.centerDialogVisible = false
            this.$message.error(res.data.message);
            this.formInline.dayCancelNumber = "";
            this.formInline.weekCancelNumber = "";
            this.formInline.monthCancelNumber = "";
            this.beforeCancelTime = "";
            this.deliveryCancelNumber = "";
            (this.elementList = [
              {
                deliveryKm: "",
                maxTime: "",
                warnTime: ""
              }
            ]),
            (this.rewardList = [
              {
                advanceTime: "",
                percent: ""
              }
            ]),
            (this.punishList = [
              {
                beyondTime: "",
                percent: ""
              }
            ]);
          }
        }).catch(err=> {
          console.error(err)
        });
    }
  }
};
</script>
<style scoped lang="scss">
.compensation_container {
  background: #ffffff;
  border-radius: 2px;
  margin-left: 20px;
  padding: 15px 12px;
  overflow-x: auto;
  .delivery_km {
    display: flex;
    align-items: center;
    .list {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);
      div {
        font-size: 14px;
        &:nth-child(2) {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          padding: 0 8px;
          margin-right: 23px;
        }
        span {
          color: #464646;
          font-size: 14px;
        }
      }
    }
  }
  .add {
    background: #fbfbfb;
    margin-left: 73px;
    padding: 3px 17px 10px;
    margin: 17px 0 20px 73px;
    min-width: 700px;
    max-width: 900px;
    div {
      &:first-child {
        height: 30px;
        line-height: 30px;
      }
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .add_km {
      display: flex;
      align-items: center;
      .list {
        display: flex;
        align-items: center;
        div {
          &:nth-child(2) {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            margin-right: 23px;
            background: #ffffff;
          }
        }
      }
    }
  }
  .limit_cancel {
    display: flex;
    margin-top: 5px;
    .el-form {
      min-width: 765px;
    }
    div {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .title {
      margin-top: 6px;
      margin-right: 12px;
      min-width: 100px;
    }
  }
  .limit_cancels {
    display: flex;
    margin-bottom: 20px;
    .el-form {
      min-width: 765px;
    }
    div {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .title {
      margin-top: 6px;
      margin-right: 12px;
      min-width: 100px;
    }
    .list {
      display: flex;
      align-items: center;
      div {
        &:nth-child(2) {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          padding: 0 8px;
          margin: 0 10px;
        }
      }
    }
    .time_set {
      .line {
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          .box {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            margin-right: 23px;
            margin-left: 10px;
          }
        }
      }
      .line_for {
        &:last-child {
          margin-bottom: 0;
        }
        margin-bottom: 15px;
      }
      .lines {
        display: flex;
        align-items: center;
        background: #fbfbfb;
        padding: 8px 30px 15px 8px;
        div {
          display: flex;
          align-items: center;
          .box {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            margin-right: 23px;
            margin-left: 10px;
            background: #ffffff;
          }
        }
      }
      .button {
        margin-top: 35px;
      }
      .notes {
        font-size: 12px;
        color: #999999;
        margin-bottom: 12px;
      }
    }
  }
  input {
    border: none;
    font-size: 14px;
    width: 0.8rem;
  }
}
</style>
