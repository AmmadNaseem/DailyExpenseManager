# Daily Expense Manager- Anular & ASP. NET Core WebAPIs

Daily Expense Manager is a web application built using Angular and ASP.NET Core Web API that helps users manage their daily expenses and track their income and savings. One of the key features of the application is the ability to automatically add the previous month's savings to the new month. To achieve this, the application stores users' monthly savings in a database table. At the beginning of a new month, the application retrieves the previous month's savings amount for each user from the database and adds it to the user's current income to calculate their total funds for the new month. The application then inserts a new record into the savings table for the current month, with the user ID, the current month, and the total funds for the month. In addition to automatically adding the previous month's savings, Daily Expense Manager also allows users to add their income and expenses for the new month. The application stores this data in a separate database table with columns for the user ID, the month, the category, the amount, and the date. Users can input their income and expenses data using a form in the frontend of the application, which is then handled by API endpoints in the backend. Once the user has input their income and expenses data, the application provides a report generation feature that enables users to generate reports on their income and expenses for the new month. The feature retrieves the data from the database and presents it in a readable format for the user, allowing them to monitor their spending and make informed financial decisions. Overall, Daily Expense Manager is a powerful tool that helps users manage their finances effectively by automatically carrying over their savings from the previous month and tracking their income and expenses for the new month.


## Frontend Technologies:

    HTML, CSS, Boostrap & Angular.

## Backend Technologies:

    SQL Server, ASP. NET Core 14 Web Apis, & Entity FrameWork.
    
# Demo: 
https://user-images.githubusercontent.com/61114465/234557315-a307c254-b887-47fc-8105-1082775b349b.mp4


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
