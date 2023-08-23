const express=require('express');
const app=express();
const {generateFile}=require('./generateFile')
const {executeCpp}=require('./executeCpp')
const cors=require('cors');
const { executePy } = require('./executePy');

app.use(express.urlencoded({exteded :true}));
app.use(express.json())
app.use(cors());

app.get('/', (req,res)=>{
    return res.json({hello:"world!"})
});

app.post("/run", async (req,res)=>{
    const { language ="cpp",code}= req.body;
    console.log(req.body.language)
    if(code===undefined){
        return res.status(400).json({success:false,error:"Empty code"})
    }

    try{
    const filepath= await generateFile(language,code);

    let output;
    if(language==="cpp"){
        output=await executeCpp(filepath);
    }
    else if(language==="py"){
        output=await executePy(filepath)
    }
    return res.json({filepath,output});
    }catch(err){
        res.status(500).json({err});
        // console.log(err);
    }
})


app.listen(5000,()=>{
    console.log("listening on port 5000");
});