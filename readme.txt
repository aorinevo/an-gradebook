=== AN_GradeBook ===
Contributors: anevo, jamarparris
Donate link: 
Tags: GradeBook, Course Management, Education, Grades
Requires at least: 3.3
Tested up to: 3.8.1
Stable tag: 2.1.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple gradebook built on backbone, underscore, jQuery, JS, mySQL, and php.

== Description == 

Insert the shortcode [GradeBook] anywhere you would like GradeBook to appear.

Administrators are able to

* add/delete students,
* add/delete courses,
* add/delete assignments

**IMPORTANT**
Any student added through the plugin, that is not already in the database, will have their user_login set to the first initial of their first name concatenated with their last name and user_id number, all in lowercase.  The password will be set to password.  If the student is added using their user_id then that students username and password that exists in the database remains unchanged.

Students are able to:

* view their grades, and
* view basic statistics for assignments.  So far there is a pie chart corresponding to grade distribution of a particular assignment.  The pie chart appears when a student is logged in and clicks on an assignment cell.

**Highlighted features**

* jQuery allows for all the above functionality without reloading the page.
* click on any cell to edit students grades and press return or click away to save grades

== Installation ==

1. Download and unzip in the plugins/ directory,
2. Activate the plugin in the installed plugins page of the admin panel,
3. Place shortcode [GradeBook] anywhere you would like the gradebook to appear,

== Screenshots ==

1. GradeBook with a few courses.
2. GradeBook with a course selected and corresponding students displayed.
3. Add student modal.
4. GradeBook with a course and student selected.
5. Admin view of GradeBook with an assignment selected - pie chart displays automatically.
6. Student view of GradeBook with an assignment selected - pie chart displays automatically.

== Changelog ==

Version 2.1.2:

* Assignment dates and due dates are save to the database.

Version 2.1: 

* Added student view.
* Added statistics to student view. Now when a student is logged in and clicks on a class assignment, he/she will see class performance statistics related to that assignment.  In particular, they will see a pie chart corresponding to the grade distribution for that assignment.

Version 2.0: GradeBook code was rebuilt from the ground up. This version is not backwards compatible. You will not have access to gradebooks created in previous versions.

Version 1.3.1: jquery-ui-tooltip.js was missing, breaking the code when new assignments were being added.  Feature added - when deleting a user from the admin panel, the user is removed from any associated gradebooks.

Version 1.3: Bug fix - Not enough of the jquery libraries were being loaded preventing users from adding courses, adding students, etc...

== Upgrade notice ==

This version is not backwards compatible. You will not have access to gradebooks created in previous versions.




== Disclaimer ==

GradeBook is still in development.  Version 2.1 is a beta release.