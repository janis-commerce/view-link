# view-link

[![Build Status](https://travis-ci.org/janis-commerce/view-link.svg?branch=master)](https://travis-ci.org/janis-commerce/view-link)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/view-link/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/view-link?branch=master)

A package for creating JANIS views links

## Installation
```sh
npm install @janiscommerce/view-link
```

## Configuration

#### ENV Variables
This package will obtain the stage name of your MS using the ENV variable **`JANIS_ENV`**

`view-link` uses a settings JSON config file.  
It's located in `/path/to/root/MS_PATH/config/.janiscommercerc.json`  
  
Requires an field `view-link [Object]` with the following items:  
- **hosts `[Object]`**: The hosts by stage

#### Example
```js
{
	'view-link': {
		hosts: {
			local: 'http://localhost:8080',
			beta: 'https://app.janisdev.in',
			qa: 'https://app.janisqa.in',
			prod: 'https://app.janis.in'
		}
	}
}
```


## API

### **`getBrowse(service, entity, params)`**

Generates the JANIS views Browse URL from the specified parameters  
Requires an `service [String]` and `entity [String]`  
Optionally you can add `params [Object]` that will be converted into `query-strings`

#### Example
```js
ViewLink.getBrowse('some-service', 'some-entity',{
	sortBy: 'something'
});

// https://app.janis.in/some-service/some-entity/browse?sortBy=something
```

### **`getEdit(service, entity, entityId, params)`**

Generates the JANIS views Edit URL from the specified parameters  
Requires an `service [String]`, `entity [String]` and `entityId [String]`  
Optionally you can add `params [Object]` that will be converted into `query-strings`

#### Example
```js
ViewLink.getEdit('some-service', 'some-entity', 'some-id',{
	foo: 'bar'
});

// https://app.janis.in/some-service/some-entity/edit/some-id?foo=bar
```

### **`get(entries, params)`**

Generates a custom JANIS views URL from the specified parameters  
Requires `entries [Array]`  
Optionally you can add `params [Object]` that will be converted into `query-strings`

#### Example
```js
ViewLink.getBrowse(['some-service', 'some-entity'],{
	sortBy: 'something'
});

// https://app.janis.in/some-service/some-entity?sortBy=something
```

## Usage
```js
const ViewLink = require('@janiscommerce/view-link');

const myBrowseUrl = ViewLink.getBrowse('some-service', 'some-entity');
// https://app.janis.in/some-service/some-entity/browse

const myEditUrl = ViewLink.getEdit('some-service', 'some-entity', 'some-id');
// https://app.janis.in/some-service/some-entity/edit/some-id

const myCustomUrl = ViewLink.get(['my','custom','view'], {
	sortBy: 'something'
});
// https://app.janis.in/my/custom/view?sortBy=something
```