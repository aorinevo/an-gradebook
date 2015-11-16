# ![an-gradebook](https://raw.githubusercontent.com/aorinevo/an-gradebook/master/logos/icon-128x128.png) AN_GradeBook

AN_GradeBook allows educators to create, maintain, and share grades quickly and efficiently. 

## Description

Administrators are able to

* Add/delete students
* Add/delete courses
* Add/delete assignments

**IMPORTANT:**

*Username*

Students added through the plugin, who are not already in the database, will have the user_login set to the first initial of their first name concatenated with their last name and a string of digits; all characters must be entered in lowercase. 

*Password*

The password will be set to *password*.

*Note: If students are added using their user_login, then their username and password remains unchanged, provided that the respective information exists in the database.*

Students are able to:

* View their grades
* View pie charts and line graphs based on student and class performance

## Installation

1. Download and unzip in the plugins/ directory
2. Activate the plugin in the installed plugins page of the admin panel
3. A new admin item menu labeled GradeBook should now be present in the admin dashboard menu

## Credits

* plugin icon: https://www.iconfinder.com/icons/175285/edit_property_icon#size=256

## Changelog

Version 4.0.4:

* Added ajax loading image when retrieving course list and gradebook.
* Quick fix for gradebook view, assignment headers were disappearing and new rows failed to render.  This was due to a call to a deprecated function.

Version 4.0.3:

* Added sorting for course list.  Sort by id, name, school, semester, and year.
* Simplified sorting code for gradebook view.
* New charts built with Chartjs.
* Fixed line chart to display student statistics for assignments relative to their order in their gradebook.
* Cleaned up lib directory

Version 4.0.2:

* Added sorting by user_login, first_name, and last_name.
* Added support for legacy web servers.  Some web servers do not handle PUT requests as anticipated. 
* remove misc console.log statements.
* Added D3js library.  We are moving towards removing dependencies on google charts used in rendering student and assignment statistics.

Version 4.0.1:

* Plugin had two separate js files that handled the gradebook and settings separately.  The files are now combined into one file.
* Style page title and fix margin to be consistent with wpcontent styles.
* Fixed issue where student view of gradebook always used John for first name and Doe for last name.  


Version 4.0:

* Added search when adding students to gradebook.  Automatically queries the database as you type and returns a list of users from which to select.
* Renamed plugin database tables to an_gradebook_cells, an_gradebook_assignments, an_gradebook_courses, an_gradebook_users.
* Security fix: added a role check when requesting line chart statistics. Otherwise, there’s a potential for a students grades to be exposed however, it would be unlikely that the user would know the link, user id, and gradebook id to successfully do this.
* Fixed margin-right to prevent gradebook from stretching all the way to the right of the browser window.
* When gradebook loads courses and students, a loading indicator is displayed.
* Only administrators, users with wordpress role set to administrator, are allowed to add courses.  Instructors, with the gradebook role set to instructor, can edit, delete and add students. There is also a student role in gradebook which is automatically assigned to a user added to a gradebook.
* Bug fix. Seems that the delete course bug wasn’t fixed in v3.5.7.  This occurs when a user deletes a selected gradebook.  Then the view doesn’t remove itself.  
* Added settings page, where WordPress admin users can select roles that are allowed to administer AN_GradeBook. Users with those roles will be able to create new gradebooks.
* Reorganized files.  Main changes under the app directory.
* Added a router.
* The gradebook view now displays on a separate page, instead of below the course list.  To access the gradebook view, select view item from the dropdown menu.
* Dropped backwards compatibility up to v2.9

Version 3.5.7:

* Bug Fix: On course delete, gradebook would empty its views.  Reclicking the course, rerendered the gradebook correctly.
* Minified the app into two essential files, app-instructor-min.js and app-student-min.js
* Added a debugging toggle in GradeBook.php
* Slight change to views. Rounded corners are now sharp.

Version 3.5.6:

* Database upgrade: Users no longer in the database are removed from gradebooks. Deleting users through the Users tab, removes students from gradebooks.
* Use RequireJS to manage file loading for almost the entire app.  A couple of js files have to be loaded through php.  In particular, the css files for bootstrap and jquery-ui, the require.js file, and the dependent file app.js.
* Bug Fix: Adding a student that was already in the database, using their user_login, would add the student to the gradebook but the user_login cell would be empty.  If the page was refreshed, the user_login would display.  


Version 3.5.5:

* Bug fix: Sort on first assignment column broken.
* General file management.

Version 3.5.4:

* New Feature: Choose which assignments are visible to your students by selecting the Students option in the edit assignment modal.

Version 3.5.3:

* Update and clean forms.
* Bug fix: Adding a student to an already filtered gradebook caused hidden assignment cells for that student to appear.
* Download cvs filename is derived from the course name and id.  For example, a Calculus I course with ID 19 will have the exported csv stored in a file named Calculus_I_19.csv


Version 3.5.2:

* Added details view on student side of the gradebook.  In particular, students can now view due dates.

Version 3.5.1:

* Fixed bug on student view where the gradebook would not display.

Version 3.5:

* The delete student modal was still rendered using old styling.  This was updated to the new styling.
* Added dropdown tools menu for courses, similar to the one for students.  This allowed us to remove the edit and delete buttons from the top of the GradeBook page.
* Fixed styling conflict both on the student view and instructor view with wordpress #adminmenuback.  
* Added background-color: white to tables.
* New Feature: Export GradeBook to CSV.

Version 3.4:

* Added support for server requests of type x-http-method-override.
* Restyled using Bootstrap.

Version 3.3:

* Instructors now can add existing users in their WordPress database to the GradeBook by entering the user_login instead of the confusing and difficult to find user_id.  If the user_login exists in the database, the user is added to the GradeBook.  Otherwise, nothing happens.

Version 3.2:

* This update is mostly for the student view of grade-book.  
* Code maintenance: Split up Gradebook_student.js into models and views.

Version 3.1:

* Code maintenance: Split up GradeBook.php into classes.
* Code maintenance: Removed unnecessary lines of code such as redundant wp_enqueue_script calls.
* Bug Fix: user_login was incorrectly set to the users second initial of their first name, lastname, and user_id concatenated together, in lowercase.
* Due to the bug fix, we removed the ID column of the gradebook and replaced it with a Login column.  This is the login name the user must use to log in.  The password is still set to password.
* Added a student menu button that handles edit, delete, and statistics views.

Version 3.0:

* Fixed assignment header bug where sorting a column caused the header cell to be the only cell to change color on hover on the first mouse enter.
* Feature: Added assignment ordering.  Newly added assignments are appended to the gradebook.  To move an assignment to the left or right, click on the assignment cell menu icon and choose from the shift options.  
* Fixed assignment header display bug (Firefox).  Assignment headers would fail to display in Firefox.
* Cleaned up views.  Views were rarely removed, which ate up memory.  Now all unnecessary views are removed.
* Upgraded the database to handle ordering. 
* Other performance and code enhancements.

Version 2.9:

* Fixed Firefox bug where student list would not display.
* Added assignment menus to assignment headers and removed the corresponding buttons from grade-book view.
* Added student menus to student row headers and removed the corresponding buttons from grade-book view.
* Cleaned up code.

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


