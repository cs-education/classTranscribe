0. Install docker

	Make sure you have a docker account,
	After installation login to docker,
	The command is,
	docker login

1. Clone the repository,
    git clone https://github.com/cs-education/classTranscribe.git
   Checkout the fa18-demo branch
    git checkout fa18-demo
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

4. Setup Redis

	Pull Docker Image for Redis,
	docker pull redis

	Run Docker Redis Image,
	docker run -d -p 6379:6379 --name redisdb redis redis-server
5. Setup base Image

	Build the image,
	docker build -f Dockerfile.base -t cs-education/classtranscribe/base .

	(The dot at the end is important)

6. Setup Production Image

	Build the image,
	docker build -f Dockerfile.production -t cs-education/classtranscribe/production ..
	Run the image,
	docker run -i -t -p 443:8000 -p 80:7000 --mount type=bind,source={Absolute_path_to_data_directory},target=/data --link redisdb:redis --link CTdb:mssql --env-file env.list --name CT_Prod cs-education/classtranscribe/production /bin/bash -c "git pull; npm install; npm start"

7. Setup Dev Image

	Build the image,
	docker build -f Dockerfile.dev -t cs-education/classtranscribe/dev ..
	Run the image, (Make sure to replace the absolute path in the following command)
	docker run -i -t --mount type=bind,source={Absolute_path_to_local_classTranscribe_repository},target=/classTranscribe --mount type=bind,source={Absolute_path_to_data_directory},target=/data -p 443:8000 -p 80:7000 --link redisdb:redis --link CTdb:mssql --env-file env.list --name CT_Dev cs-education/classtranscribe/dev /bin/bash -c "npm install; npm audit fix; npm start"

	For example,
	docker run -i -t --mount type=bind,source=D:\CT\classTranscribe,target=/classTranscribe --mount type=bind,source=D:\CT\data,target=/data -p 443:8000 -p 80:7000 --link redisdb:redis --link CTdb:mssql --env-file env.list  --name CT_Dev cs-education/classtranscribe/dev /bin/bash -c "npm install; npm audit fix; npm start "

8. You can access it via your browser on the address "https://127.0.0.1"


A few useful articles
https://docs.docker.com/engine/reference/commandline/attach/#examples
https://docs.docker.com/engine/reference/commandline/commit/
https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017

Remember,
On exiting a container your changes ARE NOT persisted. So step 7(except step 8) onwards nothing gets persisted until you commit.

NOTE:
1. The usage of redis should be removed later, for now, you will need both redis and mssql running.
2. To mount your local directory into docker, you should take a look of
    https://docs.docker.com/storage/bind-mounts/
    *TLDR; add '--mount type=bind,source=/your/full/local/path,target=/data' after 'docker run -i -t' in step 11*
3. Since we are giving redis and mssql names, when there is error of running those images, clean previous container first.
    https://gist.github.com/bastman/5b57ddb3c11942094f8d0a97d461b430
4. If there are docker container name conflicts, instead of "docker run", try "docker start"
    docker start redisdb/CTdb

To connect to the SQL Server for debug purposes,
Use the following commands,
	Step 1, Connect to SQL Container
	sudo docker exec -it CTdb "bash"
	Step 2, Login to the SQL Server 
	Use the following command, (The SQL_PASS can be found in the file env.list)
	/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P {SQL_PASS}
