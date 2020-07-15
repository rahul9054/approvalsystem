const express = require('express');
const router = express.Router();
const application = require('../models/application');
const User = require('../models/User');
const bodyParser=require('body-parser');
const path=require('path');
const mongoose=require('mongoose');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/',(req,res)=>{
    const form=req.body.filename;
    application.findOne({filename :form},(err, app)=>{
        if(!err){

            if(app ==null|| app==undefined){
                req.flash('error_msg', 'Application Not found');
                res.redirect('./dashboard');
            }
            else{
                // console.log(app);
                //console.log("app ="+ JSON.stringify(app));
                res.send(app);
            }
        }
        else{
            req.flash('error_msg', 'An error Occured');
            res.redirect('./dashboard');
        }
    })

})

router.post('/send',(req,res)=>{
    console.log("send");
    const form=req.body.filename;
    const email=req.body.email;
    
    if(email==""|| email==undefined||req.body.email==req.user.email){ 
        res.send(null);
    }
    else{
    
    application.findOne({filename: form},(err,app)=>{
        if(!err){
            if(app ==null|| app==undefined){
                
                res.send(null);
            }
            else{
               // const upadate={Pending_from: app.Pending_from.pull(email) }
                app.Pending_from.addToSet(email);
                //app.Pending_from.pull(email);
               // console.log(app)
                app.Rejected_from.pull(email);
                app.save();
                                            
                res.send(app);
                
            }
        }
    })
}
})

router.post('/approve',(req,res)=>{
    
    const form=req.body.filename;
    const email=req.user.email;
    application.findOne({filename: form},(err,app)=>{
        if(!err){
            if(app ==null|| app==undefined){
                req.flash('error_msg', 'Application Not found');
                res.redirect('./dashboard');
                
            }
            else{
                
               // const upadate={Pending_from: app.Pending_from.pull(email) }
               app.Pending_from.pull(email);
               app.Approved_from.pull(email);
                app.Rejected_from.pull(email);
                app.Approved_from.addToSet(email);
                //app.Pending_from.pull(email);
               // console.log(app)
               // app.Rejected_from.pull(email);
                app.save();
                                  
                res.send(app);
                
            }
        }
    })
})
router.post('/reject',(req,res)=>{

    const form=req.body.filename;
    const email=req.user.email;
    application.findOne({filename: form},(err,app)=>{
        if(!err){
            if(app ==null|| app==undefined){
                req.flash('error_msg', 'Application Not found');
                res.redirect('./dashboard');
                
            }
            else{
                
               // const upadate={Pending_from: app.Pending_from.pull(email) }
               app.Pending_from.pull(email);
               app.Approved_from.pull(email);
                app.Rejected_from.pull(email);
                app.Rejected_from.addToSet(email);
                //app.Pending_from.pull(email);
               // console.log(app)
               // app.Rejected_from.pull(email);
                app.save();
                                  
                res.send(app);
                
            }
        }
    })
})

module.exports = router;