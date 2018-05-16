'use strict'

var test = require('tape').test
var msgpack = require('../')

test('decoding a native Map object', function (t) {
  var map = new Map([
    [ 'hello', 'world' ]
  ])

  var expected = { hello: 'world' }

  var pack = msgpack()

  t.deepEqual(pack.decode(pack.encode(map)), expected)
  t.end()
})

test('decoding a native Map object with Map objects inside it', function (t) {
  var map = new Map([
    [ 'hello', 'world' ],
    [ 'foo', new Map([[ 'bar', 'baz' ]]) ]
  ])

  var expected = { 'hello': 'world', 'foo': { 'bar': 'baz' } }

  var pack = msgpack()

  t.deepEqual(pack.decode(pack.encode(map)), expected)
  t.end()
})

// The decoding done in this test is not exactly correct..
// The key is decoded as a `string` rather than a `number`, but
// the test has been added to preserve consistency.
test('decoding a native Map object with a numeric key', function (t) {
  var map = new Map([
    [ 1, 'world' ]
  ])

  var obj = { '1': 'world' }

  var pack = msgpack()

  t.deepEqual(pack.decode(pack.encode(map)), obj)
  t.end()
})

// The decoding done in this next test is DEFINITELY not correct!
// The two keys are encoded as two different things but are decoded
// as one key, causing an overwrite.
// Again, this test has been added to preserve consistency!
test('decoding a native Map object with a numeric key and a string number representation', function (t) {
  var map = new Map([
    [ 1, 'world' ],
    [ '1', 'hello' ]
  ])

  var obj = { '1': 'hello' }

  var pack = msgpack()

  t.notEqual(pack.encode(map), pack.encode(obj))
  t.deepEqual(pack.decode(pack.encode(map)), obj)
  t.end()
})
