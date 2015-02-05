
Ext.define('Wizard', {
	
	alias: 'widget.wizard',
	extend: 'Ext.tab.Panel',
	requires:['Ext.util.*'],
	tbar: [
		'->',
		{
			xtype: 'button',
			text: 'Save',
			handler: function(){
				var me = this.up('wizard');
				var personnel = me.getFormData();
				Ext.Ajax.request({
					url: '/testUpdate',
					method: 'GET'
				}); 
				//Send the personnel data to server.js
				Ext.Ajax.request({
					url: '/testUpdate',
					method: 'POST',
					jsonData: {
						personnelInfo: personnel
					},
					success: function(response){
						Ext.Msg.alert('Success', 'Employee record has been updated!');
					},
					failure: function(response){
						console.log(response.statusText);
						Ext.Msg.alert('Error', response.statusText);
						
					}
				
				}); 
			}
		},
		{
			xtype: 'button',
			text: 'Print ePDS',
			handler: function(){
				var me = this.up('wizard');
				var personnel = me.getFormData();
				var dataForPDF = me.mapData(personnel);
				//console.log(dataForPDF);
				//Send the personnel data to server.js for pdf printing
				Ext.Ajax.request({
					url: '/testpdf',
					method: 'POST',
					
					jsonData: {
						personnelPDF: dataForPDF
					},
					success: function(response){
						window.open('http://localhost:1210/'+response.responseText, '_blank');
						
					},
					failure: function(response){
						console.log(response.statusText);
						Ext.Msg.alert('Error', response.statusText);
					}  
				
				});
				
			}
		}, 
		'-',
		/* {
			xtype: 'textfield',
			fieldLabel: 'Search NAMRIA ID',
			labelWidth:140,
			itemId:'txtSearch'
		}, 
		{
			xtype: 'button',
			text: 'Search',
			handler: function(){
				var me = this.up('wizard');
				var NamriaID = me.down('#txtSearch').getValue();
				
				me.getEmployee(NamriaID);
				
			}
		}, */
		{
			xtype: 'button',
			text: 'Logout',
			handler: function(){
				Ext.Ajax.request({
					url: '/logout',
					method: 'GET',
					success: function(response){
						
						location.href = '/epds';
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.status);
						console.log(response.status);
					}
				 
				});
			}
		} 
		
	],
	loadFormData: function(p){
		var me = this;

		
		me.down('#txtSurname').setValue(p.surName);
		me.down('#txtFirstname').setValue(p.firstName);
		me.down('#txtMiddlename').setValue(p.middleName);
		me.down('#txtNameExtension').setValue(p.nameExtension);
		me.down('#dteDateofBirth').setValue(new Date(p.dateOfBirth));
		//var outputDate = Ext.Date.format(new Date(p.dateOfBirth), 'm/d/Y');
		//console.log(outputDate);
		me.down('#txtPlaceofBirth').setValue(p.placeOfBirth);
		me.down('#cboSex').setValue(p.sex);
		me.down('#cboCivilStatus').setValue(p.civilStatus);
		me.down('#txtCitizenship').setValue(p.citizenship);
		me.down('#txtHeight').setValue(p.height);
		me.down('#txtWeight').setValue(p.weight);
		me.down('#txtBloodType').setValue(p.bloodType);
		if (p.picture===null)
		{
			var pic ='data:image/png;base64,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';
			me.down('#imageViewer').setSrc(pic);
		}
		else if (p.picture!==null)
		{
			var pic = p.picture;
			me.down('#imageViewer').setSrc(pic);
		}
		
		//me.down('#imageViewer').setSrc(p.picture);
		me.down('#txtNID').setValue(p.NID);
		me.down('#txtTIN').setValue(p.TIN);
		me.down('#txtGSIS').setValue(p.GSIS);
		me.down('#txtPagIbig').setValue(p.PAGIBIG);
		me.down('#txtPhilH').setValue(p.PHILHEALTH);
		me.down('#txtSSS').setValue(p.SSS);
		me.down('#txtEmail').setValue(p.eMail);
		me.down('#txtCp').setValue(p.cellphone);
		me.down('#txtResAdd').setValue(p.resAdd);
		me.down('#txtResZip').setValue(p.resZip);
		me.down('#txtResTel').setValue(p.resTel);
		me.down('#txtPerAdd').setValue(p.perAdd);
		me.down('#txtPerZip').setValue(p.perZip);
		me.down('#txtPerTel').setValue(p.perTel);
		me.down('#txtSpSurname').setValue(p.spSurname);
		me.down('#txtSpFirstname').setValue(p.spFirstname);
		me.down('#txtSpMiddlename').setValue(p.spMiddlename);
		me.down('#txtSpOccu').setValue(p.spOccu);
		me.down('#txtSpEmp').setValue(p.spEmployer);
		me.down('#txtSpBus').setValue(p.spBusAdd);
		me.down('#txtSpBusTel').setValue(p.spBusTel);
		
		var grid = me.down('#gridChildren');
		grid.getStore().removeAll();
		// load children
		for(item in p.children){
			var child = p.children[item];
			grid.getStore().add({
				name: child.fullName,
				dob:  new Date(child.dateOfBirth)
			});
		}
		
		me.down('#txtFatSurname').setValue(p.fatSurname);
		me.down('#txtFatFirstname').setValue(p.fatFirstname);
		me.down('#txtFatMiddlename').setValue(p.fatMiddlename);
		me.down('#txtMotSurname').setValue(p.motSurname);
		me.down('#txtMotFirstname').setValue(p.motFirstname);
		me.down('#txtMotMiddlename').setValue(p.motMiddlename);
		
		// load education
		var grid1 = me.down('#gridEducation');
		grid1.getStore().removeAll();
		
		for(item in p.education){
			var educ = p.education[item];
		
			grid1.getStore().add({
				Level: educ.level,
				NameofSchool: educ.schoolName,
				Degree:educ.degree,
				Course: educ.course,
				YearGraduated: educ.yearGraduated,
				HighestGrade: educ.highestGrade,
				FromDate: educ.fromDate,
				ToDate: educ.toDate,
				Scholarship: educ.scholarship
			});
		}
		
		// load eligibility
		var grid2 = me.down('#gridCSE');
		grid2.getStore().removeAll();
		
		for(item in p.eligibility){
			var cse = p.eligibility[item];
			grid2.getStore().add({
				CseCareer: cse.eligTitle,
				CseRating: cse.eligRating,
				CseDate: cse.eligDate,
				CsePlace: cse.eligPlace,
				CseNumber: cse.eligLicenseNumber,
				CseDor: cse.eligDateOfRelease
			});
			
		}
		
		// load training
		var grid3 = me.down('#gridTraining');
		grid3.getStore().removeAll();
		
		for(item in p.trainings){
			var train = p.trainings[item];
			grid3.getStore().add({
				TitleofSeminar: train.titleOfSeminar,
				TrainingFrom: new Date(train.trainingFrom),
				TrainingTo: new Date(train.trainingTo),
				NumberofHours: train.numberOfHours,
				ConductedBy: train.conductedBy
			});
			
		}
		
		//load work experience
		var grid4 = me.down('#gridWE');
		grid4.getStore().removeAll();
		
		for(item in p.experience){
			var exp = p.experience[item];
			
			//Salary Computation
			var monthlySalary;
			if (exp.wrkExPerSal=='1')//Annually
			{
				monthlySalary = exp.wrkExMonSal/12;
			}
			if (exp.wrkExPerSal=='2')//Monthly
			{
				monthlySalary = exp.wrkExMonSal;
			}
			if (exp.wrkExPerSal=='3')//Daily
			{
				monthlySalary = (exp.wrkExMonSal*22)*12;
			}
			
			//Appointment Status
			var appointmentStatus;
			if (exp.wrkExAppt=='1')
			{
				appointmentStatus = 'Permanent';
			}
			else if (exp.wrkExAppt=='2')
			{
				appointmentStatus = 'Temporary';
			}
			else if (exp.wrkExAppt=='3')
			{
				appointmentStatus = 'Probitionary';
			}
			else if (exp.wrkExAppt=='4')
			{
				appointmentStatus = 'Co-Terminus';
			}
			else if (exp.wrkExAppt=='5')
			{
				appointmentStatus = 'Contractual';
			}
			else if (exp.wrkExAppt=='6')
			{
				appointmentStatus = 'Casual';
			}
			
			grid4.getStore().add({
				workExFrom:  new Date(exp.wrkExFrm),
				workExTo: new Date(exp.wrkExTo),
				workExPosition:exp.wrkExPos,
				workExDep: exp.wrkExOff,
				workExMnth:monthlySalary,
				workExSal: exp.wrkExSalGrd,
				workExStat:appointmentStatus,
				workExGovt:exp.wrkExGovServ
			});
			
		}
		
		//load voluntary works
		var gridVoluntary = me.down('#gridVW');
		gridVoluntary.getStore().removeAll();
		['VwName', 'VwFrom', 'VwTo', 'VwNumbers', 'VwPosition']
		for(item in p.voluntary){
			var v = p.voluntary[item];
			grid6.getStore().add({
				VwName: v.org_name,
				VwFrom: v.fr_date,
				VwTo: v.to_date,
				VwNumbers: v.no_hrs,
				VwPosition: v.position
			});
		}
		
		// load skills
		var grid5 = me.down('#gridSkills');
		grid5.getStore().removeAll();
		
		for(item in p.skills){
			var s = p.skills[item];
			grid5.getStore().add({
				SpecialSkills: s.sSkills
				
			});
			
		}
		/* //if skills came from emp_dtl table
		console.log(p.skills[0].sSkills);
		var s = p.skills[0].sSkills;
		
		if (s!=='null')
		{
			var output = s.split(',');
			
			for(item in output){
				grid5.getStore().add({
					SpecialSkills: output[item]
				});
			}
		}
		else if (s=='null')
		{
			SpecialSkills:s;
		} */
		
		// load recognition
		var grid6 = me.down('#gridRecognition');
		grid6.getStore().removeAll();
		
		for(item in p.recognition){
			var r = p.recognition[item];
			grid6.getStore().add({
				TitleofRecognition: r.recog
			});
		}
		
		var grid7 = me.down('#gridOrganization');
		grid7.getStore().removeAll();
		// load organization
		for(item in p.organization){
			var o = p.organization[item];
			grid7.getStore().add({
				NameofOrganization: o.org
			});
		}
		me.down('#txtThirdDegree').setValue(p.others.nationalRemarks);
		me.down('#txtFourthDegree').setValue(p.others.localRemarks);
		me.down('#txtCharged').setValue(p.others.chargedRemarks);
		me.down('#txtAdministrative').setValue(p.others.offenseRemarks);
		me.down('#txtConvicted').setValue(p.others.violationRemarks);
		me.down('#txtSeparated').setValue(p.others.separatedRemarks);
		me.down('#txtElection').setValue(p.others.candidateRemarks);
		me.down('#txtIndigenous').setValue(p.others.indigenousRemarks);
		me.down('#txtAbled').setValue(p.others.abledRemarks);
		me.down('#txtSolo').setValue(p.others.soloRemarks);
		me.down('#national').setValue(p.others.national);
		me.down('#local').setValue(p.others.local);
		me.down('#charged').setValue(p.others.charged);
		me.down('#offense').setValue(p.others.offense);
		me.down('#violation').setValue(p.others.violation);
		me.down('#separated').setValue(p.others.separated);
		me.down('#candidate').setValue(p.others.candidate);
		me.down('#indigenous').setValue(p.others.indigenous);
		me.down('#abled').setValue(p.others.abled);
		me.down('#solo').setValue(p.others.solo);
		
		var grid8 = me.down('#gridReference');
		grid8.getStore().removeAll();
		// load reference
		for(item in p.charReference){
			var c = p.charReference[item];
			grid8.getStore().add({
				cReference: c.cName, 
				Address: c.cAdd, 
				cNumber: c.cNum
				
			});
		}
		me.down('#txtCertificate').setValue(p.taxNo);
		me.down('#txtIssuedAt').setValue(p.issuedAt);
		me.down('#dteIssuance').setValue(new Date(p.issuedDate));
		me.down('#dteDateAccomplished').setValue(new Date(p.dateAccomplished));
		
	}, 
	getFormData: function(){
		var me = this;
		var personnel = {
			surName: me.down('#txtSurname').getValue(),
			firstName: me.down('#txtFirstname').getValue(),
			middleName: me.down('#txtMiddlename').getValue(),
			nameExtension: me.down('#txtNameExtension').getValue(),
			dateOfBirth: me.down('#dteDateofBirth').getValue(),
			placeOfBirth: me.down('#txtPlaceofBirth').getValue(),
			sex: me.down('#cboSex').getValue(),
			
			civilStatus: me.down('#cboCivilStatus').getValue(),
			citizenship: me.down('#txtCitizenship').getValue(),
			height: me.down('#txtHeight').getValue(),
			weight: me.down('#txtWeight').getValue(),
			bloodType: me.down('#txtBloodType').getValue(),
			picture: me.down('#txtImage').getValue(),
			NID: me.down('#txtNID').getValue(),
			TIN: me.down('#txtTIN').getValue(),
			GSIS: me.down('#txtGSIS').getValue(),
			PAGIBIG: me.down('#txtPagIbig').getValue(),
			PHILHEALTH: me.down('#txtPhilH').getValue(),
			SSS: me.down('#txtSSS').getValue(),
			eMail: me.down('#txtEmail').getValue(),
			cellphone: me.down('#txtCp').getValue(),
			resAdd: me.down('#txtResAdd').getValue(),
			resZip: me.down('#txtResZip').getValue(),
			resTel: me.down('#txtResTel').getValue(),
			perAdd: me.down('#txtPerAdd').getValue(),
			perZip: me.down('#txtPerZip').getValue(),
			perTel: me.down('#txtPerTel').getValue(),
			spSurname: me.down('#txtSpSurname').getValue(),
			spFirstname: me.down('#txtSpFirstname').getValue(),
			spMiddlename: me.down('#txtSpMiddlename').getValue(),
			spOccu: me.down('#txtSpOccu').getValue(),
			spEmployer: me.down('#txtSpEmp').getValue(),
			spBusAdd: me.down('#txtSpBus').getValue(),
			spBusTel: me.down('#txtSpBusTel').getValue(),
			children: me.getChildren(),
			fatSurname: me.down('#txtFatSurname').getValue(),
			fatFirstname: me.down('#txtFatFirstname').getValue(),
			fatMiddlename: me.down('#txtFatMiddlename').getValue(),
			motSurname: me.down('#txtMotSurname').getValue(),
			motFirstname: me.down('#txtMotFirstname').getValue(),
			motMiddlename: me.down('#txtMotMiddlename').getValue(),
			education: me.getEducation(),
			eligibility:me.getEligibility(),
			experience: me.getWorkExperience(),
			training: me.getTraining(),
			skills: me.getSkills(),
			recognition: me.getRecognition(),
			organization: me.getOrganization(),
			nationalRemarks: me.down('#txtThirdDegree').getValue(),
			localRemarks: me.down('#txtFourthDegree').getValue(),
			chargedRemarks: me.down('#txtCharged').getValue(),
			offenseRemarks: me.down('#txtAdministrative').getValue(),
			violationRemarks: me.down('#txtConvicted').getValue(),
			separatedRemarks: me.down('#txtSeparated').getValue(),
			candidateRemarks: me.down('#txtElection').getValue(),
			indigenousRemarks: me.down('#txtIndigenous').getValue(),
			abledRemarks: me.down('#txtAbled').getValue(),
			soloRemarks: me.down('#txtSolo').getValue(),
			national: me.down('#national').getValue(),
			local: me.down('#local').getValue(),
			charged: me.down('#charged').getValue(),
			offense: me.down('#offense').getValue(),
			violation: me.down('#violation').getValue(),
			separated: me.down('#separated').getValue(),
			candidate: me.down('#candidate').getValue(),
			indigenous: me.down('#indigenous').getValue(),
			abled: me.down('#abled').getValue(),
			solo: me.down('#solo').getValue(),
			charReference: me.getCharRef(),
			taxNo:	me.down('#txtCertificate').getValue(),
			issuedAt: me.down('#txtIssuedAt').getValue(),
			issuedDate: me.down('#dteIssuance').getValue(),
			dateAccomplished: me.down('#dteDateAccomplished').getValue() 
		};
		return personnel;
		//console.log(JSON.stringify(personnel));
		
		
	},
	getChildren: function(){
		var me = this;
		var children = [];
		
		
		var grid = me.down('#gridChildren');
		
		grid.getStore().data.each(function(row) {
			children.push({ 
				fullName: row.data['name'], 
				dateOfBirth: row.data['dob'] 
			});
		});
		
		return children;
		
	},
	getEducation: function(){
		var me = this;
		var education = [];
		
		
		var grid = me.down('#gridEducation');
		
		grid.getStore().data.each(function(row) {
			education.push({ 
				level: row.data['Level'],
				schoolName: row.data['NameofSchool'],
				degree: row.data['Degree'],
				course: row.data['Course'],
				yearGraduated: row.data['YearGraduated'],
				highestGrade: row.data['HighestGrade'],
				fromDate: row.data['FromDate'],
				toDate: row.data['ToDate'],
				scholarship: row.data['Scholarship']
			});
		});
		
		return education;
		
	},
	getEligibility: function(){
		var me = this;
		var eligibility = [];
		
		
		var grid = me.down('#gridCSE');
		grid.getStore().data.each(function(row) {
			eligibility.push({ 
				eligTitle: row.data['CseCareer'], 
				eligRating: row.data['CseRating'],
				eligDate: row.data['CseDate'],
				eligPlace: row.data['CsePlace'],
				eligLicenseNumber: row.data['CseNumber'],
				eligDateOfRelease:row.data['CseDor']
				
			});
		});
		
		return eligibility;
	},
	getTraining: function(){
		var me = this;
		var training = [];
		
		
		var grid = me.down('#gridTraining');
		grid.getStore().data.each(function(row) {
			training.push({ 
				titleOfSeminar: row.data['TitleofSeminar'], 
				trainingFrom: row.data['TrainingFrom'],
				trainingTo: row.data['TrainingTo'],
				numberOfHours: row.data['NumberofHours'],
				conductedBy: row.data['ConductedBy']
			});
		});
		
		return training;
		
	},
	getWorkExperience: function(){
		var me = this;
		var experience = [];
		
		
		var grid = me.down('#gridWE');
		grid.getStore().data.each(function(row) {
			experience.push({ 
				wrkExFrm: row.data['workExFrom'], 
				wrkExTo: row.data['workExTo'],
				wrkExPos: row.data['workExPosition'],
				wrkExOff: row.data['workExDep'],
				wrkExMonSal: row.data['workExMnth'],
				wrkExSalGrd:row.data['workExSal'],
				wrkExAppt:row.data['workExStat'],
				wrkExGovServ:row.data['workExGovt']
			});
		});
		
		return experience;
	},
	getSkills: function(){
		var me = this;
		var skills = [];
		
		var grid = me.down('#gridSkills');
		grid.getStore().data.each(function(row) {
			skills.push({ 
				sSkills: row.data['SpecialSkills']
			});
		});
		
		return skills;
	},
	getRecognition: function(){
		var me = this;
		var recognition = [];
		
		var grid = me.down('#gridRecognition');
		grid.getStore().data.each(function(row) {
			recognition.push({ 
				recog: row.data['TitleofRecognition']
			});
		});
		
		return recognition;
	},
	getOrganization: function(){
		var me = this;
		var organization = [];
		
		var grid = me.down('#gridOrganization');
		grid.getStore().data.each(function(row) {
			organization.push({ 
				org: row.data['NameofOrganization']
			});
		});
		
		return organization;
	},
	getCharRef: function(){
		var me = this;
		var charReference = [];
		
		var grid = me.down('#gridReference');
		grid.getStore().data.each(function(row) {
			charReference.push({ 
				cName: row.data['cReference'],
				cAdd: row.data['Address'],
				cNum: row.data['cNumber']
			});
		});
		
		return charReference;
	},
	//function for mapping
	mapData:function(p){
		var m = {};
		m.PISN = p.surName;
		m.PIFN = p.firstName;
		m.PIMN = p.middleName;
		m.PIEX = p.nameExtension;
		m.PIDOB = Ext.Date.format(new Date(p.dateOfBirth), 'm/d/Y');
		m.PIPOB = p.placeOfBirth;
		m.PICITIZENSHIP = p.citizenship;
		m.PIHEIGHT = p.height;
		m.PIWEIGHT = p.weight;
		m.PIBLOODTYPE = p.bloodType;
		m.PIAEN = p.NID;
		m.PHOTO = p.picture;
		m.PITIN = p.TIN;
		m.PIGSIS = p.GSIS;
		m.PIPAGIBIG = p.PAGIBIG;
		m.PIPH = p.PHILHEALTH;
		m.PISSS = p.SSS;
		m.PIEA = p.eMail;
		m.PICPN = p.cellphone;
		m.PIRA = p.resAdd;
		m.PIZC = p.resZip;
		m.PITELNO = p.resTel;
		m.PIPADDRESS = p.perAdd;
		m.PIZCODE = p.perZip;
		m.PITELNO = p.perTel;
		m.FBSPOUSESURNAME = p.spSurname;
		m.FBFIRSTNAME = p.spFirstname;
		m.FBMIDDLENAME = p.spMiddlename;
		m.FBOCCUPATION = p.spOccu;
		m.FBEMPLOYERBUSNAME = p.spEmployer;
		m.FBBUSINESSADDRESS = p.spBusAdd;
		m.FBTELEPHONENO = p.spBusTel;
		m.FBFS = p.fatSurname;
		m.FBFN = p.fatFirstname;
		m.FBMN = p.fatMiddlename;
		m.FBMS = p.motSurname;
		m.FBMFN = p.motFirstname;
		m.FBMMN = p.motMiddlename;
		m.CTCN = p.taxNo;
		m.IA = p.issuedAt;
		m.IO = p.issuedDate;
		
		//EDUCATION
			//console.log(p.education);
		/* for(var educ in p.education){
		console.log (p.education[0].level);
			if (p.education[educ].level == '5'){			
				m.NOS0 = p.education[educ].schoolName;
				m.YEARGRADUATED0 = p.education[educ].yearGraduated;
				m.HIGHESTGRADE0 = p.education[educ].highestGrade;
				m.EBFROM0 = p.education[educ].fromDate;
				m.EBTO0 = p.education[educ].toDate;
				m.EBSCHOLARSHIP0 = p.education[educ].scholarship;
			}
			if (p.education[educ].level == '4'){
				m.NOS1 = p.education[educ].schoolName;
				m.YEARGRADUATED1 = p.education[educ].yearGraduated;
				m.HIGHESTGRADE1 = p.education[educ].highestGrade;
				m.EBFROM1 = p.education[educ].fromDate;
				m.EBTO1 = p.education[educ].toDate;
				m.EBSCHOLARSHIP1 = p.education[educ].scholarship;
			}
		} */
		//OTHER INFO
		//MATIONAL REMARKS
		if (p.national == true) {
			m.NATIONAL = p.nationalRemarks;
		}
		else {
			 m.NO0 = p.national; 
		}
		//LOCAL REMARKS
		if (p.local == true){
			m.LOCAL = p.localRemarks;
		}
		else {
			m.NO1 = p.local;
		}
		//CHARGED REMAARKS
		if (p.charged == true){
			m.CHARGED = p.chargedRemarks;
		}
		else {
			m.NO2 = p.charged;
		}
		//OFFENSE REMARKS
		if (p.offense == true){
			m.OFFENSE = p.offenseRemarks;
		}
		else {
			m.NO3 = p.offense;
		}
		//violation
		if (p.violation == true){
			m.VIOLATION = p.violationRemarks;
		}
		else {
			m.NO4 = p.violation;
		}
		//separated
		if (p.separated == true){
			m.SEPARATED = p.separatedRemarks;
		}
		else {
			m.NO5 = p.separated;
		}
		//candidate
		if (p.candidate == true){
			m.CANDIDATE = p.candidateRemarks;
		}
		else {
			m.NO6 = p.candidate;
		}
		//indigenous
		if (p.indigenous == true){
			m.INDIGENOUS = p.indigenousRemarks;
		}
		else {
			m.NO7 = p.indigenous;
		}
		//abled
		if (p.abled == true){
			m.ABLED = p.abledRemarks;
		}
		else {
			m.NO8 = p.abled;
		}
		//solo
		if (p.solo == true){
			m.SOLO = p.soloRemarks;
		}
		else {
			m.NO9 = p.solo;
		}
		//SEX	
		 if (p.sex == '1') {
			m.PIM = p.sex;
		}
			if (p.sex == '2') {
			m.PIF = p.sex;
		}
		//CIVIL STATUS
		 if (p.civilStatus == '1') {
			m.CSS = p.civilStatus;
		}
		if (p.civilStatus == '2') {
		m.CSM = p.civilStatus;
		}
		if (p.civilStatus == '3') {
			m.CSSE = p.civilStatus;
		}
		if (p.civilStatus == '4') {
			m.CSW = p.civilStatus;
		}
		//eligibility
		for(var elig in p.eligibility){
			m['CSE' + elig] = p.eligibility[elig].eligTitle;
			m['RATING' + elig] = p.eligibility[elig].eligRating;
			m['CSEDEC' + elig] = p.eligibility[elig].eligDate;
			m['CSEPEC' + elig] = p.eligibility[elig].eligPlace;
			m['CSELN' + elig] = p.eligibility[elig].eligLicenseNumber;
			m['CSEDOR' + elig] = p.eligibility[elig].eligDateOfRelease;
		}
		//WORK EXPERIENCE
		for(var work in p.experience){
			m['WEFROM' + work] = Ext.Date.format(new Date(p.experience[work].wrkExFrm),'m/d/Y');
			m['WETO' + work] = Ext.Date.format(new Date(p.experience[work].wrkExTo),'m/d/Y');
			m['WEPOSITION' + work] = p.experience[work].wrkExPos;
			m['WEDAOC' + work] = p.experience[work].wrkExOff;
			m['WEMS' + work] = p.experience[work].wrkExMonSal;
			m['WESG' + work] = p.experience[work].wrkExSalGrd;
			m['WESA' + work] = p.experience[work].wrkExAppt;
			m['WEGS' + work] = p.experience[work].wrkExGovServ;
		}	
		
		//VOLUNTARY WORK
		for(var volwork in p.workExperience){
			m['VWNA' + volwork] = p.workExperience[volwork].VwName;
			m['VWFROM' + volwork] = p.workExperience[volwork].VwFrom;
			m['VWTO' + volwork] = p.workExperience[volwork].VwTo;
			m['VWNOH' + volwork] = p.workExperience[volwork].VwNumbers;
			m['VWPNW' + volwork] = p.workExperience[volwork].VwPosition;			
		}		
		//traning program
		for(var trainings in p.training){
			m['TPTOS' + trainings] = p.training[trainings].titleOfSeminar;
			m['TPFROM' + trainings] = Ext.Date.format(new Date(p.training[trainings].trainingFrom),'m/d/Y');
			m['TPTO' + trainings] = Ext.Date.format(new Date(p.training[trainings].trainingTo),'m/d/Y');
			m['TPNOH' + trainings] = p.training[trainings].numberOfHours;
			m['TPCS' + trainings] = p.training[trainings].conductedBy;			
		}
	
		//skills
		for(var skill in p.skills){
			m['OISS' + skill] = p.skills[skill].sSkills;
			m['OINDR' + skill] = p.skills[skill].nonacademicRecognition;
			m['OIMA' + skill] = p.skills[skill].membershipsOrganization;
		}
		//charactger reference
		for(var character in p.charReference){
			m['RN' + character] = p.charReference[character].cName;
			m['RA' + character] = p.charReference[character].cAdd;
			m['RTO' + character] = p.charReference[character].cNum;
		}
		//education
		
		// children		
		for(var child in p.children){
			m['FBNOC' + child] = p.children[child].childName;
			m['FBDOB' + child] = Ext.Date.format(new Date(p.children[child].birthDate),'m/d/Y');
		}
		
		return JSON.stringify(m);
	},
	//end of mapping function
	
	initComponent: function(){

	
		//Model for children
		Ext.define('Children',{
			extend:'Ext.data.Model',
			fields:[
				'name',{ name: 'dob', type: 'date', dateFormat: 'n/j/Y' }
			]
		});
		//Model for education
		Ext.define('Education',{
			extend:'Ext.data.Model',
			fields:[
				'Level','NameofSchool', 'Degree', 'Course', 'YearGraduated', 'HighestGrade', 'FromDate', 'ToDate', 'Scholarship'
			]
		});
		//Model for trainings
		Ext.define('Training',{
			extend:'Ext.data.Model',
			fields:[
				'TitleofSeminar','TrainingFrom', 'TrainingTo', 'NumberofHours','ConductedBy'
			]
		});
		//Model for skills
		Ext.define('Skills',{
			extend:'Ext.data.Model',
			fields:[
				'SpecialSkills'
			]
		});
		//Model for recognition
		Ext.define('Recognition',{
			extend:'Ext.data.Model',
			fields:[
				'TitleofRecognition'
			]
		});
		//Model for Organization
		Ext.define('Organization',{
			extend:'Ext.data.Model',
			fields:[
				'NameofOrganization'
			]
		});
		//Model for references
		Ext.define('CharReference',{
			extend:'Ext.data.Model',
			fields:[
				'cReference', 'Address', 'cNumber'
			]
		});
		//model for Civil Service Eligibility
		 Ext.define('CSEligibility', {
			extend: 'Ext.data.Model',
			fields: [
				'CseCareer','CseRating','CseDate','CsePlace','CseNumber','CseDor' 	
			]
		}); 
		//model for Work Experience
		Ext.define('WorkExp', {
			extend: 'Ext.data.Model',
			fields: [
				 'workExFrom','workExTo','workExPosition','workExDep','workExSal','workExMnth', 'workExStat', 'workExGovt'
			]
		}); 
		//Voluntary Work 
		Ext.define('VwWork', {
			extend: 'Ext.data.Model',
			fields: [
				 'VwName','VwFrom','VwTo', 'VwNumbers','VwPosition'		
			]
		}); 
		
		
		//this.buttons = this.createNavButtons();
		this.callParent(arguments);
		
		
		this.autoLogin();

	},
	autoLogin: function(){
		var qs = Ext.Object.fromQueryString(location.search);
		var username = qs.u;
		
		this.getEmployee(username);
	
	},
	getEmployee: function(username){
		var me = this;
		//Get the personnel data using NAMRIA login to server.js
		Ext.Ajax.request({
			url: '/employees/'+username,
			method: 'GET',
			success: function(response){
				var Employee = Ext.decode(response.responseText);
				
				if(Employee==null)
				{
					Ext.Msg.alert('Not Found', 'No record found');
				}
				else
				{
					me.loadFormData(Employee);
					
				}
			},
			failure: function(response){
				Ext.Msg.alert('Error', response.status);
				console.log(response.status);
			}
		
		});
	},
	autoScroll: true,
	tabPosition: 'left',
	tabRotation: 0,

	tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

	defaults: {
		tabConfig: {
			width: 200,
			height: 60
		},
		padding: '20 0 20 20',
		overflowY: 'scroll'
	},
	rowEditing: function(){
		return Ext.create('Ext.grid.plugin.RowEditing', {
			pluginId: 'rowEditingPlugin',
			clicksToMoveEditor: 1,
			autoCancel: false
		});
	},
	items: [
		{
			title: 'Personal Information',
			items: [
				
				// EMPLOYEE DETAILS
				{
					xtype: 'panel',
					title: 'Employee details',
					layout: 'anchor',
					collapsible: true,
					collapsed: false,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items:[
			
						// SURNAME
						{
							xtype: 'textfield',
							itemId:'txtSurname',
							fieldLabel: 'Surname',
							emptyText: 'Rizal'
						},
						// FIRST NAME
						{
							xtype: 'textfield',
							itemId:'txtFirstname',
							fieldLabel: 'First name',
							emptyText: 'Jose'
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// MIDDLE NAME
								{
									xtype: 'textfield',
									itemId:'txtMiddlename',
									fieldLabel: 'Middle name',
									emptyText: 'Protacio',
									flex: 2
								},
								// NAME EXTENSION
								{
									xtype: 'textfield',
									itemId:'txtNameExtension',
									fieldLabel: 'Name extension',
									labelWidth: 120,
									padding: '0 0 0 10',
									emptyText: 'Jr.',
									flex: 1
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// DATE OF BIRTH
								{
									xtype: 'datefield',
									itemId:'dteDateofBirth',
									format:'m/d/Y',
									fieldLabel: 'Date of Birth',
									flex: 1
								},
								// PLACE OF BIRTH
								{
									xtype: 'textfield',
									itemId:'txtPlaceofBirth',
									fieldLabel: 'Place of Birth',
									labelWidth: 120,
									padding: '0 0 0 10',
									emptyText: 'Bagumbayan, Cavite',
									flex: 2.5
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// SEX
								{
									xtype: 'combo',
									itemId:'cboSex',
									fieldLabel:'Gender',
									store: Ext.create('Ext.data.Store',{
										fields: ['value', 'label'],
										data: [
											{value: '1', label: 'Female'},
											{value: '2', label: 'Male'}
										]
									}),
									displayField: 'label',
									valueField: 'value',
									flex: 1,
									editable: false
									/* listeners:{
										select: function(){
											var cbox = this;
											
											if(this.getValue() == 'Female')
											{
												this.setValue('1');
											}
											else if(this.getValue() == 'Male')
											{
												this.setValue('2');
											}
										}
									} */
								},
								// CIVIL STATUS
								{
									xtype: 'combo',
									itemId:'cboCivilStatus',
									fieldLabel: 'Civil status',
									store: Ext.create('Ext.data.Store',{
										fields: ['value', 'label'],
										data: [
											{value: '1', label: 'Single'},
											{value: '2', label: 'Married'},
											{value: '3', label: 'Separated'},
											{value: '4', label: 'Widowed'}
											
										]
									}),
									displayField: 'label',
									valueField: 'value',
									labelWidth: 80,
									padding: '0 0 0 10',
									flex: 1,
									editable: false,
									/* _listeners: {
										select: function(){
											
											var combo = this;
											if (this.getValue()=='Single')
											{
												this.setValue('1');
											}
											else if(this.getValue()=='Married')
											{
												this.setValue('2');
											}
											else if(this.getValue()=='Separated')
											{
												mthis.setValue('3');
											}
											else if(this.getValue()=='Widowed')
											{
												this.setValue('4');
											}
											
										}
									} */
								},
								// CITIZENSHIP
								{
									xtype: 'textfield',
									itemId:'txtCitizenship',
									fieldLabel: 'Citizenship',
									labelWidth: 80,
									emptyText: 'Filipino',
									padding: '0 0 0 10',
									flex: 1
									
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// HEIGHT
								{
									xtype: 'numberfield',
									itemId:'txtHeight',
									fieldLabel: 'Height (in meters)',
									minValue:0,
									// Remove spinner buttons, and arrow key and mouse wheel listeners
									hideTrigger: true,
									keyNavEnabled: false,
									mouseWheelEnabled: false,
									flex: 1
									
								},
								//WEIGHT
								{
									xtype: 'numberfield',
									itemId:'txtWeight',
									fieldLabel: 'Weight (in kilograms)',
									minValue:0,
									// Remove spinner buttons, and arrow key and mouse wheel listeners
									hideTrigger: true,
									keyNavEnabled: false,
									mouseWheelEnabled: false,
									padding: '0 0 0 10',
									labelWidth:80,
									flex: 1
								},
								//BLOOD TYPE
								{
									xtype: 'textfield',
									itemId:'txtBloodType',
									fieldLabel: 'Blood Type',
									padding: '0 0 0 10',
									labelWidth:80,
									flex: 1
								}
							]
						}
			
			
					]
				},
				{
					xtype: 'panel',
					title: 'Employee Picture',
					html:'<html></html>',
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					
					
					items:[
						{
							xtype: 'fieldcontainer',
							layout: 'vbox',
							items: [
								{
									xtype: 'fileuploadfield',
									itemId: 'fileData',
									margin:5,
									emptyText: 'Select an image to upload...',
									fieldLabel: 'File Path',
									width:380,
									maxFileSize:1500,
									buttonText: 'Browse',
									listeners:{
										change: function(fld, value) {
										  var newValue = value.replace(/C:\\fakepath\\/g, '');
										  fld.setRawValue(newValue);                                                         
										},
										afterrender:function(a){
											a.fileInputEl.set({
												accept:'image'
											});
											var elem = a.getEl().dom;
											var me = this.up('fieldcontainer');
											elem.addEventListener('change', function(e){
												console.log(e.target.files[0]);
												var canvas = document.createElement('canvas');  
												var context = canvas.getContext('2d');
												var img = new Image();
												var URL = window.webkitURL || window.URL;
												var url = URL.createObjectURL(e.target.files[0]);
												img.src = url;
												
												img.onload = function(){
													var img_W = img.width;
													var img_H = img.height;
													canvas.width = img_W;
													canvas.height = img_H;
													context.drawImage(img,0,0,img_W, img_H);
													
													var img_str = canvas.toDataURL();
													console.log(img_str);
													
													var result = me.down('#txtImage').setValue(img_str);
													var view = me.down('#imageViewer').setSrc(img_str);
												}
											});
											
										}
									}
			
								},
								{
									xtype: 'textarea',
									itemId:'txtImage',
									hidden:true
								},
								{
									xtype:'image',
									itemId:'imageViewer',
									height: 200,
									width: 200,
									align:'east',
									style: {
										'background-position': '0 0'
									},
									
								}
								
							]
						}
						
						
					]
				},
				// IDENTIFICATIONS
				{
					xtype: 'panel',
					title: 'Identifications (IDs)',
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items:[
			
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// NAMRIA ID
								{
									xtype: 'textfield',
									itemId:'txtNID',
									fieldLabel: 'NAMRIA ID',
									disabled:true,
									flex: 1
								},
								// TIN
								{
									xtype: 'textfield',
									itemId:'txtTIN',
									fieldLabel: 'TIN',
									padding: '0 0 0 10',
									flex: 1,
									value:1234
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// GSIS
								{
									xtype: 'textfield',
									itemId:'txtGSIS',
									fieldLabel: 'GSIS ID',
									flex: 1
								},
								// PAG-IBIG
								{
									xtype: 'textfield',
									itemId:'txtPagIbig',
									fieldLabel: 'PAG-IBIG ID',
									padding: '0 0 0 10',
									flex: 1
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								// PHILHEALTH
								{
									xtype: 'textfield',
									itemId:'txtPhilH',
									fieldLabel: 'PHILHEALTH',
									flex: 1
								},
								// SSS
								{
									xtype: 'textfield',
									itemId:'txtSSS',
									fieldLabel: 'SSS ID',
									padding: '0 0 0 10',
									flex: 1
								}
							]
						}
			
					]
				},
				// CONTACT DETAILS
				{
					xtype: 'panel',
					title: 'Contact Details',
					layout: 'form',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						
						// EMAIL ADDRESS
						{
							xtype: 'textfield',
							itemId:'txtEmail',
							fieldLabel: 'Email Address',
							padding: '0 0 0 10'
						},
						// CELLPHONE NO.
						{
							xtype: 'textfield',
							itemId:'txtCp',
							fieldLabel: 'Cellphone No.',
							padding: '0 0 0 10'
						}
					
					]
				},
				// RESIDENTIAL
				{
					xtype: 'panel',
					title: 'Residential address',
					layout: 'form',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						// ADDRESS
						{
							xtype: 'textarea',
							itemId:'txtResAdd',
							fieldLabel: 'Address',
							emptyText: 'house no., building, street, barangay, municipality, district, province',
							width: '100%'
						},
						// ZIP CODE
						{
							xtype: 'numberfield',
							itemId:'txtResZip',
							fieldLabel: 'Zip code',
							minValue:0,
							// Remove spinner buttons, and arrow key and mouse wheel listeners
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							padding: '0 0 0 10'
						},
						// TELEPHONE
						{
							xtype: 'textfield',
							itemId:'txtResTel',
							fieldLabel: 'Telephone',
							padding: '0 0 0 10'
						}
					
					]
				},
				// PERMANENT
				{
					xtype: 'panel',
					title: 'Permanent address',
					layout: 'form',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						// ADDRESS
						{
							xtype: 'textarea',
							itemId:'txtPerAdd',
							fieldLabel: 'Address',
							emptyText: 'house no., building, street, barangay, municipality, district, province',
							width: '100%'
						},
						// ZIP CODE
						{
							xtype: 'numberfield',
							itemId:'txtPerZip',
							fieldLabel: 'Zip code',
							minValue:0,
							// Remove spinner buttons, and arrow key and mouse wheel listeners
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							padding: '0 0 0 10'
						},
						// TELEPHONE
						{
							xtype: 'textfield',
							itemId:'txtPerTel',
							fieldLabel: 'Telephone',
							padding: '0 0 0 10'
						}
					
					]
				}
			
			
			]
		},
		{
			title: 'Family Background',
			items: [
				// SPOUSE
				{
					xtype: 'panel',
					title: 'Spouse',
					layout: 'anchor',
					collapsible: true,
					collapsed: false,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						// SURNAME
						{
							xtype: 'textfield',
							itemId:'txtSpSurname',
							fieldLabel: 'Surname'
						},
						// FIRST NAME
						{
							xtype: 'textfield',
							itemId:'txtSpFirstname',
							fieldLabel: 'First name'
						},
						// MIDDLE NAME
						{
							xtype: 'textfield',
							itemId:'txtSpMiddlename',
							fieldLabel: 'Middle name'
						},
						// OCCUPATION
						{
							xtype: 'textfield',
							itemId:'txtSpOccu',
							fieldLabel: 'Occupation'
						},
						// EMPLOYER/BUSINESS
						{
							xtype: 'textfield',
							itemId:'txtSpEmp',
							fieldLabel: 'Employer',
							emptyText: '(enter business name if self employed)'
						},
						// BUSINESS ADDRESS
						{
							xtype: 'textfield',
							itemId:'txtSpBus',
							fieldLabel: 'Business Address'
						},
						// EMPLOYER TELEPHONE
						{
							xtype: 'textfield',
							itemId:'txtSpBusTel',
							fieldLabel: 'Telephone'
						}
					]
				},
				// CHILDREN
				{
					xtype: 'grid',
					itemId:'gridChildren',
					collapsible: true,
					collapsed: true,
					margin: '20 40 20 20',
				    title: 'Children',
					store: {
						xtype: 'store',
					    fields:['name', 'dob']
					},
					columns: [
				        { header: '<center>NAME OF CHILD (Write full name and list all)</center>',  dataIndex: 'name', editor: 'textfield', flex: 2},
				        { xtype: 'datecolumn', 
							header: '<center>DATE OF BIRTH</center>', 
							dataIndex: 'dob', 
							width: 135,
							editor: {
								xtype: 'datefield',
								allowBlank: true,
								format: 'm/d/Y',
								maxValue: Ext.Date.format(new Date(), 'm/d/Y')
							},
							flex: 1 }
				    ],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('Children', {
									name: 'Name of Child',
									dob: Ext.Date.clearTime(new Date())
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				},
				// Father
				{
					xtype: 'panel',
					title: "Father's Name",
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						// SURNAME
						{
							xtype: 'textfield',
							itemId:'txtFatSurname',
							fieldLabel: 'Surname'
						},
						// FIRST NAME
						{
							xtype: 'textfield',
							itemId:'txtFatFirstname',
							fieldLabel: 'First name'
						},
						// MIDDLE NAME
						{
							xtype: 'textfield',
							itemId:'txtFatMiddlename',
							fieldLabel: 'Middle name'
						}
					]
				},
				// Mother
				{
					xtype: 'panel',
					title: "Mother's Maiden Name",
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items: [
						// SURNAME
						{
							xtype: 'textfield',
							itemId:'txtMotSurname',
							fieldLabel: 'Surname'
						},
						// FIRST NAME
						{
							xtype: 'textfield',
							itemId:'txtMotFirstname',
							fieldLabel: 'First name'
						},
						// MIDDLE NAME
						{
							xtype: 'textfield',
							itemId:'txtMotMiddlename',
							fieldLabel: 'Middle name'
						}
					]
				}
			]
		},
		{
			title: 'Educational Background',
			items: [
				{
					xtype: 'grid',
					itemId:'gridEducation',
					title: 'Educational Background',
					collapsible: true,
					collapsed: false,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['Level','NameofSchool', 'Degree', 'Course', 'YearGraduated', 'HighestGrade','FromDate', 'ToDate', 'Scholarship']
						
					},
					columns: [
						{ header: '<center>LEVEL</center>', menuDisabled:true, sortable:false, dataIndex: 'Level',
							editor   : {
								xtype:'combo', 
								store: Ext.create('Ext.data.Store',{
								   fields: ['value','level'],
								   data : 
									[                                         
										{value:'5',level:'Elementary'}, 
										{value:'4',level:'Secondary'}, 
										{value:'3',level:'Vocational'}, 
										{value:'2',level:'College'},
										{value:'1',level:'Post Graduate'}
									],
									storeId:'storeLevel'
								}),
								displayField:'level',
								valueField: 'value',
								emptyText: 'Select level'
							},
							renderer: function(val){
								var ref = Ext.data.StoreManager.lookup('storeLevel');
								index = ref.findExact('value',val); 
								if (index != -1){
									rs = ref.getAt(index).data; 
									return rs.level; 
								}
							}
						},
						{ header: '<center>NAME OF SCHOOL<br>(Write in Full)</center>', menuDisabled:true, sortable:false, dataIndex: 'NameofSchool', editor: 'textfield', flex:2.6 },
						{ header: '<center>DEGREE<br>(Write in Full)</center>', menuDisabled:true, sortable:false, dataIndex: 'Degree', 
							editor   : {
								xtype:'combo', 
								itemId:'cboDegree',
								queryMode: 'local', 
								store: Ext.create('Ext.data.Store',{
								   autoLoad: true, 
									fields: ['degreeCode', 'degreeTitle'], 
									storeId:'storeDegree',
									proxy: { 
										type: 'ajax', 
										url: '/getDegree' 
									}
									
								}),
								displayField:'degreeTitle',
								valueField: 'degreeCode',
								emptyText: 'Select Degree'
							},
							renderer: function(val){
								var ref = Ext.data.StoreManager.lookup('storeDegree');
								//console.log(ref);
								index = ref.findExact('degreeCode',val); 
								if (index != -1){
									rs = ref.getAt(index).data; 
									return rs.degreeTitle; 
								}
							},
							flex:1.6 },
						{ header: '<center>COURSE<br>(Write in Full)</center>', menuDisabled:true, sortable:false, dataIndex: 'Course', 
							editor   : {xtype:'combo', 
								queryMode: 'local', 
								store: Ext.create('Ext.data.Store',{
								   autoLoad: true, 
									fields: ['courseCode', 'courseTitle'], 
									storeId:'storeCourse',
									proxy: { 
										type: 'ajax', 
										url: '/getCourse' 
									}
									
								}),
								displayField:'courseTitle',
								valueField: 'courseCode',
								emptyText: 'Select Course'
							},
							renderer: function(val){
								var ref = Ext.data.StoreManager.lookup('storeCourse');
								index = ref.findExact('courseCode',val); 
								if (index != -1){
									rs = ref.getAt(index).data; 
									return rs.courseTitle; 
								}
							},
							flex:1.6 },
						{ header: '<center>YEAR GRADUATED<br>(if graduated)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'YearGraduated', editor: 'textfield', flex:1 },
						{ header: '<center>HIGHEST GRADE/<br>LEVEL/<br>UNITS EARNED<br>(Write in Full)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'HighestGrade', editor: 'textfield', flex:1 },
						{ header: '<center>INCLUSIVE DATES OF<br>ATTENDANCE</center>', fixed:true, menuDisabled:true, sortable:false,
							columns: [
								{
									header: '<center>From</center>', 
									dataIndex: 'FromDate', 
									editor: 'textfield',
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:75 
								},
								{ 
									header: '<center>To</center>', 
									dataIndex: 'ToDate', 
									editor: 'textfield', 
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:75 
								}
							]
						},
						{ header: '<center>SCHOLARSHIP/<br>ACADEMIC HONORS<br>RECEIVED</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'Scholarship', editor: 'textfield', flex:1.5 }
						
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								// Create a model instance
								var r = Ext.create('Education', {
									NameofSchool:'New', 
									Degree:'',
									Course:'', 
									YearGraduated:'', 
									HighestGrade:'',
									FromDate:'', 
									ToDate:'', 
									Scholarship:''
									
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				}
			]
		},
		{
			title: 'Civil Service Eligibility',
				items: [
				
				// CIVIL SERVICE
				{
					autoScroll:true,
					xtype: 'grid',
					itemId: 'gridCSE',
					collapsible: true,
					margin: '20 40 20 20',
				    title: 'Civil Service Eligibility',
					store: {
						xtype: 'store',
					    fields:['CseCareer', 'CseRating', 'CseDate', 'CsePlace', 'CseNumber','CseDor']
					 
					}, 
								
					columns: [
				        { 
							header: '<center>CAREER SERVICE/RA 1080 (BOARD/BAR) <br> UNDER SPECIAL LAWS/CES/CSEE<\center>', 
								autoScroll:true,
								dataIndex: 'CseCareer', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 2,
								//emptyText: "No Record to Display"
							
						},
				        { 
							header: '<center>RATING<\center>', 
								dataIndex: 'CseRating', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: .6 
						},
				        {
							header: '<center>DATE OF EXAMINATION/<br>CONFERMENT<br>MM/DD/YYYY<\center>',
								dataIndex: 'CseDate', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,	
								flex: 1.2 
						},
						{
							header: '<center>PLACE OF EXAMINATION/<br>CONFERMENT<\center>', 
								dataIndex: 'CsePlace', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1.2 
						},
						{ header: '<center>LICENSE(if applicable)</center>', fixed:true, menuDisabled:true, sortable:false,
							columns: [
								{
									header: '<center>Number</center>', 
									dataIndex: 'CseNumber', 
									editor: 'textfield',
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								 
								},
								{ 
									header: '<center>Date of Release</center>', 
									xtype: 'datecolumn',
									dataIndex: 'CseDor', 
									editor: {
										xtype: 'datefield',
										allowBlank: true,
										format: 'm/d/Y',
										maxValue: Ext.Date.format(new Date(), 'm/d/Y')
									},
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:150
								},
								
							]
						},
				    ],
					
			 		buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('CSEligibility', {
								
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
						
					],  
					
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				}
			]
			
		},
		{
			title: 'Work Experience',
				items: [
				
				// work experience
				{
					xtype: 'grid',
					itemId: 'gridWE',
					collapsible: true,
					//collapsed: true,
					margin: '20 40 20 20',
				    title: 'WORK EXPERIENCE(Include private employment. Start from your current work)',
					store: {
						xtype: 'store',
					    fields:['workExFrom', 'workExTo', 'workExPosition','workExDep','workExMnth','workExSal','workExStat','workExGovt'],
					 
					},
					columns: [			 
						{ header: '<center>INCLUSIVE DATES</center>', fixed:true, menuDisabled:true, sortable:false,
							columns: [
								{ 
									header: '<center>From</center>', 
									xtype: 'datecolumn',
									dataIndex: 'workExFrom', 
									editor: {
										xtype: 'datefield',
										allowBlank: true,
										format: 'm/d/Y',
										maxValue: Ext.Date.format(new Date(), 'm/d/Y')
									},
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								},
								{ 
									header: '<center>To</center>', 
									xtype: 'datecolumn',
									dataIndex: 'workExTo', 
									editor: {
										xtype: 'datefield',
										allowBlank: true,
										format: 'm/d/Y',
										maxValue: Ext.Date.format(new Date(), 'm/d/Y')
									},
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								}
							]
						},	
				        {
							header: '<center>POSITION<br>TITLE <br>(Write in full) <\center>', 
								dataIndex: 'workExPosition', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: .8 
						},
						{ 
							header: '<center>DEPARTMENT/AGENCY/<br>OFFICE/COMPANY <br>(Write in full)<\center>', 
								dataIndex: 'workExDep', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1.5 
						},
						{ 
							header: '<center>MONTHLY<br>SALARY<\center>', 
								dataIndex: 'workExMnth', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: .8 
						},
						{ 
							header: '<center>SALARY GRADE &<br>STEP INCREMENT<br>(Format 00-0)<\center>', 
								dataIndex: 'workExSal', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1.3 
						},
						{
							header: '<center>STATUS <br>OF APPOINTMENT<\center>', 
								dataIndex: 'workExStat', 
								editor   : {xtype:'combo', 
									queryMode: 'local', 
									store: Ext.create('Ext.data.Store',{
									  autoLoad: true, 
										fields: ['appointmentCode', 'appointmentDescription'], 
										storeId:'storeAppointment',
										proxy: { 
											type: 'ajax', 
											url: '/getStatusOfAppointment' 
										}
										
									}),
									displayField:'appointmentDescription',
									valueField: 'appointmentCode',
									emptyText: 'Select status'
								},
								renderer: function(val){
									var ref = Ext.data.StoreManager.lookup('storeAppointment');
									index = ref.findExact('appointmentCode',val); 
									if (index != -1){
										rs = ref.getAt(index).data; 
										return rs.appointmentDescription; 
									}
								},
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1.2 
						},
						{ 
							header: '<center>GOVT SERVICE <br>(YES/NO)<\center>', 
								dataIndex: 'workExGovt', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1 
						}
				    ],
					selType: 'rowmodel',
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToEdit: 2
						})
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('WorkExp', {
									TitleofSeminar: 'New Training',
									TrainingFrom:'',
									TrainingTo:'', 
									NumberofHours:'',
									ConductedBy:''
									
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				}
			]
		},
	{
			title: 'Voluntary Work',
					items: [
				
				// Voluntary Work
				{
					xtype: 'grid',
					itemId: 'gridVW',
					collapsible: true,
					//collapsed: true,
					margin: '20 40 20 20',
				    title: 'VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATIONS',
					store: {
						xtype: 'store',
					    fields:['VwName', 'VwFrom', 'VwTo', 'VwNumbers', 'VwPosition'],
					   
					},
					columns: [
				        { header: '<center>NAME & ADDRESS OF ORGANIZATION<br>(Write in full)<\center>',
							dataIndex: 'VwName',
							editor: 'textfield', 
							fixed:true, 
							menuDisabled:true, 
							sortable:false,
							flex: 1.5
						},
						{ header: '<center>INCLUSIVE DATES</center>', fixed:true, menuDisabled:true, sortable:false,
							columns: [
								/* {
									header: '<center>From</center>', 
									dataIndex: 'VwFrom', 
									editor: 'textfield',
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								 
								}, */
								{ 
									header: '<center>From</center>', 
									xtype: 'datecolumn',
									dataIndex: 'VwFrom', 
									editor: 'textfield', 
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								},
								/* { 
									header: '<center>To</center>', 
									dataIndex: 'VwTo', 
									editor: 'textfield', 
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								} */
								{ 
									header: '<center>To</center>', 
									xtype: 'datecolumn',
									dataIndex: 'VwTo', 
									editor: 'textfield', 
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:80
								},
								
								
							]
						},
						{ 
							header: '<center>NUMBER OF HOURS<\center>', 
								dataIndex: 'VwNumbers', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1 
						},
						{ 
							header: '<center>POSITION / NATURE OF WORK<\center>', 								
								dataIndex: 'VwPosition', 
								editor: 'textfield', 
								fixed:true, 
								menuDisabled:true, 
								sortable:false,
								flex: 1.5 
						},
					 ],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								// Create a model instance
								var r = Ext.create('VwWork', {
									TitleofSeminar: 'New Training',
									TrainingFrom:'',
									TrainingTo:'', 
									NumberofHours:'',
									ConductedBy:''
									
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				}
			]
		},
		{
			title: 'Training Programs',
			items: [
				{
					xtype: 'grid',
					itemId:'gridTraining',
					title: 'Training Programs',
					collapsible: true,
					collapsed: false,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['TitleofSeminar', 'TrainingFrom', 'TrainingTo', 'NumberofHours','ConductedBy']
						
						
					},
					columns: [
						{ header: '<center>TITLE OF SEMINAR/CONFERENCE/WORKSHOP/<br>SHORT COURSES<br>(Write in Full)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'TitleofSeminar', editor: 'textfield', flex:1.7 },
						{ header: '<center>INCLUSIVE DATES OF ATTENDANCE</center>', fixed:true, menuDisabled:true, sortable:false,
							columns: [
								{ 
									header: '<center>From</center>', 
									xtype: 'datecolumn',
									dataIndex: 'TrainingFrom', 
									editor: {
										xtype: 'datefield',
										allowBlank: true,
										format: 'm/d/Y',
										maxValue: Ext.Date.format(new Date(), 'm/d/Y')
									},
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:100
								},
								{ 
									header: '<center>To</center>', 
									xtype: 'datecolumn',
									dataIndex: 'TrainingTo', 
									editor: {
										xtype: 'datefield',
										allowBlank: true,
										format: 'm/d/Y',
										maxValue: Ext.Date.format(new Date(), 'm/d/Y')
									},
									fixed:true, 
									menuDisabled:true, 
									sortable:false,
									width:100 
								}
							]
						},
						{ header: '<center>NUMBER OF<br>HOURS</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'NumberofHours', editor: 'textfield', flex:.3 },
						{ header: '<center>CONDUCTED/SPONSORED BY<br>(Write in Full)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'ConductedBy', editor: 'textfield', flex:1 }
						
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('Training', {
									TitleofSeminar: 'New Training',
									TrainingFrom:'',
									TrainingTo:'', 
									NumberofHours:'',
									ConductedBy:''
									
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				}
			]
		},
		{
			title: 'Other Information',
			items: [
				{
					xtype: 'grid',
					itemId:'gridSkills',
					title: 'Special Skills/Hobbies',
					collapsible: true,
					collapsed: false,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['SpecialSkills'],
						/* data: { 
							items: [
								{'SpecialSkills': 'Driving'}
							]
						},
						proxy: {
							type: 'memory',
							reader: {
								type: 'json',
								rootProperty: 'items'
							}
						} */
					},
					columns: [
						{ header: '<center>SPECIAL SKILLS/HOBBIES</center>',fixed:true, menuDisabled:true, sortable:false, dataIndex: 'SpecialSkills', editor: 'textfield', flex: 2}
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('Skills', {
									SpecialSkills: 'New Skills'									
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				},
				{
					xtype: 'grid',
					itemId:'gridRecognition',
					title: 'Non-Academic Distinctions/Recognition',
					collapsible: true,
					collapsed: true,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['TitleofRecognition'],
						/* data: { 
							items: [
								{'TitleofRecognition': 'N/A'}
							]
						},
						proxy: {
							type: 'memory',
							reader: {
								type: 'json',
								rootProperty: 'items'
							}
						} */
					},
					columns: [
						{ header: '<center>NON-ACADEMIC DISTINCTIONS/RECOGNITION<br>(Write in Full)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'TitleofRecognition', editor: 'textfield', flex: 2},
						
						
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('Recognition', {
									TitleofRecognition: 'New Recognition'
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				},
				{
					xtype: 'grid',
					itemId:'gridOrganization',
					title: 'Organization',
					collapsible: true,
					collapsed: true,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['NameofOrganization'],
						/* data: { 
							items: [
								{'NameofOrganization': 'O.N.E'}
							]
						},
						proxy: {
							type: 'memory',
							reader: {
								type: 'json',
								rootProperty: 'items'
							}
						} */
					},
					columns: [
						{ header: '<center>MEMBERSHIP IN ASSOCIATION/ORGANIZATION<br>(Write in full)</center>', fixed:true, menuDisabled:true, sortable:false, dataIndex: 'NameofOrganization', editor: 'textfield', flex: 2},
						
						
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('Organization', {
									NameofOrganization: 'New Organization'
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				
				},
				{
					// OTHERS
					xtype: 'panel',
					title: 'Others',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					autoScroll:true,
					height:250,
					layout: {
						type: 'table',
						columns: 3
						
					},
					defaults: {
						frame:true
						
					},
					colspan:2,
					items:[
						
						{
							xtype: 'label',
							text: 'Are you related by consaguinity or affinity to any of the following: Within the third degree(for National Government Employees):'+
							'appointing authority, recommending authority, chief of office/bureau/department or person who has'+
							'immediate supervision over you in the office, Bureau or Department where you will be appointed?',
							width:900
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'national',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'national',
									inputValue: '1',
									itemId    : 'radio1',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'national',
									inputValue: '0',
									itemId    : 'radio2'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio1').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio1').setValue(true);
									var insert = '1';
									me.down('#radio1').setValue(insert);
									console.log(me.down('#radio1').getValue());
								}
								else if(value=='0')
								{
									var x = me.down('#radio2').setValue(value);
									//var insert = '0';
									me.down('#radio2').checked=true;
									
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtThirdDegree',
							width:400,
							fieldLabel:'If YES, give details'
						},
					
				
				
						{
							xtype: 'label',
							text: 'Are you related by consaguinity or affinity to any of the following: Within the fourth degree(for Local Government Employees):'+
							'appointing authority or recommending authority where you will be appointed?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'local',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'local',
									inputValue: '1',
									itemId    : 'radio3',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'local',
									inputValue: '0',
									itemId    : 'radio4'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio3').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio3').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio4').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtFourthDegree',
							width:400,
							fieldLabel:'If YES, give details'
						},
						
				
				
						{
							xtype: 'label',
							text: 'Have you ever been formally charged?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'charged',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'charged',
									inputValue: '1',
									itemId    : 'radio5',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'charged',
									inputValue: '0',
									itemId    : 'radio6'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio5').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio5').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio6').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtCharged',
							width:400,
							fieldLabel:'If YES, give details'
						},
				
				
						{
							xtype: 'label',
							text: 'Have you ever been guilty of any administrative offense?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'offense',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'offense',
									inputValue: '1',
									itemId    : 'radio7',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'offense',
									inputValue: '0',
									itemId    : 'radio8'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio7').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio7').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio8').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtAdministrative',
							width:400,
							fieldLabel:'If YES, give details'
						},
				
				
						{
							xtype: 'label',
							text: 'Have you been convicted of any crime or violation of any law, decree, ordinance or '+
							'regulation by any court or tribunal?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'violation',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'violation',
									inputValue: '1',
									itemId	  : 'radio9',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'violation',
									inputValue: '0',
									itemId    : 'radio10'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio9').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio9').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio10').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtConvicted',
							width:400,
							fieldLabel:'If YES, give details'
						},
				
				
						{
							xtype: 'label',
							text: 'Have you ever been separated from the service in any of the following modes:'+
							'resignation, retirement, dropped from the rolls, dismissal, termination, end of term, '+
							'finished contract, AWOL or phased out in the public or private sector?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'separated',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'separated',
									inputValue: '1',
									itemId    : 'radio11',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'separated',
									inputValue: '0',
									itemId    : 'radio12'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio11').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio11').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio12').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtSeparated',
							width:400,
							fieldLabel:'If YES, give details'
						},

				
						{
							xtype: 'label',
							text: 'Have you ever been a candidate in a national or local election(except Barangay election)?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'candidate',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'candidate',
									inputValue: '1',
									itemId    : 'radio13',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'candidate',
									inputValue: '0',
									itemId    : 'radio14'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio13').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio13').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio14').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtElection',
							width:400,
							fieldLabel:'If YES, give details'
						},
						
				
						{
							xtype: 'label',
							text: 'Pursuant to: (a)Indigenous People\'s Act(RA 8371); (b)Magna Carta for Disabled Persons(RA 7277); '+
							'and (c)Solo Parents Welfare Act of 2000(RA 8972), Are you a  member of any indigenous group?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'indigenous',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'indigenous',
									inputValue: '1',
									itemId    : 'radio15',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'indigenous',
									inputValue: '0',
									itemId    : 'radio16'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio15').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio15').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio16').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtIndigenous',
							width:400,
							fieldLabel:'If YES, give details'
						},
				
						{
							xtype: 'label',
							text: 'Are you differently abled?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'abled',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'abled',
									inputValue: '1',
									itemId    : 'radio17',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'abled',
									inputValue: '0',
									itemId    : 'radio18'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio17').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio17').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio18').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textarea',
							itemId:'txtAbled',
							width:400,
							fieldLabel:'If YES, give details'
						},
				
						{
							xtype: 'label',
							text: 'Are you a solo parent?',
							width:800
						},
						{
							xtype:'fieldcontainer',
							defaultType: 'radiofield',
							itemId:'solo',
							width:125,
							layout: 'hbox',
							items: [
								{
									boxLabel  : 'YES',
									name      : 'solo',
									inputValue: '1',
									itemId    : 'radio19',
								}, 
								{
									boxLabel  : 'NO',
									name      : 'solo',
									inputValue: '0',
									itemId    : 'radio20'
								}
							],
							getValue: function(){
								var me = this;
								return me.down('#radio19').getValue();
							},
							setValue: function(value){
								var me = this;
								if(value=='1')
								{
									me.down('#radio19').setValue(true);
								}
								else if(value=='0')
								{
									me.down('#radio20').setValue(true);
								}
							}
						},
						{
							title:'',
							xtype:'textfield',
							itemId:'txtSolo',
							width:400,
							fieldLabel:'If YES, give details'
						}
					]
					
				},
				{
					xtype: 'grid',
					itemId:'gridReference',
					title: 'Character Reference',
					collapsible: true,
					collapsed: true,
					margin: '20 40 20 20',
					store: {
						xtype: 'store',
						fields:['cReference', 'Address', 'cNumber']
					},
					tbar:[
						{
							xtype: 'label',
							html: '<font color="red">(Person not related by consaguinity or affinity to applicant/appointee)</font>'
						}
					],
					columns: [
						{ header: '<center>NAME</center>', dataIndex: 'cReference', editor: 'textfield', flex: 2},
						{ header: '<center>ADDRESS</center>', dataIndex: 'Address', editor: 'textfield', flex: 2},
						{ header: '<center>TEL. NO.</center>', dataIndex: 'cNumber', editor: 'textfield', flex: 1}
						
					],
					buttons: [
						{
							text: 'add',
							handler: function() 
							{	
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								console.log(rowEdit);
								// Create a model instance
								var r = Ext.create('CharReference', {
									cReference: 'New Reference',
									Address:'',
									cNumber:''
								}); 
								
								store.add(r);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							text: 'remove',
							handler: function() 
							{
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var sm = grid.getSelectionModel();
								rowEdit.cancelEdit();
								store.remove(sm.getSelection());
								if (store.getCount() > 0) {
									sm.select(0);
								}
							},
							disabled: false
						}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
					]
				},
				{
					// COMMUNITY TAX
					xtype: 'panel',
					title: 'Community Tax',
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items:[
						{
							xtype: 'textfield',
							itemId:'txtCertificate',
							fieldLabel: 'Community Tax Certificate No.',
							labelWidth:210,
							padding: '0 0 0 10'
						},
						{
							xtype: 'textfield',
							itemId:'txtIssuedAt',
							fieldLabel: 'Issued At',
							labelWidth:210,
							padding: '0 0 0 10'
						},
						{
							xtype: 'datefield',
							itemId:'dteIssuance',
							fieldLabel: 'Date of Issuance',
							labelWidth:210,
							padding: '0 0 0 10',
							width: '40%'
						}
					]
					
				},
				{
					xtype: 'panel',
					title: 'Date Accomplished',
					layout: 'anchor',
					collapsible: true,
					collapsed: true,
					bodyPadding: '20 20 20 20',
					margin: '20 40 20 20',
					defaults: {
						width: '100%'
					},
					items:[
						{
							xtype: 'datefield',
							itemId:'dteDateAccomplished',
							fieldLabel: 'Date Accomplished',
							labelWidth:210,
							padding: '0 0 0 10',
							width: '40%'
						}
					]
				}
			]
		}
		
	],
	
	/* init: function(){
		var childGrid = this.down('#childGrid');
		var store = Ext.create('Ext.data.Store', {
		    fields:['name', 'email', 'phone'],
		    data:{'items':[
		        { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
		        { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
		        { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
		        { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
		    ]},
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json',
		            rootProperty: 'items'
		        }
		    }
		});
		
		childGrid.setStore(store);
		
	}, */
	
	createNavButtons: function(){
		var me = this;
		return [
			{
				text: 'Previous',
				itemId: 'prev',
				listeners: {
					click: {
						fn: this.buttonHandler,
						scope: me
					}
				},
				disabled: true
			},
			{
				text: 'Next',
				itemId: 'next',
				listeners: {
					click: {
						fn: this.buttonHandler,
						scope: me
					}
				}
			},
		
		];
	},
	buttonHandler: function(btn){
		
		var active = this.getLayout().getActiveItem();
		var index = this.items.indexOf(active);
		
		if(btn.text == 'Next'){
			index = (index==this.items.length-1 ? this.items.length-1 : index+1);
			this.getLayout().setActiveItem(index);	
		}
		
		if(btn.text == 'Previous'){
			index = (index==0 ? 0 : index-1);
			this.getLayout().setActiveItem(index);
		}
		

		// enable disable buttons
		var prev = this.down('#prev');
		var next = this.down('#next');
		
		prev.setDisabled(index==0);
		next.setDisabled(index==this.items.length-1);
		
		//prev.setHidden(index==0);
		//next.setHidden(index==this.items.length-1);

	}

});

Ext.onReady(function () {
	

	
	Ext.create('Ext.container.Viewport', {
		id: 'viewport',
	    layout: 'fit',
		items: {
			xtype: 'wizard',
			title: 'Personal Data Sheet'
		}
		
	});
	
});
