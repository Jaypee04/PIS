Ext.Loader.setConfig({enabled: true});
Ext.require(['Ext.data.*', 'Ext.grid.*', 'Ext.ux.grid.Printer']);

Ext.define('TRAINING_INVITATION',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'int'
		},
		'INVITECODE', 
		'INSTCODE',
		'INSTNAME',
		'COURSECODE', 
		'COURSENAME',
		{
			name: 'COURSESTART', 
			type: 'date'
		},
		{
			name: 'COURSEEND', 
			type: 'date'
		}, 
		'VENUE',
		{
			name: 'LOCAL', 
			type: 'boolean'
		},
		'REQ_AGE',
		'REQ_GENDER',
		'CIVIL_STATUS',
		'REQ_YRGOV',
		{
			name: 'APPT_STAT', 
			type: 'boolean'
		},
		'COURSE_PREREQ',
		'EDUC_DEGREE',
		'EDUC_COURSE'
	],
	idProperty: 'INVITECODE',
	proxy: {
		type: 'rest',
		url: '/training/training_invitation'
	}

});

Ext.define('INSTITUTE_LIB',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'int'
		},
		'INSTCODE',
		'INSTNAME',
		'INSTADDRESS', 
		'INSTCONTACT',
		'INSTPHONE',
		'INSTFAX',
		'INSTEMAIL'
	],
	idProperty: 'INSTCODE',
	proxy: {
		type: 'rest',
		url: '/training/institute_lib'
	}

});

//Training Progress
Ext.define('PROGRESS',{
	extend: 'Ext.data.Model',
	fields: [
		'INVITECODE',
		'EMPID',
		'EMPNAME',
		'PROGDATE', 
		'DETAILS',
		'PROGATT'
	],
	idProperty: 'INVITECODE',
	proxy: {
		type: 'rest',
		url: '/training/progress'
	}

});

//Course Library
Ext.define('COURSE_LIB',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'int'
		},
		'COURSECODE',
		'COURSENAME',
		'COURSEDESC', 
		'COURSEPREQ'
	],
	idProperty: 'COURSECODE',
	proxy: {
		type: 'rest',
		url: '/training/course_lib'
	}

});

//Special order
Ext.define('SPECIAL_ORDER',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'id',
			type: 'int'
		},
		'INVITECODE',
		'SONO',
		'SODATE', 
		'SOSUBJECT'
	],
	idProperty: 'SONO',
	proxy: {
		type: 'rest',
		url: '/training/special_order'
	}

});

//Nominees
Ext.define('NOMINEES',{
	extend: 'Ext.data.Model',
	fields: [
		'INVITECODE',
		'EMPID',
		'EMPNAME',
		'REMARKS', 
		//'YRSGOVT',
		'APPROVE'
	],
	idProperty: 'EMPID',
	proxy: {
		type: 'rest',
		url: '/training/nominees'
	}

});

//report On-going Training
Ext.define('REPORT_OGT',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name:'COURSESTART',
			type:'date'
		},
		{
			name:'COURSEEND',
			type:'date'
		},
		'CourseCode', 
		'instName',
		'venue'		
		//'OGTOFATTENDEES',	
	],
	proxy: {
		type: 'rest',
		url: '/training/report_ogt'
	}
});
//report training
Ext.define('REPORT_TRAINING',{
	extend: 'Ext.data.Model',
	fields:[
		{
			name:'COURSESTART',
			type:'date'
		},
		{
			name:'COURSEEND',
			type:'date'
		},
		'CourseCode', 
		'instName',
		'venue',
		'attachment'
		//'OGTOFATTENDEES',	
	],
	proxy: {
		type: 'rest',
		url: '/training/report_training'
	}
}); 
//report training institution
Ext.define('REPORT_TRAININGINST',{
	extend: 'Ext.data.Model',
	fields:[
		{
			name:'courseStart',
			type:'date'
		},
		{
			name:'courseEnd',
			type:'date'
		},
		'CourseCode', 
		'instName',
		'venue',		
		'noAttendees'	
	],
	proxy: {
		type: 'rest',
		url: '/training/report_traininginst'
	}
});
//Progress Report
Ext.define('PROGRESS_REPORT',{
	extend: 'Ext.data.Model',
	fields:[
		{
			name:'progdate',
			type:'date'
		},
		'courseName', 
		'instName',
		'progData'		
	],
	proxy: {
		type: 'rest',
		url: '/training/progress_report'
	}
});
//query training
 Ext.define('QUERY_TRAINING',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name:'courseStart',
			type:'string'
		},
		{
			name:'courseEnd',
			type:'string'
		},
		'courseName', 
		'instName',
		'venue',		
		'noAttendees'	
	],
	proxy: {
		type: 'rest',
		url: '/training/query_training'
	}
}); 

//List of Trainings Grid
var trainingGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingGrid',
	title: 'List of trainings',
	tools: [
		{ 
			xtype: 'textfield', 
			emptyText: 'Course Name',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = trainingGrid.getStore();
					store.clearFilter(true);
					store.filter([{filterFn: function(rec){
							return rec.get("COURSENAME").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
						}
					}]);
				}
			},
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
	],
	columns: [
		{
			text: 'Invite code',
			dataIndex: 'INVITECODE',
			menuDisabled:true,
			sortable:true,
			flex: 0.7
		},
		{
			text: 'Course',
			dataIndex: 'COURSENAME',
			flex: 1,
			renderer: function(v){
				return '<span style="color: blue; cursor: pointer;">' + (v?v:'') + '<span>';
			},
			tdCls:'wrap-text',
			menuDisabled:true,
			sortable:true
		},	
		{
			text: 'Training Institution',
			dataIndex: 'INSTNAME',
			flex: 1,
			menuDisabled:true,
			sortable:true,
			tdCls:'wrap-text'
		},
		{
			text: 'Start',
			dataIndex: 'COURSESTART',
			width: 120,
			menuDisabled:true,
			sortable:true,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'End',
			dataIndex: 'COURSEEND',
			width: 120,
			menuDisabled:true,
			sortable:true,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'Venue',
			menuDisabled:true,
			sortable:true,
			dataIndex: 'VENUE',
			flex: 1
		},
		{
			text: 'Local training?',
			xtype:'checkcolumn',
			disabled:true,
			menuDisabled:true,
			sortable:false,
			dataIndex: 'LOCAL',
			flex: 1
		}
	],
	store: Ext.create('Ext.data.Store', {
		model: 'TRAINING_INVITATION',
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'COURSESTART', direction: 'DESC'}
	}),
	listeners: {
		cellclick: function(grid, td, cellIndex, rec){
			if(cellIndex === 1){
				trainingMaintenancePanel.switch(trainingForm);
				trainingForm.loadRecord(rec);
				var INVITECODE = rec.data.INVITECODE;
				
				var me = this;
				Ext.Ajax.request({
					url: '/training/nominees/'+INVITECODE,
					method: 'PUT',
					
					success: function(response){
						var nominees = Ext.decode(response.responseText);
						trainingForm.getNominees(nominees);
						
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.statusText);
					}
				
				}); 
				
				trainingForm.disableAll();
				
				var click = trainingForm.down('#requirementsForm').down('#btnSave');//.down('#btnSave').disabled = true;
				click.disabled=true;
				/* var click2 = trainingForm.down('#requirementsForm').down('#btnUpdate');
				click2.disabled = false; */
			}
		},
		
		viewready: function (grid) {
			var view = grid.view;
			
			// record the current cellIndex
			grid.mon(view, {
				uievent: function (type, view, cell, recordIndex, cellIndex, e) {
					grid.cellIndex = cellIndex;
					grid.recordIndex = recordIndex;
				}
			});
			
			grid.tip = Ext.create('Ext.tip.ToolTip', {
				target: view.el,
				delegate: '.x-grid-cell',
				trackMouse: true,
				renderTo: Ext.getBody(),
				listeners: {
					beforeshow: function updateTipBody(tip) {
						if (!Ext.isEmpty(grid.cellIndex) && grid.cellIndex !== -1) {
							header = grid.headerCt.getGridColumns()[grid.cellIndex];
							tip.update(grid.getStore().getAt(grid.recordIndex).get(header.dataIndex));
						}
					}
				}
			});

		}
		
	},
	buttons: [
		{
			text: 'New training',
			handler: function(){
				var rec = Ext.create('TRAINING_INVITATION',{
					INVITECODE: '[new]',
					COURSECODE: null,
					INSTCODE: null,
					COURSESTART: null,
					COURSEEND: null,
					VENUE: null,
					LOCAL: null,
					REQ_AGE: null,
					REQ_GENDER: null,
					CIVIL_STATUS:null,
					REQ_YRGOV:null,
					APPT_STAT:null,
					COURSE_PREREQ:null,
					EDUC_DEGREE:null,
					EDUC_COURSE:null
				});
				rec.phantom = true;
				trainingForm.loadRecord(rec);
				trainingForm.getLastCode();
				trainingMaintenancePanel.switch(trainingForm);
				
				var enableAllComponents = trainingForm.enableAll();
				
				var btnUpdate = trainingForm.down('#requirementsForm').down('#btnUpdate');
				btnUpdate.disabled=true;
				var btnDelete = trainingForm.down('#requirementsForm').down('#btnDelete');
				btnDelete.disabled=true;
				var click2 = trainingForm.down('#requirementsForm').down('#btnSave');
				click2.disabled = false;
			}
		}
	]

});

Ext.apply(Ext.form.field.VTypes, {
	daterange: function(val, field) {
		var date = field.parseDate(val);

		if (!date) {
			return false;
		}
		if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
			var start = field.up().down('#' +field.startDateField);
			console.log(start);
			start.setMaxValue(date);
			start.validate();
			this.dateRangeMax = date;
		}
		else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
			var end = field.up().down('#' + field.endDateField);
			console.log(end);
			end.setMinValue(date);
			end.validate();
			this.dateRangeMin = date;
		}
		/*
		 * Always return true since we're only using this vtype to set the
		 * min/max allowed values (these are tested for after the vtype test)
		 */
		return true;
	},

	daterangeText: 'Start date must be less than end date'
});
var trainingForm = Ext.create('Ext.form.Panel', {
	itemId: 'mainPanel',
	bodyPadding: 5,
	autoScroll:true,
	getLastCode: function ()
	{
		var me = this;
		Ext.Ajax.request({
			url: '/getInviteCode',
			method: 'get',
			success: function(response){
				var result = Ext.decode(response.responseText);
				me.generateCode(result);
			},
			failure: function(response){
				Ext.Msg.alert('Error', response.status);
				
			}

		}); 
		

	},
	getNominees:function(nom){
		
		var me = this;
		var gridNominees = me.down('#nomineesGrid');
		gridNominees.getStore().removeAll();
		//console.log(gridNominees);
		
		for(var item in nom){
			var nomi = nom[item];
			//console.log(nomi);
			gridNominees.getStore().add({
				EMPID: nomi.EMPID,
				EMPNAME: nomi.EMPNAME,
				REMARKS: nomi.REMARKS,
				APPROVE: nomi.APPROVE
			});
		}
	},
	pad: function(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	},
	generateCode: function(x){
		var me = this;
		var lastDigit = parseInt(x.lastDig)+1;
		var showCode = me.pad(lastDigit,4);
		var d = new Date();
		var inviteCode = d.getFullYear() + '-' + showCode;
		me.down('#txtInviteCode').setValue(inviteCode);
		
	},
	enableAll:function(){
		var me = this;
		me.down('#cboInstitution').disabled = false;
		me.down('#cboCourse').disabled = false;
		me.down('#dteStart').disabled = false;
		me.down('#dteEnd').disabled = false;
		me.down('#txtVenue').disabled = false;
		me.down('#chkLocal').disabled = false;
		me.down('#btnUpdate').disabled = false;
		me.down('#btnEdit').disabled = true;
		
	},
	disableAll:function(){
		var me = this;
		me.down('#cboInstitution').disabled = true;
		me.down('#cboCourse').disabled = true;
		me.down('#dteStart').disabled = true;
		me.down('#dteEnd').disabled = true;
		me.down('#txtVenue').disabled = true;
		me.down('#chkLocal').disabled = true;
		me.down('#btnUpdate').disabled = true;
		
	},
	
	items:[
		{
			xtype:'panel',
			itemId: 'trainingForm',
			title: 'Training Details',
			bodyPadding:20,
			trackResetOnLoad: true,
			
			
			tools:[
				{
					xtype:'button',
					text:'Edit',
					itemId:'btnEdit',
					handler: function(){
						var me = this.up('#mainPanel');
						me.enableAll();
					}
				}
			],
			items:[
				{
					xtype: 'textfield',
					fieldLabel: 'Invite code',
					labelWidth: 120,
					name: 'INVITECODE',
					itemId:'txtInviteCode',
					disabled:true
				},
				{
					xtype: 'combobox', 
					fieldLabel: 'Training Institution',
					itemId:'cboInstitution',
					labelWidth: 120,
					width: 600,
					queryMode: 'local',
					enableRegEx: true,
					forceSelection: true,
					name: 'INSTCODE',
					valueField: 'INSTCODE',
					displayField: 'INSTNAME',
					store: Ext.create('Ext.data.Store',{
						autoLoad: true,
						fields: ['INSTCODE', 'INSTNAME'],
						proxy: {
							type: 'ajax',
							url: '/getInstitution'
						}
					}),
					listeners: {
						change: function(combo, newVal, oldVal){
							trainingForm.down('#INSTNAME').setValue(this.getRawValue());
						}
					}
					
				},
				{
					xtype: 'combobox', 
					fieldLabel: 'Course',
					itemId:'cboCourse',
					labelWidth: 120,
					width: 600,
					queryMode: 'local',
					enableRegEx: true,
					forceSelection: true,
					name: 'COURSECODE',
					valueField: 'COURSECODE',
					displayField: 'COURSENAME',
					store: Ext.create('Ext.data.Store',{
						autoLoad: true,
						fields: ['COURSECODE', 'COURSENAME'],
						proxy: {
							type: 'ajax',
							url: '/getCourseLibrary'
						}
					}),
					listeners: {
						change: function(combo, newVal, oldVal){
							trainingForm.down('#COURSENAME').setValue(this.getRawValue());
						}
					}
				},
				{
					xtype: 'datefield', 
					fieldLabel: 'Start',
					itemId:'dteStart',
					labelWidth: 120,
					name: 'COURSESTART',
					vtype: 'daterange',
					endDateField: 'dteEnd'
					
				},
				{
					xtype: 'datefield', 
					fieldLabel: 'End',
					itemId:'dteEnd',
					labelWidth: 120,
					name: 'COURSEEND',
					vtype: 'daterange',
					startDateField: 'dteStart'
					
				},
				{
					xtype: 'textareafield', 
					fieldLabel: 'Venue',
					itemId:'txtVenue',
					labelWidth: 120,
					name: 'VENUE'
				},
				{
					xtype: 'checkboxfield', 
					fieldLabel: 'Local',
					itemId:'chkLocal',
					labelWidth: 120,
					name: 'LOCAL'
				}, 
				{
					xtype: 'hidden',
					itemId: 'INSTNAME',
					labelWidth: 120,
					name: 'INSTNAME'
				},
				{
					xtype: 'hidden',
					itemId: 'COURSENAME',
					labelWidth: 120,
					name: 'COURSENAME'
				}
			]
		},
		{
			xtype:'panel',
			itemId: 'requirementsForm',
			title: 'Requirement Details',
			bodyPadding:20,
			fbar: [
				'->',
				{
					xtype:'button',
					text: 'Save',
					itemId:'btnSave',
					handler: function(){
						
						var rec = trainingForm.getRecord();
						
						trainingForm.updateRecord(rec);
						
						
						var trainingData = rec.data;
						
						Ext.Ajax.request({
							url: '/training/training_invitation',
							method: 'POST',
							jsonData: {
								trainingValues: trainingData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Training has been added!');
								
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						
						}); 
						
						if(rec.phantom)
							trainingGrid.getStore().add(rec);
						
						//trainingForm.reset();
						//maintenancePanel.switch(trainingGrid);
					}
				},
				{
					xtype:'button',
					text: 'Update',
					itemId:'btnUpdate',
					handler: function(){
						
						var rec = trainingForm.getRecord();
						
						trainingForm.updateRecord(rec);
						
						
						var trainingData = rec.data;
						Ext.Ajax.request({
							url: '/training/training_invitation/'+rec.data.INVITECODE,
							method: 'put',
							jsonData: {
								trainingValues: trainingData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Training has been updated!');
								
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						
						}); 
						
						/* Ext.Ajax.request({
							url: '/training/nominees',
							method: 'GET',
							jsonData: {
								forNominees: trainingData
							},
							success: function(response){
								var me = this;
								console.log(me);
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						}); */
						
						if(rec.phantom)
							trainingGrid.getStore().add(rec);
						
						//trainingForm.reset();
						//maintenancePanel.switch(trainingGrid);
					}
				},
				{
					xtype:'button',
					text: 'Delete',
					itemId:'btnDelete',
					handler: function(){
						var rec = trainingForm.getRecord();
						var trainingData = rec.data.INVITECODE;
						Ext.Ajax.request({
							url: '/training/delete/training_invitation',
							method: 'POST',
							jsonData: {
								deleteValues: trainingData
							},
							success: function(response){
								//Ext.Msg.alert('Success', 'Training invitaion successfully deleted!');
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						});
						Ext.Msg.alert('Success', 'Training invitaion successfully deleted!');
						trainingMaintenancePanel.switch(trainingGrid);
						
					}
				},
				'-',
				{
					xtype:'button',
					text: 'Back',
					handler: function(){
						
						/* var rec = trainingForm.getRecord();
						if(trainingForm.isDirty()){
							Ext.Msg.show({
								title:'Save Changes?',
								msg: 'You have unsaved changes. Would you like to save your changes?',
								buttons: Ext.Msg.YESNOCANCEL,
								icon: Ext.Msg.QUESTION,
								fn: function(btn) {
									if(btn === 'yes') {
										var rec = trainingForm.getRecord();
										trainingForm.updateRecord(rec);
									} 
									
									if(btn === 'no'){
										// do nothing
									}
									if(btn === 'cancel'){
										return;
									}
									trainingForm.reset();
									maintenancePanel.switch(trainingGrid);
								}
							});
						} else { */
							trainingForm.reset(true);
							trainingMaintenancePanel.switch(trainingGrid);
						//}
						
						
					}
				}
				
			],
			items: [					
				{
					xtype: 'textfield',
					itemId:'txtage',
					name:'REQ_AGE',
					fieldLabel: 'Age:',
					width: 200,
					labelWidth: 120	
				},
				{
					xtype      : 'fieldcontainer',
					fieldLabel : 'Sex',
					name	   :'REQ_GENDER',
					defaultType: 'radiofield',
					labelWidth : 120,
					layout	   : 'hbox',								
					items: [
						{
							boxLabel  : 'Female',
							name      :'REQ_GENDER',
							inputValue: '1',
							id        : 'radio1',
							width     : 80
						}, {
							boxLabel  : 'Male',
							name      :'REQ_GENDER',
							inputValue: '2',
							id        : 'radio2',
							width     : 80							
						}, {
							boxLabel  : 'Both',
							name      :'REQ_GENDER',
							inputValue: '0',
							id        : 'radio3',
							width     : 80
						}
					]
				},
				{
					xtype      : 'fieldcontainer',
					fieldLabel : 'Civil Status',
					name       :'CIVIL_STATUS',
					defaultType: 'radiofield',
					labelWidth : 120,					
					layout: 'hbox',
					items: [
						{
							boxLabel  : 'Single',
							name      :'CIVIL_STATUS',
							inputValue: 'Single',
							id        : 'cs1',
							width     : 80
						}, {
							boxLabel  : 'Married',
							name      :'CIVIL_STATUS',
							inputValue: 'Married',
							id        : 'cs2',
							width     : 80
						}, {
							boxLabel  : 'Both',
							name      :'CIVIL_STATUS',
							inputValue: 'Both',
							id        : 'cs3',
							width     : 80							
						}
					]
				},
				{
					xtype: 'textfield',
					itemId:'txtyis',
					name:'REQ_YRGOV',
					fieldLabel: 'Years In Service (At Least):',
					width: 200,
					labelWidth: 120		
				},
				{
					xtype: 'checkboxfield',
					fieldLabel: 'Permanent',
					labelWidth: 120,
					name:'APPT_STAT'
				},
				{
					xtype:'combo', 
					itemId:'cboPreReq',
					queryMode: 'local', 
					store: Ext.create('Ext.data.Store',{
					   autoLoad: true, 
						fields: ['COURSENAME'], 
						storeId:'storeCourseLib',
						proxy: { 
							type: 'ajax', 
							url: '/training/course_lib' 
						}
						
					}),
					displayField:'COURSENAME',
					valueField: 'COURSENAME',
					emptyText: 'Select Pre-requisite',
					fieldLabel:'Course Pre-requisite (if any):',
					name:'COURSE_PREREQ',
					width: 600,
					labelWidth: 120								
				},
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					items: [
						{						
							xtype: 'combo',
							itemId:'cboeducdegree',
							fieldLabel:'Education:',
							name:'EDUC_DEGREE',
							emptyText: 'Degree',
							width: 400,
							labelWidth: 120,
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
							emptyText: 'Select Degree',
							renderer: function(val){
								var ref = Ext.data.StoreManager.lookup('storeDegree');
								index = ref.findExact('degreeCode',val); 
								if (index != -1){
									rs = ref.getAt(index).data; 
									return rs.degreeTitle; 
								}
							},
							flex:1					
						},
						{
							xtype: 'combo',
							itemId:'cboeduccourse',	
							name:'EDUC_COURSE',
							emptyText: 'Course',
							width: 400,
							labelWidth: 120,
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
							emptyText: 'Select Course',
							renderer: function(val){
								var ref = Ext.data.StoreManager.lookup('storeCourse');
								index = ref.findExact('courseCode',val); 
								if (index != -1){
									rs = ref.getAt(index).data; 
									return rs.courseTitle; 
								}
							},
							flex:1
						},
						
						
					]
				},
				//
				{
					xtype: 'grid',	
					itemId:'nomineesGrid',
					store: Ext.create('Ext.data.Store', {
						model: 'NOMINEES',
						autoLoad: true,
						autoSync: true,
						sortOnLoad: true,
						sorters: {property: 'EMPNAME', direction: 'ASC'}

					}),
					columns: [
						{
							header: 'Employee ID',
							dataIndex: 'EMPID',
							editor:
							{
								xtype:'combo',
								queryMode: 'local',
								enableRegEx: true,
								forceSelection: true,
								name: 'EMPID',
								valueField: 'EMPID',
								displayField: 'EMPNAME',
								store: Ext.create('Ext.data.Store',{
									autoLoad: true,
									fields: ['EMPID', 'EMPNAME'],
									proxy: {
										type: 'ajax',
										url: '/getEmployee'
									}
								}),
								listeners: {
									change: function(combo, newVal, oldVal){
										nomineesGrid.down('#EMPNAME').setValue(this.getRawValue());
									}
								}
							},
							flex: 0.50
						},
						{
							header: '<center>Employee Name</center>',
							dataIndex: 'EMPNAME',
							name:'EMPNAME',
							flex: 0.50
						},
						{
							header: '<center>Remarks</center>',
							dataIndex: 'REMARKS',
							editor:'textfield',
							flex: 1
						},
						{
							xtype: 'checkcolumn',
							header: 'Approve?',
							dataIndex: 'APPROVE',
							width: 60,
							flex: 0.20,
							editor: {
								xtype: 'checkbox',
								cls: 'x-grid-checkheader-editor'
							}
						}
					],
					buttons: [
						{
							text: 'New Nominee',
							handler: function(){
								var grid = this.up('grid');
								var store = grid.getStore();
								var rowEdit = grid.getPlugin('rowEditingPlugin');
								var rec = Ext.create('NOMINEES',{
									EMPID:'[new]',
									EMPNAME:null,
									REMARKS:null, 
									YRSGOVT:null,
									APPROVE:null,
									INVITECODE:null
								});
								store.add(rec);
								rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
							}
						},
						{
							xtype:'button',
							text: 'Save',
							handler: function(){
								var me = this;
								var nominees = [];
								var grid = me.up('grid');
								var store = grid.getStore();
								var panel1 = grid.up('panel');
								var panel2 = panel1.up('panel');
								store.clearFilter(true);
								store.data.each(function(row) {
									nominees.push({ 
										EMPID: row.data['EMPID'],
										APPROVE: row.data['APPROVE'],
										REMARKS: row.data['REMARKS'],
										INVITECODE: panel2.down('#txtInviteCode').getValue()
									});
								});
								
								var INVITECODE = panel2.down('#txtInviteCode').getValue();
								
								//console.log(nominees[0].APPROVE);
								Ext.Ajax.request({
									url: '/training/save/nominees',
									method: 'POST',
									jsonData: {
										listOfNominees: nominees
									},
									success: function(response){
										Ext.Msg.alert('Success', 'Nominees library has been updated!');
									},
									failure: function(response){
										Ext.Msg.alert('Error', response.statusText);
										
									}
								
								}); 
							}
						},
						{
							text: 'Remove',
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
				//
			]
		}
		
		
	]
});

//Training Progress Grid
var trainingProgressGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingProgressGrid',
	title: 'Training Progress',
	tools: [
		
		{ 
			xtype: 'textfield', 
			emptyText: 'Employee Name',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					
					var store = trainingProgressGrid.getStore();
					store.clearFilter(true);
					store.filter([{filterFn: function(rec){
							return rec.get("EMPNAME").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
						}
					}
					]);
				}
			},
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
		
	],
	columns: [
		{ 
			header: '<center>Invite Code<\center>', 
			autoScroll:true,
			dataIndex: 'INVITECODE', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .60
		},				
		{
			header: '<center>Employee</br>ID<\center>',
			dataIndex: 'EMPID', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: .40
		},
		{
			header: '<center>Employee Name<\center>',
			dataIndex: 'EMPNAME', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1
		},
		{
			header: '<center>Date<\center>',
			dataIndex: 'PROGDATE', 
			format:'m/d/Y',
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			renderer: Ext.util.Format.dateRenderer('m/d/Y'),
			flex: .50
		},	
		{
			header: '<center>Details<\center>',
			dataIndex: 'DETAILS', 
			menuDisabled:true, 
			sortable:false,	
			flex: 1.5
		},
		{ 
			header: '<center>Attachment</center>',
			dataIndex: 'PROGATT',
			renderer: function(v){
				return '<span style="color: blue; cursor: pointer;">' + (v?v:'') + '<span>';
			},
			tdCls:'wrap-text',
			flex:.80,
			menuDisabled:true, 
			sortable:false,	
			
		}
	
	],	
	store: Ext.create('Ext.data.Store', {
		model: 'PROGRESS',
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'INVITECODE', direction: 'ASC'}
	}),	
	listeners: {
		cellclick: function(grid, td, cellIndex, rec){
			if(cellIndex === 1){
				trainingProgressPanel.switch(progressForm);
				progressForm.loadRecord(rec);
				
				progressForm.down('panel').down('#btnSave').disabled = true;
				
			} 
			if(cellIndex === 4){
				var me = this;
				var store = me.getStore();
				console.log(store.data);
			}
			if(cellIndex === 5){
				
				var inviteCode = rec.data.INVITECODE;
				var fileName = inviteCode+'-'+rec.data.PROGATT;
				window.open("http://localhost:8001/uploads/" + fileName, '_blank');
			}
		}
	},
	buttons: [
		{
			text: 'New Progress',
			handler: function(){
				var rec = Ext.create('PROGRESS',{
					INVITECODE: '[new]',
					EMPID: null,
					PROGDATE: null,
					DETAILS: null,
					PROGATT: null
				});
				rec.phantom = true;
				progressForm.loadRecord(rec);
				progressForm.down('panel').down('#btnEdit').disabled = true;
				progressForm.down('panel').down('#btnUpdate').disabled = true;
				progressForm.down('panel').down('#btnDelete').disabled = true;
				progressForm.down('panel').down('#btnSave').disabled = false;
				progressForm.down('panel').down('#cboInviteCode').disabled = false;
				progressForm.down('panel').down('#cboEmployee').disabled = false;
				progressForm.down('panel').down('#PROGDATE').disabled = false;
				progressForm.down('panel').down('#txtDetails').disabled = false;
				progressForm.down('panel').down('#PROGATT').disabled = false;
				trainingProgressPanel.switch(progressForm);
				
				
			}
		}
		
	]
});

//Training Progress Form
var progressForm = Ext.create('Ext.form.Panel', {
	itemId: 'progressPanel',
	bodyPadding: 5,
	autoScroll:true,
	items:[
		{
			xtype:'panel',
			itemId: 'progressForm',
			title: 'Training Progress Details',
			bodyPadding:20,
			trackResetOnLoad: true,
			fbar: [
				'->',
				
				{
					xtype:'button',
					text: 'Save',
					itemId:'btnSave',
					handler: function(){
						var form = this.up('form').getForm();
						//console.log(form);
						if(form.isValid()){
							form.submit({
								url: '/upload',
								method:'POST',
								headers: {'Content-Type':'multipart/form-data; charset=UTF-8'},
								waitMsg: 'Uploading your file...',
								success: function(form, response) {
									Ext.MessageBox.alert('File Upload', 'Uploaded successfully.');
									var d = Ext.decode(response.response.responseText);
									//console.log(d.file);
								},
								failure: function() {
									Ext.Msg.show({
										title:'Upload File',
										msg: 'Fail',
										buttons: Ext.Msg.OK,
										icon: Ext.Msg.ERROR
									});
								}
							});
						}
						
						
						var me = this.up('panel');
						var panel = me.up('panel');
						
						var rec = progressForm.getRecord();
						
						progressForm.updateRecord(rec); 
						
						var progressData = rec.data;
						//console.log(progressData);
						Ext.Ajax.request({
							url: '/training/save/progress',
							method: 'POST',
							jsonData: {
								progressValues: progressData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Training progress has been added!');
								
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						
						}); 
						
						if(rec.phantom)
							trainingProgressGrid.getStore().add(rec);
					} 
				},
				{
					xtype:'button',
					text: 'Edit',
					itemId:'btnEdit',
					handler: function(){
						this.up('panel').down('#txtDetails').disabled = false;
						this.up('panel').down('#btnUpdate').disabled = false;
						this.up('panel').down('#btnEdit').disabled = true;
					}
				},
				{
					xtype:'button',
					text: 'Update',
					itemId:'btnUpdate',
					handler: function(){
						var me = this.up('panel');
						var panel = me.up('panel');
						
						var rec = progressForm.getRecord();
						
						progressForm.updateRecord(rec); 
						
						var progressData = rec.data;
						//console.log(progressData);
						Ext.Ajax.request({
							url: '/training/update/progress',
							method: 'POST',
							jsonData: {
								progressValues: progressData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Training progress has been added!');
								
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						
						}); 
						
						if(rec.phantom)
							trainingProgressGrid.getStore().add(rec);
					}
				},
				{
					xtype:'button',
					text: 'Delete',
					itemId:'btnDelete',
					handler: function(){
						var rec = progressForm.getRecord();
						var progressData = rec.data;
						Ext.Ajax.request({
							url: '/training/delete/training_progress',
							method: 'POST',
							jsonData: {
								deleteCode: progressData
							},
							success: function(response){
								//Ext.Msg.alert('Success', 'Training invitaion successfully deleted!');
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						});
						Ext.Msg.alert('Success', 'Training progress successfully deleted!');
						trainingProgressPanel.switch(trainingProgressGrid);
					}
				},
				'-',
				{
					xtype:'button',
					text: 'Back',
					handler: function(){
						progressForm.reset(true);
						
						trainingProgressPanel.switch(trainingProgressGrid);
					}
				}
				
			],
			items:[
				{
					xtype: 'combobox', 
					fieldLabel: 'Invite Code',
					itemId:'cboInviteCode',
					labelWidth: 120,
					width: 600,
					queryMode: 'local', 
					store: Ext.create('Ext.data.Store',{
						autoLoad: true, 
						fields: ['INVITECODE', 'COURSENAME'], 
						storeId:'storeInviteCode',
						proxy: { 
							type: 'ajax', 
							url: '/getInvitation' 
						}
						
					}),
					displayField:'COURSENAME',
					valueField: 'INVITECODE',
					emptyText: 'Select Invite Code',
					enableRegEx: true,
					forceSelection: true,
					name: 'INVITECODE'
					//disabled:true
					/* listeners: {
						change: function(combo, newVal, oldVal){
							progressForm.down('#INVITECODE').setValue(this.getRawValue());
						}
					} */
				},
				{
					xtype: 'combobox', 
					fieldLabel: 'Employee Name',
					itemId:'cboEmployee',
					labelWidth: 120,
					width: 600,
					queryMode: 'local',
					enableRegEx: true,
					forceSelection: true,
					name: 'EMPID',
					valueField: 'EMPID',
					displayField: 'EMPNAME',
					store: Ext.create('Ext.data.Store',{
						autoLoad: true,
						fields: ['EMPID', 'EMPNAME'],
						proxy: {
							type: 'ajax',
							url: '/getEmployee'
						}
					})
					//disabled:true
					/* listeners: {
						change: function(combo, newVal, oldVal){
							trainingForm.down('#EMPLOYEE_NAME').setValue(this.getRawValue());
						}
					} */
					
				},
				{
					xtype: 'datefield', 
					fieldLabel: 'Progress Date',
					itemId:'PROGDATE',
					labelWidth: 120,
					name: 'PROGDATE'
					//disabled:true
				},
				{
					xtype: 'textareafield', 
					fieldLabel: 'Details',
					itemId:'txtDetails',
					labelWidth: 120,
					width: 600,
					name: 'DETAILS'
					//disabled:true
				},
				{
					xtype: 'filefield', 
					fieldLabel: 'Attachment',
					itemId:'PROGATT',
					labelWidth: 120,
					width: 600,
					name: 'PROGATT',
					listeners:{
						change: function(fld, value) {
						  var newValue = value.replace(/C:\\fakepath\\/g, '');
						  fld.setRawValue(newValue);                                                         
						}
					}
					//disabled:true
				}
				
			]
		}
	]
});



//Special Order Grid
var specialOrderGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'specialOrderGrid',
	title: 'Special Order',
	getSpecialOrder: function(){
		var sOrder = [];

		var grid = this;
		var store = grid.getStore();
		store.clearFilter(true);
		store.data.each(function(row) {
			sOrder.push({ 
				INVITECODE: row.data['INVITECODE'], 
				SONO: row.data['SONO'],
				SODATE: row.data['SODATE'],
				SOSUBJECT: row.data['SOSUBJECT']
			});
		});
		
		return sOrder;
		
	},
	tools: [
		
		{ 
			xtype: 'textfield', 
			emptyText: 'Subject',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = specialOrderGrid.getStore();
					store.clearFilter(true);
					store.filter([{filterFn: function(rec){
							return rec.get("SOSUBJECT").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
						}
					}
					]);
				}
			},
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
		
	],
	columns: [
		{ 
			header: '<center>Invite Code<\center>', 
			autoScroll:true,
			dataIndex: 'INVITECODE', 
			editor: {
				xtype:'combo', 
				fixed:true, 
				menuDisabled:true, 
				sortable:false,
				queryMode: 'local', 
				store: Ext.create('Ext.data.Store',{
				   autoLoad: true, 
					fields: ['INVITECODE', 'COURSENAME'], 
					storeId:'storeInviteCode',
					proxy: { 
						type: 'ajax', 
						url: '/getInvitation' 
					}
					
				}),
				displayField:'COURSENAME',
				valueField: 'INVITECODE',
				emptyText: 'Select Invite Code',
				renderer: function(val){
					var ref = Ext.data.StoreManager.lookup('storeInviteCode');
					index = ref.findExact('INVITECODE',val); 
					if (index != -1){
						rs = ref.getAt(index).data; 
						return rs.COURSENAME; 
					}
				}
			},
			flex: .35
		},				
		{
			header: '<center>Special Order Number<\center>',
			dataIndex: 'SONO', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			renderer: function(v){
				return '<span style="color: blue; cursor: pointer;">' + (v?v:'') + '<span>';
			},
			tdCls:'wrap-text',
			flex: .35
		},
		{
			header: '<center>Special Order Date<\center>',
			dataIndex: 'SODATE', 
			editor: 'datefield', 
			format:'m/d/Y',
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			renderer: Ext.util.Format.dateRenderer('m/d/Y'),
			flex: .30
		},	
		{
			header: '<center>Subject<\center>',
			dataIndex: 'SOSUBJECT', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1
		}
	],	
	store: Ext.create('Ext.data.Store', {
		model: 'SPECIAL_ORDER',
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'SONO', direction: 'ASC'}
		
	}),	
	
	listeners: {
		cellclick: function(grid, td, cellIndex, rec){
			if(cellIndex === 1){
				specialOrderPanel.switch(specialOrderForm);
				specialOrderForm.loadRecord(rec);
				var INVITECODE = rec.data.INVITECODE;
				
				var me = this;
				Ext.Ajax.request({
					url: '/training/approvedNominees/'+INVITECODE,
					method: 'PUT',
					
					success: function(response){
						var nominees = Ext.decode(response.responseText);
						specialOrderForm.getNominees(nominees);
						
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.statusText);
					}
				
				}); 
			}
		}
	},
	buttons: [
		{
			xtype:'button',
			text: 'New Special Order',
			handler: function(){
				var grid = this.up('grid');
				var store = grid.getStore();
				console.log(store);
				/* var rowEdit = grid.getPlugin('rowEditingPlugin');
				var rec = Ext.create('SPECIAL_ORDER',{
					INVITECODE: '[new]',
					SONO: null,
					SODATE: null,
					SOSUBJECT: null
				});
				store.add(rec);
				rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0); */
				
			}
		},
		{
			xtype:'button',
			text: 'Save',
			handler: function(){
				var me = this;
				var panel = me.up('#specialOrderGrid');
				var SO = panel.getSpecialOrder();
				
				Ext.Ajax.request({
					url: '/saveSpecialOrder',
					method: 'POST',
					jsonData: {
						specialOrderList: SO
					},
					success: function(response){
						Ext.Msg.alert('Success', 'Special Order library has been updated!');
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.statusText);
						
					}
				
				}); 
			}
		},
		{
			text: 'Remove',
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
		},
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(specialOrderGrid);
			}
		}
	],
	plugins: [
		Ext.create('Ext.grid.plugin.RowEditing', {
			pluginId: 'rowEditingPlugin',
			clicksToMoveEditor: 1,
			autoCancel: false
		})
	]
});

//Special Order Form
var specialOrderForm = Ext.create('Ext.form.Panel', {
	itemId: 'specialOrderPanel',
	bodyPadding: 5,
	autoScroll:true,
	getNominees:function(nom){
		
		var me = this;
		var gridNominees = me.down('#nomineesGrid');
		gridNominees.getStore().removeAll();
		
		
		for(var item in nom){
			var nomi = nom[item];
			
			gridNominees.getStore().add({
				EMPID: nomi.EMPID,
				EMPNAME: nomi.EMPNAME,
				REMARKS: nomi.REMARKS,
				APPROVE: nomi.APPROVE
			});
		}
	},
	enableAll:function(){
		var me = this;
		me.down('#txtInviteCode').disabled = false;
		me.down('#dteSO').disabled = false;
		me.down('#txtSOSubject').disabled = false;
		me.down('#btnUpdate').disabled = false;
		me.down('#btnEdit').disabled = true;
		/*me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false; */
	},
	disableAll:function(){
		var me = this;
		me.down('#txtInviteCode').disabled = true;
		me.down('#dteSO').disabled = true;
		me.down('#txtSOSubject').disabled = true;
		
	},
	items:[
		{
			xtype: 'textfield',
			fieldLabel: 'Invite code',
			labelWidth: 120,
			name: 'INVITECODE',
			itemId:'txtInviteCode',
			disabled:true
		},
		{
			xtype: 'textfield', 
			fieldLabel: 'S.O. #',
			labelWidth: 120,
			itemId:'txtSONO',
			name: 'SONO',
			disabled:true
		},
		
		{
			xtype: 'grid',	
			itemId:'nomineesGrid',
			store: Ext.create('Ext.data.Store', {
				model: 'NOMINEES',
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true,
				sorters: {property: 'EMPNAME', direction: 'ASC'}

			}),
			
			columns: [
				{
					header: 'Employee ID',
					dataIndex: 'EMPID',
					/* editor:'textfield',
					editor:
					{
						xtype:'combo',
						queryMode: 'local',
						enableRegEx: true,
						forceSelection: true,
						name: 'EMPID',
						valueField: 'EMPID',
						displayField: 'EMPNAME',
						store: Ext.create('Ext.data.Store',{
							autoLoad: true,
							fields: ['EMPID', 'EMPNAME'],
							proxy: {
								type: 'ajax',
								url: '/getEmployee'
							}
						}),
						listeners: {
							change: function(combo, newVal, oldVal){
								nomineesForm.down('#EMPID').setValue(this.getRawValue());
							}
						}
					}, */
					flex: 0.30
				},
				
				{
					header: '<center>Employee Name</center>',
					dataIndex: 'EMPNAME',
					//editor:'textfield',
					flex: 0.50
				},
				{
					header: '<center>Remarks</center>',
					dataIndex: 'REMARKS',
					//editor:'textfield',
					flex: 1
				}
			],
			buttons: [
				
				{
					text: 'Print',
					handler: function(){
						var nomineesGrid = this.up('grid');
						Ext.ux.grid.Printer.printAutomatically = false;
						Ext.ux.grid.Printer.print(nomineesGrid);
					}
				},
				{
					xtype:'button',
					text: 'Back',
					handler: function(){
					
						specialOrderForm.reset(true);
						specialOrderPanel.switch(specialOrderGrid);
						
						
						
					}
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
});
//Report Training
var trainingReportGrid = Ext.create('Ext.grid.Panel', {
		xtype: 'grid',
		itemId: 'trainingReportGrid',
		title: 'Training',			
		disableSelection: true,					
		columns: [
			{
				text: 'Course Description',
				dataIndex: 'coursename',
				flex: 1.5
			},
			{
				header: '<center>Training <br> Institution<\center>', 
				dataIndex: 'instName',
				flex: 1			
			},	
			{
				text: 'Venue',
				dataIndex: 'venue',
				flex: 1.5
			},
			{
				text: 'Date Start',
				dataIndex: 'COURSESTART',
				width: 150,
				renderer: Ext.util.Format.dateRenderer('Y-m-d')		
			},
			{
				text: 'Date End',
				dataIndex: 'COURSESTART',
				width: 150,
				renderer: Ext.util.Format.dateRenderer('Y-m-d')		
			}
		],	
		store: Ext.create('Ext.data.Store', {
			storeId:'storeTraining',
			model: 'REPORT_TRAINING',			
			autoLoad: true,
			autoSync: true,
			sortOnLoad: true
		}),
	buttons: [
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(trainingReportGrid);
			}
		}
	]
});
//report On-going training
 var trainingReportOnGoing = Ext.create('Ext.grid.Panel', {
			xtype: 'grid',
			itemId: 'onGoingGrid',
			title: 'On-going Training',			
			disableSelection: true,					
			columns: [
				{
					text: 'Course Description',
					dataIndex: 'coursename',
					flex: 1.5
				},
				{
					header: '<center>Training <br> Institution<\center>', 
					dataIndex: 'instName',
					flex: 1			
				},	
				{
					text: 'Venue',
					dataIndex: 'venue',
					flex: 1.5
				},
				{
					text: 'Date Start',
					dataIndex: 'COURSESTART',
					width: 150,
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text: 'Date End',
					dataIndex: 'COURSEEND',
					width: 150,
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				}	
			],	
			store: Ext.create('Ext.data.Store', {
				storeId:'storeTrainingogt',
				model: 'REPORT_OGT',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
			}),
	buttons: [
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(trainingReportOnGoing);
			}
		}
	]					
}); 
//report training institution
 var trainingReportInstitution = Ext.create('Ext.grid.Panel', {
			itemId: 'insitutionGrid',	
			title: 'Training Institution',	
			disableSelection: true,
					tools: [
						{ 
							xtype: 'combobox', 
							//emptyText: 'Institution',
							enableKeyEvents: true,
								store: {
									autoLoad: true,
									fields: ['instCode','instName'],
									proxy: {
										type: 'ajax',
										url: '/getinst'
									}
								},
								displayField:'instName',
								valueField:'instName',
								emptyText:'institution'	,
							listeners:{
								change: function(elem,newValue,oldValue){
								
									var x = Ext.data.StoreManager.lookup('storeTrainingInst');
									x.filter('instName',newValue);
								}
							}							
						}						
					],				
			columns: [
				{
					text: 'Course Description',
					dataIndex: 'courseName',
					flex: 1.5
				},		
				{
					text: 'Training Institution',
					dataIndex: 'instName',
					flex: 1
				},
				{
					text: 'Venue',
					dataIndex: 'venue',
					flex: 1.5
				},
				
				{
					text: 'Date Start',
					dataIndex: 'courseStart',
					width: 110,
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text: 'Date End',
					dataIndex: 'courseEnd',
					width: 110,
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text: 'No. of Attendees',
					dataIndex: 'noAttendees',
					flex: 1
				},
			],	
			store: Ext.create('Ext.data.Store', {
				storeId:'storeTrainingInst',
				model: 'REPORT_TRAININGINST',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
			}),
		buttons: [
			{
				text: 'Print',
				handler: function(){
					Ext.ux.grid.Printer.printAutomatically = false;
					Ext.ux.grid.Printer.print(trainingReportInstitution);
				}
			}
		]
});
//Progress Report
 var progressreport = Ext.create('Ext.grid.Panel', {
			itemId: 'progressgrid',	
			title: 'Progress Report',	
			disableSelection: true,				
			columns: [
				{
					text: 'Course Description',
					dataIndex: 'courseName',
					flex: 1.5
				},		
				{
					text: 'Training Institution',
					dataIndex: 'instName',
					flex: 1
				},				
				{
					text: 'Date',
					dataIndex: 'progdate',
					width: 110,
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},				
				{
					text: 'Progress Data',
					dataIndex: 'noAttendees',
					flex: 1
				}	
			],	
			store: Ext.create('Ext.data.Store', {
				storeId:'storeProgReport',
				model: 'PROGRESS_REPORT',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
			}),
	buttons: [
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(progressreport);
			}
		}
	]
});
//query grid
var queryGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'queryGrid',
	title: 'Query of trainings',
	disableSelection: true,
	tools: [
		{ 
			xtype: 'textfield', 
			emptyText: 'Search',
			enableKeyEvents: true,
			listeners:{
				change: function(elem,newValue,oldValue){	
				/* var filters = [
					new Ext.util.Filter({
						filterFn: function(item){
							return item.get('instName') == newValue || item.get('venue') == newValue;
						}
					})
				]; */
				//yyy
		 var filters = [
			new Ext.util.Filter({
			 filterFn: function (item) {
				 return item.get('instName').toLowerCase().indexOf(newValue.toLowerCase()) > -1                                 
					 || item.get('courseName').toLowerCase().indexOf(newValue.toLowerCase()) > -1
					 || item.get('venue').toLowerCase().indexOf(newValue.toLowerCase()) > -1
					 || item.get('courseStart').toLowerCase().indexOf(newValue.toLowerCase()) > -1
					 || item.get('courseEnd').toLowerCase().indexOf(newValue.toLowerCase()) > -1;
					 
				}	
			})
        ];
					var y = Ext.data.StoreManager.lookup('storeTrainingquery');
					y.clearFilter();		
					y.filter(filters);

					}
			},				
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
	],	
	columns: [
		{ 
			header: '<center>Course Description<\center>', 
			autoScroll:true,
			dataIndex: 'courseName', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: 2
			//emptyText: "No Record to Display"
			
		},
		{ 
			header: '<center>Training <br> Institution<\center>', 
			dataIndex: 'instName', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: 2
		},
		{
			header: '<center>Venue<\center>',
			dataIndex: 'venue', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 2
		},
		{
			header: '<center>Date Start<\center>', 
			dataIndex: 'courseStart', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7,
			renderer: Ext.util.Format.dateRenderer('Y-m-d')
		},	
		{
			header: '<center>Date End<\center>', 
			dataIndex: 'courseEnd', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: .7,
			renderer: Ext.util.Format.dateRenderer('Y-m-d')
		},		
		{ 
			header: '<center>No. of Attendees</center>', 
			dataIndex: 'noAttendees', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
		}													
	],
			store: Ext.create('Ext.data.Store', {
				storeId:'storeTrainingquery',
				model: 'QUERY_TRAINING',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
		}),	
});

//Training Institution Grid
var trainingInstitutionGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingInstitutionGrid',
	title: 'Trainings Institution',
	getInstitution: function(){
		var institution = [];
		
		
		var grid = this;
		grid.getStore().data.each(function(row) {
			institution.push({ 
				INSTCODE: row.data['INSTCODE'], 
				INSTNAME: row.data['INSTNAME'],
				INSTADDRESS: row.data['INSTADDRESS'],
				INSTCONTACT: row.data['INSTCONTACT'],
				INSTPHONE: row.data['INSTPHONE'],
				INSTFAX: row.data['INSTFAX'],
				INSTEMAIL: row.data['INSTEMAIL'],
			});
		});
		
		return institution;
		
	},
	tools: [
		
		{ 
			xtype: 'textfield', 
			emptyText: 'Training Institution',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = trainingInstitutionGrid.getStore();
					store.clearFilter(true);
					store.filter([{filterFn: function(rec){
							return rec.get("INSTNAME").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
						}
					}]);
				}
			},
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
		
	],
	columns: [
		{ 
			header: '<center>Institution<br>Code<\center>', 
			autoScroll:true,
			dataIndex: 'INSTCODE', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			editor: 'textfield',
			flex: .5
			
		},
		{ 
			header: '<center>Training Institution</center>',
			dataIndex: 'INSTNAME',
			flex:2,
			menuDisabled:true, 
			editor: 'textfield'
		},
		{
			header: '<center>Address<\center>',
			dataIndex: 'INSTADDRESS', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1
		},
		{ 
			header: '<center>Contact</center>', 
			dataIndex: 'INSTCONTACT', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
		},
		{ 
			header: '<center>Telephone No</center>', 
			dataIndex: 'INSTPHONE', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
		},
		{ 
			header: '<center>Fax No</center>', 
			dataIndex: 'INSTFAX', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
		},
		{ 
			header: '<center>Email Address</center>', 
			dataIndex: 'INSTEMAIL', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: 1
		}

	],	
	store: Ext.create('Ext.data.Store', {
		model: 'INSTITUTE_LIB',
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'INSTNAME', direction: 'ASC'}
	}),	
	buttons: [
		{
			text: 'New Institution',
			handler: function(){
				var grid = this.up('grid');
				var store = grid.getStore();
				var rowEdit = grid.getPlugin('rowEditingPlugin');
				var rec = Ext.create('INSTITUTE_LIB',{
					INSTCODE: null,
					INSTNAME: '[new]',
					INSTADDRESS: null,
					INSTCONTACT: null,
					INSTPHONE: null,
					INSTFAX: null,
					INSTEMAIL: null
				});
				store.add(rec);
				rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
				alert(grid.getStore().getData().getCount());
			}
		},
		{
			xtype:'button',
			text: 'Save',
			handler: function(){
				var me = this;
				var panel = me.up('#trainingInstitutionGrid');
				var institution = panel.getInstitution();
				
				Ext.Ajax.request({
					url: '/updateInstitution',
					method: 'POST',
					jsonData: {
						institutionList: institution
					},
					success: function(response){
						Ext.Msg.alert('Success', 'Institution library has been updated!');
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.statusText);
						
					}
				
				}); 
			}
		},
		{
			text: 'Remove',
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
		},
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(trainingInstitutionGrid);
			}
		}
	],
	plugins: [
		Ext.create('Ext.grid.plugin.RowEditing', {
			pluginId: 'rowEditingPlugin',
			clicksToMoveEditor: 1,
			autoCancel: false
		})
	]
});

//Training Course Grid
var trainingCourseGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingCourseGrid',
	title: 'Training Course',
	getTrainingCourse: function(){
		var course = [];
		
		
		var grid = this;
		var store = grid.getStore();
		store.clearFilter(true);
		store.data.each(function(row) {
			course.push({ 
				COURSECODE: row.data['COURSECODE'], 
				COURSENAME: row.data['COURSENAME'],
				COURSEDESC: row.data['COURSEDESC'],
				COURSEPREQ: row.data['COURSEPREQ']
			});
		});
		
		return course;
		
	},
	tools: [
		
		{ 
			xtype: 'textfield', 
			emptyText: 'Training Course',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = trainingCourseGrid.getStore();
					//store.clearFilter(true);
					store.filter([{filterFn: function(rec){
							return rec.get("COURSENAME").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
						}
					}
					]);
				}
			},
			triggers: {
				clear: {
					cls: 'x-form-clear-trigger',
					handler: function(){
						this.setValue(null);
					}
				}
			}
		}
		
	],
	columns: [
		{ 
			header: '<center>Course Code<\center>', 
			autoScroll:true,
			dataIndex: 'COURSECODE', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .5
		},				
		{
			header: '<center>Course Name<\center>',
			dataIndex: 'COURSENAME', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1
		},
		{
			header: '<center>Description<\center>',
			dataIndex: 'COURSEDESC', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1.5
		},						
		{ 
			header: '<center>Pre-requisite</center>',
			dataIndex: 'COURSEPREQ',
			flex:1,
			editor   : {
				xtype:'combo', 
				itemId:'cboPreReq',
				queryMode: 'local', 
				store: Ext.create('Ext.data.Store',{
				   autoLoad: true, 
					fields: ['COURSENAME'], 
					storeId:'storeCourseLib',
					proxy: { 
						type: 'ajax', 
						url: '/training/course_lib' 
					}
					
				}),
				displayField:'COURSENAME',
				valueField: 'COURSENAME',
				emptyText: 'Select Pre-requisite'
			}
		}
	
	],	
	store: Ext.create('Ext.data.Store', {
		model: 'COURSE_LIB',
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'COURSECODE', direction: 'ASC'},
		filters: [
			function(record){
				return record.get('COURSECODE')!='0000000';
				//console.log(record);
			}
		]
		
	}),	
	buttons: [
		{
			text: 'New Course',
			handler: function(){
				var grid = this.up('grid');
				var store = grid.getStore();
				var rowEdit = grid.getPlugin('rowEditingPlugin');
				var rec = Ext.create('COURSE_LIB',{
					COURSECODE: '[new]',
					COURSENAME: null,
					COURSEDESC: null,
					COURSEPREQ: null
				});
				store.add(rec);
				rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
			}
		},
		{
			xtype:'button',
			text: 'Save',
			handler: function(){
				var me = this;
				var panel = me.up('#trainingCourseGrid');
				var course = panel.getTrainingCourse();
				
				Ext.Ajax.request({
					url: '/updateTrainingCourse',
					method: 'POST',
					jsonData: {
						courseList: course
					},
					success: function(response){
						Ext.Msg.alert('Success', 'Course library has been updated!');
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.statusText);
						
					}
				
				}); 
			}
		},
		{
			text: 'Remove',
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
		},
		{
			text: 'Print',
			handler: function(){
				Ext.ux.grid.Printer.printAutomatically = false;
	            Ext.ux.grid.Printer.print(trainingCourseGrid);
			}
		}
	],
	plugins: [
		Ext.create('Ext.grid.plugin.RowEditing', {
			pluginId: 'rowEditingPlugin',
			clicksToMoveEditor: 1,
			autoCancel: false
		})
	]
});


//Training Management Panel
var trainingMaintenancePanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: 'card',
	items: [
		trainingGrid,
		trainingForm
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}
	
});

//Progress Panel
var trainingProgressPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: 'card',
	items: [
		trainingProgressGrid,
		progressForm
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Special Order Panel
var specialOrderPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: 'card',
	items: [
		specialOrderGrid,
		specialOrderForm
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Report Training
var trainingReportPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingReportGrid
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Report On-Going Training
var onGoingTrainingReportPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingReportOnGoing,	
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Report Training Institution
var trainingInstitutionReportPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingReportInstitution,	
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});
// Progress Report 
var progressReportPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		progressreport,	
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});
//Query Panel
var queryPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10'
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		queryGrid
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Training Institution Library Panel
var trainingInstitutionLibraryPanel = Ext.create('Ext.panel.Panel',{
	itemId:'trainingInstitutionLibraryPanel',
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10',
		autoScroll:true
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingInstitutionGrid
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});
//Course Library Panel
var courseLibraryPanel = Ext.create('Ext.panel.Panel',{
	itemId:'courseLibraryPanel',
	defaults: {
		maxHeight: 585,
		border: false,
		padding: '10 10 10 10',
		autoScroll:true
	},
	height:585,
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingCourseGrid
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

var trainingModule = {
	xtype: 'tabpanel',
	title: ' ',
	itemId: 'trainingModuleBody',
	flex:1,
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
		//padding: '20 0 20 20',
		overflowY: 'scroll'
	},
	items: [				
		{
			title: 'Maintenance',
			itemId:'trainingMaintenanceTab',
			hidden: true,
			items: [
				trainingMaintenancePanel
			]
		},
		{
			title: 'Progress',
			itemId:'progressMaintenanceTab',
			hidden: true,
			items: [
				trainingProgressPanel
			]
		},
		{
			title: 'Special Order',
			itemId:'specialOrderMaintenanceTab',
			hidden: true,
			items: [
				specialOrderPanel
			]
		},
		{
			title: 'Training',
			itemId:'trainingReportTab',
			hidden:true,
			items: [
				trainingReportPanel
			]
		},	
		{
			title: 'On-going Training',
			itemId:'trainingOnGoingTab',
			hidden:true,
			items: [
				onGoingTrainingReportPanel
			]
		},	
		{
			title: 'Training Institution',
			itemId:'trainingInstitutionTab',
			hidden:true,
			items: [
				trainingInstitutionReportPanel
			]
		},	
			{
			title: 'Progress Report',
			itemId:'progressReporttab',
			hidden:true,
			items: [
				progressReportPanel
			]
		},	
		{
			title: 'Query',
			itemId: 'queryTab',
			hidden: true,
			items: [
				queryPanel
			]
		},
		{
			title: 'Training Institution Library',
			itemId:'trainingInstitutionLibraryTab',
			hidden:true,
			items: [
				trainingInstitutionLibraryPanel
			]
			
		},	
		{
			title: 'Course Library',
			itemId:'courseLibraryTab',
			hidden:true,
			items: [
				courseLibraryPanel
			]
		}
	]	
};

Ext.onReady(function () {	
	

	Ext.create('Ext.container.Viewport', {
		
		id: 'viewport',
		layout: 'hbox',
		padding: '20 20 20 20',
		items:[
		{
			xtype:'panel',
			title:'Training Module',
			width: 223,
			height:600,
			defaults: {
				margin: '10 10 10 10',
				height: 60
			},
			layout: 'vbox',
			items: [
				{
					xtype: 'splitbutton',
					text : 'Maintenance',
					width: 200,
					menu:{
						items:[
							{
								text: 'Training Maintenance',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('trainingMaintenanceTab');	
								}
							},
							{
								text: 'Training Progress Maintenance',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('progressMaintenanceTab');	
								}
							},
							{
								text: 'Special Order Maintenance',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('specialOrderMaintenanceTab');	
								}
							}
						]
					}
				},
				{
					xtype: 'splitbutton',
					text : 'Report',
					width: 200,
					menu:{
						items:[
							{
								text: 'Training',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('trainingReportTab');	
								}
							},
							{
								text: 'On-going Training',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('trainingOnGoingTab');	
								}
							},
							{
								text: 'Training Institution',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('trainingInstitutionTab');	
								}
							},
								{
								text: 'Progress Report',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('progressReporttab');	
								}
							}
						]
					}
					
				},
				{
					xtype: 'button',
					text : 'Query',
					width: 200,
					handler: function(){
						var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];
						x.setActiveTab('queryTab');						
					}
				},
				{
					xtype: 'splitbutton',
					text : 'Library',
					width: 200,
					menu:{
						items:[
							{
								text: 'Training Institution',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('trainingInstitutionLibraryTab');	
								}
							},
							{
								text: 'Course',
								handler: function(){
									var x = Ext.ComponentQuery.query('#trainingModuleBody')[0];								
									x.setActiveTab('courseLibraryTab');	
								}
							}
						]
					}
				},
			]
			
		},
		trainingModule
		
		]
		
	});	
});