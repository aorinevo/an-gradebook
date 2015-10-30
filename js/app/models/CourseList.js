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
		comparator: 'year',
		parse: function(response){
			return response.course_list;
		}
	});
	return CourseList;
});
	