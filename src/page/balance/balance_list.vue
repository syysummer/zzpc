<template>
  <div class="balance_container">
    <div class="list_nav">
      <div class="work">
        <div :class="{active: isFull==1}" @click="changeList(1)">兼职(350)</div>
        <span class="border_line">|</span>
        <div :class="{active: isFull==2}" @click="changeList(2)">全职(120)</div>
      </div>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="充值时间">
        <el-date-picker v-model="formInline.value" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetimerange" align="center" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:00']"></el-date-picker>
      </el-form-item>
      <el-form-item label="配送员">
        <el-input v-model="formInline.customer" size="small" :placeholder="$t('reschedule.please_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('reschedule.phone_number')">
        <el-input v-model="formInline.phone" size="small" :placeholder="$t('reschedule.please_mobile_number')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSubmit">{{$t('reschedule.search')}}</el-button>
        <el-button  @click="reset">{{$t('reschedule.reset')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="balanceData" stripe style="width: 100%" v-if="isFull==1" :key="isFull">
      <el-table-column prop="deliveryName" :label="$t('cash_order_statistics.delivery')" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deliveryTel" :label="$t('rider_manage.phone')" min-width="125"></el-table-column>
      <el-table-column prop="balanceCount" label="账户余额" min-width="175" sortable='custom'></el-table-column>
      <el-table-column prop="unsettledNum" label="信用余额" min-width="165" sortable='custom'></el-table-column>
      <el-table-column prop="settleMoney" label="最近充值" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="充值账户" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="充值余额" min-width="155" sortable='custom'></el-table-column>
      <el-table-column prop="settleNum" label="最近支出" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="支出账户" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="支出余额" min-width="155" sortable='custom'></el-table-column>
      <el-table-column :label="$t('distributor.todo')" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="balanceAllData" stripe style="width: 100%" v-if="isFull==2" :key="isFull">
      <el-table-column prop="deliveryName" :label="$t('cash_order_statistics.delivery')" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deliveryTel" :label="$t('rider_manage.phone')" min-width="125"></el-table-column>
      <el-table-column prop="balanceCount" label="账户余额" min-width="175" sortable='custom'></el-table-column>
      <el-table-column prop="unsettledNum" label="最近收入" min-width="165"></el-table-column>
      <el-table-column prop="settleMoney" label="收入余额" min-width="155" sortable='custom'></el-table-column>
      <el-table-column prop="settleNum" label="最近支出" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="支出账户" min-width="155"></el-table-column>
      <el-table-column prop="settleNum" label="支出余额" min-width="155" sortable='custom'></el-table-column>
      <el-table-column :label="$t('distributor.todo')" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClicks(scope.row)" type="text" size="small">查看</el-button>
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
</template>
<script>
import { mapState, mapMutations } from "vuex";
import store from "../../store";
import compensationVue from '../business/compensation.vue';
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
          balanceCount: "2"
        },
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2"
        }
      ],
      balanceAllData: [
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2"
        },
        {
          deliveryName: "风科技股份的",
          deliveryTel: "134145285875",
          balanceCount: "2"
        }
      ],
      isFull: 1,
      formInline: {
        value: "",
        customer: "",
        phone: ""
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != "/balance_part") {
      store.state.page = "";
    }
    if (from.path != "/balance_full") {
      store.state.disPage = "";
    }
    next();
  },
  computed: {
    ...mapState(["page", "disPage"])
  },
  mounted() {
    let balanceType = this.$route.query.balanceType;
    console.log(balanceType, "balanceType")
    if (balanceType) {
      if (balanceType == 1) {
        this.isFull = 1;
        this.currentPage = this.page ? this.page : 1;
      } else {
        this.isFull = 2;
        this.currentPage = this.disPage ? this.disPage : 1;
      }
    } else {
      this.isFull = 1;
    }
  },
  methods: {
    ...mapMutations(["updatePage", "updatePages"]),
    handleClick(row) {
      console.log(row);
      this.updatePage(this.currentPage);
      this.$router.push("/balance_part");
    },
    handleClicks(row) {
      console.log(row);
      this.updatePages(this.currentPage);
      this.$router.push("/balance_full");
    },
    changeList(num) {
      this.currentPage = 1;
      this.isFull = num;
    },
    onSubmit() {
      this.currentPage = 1
    },
    reset() {
      this.formInline.value = ""
      this.formInline.customer = ""
      this.formInline.phone = ""
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
};
</script>
<style scoped lang="scss">
.el-main {
  background: #ffffff;
}
.balance_container {
  background: #ffffff;
  padding: 10px 30px 20px;
  .list_nav {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    margin-bottom: 20px;
    height: 45px;
    .work {
      display: flex;
      flex: 1;
      height: 45px;
      line-height: 40px;
      div {
        padding: 0 5px;
        font-size: 16px;
        margin: 0 15px;
        color: #333333;
        cursor: pointer;
      }
      .active {
        color: #ff725d;
        border-bottom: 2px solid #ff644d;
        background: #ffffff;
      }
      span {
        color: #e8e8e8;
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
}
</style>
