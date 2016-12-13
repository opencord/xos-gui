# XOS GUI

This is the new XOS UI

# Development

This application can be executed on your system as long as you have `NodeJs` version 4 or higher.

To start de development environment use: `npm start`

## Configuration

There are two configuration file available in the application, and they depend on the environment. You can find the various possibilities in `conf/app`, and they regard application constants, such as `apiEndpoint`, or branding elements, such as `projectName`.

To load a different configration file you can use two environment variables:
- `NODE_ENV`: to configure the app constants (eg: `dev`, `production`)
- `BRAND`: to configure style constants (eg: `cord`, `opencloud`)



