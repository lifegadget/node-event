# node-event
> an event logger for NodeJS applications which works with the npm `serverless-event` microservice architecture

## Installation

```sh
npm install event-manager
```

## Usage

```js
const event = new EventManager(tagId, ['lambda', 'demo']);
// alternatively add or adjust tags later with
event.tags = ['lambda', 'demo', 'super-wow'];

// Log events
event.info('hello world', {
  transaction: tid
});
event.warn('it is getting cold');
event.error('this aint working'); // specify a message (and optionally a hash)
event.error(err); // just pass in an error object

// Measure Performance (with type/subtype identifiers)
const p1 = event.performance('shopping', 'checkout');
p1.start();
// ...
p1.stop();

// Add user context
event.userLogin(uid, {
  // add any user properties you want included 
  // note: they'll be encoded for sensitivity concerns
  foo: 'bar',
  etc: 'whatever user props you like'
});

// Have more context that you'd like to go out with all events?
event.context = {
  transaction: tid,
  foo: 'bar',
};
```

## Configuration



