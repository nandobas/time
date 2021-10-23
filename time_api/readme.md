# local:
## install dependences:

apt-get install php7.1-xml
sudo apt install composer
composer install


## please, read db_mysql script and after run in time_api_service

php artisan migrate

docker build -t db_mysql_time ./db_mysql/
docker run --name db_mysql_service -p 8406:3306 -v db_mysql\data:/var/lib/mysql --restart=always -d db_mysql_time

docker build -t time_api ./time_api/
docker run --name time_api_service -p 8084:8000 --link db_mysql_service --restart=always -d time_api

# laravel_devops

docker run --name vuejs/draw-front-3d -p 1981:80 -restart=always -d vuejs/newdraw:latest


docker run --name time_front -p 8084:80 --restart=always -d time_front
