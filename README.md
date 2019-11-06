# telegram-contest

Base single page application for telegram contest. 

## Virtual DOM

Virtual DOM is a js representation of application nodes tree. Each virtual dom node is a js object for
 `DOMElement` or
string for text node. Each js-dom object has got attributes:
  - `types` - the node type that will be rendered
  - `attributes` - attr object where key is node attribute and value is a value of this attribute
  - `children` - list of children node values
  - `__vnode` - true to indicate that this object is vdom object
  - `_node` - real dom object assigned to current virtual dom node
  
**Valid Virtual DOM objects**

```$js
const stringNode = 'Hello World';

const simpleJsNode = {
  __vnode: true,
  type: 'h1',
  attributes: {
    class: 'red',
    'data-value': 'some-data-value'
  },
  children: [
    "Hello World", // is a valid vdom node
  ],
};

const nestedJsNode = {
  __vnode: true,
  type: 'ul',
  attributes: {
    class: 'nav nav-bar'
  },
  children: [
    {
      __vnode: true,
      type: 'li',
      attributes: {
        class: 'active'
      },
      children: [
        "Item 1"
      ],
    },
    {
      __vnode: true,
      type: 'li',
      children: [
        "Item 2"
      ],
    },
  ]
}
```
  
## API Reference


`utils/vdom/isVNode(object, deep=False)` - checks is passed object is valid virtual dom object or not.
if `deep=True` then validate each children

`utils/vdom/createElement(type, attributes, childrens)` - creates virtual dom object with valid vdom children
