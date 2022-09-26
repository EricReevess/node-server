const DB_USERNAME = 'nodeServer'
const DB_PASSWORD = 'nodeServerPwd'
const DB_HOST = 'localhost'
const DB_PORT = '27017'
const DB_NAME = 'nodeServer'

const MONGO_URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export default MONGO_URI