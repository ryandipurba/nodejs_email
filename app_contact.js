var http = require('http');
require('dotenv').config()
var fs = require('fs');
var qs = require('querystring');
var nodemailer = require('nodemailer');
const PORT = process.env.PORT || 8000

http.createServer((req, res) => {

    if(req.url === "/") {
        // redirect ke halaman contact form
        res.writeHead(302, {
            'Location': '/contact/'
          });
        res.end();
    }

    // load the contact form
    if(req.url === "/contact/" && req.method === "GET"){
        fs.readFile("contact_form.html", (err, data) => {
            if (err) throw err;
            res.end(data);
        });
    }

    // send the email
    if(req.url === "/contact/" && req.method === "POST"){

        var requestBody = '';
        req.on('data', function(data) {
            // tangkap data dari form
            requestBody += data;

            // kirim balasan jika datanya terlalu besar
            if(requestBody.length > 1e7) {
              res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
              res.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
            }
        });

        req.on('end', function() {
            let formData = qs.parse(requestBody);

            // send the email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.email,
                    pass: process.env.password
                }
            });
            
            let mailOptions = {
                from: process.env.email,
                to: formData.email,
                subject: formData.subject,
                text: formData.message
            };
            

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) throw err;
                console.log('Email sent: ' + info.response);
                res.end("Thank you!");
            }); 
        });
    }

    
}).listen(PORT, () => console.log(`Listening on ${ PORT }`))