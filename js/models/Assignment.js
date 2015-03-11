(function(AN){
	AN.Models.Assignment = AN.Models.Base.extend({
        defaults: {   
        	assign_category: '',  
            assign_name: 'assign name',
            assign_due: '',
            assign_date: '',
            gbid: null,
            sorted: '',
            visibility: true,
           // assign_visibility: 'Student',            
            publish: true,
            selected: false
        },
        url: function(){
        	if(this.get('id')){
        		return ajaxurl + '?action=assignment&id='+this.get('id');
        	} else {
        		return ajaxurl + '?action=assignment';
        	}
        }
    });
})(AN || {});