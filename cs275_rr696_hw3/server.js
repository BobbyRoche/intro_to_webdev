var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/hw3', function(req,res,next) {
res.sendFile(__dirname + "/rr696_hw3.html");
});
app.get('/fac', function(req,res,next){
fact = 1;
n = parseInt(req.query.n,10);
for(var i = n; i>0; i--){
	fact = fact* i;
}
result = "The factorial of " + n + " is: " + fact;
res.send(result.toString());
});

app.get('/sum', function(req,res,next){
sum= 0;
n = parseInt(req.query.n,10);
for(var i = 1; i<=n; i++){
	sum+= i;
	}
result = "The summation of " + n + " is: " + sum;
res.send(result.toString());
});



app.listen(8080, function(){
	console.log("server running...");

	
});