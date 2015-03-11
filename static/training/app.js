Ext.require(['Ext.data.*', 'Ext.grid.*']);

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

var trainingGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingGrid',
	title: 'List of trainings',
	tools: [
		{ 
			xtype: 'textfield', 
			emptyText: 'filter',
			enableKeyEvents: true,
			listeners: {
				change: function(cmp, e){
					var store = trainingGrid.getStore();
					console.log(store);
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
				maintenancePanel.switch(trainingForm);
				trainingForm.loadRecord(rec);
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
				maintenancePanel.switch(trainingForm);
			}
		}
	]

});

var trainingForm = Ext.create('Ext.form.Panel', {
	itemId: 'mainPanel',
	bodyPadding: 5,
	autoScroll:true,
	getInviteCode: function ()
	{
		var me = this;
		Ext.Ajax.request({
			url: '/getInviteCode',
			method: 'get',
			success: function(response){
				var result = Ext.decode(response.responseText);
				var x = JSON.stringify(result);
				me.generateCode(x);
				//Ext.Msg.alert('value',x);
				
			},
			failure: function(response){
				console.log(response.status);
				Ext.Msg.alert('Error', response.status);
				
			}
		
		}); 

	},
	generateCode: function(x){
		
		var showCode = x;
		console.log(showCode);
	},
	
	items:[
		{
			xtype:'panel',
			itemId: 'trainingForm',
			title: 'Training Details',
			bodyPadding:20,
			trackResetOnLoad: true,
			
			items:[
				{
					xtype: 'textfield',
					fieldLabel: 'Invite code',
					labelWidth: 120,
					name: 'INVITECODE'
				},
				{
					xtype: 'combobox', 
					fieldLabel: 'Institution',
					labelWidth: 120,
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
					labelWidth: 120,
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
					labelWidth: 120,
					name: 'COURSESTART',
					format: 'm/d/Y',
				},
				{
					xtype: 'datefield', 
					fieldLabel: 'End',
					labelWidth: 120,
					name: 'COURSEEND',
					format: 'm/d/Y',
				},
				{
					xtype: 'textareafield', 
					fieldLabel: 'Venue',
					labelWidth: 120,
					name: 'VENUE'
				},
				{
					xtype: 'checkboxfield', 
					fieldLabel: 'Local',
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
					text: 'Click me!',
					handler: function(){
						var me = this.up('panel');
						var main = me.up('panel');
						var getCode = main.getInviteCode(); 
						//console.log(getCode);
					}
				},
				{
					xtype:'button',
					text: 'Save',
					handler: function(){
						
						var rec = trainingForm.getRecord();
						
						trainingForm.updateRecord(rec);
						
						console.log(rec.data);
						
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
								console.log(response.statusText);
								Ext.Msg.alert('Error', response.statusText);
								
							}
						
						}); 
						
						if(rec.phantom)
							trainingGrid.getStore().add(rec);
						
						trainingForm.reset();
						maintenancePanel.switch(trainingGrid);
					}
				},
				{
					xtype:'button',
					text: 'Delete',
					handler: function(){
						var rec = trainingForm.getRecord();
						
						trainingGrid.getStore().remove(rec);
						trainingForm.reset();
						maintenancePanel.switch(trainingGrid);
						
					}
				},
				'-',
				{
					xtype:'button',
					text: 'Back',
					handler: function(){
						
						var rec = trainingForm.getRecord();
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
						} else {
							trainingForm.reset(true);
							maintenancePanel.switch(trainingGrid);
						}
						
						
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
						}, {
							boxLabel  : 'Male',
							name      :'REQ_GENDER',
							inputValue: '2',
							id        : 'radio2',						
						}, {
							boxLabel  : 'Both',
							name      :'REQ_GENDER',
							inputValue: '0',
							id        : 'radio3'
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
							labelWidth: 120		
						}, {
							boxLabel  : 'Married',
							name      :'CIVIL_STATUS',
							inputValue: 'Married',
							id        : 'cs2'	
						}, {
							boxLabel  : 'Both',
							name      :'CIVIL_STATUS',
							inputValue: 'Both',
							id        : 'cs3'	
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
					xtype: 'combo',
					itemId:'cbocourseprerequisite',
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
							text: 'Employee ID',
							dataIndex: 'EMP_ID',
							flex: 0.45
						},
						{
							header: 'Name of Employee', 
							dataIndex: 'EMP_NAME',
							flex: 1	
						},	
						{
							text: '<center>Age</center>',
							dataIndex: 'EMP_AGE',
							flex: 0.25
						},
						{
							text: '<center>Years in </br> Government</center>',
							dataIndex: 'EMP_GOVSRVC',
							flex: 0.35
						},
						{
							text: 'COURSE',
							dataIndex: 'EMP_COURSE',
							flex: 1.25
						}
					]
				
				}
			]
		}
		
		
	]
});

//report On-going training
 var reportgrid = Ext.create('Ext.grid.Panel', {
	xtype: 'grid',
	itemId: 'onGoingTrainingGrid',
	title: 'On-going Training',			
	disableSelection: true,					
	columns: [
		{
			text: 'Course',
			dataIndex: 'OGTCOURSE'
		},
		{
			header: '<center>Training <br> Institution<\center>', 
			dataIndex: 'OGTTRAININGINSTITUTION',
			flex: 1			
		},	
		{
			text: 'Venue',
			dataIndex: 'OGTVENUE',
			flex: 1
		},
		{
			text: 'Date',
			dataIndex: 'OGTDATE',
			width: 110,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'No. of Attendees',
			dataIndex: 'OGTOFATTENDEES',
			flex: 1
		}
	],	
}); 
//report training institution
 var reportgrid1 = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingGrid1',	
	title: 'Training Institution',	
	disableSelection: true,	
	columns: [
		{
			text: 'Course',
			dataIndex: 'TICOURSE'
		},		
		{
			text: 'Venue',
			dataIndex: 'TIVENUE',
			flex: 1
		},
		{
			text: 'Date',
			dataIndex: 'TIDATE',
			width: 110,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'No. of Attendees',
			dataIndex: 'TIOFATTENDEES',
			flex: 1
		}	
	],	
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
			header: '<center>Course<\center>', 
			autoScroll:true,
			dataIndex: 'ProgressCourse', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
			//emptyText: "No Record to Display"
			
		},
		{ 
			header: '<center>Training <br> Institution<\center>', 
			dataIndex: 'ProgressInstitution', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: 1.5 
		},
		{
			header: '<center>Venue<\center>',
			dataIndex: 'ProgressVenue', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,	
			flex: 1.5
		},
		{
			header: '<center>Date<\center>', 
			dataIndex: 'ProgressDate', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .7
		},						 	
		{ 
			header: '<center>No. of Attendees</center>', 
			dataIndex: 'ProgressAttendees', 
			editor: 'textfield', 
			fixed:true, 
			menuDisabled:true, 
			sortable:false,
			flex: .9
		}													
	],			
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
					console.log(store);
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
			flex:1,
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
		sorters: {property: 'INSTNAME', direction: 'DESC'}
	}),	
	buttons: [
		{
			text: 'New Institution',
			handler: function(){
				var grid = this.up('grid');
				var store = grid.getStore();
				var rowEdit = grid.getPlugin('rowEditingPlugin');
				var rec = Ext.create('INSTITUTE_LIB',{
					INSTCODE: '[new]',
					INSTNAME: null,
					INSTADDRESS: null,
					INSTCONTACT: null,
					INSTPHONE: null,
					INSTFAX: null,
					INSTEMAIL: null
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
				var panel = me.up('#trainingInstitutionGrid');
				var institution = panel.getInstitution();
				console.log(institution);
				
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
						console.log(response.statusText);
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
});

//Training Course Grid
var trainingCourseGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingCourseGrid',
	title: 'Training Course',
	disableSelection: true,
	columns: [
		{ 
			header: '<center>Course Code<\center>', 
				autoScroll:true,
				dataIndex: 'tcCoursecode', 
				editor: 'textfield', 
				fixed:true, 
				menuDisabled:true, 
				sortable:false,
				flex: .5
				//emptyText: "No Record to Display"
			
		},				
		{
			header: '<center>Course Name<\center>',
				dataIndex: 'tcCousename', 
				editor: 'textfield', 
				fixed:true, 
				menuDisabled:true, 
				sortable:false,	
				flex: 1
		},
		{
			header: '<center>Description<\center>',
				dataIndex: 'tcDescription', 
				editor: 'textfield', 
				fixed:true, 
				menuDisabled:true, 
				sortable:false,	
				flex: 1.5
		},						
		{ 
			header: '<center>Pre-requisite</center>',
				dataIndex: 'tcPrerequisite',
				flex:1,
				fixed:true, 
				menuDisabled:true, 
				sortable:false, 
				editor  : {						
					xtype:'combo', 
					store: new Ext.data.ArrayStore({
					fields: ['Pre-requisite'],
					data : 
						[                                         
						['Training1'],['Training2'], ['Training3']								   
					]
					}),
						displayField:'level',
						valueField: 'level',
						mode: 'local',
						typeAhead: false,
						triggerAction: 'all',
						lazyRender: true,
						//emptyText: 'Training'
				}
		},
	
	],				
});


//Training Management Panel
var maintenancePanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 500,
		border: false,
		padding: '10 10 10 10'
	},
	layout: 'card',
	items: [
		trainingGrid,
		trainingForm
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}
	
});

//Report Panel
var reportPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 500,
		border: false,
		padding: '10 10 10 10'
	},
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	
	items: [
		reportgrid,
		reportgrid1
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

//Query Panel
var queryPanel = Ext.create('Ext.panel.Panel',{
	defaults: {
		maxHeight: 500,
		border: false,
		padding: '10 10 10 10'
	},
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

//Library Panel
var libraryPanel = Ext.create('Ext.panel.Panel',{
	itemId:'libraryPanel',
	defaults: {
		maxHeight: 500,
		border: false,
		padding: '10 10 10 10',
		autoScroll:true
	},
	layout: {
		type:'vbox',
		align:'stretch'
	
	},
	items: [
		trainingInstitutionGrid,
		trainingCourseGrid
		
	],
	switch: function(panel){
		this.getLayout().setActiveItem(panel);
	}	
});

var trainingModule = {
	xtype: 'tabpanel',
	title: 'Training Module',
	//autoScroll: true,
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
			items: [
				maintenancePanel
			]
		},
		{
			title: 'Report',
			items: [
				reportPanel
			]
		},	
		{
			title: 'Query',
			items: [
				queryPanel
			]
		},
		{
			title: 'Library',
			items: [
				libraryPanel
			]
		},						
	]	
};


Ext.onReady(function () {	
	
	Ext.create('Ext.container.Viewport', {
		id: 'viewport',
	    layout: 'fit',
		items: trainingModule
	});	
});