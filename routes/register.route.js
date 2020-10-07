const { Router } = require('express');
const signLogin = require('../controllers/register');
// import user middleware
const registerMiddleware = require('../middleware/register.middleware');

// configure route
const userRouter = Router();


userRouter.post('/auth/create-user' ,signLogin.signUP);
userRouter.post('/auth/signin', signLogin.logIn);
userRouter.post('/create_book', signLogin.book);

// export user route to server.js
module.exports = userRouter