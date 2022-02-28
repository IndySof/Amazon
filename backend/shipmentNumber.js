




// alphabet en tableau
var alphabet = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// lettre aléatoire entre 1 et 25
var random1 = Math.ceil(Math.random() * 25);
var random2 = Math.ceil(Math.random() * 25);
var random3 = Math.ceil(Math.random() * 25);
var random4 = Math.ceil(Math.random() * 25);
// on recupere une entrée aléatoire du tableau
var l1 = alphabet[random1];
var l2 = alphabet[random2];
var l3 = alphabet[random3];
var l4 = alphabet[random4];
var la = l1 + l2 + l3

var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
var seq1 = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
var seq2 = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
 
// console.log("LR500"+ la + seq2 + l4);

// const co = seq + "-" + seq1

const numSuivi = "LR500" + la + seq2 + l4 ;
const codeSec1 = seq ;
const codeSec2 = seq1 ;

// console.log(codeSec1);
// console.log(codeSec2);

// function generate(count) {
//     var founded = false,
//         _sym = '"LR500"+ la + seq2 + l4',
//         str = '';
//     while (!founded) {
//         for (var i = 0; i < count; i++) {
//             str += _sym[parseInt(Math.random() * (_sym.length))];
//         }
//         base.getID(string, function (err, res) {
//             if (!res.length) {
//                 founded = true; 
//             }
//         });
//     }
//     return str;
// };


// console.log("Numero de suivi :");
// console.log(numSuivi);  

export {numSuivi, codeSec1, codeSec2, la, seq2, l3, l4, seq, seq1};

// console.log("Code acces :");
// console.log(seq + " " + seq1);

/*
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "amazing921certified@gmail.com",
        pass: "amazondubled"
    }
});

var mailOptions = {
    from: "amazing921certified@gmail.com",
    to: "david.marrone@outlook.fr",
    subject: "access code",
    text: "Pour acceder a votre code acces merci de cliquer sur le lien suivant : http://localhost/nodejs/code.html",
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Email Sent:' + info.response);
    }
});

*/


