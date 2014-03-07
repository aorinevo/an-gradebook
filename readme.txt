=== AN_GradeBook ===
Contributors: anevo, jamarparris
Donate link: 
Tags: GradeBook, Course Management, Education, Grades
Requires at least: 3.3
Tested up to: 3.8.1
Stable tag: 2.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple gradebook built on backbone, underscore, jQuery, JS, mySQL, and php.

== Description == 

Insert the shortcode [GradeBook] anywhere you would like GradeBook to appear.

Administrators will have access to:
1) add/delete student,
2) add/delete course,
3) add/delete assignment.

Students will have access to:
1) their grades, and
2) basic stats for assignments. So far there is a pie chart corresponding to the number of A's, B's, C's, etc... of a particular assignment.  The pie chart appears when a student is logged in and clicks on an assignment cell.

Highlighted features:
1) No reloading. jQuery allows all the above functionality without reloading the page.
2) edit course names, semester, year, student names, grades, etc... in place, just hit return or click away to save inputs to the database.

== Installation ==

1. Download and unzip in the plugins/ directory.
2. Activate the plugin in the installed plugins page of the admin panel.
3. Place shortcode [GradeBook] anywhere you would like the gradebook to appear.

== Screenshots ==

1. GradeBook with a few courses.
2. GradeBook with a course selected and corresponding students displayed.
3. Add student modal.
4. GradeBook with a course and student selected.

== Changelog ==

Version 2.0: GradeBook code was rebuilt from the ground up. This version is not backwards compatible. You will not have access to gradebooks created in previous versions.

Version 1.3.1: jquery-ui-tooltip.js was missing, breaking the code when new assignments were being added.  Feature added - when deleting a user from the admin panel, the user is removed from any associated gradebooks.

Version 1.3: Bug fix - Not enough of the jquery libraries were being loaded preventing users from adding courses, adding students, etc...

== Upgrade notice ==

This version is not backwards compatible. You will not have access to gradebooks created in previous versions.




== Disclaimer ==

GradeBook is still in development.  Version 2.0 is a beta release. 