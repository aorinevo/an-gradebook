    AN.Views.AssignmentView = AN.Views.Base.extend({
        tagName: 'th',
        className: 'assignment manage-column sortable asc',
        events: {
            'click .column-title': 'selectColumn',
            'click .column-sort': 'sortColumn',
            'mouseenter div.column-frame' : 'mouseEnter',
            'mouseleave div.column-frame' : 'mouseLeave'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:assign_name', this.render);         
            this.listenTo(this.model, 'change:selected', this.selectColumnCSS);
            this.listenTo(this.model, 'change:sorted', this.sortColumnCSS);            
            this.listenTo(this.model, 'remove', function() { this.remove(); });
        },
        mouseEnter: function(){
        	this.$el.addClass('hover');
        	this.model.set({hover: true});
        },
        mouseLeave: function(){
        	this.$el.removeClass('hover');	
        	this.model.set({hover: false});	
        },
        render: function() {   
            this.$el.html('<div class="column-frame"><div class="column-title">' + this.model.get('assign_name') + '</div><div class="column-sort an-sorting-indicator dashicons dashicons-arrow-down"></div></div>');
            return this;
        },
        sortColumn: function(ev){
        	var y = AN.GlobalVars.assignments.findWhere({selected: true});
        	y && y.set({selected: false});
            if (this.model.get('sorted')) {
            	if (this.model.get('sorted')=='desc') {
                	this.model.set({sorted: 'asc'});
            	} else {
                	this.model.set({sorted: 'desc'});            
            	}
            } else {
                var x = AN.GlobalVars.assignments.find(function(model){
                	return model.get('sorted').length >0;
                });
                x && x.set({ sorted: '' });
                this.model.set({ sorted: 'asc' });
            }        	
        },
        sortColumnCSS: function() {
            if (this.model.get('sorted')) {
        		var desc = this.$el.hasClass('desc');
        		this.$el.toggleClass( "desc", !desc ).toggleClass( "asc", desc );              	
            } else {
                this.$el.removeClass('asc desc');
                this.$el. addClass('asc');
            }
        },        
        selectColumn: function(ev) {
            var x = AN.GlobalVars.students.findWhere({ selected: true });
            x && x.set({ selected: false });
            if (this.model.get('selected')) {
                this.model.set({ selected: false });
            } else {
                var x = AN.GlobalVars.assignments.findWhere({ selected: true });
                x && x.set({ selected: false });
                this.model.set({ selected: true });
            }
        },       
        selectColumnCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        }
    });