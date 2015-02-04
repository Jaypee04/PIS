Ext.require(['Ext.data.*', 'Ext.grid.*']);


var trainingGrid = Ext.create('Ext.grid.Panel', {
	itemId: 'trainingGrid',
	title: 'List of trainings',
	disableSelection: true,
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
			}
		},	
		{
			text: 'Institution',
			dataIndex: 'INSTCODE',
			flex: 1
		},
		{
			text: 'Start',
			dataIndex: 'COURSESTART',
			width: 110,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'End',
			dataIndex: 'COURSEEND',
			width: 110,
			renderer: Ext.util.Format.dateRenderer('M d Y')
		},
		{
			text: 'Venue',
			dataIndex: 'VENUE',
			flex: 1
		}
	],
	store: Ext.create('Ext.data.Store', {
		fields: [
			{
				name: 'id',
				type: 'int'
			},
			'INVITECODE', 
			'INSTCODE', 
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
		autoLoad: true,
		autoSync: true,
		sortOnLoad: true,
		sorters: {property: 'COURSESTART', direction: 'DESC'},
		proxy: {
			type: 'rest',
			url: '/training/training_invitation'
		}
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
				maintenancePanel.switch(trainingForm);
			}
		}
	]

});

var trainingForm = Ext.create('Ext.form.Panel', {
	itemId: 'trainingForm',
	title: 'Training Details',
	bodyPadding: 5,
	items:[
		{
			xtype: 'textfield',
			fieldLabel: 'Invite code',
			name: 'INVITECODE'
		},
		{
			xtype: 'textfield', 
			fieldLabel: 'Institution code',
			name: 'INSTCODE'
		},
		{
			xtype: 'textfield', 
			fieldLabel: 'Course code',
			name: 'COURSECODE'
		},
		{
			xtype: 'combobox', 
			fieldLabel: 'Course',
			queryMode: 'local',
			enableRegEx: true,
			name: 'COURSENAME',
			hiddenName: 'COURSECODE',
			valueField: 'COURSECODE',
			displayField: 'COURSENAME',
			store: Ext.create('Ext.data.Store',{
				autoLoad: true,
				fields: ['COURSECODE', 'COURSENAME'],
				proxy: {
					type: 'rest',
					url: '/table/course_lib'
				}
			})
		},
		{
			xtype: 'datefield', 
			fieldLabel: 'Start',
			name: 'COURSESTART'
		},
		{
			xtype: 'datefield', 
			fieldLabel: 'End',
			name: 'COURSEEND'
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
		}
	],
	buttons: [
		{
			text: 'Save',
			handler: function(){
				var rec = trainingForm.getRecord();
				trainingForm.updateRecord(rec);
				console.log(rec);
			}
		},
		{
			text: 'Cancel',
			handler: function(){
				trainingForm.reset();
				maintenancePanel.switch(trainingGrid);
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
