const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../models/database');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'emmanuelbiolatiri49@gmail.com',
        pass:'biolatiriel123'
    }
});


const register = {
    async signUP(req, res) {
        // body values
        const { phone, email, password} = req.body;
        console.log(req.body);
        try {
            // empty body values
            if(email === '' || password === '' || phone === '') {
                return res.status(400).json({
                    status: 'error',
                    error: 'all fields are required'
                });
            };
console.log(req.body);

const verify = Math.floor((Math.random() * 10000000) + 1);

const mailOption = {
    from :'emmanuelbiolatiri49@gmail.com', // sender this is your email here
    to : email, // receiver email2
    subject: "Account Verification",
    html: `<h3>Hello,  kindly Copy your verification code and paste it on the verification page.<h3><br><hr>
    <h3>${verify}</h3>`
}


            // generate bcrypt salt
            const salt = await bcrypt.genSalt(10);
            // hash password
            const hashedPassword = await bcrypt.hash(password, salt);

            // check if user exist (email check)
            const checkQuery = `SELECT * FROM users WHERE phone=$1 OR email=$2`;
            const value = [phone, email];
            const check = await pool.query(checkQuery, value);

            // check if user exist response
            if (check.rows[0]) {
                return res.status(400).json({
                    status: 'error',
                    error: 'user already exist'
                });
            }
            else {
                // users sign up
                const signUpQuery = `INSERT INTO users (phone, email, password,verification, joined)
                VALUES($1, $2, $3, $4, now()) RETURNING *`
                const userValue = [phone, email, hashedPassword, verify];
                const signUpQuerys = await pool.query(signUpQuery, userValue);

                // generate user token
                jwt.sign({ phone, password }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                    // token response
                    res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'user account successfully created',
                            token,
                            userID: signUpQuerys.rows[0].id
                        }
                    })
                
                     const mailerGo =  transporter.sendMail(mailOption,(error,result)=>{
                                if(error){
                                    console.log(error)
                                    res.status(400).json({
                                        status: 'error',
                                        message: 'Unable to send mail at this time, try again later',
                                        error
                                        
                                    });
                                }else{
                                    console.log(result);
                                        // token response
                                        res.status(201).json({
                                            status: 'success',
                                            data: {
                                                message: 'user account successfully created',
                                                // userId: signUpQuerys.rows[0].id
                                            }
                                        })
                                }
                            })
                            console.log(mailerGo());
                            
                    
                    });
        }
    }
        catch (e) {
            console.log(e);
        };
    },
   
    async logIn(req, res) {
        // body values
        const { email, password } = req.body;
        // const { id } = req.params;

        try {
            // empty body values
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    error: 'all fields are required'
                });
            };

            // phone check (if user with email exist) 
            const logIn = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const logInQuery = await pool.query(logIn, value);

            // phone check response
            if (!logInQuery.rows[0]) {
                return res.status(400).json({
                    status: 'error',
                    error: 'email does not exist, please sign up'
                });
            }

            // compare password
            bcrypt.compare(password, logInQuery.rows[0].password, (err, result) => {
                
                if (email === logInQuery.rows[0].email && result === true) {
                    jwt.sign({id:logInQuery.rows[0].id ,
                                email: logInQuery.rows[0].email, }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                        res.status(201).json({
                            status: 'success',
                            message: 'User successfully logged in',
                            data: {
                                token,
                                id: logInQuery.rows[0].id,
                                phone: logInQuery.rows[0].phone,
                            }
                        })
                    })
                }
                // incorrect email and password
                else {
                    res.status(403).json({
                        status: 'error',
                        error: 'Account not verified'
                    });
                }
            });
        }
        catch (e) {
            console.log(e)
        };
    },
    async book(req, res) {
        try {
        // body values
        const { email, userId, bookname} = req.body;
console.log(req.body);

const code = Math.random().toString(36).substr(2, 10);

const mailOption = {
    from :'emmanuelbiolatiri49@gmail.com', // sender this is your email here
    to : email, // receiver email
    subject: "Book Created",
    html: `<h3>Hello, you have just created a book with these pins.<h3><br><hr>`
}

        const bookQuery = `INSERT INTO books (userId, bookname, pins, created)
        VALUES($1, $2, $3, now()) RETURNING *`
        const userValue = [userId, bookname, code];
        const bookQuerys = await pool.query(bookQuery, userValue);

        if (bookQuerys.rows[0].bookname === bookname) {
            const mailerGo =  transporter.sendMail(mailOption,(error,result)=>{
                if(error){
                        res.status(400).json({
                            status: 'error',
                            message: 'Unable to send mail at this time, try again later'
                            
                        });
                }else{
                    console.log(result);
                        // token response
                        res.status(201).json({
                            status: 'success',
                            message: 'Great!, book successfully created',
                            bookID: signUpQuerys.rows[0].id
                            
                        })
                }
            })
        } else {
            res.status(403).json({
                status: 'error',
                message: 'An error occured, please try again'
                
            });
        }

        
    }
        catch (e) {
            console.log(e);
        };
    },

    // token verification
    verifyToken(req, res, next) {
        // header key and value
        const headers = req.headers['authorization'];

        if (typeof headers !== 'undefined') {
            const beareHeader = headers.split(' ');
            const token = beareHeader[1];

            req.token = token
            next();
        }
        else {
            // incorrect header and value
            res.status(403).json({
                status: 'error',
                error: 'forbidden'
            });
        };
    }
};

// export register routes
module.exports = register;