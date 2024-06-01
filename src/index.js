const express = require('express');
const {PORT} = require('./config/serverConfig');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/index');

const UserService = require('./services/user-service');
const db= require('./models/index');

const app = express()

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api', apiRoutes);
    app.listen(PORT, () => {
        console.log(`Server Satrted on Port : ${PORT}`);
        // if(process.env.DB_SYNC){
        //     db.sequelize.sync({alter : true})

        // }
        // const repo=new UserRepository();
        // const res=repo.getById(1);
        // console.log(res);

        // const service = new UserService();
        // const newToken = service.createToken({email : 'sanket@admin.com', id : 1});
        // console.log("new token is", newToken); 

    });
}

prepareAndStartServer();