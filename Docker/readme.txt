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


Pull Docker Image for Redis,
docker pull redis

Run Docker Redis Image,
docker run -d -p 6379:6379 --name redisdb redis redis-server



For base
Build the image,
docker build -f Dockerfile.base -t cs-education/classtranscribe/base .

For production

Build the image,
docker build -f Dockerfile.production -t cs-education/classtranscribe/production ..
Run the image,
docker run -i -t -p 443:8000 -p 80:7000 --link redisdb:redis --link CTdb:mssql --env-file env.list --name CT_Prod cs-education/classtranscribe/production /bin/bash -c "git pull; npm install; npm start"

For dev,

Build the image,
docker build -f Dockerfile.dev -t cs-education/classtranscribe/dev ..
docker run -i -t --mount type=bind,source={Absolute_path_to_local_classTranscribe_repository},target=/classTranscribe -p 443:8000 -p 80:7000 --link redisdb:redis --link CTdb:mssql --env-file env.list --name CT_Dev cs-education/classtranscribe/dev /bin/bash -c "npm start"

For example,
docker run -i -t --mount type=bind,source=D:\CT\classTranscribe,target=/classTranscribe -p 443:8000 -p 80:7000 --link redisdb:redis --link CTdb:mssql --env-file env.list cs-education/classtranscribe/dev /bin/bash -c " npm install; npm audit fix; npm start"
