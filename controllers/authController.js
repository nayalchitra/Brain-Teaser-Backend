const express = require('express');
const userData = require('../db/users');
const jwt = require('jsonwebtoken');
const {v4:uuid} = require('uuid');

//middleware
const authVerify = (req,res,next)=>{

    const token = req.headers.authorization;
    try{
        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
        const userId = {userId:tokenDecode.id};
        return next();
    }catch(err){
        console.log("error from server");
    }
}

const signupHandler = (req,res)=>{
    const {username, password} = req.body;
    const alreadyExists = userData.data.some((user)=>user.username === username);
    if(alreadyExists){
        res.json({username, message:"user already exists"});
    }
    else{
        const id = uuid();
        const newUser ={id,username,password};
        userData.data = [...userData.data,newUser];
        const token = jwt.sign({id:username},process.env.SECRET_KEY);
        res.send({message:"successfully signed in"});
    }
}

const loginHandler = (req,res)=>{
    const {username, password} = req.body;
    const isDataValid = userData.data.some((user)=>user.username === username && user.password === password);
    if(isDataValid){
        let token = jwt.sign({username},process.env.SECRET_KEY);
        res.json({username, token,message:`user ${username} logged in successfully`})
    }
    else
        res.json({message:"invalid user"});
}

module.exports = {loginHandler,signupHandler,authVerify};