0. Install docker

	Make sure you have a docker account,
	After installation login to docker,
	The command is,
	docker login

1. Clone the repository,
    git clone https://github.com/cs-education/classTranscribe.git
2. Navigate to the "Docker" folder in the github repository.
3. Setup SQL

	Pull Docker Image for SQL,
	docker pull mcr.microsoft.com/mssql/server:2017-latest

	Run Docker SQL Image,
	docker run --env-file env.list -p 1433:1433 --name CTdb -d mcr.microsoft.com/mssql/server:2017-latest

	We need to create a SQL Db in the SQL server before proceeding further,
	Step 1, Connect to SQL Container
	sudo docker exec -it CTdb "bash"
	Step 2, Login to the SQL Server
	Use the following command, (The SQL_PASS can be found in the file env.list)
	/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P {SQL_PASS}
	Step 3, Create a database, (The SQL_DB can be found in the file env.list)
	CREATE DATABASE {SQL_DB}
	GO
	EXIT
	Step 4, exit the container,
	exit

4. Setup base Image

	Build the image,
	docker build -f Dockerfile.base -t cs-education/classtranscribe/base .

	(The dot at the end is important)

RUN EITHER THE PRODUCTION OR THE DEVELOPMENT IMAGE INSTRUCTIONS

For Setup of Production Image

	Build the image,
	docker build -f Dockerfile.production -t cs-education/classtranscribe/production ..
	Run the image,
	(REPLACE THE {Absolute_path_to_data_directory} with a local directory where the data will be stored)
	docker run -i -t -p 443:8000 -p 80:7000 --mount type=bind,source={Absolute_path_to_data_directory},target=/data --link CTdb:mssql --env-file env.list --name CT_Prod cs-education/classtranscribe/production /bin/bash -c "git pull; npm install; npm start"

	OR

For Setup of Development Image

	Build the image,
	docker build -f Dockerfile.dev -t cs-education/classtranscribe/dev ..
	Run the image, 
	(REPLACE THE {Absolute_path_to_local_classTranscribe_repository} with a local directory the git repositor is stored)
	(REPLACE THE {Absolute_path_to_data_directory} with a local directory where the data will be stored)
	docker run -i -t --mount type=bind,source={Absolute_path_to_local_classTranscribe_repository},target=/classTranscribe --mount type=bind,source={Absolute_path_to_data_directory},target=/data -p 443:8000 -p 80:7000 --link CTdb:mssql --env-file env.list --name CT_Dev cs-education/classtranscribe/dev /bin/bash -c "npm install; npm audit fix; npm start"

	For example,
	docker run -i -t --mount type=bind,source=D:\CT\classTranscribe,target=/classTranscribe --mount type=bind,source=D:\CT\data,target=/data -p 443:8000 -p 80:7000 --link CTdb:mssql --env-file env.list  --name CT_Dev cs-education/classtranscribe/dev /bin/bash -c "npm install; npm audit fix; npm start "

7. You can access it via your browser on the address "https://127.0.0.1"


A few useful articles
https://docs.docker.com/engine/reference/commandline/attach/#examples
https://docs.docker.com/engine/reference/commandline/commit/
https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017
https://docs.docker.com/storage/bind-mounts/

NOTE:
1. Since we are giving mssql name, when there is error of running those images, clean previous container first.
    https://gist.github.com/bastman/5b57ddb3c11942094f8d0a97d461b430
2. If there are docker container name conflicts, instead of "docker run", try "docker start"
    docker start CTdb
