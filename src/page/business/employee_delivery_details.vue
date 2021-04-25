<template>
	<div class="detail_contain">
		<div class="schedules_contain">
			<!-- 头部部分 -->
			<div class="details_header">
				<div class="schedules_time_scope">
					<div class="detail_time">{{emp_del_det.schedule_date}}2015-10-02 ～ 2015-10-10</div>
					<div class="detail_des">
						<span>{{emp_del_det.remarks}} </span>{{emp_del_det.remake_content}}
					</div>
				</div>
				<div class="back" @click="$router.go(-1)">{{emp_del_det.back}}</div>
			</div>

			<!-- 详情部分 -->
			<div class="details_content">
				<div class="time_list">
					<div class="item" @click="changeTime(item, index)" :class="{active: item.isActive}" v-for="(item, index) in timeList">
						<span>{{item.name}}</span>
					</div>
				</div>
				<!-- 班次列表 -->
				<div class="schedules_list">
					<div class="schedule_item">
						<div class="schedule_item_title">
							<div class="specific_time">
								<span class="icon">
									<i class="iconfont icon-shijian"></i>
								</span>
								一班时间：09:12 ~ 09:12
							</div>
							<div class="people_number">
								<div class="appointments_number">{{emp_del_det.appointments_people}} 23</div>
								<div class="attendees_number">{{emp_del_det.attendees_people}} 23</div>
							</div>
						</div>
						<el-table :data="scheduleTable" :header-cell-style='styleObj' style="width: 100%" stripe :default-sort="{prop: 'totalWorkTime', order: 'descending'}" @sort-change="tableSortChange" v-loading="loading">
							<el-table-column prop="delivery" align="center" :label="emp_del_det.delivery" min-width="100" show-overflow-tooltip></el-table-column>
							<el-table-column prop="Appointment" align="center" :label="emp_del_det.Appointment" min-width="100"></el-table-column>
							<el-table-column prop="goWorkTime" align="center" :label="emp_del_det.go_worktime" min-width="125"></el-table-column>
							<el-table-column prop="offWorkTime" align="center" :label="emp_del_det.off_worktime" min-width="125"></el-table-column>
							<el-table-column prop="totalWorkTime" align="center" :label="emp_del_det.total_worktime" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="AbsenceTime" align="center" :label="emp_del_det.Absence_time" min-width="100"></el-table-column>
							<el-table-column prop="totalIncome" align="center" :label="emp_del_det.total_income" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="deliveryIncome" align="center" :label="emp_del_det.delivery_income" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="hourIncome" align="center" :label="emp_del_det.hour_income" min-width="100"></el-table-column>
							<el-table-column prop="reward" align="center" :label="emp_del_det.reward" min-width="100"></el-table-column>
						</el-table>
					</div>

					<div class="schedule_item">
						<div class="schedule_item_title">
							<div class="specific_time">
								<span class="icon">
									<i class="iconfont icon-shijian"></i>
								</span>
								一班时间：09:12 ~ 09:12
							</div>
							<div class="people_number">
								<div class="appointments_number">预约人数：23</div>
								<div class="attendees_number">到勤人数：23</div>
							</div>
						</div>
						<el-table :data="scheduleTable" :header-cell-style='styleObj' style="width: 100%" stripe :default-sort="{prop: 'totalWorkTime', order: 'descending'}" @sort-change="tableSortChange" v-loading="loading">
							<el-table-column prop="delivery" align="center" :label="emp_del_det.delivery" min-width="100" show-overflow-tooltip></el-table-column>
							<el-table-column prop="Appointment" align="center" :label="emp_del_det.Appointment" min-width="100"></el-table-column>
							<el-table-column prop="goWorkTime" align="center" :label="emp_del_det.go_worktime" min-width="125"></el-table-column>
							<el-table-column prop="offWorkTime" align="center" :label="emp_del_det.off_worktime" min-width="125"></el-table-column>
							<el-table-column prop="totalWorkTime" align="center" :label="emp_del_det.total_worktime" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="AbsenceTime" align="center" :label="emp_del_det.Absence_time" min-width="100"></el-table-column>
							<el-table-column prop="totalIncome" align="center" :label="emp_del_det.total_income" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="deliveryIncome" align="center" :label="emp_del_det.delivery_income" min-width="100" sortable='custom'></el-table-column>
							<el-table-column prop="hourIncome" align="center" :label="emp_del_det.hour_income" min-width="100"></el-table-column>
							<el-table-column prop="reward" align="center" :label="emp_del_det.reward" min-width="100"></el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      isFulltime: false, // 是否是全职详情(具体可根据是否有预约时间来判断)
      loading: false, //表格数据是否在加载中
      styleObj: {
        background: '#F6F9FF'
      },
      currentScheduleIndex: 0, //当前选中的班次
      timeList: [
        //班次列表
        { name: '10-02', isActive: true },
        { name: '10-03', isActive: false },
        { name: '10-04', isActive: false },
        { name: '10-05', isActive: false },
        { name: '10-06', isActive: false },
        { name: '10-07', isActive: false },
        { name: '10-08', isActive: false },
        { name: '10-09', isActive: false },
        { name: '10-10', isActive: false }
      ],
      scheduleTable: [
        //班次配送员信息
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
        },
        {
          delivery: 'xiaochen',
          Appointment: '09-19 09:00',
          goWorkTime: '09-19 09:00',
          offWorkTime: '09-19 09:00',
          totalWorkTime: '12',
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
          totalWorkTime: '8',
          AbsenceTime: '09:00',
          totalIncome: '500P',
          deliveryIncome: '500P',
          hourIncome: '500P',
          reward: '500P'
        }
      ]
    }
  },
  computed: {
    emp_del_det() {
      return this.$t('employee_delivery_details')
    }
  },
  methods: {
    changeTime(item, index) {
      if (index === this.currentScheduleIndex) return
      this.timeList[this.currentScheduleIndex].isActive = false
      item.isActive = true
      this.currentScheduleIndex = index
      this.scheduleTable = []
      this.loading = true
      // 根据当前排班时间请求后台数据
      this.timer = setTimeout(() => {
        this.scheduleTable = [
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
          },
          {
            delivery: 'xiaochen',
            Appointment: '09-19 09:00',
            goWorkTime: '09-19 09:00',
            offWorkTime: '09-19 09:00',
            totalWorkTime: '12',
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
            totalWorkTime: '8',
            AbsenceTime: '09:00',
            totalIncome: '500P',
            deliveryIncome: '500P',
            hourIncome: '500P',
            reward: '500P'
          }
        ]
        this.loading = false
        clearTimeout(this.timer)
      }, 1000)
    },
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, column)
      // ascending 升序 descending 降序
      // this.getDeliverySettleList()
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.detail_contain {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .schedules_contain {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .details_header {
      width: 100%;
      height: 100px;
      display: flex;
      padding: 0 30px;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      .schedules_time_scope {
        display: flex;
        flex-direction: column;
        .detail_time {
          font-family: PingFangSC-Semibold;
          font-size: 20px;
          color: #333333;
          letter-spacing: 0;
          line-height: 26px;
        }
        .detail_des {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 30px;
          span {
            font-size: 18px;
            color: #222222;
          }
        }
      }
      .back {
        width: 65px;
        height: 32px;
        background: #3ea2ff;
        border-radius: 4px;
        color: #fff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
    }
    .details_content {
      width: 100%;
      margin-top: 1%;
      background: #fff;
      padding: 0 30px;
      height: 93%;
      .time_list {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .item {
          width: 85px;
          height: 20px;
          border-right: 2px solid #eee;
          float: left;
          text-align: center;
          line-height: 20px;
          cursor: pointer;
          span {
            display: inline-block;
            height: 30px;
            line-height: 20px;
          }
          &.active {
            span {
              color: #ff725d;
              border-bottom: 2px solid #ff725d;
            }
          }
        }
      }
      .schedules_list {
        width: 100%;
        height: 92%;
        padding-bottom: 80px;
        box-sizing: border-box;
        overflow: auto;
        .schedule_item {
          width: 100%;
          .schedule_item_title {
            width: 100%;
            height: 40px;
            background: #e6f7ff;
            border: 1px solid #bae7ff;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            margin-bottom: 10px;
            .specific_time {
              .icon {
                display: inline-block;
                vertical-align: middle;
                width: 25px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                background: #1890ff;
                border-radius: 50%;
                .icon-shijian {
                  font-size: 16px;
                  color: #fff;
                  line-height: 16px;
                  border-radius: 50%;
                  padding: 0;
                  margin-top: -2px;
                }
              }
            }
          }
          .people_number {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .attendees_number {
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
}
</style>
