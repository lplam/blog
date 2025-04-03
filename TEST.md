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

<p class="portfolio-content">You can find PATH_OF_MONGODB_VOLUME with command "docker inspect" and you will see the "Mounts" section in the output.</p>

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

# Apply SOLID principles in NestJs

20/07/2024 ~ SOLID in NestJs ~ SOLID in NestJs ~ https://s3.buyngon.com/buyngon/web/VD9T6UMN2DVTCUP7RQWE.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2605856004&Signature=23FJA1SKPzXMrsLnGSfjuzqIE84%3D

<br>

[![SOLID in NestJs](https://s3.buyngon.com/buyngon/web/VD9T6UMN2DVTCUP7RQWE.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2605856004&Signature=23FJA1SKPzXMrsLnGSfjuzqIE84%3D)](https://s3.buyngon.com/buyngon/web/VD9T6UMN2DVTCUP7RQWE.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2605856004&Signature=23FJA1SKPzXMrsLnGSfjuzqIE84%3D)

### Introduction

One of the most important principles in software development is the SOLID principles. SOLID is a set of principles that help you write better code. It stands for Single Responsibility Principle, Open/Closed Principle, Liskov Substitution Principle, Interface Segregation Principle, and Dependency Inversion Principle.

Now, i will show you how to apply SOLID principles in NestJs.

<br>

### A. <span class="color-blue font-size-xl">S</span>ingle Responsibility Principle

The Single Responsibility Principle (SRP) states that a class should have only one responsibility and, consequently, only one responsibility.

```typescript
import { Injectable } from "@nestjs/common";

// ❌❌❌ this is BAD code
@Injectable()
export class UserService {
  create() {}

  update() {}

  sendMail() {}
}
```

```typescript
// ✅✅✅ this is GOOD code
@Injectable()
export class UserService {
  create() {}

  update() {}
}

@Injectable()
export class MailService {
  sendMail() {}
}
```

```typescript
// ✅✅✅ this is GOOD code
@Injectable()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  @Post()
  create(@Body() user: User) {
    this.userService.create(user);
    this.mailService.sendMail(user);
  }
}
```

<br>

### B. <span class="color-blue font-size-xl">O</span>pen/Closed Principle

The Open/Closed Principle (OCP) states that a class should be open for extension but closed for modification.

```typescript
// ❌❌❌ this is BAD code
@Injectable()
export class TransactionService {
  payment(method: string) {
    if (method === "banking") {
      // ...
    } else if (method === "paypal") {
      // ...
    } else if (method === "stripe") {
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
export abstract class PaymentGateway {
  abstract payment(method: string): void;
}

export class BankingPaymentGateway implements PaymentGateway {
  payment(method: string) {
    // ... implement banking payment
  }
}

export class PaypalPaymentGateway implements PaymentGateway {
  payment(method: string) {
    // ... implement paypal payment
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
@Injectable()
export class TransactionService {
  constructor(private readonly paymentGateway: PaymentGateway) {
    this.registerPaymentGateway();
  }

  private paymentGateway: Record<string, PaymentGateway> = {};

  registerPaymentGateway(method: string, gateway: PaymentGateway) {
    this.paymentGateway["banking"] = new BankingPaymentGateway();
    this.paymentGateway["paypal"] = new PaypalPaymentGateway();
  }

  process(method: "banking" | "paypal") {
    this.paymentGateway[method].payment(method);
  }
}
```

<p class="note">So, if you want to add a new payment method, you can extend the PaymentGateway class and implement the payment method.</p>

<br>

### C. <span class="color-blue font-size-xl">L</span>iskov Substitution Principle

The Liskov Substitution Principle (LSP) states that objects of a superclass should be replaceable with objects of its subclasses without breaking the functionality of your program.

```typescript
// ❌❌❌ this is BAD code
class Bird {
  fly() {}
}

class Duck extends Bird {
  fly() {}
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly");
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
interface Flyable {
  fly(): void;
}

interface Swimable {
  swim(): void;
}

class Duck implements Flyable, Swimable {
  fly() {}
  swim() {}
}

class Penguin implements Swimable {
  swim() {}
}
```

<br>

### D. <span class="color-blue font-size-xl">I</span>nterface Segregation Principle

The Interface Segregation Principle (ISP) states that a class should not be forced to implement interfaces that it does not use.

```typescript
// ❌❌❌ this is BAD code
interface Notification {
  message: string;
  to: string;
  subject: string;
  body: string;
  phone: string;
  userId: string;
  title: string;
}

interface NotificationService {
  sendSmsNotification(notification: Notification): Promise<void>;
  sendEmailNotification(notification: Notification): Promise<void>;
  sendPushNotification(notification: Notification): Promise<void>;
}
```

```typescript
// ✅✅✅ this is GOOD code
interface SmsNotification {
  phone: string;
  message: string;
}

interface EmailNotification {
  to: string;
  body: string;
  subject: string;
}

interface PushNotification {
  userId: string;
  title: string;
  message: string;
}

interface NotificationService {
  sendSmsNotification(notification: SmsNotification): Promise<void>;
  sendEmailNotification(notification: EmailNotification): Promise<void>;
  sendPushNotification(notification: PushNotification): Promise<void>;
}
```

<br>

### E. <span class="color-blue font-size-xl">D</span>ependency Inversion Principle

The Dependency Inversion Principle (DIP) states that a class should depend on abstractions rather than concrete implementations.

```typescript
// ❌❌❌ this is BAD code
class PostgresDatabase {
  save(user: string) {
    // ...
  }
}

class UserService {
  private readonly database: PostgresDatabase;

  constructor(database: PostgresDatabase) {
    this.database = database;
  }

  createUser(user: string) {
    this.database.save(user);
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
interface Database {
  save(user: string): void;
}

class PostgresDatabase implements Database {
  save(user: string) {
    // ...
  }
}

class UserService {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
@Module({
  providers: [{ provide: Database, useClass: PostgresDatabase }],
})
export class UserModule {}
```

<br>

### Finally

Overall, applying SOLID principles in NestJS helps create a codebase that is easier to manage, test, and extend, leading to more reliable and efficient applications.

# Generic Repository Pattern in NestJs

01/09/2024 ~ Generic Repository Pattern in NestJs ~ Generic Repository Pattern in NestJs ~ https://s3.buyngon.com/buyngon/web/5USBFVGWS6IC1NCTAP4F.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606291851&Signature=naOeK6NJ5Wo%2FBcS3eSfld%2FZEwv0%3D

<br>

[![Generic Repository Pattern in NestJs](https://s3.buyngon.com/buyngon/web/5USBFVGWS6IC1NCTAP4F.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606291851&Signature=naOeK6NJ5Wo%2FBcS3eSfld%2FZEwv0%3D)](https://s3.buyngon.com/buyngon/web/5USBFVGWS6IC1NCTAP4F.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606291851&Signature=naOeK6NJ5Wo%2FBcS3eSfld%2FZEwv0%3D)

### Introduction

Generic Repository Pattern is a design pattern that provides a generic interface for interacting with a data layer. It is a simple and effective way to create a repository that can be used to interact with any database.

Today, i will show you how to create a generic repository in NestJs.

<br>

### A. Create a repository

```typescript
@Injectable()
export class UserRepository {
  constructor(private readonly userModel: Model<User>) {}

  async findAll(filter: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(filter);
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }
}
```

```typescript
@Injectable()
export class OrderRepository {
  constructor(private readonly orderModel: Model<Order>) {}

  async findAll(filter: FilterQuery<Order>): Promise<Order[]> {
    return this.orderModel.find(filter);
  }

  async findOne(filter: FilterQuery<Order>): Promise<Order> {
    return this.orderModel.findOne(filter);
  }
}
```

<p class="note">So, the code is duplicated. If you want to create a repository for a new model, you need to define the same methods again.</p>

<br>

### B. Create a generic repository

```typescript
@Injectable()
export abstract class GenericRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async findAll(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter);
  }

  /// update, delete, create, etc...
}
```

```typescript
@Injectable()
export class UserRepository extends GenericRepository<User> {
  constructor(private readonly userModel: Model<User>) {
    super(userModel);
  }
}
```

```typescript
@Injectable()
export class OrderRepository extends GenericRepository<Order> {
  constructor(private readonly orderModel: Model<Order>) {
    super(orderModel);
  }
}
```

<p class="note">So, you see, the code is not duplicated. If you want to create a repository for a new model, you can extend the GenericRepository class and implement the methods.</p>

<br>

### C. You can use the generic repository in the Service

```typescript
// ❌❌❌ this is BAD code
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async find(filter: FilterQuery<User>): Promise<User[]> {
    return this.userRepository.findAll(filter);
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return this.userRepository.findOne(filter);
  }
}
```

```typescript
// ✅✅✅ this is GOOD code
@Injectable()
export abstract class GenericService<T> {
  constructor(private readonly repository: GenericRepository<T>) {}

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.repository.findAll(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.repository.findOne(filter);
  }

  /// update, delete, create, etc...
}
```

```typescript
@Injectable()
export class UserService extends GenericService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
```

```typescript
@Injectable()
export class OrderService extends GenericService<Order> {
  constructor(private readonly orderRepository: OrderRepository) {
    super(orderRepository);
  }
}
```

### Finally

Generic Repository Pattern is a design pattern that provides a generic interface for interacting with a data layer. It make the code more reusable and easier to maintain.

# Implement Caching in NestJs

01/11/2024 ~ Implement Caching in NestJs ~ Implement Caching in NestJs ~ https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D

<br>

[![Implement Caching in NestJs](https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D)](https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D)

### Introduction

Caching is a great and simple technique that helps improve your app's performance. It acts as a temporary data store providing high performance data access.

NestJS supports caching through various mechanisms, including the use of caching libraries like cache-manager and built-in decorators such as @CacheKey and @CacheTTL. By incorporating caching strategies in your application, you can enhance performance and reduce response times for frequently requested data.

In order to enable caching, import the CacheModule and call its register() method

```typescript
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { AppController } from "./app.controller";

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
})
export class AppModule {}
```

To interact with the cache manager instance, inject it to your class using the CACHE_MANAGER token, as follows:

```typescript
constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
```

The get method is used to retrieve items from the cache. If the item does not exist in the cache, null will be returned.

```typescript
const value = await this.cacheManager.get("key");
```

To add an item to the cache, use the set method:

```typescript
await this.cacheManager.set("key", "value");
```

The default expiration time of the cache is 5 seconds, however you can change this.

await this.cacheManager.set("key", "value", 1000);
To disable expiration of the cache, set the ttl configuration property to 0:

```typescript
await this.cacheManager.set("key", "value", 0);
```

To remove an item from the cache, use the del method:

```typescript
await this.cacheManager.del("key");
```

To clear the entire cache, use the reset method:

```typescript
await this.cacheManager.reset();
```

### Finally

Caching is a great and simple technique that helps improve your app's performance. It acts as a temporary data store providing high performance data access.

# Schedule tasks in NestJS

05/12/2024 ~ Schedule tasks in NestJS ~ Schedule tasks in NestJS ~ https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D

<br>

[![Schedule tasks in NestJS](https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D)](https://s3.buyngon.com/buyngon/web/C6GGJVY86TBCZ29OEOZT.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606460113&Signature=UBxIMz4XQiLHGWbSxYTewKNKL7g%3D)

### Introduction

Task scheduling allows you to schedule arbitrary code (methods/functions) to execute at a fixed date/time, at recurring intervals, or once after a specified interval.

Nest provides the @nestjs/schedule package, which integrates with the popular Node.js cron package.

To implement scheduling, you can install the required dependencies.

```bash
npm install --save @nestjs/schedule
```

Then, import the ScheduleModule into your module:

```typescript
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./tasks.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}
```

Now, you can use the decorators in your service to schedule tasks. Here's an example:

```typescript
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log("Called every 5 seconds");
  }
}
```

In the above example, handleCron() will be called every 5 seconds. The @Cron() decorator takes a CronExpression which determines the schedule.

Remember, the ScheduleModule uses the node-schedule package under the hood, so you can use any cron expression that node-schedule supports.

### Finally

Schedule tasks in NestJS is a great and simple technique that helps improve your app's performance. It acts as a temporary data store providing high performance data access.

# Add telegram bot to NestJs

05/12/2024 ~ Add telegram bot to NestJs ~ Add telegram bot to NestJs ~ https://s3.buyngon.com/buyngon/web/IYWUT3VA7LJ5B5O13WO1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606746567&Signature=LGQOiL1ZhGZMgGZzWpMvUXeK6RI%3D
<br>

[![Add telegram bot to NestJs](https://s3.buyngon.com/buyngon/web/IYWUT3VA7LJ5B5O13WO1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606746567&Signature=LGQOiL1ZhGZMgGZzWpMvUXeK6RI%3D)](https://s3.buyngon.com/buyngon/web/IYWUT3VA7LJ5B5O13WO1.jpeg?AWSAccessKeyId=xEwgF5o8CqajX2gVVPJo&Expires=2606746567&Signature=LGQOiL1ZhGZMgGZzWpMvUXeK6RI%3D)

### Introduction

Telegram is a popular messaging app that allows you to send messages, files, and other content to your friends and groups.
Now, I will be showing you how to build a basic chat bot for Telegram using Nest.js
