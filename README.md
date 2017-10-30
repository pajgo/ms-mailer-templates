# Templates for Mailer Microservice

[![Build Status](https://semaphoreci.com/api/v1/makeomatic/ms-mailer-templates/branches/master/shields_badge.svg)](https://semaphoreci.com/makeomatic/ms-mailer-templates)

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

1. Add more templates
2. Add localization
