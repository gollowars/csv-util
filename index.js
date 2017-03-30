'use strict'
let csvWriteStream = require('csv-write-stream')
let fs = require('fs-extra')
let path = require('path')
let iconv = require('iconv-lite')
let csv2 = require('csv2')
let through2 = require('through2')


module.exports.appendFilePromise = function(file, data, encode){
  return new Promise(function(resolve,reject){
    fs.appendFile(file,data,encode,function(err){
      resolve()
    })
  })
}

module.exports.csvParser = function(path,parser){
  let all = []
  return new Promise(function(resolve,reject){
    fs.createReadStream(path)
    .pipe(csv2())
    .pipe(through2.obj(function(chunk,enc,callback){
      var data = chunk
      this.push(data)
      callback()
    }))
    .on('data',function(data){
      all.push(parser(data))
    })
    .on('end',function(){
      resolve(all)
    })

  })
}

function makeDirWriteStream(dirname,filename){
 let src = dirname
  fs.mkdirsSync(src)
  if(fs.statSync(src).isDirectory() == false){
    fs.mkdirSync(src)
  }
  let fstream = fs.createWriteStream(path.join(src,filename), {flags: 'a'})
  return fstream
}

class CSVWriter {
 constructor(dirname, header){
  if(header){
    this.writer = csvWriteStream({ headers: header})
  }else{
    this.writer = csvWriteStream({sendHeaders: false})
  }
  
  this.dirname = dirname
 }
 setFile(filename){
  this.writer.pipe(makeDirWriteStream(this.dirname,filename))
 }

 write(array){
  this.writer.write(array)
 }
 writeAll(array){
    for (let i = 0; i < array.length; i++) {
      this.write(array[i])
    }
  }

 end(){
  this.writer.end()
 }
}

module.exports.CSVWriter = CSVWriter
