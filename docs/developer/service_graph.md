# Configuring the Service Graph

This section describes how to operate on the service graph using the
CORD GUI.

## Adding Information to the Graph

By default, the GUI renders only the `Services` in the service graph, but you can
augment the available information by pressing:

* `Shift + f` toggle fullscreen mode
* `Shift + s` to add `ServiceInstances` to the graph
* `Shift + i` to add `Instances` to the graph (this requires `ServiceInstances`
  to be shown)
* `Shift + n` to add `Networks` to the graph (this require `Instances` to be
  shown)

## Defining the Position of Services in the Graph

XOS defines a model called `ServiceGraphConstraint` that lets you enforce
constraints on the nodes position in the display. The following
describes the basics of how this works.

### Setting the Services on a Line

```json
["a", "b", "c"]
```

will position the nodes as:

```graph
a -> b -> c
```

### Services as a Tree

```json
["a", ["b", "c"]]
```

will position the nodes as:

```graph
   b
  /
 a
  \
   c
```

### Empty Spots in the Graph

```json
[[null, "a"], ["b", "c"]]
```

will position the nodes as:

```graph
      b
      |
 a -> c
```

> **Note:** All the nodes not defined in the `ServiceGraphConstraint` model will
> float around.

## Events Monitored by the Service Graph

* `xos.sg.update` will render the graph again
* `xos.sg.stateChange` will listen for changes in the state machine
