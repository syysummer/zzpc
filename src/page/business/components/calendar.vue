<template>
  <div class="calendar_content">
    <div class="calendar_haeader">
      <el-date-picker v-model="value" type="month" placeholder="选择日期" @change="setMonth" format="yyyy-MM" value-format="yyyy-MM">
      </el-date-picker>
      <span class="demonstratioån"></span>
    </div>
    <div class="calendar_detail">
      <ul v-if="language == 'zh'" class="week_contain">
        <li v-for="(item, index) in week_data_zh" :key="index">{{item}}</li>
      </ul>
      <ul v-if="language == 'en'" class="week_contain">
        <li v-for="(item, index) in week_data_en" :key="index">{{item}}</li>
      </ul>

      <!-- 月排班展示 -->
      <ul class="details_contain">
        <li v-for="(item, index) in dateArray" :key="index">
          <div class="gray_mask"></div>
          <div class="date_top">
            {{item.daysNum}}
          </div>
          <div class="schedules_contain" v-if="item.daysNum != ''">
            <p>1班: 3/4人</p>
            <p>1班: 3/4人</p>
            <p>1班: 3/4人</p>
            <!-- 示例代码 -->
            <!-- <p v-for="(elem, index) in item.gradeContent" :key="index">
              {{elem.id}}
            </p> -->
          </div>
        </li>
      </ul>

    </div>

    <!-- 右侧详情框 -->
    <div class="schedule-dialog" v-if="dialogShow">
      <div class="dialog-box">
        <div class="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="date-box">
          <div class="day">25</div>
          <div class="date">
            <div>星期四</div>
            <div>10月 2018</div>
          </div>
        </div>
        <div class="schedule-box-list">
          <div class="list-detail">
            <div class="time">
              <i class="el-icon-time"></i>
            </div>
            <div class="list-right">
              <div class="list-top">一班（08:00-12:00）</div>
              <div class="person-list">
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
              </div>
            </div>
          </div>
          <div class="list-detail">
            <div class="time">
              <i class="el-icon-time"></i>
            </div>
            <div class="list-right">
              <div class="list-top">一班（08:00-12:00）</div>
              <div class="person-list">
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
                <div class="person">Karen Garcia</div>
              </div>
            </div>
          </div>
        </div>
        <div class="schedule-edit">
          <div class="edit-button">编辑</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setCookie, getCookie, removeCookie } from '@/utils/cookies'
  export default {
    data() {
      return {
        week_data_zh: ['一', '二', '三', '四', '五', '六', '七'],
        week_data_en: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
        days: [],
        dateArray: [
          {
            daysNum: '',
            gradeContent: []
          }
        ],
        value: '',
        year: '',
        month: '',
        dayCount: Number,
        language: getCookie('lang'),
        dialogShow: false
      }
    },
    methods: {
      setMonth() {
        this.days = []
        let year = this.value.split('-')[0]
        let month = this.value.split('-')[1]
        let curDate = new Date(year, month, 0)
        let weekDay = [7, 1, 2, 3, 4, 5, 6]
        this.dayCount = curDate.getDate()
        curDate.setDate(1)
        for (let i = 0; i < this.dayCount; i++) {
          if (i < 9) {
            this.days[i] = '0' + (i + 1)
          } else {
            this.days[i] = i + 1 + ''
          }
        }
        for (let i = 1; i < weekDay[curDate.getDay()]; i++) {
          this.days.unshift('')
        }

        let dateArrayMsg = [];
        for(let i=0; i<this.days.length; i++) {
          this.dateArray.length = this.days.length;
          for(let j=0; j<this.dateArray.length; j++) {
            dateArrayMsg[j] = {
              daysNum: this.days[j],
              gradeContent: []
            }
          }
        }
        this.dateArray = dateArrayMsg;

        // 调接口，嵌套循环（days嵌套数据）, 数据中与days中重合的位置插入days中
        // 以下为示例代码
        // for(let i=0; i<this.dateArray.length; i++) {
        //   this.dateArray[i].gradeContent.push({id:1, type:2});
        // }
        // console.log(this.dateArray)
      }
    }
  }
</script>

<style lang="scss" type="text/css">
  .calendar_content {
    width: 100%;
    height: 100%;
    padding: 2% 2%;

    .schedule-dialog {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);

      .dialog-box {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 334px;
        background: #fff;

        .close {
          padding: 14px 23px 20px 0;
          text-align: right;

          i {
            color: rgba(0, 0, 0, 0.45);
          }
        }

        .date-box {
          display: flex;
          align-items: center;
          padding-left: 16px;

          .day {
            font-size: 40px;
            font-family: PingFangSC-Semibold;
            color: #000000;
            font-weight: 700;
            margin-right: 12px;
          }

          .date {
            div {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }

        .schedule-box-list {
          margin: 18px 10px 0 12px;
          border-top: 1px solid #e9e9e9;

          .list-detail {
            display: flex;
            margin: 25px 34px 0 0;

            .time {
              margin: 0 13px 0 3px;
            }

            .list-right {
              .list-top {
                font-size: 16px;
                color: #000000;
                font-weight: 700;
              }

              .person-list {
                overflow: hidden;

                .person {
                  float: left;
                  font-size: 12px;
                  color: #666666;
                  margin: 8px 24px 0 0;

                  &:last-child {
                    color: #d5d5d5;
                  }
                }
              }
            }
          }
        }

        .schedule-edit {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 95%;
          border-top: 1px solid #e9e9e9;
          margin: 0 auto;
          text-align: right;

          .edit-button {
            display: inline-block;
            background: #3ea2ff;
            border-radius: 4px;
            width: 65px;
            height: 32px;
            font-size: 14px;
            line-height: 32px;
            text-align: center;
            color: #fff;
            margin: 14px;
          }
        }
      }
    }

    .calendar_haeader {
      text-align: right;
    }

    .calendar_detail {
      width: 100%;
      height: 91%;
      overflow-y: scroll;

      .week_contain {
        margin-top: 2%;
        width: 100%;

        // display: flex;
        li {
          display: inline-block;
          text-align: right;
          width: 13%;
          margin: 0 0.6%;
        }
      }

      .details_contain {
        width: 100%;
        height: 100%;
        padding-top: 1%;

        // background-color: red;
        // display: flex;
        li {
          display: inline-block;
          text-align: right;
          width: 13%;
          margin: 1% 0.6%;
          height: 25%;
          padding-top: 1%;
          vertical-align: top;

          .gray_mask {
            background-color: #eee;
            height: 5%;
            width: 100%;
          }

          .date_top {
            padding-top: 5%;
            padding-right: 10%;
          }

          .schedules_contain {
            padding-top: 5%;
            text-align: center;
            color: #666;
          }
        }
      }
    }
  }

  .el-date-editor.el-input {
    width: 150px;
  }

</style>
