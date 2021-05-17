
const express = require('express');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const app = express();

const PORT = process.env.PORT || 3000;

//paste the client id 
const CLIENT_ID = ''

//paste the client secret 
const CLIENT_SECRET = ''

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

//paste the refresh token here 
const REFRESH_TOKEN= ''


//authorizing using OAuth2.0

const oAuth2Client  = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

//setting up the credentials
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})



app.use(bodyParser.json());

//api post request
app.post('/sendemail',function(req,res){
    async function sendMail (){
    try{
        
        //acessing the token
        const accessToken = await oAuth2Client.getAccessToken();

        //creating a transport variable to use nodemailer
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                type : 'OAuth2',
                user: '',//client email_id
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions ={
            from : '',//client email_id
            to: req.body.email, //req the api with the email id to whom message needs to be send
            subject: " HI",
            text: "Hello From Mehul",
            html: '<h1>Hello From Mehul</h1>',
        };

        const result = await transport.sendMail(mailOptions)
        res.json({status: 'success'});
        return result

    }catch(error)
    {
        return error
    }
}
//console logging the response whether got succesfull or the erros
sendMail().then(result=>console.log("Email sent ...",result))
.catch(error => console.log(error.message));
});

app.listen(PORT, function (req, res) {
    console.log(`Listening on port ${PORT}`);
});
