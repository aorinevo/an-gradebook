AN.Views.CellView = (function(my){
   my = AN.Views.Base.extend({
        tagName: 'td',
        events: {
            "click .view": "edit",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "hideInput"
        },
        initialize: function() {
            this.listenTo(this.model, 'change:assign_points_earned', this.render);
            this.listenTo(AN.GlobalVars.assignments, 'change:selected', this.selectCell);
            this.listenTo(AN.GlobalVars.assignments, 'change:hover', this.hoverCell);            
            this.listenTo(this.model, 'change:selected', this.selectCellCSS);
            this.listenTo(this.model, 'change:hover', this.hoverCellCSS);            
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });
        },
        render: function() {
            this.$el.html('<div class="view">' + this.model.get('assign_points_earned') + '</div> <input class="edit" type="text" value="' + this.model.get('assign_points_earned') + '"></input>');
            this.input = this.$('.edit');
            return this;
        },
        hoverCell: function(){
        	
        },
        close: function() {
            this.remove();
        },
        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.hideInput();
        },
        hideInput: function() { //this gets called twice.
            var value = this.input.val();
            var self = this;
            $.post(ajaxurl, {
                action: 'update_assignment',
                uid: this.model.get('uid'),
                amid: this.model.get('amid'),
                assign_points_earned: value
            }, function(data) {
                if(data) self.model.set({
                    assign_points_earned: parseInt(data['assign_points_earned'])
                });
            }, 'json');
            this.$el.removeClass("editing");
        },
        edit: function() {
            var w = this.$el.width();
            this.input.css('width', w);
            this.input.css('margin-right', -w); //I'm not really sure why, but this works??		    
            this.$el.addClass("editing");
            this.input.focus();
        },
        hoverCell: function(ev) {
            var x = AN.GlobalVars.assignments.findWhere({
                hover: true
            });
            if (x && this.model.get('amid') == x.get('id')) {
                this.model.set({
                    hover: true
                });
            } else {
                this.model.set({
                    hover: false
                });
            }
        },
        hoverCellCSS: function() {
            if (this.model.get('hover')) {
                this.$el.addClass('hover');
            } else {
                this.$el.removeClass('hover');
            }
        },        
        selectCell: function(ev) {
            var x = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            if (x && this.model.get('amid') == x.get('id')) {
                this.model.set({
                    selected: true
                });
            } else {
                this.model.set({
                    selected: false
                });
            }
        },
        selectCellCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        }
    });
    AN.Models.Assignment = AN.Models.Base.extend({
        defaults: {
            assign_name: 'assign name',
            sorted: '',
            selected: false
        }
    });
return my;
})(AN.Views.CellView ||{});