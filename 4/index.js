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
const OrganizationalStructures = db.OrganizationalStructure;

const axios = require('axios');

const optionCors = {
    origin: '*',
    methods: '*', 
    optionsSuccessStatus: 200,
    preflightContinue: false,
    
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
      resave: true,
      saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    res.renderWithLayout = (view, locals) => {
      res.render(view, { ...locals, layout: 'partial-layout/layout' });
    };
    
    next();
});

const authMiddleware = (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      next();
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// RESTFULL API
app.use('/api', main);



// FRONTEND
app.get('/', (req, res) => {
  res.redirect('/mywork');
})

app.get('/login', (req, res) => {
    res.renderWithLayout('login', {title: 'Login Page'});
})

app.get('/register', (req, res) => {
    res.renderWithLayout('register', { title: 'Register Page' });
})

app.get('/mywork', authMiddleware, async(req, res) => {
  let page = req.query.page || 1;
  try {
    const getHostname = req.headers.host;;
    const RestOptionsRequest = {
        method: 'GET',
        url: `http://${getHostname}/api/data?page=${page}`,
        headers: {
          'Content-Type': 'application/json'
        }
    } 
    const RestRequest = await axios(RestOptionsRequest);
    res.render('mywork', {title: 'My Work Page After Login', layout: 'partial-layout/layout-mywork', data: RestRequest.data});
  }
  catch (err) {
    res.redirect('/login');
  }
  
})

app.get('/mywork-detail', authMiddleware, async(req, res) => {
  try {
    const getHostname = req.headers.host;
    const RestOptionsRequest = {
        method: 'GET',
        url: `http://${getHostname}/api/data-detail?id=${page}`,
        headers: {
          'Content-Type': 'application/json'
        }
    } 
    const RestRequest = await axios(RestOptionsRequest);
    res.render('mywork-detail', {title: 'My Work Page After Login', layout: 'partial-layout/layout-mywork', data: RestRequest.data});
  }
  catch (err) {
    // res.send(err.message)
    res.redirect('/login');
  }
})

app.get('/create-new-structure', authMiddleware, async(req, res) => {
  try {
    res.render('create-new-structure', {title: 'My Work Page After Login', layout: 'partial-layout/layout-mywork'});
  }
  catch (err) {
    res.redirect('/login');
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


app.get('/create-new-structure-bulk-create', authMiddleware, async(req, res) => {

    try {
      const getHostname = req.headers.host;
      const dataRequest = [
          {
            "label":1,
            "parent":null
          },
          {
            "label":2,
            "parent":1
          },
          {
            "label":3,
            "parent":2
          },
          {
            "label":4,
            "parent":2
          },
          {
            "label":5,
            "parent":1
          },
          {
            "label":6,
            "parent":1
          },
          {
            "label":7,
            "parent":6
          },
          {
            "label":8,
            "parent":6
          },
          {
            "label":9,
            "parent":8
          }
        ];
  
    
          
      let APIData = { "arr1": dataRequest}
  
      const RestOptionsRequest = {
          method: 'POST',
          url: `http://${getHostname}/api/soal-3`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: APIData
      }
  
      const RestRequest = await axios(RestOptionsRequest);
  
      const dataResponse = RestRequest.data.responseValue['Input Array:'];
      let dataSimpan = [];
      await dataResponse.forEach(async(element) => {  
          dataSimpan.push({
            'label': element.label,
            'parent': element.parent
         })
      });
  
      const simpan = await OrganizationalStructures.bulkCreate(dataSimpan)
      console.log(simpan);

      res.redirect('/mywork');
  
      // res.render('create-new-structure', {title: 'My Work Page After Login', layout: 'partial-layout/layout-mywork', dateResponse: dataResponse});
  
    }
  
    catch(error) {
      res.send(error.message);
    }
  
    
})

// FORM PROCESS
app.post('/create-new-structure-process', async(req,res) => {
  try {
    const OrganizationalStructuresInput = {
      label: req.body.label,
      parent: req.body.parent
    }
    let dataInput = await OrganizationalStructures.create(OrganizationalStructuresInput);
    console.log(dataInput);
    res.redirect('/create-new-structure?status=success');
  }
  catch {
    setTimeout(() => {
        res.redirect('/create-new-structure?status=failed');
    }, 5000)
  }
  

  
})

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

app.post('/login-process', async(req, res) => {
    try {
      let user_check = {
        username: req.body.username,
      }
      const user = await UserModel.findOne({where: user_check });
      if (user && await bcrypt.compare(req.body.password, user.password) === true ) {
        req.session.isLoggedIn = true;
        res.redirect('/mywork');
      } else {
        res.send('errorDB')
        // res.redirect('/login');

      }
    } catch (error) {
        res.send(error.message)
        // res.redirect('/login');
    }
});


app.listen(PORT, () => {
    console.log(`Localhost Port ${PORT}`)
})