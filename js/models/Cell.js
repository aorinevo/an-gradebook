AN.Models.Cell = (function(my){
	console.log(my);
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
            display: false
        },
        toggleSelected: function() {
            this.set({
                selected: !this.get('selected')
            });
        }
    });
	console.log(my);
	return my;
})(AN.Models.Cell || {});