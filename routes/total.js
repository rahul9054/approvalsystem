const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const application = require('../models/application');
const User = require('../models/User');
const bodyParser=require('body-parser');
const path=require('path');
const crypto=require('crypto');
const mongoose=require('mongoose');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');

//Middleware
router.use(bodyParser.json());
router.use(methodOverride('_method'));

//Mongo URI

const mongoURI=require('../config/keys').mongoURI;

//create mongo connection
const promise=mongoose.connect((mongoURI),{ useNewUrlParser: true,useUnifiedTopology: true });
const conn = mongoose.connection;
//Init gfs
let gfs;
//Initalize the stream
conn.once('open', ()=> {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads')
  })
//Create storage engine
 
const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
      
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        //  const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
            
          filename: 'file' + Date.now()+ path.extname(file.originalname),
          bucketName: 'uploads',
          metadata: {
            descrption: req.body.Description
          }
          
        }
        
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
  var files = req.user;
    //gfs.files.find().toArray((err,files)=>{
        // if(!files||files.length===0){
        //      res.render('./pages/dashboard',{ user: req.user,files:false});

        // }
        // else{

                /*if(file.contentType==='image/jpeg'|| file.contentType==='image/png' ){
                    file.isImage=true;
                }else{
                    file.isImage=false;
                }*/

             //  res.send("hi");
                res.render('./pages/dashboard',{ user: req.user,files: files});
        })
    // })

// });

router.post('/dashboard',upload.single('myfile'),(req, res) => {
  if(req.file==undefined){
    req.flash('error_msg', 'Application must be attached');
    res.redirect('./dashboard');
  }
  else{
    if(req.body.email==""){
    req.flash('error_msg', 'Recipient need to be entered..');
    res.redirect('./dashboard');
  }else{
  const form=new application();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;
  form.Date_created=today;
  form.filename=req.file.filename;
  form.Created_By=req.user.email;
  form.Pending_from=req.body.email;
  
  form.descrption=req.body.Description;
  form.save((err,docs)=>{
      if(!err){
          User.findOne({email :req.user.email})
          .then(sender=>{
              
              if(sender ==null|| sender==undefined){
                req.flash('error_msg', 'Recipient need to Registered first..');
                res.redirect('./dashboard');
               }
              else{
                   if(!err){
                      var added=sender.created_total.addToSet(req.file.filename)
                      
                     
                     // res.send(docs);
                      
                      User.findOne({email :req.body.email},function (err, receiver){
                          if(!err){
                                  if(receiver ==null|| receiver==undefined){
                                    req.flash('error_msg', 'Recipient need to Registered first..');
                                    res.redirect('./dashboard');
                                  }
                              else{
                                  var added=receiver.response_total.addToSet(req.file.filename)
                                  receiver.save();
                                  sender.save();
                                  //console.log("updated"+docs);
                                  req.flash('success_msg', 'Your Application has been sent');
                                  res.redirect('./dashboard');
                                }
                          }
                          else{
                            req.flash('error_msg', 'An error Occured while Uploading');
                                  res.redirect('./dashboard');
                             
                          }
                      });
                      
                  }
                  else{
                    req.flash('error_msg', 'An error Occured while Uploading');
                    res.redirect('./dashboard');
                  }
              }
          })
          .catch(err=>{
            req.flash('error_msg', 'An error Occured');
            res.redirect('./dashboard');
          });
      }
      else{
        req.flash('error_msg', 'Unable to createApplication..Please try Again');
        res.redirect('./dashboard');
      }
  })
}
}
});  


//shows all files
router.get('/files',(req,res)=>{
  gfs.files.find().toArray((err,files)=>{
      if(!files||files.length==0){
          return res.status(404).json({
              err: 'No files exits'
          });

      }
      //Files exits
      return res.json(files);
  })
})
//shows one files with /files/:id 

router.get('/files/:filename',(req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file)=>{
     
          if(!file||file.length===0){
              return res.status(404).json({
                  err: 'No files exits'
              });
  
          }
          //Files exits
          return res.json(file);

  }) 
});
//show the  files in view form
//Display image
router.get('/image/:filename',(req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file)=>{
     
          if(!file||file.length===0){
              return res.status(404).json({
                  err: 'No files exits'
              });
  
          }
         //check the format of file
        // if(file.contentType==='image/jpeg'|| file.contentType==='img/png'){
             //Read output stream
             const readstream=gfs.createReadStream(file.filename);
             readstream.pipe(res);
      /*   }
      else{
          res.status(404).json({
              err:"Not an image"
          })
      }*/
  }) 
});

 module.exports = router;