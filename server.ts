import express from 'express'
import database from './models'
import passport, { use } from 'passport'
import cors from 'cors'

import MONGO_URI from './config/db.config'

import authRoute from './routes/auth.routes'
import userRoute from './routes/user.routes'


const PORT = process.env.PORT || 8080
const corsOptions = {
  origin: 'http://localhost: 8001'
}

const { mongoose, Role } = database

const app = express()

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
})

// use middleWare

app.use(cors(corsOptions))

// 解析请求的 content-type - application/json
app.use(express.json())

// 解析请求 content-type 的 application/x-www-form-urlencoded 表单body
app.use(express.urlencoded({ extended: true }));

authRoute(app)
userRoute(app)

app.get('/', (req, res) => {
  res.send('Hello world');
})

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongodb connected');
    initDatabase()
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  })

// 初始化数据库3个角色
function initDatabase(): void {
  Role.estimatedDocumentCount((err, count) => {
    if (err) {
      throw new Error(err)
    } 

    if (!count) {
      Role.insertMany([{ name: 'user' }, { name: 'admin' }, { name: 'moderator' }])
        .then(() => {
          console.log('Initiated roles');
        })
        .catch(console.log)
    }
  })
}

