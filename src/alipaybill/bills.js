const fs = require("fs");
const readline = require("readline");
const iconv = require("iconv-lite");

const ID_INCOME = 1;
const ID_EXPENDITURE = -1;

const parseBillData = (line = "") => {
  // 交易号                  ,
  // 商家订单号,
  // 交易创建时间,
  // 付款时间,
  // 最近修改时间,
  // 交易来源地,
  // 类型,
  // 交易对方,
  // 商品名称,
  // 金额（元）   ,
  // 收 / 支,
  // 交易状态,
  // 服务费（元）   ,
  // 成功退款（元）  ,
  // 备注, 资金状态
  const splits = line.split(",");

  if (splits.length < 14) {
    return null;
  }

  const business = splits[7].trim();
  const productName = splits[8].trim();
  const amount = Number(splits[9]);
  // 收入或支出
  const incomeExpenditure = splits[10].trim();
  const serviceCharge = Number(splits[12]);
  const refund = Number(splits[13]);
  return {
    business,
    productName,
    amount,
    incomeExpenditure:
      incomeExpenditure === "支出" ? ID_EXPENDITURE : ID_INCOME,
    serviceCharge,
    refund,
  };
};

const chargeBillFilter = (billData) => {
  if (!billData) return false;
  const { business, productName } = billData;
  if (business.indexOf("充电") >= 0 || productName.indexOf("充电") >= 0) {
    return true;
  }
  return false;
};

const main = () => {
  let index = 0;
  const billList = [];

  const stream = fs
    .createReadStream("./alipay_record_20240430_0901.txt")
    .pipe(iconv.decodeStream("gbk"));

  const rl = readline.createInterface({
    input: stream,
    console: false,
  });

  rl.on("line", (line) => {
    if (index > 5) {
      const billData = parseBillData(line);
      if (billData) {
        billList.push(billData);
      }
    }
    index += 1;
  });

  rl.on("close", () => {
    const chargeBillList = billList.filter(chargeBillFilter);

    const total = chargeBillList.reduce((accumulator, curr, index, arr) => {
      const currAmount = curr.amount * curr.incomeExpenditure;
      return accumulator + currAmount;
    }, 0);

    console.log("total: ", total);
  });
};

main();
