const express = require("express");
const cors = require("cors");
const app = express();
const { Lose } = require("./db");
//文件操作
const multer = require("multer");
//不重复字符串
const { v4 } = require("uuid");
const axios = require("axios");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//允许跨域
app.use(cors());
//允许别人看你电脑文件
app.use(express.static(__dirname));

//openid获取

app.use(express.static('./homepage2'))
app.use(express.static('./homepage'))
app.use(express.static('./drive'))
app.use(express.static('./douguo'))
app.use(express.static('./demo'))
app.use(express.static('./demo2'))
app.use(express.static('./h5'))


app.get("/ceshi", async (req, res) => {
  try {
    let xxx = { a: 123 };
    res.send(xxx);
  } catch (error) {
    console.log(error);
    res.send(error);

  }
});

app.get("/login", async (req, res) => {
  const { code } = req.query;
  try {
    const {
      data: { openid },
    } = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=wx49f012dd3a5e9018&secret=12e5ea2bd5f732d2836af7ab0897de5d&js_code=${code}&grant_type=authorization_code`
    );
    console.log(openid);
    res.send(openid);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//获取首页别人发布的捡到了什么的信息

app.get("/getLose", async (req, res) => {
  const { type } = req.query;
  // type用来区分寻物还是寻主
  console.log(type);
  const result = await Lose.find({ type });
  res.send(result);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 想把文件存到哪（req,文件名字，callback）
    cb(null, "./file");
    // 文件存到当前目录file文件夹
  },
  filename: function xx(req, file, cb2) {
    let type = file.originalname.replace(/.+\./, ".");
    console.log(req.body.name);
    cb2(null, `${req.body.name}`);
  },
});

//上传图片，你捡到的东西
const upload = multer({ storage });
app.post("/uploadImg", upload.array("file", 6), (req, res) => {
  res.send(req.files);
});
//暴露端口
app.listen(3001, () => {
  console.log("服务开启了！");
});

//上传你捡到的物品的文字信息
app.post("/publish", async (req, res) => {
  try {
    const {
      type,
      classify1,
      classify2,
      name,
      date,
      region,
      phone,
      desc,
      imgList,
      time,
    } = req.body;
    console.log(type);
    await Lose.create({
      type,
      classify1,
      classify2,
      name,
      date,
      region,
      phone,
      desc,
      imgList,
      time,
    });
    res.send("发布成功:");
  } catch (error) {
    res.send("发布失败：" + error);
    console.log(error);
  }
});

//npm i nodemon -g 全局安装nodemon 可以使服务器更改代码保存后不用手动node index.js重启服务器，他会自动重启
