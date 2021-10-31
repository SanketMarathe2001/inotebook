const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = "Sanketisagoodb$oy";

//route 1 :create user
router.post('/createuser',[
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).json({error: "Sorry a user with this email already exists."});
    }
    const salt  = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    user = await User.create({
        name: req.body.name,
        email : req.body.email,
        password: secPass,
      })
      
      const data = {
        user:{
          id: user.id
        }
      }
  
      const authToken = jwt.sign(data,JWT_SECRET);
  
      //.then(user => res.json(user))
      //.catch (err=> {console.log(err)
    //res.json({error : "Enter unique email id."})});
    res.json({authToken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some Error Occur");
    }
})

//Route 2: login
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
], async(req,res)=>{
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;
  try{
      let user = await User.findOne({email});
      if(!user){
        success = false;
        return res.status(400).json({error : "Please try to login with correct credentials."});
      }
      
      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user:{
          id: user.id
        }
      }
  
      const authToken = jwt.sign(data,JWT_SECRET);
      success = true;
      res.json({ success, authToken })
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Some Error Occur");
  }
})

//route 3: login user detials
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router