<template>
	<div class="fulltime_schedule">
		<div class="employ_all_wrap" v-if="true">
			<div class="employee">{{fulltimeSche.delivery_staff}}</div>
			<div class="employ_all">
				<draggable v-model="allArray" :options="{group: { name: 'people', pull: 'clone'}}" @start="drag=true" @end="handleEnd">
					<div class="employ_all_item" v-for="element in allArray " :key="element.id ">
						<span class="tag ">{{element.name.slice(0,1)}}</span>
						<span class="employ_name ">{{element.name}}</span>
					</div>
				</draggable>
			</div>
		</div>
		<div class="schedule_wrap " :class="{isPublish: isPublish} ">
			<!-- 排期按钮部分 -->
			<div class="select_wrap ">
				<span class="label ">{{fulltimeSche.schedule_date}} :</span>
				<el-select v-model="timeValue " :placeholder="fulltimeSche.please_select" class="syy_select_time " size="small ">
					<el-option v-for="item in timeOptions " :key="item.value " :label="item.label " :value="item.value ">
					</el-option>
				</el-select>
				<span class="wran ">{{fulltimeSche.restPre}}1{{fulltimeSche.restNext}}</span>
				<div class="check_details " @click="checkDetails ">{{fulltimeSche.check_details}}</div>
			</div>
			<!-- 排期列表 -->
			<div class="schedule_list">
				<div class="schedule_item" v-for="(ele, index) in scheduleList">
					<div class="title ">{{chinanum(index)}}班 ({{ele.beginTime}} ~ {{ele.endTime}}) {{ele.groupList.length}}/{{ele.needNum}}</div>
					<draggable class="drag_wrap " v-model="ele.groupList" :options="{group: 'people'} " @start="drag=true " @end="handleEnd ">
						<div class="employ_specific_item " v-for="element in ele.groupList " :key="element.id ">
							<span class="tag ">{{element.name.slice(0,1)}}</span>
							<span class="employ_name ">{{element.name}}</span>
						</div>
					</draggable>
				</div>
			</div>
			<!-- 数据为空时展示背景图 -->
			<div class="null_data" v-if="false">
				<div class="img_wrap">
					<img src="../../assets/images/null_data@2x.png" alt="">
					<div class="null_msg">暂无内容, 您可以新建班期</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      allArray: [
        { id: 0, name: 'Zly' },
        { id: 1, name: 'Fsf', isEnd: true },
        { id: 2, name: 'Ty' },
        { id: 3, name: 'Lj' },
        { id: 4, name: 'Ym' },
        { id: 5, name: 'Lkw', isEnd: true },
        { id: 6, name: 'Zjn' },
        { id: 7, name: 'Zh' },
        { id: 8, name: 'Zs' },
        { id: 9, name: 'Syy', isEnd: true },
        { id: 10, name: 'Xxy' },
        { id: 11, name: 'Zww' },
        { id: 12, name: 'Ygd' },
        { id: 13, name: 'Yzw', isEnd: true },
        { id: 14, name: 'Wqq' },
        { id: 15, name: 'Zy' }
      ], // 所有配送员
      timeOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ],
      timeValue: '', // 当前选中的时间
      isPublish: true, // 是否已经发布了
      scheduleList: [
        {
          beginTime: '8:00',
          endTime: '9:00',
          needNum: 14,
          groupList: []
        },
        {
          beginTime: '8:00',
          endTime: '9:00',
          needNum: 14,
          groupList: []
        },
        {
          beginTime: '8:00',
          endTime: '9:00',
          needNum: 14,
          groupList: []
        }
      ] // 班次列表
    }
  },
  computed: {
    ...mapState(['new_fulltime']),
    fulltimeSche() {
      return this.$t('fulltime_schedule')
    }
  },
  mounted() {
    this.handleEnd()
    console.log('this.new_fulltime', this.new_fulltime)
  },
  methods: {
    chinanum(num) {
      // 将index转化为汉字
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
    handleEnd(evt) {
      // 拖拽的逻辑去重的逻辑
      let text = evt ? evt.clone.innerText.split(' ')[1] : ''
      this.drag = false
      this.allArray = [...new Set(this.allArray)]
      this.allArray.sort((a, b) => {
        return a.name.charCodeAt(0) - b.name.charCodeAt(0)
      })
      // 一班
      let firstArray = [...new Set(this.scheduleList[0].groupList)]
      if (this.scheduleList[0].groupList.length > firstArray.length) {
        this.$message.warning(`${text} ${this.fulltimeSche.arranged}`)
      }
      this.scheduleList[0].groupList = firstArray
      // 二班
      if (!this.scheduleList[1]) return
      let secondArray = [...new Set(this.scheduleList[1].groupList)]
      if (this.scheduleList[1].groupList.length > secondArray.length) {
        this.$message.warning(`${text} ${this.fulltimeSche.arranged}`)
      }
      this.scheduleList[1].groupList = secondArray
      // 三班
      if (!this.scheduleList[2]) return
      let thirdArray = [...new Set(this.scheduleList[2].groupList)]
      if (this.scheduleList[2].groupList.length > thirdArray.length) {
        this.$message.warning(`${text} ${this.fulltimeSche.arranged}`)
      }
      this.scheduleList[2].groupList = thirdArray
      // 四班
      if (!this.scheduleList[3]) return
      let fouthArray = [...new Set(this.scheduleList[3].groupList)]
      if (this.scheduleList[3].groupList.length > fouthArray.length) {
        this.$message.warning(`${text} ${this.fulltimeSche.arranged}`)
      }
      this.scheduleList[3].groupList = fouthArray
    },
    checkDetails() {
      this.$router.push('/employee_delivery_details')
    }
  },
  components: {
    draggable
  }
}
</script>

<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.fulltime_schedule {
  width: 100%;
  height: 100%;
  /*min-height: 400px;*/
  display: flex;
  justify-content: space-between;
  .employ_all_wrap {
    width: 22%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    border-radius: 2px;
    .employee {
      width: 90%;
      height: 50px;
      margin: 0 auto;
      text-align: center;
      line-height: 50px;
      border-bottom: 1px solid #eee;
    }
    .employ_all {
      overflow: hidden;
      height: 93%;
      width: 100%;
      overflow: auto;
      .employ_all_item {
        width: 90%;
        height: 50px;
        margin: 6% auto;
        display: flex;
        justify-content: space-around;
        line-height: 50px;
        align-items: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        padding-bottom: 20px;
        color: rgba(255, 255, 255, 0.85);
        &:hover {
          transform: scale(1.05);
        }
        .tag {
          width: 40px;
          height: 40px;
          background: #42a4ff;
          border-radius: 50%;
          text-align: center;
          vertical-align: middle;
          line-height: 40px;
        }
        .employ_name {
          width: 70%;
          height: 40px;
          background: #42a4ff;
          border-radius: 19px;
          line-height: 40px;
          padding-left: 19px;
        }
      }
    }
  }
  .schedule_wrap {
    width: 76%;
    height: 100%;
    background: #fff;
    padding-top: 5px;
    overflow: hidden;
    &.isPublish {
      width: 100%;
    }
    .select_wrap {
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      position: relative;
      .wran {
        margin-left: 20px;
        font-family: PingFangSC-Semibold;
        font-size: 13px;
        color: #ff644d;
        letter-spacing: 0;
      }
      .check_details {
        background: #3ea2ff;
        border-radius: 6px;
        width: 100px;
        height: 26px;
        line-height: 26px;
        color: #fff;
        text-align: center;
        border: none;
        position: absolute;
        right: 20px;
        top: 7px;
        cursor: pointer;
      }
    }
    .schedule_list {
      width: 100%;
      height: 94%;
      margin-top: 2px;
      display: flex;
      > div {
        flex: 1;
        text-align: center;
        border-right: 1px dashed #eee;
        padding-bottom: 5px;
        &:last-child {
          border-right: 0px dashed #eee;
        }
        .title {
          height: 40px;
          line-height: 40px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #333333;
          background: rgba(228, 237, 252, 0.94);
        }
        .drag_wrap {
          height: 92%;
          width: 100%;
          overflow: auto;
          .employ_specific_item {
            width: 90%;
            max-width: 400px;
            height: 50px;
            margin: 4% auto;
            display: flex;
            justify-content: space-around;
            line-height: 50px;
            align-items: center;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            .tag {
              width: 40px;
              height: 40px;
              background: #5acb75;
              border-radius: 50%;
              text-align: center;
              vertical-align: middle;
              line-height: 40px;
            }
            .employ_name {
              width: 70%;
              height: 40px;
              background: #5acb75;
              border-radius: 19px;
              line-height: 40px;
              padding-left: 19px;
              text-align: left;
            }
          }
        }
      }
    }
    .null_data {
      width: 100%;
      height: 100%;
      .img_wrap {
        width: 400px;
        margin: 100px auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .null_msg {
        margin: 50px auto;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
        line-height: 28px;
      }
    }
  }
}
</style>
