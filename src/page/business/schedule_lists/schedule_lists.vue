<template>
	<div class="schedules_list_contain">
		<div class="schedules_inner_contain">
			<!-- 头部部分 -->
			<div class="schedules_header">
				<div class="block select_time">
					<span class="demonstration">{{schedule_lists.schedule_date}}</span>
					<el-date-picker v-model="valueTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
					</el-date-picker>
				</div>
				<div class="select_status">
					<span class="detail_time">{{schedule_lists.status}} </span>
					<el-select v-model="valueStatus" :placeholder="schedule_lists.please_select" ref="state">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="inquire_contain" @click="queryScheduleLists">{{schedule_lists.inquire}}</div>
			</div>
			<!-- 详情部分 -->
			<div class="schedules_list_content">
				<div class="switch_schedules">
					<div class="schedule_item" @click="changeSchedule('fulltime')" :class="{active: isActive == 'fulltime'}">
						<span>{{schedule_lists.fulltime}}</span>
					</div>
					<div class="schedule_item" @click="changeSchedule('parttime')" :class="{active: isActive == 'parttime'}">
						<span>{{schedule_lists.parttime}}</span>
					</div>
				</div>
				<!--表格列表和分页器全职-->
				<div class="table_branch">
					<el-table :data="scheduleTable.slice((currentPage-1)*pagesize,currentPage*pagesize)" :header-cell-style='styleObj' style="width: 100%" stripe :default-sort="{prop: 'schedule', order: 'descending'}" v-loading="loading">
						<el-table-column prop="schedule" align="center" :label="schedule_lists.schedule" min-width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="groupNumber" align="center" :label="schedule_lists.schedule_time" min-width="100"></el-table-column>
						<el-table-column prop="count" v-if="isActive=='fulltime'" align="center" :label="schedule_lists.people_number" min-width="125"></el-table-column>
						<el-table-column prop="count" v-if="isActive=='parttime'" align="center" :label="schedule_lists.appointments_people" min-width="125"></el-table-column>
						<el-table-column prop="status" align="center" :label="schedule_lists.status" min-width="125">
							<template slot-scope="scope">
								<div class="schedule_status">
									<div class="not_publish" v-if="scope.row.status == '0'">
										<span class="not_publish"></span>
										<span class="status_content">未发布</span>
									</div>
									<div class="did_publish" v-if="scope.row.status == '1'">
										<span class="did_publish"></span>
										<span class="status_content">已发布</span>
									</div>
									<div class="did_finished" v-if="scope.row.status == '2'">
										<span class="did_finished"></span>
										<span class="status_content">已结束</span>
									</div>
									<div class="in_appointment" v-if="scope.row.status == '3'">
										<span class="in_appointment"></span>
										<span class="status_content">预约中</span>
									</div>
									<div class="in_handing" v-if="scope.row.status == '4'">
										<span class="in_handing"></span>
										<span class="status_content">进行中</span>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column :label="schedule_lists.operation" min-width="200" align="center">
							<template slot-scope="scope">
								<div class="schedule_handle" v-if="scope.row.status == '0'">
									<div @click="scheduling(scope.row)">{{schedule_lists.scheduling}}</div>
									<div @click="handleWrite(scope.row)">{{schedule_lists.writing}}</div>
									<div @click="handlereomve(scope.row)">{{schedule_lists.reomve}}</div>
								</div>
								<div class="schedule_handle" v-if="scope.row.status != '0' ">
									<div @click="checkDeatils(scope.row) ">{{schedule_lists.check_details}}</div>
									<div @click="checkSchedule(scope.row) ">{{schedule_lists.schedule}}</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!--分页器-->
				<div class="branch_pagination schedules_list_pagination " v-if="!loading ">
					<span class="span_block ">{{schedule_lists.the}}{{currentPage}}{{schedule_lists.page}}，{{schedule_lists.shows}}{{pagesize}}{{schedule_lists.count}}，{{schedule_lists.total}}{{total}}{{schedule_lists.count}}</span>
					<el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page.sync="currentPage " :page-size="pagesize " background layout="prev, pager, next " :total="total ">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { formatDateTime } from '../../../utils/index'
export default {
  data() {
    return {
      currentPage: 1, // 当前显示哪一页
      pagesize: 7, // 每一页显示的条数
      pagercount: 9, // 分页器显示的个数,多余这个个数隐藏显示
      valueTime: formatDateTime(new Date(), 'ymd'),
      valueStatus: '', //表示当前的状态
      // statusOptions:
      options: [],
      isActive: 'fulltime', // 是否是当前选择项目
      branchTable: [],
      showPage: 2,
      isFulltime: false, // 是否是全职详情(具体可根据是否有预约时间来判断)
      loading: true, //表格数据是否在加载中
      styleObj: {
        background: '#F6F9FF'
      },
      scheduleTable: [] //班次配送员信息
    }
  },
  computed: {
    total() {
      // 要展示的数组的总条数
      return this.scheduleTable.length
    },
    schedule_lists() {
      return this.$t('schedule_lists')
    },
    schedule_type() {
      if (this.isActive == 'parttime') {
        return parseInt(0)
      } else {
        return parseInt(1)
      }
    },
    currentStatus() {
      // 当前状态 全部 "" , 未发布 "0", 已发布 "1", 已结束 "2", 预约中 "3", 进行中 "4"
      return this.$refs.state.value
    },
    statusOptions() {
      if (this.isActive == 'parttime') {
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未发布'
          },
          {
            value: '1',
            label: '已发布'
          },
          {
            value: '2',
            label: '已结束'
          },
          {
            value: '3',
            label: '预约中'
          },
          {
            value: '4',
            label: '进行中'
          }
        ]
      } else {
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '未发布'
          },
          {
            value: '1',
            label: '已发布'
          },
          {
            value: '2',
            label: '已结束'
          },
          {
            value: '4',
            label: '进行中'
          }
        ]
      }
    }
  },
  mounted() {
    this.reqScheduleLists()
  },
  methods: {
    ...mapActions(['getScheduleLists']),
    async reqScheduleLists() {
      // 请求列表数据
      console.log(this.$refs.state.value, 'value=======')
      let param
      param = {
        scheduleType: this.schedule_type,
        time: this.valueTime,
        status: this.$refs.state.value
      }
      let res = await this.getScheduleLists(param)
      if (res.data.code == 1) {
        console.log('data', res.data)
        let scheduleLists = []
        res.data.data.typesettingList.forEach(element => {
          let beginDate = formatDateTime(element.beginDate, 'ymd')
          let endDate = formatDateTime(element.endDate, 'ymd')
          let item = {
            schedule: `${beginDate} ~ ${endDate}`,
            beginDate: element.beginDate,
            endDate: element.endDate,
            count: element.count,
            id: element.id,
            status: element.status,
            groupNumber: element.groupNumber
          }
          scheduleLists.push(item)
        })
        this.scheduleTable = scheduleLists
      } else {
        this.$message.error(res.data.message)
      }
      this.loading = false
    },
    queryScheduleLists() {
      this.reqScheduleLists()
    },
    changeSchedule(type) {
      //切换兼职或全职
      if (type == 'parttime') {
        this.isActive = 'parttime'
      } else {
        this.isActive = 'fulltime'
      }
      this.loading = true
      this.scheduleTable = []
      this.reqScheduleLists()
    },
    changePage() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    scheduling(row) {
      //点击排期的逻辑
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/business/business_sche',
        query: {
          schedule_time: scheduleTime,
          schedule_type: this.isActive
        }
      })
    },
    handleWrite(row) {
      // 点击编辑的逻辑
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/business/edit_schedule',
        query: {
          type: 'edit',
          schedule_time: scheduleTime,
          schedule_type: this.isActive
        }
      })
    },
    handlereomve(row) {
      // 点击删除的逻辑
      this.$confirm(
        `${this.schedule_lists.ask_delete_schedule}`,
        `${this.schedule_lists.confirm_again}`,
        {
          distinguishCancelAndClose: true,
          confirmButtonText: `${this.schedule_lists.confirm}`,
          cancelButtonText: `${this.schedule_lists.cancel}`,
          type: 'warning'
        }
      )
        .then(() => {
          // 处理删除的逻辑
          this.$message({
            type: 'success',
            message: `${this.schedule_lists.delete_success}`
          })
        })
        .catch(action => {
          console.log('action', action)
          if (action == 'cancel') {
            this.$message({
              type: 'info',
              message: `${this.schedule_lists.cancel_delete}`
            })
          }
        })
    },
    checkDeatils(row) {
      //查看详情的逻辑
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/employee_delivery_details',
        schedule_time: scheduleTime
      })
    },
    checkSchedule(row) {
      // 查看班期的逻辑
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/business/business_sche',
        schedule_time: scheduleTime
      })
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
@import '../../../assets/css/fulltime.css';
.schedules_list_contain {
  width: 100%;
  height: 100%;
  overflow: auto;
  .schedules_inner_contain {
    width: 100%;
    height: 92%;
    .schedules_header {
      width: 100%;
      height: 80px;
      display: flex;
      padding: 0 30px;
      align-items: center;
      background: #fff;
      .select_status {
        margin-left: 30px;
      }
      .inquire_contain {
        background: #ff644d;
        border-radius: 4px;
        width: 65px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        color: #fff;
        margin-left: 30px;
      }
    }
    .schedules_list_content {
      margin-top: 20px;
      width: 100%;
      padding-bottom: 10px;
      padding-left: 30px;
      padding-right: 30px;
      background: #fff;
      .switch_schedules {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .schedule_item {
          width: 85px;
          height: 20px;
          background: #fff;
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
      .table_branch {
        .schedule_status {
          width: 100%;
          height: 100%;
          > div {
            text-align: center;
            span:first-child {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              vertical-align: middle;
            }
            .not_publish {
              background: #52c41a;
            }
            .did_publish {
              background: #a8a9eb;
            }
            .in_handing {
              background: #ff644d;
            }
            .in_appointment {
              background: #2094fe;
            }
            .did_finished {
              background: #b9b9b9;
            }
          }
        }
        .schedule_handle {
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            min-width: 50px;
            padding-right: 5px;
            text-align: center;
            border-right: 1px solid #1890ff;
            color: #1890ff;
            height: 18px;
            line-height: 18px;
            cursor: pointer;
            &:last-child {
              border-right: 0px solid #1890ff;
            }
          }
        }
      }
    }
    .branch_pagination {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .span_block {
        vertical-align: middle;
        color: #606266;
        font-size: 14px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>
