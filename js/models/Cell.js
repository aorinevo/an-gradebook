(function(AN){
	AN.Models.Cell = AN.Models.Base.extend({
        defaults: {
            uid: null,
            gbid: null,
            assign_order: null,
            amid: null,
            assign_points_earned: 0,
            selected: false,
            hover: false,
            visibility: true,
            display: false
        },
        url: function(){
        	if(this.get('id')){
        		return ajaxurl + '?action=cell&id='+this.get('id');
        	} else {
        		return ajaxurl + '?action=cell';
        	}
        }
    });
})(AN || {});