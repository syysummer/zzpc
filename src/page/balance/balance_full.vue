<template>
  <div class="balance_full_container">
    <div class="balance_full_header">
      <div class="delivery_info_header">
        <div class="delivery_info">
          <div>
            <span>配送员:</span>
            <span>xiaochen</span>
          </div>
          <div>
            <span>手机号:</span>
            <span>135458798545</span>
          </div>
          <div>
            <span>配送ID:</span>
            <span>123</span>
          </div>
          <div>
            <span>配送类型:</span>
            <span>兼职</span>
          </div>
        </div>
        <div class="btn"><el-button type="primary" size="mini" @click="goBack">返回</el-button></div>
      </div>
    </div>
    <div class="balance_full">
      <div class="list_nav">
        <div class="work">
          <div :class="{active: isFull==1}" @click="changeList(1)">收入记录</div>
          <span class="border_line">|</span>
          <div :class="{active: isFull==2}" @click="changeList(2)">支出记录</div>
        </div>
      </div>
      <div class="balance_account">
        <div>
          <span>最近30天收入金额:</span>
          <span>600P</span>
        </div>
        <div>
          <span>账户余额收入金额:</span>
          <span>300P</span>
        </div>
      </div>
      <el-table :data="balanceData" stripe style="width: 100%" v-if="isFull==1" :key="isFull">
        <el-table-column prop="settleMoney" label="账户信息" min-width="155"></el-table-column>
        <el-table-column prop="balanceCount" label="到账金额" min-width="175" sortable='custom'></el-table-column>
        <el-table-column prop="unsettledNum" label="到账时间" min-width="165" sortable='custom'></el-table-column>
        <el-table-column label="状态" min-width="155">
          <template slot-scope="scope">
            <span class="circle"></span>
            <span>{{scope.row.settleNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="settleNums" label="收入方式" min-width="155"></el-table-column>
      </el-table>
      <el-table :data="balanceAllData" stripe style="width: 100%" v-else :key="isFull">
        <el-table-column prop="settleMoney" label="支出账户" min-width="155"></el-table-column>
        <el-table-column prop="balanceCount" label="支出金额" min-width="175" sortable='custom'></el-table-column>
        <el-table-column prop="unsettledNum" label="转出时间" min-width="165" sortable='custom'></el-table-column>
        <el-table-column prop="settleNum" label="支出类型" min-width="155"></el-table-column>
        <el-table-column label="状态" min-width="155">
          <template slot-scope="scope">
            <span class="circle"></span>
            <span>{{scope.row.settleNums}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="parseInt(total)>1">
        <span>{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showCount}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{total}}{{$t('distributor.count')}}</span>
        <div class="u-pagination">
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="showCount" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "balance_list",
  data() {
    return {
      total: 100,
      currentPage: 1,
      showCount: 7,
      balanceData: [
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2",
          settleNum: "已发布"
        },
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2",
          settleNum: "已发布"
        }
      ],
      balanceAllData: [
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2",
          settleNums: "已发布"
        },
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2",
          settleNums: "已发布"
        }
      ],
      isFull: 1
    };
  },
  methods: {
    changeList(num) {
      this.isFull = num;
    },
    goBack() {
      this.$router.push({
        path: "/balance_list",
        query: {balanceType: 2}
      })
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
};
</script>
<style scoped lang="scss">
.balance_full_container {
  .balance_full_header {
    background: #fff;
    margin-bottom: 12px;
    padding: 10px 30px;
    .delivery_info_header {
      display: flex;
      align-items: center;
      .delivery_info {
        flex: 1;
        display: flex;
        div {
          margin-right: 0.5rem;
          color: #333333;
          span {
            &:last-child {
              color: #999999;
            }
            font-size: 13px;
          }
        }
      }
    }
    .balance_info {
      display: flex;
      padding: 18px 0 10px;
      .account {
        display: flex;
        align-items: center;
        margin-right: 100px;
        .icon_color {
          width: 38px;
          height: 38px;
          line-height: 35px;
          background: #ffb470;
          color: #fff;
          border-radius: 20px;
          text-align: center;
          margin-right: 10px;
          i {
            font-size: 24px;
          }
        }
        .icon_colors {
          width: 38px;
          height: 38px;
          line-height: 38px;
          background: #3ea2ff;
          color: #fff;
          border-radius: 20px;
          text-align: center;
          margin-right: 10px;
          i {
            font-size: 20px;
          }
        }
        .info {
          div {
            &:first-child {
              font-size: 15px;
              color: #666;
            }
            &:last-child {
              font-size: 24px;
              color: #333;
            }
          }
        }
      }
    }
  }
  .balance_full {
    background: #ffffff;
    padding: 10px 30px 20px;
    .list_nav {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ededed;
      margin-bottom: 15px;
      height: 45px;
      .work {
        display: flex;
        flex: 1;
        height: 45px;
        line-height: 40px;
        div {
          padding: 0 5px;
          font-size: 14px;
          margin: 0 15px;
          color: #333333;
          cursor: pointer;
        }
        .active {
          color: #ff725d;
          border-bottom: 2px solid #ff644d;
          background: #fff;
        }
        span {
          color: #e8e8e8;
        }
      }
    }
    .balance_account {
      display: flex;
      margin-left: 20px;
      margin-bottom: 10px;
      div {
        color: #373737;
        margin-right: 30px;
        span {
          &:first-child {
            font-size: 13px;
          }
          &:last-child {
            font-size: 20px;
            color: #191919;
          }
        }
      }
    }
    .page {
      display: flex;
      align-items: center;
      margin: 20px 0 0;
      .u-pagination {
        text-align: right;
        flex: 1;
      }
    }
    .cell {
      span {
        font-size: 14px;
      }
      .circle {
        background: #52c41a;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
}
</style>
