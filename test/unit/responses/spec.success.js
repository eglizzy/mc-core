'use strict'

let test = require('tape')
let MockResponse = require('mock-express-response')
let success = require('../../../src/api/utils/responses/success')

test('http 200 response utility', (t) => {
  // Assign
  let response = new MockResponse()
  let data = {test: 'test'}

  // Act
  success.call(response, data)

  // Assert
  t.ok(response.statusCode === 200, 'Responds with 200')
  t.ok(JSON.stringify(response._getJSON().data) === JSON.stringify(data), 'Returned data with response')
  t.end()
})
