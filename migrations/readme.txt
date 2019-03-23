To create a migration,
- Make the required change to the appropriate models (eg. drop a column, add a column, add/drop a table)
- Save the modified model file
- Run the command
 node_modules/.bin/makemigration --name <migration name>
 Example Migration name: 'add foo column' 
 (the number prefix and hypen will be added automatically)

 - Review the generated migration file under migrations/
 - If all is good re run the application for the migration to take effect.

