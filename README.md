# csv-util

## usage 
```
let path = require('path')
let csvUtil = require('./csv-util')
let CSVWriter = csvUtil.CSVWriter
let csvParser = csvUtil.csvParser


// parser csv
let csvData = csvParser('sample.csv',function(row){
  let newRow = row.map(function(value,index){
    return value+index
  })
  return newRow
})
.then(function(csvData){
  console.log(csvData)

  // write csv
  let dir = path.join(__dirname,'output')
  // header
  let headerWriter = new CSVWriter(dir,['0','1','2'])
  headerWriter.setFile('header.csv')
  headerWriter.writeAll(csvData)
  headerWriter.end()

  // none header
  let noneHeaderWriter = new CSVWriter(dir,false)
  noneHeaderWriter.setFile('noneHeader.csv')
  for(let i = 0;i<csvData.length;i++){
    noneHeaderWriter.write({
      zero: csvData[i][0],
      one: csvData[i][1],
      two: csvData[i][2]
    })
  }
  noneHeaderWriter.end()
})
```