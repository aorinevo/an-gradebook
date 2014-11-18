AN.Models.Assignment = (function(my){
    my = AN.Models.Base.extend({
        defaults: {     
            assign_name: 'assign name',
            assign_due: '',
            assign_date: '',
            gbid: null,
            sorted: '',
            selected: false
        },
        url: function(){
        	if(this.get('id')){
        		return ajaxurl + '?action=assignment&id='+this.get('id')+'&assign_due='+this.get('assign_due')+'&assign_date='+this.get('assign_date')+'&gbid='+this.get('gbid');
        	} else {
        		return ajaxurl + '?action=assignment';
        	}
        }
    });
    return my;
})(AN.Models.Assignment || {});