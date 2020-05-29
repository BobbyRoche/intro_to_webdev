var express = require('express'); //express implemented
var mysql = require('mysql');	  //mysql implemented
var app = express();
var con = mysql.createConnection({
  host: "localhost",		//sql database information
  user: "root",
  password: "Bobby1996!",
  database: "student_info",
  dateStrings: true	        //prevents date from being interpreted as a javascript object
});

//prevents error from data transfer
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//loads the webpage when url is typed in with the /hw5 endpoint

app.get('/hw5', function(req,res,next) {
res.sendFile(__dirname + "/cs275_rr696_assignment5.html");
});

//will print a table of the desired specification from the SQL databse

app.get('/table', function(req,res,next){
var s=req.query.s;	//stores selection in the variable s.
con.query('SELECT * FROM student_info.' + s, function(err,rows,fields) //Query to the database
{ 
if(err){			//will log and print error in the event the query fails
	console.log(err);
	res.send('Error');
	}
else{				//if the query succeeds html text to build a table is made
	var r = '<table border="1"><tr>';
	var headers = [];
	for(i=0; i<fields.length; i++)	//accounts for headers
	{
		headers.push(fields[i].name);
		r += '<th>' + fields[i].name + '</th>';
	}
	r += '</tr>';
	for(i=0; i<rows.length; i++)
	{
		r += '<tr>';
		for(j=0; j<headers.length; j++)
		{
			r += '<td>' + rows[i][headers[j]] + '</td>'; //table is constructed
		}
		r += '</tr>';
	}

	}
	
	r += '</table>'	
	res.send(r);			//table sent back to the webpage
});
});

app.get('/transcript', function(req,res,next){  //get method to get the transcript table
	var id = req.query.s;			//takes in student id and term
	var term = req.query.t;
	
	if(term == "all"){			//option to show all terms for a given student

		var txt = 'SELECT student.STUDENT_ID AS "Student ID", FIRST_NAME AS "First Name", LAST_NAME AS "Last Name", TERM AS "Term/Year", course.COURSE_ID AS "Course ID", COURSE_DESCRIPTION AS "Description", GRADE AS "Grade" FROM course, grades, student WHERE student.STUDENT_ID = grades.STUDENT_ID AND course.COURSE_ID = grades.COURSE_ID AND student.STUDENT_ID = "' + id + '";';
	}
	else{					//Displays data for a particular term
		
		var txt = 'SELECT student.STUDENT_ID AS "Student ID", FIRST_NAME AS "First Name", LAST_NAME AS "Last Name", TERM AS "Term/Year", course.COURSE_ID AS "Course ID", COURSE_DESCRIPTION AS "Description", GRADE AS "Grade" FROM course, grades, student WHERE student.STUDENT_ID = grades.STUDENT_ID AND course.COURSE_ID = grades.COURSE_ID AND student.STUDENT_ID = "' + id + '" AND TERM = "' + term + '";';
	}
	
	con.query(txt, function(err,rows,fields){	//if query fails error shows
		if(err){
			console.log(err);
			res.send('Error');
		}
		else{
			//html response
			var resHTML = '<table border="1"><tr>';
			var headers = [];			//accounts for headers
			for(i=0; i<fields.length; i++){
				headers.push(fields[i].name);
				resHTML += '<th>' + fields[i].name + '</th>';
			}
			resHTML += '</tr>';
			for(i=0; i<rows.length; i++){		//get data from rows
				resHTML+= '<tr>';
				for(j=0; j<headers.length; j++){
					resHTML += '<td>' + rows[i][headers[j]] + '</td>';
				}
				resHTML+= '</tr>';
			}
			resHTML += '</table>'
			console.log('Transcript in Progress');
			res.send(resHTML);
		}
	});
});

app.get('/autopop', function (req,res){		//autopopulates dropdowns based on the data


	con.query('SELECT STUDENT_ID, FIRST_NAME, LAST_NAME FROM student ORDER BY LAST_NAME;', function(err,rows,fields){
		if(err){
			console.log(err);
			res.send('Error');
		}
		else{
							//response html for dropdowns
			var resHTML = `
				<select id="studentID">`;
							//populate student dropdown
			for(i=0; i<rows.length; i++){
				resHTML  += '<option value="' + rows[i].STUDENT_ID + '">' + rows[i].STUDENT_ID + '</option>';
			}
			resHTML += '</select>';
							//populate term selection

			con.query('SELECT DISTINCT(TERM) FROM grades;', function(err,rows,fields){
				if(err){
					console.log(err);
					res.send('Error');
				}
				else{
					//populate drop-down with terms/years available
					resHTML += '<select id="term"><option value="all">All</option>';
					for(i=0; i<rows.length; i++){
						resHTML += '<option value="' + rows[i].TERM + '">' + rows[i].TERM + '</option>';
					}
					resHTML += '</select>'
					res.send(resHTML);
				}
			});
		}
	});
});

app.post('/addStudent', function (req,res){		//POST function to add a new student to the database
	var id = '"'+req.query.i+'"';			//Uses all given Data transferred from url
	var first = '"'+req.query.f+'"';
	var last = '"'+req.query.l+'"';
	var dob = '"'+req.query.d+'"';
	var major = '"'+req.query.m+'"';
							//string formatted query
	var check = "SELECT STUDENT_ID,FIRST_NAME, LAST_NAME, Date_Of_Birth, major FROM student WHERE student.STUDENT_ID = " + id + " AND student.FIRST_NAME = " + first + " AND student.LAST_NAME = " + last + " AND student.Date_Of_Birth = " + dob + " AND student.major = " + major + ";"; 
	con.query(check , function(err,rows,fields){
		if(err){
			console.log(err);
			res.send('Error');
		}
		else if(rows.length>0){ //no error but student already exists, do not add again
			console.log('Error: attempt to add existing student to DB');
			res.send('Student Table Entry Exists. Must Be a Unique Entry.');
		}
		else{ //add new student
			//sql string to insert new student into db
			var add = "INSERT INTO student(STUDENT_ID, FIRST_NAME, LAST_NAME, Date_Of_Birth, major)VALUES(" + id + "," + first + "," + last + "," + dob + "," + major + ");";
			con.query(add , function(err,rows,fields){
				if(err){
					console.log(err);
					res.send('Error');
				}
				else{
					console.log('Addition Success');
					res.send('Student Table Updated');
				}
			});
		}
	});
});



app.listen(8080, function(){
	console.log("server running...");	
});