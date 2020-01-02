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

## Component

*Component* is a function that returns virtual dom object

*BaseComponent* is a component that takes whole state of application

## MTProto

*MTproto* is a protocol that uses by Telegram for communication between clients and telegram servers;

### Binary serialization 

Instead of common text serialization that used by most of HTTP-base APIs Telegram uses its own
binary serialization by schema https://core.telegram.org/schema

`utils/mtproto/tl.dumps()` - dumps js object into ArrayBuffer by Telegrams binary serialization scheme

`utils/mtproto/tl.loads()` - loads js object from ArrayBuffer by Telegrams binary serialization schema

## API Reference


`utils/vdom/isVNode(object, deep=False)` - checks is passed object is valid virtual dom object or not.
if `deep=True` then validate each children

`utils/vdom/createElement(type, attributes, childrens)` - creates virtual dom object with valid vdom children

`utils/vdom/render(parentNode, vNode)` - renders vNode to parrent node

`utils/vdom/isVNodesEqual(aVNode, bVNode)` - compares to vNodes they are equal with same attrs and same types

`utils/vdom/isVNodesSame(aVNode, bVNode)` - vNodes are the same if they have same type and same id or haven`t got it

`utils/vdom/mount(root$, baseComponent, initialState)`  - renders base component and state to root element and returns function
that could update vNodes with new state value. 

