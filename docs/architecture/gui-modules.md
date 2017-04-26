# GUI Modules

The application is divided into Modules, each one responsible for a different topic, here is a short list of the modules and their area of focus:


| Module | Topic |
|--------|-------|
| Template | Manage all the features related to the visualization of the template|
| Views | Holds core custom views and the template for the auto-generated CRUD views for models |
| Core | Formerly called xosNgLib, contains a set of UI components to render table, forms, ... |
| [DataSources](./data-sources.md) | Is the actual glue between the UI and the data model. It use a combination of REST API and Websocket to return data as Observables. |
| Extender | It is responsible to extend the application with custom extension provided by services |
| Service Graph | It's job is to read the service definition from the backend and represent it in a visual form, both at system and subscriber level |