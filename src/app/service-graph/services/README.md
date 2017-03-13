# Service Graph extender example

```
XosServiceGraphExtender.register('coarse', 'test', (graph: IXosServiceGraph) => {
  graph.nodes = graph.nodes.map(n => {
    // do my changes
    n.label = `reduced_${n.label}`;
    return n;
  });

  graph.links = graph.links.map(l => {
    // do my changes
    return l;
  });
  return graph;
});
```

Note that if you add classes you'll need to provide CSS for that

## What can you change:

### Nodes:

You can change any of the property that are present in the `node` element, plus:

property | type | effect
-------- | ---- | -----: 
d3Class  | space separated string |the class names get prefixed with `ext-`
x | number | horizontal position
y | number | vertical position

### Links:

property | type | effect
-------- | ---- | -----: 
d3Class  | space separated string |the class names get prefixed with `ext-`
