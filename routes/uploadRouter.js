const express =  require('express');
const authenticate = require('../authenticate');
const multer = require('multer'); //npm install multer@1.4.2

const storage  = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){ //' \.' matches a dot character., (jpg|jpeg|png|gif) is a capturing group that matches one of the strings jpg, jpeg, png, or gif., $ matches the end of the string.
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;

/*
** multer middleware: to accept designated file uploads on a REST api endpoint and save it to a specific folder
The "upload.single('imageFile')" is a middleware function provided by the multer library in an Express application. 
It is used to handle a single file upload from an HTML form with an input field of type "file" and name attribute set to "imageFile".
When a file is uploaded using this form, the upload.single('imageFile') middleware function processes the file and adds it to the req.file object. 
This allows you to access the uploaded file in subsequent middleware functions or route handlers.
*/

/*
Client-side Upload via HTML Form:
    //'req.body' is divided up into multiple parts separated by auto-defined boundary value.
    <form action="/imageUpload" method="post" enctype="multipart/form-data">
        Select a file:
        <input type="file" name="imageFile"><br><br>
        <input type="submit">
    </form>
*/

/* response of upload.single('imageFile'): (res.json(req.file);)
        {"fieldname":"imageFile",
        "originalname":"logo.png",
        "encoding":"7bit",
        "mimetype":"image/png",
        "destination":"public/images",
        "filename":"logo.png",
        "path":"public\\images\\logo.png",
        "size":5646}
*/