(function($, AN){
	AN.Views.StudentCellView = AN.Views.Base.extend({
        tagName: 'td',
        events: {
            "click .view": "edit",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "hideInput"
        },
        initialize: function() {          
            this.listenTo(AN.GlobalVars.assignments, 'change:hover', this.hoverCell);
            this.listenTo(AN.GlobalVars.assignments, 'change:visibility', this.visibilityCell);
            this.listenTo(AN.GlobalVars.courses, 'change:selected', this.close);           
        },
        render: function() {
        	var self = this;
            this.$el.toggleClass('hidden', !self.model.get('visibility'));
            this.$el.html('<div class="view">' + this.model.get('assign_points_earned') + '</div> <input class="edit" type="text" value="' + parseFloat(this.model.get('assign_points_earned')) + '"></input>');
            this.input = this.$('.edit');
            return this;
        },      
        close: function() {
        	this.remove();
        },    
        hoverCell: function(ev) {
            if (this.model.get('amid') === ev.get('id')) {
                this.model.set({
                    hover: ev.get('hover')
                });
                this.$el.toggleClass('hover',ev.get('hover'));                
 			} 
        },      
        visibilityCell: function(ev) {
            if (this.model.get('amid') === ev.get('id')) {
                this.model.set({
                    visibility: ev.get('visibility')
                });
                this.render();
 			}
        }       
    });
})(jQuery, AN || {});