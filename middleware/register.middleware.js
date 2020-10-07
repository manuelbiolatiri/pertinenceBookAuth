const registerMiddleware = {
    checkSignUp(req, res, next) {
        const { username, email, password } = req.body;

        if (username.length < 2) {
            return res.status(400).json({
                status: 'error',
                error: 'username length should be more than two characters'
            })
        }

        // check if email value has @(mail service).com
        if (!(/[\w]+@[a-zA-Z]+\.[a-zA-Z]{2}/.test(email))) {
            return res.status(400).json({
                status: 'error',
                error: 'invalid email format'
            })
        }
     

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                error: 'password length should be more than six characters'
            })
        }

        // if (department.length < 3) {
        //     return res.status(400).json({
        //         status: 'error',
        //         error: 'department input length should be more than three characters'
        //     })
        // }

        // if (address.length < 3) {
        //     return res.status(400).json({
        //         status: 'error',
        //         error: 'address input length should be more than three characters'
        //     })
        // }
        next();
    }
}

// export registerMiddleware to routes
module.exports = registerMiddleware;