AN.Models.Cell = (function(my){
    my = AN.Models.Base.extend({
        defaults: {
            uid: null,
            // user id
            gbid: null,
            order: null,
            amid: null,
            // assignment id
            assign_points_earned: 0,
            selected: false,
            hover: false,
            visibility: true,
            display: false
        },
        toggleSelected: function() {
            this.set({
                selected: !this.get('selected')
            });
        },
        url: function(){
        	if(this.get('id')){
        		return ajaxurl + '?action=cell&id='+this.get('id');
        	} else {
        		return ajaxurl + '?action=cell';
        	}
        }
    });
	return my;
})(AN.Models.Cell || {});