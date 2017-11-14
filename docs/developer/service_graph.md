# How to operate on the Service Graph

The service graph enable some features to simplify operators daily tasks, 
here is a quick guide on how to use those fetaures.

## Adding informations to the graph

The Service Graph will render by default only the `Services`, but you can augment 
the available information by pressing:

- `Shift + f` toggle fullscreen mode
- `Shift + s` to add `ServiceInstances` to the graph

## Define the position of the Services in the graph

XOS define a model called `ServiceGraphConstraint`, 
that let you enforce constraints on the nodes position.

Here is a basic of how it works:

#### Setting the services on a line

```json
["a", "b", "c"]
```
will position the nodes as:
```
a -> b -> c
```

#### Services as a tree

```json
["a", ["b", "c"]]
```
will position the nodes as:

```
   b
  /
 a 
  \
   c
```

#### Empty spots in the graph
```json
[[null, "a"], ["b", "c"]]
```
will position the nodes as:

```
      b
      | 
 a -> c
```

_Note that all the notes not defined in the `ServiceGraphConstraint` model will float around_

## Events listened by the Service Graph

- `xos.sg.update` will render the graph again