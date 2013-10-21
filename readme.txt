=== AN_GradeBook ===
Contributors: anevo, jamarparris
Donate link: 
Tags: GradeBook, Course Management, Education, Grades
Requires at least: 3.3
Tested up to: 3.6.1
Stable tag: 1.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This is a simple gradebook based on jQuery, JS, mySQL and php.

== Description ==

After the plugin is installed, simply insert the short code [GradeBook] on any page that you would like the gradebook to appear.

Admin will have access to (almost) full CRUD implementation:
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

== Frequently asked questions ==



== Screenshots ==

1. Admin view with selected course in orange
2. Admin view with no selected courses
3. Student view with course selected and pie chart displayed

== Changelog ==

Bug fix - Not enough of the jquery libraries were being loaded preventing users from adding courses, adding students, etc...

== Upgrade notice ==





== Disclaimer ==

I am not a programmer. Any help would be much appreciated. 



== Misc ==

I am an educator.  This plugin is a first attempt at a nice plugin to record grades.  There are still more features that I want to add and will add over time.