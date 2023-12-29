"use strict";
export const AnnouncingJSON = validate10;
const schema11 = {"$id":"AnnouncingJSON","$schema":"http://json-schema.org/draft-07/schema#","type":"object","required":["updated","info","posts"],"properties":{"info":{"type":"object","required":["name"],"properties":{"name":{"type":"string","nullable":false,"minLength":1,"maxLength":50},"desc":{"type":"string","nullable":true,"maxLength":500},"link":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"},"icon":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"}}},"posts":{"type":"array","items":{"type":"object","required":["href","count"],"properties":{"href":{"type":"string","nullable":false,"minLength":1,"maxLength":2000,"format":"uri-reference"},"count":{"type":"number","nullable":false}}}},"updated":{"type":"string","format":"date-time","minLength":1,"maxLength":30,"nullable":false}}};
const func2 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const formats6 = require("ajv-formats/dist/formats").fullFormats["date-time"];

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
if(errors === _errs17){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
let missing2;
if(((data6.href === undefined) && (missing2 = "href")) || ((data6.count === undefined) && (missing2 = "count"))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0,schemaPath:"#/properties/posts/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
if(data6.href !== undefined){
let data7 = data6.href;
const _errs19 = errors;
if(errors === _errs19){
if(errors === _errs19){
if(typeof data7 === "string"){
if(func2(data7) > 2000){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/href",schemaPath:"#/properties/posts/items/properties/href/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(func2(data7) < 1){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/href",schemaPath:"#/properties/posts/items/properties/href/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats0.test(data7))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/href",schemaPath:"#/properties/posts/items/properties/href/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/href",schemaPath:"#/properties/posts/items/properties/href/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid3 = _errs19 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data6.count !== undefined){
let data8 = data6.count;
const _errs22 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate10.errors = [{instancePath:instancePath+"/posts/" + i0+"/count",schemaPath:"#/properties/posts/items/properties/count/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
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
let data9 = data.updated;
const _errs25 = errors;
if(errors === _errs25){
if(errors === _errs25){
if(typeof data9 === "string"){
if(func2(data9) > 30){
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/maxLength",keyword:"maxLength",params:{limit: 30},message:"must NOT have more than 30 characters"}];
return false;
}
else {
if(func2(data9) < 1){
validate10.errors = [{instancePath:instancePath+"/updated",schemaPath:"#/properties/updated/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats6.validate(data9))){
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
var valid0 = _errs25 === errors;
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

export const AnnouncingPostsJSON = validate11;
const schema12 = {"$id":"AnnouncingPostsJSON","$schema":"http://json-schema.org/draft-07/schema#","type":"array","items":{"type":"object","required":["published"],"properties":{"published":{"type":"string","format":"date-time","minLength":1,"maxLength":30,"nullable":false},"title":{"type":"string","nullable":true,"maxLength":100},"body":{"type":"string","nullable":true,"maxLength":1000},"img":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"},"imgs":{"type":"array","nullable":true,"maxItems":10,"uniqueItems":true,"items":{"type":"string","nullable":false,"minLength":1,"maxLength":2000,"format":"uri-reference"}},"link":{"type":"string","nullable":true,"maxLength":2000,"format":"uri-reference"}}}};

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
if(errors === _errs1){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing0;
if((data0.published === undefined) && (missing0 = "published")){
validate11.errors = [{instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data0.published !== undefined){
let data1 = data0.published;
const _errs3 = errors;
if(errors === _errs3){
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 30){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/maxLength",keyword:"maxLength",params:{limit: 30},message:"must NOT have more than 30 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/published",schemaPath:"#/items/properties/published/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats6.validate(data1))){
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
var valid1 = _errs3 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.title !== undefined){
let data2 = data0.title;
const _errs6 = errors;
if((typeof data2 !== "string") && (data2 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/title",schemaPath:"#/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs6){
if(typeof data2 === "string"){
if(func2(data2) > 100){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/title",schemaPath:"#/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"}];
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
if(data0.body !== undefined){
let data3 = data0.body;
const _errs9 = errors;
if((typeof data3 !== "string") && (data3 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/body",schemaPath:"#/items/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs9){
if(typeof data3 === "string"){
if(func2(data3) > 1000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/body",schemaPath:"#/items/properties/body/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"}];
return false;
}
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.img !== undefined){
let data4 = data0.img;
const _errs12 = errors;
if((typeof data4 !== "string") && (data4 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs12){
if(errors === _errs12){
if(typeof data4 === "string"){
if(func2(data4) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data4))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/img",schemaPath:"#/items/properties/img/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
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
if(valid1){
if(data0.imgs !== undefined){
let data5 = data0.imgs;
const _errs15 = errors;
if((!(Array.isArray(data5))) && (data5 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs",schemaPath:"#/items/properties/imgs/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
if(errors === _errs15){
if(Array.isArray(data5)){
if(data5.length > 10){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs",schemaPath:"#/items/properties/imgs/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];
return false;
}
else {
var valid2 = true;
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
const _errs18 = errors;
if(errors === _errs18){
if(errors === _errs18){
if(typeof data6 === "string"){
if(func2(data6) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(func2(data6) < 1){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/imgs/" + i1,schemaPath:"#/items/properties/imgs/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!(formats0.test(data6))){
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
var valid2 = _errs18 === errors;
if(!valid2){
break;
}
}
if(valid2){
let i2 = data5.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data5[i2];
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
var valid1 = _errs15 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.link !== undefined){
let data7 = data0.link;
const _errs21 = errors;
if((typeof data7 !== "string") && (data7 !== null)){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(errors === _errs21){
if(errors === _errs21){
if(typeof data7 === "string"){
if(func2(data7) > 2000){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];
return false;
}
else {
if(!(formats0.test(data7))){
validate11.errors = [{instancePath:instancePath+"/" + i0+"/link",schemaPath:"#/items/properties/link/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
}
}
}
var valid1 = _errs21 === errors;
}
else {
var valid1 = true;
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
