=== AN_GradeBook ===
Contributors: anevo, jamarparris
Donate link: 
Tags: GradeBook, Course Management, Education, Grades
Requires at least: 3.3
Tested up to: 4.0
Stable tag: 2.4.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple gradebook built on backbone, underscore, jQuery, JS, mySQL, and php.

== Description == 

Administrators are able to

* add/delete students,
* add/delete courses,
* add/delete assignments

**IMPORTANT**
Any student added through the plugin, that is not already in the database, will have their user_login set to the first initial of their first name concatenated with their last name and user_id number, all in lowercase.  The password will be set to password.  If the student is added using their user_id then that students username and password that exists in the database remains unchanged.

Students are able to:

* view their grades, and
* view basic statistics for assignments.  So far there is a pie chart corresponding to the grade distribution of a particular assignment.  The pie chart appears when a student is logged in and clicks on an assignment cell.

**Highlighted features**

* jQuery allows for all the above functionality without reloading the page.
* click on any cell to edit students grades and press return or click away to save grades

== Installation ==

1. Download and unzip in the plugins/ directory,
2. Activate the plugin in the installed plugins page of the admin panel,
3. A new admin item menu labeled GradeBook should now be present in the admin dashboard menu.

== Screenshots ==

1. GradeBook with two courses.
2. GradeBook with a course selected and corresponding students displayed.
3. Line chart for a particular student.
4. Pie chart for a particular assignment.
5. Create assignment modal.
6. Student view of GradeBook.

== Credits ==

* plugin icon: https://www.iconfinder.com/icons/175285/edit_property_icon#size=256

== Changelog ==

Version 2.4.5:

* Fix: v2.4.4 broke statistic views for instructors.

Version 2.4.4:

* Added module code pattern.
* Fixed bug where gradebook was not displaying.

Version 2.4.2:

* Fixed a bug where menu items with same position as GradeBook would be overwritten.

Version 2.4.1:

* Added two buttons: Student Statistics and Assignment Statistics.  When a student is logged in and clicks on row heading “Grades:” the Student Statistics button becomes active.  If the student then clicks this button, a modal appears with a line chart displaying the students scores vs. class average on each assignment.  If there are no assignments then the modal will display the message: There is no content to display.  When a student is logged in and clicks on column heading for any assignment, the Assignment Statistics button becomes active.  If the student then clicks this button, a modal appears with a pie chart displaying the grade distribution for that assignment.

Version 2.4:

* Added a student statistics button. When a student is selected and the button is clicked a student statistics modal appears displaying student scores vs. class average for all assignments to date.  If there are no assignments, then the modal contains the message: There is no content to display.

Version 2.3.7:

* Added a functions.php file to hold all commonly used functions (i.e. hooks, sorting, etc...) 
* Added a delete_user hook so that when an admin deletes a user from the database through the Users admin page, the hook deletes the user from any gradebook table that they are associated with."

Version 2.3.6:

* uninstall.php needed a line to remove an_gradebook_db_version from wp_options table, otherwise a user that has deleted the plugin that reinstalls will not obtain all the necessary tables.

Version 2.3.5:

* Added an Assignment Statistics modal. Instead of the assignment pie chart being displayed once an assignment column is selected, you now click the Assignment Statistics button and a modal appears containing the pie chart.  This will allow for easy addition of other charts in the future.


Version 2.3.4:

* Started to split GradeBook.php into smaller files. Almost all templates are now in the templates folder.  AN_GradeBook_Database class is now in an-gradebook-database.php.

Version 2.3.3:

* Upgraded columns name, school, and semester in table an_gradebooks to character set utf8  and collate utf8_general_ci so that international characters can be stored correctly.

Version 2.3.2:

* You can now delete a student from a particular gradebook, all the gradebooks, or the wordpress database.

Version 2.3.1:

* Bug Fix: Edit Assignment and Delete Assignment buttons didn’t disable after a selected assignment was deleted.
* Bug Fix: After editing a student score, sorting broke because the new score was saved as a string.  

Version 2.3:

* Global namespace issues have been addressed.  Everything in GradeBook.js is now owned by AN.
* Added sorting on assignment columns - can only sort in ascending order.
* Added highlighting of columns on hover.
* Fixed styling issues where pie chart width to fit within viewing window.

Version 2.2.6:

* Started to address global namespace pollution - mostly done.
* Fixed a bug where pie chart percentages weren’t displaying correctly (One of the percents would be pushed to the boarder of the pie chart).
* Now you can press escape to exit an add/edit screen.
* Now you can press enter to save on an add/edit screen.

Version 2.2.5:

* More CSS changes: gradebook modals are styled like media library modals.

Version 2.2.4:

* Changed CSS for GradeBook buttons to match wp-core-ui. 
* Fixed a bug where cells multiple copies of rows and columns were being displayed.
* Changed CSS for chart view on students gradebook to match that of the admin view.


Version 2.2.3:

* Added DB Versioning to fire any upgrades to the db on future updates.  
* Cleaned up code.

Version 2.2:

* GradeBook has moved to the dashboard - look for the admin item menu labeled GradeBook.  
* Restyled to be consistent with wordpress dashboard theme.

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