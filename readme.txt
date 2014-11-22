=== AN_GradeBook ===
Contributors: anevo, jamarparris
Donate link: 
Tags: GradeBook, Course Management, Education, Grades
Requires at least: 3.3
Tested up to: 4.0.1
Stable tag: 2.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple gradebook built on backbone, underscore, jQuery, JS, mySQL, and php.

== Description == 

Administrators are able to

* Add/delete students
* Add/delete courses
* Add/delete assignments

**IMPORTANT:**

*Username*

Students added through the plugin, who are not already in the database, will have the user_login set to the first initial of their first name concatenated with their last name and user_id number; all characters must be entered in lowercase. 

*Password*

The password will be set to *password*.

*Note: If students are added using their user_id, then their username and password remains unchanged, provided that the respective information exists in the database.*

Students are able to:

* View their grades
* View basic statistics for assignments;  a pie chart corresponding to the grade distribution of a particular assignment is provided when an assignment header cell is selected; a line graph comparing student performance to class average is provided when a row header cell is selected.

**Highlighted features**

* jQuery allows for all the above mentioned functionality without reloading the page
* Click on any cell to edit students’ grades and press return or click away to save grades

== Installation ==

1. Download and unzip in the plugins/ directory
2. Activate the plugin in the installed plugins page of the admin panel
3. A new admin item menu labeled GradeBook should now be present in the admin dashboard menu

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

Version 2.8:

* Squashed some major bugs.
* App should run more smoothly now.

Version 2.7.2:

* Having a modal to manage filtering of assignments really didn’t make sense.  Now you can filter within the gradebook view. 
* Rerendering the gradebook after adding an assignment seems to take care of the disappearing assignment header. 
* Gradebook also rerenders on adding students, that way students are resorted according to last name.

Version 2.7.1:

* Bug fix: Switch grade-books fires an ajax request and unless aborted would render the response from the server.  This may not have been noticeable because the plugin will render the responses in the order in which they were sent and so eventually the right gradebook would be rendered.  This fix kills the unnecessary and outstanding ajax requests.

Version 2.7:

* Performance enhancements on JS side.  Some function looped over a larger set of elements then necessary.  
* New Feature: Added filter button.  Filter will only recognize assignments that are categorized.  You can add a category by editing an assignment already in the gradebook or when adding a new assignment.

Version 2.6.1:

* Bug fix: Editing an assignment previously added to the gradebook would add a new assignment.

Version 2.6:

* Removed jquery post/get calls and replaced them with backbone fetch,destroy,save. 
* Added pointer to .course and .student cells to indicate selectable cells.
* Added default cursor to all other td cells.
* Bug fix: When adding an assignment to a new course, the assignment gets created but does not render.
* Added sorting in both directions: dec and asc.
* General performance enhancements (reduce function calls and http requests).


Version 2.5:

* Added Help menu located at the top right of the page.  There you’ll find information on how to interact with the gradebook.
* Reduced the amount of ajax calls when building the gradebook for a particular course.  Before 4 ajax calls took place, and the page had to wait till all calls returned successfully before rendering.  Now there is just one ajax call.  This had a significant impact on the load times.

Version 2.4.8:

* Added support for decimal grades. 
* Cleaned up an-gradebook-database.php.  Deprecated function database_setup is now two functions database_init and database_alter.  The database_init function fires on a fresh install.  the database_alter function fires the necessary alterations depending on the version of the database currently installed.

Version 2.4.7:

* Reduced the number of calls to ob_start, removed any calls to ob_get_contents and replaced them with calls to ob_get_clean.

Version 2.4.6:

* Removed images directory and jquery-1.11.0.min.js file. The directory contained images related to jquery-ui v1.11.0, which was not being used. jquery v1.10+ is sufficient for this plugin and is now loaded from wp-includes directory but for this to work, the global jQuery variable had to be passed into all the modules.

Version 2.4.5:

* Fix: v2.4.4 broke statistic views for instructors.

Version 2.4.4:

* Added module code pattern.
* Fixed bug where gradebook was not displaying.

Version 2.4.2:

* Fixed a bug where menu items with same position as GradeBook would be overwritten.

Version 2.4.1:

* Added two buttons: Student Statistics and Assignment Statistics.  
 * When a student is logged in and clicks on row heading “Grades:” the Student Statistics button becomes active. 
 * If the student clicks this button, a modal appears with a line chart displaying the student’s scores vs. class average on each assignment. If there are no assignments then the modal will display the message: “There is no content to display.”
 * When a student is logged in and clicks on a column heading for any assignment, the Assignment Statistics button becomes active. If the student clicks this button, a modal appears with a pie chart displaying the grade distribution for that assignment.

Version 2.4:

* Added a student statistics button. 
 * When a student is selected and the button is clicked, statistics modal appears displaying the student’s scores vs. class average for all assignments to date. If there are no assignments, then the modal contains the message: “There is no content to display.”

Version 2.3.7:

* Added a functions.php file to hold all commonly used functions (i.e. hooks, sorting, etc...) 
* Added a delete_user hook. 
 * When an admin deletes users from the database through the Users admin page, the hook deletes them from any gradebook table with which  they are associated.

Version 2.3.6:

* uninstall.php needed a line to remove an_gradebook_db_version from wp_options table. A user that has deleted the plugin and reinstalls used to not obtain all the necessary tables.

Version 2.3.5:

* Added an Assignment Statistics modal. 
 * Instead of the assignment pie chart being displayed once an assignment column is selected, users can now click the Assignment Statistics button and a modal appears containing the pie chart; this enhancement allows for easy addition of other charts in the future.


Version 2.3.4:

* Started to split GradeBook.php into smaller files. 
 * Almost all templates are now in the templates folder; AN_GradeBook_Database class is now in an-gradebook-database.php.

Version 2.3.3:

* Upgraded columns name, school, and semester in table an_gradebooks to character set utf8 and collate utf8_general_ci so that international characters can be stored correctly.

Version 2.3.2:

* Students can now be deleted from a particular gradebook, all the gradebooks, or the wordpress database.

Version 2.3.1:

* Bug Fix: Edit Assignment and Delete Assignment buttons were not disabled after a selected assignment was deleted.
* Bug Fix: After editing a student’s score, sorting used to break because the new score was saved as a string.  

Version 2.3:

* Global namespace issues have been addressed.  Everything in GradeBook.js is now owned by AN.
* Added sorting on assignment columns - can only sort in ascending order.
* Added highlighting of columns on hover.
* Fixed styling issues with pie chart width to fit within viewing window.

Version 2.2.6:

* Started to address global namespace pollution - mostly done.
* Fixed a bug where pie chart percentages were not displaying correctly (one of the percentages would be pushed to the border of the pie chart).
* Now ”escape” can be pressed to exit any add/edit screen.
* Now ”enter” can be pressed to save on any add/edit screen.

Version 2.2.5:

* More CSS changes: gradebook modals are styled like media library modals.

Version 2.2.4:

* Changed CSS for GradeBook buttons to match wp-core-ui.
* Fixed a bug where cells with multiple copies of rows and columns were being displayed.
* Changed CSS for chart view on students’ gradebook screen to match that of the admin view.


Version 2.2.3:

* Added DB Versioning to fire any upgrades to the db on future updates.  
* Cleaned up code.

Version 2.2:

* GradeBook has moved to the dashboard - admin item menu labeled GradeBook.  
* Restyled to be consistent with wordpress dashboard theme.

Version 2.1.2:

* Assignment dates and due dates are saved to the database.

Version 2.1: 

* Added student view.
* Added statistics to student view. 
 * Now when students who have successfully logged in and click on a class assignment, they are able to see the class performance statistics related to that assignment. In particular, they see a pie chart corresponding to the grade distribution for that assignment.

Version 2.0: 

* GradeBook code was rebuilt from the ground up. As this version is not backwards compatible, access to gradebooks created in previous versions is not available.

Version 1.3.1: 

* jquery-ui-tooltip.js was missing, breaking the code when new assignments were being added. Feature added: when deleting a user from the admin panel, the user is removed from all associated gradebooks.

Version 1.3: 

* Bug fix: Not enough of the jquery libraries were being loaded preventing users from adding courses, adding students, etc...

== Upgrade notice ==

This version is not backwards compatible. You will not have access to gradebooks created in previous versions.




== Disclaimer ==

GradeBook is still in development.  Version 2.4.7 is still a beta release.