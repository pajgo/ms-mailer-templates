# Templates for Mailer Microservice

Uses foundation ink by zurb for creating basic responsive styles. By default includes the most simple
templates for account activation and password reset.

## Installation

`npm i ms-mailer-templates -S`

## Usage

```js
const render = require('ms-mailer-templates');

const ctx = { link: 'http://localhost', qs: '?token=xxxxx', username: 'Indiana Johns' };
render('activate', ctx,  optionalHandlebarsOpts )
  .then(template => {
    // get rendered template
  });
```

It checks for incorrect context, missing template and so on

## Existing templates

1. `activate`
2. `reset`

## Roadmap

1. Add more tempalates
2. Add localization
