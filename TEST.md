# Menu for next week

22/05/2024 ~ Menu for next week ~ How can i up date the compilers stack machine declaration

#### Nguyên liệu

##### _Thịt ba chỉ, thịt heo xay, thịt heo cắt sẵn, thịt bò, mực, cá lóc_

<br>

**Thứ 2:** Thịt heo cắt sẵn rim, canh mực thơm.

**Thứ 3:** Canh rạm mòng tơi, cá kho.

**Thứ 4:** Cá lóc nấu măng chua, chả trứng chiên

**Thứ 5:** Thịt heo cải thìa, Canh tôm rau khoai

**Thứ 6:** Canh mướp đắng thịt bò, thịt xay nấu canh rau củ hầm.

<div class="color-blue italic">Mua thêm: thơm, mòng tơi, cá, măng chua, trứng, cải thìa, tôm, rau khoai, mướp đắng, rau củ</div>

# Mongodump and mongorestore with Docker

25/05/2024 ~ Mongodump and mongorestore with Docker ~ Mongodump and mongorestore with Docker, Docker Compose ~ https://s3.buyngon.com/buyngon/web/R6VCTP4YDLAA6RGE3XF1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2583770325&Signature=VbiObJ6Uw5dGqH6d1ZCjx8eG%2Fpg%3D

<br>

[![mongodump and mongorestore with docker](https://s3.buyngon.com/buyngon/web/R6VCTP4YDLAA6RGE3XF1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2583770325&Signature=VbiObJ6Uw5dGqH6d1ZCjx8eG%2Fpg%3D)](https://s3.buyngon.com/buyngon/web/R6VCTP4YDLAA6RGE3XF1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2583770325&Signature=VbiObJ6Uw5dGqH6d1ZCjx8eG%2Fpg%3D)

### Story

If you want to backup, export and migrate the MongoDB schema, you can use **MongoDB Tools** or **command-line**

And today i will presentation about **command-line** utilities _mongorestore_ and _mongodump_ with Docker.

<br>

### A. Export data with mongodump

1. Create mongodb container with Docker

```docker
- (create without authentication)
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

```docker
- (create secure with username/password)
docker run -d --name mongodb -p 27017:27017 -u username -p password mongo:latest
```

```docker
- (create with existing data)
docker run -d --name mongodb -p 27017:27017 -v $PATH_OF_MONGODB_VOLUME/data:/data/db mongo:latest
```

You can find PATH_OF_MONGODB_VOLUME with command "docker inspect" and you will see the "Mounts" section in the output.

<br>

2. Exec to the mongodb container (bash)

```docker
docker exec -it mongodb bash
```

3. To export the data, use command "mongodump" and the output path name "dump_backup"

```bash
mongodump -o dump_backup
```

```bash
- (secure with username/password)
mongodump -u username -p password -o dump_backup
```

<p class="note">So, the dump_backup file have been created. But the output file (dump_backup) is created inside the container's filesystem. So you need need to copy it from the container to your host (local).
<p>

4. Copy dump_backup file from container to local.

```docker
docker cp $CONTAINER_NAME:/$BACKUP_FILE_NAME/$DATABASE_NAME PATH_TO_LOCAL

docker cp mongodb:/dump_backup/blogs /Desktop/backup/dump_backup_local
```

<p class="note">Now. In the local, access to path ../Desktop/backup/dump_backup, you will see the binary files of a database</p>

<br>

### B. Import data with mongorestore

1. Copy file from local to the docker container

```docker
docker cp /Desktop/backup/dump_backup_local mongodb:/dump_backup
```

<br>

2. Exec to container and import the dump_backup file to the mongodb

```shell
mongorestore -u $USERNAME -p $PASSWORD --authenticationDatabase=admin -d $DATABASE_NAME $BACKUP_FILE_NAME

mongorestore -u username -p password --authenticationDatabase=admin -d blogs /dump_backup (if with secure username/password)

mongorestore -d blogs /dump_backup (if without secure username/password)
```

### Finally

If the database just deploy production. You only ssh to the host and do the same. I hope you find the information here useful
