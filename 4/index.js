const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const main = require('./routes/main');
const bodyParser = require('body-parser');
const db = require("./models/index");
const UserModel = db.User;
const { Op } = require('sequelize');

const optionCors = {
    origin: '*',
    methods: '*', 
    optionsSuccessStatus: 200,
    preflightContinue: false,
    // allowedHeaders: ['Content-Type'], 
    // credentials: true, 
}

const PORT = '3000'

app.use(cors(optionCors));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'public'));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'sec123t-se5535i0n',
      resave: false,
      saveUninitialized: true,
    })
);

app.use('/api', main);

app.use((req, res, next) => {
    res.renderWithLayout = (view, locals) => {
      res.render(view, { ...locals, layout: 'partial-layout/layout' });
    };
    
    next();
});

app.get('/', (req, res) => {
    res.redirect('/mywork');
})

app.get('/login', (req, res) => {
    res.renderWithLayout('login', {title: 'Login Page'});
})

app.get('/register', (req, res) => {
    res.renderWithLayout('register', { title: 'Register Page' });
})

app.get('/mywork', (req, res) => {
    
    res.render('mywork', {title: 'My Work Page After Login', layout: 'partial-layout/layout-mywork'});
    return;

    if (req.session.isLoggedIn) {
        res.render('mywork', {layout: 'partial-layout/layout-mywork'});
      } else {
        res.redirect('./login');
      }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error clearing session:', err);
      } else {
        res.redirect('/');
      }
    });
  });

app.post('/register-process', async (req, res) => {
    try {
        let first_name = req.body.firstname || req.body.username;
        let last_name = req.body.lastname || req.body.username;
        let email = req.body.email || req.body.username;
        let username = req.body.username;
        let password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        let userData = {
            firstname: first_name,
            lastname: last_name,
            email: email,
            username: username,
            password: await hashedPassword
        }
        let userInput = await UserModel.create(userData);
        console.log(userInput);
        
        res.redirect('/login');
    } catch (error) {
        
        setTimeout(() => {
            res.redirect('/register');
        }, 5000)
        
    }
});

app.post('/login-process', async (req, res) => {
    try {
      let user_check = {
        username: req.body.username,
      }

      const user = await UserModel.findOne({where: user_check });
      if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.isLoggedIn = true;
        res.redirect('/mywork');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
        // res.send(error.message)
        res.redirect('/login');
    }
});


app.listen(PORT, () => {
    console.log(`Localhost Port ${PORT}`)
})