const wot = require('./WoT.js')

myToken = '456fef87re6f4'

let id = 'sunstalker:'+myToken+':heliot'
let heliotWoT = wot.generateWoTObject(
  id,
  'Heliot',
  'Solar panel orienting itslef to always face the sun', 
  undefined,
  undefined,
  {
    'HeliotPosition':
    wot.generators.createProperties(
      true,
      false,
      wot.generators.createDataShema(
        'HeliotPosition',
        wot.const.dataType.array
      ),
      [
        wot.generators.createForm(
          'http://www.sunStalker.tk/objects/'+id+'/position',
          'GET',
          'application/json'
        )
      ]
    ),
    'HeliotPower':
    wot.generators.createProperties(
      true,
      false,
      wot.generators.createDataShema(
        'HeliotPower',
        wot.const.dataType.array
      ),
      [
        wot.generators.createForm(
          'http://www.sunStalker.tk/objects/'+id+'/power',
          'GET',
          'application/json'
        )
      ]
    )
  }, 
  undefined,
  undefined, 
  undefined,
  [
    wot.generators.createSecurityInfos(
      wot.const.security.basic
    )
  ]
)
console.log(heliotWoT)