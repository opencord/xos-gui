# GUI Quickstart

> NOTE: We assume that you already have CORD running. You can refer to the
[Installation Guide](../../README.md) to get started.

### Operating the GUI

For this, please refer to the [Operation Guide](../../operating_cord/gui.md)

##Loading Up GUI Interface
This tutorial below allows users to open and use the GUI Interface of the Cord Project. The guide is split up into three sections, Downloads/Pre-requisites, Tutorial, and Troubleshooting. If you happen to find any other difficulties, please refer to different parts of the guide.

###Pre-requisites
- Duplicate the below code into your own .yaml file. Add it to the cloned helm-charts folder. This yaml file will create two constraints for the service graph on the XOS-GUI service graph. If you are able to see these two constraints on the service graph, your GUI is working correctly. Generally, however, the format used can be found on [R-CORD Configuration](https://guide.opencord.org/profiles/rcord/configuration.html#push-a-subscriber-into-cord).
```
# curl -H "xos-username: admin@opencord.org" -H "xos-password: letmein" -X POST --data-binary @service_graph.yaml http://192.168.99.100:30007/run
tosca_definitions_version: tosca_simple_yaml_1_0
imports:
  - custom_types/service.yaml
  - custom_types/servicedependency.yaml
  - custom_types/servicegraphconstraint.yaml
description: rcord-lite service graph
topology_template:
  node_templates:

    service#foo:
      type: tosca.nodes.Service
      properties:
        name: Foo

    service#bar:
      type: tosca.nodes.Service
      properties:
        name: Bar

    service_dependency#onos-fabric_fabric:
      type: tosca.nodes.ServiceDependency
      properties:
        connect_method: None
      requirements:
        - subscriber_service:
            node: service#foo
            relationship: tosca.relationships.BelongsToOne
        - provider_service:
            node: service#bar
            relationship: tosca.relationships.BelongsToOne

    constraints:
      type: tosca.nodes.ServiceGraphConstraint
      properties:
        constraints: '["foo", "bar"]'
```

###Tutorial
Below are the ten steps that will allow you to open the GUI Interface for the CORD project. Any common errors are noted in the Troubleshooting section below.

1. Delete any existing minikube clusters you may have
```
	minikube delete
```
2. Start a new minikube cluster
```
	minikube start
```
3. Navigate to the helm-charts folder and initialize Tiller.
```
	cd helm-charts
	helm init
```
4. Install XOS-CORE and any needed containers in the helm-charts folder
```
	helm install -n xos-core cord/xos-core
```
5. Verify that the cluster is working normally
```
	kubectl get pods
```
6. Find your minikube cluster's unique IP address. This will be used in the next step.
```
	minikube ip
```
7.  Run the following command and install 2 classes to the Service Graph on the User Interface. Replace the '192.168.99.100' with your unique cluster ip from Step 7.
```
	curl -H "xos-username: admin@opencord.org" -H "xos-password: letmein" -X POST --data-binary @service_graph.yaml http://192.168.99.100:30007/run
```
8. Load up the User Interface domain with the following command.
```
	minikube service xos-gui
```
9. Sign in to the Login page on the User Interface.
	Username: admin@opencord.org
	Password: letmein

If you have completed the above steps correctly, you will be greeted by a service-graph that has two classes 'foo' and 'bar'. If you have not reached this graph, refer to the troubleshooting section below. 

###Troubleshooting
Below are a few common errors you may encounter in the duration of completing this tutorial.

1.
Issue: Step 3 results in the below error message and does not allow you to download the xos-core folder.
```
	Could not find a ready tiller pod
```
Solution: This error will once occur if you haven't initialized Tiller inside the installed helm-charts folder. Re-initialize Tiller and try again.

2. 
Issue: Step 5 returns the below error message and does not allow you to open the service-graph.
```
	No resources found
```
Solution: Make sure you have downloaded the xos-core and containers folder inside the existing helm-charts folder. Re-download the xos-core folder (Step 5) and make sure you are in the helm-charts folder.

3. 
Issue: Step 8 results in the below error message and does not open the User Interface.
```
	Error message: Could not find finalized endpoint
```
Solution: Delete the currently installed helm-charts folder and download it again. Make sure you are navigating everything after Step 4 from the newly installed helm-charts folder.

## Serving the GUI in development mode

To launch a development copy:

```shell
// back to your local system
cd cord/orchestration/xos-gui
npm install
PROXY=<cluster-ip>:30006 npm start
```

It will open your default browser at `localhost:3000`, proxy your API request
to the target environment and watch for file changes.

Now you're ready to start working on it!

To get start, login using the appropriate credentials,
then pick any file and make a change, and you'll see the GUI reload.

## Configuring the `dev` GUI

There are two configuration file available in the application, and they depend
on the environment. You can find the various possibilities in `conf/app`, and
they regard application constants, such as `apiEndpoint`, or branding elements,
such as `projectName`.

To load a different configuration file you can use two environment variables:

* `PROXY`: you can use this variable to send request to an arbitrary XOS
  installation (eg: `192.168.99.100:30006`)

* `BRAND`: to configure style constants (eg: `cord`, `mcord`)
