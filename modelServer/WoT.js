exports.generateWoTObject = function(
  id, name, description, 
  support, base, properties, 
  actions, events, 
  links, securities) {

  let obj = {id:id,name:name}

  if(description != undefined)
    obj.description = description
  if(support != undefined)
    obj.support = support
  if(base != undefined)
    obj.base = base
  if(properties != undefined)
    obj.properties = properties
  if(actions != undefined)
    obj.actions = actions
  if(events != undefined)
    obj.events = events
  if(links != undefined)
    obj.links = links
  if(securities != undefined)
    obj.securities = securities

  return obj

}

// --------------------------------------------------------------
// ---------------------------------------------------- CONST ---

exports.const = {}

// ---- SECURITY SCHEMES
exports.const.security = {}
exports.const.security.nosec = 'nosec'
exports.const.security.basic = 'basic'
exports.const.security.cert = 'cert'
exports.const.security.digest = 'digest'
exports.const.security.bearer = 'bearer'
exports.const.security.pop = 'pop'
exports.const.security.psk = 'psk'
exports.const.security.public = 'public'
exports.const.security.oauth2 = 'oauth2'
exports.const.security.apikey = 'apikey'

// ---- DATA TYPES
exports.const.dataType = {}
exports.const.dataType.boolean = 'boolean'
exports.const.dataType.integer = 'integer'
exports.const.dataType.number = 'number'
exports.const.dataType.string = 'string'
exports.const.dataType.object = 'object'
exports.const.dataType.array = 'array'
exports.const.dataType.null = 'null'

// ---- REL TYPES
exports.const.rel = {}
exports.const.rel.readproperty = 'readproperty'
exports.const.rel.writeproperty = 'writeproperty'
exports.const.rel.observeproperty = 'observeproperty'
exports.const.rel.invokeaction = 'invokeaction'
exports.const.rel.subscribeevent = 'subscribeevent'
exports.const.rel.unsubscribeevent = 'unsubscribeevent'

// --------------------------------------------------------------
// ----------------------------------------------- GENERATORS ---

exports.generators = {}

exports.generators.createSecurityInfos = function(scheme, description, proxyUrl) {
  let obj = {scheme:scheme}

  if(description != undefined)
    obj.description = description
  if(description != undefined)
    obj.proxyUrl = proxyUrl

  return obj
}

exports.generators.createDataShema = function(description, type, constant, enume){
  return {description:description, type:type, const:constant, enum:enume}
}

exports.generators.createOneAction = function(input, output) {
  let obj = {}
  if(input != undefined)
    obj.input = input
  if(output != undefined)
    obj.output = output
  return obj
}

exports.generators.createProperties = function(observable,writable,type,forms) {
  let obj = {observable:observable, writable:writable}

  if(type != undefined)
    obj.type = type
  if(forms != undefined)
    obj.forms = forms
  return obj

}

exports.generators.createForm = function(
  href, httpmethod, mediaType, rel, subProtocol, securities, scopes) {

  let obj = {href:href}
  if(mediaType != undefined)
    obj.mediaType = mediaType
  if(httpmethod != undefined)
    obj.httpmethod = httpmethod
  if(rel != undefined)
    obj.rel = rel
  if(subProtocol != undefined)
    obj.subProtocol = subProtocol
  if(securities != undefined)
    obj.securities = securities
  if(scopes != undefined)
    obj.scopes = scopes

  return obj

}