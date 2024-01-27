"use strict";
export const validateAnnouncingJSON = validate10;
const schema11 = {"$id":"AnnouncingJSON","$schema":"http://json-schema.org/draft-07/schema#","type":"object","required":["updated","info","posts"],"properties":{"info":{"type":"object","required":["name"],"properties":{"name":{"type":"string","nullable":false,"minLength":1,"maxLength":50},"desc":{"type":"string","nullable":true,"maxLength":500},"link":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"},"icon":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"}}},"posts":{"type":"array","items":{"type":"object","required":["published"],"properties":{"id":{"type":"string","nullable":false,"minLength":1,"maxLength":50},"published":{"type":"string","format":"date-time","minLength":1,"maxLength":30,"nullable":false},"title":{"type":"string","nullable":true,"maxLength":100},"body":{"type":"string","nullable":true,"maxLength":1000},"img":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"},"imgs":{"type":"array","nullable":true,"maxItems":10,"uniqueItems":true,"items":{"type":"string","nullable":false,"minLength":1,"maxLength":2000,"format":"uri-reference"}},"link":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"}},"anyOf":[{"required":["title"]},{"required":["body"]}]}},"updated":{"type":"string","format":"date-time","minLength":1,"maxLength":30,"nullable":false}}};
const func2 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="AnnouncingJSON" */;
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.updated === undefined) && (missing0 = "updated")) || ((data.info === undefined) && (missing0 = "info"))) || ((data.posts === undefined) && (missing0 = "posts"))){
validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.info !== undefined){
let data0 = data.info;
const _errs1 = errors;
if(errors === _errs1){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing1;
if((data0.name === undefined) && (missing1 = "name")){
validate10.errors = [{instancePath:instancePath+"/info",schemaPath:"#/properties/info/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
if(data0.name !== undefined){
let data1 = data0.name;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 50){
validate10.errors = [{instancePath:instancePath+"/info/name",schemaPath:"#/properties/info/properties/name/maxLength",keyword:"maxLength",params:{limit: 50},message:"must NOT have more than 50 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate10.errors = [{instancePath:instancePath+"/info/name",schemaPath:"#/properties/info/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/info/name",schemaPath:"#/properties/info/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs3 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.desc !== undefined){
let data2 = data0.desc;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
validate10.errors = [{instancePath:instancePath+"/info/desc",schemaPath:"#/properties/info/properties/desc/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs6){
if(typeof data2 === "string"){
if(func2(data2) > 500){
validate10.errors = [{instancePath:instancePath+"/info/desc",schemaPath:"#/properties/info/properties/desc/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"}];
return false;
}
}
}
var valid1 = _errs6 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.link !== undefined){
let data3 = data0.link;
const _errs9 = errors;
if((typeof data3 !== "string") && (data3 !== null)){
validate10.errors = [{instancePath:instancePath+"/info/link",schemaPath:"#/properties/info/properties/link/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs9){
if(errors === _errs9){
if(typeof data3 === "string"){
if(func2(data3) > 2000){
validate10.errors = [{instancePath:instancePath+"/info/link",schemaPath:"#/properties/info/properties/link/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data3))){
validate10.errors = [{instancePath:instancePath+"/info/link",schemaPath:"#/properties/info/properties/link/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.icon !== undefined){
let data4 = data0.icon;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
validate10.errors = [{instancePath:instancePath+"/info/icon",schemaPath:"#/properties/info/properties/icon/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs12){
if(errors === _errs12){
if(typeof data4 === "string"){
if(func2(data4) > 2000){
validate10.errors = [{instancePath:instancePath+"/info/icon",schemaPath:"#/properties/info/properties/icon/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data4))){
validate10.errors = [{instancePath:instancePath+"/info/icon",schemaPath:"#/properties/info/properties/icon/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid1 = _errs12 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/info",schemaPath:"#/properties/info/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.posts !== undefined){
let data5 = data.posts;
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data5)){
var valid2 = true;
const len0 = data5.length;
for(let i0=0; i0<len0; i0++){
let data6 = data5[i0];
const _errs17 = errors;
const _errs19 = errors;
let valid3 = false;
const _errs20 = errors;
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
let missing2;
if((data6.title === undefined) && (missing2 = "title")){
const err0 = {instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/anyOf/0/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs20 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const _errs21 = errors;
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
let missing3;
if((data6.body === undefined) && (missing3 = "body")){
const err1 = {instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/anyOf/1/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs21 === errors;
valid3 = valid3 || _valid0;
}
if(!valid3){
const err2 = {instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
if(errors === _errs17){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
let missing4;
if((data6.published === undefined) && (missing4 = "published")){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];
return false;
}
else {
if(data6.id !== undefined){
let data7 = data6.id;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data7 === "string"){
if(func2(data7) > 50){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/id",schemaPath:"#/properties/posts/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 50},message:"must NOT have more than 50 characters"}];
return false;
}
else {
if(func2(data7) < 1){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/id",schemaPath:"#/properties/posts/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/id",schemaPath:"#/properties/posts/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs22 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.published !== undefined){
let data8 = data6.published;
const _errs25 = errors;
if(errors === _errs25){
if(errors === _errs25){
if(typeof data8 === "string"){
if(func2(data8) > 30){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/published",schemaPath:"#/properties/posts/items/properties/published/maxLength",keyword:"maxLength",params:{limit: 30},message:"must NOT have more than 30 characters"}];
return false;
}
else {
if(func2(data8) < 1){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/published",schemaPath:"#/properties/posts/items/properties/published/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats4.validate(data8))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/published",schemaPath:"#/properties/posts/items/properties/published/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];
return false;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/published",schemaPath:"#/properties/posts/items/properties/published/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid4 = _errs25 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.title !== undefined){
let data9 = data6.title;
const _errs28 = errors;
if((typeof data9 !== "string") && (data9 !== null)){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/title",schemaPath:"#/properties/posts/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs28){
if(typeof data9 === "string"){
if(func2(data9) > 100){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/title",schemaPath:"#/properties/posts/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"}];
return false;
}
}
}
var valid4 = _errs28 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.body !== undefined){
let data10 = data6.body;
const _errs31 = errors;
if((typeof data10 !== "string") && (data10 !== null)){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/body",schemaPath:"#/properties/posts/items/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs31){
if(typeof data10 === "string"){
if(func2(data10) > 1000){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/body",schemaPath:"#/properties/posts/items/properties/body/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"}];
return false;
}
}
}
var valid4 = _errs31 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.img !== undefined){
let data11 = data6.img;
const _errs34 = errors;
if((typeof data11 !== "string") && (data11 !== null)){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/img",schemaPath:"#/properties/posts/items/properties/img/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs34){
if(errors === _errs34){
if(typeof data11 === "string"){
if(func2(data11) > 2000){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/img",schemaPath:"#/properties/posts/items/properties/img/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data11))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/img",schemaPath:"#/properties/posts/items/properties/img/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid4 = _errs34 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.imgs !== undefined){
let data12 = data6.imgs;
const _errs37 = errors;
if((!(Array.isArray(data12))) && (data12 !== null)){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs",schemaPath:"#/properties/posts/items/properties/imgs/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
if(errors === _errs37){
if(Array.isArray(data12)){
if(data12.length > 10){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs",schemaPath:"#/properties/posts/items/properties/imgs/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];
return false;
}
else {
var valid5 = true;
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
let data13 = data12[i1];
const _errs40 = errors;
if(errors === _errs40){
if(errors === _errs40){
if(typeof data13 === "string"){
if(func2(data13) > 2000){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs/" + i1,schemaPath:"#/properties/posts/items/properties/imgs/items/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(func2(data13) < 1){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs/" + i1,schemaPath:"#/properties/posts/items/properties/imgs/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats0.test(data13))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs/" + i1,schemaPath:"#/properties/posts/items/properties/imgs/items/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs/" + i1,schemaPath:"#/properties/posts/items/properties/imgs/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid5 = _errs40 === errors;
if(!valid5){
break;
}
}
if(valid5){
let i2 = data12.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data12[i2];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/imgs",schemaPath:"#/properties/posts/items/properties/imgs/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"}];
return false;
break;
}
indices0[item0] = i2;
}
}
}
}
}
}
var valid4 = _errs37 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.link !== undefined){
let data14 = data6.link;
const _errs43 = errors;
if((typeof data14 !== "string") && (data14 !== null)){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/link",schemaPath:"#/properties/posts/items/properties/link/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs43){
if(errors === _errs43){
if(typeof data14 === "string"){
if(func2(data14) > 2000){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/link",schemaPath:"#/properties/posts/items/properties/link/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data14))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/link",schemaPath:"#/properties/posts/items/properties/link/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid4 = _errs43 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs17 === errors;
if(!valid2){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts",schemaPath:"#/properties/posts/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.updated !== undefined){
let data15 = data.updated;
const _errs46 = errors;
if(errors === _errs46){
if(errors === _errs46){
if(typeof data15 === "string"){
if(func2(data15) > 30){
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/maxLength",keyword:"maxLength",params:{limit: 30},message:"must NOT have more than 30 characters"}];
return false;
}
else {
if(func2(data15) < 1){
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats4.validate(data15))){
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];
return false;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}

export const validateAnnouncingPostsJSON = validate11;
const schema12 = {"$id":"AnnouncingPostsJSON","$schema":"http://json-schema.org/draft-07/schema#","type":"array","items":{"type":"object","required":["published"],"properties":{"id":{"type":"string","nullable":false,"minLength":1,"maxLength":50},"published":{"type":"string","format":"date-time","minLength":1,"maxLength":30,"nullable":false},"title":{"type":"string","nullable":true,"maxLength":100},"body":{"type":"string","nullable":true,"maxLength":1000},"img":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"},"imgs":{"type":"array","nullable":true,"maxItems":10,"uniqueItems":true,"items":{"type":"string","nullable":false,"minLength":1,"maxLength":2000,"format":"uri-reference"}},"link":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"}},"anyOf":[{"required":["title"]},{"required":["body"]}]}};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="AnnouncingPostsJSON" */;
let vErrors = null;
let errors = 0;
if(errors === 0){
if(Array.isArray(data)){
var valid0 = true;
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
const _errs1 = errors;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing0;
if((data0.title === undefined) && (missing0 = "title")){
const err0 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/anyOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs5 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing1;
if((data0.body === undefined) && (missing1 = "body")){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/anyOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate11.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(errors === _errs1){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing2;
if((data0.published === undefined) && (missing2 = "published")){
validate11.errors = [{instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
if(data0.id !== undefined){
let data1 = data0.id;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(func2(data1) > 50){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/id",schemaPath:"#/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 50},message:"must NOT have more than 50 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/id",schemaPath:"#/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/" + i0+"/id",schemaPath:"#/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid2 = _errs6 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.published !== undefined){
let data2 = data0.published;
const _errs9 = errors;
if(errors === _errs9){
if(errors === _errs9){
if(typeof data2 === "string"){
if(func2(data2) > 30){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/maxLength",keyword:"maxLength",params:{limit: 30},message:"must NOT have more than 30 characters"}];
return false;
}
else {
if(func2(data2) < 1){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats4.validate(data2))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];
return false;
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid2 = _errs9 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.title !== undefined){
let data3 = data0.title;
const _errs12 = errors;
if((typeof data3 !== "string") && (data3 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/title",schemaPath:"#/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs12){
if(typeof data3 === "string"){
if(func2(data3) > 100){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/title",schemaPath:"#/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"}];
return false;
}
}
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.body !== undefined){
let data4 = data0.body;
const _errs15 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/body",schemaPath:"#/items/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs15){
if(typeof data4 === "string"){
if(func2(data4) > 1000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/body",schemaPath:"#/items/properties/body/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"}];
return false;
}
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.img !== undefined){
let data5 = data0.img;
const _errs18 = errors;
if((typeof data5 !== "string") && (data5 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs18){
if(errors === _errs18){
if(typeof data5 === "string"){
if(func2(data5) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data5))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.imgs !== undefined){
let data6 = data0.imgs;
const _errs21 = errors;
if((!(Array.isArray(data6))) && (data6 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs",schemaPath:"#/items/properties/imgs/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
if(errors === _errs21){
if(Array.isArray(data6)){
if(data6.length > 10){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs",schemaPath:"#/items/properties/imgs/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];
return false;
}
else {
var valid3 = true;
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
let data7 = data6[i1];
const _errs24 = errors;
if(errors === _errs24){
if(errors === _errs24){
if(typeof data7 === "string"){
if(func2(data7) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(func2(data7) < 1){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats0.test(data7))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid3 = _errs24 === errors;
if(!valid3){
break;
}
}
if(valid3){
let i2 = data6.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data6[i2];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs",schemaPath:"#/items/properties/imgs/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"}];
return false;
break;
}
indices0[item0] = i2;
}
}
}
}
}
}
var valid2 = _errs21 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data0.link !== undefined){
let data8 = data0.link;
const _errs27 = errors;
if((typeof data8 !== "string") && (data8 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs27){
if(errors === _errs27){
if(typeof data8 === "string"){
if(func2(data8) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data8))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid2 = _errs27 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
}
else {
validate11.errors = [{instancePath:instancePath+"/" + i0,schemaPath:"#/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs1 === errors;
if(!valid0){
break;
}
}
}
else {
validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
validate11.errors = vErrors;
return errors === 0;
}
