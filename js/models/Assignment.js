AN.Models.Assignment = (function(my){
    my = AN.Models.Base.extend({
        defaults: {
            assign_name: 'assign name',
            sorted: '',
            selected: false
        }
    });
    return my;
})(AN.Models.Assignment || {});