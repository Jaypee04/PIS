var port = 8001;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multiparty = require('connect-multiparty');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var WindowsStrategy = require('passport-windowsauth');
var flash = require('connect-flash');

var connection  = require('express-myconnection'); 
var mssql = require('mssql');

var async = require('async');
var pdfFiller   = require('pdffiller');
var fs = require('fs');

//================ CONFIG ===============//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser()); // required before session.
app.use(session({ 
	secret: 'p1s',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//database configuration
var config_office = {
	user: 'pis',
	password: 'pis',
	server: '192.168.8.16', 
	database: 'PIS'
};
var config = {
	user: 'pis',
	password: 'pis',
	server: '192.168.8.16',
	database: 'PIS'
	
};

//=============== START ===============//
startServer();

//=============== FUNCTIONS ============//

//Function that wraps multiline
function MultilineWrapper(f){
	return (f.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]).trim();
}

//Function that authenticates user
function setAuthentication(){

	app.engine('html', require('ejs').renderFile);

	function findById(id, fn) {
	  var idx = id - 1;
	  if (users[idx]) {
		fn(null, users[idx]);
	  } else {
		fn(new Error('User ' + id + ' does not exist'));
	  }
	} 
	
	function findByUsername(username, fn) {
	  for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
		  return fn(null, user);
		}
	  }
	  return fn(null, null);
	} 
	
	function ensureAuthenticated(req, res, next) {
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated()) { return next(); }
	  	res.sendFile('/epds/login.html', {root: __dirname + '/../static'});
	}

	//use windows strategy here instead of local strategy
	passport.use(new WindowsStrategy({
			ldap: {
				url:             'ldap://192.168.8.11/OU=NAMRIA,DC=namria,DC=gov,DC=ph',
				base:            'OU=NAMRIA,DC=namria,DC=gov,DC=ph',
				bindDN:          'auth',
				bindCredentials: 'p@$$w0rd'
			},
			integrated: false
		}, 
		function(profile, done){
			if(profile)
			{
				var name = profile.name.givenName + ' ' + profile.name.familyName;
				done(null, name);
			}
			else
			{
				done(null, false, { message: 'Login Error!' });
			}
		})
	);
	
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});
	
	app.post('/login',
		passport.authenticate('WindowsAuthentication'), 
		function(req,res){
			if(req.user)
			{
				res.json({success:true,user:req.user});
			}
			else
			{
				res.json({success:false});
			}
		}
	);
	
	app.get('/epds', ensureAuthenticated, function(req, res){
		res.sendFile('epds/index.html', {root: __dirname + '/../static'});
	});	
	
	app.get('/index.html', ensureAuthenticated, function(req, res){
		res.sendFile('/index.html', {root: __dirname + '/../static'});
	});
	
	app.get('/newEmployee', function(req, res){
		res.sendFile('/index.html', {root: __dirname + '/../static'});
	});
	
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/epds');
	});
	
}

//Function that set the routes
function setRoutes(){
	
	// library 
	app.get('/table/:table_name', function(req, res){
			
		query3(
			"SELECT * FROM [" + req.params.table_name + "]",
			{},{},
			function(err, rs){
				if(err)
					res.json(err)
				else 
					res.json(rs);
			}
		); 
		
	});
	
	app.get('/training/training_invitation', function(req, res){
		var sql = MultilineWrapper(function(){/*
			SELECT T1.*, T2.COURSENAME
			FROM TRAINING_INVITATION AS T1 LEFT OUTER JOIN
			COURSE_LIB AS T2 ON T1.COURSECODE = T2.COURSECODE
		*/});
		query3(
			sql,
			{},{},
			function(err, rs){
				if(err)
					res.json(err)
				else 
					res.json(rs);
			}
		); 
		
	});
	
	
	app.put('/training/training_invitation/:id', function(req, res){
		
		var sql = MultilineWrapper(function(){/*
			UPDATE [TRAINING_INVITATION]
			SET [INVITECODE] = COALESCE(@INVITECODE, INVITECODE)
			  ,[INSTCODE] = COALESCE(@INSTCODE, INSTCODE)
			  ,[COURSECODE] = COALESCE(@COURSECODE, COURSECODE)
			  ,[COURSESTART] = COALESCE(@COURSESTART, COURSESTART)
			  ,[COURSEEND] = COALESCE(@COURSEEND, COURSEEND)
			  ,[VENUE] = COALESCE(@VENUE, VENUE)
			  ,[LOCAL] = COALESCE(@LOCAL, LOCAL)
			WHERE id = @id
		*/});
		
		var paramDef = {
			'INVITECODE': mssql.VarChar(50),
			'INSTCODE': mssql.VarChar(50),
			'COURSECODE': mssql.VarChar(50),
			'COURSESTART': mssql.Date,
			'COURSEEND': mssql.Date,
			'VENUE': mssql.VarChar(50),
			'LOCAL': mssql.Bit,
			'id': mssql.Int
		};
		
		var paramVal = req.body;
		if(paramVal['COURSESTART'])
			paramVal['COURSESTART'] = paramVal['COURSESTART'] + '000';
		if(paramVal['COURSEEND'])
			paramVal['COURSEEND'] = paramVal['COURSEEND'] + '000';
		
		query3(sql, paramDef, paramVal,
			function(err, rs){
				if(err)
					res.json({success: false, message: err});
				else 
					res.json({success: true, message: 'Updated'});
			}
		); 
	
	});
	
	app.post('/training/training_invitation', function(req, res){
		
		var sql = MultilineWrapper(function(){/*
			INSERT INTO [TRAINING_INVITATION]
			   ([INVITECODE]
			   ,[INSTCODE]
			   ,[COURSECODE]
			   ,[COURSESTART]
			   ,[COURSEEND]
			   ,[VENUE]
			   ,[LOCAL])
			VALUES
			   (@INVITECODE, 
			    @INSTCODE, 
				@COURSECODE, 
				@COURSESTART, 
				@COURSEEND, 
				@VENUE, 
				@LOCAL)
		*/});
		
		var paramDef = {
			'INVITECODE': mssql.VarChar(50),
			'INSTCODE': mssql.VarChar(50),
			'COURSECODE': mssql.VarChar(50),
			'COURSESTART': mssql.Date,
			'COURSEEND': mssql.Date,
			'VENUE': mssql.VarChar(50),
			'LOCAL': mssql.Bit
		};
		
		var paramVal = req.body;
		if(paramVal['COURSESTART'])
			paramVal['COURSESTART'] = paramVal['COURSESTART'] + '000';
		if(paramVal['COURSEEND'])
			paramVal['COURSEEND'] = paramVal['COURSEEND'] + '000';
		
		query3(sql, paramDef, paramVal,
			function(err, rs){
			
				if(err)
					res.json({success: false, message: err});
				else 
					res.json({success: true, message: rs});
					

			}
		); 
	
	});
	
	
	// test routes
	app.get('/test', function(req, res){
		var profPic = 'Hello! It\'s functioning';
		res.end(profPic);
	});
	
	app.get('/connect', function(req, res){
		var ps = new mssql.PreparedStatement(config);
		ps.input('param', mssql.VarChar(50));
		ps.prepare("Select 1;SELECT * FROM EDUC", function(err){
			ps.execute(param, function(err, rs) {
				callback(rs);
			});
		});
	});
	
	//map data to pdf file
	app.post('/printPDF', function(req, res){
	
		var sourcePDF = "data/pds.pdf";
		var destinationPDF =  "data/" + (new Date()).getTime() + ".pdf";
		
		var data = JSON.parse(req.body.personnelPDF);
		var path = require('path');
		pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(){ 
			fs.readFile(destinationPDF, function (err,data){
				res.contentType("application/pdf");
				res.send(destinationPDF);
				res.end();
			});
		});
	
	});
	
	//returns course
	app.get('/getCourse',function(req,res){
		
		var connection = new mssql.Connection(config, function(err) {
			var request = new mssql.Request(connection);
			request.query("SELECT COURSE_C as courseCode, COURSE_T as courseTitle FROM COURSE ORDER BY COURSE_T", function(err, recordset) {
				var course = recordset; 
				res.json(course);
			});
		});
		
	});
	
	
	//returns degree
	app.get('/getDegree',function(req,res){
		
		var connection = new mssql.Connection(config, function(err) {
			var request = new mssql.Request(connection);
			request.query("SELECT DEGREE_C as degreeCode, DEGREETYPE as degreeTitle FROM DEGFILE ORDER BY DEGREETYPE", function(err, recordset) {
				var degree = recordset; 
				res.json(degree);
			});
		});
		
	});
	
	//returns status of Appointment
	app.get('/getStatusOfAppointment',function(req,res){
		
		var connection = new mssql.Connection(config, function(err) {
			var request = new mssql.Request(connection);
			request.query("SELECT [APPT_CODE] as appointmentCode,[APPT_DESC] as appointmentDescription from APPT ORDER BY APPT_DESC", function(err, recordset) {
				var appointment = recordset; 
				res.json(appointment);
			});
		});
		
	});
	
	
	app.post('/updateRecord', function(req, res){
				
		var connection = new mssql.Connection(config, function(err) {
			
			var p = req.body.personnelInfo;
			async.series([
				
				//Update PLANT (name of employee)
				function(callback){	
					
					var paramDef= {
						'NamriaID': mssql.VarChar(50),
						'Surname': mssql.VarChar(50),
						'Firstname': mssql.VarChar(50),
						'Middlename': mssql.VarChar(50),
						'Nameextension': mssql.VarChar(50)
					};
					var sql = MultilineWrapper(function(){/*
					UPDATE plant
					SET FIRST_M = @Firstname,
					MIDDLE_M = @Middlename,
					LAST_M = @Surname,
					NAME_EXTENSION = @Nameextension
					WHERE EMP_ID = @NamriaID
					*/});
					var values = {
						NamriaID:p.NID,
						Surname:p.surName,
						Firstname:p.firstName,
						Middlename:p.middleName,
						Nameextension:p.nameExtension
					};
				
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('PLANT: Updated Successfully');	
					
				},
				
				// Update EMP_DTL 
				function(callback){	 
					var paramDef = {
						'DoB': mssql.Date,
						//'IDP': mssql.VarChar(mssql.MAX),
						'PoB': mssql.VarChar(50),
						'sex': mssql.VarChar(2),
						'civilStatus': mssql.VarChar(50),
						'height': mssql.Decimal(18,2),
						'weight': mssql.Decimal(18,2),
						'citizenship': mssql.VarChar(50),
						'bloodType': mssql.VarChar(50),
						'NamriaID': mssql.VarChar(50),
						'tin': mssql.VarChar(50),
						'GSIS': mssql.VarChar(50),
						'PAGIBIG': mssql.VarChar(50),
						'PHILHEALTH': mssql.VarChar(50),
						'SSS': mssql.VarChar(50),
						'eMail': mssql.VarChar(50),
						'cellphone': mssql.VarChar(50),
						'residentialSt': mssql.VarChar(50),
						'residentialMun': mssql.VarChar(50),
						'residentialProv': mssql.VarChar(50),
						'residentialZip': mssql.VarChar(50),
						'residentialTel': mssql.VarChar(50),
						'provincialSt': mssql.VarChar(50),
						'provincialMun': mssql.VarChar(50),
						'provincialProv': mssql.VarChar(50),
						'provincialZip': mssql.VarChar(50),
						'provincialTel': mssql.VarChar(50),
						'spouse_f': mssql.VarChar(50),
						'spouse_m': mssql.VarChar(50),
						'spouse_l': mssql.VarChar(50),
						'spouse_occu': mssql.VarChar(50),
						'spouse_empl': mssql.VarChar(50),
						'spouse_emplAdd': mssql.VarChar(50),
						'spouse_emplTel': mssql.VarChar(50),
						'father_f': mssql.VarChar(50),
						'father_m': mssql.VarChar(50),
						'father_l': mssql.VarChar(50),
						'mother_f': mssql.VarChar(50),
						'mother_m': mssql.VarChar(50),
						'mother_l': mssql.VarChar(50),
						'tax_no': mssql.VarChar(50),
						'tax_place': mssql.VarChar(50),
						'tax_date': mssql.Date,
						'date_accomplished': mssql.Date
					};
			
					var sql = MultilineWrapper(function(){/*
					UPDATE EMP_DTL
					SET 
						birth_date=@DoB, 
						birth_prov=@PoB, 
						sex_c=@sex, 
						civil_stat=@civilStatus, 
						height=@height, 
						weight=@weight, 
						blood_t=@bloodType, 
						citizen=@citizenship, 
						tin=@tin, 
						gsis_id_no=@GSIS, 
						pag_ibig=@PAGIBIG, 
						ph_no=@PHILHEALTH, 
						sss_no=@SSS, 
						cel_no=@cellphone, 
						email=@eMail, 
						addr_st=@residentialSt, 
						addr_mun=@residentialMun, 
						addr_prov=@residentialProv, 
						tel_no=@residentialTel, 
						addr_zp=@residentialZip, 
						paddr_st=@provincialSt, 
						paddr_mun=@provincialMun,
						paddr_prov=@provincialProv,
						ptel_no=@provincialTel,
						paddr_zp=@provincialZip, 
						s_first=@spouse_f,
						s_middle=@spouse_m,
						s_last=@spouse_l,
						spouse_occ=@spouse_occu,
						bus_name=@spouse_empl,
						bus_add=@spouse_emplAdd,
						bus_tel=@spouse_emplTel, 
						f_first=@father_f,
						f_middle=@father_m,
						f_last=@father_l,
						m_first=@mother_f,
						m_middle=@mother_m,
						m_last=@mother_l, 
						ctc_no=@tax_no, 
						ctc_place=@tax_place, 
						ctc_date=@tax_date,
						pds_accomp=@date_accomplished 
					WHERE emp_id=@NamriaID
					*/});
					
					var dOB = new Date(p.dateOfBirth);
					var taxdate = new Date(p.issuedDate);
					var dateaccomplished = new Date(p.dateAccomplished);
					
					var values = {
						DoB:dOB,
						//IDP:p.picture,
						PoB:p.placeOfBirth, 
						sex:p.sex, 
						civilStatus:p.civilStatus, 
						height:p.height, 
						weight:p.weight, 
						bloodType:p.bloodType, 
						citizenship:p.citizenship, 
						tin:p.TIN, GSIS:p.GSIS, 
						PAGIBIG:p.PAGIBIG, 
						PHILHEALTH:p.PHILHEALTH, 
						SSS:p.SSS, 
						cellphone:p.cellphone, 
						eMail:p.eMail, 
						residentialSt:p.resAdd,
						residentialMun:p.resBrgy,
						residentialProv:p.resCity,
						residentialTel:p.resTel,
						residentialZip:p.resZip, 
						provincialSt:p.perAdd,
						provincialMun:p.perBrgy,
						provincialProv:p.perCity,
						provincialTel:p.perTel,
						provincialZip:p.perZip,
						spouse_f:p.spFirstname,
						spouse_m:p.spMiddlename,
						spouse_l:p.spSurname,
						spouse_occu:p.spOccu,
						spouse_empl:p.spEmployer,
						spouse_emplAdd:p.spBusAdd,
						spouse_emplTel:p.spBusTel, 
						father_f:p.fatFirstname,
						father_m:p.fatMiddlename,
						father_l:p.fatSurname,
						mother_f:p.motFirstname,
						mother_m:p.motMiddlename,
						mother_l:p.motSurname, 
						tax_no:p.taxNo,
						tax_place:p.issuedAt,
						tax_date:taxdate,
						date_accomplished:dateaccomplished, 
						NamriaID:p.NID
					};

					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('EMP_DTL: Updated Successfully');	
				},
				
				//Delete CHILD
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM CHILD WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('CHILD: Deleted Successfully');
				},
				
				//Update CHILD
				function(callback){	
					
					var paramDef = {
						'nameOfChild': mssql.VarChar(50),
						'dateOfBirth': mssql.Date,
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = "INSERT INTO CHILD (EMP_ID,CHILD_NAME,CHILD_BDAY) VALUES (@NamriaID,@nameOfChild,@dateOfBirth)";
					
					async.forEachSeries(p.children, function(c,callback){
						var name = c.fullName;
						var dob = new Date(c.dateOfBirth);
							
						var values = {
							nameOfChild:name, 
							dateOfBirth:dob, 
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('CHILD: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('CHILD: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				//Delete EDUC
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM EDUC WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback();
					});
					console.log('EDUC: Deleted Successfully');
				},
				
				//Update EDUC
				function(callback){	
				
					var paramDef = {
						'LevelCode': mssql.VarChar(1),
						'School': mssql.VarChar(50),
						'DegreeCode': mssql.VarChar(2),
						'CourseCode': mssql.VarChar(4),
						'UnitsEarned': mssql.VarChar(10),
						'StartYear': mssql.VarChar(4),
						'EndYear': mssql.VarChar(4),
						'HonorsReceived': mssql.VarChar(25),
						'YearGraduated': mssql.VarChar(4),
						'NamriaID': mssql.VarChar(7)
						
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO EDUC 
					(EMP_ID,
					LEVEL_C,
					INSTITUTE, 
					DEGREE_C,
					COURSE_C,
					[UNITS],
					START_YEAR,
					END_YEAR,
					HONORS_T,
					Y_GRAD) 
					VALUES 
					(@NamriaID,
					@LevelCode,
					@School,
					@DegreeCode,
					@CourseCode,
					@UnitsEarned,
					@StartYear,
					@EndYear,
					@HonorsReceived,
					@YearGraduated)
					*/});
					
					async.forEachSeries(p.education, function(e, callback){
						var levelCode = e.level;
						var school = e.schoolName;
						var degreeCode = e.degree;
						var courseCode = e.course;
						var CseDor = e.yearGraduated;
						var CareerDate = e.highestGrade;
						var CareerDate = e.fromDate;
						var CareerDate = e.toDate;
						var CareerDate = e.scholarship;
						var values = {
							LevelCode: e.level, 
							School: e.schoolName, 
							DegreeCode: e.degree, 
							CourseCode: e.course,
							UnitsEarned: e.highestGrade,
							StartYear: e.fromDate,
							EndYear: e.toDate,
							HonorsReceived: e.scholarship,
							YearGraduated: e.yearGraduated,
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('EDUC: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('EDUC: Updated Successfully');
									callback(null);
								}
							}
						);
					},
					function(err)
					{
						callback();
					}
					);
				
					
				},
				
				//Delete ELIG
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM ELIG WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('ELIG: Deleted Successfully');
				},
				
				//Update ELIG
				function(callback){	
					var paramDef = {
						'careerTitle': mssql.NVarChar(35),
						'careerRating': mssql.Decimal(18,2),
						'careerPlace': mssql.NVarChar(30),
						'careerDateMM': mssql.NVarChar(2),
						'careerDateDD': mssql.NVarChar(2),
						'careerDateYY': mssql.NVarChar(4),
						'NamriaID': mssql.VarChar(50),
						'licenseNumber': mssql.NVarChar(30),
						'dateOfRelease': mssql.Date
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO ELIG 
					(EMP_ID,
					EXAM_T,
					[RATING], 
					EXAM_PLACE,
					EXAM_MM,
					EXAM_DD,
					EXAM_YY,
					LIC_NO,
					LIC_DATE) 
					VALUES 
					(@NamriaID,
					@careerTitle,
					@careerRating,
					@careerPlace,
					@careerDateMM,
					@careerDateDD,
					@careerDateYY,
					@licenseNumber,
					@dateOfRelease)
					*/});
					
					async.forEachSeries(p.eligibility, function(e, callback){
						var CseCareer = e.eligTitle;
						var CseRating = e.eligRating;
						var CsePlace = e.eligPlace;
						var CseNumber = e.eligLicenseNumber;
						var CseDor = new Date(e.eligDateOfRelease);
						var CareerDate = e.eligDate;
						if (e.eligDate == null)
						{
							var CseMonth = '';
							var CseDay= '';
							var CseYear= '';
						}
						else if (e.eligDate != null)
						{
							var cseDate = e.eligDate.split('/');	
							var CseMonth = cseDate[0];
							var CseDay= cseDate[1];
							var CseYear= cseDate[2];
						}
						
						var values = {
							careerTitle: CseCareer, 
							careerRating: CseRating, 
							careerPlace: CsePlace, 
							careerDateMM: CseMonth,
							careerDateDD: CseDay,
							careerDateYY: CseYear,
							dateOfRelease: CseDor,
							licenseNumber: CseNumber,
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('ELIG: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('ELIG: Updated Successfully');	
									callback(null);
								}
							}
						);
					},
					function(err)
					{
						callback();
					}
					);
					
				}, 
				
				//Delete SERV
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM SERV WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('SERV: Deleted Successfully');
				},
				
				//Update SERV
				function(callback){	
					var paramDef = {
						'StartDate': mssql.Date,
						'EndDate': mssql.Date,
						'Position': mssql.VarChar(100),
						'Office': mssql.VarChar(100),
						'Salary': mssql.Float,
						'Status': mssql.VarChar(50),
						'YESNO': mssql.VarChar(4),
						'Grade': mssql.VarChar(50),
						'NamriaID': mssql.VarChar(50),
						'PerSal': mssql.VarChar(50)
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO SERV 
					(EMP_ID,
					START_D,
					END_D, 
					POS_TITLE,
					OFFICE_M,
					SALARY_A,
					STAT_APPT,
					GOV_PRIV,
					SALARY_G,
					PERSAL) 
					VALUES 
					(@NamriaID,
					@StartDate,
					@EndDate,
					@Position,
					@Office,
					@Salary,
					@Status,
					@YESNO,
					@Grade,
					@PerSal)
					*/});
					
					async.forEachSeries(p.experience, function(e, callback){
						var values = {
							StartDate: new Date(e.wrkExFrm), 
							EndDate: new Date(e.wrkExTo), 
							Position: e.wrkExPos, 
							Office: e.wrkExOff,
							Salary: e.wrkExMonSal,
							Status: e.wrkExAppt,
							YESNO: e.wrkExGovServ,
							Grade: e.wrkExSalGrd,
							PerSal: '2',
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('SERV: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('SERV: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				
				//Delete VOL_ORG
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM VOL_ORG WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('VOL_ORG: Deleted Successfully');
				},
				
				//Update VOL_ORG
				function(callback){	
					
					var paramDef = {
						'DateFrom': mssql.VarChar(50),
						'DateTo': mssql.VarChar(50),
						'OrgName': mssql.VarChar(50),
						'VHours': mssql.VarChar(50),
						'Position': mssql.VarChar(50),
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO VOL_ORG 
					(EMP_ID,
					ORG_NAME,
					FR_DATE,
					TO_DATE,
					NO_HRS,
					POSITION
					) 
					VALUES 
					(@NamriaID,
					@OrgName,
					@DateFrom,
					@DateTo,
					@VHours,
					@Position
					)
					*/});
					
					async.forEachSeries(p.voluntary, function(v, callback){
						var voluntaryHours;
						if (v.volHours == '')
						{
							voluntaryHours = 0;
						}
						else
						{
							voluntaryHours = v.volHours;
						}
						var values = {
							DateFrom: v.volFrm, 
							DateTo: v.volTo, 
							OrgName: v.volOrg, 
							VHours: voluntaryHours,
							Position: v.volPos,
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('VOL_ORG: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('VOL_ORG: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				//Delete TRAINEMP
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM TRAINEMP WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('TRAINEMP: Deleted Successfully');
				},
				
				//Update TRAINEMP
				function(callback){	
					var paramDef = {
						'Title': mssql.VarChar(100),
						'DateStart': mssql.Date,
						'DateEnd': mssql.Date,
						'NumberOfHours': mssql.Int,
						'SponsoredBy': mssql.VarChar(30),
						'NamriaID': mssql.VarChar(7)
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO TRAINEMP 
					(EMP_ID,
					COURSE_M,
					DATE_START,
					DATE_END, 
					HOURS,
					SPONSOR) 
					VALUES 
					(@NamriaID,
					@Title,
					@DateStart,
					@DateEnd,
					@NumberOfHours,
					@SponsoredBy)
					*/});
					
					async.forEachSeries(p.training, function(t, callback){
						
						var values = {
							Title:t.titleOfSeminar,
							DateStart: new Date(t.trainingFrom), 
							DateEnd: new Date(t.trainingTo), 
							NumberOfHours: t.numberOfHours, 
							SponsoredBy: t.conductedBy,
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('TRAINEMP: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('TRAINEMP: Updated Successfully');	
									callback(null);
								}
							}
						);
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				
				//Delete SP_SKILL
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM SP_SKILL WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('SP_SKILL: Deleted Successfully');
				}, 
				
				//Update SP_SKILL
				function(callback){	
					
					var paramDef = {
						'specialSkill': mssql.VarChar(100),
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = "INSERT INTO sp_skill (EMP_ID,[skills]) VALUES (@NamriaID,@specialSkill)";
					async.forEachSeries(p.skills, function(ss, callback){
						var spSkills = ss.sSkills;
						
						var values = {
							specialSkill:spSkills, 
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('SP_SKILL: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('SP_SKILL: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);	
					
				},
				
				//Delete NON_ACAD
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM NON_ACAD WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('NON_ACAD: Deleted Successfully');	
				},
				
				//UPDATE NON_ACAD
				function(callback){	
					
					var paramDef = {
						'Recognition': mssql.VarChar(100),
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = "INSERT INTO NON_ACAD(emp_id, [distinct]) VALUES (@NamriaID,@Recognition)";
					
					async.forEachSeries(p.recognition, function(r, callback){
						var recog = r.recog;
						
						var values = {
							Recognition:recog, 
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('NON_ACAD: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('NON_ACAD: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				//Delete MEM_ORG
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM MEM_ORG WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('MEM_ORG: Deleted Successfully');
				},
				
				//Update MEM_ORG
				function(callback){	
					
					var paramDef = {
						'Organization': mssql.VarChar(100),
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = "INSERT INTO MEM_ORG (EMP_ID,A_ORG) VALUES (@NamriaID,@Organization)";
					
					async.forEachSeries(p.organization, function(o, callback){
						var org = o.org;
						
						var values = {
							Organization:org, 
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('MEM_ORG: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('MEM_ORG: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				//Delete REF
				function(callback){	
					var paramDef= {
						'NamriaID': mssql.VarChar(50)
					};
					var sql="DELETE FROM REF WHERE EMP_ID=@NamriaID";
					
					var values = {
						NamriaID:p.NID
					};
					query2(	connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback(err);
					});
					console.log('REF: Deleted Successfully');
				},  
				
				//Update REF
				function(callback){	
					
					
					
					var paramDef = {
						'referenceName': mssql.VarChar(50),
						'referenceAddress': mssql.VarChar(100),
						'referenceTel': mssql.VarChar(50),
						'NamriaID': mssql.VarChar(50)
					};
					
					var sql = MultilineWrapper(function(){/*
					INSERT INTO REF 
					(EMP_ID,REFNAME,REF_ADDR,TEL_NO) 
					VALUES 
					(@NamriaID,@referenceName,@referenceAddress,@referenceTel)
					*/});
					
					async.forEachSeries(p.charReference, function(charRef, callback){
						var values = {
							referenceName:charRef.cName,
							referenceAddress:charRef.cAdd,
							referenceTel:charRef.cNum,
							NamriaID:p.NID
						};
						query2(connection, 
							sql, 
							paramDef, 
							values,
							function(err, rs){
								if(err)
								{
									console.log('REF: Update Failed!');
									callback(new Error(err));
								}
								else
								{
									console.log('REF: Updated Successfully');	
									callback(null);
								}
							}
						);
						
					},
					function(err)
					{
						callback();
					}
					);
					
				},
				
				//Update CHK_LIST
				
				function(callback){	
					var paramDef = {
						'National': mssql.Bit,
						'NationalRemarks': mssql.VarChar(50),
						'Local': mssql.Bit,
						'LocalRemarks': mssql.VarChar(50),
						'Charged': mssql.Bit,
						'ChargedRemarks': mssql.VarChar(50),
						'Offense': mssql.Bit,
						'OffenseRemarks': mssql.VarChar(50),
						'Violation': mssql.Bit,
						'ViolationRemarks': mssql.VarChar(50),
						'Separated': mssql.Bit,
						'SeparatedRemarks': mssql.VarChar(50),
						'Candidate': mssql.Bit,
						'CandidateRemarks': mssql.VarChar(50),
						'Indigenous': mssql.Bit,
						'IndigenousRemarks': mssql.VarChar(50),
						'Abled': mssql.Bit,
						'AbledRemarks': mssql.VarChar(50),
						'Solo': mssql.Bit,
						'SoloRemarks': mssql.VarChar(50),
						'NamriaID': mssql.VarChar(255)
					};
					
					var sql = MultilineWrapper(function(){/*
					UPDATE CHK_LIST SET 
					deg_3=@National,
					deg_3r=@NationalRemarks,
					deg_4=@Local,
					deg_4r=@LocalRemarks,
					charged=@Charged,
					charged_r=@ChargedRemarks,
					admin=@Offense,
					admin_r=@OffenseRemarks,
					crime=@Violation,
					crime_r=@ViolationRemarks,
					retire=@Separated,
					retire_r=@SeparatedRemarks,
					elect=@Candidate,
					elect_r=@CandidateRemarks,
					ind_g=@Indigenous,
					ind_r=@IndigenousRemarks,
					dif_a=@Abled,
					dif_r=@AbledRemarks,
					solo=@Solo,
					solo_r=@SoloRemarks
					WHERE EMP_ID=@NamriaID
					*/});
					
					var values = {
						National:p.national,
						NationalRemarks:p.nationalRemarks,
						Local:p.local,
						LocalRemarks:p.localRemarks,
						Charged:p.charged,
						ChargedRemarks:p.chargedRemarks,
						Offense:p.offense,
						OffenseRemarks:p.offenseRemarks,
						Violation:p.violation,
						ViolationRemarks:p.violationRemarks,
						Separated:p.separated,
						SeparatedRemarks:p.separatedRemarks,
						Candidate:p.candidate,
						CandidateRemarks:p.candidateRemarks,
						Indigenous:p.indigenous,
						IndigenousRemarks:p.indigenousRemarks,
						Abled:p.abled,
						AbledRemarks:p.abledRemarks,
						Solo:p.solo,
						SoloRemarks:p.soloRemarks,
						NamriaID:p.NID
					};
					query2(connection, 
						sql, 
						paramDef, 
						values,
						function(err, rs){
							callback();
					});
					
					console.log('CHK_LIST: Updated Successfully');	
				}
				

			],
			function (err) {
				if(err)
				{res.json(err);}
				console.log("xxxxxxxxxxx", err);
				res.json({success: true});
			});
			
		});	
	});
	
	
	// read a record using NAMRIA ID
	app.get('/employees/:name', function(req, res){
		
		var ad_account = req.params.name;
		var employee;
		
		var connection = new mssql.Connection(config, function(err) {
			 
			async.series([
				// basic profile 
				function(callback){	
					query(connection, "SELECT DISTINCT FIRST_M as firstName, MIDDLE_M as middleName, LAST_M as surName, name_extension as nameExtension, Sex_C as sex, civil_stat as civilStatus, BIRTH_DATE AS dateOfBirth, BIRTH_PROV AS placeOfBirth,CITIZEN as citizenship,HEIGHT as height,[WEIGHT] as weight,BLOOD_T as bloodType, id_picture as picture, EMP_DTL.EMP_ID as NID,TIN,GSIS_ID_NO as GSIS,PAG_IBIG as PAGIBIG,PH_NO as PHILHEALTH,SSS_NO as SSS,EMAIL as eMail,CEL_NO as cellphone,ADDR_ST as resAdd ,ADDR_MUN as resBrgy,ADDR_PROV as resCity, ADDR_ZP as resZip, TEL_NO as resTel, PADDR_ST as perAdd,PADDR_MUN as perBrgy,PADDR_PROV as perCity, PADDR_ZP as perZip, PTEL_NO as perTel,F_FIRST as fatFirstname, F_MIDDLE as fatMiddlename, F_LAST as fatSurname,M_FIRST as motFirstname, M_MIDDLE as motMiddlename, M_LAST as motSurname,S_FIRST as spFirstname, S_MIDDLE as spMiddlename, S_LAST as spSurname,SPOUSE_OCC as spOccu, BUS_NAME as spEmployer, BUS_ADD as spBusAdd, BUS_TEL as spBusTel, CTC_NO as taxNo, CTC_PLACE as issuedAt, CTC_DATE as issuedDate, PDS_ACCOMP as dateAccomplished FROM EMP_DTL LEFT OUTER JOIN plant ON EMP_DTL.EMP_ID = plant.emp_id WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee = rs[0];
						if(employee==null)
						{
							callback(new Error('Record not found!'));
							return;
						}
						
						callback();
					});
				},
				// training
				function(callback){
					query(connection, "SELECT COURSE_M as titleOfSeminar, SPONSOR as conductedBy, DATE_START AS trainingFrom, DATE_END AS trainingTo, HOURS AS numberOfHours FROM plant LEFT OUTER JOIN TRAINEMP ON plant.emp_id = TRAINEMP.EMP_ID WHERE plant.AD_ACCOUNT = @param ORDER BY TRAINEMP.DATE_START DESC",{param:ad_account}, function(rs){										
						employee.trainings = rs;
						callback();
					});
				},
				//eligibility	
				function(callback){			
					query(connection, "SELECT DISTINCT EXAM_T as eligTitle, EXAM_MM +'/' + EXAM_DD + '/' + EXAM_YY as eligDate, EXAM_PLACE as eligPlace, rating as eligRating FROM plant LEFT OUTER JOIN ELIG ON plant.emp_id = ELIG.EMP_ID WHERE plant.AD_ACCOUNT=@param",{param:ad_account}, function(rs){
						employee.eligibility = rs;
						callback();
					});
				},
				//children
				function(callback){
					query(connection, "SELECT DISTINCT CHILD_NAME as fullName, CHILD_BDAY as dateOfBirth FROM plant LEFT OUTER JOIN CHILD ON plant.emp_id = CHILD.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
							employee.children = rs;
						callback();
					});
				},
				// education
				function(callback){
					query(connection, "SELECT LEVEL_C as level, INSTITUTE as schoolName, DEGREE_C as degree, COURSE_C as course, Y_GRAD as yearGraduated, UNITS as highestGrade, START_YEAR as fromDate, END_YEAR as toDate, HONORS_T as scholarship FROM plant LEFT OUTER JOIN EDUC ON plant.emp_id = EDUC.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.education = rs;
						callback();
					});
				},
				//work experience
				function(callback){
					query(connection, "SELECT START_D as wrkExFrm, END_D as wrkExTo, POS_TITLE as wrkExPos, OFFICE_M as wrkExOff, SALARY_A as wrkExMonSal, PERSAL as wrkExPerSal, SERV.STAT_APPT as wrkExAppt, SALARY_G as wrkExSalGrd, GOV_PRIV as wrkExGovServ FROM plant LEFT OUTER JOIN SERV ON plant.emp_id = SERV.EMP_ID WHERE plant.AD_ACCOUNT = @param ORDER BY SERV.START_D DESC",{param:ad_account}, function(rs){
						employee.experience = rs;
						callback();
					});
				},
				//voluntary works
				function(callback){
					query(connection, "SELECT org_name as volOrg, fr_date as volFrm, to_date as volTo, no_hrs as volHours, [position] as volPos FROM plant LEFT OUTER JOIN VOL_ORG ON plant.emp_id = VOL_ORG.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.voluntary = rs;
						callback();
					});
				},
				//skills
				function(callback){
					query(connection, "SELECT skills as sSkills FROM plant LEFT OUTER JOIN sp_skill ON plant.emp_id = sp_skill.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.skills = rs;
						callback();
					});
				},
				//recognition 
				function(callback){
					
					query(connection, "SELECT [distinct] as recog FROM plant LEFT OUTER JOIN non_acad ON plant.EMP_ID = non_acad.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.recognition = rs;
						callback();
					});
				}, 
				//organization
				function(callback){
					query(connection, "SELECT a_org as org FROM plant LEFT OUTER JOIN mem_org ON plant.EMP_ID = mem_org.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.organization = rs;
						callback();
					});
				},
				//others
				function(callback){
					query(connection, "SELECT [deg_3] as [national],[deg_4] as [local],[deg_3r] as nationalRemarks,[deg_4r] as localRemarks,[charged] as [charged],[charged_r] as chargedRemarks,[admin] as [offense],[admin_r] as offenseRemarks,[crime] as [violation],[crime_r] as violationRemarks,[retire] as [separated],[retire_r] as separatedRemarks,[elect] as [candidate],[elect_r] as candidateRemarks,[ind_g] as [indigenous],[ind_r] as indigenousRemarks,[dif_a] as [abled],[dif_r] as abledRemarks,[solo],[solo_r] as soloRemarks FROM plant LEFT OUTER JOIN chk_list ON plant.EMP_ID = chk_list.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.others = rs[0];
						callback();
					});
				},
				//reference
				function(callback){
					query(connection, "SELECT REFNAME as cName,REF_ADDR as cAdd, TEL_NO as cNum FROM plant LEFT OUTER JOIN REF ON plant.emp_id = REF.EMP_ID WHERE plant.AD_ACCOUNT = @param",{param:ad_account}, function(rs){
						employee.charReference = rs;
						callback();
					});
				}
			],
			function (err) {
				if(err)
					res.json(err);
				res.json(employee);
			});
		});
	});
	
	function query(conn,sql,param,callback){
		var ps = new mssql.PreparedStatement(conn);
		ps.input('param', mssql.VarChar(50));
		ps.prepare(sql, function(err){
			ps.execute(param, function(err, rs) {
				ps.unprepare(function(err) {
                        
				});
				callback(rs);
			});
		});
	}
	
	function query2(conn,sql,paramDef, paramVal, callback){
		var ps = new mssql.PreparedStatement(conn);
		for(var i in paramDef){
			ps.input(i, paramDef[i]);
		}
		
		ps.prepare(sql, function(err){
			ps.execute(paramVal, function(err, rs) {
				
				ps.unprepare(function(err) {
                        
				});
				if(err)
					console.log(err);
				callback(err, rs);
			});
		});
	}
	
	function query3(sql,paramDef, paramVal, callback){
		
		var conn = new mssql.Connection(config, function(err){
			var ps = new mssql.PreparedStatement(conn);
			for(var i in paramDef){
				ps.input(i, paramDef[i]);
			}
			
			ps.prepare(sql, function(err){
				ps.execute(paramVal, function(err, rs) {
					ps.unprepare(function(err) {
                        
					});
					if(err)
						console.log(err);
					callback(err, rs);
				});
			});
		
		});
		
	}
	
	//Get data from apps
	app.get('/employees', function(req, res){
		var personnelData = req.body.personnelInfo;
	});

}

function startServer(){

	setAuthentication();
	setRoutes();
	
	app.use('/', express.static(__dirname + '/../static'));
	app.use('/', express.static(__dirname + '/../api'));
	var server = app.listen(port, function(){
		console.log('Listening on port %d', server.address().port);
	});
}