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
	],
	idProperty: 'INVITECODE',
	proxy: {
		type: 'rest',
		url: '/training/training_invitation'
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
					LOCAL: null
				});
				rec.phantom = true;
				trainingForm.loadRecord(rec);
				maintenancePanel.switch(trainingForm);
			}
		}
	]

});

var trainingForm = Ext.create('Ext.form.Panel', {
	itemId: 'trainingForm',
	
	title: 'Training Details',
	bodyPadding: 20,
	trackResetOnLoad: true,
	items:[
		{
			xtype: 'textfield',
			fieldLabel: 'Invite code',
			name: 'INVITECODE',
		},
		{
			xtype: 'combobox', 
			fieldLabel: 'Institution',
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
					type: 'rest',
					url: '/table/institute_lib'
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
					type: 'rest',
					url: '/table/course_lib'
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
			name: 'COURSESTART',
			format: 'M d Y'
		},
		{
			xtype: 'datefield', 
			fieldLabel: 'End',
			name: 'COURSEEND',
			format: 'M d Y'
		},
		{
			xtype: 'textareafield', 
			fieldLabel: 'Venue',
			name: 'VENUE'
		},
		{
			xtype: 'checkboxfield', 
			fieldLabel: 'Local',
			name: 'LOCAL'
		}, 
		{
			xtype: 'hidden',
			itemId: 'INSTNAME',
			name: 'INSTNAME'
		},
				{
			xtype: 'hidden',
			itemId: 'COURSENAME',
			name: 'COURSENAME'
		}
	],
	buttons: [
		{
			text: 'Save',
			handler: function(){
				var rec = trainingForm.getRecord();

				trainingForm.updateRecord(rec);
				
				if(rec.phantom)
					trainingGrid.getStore().add(rec);
				
				trainingForm.reset();
				maintenancePanel.switch(trainingGrid);
			}
		},
		{
			text: 'Delete',
			handler: function(){
				var rec = trainingForm.getRecord();
				
				trainingGrid.getStore().remove(rec);
				trainingForm.reset();
				maintenancePanel.switch(trainingGrid);
				
			}
		},
		{
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
	]
});

// training management form
var maintenancePanel = Ext.create('Ext.panel.Panel',{
	//xtype: 'panel',
	//scollapsible: true,
	margin: '20 40 20 20',
	defaults: {
		maxHeight: 500,
		border: false
	},
	//title: 'Training Management',
	layout: 'card',
	items: [
		trainingGrid,
		trainingForm
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
			]
		},	
		{
			title: 'Query',
			items: [
			]
		},
		{
			title: 'Library',
			items: [
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