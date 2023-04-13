# ExpressGenerator_NuCamp

### `How to interact w/ MongoDB thru queries via mongoose schema model` <br />
https://mongoosejs.com/docs/queries.html<br /><br />

0. Use the Express generator to scaffold out an Express application. <br />
Install express-generator globally <br />
**npm install -g express-generator@4.16.1** <br />
**express nucampsiteServer** <br /> <br />
Or, use this command instead <br />
**npx express-generator@4.16.1 nucampsiteServer** <br /> <br />
 To serve the static HTML files in the public folder: <br />
**app.use(express.static(path.join(__dirname, 'public')));** <br /> <br />
 To serve various REST API endpoints to communicate w/ server database: <br />
 const campsiteRouter = require('./routes/campsiteRouter'); <br />
 **app.use('/campsites', campsiteRouter);** <br /><br /><br />

1. To set up a REST API server w/ Express generator inside **app.js**: <br /><br />
var app = express(); <br /> 
app.use('/campsites', **campsiteRouter**); <br /><br />

2. To set up a connection between Express server and MongoDB database wrapped w/ mongoose schema inside **app.js**: <br /><br />
const mongoose = require('mongoose'); <br />
**const url = 'mongodb://localhost:27017/nucampsite';** <br />
const **connect** = **mongoose.connect(url,** {  <br />
  useCreateIndex: true,  <br />
  useFindAndModify: false,  <br />
  useNewUrlParser: true,  <br />
  useUnifiedTopology: true  <br />
});  <br />

3. To create Campsite model with mongoose schema including currency Type inside **models/campsite.js**: <br /> <br />
**npm install mongoose@5.10.9 mongoose-currency@0.2.0 --legacy-peer-deps** <br />
const mongoose = require('mongoose'); <br />
**const Schema = mongoose.Schema;**<br />
require('mongoose-currency').loadType(mongoose); <br />
const Currency = mongoose.Types.Currency; <br /><br />
  **To add a subDocument to a document: <br /><br />
  const **commentSchema** = new **Schema**({ ... }); <br />
  const **campsiteSchema** = new **Schema**({ ... **comments: [commentSchema]** }, {timestamps: true});  <br /><br />
  module.exports =  **Campsite**; <br /> <br />

4. To use the Campsite schema model in **routes/campsiteRouter.js** installed in app.js: <br /> <br />
1> To integrate mongoose schema "Campsite" model into Express REST API drivers: <br /><br />
const express = require('express');<br />
const **campsiteRouter** = **express.Router()**;<br />
const **Campsite** = require('**../models/campsite**'); <br /> <br />
2> To use the client request from route.params.campsiteId property: <br /><br />
 **campsiteRouter.route('/:campsiteId')**<br />
  .delete((req, res, next)=>{ <br />
      **Campsite**.findByIdAndDelete(req.params.campsiteId) <br />
      .then(respons=>{ <br />
          res.statusCode = 200; <br />
          res.setHeader('Content-Type', 'application/json'); <br />
          res.json(resonse); <br />
      }) <br />
      .catch(err=>next(err)); <br />
  }); <br /> <br />
  module.exports = **campsiteRouter**; <br /><br />
  
  5. To manipulate comments on campsites/:campsiteId/comments: <br /><br />
  campsiteRouter.route('/:campsiteId/comments')  <br />
  .delete((req, res, next)=>{ <br />
    **Campsite.findById(req.params.campsiteId)** <br />
    .then(campsite=>{ <br />
        `if(campsite)`{ <br />
            `for (let i=(campsite.comments.length-1); i>=0; i--){` <br />
                `campsite.comments.id(campsite.comments[i]._id).remove();` <br />
            `}` <br />
            `campsite.save()` <br />
            .then(**campsite**=>{ <br />
                res.statusCode = 200; <br />
                res.setHeader('Content-Type', 'application/json'); <br />
                res.json(**campsite**); <br />
            }) <br />
            .catch(err=>next(err)); <br />
        }else{ <br />
            err = new Error(`'Campsite ${req.params.campsiteId} not found'`); <br />
            err.status = 404; <br />
            return next(err); <br />
        } <br />
    }) <br />
    .catch(err=>next(err)); <br />
}); <br /> <br />
6. How to communictate w/ db via mongo REPL: <br /> <br />
mongo <br /> <br /> 
use nucampsite <br /> <br />
db.users.find().pretty(); <br /> <br />
db.users.drop(); <br /> <br />
db.users.update({"username":"admin"}, {$set:{"admin":true}}); <br /> <br />

7. `Passport-Local-Mongoose plug-in's 'local' authenticaton strategy & lightweight JSON Web Tokens (JWTs) :`<br /> <br />
npm install passport@0.4.1 passport-local@1.0.0 passport-local-mongoose@6.0.1<br /> <br />
npm install passport-jwt@4.0.0 jsonwebtoken@8.5.1 <br /> <br />

8. Configure secure HTTPS server into Express server: <br /> <br />
openssl version => OpenSSL 1.1.1q  5 Jul 2022 <br />
cd bin <br />
ls <br />
www* <br />
`openssl req -nodes -new -x509 -keyout server.key -out server.cert` (Common name: localhost, email) <br />
ls <br />
server.cert  server.key  www* <br />
Add `bin/server.key`(private key) and `bin/server.cert`(public key) to .gitignore file <br /><br />
**The command `openssl req -nodes -new -x509 -keyout server.key -out server.cert` is used to create a self-signed certificate in `server.cert` including a password-less RSA private key in `server.key`. The `-nodes` option is short for “no DES” and it means that the private key will not be encrypted with a passphrase <br /> <br />

9. Take steps to conceal your App Secret: <br />
- add config.js to your .gitignore file before you add and commit updates <br />
- remove config.js from your existing git repository with this command:  <br />
`git rm --cached config.js` <br />
