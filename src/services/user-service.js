const UserRepository = require('../repository/user-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_KEY} = require('../config/serverConfig');
const { response } = require('express');
const AppErrors = require('../utils/error-handler');


class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Service error", error.name);  
            if(error.name== 'SequelizeValidationError'){
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw new AppErrors('ServerError', 'Something went wrong in Service','logical issue found', 500
            )
        }
    }

    async signin(email,plainPassword){

        try {
            const user = await this.userRepository.getByEmail(email);
            const passwordMatch=this.checkPassword(plainPassword,user.password);
            if(!passwordMatch){
                console.log("Password doesn't match");
                throw {error : 'Incorrect Password'};
            }
            const newJwt = this.createToken({email : user.email, id: user.id});
            return newJwt;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
            
        }
    }
     createToken(user){
        try {
            const result = jwt.sign(user,JWT_KEY, {expiresIn : '1d' });
            return result;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
            
        }
    }

     verifyToken(token){
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
            
        } catch (error) {
            console.log("Something went wrong in verification of token");
            throw error;
            
        }
     }

     checkPassword(userInputPlainPassword,encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;
            
        }
     }

    async isAuthenticated(token){
      try {
        
        const isVerified = userService.verifyToken(token);
        if(!isVerified){
            throw {error : 'Invalid token'}
        }
        const user= this.userRepository.getById(response.id);
        if(!user){
            throw {error : 'No user with corresponding token exists'};
        }
        return user.id; 
    } catch (error) {  
        console.log("Something went wrong in token authentication process");
        throw error;
    }
}

isAdmin(userId){
    try {
        return this.userRepository.isAdmin(userId);
    } catch (error) {
        console.log("Something went wrong in service layer");
        throw error; 
    }

}
}

module.exports = UserService;