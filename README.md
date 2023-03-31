# ExpressGenerator_NuCamp
Use the Express generator to scaffold out an Express application. <br />
Install express-generator globally <br />
npm install -g express-generator@4.16.1 <br />
express nucampsiteServer <br /> <br />
Or, use this command instead <br />
npx express-generator@4.16.1 nucampsiteServer <br /> <br />
 to serve the static HTML files in the public folder <br />
app.use(express.static(path.join(__dirname, 'public'))); <br /> <br />
 to serve various endpoints <br />
 const campsiteRouter = require('./routes/campsiteRouter'); <br />
 app.use('/campsites', campsiteRouter); <br /><br /><br />

1. To set REST API server w/ Express generator <br /><br />
var app = express(); <br /> 
app.use('/campsites', campsiteRouter); <br /><br />

2. To set up a connection between Express server and MongoDB database wrapped w/ mongoose schema <br /><br />
const mongoose = require('mongoose'); <br />
const url = 'mongodb://localhost:27017/nucampsite'; <br />
const connect = mongoose.connect(url, {  <br />
  useCreateIndex: true,  <br />
  useFindAndModify: false,  <br />
  useNewUrlParser: true,  <br />
  useUnifiedTopology: true  <br />
});  <br />

3. To create Campsite model with mongoose schema including currency Type: <br /> <br />
npm install mongoose@5.10.9 mongoose-currency@0.2.0 --legacy-peer-deps <br />
const mongoose = require('mongoose'); <br />
const Schema = mongoose.Schema; <br />
require('mongoose-currency').loadType(mongoose); <br />
const Currency = mongoose.Types.Currency; <br /><br />

  **To add a subDocument to a document: <br /><br />
  const commentSchema = new Schema({ ... }); <br />
  const campsiteSchema = new Schema({ ... comments: [commentSchema] <br />
  }, {   <br />
      timestamps: true <br />
  });  <br />
  module.exports =  Campsite; <br /> <br />

4. To use the Campsite schema model in campsiteRouter installed in app.js: <br /> <br />
*To integrate mongoose schema "Campsite" model into express REST API drivers <br />
const Campsite = require('../models/campsite'); <br /> <br />

  *To use the client request from route.params.campsiteId property: <br /><br />
  campsiteRouter.route('/:campsiteId') <br />
  .delete((req, res, next)=>{ <br />
      Campsite.findByIdAndDelete(req.params.campsiteId) <br />
      .then(respons=>{ <br />
          res.statusCode = 200; <br />
          res.setHeader('Content-Type', 'application/json'); <br />
          res.json(resonse); <br />
      }) <br />
      .catch(err=>next(err)); <br />
  }); <br /> <br />
  
  module.exports = campsiteRouter; <br />
