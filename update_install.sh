git checkout .
git checkout $1

npm install

sequelize-cli db:migrate

# restart the nodemon process
