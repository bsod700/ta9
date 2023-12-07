# Ta9

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Description

All the components, services and interfaces generated through the CLI
I used Angular Material to the table, drawer, inputs, buttons, icons, paginator
I used NgRx to store the table data and to update it, and save user data when a user connect to the app
i split the page to components:

### Application Components
- **Login Box**: Manages user authentication, leveraging NgRx for user name management.
- **Search Box**: Enables efficient data searching and filtering.
- **Data Display**: 
  - **Table View**: Uses Angular Material for a table presentation.
  - **Box View**: An alternate data visualization format.
  - **Paginator**: Integrated for navigating large data sets.
- **Add New Item**: Interactive form for adding new data entries.
- **Color Picker**: User-friendly interface for color selection to the data item.
