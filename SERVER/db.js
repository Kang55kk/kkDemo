const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose
  .connect("mongodb://localhost:27017/loseMg")
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch(() => {
    console.log("数据库连接失败");
  });

//丢失物品表-建表
const LoseSchema = new mongoose.Schema({
  type: {
    type: Number,
  },
  classify1: {
    type: String,
  },
  classify2: {
    type: String,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  region: {
    type: String,
  },
  phone: {
    type: String,
  },
  desc: {
    type: String,
  },
  imgList: {
    type: Array,
  },
  time: {
    type: Number,
  },
});

const Lose = mongoose.model("Lose", LoseSchema);


//导出 数据库表 实例
module.exports = {
  Lose,
};
