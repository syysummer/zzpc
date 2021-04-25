<template>
	<div class="new_edit_schedule_wrap">
		<!-- 当前进入的状态 -->
		<div class="new_header" v-if="isNew">
			<div class="delivery_type">{{edit_schedule.delivery_type}}</div>
			<div class="radio_wrap">
				<el-radio v-model="radio" label="1">{{edit_schedule.fulltime}}</el-radio>
				<el-radio v-model="radio" label="2">{{edit_schedule.parttime}}</el-radio>
			</div>
		</div>
		<div class="edit_header" v-if="!isNew">
			<div class="delivery_type">{{edit_schedule.delivery_type}}</div>
			<div class="type_wrap">
				<div class="fulltime_title" v-if="distrubute_type == 'fulltime'">{{edit_schedule.fulltime}}</div>
				<div class="parttime_title" v-if="distrubute_type == 'parttime'">{{edit_schedule.parttime}}</div>
			</div>
		</div>
		<!-- 选择薪酬 -->
		<div class="select_salary">
			<div class="salary_label">选择薪酬 : </div>
			<div class="block">
				<el-select class="new_salary_wrap" v-model="salaryValue" @change="changeSalaryTime" placeholder="请选择">
					<el-option v-for="item in salaryOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
		</div>
		<!-- 排班日期 -->
		<div class="schedule_date">
			<div class="date_label">{{edit_schedule.schedule_date}}</div>
			<div class="block">
				<el-date-picker v-model="timeData" @change="dateChange" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :start-placeholder="edit_schedule.start_date" :end-placeholder="edit_schedule.end_date" :default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
			</div>
		</div>
		<!-- 选择班期 -->
		<div class="select_schedule">
			<div class="select_schedule_label">{{edit_schedule.select_schedule}}</div>
			<div class="select_schedule_list">
				<div class="schedule_row" v-for="(item, index) in scheduleList">
					<div class="shift_title">{{chinanum(index)}} {{edit_schedule.shift}}
						<span class="addSchedule" v-if="index == 0" @click="addSchedule">{{edit_schedule.add}}</span>
						<span class="removeSchedule" v-if="index != 0" @click="removeSchedule(index)">{{edit_schedule.remove}}</span>
					</div>
					<div class="shift_time">
						<el-time-select class="el-time-select" size="small" :placeholder="edit_schedule.starttime" v-model="item.beginTime" :picker-options="{
											start: '00:00',
											step: '00:10',
											end: '24:00'
										}">
						</el-time-select>
						<span class="middle_line"></span>
						<el-time-select class="el-time-select" size="small" :placeholder="edit_schedule.endtime" v-model="item.endTime" :picker-options="{
										  start: '00:00',
											step: '00:10',
											end: '24:00'
										}">
						</el-time-select>
						<span v-if="radio == '2' || distrubute_type == 'parttime'" class="need_people">{{edit_schedule.need_people}}</span>
						<input v-if="radio == '2' || distrubute_type == 'parttime'" class="need_people_inp" v-model="item.needNum" type="text" :placeholder="edit_schedule.need_people">
						<br/>
						<span class="salary_label">选择薪酬</span>
						<!-- <input class="salary_input" v-model="item.timeSalaryRule" type="text" placeholder="选择薪酬"> -->
						<el-select class="select_item_salary" size="small" v-model="item.timeSalaryRule" placeholder="请选择薪酬">
							<el-option v-for="item in itemSalaryOptions" :key="item.value" :label="item.label" :value="item.label">
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
		</div>

		<!-- 预约设置 -->
		<div class="reservation_setting" v-if="radio == '2' || distrubute_type == 'parttime'">
			<div class="reservation_label">{{edit_schedule.reservation_setting}}</div>
			<div class="reservation_inp_wrap">
				<input type="text" class="reservation_inp" :placeholder="edit_schedule.reservation_inp" v-model="reservationSetting">
			</div>
		</div>

		<!-- 备注 -->
		<div class="remarks">
			<div class="remarks_label">{{edit_schedule.remarks}}</div>
			<div class="remarks_inp_wrap">
				<el-input class="remarks_inp" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="edit_schedule.input_content" v-model="remarksMsg">
				</el-input>
				<span class="max_length">{{remarksMsg.length}} / 100</span>
			</div>
		</div>

		<!-- 确认与取消 -->
		<div class="btn_wrap">
			<div class="confirm" @click="confirmSubmit">{{edit_schedule.confirm}}</div>
			<div class="cancel" @click="cancelSubmit">{{edit_schedule.cancel}}</div>
		</div>

	</div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { formatDateTime } from '../../utils/index'
export default {
  data() {
    return {
      isNew: true, // true表示是新建, false表示是编辑
      distrubute_type: 'fulltime', //只有是编辑排班的时候才会使用
      radio: '1', // 1表示全职, 2表示兼职
      timeData: '', //当前时间,
      currentSchedule: 0, //当前班次
      reservationSetting: '', //预约设置
      remarksMsg: '', //备注的内容
      scheduleList: [
        {
          beginTime: '',
          endTime: '',
          needNum: '',
          timeSalaryRule: ''
        }
      ],
      salaryData: [],
      salaryValue: '', //当前薪酬
      salaryOptions: [], // 请求回来的薪酬列表
      itemSalaryOptions: [] //单个班次薪酬可选值
    }
  },
  beforeMount() {
    // 新建排班时实现自动切换兼职和全职
    if (
      this.$route.query.type == 'new' &&
      this.$route.query.schedule_type == 'parttime'
    ) {
      this.radio = '2'
    }
    // 编辑未发布排班时自动展示兼职和全职
    if (this.$route.query.type == 'edit') {
      this.isNew = false
      if (this.$route.query.schedule_type == 'parttime') {
        this.distrubute_type = 'parttime'
      }
      // 调用当前班次的接口更新相应的数据
    }
  },
  mounted() {
    this.getSalaryList()
  },
  computed: {
    ...mapState(['new_fulltime', 'new_parttime']),
    currentScheduleData() {
      if (this.radio == '1') {
        return this.new_fulltime
      } else {
        return this.new_parttime
      }
    },
    edit_schedule() {
      return this.$t('edit_schedule')
    },
    schedule_type() {
      if (this.radio == '1') {
        return parseInt(1)
      } else {
        return parseInt(0)
      }
    }
  },
  methods: {
    ...mapMutations(['saveFulltime', 'saveParttime', 'newScheduleType']),
    ...mapActions(['newEditSchedule', 'getDeliverySalaryList']),
    chinanum(num) {
      var china = new Array(
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二'
      )
      var arr = new Array()
      var english = (num + ',').split(',')
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]]
      }
      return arr.join('')
    },
    dateChange() {
      console.log(this.timeData, 'timeData')
    },
    async getSalaryList() {
      // 请求薪酬列表数据
      let res = await this.getDeliverySalaryList({ type: this.schedule_type })
      if (res.data.code == 1) {
        let data = res.data.data
        let salaryOptions = []
        this.salaryData = data
        data.deliverySalaryList.forEach((item, index) => {
          let createTime = formatDateTime(item.createTime, 'ymd')
          let value =
            createTime +
            ' ' +
            item.minTime +
            ' ~ ' +
            createTime +
            ' ' +
            item.maxTime
          let obj = {
            label: value,
            value: `${index}`
          }
          salaryOptions.push(obj)
        })
        this.salaryOptions = salaryOptions
      }
    },
    changeSalaryTime(value) {
      console.log(value, '==============')
      let itemSalaryOptions = []
      let salaryRule = JSON.parse(
        this.salaryData.deliverySalaryList[value].salaryRule
      )
      salaryRule.forEach((item, index) => {
        let message = item.startTime + '~' + item.endTime
        let obj = {
          label: `${item.salary}P/min`,
          value: message
        }
        itemSalaryOptions.push(obj)
      })
      this.itemSalaryOptions = itemSalaryOptions
    },
    addSchedule() {
      //请求添加一个班次
      if (this.scheduleList.length >= 12 && this.radio == '2') {
        this.$message.warning('兼职最多可以排12个班次')
        return
      }
      if (this.scheduleList.length >= 4 && this.radio == '1') {
        this.$message.warning('全职最多可以排4个班次')
        return
      }
      this.currentSchedule = this.scheduleList.length
      this.scheduleList.push({
        needNum: '',
        beginTime: '',
        endTime: '',
        timeSalaryRule: ''
      })
    },
    removeSchedule(index) {
      // 移除一个班次
      this.scheduleList.splice(index, 1)
      this.currentSchedule = this.scheduleList.length - 1
    },
    async confirmSubmit() {
      //提交相应的班期
      if (!this.timeData) {
        this.$message.warning('排期时间不能为空!')
        return
      }
      this.scheduleList.forEach(element => {
        if (!element.beginTime) {
          this.$message.warning(`${element.currentSchedule}开始时间不能为空!`)
          return
        } else if (!element.endTime) {
          this.$message.warning(`${element.currentSchedule}结束时间不能为空!`)
          return
        } else if (
          (this.radio == '2' && !element.needNum) ||
          (this.distrubute_type == 'parttime' && !element.needNum)
        ) {
          this.$message.warning(`${element.currentSchedule}需求人数不能为空!`)
          return
        }
      })
      if (this.radio == '2' && !this.reservationSetting) {
        this.$message.warning('预约设置不能为空')
        return
      }
      // 保存新建信息
      let scheduleList = []
      this.scheduleList.forEach(item => {
        let scheduleItem = JSON.parse(JSON.stringify(item))
        console.log('+++++++++薪酬前', scheduleItem.timeSalaryRule)
        scheduleItem.timeSalaryRule =
          scheduleItem.timeSalaryRule.match(/\d+/g)[0] + '' // 转化成字符串
        console.log('+++++++++薪酬后', scheduleItem.timeSalaryRule)
        scheduleList.push(scheduleItem)
      })
      let param
      if (this.radio == '1') {
        param = {
          scheduleType: this.schedule_type,
          beginDate: this.timeData[0],
          endDate: this.timeData[1],
          groupList: JSON.stringify(scheduleList),
          remark: this.remarksMsg
        }
      } else {
        param = {
          scheduleType: this.schedule_type,
          beginDate: this.timeData[0],
          endDate: this.timeData[1],
          groupList: JSON.stringify(scheduleList),
          deliveryMaxTime: this.reservationSetting,
          remark: this.remarksMsg
        }
      }
      let res = await this.newEditSchedule(param)
      console.log('res', res)
      if (res.data.code == 1) {
        //保存成功的逻辑
        this.$router.replace({
          path: '/business/business_sche',
          query: {
            scheduleFlag: this.radio // "1"全职, "2"兼职
          }
        })
      } else {
        console.log(this)
        this.$message.error(`${res.data.message}`)
      }
    },
    cancelSubmit() {
      //取消相应的班期
      this.newScheduleType(this.radio)
      this.$router.go(-1)
    }
  },
  watch: {
    radio() {
      // 监听兼职与全职的切换, 保存当前的数据
      if (this.radio == '1') {
        let parttimeData = {
          timeData: this.timeData,
          salaryOptions: this.salaryOptions,
          currentSchedule: this.currentSchedule,
          reservationSetting: this.reservationSetting,
          remarksMsg: this.remarksMsg,
          scheduleList: this.scheduleList
        }
        this.saveParttime({ data: parttimeData })
      } else {
        let fulltimeData = {
          timeData: this.timeData,
          salaryOptions: this.salaryOptions,
          currentSchedule: this.currentSchedule,
          reservationSetting: this.reservationSetting,
          remarksMsg: this.remarksMsg,
          scheduleList: this.scheduleList
        }
        this.saveFulltime({ data: fulltimeData })
      }
      this.timeData = this.currentScheduleData.timeData
      this.salaryOptions = this.currentScheduleData.salaryOptions
      this.currentSchedule = this.currentScheduleData.currentSchedule
      this.reservationSetting = this.currentScheduleData.reservationSetting
      this.remarksMsg = this.currentScheduleData.remarksMsg
      this.scheduleList = this.currentScheduleData.scheduleList
      this.getSalaryList()
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开当前页面是清空数据
    if (this.radio == '2') {
      let parttimeData = {
        timeData: this.timeData,
        currentSchedule: this.currentSchedule,
        reservationSetting: this.reservationSetting,
        remarksMsg: this.remarksMsg,
        scheduleList: this.scheduleList
      }
      this.saveParttime({ data: parttimeData })
      this.saveFulltime({
        data: {
          timeData: '',
          currentSchedule: 0,
          reservationSetting: '',
          remarksMsg: '',
          scheduleList: [
            {
              beginTime: '',
              endTime: '',
              needNum: '',
              timeSalaryRule: ''
            }
          ]
        }
      })
    } else {
      let fulltimeData = {
        timeData: this.timeData,
        currentSchedule: this.currentSchedule,
        reservationSetting: this.reservationSetting,
        remarksMsg: this.remarksMsg,
        scheduleList: this.scheduleList
      }
      this.saveFulltime({ data: fulltimeData })
      this.saveParttime({
        data: {
          timeData: '',
          currentSchedule: 0,
          reservationSetting: '',
          remarksMsg: '',
          scheduleList: [
            {
              beginTime: '',
              endTime: '',
              needNum: '',
              timeSalaryRule: ''
            }
          ]
        }
      })
    }
    next()
  }
}
</script>

<style lang="scss" scoped type="text/css">
.new_edit_schedule_wrap {
  width: 100%;
  height: 100%;
  background: #fff;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 30px;
  overflow: auto;
  .new_header {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    .delivery_type {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .radio_wrap {
      height: 100%;
      margin-left: 20px;
      line-height: 22px;
    }
  }
  .edit_header {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    .delivery_type {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .type_wrap {
      height: 100%;
      margin-left: 20px;
      line-height: 22px;
    }
  }
  .select_salary {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-bottom: 10px;
    .salary_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .block {
      height: 100%;
      margin-left: 20px;
    }
  }
  .schedule_date {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-top: 5px;
    .date_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .block {
      height: 100%;
      margin-left: 20px;
    }
  }
  .select_schedule {
    width: 100%;
    margin-top: 10px;
    display: flex;
    .select_schedule_label {
      height: 40px;
      width: 100px;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      margin-right: 20px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .select_schedule_list {
      padding-right: 50px;
      width: 40%;
      min-width: 400px;
      .schedule_row {
        width: 100%;
        min-width: 670px;
        background: #fbfbfb;
        padding: 20px;
        margin-top: 10px;
        padding-top: 10px;
        .shift_title {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          line-height: 22px;
          margin-bottom: 10px;
          .addSchedule {
            margin-left: 20px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #1890ff;
            line-height: 22px;
            cursor: pointer;
            float: right;
            margin-right: 60px;
          }
          .removeSchedule {
            margin-left: 20px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #1890ff;
            line-height: 22px;
            cursor: pointer;
            float: right;
            margin-right: 60px;
          }
        }
        .shift_time {
          line-height: 40px;
          .el-time-select {
            width: 140px;
          }
          .middle_line {
            width: 30px;
            display: inline-block;
            border: 1px solid #d9d9d9;
          }
          .need_people,
          .salary_label {
            margin-left: 30px;
            margin-right: 10px;
          }
          .salary_label {
            margin-left: 0px;
            margin-top: 5px;
          }
          .need_people_inp,
          .salary_input {
            display: inline-block;
            height: 30px;
            width: 140px;
            background: #ffffff;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding-left: 10px;
            line-height: 30px;
          }
        }
      }
    }
  }
  .reservation_setting {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-top: 20px;
    .reservation_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .reservation_inp_wrap {
      height: 100%;
      margin-left: 20px;
      .reservation_inp {
        background: #ffffff;
        width: 286px;
        height: 40px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding-left: 10px;
      }
    }
  }
  .remarks {
    width: 100%;
    display: flex;
    margin-top: 20px;
    .remarks_label {
      width: 100px;
      height: 40px;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .remarks_inp_wrap {
      height: 100%;
      position: relative;
      margin-left: 20px;
      .remarks_inp.el-textarea {
        background: #ffffff;
        width: 600px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 18px;
        line-height: 40px;
      }
      .max_length {
        position: absolute;
        bottom: 4px;
        right: 20px;
        font-size: 12px;
        color: #c3c3c3;
      }
    }
  }
  .btn_wrap {
    margin-left: 120px;
    display: flex;
    margin-top: 30px;
    justify-content: start;
    > div {
      width: 80px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
    .confirm {
      background: #1890ff;
      color: #fff;
    }
    .cancel {
      border: 1px solid #d9d9d9;
      margin-left: 30px;
    }
  }
}
</style>
