/**
 * @exports module:CourseList.js/models/CourseList
 */
define(['backbone','models/Course'],
function(Backbone,Course){ 
    /**
     * @name module:CourseList.js/models/CourseList
     * @constructor
     * @augments Backbone.Collection
     */
	var CourseList = Backbone.Collection.extend(
	/** @lends CourseList.prototype */	
	{
		model: Course,
		/**
		 * Specify the URL root to fetch from
		 * @returns {string}
		 */		
		url: function(){
			return ajaxurl + '?action=course_list';
		},
		sort_key : 'year',
        comparator: function(model1,model2){
			var _val1 = model1.get(this.sort_key);
			var _val2 = model2.get(this.sort_key);	          
			if(this.sort_key != 'year' && this.sort_key != 'id'){  	
				if( this.sort_direction === 'asc' ){			
					return _val2.localeCompare(_val1);
				} else {							
					return _val1.localeCompare(_val2);
				}
			} else {
				if( this.sort_direction === 'asc' ){			
					return _val2 - _val1;
				} else {							
					return _val1 - _val2;
				}			
			}
        },
		parse: function(response){
			return response.course_list;
		}
	});
	return CourseList;
});
	