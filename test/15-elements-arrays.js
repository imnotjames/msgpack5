
var test    = require('tape').test
  , msgpack = require('../')

function build(size, obj) {
  var array = []
    , i

  for(i = 0; i < size; i++) {
    array.push(obj)
  }

  return array
}

function computeLength(array) {
  var length = 1 // the header
    , multi  = 1

  if (array[0] && typeof array[0] === 'string') {
    multi += array[0].length
  }

  length += array.length * multi

  return length
}

test('encode/decode arrays up to 15 elements', function(t) {

  var encoder = msgpack()
    , all     = []
    , i

  for(i = 0; i < 16; i++) {
    all.push(build(i, 42))
  }


  for(i = 0; i < 16; i++) {
    all.push(build(i, 'aaa'))
  }

  all.forEach(function(array) {
    t.test('encoding an array with ' + array.length + ' elements of ' + array[0], function(t) {
      var buf = encoder.encode(array)
      // the array is full of 1-byte integers
      t.equal(buf.length, computeLength(array), 'must have the right length');
      t.equal(buf.readUInt8(0) & 0xf0, 0x90, 'must have the proper header');
      t.equal(buf.readUInt8(0) & 0x0f, array.length, 'must include the array length');
      t.end()
    })

    t.test('mirror test for an array of length ' + array.length + ' with ' + array[0], function(t) {
      t.deepEqual(encoder.decode(encoder.encode(array)), array, 'must stay the same');
      t.end()
    })
  })

  t.end()

})
