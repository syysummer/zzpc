<template>
  <div class="scheTime_contain">
    <div class="time_header">
      <p class="today_txt">今日</p>
      <div class="cur_date_contain">
        <div class="cur_day">25</div>
        <div class="cur_date">
          <p>星期四</p>
          <p>10月 2018</p>
        </div>
      </div>
    </div>
    <div class="schedules_detail">
      <div class="schedules_item_contain">
        <div class="schedules_items">
          一班（08:00:-12:00）
        </div>
        <div class="tip">
          <div class="book">
            <span></span>
            预约1人
          </div>
          <div class="online">
            <span></span>
            在勤1人
          </div>
        </div>
      </div>
      <div class="schedules_item_contain gray">
        <div class="schedules_items">
          一班（08:00:-12:00）
        </div>
        <div class="tip">
          <div class="book">
            <span></span>
            预约1人
          </div>
          <div class="online">
            <span></span>
            在勤1人
          </div>
        </div>
      </div>
      <div class="schedules_item_contain gray">
        <div class="schedules_items">
          一班（08:00:-12:00）
        </div>
        <div class="tip">
          <div class="book">
            <span></span>
            预约1人
          </div>
          <div class="online">
            <span></span>
            在勤1人
          </div>
        </div>
      </div>
    </div>
    <div class="note_contain">
      <p class="note_title">备注</p>
      <p>
        暂无备注
      </p>
    </div>
  </div>
</template>

<script>
  export default {

}
</script>

<style lang="scss" scoped type="text/css">
  .scheTime_contain {
    width: 100%;
    height: 100%;
    padding: 0 3%;
    overflow-y: scroll;

    .time_header {
      padding: 2% 0;
      border-bottom: 2px solid #e9e9e9;

      .today_txt {
        font-size: 20px;
        font-weight: bold;
      }

      .cur_date_contain {
        display: flex;

        .cur_day {
          font-size: 50px;
          font-weight: bold;
          margin-right: 5%;
        }

        .cur_date {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }

    .schedules_detail {
      width: 100%;

      .schedules_item_contain {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 5%;

        .schedules_items {
          width: 90%;
          height: 50px;
          background: #1890FF;
          border-radius: 25px;
          text-align: center;
          line-height: 50px;
          color: #fff;
        }

        .tip {
          display: flex;
          justify-content: center;
          margin-top: 5%;

          .book {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;

            span {
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: #1890ff;
              border-radius: 3px;
              overflow: hidden;
              margin-right: 5px;
            }
          }

          .online {
            display: flex;
            align-items: center;
            justify-content: center;

            span {
              margin-right: 5px;
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: #F5A623;
              border-radius: 3px;
              overflow: hidden;
            }
          }
        }
      }

      .gray {
        .schedules_items {
          background: #c3c3c3;
        }

        .tip {

          .book span,
          .online span {
            background: #c3c3c3;
          }
        }
      }
    }

    .note_contain {
      margin-top: 20px;

      p.note_title {
        padding-bottom: 5%;
        border-bottom: 2px solid #e9e9e9;
      }

      p {
        margin: 5% 0;
        font-size: 14px;

      }
    }
  }

</style>
