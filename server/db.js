const mongoose=require('mongoose');

async function connectdb()
{
try{
const db = await mongoose.connect(process.env.MONGOURL);
    console.log(`db connnected ${db.connection.host}`);

}catch(error)
{
    console.log(error);
}
}

module.exports = connectdb;