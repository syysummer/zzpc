<template>
	<div class="main_contain">
		<!-- 全职和兼职排班 -->
		<div class="schedule_list">
			<div class="btn_contain">
				<div class="switch_type">
					<el-button size="small" @click="goEditSchedule" type="primary" icon="el-icon-plus">新建排班</el-button>
					<el-button-group>
						<el-button size="small" :class="{isActive: !showContain}" @click="changeContain('parttime')">兼职排班</el-button>
						<el-button size="small" :class="{isActive: showContain}" @click="changeContain('fulltime')">全职排班</el-button>
					</el-button-group>
				</div>
				<div class="btn_right">
					<el-button size="small" type="danger" @click="goPulish">发布</el-button>
					<el-button size="small" type="primary">保存</el-button>
					<el-button size="small" @click="goBack" type="primary">返回</el-button>
					<el-button size="small" @click="exportFile" icon="el-icon-upload">导出</el-button>
				</div>
			</div>
			<div class="schedules_contain">
				<!-- 全职排班 -->
				<div v-show="showContain" class="fulltime_contain">
					<FullTimeSchedule />
				</div>
				<!-- 兼职排班 -->
				<div v-show="!showContain" class="parttime_contain">
					<div class="schedules_time">
						<ScheTime></ScheTime>
					</div>
					<div class="calendar_contain">
						<PartTimeSchedule></PartTimeSchedule>
					</div>
				</div>
			</div>
		</div>

		<!-- 导出弹窗 -->
		<el-dialog class="export_file" title="班期导出" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="班期类型">
					<el-radio-group v-model="form.export_popup_radio_msg" @change="export_popup_radio">
						<el-radio label="全部"></el-radio>
						<el-radio label="兼职"></el-radio>
						<el-radio label="全职"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="选择时间">
					<div class="block">
						<el-date-picker v-model="export_popup_date" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" @change="export_popup_date_fn">
						</el-date-picker>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="export_file">确 定</el-button>
				<el-button @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import FullTimeSchedule from './fulltime_schedule'
import PartTimeSchedule from './components/calendar'
import ScheTime from './components/schedules_time'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialogFormVisible: false, //控制导出弹框的显示隐藏
      form: {
        export_popup_radio_msg: '全部'
      },
      export_popup_date: '', //导出日期
      showContain: true,
      schedule_type: 'fulltime', //标识当前是兼职还是全职
      scheduleTable: [
        //班次配送员信息(模拟导出数据)
        {
          delivery: 'xiaochen',
          Appointment: '09-19 09:00',
          goWorkTime: '09-19 09:00',
          offWorkTime: '09-19 09:00',
          totalWorkTime: '10',
          AbsenceTime: '09:00',
          totalIncome: '500P',
          deliveryIncome: '500P',
          hourIncome: '500P',
          reward: '500P'
        },
        {
          delivery: 'xiaosun',
          Appointment: '09-19 09:00',
          goWorkTime: '09-19 09:00',
          offWorkTime: '09-19 09:00',
          totalWorkTime: '9',
          AbsenceTime: '09:00',
          totalIncome: '500P',
          deliveryIncome: '500P',
          hourIncome: '500P',
          reward: '500P'
        }
      ]
    }
  },
  // beforeRouteEnter(from, to, next) {
  //   next(vm => {
  //     if (from.indexOf('edit_schedule')this.new_schedule_type == '2') {
  //       this.showContain = false
  //     }
  //   })
  // },
  computed: {
    ...mapState(['new_schedule_type'])
  },
  methods: {
    changeContain(type) {
      // 切换全职排班与兼职排班
      if (type == 'fulltime') {
        this.showContain = true
        this.schedule_type = 'fulltime'
      } else {
        this.showContain = false
        this.schedule_type = 'parttime'
      }
    },
    goPulish() {
      // 发布排班前二次确认
      let message
      let title
      if (this.schedule_type == 'fulltime') {
        title = '您确定要发布全职班期吗'
        message = '发布后无法变更，你还要继续吗？'
      } else {
        title = '您确定要发布兼职排班预约表吗'
        message = '发布后无法变更，你还要继续吗？'
      }
      this.$confirm(`${message}`, `${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 请求发布相关接口
        })
        .catch(() => {
          // 点击了取消的逻辑
        })
    },
    goBack() {
      // 判断当前是哪个页面跳转过来的再返回
      this.$router.go(-1)
    },
    exportFile() {
      // 点击导出,请求后台数据
      this.dialogFormVisible = true
    },
    formatJson(filterVal, jsonData) {
      // 在整个列表的数据中过滤导出自己需要的数据
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    // 导出弹窗班期选择
    export_popup_radio(val) {
      console.log(val)
      this.form.export_popup_radio_msg = val
    },
    // 导出弹窗日期选择
    export_popup_date_fn(val) {
      if (val) {
        this.export_popup_start_time = new Date(val[0]).getTime()
        this.export_popup_end_time = new Date(val[1]).getTime()
      }
    },
    // 配送效率导出按钮
    export_file() {
      console.log('导出相关逻辑')
      // 导出excel文件
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = [
      //     'delivery',
      //     'Appointment',
      //     'goWorkTime',
      //     'offWorkTime',
      //     'totalWorkTime',
      //     'AbsenceTime',
      //     'totalIncome',
      //     'deliveryIncome',
      //     'hourIncome',
      //     'reward'
      //   ] // excel的表头标题
      //   const filterVal = [
      //     'delivery',
      //     'Appointment',
      //     'goWorkTime',
      //     'offWorkTime',
      //     'totalWorkTime',
      //     'AbsenceTime',
      //     'totalIncome',
      //     'deliveryIncome',
      //     'hourIncome',
      //     'reward'
      //   ] // 需要导出对应自己列表中的每项数据
      //   const list = this.scheduleTable // 整个列表的数据
      //   const data = this.formatJson(filterVal, list)
      //   excel.export_json_to_excel(tHeader, data, 'schedule_list')
      // })
      this.dialogFormVisible = false
    },
    goEditSchedule() {
      // 点击新建按钮
      this.$router.push({
        path: '/business/edit_schedule',
        query: {
          type: 'new',
          schedule_type: this.schedule_type
        }
      })
    }
  },
  components: {
    FullTimeSchedule,
    PartTimeSchedule,
    ScheTime
  }
}
</script>

<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.main_contain {
  width: 100%;
  height: 100%;
  .schedule_list {
    width: 100%;
    height: 100%;
    .btn_contain {
      display: flex;
      justify-content: space-between;
      & > div {
        width: 50%;
        &.btn_right {
          text-align: right;
        }
      }
      .switch_type {
        .isActive {
          background: #ffffff;
          border: 1px solid #1890ff;
          color: #1890ff;
        }
      }
      .el-button-group {
        padding-left: 5%;
      }
    }
    .schedules_contain {
      width: 100%;
      height: 90%;
      margin-top: 2%;
      display: flex;
      flex-direction: row;
      padding: 0 30px;
      .parttime_contain,
      .fulltime_contain {
        width: 100%;
        height: 100%;
      }
      .parttime_contain {
        display: flex;
      }
      .schedules_time {
        width: 29%;
        background-color: #fff;
        margin-right: 2%;
        border-radius: 10px;
      }
      .calendar_contain {
        background-color: #fff;
        width: 69%;
        border-radius: 10px;
      }
    }
  }
}
</style>
