# XOS GUI

**Experimental Feature**

This UI is currently hidden behind a flag and at the current state it is guaranteed as working only from the `frontend` config.
#### Setup the correct environment:
- Clone `opencord` using `repo` 
```
repo init -u https://gerrit.opencord.org/manifest
repo sync
```
- Download XOS patch to enable Redis notifications (waiting for the release to merge it)
```
cd orchestration/xos
git review -d 1852
```

#### Start the system

A vagrant VM is provided to make your life easier, so:
```
cd orchestration/service-profile/frontend
vagrant up frontend
vagrant ssh frontend # password is vagrant
cd service-profile/frontend
make local_containers
make
make experimental-ui
```
The new UI is now accessible at `http://<your-ip>` on port `80`

If you want to create some slices to have some data:
```
make slices
```


# Development

This application can be executed on your system as long as you have `NodeJs` version 4 or higher.

To start de development environment use: `npm start`

## Configuration

There are two configuration file available in the application, and they depend on the environment. You can find the various possibilities in `conf/app`, and they regard application constants, such as `apiEndpoint`, or branding elements, such as `projectName`.

To load a different configration file you can use two environment variables:
- `NODE_ENV`: to configure the app constants (eg: `dev`, `production`)
- `BRAND`: to configure style constants (eg: `cord`, `opencloud`)

# Test

To commands come with the project:
- `npm run test:auto` to watch source files and run test anytime they change, useful for development
- `npm test` to run test once, this is the command triggered by Jenkins

## Emulate a Synchronizer notification

```
redis-cli -h xos.dev
 
# In progress
PUBLISH Slice "{\"pk\": 19, \"object\": {\"id\": 19,\"name\": \"mysite_test_redis\", \"backend_status\": \"0 - In Progress\"}, \"changed_fields\": [\"updated\", \"backend_status\"]}"
 
# Succes
PUBLISH Slice "{\"pk\": 19, \"object\": {\"id\": 19,\"name\": \"mysite_test_redis\", \"backend_status\": \"1 - Success\"}, \"changed_fields\": [\"updated\", \"backend_status\"]}"
 
# Error
PUBLISH Slice "{\"pk\": 19, \"object\": {\"id\": 19,\"name\": \"mysite_test_redis\", \"backend_status\": \"2 - Error\"}, \"changed_fields\": [\"updated\", \"backend_status\"]}"
```
