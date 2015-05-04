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
		
		'EMP_ID',
		'EMPLOYEE_NAME',
		'AGE', 
		'YRSGOVT',
		'COURSE_T'
	],
	idProperty: 'EMP_ID',
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
		'venue'
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
			dataIndex: 'INVITECODE'
		},
		{
			text: 'Course',
			dataIndex: 'COURSENAME',
			flex: 1,
			renderer: function(v){
				return '<span style="color: blue; cursor: pointer;">' + (v?v:'') + '<span>';
			},
			tdCls:'wrap-text'
		},	
		{
			text: 'Institution',
			dataIndex: 'INSTNAME',
			flex: 1,
			tdCls:'wrap-text'
		},
		{
			text: 'Start',
			dataIndex: 'COURSESTART',
			width: 120,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'End',
			dataIndex: 'COURSEEND',
			width: 120,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'Venue',
			dataIndex: 'VENUE',
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
				trainingForm.disableAll();
				
				var click = trainingForm.down('#requirementsForm').down('#btnSave');//.down('#btnSave').disabled = true;
				click.disabled=true;
				/* var click2 = trainingForm.down('#requirementsForm').down('#btnUpdate');
				click2.disabled = false; */
			}
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
				var click = trainingForm.down('#requirementsForm').down('#btnUpdate');
				click.disabled=true;
				var enableAllComponents = trainingForm.enableAll();
				var click2 = trainingForm.down('#requirementsForm').down('#btnSave');
				click2.disabled = false;
			}
		}
	]

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
	pad: function(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	},
	generateCode: function(x){
		var me = this;
		var lastDigit = parseInt(x.lastDig)+1;
		var showCode = me.pad(lastDigit,5);
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
		/*me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false;
		me.down('').disabled = false; */
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
		/*me.down('').disabled = true;
		me.down('').disabled = true;
		me.down('').disabled = true;
		me.down('').disabled = true;
		me.down('').disabled = true;
		me.down('').disabled = true;
		me.down('').disabled = true; */
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
					fieldLabel: 'Institution',
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
					format: 'm/d/Y',
				},
				{
					xtype: 'datefield', 
					fieldLabel: 'End',
					itemId:'dteEnd',
					labelWidth: 120,
					name: 'COURSEEND',
					format: 'm/d/Y',
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
				/* {
					xtype:'button',
					text: 'Click Me',
					handler: function(){
						
						var rec = trainingForm.getRecord();
						trainingForm.updateRecord(rec);
						var trainingData = rec.data;
						
					}
				}, */
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
						
						Ext.Ajax.request({
							url: '/training/nominees',
							method: 'GET',
							jsonData: {
								forNominees: trainingData
							},
							success: function(response){
								var me = this;
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
						
						Ext.Ajax.request({
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
						});
						
						if(rec.phantom)
							trainingGrid.getStore().add(rec);
						
						//trainingForm.reset();
						//maintenancePanel.switch(trainingGrid);
					}
				},
				{
					xtype:'button',
					text: 'Delete',
					handler: function(){
						var rec = trainingForm.getRecord();
						
						trainingGrid.getStore().remove(rec);
						trainingForm.reset();
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
						}
					]
				},
				
			]
		},
		{
			xtype:'panel'
		},
		{
			xtype:'panel',
			itemId: 'nomineesForm',
			title: 'Nominees',
			bodyPadding:20,
			items:[
				{
				
					xtype: 'grid',	
					columns: [
						{
							header: 'Employee ID',
							dataIndex: 'EMP_ID',
							editor:'textfield',
							flex: 0.30
						},
						{
							header: 'Employee Name', 
							dataIndex: 'EMPLOYEE_NAME',
							editor: 'combo',
							queryMode: 'local',
							enableRegEx: true,
							forceSelection: true,
							name: 'EMPLOYEE_NAME',
							valueField: 'EMPLOYEE_NAME',
							displayField: 'EMPLOYEE_NAME',
							store: Ext.create('Ext.data.Store',{
								autoLoad: true,
								fields: ['EMPLOYEE_ID', 'EMPLOYEE_NAME'],
								proxy: {
									type: 'ajax',
									url: '/getEmployee'
								}
							}),
							listeners: {
								change: function(combo, newVal, oldVal){
									nomineesForm.down('#EMPLOYEE_NAME').setValue(this.getRawValue());
								}
							},
							flex: 0.50
						},	
						{
							header: '<center>Years in</br>Government</center>',
							dataIndex: 'YRSGOVT',
							editor:'textfield',
							flex: 0.25
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
									EMP_ID:'[new]',
									EMPLOYEE_NAME:null,
									AGE:null, 
									YRSGOVT:null,
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
			],
			
			store: Ext.create('Ext.data.Store', {
				model: 'NOMINEES',
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true,
				sorters: {property: 'EMP_ID', direction: 'DESC'}
			}),
		}
		
		
	]
});

//Training Progress Grid
var trainingProgressGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingProgressGrid',
	title: 'Training Progress',
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
			emptyText: 'Training Progress',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = trainingCourseGrid.getStore();
					store.filter([{filterFn: function(rec){
							return rec.get("INVITECODE").toLowerCase().indexOf(cmp.getValue().toLowerCase()) > -1;
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
			flex: .50
		},				
		{
			header: '<center>Employee ID<\center>',
			dataIndex: 'EMPID', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: .50
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
			renderer: Ext.util.Format.dateRenderer('Y-m-d'),
			flex: .45
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
			flex:.80
			
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
						var me = this.up('panel');
						var panel = me.up('panel');
						
						var rec = progressForm.getRecord();
						
						progressForm.updateRecord(rec); 
						
						var progressData = rec;
						console.log(progressData);
						/* Ext.Ajax.request({
							url: '/training/save/progress',
							method: 'POST',
							jsonData: {
								progressValues: progressData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Training has been added!');
								
							},
							failure: function(response){
								Ext.Msg.alert('Error', response.statusText);
							}
						
						});  */
						
						/* if(rec.phantom)
							trainingGrid.getStore().add(rec); */
					}
				},
				{
					xtype:'button',
					text: 'Update',
					itemId:'btnUpdate',
					handler: function(){
						
					}
				},
				{
					xtype:'button',
					text: 'Delete',
					handler: function(){
						
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
					name: 'INVITECODE',
					listeners: {
						change: function(combo, newVal, oldVal){
							progressForm.down('#INVITECODE').setValue(this.getRawValue());
						}
					}
				},
				{
					xtype: 'combobox', 
					fieldLabel: 'Employee ID',
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
					xtype: 'datefield', 
					fieldLabel: 'Progress Date',
					itemId:'dteProgDate',
					labelWidth: 120,
					name: 'PROGDATE',
					format: 'm/d/Y',
				},
				{
					xtype: 'textareafield', 
					fieldLabel: 'Details',
					itemId:'txtDetails',
					labelWidth: 120,
					width: 600,
					name: 'DETAILS'
				},
				{
					xtype: 'fileuploadfield', 
					fieldLabel: 'Attachment',
					itemId:'fuAttachment',
					labelWidth: 120,
					width: 600,
					name: 'PROGATT',
					listeners:{
						change: function(fld, value) {
						  var newValue = value.replace(/C:\\fakepath\\/g, '');
						  fld.setRawValue(newValue);                                                         
						}
					}
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
				//specialOrderForm.disableAll();
				
				Ext.Ajax.request({
					url: '/training/nominees/'+rec.data.INVITECODE,
					method: 'GET',
					success: function(response){
						var Nominee = response.responseText;
						console.log(rec.data.INVITECODE);
						console.log(Ext.decode(Nominee));
						
					},
					failure: function(response){
						Ext.Msg.alert('Error', response.status);
						console.log(response.status);
					}
				
				});
				
				/* var click = specialOrderForm.down('#btnSave');//.down('#btnSave').disabled = true;
				click.disabled=true; */
				/* var click2 = trainingForm.down('#requirementsForm').down('#btnUpdate');
				click2.disabled = false; */
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
				var rowEdit = grid.getPlugin('rowEditingPlugin');
				var rec = Ext.create('SPECIAL_ORDER',{
					INVITECODE: '[new]',
					SONO: null,
					SODATE: null,
					SOSUBJECT: null
				});
				store.add(rec);
				console.log(grid.getStore().getData().getCount());
				rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
				
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
			xtype:'panel',
			itemId: 'specialOrderForm',
			title: 'Special Order Details',
			bodyPadding:20,
			trackResetOnLoad: true,
			
			tools:[
				/* {
					xtype:'button',
					text:'Edit',
					itemId:'btnEdit',
					handler: function(){
						var me = this.up('#specialOrderPanel');
						me.enableAll();
					}
				} */
			],
			fbar: [
				'->',
				{
					xtype:'button',
					text:'Edit',
					itemId:'btnEdit',
					handler: function(){
						var me = this.up('#specialOrderPanel');
						me.enableAll();
					}
				},
				{
					xtype:'button',
					text: 'Update',
					itemId:'btnUpdate',
					handler: function(){
						
						var rec = specialOrderForm.getRecord();
						
						specialOrderForm.updateRecord(rec);
						
						
						var specialOrderData = rec.data;
						Ext.Ajax.request({
							url: '/updateSpecialOrder',
							method: 'post',
							jsonData: {
								specialOrderList: specialOrderData
							},
							success: function(response){
								Ext.Msg.alert('Success', 'Special Order has been updated!');
								
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
					text: 'Delete',
					handler: function(){
						var rec = trainingForm.getRecord();
						
						trainingGrid.getStore().remove(rec);
						trainingForm.reset();
						trainingMaintenancePanel.switch(trainingGrid);
						
					}
				},
				'-',
				{
					xtype:'button',
					text: 'Back',
					handler: function(){
					
						specialOrderForm.reset(true);
						specialOrderPanel.switch(specialOrderGrid);
						
						
						
					}
				}
				
			],
			items:[
				{
					xtype: 'textfield',
					fieldLabel: 'Invite code',
					labelWidth: 120,
					itemId:'txtInviteCode',
					name: 'INVITECODE',
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
					xtype: 'datefield', 
					fieldLabel: 'S.O. Date',
					itemId:'dteSO',
					name:'SODATE',
					labelWidth: 120,
					format: 'm/d/Y'
					
				},
				{
					xtype: 'textareafield', 
					fieldLabel: 'Subject',
					itemId:'txtSOSubject',
					labelWidth: 120,
					name: 'SOSUBJECT'
				}
			]
		},
		
		{
			xtype:'panel'
		},
		{
			xtype:'panel',
			itemId: 'nomineesForm',
			title: 'Nominees',
			bodyPadding:20,
			items:[
				{
				
					xtype: 'grid',	
					itemId:'nomineesGrid',
					columns: [
						{
							header: 'Employee ID',
							dataIndex: 'EMP_ID',
							editor:'textfield',
							flex: 0.30
						},
						{
							header: 'Employee Name', 
							dataIndex: 'EMPLOYEE_NAME',
							editor: 'combo',
							queryMode: 'local',
							enableRegEx: true,
							forceSelection: true,
							name: 'EMPLOYEE_NAME',
							valueField: 'EMPLOYEE_NAME',
							displayField: 'EMPLOYEE_NAME',
							store: Ext.create('Ext.data.Store',{
								autoLoad: true,
								fields: ['EMPLOYEE_ID', 'EMPLOYEE_NAME'],
								proxy: {
									type: 'ajax',
									url: '/getEmployee'
								}
							}),
							listeners: {
								change: function(combo, newVal, oldVal){
									nomineesForm.down('#EMPLOYEE_NAME').setValue(this.getRawValue());
								}
							},
							flex: 0.50
						},	
						{
							header: '<center>Years in</br>Government</center>',
							dataIndex: 'YRSGOVT',
							editor:'textfield',
							flex: 0.25
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
									EMP_ID:'[new]',
									EMPLOYEE_NAME:null,
									AGE:null, 
									YRSGOVT:null,
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
								var me = this.up('grid');
								Ext.ux.grid.Printer.printAutomatically = false;
								Ext.ux.grid.Printer.print(me.nomineesGrid);
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
			],
			
			store: Ext.create('Ext.data.Store', {
				model: 'NOMINEES',
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true,
				sorters: {property: 'EMP_ID', direction: 'DESC'}
			}),
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
			/* {
				text: 'No. of Attendees',
				dataIndex: 'OGTOFATTENDEES',
				flex: 1
			} */
		],	
		store: Ext.create('Ext.data.Store', {
			storeId:'storeTraining',
			model: 'REPORT_TRAINING',			
			autoLoad: true,
			autoSync: true,
			sortOnLoad: true
		}),
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
				
				/* {
					text: 'No. of Attendees',
					dataIndex: 'OGTOFATTENDEES',
					flex: 1
				} */
			],	
			store: Ext.create('Ext.data.Store', {
				storeId:'storeTrainingogt',
				model: 'REPORT_OGT',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
			}),
		
			
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
					text: 'Institution Name',
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
				}	
			],	
			store: Ext.create('Ext.data.Store', {
				storeId:'storeTrainingInst',
				model: 'REPORT_TRAININGINST',			
				autoLoad: true,
				autoSync: true,
				sortOnLoad: true
			}),
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
				//alert(grid.getStore().getData().getCount());
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
				console.log(record);
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
