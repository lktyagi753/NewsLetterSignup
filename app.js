const express = require('express')
const request = require('request')
const body = require('body-parser')
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(body.urlencoded({extended:true}));

app.get('/',(req,res)=>
{
    res.sendFile(__dirname + "/signup.html")
})
app.post('/',(req,res)=>
{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const mail = req.body.email;
    
    const data = 
    {
        members: 
        [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: fname,
                    LNAME:lname
                }
            }
        ]
    }

    const jsondata = JSON.stringify(data)

    const url = "https://us21.api.mailchimp.com/3.0/lists/91dcb52819"

    const options =
    {
        method:"POST",
        auth: "LK:62d35f3a3878cc3df6cd3e2a74f125ce-us21"
    }


    const request = https.request(url ,options, (response)=>
    {
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html")
        }
        else
        {
            res.sendFile(__dirname + "/failed.html")
        }
        response.on("data", (data)=>
        {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsondata)
    request.end();
})

app.post('/failed',(req,res)=>
{
    res.redirect('/');
})
app.listen(process.env.PORT||3000, ()=>
{
    console.log("Server is running on port 3000")
})