---

# Project Name

## Overview

This project is a mobile application that respresent the mobile banking infrasture. It is a Data Structures project with no third party intergration. It includes features such as transferring money between accounts, stopping cheques, and managing financial tips.

## Installation

1. Clone the repository to your local machine:

```
git clone <repository-url>
```

2. Install dependencies:

```
cd <project-directory>
composer install
```

3. Set up environment variables:

Create a `.env` file in the root directory of the project and add the following variables:

```
DB_HOST=your_database_host
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
SECRET_KEY=your_secret_key_for_JWT
```

4. Import the database schema:

Use the provided SQL dump file to create the database schema.

```
mysql -u <username> -p <database_name> < schema.sql
```

## Usage

1. Start the PHP development server:

```
php -S localhost:8000 -t public
```

or use xampp control panel to run phpmyAdmin and MySQL servers. 

2 Access it on browswe:

```
http://localhost/phpmyadmin/
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Create a new Pull Request

---
