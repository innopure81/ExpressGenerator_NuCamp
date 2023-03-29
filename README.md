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
 app.use('/campsites', campsiteRouter); <br />
