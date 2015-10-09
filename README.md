This loader enables to require Java .properties files to your webpack-driven application. Keys are 
treated as plain strings.

Example:

messages_en.properties

```java
label.landing.title = Hello!
```

Consider this code:

```javascript
var messages = require(./messages_en.properties);
console.log('Title message is "' + messages['label.landing.title'] + '"');
```

It will result with this log message:

```
Title message is "Hello!"
```
