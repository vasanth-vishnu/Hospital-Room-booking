const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const mysql=require('mysql');
const { compile } = require('ejs');
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"roombooking"
});
db.connect((err)=>{
    if(err)throw err;
    console.log("connected to database successfully");
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));                                                                                                                                                                                                                                         
app.set('view engine','ejs');

var session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

app.get('/home',(req,res)=>{
    res.render("index",{name:"Register if you are a new user"});
});

var ob2={};
var ay=[];
var le;
function vis(res){
    var ob1={};
    var ob3={};
    let sq1="SELECT * FROM rty1";
    db.query(sq1,(err,rows)=>{
        if(err)throw err;
        console.log("sent to hospital room booking page");
        ob1=rows;
        console.log(ob1)
    let sq2="SELECT Roomtype FROM rty1";
    db.query(sq2,(err,rows)=>{
        if(err)throw err;
        ob2=rows; 
        console.log("ob2 data sent");
        console.log(ob2);
    for(let j=0;j<ob2.length;j++){
        let sq4=`SELECT fname FROM pad1 WHERE roomType='${ob2[j].Roomtype}' AND lname is NULL`;
        db.query(sq4,(err,rows)=>{
            if(err)throw err;
            ay.push(rows.length);
            console.log("rows entered",j);
            if(j==ob2.length-1){rr(res)};
        });
    }
    function rr(res){
        vd(res);
    
    }
    function vd(res){
        var d= new Date();
        var day=d.getDate();
        var month=d.getMonth()+1;
        var year=d.getFullYear();
        var fin=day+"-"+month+"-"+year; 
       console.log(ay);
        res.render("ind",{tab:ob1,opt:ob2,arr:ay,de:fin});
        ay=[];
    }
        
    });
});

}
app.get('/hospital-room-booking',(req,res)=>{
   vis(res);
});

var sq='CREATE TABLE IF NOT EXISTS admin (id int AUTO_INCREMENT,adminname VARCHAR(20),adminpassword VARCHAR(20),PRIMARY KEY(id))';
db.query(sq,(err,result)=>{
    if(err)throw err;
    console.log("admin table created");
});

app.get("/admin-page1",(req,res)=>{
    var alrt1= req.session.message;
    let sq1="SELECT Roomtype FROM rty1";
    let sq2="SELECT * FROM rty1";
    db.query(sq1,(err,rows)=>{
        if(err)throw err;
        db.query(sq2,(err,row)=>{
            if(err)throw err;
            res.render("admin",{alrt:alrt1,tab:row,rt:rows});
        });
        
    });

})

app.post('/admin-page',(req,res)=>{
    var name=req.body.aname;
    var pass=req.body.apass;
    let sql="SELECT * FROM admin";
    db.query(sql,(err,rows,results)=>{
        if(err)throw err;
        if(rows[0].adminname==name && rows[0].adminpassword==pass){
            req.session.message = '';
            res.redirect("/admin-page1");
        }
    });
});

app.post("/admin-add",(req,res)=>{
    var roomty=req.body.artype;
    var acor=req.body.aac;
    var noof=req.body.anor;
    var romn=req.body.armno;
    var price=req.body.aprice;
    let sql="CREATE TABLE IF NOT EXISTS rty1 (id int AUTO_INCREMENT,Roomtype VARCHAR(20),Type VARCHAR(20),Rooms int(3),Roomnumber int(5),Price int(9),PRIMARY KEY(id))";
    db.query(sql,(err,res)=>{
        if(err)throw err;
        console.log("room varient selection table created");
    });
    var inoof=parseInt(noof);
    var iprice=parseInt(price);
    var rmno=parseInt(romn);
    let sq1="INSERT INTO rty1 SET ?";
    let post={
        Roomtype:roomty,
        Type:acor,
        Rooms:inoof,
        Roomnumber:rmno,
        Price:iprice
    };
    db.query(sq1,post,(err,rows)=>{
        if(err)throw err;
        console.log("Room varient inserted");
    })
    let sqvas="CREATE TABLE IF NOT EXISTS pad1 (id int AUTO_INCREMENT,fname VARCHAR(20),lname VARCHAR(20),pid VARCHAR(20),mobile VARCHAR(20),Gmail VARCHAR(20),roomType VARCHAR(20),type VARCHAR(20),roomnum INT(3),checkIn VARCHAR(10),checkOut VARCHAR(10),report VARCHAR(20),PRIMARY KEY(id))";
    db.query(sqvas,(err,res)=>{
    if(err)throw err;
    console.log("roommates table created");
           });
  for(var i=0;i<inoof;i++){
        
    let sqvas1=`INSERT INTO pad1 SET ?`;
    let po={
        fname:null,
        lname:null,
        pid:null,
        mobile:null,
        Gmail:null,
        roomType:roomty,
        type:acor,
        roomnum:rmno,
        checkIn:null,
        checkOut:null,
        report:null
    };
    db.query(sqvas1,po,(err,res)=>{
        if(err)throw err;
        console.log("one varient created");
    });
    rmno=rmno+1;

  }
    let sq2="SELECT * FROM rty1";
    db.query(sq2,(err,rows)=>{
        if(err)throw err;
        res.render("admin",{alrt:"displaying roomtype table",tab:rows,rt:{}});
    });
    
});

app.post('/admin-page2',(req,res)=>{
    var name=req.body.aname;
    var pass=req.body.apass;
    var cpass=req.body.acpass;
    if(pass==cpass){
    let sql="UPDATE admin set ?";
    let post={adminname:name,adminpassword:pass};
    db.query(sql,post,(err,res)=>{
        if(err)throw err;
        console.log("admin details updated successfully");
    });

    req.session.message = 'Admin details updated succesfully'; //or whatever
    res.redirect('/admin-page1');
   
     }
     else{
        req.session.message = 'error';
         res.redirect("/admin-page1");
     }
    
});
app.post("/admin-update",(req,res)=>{
 
    let upr=req.body.updrt;
    let upac=req.body.updac;
    let upnr=req.body.updno;
    let updp=req.body.updpr;
    console.log(upr,upac,upnr,updp);
    let sq3=`UPDATE rty1 SET ? WHERE Roomtype='${upr}' AND Type='${upac}'`;
    let po={
        Roomtype:upr,
        Type:upac,
        Rooms:upnr,
        Price:updp
    };
    db.query(sq3,po,(err,res)=>{
        if(err)throw err;
        console.log("Room details updates for type",upr);
    })
    req.session.message = 'Admin Updated Room details';
    res.redirect("/admin-page1");
})
app.get("/adminpage",(req,res)=>{
    let sq2="SELECT * FROM rty1";
    db.query(sq2,(err,rows)=>{
        if(err)throw err;
        res.render("admin",{alrt:"displaying roomtype table",tab:rows,rt:{}});
    });
});
app.get("/del/:usac/:rmty",(req,res)=>{
    let p=req.params.usac;
    let p1=req.params.rmty;
    let sql=`DELETE FROM rty1 WHERE Roomtype=${p1} AND Type=${p}`;
    db.query(sql,(err,res)=>{
        if(err)throw err;
        console.log("Room varient removed");
    });
    let sq2=`DELETE FROM pad1 WHERE roomType='${p1}' AND type=${p}`;
    db.query(sq2,(err,res)=>{
        if(err)throw err;
        console.log("removed from pad1 table also");
    })
    res.redirect("/adminpage");
})




















































































app.get("/Recept",(req,res)=>{
    res.render("print");
});

app.post("/user-booking",(req,res)=>{
    var vas=[]
    var typ=[]
    for(let l in req.body){
        vas.push(req.body[l]);
    }
    console.log(vas);
    let sq1="SELECT Roomtype FROM rty1";
    db.query(sq1,(err,rows)=>{
        console.log(rows);
        for(let i=0;i<rows.length;i++){
            for(let j=0;j<vas.length;j++){
                if(vas[j]==rows[i].Roomtype){
                    typ.push(vas[j+2]);
                    let p1=parseInt(vas[j+2]);
                    let sq=`UPDATE pad1 SET ? WHERE roomType='${vas[j]}' AND type='${vas[j+1]}' AND fname is NULL LIMIT ${p1}`;
        let po={
            fname:vas[0],
            lname:vas[1],
            pid:vas[2],
            mobile:vas[3],
            Gmail:vas[4],
            bookedOn:vas[vas.length-4],
            checkIn:vas[vas.length-3],
            checkOut:vas[vas.length-2],
            report:vas[vas.length-1]
        };
        db.query(sq,po,(err,res)=>
        {
            if(err)throw err;
            console.log("data inserted successfully");
        });
                }
            }
        }
       
    });
    console.log("vass",vas[4])
    var nodemailer = require('nodemailer');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vasanthvasanth0769@gmail.com',
    pass: '7780376293'
  }
});
var val = Math.floor(100000 + Math.random() * 900000);
var mailOptions = {
  from: 'vasanthvasanth0769@gmail.com',
  to: vas[4],
  subject: 'Homals Online Room Booking',
  text: "Your OTP for Online booking prosess is  "+val+"  Thankyou and call me if you are free"
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  let sqlr="CREATE TABLE IF NOT EXISTS otp2 (ot VARCHAR(20),nam VARCHAR(20))";
  db.query(sqlr,(err,res)=>{
      if(err)throw err;
      console.log("otp table created");
  });
  let sqlr1="INSERT INTO otp2 SET ?";
  let po={
      ot:val,
      nam:vas[1]
  }
  db.query(sqlr1,po,(err,res)=>{
      if(err)throw err;
      console.log("Inserted Into otp2");
  });
    res.render("otp",{name:vas[1],rre:""});
    
});
app.post("/otpvas",(req,res)=>{
    var k1=req.body.ot1;
    console.log(k1);
    let sql="SELECT * FROM otp2";
    db.query(sql,(err,rows)=>{
        if(err)throw err;
        
        if(k1==rows[rows.length-1].ot){
            res.redirect("/Recept");
            let sq2="TRUNCATE TABLE otp2";
             db.query(sq2,(err,res)=>{
             if(err)throw err;
            console.log("otp table truncated");
    });
        }
        else
        {
        
            res.render("otp",{name:rows[rows.length-1].nam,rre:"OTP Is Incorrect"})
        }
    });
    
})
app.get("/show",(req,res)=>{
  
    let sql="SELECT * FROM pad1 WHERE fname is NOT NULL";
    db.query(sql,(err,rows)=>{
        if(err)throw err;
        console.log("sent");
        res.render('show',{item:rows});
    });
});
app.get("/show1",(req,res)=>{
    var ay1=req.session.message;
    console.log(typeof(ay1));
    let sql=`SELECT * FROM pad1 WHERE roomnum='${ay1}'`;
    let sq2="SELECT Roomtype FROM rty1";
    db.query(sql,(err,rows)=>{
        if(err)throw err;
        console.log("sent");
        db.query(sq2,(err,re)=>{
            if(err)throw err;
            res.render('show1',{item:rows,up:rows,tr:re});
        });
       
       
    });
})
app.get("/update/:nm",(req,res)=>{
       let r=req.params.nm;
        req.session.message = r;
         res.redirect("/show1");
})
app.get("/delete/:userid",(req,res)=>{
    const id1=req.params.userid;
    console.log(id1); 
    let sqvas1=`UPDATE pad1 SET ? WHERE roomnum='${id1}'`;
    let po={
        fname:null,
        lname:null,
        pid:null,
        mobile:null,
        Gmail:null,
        checkIn:null,
        checkOut:null,
        report:null
    };
    db.query(sqvas1,po,(err,res)=>{
        if(err)throw err;
        console.log("updated varient created");
    });
    res.redirect("/show");
})

app.listen(4000,()=>{
    console.log("server started");
})