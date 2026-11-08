import{a as Yp}from"./chunk-CQ2LZ75G.js";import{a as HS}from"./chunk-RMRBEYTI.js";var VS=HS((Bs,Mh)=>{(function(Ha,Er){typeof Bs=="object"&&typeof Mh=="object"?Mh.exports=Er(Yp()):typeof define=="function"&&define.amd?define(["echarts"],Er):typeof Bs=="object"?Bs["echarts-gl"]=Er(Yp()):Ha["echarts-gl"]=Er(Ha.echarts)})(self,function(Dh){return(()=>{"use strict";var Ha={"./src/export/all.js":((jt,Cn,ka)=>{ka.r(Cn);var A=ka("echarts/lib/echarts");function Ch(e,t,r){typeof t=="object"&&(r=t,t=null);var i=this,n;if(!(e instanceof Function)){n=[];for(var a in e)e.hasOwnProperty(a)&&n.push(a)}var o=function(l){if(i.apply(this,arguments),e instanceof Function?Lh(this,e.call(this,l)):Kp(this,e,n),this.constructor===o)for(var u=o.__initializers__,h=0;h<u.length;h++)u[h].apply(this,arguments)};o.__super__=i,i.__initializers__?o.__initializers__=i.__initializers__.slice():o.__initializers__=[],t&&o.__initializers__.push(t);var s=function(){};return s.prototype=i.prototype,o.prototype=new s,o.prototype.constructor=o,Lh(o.prototype,r),o.extend=i.extend,o.derive=i.extend,o}function Lh(e,t){if(t)for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}function Kp(e,t,r){for(var i=0;i<r.length;i++){var n=r[i];e[n]=t[n]}}let Qp={extend:Ch,derive:Ch};function Jp(e,t){this.action=e,this.context=t}var $p={trigger:function(e){if(this.hasOwnProperty("__handlers__")&&this.__handlers__.hasOwnProperty(e)){var t=this.__handlers__[e],r=t.length,i=-1,n=arguments;switch(n.length){case 1:for(;++i<r;)t[i].action.call(t[i].context);return;case 2:for(;++i<r;)t[i].action.call(t[i].context,n[1]);return;case 3:for(;++i<r;)t[i].action.call(t[i].context,n[1],n[2]);return;case 4:for(;++i<r;)t[i].action.call(t[i].context,n[1],n[2],n[3]);return;case 5:for(;++i<r;)t[i].action.call(t[i].context,n[1],n[2],n[3],n[4]);return;default:for(;++i<r;)t[i].action.apply(t[i].context,Array.prototype.slice.call(n,1));return}}},on:function(e,t,r){if(!(!e||!t)){var i=this.__handlers__||(this.__handlers__={});if(!i[e])i[e]=[];else if(this.has(e,t))return;var n=new Jp(t,r||this);return i[e].push(n),this}},once:function(e,t,r){if(!e||!t)return;var i=this;function n(){i.off(e,n),t.apply(this,arguments)}return this.on(e,n,r)},before:function(e,t,r){if(!(!e||!t))return e="before"+e,this.on(e,t,r)},after:function(e,t,r){if(!(!e||!t))return e="after"+e,this.on(e,t,r)},success:function(e,t){return this.once("success",e,t)},error:function(e,t){return this.once("error",e,t)},off:function(e,t){var r=this.__handlers__||(this.__handlers__={});if(!t){r[e]=[];return}if(r[e]){for(var i=r[e],n=[],a=0;a<i.length;a++)t&&i[a].action!==t&&n.push(i[a]);r[e]=n}return this},has:function(e,t){var r=this.__handlers__;if(!r||!r[e])return!1;for(var i=r[e],n=0;n<i.length;n++)if(i[n].action===t)return!0}};let Fs=$p;var e_=0,t_=Array.prototype,r_=t_.forEach,Ln={genGUID:function(){return++e_},relative2absolute:function(e,t){if(!t||e.match(/^\//))return e;for(var r=e.split("/"),i=t.split("/"),n=r[0];n==="."||n==="..";)n===".."&&i.pop(),r.shift(),n=r[0];return i.join("/")+"/"+r.join("/")},extend:function(e,t){if(t)for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e},defaults:function(e,t){if(t)for(var r in t)e[r]===void 0&&(e[r]=t[r]);return e},extendWithPropList:function(e,t,r){if(t)for(var i=0;i<r.length;i++){var n=r[i];e[n]=t[n]}return e},defaultsWithPropList:function(e,t,r){if(t)for(var i=0;i<r.length;i++){var n=r[i];e[n]==null&&(e[n]=t[n])}return e},each:function(e,t,r){if(e&&t)if(e.forEach&&e.forEach===r_)e.forEach(t,r);else if(e.length===+e.length)for(var i=0,n=e.length;i<n;i++)t.call(r,e[i],i,e);else for(var a in e)e.hasOwnProperty(a)&&t.call(r,e[a],a,e)},isObject:function(e){return e===Object(e)},isArray:function(e){return Array.isArray(e)},isArrayLike:function(e){return e?e.length===+e.length:!1},clone:function(e){if(Ln.isObject(e)){if(Ln.isArray(e))return e.slice();if(Ln.isArrayLike(e)){for(var t=new e.constructor(e.length),r=0;r<e.length;r++)t[r]=e[r];return t}else return Ln.extend({},e)}else return e}};let tt=Ln;var Wa=function(){this.__uid__=tt.genGUID()};Wa.__initializers__=[function(e){tt.extend(this,e)}],tt.extend(Wa,Qp),tt.extend(Wa.prototype,Fs);let vt=Wa;var Xa=1e-6,rt=Array,Fi=Math.random,Z={};Z.create=function(){var e=new rt(3);return e[0]=0,e[1]=0,e[2]=0,e},Z.clone=function(e){var t=new rt(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},Z.fromValues=function(e,t,r){var i=new rt(3);return i[0]=e,i[1]=t,i[2]=r,i},Z.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},Z.set=function(e,t,r,i){return e[0]=t,e[1]=r,e[2]=i,e},Z.add=function(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e},Z.subtract=function(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e},Z.sub=Z.subtract,Z.multiply=function(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e},Z.mul=Z.multiply,Z.divide=function(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e},Z.div=Z.divide,Z.min=function(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e},Z.max=function(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e},Z.scale=function(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e},Z.scaleAndAdd=function(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e},Z.distance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2];return Math.sqrt(r*r+i*i+n*n)},Z.dist=Z.distance,Z.squaredDistance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2];return r*r+i*i+n*n},Z.sqrDist=Z.squaredDistance,Z.length=function(e){var t=e[0],r=e[1],i=e[2];return Math.sqrt(t*t+r*r+i*i)},Z.len=Z.length,Z.squaredLength=function(e){var t=e[0],r=e[1],i=e[2];return t*t+r*r+i*i},Z.sqrLen=Z.squaredLength,Z.negate=function(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e},Z.inverse=function(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e},Z.normalize=function(e,t){var r=t[0],i=t[1],n=t[2],a=r*r+i*i+n*n;return a>0&&(a=1/Math.sqrt(a),e[0]=t[0]*a,e[1]=t[1]*a,e[2]=t[2]*a),e},Z.dot=function(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]},Z.cross=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=r[0],s=r[1],l=r[2];return e[0]=n*l-a*s,e[1]=a*o-i*l,e[2]=i*s-n*o,e},Z.lerp=function(e,t,r,i){var n=t[0],a=t[1],o=t[2];return e[0]=n+i*(r[0]-n),e[1]=a+i*(r[1]-a),e[2]=o+i*(r[2]-o),e},Z.random=function(e,t){t=t||1;var r=Fi()*2*Math.PI,i=Fi()*2-1,n=Math.sqrt(1-i*i)*t;return e[0]=Math.cos(r)*n,e[1]=Math.sin(r)*n,e[2]=i*t,e},Z.transformMat4=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=r[3]*i+r[7]*n+r[11]*a+r[15];return o=o||1,e[0]=(r[0]*i+r[4]*n+r[8]*a+r[12])/o,e[1]=(r[1]*i+r[5]*n+r[9]*a+r[13])/o,e[2]=(r[2]*i+r[6]*n+r[10]*a+r[14])/o,e},Z.transformMat3=function(e,t,r){var i=t[0],n=t[1],a=t[2];return e[0]=i*r[0]+n*r[3]+a*r[6],e[1]=i*r[1]+n*r[4]+a*r[7],e[2]=i*r[2]+n*r[5]+a*r[8],e},Z.transformQuat=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=r[0],s=r[1],l=r[2],u=r[3],h=u*i+s*a-l*n,f=u*n+l*i-o*a,c=u*a+o*n-s*i,d=-o*i-s*n-l*a;return e[0]=h*u+d*-o+f*-l-c*-s,e[1]=f*u+d*-s+c*-o-h*-l,e[2]=c*u+d*-l+h*-s-f*-o,e},Z.rotateX=function(e,t,r,i){var n=[],a=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],a[0]=n[0],a[1]=n[1]*Math.cos(i)-n[2]*Math.sin(i),a[2]=n[1]*Math.sin(i)+n[2]*Math.cos(i),e[0]=a[0]+r[0],e[1]=a[1]+r[1],e[2]=a[2]+r[2],e},Z.rotateY=function(e,t,r,i){var n=[],a=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],a[0]=n[2]*Math.sin(i)+n[0]*Math.cos(i),a[1]=n[1],a[2]=n[2]*Math.cos(i)-n[0]*Math.sin(i),e[0]=a[0]+r[0],e[1]=a[1]+r[1],e[2]=a[2]+r[2],e},Z.rotateZ=function(e,t,r,i){var n=[],a=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],a[0]=n[0]*Math.cos(i)-n[1]*Math.sin(i),a[1]=n[0]*Math.sin(i)+n[1]*Math.cos(i),a[2]=n[2],e[0]=a[0]+r[0],e[1]=a[1]+r[1],e[2]=a[2]+r[2],e},Z.forEach=(function(){var e=Z.create();return function(t,r,i,n,a,o){var s,l;for(r||(r=3),i||(i=0),n?l=Math.min(n*r+i,t.length):l=t.length,s=i;s<l;s+=r)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})(),Z.angle=function(e,t){var r=Z.fromValues(e[0],e[1],e[2]),i=Z.fromValues(t[0],t[1],t[2]);Z.normalize(r,r),Z.normalize(i,i);var n=Z.dot(r,i);return n>1?0:Math.acos(n)};let C=Z;var Y=function(e,t,r){e=e||0,t=t||0,r=r||0,this.array=C.fromValues(e,t,r),this._dirty=!0};Y.prototype={constructor:Y,add:function(e){return C.add(this.array,this.array,e.array),this._dirty=!0,this},set:function(e,t,r){return this.array[0]=e,this.array[1]=t,this.array[2]=r,this._dirty=!0,this},setArray:function(e){return this.array[0]=e[0],this.array[1]=e[1],this.array[2]=e[2],this._dirty=!0,this},clone:function(){return new Y(this.x,this.y,this.z)},copy:function(e){return C.copy(this.array,e.array),this._dirty=!0,this},cross:function(e,t){return C.cross(this.array,e.array,t.array),this._dirty=!0,this},dist:function(e){return C.dist(this.array,e.array)},distance:function(e){return C.distance(this.array,e.array)},div:function(e){return C.div(this.array,this.array,e.array),this._dirty=!0,this},divide:function(e){return C.divide(this.array,this.array,e.array),this._dirty=!0,this},dot:function(e){return C.dot(this.array,e.array)},len:function(){return C.len(this.array)},length:function(){return C.length(this.array)},lerp:function(e,t,r){return C.lerp(this.array,e.array,t.array,r),this._dirty=!0,this},min:function(e){return C.min(this.array,this.array,e.array),this._dirty=!0,this},max:function(e){return C.max(this.array,this.array,e.array),this._dirty=!0,this},mul:function(e){return C.mul(this.array,this.array,e.array),this._dirty=!0,this},multiply:function(e){return C.multiply(this.array,this.array,e.array),this._dirty=!0,this},negate:function(){return C.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return C.normalize(this.array,this.array),this._dirty=!0,this},random:function(e){return C.random(this.array,e),this._dirty=!0,this},scale:function(e){return C.scale(this.array,this.array,e),this._dirty=!0,this},scaleAndAdd:function(e,t){return C.scaleAndAdd(this.array,this.array,e.array,t),this._dirty=!0,this},sqrDist:function(e){return C.sqrDist(this.array,e.array)},squaredDistance:function(e){return C.squaredDistance(this.array,e.array)},sqrLen:function(){return C.sqrLen(this.array)},squaredLength:function(){return C.squaredLength(this.array)},sub:function(e){return C.sub(this.array,this.array,e.array),this._dirty=!0,this},subtract:function(e){return C.subtract(this.array,this.array,e.array),this._dirty=!0,this},transformMat3:function(e){return C.transformMat3(this.array,this.array,e.array),this._dirty=!0,this},transformMat4:function(e){return C.transformMat4(this.array,this.array,e.array),this._dirty=!0,this},transformQuat:function(e){return C.transformQuat(this.array,this.array,e.array),this._dirty=!0,this},applyProjection:function(e){var t=this.array;if(e=e.array,e[15]===0){var r=-1/t[2];t[0]=e[0]*t[0]*r,t[1]=e[5]*t[1]*r,t[2]=(e[10]*t[2]+e[14])*r}else t[0]=e[0]*t[0]+e[12],t[1]=e[5]*t[1]+e[13],t[2]=e[10]*t[2]+e[14];return this._dirty=!0,this},eulerFromQuat:function(e,t){Y.eulerFromQuat(this,e,t)},eulerFromMat3:function(e,t){Y.eulerFromMat3(this,e,t)},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var ja=Object.defineProperty;if(ja){var Gs=Y.prototype;ja(Gs,"x",{get:function(){return this.array[0]},set:function(e){this.array[0]=e,this._dirty=!0}}),ja(Gs,"y",{get:function(){return this.array[1]},set:function(e){this.array[1]=e,this._dirty=!0}}),ja(Gs,"z",{get:function(){return this.array[2]},set:function(e){this.array[2]=e,this._dirty=!0}})}Y.add=function(e,t,r){return C.add(e.array,t.array,r.array),e._dirty=!0,e},Y.set=function(e,t,r,i){C.set(e.array,t,r,i),e._dirty=!0},Y.copy=function(e,t){return C.copy(e.array,t.array),e._dirty=!0,e},Y.cross=function(e,t,r){return C.cross(e.array,t.array,r.array),e._dirty=!0,e},Y.dist=function(e,t){return C.distance(e.array,t.array)},Y.distance=Y.dist,Y.div=function(e,t,r){return C.divide(e.array,t.array,r.array),e._dirty=!0,e},Y.divide=Y.div,Y.dot=function(e,t){return C.dot(e.array,t.array)},Y.len=function(e){return C.length(e.array)},Y.lerp=function(e,t,r,i){return C.lerp(e.array,t.array,r.array,i),e._dirty=!0,e},Y.min=function(e,t,r){return C.min(e.array,t.array,r.array),e._dirty=!0,e},Y.max=function(e,t,r){return C.max(e.array,t.array,r.array),e._dirty=!0,e},Y.mul=function(e,t,r){return C.multiply(e.array,t.array,r.array),e._dirty=!0,e},Y.multiply=Y.mul,Y.negate=function(e,t){return C.negate(e.array,t.array),e._dirty=!0,e},Y.normalize=function(e,t){return C.normalize(e.array,t.array),e._dirty=!0,e},Y.random=function(e,t){return C.random(e.array,t),e._dirty=!0,e},Y.scale=function(e,t,r){return C.scale(e.array,t.array,r),e._dirty=!0,e},Y.scaleAndAdd=function(e,t,r,i){return C.scaleAndAdd(e.array,t.array,r.array,i),e._dirty=!0,e},Y.sqrDist=function(e,t){return C.sqrDist(e.array,t.array)},Y.squaredDistance=Y.sqrDist,Y.sqrLen=function(e){return C.sqrLen(e.array)},Y.squaredLength=Y.sqrLen,Y.sub=function(e,t,r){return C.subtract(e.array,t.array,r.array),e._dirty=!0,e},Y.subtract=Y.sub,Y.transformMat3=function(e,t,r){return C.transformMat3(e.array,t.array,r.array),e._dirty=!0,e},Y.transformMat4=function(e,t,r){return C.transformMat4(e.array,t.array,r.array),e._dirty=!0,e},Y.transformQuat=function(e,t,r){return C.transformQuat(e.array,t.array,r.array),e._dirty=!0,e};function Bt(e,t,r){return e<t?t:e>r?r:e}var _e=Math.atan2,Ft=Math.asin,Gi=Math.abs;Y.eulerFromQuat=function(e,t,c){e._dirty=!0,t=t.array;var i=e.array,n=t[0],a=t[1],o=t[2],s=t[3],l=n*n,u=a*a,h=o*o,f=s*s,c=(c||"XYZ").toUpperCase();switch(c){case"XYZ":i[0]=_e(2*(n*s-a*o),f-l-u+h),i[1]=Ft(Bt(2*(n*o+a*s),-1,1)),i[2]=_e(2*(o*s-n*a),f+l-u-h);break;case"YXZ":i[0]=Ft(Bt(2*(n*s-a*o),-1,1)),i[1]=_e(2*(n*o+a*s),f-l-u+h),i[2]=_e(2*(n*a+o*s),f-l+u-h);break;case"ZXY":i[0]=Ft(Bt(2*(n*s+a*o),-1,1)),i[1]=_e(2*(a*s-o*n),f-l-u+h),i[2]=_e(2*(o*s-n*a),f-l+u-h);break;case"ZYX":i[0]=_e(2*(n*s+o*a),f-l-u+h),i[1]=Ft(Bt(2*(a*s-n*o),-1,1)),i[2]=_e(2*(n*a+o*s),f+l-u-h);break;case"YZX":i[0]=_e(2*(n*s-o*a),f-l+u-h),i[1]=_e(2*(a*s-n*o),f+l-u-h),i[2]=Ft(Bt(2*(n*a+o*s),-1,1));break;case"XZY":i[0]=_e(2*(n*s+a*o),f-l+u-h),i[1]=_e(2*(n*o+a*s),f+l-u-h),i[2]=Ft(Bt(2*(o*s-n*a),-1,1));break;default:console.warn("Unkown order: "+c)}return e},Y.eulerFromMat3=function(e,t,v){var i=t.array,n=i[0],a=i[3],o=i[6],s=i[1],l=i[4],u=i[7],h=i[2],f=i[5],c=i[8],d=e.array,v=(v||"XYZ").toUpperCase();switch(v){case"XYZ":d[1]=Ft(Bt(o,-1,1)),Gi(o)<.99999?(d[0]=_e(-u,c),d[2]=_e(-a,n)):(d[0]=_e(f,l),d[2]=0);break;case"YXZ":d[0]=Ft(-Bt(u,-1,1)),Gi(u)<.99999?(d[1]=_e(o,c),d[2]=_e(s,l)):(d[1]=_e(-h,n),d[2]=0);break;case"ZXY":d[0]=Ft(Bt(f,-1,1)),Gi(f)<.99999?(d[1]=_e(-h,c),d[2]=_e(-a,l)):(d[1]=0,d[2]=_e(s,n));break;case"ZYX":d[1]=Ft(-Bt(h,-1,1)),Gi(h)<.99999?(d[0]=_e(f,c),d[2]=_e(s,n)):(d[0]=0,d[2]=_e(-a,l));break;case"YZX":d[2]=Ft(Bt(s,-1,1)),Gi(s)<.99999?(d[0]=_e(-u,l),d[1]=_e(-h,n)):(d[0]=0,d[1]=_e(o,c));break;case"XZY":d[2]=Ft(-Bt(a,-1,1)),Gi(a)<.99999?(d[0]=_e(f,l),d[1]=_e(o,n)):(d[0]=_e(-u,c),d[1]=0);break;default:console.warn("Unkown order: "+v)}return e._dirty=!0,e},Object.defineProperties(Y,{POSITIVE_X:{get:function(){return new Y(1,0,0)}},NEGATIVE_X:{get:function(){return new Y(-1,0,0)}},POSITIVE_Y:{get:function(){return new Y(0,1,0)}},NEGATIVE_Y:{get:function(){return new Y(0,-1,0)}},POSITIVE_Z:{get:function(){return new Y(0,0,1)}},NEGATIVE_Z:{get:function(){return new Y(0,0,-1)}},UP:{get:function(){return new Y(0,1,0)}},ZERO:{get:function(){return new Y}}});let z=Y;var ie={};ie.create=function(){var e=new rt(4);return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e},ie.clone=function(e){var t=new rt(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},ie.fromValues=function(e,t,r,i){var n=new rt(4);return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n},ie.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},ie.set=function(e,t,r,i,n){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e},ie.add=function(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e},ie.subtract=function(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e},ie.sub=ie.subtract,ie.multiply=function(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e[3]=t[3]*r[3],e},ie.mul=ie.multiply,ie.divide=function(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e[3]=t[3]/r[3],e},ie.div=ie.divide,ie.min=function(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e[3]=Math.min(t[3],r[3]),e},ie.max=function(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e[3]=Math.max(t[3],r[3]),e},ie.scale=function(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e},ie.scaleAndAdd=function(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e[3]=t[3]+r[3]*i,e},ie.distance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2],a=t[3]-e[3];return Math.sqrt(r*r+i*i+n*n+a*a)},ie.dist=ie.distance,ie.squaredDistance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2],a=t[3]-e[3];return r*r+i*i+n*n+a*a},ie.sqrDist=ie.squaredDistance,ie.length=function(e){var t=e[0],r=e[1],i=e[2],n=e[3];return Math.sqrt(t*t+r*r+i*i+n*n)},ie.len=ie.length,ie.squaredLength=function(e){var t=e[0],r=e[1],i=e[2],n=e[3];return t*t+r*r+i*i+n*n},ie.sqrLen=ie.squaredLength,ie.negate=function(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e},ie.inverse=function(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e[3]=1/t[3],e},ie.normalize=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=r*r+i*i+n*n+a*a;return o>0&&(o=1/Math.sqrt(o),e[0]=t[0]*o,e[1]=t[1]*o,e[2]=t[2]*o,e[3]=t[3]*o),e},ie.dot=function(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]},ie.lerp=function(e,t,r,i){var n=t[0],a=t[1],o=t[2],s=t[3];return e[0]=n+i*(r[0]-n),e[1]=a+i*(r[1]-a),e[2]=o+i*(r[2]-o),e[3]=s+i*(r[3]-s),e},ie.random=function(e,t){return t=t||1,e[0]=Fi(),e[1]=Fi(),e[2]=Fi(),e[3]=Fi(),ie.normalize(e,e),ie.scale(e,e,t),e},ie.transformMat4=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3];return e[0]=r[0]*i+r[4]*n+r[8]*a+r[12]*o,e[1]=r[1]*i+r[5]*n+r[9]*a+r[13]*o,e[2]=r[2]*i+r[6]*n+r[10]*a+r[14]*o,e[3]=r[3]*i+r[7]*n+r[11]*a+r[15]*o,e},ie.transformQuat=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=r[0],s=r[1],l=r[2],u=r[3],h=u*i+s*a-l*n,f=u*n+l*i-o*a,c=u*a+o*n-s*i,d=-o*i-s*n-l*a;return e[0]=h*u+d*-o+f*-l-c*-s,e[1]=f*u+d*-s+c*-o-h*-l,e[2]=c*u+d*-l+h*-s-f*-o,e},ie.forEach=(function(){var e=ie.create();return function(t,r,i,n,a,o){var s,l;for(r||(r=4),i||(i=0),n?l=Math.min(n*r+i,t.length):l=t.length,s=i;s<l;s+=r)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}})();let k=ie;var We={};We.create=function(){var e=new rt(9);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e},We.fromMat4=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e},We.clone=function(e){var t=new rt(9);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},We.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},We.identity=function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e},We.transpose=function(e,t){if(e===t){var r=t[1],i=t[2],n=t[5];e[1]=t[3],e[2]=t[6],e[3]=r,e[5]=t[7],e[6]=i,e[7]=n}else e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8];return e},We.invert=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=t[6],u=t[7],h=t[8],f=h*o-s*u,c=-h*a+s*l,d=u*a-o*l,v=r*f+i*c+n*d;return v?(v=1/v,e[0]=f*v,e[1]=(-h*i+n*u)*v,e[2]=(s*i-n*o)*v,e[3]=c*v,e[4]=(h*r-n*l)*v,e[5]=(-s*r+n*a)*v,e[6]=d*v,e[7]=(-u*r+i*l)*v,e[8]=(o*r-i*a)*v,e):null},We.adjoint=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=t[6],u=t[7],h=t[8];return e[0]=o*h-s*u,e[1]=n*u-i*h,e[2]=i*s-n*o,e[3]=s*l-a*h,e[4]=r*h-n*l,e[5]=n*a-r*s,e[6]=a*u-o*l,e[7]=i*l-r*u,e[8]=r*o-i*a,e},We.determinant=function(e){var t=e[0],r=e[1],i=e[2],n=e[3],a=e[4],o=e[5],s=e[6],l=e[7],u=e[8];return t*(u*a-o*l)+r*(-u*n+o*s)+i*(l*n-a*s)},We.multiply=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=t[6],h=t[7],f=t[8],c=r[0],d=r[1],v=r[2],p=r[3],_=r[4],g=r[5],m=r[6],y=r[7],x=r[8];return e[0]=c*i+d*o+v*u,e[1]=c*n+d*s+v*h,e[2]=c*a+d*l+v*f,e[3]=p*i+_*o+g*u,e[4]=p*n+_*s+g*h,e[5]=p*a+_*l+g*f,e[6]=m*i+y*o+x*u,e[7]=m*n+y*s+x*h,e[8]=m*a+y*l+x*f,e},We.mul=We.multiply,We.translate=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=t[6],h=t[7],f=t[8],c=r[0],d=r[1];return e[0]=i,e[1]=n,e[2]=a,e[3]=o,e[4]=s,e[5]=l,e[6]=c*i+d*o+u,e[7]=c*n+d*s+h,e[8]=c*a+d*l+f,e},We.rotate=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=t[6],h=t[7],f=t[8],c=Math.sin(r),d=Math.cos(r);return e[0]=d*i+c*o,e[1]=d*n+c*s,e[2]=d*a+c*l,e[3]=d*o-c*i,e[4]=d*s-c*n,e[5]=d*l-c*a,e[6]=u,e[7]=h,e[8]=f,e},We.scale=function(e,t,r){var i=r[0],n=r[1];return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=n*t[3],e[4]=n*t[4],e[5]=n*t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},We.fromMat2d=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=0,e[3]=t[2],e[4]=t[3],e[5]=0,e[6]=t[4],e[7]=t[5],e[8]=1,e},We.fromQuat=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=r+r,s=i+i,l=n+n,u=r*o,h=i*o,f=i*s,c=n*o,d=n*s,v=n*l,p=a*o,_=a*s,g=a*l;return e[0]=1-f-v,e[3]=h-g,e[6]=c+_,e[1]=h+g,e[4]=1-u-v,e[7]=d-p,e[2]=c-_,e[5]=d+p,e[8]=1-u-f,e},We.normalFromMat4=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=t[6],u=t[7],h=t[8],f=t[9],c=t[10],d=t[11],v=t[12],p=t[13],_=t[14],g=t[15],m=r*s-i*o,y=r*l-n*o,x=r*u-a*o,w=i*l-n*s,T=i*u-a*s,E=n*u-a*l,b=h*p-f*v,D=h*_-c*v,L=h*g-d*v,M=f*_-c*p,R=f*g-d*p,I=c*g-d*_,P=m*I-y*R+x*M+w*L-T*D+E*b;return P?(P=1/P,e[0]=(s*I-l*R+u*M)*P,e[1]=(l*L-o*I-u*D)*P,e[2]=(o*R-s*L+u*b)*P,e[3]=(n*R-i*I-a*M)*P,e[4]=(r*I-n*L+a*D)*P,e[5]=(i*L-r*R-a*b)*P,e[6]=(p*E-_*T+g*w)*P,e[7]=(_*x-v*E-g*y)*P,e[8]=(v*T-p*x+g*m)*P,e):null},We.frob=function(e){return Math.sqrt(Math.pow(e[0],2)+Math.pow(e[1],2)+Math.pow(e[2],2)+Math.pow(e[3],2)+Math.pow(e[4],2)+Math.pow(e[5],2)+Math.pow(e[6],2)+Math.pow(e[7],2)+Math.pow(e[8],2))};let se=We;var fe={};fe.create=function(){var e=new rt(4);return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e},fe.rotationTo=(function(){var e=C.create(),t=C.fromValues(1,0,0),r=C.fromValues(0,1,0);return function(i,n,a){var o=C.dot(n,a);return o<-.999999?(C.cross(e,t,n),C.length(e)<1e-6&&C.cross(e,r,n),C.normalize(e,e),fe.setAxisAngle(i,e,Math.PI),i):o>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(C.cross(e,n,a),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+o,fe.normalize(i,i))}})(),fe.setAxes=(function(){var e=se.create();return function(t,r,i,n){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=n[0],e[4]=n[1],e[7]=n[2],e[2]=-r[0],e[5]=-r[1],e[8]=-r[2],fe.normalize(t,fe.fromMat3(t,e))}})(),fe.clone=k.clone,fe.fromValues=k.fromValues,fe.copy=k.copy,fe.set=k.set,fe.identity=function(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e},fe.setAxisAngle=function(e,t,r){r=r*.5;var i=Math.sin(r);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(r),e},fe.add=k.add,fe.multiply=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=r[0],l=r[1],u=r[2],h=r[3];return e[0]=i*h+o*s+n*u-a*l,e[1]=n*h+o*l+a*s-i*u,e[2]=a*h+o*u+i*l-n*s,e[3]=o*h-i*s-n*l-a*u,e},fe.mul=fe.multiply,fe.scale=k.scale,fe.rotateX=function(e,t,r){r*=.5;var i=t[0],n=t[1],a=t[2],o=t[3],s=Math.sin(r),l=Math.cos(r);return e[0]=i*l+o*s,e[1]=n*l+a*s,e[2]=a*l-n*s,e[3]=o*l-i*s,e},fe.rotateY=function(e,t,r){r*=.5;var i=t[0],n=t[1],a=t[2],o=t[3],s=Math.sin(r),l=Math.cos(r);return e[0]=i*l-a*s,e[1]=n*l+o*s,e[2]=a*l+i*s,e[3]=o*l-n*s,e},fe.rotateZ=function(e,t,r){r*=.5;var i=t[0],n=t[1],a=t[2],o=t[3],s=Math.sin(r),l=Math.cos(r);return e[0]=i*l+n*s,e[1]=n*l-i*s,e[2]=a*l+o*s,e[3]=o*l-a*s,e},fe.calculateW=function(e,t){var r=t[0],i=t[1],n=t[2];return e[0]=r,e[1]=i,e[2]=n,e[3]=Math.sqrt(Math.abs(1-r*r-i*i-n*n)),e},fe.dot=k.dot,fe.lerp=k.lerp,fe.slerp=function(e,t,r,i){var n=t[0],a=t[1],o=t[2],s=t[3],l=r[0],u=r[1],h=r[2],f=r[3],c,d,v,p,_;return d=n*l+a*u+o*h+s*f,d<0&&(d=-d,l=-l,u=-u,h=-h,f=-f),1-d>1e-6?(c=Math.acos(d),v=Math.sin(c),p=Math.sin((1-i)*c)/v,_=Math.sin(i*c)/v):(p=1-i,_=i),e[0]=p*n+_*l,e[1]=p*a+_*u,e[2]=p*o+_*h,e[3]=p*s+_*f,e},fe.invert=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=r*r+i*i+n*n+a*a,s=o?1/o:0;return e[0]=-r*s,e[1]=-i*s,e[2]=-n*s,e[3]=a*s,e},fe.conjugate=function(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e},fe.length=k.length,fe.len=fe.length,fe.squaredLength=k.squaredLength,fe.sqrLen=fe.squaredLength,fe.normalize=k.normalize,fe.fromMat3=function(e,t){var r=t[0]+t[4]+t[8],i;if(r>0)i=Math.sqrt(r+1),e[3]=.5*i,i=.5/i,e[0]=(t[5]-t[7])*i,e[1]=(t[6]-t[2])*i,e[2]=(t[1]-t[3])*i;else{var n=0;t[4]>t[0]&&(n=1),t[8]>t[n*3+n]&&(n=2);var a=(n+1)%3,o=(n+2)%3;i=Math.sqrt(t[n*3+n]-t[a*3+a]-t[o*3+o]+1),e[n]=.5*i,i=.5/i,e[3]=(t[a*3+o]-t[o*3+a])*i,e[a]=(t[a*3+n]+t[n*3+a])*i,e[o]=(t[o*3+n]+t[n*3+o])*i}return e};let Q=fe;var pe=function(e,t,r,i){e=e||0,t=t||0,r=r||0,i=i===void 0?1:i,this.array=Q.fromValues(e,t,r,i),this._dirty=!0};pe.prototype={constructor:pe,add:function(e){return Q.add(this.array,this.array,e.array),this._dirty=!0,this},calculateW:function(){return Q.calculateW(this.array,this.array),this._dirty=!0,this},set:function(e,t,r,i){return this.array[0]=e,this.array[1]=t,this.array[2]=r,this.array[3]=i,this._dirty=!0,this},setArray:function(e){return this.array[0]=e[0],this.array[1]=e[1],this.array[2]=e[2],this.array[3]=e[3],this._dirty=!0,this},clone:function(){return new pe(this.x,this.y,this.z,this.w)},conjugate:function(){return Q.conjugate(this.array,this.array),this._dirty=!0,this},copy:function(e){return Q.copy(this.array,e.array),this._dirty=!0,this},dot:function(e){return Q.dot(this.array,e.array)},fromMat3:function(e){return Q.fromMat3(this.array,e.array),this._dirty=!0,this},fromMat4:(function(){var e=se.create();return function(t){return se.fromMat4(e,t.array),se.transpose(e,e),Q.fromMat3(this.array,e),this._dirty=!0,this}})(),identity:function(){return Q.identity(this.array),this._dirty=!0,this},invert:function(){return Q.invert(this.array,this.array),this._dirty=!0,this},len:function(){return Q.len(this.array)},length:function(){return Q.length(this.array)},lerp:function(e,t,r){return Q.lerp(this.array,e.array,t.array,r),this._dirty=!0,this},mul:function(e){return Q.mul(this.array,this.array,e.array),this._dirty=!0,this},mulLeft:function(e){return Q.multiply(this.array,e.array,this.array),this._dirty=!0,this},multiply:function(e){return Q.multiply(this.array,this.array,e.array),this._dirty=!0,this},multiplyLeft:function(e){return Q.multiply(this.array,e.array,this.array),this._dirty=!0,this},normalize:function(){return Q.normalize(this.array,this.array),this._dirty=!0,this},rotateX:function(e){return Q.rotateX(this.array,this.array,e),this._dirty=!0,this},rotateY:function(e){return Q.rotateY(this.array,this.array,e),this._dirty=!0,this},rotateZ:function(e){return Q.rotateZ(this.array,this.array,e),this._dirty=!0,this},rotationTo:function(e,t){return Q.rotationTo(this.array,e.array,t.array),this._dirty=!0,this},setAxes:function(e,t,r){return Q.setAxes(this.array,e.array,t.array,r.array),this._dirty=!0,this},setAxisAngle:function(e,t){return Q.setAxisAngle(this.array,e.array,t),this._dirty=!0,this},slerp:function(e,t,r){return Q.slerp(this.array,e.array,t.array,r),this._dirty=!0,this},sqrLen:function(){return Q.sqrLen(this.array)},squaredLength:function(){return Q.squaredLength(this.array)},fromEuler:function(e,t){return pe.fromEuler(this,e,t)},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Pn=Object.defineProperty;if(Pn){var qa=pe.prototype;Pn(qa,"x",{get:function(){return this.array[0]},set:function(e){this.array[0]=e,this._dirty=!0}}),Pn(qa,"y",{get:function(){return this.array[1]},set:function(e){this.array[1]=e,this._dirty=!0}}),Pn(qa,"z",{get:function(){return this.array[2]},set:function(e){this.array[2]=e,this._dirty=!0}}),Pn(qa,"w",{get:function(){return this.array[3]},set:function(e){this.array[3]=e,this._dirty=!0}})}pe.add=function(e,t,r){return Q.add(e.array,t.array,r.array),e._dirty=!0,e},pe.set=function(e,t,r,i,n){Q.set(e.array,t,r,i,n),e._dirty=!0},pe.copy=function(e,t){return Q.copy(e.array,t.array),e._dirty=!0,e},pe.calculateW=function(e,t){return Q.calculateW(e.array,t.array),e._dirty=!0,e},pe.conjugate=function(e,t){return Q.conjugate(e.array,t.array),e._dirty=!0,e},pe.identity=function(e){return Q.identity(e.array),e._dirty=!0,e},pe.invert=function(e,t){return Q.invert(e.array,t.array),e._dirty=!0,e},pe.dot=function(e,t){return Q.dot(e.array,t.array)},pe.len=function(e){return Q.length(e.array)},pe.lerp=function(e,t,r,i){return Q.lerp(e.array,t.array,r.array,i),e._dirty=!0,e},pe.slerp=function(e,t,r,i){return Q.slerp(e.array,t.array,r.array,i),e._dirty=!0,e},pe.mul=function(e,t,r){return Q.multiply(e.array,t.array,r.array),e._dirty=!0,e},pe.multiply=pe.mul,pe.rotateX=function(e,t,r){return Q.rotateX(e.array,t.array,r),e._dirty=!0,e},pe.rotateY=function(e,t,r){return Q.rotateY(e.array,t.array,r),e._dirty=!0,e},pe.rotateZ=function(e,t,r){return Q.rotateZ(e.array,t.array,r),e._dirty=!0,e},pe.setAxisAngle=function(e,t,r){return Q.setAxisAngle(e.array,t.array,r),e._dirty=!0,e},pe.normalize=function(e,t){return Q.normalize(e.array,t.array),e._dirty=!0,e},pe.sqrLen=function(e){return Q.sqrLen(e.array)},pe.squaredLength=pe.sqrLen,pe.fromMat3=function(e,t){return Q.fromMat3(e.array,t.array),e._dirty=!0,e},pe.setAxes=function(e,t,r,i){return Q.setAxes(e.array,t.array,r.array,i.array),e._dirty=!0,e},pe.rotationTo=function(e,t,r){return Q.rotationTo(e.array,t.array,r.array),e._dirty=!0,e},pe.fromEuler=function(e,t,h){e._dirty=!0,t=t.array;var i=e.array,n=Math.cos(t[0]/2),a=Math.cos(t[1]/2),o=Math.cos(t[2]/2),s=Math.sin(t[0]/2),l=Math.sin(t[1]/2),u=Math.sin(t[2]/2),h=(h||"XYZ").toUpperCase();switch(h){case"XYZ":i[0]=s*a*o+n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o-s*l*u;break;case"YXZ":i[0]=s*a*o+n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o+s*l*u;break;case"ZXY":i[0]=s*a*o-n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o-s*l*u;break;case"ZYX":i[0]=s*a*o-n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o+s*l*u;break;case"YZX":i[0]=s*a*o+n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o-s*l*u;break;case"XZY":i[0]=s*a*o-n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o+s*l*u;break}};let Ph=pe;var ge={};ge.create=function(){var e=new rt(16);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e},ge.clone=function(e){var t=new rt(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},ge.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},ge.identity=function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e},ge.transpose=function(e,t){if(e===t){var r=t[1],i=t[2],n=t[3],a=t[6],o=t[7],s=t[11];e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=r,e[6]=t[9],e[7]=t[13],e[8]=i,e[9]=a,e[11]=t[14],e[12]=n,e[13]=o,e[14]=s}else e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15];return e},ge.invert=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=t[6],u=t[7],h=t[8],f=t[9],c=t[10],d=t[11],v=t[12],p=t[13],_=t[14],g=t[15],m=r*s-i*o,y=r*l-n*o,x=r*u-a*o,w=i*l-n*s,T=i*u-a*s,E=n*u-a*l,b=h*p-f*v,D=h*_-c*v,L=h*g-d*v,M=f*_-c*p,R=f*g-d*p,I=c*g-d*_,P=m*I-y*R+x*M+w*L-T*D+E*b;return P?(P=1/P,e[0]=(s*I-l*R+u*M)*P,e[1]=(n*R-i*I-a*M)*P,e[2]=(p*E-_*T+g*w)*P,e[3]=(c*T-f*E-d*w)*P,e[4]=(l*L-o*I-u*D)*P,e[5]=(r*I-n*L+a*D)*P,e[6]=(_*x-v*E-g*y)*P,e[7]=(h*E-c*x+d*y)*P,e[8]=(o*R-s*L+u*b)*P,e[9]=(i*L-r*R-a*b)*P,e[10]=(v*T-p*x+g*m)*P,e[11]=(f*x-h*T-d*m)*P,e[12]=(s*D-o*M-l*b)*P,e[13]=(r*M-i*D+n*b)*P,e[14]=(p*y-v*w-_*m)*P,e[15]=(h*w-f*y+c*m)*P,e):null},ge.adjoint=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=t[6],u=t[7],h=t[8],f=t[9],c=t[10],d=t[11],v=t[12],p=t[13],_=t[14],g=t[15];return e[0]=s*(c*g-d*_)-f*(l*g-u*_)+p*(l*d-u*c),e[1]=-(i*(c*g-d*_)-f*(n*g-a*_)+p*(n*d-a*c)),e[2]=i*(l*g-u*_)-s*(n*g-a*_)+p*(n*u-a*l),e[3]=-(i*(l*d-u*c)-s*(n*d-a*c)+f*(n*u-a*l)),e[4]=-(o*(c*g-d*_)-h*(l*g-u*_)+v*(l*d-u*c)),e[5]=r*(c*g-d*_)-h*(n*g-a*_)+v*(n*d-a*c),e[6]=-(r*(l*g-u*_)-o*(n*g-a*_)+v*(n*u-a*l)),e[7]=r*(l*d-u*c)-o*(n*d-a*c)+h*(n*u-a*l),e[8]=o*(f*g-d*p)-h*(s*g-u*p)+v*(s*d-u*f),e[9]=-(r*(f*g-d*p)-h*(i*g-a*p)+v*(i*d-a*f)),e[10]=r*(s*g-u*p)-o*(i*g-a*p)+v*(i*u-a*s),e[11]=-(r*(s*d-u*f)-o*(i*d-a*f)+h*(i*u-a*s)),e[12]=-(o*(f*_-c*p)-h*(s*_-l*p)+v*(s*c-l*f)),e[13]=r*(f*_-c*p)-h*(i*_-n*p)+v*(i*c-n*f),e[14]=-(r*(s*_-l*p)-o*(i*_-n*p)+v*(i*l-n*s)),e[15]=r*(s*c-l*f)-o*(i*c-n*f)+h*(i*l-n*s),e},ge.determinant=function(e){var t=e[0],r=e[1],i=e[2],n=e[3],a=e[4],o=e[5],s=e[6],l=e[7],u=e[8],h=e[9],f=e[10],c=e[11],d=e[12],v=e[13],p=e[14],_=e[15],g=t*o-r*a,m=t*s-i*a,y=t*l-n*a,x=r*s-i*o,w=r*l-n*o,T=i*l-n*s,E=u*v-h*d,b=u*p-f*d,D=u*_-c*d,L=h*p-f*v,M=h*_-c*v,R=f*_-c*p;return g*R-m*M+y*L+x*D-w*b+T*E},ge.multiply=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=t[6],h=t[7],f=t[8],c=t[9],d=t[10],v=t[11],p=t[12],_=t[13],g=t[14],m=t[15],y=r[0],x=r[1],w=r[2],T=r[3];return e[0]=y*i+x*s+w*f+T*p,e[1]=y*n+x*l+w*c+T*_,e[2]=y*a+x*u+w*d+T*g,e[3]=y*o+x*h+w*v+T*m,y=r[4],x=r[5],w=r[6],T=r[7],e[4]=y*i+x*s+w*f+T*p,e[5]=y*n+x*l+w*c+T*_,e[6]=y*a+x*u+w*d+T*g,e[7]=y*o+x*h+w*v+T*m,y=r[8],x=r[9],w=r[10],T=r[11],e[8]=y*i+x*s+w*f+T*p,e[9]=y*n+x*l+w*c+T*_,e[10]=y*a+x*u+w*d+T*g,e[11]=y*o+x*h+w*v+T*m,y=r[12],x=r[13],w=r[14],T=r[15],e[12]=y*i+x*s+w*f+T*p,e[13]=y*n+x*l+w*c+T*_,e[14]=y*a+x*u+w*d+T*g,e[15]=y*o+x*h+w*v+T*m,e},ge.multiplyAffine=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[4],s=t[5],l=t[6],u=t[8],h=t[9],f=t[10],c=t[12],d=t[13],v=t[14],p=r[0],_=r[1],g=r[2];return e[0]=p*i+_*o+g*u,e[1]=p*n+_*s+g*h,e[2]=p*a+_*l+g*f,p=r[4],_=r[5],g=r[6],e[4]=p*i+_*o+g*u,e[5]=p*n+_*s+g*h,e[6]=p*a+_*l+g*f,p=r[8],_=r[9],g=r[10],e[8]=p*i+_*o+g*u,e[9]=p*n+_*s+g*h,e[10]=p*a+_*l+g*f,p=r[12],_=r[13],g=r[14],e[12]=p*i+_*o+g*u+c,e[13]=p*n+_*s+g*h+d,e[14]=p*a+_*l+g*f+v,e},ge.mul=ge.multiply,ge.mulAffine=ge.multiplyAffine,ge.translate=function(e,t,r){var i=r[0],n=r[1],a=r[2],o,s,l,u,h,f,c,d,v,p,_,g;return t===e?(e[12]=t[0]*i+t[4]*n+t[8]*a+t[12],e[13]=t[1]*i+t[5]*n+t[9]*a+t[13],e[14]=t[2]*i+t[6]*n+t[10]*a+t[14],e[15]=t[3]*i+t[7]*n+t[11]*a+t[15]):(o=t[0],s=t[1],l=t[2],u=t[3],h=t[4],f=t[5],c=t[6],d=t[7],v=t[8],p=t[9],_=t[10],g=t[11],e[0]=o,e[1]=s,e[2]=l,e[3]=u,e[4]=h,e[5]=f,e[6]=c,e[7]=d,e[8]=v,e[9]=p,e[10]=_,e[11]=g,e[12]=o*i+h*n+v*a+t[12],e[13]=s*i+f*n+p*a+t[13],e[14]=l*i+c*n+_*a+t[14],e[15]=u*i+d*n+g*a+t[15]),e},ge.scale=function(e,t,r){var i=r[0],n=r[1],a=r[2];return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e[3]=t[3]*i,e[4]=t[4]*n,e[5]=t[5]*n,e[6]=t[6]*n,e[7]=t[7]*n,e[8]=t[8]*a,e[9]=t[9]*a,e[10]=t[10]*a,e[11]=t[11]*a,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},ge.rotate=function(e,t,r,i){var n=i[0],a=i[1],o=i[2],s=Math.sqrt(n*n+a*a+o*o),l,u,h,f,c,d,v,p,_,g,m,y,x,w,T,E,b,D,L,M,R,I,P,N;return Math.abs(s)<Xa?null:(s=1/s,n*=s,a*=s,o*=s,l=Math.sin(r),u=Math.cos(r),h=1-u,f=t[0],c=t[1],d=t[2],v=t[3],p=t[4],_=t[5],g=t[6],m=t[7],y=t[8],x=t[9],w=t[10],T=t[11],E=n*n*h+u,b=a*n*h+o*l,D=o*n*h-a*l,L=n*a*h-o*l,M=a*a*h+u,R=o*a*h+n*l,I=n*o*h+a*l,P=a*o*h-n*l,N=o*o*h+u,e[0]=f*E+p*b+y*D,e[1]=c*E+_*b+x*D,e[2]=d*E+g*b+w*D,e[3]=v*E+m*b+T*D,e[4]=f*L+p*M+y*R,e[5]=c*L+_*M+x*R,e[6]=d*L+g*M+w*R,e[7]=v*L+m*M+T*R,e[8]=f*I+p*P+y*N,e[9]=c*I+_*P+x*N,e[10]=d*I+g*P+w*N,e[11]=v*I+m*P+T*N,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)},ge.rotateX=function(e,t,r){var i=Math.sin(r),n=Math.cos(r),a=t[4],o=t[5],s=t[6],l=t[7],u=t[8],h=t[9],f=t[10],c=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=a*n+u*i,e[5]=o*n+h*i,e[6]=s*n+f*i,e[7]=l*n+c*i,e[8]=u*n-a*i,e[9]=h*n-o*i,e[10]=f*n-s*i,e[11]=c*n-l*i,e},ge.rotateY=function(e,t,r){var i=Math.sin(r),n=Math.cos(r),a=t[0],o=t[1],s=t[2],l=t[3],u=t[8],h=t[9],f=t[10],c=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*n-u*i,e[1]=o*n-h*i,e[2]=s*n-f*i,e[3]=l*n-c*i,e[8]=a*i+u*n,e[9]=o*i+h*n,e[10]=s*i+f*n,e[11]=l*i+c*n,e},ge.rotateZ=function(e,t,r){var i=Math.sin(r),n=Math.cos(r),a=t[0],o=t[1],s=t[2],l=t[3],u=t[4],h=t[5],f=t[6],c=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*n+u*i,e[1]=o*n+h*i,e[2]=s*n+f*i,e[3]=l*n+c*i,e[4]=u*n-a*i,e[5]=h*n-o*i,e[6]=f*n-s*i,e[7]=c*n-l*i,e},ge.fromRotationTranslation=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=i+i,l=n+n,u=a+a,h=i*s,f=i*l,c=i*u,d=n*l,v=n*u,p=a*u,_=o*s,g=o*l,m=o*u;return e[0]=1-(d+p),e[1]=f+m,e[2]=c-g,e[3]=0,e[4]=f-m,e[5]=1-(h+p),e[6]=v+_,e[7]=0,e[8]=c+g,e[9]=v-_,e[10]=1-(h+d),e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e},ge.fromQuat=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=r+r,s=i+i,l=n+n,u=r*o,h=i*o,f=i*s,c=n*o,d=n*s,v=n*l,p=a*o,_=a*s,g=a*l;return e[0]=1-f-v,e[1]=h+g,e[2]=c-_,e[3]=0,e[4]=h-g,e[5]=1-u-v,e[6]=d+p,e[7]=0,e[8]=c+_,e[9]=d-p,e[10]=1-u-f,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e},ge.frustum=function(e,t,r,i,n,a,o){var s=1/(r-t),l=1/(n-i),u=1/(a-o);return e[0]=a*2*s,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a*2*l,e[6]=0,e[7]=0,e[8]=(r+t)*s,e[9]=(n+i)*l,e[10]=(o+a)*u,e[11]=-1,e[12]=0,e[13]=0,e[14]=o*a*2*u,e[15]=0,e},ge.perspective=function(e,t,r,i,n){var a=1/Math.tan(t/2),o=1/(i-n);return e[0]=a/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=(n+i)*o,e[11]=-1,e[12]=0,e[13]=0,e[14]=2*n*i*o,e[15]=0,e},ge.ortho=function(e,t,r,i,n,a,o){var s=1/(t-r),l=1/(i-n),u=1/(a-o);return e[0]=-2*s,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*u,e[11]=0,e[12]=(t+r)*s,e[13]=(n+i)*l,e[14]=(o+a)*u,e[15]=1,e},ge.lookAt=function(e,t,r,i){var n,a,o,s,l,u,h,f,c,d,v=t[0],p=t[1],_=t[2],g=i[0],m=i[1],y=i[2],x=r[0],w=r[1],T=r[2];return Math.abs(v-x)<Xa&&Math.abs(p-w)<Xa&&Math.abs(_-T)<Xa?ge.identity(e):(h=v-x,f=p-w,c=_-T,d=1/Math.sqrt(h*h+f*f+c*c),h*=d,f*=d,c*=d,n=m*c-y*f,a=y*h-g*c,o=g*f-m*h,d=Math.sqrt(n*n+a*a+o*o),d?(d=1/d,n*=d,a*=d,o*=d):(n=0,a=0,o=0),s=f*o-c*a,l=c*n-h*o,u=h*a-f*n,d=Math.sqrt(s*s+l*l+u*u),d?(d=1/d,s*=d,l*=d,u*=d):(s=0,l=0,u=0),e[0]=n,e[1]=s,e[2]=h,e[3]=0,e[4]=a,e[5]=l,e[6]=f,e[7]=0,e[8]=o,e[9]=u,e[10]=c,e[11]=0,e[12]=-(n*v+a*p+o*_),e[13]=-(s*v+l*p+u*_),e[14]=-(h*v+f*p+c*_),e[15]=1,e)},ge.frob=function(e){return Math.sqrt(Math.pow(e[0],2)+Math.pow(e[1],2)+Math.pow(e[2],2)+Math.pow(e[3],2)+Math.pow(e[4],2)+Math.pow(e[5],2)+Math.pow(e[6],2)+Math.pow(e[7],2)+Math.pow(e[8],2)+Math.pow(e[9],2)+Math.pow(e[10],2)+Math.pow(e[11],2)+Math.pow(e[12],2)+Math.pow(e[13],2)+Math.pow(e[14],2)+Math.pow(e[15],2))};let U=ge;var Te=function(){this._axisX=new z,this._axisY=new z,this._axisZ=new z,this.array=U.create(),this._dirty=!0};Te.prototype={constructor:Te,setArray:function(e){for(var t=0;t<this.array.length;t++)this.array[t]=e[t];return this._dirty=!0,this},adjoint:function(){return U.adjoint(this.array,this.array),this._dirty=!0,this},clone:function(){return new Te().copy(this)},copy:function(e){return U.copy(this.array,e.array),this._dirty=!0,this},determinant:function(){return U.determinant(this.array)},fromQuat:function(e){return U.fromQuat(this.array,e.array),this._dirty=!0,this},fromRotationTranslation:function(e,t){return U.fromRotationTranslation(this.array,e.array,t.array),this._dirty=!0,this},fromMat2d:function(e){return Te.fromMat2d(this,e),this},frustum:function(e,t,r,i,n,a){return U.frustum(this.array,e,t,r,i,n,a),this._dirty=!0,this},identity:function(){return U.identity(this.array),this._dirty=!0,this},invert:function(){return U.invert(this.array,this.array),this._dirty=!0,this},lookAt:function(e,t,r){return U.lookAt(this.array,e.array,t.array,r.array),this._dirty=!0,this},mul:function(e){return U.mul(this.array,this.array,e.array),this._dirty=!0,this},mulLeft:function(e){return U.mul(this.array,e.array,this.array),this._dirty=!0,this},multiply:function(e){return U.multiply(this.array,this.array,e.array),this._dirty=!0,this},multiplyLeft:function(e){return U.multiply(this.array,e.array,this.array),this._dirty=!0,this},ortho:function(e,t,r,i,n,a){return U.ortho(this.array,e,t,r,i,n,a),this._dirty=!0,this},perspective:function(e,t,r,i){return U.perspective(this.array,e,t,r,i),this._dirty=!0,this},rotate:function(e,t){return U.rotate(this.array,this.array,e,t.array),this._dirty=!0,this},rotateX:function(e){return U.rotateX(this.array,this.array,e),this._dirty=!0,this},rotateY:function(e){return U.rotateY(this.array,this.array,e),this._dirty=!0,this},rotateZ:function(e){return U.rotateZ(this.array,this.array,e),this._dirty=!0,this},scale:function(e){return U.scale(this.array,this.array,e.array),this._dirty=!0,this},translate:function(e){return U.translate(this.array,this.array,e.array),this._dirty=!0,this},transpose:function(){return U.transpose(this.array,this.array),this._dirty=!0,this},decomposeMatrix:(function(){var e=C.create(),t=C.create(),r=C.create(),i=se.create();return function(n,a,o){var s=this.array;C.set(e,s[0],s[1],s[2]),C.set(t,s[4],s[5],s[6]),C.set(r,s[8],s[9],s[10]);var l=C.length(e),u=C.length(t),h=C.length(r),f=this.determinant();f<0&&(l=-l),n&&n.set(l,u,h),o.set(s[12],s[13],s[14]),se.fromMat4(i,s),i[0]/=l,i[1]/=l,i[2]/=l,i[3]/=u,i[4]/=u,i[5]/=u,i[6]/=h,i[7]/=h,i[8]/=h,Q.fromMat3(a.array,i),Q.normalize(a.array,a.array),a._dirty=!0,o._dirty=!0}})(),toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Za=Object.defineProperty;if(Za){var Us=Te.prototype;Za(Us,"z",{get:function(){var e=this.array;return this._axisZ.set(e[8],e[9],e[10]),this._axisZ},set:function(e){var t=this.array;e=e.array,t[8]=e[0],t[9]=e[1],t[10]=e[2],this._dirty=!0}}),Za(Us,"y",{get:function(){var e=this.array;return this._axisY.set(e[4],e[5],e[6]),this._axisY},set:function(e){var t=this.array;e=e.array,t[4]=e[0],t[5]=e[1],t[6]=e[2],this._dirty=!0}}),Za(Us,"x",{get:function(){var e=this.array;return this._axisX.set(e[0],e[1],e[2]),this._axisX},set:function(e){var t=this.array;e=e.array,t[0]=e[0],t[1]=e[1],t[2]=e[2],this._dirty=!0}})}Te.adjoint=function(e,t){return U.adjoint(e.array,t.array),e._dirty=!0,e},Te.copy=function(e,t){return U.copy(e.array,t.array),e._dirty=!0,e},Te.determinant=function(e){return U.determinant(e.array)},Te.identity=function(e){return U.identity(e.array),e._dirty=!0,e},Te.ortho=function(e,t,r,i,n,a,o){return U.ortho(e.array,t,r,i,n,a,o),e._dirty=!0,e},Te.perspective=function(e,t,r,i,n){return U.perspective(e.array,t,r,i,n),e._dirty=!0,e},Te.lookAt=function(e,t,r,i){return U.lookAt(e.array,t.array,r.array,i.array),e._dirty=!0,e},Te.invert=function(e,t){return U.invert(e.array,t.array),e._dirty=!0,e},Te.mul=function(e,t,r){return U.mul(e.array,t.array,r.array),e._dirty=!0,e},Te.multiply=Te.mul,Te.fromQuat=function(e,t){return U.fromQuat(e.array,t.array),e._dirty=!0,e},Te.fromRotationTranslation=function(e,t,r){return U.fromRotationTranslation(e.array,t.array,r.array),e._dirty=!0,e},Te.fromMat2d=function(i,r){i._dirty=!0;var r=r.array,i=i.array;return i[0]=r[0],i[4]=r[2],i[12]=r[4],i[1]=r[1],i[5]=r[3],i[13]=r[5],i},Te.rotate=function(e,t,r,i){return U.rotate(e.array,t.array,r,i.array),e._dirty=!0,e},Te.rotateX=function(e,t,r){return U.rotateX(e.array,t.array,r),e._dirty=!0,e},Te.rotateY=function(e,t,r){return U.rotateY(e.array,t.array,r),e._dirty=!0,e},Te.rotateZ=function(e,t,r){return U.rotateZ(e.array,t.array,r),e._dirty=!0,e},Te.scale=function(e,t,r){return U.scale(e.array,t.array,r.array),e._dirty=!0,e},Te.transpose=function(e,t){return U.transpose(e.array,t.array),e._dirty=!0,e},Te.translate=function(e,t,r){return U.translate(e.array,t.array,r.array),e._dirty=!0,e};let W=Te;var Ar=C.set,Ya=C.copy,Ka=function(e,t){this.min=e||new z(1/0,1/0,1/0),this.max=t||new z(-1/0,-1/0,-1/0),this.vertices=null};Ka.prototype={constructor:Ka,updateFromVertices:function(e){if(e.length>0){var t=this.min,r=this.max,i=t.array,n=r.array;Ya(i,e[0]),Ya(n,e[0]);for(var a=1;a<e.length;a++){var o=e[a];o[0]<i[0]&&(i[0]=o[0]),o[1]<i[1]&&(i[1]=o[1]),o[2]<i[2]&&(i[2]=o[2]),o[0]>n[0]&&(n[0]=o[0]),o[1]>n[1]&&(n[1]=o[1]),o[2]>n[2]&&(n[2]=o[2])}t._dirty=!0,r._dirty=!0}},union:function(e){var t=this.min,r=this.max;return C.min(t.array,t.array,e.min.array),C.max(r.array,r.array,e.max.array),t._dirty=!0,r._dirty=!0,this},intersection:function(e){var t=this.min,r=this.max;return C.max(t.array,t.array,e.min.array),C.min(r.array,r.array,e.max.array),t._dirty=!0,r._dirty=!0,this},intersectBoundingBox:function(e){var t=this.min.array,r=this.max.array,i=e.min.array,n=e.max.array;return!(t[0]>n[0]||t[1]>n[1]||t[2]>n[2]||r[0]<i[0]||r[1]<i[1]||r[2]<i[2])},containBoundingBox:function(e){var t=this.min.array,r=this.max.array,i=e.min.array,n=e.max.array;return t[0]<=i[0]&&t[1]<=i[1]&&t[2]<=i[2]&&r[0]>=n[0]&&r[1]>=n[1]&&r[2]>=n[2]},containPoint:function(e){var t=this.min.array,r=this.max.array,i=e.array;return t[0]<=i[0]&&t[1]<=i[1]&&t[2]<=i[2]&&r[0]>=i[0]&&r[1]>=i[1]&&r[2]>=i[2]},isFinite:function(){var e=this.min.array,t=this.max.array;return isFinite(e[0])&&isFinite(e[1])&&isFinite(e[2])&&isFinite(t[0])&&isFinite(t[1])&&isFinite(t[2])},applyTransform:function(e){this.transformFrom(this,e)},transformFrom:(function(){var e=C.create(),t=C.create(),r=C.create(),i=C.create(),n=C.create(),a=C.create();return function(o,s){var l=o.min.array,u=o.max.array,h=s.array;return e[0]=h[0]*l[0],e[1]=h[1]*l[0],e[2]=h[2]*l[0],t[0]=h[0]*u[0],t[1]=h[1]*u[0],t[2]=h[2]*u[0],r[0]=h[4]*l[1],r[1]=h[5]*l[1],r[2]=h[6]*l[1],i[0]=h[4]*u[1],i[1]=h[5]*u[1],i[2]=h[6]*u[1],n[0]=h[8]*l[2],n[1]=h[9]*l[2],n[2]=h[10]*l[2],a[0]=h[8]*u[2],a[1]=h[9]*u[2],a[2]=h[10]*u[2],l=this.min.array,u=this.max.array,l[0]=Math.min(e[0],t[0])+Math.min(r[0],i[0])+Math.min(n[0],a[0])+h[12],l[1]=Math.min(e[1],t[1])+Math.min(r[1],i[1])+Math.min(n[1],a[1])+h[13],l[2]=Math.min(e[2],t[2])+Math.min(r[2],i[2])+Math.min(n[2],a[2])+h[14],u[0]=Math.max(e[0],t[0])+Math.max(r[0],i[0])+Math.max(n[0],a[0])+h[12],u[1]=Math.max(e[1],t[1])+Math.max(r[1],i[1])+Math.max(n[1],a[1])+h[13],u[2]=Math.max(e[2],t[2])+Math.max(r[2],i[2])+Math.max(n[2],a[2])+h[14],this.min._dirty=!0,this.max._dirty=!0,this}})(),applyProjection:function(e){var t=this.min.array,r=this.max.array,i=e.array,n=t[0],a=t[1],o=t[2],s=r[0],l=r[1],u=t[2],h=r[0],f=r[1],c=r[2];if(i[15]===1)t[0]=i[0]*n+i[12],t[1]=i[5]*a+i[13],r[2]=i[10]*o+i[14],r[0]=i[0]*h+i[12],r[1]=i[5]*f+i[13],t[2]=i[10]*c+i[14];else{var d=-1/o;t[0]=i[0]*n*d,t[1]=i[5]*a*d,r[2]=(i[10]*o+i[14])*d,d=-1/u,r[0]=i[0]*s*d,r[1]=i[5]*l*d,d=-1/c,t[2]=(i[10]*c+i[14])*d}return this.min._dirty=!0,this.max._dirty=!0,this},updateVertices:function(){var e=this.vertices;if(!e){e=[];for(var t=0;t<8;t++)e[t]=C.fromValues(0,0,0);this.vertices=e}var r=this.min.array,i=this.max.array;return Ar(e[0],r[0],r[1],r[2]),Ar(e[1],r[0],i[1],r[2]),Ar(e[2],i[0],r[1],r[2]),Ar(e[3],i[0],i[1],r[2]),Ar(e[4],r[0],r[1],i[2]),Ar(e[5],r[0],i[1],i[2]),Ar(e[6],i[0],r[1],i[2]),Ar(e[7],i[0],i[1],i[2]),this},copy:function(e){var t=this.min,r=this.max;return Ya(t.array,e.min.array),Ya(r.array,e.max.array),t._dirty=!0,r._dirty=!0,this},clone:function(){var e=new Ka;return e.copy(this),e}};let pt=Ka;var i_=0,n_=vt.extend({name:"",position:null,rotation:null,scale:null,worldTransform:null,localTransform:null,autoUpdateLocalTransform:!0,_parent:null,_scene:null,_needsUpdateWorldTransform:!0,_inIterating:!1,__depth:0},function(){this.name||(this.name=(this.type||"NODE")+"_"+i_++),this.position||(this.position=new z),this.rotation||(this.rotation=new Ph),this.scale||(this.scale=new z(1,1,1)),this.worldTransform=new W,this.localTransform=new W,this._children=[]},{target:null,invisible:!1,isSkinnedMesh:function(){return!1},isRenderable:function(){return!1},setName:function(e){var t=this._scene;if(t){var r=t._nodeRepository;delete r[this.name],r[e]=this}this.name=e},add:function(e){var t=e._parent;if(t!==this){t&&t.remove(e),e._parent=this,this._children.push(e);var r=this._scene;r&&r!==e.scene&&e.traverse(this._addSelfToScene,this),e._needsUpdateWorldTransform=!0}},remove:function(e){var t=this._children,r=t.indexOf(e);r<0||(t.splice(r,1),e._parent=null,this._scene&&e.traverse(this._removeSelfFromScene,this))},removeAll:function(){for(var e=this._children,t=0;t<e.length;t++)e[t]._parent=null,this._scene&&e[t].traverse(this._removeSelfFromScene,this);this._children=[]},getScene:function(){return this._scene},getParent:function(){return this._parent},_removeSelfFromScene:function(e){e._scene.removeFromScene(e),e._scene=null},_addSelfToScene:function(e){this._scene.addToScene(e),e._scene=this._scene},isAncestor:function(e){for(var t=e._parent;t;){if(t===this)return!0;t=t._parent}return!1},children:function(){return this._children.slice()},childAt:function(e){return this._children[e]},getChildByName:function(e){for(var t=this._children,r=0;r<t.length;r++)if(t[r].name===e)return t[r]},getDescendantByName:function(e){for(var t=this._children,r=0;r<t.length;r++){var i=t[r];if(i.name===e)return i;var n=i.getDescendantByName(e);if(n)return n}},queryNode:function(e){if(e){for(var t=e.split("/"),r=this,i=0;i<t.length;i++){var n=t[i];if(n){for(var a=!1,o=r._children,s=0;s<o.length;s++){var l=o[s];if(l.name===n){r=l,a=!0;break}}if(!a)return}}return r}},getPath:function(e){if(!this._parent)return"/";for(var t=this._parent,r=this.name;t._parent&&(r=t.name+"/"+r,t._parent!=e);)t=t._parent;return!t._parent&&e?null:r},traverse:function(e,t){e.call(t,this);for(var r=this._children,i=0,n=r.length;i<n;i++)r[i].traverse(e,t)},eachChild:function(e,t){for(var r=this._children,i=0,n=r.length;i<n;i++){var a=r[i];e.call(t,a,i)}},setLocalTransform:function(e){U.copy(this.localTransform.array,e.array),this.decomposeLocalTransform()},decomposeLocalTransform:function(e){var t=e?null:this.scale;this.localTransform.decomposeMatrix(t,this.rotation,this.position)},setWorldTransform:function(e){U.copy(this.worldTransform.array,e.array),this.decomposeWorldTransform()},decomposeWorldTransform:(function(){var e=U.create();return function(t){var r=this.localTransform,i=this.worldTransform;this._parent?(U.invert(e,this._parent.worldTransform.array),U.multiply(r.array,e,i.array)):U.copy(r.array,i.array);var n=t?null:this.scale;r.decomposeMatrix(n,this.rotation,this.position)}})(),transformNeedsUpdate:function(){return this.position._dirty||this.rotation._dirty||this.scale._dirty},updateLocalTransform:function(){var e=this.position,t=this.rotation,r=this.scale;if(this.transformNeedsUpdate()){var i=this.localTransform.array;U.fromRotationTranslation(i,t.array,e.array),U.scale(i,i,r.array),t._dirty=!1,r._dirty=!1,e._dirty=!1,this._needsUpdateWorldTransform=!0}},_updateWorldTransformTopDown:function(){var e=this.localTransform.array,t=this.worldTransform.array;this._parent?U.multiplyAffine(t,this._parent.worldTransform.array,e):U.copy(t,e)},updateWorldTransform:function(){for(var e=this;e&&e.getParent()&&e.getParent().transformNeedsUpdate();)e=e.getParent();e.update()},update:function(e){this.autoUpdateLocalTransform?this.updateLocalTransform():e=!0,(e||this._needsUpdateWorldTransform)&&(this._updateWorldTransformTopDown(),e=!0,this._needsUpdateWorldTransform=!1);for(var t=this._children,r=0,i=t.length;r<i;r++)t[r].update(e)},getBoundingBox:(function(){function e(n){return!n.invisible&&n.geometry}var t=new pt,r=new W,i=new W;return function(n,a){return a=a||new pt,n=n||e,this._parent?W.invert(i,this._parent.worldTransform):W.identity(i),this.traverse(function(o){o.geometry&&o.geometry.boundingBox&&(t.copy(o.geometry.boundingBox),W.multiply(r,i,o.worldTransform),t.applyTransform(r),a.union(t))},this,e),a}})(),getWorldPosition:function(e){this.transformNeedsUpdate()&&this.updateWorldTransform();var t=this.worldTransform.array;if(e){var r=e.array;return r[0]=t[12],r[1]=t[13],r[2]=t[14],e}else return new z(t[12],t[13],t[14])},clone:function(){var e=new this.constructor,t=this._children;e.setName(this.name),e.position.copy(this.position),e.rotation.copy(this.rotation),e.scale.copy(this.scale);for(var r=0;r<t.length;r++)e.add(t[r].clone());return e},rotateAround:(function(){var e=new z,t=new W;return function(r,i,n){e.copy(this.position).subtract(r);var a=this.localTransform;a.identity(),a.translate(r),a.rotate(n,i),t.fromRotationTranslation(this.rotation,e),a.multiply(t),a.scale(this.scale),this.decomposeLocalTransform(),this._needsUpdateWorldTransform=!0}})(),lookAt:(function(){var e=new W;return function(t,r){e.lookAt(this.position,t,r||this.localTransform.y).invert(),this.setLocalTransform(e),this.target=t}})()});let rr=n_,O={DEPTH_BUFFER_BIT:256,STENCIL_BUFFER_BIT:1024,COLOR_BUFFER_BIT:16384,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,ZERO:0,ONE:1,SRC_COLOR:768,ONE_MINUS_SRC_COLOR:769,SRC_ALPHA:770,ONE_MINUS_SRC_ALPHA:771,DST_ALPHA:772,ONE_MINUS_DST_ALPHA:773,DST_COLOR:774,ONE_MINUS_DST_COLOR:775,SRC_ALPHA_SATURATE:776,FUNC_ADD:32774,BLEND_EQUATION:32777,BLEND_EQUATION_RGB:32777,BLEND_EQUATION_ALPHA:34877,FUNC_SUBTRACT:32778,FUNC_REVERSE_SUBTRACT:32779,BLEND_DST_RGB:32968,BLEND_SRC_RGB:32969,BLEND_DST_ALPHA:32970,BLEND_SRC_ALPHA:32971,CONSTANT_COLOR:32769,ONE_MINUS_CONSTANT_COLOR:32770,CONSTANT_ALPHA:32771,ONE_MINUS_CONSTANT_ALPHA:32772,BLEND_COLOR:32773,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,ARRAY_BUFFER_BINDING:34964,ELEMENT_ARRAY_BUFFER_BINDING:34965,STREAM_DRAW:35040,STATIC_DRAW:35044,DYNAMIC_DRAW:35048,BUFFER_SIZE:34660,BUFFER_USAGE:34661,CURRENT_VERTEX_ATTRIB:34342,FRONT:1028,BACK:1029,FRONT_AND_BACK:1032,CULL_FACE:2884,BLEND:3042,DITHER:3024,STENCIL_TEST:2960,DEPTH_TEST:2929,SCISSOR_TEST:3089,POLYGON_OFFSET_FILL:32823,SAMPLE_ALPHA_TO_COVERAGE:32926,SAMPLE_COVERAGE:32928,NO_ERROR:0,INVALID_ENUM:1280,INVALID_VALUE:1281,INVALID_OPERATION:1282,OUT_OF_MEMORY:1285,CW:2304,CCW:2305,LINE_WIDTH:2849,ALIASED_POINT_SIZE_RANGE:33901,ALIASED_LINE_WIDTH_RANGE:33902,CULL_FACE_MODE:2885,FRONT_FACE:2886,DEPTH_RANGE:2928,DEPTH_WRITEMASK:2930,DEPTH_CLEAR_VALUE:2931,DEPTH_FUNC:2932,STENCIL_CLEAR_VALUE:2961,STENCIL_FUNC:2962,STENCIL_FAIL:2964,STENCIL_PASS_DEPTH_FAIL:2965,STENCIL_PASS_DEPTH_PASS:2966,STENCIL_REF:2967,STENCIL_VALUE_MASK:2963,STENCIL_WRITEMASK:2968,STENCIL_BACK_FUNC:34816,STENCIL_BACK_FAIL:34817,STENCIL_BACK_PASS_DEPTH_FAIL:34818,STENCIL_BACK_PASS_DEPTH_PASS:34819,STENCIL_BACK_REF:36003,STENCIL_BACK_VALUE_MASK:36004,STENCIL_BACK_WRITEMASK:36005,VIEWPORT:2978,SCISSOR_BOX:3088,COLOR_CLEAR_VALUE:3106,COLOR_WRITEMASK:3107,UNPACK_ALIGNMENT:3317,PACK_ALIGNMENT:3333,MAX_TEXTURE_SIZE:3379,MAX_VIEWPORT_DIMS:3386,SUBPIXEL_BITS:3408,RED_BITS:3410,GREEN_BITS:3411,BLUE_BITS:3412,ALPHA_BITS:3413,DEPTH_BITS:3414,STENCIL_BITS:3415,POLYGON_OFFSET_UNITS:10752,POLYGON_OFFSET_FACTOR:32824,TEXTURE_BINDING_2D:32873,SAMPLE_BUFFERS:32936,SAMPLES:32937,SAMPLE_COVERAGE_VALUE:32938,SAMPLE_COVERAGE_INVERT:32939,COMPRESSED_TEXTURE_FORMATS:34467,DONT_CARE:4352,FASTEST:4353,NICEST:4354,GENERATE_MIPMAP_HINT:33170,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,DEPTH_COMPONENT:6402,ALPHA:6406,RGB:6407,RGBA:6408,LUMINANCE:6409,LUMINANCE_ALPHA:6410,UNSIGNED_SHORT_4_4_4_4:32819,UNSIGNED_SHORT_5_5_5_1:32820,UNSIGNED_SHORT_5_6_5:33635,FRAGMENT_SHADER:35632,VERTEX_SHADER:35633,MAX_VERTEX_ATTRIBS:34921,MAX_VERTEX_UNIFORM_VECTORS:36347,MAX_VARYING_VECTORS:36348,MAX_COMBINED_TEXTURE_IMAGE_UNITS:35661,MAX_VERTEX_TEXTURE_IMAGE_UNITS:35660,MAX_TEXTURE_IMAGE_UNITS:34930,MAX_FRAGMENT_UNIFORM_VECTORS:36349,SHADER_TYPE:35663,DELETE_STATUS:35712,LINK_STATUS:35714,VALIDATE_STATUS:35715,ATTACHED_SHADERS:35717,ACTIVE_UNIFORMS:35718,ACTIVE_ATTRIBUTES:35721,SHADING_LANGUAGE_VERSION:35724,CURRENT_PROGRAM:35725,NEVER:512,LESS:513,EQUAL:514,LEQUAL:515,GREATER:516,NOTEQUAL:517,GEQUAL:518,ALWAYS:519,KEEP:7680,REPLACE:7681,INCR:7682,DECR:7683,INVERT:5386,INCR_WRAP:34055,DECR_WRAP:34056,VENDOR:7936,RENDERER:7937,VERSION:7938,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,TEXTURE_MAG_FILTER:10240,TEXTURE_MIN_FILTER:10241,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,TEXTURE_2D:3553,TEXTURE:5890,TEXTURE_CUBE_MAP:34067,TEXTURE_BINDING_CUBE_MAP:34068,TEXTURE_CUBE_MAP_POSITIVE_X:34069,TEXTURE_CUBE_MAP_NEGATIVE_X:34070,TEXTURE_CUBE_MAP_POSITIVE_Y:34071,TEXTURE_CUBE_MAP_NEGATIVE_Y:34072,TEXTURE_CUBE_MAP_POSITIVE_Z:34073,TEXTURE_CUBE_MAP_NEGATIVE_Z:34074,MAX_CUBE_MAP_TEXTURE_SIZE:34076,TEXTURE0:33984,TEXTURE1:33985,TEXTURE2:33986,TEXTURE3:33987,TEXTURE4:33988,TEXTURE5:33989,TEXTURE6:33990,TEXTURE7:33991,TEXTURE8:33992,TEXTURE9:33993,TEXTURE10:33994,TEXTURE11:33995,TEXTURE12:33996,TEXTURE13:33997,TEXTURE14:33998,TEXTURE15:33999,TEXTURE16:34e3,TEXTURE17:34001,TEXTURE18:34002,TEXTURE19:34003,TEXTURE20:34004,TEXTURE21:34005,TEXTURE22:34006,TEXTURE23:34007,TEXTURE24:34008,TEXTURE25:34009,TEXTURE26:34010,TEXTURE27:34011,TEXTURE28:34012,TEXTURE29:34013,TEXTURE30:34014,TEXTURE31:34015,ACTIVE_TEXTURE:34016,REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,FLOAT_MAT2:35674,FLOAT_MAT3:35675,FLOAT_MAT4:35676,SAMPLER_2D:35678,SAMPLER_CUBE:35680,VERTEX_ATTRIB_ARRAY_ENABLED:34338,VERTEX_ATTRIB_ARRAY_SIZE:34339,VERTEX_ATTRIB_ARRAY_STRIDE:34340,VERTEX_ATTRIB_ARRAY_TYPE:34341,VERTEX_ATTRIB_ARRAY_NORMALIZED:34922,VERTEX_ATTRIB_ARRAY_POINTER:34373,VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:34975,COMPILE_STATUS:35713,LOW_FLOAT:36336,MEDIUM_FLOAT:36337,HIGH_FLOAT:36338,LOW_INT:36339,MEDIUM_INT:36340,HIGH_INT:36341,FRAMEBUFFER:36160,RENDERBUFFER:36161,RGBA4:32854,RGB5_A1:32855,RGB565:36194,DEPTH_COMPONENT16:33189,STENCIL_INDEX:6401,STENCIL_INDEX8:36168,DEPTH_STENCIL:34041,RENDERBUFFER_WIDTH:36162,RENDERBUFFER_HEIGHT:36163,RENDERBUFFER_INTERNAL_FORMAT:36164,RENDERBUFFER_RED_SIZE:36176,RENDERBUFFER_GREEN_SIZE:36177,RENDERBUFFER_BLUE_SIZE:36178,RENDERBUFFER_ALPHA_SIZE:36179,RENDERBUFFER_DEPTH_SIZE:36180,RENDERBUFFER_STENCIL_SIZE:36181,FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:36048,FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:36049,FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:36050,FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:36051,COLOR_ATTACHMENT0:36064,DEPTH_ATTACHMENT:36096,STENCIL_ATTACHMENT:36128,DEPTH_STENCIL_ATTACHMENT:33306,NONE:0,FRAMEBUFFER_COMPLETE:36053,FRAMEBUFFER_INCOMPLETE_ATTACHMENT:36054,FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:36055,FRAMEBUFFER_INCOMPLETE_DIMENSIONS:36057,FRAMEBUFFER_UNSUPPORTED:36061,FRAMEBUFFER_BINDING:36006,RENDERBUFFER_BINDING:36007,MAX_RENDERBUFFER_SIZE:34024,INVALID_FRAMEBUFFER_OPERATION:1286,UNPACK_FLIP_Y_WEBGL:37440,UNPACK_PREMULTIPLY_ALPHA_WEBGL:37441,CONTEXT_LOST_WEBGL:37442,UNPACK_COLORSPACE_CONVERSION_WEBGL:37443,BROWSER_DEFAULT_WEBGL:37444};var Ct=rr.extend({material:null,geometry:null,mode:O.TRIANGLES,_renderInfo:null},{__program:null,lightGroup:0,renderOrder:0,culling:!0,cullFace:O.BACK,frontFace:O.CCW,frustumCulling:!0,receiveShadow:!0,castShadow:!0,ignorePicking:!1,ignorePreZ:!1,ignoreGBuffer:!1,isRenderable:function(){return this.geometry&&this.material&&this.material.shader&&!this.invisible&&this.geometry.vertexCount>0},beforeRender:function(e){},afterRender:function(e,t){},getBoundingBox:function(e,t){return t=rr.prototype.getBoundingBox.call(this,e,t),this.geometry&&this.geometry.boundingBox&&t.union(this.geometry.boundingBox),t},clone:(function(){var e=["castShadow","receiveShadow","mode","culling","cullFace","frontFace","frustumCulling","renderOrder","lineWidth","ignorePicking","ignorePreZ","ignoreGBuffer"];return function(){var t=rr.prototype.clone.call(this);t.geometry=this.geometry,t.material=this.material;for(var r=0;r<e.length;r++){var i=e[r];t[i]!==this[i]&&(t[i]=this[i])}return t}})()});Ct.POINTS=O.POINTS,Ct.LINES=O.LINES,Ct.LINE_LOOP=O.LINE_LOOP,Ct.LINE_STRIP=O.LINE_STRIP,Ct.TRIANGLES=O.TRIANGLES,Ct.TRIANGLE_STRIP=O.TRIANGLE_STRIP,Ct.TRIANGLE_FAN=O.TRIANGLE_FAN,Ct.BACK=O.BACK,Ct.FRONT=O.FRONT,Ct.FRONT_AND_BACK=O.FRONT_AND_BACK,Ct.CW=O.CW,Ct.CCW=O.CCW;let zs=Ct;var Lt=zs.extend({skeleton:null,joints:null},function(){this.joints||(this.joints=[])},{offsetMatrix:null,isInstancedMesh:function(){return!1},isSkinnedMesh:function(){return!!(this.skeleton&&this.joints&&this.joints.length>0)},clone:function(){var e=zs.prototype.clone.call(this);return e.skeleton=this.skeleton,this.joints&&(e.joints=this.joints.slice()),e}});Lt.POINTS=O.POINTS,Lt.LINES=O.LINES,Lt.LINE_LOOP=O.LINE_LOOP,Lt.LINE_STRIP=O.LINE_STRIP,Lt.TRIANGLES=O.TRIANGLES,Lt.TRIANGLE_STRIP=O.TRIANGLE_STRIP,Lt.TRIANGLE_FAN=O.TRIANGLE_FAN,Lt.BACK=O.BACK,Lt.FRONT=O.FRONT,Lt.FRONT_AND_BACK=O.FRONT_AND_BACK,Lt.CW=O.CW,Lt.CCW=O.CCW;let Kr=Lt;var Rh=["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear","OES_standard_derivatives","OES_vertex_array_object","OES_element_index_uint","WEBGL_compressed_texture_s3tc","WEBGL_depth_texture","EXT_texture_filter_anisotropic","EXT_shader_texture_lod","WEBGL_draw_buffers","EXT_frag_depth","EXT_sRGB","ANGLE_instanced_arrays"],Nh=["MAX_TEXTURE_SIZE","MAX_CUBE_MAP_TEXTURE_SIZE"];function a_(e){for(var t={},r={},i=0;i<Rh.length;i++){var n=Rh[i];o(n)}for(var i=0;i<Nh.length;i++){var a=Nh[i];r[a]=e.getParameter(e[a])}this.getExtension=function(s){return s in t||o(s),t[s]},this.getParameter=function(s){return r[s]};function o(s){if(e.getExtension){var l=e.getExtension(s);l||(l=e.getExtension("MOZ_"+s)),l||(l=e.getExtension("WEBKIT_"+s)),t[s]=l}}}let o_=a_;function s_(e){var t=new XMLHttpRequest;t.open("get",e.url),t.responseType=e.responseType||"text",e.onprogress&&(t.onprogress=function(r){if(r.lengthComputable){var i=r.loaded/r.total;e.onprogress(i,r.loaded,r.total)}else e.onprogress(null)}),t.onload=function(r){t.status>=400?e.onerror&&e.onerror():e.onload&&e.onload(t.response)},e.onerror&&(t.onerror=e.onerror),t.send(null)}let l_={get:s_};var Hs,_t={};_t.supportWebGL=function(){if(Hs==null)try{var e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");if(!t)throw new Error}catch{Hs=!1}return Hs},_t.Int8Array=typeof Int8Array>"u"?Array:Int8Array,_t.Uint8Array=typeof Uint8Array>"u"?Array:Uint8Array,_t.Uint16Array=typeof Uint16Array>"u"?Array:Uint16Array,_t.Uint32Array=typeof Uint32Array>"u"?Array:Uint32Array,_t.Int16Array=typeof Int16Array>"u"?Array:Int16Array,_t.Float32Array=typeof Float32Array>"u"?Array:Float32Array,_t.Float64Array=typeof Float64Array>"u"?Array:Float64Array;var Qr={};typeof window<"u"?Qr=window:typeof ka.g<"u"&&(Qr=ka.g),_t.requestAnimationFrame=Qr.requestAnimationFrame||Qr.msRequestAnimationFrame||Qr.mozRequestAnimationFrame||Qr.webkitRequestAnimationFrame||function(e){setTimeout(e,16)},_t.createCanvas=function(){return document.createElement("canvas")},_t.createImage=function(){return new Qr.Image},_t.request={get:l_.get},_t.addEventListener=function(e,t,r,i){e.addEventListener(t,r,i)},_t.removeEventListener=function(e,t,r){e.removeEventListener(t,r)};let Pe=_t;var Ke=function(){this.head=null,this.tail=null,this._length=0};Ke.prototype.insert=function(e){var t=new Ke.Entry(e);return this.insertEntry(t),t},Ke.prototype.insertAt=function(e,t){if(!(e<0)){for(var r=this.head,i=0;r&&i!=e;)r=r.next,i++;if(r){var n=new Ke.Entry(t),a=r.prev;a?(a.next=n,n.prev=a):this.head=n,n.next=r,r.prev=n}else this.insert(t)}},Ke.prototype.insertBeforeEntry=function(e,t){var r=new Ke.Entry(e),i=t.prev;i?(i.next=r,r.prev=i):this.head=r,r.next=t,t.prev=r,this._length++},Ke.prototype.insertEntry=function(e){this.head?(this.tail.next=e,e.prev=this.tail,this.tail=e):this.head=this.tail=e,this._length++},Ke.prototype.remove=function(e){var t=e.prev,r=e.next;t?t.next=r:this.head=r,r?r.prev=t:this.tail=t,e.next=e.prev=null,this._length--},Ke.prototype.removeAt=function(e){if(!(e<0)){for(var t=this.head,r=0;t&&r!=e;)t=t.next,r++;if(t)return this.remove(t),t.value}},Ke.prototype.getHead=function(){if(this.head)return this.head.value},Ke.prototype.getTail=function(){if(this.tail)return this.tail.value},Ke.prototype.getAt=function(e){if(!(e<0)){for(var t=this.head,r=0;t&&r!=e;)t=t.next,r++;return t.value}},Ke.prototype.indexOf=function(e){for(var t=this.head,r=0;t;){if(t.value===e)return r;t=t.next,r++}},Ke.prototype.length=function(){return this._length},Ke.prototype.isEmpty=function(){return this._length===0},Ke.prototype.forEach=function(e,t){for(var r=this.head,i=0,n=typeof t<"u";r;)n?e.call(t,r.value,i):e(r.value,i),r=r.next,i++},Ke.prototype.clear=function(){this.tail=this.head=null,this._length=0},Ke.Entry=function(e){this.value=e,this.next=null,this.prev=null};let u_=Ke;var Ui=function(e){this._list=new u_,this._map={},this._maxSize=e||10};Ui.prototype.setMaxSize=function(e){this._maxSize=e},Ui.prototype.put=function(e,t){if(!this._map.hasOwnProperty(e)){var r=this._list.length();if(r>=this._maxSize&&r>0){var i=this._list.head;this._list.remove(i),delete this._map[i.key]}var n=this._list.insert(t);n.key=e,this._map[e]=n}},Ui.prototype.get=function(e){var t=this._map[e];if(this._map.hasOwnProperty(e))return t!==this._list.tail&&(this._list.remove(t),this._list.insertEntry(t)),t.value},Ui.prototype.remove=function(e){var t=this._map[e];typeof t<"u"&&(delete this._map[e],this._list.remove(t))},Ui.prototype.clear=function(){this._list.clear(),this._map={}};let Ih=Ui;var Ae={},Oh={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function qt(e){return e=Math.round(e),e<0?0:e>255?255:e}function h_(e){return e=Math.round(e),e<0?0:e>360?360:e}function Rn(e){return e<0?0:e>1?1:e}function Vs(e){return e.length&&e.charAt(e.length-1)==="%"?qt(parseFloat(e)/100*255):qt(parseInt(e,10))}function zi(e){return e.length&&e.charAt(e.length-1)==="%"?Rn(parseFloat(e)/100):Rn(parseFloat(e))}function ks(e,t,r){return r<0?r+=1:r>1&&(r-=1),r*6<1?e+(t-e)*r*6:r*2<1?t:r*3<2?e+(t-e)*(.6666666666666666-r)*6:e}function Mr(e,t,r){return e+(t-e)*r}function Zt(e,t,r,i,n){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e}function Ws(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}var Bh=new Ih(20),Qa=null;function Hi(e,t){Qa&&Ws(Qa,t),Qa=Bh.put(e,Qa||t.slice())}Ae.parse=function(e,t){if(e){t=t||[];var r=Bh.get(e);if(r)return Ws(t,r);e=e+"";var i=e.replace(/ /g,"").toLowerCase();if(i in Oh)return Ws(t,Oh[i]),Hi(e,t),t;if(i.charAt(0)==="#"){if(i.length===4){var n=parseInt(i.substr(1),16);if(!(n>=0&&n<=4095)){Zt(t,0,0,0,1);return}return Zt(t,(n&3840)>>4|(n&3840)>>8,n&240|(n&240)>>4,n&15|(n&15)<<4,1),Hi(e,t),t}else if(i.length===7){var n=parseInt(i.substr(1),16);if(!(n>=0&&n<=16777215)){Zt(t,0,0,0,1);return}return Zt(t,(n&16711680)>>16,(n&65280)>>8,n&255,1),Hi(e,t),t}return}var a=i.indexOf("("),o=i.indexOf(")");if(a!==-1&&o+1===i.length){var s=i.substr(0,a),l=i.substr(a+1,o-(a+1)).split(","),u=1;switch(s){case"rgba":if(l.length!==4){Zt(t,0,0,0,1);return}u=zi(l.pop());case"rgb":if(l.length!==3){Zt(t,0,0,0,1);return}return Zt(t,Vs(l[0]),Vs(l[1]),Vs(l[2]),u),Hi(e,t),t;case"hsla":if(l.length!==4){Zt(t,0,0,0,1);return}return l[3]=zi(l[3]),Xs(l,t),Hi(e,t),t;case"hsl":if(l.length!==3){Zt(t,0,0,0,1);return}return Xs(l,t),Hi(e,t),t;default:return}}Zt(t,0,0,0,1)}},Ae.parseToFloat=function(e,t){if(t=Ae.parse(e,t),!!t)return t[0]/=255,t[1]/=255,t[2]/=255,t};function Xs(e,t){var r=(parseFloat(e[0])%360+360)%360/360,i=zi(e[1]),n=zi(e[2]),a=n<=.5?n*(i+1):n+i-n*i,o=n*2-a;return t=t||[],Zt(t,qt(ks(o,a,r+.3333333333333333)*255),qt(ks(o,a,r)*255),qt(ks(o,a,r-.3333333333333333)*255),1),e.length===4&&(t[3]=e[3]),t}function f_(e){if(e){var t=e[0]/255,r=e[1]/255,i=e[2]/255,n=Math.min(t,r,i),a=Math.max(t,r,i),o=a-n,s=(a+n)/2,l,u;if(o===0)l=0,u=0;else{s<.5?u=o/(a+n):u=o/(2-a-n);var h=((a-t)/6+o/2)/o,f=((a-r)/6+o/2)/o,c=((a-i)/6+o/2)/o;t===a?l=c-f:r===a?l=.3333333333333333+h-c:i===a&&(l=.6666666666666666+f-h),l<0&&(l+=1),l>1&&(l-=1)}var d=[l*360,u,s];return e[3]!=null&&d.push(e[3]),d}}Ae.lift=function(e,t){var r=Ae.parse(e);if(r){for(var i=0;i<3;i++)t<0?r[i]=r[i]*(1-t)|0:r[i]=(255-r[i])*t+r[i]|0;return Ae.stringify(r,r.length===4?"rgba":"rgb")}},Ae.toHex=function(e){var t=Ae.parse(e);if(t)return(16777216+(t[0]<<16)+(t[1]<<8)+ +t[2]).toString(16).slice(1)},Ae.fastLerp=function(e,t,r){if(!(!(t&&t.length)||!(e>=0&&e<=1))){r=r||[];var i=e*(t.length-1),n=Math.floor(i),a=Math.ceil(i),o=t[n],s=t[a],l=i-n;return r[0]=qt(Mr(o[0],s[0],l)),r[1]=qt(Mr(o[1],s[1],l)),r[2]=qt(Mr(o[2],s[2],l)),r[3]=Rn(Mr(o[3],s[3],l)),r}},Ae.fastMapToColor=Ae.fastLerp,Ae.lerp=function(e,t,r){if(!(!(t&&t.length)||!(e>=0&&e<=1))){var i=e*(t.length-1),n=Math.floor(i),a=Math.ceil(i),o=Ae.parse(t[n]),s=Ae.parse(t[a]),l=i-n,u=Ae.stringify([qt(Mr(o[0],s[0],l)),qt(Mr(o[1],s[1],l)),qt(Mr(o[2],s[2],l)),Rn(Mr(o[3],s[3],l))],"rgba");return r?{color:u,leftIndex:n,rightIndex:a,value:i}:u}},Ae.mapToColor=Ae.lerp,Ae.modifyHSL=function(e,t,r,i){if(e=Ae.parse(e),e)return e=f_(e),t!=null&&(e[0]=h_(t)),r!=null&&(e[1]=zi(r)),i!=null&&(e[2]=zi(i)),Ae.stringify(Xs(e),"rgba")},Ae.modifyAlpha=function(e,t){if(e=Ae.parse(e),e&&t!=null)return e[3]=Rn(t),Ae.stringify(e,"rgba")},Ae.stringify=function(e,t){if(!(!e||!e.length)){var r=e[0]+","+e[1]+","+e[2];return(t==="rgba"||t==="hsva"||t==="hsla")&&(r+=","+e[3]),t+"("+r+")"}};var c_=Ae.parseToFloat,js={};function Fh(e){var t=Object.keys(e);t.sort();for(var r=[],i=0;i<t.length;i++){var n=t[i],a=e[n];a===null?r.push(n):r.push(n+" "+a.toString())}return r.join(`
`)}function d_(e,t,r){r.sort();for(var i=[],n=0;n<r.length;n++){var a=r[n];i.push(a)}var o=Fh(e)+`
`+Fh(t)+`
`+i.join(`
`);if(js[o])return js[o];var s=tt.genGUID();return js[o]=s,s}var v_=vt.extend(function(){return{name:"",depthTest:!0,depthMask:!0,transparent:!1,blend:null,autoUpdateTextureStatus:!0,uniforms:{},vertexDefines:{},fragmentDefines:{},_textureStatus:{},_enabledUniforms:null}},function(){this.name||(this.name="MATERIAL_"+this.__uid__),this.shader&&this.attachShader(this.shader,!0)},{precision:"highp",setUniform:function(e,t){t===void 0&&console.warn('Uniform value "'+e+'" is undefined');var r=this.uniforms[e];r&&(typeof t=="string"&&(t=c_(t)||t),r.value=t,this.autoUpdateTextureStatus&&r.type==="t"&&(t?this.enableTexture(e):this.disableTexture(e)))},setUniforms:function(e){for(var t in e){var r=e[t];this.setUniform(t,r)}},isUniformEnabled:function(e){return this._enabledUniforms.indexOf(e)>=0},getEnabledUniforms:function(){return this._enabledUniforms},getTextureUniforms:function(){return this._textureUniforms},set:function(e,t){if(typeof e=="object")for(var r in e){var i=e[r];this.setUniform(r,i)}else this.setUniform(e,t)},get:function(e){var t=this.uniforms[e];if(t)return t.value},attachShader:function(e,t){var r=this.uniforms;this.uniforms=e.createUniforms(),this.shader=e;var i=this.uniforms;this._enabledUniforms=Object.keys(i),this._enabledUniforms.sort(),this._textureUniforms=this._enabledUniforms.filter(function(u){var h=this.uniforms[u].type;return h==="t"||h==="tv"},this);var n=this.vertexDefines,a=this.fragmentDefines;if(this.vertexDefines=tt.clone(e.vertexDefines),this.fragmentDefines=tt.clone(e.fragmentDefines),t){for(var o in r)i[o]&&(i[o].value=r[o].value);tt.defaults(this.vertexDefines,n),tt.defaults(this.fragmentDefines,a)}var s={};for(var l in e.textures)s[l]={shaderType:e.textures[l].shaderType,type:e.textures[l].type,enabled:t&&this._textureStatus[l]?this._textureStatus[l].enabled:!1};this._textureStatus=s,this._programKey=""},clone:function(){var e=new this.constructor({name:this.name,shader:this.shader});for(var t in this.uniforms)e.uniforms[t].value=this.uniforms[t].value;return e.depthTest=this.depthTest,e.depthMask=this.depthMask,e.transparent=this.transparent,e.blend=this.blend,e.vertexDefines=tt.clone(this.vertexDefines),e.fragmentDefines=tt.clone(this.fragmentDefines),e.enableTexture(this.getEnabledTextures()),e.precision=this.precision,e},define:function(e,t,r){var i=this.vertexDefines,n=this.fragmentDefines;e!=="vertex"&&e!=="fragment"&&e!=="both"&&arguments.length<3&&(r=t,t=e,e="both"),r=r??null,(e==="vertex"||e==="both")&&i[t]!==r&&(i[t]=r,this._programKey=""),(e==="fragment"||e==="both")&&n[t]!==r&&(n[t]=r,e!=="both"&&(this._programKey=""))},undefine:function(e,t){e!=="vertex"&&e!=="fragment"&&e!=="both"&&arguments.length<2&&(t=e,e="both"),(e==="vertex"||e==="both")&&this.isDefined("vertex",t)&&(delete this.vertexDefines[t],this._programKey=""),(e==="fragment"||e==="both")&&this.isDefined("fragment",t)&&(delete this.fragmentDefines[t],e!=="both"&&(this._programKey=""))},isDefined:function(e,t){switch(e){case"vertex":return this.vertexDefines[t]!==void 0;case"fragment":return this.fragmentDefines[t]!==void 0}},getDefine:function(e,t){switch(e){case"vertex":return this.vertexDefines[t];case"fragment":return this.fragmentDefines[t]}},enableTexture:function(e){if(Array.isArray(e)){for(var t=0;t<e.length;t++)this.enableTexture(e[t]);return}var r=this._textureStatus[e];if(r){var i=r.enabled;i||(r.enabled=!0,this._programKey="")}},enableTexturesAll:function(){var e=this._textureStatus;for(var t in e)e[t].enabled=!0;this._programKey=""},disableTexture:function(e){if(Array.isArray(e)){for(var t=0;t<e.length;t++)this.disableTexture(e[t]);return}var r=this._textureStatus[e];if(r){var i=!r.enabled;i||(r.enabled=!1,this._programKey="")}},disableTexturesAll:function(){var e=this._textureStatus;for(var t in e)e[t].enabled=!1;this._programKey=""},isTextureEnabled:function(e){var t=this._textureStatus;return!!t[e]&&t[e].enabled},getEnabledTextures:function(){var e=[],t=this._textureStatus;for(var r in t)t[r].enabled&&e.push(r);return e},dirtyDefines:function(){this._programKey=""},getProgramKey:function(){return this._programKey||(this._programKey=d_(this.vertexDefines,this.fragmentDefines,this.getEnabledTextures())),this._programKey}});let Gt=v_;var $={};$.create=function(){var e=new rt(2);return e[0]=0,e[1]=0,e},$.clone=function(e){var t=new rt(2);return t[0]=e[0],t[1]=e[1],t},$.fromValues=function(e,t){var r=new rt(2);return r[0]=e,r[1]=t,r},$.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e},$.set=function(e,t,r){return e[0]=t,e[1]=r,e},$.add=function(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e},$.subtract=function(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e},$.sub=$.subtract,$.multiply=function(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e},$.mul=$.multiply,$.divide=function(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e},$.div=$.divide,$.min=function(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e},$.max=function(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e},$.scale=function(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e},$.scaleAndAdd=function(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e},$.distance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1];return Math.sqrt(r*r+i*i)},$.dist=$.distance,$.squaredDistance=function(e,t){var r=t[0]-e[0],i=t[1]-e[1];return r*r+i*i},$.sqrDist=$.squaredDistance,$.length=function(e){var t=e[0],r=e[1];return Math.sqrt(t*t+r*r)},$.len=$.length,$.squaredLength=function(e){var t=e[0],r=e[1];return t*t+r*r},$.sqrLen=$.squaredLength,$.negate=function(e,t){return e[0]=-t[0],e[1]=-t[1],e},$.inverse=function(e,t){return e[0]=1/t[0],e[1]=1/t[1],e},$.normalize=function(e,t){var r=t[0],i=t[1],n=r*r+i*i;return n>0&&(n=1/Math.sqrt(n),e[0]=t[0]*n,e[1]=t[1]*n),e},$.dot=function(e,t){return e[0]*t[0]+e[1]*t[1]},$.cross=function(e,t,r){var i=t[0]*r[1]-t[1]*r[0];return e[0]=e[1]=0,e[2]=i,e},$.lerp=function(e,t,r,i){var n=t[0],a=t[1];return e[0]=n+i*(r[0]-n),e[1]=a+i*(r[1]-a),e},$.random=function(e,t){t=t||1;var r=GLMAT_RANDOM()*2*Math.PI;return e[0]=Math.cos(r)*t,e[1]=Math.sin(r)*t,e},$.transformMat2=function(e,t,r){var i=t[0],n=t[1];return e[0]=r[0]*i+r[2]*n,e[1]=r[1]*i+r[3]*n,e},$.transformMat2d=function(e,t,r){var i=t[0],n=t[1];return e[0]=r[0]*i+r[2]*n+r[4],e[1]=r[1]*i+r[3]*n+r[5],e},$.transformMat3=function(e,t,r){var i=t[0],n=t[1];return e[0]=r[0]*i+r[3]*n+r[6],e[1]=r[1]*i+r[4]*n+r[7],e},$.transformMat4=function(e,t,r){var i=t[0],n=t[1];return e[0]=r[0]*i+r[4]*n+r[12],e[1]=r[1]*i+r[5]*n+r[13],e},$.forEach=(function(){var e=$.create();return function(t,r,i,n,a,o){var s,l;for(r||(r=2),i||(i=0),n?l=Math.min(n*r+i,t.length):l=t.length,s=i;s<l;s+=r)e[0]=t[s],e[1]=t[s+1],a(e,e,o),t[s]=e[0],t[s+1]=e[1];return t}})();let q=$;var ae=function(e,t){e=e||0,t=t||0,this.array=q.fromValues(e,t),this._dirty=!0};if(ae.prototype={constructor:ae,add:function(e){return q.add(this.array,this.array,e.array),this._dirty=!0,this},set:function(e,t){return this.array[0]=e,this.array[1]=t,this._dirty=!0,this},setArray:function(e){return this.array[0]=e[0],this.array[1]=e[1],this._dirty=!0,this},clone:function(){return new ae(this.x,this.y)},copy:function(e){return q.copy(this.array,e.array),this._dirty=!0,this},cross:function(e,t){return q.cross(e.array,this.array,t.array),e._dirty=!0,this},dist:function(e){return q.dist(this.array,e.array)},distance:function(e){return q.distance(this.array,e.array)},div:function(e){return q.div(this.array,this.array,e.array),this._dirty=!0,this},divide:function(e){return q.divide(this.array,this.array,e.array),this._dirty=!0,this},dot:function(e){return q.dot(this.array,e.array)},len:function(){return q.len(this.array)},length:function(){return q.length(this.array)},lerp:function(e,t,r){return q.lerp(this.array,e.array,t.array,r),this._dirty=!0,this},min:function(e){return q.min(this.array,this.array,e.array),this._dirty=!0,this},max:function(e){return q.max(this.array,this.array,e.array),this._dirty=!0,this},mul:function(e){return q.mul(this.array,this.array,e.array),this._dirty=!0,this},multiply:function(e){return q.multiply(this.array,this.array,e.array),this._dirty=!0,this},negate:function(){return q.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return q.normalize(this.array,this.array),this._dirty=!0,this},random:function(e){return q.random(this.array,e),this._dirty=!0,this},scale:function(e){return q.scale(this.array,this.array,e),this._dirty=!0,this},scaleAndAdd:function(e,t){return q.scaleAndAdd(this.array,this.array,e.array,t),this._dirty=!0,this},sqrDist:function(e){return q.sqrDist(this.array,e.array)},squaredDistance:function(e){return q.squaredDistance(this.array,e.array)},sqrLen:function(){return q.sqrLen(this.array)},squaredLength:function(){return q.squaredLength(this.array)},sub:function(e){return q.sub(this.array,this.array,e.array),this._dirty=!0,this},subtract:function(e){return q.subtract(this.array,this.array,e.array),this._dirty=!0,this},transformMat2:function(e){return q.transformMat2(this.array,this.array,e.array),this._dirty=!0,this},transformMat2d:function(e){return q.transformMat2d(this.array,this.array,e.array),this._dirty=!0,this},transformMat3:function(e){return q.transformMat3(this.array,this.array,e.array),this._dirty=!0,this},transformMat4:function(e){return q.transformMat4(this.array,this.array,e.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},Object.defineProperty){var Gh=ae.prototype;Object.defineProperty(Gh,"x",{get:function(){return this.array[0]},set:function(e){this.array[0]=e,this._dirty=!0}}),Object.defineProperty(Gh,"y",{get:function(){return this.array[1]},set:function(e){this.array[1]=e,this._dirty=!0}})}ae.add=function(e,t,r){return q.add(e.array,t.array,r.array),e._dirty=!0,e},ae.set=function(e,t,r){return q.set(e.array,t,r),e._dirty=!0,e},ae.copy=function(e,t){return q.copy(e.array,t.array),e._dirty=!0,e},ae.cross=function(e,t,r){return q.cross(e.array,t.array,r.array),e._dirty=!0,e},ae.dist=function(e,t){return q.distance(e.array,t.array)},ae.distance=ae.dist,ae.div=function(e,t,r){return q.divide(e.array,t.array,r.array),e._dirty=!0,e},ae.divide=ae.div,ae.dot=function(e,t){return q.dot(e.array,t.array)},ae.len=function(e){return q.length(e.array)},ae.lerp=function(e,t,r,i){return q.lerp(e.array,t.array,r.array,i),e._dirty=!0,e},ae.min=function(e,t,r){return q.min(e.array,t.array,r.array),e._dirty=!0,e},ae.max=function(e,t,r){return q.max(e.array,t.array,r.array),e._dirty=!0,e},ae.mul=function(e,t,r){return q.multiply(e.array,t.array,r.array),e._dirty=!0,e},ae.multiply=ae.mul,ae.negate=function(e,t){return q.negate(e.array,t.array),e._dirty=!0,e},ae.normalize=function(e,t){return q.normalize(e.array,t.array),e._dirty=!0,e},ae.random=function(e,t){return q.random(e.array,t),e._dirty=!0,e},ae.scale=function(e,t,r){return q.scale(e.array,t.array,r),e._dirty=!0,e},ae.scaleAndAdd=function(e,t,r,i){return q.scaleAndAdd(e.array,t.array,r.array,i),e._dirty=!0,e},ae.sqrDist=function(e,t){return q.sqrDist(e.array,t.array)},ae.squaredDistance=ae.sqrDist,ae.sqrLen=function(e){return q.sqrLen(e.array)},ae.squaredLength=ae.sqrLen,ae.sub=function(e,t,r){return q.subtract(e.array,t.array,r.array),e._dirty=!0,e},ae.subtract=ae.sub,ae.transformMat2=function(e,t,r){return q.transformMat2(e.array,t.array,r.array),e._dirty=!0,e},ae.transformMat2d=function(e,t,r){return q.transformMat2d(e.array,t.array,r.array),e._dirty=!0,e},ae.transformMat3=function(e,t,r){return q.transformMat3(e.array,t.array,r.array),e._dirty=!0,e},ae.transformMat4=function(e,t,r){return q.transformMat4(e.array,t.array,r.array),e._dirty=!0,e};let Pt=ae;var Uh=1,zh=2,qs=3,Hh={};function p_(e){for(var t=e.split(`
`),r=0,i=t.length;r<i;r++)t[r]=r+1+": "+t[r];return t.join(`
`)}function Vh(e,t,r){if(!e.getShaderParameter(t,e.COMPILE_STATUS))return[e.getShaderInfoLog(t),p_(r)].join(`
`)}var kh=new Pe.Float32Array(16),__=vt.extend({uniformSemantics:{},attributes:{}},function(){this._locations={},this._textureSlot=0,this._program=null},{bind:function(e){this._textureSlot=0,e.gl.useProgram(this._program)},hasUniform:function(e){var t=this._locations[e];return t!=null},useTextureSlot:function(e,t,r){t&&(e.gl.activeTexture(e.gl.TEXTURE0+r),t.isRenderable()?t.bind(e):t.unbind(e))},currentTextureSlot:function(){return this._textureSlot},resetTextureSlot:function(e){this._textureSlot=e||0},takeCurrentTextureSlot:function(e,t){var r=this._textureSlot;return this.useTextureSlot(e,t,r),this._textureSlot++,r},setUniform:function(e,t,r,i){var n=this._locations,a=n[r];if(a==null)return!1;switch(t){case"m4":if(!(i instanceof Float32Array)){for(var o=0;o<i.length;o++)kh[o]=i[o];i=kh}e.uniformMatrix4fv(a,!1,i);break;case"2i":e.uniform2i(a,i[0],i[1]);break;case"2f":e.uniform2f(a,i[0],i[1]);break;case"3i":e.uniform3i(a,i[0],i[1],i[2]);break;case"3f":e.uniform3f(a,i[0],i[1],i[2]);break;case"4i":e.uniform4i(a,i[0],i[1],i[2],i[3]);break;case"4f":e.uniform4f(a,i[0],i[1],i[2],i[3]);break;case"1i":e.uniform1i(a,i);break;case"1f":e.uniform1f(a,i);break;case"1fv":e.uniform1fv(a,i);break;case"1iv":e.uniform1iv(a,i);break;case"2iv":e.uniform2iv(a,i);break;case"2fv":e.uniform2fv(a,i);break;case"3iv":e.uniform3iv(a,i);break;case"3fv":e.uniform3fv(a,i);break;case"4iv":e.uniform4iv(a,i);break;case"4fv":e.uniform4fv(a,i);break;case"m2":case"m2v":e.uniformMatrix2fv(a,!1,i);break;case"m3":case"m3v":e.uniformMatrix3fv(a,!1,i);break;case"m4v":if(Array.isArray(i)&&Array.isArray(i[0])){for(var s=new Pe.Float32Array(i.length*16),l=0,o=0;o<i.length;o++)for(var u=i[o],h=0;h<16;h++)s[l++]=u[h];e.uniformMatrix4fv(a,!1,s)}else e.uniformMatrix4fv(a,!1,i);break}return!0},setUniformOfSemantic:function(e,t,r){var i=this.uniformSemantics[t];return i?this.setUniform(e,i.type,i.symbol,r):!1},enableAttributes:function(e,t,r){var i=e.gl,n=this._program,a=this._locations,o;r?o=r.__enabledAttributeList:o=Hh[e.__uid__],o||(r?o=r.__enabledAttributeList=[]:o=Hh[e.__uid__]=[]);for(var s=[],l=0;l<t.length;l++){var u=t[l];if(!this.attributes[u]){s[l]=-1;continue}var h=a[u];if(h==null){if(h=i.getAttribLocation(n,u),h===-1){s[l]=-1;continue}a[u]=h}s[l]=h,o[h]?o[h]=zh:o[h]=Uh}for(var l=0;l<o.length;l++)switch(o[l]){case Uh:i.enableVertexAttribArray(l),o[l]=qs;break;case zh:o[l]=qs;break;case qs:i.disableVertexAttribArray(l),o[l]=0;break}return s},getAttribLocation:function(e,t){var r=this._locations,i=r[t];return i==null&&(i=e.getAttribLocation(this._program,t),r[t]=i),i},buildProgram:function(e,t,r,i){var n=e.createShader(e.VERTEX_SHADER),a=e.createProgram();e.shaderSource(n,r),e.compileShader(n);var o=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(o,i),e.compileShader(o);var s=Vh(e,n,r);if(s||(s=Vh(e,o,i),s))return s;if(e.attachShader(a,n),e.attachShader(a,o),t.attributeSemantics.POSITION)e.bindAttribLocation(a,0,t.attributeSemantics.POSITION.symbol);else{var l=Object.keys(this.attributes);e.bindAttribLocation(a,0,l[0])}if(e.linkProgram(a),e.deleteShader(n),e.deleteShader(o),this._program=a,this.vertexCode=r,this.fragmentCode=i,!e.getProgramParameter(a,e.LINK_STATUS))return`Could not link program
`+e.getProgramInfoLog(a);for(var u=0;u<t.uniforms.length;u++){var h=t.uniforms[u];this._locations[h]=e.getUniformLocation(a,h)}}});let g_=__;var m_=/for\s*?\(int\s*?_idx_\s*\=\s*([\w-]+)\;\s*_idx_\s*<\s*([\w-]+);\s*_idx_\s*\+\+\s*\)\s*\{\{([\s\S]+?)(?=\}\})\}\}/g;function Wh(e,t,r){function i(o,s,l,u){var h="";isNaN(s)&&(s in t?s=t[s]:s=n[s]),isNaN(l)&&(l in t?l=t[l]:l=n[l]);for(var f=parseInt(s);f<parseInt(l);f++)h+="{"+u.replace(/float\s*\(\s*_idx_\s*\)/g,f.toFixed(1)).replace(/_idx_/g,f)+"}";return h}var n={};for(var a in r)n[a+"_COUNT"]=r[a];return e.replace(m_,i)}function Zs(e,t,r){var i=[];if(t)for(var n in t){var a=t[n];a>0&&i.push("#define "+n.toUpperCase()+"_COUNT "+a)}if(r)for(var o=0;o<r.length;o++){var s=r[o];i.push("#define "+s.toUpperCase()+"_ENABLED")}for(var s in e){var l=e[s];l===null?i.push("#define "+s):i.push("#define "+s+" "+l.toString())}return i.join(`
`)}function y_(e){for(var t=[],r=0;r<e.length;r++)t.push("#extension GL_"+e[r]+" : enable");return t.join(`
`)}function x_(e){return["precision",e,"float"].join(" ")+`;
`+["precision",e,"int"].join(" ")+`;
`+["precision",e,"sampler2D"].join(" ")+`;
`}function Xh(e){this._renderer=e,this._cache={}}Xh.prototype.getProgram=function(e,t,r){var i=this._cache,n=e.isSkinnedMesh&&e.isSkinnedMesh(),a=e.isInstancedMesh&&e.isInstancedMesh(),o="s"+t.shader.shaderID+"m"+t.getProgramKey();r&&(o+="se"+r.getProgramKey(e.lightGroup)),n&&(o+=",sk"+e.joints.length),a&&(o+=",is");var x=i[o];if(x)return x;var s=r?r.getLightsNumbers(e.lightGroup):{},l=this._renderer,u=l.gl,h=t.getEnabledTextures(),f="";if(n){var c={SKINNING:null,JOINT_COUNT:e.joints.length};e.joints.length>l.getMaxJointNumber()&&(c.USE_SKIN_MATRICES_TEXTURE=null),f+=`
`+Zs(c)+`
`}a&&(f+=`
#define INSTANCING
`);var d=f+Zs(t.vertexDefines,s,h),v=f+Zs(t.fragmentDefines,s,h),p=d+`
`+t.shader.vertex,_=["OES_standard_derivatives","EXT_shader_texture_lod"].filter(function(T){return l.getGLExtension(T)!=null});_.indexOf("EXT_shader_texture_lod")>=0&&(v+=`
#define SUPPORT_TEXTURE_LOD`),_.indexOf("OES_standard_derivatives")>=0&&(v+=`
#define SUPPORT_STANDARD_DERIVATIVES`);var g=y_(_)+`
`+x_(t.precision)+`
`+v+`
`+t.shader.fragment,m=Wh(p,t.vertexDefines,s),y=Wh(g,t.fragmentDefines,s),x=new g_;x.uniformSemantics=t.shader.uniformSemantics,x.attributes=t.shader.attributes;var w=x.buildProgram(u,t.shader,m,y);return x.__error=w,i[o]=x,x};let T_=Xh;var jh=/uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g,w_=/attribute\s+(float|int|vec2|vec3|vec4)\s+([\s\S]*?);/g,qh=/#define\s+(\w+)?(\s+[\d-.]+)?\s*;?\s*\n/g,S_={bool:"1i",int:"1i",sampler2D:"t",samplerCube:"t",float:"1f",vec2:"2f",vec3:"3f",vec4:"4f",ivec2:"2i",ivec3:"3i",ivec4:"4i",mat2:"m2",mat3:"m3",mat4:"m4"};function pr(e){for(var t=[],r=0;r<e;r++)t[r]=0;return t}var Zh={bool:function(){return!0},int:function(){return 0},float:function(){return 0},sampler2D:function(){return null},samplerCube:function(){return null},vec2:function(){return pr(2)},vec3:function(){return pr(3)},vec4:function(){return pr(4)},ivec2:function(){return pr(2)},ivec3:function(){return pr(3)},ivec4:function(){return pr(4)},mat2:function(){return pr(4)},mat3:function(){return pr(9)},mat4:function(){return pr(16)},array:function(){return[]}},Ys=["POSITION","NORMAL","BINORMAL","TANGENT","TEXCOORD","TEXCOORD_0","TEXCOORD_1","COLOR","JOINT","WEIGHT"],Yh=["SKIN_MATRIX","VIEWPORT_SIZE","VIEWPORT","DEVICEPIXELRATIO","WINDOW_SIZE","NEAR","FAR","TIME"],Kh=["WORLD","VIEW","PROJECTION","WORLDVIEW","VIEWPROJECTION","WORLDVIEWPROJECTION","WORLDINVERSE","VIEWINVERSE","PROJECTIONINVERSE","WORLDVIEWINVERSE","VIEWPROJECTIONINVERSE","WORLDVIEWPROJECTIONINVERSE","WORLDTRANSPOSE","VIEWTRANSPOSE","PROJECTIONTRANSPOSE","WORLDVIEWTRANSPOSE","VIEWPROJECTIONTRANSPOSE","WORLDVIEWPROJECTIONTRANSPOSE","WORLDINVERSETRANSPOSE","VIEWINVERSETRANSPOSE","PROJECTIONINVERSETRANSPOSE","WORLDVIEWINVERSETRANSPOSE","VIEWPROJECTIONINVERSETRANSPOSE","WORLDVIEWPROJECTIONINVERSETRANSPOSE"],b_={vec4:4,vec3:3,vec2:2,float:1},Ks={},Qh={};function E_(e,t){var r="vertex:"+e+"fragment:"+t;if(Ks[r])return Ks[r];var i=tt.genGUID();return Ks[r]=i,Qh[i]={vertex:e,fragment:t},i}function Jh(e){return e.replace(/[ \t]*\/\/.*\n/g,"").replace(/[ \t]*\/\*[\s\S]*?\*\//g,"")}function Vi(){console.error("Wrong uniform/attributes syntax")}function $h(e,t){for(var r=/[,=\(\):]/,i=t.replace(/:\s*\[\s*(.*)\s*\]/g,"="+e+"($1)").replace(/\s+/g,"").split(/(?=[,=\(\):])/g),n=[],a=0;a<i.length;a++)i[a].match(r)?n.push(i[a].charAt(0),i[a].slice(1)):n.push(i[a]);i=n;var o=0,s=1,l=2,u=3,h=4,f=5,c=o,d={},v=null,p;_(i[0]);function _(y){y||Vi();var x=y.match(/\[(.*?)\]/);p=y.replace(/\[(.*?)\]/,""),d[p]={},x&&(d[p].isArray=!0,d[p].arraySize=x[1])}for(var a=1;a<i.length;a++){var g=i[a];if(g){if(g==="="){if(c!==o&&c!==u){Vi();break}c=s;continue}else if(g===":"){c=h;continue}else if(g===","){if(c===l){if(!(v instanceof Array)){Vi();break}v.push(+i[++a])}else c=f;continue}else if(g===")"){d[p].value=new Pe.Float32Array(v),v=null,c=f;continue}else if(g==="("){if(c!==l){Vi();break}if(!(v instanceof Array)){Vi();break}v.push(+i[++a]);continue}else if(g.indexOf("vec")>=0){if(c!==s&&c!==h){Vi();break}c=l,v=[];continue}else if(c===s){e==="bool"?d[p].value=g==="true":d[p].value=parseFloat(g),v=null;continue}else if(c===h){var m=g;Ys.indexOf(m)>=0||Yh.indexOf(m)>=0||Kh.indexOf(m)>=0?d[p].semantic=m:m==="ignore"||m==="unconfigurable"?d[p].ignore=!0:e==="bool"?d[p].value=m==="true":d[p].value=parseFloat(m);continue}_(g),c=o}}return d}function Xe(e,t){typeof e=="object"&&(t=e.fragment,e=e.vertex),e=Jh(e),t=Jh(t),this._shaderID=E_(e,t),this._vertexCode=Xe.parseImport(e),this._fragmentCode=Xe.parseImport(t),this.attributeSemantics={},this.matrixSemantics={},this.uniformSemantics={},this.matrixSemanticKeys=[],this.uniformTemplates={},this.attributes={},this.textures={},this.vertexDefines={},this.fragmentDefines={},this._parseAttributes(),this._parseUniforms(),this._parseDefines()}Xe.prototype={constructor:Xe,createUniforms:function(){var e={};for(var t in this.uniformTemplates){var r=this.uniformTemplates[t];e[t]={type:r.type,value:r.value()}}return e},_parseImport:function(){this._vertexCode=Xe.parseImport(this.vertex),this._fragmentCode=Xe.parseImport(this.fragment)},_addSemanticUniform:function(e,t,r){if(Ys.indexOf(r)>=0)this.attributeSemantics[r]={symbol:e,type:t};else if(Kh.indexOf(r)>=0){var i=!1,n=r;r.match(/TRANSPOSE$/)&&(i=!0,n=r.slice(0,-9)),this.matrixSemantics[r]={symbol:e,type:t,isTranspose:i,semanticNoTranspose:n}}else Yh.indexOf(r)>=0&&(this.uniformSemantics[r]={symbol:e,type:t})},_addMaterialUniform:function(e,t,r,i,n,a){a[e]={type:r,value:n?Zh.array:i||Zh[t],semantic:null}},_parseUniforms:function(){var e={},t=this,r="vertex";this._uniformList=[],this._vertexCode=this._vertexCode.replace(jh,n),r="fragment",this._fragmentCode=this._fragmentCode.replace(jh,n),t.matrixSemanticKeys=Object.keys(this.matrixSemantics);function i(a){return a!=null?function(){return a}:null}function n(a,o,s){var l=$h(o,s),u=[];for(var h in l){var f=l[h],c=f.semantic,d=h,v=S_[o],p=i(l[h].value);l[h].isArray&&(d+="["+l[h].arraySize+"]",v+="v"),u.push(d),t._uniformList.push(h),f.ignore||((o==="sampler2D"||o==="samplerCube")&&(t.textures[h]={shaderType:r,type:o}),c?t._addSemanticUniform(h,v,c):t._addMaterialUniform(h,o,v,p,l[h].isArray,e))}return u.length>0?"uniform "+o+" "+u.join(",")+`;
`:""}this.uniformTemplates=e},_parseAttributes:function(){var e={},t=this;this._vertexCode=this._vertexCode.replace(w_,r);function r(i,n,a){var o=$h(n,a),s=b_[n]||1,l=[];for(var u in o){var h=o[u].semantic;if(e[u]={type:"float",size:s,semantic:h||null},h){if(Ys.indexOf(h)<0)throw new Error('Unkown semantic "'+h+'"');t.attributeSemantics[h]={symbol:u,type:n}}l.push(u)}return"attribute "+n+" "+l.join(",")+`;
`}this.attributes=e},_parseDefines:function(){var e=this,t="vertex";this._vertexCode=this._vertexCode.replace(qh,r),t="fragment",this._fragmentCode=this._fragmentCode.replace(qh,r);function r(i,n,a){var o=t==="vertex"?e.vertexDefines:e.fragmentDefines;return o[n]||(a==="false"?o[n]=!1:a==="true"?o[n]=!0:o[n]=a?isNaN(parseFloat(a))?a.trim():parseFloat(a):null),""}},clone:function(){var e=Qh[this._shaderID],t=new Xe(e.vertex,e.fragment);return t}},Object.defineProperty&&(Object.defineProperty(Xe.prototype,"shaderID",{get:function(){return this._shaderID}}),Object.defineProperty(Xe.prototype,"vertex",{get:function(){return this._vertexCode}}),Object.defineProperty(Xe.prototype,"fragment",{get:function(){return this._fragmentCode}}),Object.defineProperty(Xe.prototype,"uniforms",{get:function(){return this._uniformList}}));var A_=/(@import)\s*([0-9a-zA-Z_\-\.]*)/g;Xe.parseImport=function(e){return e=e.replace(A_,function(n,r,i){var n=Xe.source(i);return n?Xe.parseImport(n):(console.error('Shader chunk "'+i+'" not existed in library'),"")}),e};var M_=/(@export)\s*([0-9a-zA-Z_\-\.]*)\s*\n([\s\S]*?)@end/g;Xe.import=function(e){e.replace(M_,function(t,r,i,a){var a=a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+\x24)/g,"");if(a){for(var o=i.split("."),s=Xe.codes,l=0,u;l<o.length-1;)u=o[l++],s[u]||(s[u]={}),s=s[u];u=o[l],s[u]=a}return a})},Xe.codes={},Xe.source=function(e){for(var t=e.split("."),r=Xe.codes,i=0;r&&i<t.length;){var n=t[i++];r=r[n]}return typeof r!="string"?(console.error('Shader "'+e+'" not existed in library'),""):r};let V=Xe,ef=`@export clay.prez.vertex
uniform mat4 WVP : WORLDVIEWPROJECTION;
attribute vec3 pos : POSITION;
attribute vec2 uv : TEXCOORD_0;
uniform vec2 uvRepeat : [1.0, 1.0];
uniform vec2 uvOffset : [0.0, 0.0];
@import clay.chunk.skinning_header
@import clay.chunk.instancing_header
varying vec2 v_Texcoord;
void main()
{
 vec4 P = vec4(pos, 1.0);
#ifdef SKINNING
 @import clay.chunk.skin_matrix
 P = skinMatrixWS * P;
#endif
#ifdef INSTANCING
 @import clay.chunk.instancing_matrix
 P = instanceMat * P;
#endif
 gl_Position = WVP * P;
 v_Texcoord = uv * uvRepeat + uvOffset;
}
@end
@export clay.prez.fragment
uniform sampler2D alphaMap;
uniform float alphaCutoff: 0.0;
varying vec2 v_Texcoord;
void main()
{
 if (alphaCutoff > 0.0) {
 if (texture2D(alphaMap, v_Texcoord).a <= alphaCutoff) {
 discard;
 }
 }
 gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
@end`;V.import(ef);var Se=U.create,tf={};function rf(e){return e.material}function D_(e,t,r){return t.uniforms[r].value}function C_(e,t,r,i){return r!==i}function L_(e){return!0}function nf(){}var af={float:O.FLOAT,byte:O.BYTE,ubyte:O.UNSIGNED_BYTE,short:O.SHORT,ushort:O.UNSIGNED_SHORT};function P_(e,t,r){this.availableAttributes=e,this.availableAttributeSymbols=t,this.indicesBuffer=r,this.vao=null}function R_(e){var t,r;this.bind=function(i){t||(t=Pe.createCanvas(),t.width=t.height=1,t.getContext("2d"));var n=i.gl,a=!r;a&&(r=n.createTexture()),n.bindTexture(n.TEXTURE_2D,r),a&&n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,t)},this.unbind=function(i){i.gl.bindTexture(i.gl.TEXTURE_2D,null)},this.isRenderable=function(){return!0}}var Dr=vt.extend(function(){return{canvas:null,_width:100,_height:100,devicePixelRatio:typeof window<"u"&&window.devicePixelRatio||1,clearColor:[0,0,0,0],clearBit:17664,alpha:!0,depth:!0,stencil:!1,antialias:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1,throwError:!0,gl:null,viewport:{},maxJointNumber:20,__currentFrameBuffer:null,_viewportStack:[],_clearStack:[],_sceneRendering:null}},function(){this.canvas||(this.canvas=Pe.createCanvas());var e=this.canvas;try{var t={alpha:this.alpha,depth:this.depth,stencil:this.stencil,antialias:this.antialias,premultipliedAlpha:this.premultipliedAlpha,preserveDrawingBuffer:this.preserveDrawingBuffer};if(this.gl=e.getContext("webgl",t)||e.getContext("experimental-webgl",t),!this.gl)throw new Error;this._glinfo=new o_(this.gl),this.gl.targetRenderer&&console.error("Already created a renderer"),this.gl.targetRenderer=this,this.resize()}catch(r){throw"Error creating WebGL Context "+r}this._programMgr=new T_(this),this._placeholderTexture=new R_(this)},{resize:function(e,t){var r=this.canvas,i=this.devicePixelRatio;e!=null?(r.style&&(r.style.width=e+"px",r.style.height=t+"px"),r.width=e*i,r.height=t*i,this._width=e,this._height=t):(this._width=r.width/i,this._height=r.height/i),this.setViewport(0,0,this._width,this._height)},getWidth:function(){return this._width},getHeight:function(){return this._height},getViewportAspect:function(){var e=this.viewport;return e.width/e.height},setDevicePixelRatio:function(e){this.devicePixelRatio=e,this.resize(this._width,this._height)},getDevicePixelRatio:function(){return this.devicePixelRatio},getGLExtension:function(e){return this._glinfo.getExtension(e)},getGLParameter:function(e){return this._glinfo.getParameter(e)},setViewport:function(e,t,r,i,n){if(typeof e=="object"){var a=e;e=a.x,t=a.y,r=a.width,i=a.height,n=a.devicePixelRatio}n=n||this.devicePixelRatio,this.gl.viewport(e*n,t*n,r*n,i*n),this.viewport={x:e,y:t,width:r,height:i,devicePixelRatio:n}},saveViewport:function(){this._viewportStack.push(this.viewport)},restoreViewport:function(){this._viewportStack.length>0&&this.setViewport(this._viewportStack.pop())},saveClear:function(){this._clearStack.push({clearBit:this.clearBit,clearColor:this.clearColor})},restoreClear:function(){if(this._clearStack.length>0){var e=this._clearStack.pop();this.clearColor=e.clearColor,this.clearBit=e.clearBit}},bindSceneRendering:function(e){this._sceneRendering=e},render:function(e,t,r,i){var n=this.gl,a=this.clearColor;if(this.clearBit){n.colorMask(!0,!0,!0,!0),n.depthMask(!0);var o=this.viewport,s=!1,l=o.devicePixelRatio;(o.width!==this._width||o.height!==this._height||l&&l!==this.devicePixelRatio||o.x||o.y)&&(s=!0,n.enable(n.SCISSOR_TEST),n.scissor(o.x*l,o.y*l,o.width*l,o.height*l)),n.clearColor(a[0],a[1],a[2],a[3]),n.clear(this.clearBit),s&&n.disable(n.SCISSOR_TEST)}if(r||e.update(!1),e.updateLights(),t=t||e.getMainCamera(),!t){console.error("Can't find camera in the scene.");return}t.update();var u=e.updateRenderList(t,!0);this._sceneRendering=e;var h=u.opaque,f=u.transparent,c=e.material;e.trigger("beforerender",this,e,t,u),i?(this.renderPreZ(h,e,t),n.depthFunc(n.LEQUAL)):n.depthFunc(n.LESS);for(var d=Se(),v=C.create(),p=0;p<f.length;p++){var _=f[p];U.multiplyAffine(d,t.viewMatrix.array,_.worldTransform.array),C.transformMat4(v,_.position.array,d),_.__depth=v[2]}this.renderPass(h,t,{getMaterial:function(g){return c||g.material},sortCompare:this.opaqueSortCompare}),this.renderPass(f,t,{getMaterial:function(g){return c||g.material},sortCompare:this.transparentSortCompare}),e.trigger("afterrender",this,e,t,u),this._sceneRendering=null},getProgram:function(e,t,r){return t=t||e.material,this._programMgr.getProgram(e,t,r)},validateProgram:function(e){if(e.__error){var t=e.__error;if(tf[e.__uid__])return;if(tf[e.__uid__]=!0,this.throwError)throw new Error(t);this.trigger("error",t)}},updatePrograms:function(e,t,r){var i=r&&r.getMaterial||rf;t=t||null;for(var n=0;n<e.length;n++){var a=e[n],o=i.call(this,a);if(n>0){var s=e[n-1],l=s.joints?s.joints.length:0,u=a.joints?a.joints.length:0;if(u===l&&a.material===s.material&&a.lightGroup===s.lightGroup){a.__program=s.__program;continue}}var h=this._programMgr.getProgram(a,o,t);this.validateProgram(h),a.__program=h}},renderPass:function(e,t,r){this.trigger("beforerenderpass",this,e,t,r),r=r||{},r.getMaterial=r.getMaterial||rf,r.getUniform=r.getUniform||D_,r.isMaterialChanged=r.isMaterialChanged||C_,r.beforeRender=r.beforeRender||nf,r.afterRender=r.afterRender||nf;var i=r.ifRender||L_;this.updatePrograms(e,this._sceneRendering,r),r.sortCompare&&e.sort(r.sortCompare);var n=this.viewport,a=n.devicePixelRatio,o=[n.x*a,n.y*a,n.width*a,n.height*a],s=this.devicePixelRatio,l=this.__currentFrameBuffer?[this.__currentFrameBuffer.getTextureWidth(),this.__currentFrameBuffer.getTextureHeight()]:[this._width*s,this._height*s],u=[o[2],o[3]],h=Date.now();t?(U.copy(be.VIEW,t.viewMatrix.array),U.copy(be.PROJECTION,t.projectionMatrix.array),U.copy(be.VIEWINVERSE,t.worldTransform.array)):(U.identity(be.VIEW),U.identity(be.PROJECTION),U.identity(be.VIEWINVERSE)),U.multiply(be.VIEWPROJECTION,be.PROJECTION,be.VIEW),U.invert(be.PROJECTIONINVERSE,be.PROJECTION),U.invert(be.VIEWPROJECTIONINVERSE,be.VIEWPROJECTION);for(var f=this.gl,c=this._sceneRendering,d,v,p,_,g,m,y,x,w,T,E,b,D=null,L=0;L<e.length;L++){var M=e[L],R=M.worldTransform!=null,I;if(i(M)){R&&(I=M.isSkinnedMesh&&M.isSkinnedMesh()?M.offsetMatrix?M.offsetMatrix.array:be.IDENTITY:M.worldTransform.array);var P=M.geometry,N=r.getMaterial.call(this,M),G=M.__program,H=N.shader,F=P.__uid__+"-"+G.__uid__,re=F!==T;T=F,re&&D&&D.bindVertexArrayOES(null),R&&(U.copy(be.WORLD,I),U.multiply(be.WORLDVIEWPROJECTION,be.VIEWPROJECTION,I),U.multiplyAffine(be.WORLDVIEW,be.VIEW,I),(H.matrixSemantics.WORLDINVERSE||H.matrixSemantics.WORLDINVERSETRANSPOSE)&&U.invert(be.WORLDINVERSE,I),(H.matrixSemantics.WORLDVIEWINVERSE||H.matrixSemantics.WORLDVIEWINVERSETRANSPOSE)&&U.invert(be.WORLDVIEWINVERSE,be.WORLDVIEW),(H.matrixSemantics.WORLDVIEWPROJECTIONINVERSE||H.matrixSemantics.WORLDVIEWPROJECTIONINVERSETRANSPOSE)&&U.invert(be.WORLDVIEWPROJECTIONINVERSE,be.WORLDVIEWPROJECTION)),M.beforeRender&&M.beforeRender(this),r.beforeRender.call(this,M,N,d);var B=G!==v;B?(G.bind(this),G.setUniformOfSemantic(f,"VIEWPORT",o),G.setUniformOfSemantic(f,"WINDOW_SIZE",l),t&&(G.setUniformOfSemantic(f,"NEAR",t.near),G.setUniformOfSemantic(f,"FAR",t.far)),G.setUniformOfSemantic(f,"DEVICEPIXELRATIO",a),G.setUniformOfSemantic(f,"TIME",h),G.setUniformOfSemantic(f,"VIEWPORT_SIZE",u),c&&c.setLightUniforms(G,M.lightGroup,this)):G=v,(B||r.isMaterialChanged(M,p,N,d))&&(N.depthTest!==_&&(N.depthTest?f.enable(f.DEPTH_TEST):f.disable(f.DEPTH_TEST),_=N.depthTest),N.depthMask!==g&&(f.depthMask(N.depthMask),g=N.depthMask),N.transparent!==w&&(N.transparent?f.enable(f.BLEND):f.disable(f.BLEND),w=N.transparent),N.transparent&&(N.blend?N.blend(f):(f.blendEquationSeparate(f.FUNC_ADD,f.FUNC_ADD),f.blendFuncSeparate(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA,f.ONE,f.ONE_MINUS_SRC_ALPHA))),b=this._bindMaterial(M,N,G,p||null,d||null,v||null,r.getUniform),d=N);var j=H.matrixSemanticKeys;if(R)for(var J=0;J<j.length;J++){var le=j[J],ve=H.matrixSemantics[le],ne=be[le];if(ve.isTranspose){var ze=be[ve.semanticNoTranspose];U.transpose(ne,ze)}G.setUniform(f,ve.type,ve.symbol,ne)}M.cullFace!==y&&(y=M.cullFace,f.cullFace(y)),M.frontFace!==x&&(x=M.frontFace,f.frontFace(x)),M.culling!==m&&(m=M.culling,m?f.enable(f.CULL_FACE):f.disable(f.CULL_FACE)),this._updateSkeleton(M,G,b),re&&(E=this._bindVAO(D,H,P,G)),this._renderObject(M,E,G),r.afterRender(this,M),M.afterRender&&M.afterRender(this),v=G,p=M}}D&&D.bindVertexArrayOES(null),this.trigger("afterrenderpass",this,e,t,r)},getMaxJointNumber:function(){return this.maxJointNumber},_updateSkeleton:function(e,t,r){var i=this.gl,n=e.skeleton;if(n)if(n.update(),e.joints.length>this.getMaxJointNumber()){var a=n.getSubSkinMatricesTexture(e.__uid__,e.joints);t.useTextureSlot(this,a,r),t.setUniform(i,"1i","skinMatricesTexture",r),t.setUniform(i,"1f","skinMatricesTextureSize",a.width)}else{var o=n.getSubSkinMatrices(e.__uid__,e.joints);t.setUniformOfSemantic(i,"SKIN_MATRIX",o)}},_renderObject:function(e,t,r){var i=this.gl,n=e.geometry,a=e.mode;a==null&&(a=4);var o=null,s=e.isInstancedMesh&&e.isInstancedMesh();if(s&&(o=this.getGLExtension("ANGLE_instanced_arrays"),!o)){console.warn("Device not support ANGLE_instanced_arrays extension");return}var l;if(s&&(l=this._bindInstancedAttributes(e,r,o)),t.indicesBuffer){var u=this.getGLExtension("OES_element_index_uint"),h=u&&n.indices instanceof Uint32Array,f=h?i.UNSIGNED_INT:i.UNSIGNED_SHORT;s?o.drawElementsInstancedANGLE(a,t.indicesBuffer.count,f,0,e.getInstanceCount()):i.drawElements(a,t.indicesBuffer.count,f,0)}else s?o.drawArraysInstancedANGLE(a,0,n.vertexCount,e.getInstanceCount()):i.drawArrays(a,0,n.vertexCount);if(s)for(var c=0;c<l.length;c++)i.disableVertexAttribArray(l[c])},_bindInstancedAttributes:function(e,t,r){for(var i=this.gl,n=e.getInstancedAttributesBuffers(this),a=[],o=0;o<n.length;o++){var s=n[o],l=t.getAttribLocation(i,s.symbol);if(!(l<0)){var u=af[s.type]||i.FLOAT;i.enableVertexAttribArray(l),i.bindBuffer(i.ARRAY_BUFFER,s.buffer),i.vertexAttribPointer(l,s.size,u,!1,0,0),r.vertexAttribDivisorANGLE(l,s.divisor),a.push(l)}}return a},_bindMaterial:function(e,t,r,i,n,a,o){for(var s=this.gl,l=a===r,u=r.currentTextureSlot(),h=t.getEnabledUniforms(),f=t.getTextureUniforms(),c=this._placeholderTexture,d=0;d<f.length;d++){var v=f[d],p=o(e,t,v),_=t.uniforms[v].type;if(_==="t"&&p)p.__slot=-1;else if(_==="tv")for(var g=0;g<p.length;g++)p[g]&&(p[g].__slot=-1)}c.__slot=-1;for(var d=0;d<h.length;d++){var v=h[d],m=t.uniforms[v],p=o(e,t,v),_=m.type,y=_==="t";if(y&&(!p||!p.isRenderable())&&(p=c),n&&l){var x=o(i,n,v);if(y&&(!x||!x.isRenderable())&&(x=c),x===p){if(y)r.takeCurrentTextureSlot(this,null);else if(_==="tv"&&p)for(var g=0;g<p.length;g++)r.takeCurrentTextureSlot(this,null);continue}}if(p!=null)if(y)if(p.__slot<0){var w=r.currentTextureSlot(),T=r.setUniform(s,"1i",v,w);T&&(r.takeCurrentTextureSlot(this,p),p.__slot=w)}else r.setUniform(s,"1i",v,p.__slot);else if(Array.isArray(p)){if(p.length===0)continue;if(_==="tv"){if(!r.hasUniform(v))continue;for(var E=[],g=0;g<p.length;g++){var b=p[g];if(b.__slot<0){var w=r.currentTextureSlot();E.push(w),r.takeCurrentTextureSlot(this,b),b.__slot=w}else E.push(b.__slot)}r.setUniform(s,"1iv",v,E)}else r.setUniform(s,m.type,v,p)}else r.setUniform(s,m.type,v,p)}var D=r.currentTextureSlot();return r.resetTextureSlot(u),D},_bindVAO:function(e,t,r,i){var n=!r.dynamic,a=this.gl,o=this.__uid__+"-"+i.__uid__,s=r.__vaoCache[o];if(!s){var l=r.getBufferChunks(this);if(!l||!l.length)return;for(var u=l[0],h=u.attributeBuffers,x=u.indicesBuffer,y=[],f=[],c=0;c<h.length;c++){var d=h[c],v=d.name,p=d.semantic,_;if(p){var g=t.attributeSemantics[p];_=g&&g.symbol}else _=v;_&&i.attributes[_]&&(y.push(d),f.push(_))}s=new P_(y,f,x),n&&(r.__vaoCache[o]=s)}var m=!0;e&&n&&(s.vao==null?s.vao=e.createVertexArrayOES():m=!1,e.bindVertexArrayOES(s.vao));var y=s.availableAttributes,x=s.indicesBuffer;if(m){for(var w=i.enableAttributes(this,s.availableAttributeSymbols,e&&n&&s),c=0;c<y.length;c++){var T=w[c];if(T!==-1){var d=y[c],E=d.buffer,b=d.size,D=af[d.type]||a.FLOAT;a.bindBuffer(a.ARRAY_BUFFER,E),a.vertexAttribPointer(T,b,D,!1,0,0)}}r.isUseIndices()&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,x.buffer)}return s},renderPreZ:function(e,t,r){var i=this.gl,n=this._prezMaterial||new Gt({shader:new V(V.source("clay.prez.vertex"),V.source("clay.prez.fragment"))});this._prezMaterial=n,i.colorMask(!1,!1,!1,!1),i.depthMask(!0),this.renderPass(e,r,{ifRender:function(a){return!a.ignorePreZ},isMaterialChanged:function(a,o){var s=a.material,l=o.material;return s.get("diffuseMap")!==l.get("diffuseMap")||(s.get("alphaCutoff")||0)!==(l.get("alphaCutoff")||0)},getUniform:function(a,o,s){if(s==="alphaMap")return a.material.get("diffuseMap");if(s==="alphaCutoff"){if(a.material.isDefined("fragment","ALPHA_TEST")&&a.material.get("diffuseMap")){var l=a.material.get("alphaCutoff");return l||0}return 0}else return s==="uvRepeat"?a.material.get("uvRepeat"):s==="uvOffset"?a.material.get("uvOffset"):o.get(s)},getMaterial:function(){return n},sort:this.opaqueSortCompare}),i.colorMask(!0,!0,!0,!0),i.depthMask(!0)},disposeScene:function(e){this.disposeNode(e,!0,!0),e.dispose()},disposeNode:function(e,t,r){e.getParent()&&e.getParent().remove(e);var i={};e.traverse(function(n){var a=n.material;if(n.geometry&&t&&n.geometry.dispose(this),r&&a&&!i[a.__uid__]){for(var o=a.getTextureUniforms(),s=0;s<o.length;s++){var l=o[s],u=a.uniforms[l].value,h=a.uniforms[l].type;if(u){if(h==="t")u.dispose&&u.dispose(this);else if(h==="tv")for(var f=0;f<u.length;f++)u[f]&&u[f].dispose&&u[f].dispose(this)}}i[a.__uid__]=!0}n.dispose&&n.dispose(this)},this)},disposeGeometry:function(e){e.dispose(this)},disposeTexture:function(e){e.dispose(this)},disposeFrameBuffer:function(e){e.dispose(this)},dispose:function(){},screenToNDC:function(e,t,r){r||(r=new Pt),t=this._height-t;var i=this.viewport,n=r.array;return n[0]=(e-i.x)/i.width,n[0]=n[0]*2-1,n[1]=(t-i.y)/i.height,n[1]=n[1]*2-1,r}});Dr.opaqueSortCompare=Dr.prototype.opaqueSortCompare=function(e,t){return e.renderOrder===t.renderOrder?e.__program===t.__program?e.material===t.material?e.geometry.__uid__-t.geometry.__uid__:e.material.__uid__-t.material.__uid__:e.__program&&t.__program?e.__program.__uid__-t.__program.__uid__:0:e.renderOrder-t.renderOrder},Dr.transparentSortCompare=Dr.prototype.transparentSortCompare=function(e,t){return e.renderOrder===t.renderOrder?e.__depth===t.__depth?e.__program===t.__program?e.material===t.material?e.geometry.__uid__-t.geometry.__uid__:e.material.__uid__-t.material.__uid__:e.__program&&t.__program?e.__program.__uid__-t.__program.__uid__:0:e.__depth-t.__depth:e.renderOrder-t.renderOrder};var be={IDENTITY:Se(),WORLD:Se(),VIEW:Se(),PROJECTION:Se(),WORLDVIEW:Se(),VIEWPROJECTION:Se(),WORLDVIEWPROJECTION:Se(),WORLDINVERSE:Se(),VIEWINVERSE:Se(),PROJECTIONINVERSE:Se(),WORLDVIEWINVERSE:Se(),VIEWPROJECTIONINVERSE:Se(),WORLDVIEWPROJECTIONINVERSE:Se(),WORLDTRANSPOSE:Se(),VIEWTRANSPOSE:Se(),PROJECTIONTRANSPOSE:Se(),WORLDVIEWTRANSPOSE:Se(),VIEWPROJECTIONTRANSPOSE:Se(),WORLDVIEWPROJECTIONTRANSPOSE:Se(),WORLDINVERSETRANSPOSE:Se(),VIEWINVERSETRANSPOSE:Se(),PROJECTIONINVERSETRANSPOSE:Se(),WORLDVIEWINVERSETRANSPOSE:Se(),VIEWPROJECTIONINVERSETRANSPOSE:Se(),WORLDVIEWPROJECTIONINVERSETRANSPOSE:Se()};Dr.COLOR_BUFFER_BIT=O.COLOR_BUFFER_BIT,Dr.DEPTH_BUFFER_BIT=O.DEPTH_BUFFER_BIT,Dr.STENCIL_BUFFER_BIT=O.STENCIL_BUFFER_BIT;let Nn=Dr;var In="__dt__",Ja=function(){this._contextId=0,this._caches=[],this._context={}};Ja.prototype={use:function(e,t){var r=this._caches;r[e]||(r[e]={},t&&(r[e]=t())),this._contextId=e,this._context=r[e]},put:function(e,t){this._context[e]=t},get:function(e){return this._context[e]},dirty:function(e){e=e||"";var t=In+e;this.put(t,!0)},dirtyAll:function(e){e=e||"";for(var t=In+e,r=this._caches,i=0;i<r.length;i++)r[i]&&(r[i][t]=!0)},fresh:function(e){e=e||"";var t=In+e;this.put(t,!1)},freshAll:function(e){e=e||"";for(var t=In+e,r=this._caches,i=0;i<r.length;i++)r[i]&&(r[i][t]=!1)},isDirty:function(e){e=e||"";var t=In+e,r=this._context;return!r.hasOwnProperty(t)||r[t]===!0},deleteContext:function(e){delete this._caches[e],this._context={}},delete:function(e){delete this._context[e]},clearAll:function(){this._caches={}},getContext:function(){return this._context},eachContext:function(e,t){var r=Object.keys(this._caches);r.forEach(function(i){e&&e.call(t,i)})},miss:function(e){return!this._context.hasOwnProperty(e)}},Ja.prototype.constructor=Ja;let Qs=Ja;var ue=vt.extend({width:512,height:512,type:O.UNSIGNED_BYTE,format:O.RGBA,wrapS:O.REPEAT,wrapT:O.REPEAT,minFilter:O.LINEAR_MIPMAP_LINEAR,magFilter:O.LINEAR,useMipmap:!0,anisotropic:1,flipY:!0,sRGB:!0,unpackAlignment:4,premultiplyAlpha:!1,dynamic:!1,NPOT:!1,__used:0},function(){this._cache=new Qs},{getWebGLTexture:function(e){var t=e.gl,r=this._cache;return r.use(e.__uid__),r.miss("webgl_texture")&&r.put("webgl_texture",t.createTexture()),this.dynamic?this.update(e):r.isDirty()&&(this.update(e),r.fresh()),r.get("webgl_texture")},bind:function(){},unbind:function(){},dirty:function(){this._cache&&this._cache.dirtyAll()},update:function(e){},updateCommon:function(e){var t=e.gl;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,this.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,this.unpackAlignment),this.format===O.DEPTH_COMPONENT&&(this.useMipmap=!1);var r=e.getGLExtension("EXT_sRGB");this.format===ue.SRGB&&!r&&(this.format=ue.RGB),this.format===ue.SRGB_ALPHA&&!r&&(this.format=ue.RGBA),this.NPOT=!this.isPowerOfTwo()},getAvailableWrapS:function(){return this.NPOT?O.CLAMP_TO_EDGE:this.wrapS},getAvailableWrapT:function(){return this.NPOT?O.CLAMP_TO_EDGE:this.wrapT},getAvailableMinFilter:function(){var e=this.minFilter;return this.NPOT||!this.useMipmap?e===O.NEAREST_MIPMAP_NEAREST||e===O.NEAREST_MIPMAP_LINEAR?O.NEAREST:e===O.LINEAR_MIPMAP_LINEAR||e===O.LINEAR_MIPMAP_NEAREST?O.LINEAR:e:e},getAvailableMagFilter:function(){return this.magFilter},nextHighestPowerOfTwo:function(e){--e;for(var t=1;t<32;t<<=1)e=e|e>>t;return e+1},dispose:function(e){var t=this._cache;t.use(e.__uid__);var r=t.get("webgl_texture");r&&e.gl.deleteTexture(r),t.deleteContext(e.__uid__)},isRenderable:function(){},isPowerOfTwo:function(){}});Object.defineProperty(ue.prototype,"width",{get:function(){return this._width},set:function(e){this._width=e}}),Object.defineProperty(ue.prototype,"height",{get:function(){return this._height},set:function(e){this._height=e}}),ue.BYTE=O.BYTE,ue.UNSIGNED_BYTE=O.UNSIGNED_BYTE,ue.SHORT=O.SHORT,ue.UNSIGNED_SHORT=O.UNSIGNED_SHORT,ue.INT=O.INT,ue.UNSIGNED_INT=O.UNSIGNED_INT,ue.FLOAT=O.FLOAT,ue.HALF_FLOAT=36193,ue.UNSIGNED_INT_24_8_WEBGL=34042,ue.DEPTH_COMPONENT=O.DEPTH_COMPONENT,ue.DEPTH_STENCIL=O.DEPTH_STENCIL,ue.ALPHA=O.ALPHA,ue.RGB=O.RGB,ue.RGBA=O.RGBA,ue.LUMINANCE=O.LUMINANCE,ue.LUMINANCE_ALPHA=O.LUMINANCE_ALPHA,ue.SRGB=35904,ue.SRGB_ALPHA=35906,ue.COMPRESSED_RGB_S3TC_DXT1_EXT=33776,ue.COMPRESSED_RGBA_S3TC_DXT1_EXT=33777,ue.COMPRESSED_RGBA_S3TC_DXT3_EXT=33778,ue.COMPRESSED_RGBA_S3TC_DXT5_EXT=33779,ue.NEAREST=O.NEAREST,ue.LINEAR=O.LINEAR,ue.NEAREST_MIPMAP_NEAREST=O.NEAREST_MIPMAP_NEAREST,ue.LINEAR_MIPMAP_NEAREST=O.LINEAR_MIPMAP_NEAREST,ue.NEAREST_MIPMAP_LINEAR=O.NEAREST_MIPMAP_LINEAR,ue.LINEAR_MIPMAP_LINEAR=O.LINEAR_MIPMAP_LINEAR,ue.REPEAT=O.REPEAT,ue.CLAMP_TO_EDGE=O.CLAMP_TO_EDGE,ue.MIRRORED_REPEAT=O.MIRRORED_REPEAT;let X=ue;var $a={};$a.isPowerOfTwo=function(e){return(e&e-1)===0},$a.nextPowerOfTwo=function(e){return e--,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e++,e},$a.nearestPowerOfTwo=function(e){return Math.pow(2,Math.round(Math.log(e)/Math.LN2))};let of=$a;var sf=of.isPowerOfTwo;function lf(e){return Math.pow(2,Math.round(Math.log(e)/Math.LN2))}function N_(e,t){var r=lf(e.width),i=lf(e.height);t=t||document.createElement("canvas"),t.width=r,t.height=i;var n=t.getContext("2d");return n.drawImage(e.image,0,0,r,i),t}var Js=X.extend(function(){return{image:null,pixels:null,mipmaps:[],convertToPOT:!1}},{textureType:"texture2D",update:function(e){var t=e.gl;t.bindTexture(t.TEXTURE_2D,this._cache.get("webgl_texture")),this.updateCommon(e);var r=this.format,i=this.type,n=!!(this.convertToPOT&&!this.mipmaps.length&&this.image&&(this.wrapS===X.REPEAT||this.wrapT===X.REPEAT)&&this.NPOT);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,n?this.wrapS:this.getAvailableWrapS()),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,n?this.wrapT:this.getAvailableWrapT()),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,n?this.magFilter:this.getAvailableMagFilter()),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,n?this.minFilter:this.getAvailableMinFilter());var a=e.getGLExtension("EXT_texture_filter_anisotropic");if(a&&this.anisotropic>1&&t.texParameterf(t.TEXTURE_2D,a.TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropic),i===36193){var o=e.getGLExtension("OES_texture_half_float");o||(i=O.FLOAT)}if(this.mipmaps.length)for(var s=this.width,l=this.height,u=0;u<this.mipmaps.length;u++){var h=this.mipmaps[u];this._updateTextureData(t,h,u,s,l,r,i,!1),s/=2,l/=2}else this._updateTextureData(t,this,0,this.width,this.height,r,i,n),this.useMipmap&&(!this.NPOT||n)&&t.generateMipmap(t.TEXTURE_2D);t.bindTexture(t.TEXTURE_2D,null)},_updateTextureData:function(e,t,r,i,n,a,o,s){if(t.image){var l=t.image;s&&(this._potCanvas=N_(this,this._potCanvas),l=this._potCanvas),e.texImage2D(e.TEXTURE_2D,r,a,a,o,l)}else a<=X.COMPRESSED_RGBA_S3TC_DXT5_EXT&&a>=X.COMPRESSED_RGB_S3TC_DXT1_EXT?e.compressedTexImage2D(e.TEXTURE_2D,r,a,i,n,0,t.pixels):e.texImage2D(e.TEXTURE_2D,r,a,i,n,0,a,o,t.pixels)},generateMipmap:function(e){var t=e.gl;this.useMipmap&&!this.NPOT&&(t.bindTexture(t.TEXTURE_2D,this._cache.get("webgl_texture")),t.generateMipmap(t.TEXTURE_2D))},isPowerOfTwo:function(){return sf(this.width)&&sf(this.height)},isRenderable:function(){return this.image?this.image.width>0&&this.image.height>0:!!(this.width&&this.height)},bind:function(e){e.gl.bindTexture(e.gl.TEXTURE_2D,this.getWebGLTexture(e))},unbind:function(e){e.gl.bindTexture(e.gl.TEXTURE_2D,null)},load:function(e,t){var r=Pe.createImage();t&&(r.crossOrigin=t);var i=this;return r.onload=function(){i.dirty(),i.trigger("success",i)},r.onerror=function(){i.trigger("error",i)},r.src=e,this.image=r,this}});Object.defineProperty(Js.prototype,"width",{get:function(){return this.image?this.image.width:this._width},set:function(e){this.image?console.warn("Texture from image can't set width"):(this._width!==e&&this.dirty(),this._width=e)}}),Object.defineProperty(Js.prototype,"height",{get:function(){return this.image?this.image.height:this._height},set:function(e){this.image?console.warn("Texture from image can't set height"):(this._height!==e&&this.dirty(),this._height=e)}});let ee=Js;function uf(e){return{byte:Pe.Int8Array,ubyte:Pe.Uint8Array,short:Pe.Int16Array,ushort:Pe.Uint16Array}[e]||Pe.Float32Array}function $s(e){return"attr_"+e}function ki(e,t,r,i){switch(this.name=e,this.type=t,this.size=r,this.semantic=i||"",this.value=null,r){case 1:this.get=function(n){return this.value[n]},this.set=function(n,a){this.value[n]=a},this.copy=function(n,a){this.value[n]=this.value[n]};break;case 2:this.get=function(n,a){var o=this.value;return a[0]=o[n*2],a[1]=o[n*2+1],a},this.set=function(n,a){var o=this.value;o[n*2]=a[0],o[n*2+1]=a[1]},this.copy=function(n,a){var o=this.value;a*=2,n*=2,o[n]=o[a],o[n+1]=o[a+1]};break;case 3:this.get=function(n,a){var o=n*3,s=this.value;return a[0]=s[o],a[1]=s[o+1],a[2]=s[o+2],a},this.set=function(n,a){var o=n*3,s=this.value;s[o]=a[0],s[o+1]=a[1],s[o+2]=a[2]},this.copy=function(n,a){var o=this.value;a*=3,n*=3,o[n]=o[a],o[n+1]=o[a+1],o[n+2]=o[a+2]};break;case 4:this.get=function(n,a){var o=this.value,s=n*4;return a[0]=o[s],a[1]=o[s+1],a[2]=o[s+2],a[3]=o[s+3],a},this.set=function(n,a){var o=this.value,s=n*4;o[s]=a[0],o[s+1]=a[1],o[s+2]=a[2],o[s+3]=a[3]},this.copy=function(n,a){var o=this.value;a*=4,n*=4,o[n]=o[a],o[n+1]=o[a+1],o[n+2]=o[a+2],o[n+3]=o[a+3]}}}ki.prototype.init=function(e){if(!this.value||this.value.length!==e*this.size){var t=uf(this.type);this.value=new t(e*this.size)}},ki.prototype.fromArray=function(e){var t=uf(this.type),r;if(e[0]&&e[0].length){var i=0,n=this.size;r=new t(e.length*n);for(var a=0;a<e.length;a++)for(var o=0;o<n;o++)r[i++]=e[a][o]}else r=new t(e);this.value=r},ki.prototype.clone=function(e){var t=new ki(this.name,this.type,this.size,this.semantic);return e&&console.warn("todo"),t};function hf(e,t,r,i,n){this.name=e,this.type=t,this.buffer=r,this.size=i,this.semantic=n,this.symbol="",this.needsRemove=!1}function ff(e){this.buffer=e,this.count=0}var _r=vt.extend(function(){return{attributes:{},indices:null,dynamic:!0,_enabledAttributes:null,__used:0}},function(){this._cache=new Qs,this._attributeList=Object.keys(this.attributes),this.__vaoCache={}},{mainAttribute:"",pick:null,pickByRay:null,dirty:function(){for(var e=this.getEnabledAttributes(),t=0;t<e.length;t++)this.dirtyAttribute(e[t]);this.dirtyIndices(),this._enabledAttributes=null,this._cache.dirty("any")},dirtyIndices:function(){this._cache.dirtyAll("indices")},dirtyAttribute:function(e){this._cache.dirtyAll($s(e)),this._cache.dirtyAll("attributes")},getTriangleIndices:function(e,t){if(e<this.triangleCount&&e>=0){t||(t=[]);var r=this.indices;return t[0]=r[e*3],t[1]=r[e*3+1],t[2]=r[e*3+2],t}},setTriangleIndices:function(e,t){var r=this.indices;r[e*3]=t[0],r[e*3+1]=t[1],r[e*3+2]=t[2]},isUseIndices:function(){return!!this.indices},initIndicesFromArray:function(e){var t,r=this.vertexCount>65535?Pe.Uint32Array:Pe.Uint16Array;if(e[0]&&e[0].length){var i=0,n=3;t=new r(e.length*n);for(var a=0;a<e.length;a++)for(var o=0;o<n;o++)t[i++]=e[a][o]}else t=new r(e);this.indices=t},createAttribute:function(e,t,r,i){var n=new ki(e,t,r,i);return this.attributes[e]&&this.removeAttribute(e),this.attributes[e]=n,this._attributeList.push(e),n},removeAttribute:function(e){var t=this._attributeList,r=t.indexOf(e);return r>=0?(t.splice(r,1),delete this.attributes[e],!0):!1},getAttribute:function(e){return this.attributes[e]},getEnabledAttributes:function(){var e=this._enabledAttributes,t=this._attributeList;if(e)return e;for(var r=[],i=this.vertexCount,n=0;n<t.length;n++){var a=t[n],o=this.attributes[a];o.value&&o.value.length===i*o.size&&r.push(a)}return this._enabledAttributes=r,r},getBufferChunks:function(e){var t=this._cache;t.use(e.__uid__);var r=t.isDirty("attributes"),i=t.isDirty("indices");if(r||i){this._updateBuffer(e.gl,r,i);for(var n=this.getEnabledAttributes(),a=0;a<n.length;a++)t.fresh($s(n[a]));t.fresh("attributes"),t.fresh("indices")}return t.fresh("any"),t.get("chunks")},_updateBuffer:function(e,t,r){var i=this._cache,n=i.get("chunks"),a=!1;n||(n=[],n[0]={attributeBuffers:[],indicesBuffer:null},i.put("chunks",n),a=!0);var o=n[0],s=o.attributeBuffers,l=o.indicesBuffer;if(t||a){var u=this.getEnabledAttributes(),h={};if(!a)for(var f=0;f<s.length;f++)h[s[f].name]=s[f];for(var c=0;c<u.length;c++){var d=u[c],v=this.attributes[d],p;a||(p=h[d]);var _;p?_=p.buffer:_=e.createBuffer(),i.isDirty($s(d))&&(e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,v.value,this.dynamic?e.DYNAMIC_DRAW:e.STATIC_DRAW)),s[c]=new hf(d,v.type,_,v.size,v.semantic)}for(var f=c;f<s.length;f++)e.deleteBuffer(s[f].buffer);s.length=c}this.isUseIndices()&&(r||a)&&(l||(l=new ff(e.createBuffer()),o.indicesBuffer=l),l.count=this.indices.length,e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,l.buffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,this.indices,this.dynamic?e.DYNAMIC_DRAW:e.STATIC_DRAW))},dispose:function(e){var t=this._cache;t.use(e.__uid__);var r=t.get("chunks");if(r)for(var i=0;i<r.length;i++){for(var n=r[i],a=0;a<n.attributeBuffers.length;a++){var o=n.attributeBuffers[a];e.gl.deleteBuffer(o.buffer)}n.indicesBuffer&&e.gl.deleteBuffer(n.indicesBuffer.buffer)}if(this.__vaoCache){var s=e.getGLExtension("OES_vertex_array_object");for(var l in this.__vaoCache){var u=this.__vaoCache[l].vao;u&&s.deleteVertexArrayOES(u)}}this.__vaoCache={},t.deleteContext(e.__uid__)}});Object.defineProperty&&(Object.defineProperty(_r.prototype,"vertexCount",{enumerable:!1,get:function(){var e=this.attributes[this.mainAttribute];return e||(e=this.attributes[this._attributeList[0]]),!e||!e.value?0:e.value.length/e.size}}),Object.defineProperty(_r.prototype,"triangleCount",{enumerable:!1,get:function(){var e=this.indices;return e?e.length/3:0}})),_r.STATIC_DRAW=O.STATIC_DRAW,_r.DYNAMIC_DRAW=O.DYNAMIC_DRAW,_r.STREAM_DRAW=O.STREAM_DRAW,_r.AttributeBuffer=hf,_r.IndicesBuffer=ff,_r.Attribute=ki;let Jr=_r;var gt=C.create,Wi=C.add,$r=C.set,ir=Jr.Attribute,ei=Jr.extend(function(){return{attributes:{position:new ir("position","float",3,"POSITION"),texcoord0:new ir("texcoord0","float",2,"TEXCOORD_0"),texcoord1:new ir("texcoord1","float",2,"TEXCOORD_1"),normal:new ir("normal","float",3,"NORMAL"),tangent:new ir("tangent","float",4,"TANGENT"),color:new ir("color","float",4,"COLOR"),weight:new ir("weight","float",3,"WEIGHT"),joint:new ir("joint","float",4,"JOINT"),barycentric:new ir("barycentric","float",3,null)},boundingBox:null}},{mainAttribute:"position",updateBoundingBox:function(){var e=this.boundingBox;e||(e=this.boundingBox=new pt);var t=this.attributes.position.value;if(t&&t.length){var r=e.min,i=e.max,n=r.array,a=i.array;C.set(n,t[0],t[1],t[2]),C.set(a,t[0],t[1],t[2]);for(var o=3;o<t.length;){var s=t[o++],l=t[o++],u=t[o++];s<n[0]&&(n[0]=s),l<n[1]&&(n[1]=l),u<n[2]&&(n[2]=u),s>a[0]&&(a[0]=s),l>a[1]&&(a[1]=l),u>a[2]&&(a[2]=u)}r._dirty=!0,i._dirty=!0}},generateVertexNormals:function(){if(this.vertexCount){var e=this.indices,t=this.attributes,r=t.position.value,i=t.normal.value;if(!i||i.length!==r.length)i=t.normal.value=new Pe.Float32Array(r.length);else for(var n=0;n<i.length;n++)i[n]=0;for(var a=gt(),o=gt(),s=gt(),l=gt(),u=gt(),h=gt(),f=e?e.length:this.vertexCount,c,d,v,p=0;p<f;){e?(c=e[p++],d=e[p++],v=e[p++]):(c=p++,d=p++,v=p++),$r(a,r[c*3],r[c*3+1],r[c*3+2]),$r(o,r[d*3],r[d*3+1],r[d*3+2]),$r(s,r[v*3],r[v*3+1],r[v*3+2]),C.sub(l,a,o),C.sub(u,o,s),C.cross(h,l,u);for(var n=0;n<3;n++)i[c*3+n]=i[c*3+n]+h[n],i[d*3+n]=i[d*3+n]+h[n],i[v*3+n]=i[v*3+n]+h[n]}for(var n=0;n<i.length;)$r(h,i[n],i[n+1],i[n+2]),C.normalize(h,h),i[n++]=h[0],i[n++]=h[1],i[n++]=h[2];this.dirty()}},generateFaceNormals:function(){if(this.vertexCount){this.isUniqueVertex()||this.generateUniqueVertex();var e=this.indices,t=this.attributes,r=t.position.value,i=t.normal.value,n=gt(),a=gt(),o=gt(),s=gt(),l=gt(),u=gt();i||(i=t.normal.value=new Float32Array(r.length));for(var h=e?e.length:this.vertexCount,f,c,d,v=0;v<h;){e?(f=e[v++],c=e[v++],d=e[v++]):(f=v++,c=v++,d=v++),$r(n,r[f*3],r[f*3+1],r[f*3+2]),$r(a,r[c*3],r[c*3+1],r[c*3+2]),$r(o,r[d*3],r[d*3+1],r[d*3+2]),C.sub(s,n,a),C.sub(l,a,o),C.cross(u,s,l),C.normalize(u,u);for(var p=0;p<3;p++)i[f*3+p]=u[p],i[c*3+p]=u[p],i[d*3+p]=u[p]}this.dirty()}},generateTangents:function(){if(this.vertexCount){var e=this.vertexCount,t=this.attributes;t.tangent.value||(t.tangent.value=new Float32Array(e*4));var r=t.texcoord0.value,i=t.position.value,n=t.tangent.value,a=t.normal.value;if(!r){console.warn("Geometry without texcoords can't generate tangents.");return}for(var o=[],s=[],l=0;l<e;l++)o[l]=[0,0,0],s[l]=[0,0,0];for(var u=[0,0,0],h=[0,0,0],f=this.indices,c=f?f.length:this.vertexCount,d,v,p,l=0;l<c;){f?(d=f[l++],v=f[l++],p=f[l++]):(d=l++,v=l++,p=l++);var _=r[d*2],g=r[v*2],m=r[p*2],y=r[d*2+1],x=r[v*2+1],w=r[p*2+1],T=i[d*3],E=i[v*3],b=i[p*3],D=i[d*3+1],L=i[v*3+1],M=i[p*3+1],R=i[d*3+2],I=i[v*3+2],P=i[p*3+2],N=E-T,G=b-T,H=L-D,F=M-D,re=I-R,B=P-R,j=g-_,J=m-_,le=x-y,ve=w-y,ne=1/(j*ve-le*J);u[0]=(ve*N-le*G)*ne,u[1]=(ve*H-le*F)*ne,u[2]=(ve*re-le*B)*ne,h[0]=(j*G-J*N)*ne,h[1]=(j*F-J*H)*ne,h[2]=(j*B-J*re)*ne,Wi(o[d],o[d],u),Wi(o[v],o[v],u),Wi(o[p],o[p],u),Wi(s[d],s[d],h),Wi(s[v],s[v],h),Wi(s[p],s[p],h)}for(var ze=gt(),we=gt(),Le=gt(),l=0;l<e;l++){Le[0]=a[l*3],Le[1]=a[l*3+1],Le[2]=a[l*3+2];var ot=o[l];C.scale(ze,Le,C.dot(Le,ot)),C.sub(ze,ot,ze),C.normalize(ze,ze),C.cross(we,Le,ot),n[l*4]=ze[0],n[l*4+1]=ze[1],n[l*4+2]=ze[2],n[l*4+3]=C.dot(we,s[l])<0?-1:1}this.dirty()}},isUniqueVertex:function(){return this.isUseIndices()?this.vertexCount===this.indices.length:!0},generateUniqueVertex:function(){if(!(!this.vertexCount||!this.indices)){this.indices.length>65535&&(this.indices=new Pe.Uint32Array(this.indices));for(var e=this.attributes,t=this.indices,r=this.getEnabledAttributes(),i={},n=0;n<r.length;n++){var a=r[n];i[a]=e[a].value,e[a].init(this.indices.length)}for(var o=0,s=0;s<t.length;s++){for(var l=t[s],n=0;n<r.length;n++)for(var a=r[n],u=e[a].value,h=e[a].size,f=0;f<h;f++)u[o*h+f]=i[a][l*h+f];t[s]=o,o++}this.dirty()}},generateBarycentric:function(){if(this.vertexCount){this.isUniqueVertex()||this.generateUniqueVertex();var e=this.attributes,t=e.barycentric.value,r=this.indices;if(!(t&&t.length===r.length*3)){t=e.barycentric.value=new Float32Array(r.length*3);for(var i=0;i<(r?r.length:this.vertexCount/3);)for(var n=0;n<3;n++){var a=r?r[i++]:i*3+n;t[a*3+n]=1}this.dirty()}}},applyTransform:function(e){var t=this.attributes,r=t.position.value,i=t.normal.value,n=t.tangent.value;e=e.array;var a=U.create();U.invert(a,e),U.transpose(a,a);var o=C.transformMat4,s=C.forEach;s(r,3,0,null,o,e),i&&s(i,3,0,null,o,a),n&&s(n,4,0,null,o,a),this.boundingBox&&this.updateBoundingBox()},dispose:function(e){var t=this._cache;t.use(e.__uid__);var r=t.get("chunks");if(r)for(var i=0;i<r.length;i++){for(var n=r[i],a=0;a<n.attributeBuffers.length;a++){var o=n.attributeBuffers[a];e.gl.deleteBuffer(o.buffer)}n.indicesBuffer&&e.gl.deleteBuffer(n.indicesBuffer.buffer)}if(this.__vaoCache){var s=e.getGLExtension("OES_vertex_array_object");for(var l in this.__vaoCache){var u=this.__vaoCache[l].vao;u&&s.deleteVertexArrayOES(u)}}this.__vaoCache={},t.deleteContext(e.__uid__)}});ei.STATIC_DRAW=Jr.STATIC_DRAW,ei.DYNAMIC_DRAW=Jr.DYNAMIC_DRAW,ei.STREAM_DRAW=Jr.STREAM_DRAW,ei.AttributeBuffer=Jr.AttributeBuffer,ei.IndicesBuffer=Jr.IndicesBuffer,ei.Attribute=ir;let ce=ei,I_=`vec3 calcAmbientSHLight(int idx, vec3 N) {
 int offset = 9 * idx;
 return ambientSHLightCoefficients[0]
 + ambientSHLightCoefficients[1] * N.x
 + ambientSHLightCoefficients[2] * N.y
 + ambientSHLightCoefficients[3] * N.z
 + ambientSHLightCoefficients[4] * N.x * N.z
 + ambientSHLightCoefficients[5] * N.z * N.y
 + ambientSHLightCoefficients[6] * N.y * N.x
 + ambientSHLightCoefficients[7] * (3.0 * N.z * N.z - 1.0)
 + ambientSHLightCoefficients[8] * (N.x * N.x - N.y * N.y);
}`;var Yt="uniform vec3 ",On="uniform float ",Xi="@export clay.header.",ji="@end",it=":unconfigurable;";let O_=[Xi+"directional_light",Yt+"directionalLightDirection[DIRECTIONAL_LIGHT_COUNT]"+it,Yt+"directionalLightColor[DIRECTIONAL_LIGHT_COUNT]"+it,ji,Xi+"ambient_light",Yt+"ambientLightColor[AMBIENT_LIGHT_COUNT]"+it,ji,Xi+"ambient_sh_light",Yt+"ambientSHLightColor[AMBIENT_SH_LIGHT_COUNT]"+it,Yt+"ambientSHLightCoefficients[AMBIENT_SH_LIGHT_COUNT * 9]"+it,I_,ji,Xi+"ambient_cubemap_light",Yt+"ambientCubemapLightColor[AMBIENT_CUBEMAP_LIGHT_COUNT]"+it,"uniform samplerCube ambientCubemapLightCubemap[AMBIENT_CUBEMAP_LIGHT_COUNT]"+it,"uniform sampler2D ambientCubemapLightBRDFLookup[AMBIENT_CUBEMAP_LIGHT_COUNT]"+it,ji,Xi+"point_light",Yt+"pointLightPosition[POINT_LIGHT_COUNT]"+it,On+"pointLightRange[POINT_LIGHT_COUNT]"+it,Yt+"pointLightColor[POINT_LIGHT_COUNT]"+it,ji,Xi+"spot_light",Yt+"spotLightPosition[SPOT_LIGHT_COUNT]"+it,Yt+"spotLightDirection[SPOT_LIGHT_COUNT]"+it,On+"spotLightRange[SPOT_LIGHT_COUNT]"+it,On+"spotLightUmbraAngleCosine[SPOT_LIGHT_COUNT]"+it,On+"spotLightPenumbraAngleCosine[SPOT_LIGHT_COUNT]"+it,On+"spotLightFalloffFactor[SPOT_LIGHT_COUNT]"+it,Yt+"spotLightColor[SPOT_LIGHT_COUNT]"+it,ji].join(`
`);V.import(O_);var B_=rr.extend(function(){return{color:[1,1,1],intensity:1,castShadow:!0,shadowResolution:512,group:0}},{type:"",clone:function(){var e=rr.prototype.clone.call(this);return e.color=Array.prototype.slice.call(this.color),e.intensity=this.intensity,e.castShadow=this.castShadow,e.shadowResolution=this.shadowResolution,e}});let Kt=B_;var eo=function(e,t){this.normal=e||new z(0,1,0),this.distance=t||0};eo.prototype={constructor:eo,distanceToPoint:function(e){return C.dot(e.array,this.normal.array)-this.distance},projectPoint:function(e,t){t||(t=new z);var r=this.distanceToPoint(e);return C.scaleAndAdd(t.array,e.array,this.normal.array,-r),t._dirty=!0,t},normalize:function(){var e=1/C.len(this.normal.array);C.scale(this.normal.array,e),this.distance*=e},intersectFrustum:function(e){for(var t=e.vertices,r=this.normal.array,i=C.dot(t[0].array,r)>this.distance,n=1;n<8;n++)if(C.dot(t[n].array,r)>this.distance!=i)return!0},intersectLine:(function(){var e=C.create();return function(t,r,i){var n=this.distanceToPoint(t),a=this.distanceToPoint(r);if(n>0&&a>0||n<0&&a<0)return null;var o=this.normal.array,s=this.distance,l=t.array;C.sub(e,r.array,t.array),C.normalize(e,e);var u=C.dot(o,e);if(u===0)return null;i||(i=new z);var h=(C.dot(o,l)-s)/u;return C.scaleAndAdd(i.array,l,e,-h),i._dirty=!0,i}})(),applyTransform:(function(){var e=U.create(),t=k.create(),r=k.create();return r[3]=1,function(i){i=i.array,C.scale(r,this.normal.array,this.distance),k.transformMat4(r,r,i),this.distance=C.dot(r,this.normal.array),U.invert(e,i),U.transpose(e,e),t[3]=0,C.copy(t,this.normal.array),k.transformMat4(t,t,e),C.copy(this.normal.array,t)}})(),copy:function(e){C.copy(this.normal.array,e.normal.array),this.normal._dirty=!0,this.distance=e.distance},clone:function(){var e=new eo;return e.copy(this),e}};let cf=eo;var Be=C.set,df=C.copy,vf=C.transformMat4,el=Math.min,tl=Math.max,pf=function(){this.planes=[];for(var e=0;e<6;e++)this.planes.push(new cf);this.boundingBox=new pt,this.vertices=[];for(var e=0;e<8;e++)this.vertices[e]=C.fromValues(0,0,0)};pf.prototype={setFromProjection:function(e){var t=this.planes,r=e.array,i=r[0],n=r[1],a=r[2],o=r[3],s=r[4],l=r[5],u=r[6],h=r[7],f=r[8],c=r[9],d=r[10],v=r[11],p=r[12],_=r[13],g=r[14],m=r[15];Be(t[0].normal.array,o-i,h-s,v-f),t[0].distance=-(m-p),t[0].normalize(),Be(t[1].normal.array,o+i,h+s,v+f),t[1].distance=-(m+p),t[1].normalize(),Be(t[2].normal.array,o+n,h+l,v+c),t[2].distance=-(m+_),t[2].normalize(),Be(t[3].normal.array,o-n,h-l,v-c),t[3].distance=-(m-_),t[3].normalize(),Be(t[4].normal.array,o-a,h-u,v-d),t[4].distance=-(m-g),t[4].normalize(),Be(t[5].normal.array,o+a,h+u,v+d),t[5].distance=-(m+g),t[5].normalize();var y=this.boundingBox,x=this.vertices;if(m===0){var w=l/i,T=-g/(d-1),E=-g/(d+1),b=-E/l,D=-T/l;y.min.set(-b*w,-b,E),y.max.set(b*w,b,T),Be(x[0],-b*w,-b,E),Be(x[1],-b*w,b,E),Be(x[2],b*w,-b,E),Be(x[3],b*w,b,E),Be(x[4],-D*w,-D,T),Be(x[5],-D*w,D,T),Be(x[6],D*w,-D,T),Be(x[7],D*w,D,T)}else{var L=(-1-p)/i,M=(1-p)/i,R=(1-_)/l,I=(-1-_)/l,P=(-1-g)/d,N=(1-g)/d;y.min.set(Math.min(L,M),Math.min(I,R),Math.min(N,P)),y.max.set(Math.max(M,L),Math.max(R,I),Math.max(P,N));var G=y.min.array,H=y.max.array;Be(x[0],G[0],G[1],G[2]),Be(x[1],G[0],H[1],G[2]),Be(x[2],H[0],G[1],G[2]),Be(x[3],H[0],H[1],G[2]),Be(x[4],G[0],G[1],H[2]),Be(x[5],G[0],H[1],H[2]),Be(x[6],H[0],G[1],H[2]),Be(x[7],H[0],H[1],H[2])}},getTransformedBoundingBox:(function(){var e=C.create();return function(t,r){var i=this.vertices,n=r.array,a=t.min,o=t.max,s=a.array,l=o.array,u=i[0];vf(e,u,n),df(s,e),df(l,e);for(var h=1;h<8;h++)u=i[h],vf(e,u,n),s[0]=el(e[0],s[0]),s[1]=el(e[1],s[1]),s[2]=el(e[2],s[2]),l[0]=tl(e[0],l[0]),l[1]=tl(e[1],l[1]),l[2]=tl(e[2],l[2]);return a._dirty=!0,o._dirty=!0,t}})()};let rl=pf;var il=1e-5,to=function(e,t){this.origin=e||new z,this.direction=t||new z};to.prototype={constructor:to,intersectPlane:function(e,t){var r=e.normal.array,i=e.distance,n=this.origin.array,a=this.direction.array,o=C.dot(r,a);if(o===0)return null;t||(t=new z);var s=(C.dot(r,n)-i)/o;return C.scaleAndAdd(t.array,n,a,-s),t._dirty=!0,t},mirrorAgainstPlane:function(e){var t=C.dot(e.normal.array,this.direction.array);C.scaleAndAdd(this.direction.array,this.direction.array,e.normal.array,-t*2),this.direction._dirty=!0},distanceToPoint:(function(){var e=C.create();return function(t){C.sub(e,t,this.origin.array);var r=C.dot(e,this.direction.array);if(r<0)return C.distance(this.origin.array,t);var i=C.lenSquared(e);return Math.sqrt(i-r*r)}})(),intersectSphere:(function(){var e=C.create();return function(t,r,i){var n=this.origin.array,a=this.direction.array;t=t.array,C.sub(e,t,n);var o=C.dot(e,a),s=C.squaredLength(e),l=s-o*o,u=r*r;if(!(l>u)){var h=Math.sqrt(u-l),f=o-h,c=o+h;return i||(i=new z),f<0?c<0?null:(C.scaleAndAdd(i.array,n,a,c),i):(C.scaleAndAdd(i.array,n,a,f),i)}}})(),intersectBoundingBox:function(e,t){var r=this.direction.array,i=this.origin.array,n=e.min.array,a=e.max.array,o=1/r[0],s=1/r[1],l=1/r[2],u,h,f,c,d,v;if(o>=0?(u=(n[0]-i[0])*o,h=(a[0]-i[0])*o):(h=(n[0]-i[0])*o,u=(a[0]-i[0])*o),s>=0?(f=(n[1]-i[1])*s,c=(a[1]-i[1])*s):(c=(n[1]-i[1])*s,f=(a[1]-i[1])*s),u>c||f>h||((f>u||u!==u)&&(u=f),(c<h||h!==h)&&(h=c),l>=0?(d=(n[2]-i[2])*l,v=(a[2]-i[2])*l):(v=(n[2]-i[2])*l,d=(a[2]-i[2])*l),u>v||d>h)||((d>u||u!==u)&&(u=d),(v<h||h!==h)&&(h=v),h<0))return null;var p=u>=0?u:h;return t||(t=new z),C.scaleAndAdd(t.array,i,r,p),t},intersectTriangle:(function(){var e=C.create(),t=C.create(),r=C.create(),i=C.create();return function(n,a,o,s,l,u){var h=this.direction.array,f=this.origin.array;n=n.array,a=a.array,o=o.array,C.sub(e,a,n),C.sub(t,o,n),C.cross(i,t,h);var c=C.dot(e,i);if(s){if(c>-il)return null}else if(c>-il&&c<il)return null;C.sub(r,f,n);var d=C.dot(i,r)/c;if(d<0||d>1)return null;C.cross(i,e,r);var v=C.dot(h,i)/c;if(v<0||v>1||d+v>1)return null;C.cross(i,e,t);var p=-C.dot(r,i)/c;return p<0?null:(l||(l=new z),u&&z.set(u,1-d-v,d,v),C.scaleAndAdd(l.array,f,h,p),l)}})(),applyTransform:function(e){z.add(this.direction,this.direction,this.origin),z.transformMat4(this.origin,this.origin,e),z.transformMat4(this.direction,this.direction,e),z.sub(this.direction,this.direction,this.origin),z.normalize(this.direction,this.direction)},copy:function(e){z.copy(this.origin,e.origin),z.copy(this.direction,e.direction)},clone:function(){var e=new to;return e.copy(this),e}};let ro=to;var F_=rr.extend(function(){return{projectionMatrix:new W,invProjectionMatrix:new W,viewMatrix:new W,frustum:new rl}},function(){this.update(!0)},{update:function(e){rr.prototype.update.call(this,e),W.invert(this.viewMatrix,this.worldTransform),this.updateProjectionMatrix(),W.invert(this.invProjectionMatrix,this.projectionMatrix),this.frustum.setFromProjection(this.projectionMatrix)},setViewMatrix:function(e){W.copy(this.viewMatrix,e),W.invert(this.worldTransform,e),this.decomposeWorldTransform()},decomposeProjectionMatrix:function(){},setProjectionMatrix:function(e){W.copy(this.projectionMatrix,e),W.invert(this.invProjectionMatrix,e),this.decomposeProjectionMatrix()},updateProjectionMatrix:function(){},castRay:(function(){var e=k.create();return function(t,r){var i=r!==void 0?r:new ro,n=t.array[0],a=t.array[1];return k.set(e,n,a,-1,1),k.transformMat4(e,e,this.invProjectionMatrix.array),k.transformMat4(e,e,this.worldTransform.array),C.scale(i.origin.array,e,1/e[3]),k.set(e,n,a,1,1),k.transformMat4(e,e,this.invProjectionMatrix.array),k.transformMat4(e,e,this.worldTransform.array),C.scale(e,e,1/e[3]),C.sub(i.direction.array,e,i.origin.array),C.normalize(i.direction.array,i.direction.array),i.direction._dirty=!0,i.origin._dirty=!0,i}})()});let qi=F_;var G_=U.create(),_f=U.create(),nl={};function U_(e){var t=[],r=Object.keys(e);r.sort();for(var i=0;i<r.length;i++){var n=r[i];t.push(n+" "+e[n])}var a=t.join(`
`);if(nl[a])return nl[a];var o=tt.genGUID();return nl[a]=o,o}function io(){this.opaque=[],this.transparent=[],this._opaqueCount=0,this._transparentCount=0}io.prototype.startCount=function(){this._opaqueCount=0,this._transparentCount=0},io.prototype.add=function(e,t){t?this.transparent[this._transparentCount++]=e:this.opaque[this._opaqueCount++]=e},io.prototype.endCount=function(){this.transparent.length=this._transparentCount,this.opaque.length=this._opaqueCount};var z_=rr.extend(function(){return{material:null,lights:[],viewBoundingBoxLastFrame:new pt,shadowUniforms:{},_cameraList:[],_lightUniforms:{},_previousLightNumber:{},_lightNumber:{},_lightProgramKeys:{},_nodeRepository:{},_renderLists:new Ih(20)}},function(){this._scene=this},{addToScene:function(e){e instanceof qi?(this._cameraList.length>0&&console.warn("Found multiple camera in one scene. Use the fist one."),this._cameraList.push(e)):e instanceof Kt&&this.lights.push(e),e.name&&(this._nodeRepository[e.name]=e)},removeFromScene:function(e){var t;e instanceof qi?(t=this._cameraList.indexOf(e),t>=0&&this._cameraList.splice(t,1)):e instanceof Kt&&(t=this.lights.indexOf(e),t>=0&&this.lights.splice(t,1)),e.name&&delete this._nodeRepository[e.name]},getNode:function(e){return this._nodeRepository[e]},setMainCamera:function(e){var t=this._cameraList.indexOf(e);t>=0&&this._cameraList.splice(t,1),this._cameraList.unshift(e)},getMainCamera:function(){return this._cameraList[0]},getLights:function(){return this.lights},updateLights:function(){var e=this.lights;this._previousLightNumber=this._lightNumber;for(var t={},r=0;r<e.length;r++){var i=e[r];if(!i.invisible){var n=i.group;t[n]||(t[n]={}),t[n][i.type]=t[n][i.type]||0,t[n][i.type]++}}this._lightNumber=t;for(var a in t)this._lightProgramKeys[a]=U_(t[a]);this._updateLightUniforms()},cloneNode:function(e){var t=e.clone(),r={};function i(n,a){r[n.__uid__]=a;for(var o=0;o<n._children.length;o++){var s=n._children[o],l=a._children[o];i(s,l)}}return i(e,t),t.traverse(function(n){n.skeleton&&(n.skeleton=n.skeleton.clone(r)),n.material&&(n.material=n.material.clone())}),t},updateRenderList:function(e,t){var r=e.__uid__,i=this._renderLists.get(r);i||(i=new io,this._renderLists.put(r,i)),i.startCount(),t&&(this.viewBoundingBoxLastFrame.min.set(1/0,1/0,1/0),this.viewBoundingBoxLastFrame.max.set(-1/0,-1/0,-1/0));var n=this.material&&this.material.transparent||!1;return this._doUpdateRenderList(this,e,n,i,t),i.endCount(),i},getRenderList:function(e){return this._renderLists.get(e.__uid__)},_doUpdateRenderList:function(e,t,r,i,n){if(!e.invisible)for(var a=0;a<e._children.length;a++){var o=e._children[a];if(o.isRenderable()){var s=o.isSkinnedMesh()?G_:o.worldTransform.array,l=o.geometry;U.multiplyAffine(_f,t.viewMatrix.array,s),(n&&!l.boundingBox||!this.isFrustumCulled(o,t,_f))&&i.add(o,o.material.transparent||r)}o._children.length>0&&this._doUpdateRenderList(o,t,r,i,n)}},isFrustumCulled:(function(){var e=new pt,t=new W;return function(r,i,n){var a=r.boundingBox;if(a||(r.skeleton&&r.skeleton.boundingBox?a=r.skeleton.boundingBox:a=r.geometry.boundingBox),!a)return!1;if(t.array=n,e.transformFrom(a,t),r.castShadow&&this.viewBoundingBoxLastFrame.union(e),r.frustumCulling){if(!e.intersectBoundingBox(i.frustum.boundingBox))return!0;t.array=i.projectionMatrix.array,e.max.array[2]>0&&e.min.array[2]<0&&(e.max.array[2]=-1e-20),e.applyProjection(t);var o=e.min.array,s=e.max.array;if(s[0]<-1||o[0]>1||s[1]<-1||o[1]>1||s[2]<-1||o[2]>1)return!0}return!1}})(),_updateLightUniforms:function(){var e=this.lights;e.sort(H_);var t=this._lightUniforms;for(var r in t)for(var i in t[r])t[r][i].value.length=0;for(var n=0;n<e.length;n++){var a=e[n];if(!a.invisible){var r=a.group;for(var i in a.uniformTemplates){var o=a.uniformTemplates[i],s=o.value(a);if(s!=null){t[r]||(t[r]={}),t[r][i]||(t[r][i]={type:"",value:[]});var l=t[r][i];switch(l.type=o.type+"v",o.type){case"1i":case"1f":case"t":l.value.push(s);break;case"2f":case"3f":case"4f":for(var u=0;u<s.length;u++)l.value.push(s[u]);break;default:console.error("Unkown light uniform type "+o.type)}}}}}},getLightGroups:function(){var e=[];for(var t in this._lightNumber)e.push(t);return e},getNumberChangedLightGroups:function(){var e=[];for(var t in this._lightNumber)this.isLightNumberChanged(t)&&e.push(t);return e},isLightNumberChanged:function(e){var t=this._previousLightNumber,r=this._lightNumber;for(var i in r[e])if(!t[e]||r[e][i]!==t[e][i])return!0;for(var i in t[e])if(!r[e]||r[e][i]!==t[e][i])return!0;return!1},getLightsNumbers:function(e){return this._lightNumber[e]},getProgramKey:function(e){return this._lightProgramKeys[e]},setLightUniforms:(function(){function e(t,r,i){for(var n in t){var a=t[n];if(a.type==="tv"){if(!r.hasUniform(n))continue;for(var o=[],s=0;s<a.value.length;s++){var l=a.value[s],u=r.takeCurrentTextureSlot(i,l);o.push(u)}r.setUniform(i.gl,"1iv",n,o)}else r.setUniform(i.gl,a.type,n,a.value)}}return function(t,r,i){e(this._lightUniforms[r],t,i),e(this.shadowUniforms,t,i)}})(),dispose:function(){this.material=null,this._opaqueList=[],this._transparentList=[],this.lights=[],this._lightUniforms={},this._lightNumber={},this._nodeRepository={}}});function H_(e,t){if(t.castShadow&&!e.castShadow)return!0}let Cr=z_;var gf=(function(){function e(t){this.value=t}return e})(),V_=(function(){function e(){this._len=0}return e.prototype.insert=function(t){var r=new gf(t);return this.insertEntry(r),r},e.prototype.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},e.prototype.remove=function(t){var r=t.prev,i=t.next;r?r.next=i:this.head=i,i?i.prev=r:this.tail=r,t.next=t.prev=null,this._len--},e.prototype.len=function(){return this._len},e.prototype.clear=function(){this.head=this.tail=null,this._len=0},e})(),k_=(function(){function e(t){this._list=new V_,this._maxSize=10,this._map={},this._maxSize=t}return e.prototype.put=function(t,r){var i=this._list,n=this._map,a=null;if(n[t]==null){var o=i.len(),s=this._lastRemovedEntry;if(o>=this._maxSize&&o>0){var l=i.head;i.remove(l),delete n[l.key],a=l.value,this._lastRemovedEntry=l}s?s.value=r:s=new gf(r),s.key=t,i.insertEntry(s),n[t]=s}return a},e.prototype.get=function(t){var r=this._map[t],i=this._list;if(r!=null)return r!==i.tail&&(i.remove(r),i.insertEntry(r)),r.value},e.prototype.clear=function(){this._list.clear(),this._map={}},e.prototype.len=function(){return this._list.len()},e})();let Bn=k_;var no=of.isPowerOfTwo,W_=["px","nx","py","ny","pz","nz"],al=X.extend(function(){return{image:{px:null,nx:null,py:null,ny:null,pz:null,nz:null},pixels:{px:null,nx:null,py:null,ny:null,pz:null,nz:null},mipmaps:[]}},{textureType:"textureCube",update:function(e){var t=e.gl;t.bindTexture(t.TEXTURE_CUBE_MAP,this._cache.get("webgl_texture")),this.updateCommon(e);var r=this.format,i=this.type;t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_S,this.getAvailableWrapS()),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_WRAP_T,this.getAvailableWrapT()),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MAG_FILTER,this.getAvailableMagFilter()),t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MIN_FILTER,this.getAvailableMinFilter());var n=e.getGLExtension("EXT_texture_filter_anisotropic");if(n&&this.anisotropic>1&&t.texParameterf(t.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropic),i===36193){var a=e.getGLExtension("OES_texture_half_float");a||(i=O.FLOAT)}if(this.mipmaps.length)for(var o=this.width,s=this.height,l=0;l<this.mipmaps.length;l++){var u=this.mipmaps[l];this._updateTextureData(t,u,l,o,s,r,i),o/=2,s/=2}else this._updateTextureData(t,this,0,this.width,this.height,r,i),!this.NPOT&&this.useMipmap&&t.generateMipmap(t.TEXTURE_CUBE_MAP);t.bindTexture(t.TEXTURE_CUBE_MAP,null)},_updateTextureData:function(e,t,r,i,n,a,o){for(var s=0;s<6;s++){var l=W_[s],u=t.image&&t.image[l];u?e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+s,r,a,a,o,u):e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+s,r,a,i,n,0,a,o,t.pixels&&t.pixels[l])}},generateMipmap:function(e){var t=e.gl;this.useMipmap&&!this.NPOT&&(t.bindTexture(t.TEXTURE_CUBE_MAP,this._cache.get("webgl_texture")),t.generateMipmap(t.TEXTURE_CUBE_MAP))},bind:function(e){e.gl.bindTexture(e.gl.TEXTURE_CUBE_MAP,this.getWebGLTexture(e))},unbind:function(e){e.gl.bindTexture(e.gl.TEXTURE_CUBE_MAP,null)},isPowerOfTwo:function(){return this.image.px?no(this.image.px.width)&&no(this.image.px.height):no(this.width)&&no(this.height)},isRenderable:function(){return this.image.px?Zi(this.image.px)&&Zi(this.image.nx)&&Zi(this.image.py)&&Zi(this.image.ny)&&Zi(this.image.pz)&&Zi(this.image.nz):!!(this.width&&this.height)},load:function(e,t){var r=0,i=this;return tt.each(e,function(n,a){var o=Pe.createImage();t&&(o.crossOrigin=t),o.onload=function(){r--,r===0&&(i.dirty(),i.trigger("success",i))},o.onerror=function(){r--},r++,o.src=n,i.image[a]=o}),this}});Object.defineProperty(al.prototype,"width",{get:function(){return this.image&&this.image.px?this.image.px.width:this._width},set:function(e){this.image&&this.image.px?console.warn("Texture from image can't set width"):(this._width!==e&&this.dirty(),this._width=e)}}),Object.defineProperty(al.prototype,"height",{get:function(){return this.image&&this.image.px?this.image.px.height:this._height},set:function(e){this.image&&this.image.px?console.warn("Texture from image can't set height"):(this._height!==e&&this.dirty(),this._height=e)}});function Zi(e){return e.width>0&&e.height>0}let Fn=al;var X_=qi.extend({fov:50,aspect:1,near:.1,far:2e3},{updateProjectionMatrix:function(){var e=this.fov/180*Math.PI;this.projectionMatrix.perspective(e,this.aspect,this.near,this.far)},decomposeProjectionMatrix:function(){var e=this.projectionMatrix.array,t=Math.atan(1/e[5])*2;this.fov=t/Math.PI*180,this.aspect=e[5]/e[0],this.near=e[14]/(e[10]-1),this.far=e[14]/(e[10]+1)},clone:function(){var e=qi.prototype.clone.call(this);return e.fov=this.fov,e.aspect=this.aspect,e.near=this.near,e.far=this.far,e}});let Qe=X_;var ao="framebuffer",gr="renderbuffer",mf=gr+"_width",yf=gr+"_height",ol=gr+"_attached",sl="depthtexture_attached",ti=O.FRAMEBUFFER,Gn=O.RENDERBUFFER,Un=O.DEPTH_ATTACHMENT,xf=O.COLOR_ATTACHMENT0,zn=vt.extend({depthBuffer:!0,viewport:null,_width:0,_height:0,_textures:null,_boundRenderer:null},function(){this._cache=new Qs,this._textures={}},{getTextureWidth:function(){return this._width},getTextureHeight:function(){return this._height},bind:function(e){if(e.__currentFrameBuffer){if(e.__currentFrameBuffer===this)return;console.warn("Renderer already bound with another framebuffer. Unbind it first")}e.__currentFrameBuffer=this;var t=e.gl;t.bindFramebuffer(ti,this._getFrameBufferGL(e)),this._boundRenderer=e;var r=this._cache;r.put("viewport",e.viewport);var i=!1,n,a;for(var o in this._textures){i=!0;var s=this._textures[o];s&&(n=s.texture.width,a=s.texture.height,this._doAttach(e,s.texture,o,s.target))}this._width=n,this._height=a,!i&&this.depthBuffer&&console.error("Must attach texture before bind, or renderbuffer may have incorrect width and height."),this.viewport?e.setViewport(this.viewport):e.setViewport(0,0,n,a,1);var l=r.get("attached_textures");if(l){for(var o in l)if(!this._textures[o]){var u=l[o];this._doDetach(t,o,u)}}if(!r.get(sl)&&this.depthBuffer){r.miss(gr)&&r.put(gr,t.createRenderbuffer());var h=r.get(gr);(n!==r.get(mf)||a!==r.get(yf))&&(t.bindRenderbuffer(Gn,h),t.renderbufferStorage(Gn,t.DEPTH_COMPONENT16,n,a),r.put(mf,n),r.put(yf,a),t.bindRenderbuffer(Gn,null)),r.get(ol)||(t.framebufferRenderbuffer(ti,Un,Gn,h),r.put(ol,!0))}},unbind:function(e){e.__currentFrameBuffer=null;var t=e.gl;t.bindFramebuffer(ti,null),this._boundRenderer=null,this._cache.use(e.__uid__);var r=this._cache.get("viewport");r&&e.setViewport(r),this.updateMipmap(e)},updateMipmap:function(e){var t=e.gl;for(var r in this._textures){var i=this._textures[r];if(i){var n=i.texture;if(!n.NPOT&&n.useMipmap&&n.minFilter===X.LINEAR_MIPMAP_LINEAR){var a=n.textureType==="textureCube"?O.TEXTURE_CUBE_MAP:O.TEXTURE_2D;t.bindTexture(a,n.getWebGLTexture(e)),t.generateMipmap(a),t.bindTexture(a,null)}}}},checkStatus:function(e){return e.checkFramebufferStatus(ti)},_getFrameBufferGL:function(e){var t=this._cache;return t.use(e.__uid__),t.miss(ao)&&t.put(ao,e.gl.createFramebuffer()),t.get(ao)},attach:function(e,t,r){if(!e.width)throw new Error("The texture attached to color buffer is not a valid.");t=t||xf,r=r||O.TEXTURE_2D;var i=this._boundRenderer,n=i&&i.gl,a;if(n){var o=this._cache;o.use(i.__uid__),a=o.get("attached_textures")}var s=this._textures[t];if(!(s&&s.target===r&&s.texture===e&&a&&a[t]!=null)){var l=!0;i&&(l=this._doAttach(i,e,t,r),this.viewport||i.setViewport(0,0,e.width,e.height,1)),l&&(this._textures[t]=this._textures[t]||{},this._textures[t].texture=e,this._textures[t].target=r)}},_doAttach:function(e,t,r,i){var n=e.gl,a=t.getWebGLTexture(e),o=this._cache.get("attached_textures");if(o&&o[r]){var s=o[r];if(s.texture===t&&s.target===i)return}r=+r;var l=!0;if(r===Un||r===O.DEPTH_STENCIL_ATTACHMENT){var u=e.getGLExtension("WEBGL_depth_texture");if(u||(console.error("Depth texture is not supported by the browser"),l=!1),t.format!==O.DEPTH_COMPONENT&&t.format!==O.DEPTH_STENCIL&&(console.error("The texture attached to depth buffer is not a valid."),l=!1),l){var h=this._cache.get(gr);h&&(n.framebufferRenderbuffer(ti,Un,Gn,null),n.deleteRenderbuffer(h),this._cache.put(gr,!1)),this._cache.put(ol,!1),this._cache.put(sl,!0)}}return n.framebufferTexture2D(ti,r,i,a,0),o||(o={},this._cache.put("attached_textures",o)),o[r]=o[r]||{},o[r].texture=t,o[r].target=i,l},_doDetach:function(e,t,r){e.framebufferTexture2D(ti,t,r,null,0);var i=this._cache.get("attached_textures");i&&i[t]&&(i[t]=null),(t===Un||t===O.DEPTH_STENCIL_ATTACHMENT)&&this._cache.put(sl,!1)},detach:function(e,t){if(this._textures[e]=null,this._boundRenderer){var r=this._cache;r.use(this._boundRenderer.__uid__),this._doDetach(this._boundRenderer.gl,e,t)}},dispose:function(e){var t=e.gl,r=this._cache;r.use(e.__uid__);var i=r.get(gr);i&&t.deleteRenderbuffer(i);var n=r.get(ao);n&&t.deleteFramebuffer(n),r.deleteContext(e.__uid__),this._textures={}}});zn.DEPTH_ATTACHMENT=Un,zn.COLOR_ATTACHMENT0=xf,zn.STENCIL_ATTACHMENT=O.STENCIL_ATTACHMENT,zn.DEPTH_STENCIL_ATTACHMENT=O.DEPTH_STENCIL_ATTACHMENT;let Je=zn;var j_=["px","nx","py","ny","pz","nz"],q_=vt.extend(function(){var e={position:new z,far:1e3,near:.1,texture:null,shadowMapPass:null},t=e._cameras={px:new Qe({fov:90}),nx:new Qe({fov:90}),py:new Qe({fov:90}),ny:new Qe({fov:90}),pz:new Qe({fov:90}),nz:new Qe({fov:90})};return t.px.lookAt(z.POSITIVE_X,z.NEGATIVE_Y),t.nx.lookAt(z.NEGATIVE_X,z.NEGATIVE_Y),t.py.lookAt(z.POSITIVE_Y,z.POSITIVE_Z),t.ny.lookAt(z.NEGATIVE_Y,z.NEGATIVE_Z),t.pz.lookAt(z.POSITIVE_Z,z.NEGATIVE_Y),t.nz.lookAt(z.NEGATIVE_Z,z.NEGATIVE_Y),e._frameBuffer=new Je,e},{getCamera:function(e){return this._cameras[e]},render:function(e,t,r){var i=e.gl;r||t.update();for(var n=this.texture.width,a=2*Math.atan(n/(n-.5))/Math.PI*180,o=0;o<6;o++){var s=j_[o],l=this._cameras[s];if(z.copy(l.position,this.position),l.far=this.far,l.near=this.near,l.fov=a,this.shadowMapPass){l.update();var u=t.getBoundingBox();u.applyTransform(l.viewMatrix),t.viewBoundingBoxLastFrame.copy(u),this.shadowMapPass.render(e,t,l,!0)}this._frameBuffer.attach(this.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+o),this._frameBuffer.bind(e),e.render(t,l,!0),this._frameBuffer.unbind(e)}},dispose:function(e){this._frameBuffer.dispose(e)}});let ll=q_;var Z_=ce.extend({dynamic:!1,widthSegments:1,heightSegments:1},function(){this.build()},{build:function(){for(var e=this.heightSegments,t=this.widthSegments,r=this.attributes,i=[],n=[],a=[],o=[],s=0;s<=e;s++)for(var l=s/e,u=0;u<=t;u++){var h=u/t;if(i.push([2*h-1,2*l-1,0]),n&&n.push([h,l]),a&&a.push([0,0,1]),u<t&&s<e){var f=u+s*(t+1);o.push([f,f+1,f+t+1]),o.push([f+t+1,f+1,f+t+2])}}r.position.fromArray(i),r.texcoord0.fromArray(n),r.normal.fromArray(a),this.initIndicesFromArray(o),this.boundingBox=new pt,this.boundingBox.min.set(-1,-1,0),this.boundingBox.max.set(1,1,0)}});let oo=Z_;var De=new W,Y_=ce.extend({dynamic:!1,widthSegments:1,heightSegments:1,depthSegments:1,inside:!1},function(){this.build()},{build:function(){var e={px:Yi("px",this.depthSegments,this.heightSegments),nx:Yi("nx",this.depthSegments,this.heightSegments),py:Yi("py",this.widthSegments,this.depthSegments),ny:Yi("ny",this.widthSegments,this.depthSegments),pz:Yi("pz",this.widthSegments,this.heightSegments),nz:Yi("nz",this.widthSegments,this.heightSegments)},t=["position","texcoord0","normal"],r=0,i=0;for(var n in e)r+=e[n].vertexCount,i+=e[n].indices.length;for(var a=0;a<t.length;a++)this.attributes[t[a]].init(r);this.indices=new Pe.Uint16Array(i);var o=0,s=0;for(var n in e){for(var l=e[n],a=0;a<t.length;a++)for(var u=t[a],h=l.attributes[u].value,f=l.attributes[u].size,c=u==="normal",d=0;d<h.length;d++){var v=h[d];this.inside&&c&&(v=-v),this.attributes[u].value[d+f*s]=v}for(var p=l.indices.length,d=0;d<l.indices.length;d++)this.indices[d+o]=s+l.indices[this.inside?p-d-1:d];o+=l.indices.length,s+=l.vertexCount}this.boundingBox=new pt,this.boundingBox.max.set(1,1,1),this.boundingBox.min.set(-1,-1,-1)}});function Yi(e,t,r){De.identity();var i=new oo({widthSegments:t,heightSegments:r});switch(e){case"px":W.translate(De,De,z.POSITIVE_X),W.rotateY(De,De,Math.PI/2);break;case"nx":W.translate(De,De,z.NEGATIVE_X),W.rotateY(De,De,-Math.PI/2);break;case"py":W.translate(De,De,z.POSITIVE_Y),W.rotateX(De,De,-Math.PI/2);break;case"ny":W.translate(De,De,z.NEGATIVE_Y),W.rotateX(De,De,Math.PI/2);break;case"pz":W.translate(De,De,z.POSITIVE_Z);break;case"nz":W.translate(De,De,z.NEGATIVE_Z),W.rotateY(De,De,Math.PI);break}return i.applyTransform(De),i}let Tf=Y_;V.import(`@export clay.skybox.vertex
#define SHADER_NAME skybox
uniform mat4 world : WORLD;
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
attribute vec3 position : POSITION;
varying vec3 v_WorldPosition;
void main()
{
 v_WorldPosition = (world * vec4(position, 1.0)).xyz;
 gl_Position = worldViewProjection * vec4(position, 1.0);
}
@end
@export clay.skybox.fragment
#define PI 3.1415926
uniform mat4 viewInverse : VIEWINVERSE;
#ifdef EQUIRECTANGULAR
uniform sampler2D environmentMap;
#else
uniform samplerCube environmentMap;
#endif
uniform float lod: 0.0;
varying vec3 v_WorldPosition;
@import clay.util.rgbm
@import clay.util.srgb
@import clay.util.ACES
void main()
{
 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(v_WorldPosition - eyePos);
#ifdef EQUIRECTANGULAR
 float phi = acos(V.y);
 float theta = atan(-V.x, V.z) + PI * 0.5;
 vec2 uv = vec2(theta / 2.0 / PI, phi / PI);
 vec4 texel = decodeHDR(texture2D(environmentMap, fract(uv)));
#else
 #if defined(LOD) || defined(SUPPORT_TEXTURE_LOD)
 vec4 texel = decodeHDR(textureCubeLodEXT(environmentMap, V, lod));
 #else
 vec4 texel = decodeHDR(textureCube(environmentMap, V));
 #endif
#endif
#ifdef SRGB_DECODE
 texel = sRGBToLinear(texel);
#endif
#ifdef TONEMAPPING
 texel.rgb = ACESToneMapping(texel.rgb);
#endif
#ifdef SRGB_ENCODE
 texel = linearTosRGB(texel);
#endif
 gl_FragColor = encodeHDR(vec4(texel.rgb, 1.0));
}
@end`);var K_=Kr.extend(function(){var e=new V({vertex:V.source("clay.skybox.vertex"),fragment:V.source("clay.skybox.fragment")}),t=new Gt({shader:e,depthMask:!1});return{scene:null,geometry:new Tf,material:t,environmentMap:null,culling:!1,_dummyCamera:new Qe}},function(){var e=this.scene;e&&this.attachScene(e),this.environmentMap&&this.setEnvironmentMap(this.environmentMap)},{attachScene:function(e){this.scene&&this.detachScene(),e.skybox=this,this.scene=e,e.on("beforerender",this._beforeRenderScene,this)},detachScene:function(){this.scene&&(this.scene.off("beforerender",this._beforeRenderScene),this.scene.skybox=null),this.scene=null},dispose:function(e){this.detachScene(),this.geometry.dispose(e)},setEnvironmentMap:function(e){e.textureType==="texture2D"?(this.material.define("EQUIRECTANGULAR"),e.minFilter=X.LINEAR):this.material.undefine("EQUIRECTANGULAR"),this.material.set("environmentMap",e)},getEnvironmentMap:function(){return this.material.get("environmentMap")},_beforeRenderScene:function(e,t,r){this.renderSkybox(e,r)},renderSkybox:function(e,t){var r=this._dummyCamera;r.aspect=e.getViewportAspect(),r.fov=t.fov||50,r.updateProjectionMatrix(),W.invert(r.invProjectionMatrix,r.projectionMatrix),r.worldTransform.copy(t.worldTransform),r.viewMatrix.copy(t.viewMatrix),this.position.copy(t.getWorldPosition()),this.update(),e.gl.disable(e.gl.BLEND),this.material.get("lod")>0?this.material.define("fragment","LOD"):this.material.undefine("fragment","LOD"),e.renderPass([this],r)}});let so=K_,wf=so;var Q_=542327876,XS=1,jS=2,qS=4,ZS=8,YS=4096,J_=131072,KS=524288,QS=8388608,JS=8,$S=4194304,eb=4096,$_=512,tb=1024,rb=2048,ib=4096,nb=8192,ab=16384,ob=32768,sb=2097152,lb=1,ub=2,eg=4,hb=64,fb=512,cb=131072;function ul(e){return e.charCodeAt(0)+(e.charCodeAt(1)<<8)+(e.charCodeAt(2)<<16)+(e.charCodeAt(3)<<24)}function db(e){return String.fromCharCode(e&255,e>>8&255,e>>16&255,e>>24&255)}var tg=31,rg=ul("DXT1"),ig=ul("DXT3"),ng=ul("DXT5"),ag=0,og=1,sg=2,lg=3,ug=4,hg=7,fg=20,cg=21,vb=27,dg=28,pb=29,_b=30,vg={parse:function(e,t){var r=new Int32Array(e,0,tg);if(r[ag]!==Q_||!r(fg)&eg)return null;var i=r(cg),n=r[ug],a=r[lg],o=r[dg]&$_,s=r[sg]&J_,l,u;switch(i){case rg:l=8,u=X.COMPRESSED_RGB_S3TC_DXT1_EXT;break;case ig:l=16,u=X.COMPRESSED_RGBA_S3TC_DXT3_EXT;break;case ng:l=16,u=X.COMPRESSED_RGBA_S3TC_DXT5_EXT;break;default:return null}var h=r[og]+4,f=o?6:1,c=1;s&&(c=Math.max(1,r[hg]));for(var d=[],v=0;v<f;v++){var p=n,_=a;d[v]=new ee({width:p,height:_,format:u});for(var g=[],m=0;m<c;m++){var y=Math.max(4,p)/4*Math.max(4,_)/4*l,x=new Uint8Array(e,h,y);h+=y,p*=.5,_*=.5,g[m]=x}d[v].pixels=g[0],s&&(d[v].mipmaps=g)}if(t)t.width=d[0].width,t.height=d[0].height,t.format=d[0].format,t.pixels=d[0].pixels,t.mipmaps=d[0].mipmaps;else return d[0]}};let pg=vg;var lo=String.fromCharCode,_g=8,gg=32767;function mg(e,t,r,i){if(e[3]>0){var n=Math.pow(2,e[3]-128-8+i);t[r+0]=e[0]*n,t[r+1]=e[1]*n,t[r+2]=e[2]*n}else t[r+0]=0,t[r+1]=0,t[r+2]=0;return t[r+3]=1,t}function yg(e,t,r){for(var i="",n=t;n<r;n++)i+=lo(e[n]);return i}function xg(e,t){t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3]}function Sf(e,t,r,i){for(var n=0,a=0,o=i;o>0;)if(e[a][0]=t[r++],e[a][1]=t[r++],e[a][2]=t[r++],e[a][3]=t[r++],e[a][0]===1&&e[a][1]===1&&e[a][2]===1){for(var s=e[a][3]<<n>>>0;s>0;s--)xg(e[a-1],e[a]),a++,o--;n+=8}else a++,o--,n=0;return r}function Tg(e,t,r,i){if(i<_g|i>gg)return Sf(e,t,r,i);var n=t[r++];if(n!=2)return Sf(e,t,r-1,i);if(e[0][1]=t[r++],e[0][2]=t[r++],n=t[r++],(e[0][2]<<8>>>0|n)>>>0!==i)return null;for(var n=0;n<4;n++)for(var a=0;a<i;){var o=t[r++];if(o>128){o=(o&127)>>>0;for(var s=t[r++];o--;)e[a++][n]=s}else for(;o--;)e[a++][n]=t[r++]}return r}var wg={parseRGBE:function(e,t,r){r==null&&(r=0);var i=new Uint8Array(e),n=i.length;if(yg(i,0,2)==="#?"){for(var a=2;a<n&&!(lo(i[a])===`
`&&lo(i[a+1])===`
`);a++);if(!(a>=n)){a+=2;for(var o="";a<n;a++){var s=lo(i[a]);if(s===`
`)break;o+=s}var l=o.split(" "),u=parseInt(l[1]),h=parseInt(l[3]);if(!(!h||!u)){for(var f=a+1,c=[],d=0;d<h;d++){c[d]=[];for(var v=0;v<4;v++)c[d][v]=0}for(var p=new Float32Array(h*u*4),_=0,g=0;g<u;g++){var f=Tg(c,i,f,h);if(!f)return null;for(var d=0;d<h;d++)mg(c[d],p,_,r),_+=4}return t||(t=new ee),t.width=h,t.height=u,t.pixels=p,t.type=X.FLOAT,t}}}},parseRGBEFromPNG:function(e){}};let Sg=wg;var uo={loadTexture:function(e,t,r,i){var n;if(typeof t=="function"?(r=t,i=r,t={}):t=t||{},typeof e=="string"){if(e.match(/.hdr$/)||t.fileType==="hdr")return n=new ee({width:0,height:0,sRGB:!1}),uo._fetchTexture(e,function(a){Sg.parseRGBE(a,n,t.exposure),n.dirty(),r&&r(n)},i),n;e.match(/.dds$/)||t.fileType==="dds"?(n=new ee({width:0,height:0}),uo._fetchTexture(e,function(a){pg.parse(a,n),n.dirty(),r&&r(n)},i)):(n=new ee,n.load(e),n.success(r),n.error(i))}else typeof e=="object"&&typeof e.px<"u"&&(n=new Fn,n.load(e),n.success(r),n.error(i));return n},loadPanorama:function(e,t,r,i,n,a){var o=this;typeof i=="function"?(n=i,a=n,i={}):i=i||{},uo.loadTexture(t,i,function(s){s.flipY=i.flipY||!1,o.panoramaToCubeMap(e,s,r,i),s.dispose(e),n&&n(r)},a)},panoramaToCubeMap:function(e,t,r,i){var n=new ll,a=new wf({scene:new Cr});return a.setEnvironmentMap(t),i=i||{},i.encodeRGBM&&a.material.define("fragment","RGBM_ENCODE"),r.sRGB=t.sRGB,n.texture=r,n.render(e,a.scene),n.texture=null,n.dispose(e),r},heightToNormal:function(e,t){var r=document.createElement("canvas"),i=r.width=e.width,n=r.height=e.height,a=r.getContext("2d");a.drawImage(e,0,0,i,n),t=t||!1;for(var o=a.getImageData(0,0,i,n),s=a.createImageData(i,n),l=0;l<o.data.length;l+=4){if(t){var u=o.data[l],h=o.data[l+1],f=o.data[l+2],c=Math.abs(u-h)+Math.abs(h-f);if(c>20)return console.warn("Given image is not a height map"),e}var d,v,p,_;l%(i*4)===0?(d=o.data[l],p=o.data[l+4]):l%(i*4)===(i-1)*4?(d=o.data[l-4],p=o.data[l]):(d=o.data[l-4],p=o.data[l+4]),l<i*4?(v=o.data[l],_=o.data[l+i*4]):l>i*(n-1)*4?(v=o.data[l-i*4],_=o.data[l]):(v=o.data[l-i*4],_=o.data[l+i*4]),s.data[l]=d-p+127,s.data[l+1]=v-_+127,s.data[l+2]=255,s.data[l+3]=255}return a.putImageData(s,0,0),r},isHeightImage:function(e,t,r){if(!e||!e.width||!e.height)return!1;var i=document.createElement("canvas"),n=i.getContext("2d"),a=t||32;r=r||20,i.width=i.height=a,n.drawImage(e,0,0,a,a);for(var o=n.getImageData(0,0,a,a),s=0;s<o.data.length;s+=4){var l=o.data[s],u=o.data[s+1],h=o.data[s+2],f=Math.abs(l-u)+Math.abs(u-h);if(f>r)return!1}return!0},_fetchTexture:function(e,t,r){Pe.request.get({url:e,responseType:"arraybuffer",onload:t,onerror:r})},createChessboard:function(e,t,r,i){e=e||512,t=t||64,r=r||"black",i=i||"white";var n=Math.ceil(e/t),a=document.createElement("canvas");a.width=e,a.height=e;var o=a.getContext("2d");o.fillStyle=i,o.fillRect(0,0,e,e),o.fillStyle=r;for(var s=0;s<n;s++)for(var l=0;l<n;l++){var u=l%2?s%2:s%2-1;u&&o.fillRect(s*t,l*t,t,t)}var h=new ee({image:a,anisotropic:8});return h},createBlank:function(e){var t=document.createElement("canvas");t.width=1,t.height=1;var r=t.getContext("2d");r.fillStyle=e,r.fillRect(0,0,1,1);var i=new ee({image:t});return i}};let ri=uo;function ho(e){return e&&typeof e=="object"&&!Array.isArray(e)&&typeof e.count=="function"&&typeof e.getItem=="function"&&typeof e.getSource!="function"&&(e.getSource=function(){return{sourceFormat:"original",seriesLayoutBy:"column",startIndex:0,dimensionsDefine:null}},e.persistent==null&&(e.persistent=!0)),e}function bf(e,t){if(!e.__ECGLOnRefresh){e.__ECGLOnRefresh=!0;var r=e._refresh?"_refresh":"refreshImmediately",i=e[r];e[r]=function(){i.apply(this,arguments),t()}}}var hl=["mousedown","mouseup","mousemove","mouseover","mouseout","click","dblclick","contextmenu"];function fl(e){return"_on"+e}var cl=function(e){var t=this;this._texture=new ee({anisotropic:32,flipY:!1,surface:this,dispose:function(r){t.dispose(),ee.prototype.dispose.call(this,r)}}),hl.forEach(function(r){this[fl(r)]=function(i){i.triangle&&this._meshes.forEach(function(n){this.dispatchEvent(r,n,i.triangle,i.point)},this)}},this),this._meshes=[],e&&this.setECharts(e),this.onupdate=null};cl.prototype={constructor:cl,getTexture:function(){return this._texture},setECharts:function(e){this._chart=e;var t=e.getDom();if(!(t instanceof HTMLCanvasElement))console.error("ECharts must init on canvas if it is used as texture."),t=document.createElement("canvas");else{var r=this;bf(e.getZr(),function(){r._texture.dirty(),r.onupdate&&r.onupdate()})}this._texture.image=t,this._texture.dirty(),this.onupdate&&this.onupdate()},dispatchEvent:(function(){var e=new z,t=new z,r=new z,i=new Pt,n=new Pt,a=new Pt,o=new Pt,s=new z;return function(l,u,h,f){var c=u.geometry,d=c.attributes.position,v=c.attributes.texcoord0,p=z.dot,_=z.cross;d.get(h[0],e.array),d.get(h[1],t.array),d.get(h[2],r.array),v.get(h[0],i.array),v.get(h[1],n.array),v.get(h[2],a.array),_(s,t,r);var g=p(e,s),m=p(f,s)/g;_(s,r,e);var y=p(f,s)/g;_(s,e,t);var x=p(f,s)/g;Pt.scale(o,i,m),Pt.scaleAndAdd(o,o,n,y),Pt.scaleAndAdd(o,o,a,x);var w=o.x*this._chart.getWidth(),T=o.y*this._chart.getHeight();this._chart.getZr().handler.dispatch(l,{zrX:w,zrY:T})}})(),attachToMesh:function(e){this._meshes.indexOf(e)>=0||(hl.forEach(function(t){e.on(t,this[fl(t)],this)},this),this._meshes.push(e))},detachFromMesh:function(e){var t=this._meshes.indexOf(e);t>=0&&this._meshes.splice(t,1),hl.forEach(function(r){e.off(r,this[fl(r)])},this)},dispose:function(){this._meshes.forEach(function(e){this.detachFromMesh(e)},this)}};let bg=cl;var Eg=qi.extend({left:-1,right:1,near:-1,far:1,top:1,bottom:-1},{updateProjectionMatrix:function(){this.projectionMatrix.ortho(this.left,this.right,this.bottom,this.top,this.near,this.far)},decomposeProjectionMatrix:function(){var e=this.projectionMatrix.array;this.left=(-1-e[12])/e[0],this.right=(1-e[12])/e[0],this.top=(1-e[13])/e[5],this.bottom=(-1-e[13])/e[5],this.near=-(-1-e[14])/e[10],this.far=-(1-e[14])/e[10]},clone:function(){var e=qi.prototype.clone.call(this);return e.left=this.left,e.right=this.right,e.near=this.near,e.far=this.far,e.top=this.top,e.bottom=this.bottom,e}});let Ki=Eg;V.import(`
@export clay.compositor.vertex
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
attribute vec3 position : POSITION;
attribute vec2 texcoord : TEXCOORD_0;
varying vec2 v_Texcoord;
void main()
{
 v_Texcoord = texcoord;
 gl_Position = worldViewProjection * vec4(position, 1.0);
}
@end`);var Ag=new oo,Ef=new Kr({geometry:Ag,frustumCulling:!1}),Mg=new Ki,Dg=vt.extend(function(){return{fragment:"",outputs:null,material:null,blendWithPrevious:!1,clearColor:!1,clearDepth:!0}},function(){var e=new V(V.source("clay.compositor.vertex"),this.fragment),t=new Gt({shader:e});t.enableTexturesAll(),this.material=t},{setUniform:function(e,t){this.material.setUniform(e,t)},getUniform:function(e){var t=this.material.uniforms[e];if(t)return t.value},attachOutput:function(e,t){this.outputs||(this.outputs={}),t=t||O.COLOR_ATTACHMENT0,this.outputs[t]=e},detachOutput:function(e){for(var t in this.outputs)this.outputs[t]===e&&(this.outputs[t]=null)},bind:function(e,t){if(this.outputs)for(var r in this.outputs){var i=this.outputs[r];i&&t.attach(i,r)}t&&t.bind(e)},unbind:function(e,t){t.unbind(e)},render:function(e,t){var r=e.gl;if(t){this.bind(e,t);var i=e.getGLExtension("EXT_draw_buffers");if(i&&this.outputs){var n=[];for(var a in this.outputs)a=+a,a>=r.COLOR_ATTACHMENT0&&a<=r.COLOR_ATTACHMENT0+8&&n.push(a);i.drawBuffersEXT(n)}}this.trigger("beforerender",this,e);var o=this.clearDepth?r.DEPTH_BUFFER_BIT:0;if(r.depthMask(!0),this.clearColor){o=o|r.COLOR_BUFFER_BIT,r.colorMask(!0,!0,!0,!0);var s=this.clearColor;Array.isArray(s)&&r.clearColor(s[0],s[1],s[2],s[3])}r.clear(o),this.blendWithPrevious?(r.enable(r.BLEND),this.material.transparent=!0):(r.disable(r.BLEND),this.material.transparent=!1),this.renderQuad(e),this.trigger("afterrender",this,e),t&&this.unbind(e,t)},renderQuad:function(e){Ef.material=this.material,e.renderPass([Ef],Mg)},dispose:function(e){}});let Fe=Dg,Cg=`#define SAMPLE_NUMBER 1024
#define PI 3.14159265358979
uniform sampler2D normalDistribution;
uniform vec2 viewportSize : [512, 256];
const vec3 N = vec3(0.0, 0.0, 1.0);
const float fSampleNumber = float(SAMPLE_NUMBER);
vec3 importanceSampleNormal(float i, float roughness, vec3 N) {
 vec3 H = texture2D(normalDistribution, vec2(roughness, i)).rgb;
 vec3 upVector = abs(N.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
 vec3 tangentX = normalize(cross(N, upVector));
 vec3 tangentZ = cross(N, tangentX);
 return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);
}
float G_Smith(float roughness, float NoV, float NoL) {
 float k = roughness * roughness / 2.0;
 float G1V = NoV / (NoV * (1.0 - k) + k);
 float G1L = NoL / (NoL * (1.0 - k) + k);
 return G1L * G1V;
}
void main() {
 vec2 uv = gl_FragCoord.xy / viewportSize;
 float NoV = uv.x;
 float roughness = uv.y;
 vec3 V;
 V.x = sqrt(1.0 - NoV * NoV);
 V.y = 0.0;
 V.z = NoV;
 float A = 0.0;
 float B = 0.0;
 for (int i = 0; i < SAMPLE_NUMBER; i++) {
 vec3 H = importanceSampleNormal(float(i) / fSampleNumber, roughness, N);
 vec3 L = reflect(-V, H);
 float NoL = clamp(L.z, 0.0, 1.0);
 float NoH = clamp(H.z, 0.0, 1.0);
 float VoH = clamp(dot(V, H), 0.0, 1.0);
 if (NoL > 0.0) {
 float G = G_Smith(roughness, NoV, NoL);
 float G_Vis = G * VoH / (NoH * NoV);
 float Fc = pow(1.0 - VoH, 5.0);
 A += (1.0 - Fc) * G_Vis;
 B += Fc * G_Vis;
 }
 }
 gl_FragColor = vec4(vec2(A, B) / fSampleNumber, 0.0, 1.0);
}
`,Lg=`#define SHADER_NAME prefilter
#define SAMPLE_NUMBER 1024
#define PI 3.14159265358979
uniform mat4 viewInverse : VIEWINVERSE;
uniform samplerCube environmentMap;
uniform sampler2D normalDistribution;
uniform float roughness : 0.5;
varying vec2 v_Texcoord;
varying vec3 v_WorldPosition;
@import clay.util.rgbm
vec3 importanceSampleNormal(float i, float roughness, vec3 N) {
 vec3 H = texture2D(normalDistribution, vec2(roughness, i)).rgb;
 vec3 upVector = abs(N.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
 vec3 tangentX = normalize(cross(N, upVector));
 vec3 tangentZ = cross(N, tangentX);
 return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);
}
void main() {
 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(v_WorldPosition - eyePos);
 vec3 N = V;
 vec3 prefilteredColor = vec3(0.0);
 float totalWeight = 0.0;
 float fMaxSampleNumber = float(SAMPLE_NUMBER);
 for (int i = 0; i < SAMPLE_NUMBER; i++) {
 vec3 H = importanceSampleNormal(float(i) / fMaxSampleNumber, roughness, N);
 vec3 L = reflect(-V, H);
 float NoL = clamp(dot(N, L), 0.0, 1.0);
 if (NoL > 0.0) {
 prefilteredColor += decodeHDR(textureCube(environmentMap, L)).rgb * NoL;
 totalWeight += NoL;
 }
 }
 gl_FragColor = encodeHDR(vec4(prefilteredColor / totalWeight, 1.0));
}
`;var ii={},dl=["px","nx","py","ny","pz","nz"];ii.prefilterEnvironmentMap=function(e,t,r,i,n){(!n||!i)&&(i=ii.generateNormalDistribution(),n=ii.integrateBRDF(e,i)),r=r||{};var a=r.width||64,o=r.height||64,s=r.type||t.type,l=new Fn({width:a,height:o,type:s,flipY:!1,mipmaps:[]});l.isPowerOfTwo()||console.warn("Width and height must be power of two to enable mipmap.");var u=Math.min(a,o),h=Math.log(u)/Math.log(2)+1,f=new Gt({shader:new V({vertex:V.source("clay.skybox.vertex"),fragment:Lg})});f.set("normalDistribution",i),r.encodeRGBM&&f.define("fragment","RGBM_ENCODE"),r.decodeRGBM&&f.define("fragment","RGBM_DECODE");var c=new Cr,d;if(t.textureType==="texture2D"){var v=new Fn({width:a,height:o,type:s===X.FLOAT?X.HALF_FLOAT:s});ri.panoramaToCubeMap(e,t,v,{encodeRGBM:r.decodeRGBM}),t=v}d=new so({scene:c,material:f}),d.material.set("environmentMap",t);var p=new ll({texture:l});r.encodeRGBM&&(s=l.type=X.UNSIGNED_BYTE);for(var _=new ee({width:a,height:o,type:s}),g=new Je({depthBuffer:!1}),m=Pe[s===X.UNSIGNED_BYTE?"Uint8Array":"Float32Array"],y=0;y<h;y++){l.mipmaps[y]={pixels:{}},d.material.set("roughness",y/(h-1));for(var x=_.width,w=2*Math.atan(x/(x-.5))/Math.PI*180,T=0;T<dl.length;T++){var E=new m(_.width*_.height*4);g.attach(_),g.bind(e);var b=p.getCamera(dl[T]);b.fov=w,e.render(c,b),e.gl.readPixels(0,0,_.width,_.height,X.RGBA,s,E),g.unbind(e),l.mipmaps[y].pixels[dl[T]]=E}_.width/=2,_.height/=2,_.dirty()}return g.dispose(e),_.dispose(e),d.dispose(e),i.dispose(e),{environmentMap:l,brdfLookup:n,normalDistribution:i,maxMipmapLevel:h}},ii.integrateBRDF=function(e,t){t=t||ii.generateNormalDistribution();var r=new Je({depthBuffer:!1}),i=new Fe({fragment:Cg}),n=new ee({width:512,height:256,type:X.HALF_FLOAT,wrapS:X.CLAMP_TO_EDGE,wrapT:X.CLAMP_TO_EDGE,minFilter:X.NEAREST,magFilter:X.NEAREST,useMipmap:!1});return i.setUniform("normalDistribution",t),i.setUniform("viewportSize",[512,256]),i.attachOutput(n),i.render(e,r),r.dispose(e),n},ii.generateNormalDistribution=function(r,i){for(var r=r||256,i=i||1024,n=new ee({width:r,height:i,type:X.FLOAT,minFilter:X.NEAREST,magFilter:X.NEAREST,wrapS:X.CLAMP_TO_EDGE,wrapT:X.CLAMP_TO_EDGE,useMipmap:!1}),a=new Float32Array(i*r*4),o=[],s=0;s<r;s++){for(var l=s/r,u=l*l,h=0;h<i;h++){var f=(h<<16|h>>>16)>>>0;f=((f&1431655765)<<1|(f&2863311530)>>>1)>>>0,f=((f&858993459)<<2|(f&3435973836)>>>2)>>>0,f=((f&252645135)<<4|(f&4042322160)>>>4)>>>0,f=(((f&16711935)<<8|(f&4278255360)>>>8)>>>0)/4294967296;var c=Math.sqrt((1-f)/(1+(u*u-1)*f));o[h]=c}for(var h=0;h<i;h++){var d=(h*r+s)*4,c=o[h],v=Math.sqrt(1-c*c),p=h/i,_=2*Math.PI*p;a[d]=v*Math.cos(_),a[d+1]=c,a[d+2]=v*Math.sin(_),a[d+3]=1}}return n.pixels=a,n};let fo=ii;var Pg=Kt.extend({cubemap:null,castShadow:!1,_normalDistribution:null,_brdfLookup:null},{type:"AMBIENT_CUBEMAP_LIGHT",prefilter:function(e,t){if(!e.getGLExtension("EXT_shader_texture_lod")){console.warn("Device not support textureCubeLodEXT");return}this._brdfLookup||(this._normalDistribution=fo.generateNormalDistribution(),this._brdfLookup=fo.integrateBRDF(e,this._normalDistribution));var r=this.cubemap;if(!r.__prefiltered){var i=fo.prefilterEnvironmentMap(e,r,{encodeRGBM:!0,width:t,height:t},this._normalDistribution,this._brdfLookup);this.cubemap=i.environmentMap,this.cubemap.__prefiltered=!0,r.dispose(e)}},getBRDFLookup:function(){return this._brdfLookup},uniformTemplates:{ambientCubemapLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}},ambientCubemapLightCubemap:{type:"t",value:function(e){return e.cubemap}},ambientCubemapLightBRDFLookup:{type:"t",value:function(e){return e._brdfLookup}}}});let Rg=Pg;var Ng=Kt.extend({castShadow:!1,coefficients:[]},function(){this._coefficientsTmpArr=new Pe.Float32Array(27)},{type:"AMBIENT_SH_LIGHT",uniformTemplates:{ambientSHLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}},ambientSHLightCoefficients:{type:"3f",value:function(e){for(var t=e._coefficientsTmpArr,r=0;r<e.coefficients.length;r++)t[r]=e.coefficients[r];return t}}}});let Ig=Ng,Og=`uniform samplerCube environmentMap;
varying vec2 v_Texcoord;
#define TEXTURE_SIZE 16
mat3 front = mat3(
 1.0, 0.0, 0.0,
 0.0, 1.0, 0.0,
 0.0, 0.0, 1.0
);
mat3 back = mat3(
 -1.0, 0.0, 0.0,
 0.0, 1.0, 0.0,
 0.0, 0.0, -1.0
);
mat3 left = mat3(
 0.0, 0.0, -1.0,
 0.0, 1.0, 0.0,
 1.0, 0.0, 0.0
);
mat3 right = mat3(
 0.0, 0.0, 1.0,
 0.0, 1.0, 0.0,
 -1.0, 0.0, 0.0
);
mat3 up = mat3(
 1.0, 0.0, 0.0,
 0.0, 0.0, 1.0,
 0.0, -1.0, 0.0
);
mat3 down = mat3(
 1.0, 0.0, 0.0,
 0.0, 0.0, -1.0,
 0.0, 1.0, 0.0
);
float harmonics(vec3 normal){
 int index = int(gl_FragCoord.x);
 float x = normal.x;
 float y = normal.y;
 float z = normal.z;
 if(index==0){
 return 1.0;
 }
 else if(index==1){
 return x;
 }
 else if(index==2){
 return y;
 }
 else if(index==3){
 return z;
 }
 else if(index==4){
 return x*z;
 }
 else if(index==5){
 return y*z;
 }
 else if(index==6){
 return x*y;
 }
 else if(index==7){
 return 3.0*z*z - 1.0;
 }
 else{
 return x*x - y*y;
 }
}
vec3 sampleSide(mat3 rot)
{
 vec3 result = vec3(0.0);
 float divider = 0.0;
 for (int i = 0; i < TEXTURE_SIZE * TEXTURE_SIZE; i++) {
 float x = mod(float(i), float(TEXTURE_SIZE));
 float y = float(i / TEXTURE_SIZE);
 vec2 sidecoord = ((vec2(x, y) + vec2(0.5, 0.5)) / vec2(TEXTURE_SIZE)) * 2.0 - 1.0;
 vec3 normal = normalize(vec3(sidecoord, -1.0));
 vec3 fetchNormal = rot * normal;
 vec3 texel = textureCube(environmentMap, fetchNormal).rgb;
 result += harmonics(fetchNormal) * texel * -normal.z;
 divider += -normal.z;
 }
 return result / divider;
}
void main()
{
 vec3 result = (
 sampleSide(front) +
 sampleSide(back) +
 sampleSide(left) +
 sampleSide(right) +
 sampleSide(up) +
 sampleSide(down)
 ) / 6.0;
 gl_FragColor = vec4(result, 1.0);
}`;var Af={},ni=["px","nx","py","ny","pz","nz"];function mb(e,t){var r=new ee({width:9,height:1,type:X.FLOAT}),i=new Fe({fragment:Og});i.material.define("fragment","TEXTURE_SIZE",t.width),i.setUniform("environmentMap",t);var n=new Je;n.attach(r),i.render(e,n),n.bind(e);var a=new Pe.Float32Array(36);e.gl.readPixels(0,0,9,1,X.RGBA,X.FLOAT,a);for(var o=new Pe.Float32Array(27),s=0;s<9;s++)o[s*3]=a[s*4],o[s*3+1]=a[s*4+1],o[s*3+2]=a[s*4+2];return n.unbind(e),n.dispose(e),i.dispose(e),o}function Bg(e,t){var r=e[0],i=e[1],n=e[2];return t===0?1:t===1?r:t===2?i:t===3?n:t===4?r*n:t===5?i*n:t===6?r*i:t===7?3*n*n-1:r*r-i*i}var Fg={px:[2,1,0,-1,-1,1],nx:[2,1,0,1,-1,-1],py:[0,2,1,1,-1,-1],ny:[0,2,1,1,1,1],pz:[0,1,2,-1,-1,-1],nz:[0,1,2,1,-1,1]};function Gg(e,t,r,i){for(var n=new Pe.Float32Array(27),a=C.create(),o=C.create(),s=C.create(),l=0;l<9;l++){for(var u=C.create(),h=0;h<ni.length;h++){for(var f=t[ni[h]],c=C.create(),d=0,v=0,p=Fg[ni[h]],_=0;_<i;_++)for(var g=0;g<r;g++){a[0]=g/(r-1)*2-1,a[1]=_/(i-1)*2-1,a[2]=-1,C.normalize(a,a),s[0]=a[p[0]]*p[3],s[1]=a[p[1]]*p[4],s[2]=a[p[2]]*p[5],o[0]=f[v++]/255,o[1]=f[v++]/255,o[2]=f[v++]/255;var m=f[v++]/255*8.12;o[0]*=m,o[1]*=m,o[2]*=m,C.scaleAndAdd(c,c,o,Bg(s,l)*-a[2]),d+=-a[2]}C.scaleAndAdd(u,u,c,1/d)}n[l*3]=u[0]/6,n[l*3+1]=u[1]/6,n[l*3+2]=u[2]/6}return n}Af.projectEnvironmentMap=function(e,t,r){r=r||{},r.lod=r.lod||0;var i,n=new Cr,a=64;t.textureType==="texture2D"?i=new wf({scene:n,environmentMap:t}):(a=t.image&&t.image.px?t.image.px.width:t.width,i=new so({scene:n,environmentMap:t}));var o=Math.ceil(a/Math.pow(2,r.lod)),s=Math.ceil(a/Math.pow(2,r.lod)),l=new ee({width:o,height:s}),u=new Je;i.material.define("fragment","RGBM_ENCODE"),r.decodeRGBM&&i.material.define("fragment","RGBM_DECODE"),i.material.set("lod",r.lod);for(var h=new ll({texture:l}),f={},c=0;c<ni.length;c++){f[ni[c]]=new Uint8Array(o*s*4);var d=h.getCamera(ni[c]);d.fov=90,u.attach(l),u.bind(e),e.render(n,d),e.gl.readPixels(0,0,o,s,X.RGBA,X.UNSIGNED_BYTE,f[ni[c]]),u.unbind(e)}return i.dispose(e),u.dispose(e),l.dispose(e),Gg(e,f,o,s)};let Ug=Af;var zg={firstNotNull:function(){for(var e=0,t=arguments.length;e<t;e++)if(arguments[e]!=null)return arguments[e]},queryDataIndex:function(e,t){if(t.dataIndexInside!=null)return t.dataIndexInside;if(t.dataIndex!=null)return A.util.isArray(t.dataIndex)?A.util.map(t.dataIndex,function(r){return e.indexOfRawIndex(r)}):e.indexOfRawIndex(t.dataIndex);if(t.name!=null)return A.util.isArray(t.name)?A.util.map(t.name,function(r){return e.indexOfName(r)}):e.indexOfName(t.name)}};let te=zg;var Hg=ce.extend({dynamic:!1,widthSegments:40,heightSegments:20,phiStart:0,phiLength:Math.PI*2,thetaStart:0,thetaLength:Math.PI,radius:1},function(){this.build()},{build:function(){var e=this.heightSegments,t=this.widthSegments,r=this.attributes.position,i=this.attributes.texcoord0,n=this.attributes.normal,a=(t+1)*(e+1);r.init(a),i.init(a),n.init(a);var o=a>65535?Uint32Array:Uint16Array,s=this.indices=new o(t*e*6),l,u,h,f,c,d,v,y=this.radius,p=this.phiStart,_=this.phiLength,g=this.thetaStart,m=this.thetaLength,y=this.radius,x=[],w=[],T=0,E=1/y;for(v=0;v<=e;v++)for(d=0;d<=t;d++)f=d/t,c=v/e,l=-y*Math.cos(p+f*_)*Math.sin(g+c*m),u=y*Math.cos(g+c*m),h=y*Math.sin(p+f*_)*Math.sin(g+c*m),x[0]=l,x[1]=u,x[2]=h,w[0]=f,w[1]=c,r.set(T,x),i.set(T,w),x[0]*=E,x[1]*=E,x[2]*=E,n.set(T,x),T++;var b,D,L,M,R=t+1,I=0;for(v=0;v<e;v++)for(d=0;d<t;d++)D=v*R+d,b=v*R+d+1,M=(v+1)*R+d+1,L=(v+1)*R+d,s[I++]=b,s[I++]=D,s[I++]=M,s[I++]=D,s[I++]=L,s[I++]=M;this.boundingBox=new pt,this.boundingBox.max.set(y,y,y),this.boundingBox.min.set(-y,-y,-y)}});let Vg=Hg;var kg=Kt.extend({castShadow:!1},{type:"AMBIENT_LIGHT",uniformTemplates:{ambientLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}}}});let Wg=kg;var Xg=Kt.extend({shadowBias:.001,shadowSlopeScale:2,shadowCascade:1,cascadeSplitLogFactor:.2},{type:"DIRECTIONAL_LIGHT",uniformTemplates:{directionalLightDirection:{type:"3f",value:function(e){return e.__dir=e.__dir||new z,e.__dir.copy(e.worldTransform.z).normalize().negate().array}},directionalLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}}},clone:function(){var e=Kt.prototype.clone.call(this);return e.shadowBias=this.shadowBias,e.shadowSlopeScale=this.shadowSlopeScale,e}});let jg=Xg;var qg=Kt.extend({range:100,castShadow:!1},{type:"POINT_LIGHT",uniformTemplates:{pointLightPosition:{type:"3f",value:function(e){return e.getWorldPosition().array}},pointLightRange:{type:"1f",value:function(e){return e.range}},pointLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}}},clone:function(){var e=Kt.prototype.clone.call(this);return e.range=this.range,e}});let Zg=qg;var Yg=Kt.extend({range:20,umbraAngle:30,penumbraAngle:45,falloffFactor:2,shadowBias:.001,shadowSlopeScale:2},{type:"SPOT_LIGHT",uniformTemplates:{spotLightPosition:{type:"3f",value:function(e){return e.getWorldPosition().array}},spotLightRange:{type:"1f",value:function(e){return e.range}},spotLightUmbraAngleCosine:{type:"1f",value:function(e){return Math.cos(e.umbraAngle*Math.PI/180)}},spotLightPenumbraAngleCosine:{type:"1f",value:function(e){return Math.cos(e.penumbraAngle*Math.PI/180)}},spotLightFalloffFactor:{type:"1f",value:function(e){return e.falloffFactor}},spotLightDirection:{type:"3f",value:function(e){return e.__dir=e.__dir||new z,e.__dir.copy(e.worldTransform.z).negate().array}},spotLightColor:{type:"3f",value:function(e){var t=e.color,r=e.intensity;return[t[0]*r,t[1]*r,t[2]*r]}}},clone:function(){var e=Kt.prototype.clone.call(this);return e.range=this.range,e.umbraAngle=this.umbraAngle,e.penumbraAngle=this.penumbraAngle,e.falloffFactor=this.falloffFactor,e.shadowBias=this.shadowBias,e.shadowSlopeScale=this.shadowSlopeScale,e}});let Kg=Yg;var he=function(e,t,r,i){e=e||0,t=t||0,r=r||0,i=i||0,this.array=k.fromValues(e,t,r,i),this._dirty=!0};he.prototype={constructor:he,add:function(e){return k.add(this.array,this.array,e.array),this._dirty=!0,this},set:function(e,t,r,i){return this.array[0]=e,this.array[1]=t,this.array[2]=r,this.array[3]=i,this._dirty=!0,this},setArray:function(e){return this.array[0]=e[0],this.array[1]=e[1],this.array[2]=e[2],this.array[3]=e[3],this._dirty=!0,this},clone:function(){return new he(this.x,this.y,this.z,this.w)},copy:function(e){return k.copy(this.array,e.array),this._dirty=!0,this},dist:function(e){return k.dist(this.array,e.array)},distance:function(e){return k.distance(this.array,e.array)},div:function(e){return k.div(this.array,this.array,e.array),this._dirty=!0,this},divide:function(e){return k.divide(this.array,this.array,e.array),this._dirty=!0,this},dot:function(e){return k.dot(this.array,e.array)},len:function(){return k.len(this.array)},length:function(){return k.length(this.array)},lerp:function(e,t,r){return k.lerp(this.array,e.array,t.array,r),this._dirty=!0,this},min:function(e){return k.min(this.array,this.array,e.array),this._dirty=!0,this},max:function(e){return k.max(this.array,this.array,e.array),this._dirty=!0,this},mul:function(e){return k.mul(this.array,this.array,e.array),this._dirty=!0,this},multiply:function(e){return k.multiply(this.array,this.array,e.array),this._dirty=!0,this},negate:function(){return k.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return k.normalize(this.array,this.array),this._dirty=!0,this},random:function(e){return k.random(this.array,e),this._dirty=!0,this},scale:function(e){return k.scale(this.array,this.array,e),this._dirty=!0,this},scaleAndAdd:function(e,t){return k.scaleAndAdd(this.array,this.array,e.array,t),this._dirty=!0,this},sqrDist:function(e){return k.sqrDist(this.array,e.array)},squaredDistance:function(e){return k.squaredDistance(this.array,e.array)},sqrLen:function(){return k.sqrLen(this.array)},squaredLength:function(){return k.squaredLength(this.array)},sub:function(e){return k.sub(this.array,this.array,e.array),this._dirty=!0,this},subtract:function(e){return k.subtract(this.array,this.array,e.array),this._dirty=!0,this},transformMat4:function(e){return k.transformMat4(this.array,this.array,e.array),this._dirty=!0,this},transformQuat:function(e){return k.transformQuat(this.array,this.array,e.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Hn=Object.defineProperty;if(Hn){var co=he.prototype;Hn(co,"x",{get:function(){return this.array[0]},set:function(e){this.array[0]=e,this._dirty=!0}}),Hn(co,"y",{get:function(){return this.array[1]},set:function(e){this.array[1]=e,this._dirty=!0}}),Hn(co,"z",{get:function(){return this.array[2]},set:function(e){this.array[2]=e,this._dirty=!0}}),Hn(co,"w",{get:function(){return this.array[3]},set:function(e){this.array[3]=e,this._dirty=!0}})}he.add=function(e,t,r){return k.add(e.array,t.array,r.array),e._dirty=!0,e},he.set=function(e,t,r,i,n){k.set(e.array,t,r,i,n),e._dirty=!0},he.copy=function(e,t){return k.copy(e.array,t.array),e._dirty=!0,e},he.dist=function(e,t){return k.distance(e.array,t.array)},he.distance=he.dist,he.div=function(e,t,r){return k.divide(e.array,t.array,r.array),e._dirty=!0,e},he.divide=he.div,he.dot=function(e,t){return k.dot(e.array,t.array)},he.len=function(e){return k.length(e.array)},he.lerp=function(e,t,r,i){return k.lerp(e.array,t.array,r.array,i),e._dirty=!0,e},he.min=function(e,t,r){return k.min(e.array,t.array,r.array),e._dirty=!0,e},he.max=function(e,t,r){return k.max(e.array,t.array,r.array),e._dirty=!0,e},he.mul=function(e,t,r){return k.multiply(e.array,t.array,r.array),e._dirty=!0,e},he.multiply=he.mul,he.negate=function(e,t){return k.negate(e.array,t.array),e._dirty=!0,e},he.normalize=function(e,t){return k.normalize(e.array,t.array),e._dirty=!0,e},he.random=function(e,t){return k.random(e.array,t),e._dirty=!0,e},he.scale=function(e,t,r){return k.scale(e.array,t.array,r),e._dirty=!0,e},he.scaleAndAdd=function(e,t,r,i){return k.scaleAndAdd(e.array,t.array,r.array,i),e._dirty=!0,e},he.sqrDist=function(e,t){return k.sqrDist(e.array,t.array)},he.squaredDistance=he.sqrDist,he.sqrLen=function(e){return k.sqrLen(e.array)},he.squaredLength=he.sqrLen,he.sub=function(e,t,r){return k.subtract(e.array,t.array,r.array),e._dirty=!0,e},he.subtract=he.sub,he.transformMat4=function(e,t,r){return k.transformMat4(e.array,t.array,r.array),e._dirty=!0,e},he.transformQuat=function(e,t,r){return k.transformQuat(e.array,t.array,r.array),e._dirty=!0,e};let Qg=he;var ut={};ut.create=function(){var e=new rt(4);return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e},ut.clone=function(e){var t=new rt(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},ut.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},ut.identity=function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e},ut.transpose=function(e,t){if(e===t){var r=t[1];e[1]=t[2],e[2]=r}else e[0]=t[0],e[1]=t[2],e[2]=t[1],e[3]=t[3];return e},ut.invert=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=r*a-n*i;return o?(o=1/o,e[0]=a*o,e[1]=-i*o,e[2]=-n*o,e[3]=r*o,e):null},ut.adjoint=function(e,t){var r=t[0];return e[0]=t[3],e[1]=-t[1],e[2]=-t[2],e[3]=r,e},ut.determinant=function(e){return e[0]*e[3]-e[2]*e[1]},ut.multiply=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=r[0],l=r[1],u=r[2],h=r[3];return e[0]=i*s+a*l,e[1]=n*s+o*l,e[2]=i*u+a*h,e[3]=n*u+o*h,e},ut.mul=ut.multiply,ut.rotate=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=Math.sin(r),l=Math.cos(r);return e[0]=i*l+a*s,e[1]=n*l+o*s,e[2]=i*-s+a*l,e[3]=n*-s+o*l,e},ut.scale=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=r[0],l=r[1];return e[0]=i*s,e[1]=n*s,e[2]=a*l,e[3]=o*l,e},ut.frob=function(e){return Math.sqrt(Math.pow(e[0],2)+Math.pow(e[1],2)+Math.pow(e[2],2)+Math.pow(e[3],2))},ut.LDU=function(e,t,r,i){return e[2]=i[2]/i[0],r[0]=i[0],r[1]=i[1],r[3]=i[3]-e[2]*r[1],[e,t,r]};let Re=ut;var mt=function(){this.array=Re.create(),this._dirty=!0};mt.prototype={constructor:mt,setArray:function(e){for(var t=0;t<this.array.length;t++)this.array[t]=e[t];return this._dirty=!0,this},clone:function(){return new mt().copy(this)},copy:function(e){return Re.copy(this.array,e.array),this._dirty=!0,this},adjoint:function(){return Re.adjoint(this.array,this.array),this._dirty=!0,this},determinant:function(){return Re.determinant(this.array)},identity:function(){return Re.identity(this.array),this._dirty=!0,this},invert:function(){return Re.invert(this.array,this.array),this._dirty=!0,this},mul:function(e){return Re.mul(this.array,this.array,e.array),this._dirty=!0,this},mulLeft:function(e){return Re.mul(this.array,e.array,this.array),this._dirty=!0,this},multiply:function(e){return Re.multiply(this.array,this.array,e.array),this._dirty=!0,this},multiplyLeft:function(e){return Re.multiply(this.array,e.array,this.array),this._dirty=!0,this},rotate:function(e){return Re.rotate(this.array,this.array,e),this._dirty=!0,this},scale:function(e){return Re.scale(this.array,this.array,e.array),this._dirty=!0,this},transpose:function(){return Re.transpose(this.array,this.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},mt.adjoint=function(e,t){return Re.adjoint(e.array,t.array),e._dirty=!0,e},mt.copy=function(e,t){return Re.copy(e.array,t.array),e._dirty=!0,e},mt.determinant=function(e){return Re.determinant(e.array)},mt.identity=function(e){return Re.identity(e.array),e._dirty=!0,e},mt.invert=function(e,t){return Re.invert(e.array,t.array),e._dirty=!0,e},mt.mul=function(e,t,r){return Re.mul(e.array,t.array,r.array),e._dirty=!0,e},mt.multiply=mt.mul,mt.rotate=function(e,t,r){return Re.rotate(e.array,t.array,r),e._dirty=!0,e},mt.scale=function(e,t,r){return Re.scale(e.array,t.array,r.array),e._dirty=!0,e},mt.transpose=function(e,t){return Re.transpose(e.array,t.array),e._dirty=!0,e};let Jg=mt;var Tt={};Tt.create=function(){var e=new rt(6);return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e},Tt.clone=function(e){var t=new rt(6);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},Tt.copy=function(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},Tt.identity=function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e},Tt.invert=function(e,t){var r=t[0],i=t[1],n=t[2],a=t[3],o=t[4],s=t[5],l=r*a-i*n;return l?(l=1/l,e[0]=a*l,e[1]=-i*l,e[2]=-n*l,e[3]=r*l,e[4]=(n*s-a*o)*l,e[5]=(i*o-r*s)*l,e):null},Tt.determinant=function(e){return e[0]*e[3]-e[1]*e[2]},Tt.multiply=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=r[0],h=r[1],f=r[2],c=r[3],d=r[4],v=r[5];return e[0]=i*u+a*h,e[1]=n*u+o*h,e[2]=i*f+a*c,e[3]=n*f+o*c,e[4]=i*d+a*v+s,e[5]=n*d+o*v+l,e},Tt.mul=Tt.multiply,Tt.rotate=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=Math.sin(r),h=Math.cos(r);return e[0]=i*h+a*u,e[1]=n*h+o*u,e[2]=i*-u+a*h,e[3]=n*-u+o*h,e[4]=s,e[5]=l,e},Tt.scale=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=r[0],h=r[1];return e[0]=i*u,e[1]=n*u,e[2]=a*h,e[3]=o*h,e[4]=s,e[5]=l,e},Tt.translate=function(e,t,r){var i=t[0],n=t[1],a=t[2],o=t[3],s=t[4],l=t[5],u=r[0],h=r[1];return e[0]=i,e[1]=n,e[2]=a,e[3]=o,e[4]=i*u+a*h+s,e[5]=n*u+o*h+l,e},Tt.frob=function(e){return Math.sqrt(Math.pow(e[0],2)+Math.pow(e[1],2)+Math.pow(e[2],2)+Math.pow(e[3],2)+Math.pow(e[4],2)+Math.pow(e[5],2)+1)};let Ve=Tt;var wt=function(){this.array=Ve.create(),this._dirty=!0};wt.prototype={constructor:wt,setArray:function(e){for(var t=0;t<this.array.length;t++)this.array[t]=e[t];return this._dirty=!0,this},clone:function(){return new wt().copy(this)},copy:function(e){return Ve.copy(this.array,e.array),this._dirty=!0,this},determinant:function(){return Ve.determinant(this.array)},identity:function(){return Ve.identity(this.array),this._dirty=!0,this},invert:function(){return Ve.invert(this.array,this.array),this._dirty=!0,this},mul:function(e){return Ve.mul(this.array,this.array,e.array),this._dirty=!0,this},mulLeft:function(e){return Ve.mul(this.array,e.array,this.array),this._dirty=!0,this},multiply:function(e){return Ve.multiply(this.array,this.array,e.array),this._dirty=!0,this},multiplyLeft:function(e){return Ve.multiply(this.array,e.array,this.array),this._dirty=!0,this},rotate:function(e){return Ve.rotate(this.array,this.array,e),this._dirty=!0,this},scale:function(e){return Ve.scale(this.array,this.array,e.array),this._dirty=!0,this},translate:function(e){return Ve.translate(this.array,this.array,e.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},wt.copy=function(e,t){return Ve.copy(e.array,t.array),e._dirty=!0,e},wt.determinant=function(e){return Ve.determinant(e.array)},wt.identity=function(e){return Ve.identity(e.array),e._dirty=!0,e},wt.invert=function(e,t){return Ve.invert(e.array,t.array),e._dirty=!0,e},wt.mul=function(e,t,r){return Ve.mul(e.array,t.array,r.array),e._dirty=!0,e},wt.multiply=wt.mul,wt.rotate=function(e,t,r){return Ve.rotate(e.array,t.array,r),e._dirty=!0,e},wt.scale=function(e,t,r){return Ve.scale(e.array,t.array,r.array),e._dirty=!0,e},wt.translate=function(e,t,r){return Ve.translate(e.array,t.array,r.array),e._dirty=!0,e};let $g=wt;var je=function(){this.array=se.create(),this._dirty=!0};je.prototype={constructor:je,setArray:function(e){for(var t=0;t<this.array.length;t++)this.array[t]=e[t];return this._dirty=!0,this},adjoint:function(){return se.adjoint(this.array,this.array),this._dirty=!0,this},clone:function(){return new je().copy(this)},copy:function(e){return se.copy(this.array,e.array),this._dirty=!0,this},determinant:function(){return se.determinant(this.array)},fromMat2d:function(e){return se.fromMat2d(this.array,e.array),this._dirty=!0,this},fromMat4:function(e){return se.fromMat4(this.array,e.array),this._dirty=!0,this},fromQuat:function(e){return se.fromQuat(this.array,e.array),this._dirty=!0,this},identity:function(){return se.identity(this.array),this._dirty=!0,this},invert:function(){return se.invert(this.array,this.array),this._dirty=!0,this},mul:function(e){return se.mul(this.array,this.array,e.array),this._dirty=!0,this},mulLeft:function(e){return se.mul(this.array,e.array,this.array),this._dirty=!0,this},multiply:function(e){return se.multiply(this.array,this.array,e.array),this._dirty=!0,this},multiplyLeft:function(e){return se.multiply(this.array,e.array,this.array),this._dirty=!0,this},rotate:function(e){return se.rotate(this.array,this.array,e),this._dirty=!0,this},scale:function(e){return se.scale(this.array,this.array,e.array),this._dirty=!0,this},translate:function(e){return se.translate(this.array,this.array,e.array),this._dirty=!0,this},normalFromMat4:function(e){return se.normalFromMat4(this.array,e.array),this._dirty=!0,this},transpose:function(){return se.transpose(this.array,this.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},je.adjoint=function(e,t){return se.adjoint(e.array,t.array),e._dirty=!0,e},je.copy=function(e,t){return se.copy(e.array,t.array),e._dirty=!0,e},je.determinant=function(e){return se.determinant(e.array)},je.identity=function(e){return se.identity(e.array),e._dirty=!0,e},je.invert=function(e,t){return se.invert(e.array,t.array),e},je.mul=function(e,t,r){return se.mul(e.array,t.array,r.array),e._dirty=!0,e},je.multiply=je.mul,je.fromMat2d=function(e,t){return se.fromMat2d(e.array,t.array),e._dirty=!0,e},je.fromMat4=function(e,t){return se.fromMat4(e.array,t.array),e._dirty=!0,e},je.fromQuat=function(e,t){return se.fromQuat(e.array,t.array),e._dirty=!0,e},je.normalFromMat4=function(e,t){return se.normalFromMat4(e.array,t.array),e._dirty=!0,e},je.rotate=function(e,t,r){return se.rotate(e.array,t.array,r),e._dirty=!0,e},je.scale=function(e,t,r){return se.scale(e.array,t.array,r.array),e._dirty=!0,e},je.transpose=function(e,t){return se.transpose(e.array,t.array),e._dirty=!0,e},je.translate=function(e,t,r){return se.translate(e.array,t.array,r.array),e._dirty=!0,e};let em=je;var vo={linear:function(e){return e},quadraticIn:function(e){return e*e},quadraticOut:function(e){return e*(2-e)},quadraticInOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)},cubicIn:function(e){return e*e*e},cubicOut:function(e){return--e*e*e+1},cubicInOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)},quarticIn:function(e){return e*e*e*e},quarticOut:function(e){return 1- --e*e*e*e},quarticInOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)},quinticIn:function(e){return e*e*e*e*e},quinticOut:function(e){return--e*e*e*e*e+1},quinticInOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)},sinusoidalIn:function(e){return 1-Math.cos(e*Math.PI/2)},sinusoidalOut:function(e){return Math.sin(e*Math.PI/2)},sinusoidalInOut:function(e){return .5*(1-Math.cos(Math.PI*e))},exponentialIn:function(e){return e===0?0:Math.pow(1024,e-1)},exponentialOut:function(e){return e===1?1:1-Math.pow(2,-10*e)},exponentialInOut:function(e){return e===0?0:e===1?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(-Math.pow(2,-10*(e-1))+2)},circularIn:function(e){return 1-Math.sqrt(1-e*e)},circularOut:function(e){return Math.sqrt(1- --e*e)},circularInOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)},elasticIn:function(e){var t,r=.1,i=.4;return e===0?0:e===1?1:(!r||r<1?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),-(r*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)))},elasticOut:function(e){var t,r=.1,i=.4;return e===0?0:e===1?1:(!r||r<1?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),r*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/i)+1)},elasticInOut:function(e){var t,r=.1,i=.4;return e===0?0:e===1?1:(!r||r<1?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),(e*=2)<1?-.5*(r*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)):r*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)*.5+1)},backIn:function(e){var t=1.70158;return e*e*((t+1)*e-t)},backOut:function(e){var t=1.70158;return--e*e*((t+1)*e+t)+1},backInOut:function(e){var t=2.5949095;return(e*=2)<1?.5*(e*e*((t+1)*e-t)):.5*((e-=2)*e*((t+1)*e+t)+2)},bounceIn:function(e){return 1-vo.bounceOut(1-e)},bounceOut:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},bounceInOut:function(e){return e<.5?vo.bounceIn(e*2)*.5:vo.bounceOut(e*2-1)*.5+.5}};let tm=vo;var rm=(function(){function e(t){this._initialized=!1,this._startTime=0,this._pausedTime=0,this._paused=!1,this._life=t.life||1e3,this._delay=t.delay||0,this.loop=t.loop==null?!1:t.loop,this.gap=t.gap||0,this.easing=t.easing||"linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart}return e.prototype.step=function(t,r){if(this._initialized||(this._startTime=t+this._delay,this._initialized=!0),this._paused){this._pausedTime+=r;return}var i=(t-this._startTime-this._pausedTime)/this._life;i<0&&(i=0),i=Math.min(i,1);var n=this.easing,a=typeof n=="string"?tm[n]:n,o=typeof a=="function"?a(i):i;if(this.onframe&&this.onframe(o),i===1)if(this.loop)this._restart(t),this.onrestart&&this.onrestart();else return!0;return!1},e.prototype._restart=function(t){var r=(t-this._startTime-this._pausedTime)%this._life;this._startTime=t-r+this.gap,this._pausedTime=0},e.prototype.pause=function(){this._paused=!0},e.prototype.resume=function(){this._paused=!1},e})();let im=rm;var Mf={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function Qt(e){return e=Math.round(e),e<0?0:e>255?255:e}function nm(e){return e=Math.round(e),e<0?0:e>360?360:e}function Vn(e){return e<0?0:e>1?1:e}function vl(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?Qt(parseFloat(t)/100*255):Qt(parseInt(t,10))}function Qi(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?Vn(parseFloat(t)/100):Vn(parseFloat(t))}function pl(e,t,r){return r<0?r+=1:r>1&&(r-=1),r*6<1?e+(t-e)*r*6:r*2<1?t:r*3<2?e+(t-e)*(.6666666666666666-r)*6:e}function Lr(e,t,r){return e+(t-e)*r}function Ut(e,t,r,i,n){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e}function _l(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}var Df=new Bn(20),po=null;function Ji(e,t){po&&_l(po,t),po=Df.put(e,po||t.slice())}function nr(e,t){if(e){t=t||[];var r=Df.get(e);if(r)return _l(t,r);e=e+"";var i=e.replace(/ /g,"").toLowerCase();if(i in Mf)return _l(t,Mf[i]),Ji(e,t),t;var n=i.length;if(i.charAt(0)==="#"){if(n===4||n===5){var a=parseInt(i.slice(1,4),16);if(!(a>=0&&a<=4095)){Ut(t,0,0,0,1);return}return Ut(t,(a&3840)>>4|(a&3840)>>8,a&240|(a&240)>>4,a&15|(a&15)<<4,n===5?parseInt(i.slice(4),16)/15:1),Ji(e,t),t}else if(n===7||n===9){var a=parseInt(i.slice(1,7),16);if(!(a>=0&&a<=16777215)){Ut(t,0,0,0,1);return}return Ut(t,(a&16711680)>>16,(a&65280)>>8,a&255,n===9?parseInt(i.slice(7),16)/255:1),Ji(e,t),t}return}var o=i.indexOf("("),s=i.indexOf(")");if(o!==-1&&s+1===n){var l=i.substr(0,o),u=i.substr(o+1,s-(o+1)).split(","),h=1;switch(l){case"rgba":if(u.length!==4)return u.length===3?Ut(t,+u[0],+u[1],+u[2],1):Ut(t,0,0,0,1);h=Qi(u.pop());case"rgb":if(u.length!==3){Ut(t,0,0,0,1);return}return Ut(t,vl(u[0]),vl(u[1]),vl(u[2]),h),Ji(e,t),t;case"hsla":if(u.length!==4){Ut(t,0,0,0,1);return}return u[3]=Qi(u[3]),gl(u,t),Ji(e,t),t;case"hsl":if(u.length!==3){Ut(t,0,0,0,1);return}return gl(u,t),Ji(e,t),t;default:return}}Ut(t,0,0,0,1)}}function gl(e,t){var r=(parseFloat(e[0])%360+360)%360/360,i=Qi(e[1]),n=Qi(e[2]),a=n<=.5?n*(i+1):n+i-n*i,o=n*2-a;return t=t||[],Ut(t,Qt(pl(o,a,r+.3333333333333333)*255),Qt(pl(o,a,r)*255),Qt(pl(o,a,r-.3333333333333333)*255),1),e.length===4&&(t[3]=e[3]),t}function am(e){if(e){var t=e[0]/255,r=e[1]/255,i=e[2]/255,n=Math.min(t,r,i),a=Math.max(t,r,i),o=a-n,s=(a+n)/2,l,u;if(o===0)l=0,u=0;else{s<.5?u=o/(a+n):u=o/(2-a-n);var h=((a-t)/6+o/2)/o,f=((a-r)/6+o/2)/o,c=((a-i)/6+o/2)/o;t===a?l=c-f:r===a?l=.3333333333333333+h-c:i===a&&(l=.6666666666666666+f-h),l<0&&(l+=1),l>1&&(l-=1)}var d=[l*360,u,s];return e[3]!=null&&d.push(e[3]),d}}function om(e,t){var r=nr(e);if(r){for(var i=0;i<3;i++)t<0?r[i]=r[i]*(1-t)|0:r[i]=(255-r[i])*t+r[i]|0,r[i]>255?r[i]=255:r[i]<0&&(r[i]=0);return kn(r,r.length===4?"rgba":"rgb")}}function yb(e){var t=nr(e);if(t)return(16777216+(t[0]<<16)+(t[1]<<8)+ +t[2]).toString(16).slice(1)}function sm(e,t,r){if(!(!(t&&t.length)||!(e>=0&&e<=1))){r=r||[];var i=e*(t.length-1),n=Math.floor(i),a=Math.ceil(i),o=t[n],s=t[a],l=i-n;return r[0]=Qt(Lr(o[0],s[0],l)),r[1]=Qt(Lr(o[1],s[1],l)),r[2]=Qt(Lr(o[2],s[2],l)),r[3]=Vn(Lr(o[3],s[3],l)),r}}var xb=sm;function lm(e,t,r){if(!(!(t&&t.length)||!(e>=0&&e<=1))){var i=e*(t.length-1),n=Math.floor(i),a=Math.ceil(i),o=nr(t[n]),s=nr(t[a]),l=i-n,u=kn([Qt(Lr(o[0],s[0],l)),Qt(Lr(o[1],s[1],l)),Qt(Lr(o[2],s[2],l)),Vn(Lr(o[3],s[3],l))],"rgba");return r?{color:u,leftIndex:n,rightIndex:a,value:i}:u}}var Tb=lm;function wb(e,t,r,i){var n=nr(e);if(e)return n=am(n),t!=null&&(n[0]=nm(t)),r!=null&&(n[1]=Qi(r)),i!=null&&(n[2]=Qi(i)),kn(gl(n),"rgba")}function Sb(e,t){var r=nr(e);if(r&&t!=null)return r[3]=Vn(t),kn(r,"rgba")}function kn(e,t){if(!(!e||!e.length)){var r=e[0]+","+e[1]+","+e[2];return(t==="rgba"||t==="hsva"||t==="hsla")&&(r+=","+e[3]),t+"("+r+")"}}function Cf(e,t){var r=nr(e);return r?(.299*r[0]+.587*r[1]+.114*r[2])*r[3]/255+(1-r[3])*t:0}function bb(){var e=Math.round(Math.random()*255),t=Math.round(Math.random()*255),r=Math.round(Math.random()*255);return"rgb("+e+","+t+","+r+")"}var Lf={"[object Function]":!0,"[object RegExp]":!0,"[object Date]":!0,"[object Error]":!0,"[object CanvasGradient]":!0,"[object CanvasPattern]":!0,"[object Image]":!0,"[object Canvas]":!0},Pf={"[object Int8Array]":!0,"[object Uint8Array]":!0,"[object Uint8ClampedArray]":!0,"[object Int16Array]":!0,"[object Uint16Array]":!0,"[object Int32Array]":!0,"[object Uint32Array]":!0,"[object Float32Array]":!0,"[object Float64Array]":!0},$i=Object.prototype.toString,_o=Array.prototype,um=_o.forEach,hm=_o.filter,ml=_o.slice,fm=_o.map,Rf=function(){}.constructor,go=Rf?Rf.prototype:null,yl={};function Eb(e,t){yl[e]=t}var cm=2311;function dm(){return cm++}function xl(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];typeof console<"u"&&console.error.apply(console,e)}function Rt(e){if(e==null||typeof e!="object")return e;var t=e,r=$i.call(e);if(r==="[object Array]"){if(!jn(e)){t=[];for(var i=0,n=e.length;i<n;i++)t[i]=Rt(e[i])}}else if(Pf[r]){if(!jn(e)){var a=e.constructor;if(a.from)t=a.from(e);else{t=new a(e.length);for(var i=0,n=e.length;i<n;i++)t[i]=Rt(e[i])}}}else if(!Lf[r]&&!jn(e)&&!Sl(e)){t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]=Rt(e[o]))}return t}function Wn(e,t,r){if(!st(t)||!st(e))return r?Rt(t):e;for(var i in t)if(t.hasOwnProperty(i)){var n=e[i],a=t[i];st(a)&&st(n)&&!$t(a)&&!$t(n)&&!Sl(a)&&!Sl(n)&&!Nf(a)&&!Nf(n)&&!jn(a)&&!jn(n)?Wn(n,a,r):(r||!(i in e))&&(e[i]=Rt(t[i]))}return e}function Ab(e,t){for(var r=e[0],i=1,n=e.length;i<n;i++)r=Wn(r,e[i],t);return r}function de(e,t){if(Object.assign)Object.assign(e,t);else for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}function Jt(e,t,r){for(var i=ht(t),n=0;n<i.length;n++){var a=i[n];(r?t[a]!=null:e[a]==null)&&(e[a]=t[a])}return e}var vm=function(){return yl.createCanvas()};yl.createCanvas=function(){return document.createElement("canvas")};function zt(e,t){if(e){if(e.indexOf)return e.indexOf(t);for(var r=0,i=e.length;r<i;r++)if(e[r]===t)return r}return-1}function pm(e,t){var r=e.prototype;function i(){}i.prototype=t.prototype,e.prototype=new i;for(var n in r)r.hasOwnProperty(n)&&(e.prototype[n]=r[n]);e.prototype.constructor=e,e.superClass=t}function Pr(e,t,r){if(e="prototype"in e?e.prototype:e,t="prototype"in t?t.prototype:t,Object.getOwnPropertyNames)for(var i=Object.getOwnPropertyNames(t),n=0;n<i.length;n++){var a=i[n];a!=="constructor"&&(r?t[a]!=null:e[a]==null)&&(e[a]=t[a])}else Jt(e,t,r)}function ar(e){return!e||typeof e=="string"?!1:typeof e.length=="number"}function xe(e,t,r){if(e&&t)if(e.forEach&&e.forEach===um)e.forEach(t,r);else if(e.length===+e.length)for(var i=0,n=e.length;i<n;i++)t.call(r,e[i],i,e);else for(var a in e)e.hasOwnProperty(a)&&t.call(r,e[a],a,e)}function or(e,t,r){if(!e)return[];if(!t)return If(e);if(e.map&&e.map===fm)return e.map(t,r);for(var i=[],n=0,a=e.length;n<a;n++)i.push(t.call(r,e[n],n,e));return i}function Tl(e,t,r,i){if(e&&t){for(var n=0,a=e.length;n<a;n++)r=t.call(i,r,e[n],n,e);return r}}function _m(e,t,r){if(!e)return[];if(!t)return If(e);if(e.filter&&e.filter===hm)return e.filter(t,r);for(var i=[],n=0,a=e.length;n<a;n++)t.call(r,e[n],n,e)&&i.push(e[n]);return i}function Mb(e,t,r){if(e&&t){for(var i=0,n=e.length;i<n;i++)if(t.call(r,e[i],i,e))return e[i]}}function ht(e){if(!e)return[];if(Object.keys)return Object.keys(e);var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r);return t}function gm(e,t){for(var r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];return function(){return e.apply(t,r.concat(ml.call(arguments)))}}var Db=go&&wl(go.bind)?go.call.bind(go.bind):gm;function Xn(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return function(){return e.apply(this,t.concat(ml.call(arguments)))}}function $t(e){return Array.isArray?Array.isArray(e):$i.call(e)==="[object Array]"}function wl(e){return typeof e=="function"}function mr(e){return typeof e=="string"}function mo(e){return $i.call(e)==="[object String]"}function mm(e){return typeof e=="number"}function st(e){var t=typeof e;return t==="function"||!!e&&t==="object"}function Nf(e){return!!Lf[$i.call(e)]}function ym(e){return!!Pf[$i.call(e)]}function Sl(e){return typeof e=="object"&&typeof e.nodeType=="number"&&typeof e.ownerDocument=="object"}function Cb(e){return e.colorStops!=null}function Lb(e){return e.image!=null}function xm(e){return $i.call(e)==="[object RegExp]"}function Tm(e){return e!==e}function Pb(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=0,i=e.length;r<i;r++)if(e[r]!=null)return e[r]}function Ne(e,t){return e??t}function yo(e,t,r){return e??t??r}function If(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return ml.apply(e,t)}function Of(e){if(typeof e=="number")return[e,e,e,e];var t=e.length;return t===2?[e[0],e[1],e[0],e[1]]:t===3?[e[0],e[1],e[2],e[1]]:e}function ai(e,t){if(!e)throw new Error(t)}function bl(e){return e==null?null:typeof e.trim=="function"?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}var Bf="__ec_primitive__";function Rb(e){e[Bf]=!0}function jn(e){return e[Bf]}var wm=(function(){function e(t){this.data={};var r=$t(t);this.data={};var i=this;t instanceof e?t.each(n):t&&xe(t,n);function n(a,o){r?i.set(a,o):i.set(o,a)}}return e.prototype.get=function(t){return this.data.hasOwnProperty(t)?this.data[t]:null},e.prototype.set=function(t,r){return this.data[t]=r},e.prototype.each=function(t,r){for(var i in this.data)this.data.hasOwnProperty(i)&&t.call(r,this.data[i],i)},e.prototype.keys=function(){return ht(this.data)},e.prototype.removeKey=function(t){delete this.data[t]},e})();function qn(e){return new wm(e)}function Ff(e,t){for(var r=new e.constructor(e.length+t.length),i=0;i<e.length;i++)r[i]=e[i];for(var n=e.length,i=0;i<t.length;i++)r[i+n]=t[i];return r}function Zn(e,t){var r;if(Object.create)r=Object.create(e);else{var i=function(){};i.prototype=e,r=new i}return t&&de(r,t),r}function Sm(e,t){return e.hasOwnProperty(t)}function Nb(){}var El=Array.prototype.slice;function Yn(e,t,r){return(t-e)*r+e}function bm(e,t,r){return r>.5?t:e}function Gf(e,t,r,i){for(var n=t.length,a=0;a<n;a++)e[a]=Yn(t[a],r[a],i)}function Em(e,t,r,i){for(var n=t.length,a=n&&t[0].length,o=0;o<n;o++){e[o]||(e[o]=[]);for(var s=0;s<a;s++)e[o][s]=Yn(t[o][s],r[o][s],i)}}function xo(e,t,r,i){for(var n=t.length,a=0;a<n;a++)e[a]=t[a]+r[a]*i;return e}function Uf(e,t,r,i){for(var n=t.length,a=n&&t[0].length,o=0;o<n;o++){e[o]||(e[o]=[]);for(var s=0;s<a;s++)e[o][s]=t[o][s]+r[o][s]*i}return e}function Am(e,t,r){var i=e,n=t;if(!(!i.push||!n.push)){var a=i.length,o=n.length;if(a!==o){var s=a>o;if(s)i.length=o;else for(var l=a;l<o;l++)i.push(r===1?n[l]:El.call(n[l]))}for(var u=i[0]&&i[0].length,l=0;l<i.length;l++)if(r===1)isNaN(i[l])&&(i[l]=n[l]);else for(var h=0;h<u;h++)isNaN(i[l][h])&&(i[l][h]=n[l][h])}}function zf(e,t){var r=e.length;if(r!==t.length)return!1;for(var i=0;i<r;i++)if(e[i]!==t[i])return!1;return!0}function Ib(e,t){var r=e.length;if(r!==t.length)return!1;for(var i=e[0].length,n=0;n<r;n++)for(var a=0;a<i;a++)if(e[n][a]!==t[n][a])return!1;return!0}function Al(e,t,r,i,n,a,o){var s=(r-e)*.5,l=(i-t)*.5;return(2*(t-r)+s+l)*o+(-3*(t-r)-2*s-l)*a+s*n+t}function Hf(e,t,r,i,n,a,o,s){for(var l=t.length,u=0;u<l;u++)e[u]=Al(t[u],r[u],i[u],n[u],a,o,s)}function Mm(e,t,r,i,n,a,o,s){for(var l=t.length,u=t[0].length,h=0;h<l;h++){e[h]||(e[1]=[]);for(var f=0;f<u;f++)e[h][f]=Al(t[h][f],r[h][f],i[h][f],n[h][f],a,o,s)}}function To(e){if(ar(e)){var t=e.length;if(ar(e[0])){for(var r=[],i=0;i<t;i++)r.push(El.call(e[i]));return r}return El.call(e)}return e}function Kn(e){return e[0]=Math.floor(e[0]),e[1]=Math.floor(e[1]),e[2]=Math.floor(e[2]),"rgba("+e.join(",")+")"}function Dm(e){return ar(e&&e[0])?2:1}var Qn=[0,0,0,0],Cm=(function(){function e(t){this.keyframes=[],this.maxTime=0,this.arrDim=0,this.interpolable=!0,this._needsSort=!1,this._isAllValueEqual=!0,this._lastFrame=0,this._lastFramePercent=0,this.propName=t}return e.prototype.isFinished=function(){return this._finished},e.prototype.setFinished=function(){this._finished=!0,this._additiveTrack&&this._additiveTrack.setFinished()},e.prototype.needsAnimate=function(){return!this._isAllValueEqual&&this.keyframes.length>=2&&this.interpolable},e.prototype.getAdditiveTrack=function(){return this._additiveTrack},e.prototype.addKeyframe=function(t,r){t>=this.maxTime?this.maxTime=t:this._needsSort=!0;var i=this.keyframes,n=i.length;if(this.interpolable)if(ar(r)){var a=Dm(r);if(n>0&&this.arrDim!==a){this.interpolable=!1;return}if(a===1&&typeof r[0]!="number"||a===2&&typeof r[0][0]!="number"){this.interpolable=!1;return}if(n>0){var o=i[n-1];this._isAllValueEqual&&(a===1?zf(r,o.value)||(this._isAllValueEqual=!1):this._isAllValueEqual=!1)}this.arrDim=a}else{if(this.arrDim>0){this.interpolable=!1;return}if(typeof r=="string"){var s=nr(r);s?(r=s,this.isValueColor=!0):this.interpolable=!1}else if(typeof r!="number"||isNaN(r)){this.interpolable=!1;return}if(this._isAllValueEqual&&n>0){var o=i[n-1];this.isValueColor&&!zf(o.value,r)?this._isAllValueEqual=!1:o.value!==r&&(this._isAllValueEqual=!1)}}var l={time:t,value:r,percent:0};return this.keyframes.push(l),l},e.prototype.prepare=function(t){var r=this.keyframes;this._needsSort&&r.sort(function(l,u){return l.time-u.time});for(var i=this.arrDim,n=r.length,a=r[n-1],o=0;o<n;o++)r[o].percent=r[o].time/this.maxTime,i>0&&o!==n-1&&Am(r[o].value,a.value,i);if(t&&this.needsAnimate()&&t.needsAnimate()&&i===t.arrDim&&this.isValueColor===t.isValueColor&&!t._finished){this._additiveTrack=t;for(var s=r[0].value,o=0;o<n;o++)i===0?this.isValueColor?r[o].additiveValue=xo([],r[o].value,s,-1):r[o].additiveValue=r[o].value-s:i===1?r[o].additiveValue=xo([],r[o].value,s,-1):i===2&&(r[o].additiveValue=Uf([],r[o].value,s,-1))}},e.prototype.step=function(t,r){if(!this._finished){this._additiveTrack&&this._additiveTrack._finished&&(this._additiveTrack=null);var i=this._additiveTrack!=null,n=i?"additiveValue":"value",a=this.keyframes,o=this.keyframes.length,s=this.propName,l=this.arrDim,u=this.isValueColor,h;if(r<0)h=0;else if(r<this._lastFramePercent){var f=Math.min(this._lastFrame+1,o-1);for(h=f;h>=0&&!(a[h].percent<=r);h--);h=Math.min(h,o-2)}else{for(h=this._lastFrame;h<o&&!(a[h].percent>r);h++);h=Math.min(h-1,o-2)}var c=a[h+1],d=a[h];if(d&&c){this._lastFrame=h,this._lastFramePercent=r;var v=c.percent-d.percent;if(v!==0){var p=(r-d.percent)/v,_=i?this._additiveValue:u?Qn:t[s];if((l>0||u)&&!_&&(_=this._additiveValue=[]),this.useSpline){var g=a[h][n],m=a[h===0?h:h-1][n],y=a[h>o-2?o-1:h+1][n],x=a[h>o-3?o-1:h+2][n];if(l>0)l===1?Hf(_,m,g,y,x,p,p*p,p*p*p):Mm(_,m,g,y,x,p,p*p,p*p*p);else if(u)Hf(_,m,g,y,x,p,p*p,p*p*p),i||(t[s]=Kn(_));else{var w=void 0;this.interpolable?w=Al(m,g,y,x,p,p*p,p*p*p):w=y,i?this._additiveValue=w:t[s]=w}}else if(l>0)l===1?Gf(_,d[n],c[n],p):Em(_,d[n],c[n],p);else if(u)Gf(_,d[n],c[n],p),i||(t[s]=Kn(_));else{var w=void 0;this.interpolable?w=Yn(d[n],c[n],p):w=bm(d[n],c[n],p),i?this._additiveValue=w:t[s]=w}i&&this._addToTarget(t)}}}},e.prototype._addToTarget=function(t){var r=this.arrDim,i=this.propName,n=this._additiveValue;r===0?this.isValueColor?(nr(t[i],Qn),xo(Qn,Qn,n,1),t[i]=Kn(Qn)):t[i]=t[i]+n:r===1?xo(t[i],t[i],n,1):r===2&&Uf(t[i],t[i],n,1)},e})(),Lm=(function(){function e(t,r,i){if(this._tracks={},this._trackKeys=[],this._delay=0,this._maxTime=0,this._paused=!1,this._started=0,this._clip=null,this._target=t,this._loop=r,r&&i){xl("Can' use additive animation on looped animation.");return}this._additiveAnimators=i}return e.prototype.getTarget=function(){return this._target},e.prototype.changeTarget=function(t){this._target=t},e.prototype.when=function(t,r){return this.whenWithKeys(t,r,ht(r))},e.prototype.whenWithKeys=function(t,r,i){for(var n=this._tracks,a=0;a<i.length;a++){var o=i[a],s=n[o];if(!s){s=n[o]=new Cm(o);var l=void 0,u=this._getAdditiveTrack(o);if(u){var h=u.keyframes[u.keyframes.length-1];l=h&&h.value,u.isValueColor&&l&&(l=Kn(l))}else l=this._target[o];if(l==null)continue;t!==0&&s.addKeyframe(0,To(l)),this._trackKeys.push(o)}s.addKeyframe(t,To(r[o]))}return this._maxTime=Math.max(this._maxTime,t),this},e.prototype.pause=function(){this._clip.pause(),this._paused=!0},e.prototype.resume=function(){this._clip.resume(),this._paused=!1},e.prototype.isPaused=function(){return!!this._paused},e.prototype._doneCallback=function(){this._setTracksFinished(),this._clip=null;var t=this._doneList;if(t)for(var r=t.length,i=0;i<r;i++)t[i].call(this)},e.prototype._abortedCallback=function(){this._setTracksFinished();var t=this.animation,r=this._abortedList;if(t&&t.removeClip(this._clip),this._clip=null,r)for(var i=0;i<r.length;i++)r[i].call(this)},e.prototype._setTracksFinished=function(){for(var t=this._tracks,r=this._trackKeys,i=0;i<r.length;i++)t[r[i]].setFinished()},e.prototype._getAdditiveTrack=function(t){var r,i=this._additiveAnimators;if(i)for(var n=0;n<i.length;n++){var a=i[n].getTrack(t);a&&(r=a)}return r},e.prototype.start=function(t,r){if(!(this._started>0)){this._started=1;for(var i=this,n=[],a=0;a<this._trackKeys.length;a++){var o=this._trackKeys[a],s=this._tracks[o],l=this._getAdditiveTrack(o),u=s.keyframes;if(s.prepare(l),s.needsAnimate())n.push(s);else if(!s.interpolable){var h=u[u.length-1];h&&(i._target[s.propName]=h.value)}}if(n.length||r){var f=new im({life:this._maxTime,loop:this._loop,delay:this._delay,onframe:function(c){i._started=2;var d=i._additiveAnimators;if(d){for(var v=!1,p=0;p<d.length;p++)if(d[p]._clip){v=!0;break}v||(i._additiveAnimators=null)}for(var p=0;p<n.length;p++)n[p].step(i._target,c);var _=i._onframeList;if(_)for(var p=0;p<_.length;p++)_[p](i._target,c)},ondestroy:function(){i._doneCallback()}});this._clip=f,this.animation&&this.animation.addClip(f),t&&t!=="spline"&&(f.easing=t)}else this._doneCallback();return this}},e.prototype.stop=function(t){if(this._clip){var r=this._clip;t&&r.onframe(1),this._abortedCallback()}},e.prototype.delay=function(t){return this._delay=t,this},e.prototype.during=function(t){return t&&(this._onframeList||(this._onframeList=[]),this._onframeList.push(t)),this},e.prototype.done=function(t){return t&&(this._doneList||(this._doneList=[]),this._doneList.push(t)),this},e.prototype.aborted=function(t){return t&&(this._abortedList||(this._abortedList=[]),this._abortedList.push(t)),this},e.prototype.getClip=function(){return this._clip},e.prototype.getTrack=function(t){return this._tracks[t]},e.prototype.stopTracks=function(t,r){if(!t.length||!this._clip)return!0;for(var i=this._tracks,n=this._trackKeys,a=0;a<t.length;a++){var o=i[t[a]];o&&(r?o.step(this._target,1):this._started===1&&o.step(this._target,0),o.setFinished())}for(var s=!0,a=0;a<n.length;a++)if(!i[n[a]].isFinished()){s=!1;break}return s&&this._abortedCallback(),s},e.prototype.saveFinalToTarget=function(t,r){if(t){r=r||this._trackKeys;for(var i=0;i<r.length;i++){var n=r[i],a=this._tracks[n];if(!(!a||a.isFinished())){var o=a.keyframes,s=o[o.length-1];if(s){var l=To(s.value);a.isValueColor&&(l=Kn(l)),t[n]=l}}}}},e.prototype.__changeFinalValue=function(t,r){r=r||ht(t);for(var i=0;i<r.length;i++){var n=r[i],a=this._tracks[n];if(a){var o=a.keyframes;if(o.length>1){var s=o.pop();a.addKeyframe(s.time,t[n]),a.prepare(a.getAdditiveTrack())}}}},e})();let Ml=Lm;var Pm={_animators:null,getAnimators:function(){return this._animators=this._animators||[],this._animators},animate:function(e,t){this._animators=this._animators||[];var r=this,i;if(e){for(var n=e.split("."),a=r,o=0,s=n.length;o<s;o++)a&&(a=a[n[o]]);a&&(i=a)}else i=r;if(i==null)throw new Error("Target "+e+" not exists");var l=this._animators,u=new Ml(i,t),h=this;return u.during(function(){h.__zr&&h.__zr.refresh()}).done(function(){var f=l.indexOf(u);f>=0&&l.splice(f,1)}),l.push(u),this.__zr&&this.__zr.animation.addAnimator(u),u},stopAnimation:function(e){this._animators=this._animators||[];for(var t=this._animators,r=t.length,i=0;i<r;i++)t[i].stop(e);return t.length=0,this},addAnimatorsToZr:function(e){if(this._animators)for(var t=0;t<this._animators.length;t++)e.animation.addAnimator(this._animators[t])},removeAnimatorsFromZr:function(e){if(this._animators)for(var t=0;t<this._animators.length;t++)e.animation.removeAnimator(this._animators[t])}};let Rm=Pm,Vf=`
@export clay.util.rand
highp float rand(vec2 uv) {
 const highp float a = 12.9898, b = 78.233, c = 43758.5453;
 highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, 3.141592653589793);
 return fract(sin(sn) * c);
}
@end
@export clay.util.calculate_attenuation
uniform float attenuationFactor : 5.0;
float lightAttenuation(float dist, float range)
{
 float attenuation = 1.0;
 attenuation = dist*dist/(range*range+1.0);
 float att_s = attenuationFactor;
 attenuation = 1.0/(attenuation*att_s+1.0);
 att_s = 1.0/(att_s+1.0);
 attenuation = attenuation - att_s;
 attenuation /= 1.0 - att_s;
 return clamp(attenuation, 0.0, 1.0);
}
@end
@export clay.util.edge_factor
#ifdef SUPPORT_STANDARD_DERIVATIVES
float edgeFactor(float width)
{
 vec3 d = fwidth(v_Barycentric);
 vec3 a3 = smoothstep(vec3(0.0), d * width, v_Barycentric);
 return min(min(a3.x, a3.y), a3.z);
}
#else
float edgeFactor(float width)
{
 return 1.0;
}
#endif
@end
@export clay.util.encode_float
vec4 encodeFloat(const in float depth)
{
 const vec4 bitShifts = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
 const vec4 bit_mask = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
 vec4 res = fract(depth * bitShifts);
 res -= res.xxyz * bit_mask;
 return res;
}
@end
@export clay.util.decode_float
float decodeFloat(const in vec4 color)
{
 const vec4 bitShifts = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
 return dot(color, bitShifts);
}
@end
@export clay.util.float
@import clay.util.encode_float
@import clay.util.decode_float
@end
@export clay.util.rgbm_decode
vec3 RGBMDecode(vec4 rgbm, float range) {
 return range * rgbm.rgb * rgbm.a;
}
@end
@export clay.util.rgbm_encode
vec4 RGBMEncode(vec3 color, float range) {
 if (dot(color, color) == 0.0) {
 return vec4(0.0);
 }
 vec4 rgbm;
 color /= range;
 rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);
 rgbm.a = ceil(rgbm.a * 255.0) / 255.0;
 rgbm.rgb = color / rgbm.a;
 return rgbm;
}
@end
@export clay.util.rgbm
@import clay.util.rgbm_decode
@import clay.util.rgbm_encode
vec4 decodeHDR(vec4 color)
{
#if defined(RGBM_DECODE) || defined(RGBM)
 return vec4(RGBMDecode(color, 8.12), 1.0);
#else
 return color;
#endif
}
vec4 encodeHDR(vec4 color)
{
#if defined(RGBM_ENCODE) || defined(RGBM)
 return RGBMEncode(color.xyz, 8.12);
#else
 return color;
#endif
}
@end
@export clay.util.srgb
vec4 sRGBToLinear(in vec4 value) {
 return vec4(mix(pow(value.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), value.rgb * 0.0773993808, vec3(lessThanEqual(value.rgb, vec3(0.04045)))), value.w);
}
vec4 linearTosRGB(in vec4 value) {
 return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.w);
}
@end
@export clay.chunk.skinning_header
#ifdef SKINNING
attribute vec3 weight : WEIGHT;
attribute vec4 joint : JOINT;
#ifdef USE_SKIN_MATRICES_TEXTURE
uniform sampler2D skinMatricesTexture : ignore;
uniform float skinMatricesTextureSize: ignore;
mat4 getSkinMatrix(sampler2D tex, float idx) {
 float j = idx * 4.0;
 float x = mod(j, skinMatricesTextureSize);
 float y = floor(j / skinMatricesTextureSize) + 0.5;
 vec2 scale = vec2(skinMatricesTextureSize);
 return mat4(
 texture2D(tex, vec2(x + 0.5, y) / scale),
 texture2D(tex, vec2(x + 1.5, y) / scale),
 texture2D(tex, vec2(x + 2.5, y) / scale),
 texture2D(tex, vec2(x + 3.5, y) / scale)
 );
}
mat4 getSkinMatrix(float idx) {
 return getSkinMatrix(skinMatricesTexture, idx);
}
#else
uniform mat4 skinMatrix[JOINT_COUNT] : SKIN_MATRIX;
mat4 getSkinMatrix(float idx) {
 return skinMatrix[int(idx)];
}
#endif
#endif
@end
@export clay.chunk.skin_matrix
mat4 skinMatrixWS = getSkinMatrix(joint.x) * weight.x;
if (weight.y > 1e-4)
{
 skinMatrixWS += getSkinMatrix(joint.y) * weight.y;
}
if (weight.z > 1e-4)
{
 skinMatrixWS += getSkinMatrix(joint.z) * weight.z;
}
float weightW = 1.0-weight.x-weight.y-weight.z;
if (weightW > 1e-4)
{
 skinMatrixWS += getSkinMatrix(joint.w) * weightW;
}
@end
@export clay.chunk.instancing_header
#ifdef INSTANCING
attribute vec4 instanceMat1;
attribute vec4 instanceMat2;
attribute vec4 instanceMat3;
#endif
@end
@export clay.chunk.instancing_matrix
mat4 instanceMat = mat4(
 vec4(instanceMat1.xyz, 0.0),
 vec4(instanceMat2.xyz, 0.0),
 vec4(instanceMat3.xyz, 0.0),
 vec4(instanceMat1.w, instanceMat2.w, instanceMat3.w, 1.0)
);
@end
@export clay.util.parallax_correct
vec3 parallaxCorrect(in vec3 dir, in vec3 pos, in vec3 boxMin, in vec3 boxMax) {
 vec3 first = (boxMax - pos) / dir;
 vec3 second = (boxMin - pos) / dir;
 vec3 further = max(first, second);
 float dist = min(further.x, min(further.y, further.z));
 vec3 fixedPos = pos + dir * dist;
 vec3 boxCenter = (boxMax + boxMin) * 0.5;
 return normalize(fixedPos - boxCenter);
}
@end
@export clay.util.clamp_sample
vec4 clampSample(const in sampler2D texture, const in vec2 coord)
{
#ifdef STEREO
 float eye = step(0.5, coord.x) * 0.5;
 vec2 coordClamped = clamp(coord, vec2(eye, 0.0), vec2(0.5 + eye, 1.0));
#else
 vec2 coordClamped = clamp(coord, vec2(0.0), vec2(1.0));
#endif
 return texture2D(texture, coordClamped);
}
@end
@export clay.util.ACES
vec3 ACESToneMapping(vec3 color)
{
 const float A = 2.51;
 const float B = 0.03;
 const float C = 2.43;
 const float D = 0.59;
 const float E = 0.14;
 return (color * (A * color + B)) / (color * (C * color + D) + E);
}
@end`,Nm=`
@export ecgl.common.transformUniforms
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;
uniform mat4 world : WORLD;
@end

@export ecgl.common.attributes
attribute vec3 position : POSITION;
attribute vec2 texcoord : TEXCOORD_0;
attribute vec3 normal : NORMAL;
@end

@export ecgl.common.uv.header
uniform vec2 uvRepeat : [1.0, 1.0];
uniform vec2 uvOffset : [0.0, 0.0];
uniform vec2 detailUvRepeat : [1.0, 1.0];
uniform vec2 detailUvOffset : [0.0, 0.0];

varying vec2 v_Texcoord;
varying vec2 v_DetailTexcoord;
@end

@export ecgl.common.uv.main
v_Texcoord = texcoord * uvRepeat + uvOffset;
v_DetailTexcoord = texcoord * detailUvRepeat + detailUvOffset;
@end

@export ecgl.common.uv.fragmentHeader
varying vec2 v_Texcoord;
varying vec2 v_DetailTexcoord;
@end


@export ecgl.common.albedo.main

 vec4 albedoTexel = vec4(1.0);
#ifdef DIFFUSEMAP_ENABLED
 albedoTexel = texture2D(diffuseMap, v_Texcoord);
 #ifdef SRGB_DECODE
 albedoTexel = sRGBToLinear(albedoTexel);
 #endif
#endif

#ifdef DETAILMAP_ENABLED
 vec4 detailTexel = texture2D(detailMap, v_DetailTexcoord);
 #ifdef SRGB_DECODE
 detailTexel = sRGBToLinear(detailTexel);
 #endif
 albedoTexel.rgb = mix(albedoTexel.rgb, detailTexel.rgb, detailTexel.a);
 albedoTexel.a = detailTexel.a + (1.0 - detailTexel.a) * albedoTexel.a;
#endif

@end

@export ecgl.common.wireframe.vertexHeader

#ifdef WIREFRAME_QUAD
attribute vec4 barycentric;
varying vec4 v_Barycentric;
#elif defined(WIREFRAME_TRIANGLE)
attribute vec3 barycentric;
varying vec3 v_Barycentric;
#endif

@end

@export ecgl.common.wireframe.vertexMain

#if defined(WIREFRAME_QUAD) || defined(WIREFRAME_TRIANGLE)
 v_Barycentric = barycentric;
#endif

@end


@export ecgl.common.wireframe.fragmentHeader

uniform float wireframeLineWidth : 1;
uniform vec4 wireframeLineColor: [0, 0, 0, 0.5];

#ifdef WIREFRAME_QUAD
varying vec4 v_Barycentric;
float edgeFactor () {
 vec4 d = fwidth(v_Barycentric);
 vec4 a4 = smoothstep(vec4(0.0), d * wireframeLineWidth, v_Barycentric);
 return min(min(min(a4.x, a4.y), a4.z), a4.w);
}
#elif defined(WIREFRAME_TRIANGLE)
varying vec3 v_Barycentric;
float edgeFactor () {
 vec3 d = fwidth(v_Barycentric);
 vec3 a3 = smoothstep(vec3(0.0), d * wireframeLineWidth, v_Barycentric);
 return min(min(a3.x, a3.y), a3.z);
}
#endif

@end


@export ecgl.common.wireframe.fragmentMain

#if defined(WIREFRAME_QUAD) || defined(WIREFRAME_TRIANGLE)
 if (wireframeLineWidth > 0.) {
 vec4 lineColor = wireframeLineColor;
#ifdef SRGB_DECODE
 lineColor = sRGBToLinear(lineColor);
#endif

 gl_FragColor.rgb = mix(gl_FragColor.rgb, lineColor.rgb, (1.0 - edgeFactor()) * lineColor.a);
 }
#endif
@end




@export ecgl.common.bumpMap.header

#ifdef BUMPMAP_ENABLED
uniform sampler2D bumpMap;
uniform float bumpScale : 1.0;


vec3 bumpNormal(vec3 surfPos, vec3 surfNormal, vec3 baseNormal)
{
 vec2 dSTdx = dFdx(v_Texcoord);
 vec2 dSTdy = dFdy(v_Texcoord);

 float Hll = bumpScale * texture2D(bumpMap, v_Texcoord).x;
 float dHx = bumpScale * texture2D(bumpMap, v_Texcoord + dSTdx).x - Hll;
 float dHy = bumpScale * texture2D(bumpMap, v_Texcoord + dSTdy).x - Hll;

 vec3 vSigmaX = dFdx(surfPos);
 vec3 vSigmaY = dFdy(surfPos);
 vec3 vN = surfNormal;

 vec3 R1 = cross(vSigmaY, vN);
 vec3 R2 = cross(vN, vSigmaX);

 float fDet = dot(vSigmaX, R1);

 vec3 vGrad = sign(fDet) * (dHx * R1 + dHy * R2);
 return normalize(abs(fDet) * baseNormal - vGrad);

}
#endif

@end

@export ecgl.common.normalMap.vertexHeader

#ifdef NORMALMAP_ENABLED
attribute vec4 tangent : TANGENT;
varying vec3 v_Tangent;
varying vec3 v_Bitangent;
#endif

@end

@export ecgl.common.normalMap.vertexMain

#ifdef NORMALMAP_ENABLED
 if (dot(tangent, tangent) > 0.0) {
 v_Tangent = normalize((worldInverseTranspose * vec4(tangent.xyz, 0.0)).xyz);
 v_Bitangent = normalize(cross(v_Normal, v_Tangent) * tangent.w);
 }
#endif

@end


@export ecgl.common.normalMap.fragmentHeader

#ifdef NORMALMAP_ENABLED
uniform sampler2D normalMap;
varying vec3 v_Tangent;
varying vec3 v_Bitangent;
#endif

@end

@export ecgl.common.normalMap.fragmentMain
#ifdef NORMALMAP_ENABLED
 if (dot(v_Tangent, v_Tangent) > 0.0) {
 vec3 normalTexel = texture2D(normalMap, v_DetailTexcoord).xyz;
 if (dot(normalTexel, normalTexel) > 0.0) { N = normalTexel * 2.0 - 1.0;
 mat3 tbn = mat3(v_Tangent, v_Bitangent, v_Normal);
 N = normalize(tbn * N);
 }
 }
#endif
@end



@export ecgl.common.vertexAnimation.header

#ifdef VERTEX_ANIMATION
attribute vec3 prevPosition;
attribute vec3 prevNormal;
uniform float percent;
#endif

@end

@export ecgl.common.vertexAnimation.main

#ifdef VERTEX_ANIMATION
 vec3 pos = mix(prevPosition, position, percent);
 vec3 norm = mix(prevNormal, normal, percent);
#else
 vec3 pos = position;
 vec3 norm = normal;
#endif

@end


@export ecgl.common.ssaoMap.header
#ifdef SSAOMAP_ENABLED
uniform sampler2D ssaoMap;
uniform vec4 viewport : VIEWPORT;
#endif
@end

@export ecgl.common.ssaoMap.main
 float ao = 1.0;
#ifdef SSAOMAP_ENABLED
 ao = texture2D(ssaoMap, (gl_FragCoord.xy - viewport.xy) / viewport.zw).r;
#endif
@end




@export ecgl.common.diffuseLayer.header

#if (LAYER_DIFFUSEMAP_COUNT > 0)
uniform float layerDiffuseIntensity[LAYER_DIFFUSEMAP_COUNT];
uniform sampler2D layerDiffuseMap[LAYER_DIFFUSEMAP_COUNT];
#endif

@end

@export ecgl.common.emissiveLayer.header

#if (LAYER_EMISSIVEMAP_COUNT > 0)
uniform float layerEmissionIntensity[LAYER_EMISSIVEMAP_COUNT];
uniform sampler2D layerEmissiveMap[LAYER_EMISSIVEMAP_COUNT];
#endif

@end

@export ecgl.common.layers.header
@import ecgl.common.diffuseLayer.header
@import ecgl.common.emissiveLayer.header
@end

@export ecgl.common.diffuseLayer.main

#if (LAYER_DIFFUSEMAP_COUNT > 0)
 for (int _idx_ = 0; _idx_ < LAYER_DIFFUSEMAP_COUNT; _idx_++) {{
 float intensity = layerDiffuseIntensity[_idx_];
 vec4 texel2 = texture2D(layerDiffuseMap[_idx_], v_Texcoord);
 #ifdef SRGB_DECODE
 texel2 = sRGBToLinear(texel2);
 #endif
 albedoTexel.rgb = mix(albedoTexel.rgb, texel2.rgb * intensity, texel2.a);
 albedoTexel.a = texel2.a + (1.0 - texel2.a) * albedoTexel.a;
 }}
#endif

@end

@export ecgl.common.emissiveLayer.main

#if (LAYER_EMISSIVEMAP_COUNT > 0)
 for (int _idx_ = 0; _idx_ < LAYER_EMISSIVEMAP_COUNT; _idx_++)
 {{
 vec4 texel2 = texture2D(layerEmissiveMap[_idx_], v_Texcoord) * layerEmissionIntensity[_idx_];
 #ifdef SRGB_DECODE
 texel2 = sRGBToLinear(texel2);
 #endif
 float intensity = layerEmissionIntensity[_idx_];
 gl_FragColor.rgb += texel2.rgb * texel2.a * intensity;
 }}
#endif

@end
`,Im=`@export ecgl.color.vertex

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

@import ecgl.common.uv.header

attribute vec2 texcoord : TEXCOORD_0;
attribute vec3 position: POSITION;

@import ecgl.common.wireframe.vertexHeader

#ifdef VERTEX_COLOR
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;
#endif

#ifdef VERTEX_ANIMATION
attribute vec3 prevPosition;
uniform float percent : 1.0;
#endif

#ifdef ATMOSPHERE_ENABLED
attribute vec3 normal: NORMAL;
uniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;
varying vec3 v_Normal;
#endif

void main()
{
#ifdef VERTEX_ANIMATION
 vec3 pos = mix(prevPosition, position, percent);
#else
 vec3 pos = position;
#endif

 gl_Position = worldViewProjection * vec4(pos, 1.0);

 @import ecgl.common.uv.main

#ifdef VERTEX_COLOR
 v_Color = a_Color;
#endif

#ifdef ATMOSPHERE_ENABLED
 v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);
#endif

 @import ecgl.common.wireframe.vertexMain

}

@end

@export ecgl.color.fragment

#define LAYER_DIFFUSEMAP_COUNT 0
#define LAYER_EMISSIVEMAP_COUNT 0

uniform sampler2D diffuseMap;
uniform sampler2D detailMap;

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

#ifdef ATMOSPHERE_ENABLED
uniform mat4 viewTranspose: VIEWTRANSPOSE;
uniform vec3 glowColor;
uniform float glowPower;
varying vec3 v_Normal;
#endif

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif

@import ecgl.common.layers.header

@import ecgl.common.uv.fragmentHeader

@import ecgl.common.wireframe.fragmentHeader

@import clay.util.srgb

void main()
{
#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(color);
#else
 gl_FragColor = color;
#endif

#ifdef VERTEX_COLOR
 gl_FragColor *= v_Color;
#endif

 @import ecgl.common.albedo.main

 @import ecgl.common.diffuseLayer.main

 gl_FragColor *= albedoTexel;

#ifdef ATMOSPHERE_ENABLED
 float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);
 gl_FragColor.rgb += glowColor * atmoIntensity;
#endif

 @import ecgl.common.emissiveLayer.main

 @import ecgl.common.wireframe.fragmentMain

}
@end`,Om=`/**
 * http: */

@export ecgl.lambert.vertex

@import ecgl.common.transformUniforms

@import ecgl.common.uv.header


@import ecgl.common.attributes

@import ecgl.common.wireframe.vertexHeader

#ifdef VERTEX_COLOR
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;
#endif


@import ecgl.common.vertexAnimation.header


varying vec3 v_Normal;
varying vec3 v_WorldPosition;

void main()
{
 @import ecgl.common.uv.main

 @import ecgl.common.vertexAnimation.main


 gl_Position = worldViewProjection * vec4(pos, 1.0);

 v_Normal = normalize((worldInverseTranspose * vec4(norm, 0.0)).xyz);
 v_WorldPosition = (world * vec4(pos, 1.0)).xyz;

#ifdef VERTEX_COLOR
 v_Color = a_Color;
#endif

 @import ecgl.common.wireframe.vertexMain
}

@end


@export ecgl.lambert.fragment

#define LAYER_DIFFUSEMAP_COUNT 0
#define LAYER_EMISSIVEMAP_COUNT 0

#define NORMAL_UP_AXIS 1
#define NORMAL_FRONT_AXIS 2

@import ecgl.common.uv.fragmentHeader

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform sampler2D diffuseMap;
uniform sampler2D detailMap;

@import ecgl.common.layers.header

uniform float emissionIntensity: 1.0;

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

uniform mat4 viewInverse : VIEWINVERSE;

#ifdef ATMOSPHERE_ENABLED
uniform mat4 viewTranspose: VIEWTRANSPOSE;
uniform vec3 glowColor;
uniform float glowPower;
#endif

#ifdef AMBIENT_LIGHT_COUNT
@import clay.header.ambient_light
#endif
#ifdef AMBIENT_SH_LIGHT_COUNT
@import clay.header.ambient_sh_light
#endif

#ifdef DIRECTIONAL_LIGHT_COUNT
@import clay.header.directional_light
#endif

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif


@import ecgl.common.ssaoMap.header

@import ecgl.common.bumpMap.header

@import clay.util.srgb

@import ecgl.common.wireframe.fragmentHeader

@import clay.plugin.compute_shadow_map

void main()
{
#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(color);
#else
 gl_FragColor = color;
#endif

#ifdef VERTEX_COLOR
 #ifdef SRGB_DECODE
 gl_FragColor *= sRGBToLinear(v_Color);
 #else
 gl_FragColor *= v_Color;
 #endif
#endif

 @import ecgl.common.albedo.main

 @import ecgl.common.diffuseLayer.main

 gl_FragColor *= albedoTexel;

 vec3 N = v_Normal;
#ifdef DOUBLE_SIDED
 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(eyePos - v_WorldPosition);

 if (dot(N, V) < 0.0) {
 N = -N;
 }
#endif

 float ambientFactor = 1.0;

#ifdef BUMPMAP_ENABLED
 N = bumpNormal(v_WorldPosition, v_Normal, N);
 ambientFactor = dot(v_Normal, N);
#endif

 vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);

 vec3 diffuseColor = vec3(0.0, 0.0, 0.0);

 @import ecgl.common.ssaoMap.main

#ifdef AMBIENT_LIGHT_COUNT
 for(int i = 0; i < AMBIENT_LIGHT_COUNT; i++)
 {
 diffuseColor += ambientLightColor[i] * ambientFactor * ao;
 }
#endif
#ifdef AMBIENT_SH_LIGHT_COUNT
 for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)
 {{
 diffuseColor += calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_] * ao;
 }}
#endif
#ifdef DIRECTIONAL_LIGHT_COUNT
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];
 if(shadowEnabled)
 {
 computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);
 }
#endif
 for(int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++)
 {
 vec3 lightDirection = -directionalLightDirection[i];
 vec3 lightColor = directionalLightColor[i];

 float shadowContrib = 1.0;
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 if (shadowEnabled)
 {
 shadowContrib = shadowContribsDir[i];
 }
#endif

 float ndl = dot(N, normalize(lightDirection)) * shadowContrib;

 diffuseColor += lightColor * clamp(ndl, 0.0, 1.0);
 }
#endif

 gl_FragColor.rgb *= diffuseColor;

#ifdef ATMOSPHERE_ENABLED
 float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);
 gl_FragColor.rgb += glowColor * atmoIntensity;
#endif

 @import ecgl.common.emissiveLayer.main

 @import ecgl.common.wireframe.fragmentMain
}

@end`,Bm=`@export ecgl.realistic.vertex

@import ecgl.common.transformUniforms

@import ecgl.common.uv.header

@import ecgl.common.attributes


@import ecgl.common.wireframe.vertexHeader

#ifdef VERTEX_COLOR
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;
#endif

#ifdef NORMALMAP_ENABLED
attribute vec4 tangent : TANGENT;
varying vec3 v_Tangent;
varying vec3 v_Bitangent;
#endif

@import ecgl.common.vertexAnimation.header

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

void main()
{

 @import ecgl.common.uv.main

 @import ecgl.common.vertexAnimation.main

 gl_Position = worldViewProjection * vec4(pos, 1.0);

 v_Normal = normalize((worldInverseTranspose * vec4(norm, 0.0)).xyz);
 v_WorldPosition = (world * vec4(pos, 1.0)).xyz;

#ifdef VERTEX_COLOR
 v_Color = a_Color;
#endif

#ifdef NORMALMAP_ENABLED
 v_Tangent = normalize((worldInverseTranspose * vec4(tangent.xyz, 0.0)).xyz);
 v_Bitangent = normalize(cross(v_Normal, v_Tangent) * tangent.w);
#endif

 @import ecgl.common.wireframe.vertexMain

}

@end



@export ecgl.realistic.fragment

#define LAYER_DIFFUSEMAP_COUNT 0
#define LAYER_EMISSIVEMAP_COUNT 0
#define PI 3.14159265358979
#define ROUGHNESS_CHANEL 0
#define METALNESS_CHANEL 1

#define NORMAL_UP_AXIS 1
#define NORMAL_FRONT_AXIS 2

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif

@import ecgl.common.uv.fragmentHeader

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform sampler2D diffuseMap;

uniform sampler2D detailMap;
uniform sampler2D metalnessMap;
uniform sampler2D roughnessMap;

@import ecgl.common.layers.header

uniform float emissionIntensity: 1.0;

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

uniform float metalness : 0.0;
uniform float roughness : 0.5;

uniform mat4 viewInverse : VIEWINVERSE;

#ifdef ATMOSPHERE_ENABLED
uniform mat4 viewTranspose: VIEWTRANSPOSE;
uniform vec3 glowColor;
uniform float glowPower;
#endif

#ifdef AMBIENT_LIGHT_COUNT
@import clay.header.ambient_light
#endif

#ifdef AMBIENT_SH_LIGHT_COUNT
@import clay.header.ambient_sh_light
#endif

#ifdef AMBIENT_CUBEMAP_LIGHT_COUNT
@import clay.header.ambient_cubemap_light
#endif

#ifdef DIRECTIONAL_LIGHT_COUNT
@import clay.header.directional_light
#endif

@import ecgl.common.normalMap.fragmentHeader

@import ecgl.common.ssaoMap.header

@import ecgl.common.bumpMap.header

@import clay.util.srgb

@import clay.util.rgbm

@import ecgl.common.wireframe.fragmentHeader

@import clay.plugin.compute_shadow_map

vec3 F_Schlick(float ndv, vec3 spec) {
 return spec + (1.0 - spec) * pow(1.0 - ndv, 5.0);
}

float D_Phong(float g, float ndh) {
 float a = pow(8192.0, g);
 return (a + 2.0) / 8.0 * pow(ndh, a);
}

void main()
{
 vec4 albedoColor = color;

 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(eyePos - v_WorldPosition);
#ifdef VERTEX_COLOR
 #ifdef SRGB_DECODE
 albedoColor *= sRGBToLinear(v_Color);
 #else
 albedoColor *= v_Color;
 #endif
#endif

 @import ecgl.common.albedo.main

 @import ecgl.common.diffuseLayer.main

 albedoColor *= albedoTexel;

 float m = metalness;

#ifdef METALNESSMAP_ENABLED
 float m2 = texture2D(metalnessMap, v_DetailTexcoord)[METALNESS_CHANEL];
 m = clamp(m2 + (m - 0.5) * 2.0, 0.0, 1.0);
#endif

 vec3 baseColor = albedoColor.rgb;
 albedoColor.rgb = baseColor * (1.0 - m);
 vec3 specFactor = mix(vec3(0.04), baseColor, m);

 float g = 1.0 - roughness;

#ifdef ROUGHNESSMAP_ENABLED
 float g2 = 1.0 - texture2D(roughnessMap, v_DetailTexcoord)[ROUGHNESS_CHANEL];
 g = clamp(g2 + (g - 0.5) * 2.0, 0.0, 1.0);
#endif

 vec3 N = v_Normal;

#ifdef DOUBLE_SIDED
 if (dot(N, V) < 0.0) {
 N = -N;
 }
#endif

 float ambientFactor = 1.0;

#ifdef BUMPMAP_ENABLED
 N = bumpNormal(v_WorldPosition, v_Normal, N);
 ambientFactor = dot(v_Normal, N);
#endif

@import ecgl.common.normalMap.fragmentMain

 vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);

 vec3 diffuseTerm = vec3(0.0);
 vec3 specularTerm = vec3(0.0);

 float ndv = clamp(dot(N, V), 0.0, 1.0);
 vec3 fresnelTerm = F_Schlick(ndv, specFactor);

 @import ecgl.common.ssaoMap.main

#ifdef AMBIENT_LIGHT_COUNT
 for(int _idx_ = 0; _idx_ < AMBIENT_LIGHT_COUNT; _idx_++)
 {{
 diffuseTerm += ambientLightColor[_idx_] * ambientFactor * ao;
 }}
#endif

#ifdef AMBIENT_SH_LIGHT_COUNT
 for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)
 {{
 diffuseTerm += calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_] * ao;
 }}
#endif

#ifdef DIRECTIONAL_LIGHT_COUNT
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];
 if(shadowEnabled)
 {
 computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);
 }
#endif
 for(int _idx_ = 0; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++)
 {{
 vec3 L = -directionalLightDirection[_idx_];
 vec3 lc = directionalLightColor[_idx_];

 vec3 H = normalize(L + V);
 float ndl = clamp(dot(N, normalize(L)), 0.0, 1.0);
 float ndh = clamp(dot(N, H), 0.0, 1.0);

 float shadowContrib = 1.0;
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 if (shadowEnabled)
 {
 shadowContrib = shadowContribsDir[_idx_];
 }
#endif

 vec3 li = lc * ndl * shadowContrib;

 diffuseTerm += li;
 specularTerm += li * fresnelTerm * D_Phong(g, ndh);
 }}
#endif


#ifdef AMBIENT_CUBEMAP_LIGHT_COUNT
 vec3 L = reflect(-V, N);
 L = vec3(L.x, L[NORMAL_UP_AXIS], L[NORMAL_FRONT_AXIS]);
 float rough2 = clamp(1.0 - g, 0.0, 1.0);
 float bias2 = rough2 * 5.0;
 vec2 brdfParam2 = texture2D(ambientCubemapLightBRDFLookup[0], vec2(rough2, ndv)).xy;
 vec3 envWeight2 = specFactor * brdfParam2.x + brdfParam2.y;
 vec3 envTexel2;
 for(int _idx_ = 0; _idx_ < AMBIENT_CUBEMAP_LIGHT_COUNT; _idx_++)
 {{
 envTexel2 = RGBMDecode(textureCubeLodEXT(ambientCubemapLightCubemap[_idx_], L, bias2), 8.12);
 specularTerm += ambientCubemapLightColor[_idx_] * envTexel2 * envWeight2 * ao;
 }}
#endif

 gl_FragColor.rgb = albedoColor.rgb * diffuseTerm + specularTerm;
 gl_FragColor.a = albedoColor.a;

#ifdef ATMOSPHERE_ENABLED
 float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);
 gl_FragColor.rgb += glowColor * atmoIntensity;
#endif

#ifdef SRGB_ENCODE
 gl_FragColor = linearTosRGB(gl_FragColor);
#endif

 @import ecgl.common.emissiveLayer.main

 @import ecgl.common.wireframe.fragmentMain
}

@end`,Fm=`@export ecgl.hatching.vertex

@import ecgl.realistic.vertex

@end


@export ecgl.hatching.fragment

#define NORMAL_UP_AXIS 1
#define NORMAL_FRONT_AXIS 2

@import ecgl.common.uv.fragmentHeader

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform vec4 color : [0.0, 0.0, 0.0, 1.0];
uniform vec4 paperColor : [1.0, 1.0, 1.0, 1.0];

uniform mat4 viewInverse : VIEWINVERSE;

#ifdef AMBIENT_LIGHT_COUNT
@import clay.header.ambient_light
#endif
#ifdef AMBIENT_SH_LIGHT_COUNT
@import clay.header.ambient_sh_light
#endif

#ifdef DIRECTIONAL_LIGHT_COUNT
@import clay.header.directional_light
#endif

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif


@import ecgl.common.ssaoMap.header

@import ecgl.common.bumpMap.header

@import clay.util.srgb

@import ecgl.common.wireframe.fragmentHeader

@import clay.plugin.compute_shadow_map

uniform sampler2D hatch1;
uniform sampler2D hatch2;
uniform sampler2D hatch3;
uniform sampler2D hatch4;
uniform sampler2D hatch5;
uniform sampler2D hatch6;

float shade(in float tone) {
 vec4 c = vec4(1. ,1., 1., 1.);
 float step = 1. / 6.;
 vec2 uv = v_DetailTexcoord;
 if (tone <= step / 2.0) {
 c = mix(vec4(0.), texture2D(hatch6, uv), 12. * tone);
 }
 else if (tone <= step) {
 c = mix(texture2D(hatch6, uv), texture2D(hatch5, uv), 6. * tone);
 }
 if(tone > step && tone <= 2. * step){
 c = mix(texture2D(hatch5, uv), texture2D(hatch4, uv) , 6. * (tone - step));
 }
 if(tone > 2. * step && tone <= 3. * step){
 c = mix(texture2D(hatch4, uv), texture2D(hatch3, uv), 6. * (tone - 2. * step));
 }
 if(tone > 3. * step && tone <= 4. * step){
 c = mix(texture2D(hatch3, uv), texture2D(hatch2, uv), 6. * (tone - 3. * step));
 }
 if(tone > 4. * step && tone <= 5. * step){
 c = mix(texture2D(hatch2, uv), texture2D(hatch1, uv), 6. * (tone - 4. * step));
 }
 if(tone > 5. * step){
 c = mix(texture2D(hatch1, uv), vec4(1.), 6. * (tone - 5. * step));
 }

 return c.r;
}

const vec3 w = vec3(0.2125, 0.7154, 0.0721);

void main()
{
#ifdef SRGB_DECODE
 vec4 inkColor = sRGBToLinear(color);
#else
 vec4 inkColor = color;
#endif

#ifdef VERTEX_COLOR
 #ifdef SRGB_DECODE
 inkColor *= sRGBToLinear(v_Color);
 #else
 inkColor *= v_Color;
 #endif
#endif

 vec3 N = v_Normal;
#ifdef DOUBLE_SIDED
 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(eyePos - v_WorldPosition);

 if (dot(N, V) < 0.0) {
 N = -N;
 }
#endif

 float tone = 0.0;

 float ambientFactor = 1.0;

#ifdef BUMPMAP_ENABLED
 N = bumpNormal(v_WorldPosition, v_Normal, N);
 ambientFactor = dot(v_Normal, N);
#endif

 vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);

 @import ecgl.common.ssaoMap.main

#ifdef AMBIENT_LIGHT_COUNT
 for(int i = 0; i < AMBIENT_LIGHT_COUNT; i++)
 {
 tone += dot(ambientLightColor[i], w) * ambientFactor * ao;
 }
#endif
#ifdef AMBIENT_SH_LIGHT_COUNT
 for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)
 {{
 tone += dot(calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_], w) * ao;
 }}
#endif
#ifdef DIRECTIONAL_LIGHT_COUNT
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];
 if(shadowEnabled)
 {
 computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);
 }
#endif
 for(int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++)
 {
 vec3 lightDirection = -directionalLightDirection[i];
 float lightTone = dot(directionalLightColor[i], w);

 float shadowContrib = 1.0;
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 if (shadowEnabled)
 {
 shadowContrib = shadowContribsDir[i];
 }
#endif

 float ndl = dot(N, normalize(lightDirection)) * shadowContrib;

 tone += lightTone * clamp(ndl, 0.0, 1.0);
 }
#endif

 gl_FragColor = mix(inkColor, paperColor, shade(clamp(tone, 0.0, 1.0)));
 }
@end
`,Gm=`@export ecgl.sm.depth.vertex

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

attribute vec3 position : POSITION;
attribute vec2 texcoord : TEXCOORD_0;

#ifdef VERTEX_ANIMATION
attribute vec3 prevPosition;
uniform float percent : 1.0;
#endif

varying vec4 v_ViewPosition;
varying vec2 v_Texcoord;

void main(){

#ifdef VERTEX_ANIMATION
 vec3 pos = mix(prevPosition, position, percent);
#else
 vec3 pos = position;
#endif

 v_ViewPosition = worldViewProjection * vec4(pos, 1.0);
 gl_Position = v_ViewPosition;

 v_Texcoord = texcoord;

}
@end



@export ecgl.sm.depth.fragment

@import clay.sm.depth.fragment

@end`;Object.assign(rr.prototype,Rm),V.import(Vf),V.import(ef),V.import(Nm),V.import(Im),V.import(Om),V.import(Bm),V.import(Fm),V.import(Gm);function Um(e){return!e||e==="none"}function kf(e){return e instanceof HTMLCanvasElement||e instanceof HTMLImageElement||e instanceof Image}function zm(e){return e.getZr&&e.setOption}var Hm=Cr.prototype.addToScene,Vm=Cr.prototype.removeFromScene;Cr.prototype.addToScene=function(e){if(Hm.call(this,e),this.__zr){var t=this.__zr;e.traverse(function(r){r.__zr=t,r.addAnimatorsToZr&&r.addAnimatorsToZr(t)})}},Cr.prototype.removeFromScene=function(e){Vm.call(this,e),e.traverse(function(t){var r=t.__zr;t.__zr=null,r&&t.removeAnimatorsFromZr&&t.removeAnimatorsFromZr(r)})},Gt.prototype.setTextureImage=function(e,t,r,i){if(this.shader){var n=r.getZr(),a=this,o;return a.autoUpdateTextureStatus=!1,a.disableTexture(e),Um(t)||(o=K.loadTexture(t,r,i,function(s){a.enableTexture(e),n&&n.refresh()}),a.set(e,o)),o}};var K={};K.Renderer=Nn,K.Node=rr,K.Mesh=Kr,K.Shader=V,K.Material=Gt,K.Texture=X,K.Texture2D=ee,K.Geometry=ce,K.SphereGeometry=Vg,K.PlaneGeometry=oo,K.CubeGeometry=Tf,K.AmbientLight=Wg,K.DirectionalLight=jg,K.PointLight=Zg,K.SpotLight=Kg,K.PerspectiveCamera=Qe,K.OrthographicCamera=Ki,K.Vector2=Pt,K.Vector3=z,K.Vector4=Qg,K.Quaternion=Ph,K.Matrix2=Jg,K.Matrix2d=$g,K.Matrix3=em,K.Matrix4=W,K.Plane=cf,K.Ray=ro,K.BoundingBox=pt,K.Frustum=rl;var wo=null;function km(){return wo!==null||(wo=ri.createBlank("rgba(255,255,255,0)").image),wo}function Wf(e){return Math.pow(2,Math.round(Math.log(e)/Math.LN2))}function Xf(e){if((e.wrapS===X.REPEAT||e.wrapT===X.REPEAT)&&e.image){var t=Wf(e.width),r=Wf(e.height);if(t!==e.width||r!==e.height){var i=document.createElement("canvas");i.width=t,i.height=r;var n=i.getContext("2d");n.drawImage(e.image,0,0,t,r),e.image=i}}}K.loadTexture=function(e,t,r,i){typeof r=="function"&&(i=r,r={}),r=r||{};for(var n=Object.keys(r).sort(),a="",o=0;o<n.length;o++)a+=n[o]+"_"+r[n[o]]+"_";var s=t.__textureCache=t.__textureCache||new Bn(20);if(zm(e)){var l=e.__textureid__,u=s.get(a+l);if(u)u.texture.surface.setECharts(e),i&&i(u.texture);else{var h=new bg(e);h.onupdate=function(){t.getZr().refresh()},u={texture:h.getTexture()};for(var o=0;o<n.length;o++)u.texture[n[o]]=r[n[o]];l=e.__textureid__||"__ecgl_ec__"+u.texture.__uid__,e.__textureid__=l,s.put(a+l,u),i&&i(u.texture)}return u.texture}else if(kf(e)){var l=e.__textureid__,u=s.get(a+l);if(!u){u={texture:new K.Texture2D({image:e})};for(var o=0;o<n.length;o++)u.texture[n[o]]=r[n[o]];l=e.__textureid__||"__ecgl_image__"+u.texture.__uid__,e.__textureid__=l,s.put(a+l,u),Xf(u.texture),i&&i(u.texture)}return u.texture}else{var u=s.get(a+e);if(u)u.callbacks?u.callbacks.push(i):i&&i(u.texture);else if(e.match(/.hdr$|^data:application\/octet-stream/)){u={callbacks:[i]};var f=ri.loadTexture(e,{exposure:r.exposure,fileType:"hdr"},function(){f.dirty(),u.callbacks.forEach(function(v){v&&v(f)}),u.callbacks=null});u.texture=f,s.put(a+e,u)}else{for(var f=new K.Texture2D({image:new Image}),o=0;o<n.length;o++)f[n[o]]=r[n[o]];u={texture:f,callbacks:[i]};var c=f.image;c.onload=function(){f.image=c,Xf(f),f.dirty(),u.callbacks.forEach(function(p){p&&p(f)}),u.callbacks=null},c.crossOrigin="Anonymous",c.src=e,f.image=km(),s.put(a+e,u)}return u.texture}},K.createAmbientCubemap=function(e,t,r,i){e=e||{};var n=e.texture,a=te.firstNotNull(e.exposure,1),o=new Rg({intensity:te.firstNotNull(e.specularIntensity,1)}),s=new Ig({intensity:te.firstNotNull(e.diffuseIntensity,1),coefficients:[.844,.712,.691,-.037,.083,.167,.343,.288,.299,-.041,-.021,-.009,-.003,-.041,-.064,-.011,-.007,-.004,-.031,.034,.081,-.06,-.049,-.06,.046,.056,.05]});return o.cubemap=K.loadTexture(n,r,{exposure:a},function(){o.cubemap.flipY=!1;var l=Date.now();o.prefilter(t,32);var u=Date.now()-l;console.log("Prefilter environment map: "+u+"ms"),s.coefficients=Ug.projectEnvironmentMap(t,o.cubemap,{lod:1}),i&&i()}),{specular:o,diffuse:s}},K.createBlankTexture=ri.createBlank,K.isImage=kf,K.additiveBlend=function(e){e.blendEquation(e.FUNC_ADD),e.blendFunc(e.SRC_ALPHA,e.ONE)},K.parseColor=function(e,t){return e instanceof Array?(t||(t=[]),t[0]=e[0],t[1]=e[1],t[2]=e[2],e.length>3?t[3]=e[3]:t[3]=1,t):(t=A.color.parse(e||"#000",t)||[0,0,0,0],t[0]/=255,t[1]/=255,t[2]/=255,t)},K.directionFromAlphaBeta=function(e,t){var r=e/180*Math.PI+Math.PI/2,i=-t/180*Math.PI+Math.PI/2,n=[],a=Math.sin(r);return n[0]=a*Math.cos(i),n[1]=-Math.cos(r),n[2]=a*Math.sin(i),n},K.getShadowResolution=function(e){var t=1024;switch(e){case"low":t=512;break;case"medium":break;case"high":t=2048;break;case"ultra":t=4096;break}return t},K.COMMON_SHADERS=["lambert","color","realistic","hatching","shadow"],K.createShader=function(e){e==="ecgl.shadow"&&(e="ecgl.displayShadow");var t=V.source(e+".vertex"),r=V.source(e+".fragment");t||console.error("Vertex shader of '%s' not exits",e),r||console.error("Fragment shader of '%s' not exits",e);var i=new V(t,r);return i.name=e,i},K.createMaterial=function(e,t){t instanceof Array||(t=[t]);var r=K.createShader(e),i=new Gt({shader:r});return t.forEach(function(n){typeof n=="string"&&i.define(n)}),i},K.setMaterialFromModel=function(e,t,r,i){t.autoUpdateTextureStatus=!1;var n=r.getModel(e+"Material"),a=n.get("detailTexture"),o=te.firstNotNull(n.get("textureTiling"),1),s=te.firstNotNull(n.get("textureOffset"),0);typeof o=="number"&&(o=[o,o]),typeof s=="number"&&(s=[s,s]);var l=o[0]>1||o[1]>1?K.Texture.REPEAT:K.Texture.CLAMP_TO_EDGE,u={anisotropic:8,wrapS:l,wrapT:l};if(e==="realistic"){var h=n.get("roughness"),f=n.get("metalness");f!=null?isNaN(f)&&(t.setTextureImage("metalnessMap",f,i,u),f=te.firstNotNull(n.get("metalnessAdjust"),.5)):f=0,h!=null?isNaN(h)&&(t.setTextureImage("roughnessMap",h,i,u),h=te.firstNotNull(n.get("roughnessAdjust"),.5)):h=.5;var c=n.get("normalTexture");t.setTextureImage("detailMap",a,i,u),t.setTextureImage("normalMap",c,i,u),t.set({roughness:h,metalness:f,detailUvRepeat:o,detailUvOffset:s})}else if(e==="lambert")t.setTextureImage("detailMap",a,i,u),t.set({detailUvRepeat:o,detailUvOffset:s});else if(e==="color")t.setTextureImage("detailMap",a,i,u),t.set({detailUvRepeat:o,detailUvOffset:s});else if(e==="hatching"){var d=n.get("hatchingTextures")||[];d.length<6&&console.error("Invalid hatchingTextures.");for(var v=0;v<6;v++)t.setTextureImage("hatch"+(v+1),d[v],i,{anisotropic:8,wrapS:K.Texture.REPEAT,wrapT:K.Texture.REPEAT});t.set({detailUvRepeat:o,detailUvOffset:s})}},K.updateVertexAnimation=function(e,t,r,i){var n=i.get("animation"),a=i.get("animationDurationUpdate"),o=i.get("animationEasingUpdate"),s=r.shadowDepthMaterial;if(n&&t&&a>0&&t.geometry.vertexCount===r.geometry.vertexCount){r.material.define("vertex","VERTEX_ANIMATION"),r.ignorePreZ=!0,s&&s.define("vertex","VERTEX_ANIMATION");for(var l=0;l<e.length;l++)r.geometry.attributes[e[l][0]].value=t.geometry.attributes[e[l][1]].value;r.geometry.dirty(),r.__percent=0,r.material.set("percent",0),r.stopAnimation(),r.animate().when(a,{__percent:1}).during(function(){r.material.set("percent",r.__percent),s&&s.set("percent",r.__percent)}).done(function(){r.ignorePreZ=!1,r.material.undefine("vertex","VERTEX_ANIMATION"),s&&s.undefine("vertex","VERTEX_ANIMATION")}).start(o)}else r.material.undefine("vertex","VERTEX_ANIMATION"),s&&s.undefine("vertex","VERTEX_ANIMATION")};let S=K;var Dl=vt.extend({scene:null,camera:null,renderer:null},function(){this._ray=new ro,this._ndc=new Pt},{pick:function(e,t,r){var i=this.pickAll(e,t,[],r);return i[0]||null},pickAll:function(e,t,r,i){return this.renderer.screenToNDC(e,t,this._ndc),this.camera.castRay(this._ndc,this._ray),r=r||[],this._intersectNode(this.scene,r,i||!1),r.sort(this._intersectionCompareFunc),r},_intersectNode:function(e,t,r){e instanceof zs&&e.isRenderable()&&(!e.ignorePicking||r)&&(e.mode===O.TRIANGLES&&e.geometry.isUseIndices()||e.geometry.pickByRay||e.geometry.pick)&&this._intersectRenderable(e,t);for(var i=0;i<e._children.length;i++)this._intersectNode(e._children[i],t,r)},_intersectRenderable:(function(){var e=new z,t=new z,r=new z,i=new ro,n=new W;return function(a,o){var s=a.isSkinnedMesh();i.copy(this._ray),W.invert(n,a.worldTransform),s||i.applyTransform(n);var l=a.geometry,u=s?a.skeleton.boundingBox:l.boundingBox;if(!(u&&!i.intersectBoundingBox(u))){if(l.pick){l.pick(this._ndc.x,this._ndc.y,this.renderer,this.camera,a,o);return}else if(l.pickByRay){l.pickByRay(i,a,o);return}var h=a.cullFace===O.BACK&&a.frontFace===O.CCW||a.cullFace===O.FRONT&&a.frontFace===O.CW,f,c=l.indices,d=l.attributes.position,v=l.attributes.weight,p=l.attributes.joint,_,g=[];if(!(!d||!d.value||!c)){if(s){_=a.skeleton.getSubSkinMatrices(a.__uid__,a.joints);for(var m=0;m<a.joints.length;m++){g[m]=g[m]||[];for(var y=0;y<16;y++)g[m][y]=_[m*16+y]}var x=[],w=[],T=[],E=[],b=[],D=l.attributes.skinnedPosition;(!D||!D.value)&&(l.createAttribute("skinnedPosition","f",3),D=l.attributes.skinnedPosition,D.init(l.vertexCount));for(var m=0;m<l.vertexCount;m++){d.get(m,x),v.get(m,w),p.get(m,T),w[3]=1-w[0]-w[1]-w[2],C.set(E,0,0,0);for(var y=0;y<4;y++)T[y]>=0&&w[y]>1e-4&&(C.transformMat4(b,x,g[T[y]]),C.scaleAndAdd(E,E,b,w[y]));D.set(m,E)}}for(var m=0;m<c.length;m+=3){var L=c[m],M=c[m+1],R=c[m+2],I=s?l.attributes.skinnedPosition:d;if(I.get(L,e.array),I.get(M,t.array),I.get(R,r.array),h?f=i.intersectTriangle(e,t,r,a.culling):f=i.intersectTriangle(e,r,t,a.culling),f){var P=new z;s?z.copy(P,f):z.transformMat4(P,f,a.worldTransform),o.push(new Dl.Intersection(f,P,a,[L,M,R],m/3,z.dist(P,this._ray.origin)))}}}}}})(),_intersectionCompareFunc:function(e,t){return e.distance-t.distance}});Dl.Intersection=function(e,t,r,i,n,a){this.point=e,this.pointWorld=t,this.target=r,this.triangle=i,this.triangleIndex=n,this.distance=a};let Wm=Dl;var jf;jf=typeof window<"u"&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(e){return setTimeout(e,16)};let Cl=jf;var me=function(e,t){this.id=e,this.zr=t;try{this.renderer=new Nn({clearBit:0,devicePixelRatio:t.painter.dpr,preserveDrawingBuffer:!0,premultipliedAlpha:!0}),this.renderer.resize(t.painter.getWidth(),t.painter.getHeight())}catch(i){this.renderer=null,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute; left: 0; top: 0; right: 0; bottom: 0;",this.dom.className="ecgl-nowebgl",this.dom.innerHTML="Sorry, your browser does not support WebGL",console.error(i);return}this.onglobalout=this.onglobalout.bind(this),t.on("globalout",this.onglobalout),this.dom=this.renderer.canvas;var r=this.dom.style;r.position="absolute",r.left="0",r.top="0",this.views=[],this._picking=new Wm({renderer:this.renderer}),this._viewsToDispose=[],this._accumulatingId=0,this._zrEventProxy=new A.graphic.Rect({shape:{x:-1,y:-1,width:2,height:2},__isGLToZRProxy:!0}),this._backgroundColor=null,this._disposed=!1};me.prototype.setUnpainted=function(){},me.prototype.addView=function(e){if(e.layer!==this){var t=this._viewsToDispose.indexOf(e);t>=0&&this._viewsToDispose.splice(t,1),this.views.push(e),e.layer=this;var r=this.zr;e.scene.traverse(function(i){i.__zr=r,i.addAnimatorsToZr&&i.addAnimatorsToZr(r)})}};function qf(e){var t=e.__zr;e.__zr=null,t&&e.removeAnimatorsFromZr&&e.removeAnimatorsFromZr(t)}me.prototype.removeView=function(e){if(e.layer===this){var t=this.views.indexOf(e);t>=0&&(this.views.splice(t,1),e.scene.traverse(qf,this),e.layer=null,this._viewsToDispose.push(e))}},me.prototype.removeViewsAll=function(){this.views.forEach(function(e){e.scene.traverse(qf,this),e.layer=null,this._viewsToDispose.push(e)},this),this.views.length=0},me.prototype.resize=function(e,t){var r=this.renderer;r.resize(e,t)},me.prototype.clear=function(){var e=this.renderer.gl,t=this._backgroundColor||[0,0,0,0];e.clearColor(t[0],t[1],t[2],t[3]),e.depthMask(!0),e.colorMask(!0,!0,!0,!0),e.clear(e.DEPTH_BUFFER_BIT|e.COLOR_BUFFER_BIT)},me.prototype.clearDepth=function(){var e=this.renderer.gl;e.clear(e.DEPTH_BUFFER_BIT)},me.prototype.clearColor=function(){var e=this.renderer.gl;e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)},me.prototype.needsRefresh=function(){this.zr.refresh()},me.prototype.refresh=function(e){this._backgroundColor=e?S.parseColor(e):[0,0,0,0],this.renderer.clearColor=this._backgroundColor;for(var t=0;t<this.views.length;t++)this.views[t].prepareRender(this.renderer);this._doRender(!1),this._trackAndClean();for(var t=0;t<this._viewsToDispose.length;t++)this._viewsToDispose[t].dispose(this.renderer);this._viewsToDispose.length=0,this._startAccumulating()},me.prototype.renderToCanvas=function(e){this._startAccumulating(!0),e.drawImage(this.dom,0,0,e.canvas.width,e.canvas.height)},me.prototype._doRender=function(e){this.clear(),this.renderer.saveViewport();for(var t=0;t<this.views.length;t++)this.views[t].render(this.renderer,e);this.renderer.restoreViewport()},me.prototype._stopAccumulating=function(){this._accumulatingId=0,clearTimeout(this._accumulatingTimeout)};var Xm=1;me.prototype._startAccumulating=function(e){var t=this;this._stopAccumulating();for(var r=!1,i=0;i<this.views.length;i++)r=this.views[i].needsAccumulate()||r;if(!r)return;function n(a){if(!(!t._accumulatingId||a!==t._accumulatingId)){for(var o=!0,s=0;s<t.views.length;s++)o=t.views[s].isAccumulateFinished()&&r;o||(t._doRender(!0),e?n(a):Cl(function(){n(a)}))}}this._accumulatingId=Xm++,e?n(t._accumulatingId):this._accumulatingTimeout=setTimeout(function(){n(t._accumulatingId)},50)},me.prototype._trackAndClean=function(){var e=[],t=[];this._textureList&&(So(this._textureList),So(this._geometriesList));for(var r=0;r<this.views.length;r++)jm(this.views[r].scene,e,t);this._textureList&&(bo(this.renderer,this._textureList),bo(this.renderer,this._geometriesList)),this._textureList=e,this._geometriesList=t};function So(e){for(var t=0;t<e.length;t++)e[t].__used__=0}function bo(e,t){for(var r=0;r<t.length;r++)t[r].__used__||t[r].dispose(e)}function Eo(e,t){e.__used__=e.__used__||0,e.__used__++,e.__used__===1&&t.push(e)}function jm(e,t,r){var i,n;e.traverse(function(o){if(o.isRenderable()){var s=o.geometry,l=o.material;if(l!==i)for(var u=l.getTextureUniforms(),h=0;h<u.length;h++){var f=u[h],c=l.uniforms[f].value;if(c){if(c instanceof X)Eo(c,t);else if(c instanceof Array)for(var d=0;d<c.length;d++)c[d]instanceof X&&Eo(c[d],t)}}s!==n&&Eo(s,r),i=l,n=s}});for(var a=0;a<e.lights.length;a++)e.lights[a].cubemap&&Eo(e.lights[a].cubemap,t)}me.prototype.dispose=function(){this._disposed||(this._stopAccumulating(),this._textureList&&(So(this._textureList),So(this._geometriesList),bo(this.renderer,this._textureList),bo(this.renderer,this._geometriesList)),this.zr.off("globalout",this.onglobalout),this._disposed=!0)},me.prototype.onmousedown=function(e){if(!(e.target&&e.target.__isGLToZRProxy)){e=e.event;var t=this.pickObject(e.offsetX,e.offsetY);t&&(this._dispatchEvent("mousedown",e,t),this._dispatchDataEvent("mousedown",e,t)),this._downX=e.offsetX,this._downY=e.offsetY}},me.prototype.onmousemove=function(e){if(!(e.target&&e.target.__isGLToZRProxy)){e=e.event;var t=this.pickObject(e.offsetX,e.offsetY),r=t&&t.target,i=this._hovered;this._hovered=t,i&&r!==i.target&&(i.relatedTarget=r,this._dispatchEvent("mouseout",e,i),this.zr.setCursorStyle("default")),this._dispatchEvent("mousemove",e,t),t&&(this.zr.setCursorStyle("pointer"),(!i||r!==i.target)&&this._dispatchEvent("mouseover",e,t)),this._dispatchDataEvent("mousemove",e,t)}},me.prototype.onmouseup=function(e){if(!(e.target&&e.target.__isGLToZRProxy)){e=e.event;var t=this.pickObject(e.offsetX,e.offsetY);t&&(this._dispatchEvent("mouseup",e,t),this._dispatchDataEvent("mouseup",e,t)),this._upX=e.offsetX,this._upY=e.offsetY}},me.prototype.onclick=me.prototype.dblclick=function(e){if(!(e.target&&e.target.__isGLToZRProxy)){var t=this._upX-this._downX,r=this._upY-this._downY;if(!(Math.sqrt(t*t+r*r)>20)){e=e.event;var i=this.pickObject(e.offsetX,e.offsetY);i&&(this._dispatchEvent(e.type,e,i),this._dispatchDataEvent(e.type,e,i));var n=this._clickToSetFocusPoint(e);if(n){var a=n.view.setDOFFocusOnPoint(n.distance);a&&this.zr.refresh()}}}},me.prototype._clickToSetFocusPoint=function(e){for(var t=this.renderer,r=t.viewport,i=this.views.length-1;i>=0;i--){var n=this.views[i];if(n.hasDOF()&&n.containPoint(e.offsetX,e.offsetY)){this._picking.scene=n.scene,this._picking.camera=n.camera,t.viewport=n.viewport;var a=this._picking.pick(e.offsetX,e.offsetY,!0);if(a)return a.view=n,a}}t.viewport=r},me.prototype.onglobalout=function(e){var t=this._hovered;t&&this._dispatchEvent("mouseout",e,{target:t.target})},me.prototype.pickObject=function(e,t){for(var r=[],i=this.renderer,n=i.viewport,a=0;a<this.views.length;a++){var o=this.views[a];o.containPoint(e,t)&&(this._picking.scene=o.scene,this._picking.camera=o.camera,i.viewport=o.viewport,this._picking.pickAll(e,t,r))}return i.viewport=n,r.sort(function(s,l){return s.distance-l.distance}),r[0]},me.prototype._dispatchEvent=function(e,t,r){r||(r={});var i=r.target;for(r.cancelBubble=!1,r.event=t,r.type=e,r.offsetX=t.offsetX,r.offsetY=t.offsetY;i&&(i.trigger(e,r),i=i.getParent(),!r.cancelBubble););this._dispatchToView(e,r)},me.prototype._dispatchDataEvent=function(e,t,r){var i=r&&r.target,n=i&&i.dataIndex,a=i&&i.seriesIndex,o=i&&i.eventData,s=!1,l=this._zrEventProxy;l.x=t.offsetX,l.y=t.offsetY,l.update();var u={target:l};let h=A.helper.getECData(l);e==="mousemove"&&(n!=null?n!==this._lastDataIndex&&(parseInt(this._lastDataIndex,10)>=0&&(h.dataIndex=this._lastDataIndex,h.seriesIndex=this._lastSeriesIndex,this.zr.handler.dispatchToElement(u,"mouseout",t)),s=!0):o!=null&&o!==this._lastEventData&&(this._lastEventData!=null&&(h.eventData=this._lastEventData,this.zr.handler.dispatchToElement(u,"mouseout",t)),s=!0),this._lastEventData=o,this._lastDataIndex=n,this._lastSeriesIndex=a),h.eventData=o,h.dataIndex=n,h.seriesIndex=a,(o!=null||parseInt(n,10)>=0&&parseInt(a,10)>=0)&&(this.zr.handler.dispatchToElement(u,e,t),s&&this.zr.handler.dispatchToElement(u,"mouseover",t))},me.prototype._dispatchToView=function(e,t){for(var r=0;r<this.views.length;r++)this.views[r].containPoint(t.offsetX,t.offsetY)&&this.views[r].trigger(e,t)},Object.assign(me.prototype,Fs);let Zf=me;var qm=["bar3D","line3D","map3D","scatter3D","surface","lines3D","scatterGL","scatter3D"];function Jn(e,t){if(e&&e[t]&&(e[t].normal||e[t].emphasis)){var r=e[t].normal,i=e[t].emphasis;r&&(e[t]=r),i&&(e.emphasis=e.emphasis||{},e.emphasis[t]=i)}}function Zm(e){Jn(e,"itemStyle"),Jn(e,"lineStyle"),Jn(e,"areaStyle"),Jn(e,"label")}function Ao(e){e&&(e instanceof Array||(e=[e]),A.util.each(e,function(t){if(t.axisLabel){var r=t.axisLabel;Object.assign(r,r.textStyle),r.textStyle=null}}))}function Ym(e){A.util.each(e.series,function(t){A.util.indexOf(qm,t.type)>=0&&(Zm(t),t.coordinateSystem==="mapbox"&&(t.coordinateSystem="mapbox3D",e.mapbox3D=e.mapbox))}),Ao(e.xAxis3D),Ao(e.yAxis3D),Ao(e.zAxis3D),Ao(e.grid3D),Jn(e.geo3D)}function Ll(e,t,r){try{return Object.defineProperty(e,t,{value:r,configurable:!0,writable:!0}),!0}catch{}try{return Reflect.set(e,t,r)}catch{}return!1}var $n=A;Ll($n,"graphicGL",S);function Pl(e){this._layers={},this._zr=e}Pl.prototype.update=function(e,t){var r=this,i=t.getZr();if(!i.getWidth()||!i.getHeight()){console.warn("Dom has no width or height");return}function n(s){i.setSleepAfterStill(0);var l;s.coordinateSystem&&s.coordinateSystem.model,l=s.get("zlevel");var u=r._layers,h=u[l];if(!h){if(h=u[l]=new Zf("gl-"+l,i),i.painter.isSingleCanvas()){h.virtual=!0;var f=new $n.graphic.Image({z:1e4,style:{image:h.renderer.canvas},silent:!0});h.__hostImage=f,i.add(f)}i.painter.insertLayer(l,h)}return h.__hostImage&&h.__hostImage.setStyle({width:h.renderer.getWidth(),height:h.renderer.getHeight()}),h}function a(s,l){s&&s.traverse(function(u){u.isRenderable&&u.isRenderable()&&(u.ignorePicking=u.$ignorePicking!=null?u.$ignorePicking:l)})}for(var o in this._layers)this._layers[o].removeViewsAll();e.eachComponent(function(s,l){if(s!=="series"){var u=t.getViewOfComponentModel(l),h=l.coordinateSystem;if(u.__ecgl__){var f;if(h){if(!h.viewGL){console.error("Can't find viewGL in coordinateSystem of component "+l.id);return}f=h.viewGL}else{if(!l.viewGL){console.error("Can't find viewGL of component "+l.id);return}f=h.viewGL}var f=h.viewGL,c=n(l);c.addView(f),u.afterRender&&u.afterRender(l,e,t,c),a(u.groupGL,l.get("silent"))}}}),e.eachSeries(function(s){var l=t.getViewOfSeriesModel(s),u=s.coordinateSystem;if(l.__ecgl__){if(u&&!u.viewGL&&!l.viewGL){console.error("Can't find viewGL of series "+l.id);return}var h=u&&u.viewGL||l.viewGL,f=n(s);f.addView(h),l.afterRender&&l.afterRender(s,e,t,f),a(l.groupGL,s.get("silent"))}})},$n.registerPostInit(function(e){var t=e.getZr(),r=t.painter.dispose;t.painter.dispose=function(){typeof this.eachOtherLayer=="function"&&this.eachOtherLayer(function(i){i instanceof Zf&&i.dispose()}),r.call(this)}}),$n.registerPostUpdate(function(e,t){var r=t.getZr(),i=r.__egl=r.__egl||new Pl(r);i.update(e,t)}),$n.registerPreprocessor(Ym);let Ob=Pl,Mo={defaultOption:{viewControl:{projection:"perspective",autoRotate:!1,autoRotateDirection:"cw",autoRotateSpeed:10,autoRotateAfterStill:3,damping:.8,rotateSensitivity:1,zoomSensitivity:1,panSensitivity:1,panMouseButton:"middle",rotateMouseButton:"left",distance:150,minDistance:40,maxDistance:400,orthographicSize:150,maxOrthographicSize:400,minOrthographicSize:20,center:[0,0,0],alpha:0,beta:0,minAlpha:-90,maxAlpha:90}},setView:function(e){e=e||{},this.option.viewControl=this.option.viewControl||{},e.alpha!=null&&(this.option.viewControl.alpha=e.alpha),e.beta!=null&&(this.option.viewControl.beta=e.beta),e.distance!=null&&(this.option.viewControl.distance=e.distance),e.center!=null&&(this.option.viewControl.center=e.center)}},en={defaultOption:{postEffect:{enable:!1,bloom:{enable:!0,intensity:.1},depthOfField:{enable:!1,focalRange:20,focalDistance:50,blurRadius:10,fstop:2.8,quality:"medium"},screenSpaceAmbientOcclusion:{enable:!1,radius:2,quality:"medium",intensity:1},screenSpaceReflection:{enable:!1,quality:"medium",maxRoughness:.8},colorCorrection:{enable:!0,exposure:0,brightness:0,contrast:1,saturation:1,lookupTexture:""},edge:{enable:!1},FXAA:{enable:!1}},temporalSuperSampling:{enable:"auto"}}},tn={defaultOption:{light:{main:{shadow:!1,shadowQuality:"high",color:"#fff",intensity:1,alpha:0,beta:0},ambient:{color:"#fff",intensity:.2},ambientCubemap:{texture:null,exposure:1,diffuseIntensity:.5,specularIntensity:.5}}}};var Do=A.ComponentModel.extend({type:"grid3D",dependencies:["xAxis3D","yAxis3D","zAxis3D"],defaultOption:{show:!0,zlevel:-10,left:0,top:0,width:"100%",height:"100%",environment:"auto",boxWidth:100,boxHeight:100,boxDepth:100,axisPointer:{show:!0,lineStyle:{color:"rgba(0, 0, 0, 0.8)",width:1},label:{show:!0,formatter:null,margin:8,textStyle:{fontSize:14,color:"#fff",backgroundColor:"rgba(0,0,0,0.5)",padding:3,borderRadius:3}}},axisLine:{show:!0,lineStyle:{color:"#333",width:2,type:"solid"}},axisTick:{show:!0,inside:!1,length:3,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,margin:8,textStyle:{fontSize:12}},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},light:{main:{alpha:30,beta:40},ambient:{intensity:.4}},viewControl:{alpha:20,beta:40,autoRotate:!1,distance:200,minDistance:40,maxDistance:400}}});A.util.merge(Do.prototype,Mo),A.util.merge(Do.prototype,en),A.util.merge(Do.prototype,tn);let Km=Do;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Rl=function(e,t){return Rl=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},Rl(e,t)};function Ie(e,t){Rl(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var Yf=function(){return Yf=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},Yf.apply(this,arguments)};function Bb(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(r[i]=e[i]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)t.indexOf(i[n])<0&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r}function Fb(e,t,r,i){var n=arguments.length,a=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a}function Gb(e,t){return function(r,i){t(r,i,e)}}function Ub(e,t){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(e,t)}function zb(e,t,r,i){function n(a){return a instanceof r?a:new r(function(o){o(a)})}return new(r||(r=Promise))(function(a,o){function s(h){try{u(i.next(h))}catch(f){o(f)}}function l(h){try{u(i.throw(h))}catch(f){o(f)}}function u(h){h.done?a(h.value):n(h.value).then(s,l)}u((i=i.apply(e,t||[])).next())})}function Hb(e,t){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},i,n,a,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(u){return function(h){return l([u,h])}}function l(u){if(i)throw new TypeError("Generator is already executing.");for(;r;)try{if(i=1,n&&(a=u[0]&2?n.return:u[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,u[1])).done)return a;switch(n=0,a&&(u=[u[0]&2,a.value]),u[0]){case 0:case 1:a=u;break;case 4:return r.label++,{value:u[1],done:!1};case 5:r.label++,n=u[1],u=[0];continue;case 7:u=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(u[0]===6||u[0]===2)){r=0;continue}if(u[0]===3&&(!a||u[1]>a[0]&&u[1]<a[3])){r.label=u[1];break}if(u[0]===6&&r.label<a[1]){r.label=a[1],a=u;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(u);break}a[2]&&r.ops.pop(),r.trys.pop();continue}u=t.call(e,r)}catch(h){u=[6,h],n=0}finally{i=a=0}if(u[0]&5)throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}}var Kf=Object.create?(function(e,t,r,i){i===void 0&&(i=r),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[r]}})}):(function(e,t,r,i){i===void 0&&(i=r),e[i]=t[r]});function Vb(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&Kf(t,e,r)}function Qf(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],i=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function Qm(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var i=r.call(e),n,a=[],o;try{for(;(t===void 0||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(s){o={error:s}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a}function kb(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(Qm(arguments[t]));return e}function Wb(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var i=Array(e),n=0,t=0;t<r;t++)for(var a=arguments[t],o=0,s=a.length;o<s;o++,n++)i[n]=a[o];return i}function Co(e){return this instanceof Co?(this.v=e,this):new Co(e)}function Xb(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=r.apply(e,t||[]),n,a=[];return n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n;function o(c){i[c]&&(n[c]=function(d){return new Promise(function(v,p){a.push([c,d,v,p])>1||s(c,d)})})}function s(c,d){try{l(i[c](d))}catch(v){f(a[0][3],v)}}function l(c){c.value instanceof Co?Promise.resolve(c.value.v).then(u,h):f(a[0][2],c)}function u(c){s("next",c)}function h(c){s("throw",c)}function f(c,d){c(d),a.shift(),a.length&&s(a[0][0],a[0][1])}}function jb(e){var t,r;return t={},i("next"),i("throw",function(n){throw n}),i("return"),t[Symbol.iterator]=function(){return this},t;function i(n,a){t[n]=e[n]?function(o){return(r=!r)?{value:Co(e[n](o)),done:n==="return"}:a?a(o):o}:a}}function qb(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],r;return t?t.call(e):(e=typeof Qf=="function"?Qf(e):e[Symbol.iterator](),r={},i("next"),i("throw"),i("return"),r[Symbol.asyncIterator]=function(){return this},r);function i(a){r[a]=e[a]&&function(o){return new Promise(function(s,l){o=e[a](o),n(s,l,o.done,o.value)})}}function n(a,o,s,l){Promise.resolve(l).then(function(u){a({value:u,done:s})},o)}}function Zb(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var Jm=Object.create?(function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}):function(e,t){e.default=t};function Yb(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.prototype.hasOwnProperty.call(e,r)&&Kf(t,e,r);return Jm(t,e),t}function Kb(e){return e&&e.__esModule?e:{default:e}}function Qb(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)}function Jb(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r}var Nl=new Bn(50);function $m(e){if(typeof e=="string"){var t=Nl.get(e);return t&&t.image}else return e}function $b(e,t,r,i,n){if(e)if(typeof e=="string"){if(t&&t.__zrImageSrc===e||!r)return t;var a=Nl.get(e),o={hostEl:r,cb:i,cbPayload:n};return a?(t=a.image,!Jf(t)&&a.pending.push(o)):(t=new Image,t.onload=t.onerror=e0,Nl.put(e,t.__cachedImgObj={image:t,pending:[o]}),t.src=t.__zrImageSrc=e),t}else return e;else return t}function e0(){var e=this.__cachedImgObj;this.onload=this.onerror=this.__cachedImgObj=null;for(var t=0;t<e.pending.length;t++){var r=e.pending[t],i=r.cb;i&&i(this,r.cbPayload),r.hostEl.dirty()}e.pending.length=0}function Jf(e){return e&&e.width&&e.height}function rn(){return[1,0,0,1,0,0]}function $f(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e}function Il(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function Lo(e,t,r){var i=t[0]*r[0]+t[2]*r[1],n=t[1]*r[0]+t[3]*r[1],a=t[0]*r[2]+t[2]*r[3],o=t[1]*r[2]+t[3]*r[3],s=t[0]*r[4]+t[2]*r[5]+t[4],l=t[1]*r[4]+t[3]*r[5]+t[5];return e[0]=i,e[1]=n,e[2]=a,e[3]=o,e[4]=s,e[5]=l,e}function ec(e,t,r){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4]+r[0],e[5]=t[5]+r[1],e}function t0(e,t,r){var i=t[0],n=t[2],a=t[4],o=t[1],s=t[3],l=t[5],u=Math.sin(r),h=Math.cos(r);return e[0]=i*h+o*u,e[1]=-i*u+o*h,e[2]=n*h+s*u,e[3]=-n*u+h*s,e[4]=h*a+u*l,e[5]=h*l-u*a,e}function r0(e,t,r){var i=r[0],n=r[1];return e[0]=t[0]*i,e[1]=t[1]*n,e[2]=t[2]*i,e[3]=t[3]*n,e[4]=t[4]*i,e[5]=t[5]*n,e}function Ol(e,t){var r=t[0],i=t[2],n=t[4],a=t[1],o=t[3],s=t[5],l=r*o-a*i;return l?(l=1/l,e[0]=o*l,e[1]=-a*l,e[2]=-i*l,e[3]=r*l,e[4]=(i*s-o*n)*l,e[5]=(a*n-r*s)*l,e):null}function eE(e){var t=rn();return Il(t,e),t}var i0=(function(){function e(t,r){this.x=t||0,this.y=r||0}return e.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},e.prototype.clone=function(){return new e(this.x,this.y)},e.prototype.set=function(t,r){return this.x=t,this.y=r,this},e.prototype.equal=function(t){return t.x===this.x&&t.y===this.y},e.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},e.prototype.scale=function(t){this.x*=t,this.y*=t},e.prototype.scaleAndAdd=function(t,r){this.x+=t.x*r,this.y+=t.y*r},e.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},e.prototype.dot=function(t){return this.x*t.x+this.y*t.y},e.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},e.prototype.lenSquare=function(){return this.x*this.x+this.y*this.y},e.prototype.normalize=function(){var t=this.len();return this.x/=t,this.y/=t,this},e.prototype.distance=function(t){var r=this.x-t.x,i=this.y-t.y;return Math.sqrt(r*r+i*i)},e.prototype.distanceSquare=function(t){var r=this.x-t.x,i=this.y-t.y;return r*r+i*i},e.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},e.prototype.transform=function(t){if(t){var r=this.x,i=this.y;return this.x=t[0]*r+t[2]*i+t[4],this.y=t[1]*r+t[3]*i+t[5],this}},e.prototype.toArray=function(t){return t[0]=this.x,t[1]=this.y,t},e.prototype.fromArray=function(t){this.x=t[0],this.y=t[1]},e.set=function(t,r,i){t.x=r,t.y=i},e.copy=function(t,r){t.x=r.x,t.y=r.y},e.len=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},e.lenSquare=function(t){return t.x*t.x+t.y*t.y},e.dot=function(t,r){return t.x*r.x+t.y*r.y},e.add=function(t,r,i){t.x=r.x+i.x,t.y=r.y+i.y},e.sub=function(t,r,i){t.x=r.x-i.x,t.y=r.y-i.y},e.scale=function(t,r,i){t.x=r.x*i,t.y=r.y*i},e.scaleAndAdd=function(t,r,i,n){t.x=r.x+i.x*n,t.y=r.y+i.y*n},e.lerp=function(t,r,i,n){var a=1-n;t.x=a*r.x+n*i.x,t.y=a*r.y+n*i.y},e})();let Ee=i0;var Po=Math.min,Ro=Math.max,oi=new Ee,si=new Ee,li=new Ee,ui=new Ee,ea=new Ee,ta=new Ee,n0=(function(){function e(t,r,i,n){i<0&&(t=t+i,i=-i),n<0&&(r=r+n,n=-n),this.x=t,this.y=r,this.width=i,this.height=n}return e.prototype.union=function(t){var r=Po(t.x,this.x),i=Po(t.y,this.y);isFinite(this.x)&&isFinite(this.width)?this.width=Ro(t.x+t.width,this.x+this.width)-r:this.width=t.width,isFinite(this.y)&&isFinite(this.height)?this.height=Ro(t.y+t.height,this.y+this.height)-i:this.height=t.height,this.x=r,this.y=i},e.prototype.applyTransform=function(t){e.applyTransform(this,this,t)},e.prototype.calculateTransform=function(t){var r=this,i=t.width/r.width,n=t.height/r.height,a=rn();return ec(a,a,[-r.x,-r.y]),r0(a,a,[i,n]),ec(a,a,[t.x,t.y]),a},e.prototype.intersect=function(t,r){if(!t)return!1;t instanceof e||(t=e.create(t));var i=this,n=i.x,a=i.x+i.width,o=i.y,s=i.y+i.height,l=t.x,u=t.x+t.width,h=t.y,f=t.y+t.height,c=!(a<l||u<n||s<h||f<o);if(r){var d=1/0,v=0,p=Math.abs(a-l),_=Math.abs(u-n),g=Math.abs(s-h),m=Math.abs(f-o),y=Math.min(p,_),x=Math.min(g,m);a<l||u<n?y>v&&(v=y,p<_?Ee.set(ta,-p,0):Ee.set(ta,_,0)):y<d&&(d=y,p<_?Ee.set(ea,p,0):Ee.set(ea,-_,0)),s<h||f<o?x>v&&(v=x,g<m?Ee.set(ta,0,-g):Ee.set(ta,0,m)):y<d&&(d=y,g<m?Ee.set(ea,0,g):Ee.set(ea,0,-m))}return r&&Ee.copy(r,c?ea:ta),c},e.prototype.contain=function(t,r){var i=this;return t>=i.x&&t<=i.x+i.width&&r>=i.y&&r<=i.y+i.height},e.prototype.clone=function(){return new e(this.x,this.y,this.width,this.height)},e.prototype.copy=function(t){e.copy(this,t)},e.prototype.plain=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},e.prototype.isFinite=function(){return isFinite(this.x)&&isFinite(this.y)&&isFinite(this.width)&&isFinite(this.height)},e.prototype.isZero=function(){return this.width===0||this.height===0},e.create=function(t){return new e(t.x,t.y,t.width,t.height)},e.copy=function(t,r){t.x=r.x,t.y=r.y,t.width=r.width,t.height=r.height},e.applyTransform=function(t,r,i){if(!i){t!==r&&e.copy(t,r);return}if(i[1]<1e-5&&i[1]>-1e-5&&i[2]<1e-5&&i[2]>-1e-5){var n=i[0],a=i[3],o=i[4],s=i[5];t.x=r.x*n+o,t.y=r.y*a+s,t.width=r.width*n,t.height=r.height*a,t.width<0&&(t.x+=t.width,t.width=-t.width),t.height<0&&(t.y+=t.height,t.height=-t.height);return}oi.x=li.x=r.x,oi.y=ui.y=r.y,si.x=ui.x=r.x+r.width,si.y=li.y=r.y+r.height,oi.transform(i),ui.transform(i),si.transform(i),li.transform(i),t.x=Po(oi.x,si.x,li.x,ui.x),t.y=Po(oi.y,si.y,li.y,ui.y);var l=Ro(oi.x,si.x,li.x,ui.x),u=Ro(oi.y,si.y,li.y,ui.y);t.width=l-t.x,t.height=u-t.y},e})();let nt=n0;var tc={},ra="12px sans-serif",No,rc;function a0(e,t){return No||(No=vm().getContext("2d")),rc!==t&&(rc=No.font=t||ra),No.measureText(e)}var Bl={measureText:a0};function tE(e,t){Bl[e]=t}function Nt(e,t){t=t||ra;var r=tc[t];r||(r=tc[t]=new Bn(500));var i=r.get(e);return i==null&&(i=Bl.measureText(e,t).width,r.put(e,i)),i}function ic(e,t,r,i){var n=Nt(e,t),a=Fl(t),o=ia(0,n,r),s=nn(0,a,i),l=new nt(o,s,n,a);return l}function o0(e,t,r,i){var n=((e||"")+"").split(`
`),a=n.length;if(a===1)return ic(n[0],t,r,i);for(var o=new nt(0,0,0,0),s=0;s<n.length;s++){var l=ic(n[s],t,r,i);s===0?o.copy(l):o.union(l)}return o}function ia(e,t,r){return r==="right"?e-=t:r==="center"&&(e-=t/2),e}function nn(e,t,r){return r==="middle"?e-=t/2:r==="bottom"&&(e-=t),e}function Fl(e){return Nt("\u56FD",e)}function rE(e,t){return Bl.measureText(e,t)}function na(e,t){return typeof e=="string"?e.lastIndexOf("%")>=0?parseFloat(e)/100*t:parseFloat(e):e}function s0(e,t,r){var i=t.position||"inside",n=t.distance!=null?t.distance:5,a=r.height,o=r.width,s=a/2,l=r.x,u=r.y,h="left",f="top";if(i instanceof Array)l+=na(i[0],r.width),u+=na(i[1],r.height),h=null,f=null;else switch(i){case"left":l-=n,u+=s,h="right",f="middle";break;case"right":l+=n+o,u+=s,f="middle";break;case"top":l+=o/2,u-=n,h="center",f="bottom";break;case"bottom":l+=o/2,u+=a+n,h="center";break;case"inside":l+=o/2,u+=s,h="center",f="middle";break;case"insideLeft":l+=n,u+=s,f="middle";break;case"insideRight":l+=o-n,u+=s,h="right",f="middle";break;case"insideTop":l+=o/2,u+=n,h="center";break;case"insideBottom":l+=o/2,u+=a-n,h="center",f="bottom";break;case"insideTopLeft":l+=n,u+=n;break;case"insideTopRight":l+=o-n,u+=n,h="right";break;case"insideBottomLeft":l+=n,u+=a-n,f="bottom";break;case"insideBottomRight":l+=o-n,u+=a-n,h="right",f="bottom";break}return e=e||{},e.x=l,e.y=u,e.align=h,e.verticalAlign=f,e}var Gl=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;function l0(e,t,r,i,n){if(!t)return"";var a=(e+"").split(`
`);n=nc(t,r,i,n);for(var o=0,s=a.length;o<s;o++)a[o]=ac(a[o],n);return a.join(`
`)}function nc(e,t,r,i){i=i||{};var n=de({},i);n.font=t,r=Ne(r,"..."),n.maxIterations=Ne(i.maxIterations,2);var a=n.minChar=Ne(i.minChar,0);n.cnCharWidth=Nt("\u56FD",t);var o=n.ascCharWidth=Nt("a",t);n.placeholder=Ne(i.placeholder,"");for(var s=e=Math.max(0,e-1),l=0;l<a&&s>=o;l++)s-=o;var u=Nt(r,t);return u>s&&(r="",u=0),s=e-u,n.ellipsis=r,n.ellipsisWidth=u,n.contentWidth=s,n.containerWidth=e,n}function ac(e,t){var r=t.containerWidth,i=t.font,n=t.contentWidth;if(!r)return"";var a=Nt(e,i);if(a<=r)return e;for(var o=0;;o++){if(a<=n||o>=t.maxIterations){e+=t.ellipsis;break}var s=o===0?u0(e,n,t.ascCharWidth,t.cnCharWidth):a>0?Math.floor(e.length*n/a):0;e=e.substr(0,s),a=Nt(e,i)}return e===""&&(e=t.placeholder),e}function u0(e,t,r,i){for(var n=0,a=0,o=e.length;a<o&&n<t;a++){var s=e.charCodeAt(a);n+=0<=s&&s<=127?r:i}return a}function h0(e,t){e!=null&&(e+="");var r=t.overflow,i=t.padding,n=t.font,a=r==="truncate",o=Fl(n),s=Ne(t.lineHeight,o),l=t.lineOverflow==="truncate",u=t.width,h;u!=null&&r==="break"||r==="breakAll"?h=e?sc(e,t.font,u,r==="breakAll",0).lines:[]:h=e?e.split(`
`):[];var f=h.length*s,c=Ne(t.height,f);if(f>c&&l){var d=Math.floor(c/s);h=h.slice(0,d)}var v=c,p=u;if(i&&(v+=i[0]+i[2],p!=null&&(p+=i[1]+i[3])),e&&a&&p!=null)for(var _=nc(u,n,t.ellipsis,{minChar:t.truncateMinChar,placeholder:t.placeholder}),g=0;g<h.length;g++)h[g]=ac(h[g],_);if(u==null){for(var m=0,g=0;g<h.length;g++)m=Math.max(Nt(h[g],n),m);u=m}return{lines:h,height:c,outerHeight:v,lineHeight:s,calculatedLineHeight:o,contentHeight:f,width:u}}var f0=(function(){function e(){}return e})(),oc=(function(){function e(t){this.tokens=[],t&&(this.tokens=t)}return e})(),c0=(function(){function e(){this.width=0,this.height=0,this.contentWidth=0,this.contentHeight=0,this.outerWidth=0,this.outerHeight=0,this.lines=[]}return e})();function d0(e,t){var r=new c0;if(e!=null&&(e+=""),!e)return r;for(var i=t.width,n=t.height,a=t.overflow,o=(a==="break"||a==="breakAll")&&i!=null?{width:i,accumWidth:0,breakAll:a==="breakAll"}:null,s=Gl.lastIndex=0,l;(l=Gl.exec(e))!=null;){var u=l.index;u>s&&Ul(r,e.substring(s,u),t,o),Ul(r,l[2],t,o,l[1]),s=Gl.lastIndex}s<e.length&&Ul(r,e.substring(s,e.length),t,o);var h=[],f=0,c=0,d=t.padding,v=a==="truncate",p=t.lineOverflow==="truncate";function _(F,re,B){F.width=re,F.lineHeight=B,f+=B,c=Math.max(c,re)}e:for(var g=0;g<r.lines.length;g++){for(var m=r.lines[g],y=0,x=0,w=0;w<m.tokens.length;w++){var T=m.tokens[w],E=T.styleName&&t.rich[T.styleName]||{},b=T.textPadding=E.padding,D=b?b[1]+b[3]:0,L=T.font=E.font||t.font;T.contentHeight=Fl(L);var M=Ne(E.height,T.contentHeight);if(T.innerHeight=M,b&&(M+=b[0]+b[2]),T.height=M,T.lineHeight=yo(E.lineHeight,t.lineHeight,M),T.align=E&&E.align||t.align,T.verticalAlign=E&&E.verticalAlign||"middle",p&&n!=null&&f+T.lineHeight>n){w>0?(m.tokens=m.tokens.slice(0,w),_(m,x,y),r.lines=r.lines.slice(0,g+1)):r.lines=r.lines.slice(0,g);break e}var R=E.width,I=R==null||R==="auto";if(typeof R=="string"&&R.charAt(R.length-1)==="%")T.percentWidth=R,h.push(T),T.contentWidth=Nt(T.text,L);else{if(I){var P=E.backgroundColor,N=P&&P.image;N&&(N=$m(N),Jf(N)&&(T.width=Math.max(T.width,N.width*M/N.height)))}var G=v&&i!=null?i-x:null;G!=null&&G<T.width?!I||G<D?(T.text="",T.width=T.contentWidth=0):(T.text=l0(T.text,G-D,L,t.ellipsis,{minChar:t.truncateMinChar}),T.width=T.contentWidth=Nt(T.text,L)):T.contentWidth=Nt(T.text,L)}T.width+=D,x+=T.width,E&&(y=Math.max(y,T.lineHeight))}_(m,x,y)}r.outerWidth=r.width=Ne(i,c),r.outerHeight=r.height=Ne(n,f),r.contentHeight=f,r.contentWidth=c,d&&(r.outerWidth+=d[1]+d[3],r.outerHeight+=d[0]+d[2]);for(var g=0;g<h.length;g++){var T=h[g],H=T.percentWidth;T.width=parseInt(H,10)/100*r.width}return r}function Ul(e,t,r,i,n){var a=t==="",o=n&&r.rich[n]||{},s=e.lines,l=o.font||r.font,u=!1,h,f;if(i){var c=o.padding,d=c?c[1]+c[3]:0;if(o.width!=null&&o.width!=="auto"){var v=na(o.width,i.width)+d;s.length>0&&v+i.accumWidth>i.width&&(h=t.split(`
`),u=!0),i.accumWidth=v}else{var p=sc(t,l,i.width,i.breakAll,i.accumWidth);i.accumWidth=p.accumWidth+d,f=p.linesWidths,h=p.lines}}else h=t.split(`
`);for(var _=0;_<h.length;_++){var g=h[_],m=new f0;if(m.styleName=n,m.text=g,m.isLineHolder=!g&&!a,typeof o.width=="number"?m.width=o.width:m.width=f?f[_]:Nt(g,l),!_&&!u){var y=(s[s.length-1]||(s[0]=new oc)).tokens,x=y.length;x===1&&y[0].isLineHolder?y[0]=m:(g||!x||a)&&y.push(m)}else s.push(new oc([m]))}}function v0(e){var t=e.charCodeAt(0);return t>=33&&t<=255}var p0=Tl(",&?/;] ".split(""),function(e,t){return e[t]=!0,e},{});function _0(e){return v0(e)?!!p0[e]:!0}function sc(e,t,r,i,n){for(var a=[],o=[],s="",l="",u=0,h=0,f=0;f<e.length;f++){var c=e.charAt(f);if(c===`
`){l&&(s+=l,h+=u),a.push(s),o.push(h),s="",l="",u=0,h=0;continue}var d=Nt(c,t),v=i?!1:!_0(c);if(a.length?h+d>r:n+h+d>r){h?(s||l)&&(v?(s||(s=l,l="",u=0,h=u),a.push(s),o.push(h-u),l+=c,u+=d,s="",h=u):(l&&(s+=l,h+=u,l="",u=0),a.push(s),o.push(h),s=c,h=d)):v?(a.push(l),o.push(u),l=c,u=d):(a.push(c),o.push(d));continue}h+=d,v?(l+=c,u+=d):(l&&(s+=l,l="",u=0),s+=c)}return!a.length&&!s&&(s=e,l="",u=0),l&&(s+=l),s&&(a.push(s),o.push(h)),a.length===1&&(h+=n),{accumWidth:h,lines:a,linesWidths:o}}function an(e,t){return e==null&&(e=0),t==null&&(t=0),[e,t]}function iE(e,t){return e[0]=t[0],e[1]=t[1],e}function g0(e){return[e[0],e[1]]}function nE(e,t,r){return e[0]=t,e[1]=r,e}function lc(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e}function aE(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e}function m0(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e}function uc(e){return Math.sqrt(hc(e))}var oE=uc;function hc(e){return e[0]*e[0]+e[1]*e[1]}var sE=hc;function lE(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e}function uE(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e}function hE(e,t){return e[0]*t[0]+e[1]*t[1]}function zl(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e}function y0(e,t){var r=uc(t);return r===0?(e[0]=0,e[1]=0):(e[0]=t[0]/r,e[1]=t[1]/r),e}function Io(e,t){return Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1]))}var fE=Io;function x0(e,t){return(e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])}var on=x0;function cE(e,t){return e[0]=-t[0],e[1]=-t[1],e}function dE(e,t,r,i){return e[0]=t[0]+i*(r[0]-t[0]),e[1]=t[1]+i*(r[1]-t[1]),e}function Rr(e,t,r){var i=t[0],n=t[1];return e[0]=r[0]*i+r[2]*n+r[4],e[1]=r[1]*i+r[3]*n+r[5],e}function sn(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e}function ln(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e}var fc=$f,cc=5e-5;function aa(e){return e>cc||e<-cc}var hi=[],un=[],Hl=rn(),Vl=Math.abs,T0=(function(){function e(){}return e.prototype.setPosition=function(t){this.x=t[0],this.y=t[1]},e.prototype.setScale=function(t){this.scaleX=t[0],this.scaleY=t[1]},e.prototype.setSkew=function(t){this.skewX=t[0],this.skewY=t[1]},e.prototype.setOrigin=function(t){this.originX=t[0],this.originY=t[1]},e.prototype.needLocalTransform=function(){return aa(this.rotation)||aa(this.x)||aa(this.y)||aa(this.scaleX-1)||aa(this.scaleY-1)},e.prototype.updateTransform=function(){var t=this.parent,r=t&&t.transform,i=this.needLocalTransform(),n=this.transform;if(!(i||r)){n&&fc(n);return}n=n||rn(),i?this.getLocalTransform(n):fc(n),r&&(i?Lo(n,t.transform,n):Il(n,t.transform)),this.transform=n,this._resolveGlobalScaleRatio(n)},e.prototype._resolveGlobalScaleRatio=function(t){var r=this.globalScaleRatio;if(r!=null&&r!==1){this.getGlobalScale(hi);var i=hi[0]<0?-1:1,n=hi[1]<0?-1:1,a=((hi[0]-i)*r+i)/hi[0]||0,o=((hi[1]-n)*r+n)/hi[1]||0;t[0]*=a,t[1]*=a,t[2]*=o,t[3]*=o}this.invTransform=this.invTransform||rn(),Ol(this.invTransform,t)},e.prototype.getLocalTransform=function(t){return e.getLocalTransform(this,t)},e.prototype.getComputedTransform=function(){for(var t=this,r=[];t;)r.push(t),t=t.parent;for(;t=r.pop();)t.updateTransform();return this.transform},e.prototype.setLocalTransform=function(t){if(t){var r=t[0]*t[0]+t[1]*t[1],i=t[2]*t[2]+t[3]*t[3],n=Math.atan2(t[1],t[0]),a=Math.PI/2+n-Math.atan2(t[3],t[2]);i=Math.sqrt(i)*Math.cos(a),r=Math.sqrt(r),this.skewX=a,this.skewY=0,this.rotation=-n,this.x=+t[4],this.y=+t[5],this.scaleX=r,this.scaleY=i,this.originX=0,this.originY=0}},e.prototype.decomposeTransform=function(){if(this.transform){var t=this.parent,r=this.transform;t&&t.transform&&(Lo(un,t.invTransform,r),r=un);var i=this.originX,n=this.originY;(i||n)&&(Hl[4]=i,Hl[5]=n,Lo(un,r,Hl),un[4]-=i,un[5]-=n,r=un),this.setLocalTransform(r)}},e.prototype.getGlobalScale=function(t){var r=this.transform;return t=t||[],r?(t[0]=Math.sqrt(r[0]*r[0]+r[1]*r[1]),t[1]=Math.sqrt(r[2]*r[2]+r[3]*r[3]),r[0]<0&&(t[0]=-t[0]),r[3]<0&&(t[1]=-t[1]),t):(t[0]=1,t[1]=1,t)},e.prototype.transformCoordToLocal=function(t,r){var i=[t,r],n=this.invTransform;return n&&Rr(i,i,n),i},e.prototype.transformCoordToGlobal=function(t,r){var i=[t,r],n=this.transform;return n&&Rr(i,i,n),i},e.prototype.getLineScale=function(){var t=this.transform;return t&&Vl(t[0]-1)>1e-10&&Vl(t[3]-1)>1e-10?Math.sqrt(Vl(t[0]*t[3]-t[2]*t[1])):1},e.getLocalTransform=function(t,r){r=r||[];var i=t.originX||0,n=t.originY||0,a=t.scaleX,o=t.scaleY,s=t.rotation||0,l=t.x,u=t.y,h=t.skewX?Math.tan(t.skewX):0,f=t.skewY?Math.tan(-t.skewY):0;return i||n?(r[4]=-i*a-h*n*o,r[5]=-n*o-f*i*a):r[4]=r[5]=0,r[0]=a,r[3]=o,r[1]=f*a,r[2]=h*o,s&&t0(r,r,s),r[4]+=i+l,r[5]+=n+u,r},e.initDefaultProps=(function(){var t=e.prototype;t.x=0,t.y=0,t.scaleX=1,t.scaleY=1,t.originX=0,t.originY=0,t.skewX=0,t.skewY=0,t.rotation=0,t.globalScaleRatio=1})(),e})();let kl=T0;var w0=(function(){function e(t){t&&(this._$eventProcessor=t)}return e.prototype.on=function(t,r,i,n){this._$handlers||(this._$handlers={});var a=this._$handlers;if(typeof r=="function"&&(n=i,i=r,r=null),!i||!t)return this;var o=this._$eventProcessor;r!=null&&o&&o.normalizeQuery&&(r=o.normalizeQuery(r)),a[t]||(a[t]=[]);for(var s=0;s<a[t].length;s++)if(a[t][s].h===i)return this;var l={h:i,query:r,ctx:n||this,callAtLast:i.zrEventfulCallAtLast},u=a[t].length-1,h=a[t][u];return h&&h.callAtLast?a[t].splice(u,0,l):a[t].push(l),this},e.prototype.isSilent=function(t){var r=this._$handlers;return!r||!r[t]||!r[t].length},e.prototype.off=function(t,r){var i=this._$handlers;if(!i)return this;if(!t)return this._$handlers={},this;if(r){if(i[t]){for(var n=[],a=0,o=i[t].length;a<o;a++)i[t][a].h!==r&&n.push(i[t][a]);i[t]=n}i[t]&&i[t].length===0&&delete i[t]}else delete i[t];return this},e.prototype.trigger=function(t){for(var r=[],i=1;i<arguments.length;i++)r[i-1]=arguments[i];if(!this._$handlers)return this;var n=this._$handlers[t],a=this._$eventProcessor;if(n)for(var o=r.length,s=n.length,l=0;l<s;l++){var u=n[l];if(!(a&&a.filter&&u.query!=null&&!a.filter(t,u.query)))switch(o){case 0:u.h.call(u.ctx);break;case 1:u.h.call(u.ctx,r[0]);break;case 2:u.h.call(u.ctx,r[0],r[1]);break;default:u.h.apply(u.ctx,r);break}}return a&&a.afterTrigger&&a.afterTrigger(t),this},e.prototype.triggerWithContext=function(t){if(!this._$handlers)return this;var r=this._$handlers[t],i=this._$eventProcessor;if(r)for(var n=arguments,a=n.length,o=n[a-1],s=r.length,l=0;l<s;l++){var u=r[l];if(!(i&&i.filter&&u.query!=null&&!i.filter(t,u.query)))switch(a){case 0:u.h.call(o);break;case 1:u.h.call(o,n[0]);break;case 2:u.h.call(o,n[0],n[1]);break;default:u.h.apply(o,n.slice(1,a-1));break}}return i&&i.afterTrigger&&i.afterTrigger(t),this},e})();let S0=w0;var dc=1;typeof window<"u"&&(dc=Math.max(window.devicePixelRatio||window.screen&&window.screen.deviceXDPI/window.screen.logicalXDPI||1,1));var vE=0,vc=dc,b0=.4,Wl="#333",Xl="#ccc",E0="#eee",A0=(function(){function e(){this.firefox=!1,this.ie=!1,this.edge=!1,this.newEdge=!1,this.weChat=!1}return e})(),M0=(function(){function e(){this.browser=new A0,this.node=!1,this.wxa=!1,this.worker=!1,this.canvasSupported=!1,this.svgSupported=!1,this.touchEventsSupported=!1,this.pointerEventsSupported=!1,this.domSupported=!1,this.transformSupported=!1,this.transform3dSupported=!1}return e})(),sr=new M0;typeof wx=="object"&&typeof wx.getSystemInfoSync=="function"?(sr.wxa=!0,sr.canvasSupported=!0,sr.touchEventsSupported=!0):typeof document>"u"&&typeof self<"u"?(sr.worker=!0,sr.canvasSupported=!0):typeof navigator>"u"?(sr.node=!0,sr.canvasSupported=!0,sr.svgSupported=!0):D0(navigator.userAgent,sr);function D0(e,t){var r=t.browser,i=e.match(/Firefox\/([\d.]+)/),n=e.match(/MSIE\s([\d.]+)/)||e.match(/Trident\/.+?rv:(([\d.]+))/),a=e.match(/Edge?\/([\d.]+)/),o=/micromessenger/i.test(e);i&&(r.firefox=!0,r.version=i[1]),n&&(r.ie=!0,r.version=n[1]),a&&(r.edge=!0,r.version=a[1],r.newEdge=+a[1].split(".")[0]>18),o&&(r.weChat=!0),t.canvasSupported=!!document.createElement("canvas").getContext,t.svgSupported=typeof SVGRect<"u",t.touchEventsSupported="ontouchstart"in window&&!r.ie&&!r.edge,t.pointerEventsSupported="onpointerdown"in window&&(r.edge||r.ie&&+r.version>=11),t.domSupported=typeof document<"u";var s=document.documentElement.style;t.transform3dSupported=(r.ie&&"transition"in s||r.edge||"WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix||"MozPerspective"in s)&&!("OTransition"in s),t.transformSupported=t.transform3dSupported||r.ie&&+r.version>=9}let oa=sr;var Nr=1,sa=2,la=4,jl="__zr_normal__",ql=["x","y","scaleX","scaleY","originX","originY","rotation","ignore"],C0={x:!0,y:!0,scaleX:!0,scaleY:!0,originX:!0,originY:!0,rotation:!0,ignore:!1},hn={},L0=new nt(0,0,0,0),Zl=(function(){function e(t){this.id=dm(),this.animators=[],this.currentStates=[],this.states={},this._init(t)}return e.prototype._init=function(t){this.attr(t)},e.prototype.drift=function(t,r,i){switch(this.draggable){case"horizontal":r=0;break;case"vertical":t=0;break}var n=this.transform;n||(n=this.transform=[1,0,0,1,0,0]),n[4]+=t,n[5]+=r,this.decomposeTransform(),this.markRedraw()},e.prototype.beforeUpdate=function(){},e.prototype.afterUpdate=function(){},e.prototype.update=function(){this.updateTransform(),this.__dirty&&this.updateInnerText()},e.prototype.updateInnerText=function(t){var r=this._textContent;if(r&&(!r.ignore||t)){this.textConfig||(this.textConfig={});var i=this.textConfig,n=i.local,a=r.attachedTransform,o=void 0,s=void 0,l=!1;n?a.parent=this:a.parent=null;var u=!1;if(a.x=r.x,a.y=r.y,a.originX=r.originX,a.originY=r.originY,a.rotation=r.rotation,a.scaleX=r.scaleX,a.scaleY=r.scaleY,i.position!=null){var h=L0;i.layoutRect?h.copy(i.layoutRect):h.copy(this.getBoundingRect()),n||h.applyTransform(this.transform),this.calculateTextPosition?this.calculateTextPosition(hn,i,h):s0(hn,i,h),a.x=hn.x,a.y=hn.y,o=hn.align,s=hn.verticalAlign;var f=i.origin;if(f&&i.rotation!=null){var c=void 0,d=void 0;f==="center"?(c=h.width*.5,d=h.height*.5):(c=na(f[0],h.width),d=na(f[1],h.height)),u=!0,a.originX=-a.x+c+(n?0:h.x),a.originY=-a.y+d+(n?0:h.y)}}i.rotation!=null&&(a.rotation=i.rotation);var v=i.offset;v&&(a.x+=v[0],a.y+=v[1],u||(a.originX=-v[0],a.originY=-v[1]));var p=i.inside==null?typeof i.position=="string"&&i.position.indexOf("inside")>=0:i.inside,_=this._innerTextDefaultStyle||(this._innerTextDefaultStyle={}),g=void 0,m=void 0,y=void 0;p&&this.canBeInsideText()?(g=i.insideFill,m=i.insideStroke,(g==null||g==="auto")&&(g=this.getInsideTextFill()),(m==null||m==="auto")&&(m=this.getInsideTextStroke(g),y=!0)):(g=i.outsideFill,m=i.outsideStroke,(g==null||g==="auto")&&(g=this.getOutsideFill()),(m==null||m==="auto")&&(m=this.getOutsideStroke(g),y=!0)),g=g||"#000",(g!==_.fill||m!==_.stroke||y!==_.autoStroke||o!==_.align||s!==_.verticalAlign)&&(l=!0,_.fill=g,_.stroke=m,_.autoStroke=y,_.align=o,_.verticalAlign=s,r.setDefaultTextStyle(_)),r.__dirty|=Nr,l&&r.dirtyStyle(!0)}},e.prototype.canBeInsideText=function(){return!0},e.prototype.getInsideTextFill=function(){return"#fff"},e.prototype.getInsideTextStroke=function(t){return"#000"},e.prototype.getOutsideFill=function(){return this.__zr&&this.__zr.isDarkMode()?Xl:Wl},e.prototype.getOutsideStroke=function(t){var r=this.__zr&&this.__zr.getBackgroundColor(),i=typeof r=="string"&&nr(r);i||(i=[255,255,255,1]);for(var n=i[3],a=this.__zr.isDarkMode(),o=0;o<3;o++)i[o]=i[o]*n+(a?0:255)*(1-n);return i[3]=1,kn(i,"rgba")},e.prototype.traverse=function(t,r){},e.prototype.attrKV=function(t,r){t==="textConfig"?this.setTextConfig(r):t==="textContent"?this.setTextContent(r):t==="clipPath"?this.setClipPath(r):t==="extra"?(this.extra=this.extra||{},de(this.extra,r)):this[t]=r},e.prototype.hide=function(){this.ignore=!0,this.markRedraw()},e.prototype.show=function(){this.ignore=!1,this.markRedraw()},e.prototype.attr=function(t,r){if(typeof t=="string")this.attrKV(t,r);else if(st(t))for(var i=t,n=ht(i),a=0;a<n.length;a++){var o=n[a];this.attrKV(o,t[o])}return this.markRedraw(),this},e.prototype.saveCurrentToNormalState=function(t){this._innerSaveToNormal(t);for(var r=this._normalState,i=0;i<this.animators.length;i++){var n=this.animators[i],a=n.__fromStateTransition;if(!(a&&a!==jl)){var o=n.targetName,s=o?r[o]:r;n.saveFinalToTarget(s)}}},e.prototype._innerSaveToNormal=function(t){var r=this._normalState;r||(r=this._normalState={}),t.textConfig&&!r.textConfig&&(r.textConfig=this.textConfig),this._savePrimaryToNormal(t,r,ql)},e.prototype._savePrimaryToNormal=function(t,r,i){for(var n=0;n<i.length;n++){var a=i[n];t[a]!=null&&!(a in r)&&(r[a]=this[a])}},e.prototype.hasState=function(){return this.currentStates.length>0},e.prototype.getState=function(t){return this.states[t]},e.prototype.ensureState=function(t){var r=this.states;return r[t]||(r[t]={}),r[t]},e.prototype.clearStates=function(t){this.useState(jl,!1,t)},e.prototype.useState=function(t,r,i,n){var a=t===jl,o=this.hasState();if(!(!o&&a)){var s=this.currentStates,l=this.stateTransition;if(!(zt(s,t)>=0&&(r||s.length===1))){var u;if(this.stateProxy&&!a&&(u=this.stateProxy(t)),u||(u=this.states&&this.states[t]),!u&&!a){xl("State "+t+" not exists.");return}a||this.saveCurrentToNormalState(u);var h=!!(u&&u.hoverLayer||n);h&&this._toggleHoverLayerFlag(!0),this._applyStateObj(t,u,this._normalState,r,!i&&!this.__inHover&&l&&l.duration>0,l);var f=this._textContent,c=this._textGuide;return f&&f.useState(t,r,i,h),c&&c.useState(t,r,i,h),a?(this.currentStates=[],this._normalState={}):r?this.currentStates.push(t):this.currentStates=[t],this._updateAnimationTargets(),this.markRedraw(),!h&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~Nr),u}}},e.prototype.useStates=function(t,r,i){if(!t.length)this.clearStates();else{var n=[],a=this.currentStates,o=t.length,s=o===a.length;if(s){for(var l=0;l<o;l++)if(t[l]!==a[l]){s=!1;break}}if(s)return;for(var l=0;l<o;l++){var u=t[l],h=void 0;this.stateProxy&&(h=this.stateProxy(u,t)),h||(h=this.states[u]),h&&n.push(h)}var f=n[o-1],c=!!(f&&f.hoverLayer||i);c&&this._toggleHoverLayerFlag(!0);var d=this._mergeStates(n),v=this.stateTransition;this.saveCurrentToNormalState(d),this._applyStateObj(t.join(","),d,this._normalState,!1,!r&&!this.__inHover&&v&&v.duration>0,v);var p=this._textContent,_=this._textGuide;p&&p.useStates(t,r,c),_&&_.useStates(t,r,c),this._updateAnimationTargets(),this.currentStates=t.slice(),this.markRedraw(),!c&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~Nr)}},e.prototype._updateAnimationTargets=function(){for(var t=0;t<this.animators.length;t++){var r=this.animators[t];r.targetName&&r.changeTarget(this[r.targetName])}},e.prototype.removeState=function(t){var r=zt(this.currentStates,t);if(r>=0){var i=this.currentStates.slice();i.splice(r,1),this.useStates(i)}},e.prototype.replaceState=function(t,r,i){var n=this.currentStates.slice(),a=zt(n,t),o=zt(n,r)>=0;a>=0?o?n.splice(a,1):n[a]=r:i&&!o&&n.push(r),this.useStates(n)},e.prototype.toggleState=function(t,r){r?this.useState(t,!0):this.removeState(t)},e.prototype._mergeStates=function(t){for(var r={},i,n=0;n<t.length;n++){var a=t[n];de(r,a),a.textConfig&&(i=i||{},de(i,a.textConfig))}return i&&(r.textConfig=i),r},e.prototype._applyStateObj=function(t,r,i,n,a,o){var s=!(r&&n);r&&r.textConfig?(this.textConfig=de({},n?this.textConfig:i.textConfig),de(this.textConfig,r.textConfig)):s&&i.textConfig&&(this.textConfig=i.textConfig);for(var l={},u=!1,h=0;h<ql.length;h++){var f=ql[h],c=a&&C0[f];r&&r[f]!=null?c?(u=!0,l[f]=r[f]):this[f]=r[f]:s&&i[f]!=null&&(c?(u=!0,l[f]=i[f]):this[f]=i[f])}if(!a)for(var h=0;h<this.animators.length;h++){var d=this.animators[h],v=d.targetName;d.__changeFinalValue(v?(r||i)[v]:r||i)}u&&this._transitionState(t,l,o)},e.prototype._attachComponent=function(t){if(t.__zr&&!t.__hostTarget)throw new Error("Text element has been added to zrender.");if(t===this)throw new Error("Recursive component attachment.");var r=this.__zr;r&&t.addSelfToZr(r),t.__zr=r,t.__hostTarget=this},e.prototype._detachComponent=function(t){t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__hostTarget=null},e.prototype.getClipPath=function(){return this._clipPath},e.prototype.setClipPath=function(t){this._clipPath&&this._clipPath!==t&&this.removeClipPath(),this._attachComponent(t),this._clipPath=t,this.markRedraw()},e.prototype.removeClipPath=function(){var t=this._clipPath;t&&(this._detachComponent(t),this._clipPath=null,this.markRedraw())},e.prototype.getTextContent=function(){return this._textContent},e.prototype.setTextContent=function(t){var r=this._textContent;if(r!==t){if(r&&r!==t&&this.removeTextContent(),t.__zr&&!t.__hostTarget)throw new Error("Text element has been added to zrender.");t.attachedTransform=new kl,this._attachComponent(t),this._textContent=t,this.markRedraw()}},e.prototype.setTextConfig=function(t){this.textConfig||(this.textConfig={}),de(this.textConfig,t),this.markRedraw()},e.prototype.removeTextConfig=function(){this.textConfig=null,this.markRedraw()},e.prototype.removeTextContent=function(){var t=this._textContent;t&&(t.attachedTransform=null,this._detachComponent(t),this._textContent=null,this._innerTextDefaultStyle=null,this.markRedraw())},e.prototype.getTextGuideLine=function(){return this._textGuide},e.prototype.setTextGuideLine=function(t){this._textGuide&&this._textGuide!==t&&this.removeTextGuideLine(),this._attachComponent(t),this._textGuide=t,this.markRedraw()},e.prototype.removeTextGuideLine=function(){var t=this._textGuide;t&&(this._detachComponent(t),this._textGuide=null,this.markRedraw())},e.prototype.markRedraw=function(){this.__dirty|=Nr;var t=this.__zr;t&&(this.__inHover?t.refreshHover():t.refresh()),this.__hostTarget&&this.__hostTarget.markRedraw()},e.prototype.dirty=function(){this.markRedraw()},e.prototype._toggleHoverLayerFlag=function(t){this.__inHover=t;var r=this._textContent,i=this._textGuide;r&&(r.__inHover=t),i&&(i.__inHover=t)},e.prototype.addSelfToZr=function(t){this.__zr=t;var r=this.animators;if(r)for(var i=0;i<r.length;i++)t.animation.addAnimator(r[i]);this._clipPath&&this._clipPath.addSelfToZr(t),this._textContent&&this._textContent.addSelfToZr(t),this._textGuide&&this._textGuide.addSelfToZr(t)},e.prototype.removeSelfFromZr=function(t){this.__zr=null;var r=this.animators;if(r)for(var i=0;i<r.length;i++)t.animation.removeAnimator(r[i]);this._clipPath&&this._clipPath.removeSelfFromZr(t),this._textContent&&this._textContent.removeSelfFromZr(t),this._textGuide&&this._textGuide.removeSelfFromZr(t)},e.prototype.animate=function(t,r){var i=t?this[t]:this;if(!i){xl('Property "'+t+'" is not existed in element '+this.id);return}var n=new Ml(i,r);return this.addAnimator(n,t),n},e.prototype.addAnimator=function(t,r){var i=this.__zr,n=this;t.during(function(){n.updateDuringAnimation(r)}).done(function(){var a=n.animators,o=zt(a,t);o>=0&&a.splice(o,1)}),this.animators.push(t),i&&i.animation.addAnimator(t),i&&i.wakeUp()},e.prototype.updateDuringAnimation=function(t){this.markRedraw()},e.prototype.stopAnimation=function(t,r){for(var i=this.animators,n=i.length,a=[],o=0;o<n;o++){var s=i[o];!t||t===s.scope?s.stop(r):a.push(s)}return this.animators=a,this},e.prototype.animateTo=function(t,r,i){Yl(this,t,r,i)},e.prototype.animateFrom=function(t,r,i){Yl(this,t,r,i,!0)},e.prototype._transitionState=function(t,r,i,n){for(var a=Yl(this,r,i,n),o=0;o<a.length;o++)a[o].__fromStateTransition=t},e.prototype.getBoundingRect=function(){return null},e.prototype.getPaintRect=function(){return null},e.initDefaultProps=(function(){var t=e.prototype;t.type="element",t.name="",t.ignore=!1,t.silent=!1,t.isGroup=!1,t.draggable=!1,t.dragging=!1,t.ignoreClip=!1,t.__inHover=!1,t.__dirty=Nr;var r={};function i(a,o,s){r[a+o+s]||(console.warn("DEPRECATED: '"+a+"' has been deprecated. use '"+o+"', '"+s+"' instead"),r[a+o+s]=!0)}function n(a,o,s,l){Object.defineProperty(t,a,{get:function(){if(i(a,s,l),!this[o]){var h=this[o]=[];u(this,h)}return this[o]},set:function(h){i(a,s,l),this[s]=h[0],this[l]=h[1],this[o]=h,u(this,h)}});function u(h,f){Object.defineProperty(f,0,{get:function(){return h[s]},set:function(c){h[s]=c}}),Object.defineProperty(f,1,{get:function(){return h[l]},set:function(c){h[l]=c}})}}Object.defineProperty&&(!oa.browser.ie||oa.browser.version>8)&&(n("position","_legacyPos","x","y"),n("scale","_legacyScale","scaleX","scaleY"),n("origin","_legacyOrigin","originX","originY"))})(),e})();Pr(Zl,S0),Pr(Zl,kl);function Yl(e,t,r,i,n){r=r||{};var a=[];pc(e,"",e,t,r,i,a,n);var o=a.length,s=!1,l=r.done,u=r.aborted,h=function(){s=!0,o--,o<=0&&(s?l&&l():u&&u())},f=function(){o--,o<=0&&(s?l&&l():u&&u())};o||l&&l(),a.length>0&&r.during&&a[0].during(function(v,p){r.during(p)});for(var c=0;c<a.length;c++){var d=a[c];h&&d.done(h),f&&d.aborted(f),d.start(r.easing,r.force)}return a}function Kl(e,t,r){for(var i=0;i<r;i++)e[i]=t[i]}function P0(e){return ar(e[0])}function R0(e,t,r){if(ar(t[r]))if(ar(e[r])||(e[r]=[]),ym(t[r])){var i=t[r].length;e[r].length!==i&&(e[r]=new t[r].constructor(i),Kl(e[r],t[r],i))}else{var n=t[r],a=e[r],o=n.length;if(P0(n))for(var s=n[0].length,l=0;l<o;l++)a[l]?Kl(a[l],n[l],s):a[l]=Array.prototype.slice.call(n[l]);else Kl(a,n,o);a.length=n.length}else e[r]=t[r]}function pc(e,t,r,i,n,a,o,s){for(var l=[],u=[],h=ht(i),f=n.duration,c=n.delay,d=n.additive,v=n.setToFinal,p=!st(a),_=0;_<h.length;_++){var g=h[_];if(r[g]!=null&&i[g]!=null&&(p||a[g]))if(st(i[g])&&!ar(i[g])){if(t){s||(r[g]=i[g],e.updateDuringAnimation(t));continue}pc(e,g,r[g],i[g],n,a&&a[g],o,s)}else l.push(g),u.push(g);else s||(r[g]=i[g],e.updateDuringAnimation(t),u.push(g))}var m=l.length;if(m>0||n.force&&!o.length){for(var y=e.animators,x=[],w=0;w<y.length;w++)y[w].targetName===t&&x.push(y[w]);if(!d&&x.length)for(var w=0;w<x.length;w++){var T=x[w].stopTracks(u);if(T){var E=zt(y,x[w]);y.splice(E,1)}}var b=void 0,D=void 0,L=void 0;if(s){D={},v&&(b={});for(var w=0;w<m;w++){var g=l[w];D[g]=r[g],v?b[g]=i[g]:r[g]=i[g]}}else if(v){L={};for(var w=0;w<m;w++){var g=l[w];L[g]=To(r[g]),R0(r,i,g)}}var M=new Ml(r,!1,d?x:null);M.targetName=t,n.scope&&(M.scope=n.scope),v&&b&&M.whenWithKeys(0,b,l),L&&M.whenWithKeys(0,L,l),M.whenWithKeys(f??500,s?D:i,l).delay(c||0),e.addAnimator(M,t),o.push(M)}}let _c=Zl;var Ql="__zr_style_"+Math.round(Math.random()*10),Oo={shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,shadowColor:"#000",opacity:1,blend:"source-over"},Bo={style:{shadowBlur:!0,shadowOffsetX:!0,shadowOffsetY:!0,shadowColor:!0,opacity:!0}};Oo[Ql]=!0;var gc=["z","z2","invisible"],N0=["invisible"],I0=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype._init=function(r){for(var i=ht(r),n=0;n<i.length;n++){var a=i[n];a==="style"?this.useStyle(r[a]):e.prototype.attrKV.call(this,a,r[a])}this.style||this.useStyle({})},t.prototype.beforeBrush=function(){},t.prototype.afterBrush=function(){},t.prototype.innerBeforeBrush=function(){},t.prototype.innerAfterBrush=function(){},t.prototype.shouldBePainted=function(r,i,n,a){var o=this.transform;if(this.ignore||this.invisible||this.style.opacity===0||this.culling&&O0(this,r,i)||o&&!o[0]&&!o[3])return!1;if(n&&this.__clipPaths){for(var s=0;s<this.__clipPaths.length;++s)if(this.__clipPaths[s].isZeroArea())return!1}if(a&&this.parent)for(var l=this.parent;l;){if(l.ignore)return!1;l=l.parent}return!0},t.prototype.contain=function(r,i){return this.rectContain(r,i)},t.prototype.traverse=function(r,i){r.call(i,this)},t.prototype.rectContain=function(r,i){var n=this.transformCoordToLocal(r,i),a=this.getBoundingRect();return a.contain(n[0],n[1])},t.prototype.getPaintRect=function(){var r=this._paintRect;if(!this._paintRect||this.__dirty){var i=this.transform,n=this.getBoundingRect(),a=this.style,o=a.shadowBlur||0,s=a.shadowOffsetX||0,l=a.shadowOffsetY||0;r=this._paintRect||(this._paintRect=new nt(0,0,0,0)),i?nt.applyTransform(r,n,i):r.copy(n),(o||s||l)&&(r.width+=o*2+Math.abs(s),r.height+=o*2+Math.abs(l),r.x=Math.min(r.x,r.x+s-o),r.y=Math.min(r.y,r.y+l-o));var u=this.dirtyRectTolerance;r.isZero()||(r.x=Math.floor(r.x-u),r.y=Math.floor(r.y-u),r.width=Math.ceil(r.width+1+u*2),r.height=Math.ceil(r.height+1+u*2))}return r},t.prototype.setPrevPaintRect=function(r){r?(this._prevPaintRect=this._prevPaintRect||new nt(0,0,0,0),this._prevPaintRect.copy(r)):this._prevPaintRect=null},t.prototype.getPrevPaintRect=function(){return this._prevPaintRect},t.prototype.animateStyle=function(r){return this.animate("style",r)},t.prototype.updateDuringAnimation=function(r){r==="style"?this.dirtyStyle():this.markRedraw()},t.prototype.attrKV=function(r,i){r!=="style"?e.prototype.attrKV.call(this,r,i):this.style?this.setStyle(i):this.useStyle(i)},t.prototype.setStyle=function(r,i){return typeof r=="string"?this.style[r]=i:de(this.style,r),this.dirtyStyle(),this},t.prototype.dirtyStyle=function(r){r||this.markRedraw(),this.__dirty|=sa,this._rect&&(this._rect=null)},t.prototype.dirty=function(){this.dirtyStyle()},t.prototype.styleChanged=function(){return!!(this.__dirty&sa)},t.prototype.styleUpdated=function(){this.__dirty&=~sa},t.prototype.createStyle=function(r){return Zn(Oo,r)},t.prototype.useStyle=function(r){r[Ql]||(r=this.createStyle(r)),this.__inHover?this.__hoverStyle=r:this.style=r,this.dirtyStyle()},t.prototype.isStyleObject=function(r){return r[Ql]},t.prototype._innerSaveToNormal=function(r){e.prototype._innerSaveToNormal.call(this,r);var i=this._normalState;r.style&&!i.style&&(i.style=this._mergeStyle(this.createStyle(),this.style)),this._savePrimaryToNormal(r,i,gc)},t.prototype._applyStateObj=function(r,i,n,a,o,s){e.prototype._applyStateObj.call(this,r,i,n,a,o,s);var l=!(i&&a),u;if(i&&i.style?o?a?u=i.style:(u=this._mergeStyle(this.createStyle(),n.style),this._mergeStyle(u,i.style)):(u=this._mergeStyle(this.createStyle(),a?this.style:n.style),this._mergeStyle(u,i.style)):l&&(u=n.style),u)if(o){var h=this.style;if(this.style=this.createStyle(l?{}:h),l)for(var f=ht(h),c=0;c<f.length;c++){var d=f[c];d in u&&(u[d]=u[d],this.style[d]=h[d])}for(var v=ht(u),c=0;c<v.length;c++){var d=v[c];this.style[d]=this.style[d]}this._transitionState(r,{style:u},s,this.getAnimationStyleProps())}else this.useStyle(u);for(var p=this.__inHover?N0:gc,c=0;c<p.length;c++){var d=p[c];i&&i[d]!=null?this[d]=i[d]:l&&n[d]!=null&&(this[d]=n[d])}},t.prototype._mergeStates=function(r){for(var i=e.prototype._mergeStates.call(this,r),n,a=0;a<r.length;a++){var o=r[a];o.style&&(n=n||{},this._mergeStyle(n,o.style))}return n&&(i.style=n),i},t.prototype._mergeStyle=function(r,i){return de(r,i),r},t.prototype.getAnimationStyleProps=function(){return Bo},t.initDefaultProps=(function(){var r=t.prototype;r.type="displayable",r.invisible=!1,r.z=0,r.z2=0,r.zlevel=0,r.culling=!1,r.cursor="pointer",r.rectHover=!1,r.incremental=!1,r._rect=null,r.dirtyRectTolerance=0,r.__dirty=Nr|sa})(),t})(_c),Jl=new nt(0,0,0,0),$l=new nt(0,0,0,0);function O0(e,t,r){return Jl.copy(e.getBoundingRect()),e.transform&&Jl.applyTransform(e.transform),$l.width=t,$l.height=r,!Jl.intersect($l)}let ua=I0;var Fo=Math.pow,Ir=Math.sqrt,Go=1e-8,mc=1e-4,yc=Ir(3),Uo=1/3,lr=an(),Ht=an(),fn=an();function Or(e){return e>-Go&&e<Go}function xc(e){return e>Go||e<-Go}function Ge(e,t,r,i,n){var a=1-n;return a*a*(a*e+3*n*t)+n*n*(n*i+3*a*r)}function Tc(e,t,r,i,n){var a=1-n;return 3*(((t-e)*a+2*(r-t)*n)*a+(i-r)*n*n)}function B0(e,t,r,i,n,a){var o=i+3*(t-r)-e,s=3*(r-t*2+e),l=3*(t-e),u=e-n,h=s*s-3*o*l,f=s*l-9*o*u,c=l*l-3*s*u,d=0;if(Or(h)&&Or(f))if(Or(s))a[0]=0;else{var v=-l/s;v>=0&&v<=1&&(a[d++]=v)}else{var p=f*f-4*h*c;if(Or(p)){var _=f/h,v=-s/o+_,g=-_/2;v>=0&&v<=1&&(a[d++]=v),g>=0&&g<=1&&(a[d++]=g)}else if(p>0){var m=Ir(p),y=h*s+1.5*o*(-f+m),x=h*s+1.5*o*(-f-m);y<0?y=-Fo(-y,Uo):y=Fo(y,Uo),x<0?x=-Fo(-x,Uo):x=Fo(x,Uo);var v=(-s-(y+x))/(3*o);v>=0&&v<=1&&(a[d++]=v)}else{var w=(2*h*s-3*o*f)/(2*Ir(h*h*h)),T=Math.acos(w)/3,E=Ir(h),b=Math.cos(T),v=(-s-2*E*b)/(3*o),g=(-s+E*(b+yc*Math.sin(T)))/(3*o),D=(-s+E*(b-yc*Math.sin(T)))/(3*o);v>=0&&v<=1&&(a[d++]=v),g>=0&&g<=1&&(a[d++]=g),D>=0&&D<=1&&(a[d++]=D)}}return d}function wc(e,t,r,i,n){var a=6*r-12*t+6*e,o=9*t+3*i-3*e-9*r,s=3*t-3*e,l=0;if(Or(o)){if(xc(a)){var u=-s/a;u>=0&&u<=1&&(n[l++]=u)}}else{var h=a*a-4*o*s;if(Or(h))n[0]=-a/(2*o);else if(h>0){var f=Ir(h),u=(-a+f)/(2*o),c=(-a-f)/(2*o);u>=0&&u<=1&&(n[l++]=u),c>=0&&c<=1&&(n[l++]=c)}}return l}function zo(e,t,r,i,n,a){var o=(t-e)*n+e,s=(r-t)*n+t,l=(i-r)*n+r,u=(s-o)*n+o,h=(l-s)*n+s,f=(h-u)*n+u;a[0]=e,a[1]=o,a[2]=u,a[3]=f,a[4]=f,a[5]=h,a[6]=l,a[7]=i}function F0(e,t,r,i,n,a,o,s,l,u,h){var f,c=.005,d=1/0,v,p,_,g;lr[0]=l,lr[1]=u;for(var m=0;m<1;m+=.05)Ht[0]=Ge(e,r,n,o,m),Ht[1]=Ge(t,i,a,s,m),_=on(lr,Ht),_<d&&(f=m,d=_);d=1/0;for(var y=0;y<32&&!(c<mc);y++)v=f-c,p=f+c,Ht[0]=Ge(e,r,n,o,v),Ht[1]=Ge(t,i,a,s,v),_=on(Ht,lr),v>=0&&_<d?(f=v,d=_):(fn[0]=Ge(e,r,n,o,p),fn[1]=Ge(t,i,a,s,p),g=on(fn,lr),p<=1&&g<d?(f=p,d=g):c*=.5);return h&&(h[0]=Ge(e,r,n,o,f),h[1]=Ge(t,i,a,s,f)),Ir(d)}function G0(e,t,r,i,n,a,o,s,l){for(var u=e,h=t,f=0,c=1/l,d=1;d<=l;d++){var v=d*c,p=Ge(e,r,n,o,v),_=Ge(t,i,a,s,v),g=p-u,m=_-h;f+=Math.sqrt(g*g+m*m),u=p,h=_}return f}function ft(e,t,r,i){var n=1-i;return n*(n*e+2*i*t)+i*i*r}function Sc(e,t,r,i){return 2*((1-i)*(t-e)+i*(r-t))}function U0(e,t,r,i,n){var a=e-2*t+r,o=2*(t-e),s=e-i,l=0;if(Or(a)){if(xc(o)){var u=-s/o;u>=0&&u<=1&&(n[l++]=u)}}else{var h=o*o-4*a*s;if(Or(h)){var u=-o/(2*a);u>=0&&u<=1&&(n[l++]=u)}else if(h>0){var f=Ir(h),u=(-o+f)/(2*a),c=(-o-f)/(2*a);u>=0&&u<=1&&(n[l++]=u),c>=0&&c<=1&&(n[l++]=c)}}return l}function bc(e,t,r){var i=e+r-2*t;return i===0?.5:(e-t)/i}function Ho(e,t,r,i,n){var a=(t-e)*i+e,o=(r-t)*i+t,s=(o-a)*i+a;n[0]=e,n[1]=a,n[2]=s,n[3]=s,n[4]=o,n[5]=r}function z0(e,t,r,i,n,a,o,s,l){var u,h=.005,f=1/0;lr[0]=o,lr[1]=s;for(var c=0;c<1;c+=.05){Ht[0]=ft(e,r,n,c),Ht[1]=ft(t,i,a,c);var d=on(lr,Ht);d<f&&(u=c,f=d)}f=1/0;for(var v=0;v<32&&!(h<mc);v++){var p=u-h,_=u+h;Ht[0]=ft(e,r,n,p),Ht[1]=ft(t,i,a,p);var d=on(Ht,lr);if(p>=0&&d<f)u=p,f=d;else{fn[0]=ft(e,r,n,_),fn[1]=ft(t,i,a,_);var g=on(fn,lr);_<=1&&g<f?(u=_,f=g):h*=.5}}return l&&(l[0]=ft(e,r,n,u),l[1]=ft(t,i,a,u)),Ir(f)}function H0(e,t,r,i,n,a,o){for(var s=e,l=t,u=0,h=1/o,f=1;f<=o;f++){var c=f*h,d=ft(e,r,n,c),v=ft(t,i,a,c),p=d-s,_=v-l;u+=Math.sqrt(p*p+_*_),s=d,l=v}return u}var St=Math.min,bt=Math.max,eu=Math.sin,tu=Math.cos,fi=Math.PI*2,Vo=an(),ko=an(),Wo=an();function pE(e,t,r){if(e.length!==0){for(var i=e[0],n=i[0],a=i[0],o=i[1],s=i[1],l=1;l<e.length;l++)i=e[l],n=St(n,i[0]),a=bt(a,i[0]),o=St(o,i[1]),s=bt(s,i[1]);t[0]=n,t[1]=o,r[0]=a,r[1]=s}}function Ec(e,t,r,i,n,a){n[0]=St(e,r),n[1]=St(t,i),a[0]=bt(e,r),a[1]=bt(t,i)}var Ac=[],Mc=[];function V0(e,t,r,i,n,a,o,s,l,u){var h=wc,f=Ge,c=h(e,r,n,o,Ac);l[0]=1/0,l[1]=1/0,u[0]=-1/0,u[1]=-1/0;for(var d=0;d<c;d++){var v=f(e,r,n,o,Ac[d]);l[0]=St(v,l[0]),u[0]=bt(v,u[0])}c=h(t,i,a,s,Mc);for(var d=0;d<c;d++){var p=f(t,i,a,s,Mc[d]);l[1]=St(p,l[1]),u[1]=bt(p,u[1])}l[0]=St(e,l[0]),u[0]=bt(e,u[0]),l[0]=St(o,l[0]),u[0]=bt(o,u[0]),l[1]=St(t,l[1]),u[1]=bt(t,u[1]),l[1]=St(s,l[1]),u[1]=bt(s,u[1])}function k0(e,t,r,i,n,a,o,s){var l=bc,u=ft,h=bt(St(l(e,r,n),1),0),f=bt(St(l(t,i,a),1),0),c=u(e,r,n,h),d=u(t,i,a,f);o[0]=St(e,n,c),o[1]=St(t,a,d),s[0]=bt(e,n,c),s[1]=bt(t,a,d)}function W0(e,t,r,i,n,a,o,s,l){var u=sn,h=ln,f=Math.abs(n-a);if(f%fi<1e-4&&f>1e-4){s[0]=e-r,s[1]=t-i,l[0]=e+r,l[1]=t+i;return}if(Vo[0]=tu(n)*r+e,Vo[1]=eu(n)*i+t,ko[0]=tu(a)*r+e,ko[1]=eu(a)*i+t,u(s,Vo,ko),h(l,Vo,ko),n=n%fi,n<0&&(n=n+fi),a=a%fi,a<0&&(a=a+fi),n>a&&!o?a+=fi:n<a&&o&&(n+=fi),o){var c=a;a=n,n=c}for(var d=0;d<a;d+=Math.PI/2)d>n&&(Wo[0]=tu(d)*r+e,Wo[1]=eu(d)*i+t,u(s,Wo,s),h(l,Wo,l))}var ye={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},ci=[],di=[],ur=[],Br=[],hr=[],fr=[],ha=Math.min,fa=Math.max,vi=Math.cos,pi=Math.sin,Xo=Math.sqrt,yr=Math.abs,ru=Math.PI,Fr=ru*2,iu=typeof Float32Array<"u",ca=[];function nu(e){var t=Math.round(e/ru*1e8)/1e8;return t%2*ru}function Dc(e,t){var r=nu(e[0]);r<0&&(r+=Fr);var i=r-e[0],n=e[1];n+=i,!t&&n-r>=Fr?n=r+Fr:t&&r-n>=Fr?n=r-Fr:!t&&r>n?n=r+(Fr-nu(r-n)):t&&r<n&&(n=r-(Fr-nu(n-r))),e[0]=r,e[1]=n}var X0=(function(){function e(t){this.dpr=1,this._xi=0,this._yi=0,this._x0=0,this._y0=0,this._len=0,t&&(this._saveData=!1),this._saveData&&(this.data=[])}return e.prototype.increaseVersion=function(){this._version++},e.prototype.getVersion=function(){return this._version},e.prototype.setScale=function(t,r,i){i=i||0,i>0&&(this._ux=yr(i/vc/t)||0,this._uy=yr(i/vc/r)||0)},e.prototype.setDPR=function(t){this.dpr=t},e.prototype.setContext=function(t){this._ctx=t},e.prototype.getContext=function(){return this._ctx},e.prototype.beginPath=function(){return this._ctx&&this._ctx.beginPath(),this.reset(),this},e.prototype.reset=function(){this._saveData&&(this._len=0),this._lineDash&&(this._lineDash=null,this._dashOffset=0),this._pathSegLen&&(this._pathSegLen=null,this._pathLen=0),this._version++},e.prototype.moveTo=function(t,r){return this._drawPendingPt(),this.addData(ye.M,t,r),this._ctx&&this._ctx.moveTo(t,r),this._x0=t,this._y0=r,this._xi=t,this._yi=r,this},e.prototype.lineTo=function(t,r){var i=yr(t-this._xi),n=yr(r-this._yi),a=i>this._ux||n>this._uy;if(this.addData(ye.L,t,r),this._ctx&&a&&(this._needsDash?this._dashedLineTo(t,r):this._ctx.lineTo(t,r)),a)this._xi=t,this._yi=r,this._pendingPtDist=0;else{var o=i*i+n*n;o>this._pendingPtDist&&(this._pendingPtX=t,this._pendingPtY=r,this._pendingPtDist=o)}return this},e.prototype.bezierCurveTo=function(t,r,i,n,a,o){return this.addData(ye.C,t,r,i,n,a,o),this._ctx&&(this._needsDash?this._dashedBezierTo(t,r,i,n,a,o):this._ctx.bezierCurveTo(t,r,i,n,a,o)),this._xi=a,this._yi=o,this},e.prototype.quadraticCurveTo=function(t,r,i,n){return this.addData(ye.Q,t,r,i,n),this._ctx&&(this._needsDash?this._dashedQuadraticTo(t,r,i,n):this._ctx.quadraticCurveTo(t,r,i,n)),this._xi=i,this._yi=n,this},e.prototype.arc=function(t,r,i,n,a,o){ca[0]=n,ca[1]=a,Dc(ca,o),n=ca[0],a=ca[1];var s=a-n;return this.addData(ye.A,t,r,i,i,n,s,0,o?0:1),this._ctx&&this._ctx.arc(t,r,i,n,a,o),this._xi=vi(a)*i+t,this._yi=pi(a)*i+r,this},e.prototype.arcTo=function(t,r,i,n,a){return this._ctx&&this._ctx.arcTo(t,r,i,n,a),this},e.prototype.rect=function(t,r,i,n){return this._ctx&&this._ctx.rect(t,r,i,n),this.addData(ye.R,t,r,i,n),this},e.prototype.closePath=function(){this._drawPendingPt(),this.addData(ye.Z);var t=this._ctx,r=this._x0,i=this._y0;return t&&(this._needsDash&&this._dashedLineTo(r,i),t.closePath()),this._xi=r,this._yi=i,this},e.prototype.fill=function(t){t&&t.fill(),this.toStatic()},e.prototype.stroke=function(t){t&&t.stroke(),this.toStatic()},e.prototype.setLineDash=function(t){if(t instanceof Array){this._lineDash=t,this._dashIdx=0;for(var r=0,i=0;i<t.length;i++)r+=t[i];this._dashSum=r,this._needsDash=!0}else this._lineDash=null,this._needsDash=!1;return this},e.prototype.setLineDashOffset=function(t){return this._dashOffset=t,this},e.prototype.len=function(){return this._len},e.prototype.setData=function(t){var r=t.length;!(this.data&&this.data.length===r)&&iu&&(this.data=new Float32Array(r));for(var i=0;i<r;i++)this.data[i]=t[i];this._len=r},e.prototype.appendPath=function(t){t instanceof Array||(t=[t]);for(var r=t.length,i=0,n=this._len,a=0;a<r;a++)i+=t[a].len();iu&&this.data instanceof Float32Array&&(this.data=new Float32Array(n+i));for(var a=0;a<r;a++)for(var o=t[a].data,s=0;s<o.length;s++)this.data[n++]=o[s];this._len=n},e.prototype.addData=function(t,r,i,n,a,o,s,l,u){if(this._saveData){var h=this.data;this._len+arguments.length>h.length&&(this._expandData(),h=this.data);for(var f=0;f<arguments.length;f++)h[this._len++]=arguments[f]}},e.prototype._drawPendingPt=function(){this._pendingPtDist>0&&(this._ctx&&this._ctx.lineTo(this._pendingPtX,this._pendingPtY),this._pendingPtDist=0)},e.prototype._expandData=function(){if(!(this.data instanceof Array)){for(var t=[],r=0;r<this._len;r++)t[r]=this.data[r];this.data=t}},e.prototype._dashedLineTo=function(t,r){var i=this._dashSum,n=this._lineDash,a=this._ctx,o=this._dashOffset,s=this._xi,l=this._yi,u=t-s,h=r-l,f=Xo(u*u+h*h),c=s,d=l,v=n.length,p,_;for(u/=f,h/=f,o<0&&(o=i+o),o%=i,c-=o*u,d-=o*h;u>0&&c<=t||u<0&&c>=t||u===0&&(h>0&&d<=r||h<0&&d>=r);)_=this._dashIdx,p=n[_],c+=u*p,d+=h*p,this._dashIdx=(_+1)%v,!(u>0&&c<s||u<0&&c>s||h>0&&d<l||h<0&&d>l)&&a[_%2?"moveTo":"lineTo"](u>=0?ha(c,t):fa(c,t),h>=0?ha(d,r):fa(d,r));u=c-t,h=d-r,this._dashOffset=-Xo(u*u+h*h)},e.prototype._dashedBezierTo=function(t,r,i,n,a,o){var s=this._ctx,l=this._dashSum,u=this._dashOffset,h=this._lineDash,f=this._xi,c=this._yi,d=0,v=this._dashIdx,p=h.length,_,g,m,y,x,w=0;for(u<0&&(u=l+u),u%=l,_=0;_<1;_+=.1)g=Ge(f,t,i,a,_+.1)-Ge(f,t,i,a,_),m=Ge(c,r,n,o,_+.1)-Ge(c,r,n,o,_),d+=Xo(g*g+m*m);for(;v<p&&(w+=h[v],!(w>u));v++);for(_=(w-u)/d;_<=1;)y=Ge(f,t,i,a,_),x=Ge(c,r,n,o,_),v%2?s.moveTo(y,x):s.lineTo(y,x),_+=h[v]/d,v=(v+1)%p;v%2!==0&&s.lineTo(a,o),g=a-y,m=o-x,this._dashOffset=-Xo(g*g+m*m)},e.prototype._dashedQuadraticTo=function(t,r,i,n){var a=i,o=n;i=(i+2*t)/3,n=(n+2*r)/3,t=(this._xi+2*t)/3,r=(this._yi+2*r)/3,this._dashedBezierTo(t,r,i,n,a,o)},e.prototype.toStatic=function(){if(this._saveData){this._drawPendingPt();var t=this.data;t instanceof Array&&(t.length=this._len,iu&&this._len>11&&(this.data=new Float32Array(t)))}},e.prototype.getBoundingRect=function(){ur[0]=ur[1]=hr[0]=hr[1]=Number.MAX_VALUE,Br[0]=Br[1]=fr[0]=fr[1]=-Number.MAX_VALUE;var t=this.data,r=0,i=0,n=0,a=0,o;for(o=0;o<this._len;){var s=t[o++],l=o===1;switch(l&&(r=t[o],i=t[o+1],n=r,a=i),s){case ye.M:r=n=t[o++],i=a=t[o++],hr[0]=n,hr[1]=a,fr[0]=n,fr[1]=a;break;case ye.L:Ec(r,i,t[o],t[o+1],hr,fr),r=t[o++],i=t[o++];break;case ye.C:V0(r,i,t[o++],t[o++],t[o++],t[o++],t[o],t[o+1],hr,fr),r=t[o++],i=t[o++];break;case ye.Q:k0(r,i,t[o++],t[o++],t[o],t[o+1],hr,fr),r=t[o++],i=t[o++];break;case ye.A:var u=t[o++],h=t[o++],f=t[o++],c=t[o++],d=t[o++],v=t[o++]+d;o+=1;var p=!t[o++];l&&(n=vi(d)*f+u,a=pi(d)*c+h),W0(u,h,f,c,d,v,p,hr,fr),r=vi(v)*f+u,i=pi(v)*c+h;break;case ye.R:n=r=t[o++],a=i=t[o++];var _=t[o++],g=t[o++];Ec(n,a,n+_,a+g,hr,fr);break;case ye.Z:r=n,i=a;break}sn(ur,ur,hr),ln(Br,Br,fr)}return o===0&&(ur[0]=ur[1]=Br[0]=Br[1]=0),new nt(ur[0],ur[1],Br[0]-ur[0],Br[1]-ur[1])},e.prototype._calculateLength=function(){var t=this.data,r=this._len,i=this._ux,n=this._uy,a=0,o=0,s=0,l=0;this._pathSegLen||(this._pathSegLen=[]);for(var u=this._pathSegLen,h=0,f=0,c=0;c<r;){var d=t[c++],v=c===1;v&&(a=t[c],o=t[c+1],s=a,l=o);var p=-1;switch(d){case ye.M:a=s=t[c++],o=l=t[c++];break;case ye.L:{var _=t[c++],g=t[c++],m=_-a,y=g-o;(yr(m)>i||yr(y)>n||c===r-1)&&(p=Math.sqrt(m*m+y*y),a=_,o=g);break}case ye.C:{var x=t[c++],w=t[c++],_=t[c++],g=t[c++],T=t[c++],E=t[c++];p=G0(a,o,x,w,_,g,T,E,10),a=T,o=E;break}case ye.Q:{var x=t[c++],w=t[c++],_=t[c++],g=t[c++];p=H0(a,o,x,w,_,g,10),a=_,o=g;break}case ye.A:var b=t[c++],D=t[c++],L=t[c++],M=t[c++],R=t[c++],I=t[c++],P=I+R;c+=1;var N=!t[c++];v&&(s=vi(R)*L+b,l=pi(R)*M+D),p=fa(L,M)*ha(Fr,Math.abs(I)),a=vi(P)*L+b,o=pi(P)*M+D;break;case ye.R:{s=a=t[c++],l=o=t[c++];var G=t[c++],H=t[c++];p=G*2+H*2;break}case ye.Z:{var m=s-a,y=l-o;p=Math.sqrt(m*m+y*y),a=s,o=l;break}}p>=0&&(u[f++]=p,h+=p)}return this._pathLen=h,h},e.prototype.rebuildPath=function(t,r){var i=this.data,n=this._ux,a=this._uy,o=this._len,s,l,u,h,f,c,d=r<1,v,p,_=0,g=0,m,y=0,x,w;if(!(d&&(this._pathSegLen||this._calculateLength(),v=this._pathSegLen,p=this._pathLen,m=r*p,!m)))e:for(var T=0;T<o;){var E=i[T++],b=T===1;switch(b&&(u=i[T],h=i[T+1],s=u,l=h),E){case ye.M:y>0&&(t.lineTo(x,w),y=0),s=u=i[T++],l=h=i[T++],t.moveTo(u,h);break;case ye.L:{f=i[T++],c=i[T++];var D=yr(f-u),L=yr(c-h);if(D>n||L>a){if(d){var M=v[g++];if(_+M>m){var R=(m-_)/M;t.lineTo(u*(1-R)+f*R,h*(1-R)+c*R);break e}_+=M}t.lineTo(f,c),u=f,h=c,y=0}else{var I=D*D+L*L;I>y&&(x=f,w=c,y=I)}break}case ye.C:{var P=i[T++],N=i[T++],G=i[T++],H=i[T++],F=i[T++],re=i[T++];if(d){var M=v[g++];if(_+M>m){var R=(m-_)/M;zo(u,P,G,F,R,ci),zo(h,N,H,re,R,di),t.bezierCurveTo(ci[1],di[1],ci[2],di[2],ci[3],di[3]);break e}_+=M}t.bezierCurveTo(P,N,G,H,F,re),u=F,h=re;break}case ye.Q:{var P=i[T++],N=i[T++],G=i[T++],H=i[T++];if(d){var M=v[g++];if(_+M>m){var R=(m-_)/M;Ho(u,P,G,R,ci),Ho(h,N,H,R,di),t.quadraticCurveTo(ci[1],di[1],ci[2],di[2]);break e}_+=M}t.quadraticCurveTo(P,N,G,H),u=G,h=H;break}case ye.A:var B=i[T++],j=i[T++],J=i[T++],le=i[T++],ve=i[T++],ne=i[T++],ze=i[T++],we=!i[T++],Le=J>le?J:le,ot=J>le?1:J/le,Ye=J>le?le/J:1,ke=yr(J-le)>.001,tr=ve+ne,Oe=!1;if(d){var M=v[g++];_+M>m&&(tr=ve+ne*(m-_)/M,Oe=!0),_+=M}if(ke&&t.ellipse?t.ellipse(B,j,J,le,ze,ve,tr,we):t.arc(B,j,Le,ve,tr,we),Oe)break e;b&&(s=vi(ve)*J+B,l=pi(ve)*le+j),u=vi(tr)*J+B,h=pi(tr)*le+j;break;case ye.R:s=u=i[T],l=h=i[T+1],f=i[T++],c=i[T++];var lt=i[T++],He=i[T++];if(d){var M=v[g++];if(_+M>m){var Dt=m-_;t.moveTo(f,c),t.lineTo(f+ha(Dt,lt),c),Dt-=lt,Dt>0&&t.lineTo(f+lt,c+ha(Dt,He)),Dt-=He,Dt>0&&t.lineTo(f+fa(lt-Dt,0),c+He),Dt-=lt,Dt>0&&t.lineTo(f,c+fa(He-Dt,0));break e}_+=M}t.rect(f,c,lt,He);break;case ye.Z:if(y>0&&(t.lineTo(x,w),y=0),d){var M=v[g++];if(_+M>m){var R=(m-_)/M;t.lineTo(u*(1-R)+s*R,h*(1-R)+l*R);break e}_+=M}t.closePath(),u=s,h=l}}},e.CMD=ye,e.initDefaultProps=(function(){var t=e.prototype;t._saveData=!0,t._needsDash=!1,t._dashOffset=0,t._dashIdx=0,t._dashSum=0,t._ux=0,t._uy=0,t._pendingPtDist=0,t._version=0})(),e})();let da=X0;function _i(e,t,r,i,n,a,o){if(n===0)return!1;var s=n,l=0,u=e;if(o>t+s&&o>i+s||o<t-s&&o<i-s||a>e+s&&a>r+s||a<e-s&&a<r-s)return!1;if(e!==r)l=(t-i)/(e-r),u=(e*i-r*t)/(e-r);else return Math.abs(a-e)<=s/2;var h=l*a-o+u,f=h*h/(l*l+1);return f<=s/2*s/2}function j0(e,t,r,i,n,a,o,s,l,u,h){if(l===0)return!1;var f=l;if(h>t+f&&h>i+f&&h>a+f&&h>s+f||h<t-f&&h<i-f&&h<a-f&&h<s-f||u>e+f&&u>r+f&&u>n+f&&u>o+f||u<e-f&&u<r-f&&u<n-f&&u<o-f)return!1;var c=F0(e,t,r,i,n,a,o,s,u,h,null);return c<=f/2}function q0(e,t,r,i,n,a,o,s,l){if(o===0)return!1;var u=o;if(l>t+u&&l>i+u&&l>a+u||l<t-u&&l<i-u&&l<a-u||s>e+u&&s>r+u&&s>n+u||s<e-u&&s<r-u&&s<n-u)return!1;var h=z0(e,t,r,i,n,a,s,l,null);return h<=u/2}var Cc=Math.PI*2;function jo(e){return e%=Cc,e<0&&(e+=Cc),e}var va=Math.PI*2;function Z0(e,t,r,i,n,a,o,s,l){if(o===0)return!1;var u=o;s-=e,l-=t;var h=Math.sqrt(s*s+l*l);if(h-u>r||h+u<r)return!1;if(Math.abs(i-n)%va<1e-4)return!0;if(a){var f=i;i=jo(n),n=jo(f)}else i=jo(i),n=jo(n);i>n&&(n+=va);var c=Math.atan2(l,s);return c<0&&(c+=va),c>=i&&c<=n||c+va>=i&&c+va<=n}function gi(e,t,r,i,n,a){if(a>t&&a>i||a<t&&a<i||i===t)return 0;var o=(a-t)/(i-t),s=i<t?1:-1;(o===1||o===0)&&(s=i<t?.5:-.5);var l=o*(r-e)+e;return l===n?1/0:l>n?s:0}var Gr=da.CMD,mi=Math.PI*2,Y0=1e-4;function K0(e,t){return Math.abs(e-t)<Y0}var yt=[-1,-1,-1],Vt=[-1,-1];function Q0(){var e=Vt[0];Vt[0]=Vt[1],Vt[1]=e}function J0(e,t,r,i,n,a,o,s,l,u){if(u>t&&u>i&&u>a&&u>s||u<t&&u<i&&u<a&&u<s)return 0;var h=B0(t,i,a,s,u,yt);if(h===0)return 0;for(var f=0,c=-1,d=void 0,v=void 0,p=0;p<h;p++){var _=yt[p],g=_===0||_===1?.5:1,m=Ge(e,r,n,o,_);m<l||(c<0&&(c=wc(t,i,a,s,Vt),Vt[1]<Vt[0]&&c>1&&Q0(),d=Ge(t,i,a,s,Vt[0]),c>1&&(v=Ge(t,i,a,s,Vt[1]))),c===2?_<Vt[0]?f+=d<t?g:-g:_<Vt[1]?f+=v<d?g:-g:f+=s<v?g:-g:_<Vt[0]?f+=d<t?g:-g:f+=s<d?g:-g)}return f}function $0(e,t,r,i,n,a,o,s){if(s>t&&s>i&&s>a||s<t&&s<i&&s<a)return 0;var l=U0(t,i,a,s,yt);if(l===0)return 0;var u=bc(t,i,a);if(u>=0&&u<=1){for(var h=0,f=ft(t,i,a,u),c=0;c<l;c++){var d=yt[c]===0||yt[c]===1?.5:1,v=ft(e,r,n,yt[c]);v<o||(yt[c]<u?h+=f<t?d:-d:h+=a<f?d:-d)}return h}else{var d=yt[0]===0||yt[0]===1?.5:1,v=ft(e,r,n,yt[0]);return v<o?0:a<t?d:-d}}function ey(e,t,r,i,n,a,o,s){if(s-=t,s>r||s<-r)return 0;var l=Math.sqrt(r*r-s*s);yt[0]=-l,yt[1]=l;var u=Math.abs(i-n);if(u<1e-4)return 0;if(u>=mi-1e-4){i=0,n=mi;var h=a?1:-1;return o>=yt[0]+e&&o<=yt[1]+e?h:0}if(i>n){var f=i;i=n,n=f}i<0&&(i+=mi,n+=mi);for(var c=0,d=0;d<2;d++){var v=yt[d];if(v+e>o){var p=Math.atan2(s,v),h=a?1:-1;p<0&&(p=mi+p),(p>=i&&p<=n||p+mi>=i&&p+mi<=n)&&(p>Math.PI/2&&p<Math.PI*1.5&&(h=-h),c+=h)}}return c}function Lc(e,t,r,i,n){for(var a=e.data,o=e.len(),s=0,l=0,u=0,h=0,f=0,c,d,v=0;v<o;){var p=a[v++],_=v===1;switch(p===Gr.M&&v>1&&(r||(s+=gi(l,u,h,f,i,n))),_&&(l=a[v],u=a[v+1],h=l,f=u),p){case Gr.M:h=a[v++],f=a[v++],l=h,u=f;break;case Gr.L:if(r){if(_i(l,u,a[v],a[v+1],t,i,n))return!0}else s+=gi(l,u,a[v],a[v+1],i,n)||0;l=a[v++],u=a[v++];break;case Gr.C:if(r){if(j0(l,u,a[v++],a[v++],a[v++],a[v++],a[v],a[v+1],t,i,n))return!0}else s+=J0(l,u,a[v++],a[v++],a[v++],a[v++],a[v],a[v+1],i,n)||0;l=a[v++],u=a[v++];break;case Gr.Q:if(r){if(q0(l,u,a[v++],a[v++],a[v],a[v+1],t,i,n))return!0}else s+=$0(l,u,a[v++],a[v++],a[v],a[v+1],i,n)||0;l=a[v++],u=a[v++];break;case Gr.A:var g=a[v++],m=a[v++],y=a[v++],x=a[v++],w=a[v++],T=a[v++];v+=1;var E=!!(1-a[v++]);c=Math.cos(w)*y+g,d=Math.sin(w)*x+m,_?(h=c,f=d):s+=gi(l,u,c,d,i,n);var b=(i-g)*x/y+g;if(r){if(Z0(g,m,x,w,w+T,E,t,b,n))return!0}else s+=ey(g,m,x,w,w+T,E,b,n);l=Math.cos(w+T)*y+g,u=Math.sin(w+T)*x+m;break;case Gr.R:h=l=a[v++],f=u=a[v++];var D=a[v++],L=a[v++];if(c=h+D,d=f+L,r){if(_i(h,f,c,f,t,i,n)||_i(c,f,c,d,t,i,n)||_i(c,d,h,d,t,i,n)||_i(h,d,h,f,t,i,n))return!0}else s+=gi(c,f,c,d,i,n),s+=gi(h,d,h,f,i,n);break;case Gr.Z:if(r){if(_i(l,u,h,f,t,i,n))return!0}else s+=gi(l,u,h,f,i,n);l=h,u=f;break}}return!r&&!K0(u,f)&&(s+=gi(l,u,h,f,i,n)||0),s!==0}function ty(e,t,r){return Lc(e,0,!1,t,r)}function ry(e,t,r,i){return Lc(e,t,!0,r,i)}var Pc=Jt({fill:"#000",stroke:null,strokePercent:1,fillOpacity:1,strokeOpacity:1,lineDashOffset:0,lineWidth:1,lineCap:"butt",miterLimit:10,strokeNoScale:!1,strokeFirst:!1},Oo),iy={style:Jt({fill:!0,stroke:!0,strokePercent:!0,fillOpacity:!0,strokeOpacity:!0,lineDashOffset:!0,lineWidth:!0,miterLimit:!0},Bo.style)},au=["x","y","rotation","scaleX","scaleY","originX","originY","invisible","culling","z","z2","zlevel","parent"],ny=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.update=function(){var r=this;e.prototype.update.call(this);var i=this.style;if(i.decal){var n=this._decalEl=this._decalEl||new t;n.buildPath===t.prototype.buildPath&&(n.buildPath=function(l){r.buildPath(l,r.shape)}),n.silent=!0;var a=n.style;for(var o in i)a[o]!==i[o]&&(a[o]=i[o]);a.fill=i.fill?i.decal:null,a.decal=null,a.shadowColor=null,i.strokeFirst&&(a.stroke=null);for(var s=0;s<au.length;++s)n[au[s]]=this[au[s]];n.__dirty|=Nr}else this._decalEl&&(this._decalEl=null)},t.prototype.getDecalElement=function(){return this._decalEl},t.prototype._init=function(r){var i=ht(r);this.shape=this.getDefaultShape();var n=this.getDefaultStyle();n&&this.useStyle(n);for(var a=0;a<i.length;a++){var o=i[a],s=r[o];o==="style"?this.style?de(this.style,s):this.useStyle(s):o==="shape"?de(this.shape,s):e.prototype.attrKV.call(this,o,s)}this.style||this.useStyle({})},t.prototype.getDefaultStyle=function(){return null},t.prototype.getDefaultShape=function(){return{}},t.prototype.canBeInsideText=function(){return this.hasFill()},t.prototype.getInsideTextFill=function(){var r=this.style.fill;if(r!=="none"){if(mr(r)){var i=Cf(r,0);return i>.5?Wl:i>.2?E0:Xl}else if(r)return Xl}return Wl},t.prototype.getInsideTextStroke=function(r){var i=this.style.fill;if(mr(i)){var n=this.__zr,a=!!(n&&n.isDarkMode()),o=Cf(r,0)<b0;if(a===o)return i}},t.prototype.buildPath=function(r,i,n){},t.prototype.pathUpdated=function(){this.__dirty&=~la},t.prototype.createPathProxy=function(){this.path=new da(!1)},t.prototype.hasStroke=function(){var r=this.style,i=r.stroke;return!(i==null||i==="none"||!(r.lineWidth>0))},t.prototype.hasFill=function(){var r=this.style,i=r.fill;return i!=null&&i!=="none"},t.prototype.getBoundingRect=function(){var r=this._rect,i=this.style,n=!r;if(n){var a=!1;this.path||(a=!0,this.createPathProxy());var o=this.path;(a||this.__dirty&la)&&(o.beginPath(),this.buildPath(o,this.shape,!1),this.pathUpdated()),r=o.getBoundingRect()}if(this._rect=r,this.hasStroke()&&this.path&&this.path.len()>0){var s=this._rectWithStroke||(this._rectWithStroke=r.clone());if(this.__dirty||n){s.copy(r);var l=i.strokeNoScale?this.getLineScale():1,u=i.lineWidth;if(!this.hasFill()){var h=this.strokeContainThreshold;u=Math.max(u,h??4)}l>1e-10&&(s.width+=u/l,s.height+=u/l,s.x-=u/l/2,s.y-=u/l/2)}return s}return r},t.prototype.contain=function(r,i){var n=this.transformCoordToLocal(r,i),a=this.getBoundingRect(),o=this.style;if(r=n[0],i=n[1],a.contain(r,i)){var s=this.path;if(this.hasStroke()){var l=o.lineWidth,u=o.strokeNoScale?this.getLineScale():1;if(u>1e-10&&(this.hasFill()||(l=Math.max(l,this.strokeContainThreshold)),ry(s,l/u,r,i)))return!0}if(this.hasFill())return ty(s,r,i)}return!1},t.prototype.dirtyShape=function(){this.__dirty|=la,this._rect&&(this._rect=null),this._decalEl&&this._decalEl.dirtyShape(),this.markRedraw()},t.prototype.dirty=function(){this.dirtyStyle(),this.dirtyShape()},t.prototype.animateShape=function(r){return this.animate("shape",r)},t.prototype.updateDuringAnimation=function(r){r==="style"?this.dirtyStyle():r==="shape"?this.dirtyShape():this.markRedraw()},t.prototype.attrKV=function(r,i){r==="shape"?this.setShape(i):e.prototype.attrKV.call(this,r,i)},t.prototype.setShape=function(r,i){var n=this.shape;return n||(n=this.shape={}),typeof r=="string"?n[r]=i:de(n,r),this.dirtyShape(),this},t.prototype.shapeChanged=function(){return!!(this.__dirty&la)},t.prototype.createStyle=function(r){return Zn(Pc,r)},t.prototype._innerSaveToNormal=function(r){e.prototype._innerSaveToNormal.call(this,r);var i=this._normalState;r.shape&&!i.shape&&(i.shape=de({},this.shape))},t.prototype._applyStateObj=function(r,i,n,a,o,s){e.prototype._applyStateObj.call(this,r,i,n,a,o,s);var l=!(i&&a),u;if(i&&i.shape?o?a?u=i.shape:(u=de({},n.shape),de(u,i.shape)):(u=de({},a?this.shape:n.shape),de(u,i.shape)):l&&(u=n.shape),u)if(o){this.shape=de({},this.shape);for(var h={},f=ht(u),c=0;c<f.length;c++){var d=f[c];typeof u[d]=="object"?this.shape[d]=u[d]:h[d]=u[d]}this._transitionState(r,{shape:h},s)}else this.shape=u,this.dirtyShape()},t.prototype._mergeStates=function(r){for(var i=e.prototype._mergeStates.call(this,r),n,a=0;a<r.length;a++){var o=r[a];o.shape&&(n=n||{},this._mergeStyle(n,o.shape))}return n&&(i.shape=n),i},t.prototype.getAnimationStyleProps=function(){return iy},t.prototype.isZeroArea=function(){return!1},t.extend=function(r){var i=(function(a){Ie(o,a);function o(s){var l=a.call(this,s)||this;return r.init&&r.init.call(l,s),l}return o.prototype.getDefaultStyle=function(){return Rt(r.style)},o.prototype.getDefaultShape=function(){return Rt(r.shape)},o})(t);for(var n in r)typeof r[n]=="function"&&(i.prototype[n]=r[n]);return i},t.initDefaultProps=(function(){var r=t.prototype;r.type="path",r.strokeContainThreshold=5,r.segmentIgnoreThreshold=0,r.subPixelOptimize=!1,r.autoBatch=!1,r.__dirty=Nr|sa|la})(),t})(ua);let ct=ny;var ay=Jt({strokeFirst:!0,font:ra,x:0,y:0,textAlign:"left",textBaseline:"top",miterLimit:2},Pc),Rc=(function(e){Ie(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.hasStroke=function(){var r=this.style,i=r.stroke;return i!=null&&i!=="none"&&r.lineWidth>0},t.prototype.hasFill=function(){var r=this.style,i=r.fill;return i!=null&&i!=="none"},t.prototype.createStyle=function(r){return Zn(ay,r)},t.prototype.setBoundingRect=function(r){this._rect=r},t.prototype.getBoundingRect=function(){var r=this.style;if(!this._rect){var i=r.text;i!=null?i+="":i="";var n=o0(i,r.font,r.textAlign,r.textBaseline);if(n.x+=r.x||0,n.y+=r.y||0,this.hasStroke()){var a=r.lineWidth;n.x-=a/2,n.y-=a/2,n.width+=a,n.height+=a}this._rect=n}return this._rect},t.initDefaultProps=(function(){var r=t.prototype;r.dirtyRectTolerance=10})(),t})(ua);Rc.prototype.type="tspan";let Nc=Rc;var oy=Jt({x:0,y:0},Oo),sy={style:Jt({x:!0,y:!0,width:!0,height:!0,sx:!0,sy:!0,sWidth:!0,sHeight:!0},Bo.style)};function ly(e){return!!(e&&typeof e!="string"&&e.width&&e.height)}var Ic=(function(e){Ie(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.createStyle=function(r){return Zn(oy,r)},t.prototype._getSize=function(r){var i=this.style,n=i[r];if(n!=null)return n;var a=ly(i.image)?i.image:this.__image;if(!a)return 0;var o=r==="width"?"height":"width",s=i[o];return s==null?a[r]:a[r]/a[o]*s},t.prototype.getWidth=function(){return this._getSize("width")},t.prototype.getHeight=function(){return this._getSize("height")},t.prototype.getAnimationStyleProps=function(){return sy},t.prototype.getBoundingRect=function(){var r=this.style;return this._rect||(this._rect=new nt(r.x||0,r.y||0,this.getWidth(),this.getHeight())),this._rect},t})(ua);Ic.prototype.type="image";let ou=Ic;function uy(e,t){var r=t.x,i=t.y,n=t.width,a=t.height,o=t.r,s,l,u,h;n<0&&(r=r+n,n=-n),a<0&&(i=i+a,a=-a),typeof o=="number"?s=l=u=h=o:o instanceof Array?o.length===1?s=l=u=h=o[0]:o.length===2?(s=u=o[0],l=h=o[1]):o.length===3?(s=o[0],l=h=o[1],u=o[2]):(s=o[0],l=o[1],u=o[2],h=o[3]):s=l=u=h=0;var f;s+l>n&&(f=s+l,s*=n/f,l*=n/f),u+h>n&&(f=u+h,u*=n/f,h*=n/f),l+u>a&&(f=l+u,l*=a/f,u*=a/f),s+h>a&&(f=s+h,s*=a/f,h*=a/f),e.moveTo(r+s,i),e.lineTo(r+n-l,i),l!==0&&e.arc(r+n-l,i+l,l,-Math.PI/2,0),e.lineTo(r+n,i+a-u),u!==0&&e.arc(r+n-u,i+a-u,u,0,Math.PI/2),e.lineTo(r+h,i+a),h!==0&&e.arc(r+h,i+a-h,h,Math.PI/2,Math.PI),e.lineTo(r,i+s),s!==0&&e.arc(r+s,i+s,s,Math.PI,Math.PI*1.5)}var cn=Math.round;function Oc(e,t,r){if(t){var i=t.x1,n=t.x2,a=t.y1,o=t.y2;e.x1=i,e.x2=n,e.y1=a,e.y2=o;var s=r&&r.lineWidth;return s&&(cn(i*2)===cn(n*2)&&(e.x1=e.x2=yi(i,s,!0)),cn(a*2)===cn(o*2)&&(e.y1=e.y2=yi(a,s,!0))),e}}function Bc(e,t,r){if(t){var i=t.x,n=t.y,a=t.width,o=t.height;e.x=i,e.y=n,e.width=a,e.height=o;var s=r&&r.lineWidth;return s&&(e.x=yi(i,s,!0),e.y=yi(n,s,!0),e.width=Math.max(yi(i+a,s,!1)-e.x,a===0?0:1),e.height=Math.max(yi(n+o,s,!1)-e.y,o===0?0:1)),e}}function yi(e,t,r){if(!t)return e;var i=cn(e*2);return(i+cn(t))%2===0?i/2:(i+(r?1:-1))/2}var hy=(function(){function e(){this.x=0,this.y=0,this.width=0,this.height=0}return e})(),fy={},Fc=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new hy},t.prototype.buildPath=function(r,i){var n,a,o,s;if(this.subPixelOptimize){var l=Bc(fy,i,this.style);n=l.x,a=l.y,o=l.width,s=l.height,l.r=i.r,i=l}else n=i.x,a=i.y,o=i.width,s=i.height;i.r?uy(r,i):r.rect(n,a,o,s)},t.prototype.isZeroArea=function(){return!this.shape.width||!this.shape.height},t})(ct);Fc.prototype.type="rect";let Gc=Fc;var Uc={fill:"#000"},zc=2,cy={style:Jt({fill:!0,stroke:!0,fillOpacity:!0,strokeOpacity:!0,lineWidth:!0,fontSize:!0,lineHeight:!0,width:!0,height:!0,textShadowColor:!0,textShadowBlur:!0,textShadowOffsetX:!0,textShadowOffsetY:!0,backgroundColor:!0,padding:!0,borderColor:!0,borderWidth:!0,borderRadius:!0},Bo.style)},Hc=(function(e){Ie(t,e);function t(r){var i=e.call(this)||this;return i.type="text",i._children=[],i._defaultStyle=Uc,i.attr(r),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.update=function(){this.styleChanged()&&this._updateSubTexts();for(var r=0;r<this._children.length;r++){var i=this._children[r];i.zlevel=this.zlevel,i.z=this.z,i.z2=this.z2,i.culling=this.culling,i.cursor=this.cursor,i.invisible=this.invisible}var n=this.attachedTransform;if(n){n.updateTransform();var a=n.transform;a?(this.transform=this.transform||[],Il(this.transform,a)):this.transform=null}else e.prototype.update.call(this)},t.prototype.getComputedTransform=function(){return this.__hostTarget&&(this.__hostTarget.getComputedTransform(),this.__hostTarget.updateInnerText(!0)),this.attachedTransform?this.attachedTransform.getComputedTransform():e.prototype.getComputedTransform.call(this)},t.prototype._updateSubTexts=function(){this._childCursor=0,py(this.style),this.style.rich?this._updateRichTexts():this._updatePlainTexts(),this._children.length=this._childCursor,this.styleUpdated()},t.prototype.addSelfToZr=function(r){e.prototype.addSelfToZr.call(this,r);for(var i=0;i<this._children.length;i++)this._children[i].__zr=r},t.prototype.removeSelfFromZr=function(r){e.prototype.removeSelfFromZr.call(this,r);for(var i=0;i<this._children.length;i++)this._children[i].__zr=null},t.prototype.getBoundingRect=function(){if(this.styleChanged()&&this._updateSubTexts(),!this._rect){for(var r=new nt(0,0,0,0),i=this._children,n=[],a=null,o=0;o<i.length;o++){var s=i[o],l=s.getBoundingRect(),u=s.getLocalTransform(n);u?(r.copy(l),r.applyTransform(u),a=a||r.clone(),a.union(r)):(a=a||l.clone(),a.union(l))}this._rect=a||r}return this._rect},t.prototype.setDefaultTextStyle=function(r){this._defaultStyle=r||Uc},t.prototype.setTextContent=function(r){throw new Error("Can't attach text on another text")},t.prototype._mergeStyle=function(r,i){if(!i)return r;var n=i.rich,a=r.rich||n&&{};return de(r,i),n&&a?(this._mergeRich(a,n),r.rich=a):a&&(r.rich=a),r},t.prototype._mergeRich=function(r,i){for(var n=ht(i),a=0;a<n.length;a++){var o=n[a];r[o]=r[o]||{},de(r[o],i[o])}},t.prototype.getAnimationStyleProps=function(){return cy},t.prototype._getOrCreateChild=function(r){var i=this._children[this._childCursor];return(!i||!(i instanceof r))&&(i=new r),this._children[this._childCursor++]=i,i.__zr=this.__zr,i.parent=this,i},t.prototype._updatePlainTexts=function(){var r=this.style,i=r.font||ra,n=r.padding,a=Wc(r),o=h0(a,r),s=lu(r),l=!!r.backgroundColor,u=o.outerHeight,h=o.lines,f=o.lineHeight,c=this._defaultStyle,d=r.x||0,v=r.y||0,p=r.align||c.align||"left",_=r.verticalAlign||c.verticalAlign||"top",g=d,m=nn(v,o.contentHeight,_);if(s||n){var y=o.width;n&&(y+=n[1]+n[3]);var x=ia(d,y,p),w=nn(v,u,_);s&&this._renderBackground(r,r,x,w,y,u)}m+=f/2,n&&(g=kc(d,p,n),_==="top"?m+=n[0]:_==="bottom"&&(m-=n[2]));for(var T=0,E=!1,b=_y("fill"in r?r.fill:(E=!0,c.fill)),D=su("stroke"in r?r.stroke:!l&&(!c.autoStroke||E)?(T=zc,c.stroke):null),L=r.textShadowBlur>0,M=r.width!=null&&(r.overflow==="truncate"||r.overflow==="break"||r.overflow==="breakAll"),R=o.calculatedLineHeight,I=0;I<h.length;I++){var P=this._getOrCreateChild(Nc),N=P.createStyle();P.useStyle(N),N.text=h[I],N.x=g,N.y=m,p&&(N.textAlign=p),N.textBaseline="middle",N.opacity=r.opacity,N.strokeFirst=!0,L&&(N.shadowBlur=r.textShadowBlur||0,N.shadowColor=r.textShadowColor||"transparent",N.shadowOffsetX=r.textShadowOffsetX||0,N.shadowOffsetY=r.textShadowOffsetY||0),D&&(N.stroke=D,N.lineWidth=r.lineWidth||T,N.lineDash=r.lineDash,N.lineDashOffset=r.lineDashOffset||0),b&&(N.fill=b),N.font=i,m+=f,M&&P.setBoundingRect(new nt(ia(N.x,r.width,N.textAlign),nn(N.y,R,N.textBaseline),r.width,R))}},t.prototype._updateRichTexts=function(){var r=this.style,i=Wc(r),n=d0(i,r),a=n.width,o=n.outerWidth,s=n.outerHeight,l=r.padding,u=r.x||0,h=r.y||0,f=this._defaultStyle,c=r.align||f.align,d=r.verticalAlign||f.verticalAlign,v=ia(u,o,c),p=nn(h,s,d),_=v,g=p;l&&(_+=l[3],g+=l[0]);var m=_+a;lu(r)&&this._renderBackground(r,r,v,p,o,s);for(var y=!!r.backgroundColor,x=0;x<n.lines.length;x++){for(var w=n.lines[x],T=w.tokens,E=T.length,b=w.lineHeight,D=w.width,L=0,M=_,R=m,I=E-1,P=void 0;L<E&&(P=T[L],!P.align||P.align==="left");)this._placeToken(P,r,b,g,M,"left",y),D-=P.width,M+=P.width,L++;for(;I>=0&&(P=T[I],P.align==="right");)this._placeToken(P,r,b,g,R,"right",y),D-=P.width,R-=P.width,I--;for(M+=(a-(M-_)-(m-R)-D)/2;L<=I;)P=T[L],this._placeToken(P,r,b,g,M+P.width/2,"center",y),M+=P.width,L++;g+=b}},t.prototype._placeToken=function(r,i,n,a,o,s,l){var u=i.rich[r.styleName]||{};u.text=r.text;var h=r.verticalAlign,f=a+n/2;h==="top"?f=a+r.height/2:h==="bottom"&&(f=a+n-r.height/2);var c=!r.isLineHolder&&lu(u);c&&this._renderBackground(u,i,s==="right"?o-r.width:s==="center"?o-r.width/2:o,f-r.height/2,r.width,r.height);var d=!!u.backgroundColor,v=r.textPadding;v&&(o=kc(o,s,v),f-=r.height/2-v[0]-r.innerHeight/2);var p=this._getOrCreateChild(Nc),_=p.createStyle();p.useStyle(_);var g=this._defaultStyle,m=!1,y=0,x=su("fill"in u?u.fill:"fill"in i?i.fill:(m=!0,g.fill)),w=su("stroke"in u?u.stroke:"stroke"in i?i.stroke:!d&&!l&&(!g.autoStroke||m)?(y=zc,g.stroke):null),T=u.textShadowBlur>0||i.textShadowBlur>0;_.text=r.text,_.x=o,_.y=f,T&&(_.shadowBlur=u.textShadowBlur||i.textShadowBlur||0,_.shadowColor=u.textShadowColor||i.textShadowColor||"transparent",_.shadowOffsetX=u.textShadowOffsetX||i.textShadowOffsetX||0,_.shadowOffsetY=u.textShadowOffsetY||i.textShadowOffsetY||0),_.textAlign=s,_.textBaseline="middle",_.font=r.font||ra,_.opacity=yo(u.opacity,i.opacity,1),w&&(_.lineWidth=yo(u.lineWidth,i.lineWidth,y),_.lineDash=Ne(u.lineDash,i.lineDash),_.lineDashOffset=i.lineDashOffset||0,_.stroke=w),x&&(_.fill=x);var E=r.contentWidth,b=r.contentHeight;p.setBoundingRect(new nt(ia(_.x,E,_.textAlign),nn(_.y,b,_.textBaseline),E,b))},t.prototype._renderBackground=function(r,i,n,a,o,s){var l=r.backgroundColor,u=r.borderWidth,h=r.borderColor,f=l&&l.image,c=l&&!f,d=r.borderRadius,v=this,p,_;if(c||u&&h){p=this._getOrCreateChild(Gc),p.useStyle(p.createStyle()),p.style.fill=null;var g=p.shape;g.x=n,g.y=a,g.width=o,g.height=s,g.r=d,p.dirtyShape()}if(c){var m=p.style;m.fill=l||null,m.fillOpacity=Ne(r.fillOpacity,1)}else if(f){_=this._getOrCreateChild(ou),_.onload=function(){v.dirtyStyle()};var y=_.style;y.image=l.image,y.x=n,y.y=a,y.width=o,y.height=s}if(u&&h){var m=p.style;m.lineWidth=u,m.stroke=h,m.strokeOpacity=Ne(r.strokeOpacity,1),m.lineDash=r.borderDash,m.lineDashOffset=r.borderDashOffset||0,p.strokeContainThreshold=0,p.hasFill()&&p.hasStroke()&&(m.strokeFirst=!0,m.lineWidth*=2)}var x=(p||_).style;x.shadowBlur=r.shadowBlur||0,x.shadowColor=r.shadowColor||"transparent",x.shadowOffsetX=r.shadowOffsetX||0,x.shadowOffsetY=r.shadowOffsetY||0,x.opacity=yo(r.opacity,i.opacity,1)},t.makeFont=function(r){var i="";if(r.fontSize||r.fontFamily||r.fontWeight){var n="";typeof r.fontSize=="string"&&(r.fontSize.indexOf("px")!==-1||r.fontSize.indexOf("rem")!==-1||r.fontSize.indexOf("em")!==-1)?n=r.fontSize:isNaN(+r.fontSize)?n="12px":n=r.fontSize+"px",i=[r.fontStyle,r.fontWeight,n,r.fontFamily||"sans-serif"].join(" ")}return i&&bl(i)||r.textFont||r.font},t})(ua),dy={left:!0,right:1,center:1},vy={top:1,bottom:1,middle:1};function py(e){return Vc(e),xe(e.rich,Vc),e}function Vc(e){if(e){e.font=Hc.makeFont(e);var t=e.align;t==="middle"&&(t="center"),e.align=t==null||dy[t]?t:"left";var r=e.verticalAlign;r==="center"&&(r="middle"),e.verticalAlign=r==null||vy[r]?r:"top";var i=e.padding;i&&(e.padding=Of(e.padding))}}function su(e,t){return e==null||t<=0||e==="transparent"||e==="none"?null:e.image||e.colorStops?"#000":e}function _y(e){return e==null||e==="none"?null:e.image||e.colorStops?"#000":e}function kc(e,t,r){return t==="right"?e-r[1]:t==="center"?e+r[3]/2-r[1]/2:e+r[3]}function Wc(e){var t=e.text;return t!=null&&(t+=""),t}function lu(e){return!!(e.backgroundColor||e.borderWidth&&e.borderColor)}let qo=Hc;var Xc=1e-4,jc=20;function gy(e){return e.replace(/^\s+|\s+$/g,"")}function _E(e,t,r,i){var n=t[0],a=t[1],o=r[0],s=r[1],l=a-n,u=s-o;if(l===0)return u===0?o:(o+s)/2;if(i)if(l>0){if(e<=n)return o;if(e>=a)return s}else{if(e>=n)return o;if(e<=a)return s}else{if(e===n)return o;if(e===a)return s}return(e-n)/l*u+o}function cr(e,t){switch(e){case"center":case"middle":e="50%";break;case"left":case"top":e="0%";break;case"right":case"bottom":e="100%";break}return typeof e=="string"?gy(e).match(/%$/)?parseFloat(e)/100*t:parseFloat(e):e==null?NaN:+e}function uu(e,t,r){return t==null&&(t=10),t=Math.min(Math.max(0,t),jc),e=(+e).toFixed(t),r?e:+e}function gE(e){return e.sort(function(t,r){return t-r}),e}function dn(e){if(e=+e,isNaN(e))return 0;if(e>1e-14){for(var t=1,r=0;r<15;r++,t*=10)if(Math.round(e*t)/t===e)return r}return my(e)}function my(e){var t=e.toString().toLowerCase(),r=t.indexOf("e"),i=r>0?+t.slice(r+1):0,n=r>0?r:t.length,a=t.indexOf("."),o=a<0?0:n-1-a;return Math.max(0,o-i)}function mE(e,t){var r=Math.log,i=Math.LN10,n=Math.floor(r(e[1]-e[0])/i),a=Math.round(r(Math.abs(t[1]-t[0]))/i),o=Math.min(Math.max(-n+a,0),20);return isFinite(o)?o:20}function yE(e,t,r){if(!e[t])return 0;var i=Tl(e,function(v,p){return v+(isNaN(p)?0:p)},0);if(i===0)return 0;for(var n=Math.pow(10,r),a=or(e,function(v){return(isNaN(v)?0:v)/i*n*100}),o=n*100,s=or(a,function(v){return Math.floor(v)}),l=Tl(s,function(v,p){return v+p},0),u=or(a,function(v,p){return v-s[p]});l<o;){for(var h=Number.NEGATIVE_INFINITY,f=null,c=0,d=u.length;c<d;++c)u[c]>h&&(h=u[c],f=c);++s[f],u[f]=0,++l}return s[t]/n}function xE(e,t){var r=Math.max(dn(e),dn(t)),i=e+t;return r>jc?i:uu(i,r)}var TE=9007199254740991;function wE(e){var t=Math.PI*2;return(e%t+t)%t}function SE(e){return e>-Xc&&e<Xc}var yy=/^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;function pa(e){if(e instanceof Date)return e;if(typeof e=="string"){var t=yy.exec(e);if(!t)return new Date(NaN);if(t[8]){var r=+t[4]||0;return t[8].toUpperCase()!=="Z"&&(r-=+t[8].slice(0,3)),new Date(Date.UTC(+t[1],+(t[2]||1)-1,+t[3]||1,r,+(t[5]||0),+t[6]||0,+t[7]||0))}else return new Date(+t[1],+(t[2]||1)-1,+t[3]||1,+t[4]||0,+(t[5]||0),+t[6]||0,+t[7]||0)}else if(e==null)return new Date(NaN);return new Date(Math.round(e))}function bE(e){return Math.pow(10,qc(e))}function qc(e){if(e===0)return 0;var t=Math.floor(Math.log(e)/Math.LN10);return e/Math.pow(10,t)>=10&&t++,t}function EE(e,t){var r=qc(e),i=Math.pow(10,r),n=e/i,a;return t?n<1.5?a=1:n<2.5?a=2:n<4?a=3:n<7?a=5:a=10:n<1?a=1:n<2?a=2:n<3?a=3:n<5?a=5:a=10,e=a*i,r>=-20?+e.toFixed(r<0?-r:0):e}function AE(e,t){var r=(e.length-1)*t+1,i=Math.floor(r),n=+e[i-1],a=r-i;return a?n+a*(e[i]-n):n}function ME(e){e.sort(function(l,u){return s(l,u,0)?-1:1});for(var t=-1/0,r=1,i=0;i<e.length;){for(var n=e[i].interval,a=e[i].close,o=0;o<2;o++)n[o]<=t&&(n[o]=t,a[o]=o?1:1-r),t=n[o],r=a[o];n[0]===n[1]&&a[0]*a[1]!==1?e.splice(i,1):i++}return e;function s(l,u,h){return l.interval[h]<u.interval[h]||l.interval[h]===u.interval[h]&&(l.close[h]-u.close[h]===(h?-1:1)||!h&&s(l,u,1))}}function Zc(e){var t=parseFloat(e);return t==e&&(t!==0||typeof e!="string"||e.indexOf("x")<=0)?t:NaN}function Yc(e){return!isNaN(Zc(e))}function xy(){return Math.round(Math.random()*9)}function Kc(e,t){return t===0?e:Kc(t,e%t)}function DE(e,t){return e==null?t:t==null?e:e*t/Kc(e,t)}var Zo="[ECharts] ",Qc={},Yo=typeof console<"u"&&console.warn&&console.log;function CE(e){Yo&&console.log(Zo+e)}function Ty(e){Yo&&console.warn(Zo+e)}function hu(e){Yo&&console.error(Zo+e)}function Jc(e){Qc[e]||Yo&&(Qc[e]=!0,console.warn(Zo+"DEPRECATED: "+e))}function _a(e,t,r){Jc((r?"["+r+"]":"")+(e+" is deprecated, use "+t+" instead."))}function LE(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];typeof console<"u"&&console.log&&console.log.apply(console,e)}function PE(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r="",i=function(n){return n===void 0?"undefined":n===1/0?"Infinity":n===-1/0?"-Infinity":Tm(n)?"NaN":n instanceof Date?"Date("+n.toISOString()+")":wl(n)?"function () { ... }":xm(n)?n+"":null};return r=or(e,function(n){if(mr(n))return n;var a=i(n);if(a!=null)return a;if(typeof JSON<"u"&&JSON.stringify)try{return JSON.stringify(n,function(o,s){var l=i(s);return l??s})}catch{return"?"}else return"?"}).join(" "),r}function RE(e){throw new Error(e)}var $c="series\0",ed="\0_ec_\0";function wy(e){return e instanceof Array?e:e==null?[]:[e]}function NE(e,t,r){if(e){e[t]=e[t]||{},e.emphasis=e.emphasis||{},e.emphasis[t]=e.emphasis[t]||{};for(var i=0,n=r.length;i<n;i++){var a=r[i];!e.emphasis[t].hasOwnProperty(a)&&e[t].hasOwnProperty(a)&&(e.emphasis[t][a]=e[t][a])}}}var IE=["fontStyle","fontWeight","fontSize","fontFamily","rich","tag","color","textBorderColor","textBorderWidth","width","height","lineHeight","align","verticalAlign","baseline","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY","backgroundColor","borderColor","borderWidth","borderRadius","padding"];function OE(e){return st(e)&&!$t(e)&&!(e instanceof Date)?e.value:e}function BE(e){return st(e)&&!(e instanceof Array)}function FE(e,t,r){var i=r==="normalMerge",n=r==="replaceMerge",a=r==="replaceAll";e=e||[],t=(t||[]).slice();var o=qn();xe(t,function(l,u){if(!st(l)){t[u]=null;return}l.id!=null&&!id(l.id)&&rd(l.id),l.name!=null&&!id(l.name)&&rd(l.name)});var s=Sy(e,o,r);return(i||n)&&by(s,e,o,t),i&&Ey(s,t),i||n?Ay(s,t,n):a&&My(s,t),Dy(s),s}function Sy(e,t,r){var i=[];if(r==="replaceAll")return i;for(var n=0;n<e.length;n++){var a=e[n];a&&a.id!=null&&t.set(a.id,n),i.push({existing:r==="replaceMerge"||Qo(a)?null:a,newOption:null,keyInfo:null,brandNew:null})}return i}function by(e,t,r,i){xe(i,function(n,a){if(!(!n||n.id==null)){var o=ga(n.id),s=r.get(o);if(s!=null){var l=e[s];ai(!l.newOption,'Duplicated option on id "'+o+'".'),l.newOption=n,l.existing=t[s],i[a]=null}}})}function Ey(e,t){xe(t,function(r,i){if(!(!r||r.name==null))for(var n=0;n<e.length;n++){var a=e[n].existing;if(!e[n].newOption&&a&&(a.id==null||r.id==null)&&!Qo(r)&&!Qo(a)&&td("name",a,r)){e[n].newOption=r,t[i]=null;return}}})}function Ay(e,t,r){xe(t,function(i){if(i){for(var n,a=0;(n=e[a])&&(n.newOption||Qo(n.existing)||n.existing&&i.id!=null&&!td("id",i,n.existing));)a++;n?(n.newOption=i,n.brandNew=r):e.push({newOption:i,brandNew:r,existing:null,keyInfo:null}),a++}})}function My(e,t){xe(t,function(r){e.push({newOption:r,brandNew:!0,existing:null,keyInfo:null})})}function Dy(e){var t=qn();xe(e,function(r){var i=r.existing;i&&t.set(i.id,r)}),xe(e,function(r){var i=r.newOption;ai(!i||i.id==null||!t.get(i.id)||t.get(i.id)===r,"id duplicates: "+(i&&i.id)),i&&i.id!=null&&t.set(i.id,r),!r.keyInfo&&(r.keyInfo={})}),xe(e,function(r,i){var n=r.existing,a=r.newOption,o=r.keyInfo;if(st(a)){if(o.name=a.name!=null?ga(a.name):n?n.name:$c+i,n)o.id=ga(n.id);else if(a.id!=null)o.id=ga(a.id);else{var s=0;do o.id="\0"+o.name+"\0"+s++;while(t.get(o.id))}t.set(o.id,r)}})}function td(e,t,r){var i=Ko(t[e],null),n=Ko(r[e],null);return i!=null&&n!=null&&i===n}function ga(e){if(e==null)throw new Error;return Ko(e,"")}function Ko(e,t){if(e==null)return t;var r=typeof e;return r==="string"?e:r==="number"||mo(e)?e+"":t}function rd(e){Ty("`"+e+"` is invalid id or name. Must be a string or number.")}function id(e){return mo(e)||Yc(e)}function GE(e){var t=e.name;return!!(t&&t.indexOf($c))}function Qo(e){return e&&e.id!=null&&ga(e.id).indexOf(ed)===0}function UE(e){return ed+e}function zE(e,t,r){xe(e,function(i){var n=i.newOption;st(n)&&(i.keyInfo.mainType=t,i.keyInfo.subType=Cy(t,n,i.existing,r))})}function Cy(e,t,r,i){var n=t.type?t.type:r?r.subType:i.determineSubType(e,t);return n}function HE(e,t){var r={},i={};return n(e||[],r),n(t||[],i,r),[a(r),a(i)];function n(o,s,l){for(var u=0,h=o.length;u<h;u++){var f=Ko(o[u].seriesId,null);if(f==null)return;for(var c=wy(o[u].dataIndex),d=l&&l[f],v=0,p=c.length;v<p;v++){var _=c[v];d&&d[_]?d[_]=null:(s[f]||(s[f]={}))[_]=1}}}function a(o,s){var l=[];for(var u in o)if(o.hasOwnProperty(u)&&o[u]!=null)if(s)l.push(+u);else{var h=a(o[u],!0);h.length&&l.push({seriesId:u,dataIndex:h})}return l}}function nd(e,t){if(t.dataIndexInside!=null)return t.dataIndexInside;if(t.dataIndex!=null)return $t(t.dataIndex)?or(t.dataIndex,function(r){return e.indexOfRawIndex(r)}):e.indexOfRawIndex(t.dataIndex);if(t.name!=null)return $t(t.name)?or(t.name,function(r){return e.indexOfName(r)}):e.indexOfName(t.name)}function Jo(){var e="__ec_inner_"+Ly++;return function(t){return t[e]||(t[e]={})}}var Ly=xy();function VE(e,t,r){var i=Py(t,r),n=i.mainTypeSpecified,a=i.queryOptionMap,o=i.others,s=o,l=r?r.defaultMainType:null;return!n&&l&&a.set(l,{}),a.each(function(u,h){var f=Ny(e,h,u,{useDefault:l===h,enableAll:r&&r.enableAll!=null?r.enableAll:!0,enableNone:r&&r.enableNone!=null?r.enableNone:!0});s[h+"Models"]=f.models,s[h+"Model"]=f.models[0]}),s}function Py(e,t){var r;if(mr(e)){var i={};i[e+"Index"]=0,r=i}else r=e;var n=qn(),a={},o=!1;return xe(r,function(s,l){if(l==="dataIndex"||l==="dataIndexInside"){a[l]=s;return}var u=l.match(/^(\w+)(Index|Id|Name)$/)||[],h=u[1],f=(u[2]||"").toLowerCase();if(!(!h||!f||t&&t.includeMainTypes&&zt(t.includeMainTypes,h)<0)){o=o||!!h;var c=n.get(h)||n.set(h,{});c[f]=s}}),{mainTypeSpecified:o,queryOptionMap:n,others:a}}var Ry={useDefault:!0,enableAll:!1,enableNone:!1},kE={useDefault:!1,enableAll:!0,enableNone:!0};function Ny(e,t,r,i){i=i||Ry;var n=r.index,a=r.id,o=r.name,s={models:null,specified:n!=null||a!=null||o!=null};if(!s.specified){var l=void 0;return s.models=i.useDefault&&(l=e.getComponent(t))?[l]:[],s}return n==="none"||n===!1?(ai(i.enableNone,'`"none"` or `false` is not a valid value on index option.'),s.models=[],s):(n==="all"&&(ai(i.enableAll,'`"all"` is not a valid value on index option.'),n=a=o=null),s.models=e.queryComponents({mainType:t,index:n,id:a,name:o}),s)}function WE(e,t,r){e.setAttribute?e.setAttribute(t,r):e[t]=r}function XE(e,t){return e.getAttribute?e.getAttribute(t):e[t]}function jE(e){return e==="auto"?oa.domSupported?"html":"richText":e||"html"}function qE(e,t){var r=qn(),i=[];return xe(e,function(n){var a=t(n);(r.get(a)||(i.push(a),r.set(a,[]))).push(n)}),{keys:i,buckets:r}}function Iy(e,t,r,i,n){var a=t==null||t==="auto";if(i==null)return i;if(typeof i=="number"){var o=Yn(r||0,i,n);return uu(o,a?Math.max(dn(r||0),dn(i)):t)}else{if(typeof i=="string")return n<1?r:i;for(var s=[],l=r,u=i,h=Math.max(l?l.length:0,u.length),f=0;f<h;++f){var c=e.getDimensionInfo(f);if(c.type==="ordinal")s[f]=(n<1&&l?l:u)[f];else{var d=l&&l[f]?l[f]:0,v=u[f],o=Yn(d,v,n);s[f]=uu(o,a?Math.max(dn(d),dn(v)):t)}}return s}}var Ur=Jo(),ad=1,od={},sd=Jo(),fu=0,cu=1,du=2,zr=["emphasis","blur","select"],ld=["normal","emphasis","blur","select"],Oy=10,By=9,Fy="highlight",Gy="downplay",ud="select",Uy="unselect",hd="toggleSelect";function vn(e){return e!=null&&e!=="none"}var fd=new Bn(100);function cd(e){if(typeof e!="string")return e;var t=fd.get(e);return t||(t=om(e,-.1),fd.put(e,t)),t}function $o(e,t,r){e.onHoverStateChange&&(e.hoverState||0)!==r&&e.onHoverStateChange(t),e.hoverState=r}function dd(e){$o(e,"emphasis",du)}function vd(e){e.hoverState===du&&$o(e,"normal",fu)}function vu(e){$o(e,"blur",cu)}function pd(e){e.hoverState===cu&&$o(e,"normal",fu)}function zy(e){e.selected=!0}function Hy(e){e.selected=!1}function _d(e,t,r){t(e,r)}function xr(e,t,r){_d(e,t,r),e.isGroup&&e.traverse(function(i){_d(i,t,r)})}function ZE(e,t){switch(t){case"emphasis":e.hoverState=du;break;case"normal":e.hoverState=fu;break;case"blur":e.hoverState=cu;break;case"select":e.selected=!0}}function YE(e){e.isGroup?e.traverse(function(t){t.clearStates()}):e.clearStates()}function Vy(e,t,r,i){for(var n=e.style,a={},o=0;o<t.length;o++){var s=t[o],l=n[s];a[s]=l??(i&&i[s])}for(var o=0;o<e.animators.length;o++){var u=e.animators[o];u.__fromStateTransition&&u.__fromStateTransition.indexOf(r)<0&&u.targetName==="style"&&u.saveFinalToTarget(a,t)}return a}function ky(e,t,r,i){var n=r&&zt(r,"select")>=0,a=!1;if(e instanceof ct){var o=sd(e),s=n&&o.selectFill||o.normalFill,l=n&&o.selectStroke||o.normalStroke;if(vn(s)||vn(l)){i=i||{};var u=i.style||{};!vn(u.fill)&&vn(s)?(a=!0,i=de({},i),u=de({},u),u.fill=cd(s)):!vn(u.stroke)&&vn(l)&&(a||(i=de({},i),u=de({},u)),u.stroke=cd(l)),i.style=u}}if(i&&i.z2==null){a||(i=de({},i));var h=e.z2EmphasisLift;i.z2=e.z2+(h??Oy)}return i}function Wy(e,t,r){if(r&&r.z2==null){r=de({},r);var i=e.z2SelectLift;r.z2=e.z2+(i??By)}return r}function Xy(e,t,r){var i=zt(e.currentStates,t)>=0,n=e.style.opacity,a=i?null:Vy(e,["opacity"],t,{opacity:1});r=r||{};var o=r.style||{};return o.opacity==null&&(r=de({},r),o=de({opacity:i?n:a.opacity*.1},o),r.style=o),r}function pu(e,t){var r=this.states[e];if(this.style){if(e==="emphasis")return ky(this,e,t,r);if(e==="blur")return Xy(this,e,r);if(e==="select")return Wy(this,e,r)}return r}function jy(e){e.stateProxy=pu;var t=e.getTextContent(),r=e.getTextGuideLine();t&&(t.stateProxy=pu),r&&(r.stateProxy=pu)}function gd(e,t){!yd(e,t)&&!e.__highByOuter&&xr(e,dd)}function md(e,t){!yd(e,t)&&!e.__highByOuter&&xr(e,vd)}function KE(e,t){e.__highByOuter|=1<<(t||0),xr(e,dd)}function QE(e,t){!(e.__highByOuter&=~(1<<(t||0)))&&xr(e,vd)}function JE(e){xr(e,vu)}function qy(e){xr(e,pd)}function Zy(e){xr(e,zy)}function Yy(e){xr(e,Hy)}function yd(e,t){return e.__highDownSilentOnTouch&&t.zrByTouch}function Ky(e){var t=e.getModel();t.eachComponent(function(r,i){var n=r==="series"?e.getViewOfSeriesModel(i):e.getViewOfComponentModel(i);n.group.traverse(function(a){pd(a)})})}function _u(e,t,r,i){var n=i.getModel();r=r||"coordinateSystem";function a(u,h){for(var f=0;f<h.length;f++){var c=u.getItemGraphicEl(h[f]);c&&qy(c)}}if(e!=null&&!(!t||t==="none")){var o=n.getSeriesByIndex(e),s=o.coordinateSystem;s&&s.master&&(s=s.master);var l=[];n.eachSeries(function(u){var h=o===u,f=u.coordinateSystem;f&&f.master&&(f=f.master);var c=f&&s?f===s:h;if(!(r==="series"&&!h||r==="coordinateSystem"&&!c||t==="series"&&h)){var d=i.getViewOfSeriesModel(u);if(d.group.traverse(function(_){vu(_)}),ar(t))a(u.getData(),t);else if(st(t))for(var v=ht(t),p=0;p<v.length;p++)a(u.getData(v[p]),t[v[p]]);l.push(u)}}),n.eachComponent(function(u,h){if(u!=="series"){var f=i.getViewOfComponentModel(h);f&&f.blurSeries&&f.blurSeries(l,n)}})}}function xd(e,t,r){if(!(e==null||t==null)){var i=r.getModel().getComponent(e,t);if(i){var n=r.getViewOfComponentModel(i);!n||!n.focusBlurEnabled||n.group.traverse(function(a){vu(a)})}}}function $E(e,t,r){var i=e.seriesIndex,n=e.getData(t.dataType),a=nd(n,t);a=($t(a)?a[0]:a)||0;var o=n.getItemGraphicEl(a);if(!o)for(var s=n.count(),l=0;!o&&l<s;)o=n.getItemGraphicEl(l++);if(o){var u=Ur(o);_u(i,u.focus,u.blurScope,r)}else{var h=e.get(["emphasis","focus"]),f=e.get(["emphasis","blurScope"]);h!=null&&_u(i,h,f,r)}}function Td(e,t,r,i){var n={focusSelf:!1,dispatchers:null};if(e==null||e==="series"||t==null||r==null)return n;var a=i.getModel().getComponent(e,t);if(!a)return n;var o=i.getViewOfComponentModel(a);if(!o||!o.findHighDownDispatchers)return n;for(var s=o.findHighDownDispatchers(r),l,u=0;u<s.length;u++)if(gu(s[u])||hu("param should be highDownDispatcher"),Ur(s[u]).focus==="self"){l=!0;break}return{focusSelf:l,dispatchers:s}}function eA(e,t,r){gu(e)||hu("param should be highDownDispatcher");var i=Ur(e),n=Td(i.componentMainType,i.componentIndex,i.componentHighDownName,r),a=n.dispatchers,o=n.focusSelf;a?(o&&xd(i.componentMainType,i.componentIndex,r),xe(a,function(s){return gd(s,t)})):(_u(i.seriesIndex,i.focus,i.blurScope,r),i.focus==="self"&&xd(i.componentMainType,i.componentIndex,r),gd(e,t))}function tA(e,t,r){gu(e)||hu("param should be highDownDispatcher"),Ky(r);var i=Ur(e),n=Td(i.componentMainType,i.componentIndex,i.componentHighDownName,r).dispatchers;n?xe(n,function(a){return md(a,t)}):md(e,t)}function rA(e,t,r){if(e1(t)){var i=t.dataType,n=e.getData(i),a=nd(n,t);$t(a)||(a=[a]),e[t.type===hd?"toggleSelect":t.type===ud?"select":"unselect"](a,i)}}function iA(e){var t=e.getAllData();xe(t,function(r){var i=r.data,n=r.type;i.eachItemGraphicEl(function(a,o){e.isSelected(o,n)?Zy(a):Yy(a)})})}function nA(e){var t=[];return e.eachSeries(function(r){var i=r.getAllData();xe(i,function(n){var a=n.data,o=n.type,s=r.getSelectedDataIndices();if(s.length>0){var l={dataIndex:s,seriesIndex:r.seriesIndex};o!=null&&(l.dataType=o),t.push(l)}})}),t}function aA(e,t,r){$y(e,!0),xr(e,jy),Qy(e,t,r)}function Qy(e,t,r){var i=Ur(e);t!=null?(i.focus=t,i.blurScope=r):i.focus&&(i.focus=null)}var wd=["emphasis","blur","select"],Jy={itemStyle:"getItemStyle",lineStyle:"getLineStyle",areaStyle:"getAreaStyle"};function oA(e,t,r,i){r=r||"itemStyle";for(var n=0;n<wd.length;n++){var a=wd[n],o=t.getModel([a,r]),s=e.ensureState(a);s.style=i?i(o):o[Jy[r]]()}}function $y(e,t){var r=t===!1,i=e;e.highDownSilentOnTouch&&(i.__highDownSilentOnTouch=e.highDownSilentOnTouch),(!r||i.__highDownDispatcher)&&(i.__highByOuter=i.__highByOuter||0,i.__highDownDispatcher=!r)}function gu(e){return!!(e&&e.__highDownDispatcher)}function sA(e,t,r){var i=Ur(e);i.componentMainType=t.mainType,i.componentIndex=t.componentIndex,i.componentHighDownName=r}function lA(e){var t=od[e];return t==null&&ad<=32&&(t=od[e]=ad++),t}function e1(e){var t=e.type;return t===ud||t===Uy||t===hd}function uA(e){var t=e.type;return t===Fy||t===Gy}function hA(e){var t=sd(e);t.normalFill=e.style.fill,t.normalStroke=e.style.stroke;var r=e.states.select||{};t.selectFill=r.style&&r.style.fill||null,t.selectStroke=r.style&&r.style.stroke||null}var pn=da.CMD,t1=[[],[],[]],Sd=Math.sqrt,r1=Math.atan2;function i1(e,t){var r=e.data,i=e.len(),n,a,o,s,l,u,h=pn.M,f=pn.C,c=pn.L,d=pn.R,v=pn.A,p=pn.Q;for(o=0,s=0;o<i;){switch(n=r[o++],s=o,a=0,n){case h:a=1;break;case c:a=1;break;case f:a=3;break;case p:a=2;break;case v:var _=t[4],g=t[5],m=Sd(t[0]*t[0]+t[1]*t[1]),y=Sd(t[2]*t[2]+t[3]*t[3]),x=r1(-t[1]/y,t[0]/m);r[o]*=m,r[o++]+=_,r[o]*=y,r[o++]+=g,r[o++]*=m,r[o++]*=y,r[o++]+=x,r[o++]+=x,o+=2,s=o;break;case d:u[0]=r[o++],u[1]=r[o++],Rr(u,u,t),r[s++]=u[0],r[s++]=u[1],u[0]+=r[o++],u[1]+=r[o++],Rr(u,u,t),r[s++]=u[0],r[s++]=u[1]}for(l=0;l<a;l++){var w=t1[l];w[0]=r[o++],w[1]=r[o++],Rr(w,w,t),r[s++]=w[0],r[s++]=w[1]}}e.increaseVersion()}var mu=Math.sqrt,es=Math.sin,ts=Math.cos,ma=Math.PI;function bd(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1])}function yu(e,t){return(e[0]*t[0]+e[1]*t[1])/(bd(e)*bd(t))}function Ed(e,t){return(e[0]*t[1]<e[1]*t[0]?-1:1)*Math.acos(yu(e,t))}function Ad(e,t,r,i,n,a,o,s,l,u,h){var f=l*(ma/180),c=ts(f)*(e-r)/2+es(f)*(t-i)/2,d=-1*es(f)*(e-r)/2+ts(f)*(t-i)/2,v=c*c/(o*o)+d*d/(s*s);v>1&&(o*=mu(v),s*=mu(v));var p=(n===a?-1:1)*mu((o*o*(s*s)-o*o*(d*d)-s*s*(c*c))/(o*o*(d*d)+s*s*(c*c)))||0,_=p*o*d/s,g=p*-s*c/o,m=(e+r)/2+ts(f)*_-es(f)*g,y=(t+i)/2+es(f)*_+ts(f)*g,x=Ed([1,0],[(c-_)/o,(d-g)/s]),w=[(c-_)/o,(d-g)/s],T=[(-1*c-_)/o,(-1*d-g)/s],E=Ed(w,T);if(yu(w,T)<=-1&&(E=ma),yu(w,T)>=1&&(E=0),E<0){var b=Math.round(E/ma*1e6)/1e6;E=ma*2+b%2*ma}h.addData(u,m,y,o,s,x,E,f,a)}var n1=/([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig,a1=/-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;function o1(e){var t=new da;if(!e)return t;var r=0,i=0,n=r,a=i,o,s=da.CMD,l=e.match(n1);if(!l)return t;for(var u=0;u<l.length;u++){for(var h=l[u],f=h.charAt(0),c=void 0,d=h.match(a1)||[],v=d.length,p=0;p<v;p++)d[p]=parseFloat(d[p]);for(var _=0;_<v;){var g=void 0,m=void 0,y=void 0,x=void 0,w=void 0,T=void 0,E=void 0,b=r,D=i,L=void 0,M=void 0;switch(f){case"l":r+=d[_++],i+=d[_++],c=s.L,t.addData(c,r,i);break;case"L":r=d[_++],i=d[_++],c=s.L,t.addData(c,r,i);break;case"m":r+=d[_++],i+=d[_++],c=s.M,t.addData(c,r,i),n=r,a=i,f="l";break;case"M":r=d[_++],i=d[_++],c=s.M,t.addData(c,r,i),n=r,a=i,f="L";break;case"h":r+=d[_++],c=s.L,t.addData(c,r,i);break;case"H":r=d[_++],c=s.L,t.addData(c,r,i);break;case"v":i+=d[_++],c=s.L,t.addData(c,r,i);break;case"V":i=d[_++],c=s.L,t.addData(c,r,i);break;case"C":c=s.C,t.addData(c,d[_++],d[_++],d[_++],d[_++],d[_++],d[_++]),r=d[_-2],i=d[_-1];break;case"c":c=s.C,t.addData(c,d[_++]+r,d[_++]+i,d[_++]+r,d[_++]+i,d[_++]+r,d[_++]+i),r+=d[_-2],i+=d[_-1];break;case"S":g=r,m=i,L=t.len(),M=t.data,o===s.C&&(g+=r-M[L-4],m+=i-M[L-3]),c=s.C,b=d[_++],D=d[_++],r=d[_++],i=d[_++],t.addData(c,g,m,b,D,r,i);break;case"s":g=r,m=i,L=t.len(),M=t.data,o===s.C&&(g+=r-M[L-4],m+=i-M[L-3]),c=s.C,b=r+d[_++],D=i+d[_++],r+=d[_++],i+=d[_++],t.addData(c,g,m,b,D,r,i);break;case"Q":b=d[_++],D=d[_++],r=d[_++],i=d[_++],c=s.Q,t.addData(c,b,D,r,i);break;case"q":b=d[_++]+r,D=d[_++]+i,r+=d[_++],i+=d[_++],c=s.Q,t.addData(c,b,D,r,i);break;case"T":g=r,m=i,L=t.len(),M=t.data,o===s.Q&&(g+=r-M[L-4],m+=i-M[L-3]),r=d[_++],i=d[_++],c=s.Q,t.addData(c,g,m,r,i);break;case"t":g=r,m=i,L=t.len(),M=t.data,o===s.Q&&(g+=r-M[L-4],m+=i-M[L-3]),r+=d[_++],i+=d[_++],c=s.Q,t.addData(c,g,m,r,i);break;case"A":y=d[_++],x=d[_++],w=d[_++],T=d[_++],E=d[_++],b=r,D=i,r=d[_++],i=d[_++],c=s.A,Ad(b,D,r,i,T,E,y,x,w,c,t);break;case"a":y=d[_++],x=d[_++],w=d[_++],T=d[_++],E=d[_++],b=r,D=i,r+=d[_++],i+=d[_++],c=s.A,Ad(b,D,r,i,T,E,y,x,w,c,t);break}}(f==="z"||f==="Z")&&(c=s.Z,t.addData(c),r=n,i=a),o=c}return t.toStatic(),t}var Md=(function(e){Ie(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.applyTransform=function(r){},t})(ct);function Dd(e){return e.setData!=null}function Cd(e,t){var r=o1(e),i=de({},t);return i.buildPath=function(n){if(Dd(n)){n.setData(r.data);var a=n.getContext();a&&n.rebuildPath(a,1)}else{var a=n;r.rebuildPath(a,1)}},i.applyTransform=function(n){i1(r,n),this.dirtyShape()},i}function s1(e,t){return new Md(Cd(e,t))}function l1(e,t){var r=Cd(e,t),i=(function(n){Ie(a,n);function a(o){var s=n.call(this,o)||this;return s.applyTransform=r.applyTransform,s.buildPath=r.buildPath,s}return a})(Md);return i}function u1(e,t){for(var r=[],i=e.length,n=0;n<i;n++){var a=e[n];a.path||a.createPathProxy(),a.shapeChanged()&&a.buildPath(a.path,a.shape,!0),r.push(a.path)}var o=new ct(t);return o.createPathProxy(),o.buildPath=function(s){if(Dd(s)){s.appendPath(r);var l=s.getContext();l&&s.rebuildPath(l,1)}},o}var Ld=(function(e){Ie(t,e);function t(r){var i=e.call(this)||this;return i.isGroup=!0,i._children=[],i.attr(r),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.children=function(){return this._children.slice()},t.prototype.childAt=function(r){return this._children[r]},t.prototype.childOfName=function(r){for(var i=this._children,n=0;n<i.length;n++)if(i[n].name===r)return i[n]},t.prototype.childCount=function(){return this._children.length},t.prototype.add=function(r){if(r&&(r!==this&&r.parent!==this&&(this._children.push(r),this._doAdd(r)),r.__hostTarget))throw"This elemenet has been used as an attachment";return this},t.prototype.addBefore=function(r,i){if(r&&r!==this&&r.parent!==this&&i&&i.parent===this){var n=this._children,a=n.indexOf(i);a>=0&&(n.splice(a,0,r),this._doAdd(r))}return this},t.prototype.replaceAt=function(r,i){var n=this._children,a=n[i];if(r&&r!==this&&r.parent!==this&&r!==a){n[i]=r,a.parent=null;var o=this.__zr;o&&a.removeSelfFromZr(o),this._doAdd(r)}return this},t.prototype._doAdd=function(r){r.parent&&r.parent.remove(r),r.parent=this;var i=this.__zr;i&&i!==r.__zr&&r.addSelfToZr(i),i&&i.refresh()},t.prototype.remove=function(r){var i=this.__zr,n=this._children,a=zt(n,r);return a<0?this:(n.splice(a,1),r.parent=null,i&&r.removeSelfFromZr(i),i&&i.refresh(),this)},t.prototype.removeAll=function(){for(var r=this._children,i=this.__zr,n=0;n<r.length;n++){var a=r[n];i&&a.removeSelfFromZr(i),a.parent=null}return r.length=0,this},t.prototype.eachChild=function(r,i){for(var n=this._children,a=0;a<n.length;a++){var o=n[a];r.call(i,o,a)}return this},t.prototype.traverse=function(r,i){for(var n=0;n<this._children.length;n++){var a=this._children[n],o=r.call(i,a);a.isGroup&&!o&&a.traverse(r,i)}return this},t.prototype.addSelfToZr=function(r){e.prototype.addSelfToZr.call(this,r);for(var i=0;i<this._children.length;i++){var n=this._children[i];n.addSelfToZr(r)}},t.prototype.removeSelfFromZr=function(r){e.prototype.removeSelfFromZr.call(this,r);for(var i=0;i<this._children.length;i++){var n=this._children[i];n.removeSelfFromZr(r)}},t.prototype.getBoundingRect=function(r){for(var i=new nt(0,0,0,0),n=r||this._children,a=[],o=null,s=0;s<n.length;s++){var l=n[s];if(!(l.ignore||l.invisible)){var u=l.getBoundingRect(),h=l.getLocalTransform(a);h?(nt.applyTransform(i,u,h),o=o||i.clone(),o.union(i)):(o=o||u.clone(),o.union(u))}}return o||i},t})(_c);Ld.prototype.type="group";let fA=Ld;var h1=(function(){function e(){this.cx=0,this.cy=0,this.r=0}return e})(),Pd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new h1},t.prototype.buildPath=function(r,i,n){n&&r.moveTo(i.cx+i.r,i.cy),r.arc(i.cx,i.cy,i.r,0,Math.PI*2)},t})(ct);Pd.prototype.type="circle";let f1=Pd;var c1=(function(){function e(){this.cx=0,this.cy=0,this.rx=0,this.ry=0}return e})(),Rd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new c1},t.prototype.buildPath=function(r,i){var n=.5522848,a=i.cx,o=i.cy,s=i.rx,l=i.ry,u=s*n,h=l*n;r.moveTo(a-s,o),r.bezierCurveTo(a-s,o-h,a-u,o-l,a,o-l),r.bezierCurveTo(a+u,o-l,a+s,o-h,a+s,o),r.bezierCurveTo(a+s,o+h,a+u,o+l,a,o+l),r.bezierCurveTo(a-u,o+l,a-s,o+h,a-s,o),r.closePath()},t})(ct);Rd.prototype.type="ellipse";let d1=Rd;var Nd=Math.PI,v1=Nd*2,xi=Math.sin,_n=Math.cos,p1=Math.acos,dt=Math.atan2,Id=Math.abs,ya=Math.sqrt,xu=Math.max,rs=Math.min,er=1e-4;function _1(e,t,r,i,n,a,o,s){var l=r-e,u=i-t,h=o-n,f=s-a,c=f*l-h*u;if(!(c*c<er))return c=(h*(t-a)-f*(e-n))/c,[e+c*l,t+c*u]}function is(e,t,r,i,n,a,o){var s=e-r,l=t-i,u=(o?a:-a)/ya(s*s+l*l),h=u*l,f=-u*s,c=e+h,d=t+f,v=r+h,p=i+f,_=(c+v)/2,g=(d+p)/2,m=v-c,y=p-d,x=m*m+y*y,w=n-a,T=c*p-v*d,E=(y<0?-1:1)*ya(xu(0,w*w*x-T*T)),b=(T*y-m*E)/x,D=(-T*m-y*E)/x,L=(T*y+m*E)/x,M=(-T*m+y*E)/x,R=b-_,I=D-g,P=L-_,N=M-g;return R*R+I*I>P*P+N*N&&(b=L,D=M),{cx:b,cy:D,x01:-h,y01:-f,x11:b*(n/w-1),y11:D*(n/w-1)}}function g1(e,t){var r=xu(t.r,0),i=xu(t.r0||0,0),n=r>0,a=i>0;if(!(!n&&!a)){if(n||(r=i,i=0),i>r){var o=r;r=i,i=o}var s=!!t.clockwise,l=t.startAngle,u=t.endAngle,h;if(l===u)h=0;else{var f=[l,u];Dc(f,!s),h=Id(f[0]-f[1])}var c=t.cx,d=t.cy,v=t.cornerRadius||0,p=t.innerCornerRadius||0;if(!(r>er))e.moveTo(c,d);else if(h>v1-er)e.moveTo(c+r*_n(l),d+r*xi(l)),e.arc(c,d,r,l,u,!s),i>er&&(e.moveTo(c+i*_n(u),d+i*xi(u)),e.arc(c,d,i,u,l,s));else{var _=Id(r-i)/2,g=rs(_,v),m=rs(_,p),y=m,x=g,w=r*_n(l),T=r*xi(l),E=i*_n(u),b=i*xi(u),D=void 0,L=void 0,M=void 0,R=void 0;if((g>er||m>er)&&(D=r*_n(u),L=r*xi(u),M=i*_n(l),R=i*xi(l),h<Nd)){var I=_1(w,T,M,R,D,L,E,b);if(I){var P=w-I[0],N=T-I[1],G=D-I[0],H=L-I[1],F=1/xi(p1((P*G+N*H)/(ya(P*P+N*N)*ya(G*G+H*H)))/2),re=ya(I[0]*I[0]+I[1]*I[1]);y=rs(m,(i-re)/(F-1)),x=rs(g,(r-re)/(F+1))}}if(!(h>er))e.moveTo(c+w,d+T);else if(x>er){var B=is(M,R,w,T,r,x,s),j=is(D,L,E,b,r,x,s);e.moveTo(c+B.cx+B.x01,d+B.cy+B.y01),x<g?e.arc(c+B.cx,d+B.cy,x,dt(B.y01,B.x01),dt(j.y01,j.x01),!s):(e.arc(c+B.cx,d+B.cy,x,dt(B.y01,B.x01),dt(B.y11,B.x11),!s),e.arc(c,d,r,dt(B.cy+B.y11,B.cx+B.x11),dt(j.cy+j.y11,j.cx+j.x11),!s),e.arc(c+j.cx,d+j.cy,x,dt(j.y11,j.x11),dt(j.y01,j.x01),!s))}else e.moveTo(c+w,d+T),e.arc(c,d,r,l,u,!s);if(!(i>er)||!(h>er))e.lineTo(c+E,d+b);else if(y>er){var B=is(E,b,D,L,i,-y,s),j=is(w,T,M,R,i,-y,s);e.lineTo(c+B.cx+B.x01,d+B.cy+B.y01),y<m?e.arc(c+B.cx,d+B.cy,y,dt(B.y01,B.x01),dt(j.y01,j.x01),!s):(e.arc(c+B.cx,d+B.cy,y,dt(B.y01,B.x01),dt(B.y11,B.x11),!s),e.arc(c,d,i,dt(B.cy+B.y11,B.cx+B.x11),dt(j.cy+j.y11,j.cx+j.x11),s),e.arc(c+j.cx,d+j.cy,y,dt(j.y11,j.x11),dt(j.y01,j.x01),!s))}else e.lineTo(c+E,d+b),e.arc(c,d,i,u,l,s)}e.closePath()}}var m1=(function(){function e(){this.cx=0,this.cy=0,this.r0=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0,this.cornerRadius=0,this.innerCornerRadius=0}return e})(),Od=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new m1},t.prototype.buildPath=function(r,i){g1(r,i)},t.prototype.isZeroArea=function(){return this.shape.startAngle===this.shape.endAngle||this.shape.r===this.shape.r0},t})(ct);Od.prototype.type="sector";let y1=Od;var x1=(function(){function e(){this.cx=0,this.cy=0,this.r=0,this.r0=0}return e})(),Bd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new x1},t.prototype.buildPath=function(r,i){var n=i.cx,a=i.cy,o=Math.PI*2;r.moveTo(n+i.r,a),r.arc(n,a,i.r,0,o,!1),r.moveTo(n+i.r0,a),r.arc(n,a,i.r0,0,o,!0)},t})(ct);Bd.prototype.type="ring";let T1=Bd;function Fd(e,t,r,i,n,a,o){var s=(r-e)*.5,l=(i-t)*.5;return(2*(t-r)+s+l)*o+(-3*(t-r)-2*s-l)*a+s*n+t}function w1(e,t){for(var r=e.length,i=[],n=0,a=1;a<r;a++)n+=Io(e[a-1],e[a]);var o=n/2;o=o<r?r:o;for(var a=0;a<o;a++){var s=a/(o-1)*(t?r:r-1),l=Math.floor(s),u=s-l,h=void 0,f=e[l%r],c=void 0,d=void 0;t?(h=e[(l-1+r)%r],c=e[(l+1)%r],d=e[(l+2)%r]):(h=e[l===0?l:l-1],c=e[l>r-2?r-1:l+1],d=e[l>r-3?r-1:l+2]);var v=u*u,p=u*v;i.push([Fd(h[0],f[0],c[0],d[0],u,v,p),Fd(h[1],f[1],c[1],d[1],u,v,p)])}return i}function S1(e,t,r,i){var n=[],a=[],o=[],s=[],l,u,h,f;if(i){h=[1/0,1/0],f=[-1/0,-1/0];for(var c=0,d=e.length;c<d;c++)sn(h,h,e[c]),ln(f,f,e[c]);sn(h,h,i[0]),ln(f,f,i[1])}for(var c=0,d=e.length;c<d;c++){var v=e[c];if(r)l=e[c?c-1:d-1],u=e[(c+1)%d];else if(c===0||c===d-1){n.push(g0(e[c]));continue}else l=e[c-1],u=e[c+1];m0(a,u,l),zl(a,a,t);var p=Io(v,l),_=Io(v,u),g=p+_;g!==0&&(p/=g,_/=g),zl(o,a,-p),zl(s,a,_);var m=lc([],v,o),y=lc([],v,s);i&&(ln(m,m,h),sn(m,m,f),ln(y,y,h),sn(y,y,f)),n.push(m),n.push(y)}return r&&n.push(n.shift()),n}function Gd(e,t,r){var i=t.smooth,n=t.points;if(n&&n.length>=2){if(i&&i!=="spline"){var a=S1(n,i,r,t.smoothConstraint);e.moveTo(n[0][0],n[0][1]);for(var o=n.length,s=0;s<(r?o:o-1);s++){var l=a[s*2],u=a[s*2+1],h=n[(s+1)%o];e.bezierCurveTo(l[0],l[1],u[0],u[1],h[0],h[1])}}else{i==="spline"&&(n=w1(n,r)),e.moveTo(n[0][0],n[0][1]);for(var s=1,f=n.length;s<f;s++)e.lineTo(n[s][0],n[s][1])}r&&e.closePath()}}var b1=(function(){function e(){this.points=null,this.smooth=0,this.smoothConstraint=null}return e})(),Ud=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultShape=function(){return new b1},t.prototype.buildPath=function(r,i){Gd(r,i,!0)},t})(ct);Ud.prototype.type="polygon";let E1=Ud;var A1=(function(){function e(){this.points=null,this.percent=1,this.smooth=0,this.smoothConstraint=null}return e})(),zd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new A1},t.prototype.buildPath=function(r,i){Gd(r,i,!1)},t})(ct);zd.prototype.type="polyline";let M1=zd;var D1={},C1=(function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.percent=1}return e})(),Hd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new C1},t.prototype.buildPath=function(r,i){var n,a,o,s;if(this.subPixelOptimize){var l=Oc(D1,i,this.style);n=l.x1,a=l.y1,o=l.x2,s=l.y2}else n=i.x1,a=i.y1,o=i.x2,s=i.y2;var u=i.percent;u!==0&&(r.moveTo(n,a),u<1&&(o=n*(1-u)+o*u,s=a*(1-u)+s*u),r.lineTo(o,s))},t.prototype.pointAt=function(r){var i=this.shape;return[i.x1*(1-r)+i.x2*r,i.y1*(1-r)+i.y2*r]},t})(ct);Hd.prototype.type="line";let L1=Hd;var Et=[],P1=(function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.cpx1=0,this.cpy1=0,this.percent=1}return e})();function Vd(e,t,r){var i=e.cpx2,n=e.cpy2;return i===null||n===null?[(r?Tc:Ge)(e.x1,e.cpx1,e.cpx2,e.x2,t),(r?Tc:Ge)(e.y1,e.cpy1,e.cpy2,e.y2,t)]:[(r?Sc:ft)(e.x1,e.cpx1,e.x2,t),(r?Sc:ft)(e.y1,e.cpy1,e.y2,t)]}var kd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new P1},t.prototype.buildPath=function(r,i){var n=i.x1,a=i.y1,o=i.x2,s=i.y2,l=i.cpx1,u=i.cpy1,h=i.cpx2,f=i.cpy2,c=i.percent;c!==0&&(r.moveTo(n,a),h==null||f==null?(c<1&&(Ho(n,l,o,c,Et),l=Et[1],o=Et[2],Ho(a,u,s,c,Et),u=Et[1],s=Et[2]),r.quadraticCurveTo(l,u,o,s)):(c<1&&(zo(n,l,h,o,c,Et),l=Et[1],h=Et[2],o=Et[3],zo(a,u,f,s,c,Et),u=Et[1],f=Et[2],s=Et[3]),r.bezierCurveTo(l,u,h,f,o,s)))},t.prototype.pointAt=function(r){return Vd(this.shape,r,!1)},t.prototype.tangentAt=function(r){var i=Vd(this.shape,r,!0);return y0(i,i)},t})(ct);kd.prototype.type="bezier-curve";let R1=kd;var N1=(function(){function e(){this.cx=0,this.cy=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0}return e})(),Wd=(function(e){Ie(t,e);function t(r){return e.call(this,r)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new N1},t.prototype.buildPath=function(r,i){var n=i.cx,a=i.cy,o=Math.max(i.r,0),s=i.startAngle,l=i.endAngle,u=i.clockwise,h=Math.cos(s),f=Math.sin(s);r.moveTo(h*o+n,f*o+a),r.arc(n,a,o,s,l,!u)},t})(ct);Wd.prototype.type="arc";let I1=Wd;var O1=(function(e){Ie(t,e);function t(){var r=e!==null&&e.apply(this,arguments)||this;return r.type="compound",r}return t.prototype._updatePathDirty=function(){for(var r=this.shape.paths,i=this.shapeChanged(),n=0;n<r.length;n++)i=i||r[n].shapeChanged();i&&this.dirtyShape()},t.prototype.beforeBrush=function(){this._updatePathDirty();for(var r=this.shape.paths||[],i=this.getGlobalScale(),n=0;n<r.length;n++)r[n].path||r[n].createPathProxy(),r[n].path.setScale(i[0],i[1],r[n].segmentIgnoreThreshold)},t.prototype.buildPath=function(r,i){for(var n=i.paths||[],a=0;a<n.length;a++)n[a].buildPath(r,n[a].shape,!0)},t.prototype.afterBrush=function(){for(var r=this.shape.paths||[],i=0;i<r.length;i++)r[i].pathUpdated()},t.prototype.getBoundingRect=function(){return this._updatePathDirty.call(this),ct.prototype.getBoundingRect.call(this)},t})(ct);let cA=O1;var B1=(function(){function e(t){this.colorStops=t||[]}return e.prototype.addColorStop=function(t,r){this.colorStops.push({offset:t,color:r})},e})();let Xd=B1;var F1=(function(e){Ie(t,e);function t(r,i,n,a,o,s){var l=e.call(this,o)||this;return l.x=r??0,l.y=i??0,l.x2=n??1,l.y2=a??0,l.type="linear",l.global=s||!1,l}return t})(Xd);let dA=F1;var G1=(function(e){Ie(t,e);function t(r,i,n,a,o){var s=e.call(this,a)||this;return s.x=r??.5,s.y=i??.5,s.r=n??.5,s.type="radial",s.global=o||!1,s}return t})(Xd);let vA=G1;var Ti=[0,0],wi=[0,0],ns=new Ee,as=new Ee,U1=(function(){function e(t,r){this._corners=[],this._axes=[],this._origin=[0,0];for(var i=0;i<4;i++)this._corners[i]=new Ee;for(var i=0;i<2;i++)this._axes[i]=new Ee;t&&this.fromBoundingRect(t,r)}return e.prototype.fromBoundingRect=function(t,r){var i=this._corners,n=this._axes,a=t.x,o=t.y,s=a+t.width,l=o+t.height;if(i[0].set(a,o),i[1].set(s,o),i[2].set(s,l),i[3].set(a,l),r)for(var u=0;u<4;u++)i[u].transform(r);Ee.sub(n[0],i[1],i[0]),Ee.sub(n[1],i[3],i[0]),n[0].normalize(),n[1].normalize();for(var u=0;u<2;u++)this._origin[u]=n[u].dot(i[0])},e.prototype.intersect=function(t,r){var i=!0,n=!r;return ns.set(1/0,1/0),as.set(0,0),!this._intersectCheckOneSide(this,t,ns,as,n,1)&&(i=!1,n)||!this._intersectCheckOneSide(t,this,ns,as,n,-1)&&(i=!1,n)||n||Ee.copy(r,i?ns:as),i},e.prototype._intersectCheckOneSide=function(t,r,i,n,a,o){for(var s=!0,l=0;l<2;l++){var u=this._axes[l];if(this._getProjMinMaxOnAxis(l,t._corners,Ti),this._getProjMinMaxOnAxis(l,r._corners,wi),Ti[1]<wi[0]||Ti[0]>wi[1]){if(s=!1,a)return s;var h=Math.abs(wi[0]-Ti[1]),f=Math.abs(Ti[0]-wi[1]);Math.min(h,f)>n.len()&&(h<f?Ee.scale(n,u,-h*o):Ee.scale(n,u,f*o))}else if(i){var h=Math.abs(wi[0]-Ti[1]),f=Math.abs(Ti[0]-wi[1]);Math.min(h,f)<i.len()&&(h<f?Ee.scale(i,u,h*o):Ee.scale(i,u,-f*o))}}return s},e.prototype._getProjMinMaxOnAxis=function(t,r,i){for(var n=this._axes[t],a=this._origin,o=r[0].dot(n)+a[t],s=o,l=o,u=1;u<r.length;u++){var h=r[u].dot(n)+a[t];s=Math.min(h,s),l=Math.max(h,l)}i[0]=s,i[1]=l},e})();let pA=U1;var z1=[],H1=(function(e){Ie(t,e);function t(){var r=e!==null&&e.apply(this,arguments)||this;return r.notClear=!0,r.incremental=!0,r._displayables=[],r._temporaryDisplayables=[],r._cursor=0,r}return t.prototype.traverse=function(r,i){r.call(i,this)},t.prototype.useStyle=function(){this.style={}},t.prototype.getCursor=function(){return this._cursor},t.prototype.innerAfterBrush=function(){this._cursor=this._displayables.length},t.prototype.clearDisplaybles=function(){this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.markRedraw(),this.notClear=!1},t.prototype.clearTemporalDisplayables=function(){this._temporaryDisplayables=[]},t.prototype.addDisplayable=function(r,i){i?this._temporaryDisplayables.push(r):this._displayables.push(r),this.markRedraw()},t.prototype.addDisplayables=function(r,i){i=i||!1;for(var n=0;n<r.length;n++)this.addDisplayable(r[n],i)},t.prototype.getDisplayables=function(){return this._displayables},t.prototype.getTemporalDisplayables=function(){return this._temporaryDisplayables},t.prototype.eachPendingDisplayable=function(r){for(var i=this._cursor;i<this._displayables.length;i++)r&&r(this._displayables[i]);for(var i=0;i<this._temporaryDisplayables.length;i++)r&&r(this._temporaryDisplayables[i])},t.prototype.update=function(){this.updateTransform();for(var r=this._cursor;r<this._displayables.length;r++){var i=this._displayables[r];i.parent=this,i.update(),i.parent=null}for(var r=0;r<this._temporaryDisplayables.length;r++){var i=this._temporaryDisplayables[r];i.parent=this,i.update(),i.parent=null}},t.prototype.getBoundingRect=function(){if(!this._rect){for(var r=new nt(1/0,1/0,-1/0,-1/0),i=0;i<this._displayables.length;i++){var n=this._displayables[i],a=n.getBoundingRect().clone();n.needLocalTransform()&&a.applyTransform(n.getLocalTransform(z1)),r.union(a)}this._rect=r}return this._rect},t.prototype.contain=function(r,i){var n=this.transformCoordToLocal(r,i),a=this.getBoundingRect();if(a.contain(n[0],n[1]))for(var o=0;o<this._displayables.length;o++){var s=this._displayables[o];if(s.contain(r,i))return!0}return!1},t})(ua);let _A=H1;var os=Math.max,ss=Math.min,Tu={};function gA(e){return ct.extend(e)}var V1=l1;function mA(e,t){return V1(e,t)}function dr(e,t){Tu[e]=t}function yA(e){if(Tu.hasOwnProperty(e))return Tu[e]}function k1(e,t,r,i){var n=s1(e,t);return r&&(i==="center"&&(r=jd(r,n.getBoundingRect())),W1(n,r)),n}function xA(e,t,r){var i=new ou({style:{image:e,x:t.x,y:t.y,width:t.width,height:t.height},onload:function(n){if(r==="center"){var a={width:n.width,height:n.height};i.setStyle(jd(t,a))}}});return i}function jd(e,t){var r=t.width/t.height,i=e.height*r,n;i<=e.width?n=e.height:(i=e.width,n=i/r);var a=e.x+e.width/2,o=e.y+e.height/2;return{x:a-i/2,y:o-n/2,width:i,height:n}}var TA=u1;function W1(e,t){if(e.applyTransform){var r=e.getBoundingRect(),i=r.calculateTransform(t);e.applyTransform(i)}}function wA(e){return Oc(e.shape,e.shape,e.style),e}function SA(e){return Bc(e.shape,e.shape,e.style),e}var bA=yi;function wu(e,t,r,i,n,a,o){var s=!1,l;typeof n=="function"?(o=a,a=n,n=null):st(n)&&(a=n.cb,o=n.during,s=n.isFrom,l=n.removeOpt,n=n.dataIndex);var u=e==="update",h=e==="remove",f;if(i&&i.ecModel){var c=i.ecModel.getUpdatePayload();f=c&&c.animation}var d=i&&i.isAnimationEnabled();if(h||t.stopAnimation("remove"),d){var v=void 0,p=void 0,_=void 0;f?(v=f.duration||0,p=f.easing||"cubicOut",_=f.delay||0):h?(l=l||{},v=Ne(l.duration,200),p=Ne(l.easing,"cubicOut"),_=0):(v=i.getShallow(u?"animationDurationUpdate":"animationDuration"),p=i.getShallow(u?"animationEasingUpdate":"animationEasing"),_=i.getShallow(u?"animationDelayUpdate":"animationDelay")),typeof _=="function"&&(_=_(n,i.getAnimationDelayParams?i.getAnimationDelayParams(t,n):null)),typeof v=="function"&&(v=v(n)),v>0?s?t.animateFrom(r,{duration:v,delay:_||0,easing:p,done:a,force:!!a||!!o,scope:e,during:o}):t.animateTo(r,{duration:v,delay:_||0,easing:p,done:a,force:!!a||!!o,setToFinal:!0,scope:e,during:o}):(t.stopAnimation(),!s&&t.attr(r),a&&a())}else t.stopAnimation(),!s&&t.attr(r),o&&o(1),a&&a()}function qd(e,t,r,i,n,a){wu("update",e,t,r,i,n,a)}function X1(e,t,r,i,n,a){wu("init",e,t,r,i,n,a)}function j1(e,t,r,i,n,a){q1(e)||wu("remove",e,t,r,i,n,a)}function Zd(e,t,r,i){e.removeTextContent(),e.removeTextGuideLine(),j1(e,{style:{opacity:0}},t,r,i)}function EA(e,t,r){function i(){e.parent&&e.parent.remove(e)}e.isGroup?e.traverse(function(n){n.isGroup||Zd(n,t,r,i)}):Zd(e,t,r,i)}function q1(e){if(!e.__zr)return!0;for(var t=0;t<e.animators.length;t++){var r=e.animators[t];if(r.scope==="remove")return!0}return!1}function AA(e,t){for(var r=$f([]);e&&e!==t;)Lo(r,e.getLocalTransform(),r),e=e.parent;return r}function Z1(e,t,r){return t&&!ar(t)&&(t=kl.getLocalTransform(t)),r&&(t=Ol([],t)),Rr([],e,t)}function MA(e,t,r){var i=t[4]===0||t[5]===0||t[0]===0?1:Math.abs(2*t[4]/t[0]),n=t[4]===0||t[5]===0||t[2]===0?1:Math.abs(2*t[4]/t[2]),a=[e==="left"?-i:e==="right"?i:0,e==="top"?-n:e==="bottom"?n:0];return a=Z1(a,t,r),Math.abs(a[0])>Math.abs(a[1])?a[0]>0?"right":"left":a[1]>0?"bottom":"top"}function Yd(e){return!e.isGroup}function Y1(e){return e.shape!=null}function DA(e,t,r){if(!e||!t)return;function i(o){var s={};return o.traverse(function(l){Yd(l)&&l.anid&&(s[l.anid]=l)}),s}function n(o){var s={x:o.x,y:o.y,rotation:o.rotation};return Y1(o)&&(s.shape=de({},o.shape)),s}var a=i(e);t.traverse(function(o){if(Yd(o)&&o.anid){var s=a[o.anid];if(s){var l=n(o);o.attr(n(s)),qd(o,l,r,Ur(o).dataIndex)}}})}function CA(e,t){return or(e,function(r){var i=r[0];i=os(i,t.x),i=ss(i,t.x+t.width);var n=r[1];return n=os(n,t.y),n=ss(n,t.y+t.height),[i,n]})}function LA(e,t){var r=os(e.x,t.x),i=ss(e.x+e.width,t.x+t.width),n=os(e.y,t.y),a=ss(e.y+e.height,t.y+t.height);if(i>=r&&a>=n)return{x:r,y:n,width:i-r,height:a-n}}function PA(e,t,r){var i=de({rectHover:!0},t),n=i.style={strokeNoScale:!0};if(r=r||{x:-1,y:-1,width:2,height:2},e)return e.indexOf("image://")===0?(n.image=e.slice(8),Jt(n,r),new ou(i)):k1(e.replace("path://",""),i,r,"center")}function RA(e,t,r,i,n){for(var a=0,o=n[n.length-1];a<n.length;a++){var s=n[a];if(K1(e,t,r,i,s[0],s[1],o[0],o[1]))return!0;o=s}}function K1(e,t,r,i,n,a,o,s){var l=r-e,u=i-t,h=o-n,f=s-a,c=Su(h,f,l,u);if(Q1(c))return!1;var d=e-n,v=t-a,p=Su(d,v,l,u)/c;if(p<0||p>1)return!1;var _=Su(d,v,h,f)/c;return!(_<0||_>1)}function Su(e,t,r,i){return e*i-r*t}function Q1(e){return e<=1e-6&&e>=-1e-6}function NA(e){var t=e.itemTooltipOption,r=e.componentModel,i=e.itemName,n=mr(t)?{formatter:t}:t,a=r.mainType,o=r.componentIndex,s={componentType:a,name:i,$vars:["name"]};s[a+"Index"]=o;var l=e.formatterParamsExtra;l&&xe(ht(l),function(h){Sm(s,h)||(s[h]=l[h],s.$vars.push(h))});var u=Ur(e.el);u.componentMainType=a,u.componentIndex=o,u.tooltipConfig={name:i,option:Jt({content:i,formatterParams:s},n)}}dr("circle",f1),dr("ellipse",d1),dr("sector",y1),dr("ring",T1),dr("polygon",E1),dr("polyline",M1),dr("rect",Gc),dr("line",L1),dr("bezierCurve",R1),dr("arc",I1);var ls={};function Kd(e,t){for(var r=0;r<zr.length;r++){var i=zr[r],n=t[i],a=e.ensureState(i);a.style=a.style||{},a.style.text=n}var o=e.currentStates.slice();e.clearStates(!0),e.setStyle({text:t.normal}),e.useStates(o,!0)}function bu(e,t,r){var i=e.labelFetcher,n=e.labelDataIndex,a=e.labelDimIndex,o=t.normal,s;i&&(s=i.getFormattedLabel(n,"normal",null,a,o&&o.get("formatter"),r!=null?{interpolatedValue:r}:null)),s==null&&(s=wl(e.defaultText)?e.defaultText(n,e,r):e.defaultText);for(var l={normal:s},u=0;u<zr.length;u++){var h=zr[u],f=t[h];l[h]=Ne(i?i.getFormattedLabel(n,h,null,a,f&&f.get("formatter")):null,s)}return l}function IA(e,t,r,i){r=r||ls;for(var n=e instanceof qo,a=!1,o=0;o<ld.length;o++){var s=t[ld[o]];if(s&&s.getShallow("show")){a=!0;break}}var l=n?e:e.getTextContent();if(a){n||(l||(l=new qo,e.setTextContent(l)),e.stateProxy&&(l.stateProxy=e.stateProxy));var u=bu(r,t),h=t.normal,f=!!h.getShallow("show"),c=gn(h,i&&i.normal,r,!1,!n);c.text=u.normal,n||e.setTextConfig(Qd(h,r,!1));for(var o=0;o<zr.length;o++){var d=zr[o],s=t[d];if(s){var v=l.ensureState(d),p=!!Ne(s.getShallow("show"),f);if(p!==f&&(v.ignore=!p),v.style=gn(s,i&&i[d],r,!0,!n),v.style.text=u[d],!n){var _=e.ensureState(d);_.textConfig=Qd(s,r,!0)}}}l.silent=!!h.getShallow("silent"),l.style.x!=null&&(c.x=l.style.x),l.style.y!=null&&(c.y=l.style.y),l.ignore=!f,l.useStyle(c),l.dirty(),r.enableTextSetter&&(Eu(l).setLabelText=function(g){var m=bu(r,t,g);Kd(l,m)})}else l&&(l.ignore=!0);e.dirty()}function OA(e,t){t=t||"label";for(var r={normal:e.getModel(t)},i=0;i<zr.length;i++){var n=zr[i];r[n]=e.getModel([n,t])}return r}function gn(e,t,r,i,n){var a={};return J1(a,e,r,i,n),t&&de(a,t),a}function Qd(e,t,r){t=t||{};var i={},n,a=e.getShallow("rotate"),o=Ne(e.getShallow("distance"),r?null:5),s=e.getShallow("offset");return n=e.getShallow("position")||(r?null:"inside"),n==="outside"&&(n=t.defaultOutsidePosition||"top"),n!=null&&(i.position=n),s!=null&&(i.offset=s),a!=null&&(a*=Math.PI/180,i.rotation=a),o!=null&&(i.distance=o),i.outsideFill=e.get("color")==="inherit"?t.inheritColor||null:"auto",i}function J1(e,t,r,i,n){r=r||ls;var a=t.ecModel,o=a&&a.option.textStyle,s=$1(t),l;if(s){l={};for(var u in s)if(s.hasOwnProperty(u)){var h=t.getModel(["rich",u]);tv(l[u]={},h,o,r,i,n,!1,!0)}}l&&(e.rich=l);var f=t.get("overflow");f&&(e.overflow=f);var c=t.get("minMargin");c!=null&&(e.margin=c),tv(e,t,o,r,i,n,!0,!1)}function $1(e){for(var t;e&&e!==e.ecModel;){var r=(e.option||ls).rich;if(r){t=t||{};for(var i=ht(r),n=0;n<i.length;n++){var a=i[n];t[a]=1}}e=e.parentModel}return t}var Jd=["fontStyle","fontWeight","fontSize","fontFamily","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY"],$d=["align","lineHeight","width","height","tag","verticalAlign"],ev=["padding","borderWidth","borderRadius","borderDashOffset","backgroundColor","borderColor","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY"];function tv(e,t,r,i,n,a,o,s){r=!n&&r||ls;var l=i&&i.inheritColor,u=t.getShallow("color"),h=t.getShallow("textBorderColor"),f=Ne(t.getShallow("opacity"),r.opacity);(u==="inherit"||u==="auto")&&(u==="auto"&&_a("color: 'auto'","color: 'inherit'"),l?u=l:u=null),(h==="inherit"||h==="auto")&&(h==="auto"&&_a("color: 'auto'","color: 'inherit'"),l?h=l:h=null),a||(u=u||r.color,h=h||r.textBorderColor),u!=null&&(e.fill=u),h!=null&&(e.stroke=h);var c=Ne(t.getShallow("textBorderWidth"),r.textBorderWidth);c!=null&&(e.lineWidth=c);var d=Ne(t.getShallow("textBorderType"),r.textBorderType);d!=null&&(e.lineDash=d);var v=Ne(t.getShallow("textBorderDashOffset"),r.textBorderDashOffset);v!=null&&(e.lineDashOffset=v),!n&&f==null&&!s&&(f=i&&i.defaultOpacity),f!=null&&(e.opacity=f),!n&&!a&&e.fill==null&&i.inheritColor&&(e.fill=i.inheritColor);for(var p=0;p<Jd.length;p++){var _=Jd[p],g=Ne(t.getShallow(_),r[_]);g!=null&&(e[_]=g)}for(var p=0;p<$d.length;p++){var _=$d[p],g=t.getShallow(_);g!=null&&(e[_]=g)}if(e.verticalAlign==null){var m=t.getShallow("baseline");m!=null&&(e.verticalAlign=m)}if(!o||!i.disableBox){for(var p=0;p<ev.length;p++){var _=ev[p],g=t.getShallow(_);g!=null&&(e[_]=g)}var y=t.getShallow("borderType");y!=null&&(e.borderDash=y),(e.backgroundColor==="auto"||e.backgroundColor==="inherit")&&l&&(e.backgroundColor==="auto"&&_a("backgroundColor: 'auto'","backgroundColor: 'inherit'"),e.backgroundColor=l),(e.borderColor==="auto"||e.borderColor==="inherit")&&l&&(e.borderColor==="auto"&&_a("borderColor: 'auto'","borderColor: 'inherit'"),e.borderColor=l)}}function ex(e,t){var r=t&&t.getModel("textStyle");return bl([e.fontStyle||r&&r.getShallow("fontStyle")||"",e.fontWeight||r&&r.getShallow("fontWeight")||"",(e.fontSize||r&&r.getShallow("fontSize")||12)+"px",e.fontFamily||r&&r.getShallow("fontFamily")||"sans-serif"].join(" "))}var Eu=Jo();function BA(e,t,r,i){if(e){var n=Eu(e);n.prevValue=n.value,n.value=r;var a=t.normal;n.valueAnimation=a.get("valueAnimation"),n.valueAnimation&&(n.precision=a.get("precision"),n.defaultInterpolatedText=i,n.statesModels=t)}}function FA(e,t,r,i,n){var a=Eu(e);if(!a.valueAnimation)return;var o=a.defaultInterpolatedText,s=Ne(a.interpolatedValue,a.prevValue),l=a.value;function u(h){var f=Iy(r,a.precision,s,l,h);a.interpolatedValue=h===1?null:f;var c=bu({labelDataIndex:t,labelFetcher:n,defaultText:o?o(f):f+""},a.statesModels,f);Kd(e,c)}(s==null?X1:qd)(e,{},i,t,null,u)}var xa=te.firstNotNull,us={left:0,middle:1,right:2};function rv(e){return e instanceof Array||(e=[e,e]),e}var iv=vt.extend(function(){return{zr:null,viewGL:null,_center:new z,minDistance:.5,maxDistance:1.5,maxOrthographicSize:300,minOrthographicSize:30,minAlpha:-90,maxAlpha:90,minBeta:-1/0,maxBeta:1/0,autoRotateAfterStill:0,autoRotateDirection:"cw",autoRotateSpeed:60,damping:.8,rotateSensitivity:1,zoomSensitivity:1,panSensitivity:1,panMouseButton:"middle",rotateMouseButton:"left",_mode:"rotate",_camera:null,_needsUpdate:!1,_rotating:!1,_phi:0,_theta:0,_mouseX:0,_mouseY:0,_rotateVelocity:new Pt,_panVelocity:new Pt,_distance:500,_zoomSpeed:0,_stillTimeout:0,_animators:[]}},function(){["_mouseDownHandler","_mouseWheelHandler","_mouseMoveHandler","_mouseUpHandler","_pinchHandler","_contextMenuHandler","_update"].forEach(function(e){this[e]=this[e].bind(this)},this)},{init:function(){var e=this.zr;e&&(e.on("mousedown",this._mouseDownHandler),e.on("globalout",this._mouseUpHandler),e.on("mousewheel",this._mouseWheelHandler),e.on("pinch",this._pinchHandler),e.animation.on("frame",this._update),e.dom.addEventListener("contextmenu",this._contextMenuHandler))},dispose:function(){var e=this.zr;e&&(e.off("mousedown",this._mouseDownHandler),e.off("mousemove",this._mouseMoveHandler),e.off("mouseup",this._mouseUpHandler),e.off("mousewheel",this._mouseWheelHandler),e.off("pinch",this._pinchHandler),e.off("globalout",this._mouseUpHandler),e.dom.removeEventListener("contextmenu",this._contextMenuHandler),e.animation.off("frame",this._update)),this.stopAllAnimation()},getDistance:function(){return this._distance},setDistance:function(e){this._distance=e,this._needsUpdate=!0},getOrthographicSize:function(){return this._orthoSize},setOrthographicSize:function(e){this._orthoSize=e,this._needsUpdate=!0},getAlpha:function(){return this._theta/Math.PI*180},getBeta:function(){return-this._phi/Math.PI*180},getCenter:function(){return this._center.toArray()},setAlpha:function(e){e=Math.max(Math.min(this.maxAlpha,e),this.minAlpha),this._theta=e/180*Math.PI,this._needsUpdate=!0},setBeta:function(e){e=Math.max(Math.min(this.maxBeta,e),this.minBeta),this._phi=-e/180*Math.PI,this._needsUpdate=!0},setCenter:function(e){this._center.setArray(e)},setViewGL:function(e){this.viewGL=e},getCamera:function(){return this.viewGL.camera},setFromViewControlModel:function(e,t){t=t||{};var r=t.baseDistance||0,i=t.baseOrthoSize||1,n=e.get("projection");n!=="perspective"&&n!=="orthographic"&&n!=="isometric"&&(console.error("Unkown projection type %s, use perspective projection instead.",n),n="perspective"),this._projection=n,this.viewGL.setProjection(n);var a=e.get("distance")+r,o=e.get("orthographicSize")+i;[["damping",.8],["autoRotate",!1],["autoRotateAfterStill",3],["autoRotateDirection","cw"],["autoRotateSpeed",10],["minDistance",30],["maxDistance",400],["minOrthographicSize",30],["maxOrthographicSize",300],["minAlpha",-90],["maxAlpha",90],["minBeta",-1/0],["maxBeta",1/0],["rotateSensitivity",1],["zoomSensitivity",1],["panSensitivity",1],["panMouseButton","left"],["rotateMouseButton","middle"]].forEach(function(c){this[c[0]]=xa(e.get(c[0]),c[1])},this),this.minDistance+=r,this.maxDistance+=r,this.minOrthographicSize+=i,this.maxOrthographicSize+=i;var s=e.ecModel,l={};["animation","animationDurationUpdate","animationEasingUpdate"].forEach(function(c){l[c]=xa(e.get(c),s&&s.get(c))});var u=xa(t.alpha,e.get("alpha"))||0,h=xa(t.beta,e.get("beta"))||0,f=xa(t.center,e.get("center"))||[0,0,0];l.animation&&l.animationDurationUpdate>0&&this._notFirst?this.animateTo({alpha:u,beta:h,center:f,distance:a,orthographicSize:o,easing:l.animationEasingUpdate,duration:l.animationDurationUpdate}):(this.setDistance(a),this.setAlpha(u),this.setBeta(h),this.setCenter(f),this.setOrthographicSize(o)),this._notFirst=!0,this._validateProperties()},_validateProperties:function(){us[this.panMouseButton]==null&&console.error("Unkown panMouseButton %s. It should be left|middle|right",this.panMouseButton),us[this.rotateMouseButton]==null&&console.error("Unkown rotateMouseButton %s. It should be left|middle|right",this.rotateMouseButton),this.autoRotateDirection!=="cw"&&this.autoRotateDirection!=="ccw"&&console.error("Unkown autoRotateDirection %s. It should be cw|ccw",this.autoRotateDirection)},animateTo:function(e){var t=this.zr,r=this,i={},n={};return e.distance!=null&&(i.distance=this.getDistance(),n.distance=e.distance),e.orthographicSize!=null&&(i.orthographicSize=this.getOrthographicSize(),n.orthographicSize=e.orthographicSize),e.alpha!=null&&(i.alpha=this.getAlpha(),n.alpha=e.alpha),e.beta!=null&&(i.beta=this.getBeta(),n.beta=e.beta),e.center!=null&&(i.center=this.getCenter(),n.center=e.center),this._addAnimator(t.animation.animate(i).when(e.duration||1e3,n).during(function(){i.alpha!=null&&r.setAlpha(i.alpha),i.beta!=null&&r.setBeta(i.beta),i.distance!=null&&r.setDistance(i.distance),i.center!=null&&r.setCenter(i.center),i.orthographicSize!=null&&r.setOrthographicSize(i.orthographicSize),r._needsUpdate=!0})).start(e.easing||"linear")},stopAllAnimation:function(){for(var e=0;e<this._animators.length;e++)this._animators[e].stop();this._animators.length=0},update:function(){this._needsUpdate=!0,this._update(20)},_isAnimating:function(){return this._animators.length>0},_update:function(e){if(this._rotating){var t=(this.autoRotateDirection==="cw"?1:-1)*this.autoRotateSpeed/180*Math.PI;this._phi-=t*e/1e3,this._needsUpdate=!0}else this._rotateVelocity.len()>0&&(this._needsUpdate=!0);(Math.abs(this._zoomSpeed)>.1||this._panVelocity.len()>0)&&(this._needsUpdate=!0),this._needsUpdate&&(e=Math.min(e,50),this._updateDistanceOrSize(e),this._updatePan(e),this._updateRotate(e),this._updateTransform(),this.getCamera().update(),this.zr&&this.zr.refresh(),this.trigger("update"),this._needsUpdate=!1)},_updateRotate:function(e){var t=this._rotateVelocity;this._phi=t.y*e/20+this._phi,this._theta=t.x*e/20+this._theta,this.setAlpha(this.getAlpha()),this.setBeta(this.getBeta()),this._vectorDamping(t,Math.pow(this.damping,e/16))},_updateDistanceOrSize:function(e){this._projection==="perspective"?this._setDistance(this._distance+this._zoomSpeed*e/20):this._setOrthoSize(this._orthoSize+this._zoomSpeed*e/20),this._zoomSpeed*=Math.pow(this.damping,e/16)},_setDistance:function(e){this._distance=Math.max(Math.min(e,this.maxDistance),this.minDistance)},_setOrthoSize:function(e){this._orthoSize=Math.max(Math.min(e,this.maxOrthographicSize),this.minOrthographicSize);var t=this.getCamera(),r=this._orthoSize,i=r/this.viewGL.viewport.height*this.viewGL.viewport.width;t.left=-i/2,t.right=i/2,t.top=r/2,t.bottom=-r/2},_updatePan:function(e){var t=this._panVelocity,r=this._distance,i=this.getCamera(),n=i.worldTransform.y,a=i.worldTransform.x;this._center.scaleAndAdd(a,-t.x*r/200).scaleAndAdd(n,-t.y*r/200),this._vectorDamping(t,0)},_updateTransform:function(){var e=this.getCamera(),t=new z,r=this._theta+Math.PI/2,i=this._phi+Math.PI/2,n=Math.sin(r);t.x=n*Math.cos(i),t.y=-Math.cos(r),t.z=n*Math.sin(i),e.position.copy(this._center).scaleAndAdd(t,this._distance),e.rotation.identity().rotateY(-this._phi).rotateX(-this._theta)},_startCountingStill:function(){clearTimeout(this._stillTimeout);var e=this.autoRotateAfterStill,t=this;!isNaN(e)&&e>0&&(this._stillTimeout=setTimeout(function(){t._rotating=!0},e*1e3))},_vectorDamping:function(e,t){var r=e.len();r=r*t,r<1e-4&&(r=0),e.normalize().scale(r)},_decomposeTransform:function(){if(this.getCamera()){this.getCamera().updateWorldTransform();var e=this.getCamera().worldTransform.z,t=Math.asin(e.y),r=Math.atan2(e.x,e.z);this._theta=t,this._phi=-r,this.setBeta(this.getBeta()),this.setAlpha(this.getAlpha()),this.getCamera().aspect?this._setDistance(this.getCamera().position.dist(this._center)):this._setOrthoSize(this.getCamera().top-this.getCamera().bottom)}},_mouseDownHandler:function(e){if(!e.target&&!this._isAnimating()){var t=e.offsetX,r=e.offsetY;this.viewGL&&!this.viewGL.containPoint(t,r)||(this.zr.on("mousemove",this._mouseMoveHandler),this.zr.on("mouseup",this._mouseUpHandler),e.event.targetTouches?e.event.targetTouches.length===1&&(this._mode="rotate"):e.event.button===us[this.rotateMouseButton]?this._mode="rotate":e.event.button===us[this.panMouseButton]?this._mode="pan":this._mode="",this._rotateVelocity.set(0,0),this._rotating=!1,this.autoRotate&&this._startCountingStill(),this._mouseX=e.offsetX,this._mouseY=e.offsetY)}},_mouseMoveHandler:function(e){if(!(e.target&&e.target.__isGLToZRProxy)&&!this._isAnimating()){var t=rv(this.panSensitivity),r=rv(this.rotateSensitivity);this._mode==="rotate"?(this._rotateVelocity.y=(e.offsetX-this._mouseX)/this.zr.getHeight()*2*r[0],this._rotateVelocity.x=(e.offsetY-this._mouseY)/this.zr.getWidth()*2*r[1]):this._mode==="pan"&&(this._panVelocity.x=(e.offsetX-this._mouseX)/this.zr.getWidth()*t[0]*400,this._panVelocity.y=(-e.offsetY+this._mouseY)/this.zr.getHeight()*t[1]*400),this._mouseX=e.offsetX,this._mouseY=e.offsetY,e.event.preventDefault()}},_mouseWheelHandler:function(e){if(!this._isAnimating()){var t=e.event.wheelDelta||-e.event.detail;this._zoomHandler(e,t)}},_pinchHandler:function(e){this._isAnimating()||(this._zoomHandler(e,e.pinchScale>1?1:-1),this._mode="")},_zoomHandler:function(e,t){if(t!==0){var r=e.offsetX,i=e.offsetY;if(!(this.viewGL&&!this.viewGL.containPoint(r,i))){var n;this._projection==="perspective"?n=Math.max(Math.max(Math.min(this._distance-this.minDistance,this.maxDistance-this._distance))/20,.5):n=Math.max(Math.max(Math.min(this._orthoSize-this.minOrthographicSize,this.maxOrthographicSize-this._orthoSize))/20,.5),this._zoomSpeed=(t>0?-1:1)*n*this.zoomSensitivity,this._rotating=!1,this.autoRotate&&this._mode==="rotate"&&this._startCountingStill(),e.event.preventDefault()}}},_mouseUpHandler:function(){this.zr.off("mousemove",this._mouseMoveHandler),this.zr.off("mouseup",this._mouseUpHandler)},_isRightMouseButtonUsed:function(){return this.rotateMouseButton==="right"||this.panMouseButton==="right"},_contextMenuHandler:function(e){this._isRightMouseButtonUsed()&&e.preventDefault()},_addAnimator:function(e){var t=this._animators;return t.push(e),e.done(function(){var r=t.indexOf(e);r>=0&&t.splice(r,1)}),e}});Object.defineProperty(iv.prototype,"autoRotate",{get:function(e){return this._autoRotate},set:function(e){this._autoRotate=e,this._rotating=e}});let hs=iv,Ta={convertToDynamicArray:function(e){e&&this.resetOffset();var t=this.attributes;for(var r in t)e||!t[r].value?t[r].value=[]:t[r].value=Array.prototype.slice.call(t[r].value);e||!this.indices?this.indices=[]:this.indices=Array.prototype.slice.call(this.indices)},convertToTypedArray:function(){var e=this.attributes;for(var t in e)e[t].value&&e[t].value.length>0?e[t].value=new Float32Array(e[t].value):e[t].value=null;this.indices&&this.indices.length>0&&(this.indices=this.vertexCount>65535?new Uint32Array(this.indices):new Uint16Array(this.indices)),this.dirty()}},Ue={vec2:q,vec3:C,vec4:k,mat2:Re,mat2d:Ve,mat3:se,mat4:U,quat:Q};var Au=Ue.vec3,nv=[[0,0],[1,1]],av=ce.extend(function(){return{segmentScale:1,dynamic:!0,useNativeLine:!0,attributes:{position:new ce.Attribute("position","float",3,"POSITION"),positionPrev:new ce.Attribute("positionPrev","float",3),positionNext:new ce.Attribute("positionNext","float",3),prevPositionPrev:new ce.Attribute("prevPositionPrev","float",3),prevPosition:new ce.Attribute("prevPosition","float",3),prevPositionNext:new ce.Attribute("prevPositionNext","float",3),offset:new ce.Attribute("offset","float",1),color:new ce.Attribute("color","float",4,"COLOR")}}},{resetOffset:function(){this._vertexOffset=0,this._triangleOffset=0,this._itemVertexOffsets=[]},setVertexCount:function(e){var t=this.attributes;this.vertexCount!==e&&(t.position.init(e),t.color.init(e),this.useNativeLine||(t.positionPrev.init(e),t.positionNext.init(e),t.offset.init(e)),e>65535?this.indices instanceof Uint16Array&&(this.indices=new Uint32Array(this.indices)):this.indices instanceof Uint32Array&&(this.indices=new Uint16Array(this.indices)))},setTriangleCount:function(e){this.triangleCount!==e&&(e===0?this.indices=null:this.indices=this.vertexCount>65535?new Uint32Array(e*3):new Uint16Array(e*3))},_getCubicCurveApproxStep:function(e,t,r,i){var n=Au.dist(e,t)+Au.dist(r,t)+Au.dist(i,r),a=1/(n+1)*this.segmentScale;return a},getCubicCurveVertexCount:function(e,t,r,i){var n=this._getCubicCurveApproxStep(e,t,r,i),a=Math.ceil(1/n);return this.useNativeLine?a*2:a*2+2},getCubicCurveTriangleCount:function(e,t,r,i){var n=this._getCubicCurveApproxStep(e,t,r,i),a=Math.ceil(1/n);return this.useNativeLine?0:a*2},getLineVertexCount:function(){return this.getPolylineVertexCount(nv)},getLineTriangleCount:function(){return this.getPolylineTriangleCount(nv)},getPolylineVertexCount:function(e){var t;if(typeof e=="number")t=e;else{var r=typeof e[0]!="number";t=r?e.length:e.length/3}return this.useNativeLine?(t-1)*2:(t-1)*2+2},getPolylineTriangleCount:function(e){var t;if(typeof e=="number")t=e;else{var r=typeof e[0]!="number";t=r?e.length:e.length/3}return this.useNativeLine?0:Math.max(t-1,0)*2},addCubicCurve:function(e,t,r,i,n,a){a==null&&(a=1);for(var o=e[0],s=e[1],l=e[2],u=t[0],h=t[1],f=t[2],c=r[0],d=r[1],v=r[2],p=i[0],_=i[1],g=i[2],m=this._getCubicCurveApproxStep(e,t,r,i),y=m*m,x=y*m,w=3*m,T=3*y,E=6*y,b=6*x,D=o-u*2+c,L=s-h*2+d,M=l-f*2+v,R=(u-c)*3-o+p,I=(h-d)*3-s+_,P=(f-v)*3-l+g,N=o,G=s,H=l,F=(u-o)*w+D*T+R*x,re=(h-s)*w+L*T+I*x,B=(f-l)*w+M*T+P*x,j=D*E+R*b,J=L*E+I*b,le=M*E+P*b,ve=R*b,ne=I*b,ze=P*b,we=0,Le=0,ot=Math.ceil(1/m),Ye=new Float32Array((ot+1)*3),Ye=[],ke=0,Le=0;Le<ot+1;Le++)Ye[ke++]=N,Ye[ke++]=G,Ye[ke++]=H,N+=F,G+=re,H+=B,F+=j,re+=J,B+=le,j+=ve,J+=ne,le+=ze,we+=m,we>1&&(N=F>0?Math.min(N,p):Math.max(N,p),G=re>0?Math.min(G,_):Math.max(G,_),H=B>0?Math.min(H,g):Math.max(H,g));return this.addPolyline(Ye,n,a)},addLine:function(e,t,r,i){return this.addPolyline([e,t],r,i)},addPolyline:function(e,t,r,i,n){if(e.length){var a=typeof e[0]!="number";if(n==null&&(n=a?e.length:e.length/3),!(n<2)){i==null&&(i=0),r==null&&(r=1),this._itemVertexOffsets.push(this._vertexOffset);var a=typeof e[0]!="number",o=a?typeof t[0]!="number":t.length/4===n,s=this.attributes.position,l=this.attributes.positionPrev,u=this.attributes.positionNext,h=this.attributes.color,f=this.attributes.offset,c=this.indices,d=this._vertexOffset,v,p;r=Math.max(r,.01);for(var _=i;_<n;_++){if(a)v=e[_],o?p=t[_]:p=t;else{var g=_*3;if(v=v||[],v[0]=e[g],v[1]=e[g+1],v[2]=e[g+2],o){var m=_*4;p=p||[],p[0]=t[m],p[1]=t[m+1],p[2]=t[m+2],p[3]=t[m+3]}else p=t}if(this.useNativeLine?_>1&&(s.copy(d,d-1),h.copy(d,d-1),d++):(_<n-1&&(l.set(d+2,v),l.set(d+3,v)),_>0&&(u.set(d-2,v),u.set(d-1,v)),s.set(d,v),s.set(d+1,v),h.set(d,p),h.set(d+1,p),f.set(d,r/2),f.set(d+1,-r/2),d+=2),this.useNativeLine)h.set(d,p),s.set(d,v),d++;else if(_>0){var y=this._triangleOffset*3,c=this.indices;c[y]=d-4,c[y+1]=d-3,c[y+2]=d-2,c[y+3]=d-3,c[y+4]=d-1,c[y+5]=d-2,this._triangleOffset+=2}}if(!this.useNativeLine){var x=this._vertexOffset,w=this._vertexOffset+n*2;l.copy(x,x+2),l.copy(x+1,x+3),u.copy(w-1,w-3),u.copy(w-2,w-4)}return this._vertexOffset=d,this._vertexOffset}}},setItemColor:function(e,t){for(var r=this._itemVertexOffsets[e],i=e<this._itemVertexOffsets.length-1?this._itemVertexOffsets[e+1]:this._vertexOffset,n=r;n<i;n++)this.attributes.color.set(n,t);this.dirty("color")},currentTriangleOffset:function(){return this._triangleOffset},currentVertexOffset:function(){return this._vertexOffset}});A.util.defaults(av.prototype,Ta);let Si=av;function fs(e,t,r,i,n,a,o){this._zr=e,this._x=0,this._y=0,this._rowHeight=0,this.width=i,this.height=n,this.offsetX=t,this.offsetY=r,this.dpr=o,this.gap=a}fs.prototype={constructor:fs,clear:function(){this._x=0,this._y=0,this._rowHeight=0},add:function(e,t,r){var i=e.getBoundingRect();t==null&&(t=i.width),r==null&&(r=i.height),t*=this.dpr,r*=this.dpr,this._fitElement(e,t,r);var n=this._x,a=this._y,o=this.width*this.dpr,s=this.height*this.dpr,l=this.gap;if(n+t+l>o&&(n=this._x=0,a+=this._rowHeight+l,this._y=a,this._rowHeight=0),this._x+=t+l,this._rowHeight=Math.max(this._rowHeight,r),a+r+l>s)return null;e.x+=this.offsetX*this.dpr+n,e.y+=this.offsetY*this.dpr+a,this._zr.add(e);var u=[this.offsetX/this.width,this.offsetY/this.height],h=[[n/o+u[0],a/s+u[1]],[(n+t)/o+u[0],(a+r)/s+u[1]]];return h},_fitElement:function(e,t,r){var i=e.getBoundingRect(),n=t/i.width,a=r/i.height;e.x=-i.x*n,e.y=-i.y*a,e.scaleX=n,e.scaleY=a,e.update()}};function ov(e){e=e||{},e.width=e.width||512,e.height=e.height||512,e.devicePixelRatio=e.devicePixelRatio||1,e.gap=e.gap==null?2:e.gap;var t=document.createElement("canvas");t.width=e.width*e.devicePixelRatio,t.height=e.height*e.devicePixelRatio,this._canvas=t,this._texture=new ee({image:t,flipY:!1});var r=this;this._zr=A.zrender.init(t),bf(this._zr,function(){r._texture.dirty(),r.onupdate&&r.onupdate()}),this._dpr=e.devicePixelRatio,this._coords={},this.onupdate=e.onupdate,this._gap=e.gap,this._textureAtlasNodes=[new fs(this._zr,0,0,e.width,e.height,this._gap,this._dpr)],this._nodeWidth=e.width,this._nodeHeight=e.height,this._currentNodeIdx=0}ov.prototype={clear:function(){for(var e=0;e<this._textureAtlasNodes.length;e++)this._textureAtlasNodes[e].clear();this._currentNodeIdx=0,this._zr.clear(),this._coords={}},getWidth:function(){return this._width},getHeight:function(){return this._height},getTexture:function(){return this._texture},getDevicePixelRatio:function(){return this._dpr},getZr:function(){return this._zr},_getCurrentNode:function(){return this._textureAtlasNodes[this._currentNodeIdx]},_expand:function(){if(this._currentNodeIdx++,this._textureAtlasNodes[this._currentNodeIdx])return this._textureAtlasNodes[this._currentNodeIdx];var e=4096/this._dpr,t=this._textureAtlasNodes,r=t.length,i=r*this._nodeWidth%e,n=Math.floor(r*this._nodeWidth/e)*this._nodeHeight;if(n>=e){console.error("Too much labels. Some will be ignored.");return}var a=(i+this._nodeWidth)*this._dpr,o=(n+this._nodeHeight)*this._dpr;try{this._zr.resize({width:a,height:o})}catch{this._canvas.width=a,this._canvas.height=o}var s=new fs(this._zr,i,n,this._nodeWidth,this._nodeHeight,this._gap,this._dpr);return this._textureAtlasNodes.push(s),s},add:function(e,t,r){if(this._coords[e.id])return console.warn("Element already been add"),this._coords[e.id];var i=this._getCurrentNode().add(e,t,r);if(!i){var n=this._expand();if(!n)return;i=n.add(e,t,r)}return this._coords[e.id]=i,i},getCoordsScale:function(){var e=this._dpr;return[this._nodeWidth/this._canvas.width*e,this._nodeHeight/this._canvas.height*e]},getCoords:function(e){return this._coords[e]},dispose:function(){this._zr.dispose()}};let Mu=ov;function Du(){}Du.prototype={constructor:Du,setScene:function(e){this._scene=e,this._skybox&&this._skybox.attachScene(this._scene)},initLight:function(e){this._lightRoot=e,this.mainLight=new S.DirectionalLight({shadowBias:.005}),this.ambientLight=new S.AmbientLight,e.add(this.mainLight),e.add(this.ambientLight)},dispose:function(){this._lightRoot&&(this._lightRoot.remove(this.mainLight),this._lightRoot.remove(this.ambientLight))},updateLight:function(e){var t=this.mainLight,r=this.ambientLight,i=e.getModel("light"),n=i.getModel("main"),a=i.getModel("ambient");t.intensity=n.get("intensity"),r.intensity=a.get("intensity"),t.color=S.parseColor(n.get("color")).slice(0,3),r.color=S.parseColor(a.get("color")).slice(0,3);var o=n.get("alpha")||0,s=n.get("beta")||0;t.position.setArray(S.directionFromAlphaBeta(o,s)),t.lookAt(S.Vector3.ZERO),t.castShadow=n.get("shadow"),t.shadowResolution=S.getShadowResolution(n.get("shadowQuality"))},updateAmbientCubemap:function(e,t,r){var i=t.getModel("light.ambientCubemap"),n=i.get("texture");if(n){this._cubemapLightsCache=this._cubemapLightsCache||{};var a=this._cubemapLightsCache[n];if(!a){var o=this;a=this._cubemapLightsCache[n]=S.createAmbientCubemap(i.option,e,r,function(){o._isSkyboxFromAmbientCubemap&&o._skybox.setEnvironmentMap(a.specular.cubemap),r.getZr().refresh()})}this._lightRoot.add(a.diffuse),this._lightRoot.add(a.specular),this._currentCubemapLights=a}else this._currentCubemapLights&&(this._lightRoot.remove(this._currentCubemapLights.diffuse),this._lightRoot.remove(this._currentCubemapLights.specular),this._currentCubemapLights=null)},updateSkybox:function(e,t,r){var i=t.get("environment"),n=this;function a(){return n._skybox=n._skybox||new so,n._skybox}var o=a();if(i&&i!=="none")if(i==="auto")if(this._isSkyboxFromAmbientCubemap=!0,this._currentCubemapLights){var s=this._currentCubemapLights.specular.cubemap;o.setEnvironmentMap(s),this._scene&&o.attachScene(this._scene),o.material.set("lod",3)}else this._skybox&&this._skybox.detachScene();else if(typeof i=="object"&&i.colorStops||typeof i=="string"&&A.color.parse(i)){this._isSkyboxFromAmbientCubemap=!1;var l=new S.Texture2D({anisotropic:8,flipY:!1});o.setEnvironmentMap(l);var u=l.image=document.createElement("canvas");u.width=u.height=16;var h=u.getContext("2d"),f=new A.graphic.Rect({shape:{x:0,y:0,width:16,height:16},style:{fill:i}});A.innerDrawElementOnCanvas(h,f),o.attachScene(this._scene)}else{this._isSkyboxFromAmbientCubemap=!1;var l=S.loadTexture(i,r,{anisotropic:8,flipY:!1});o.setEnvironmentMap(l),o.attachScene(this._scene)}else this._skybox&&this._skybox.detachScene(this._scene),this._skybox=null;var c=t.coordinateSystem;if(this._skybox)if(c&&c.viewGL&&i!=="auto"&&!(i.match&&i.match(/.hdr$/))){var d=c.viewGL.isLinearSpace()?"define":"undefine";this._skybox.material[d]("fragment","SRGB_DECODE")}else this._skybox.material.undefine("fragment","SRGB_DECODE")}};let mn=Du;var bi=Ue.vec3,sv=ce.extend(function(){return{segmentScale:1,useNativeLine:!0,attributes:{position:new ce.Attribute("position","float",3,"POSITION"),normal:new ce.Attribute("normal","float",3,"NORMAL"),color:new ce.Attribute("color","float",4,"COLOR")}}},{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setQuadCount:function(e){var t=this.attributes,r=this.getQuadVertexCount()*e,i=this.getQuadTriangleCount()*e;this.vertexCount!==r&&(t.position.init(r),t.normal.init(r),t.color.init(r)),this.triangleCount!==i&&(this.indices=r>65535?new Uint32Array(i*3):new Uint16Array(i*3))},getQuadVertexCount:function(){return 4},getQuadTriangleCount:function(){return 2},addQuad:(function(){var e=bi.create(),t=bi.create(),r=bi.create(),i=[0,3,1,3,2,1];return function(n,a){var o=this.attributes.position,s=this.attributes.normal,l=this.attributes.color;bi.sub(e,n[1],n[0]),bi.sub(t,n[2],n[1]),bi.cross(r,e,t),bi.normalize(r,r);for(var u=0;u<4;u++)o.set(this._vertexOffset+u,n[u]),l.set(this._vertexOffset+u,a),s.set(this._vertexOffset+u,r);for(var h=this._faceOffset*3,u=0;u<6;u++)this.indices[h+u]=i[u]+this._vertexOffset;this._vertexOffset+=4,this._faceOffset+=2}})()});A.util.defaults(sv.prototype,Ta);let tx=sv;var Cu=te.firstNotNull,rx={x:0,y:2,z:1};function ix(e,t,r,i){var n=[0,0,0],a=i<0?r.getExtentMin():r.getExtentMax();n[rx[r.dim]]=a,e.position.setArray(n),e.rotation.identity(),t.distance=-Math.abs(a),t.normal.set(0,0,0),r.dim==="x"?(e.rotation.rotateY(i*Math.PI/2),t.normal.x=-i):r.dim==="z"?(e.rotation.rotateX(-i*Math.PI/2),t.normal.y=-i):(i>0&&e.rotation.rotateY(Math.PI),t.normal.z=-i)}function cs(e,t,r){this.rootNode=new S.Node;var i=new S.Mesh({geometry:new Si({useNativeLine:!1}),material:t,castShadow:!1,ignorePicking:!0,$ignorePicking:!0,renderOrder:1}),n=new S.Mesh({geometry:new tx,material:r,castShadow:!1,culling:!1,ignorePicking:!0,$ignorePicking:!0,renderOrder:0});this.rootNode.add(n),this.rootNode.add(i),this.faceInfo=e,this.plane=new S.Plane,this.linesMesh=i,this.quadsMesh=n}cs.prototype.update=function(e,t,r){var i=e.coordinateSystem,n=[i.getAxis(this.faceInfo[0]),i.getAxis(this.faceInfo[1])],a=this.linesMesh.geometry,o=this.quadsMesh.geometry;a.convertToDynamicArray(!0),o.convertToDynamicArray(!0),this._updateSplitLines(a,n,e,r),this._udpateSplitAreas(o,n,e,r),a.convertToTypedArray(),o.convertToTypedArray();var s=i.getAxis(this.faceInfo[2]);ix(this.rootNode,this.plane,s,this.faceInfo[3])},cs.prototype._updateSplitLines=function(e,t,r,i){var n=i.getDevicePixelRatio();t.forEach(function(a,o){var s=a.model,l=t[1-o].getExtent();if(!a.scale.isBlank()){var u=s.getModel("splitLine",r.getModel("splitLine"));if(u.get("show")){var h=u.getModel("lineStyle"),f=h.get("color"),c=Cu(h.get("opacity"),1),d=Cu(h.get("width"),1);f=A.util.isArray(f)?f:[f];for(var v=a.getTicksCoords({tickModel:u}),p=0,_=0;_<v.length;_++){var g=v[_].coord,m=S.parseColor(f[p%f.length]);m[3]*=c;var y=[0,0,0],x=[0,0,0];y[o]=x[o]=g,y[1-o]=l[0],x[1-o]=l[1],e.addLine(y,x,m,d*n),p++}}}})},cs.prototype._udpateSplitAreas=function(e,t,r,i){t.forEach(function(n,a){var o=n.model,s=t[1-a].getExtent();if(!n.scale.isBlank()){var l=o.getModel("splitArea",r.getModel("splitArea"));if(l.get("show")){var u=l.getModel("areaStyle"),h=u.get("color"),f=Cu(u.get("opacity"),1);h=A.util.isArray(h)?h:[h];for(var c=n.getTicksCoords({tickModel:l,clamp:!0}),d=0,v=[0,0,0],p=[0,0,0],_=0;_<c.length;_++){var g=c[_].coord,m=[0,0,0],y=[0,0,0];if(m[a]=y[a]=g,m[1-a]=s[0],y[1-a]=s[1],_===0){v=m,p=y;continue}var x=S.parseColor(h[d%h.length]);x[3]*=f,e.addQuad([v,m,y,p],x),v=m,p=y,d++}}}})};let nx=cs;var lv=[0,1,2,0,2,3],uv=ce.extend(function(){return{attributes:{position:new ce.Attribute("position","float",3,"POSITION"),texcoord:new ce.Attribute("texcoord","float",2,"TEXCOORD_0"),offset:new ce.Attribute("offset","float",2),color:new ce.Attribute("color","float",4,"COLOR")}}},{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setSpriteCount:function(e){this._spriteCount=e;var t=e*4,r=e*2;this.vertexCount!==t&&(this.attributes.position.init(t),this.attributes.offset.init(t),this.attributes.color.init(t)),this.triangleCount!==r&&(this.indices=t>65535?new Uint32Array(r*3):new Uint16Array(r*3))},setSpriteAlign:function(e,t,r,i,n){r==null&&(r="left"),i==null&&(i="top");var a,o,s,l;switch(n=n||0,r){case"left":a=n,s=t[0]+n;break;case"center":case"middle":a=-t[0]/2,s=t[0]/2;break;case"right":a=-t[0]-n,s=-n;break}switch(i){case"bottom":o=n,l=t[1]+n;break;case"middle":o=-t[1]/2,l=t[1]/2;break;case"top":o=-t[1]-n,l=-n;break}var u=e*4,h=this.attributes.offset;h.set(u,[a,l]),h.set(u+1,[s,l]),h.set(u+2,[s,o]),h.set(u+3,[a,o])},addSprite:function(e,t,r,i,n,a){var o=this._vertexOffset;this.setSprite(this._vertexOffset/4,e,t,r,i,n,a);for(var s=0;s<lv.length;s++)this.indices[this._faceOffset*3+s]=lv[s]+o;return this._faceOffset+=2,this._vertexOffset+=4,o/4},setSprite:function(e,t,r,i,n,a,o){for(var s=e*4,l=this.attributes,u=0;u<4;u++)l.position.set(s+u,t);var h=l.texcoord;h.set(s,[i[0][0],i[0][1]]),h.set(s+1,[i[1][0],i[0][1]]),h.set(s+2,[i[1][0],i[1][1]]),h.set(s+3,[i[0][0],i[1][1]]),this.setSpriteAlign(e,r,n,a,o)}});A.util.defaults(uv.prototype,Ta);let ax=uv;S.Shader.import(`@export ecgl.labels.vertex

attribute vec3 position: POSITION;
attribute vec2 texcoord: TEXCOORD_0;
attribute vec2 offset;
#ifdef VERTEX_COLOR
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;
#endif

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform vec4 viewport : VIEWPORT;

varying vec2 v_Texcoord;

void main()
{
 vec4 proj = worldViewProjection * vec4(position, 1.0);

 vec2 screen = (proj.xy / abs(proj.w) + 1.0) * 0.5 * viewport.zw;

 screen += offset;

 proj.xy = (screen / viewport.zw - 0.5) * 2.0 * abs(proj.w);
 gl_Position = proj;
#ifdef VERTEX_COLOR
 v_Color = a_Color;
#endif
 v_Texcoord = texcoord;
}
@end


@export ecgl.labels.fragment

uniform vec3 color : [1.0, 1.0, 1.0];
uniform float alpha : 1.0;
uniform sampler2D textureAtlas;
uniform vec2 uvScale: [1.0, 1.0];

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif
varying float v_Miter;

varying vec2 v_Texcoord;

void main()
{
 gl_FragColor = vec4(color, alpha) * texture2D(textureAtlas, v_Texcoord * uvScale);
#ifdef VERTEX_COLOR
 gl_FragColor *= v_Color;
#endif
}

@end`);let Lu=S.Mesh.extend(function(){var e=new ax({dynamic:!0}),t=new S.Material({shader:S.createShader("ecgl.labels"),transparent:!0,depthMask:!1});return{geometry:e,material:t,culling:!1,castShadow:!1,ignorePicking:!0}});var Ei=te.firstNotNull,Ai={x:0,y:2,z:1};function Pu(e,t){var r=new S.Mesh({geometry:new Si({useNativeLine:!1}),material:t,castShadow:!1,ignorePicking:!0,renderOrder:2}),i=new Lu;i.material.depthMask=!1;var n=new S.Node;n.add(r),n.add(i),this.rootNode=n,this.dim=e,this.linesMesh=r,this.labelsMesh=i,this.axisLineCoords=null,this.labelElements=[]}var Ru={x:"y",y:"x",z:"y"};Pu.prototype.update=function(e,t,r){var i=e.coordinateSystem,n=i.getAxis(this.dim),a=this.linesMesh.geometry,o=this.labelsMesh.geometry;a.convertToDynamicArray(!0),o.convertToDynamicArray(!0);var s=n.model,l=n.getExtent(),M=r.getDevicePixelRatio(),u=s.getModel("axisLine",e.getModel("axisLine")),h=s.getModel("axisTick",e.getModel("axisTick")),f=s.getModel("axisLabel",e.getModel("axisLabel")),c=u.get("lineStyle.color");if(u.get("show")){var d=u.getModel("lineStyle"),v=[0,0,0],p=[0,0,0],_=Ai[n.dim];v[_]=l[0],p[_]=l[1],this.axisLineCoords=[v,p];var g=S.parseColor(c),m=Ei(d.get("width"),1),y=Ei(d.get("opacity"),1);g[3]*=y,a.addLine(v,p,g,m*M)}if(h.get("show")){var x=h.getModel("lineStyle"),w=S.parseColor(Ei(x.get("color"),c)),m=Ei(x.get("width"),1);w[3]*=Ei(x.get("opacity"),1);for(var T=n.getTicksCoords(),E=h.get("length"),b=0;b<T.length;b++){var D=T[b].coord,v=[0,0,0],p=[0,0,0],_=Ai[n.dim],L=Ai[Ru[n.dim]];v[_]=p[_]=D,p[L]=E,a.addLine(v,p,w,m*M)}}this.labelElements=[];var M=r.getDevicePixelRatio();if(f.get("show"))for(var T=n.getTicksCoords(),R=s.get("data"),I=f.get("margin"),P=n.getViewLabels(),b=0;b<P.length;b++){var N=A.util.isObject(P[b].tick)?P[b].tick.value:P[b].tickValue,G=P[b].formattedLabel,H=P[b].rawLabel,D=n.dataToCoord(N),F=[0,0,0],_=Ai[n.dim],L=Ai[Ru[n.dim]];F[_]=F[_]=D,F[L]=I;var re=f;R&&R[N]&&R[N].textStyle&&(re=new A.Model(R[N].textStyle,f,s.ecModel));var B=Ei(re.get("color"),c),j=new A.graphic.Text({style:gn(re,{text:G,fill:typeof B=="function"?B(n.type==="category"?H:n.type==="value"?N+"":N,b):B,verticalAlign:"top",align:"left"})}),J=t.add(j),le=j.getBoundingRect();o.addSprite(F,[le.width*M,le.height*M],J),this.labelElements.push(j)}if(s.get("name")){var ve=s.getModel("nameTextStyle"),F=[0,0,0],_=Ai[n.dim],L=Ai[Ru[n.dim]],ne=Ei(ve.get("color"),c),ze=ve.get("borderColor"),m=ve.get("borderWidth");F[_]=F[_]=(l[0]+l[1])/2,F[L]=s.get("nameGap");var j=new A.graphic.Text({style:gn(ve,{text:s.get("name"),fill:ne,stroke:ze,lineWidth:m})}),J=t.add(j),le=j.getBoundingRect();o.addSprite(F,[le.width*M,le.height*M],J),j.__idx=this.labelElements.length,this.nameLabelElement=j}this.labelsMesh.material.set("textureAtlas",t.getTexture()),this.labelsMesh.material.set("uvScale",t.getCoordsScale()),a.convertToTypedArray(),o.convertToTypedArray()},Pu.prototype.setSpriteAlign=function(e,t,r){for(var i=r.getDevicePixelRatio(),n=this.labelsMesh.geometry,a=0;a<this.labelElements.length;a++){var o=this.labelElements[a],s=o.getBoundingRect();n.setSpriteAlign(a,[s.width*i,s.height*i],e,t)}var l=this.nameLabelElement;if(l){var s=l.getBoundingRect();n.setSpriteAlign(l.__idx,[s.width*i,s.height*i],e,t),n.dirty()}this.textAlign=e,this.textVerticalAlign=t};let ox=Pu,ds=`@export ecgl.lines3D.vertex

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

attribute vec3 position: POSITION;
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;

void main()
{
 gl_Position = worldViewProjection * vec4(position, 1.0);
 v_Color = a_Color;
}

@end

@export ecgl.lines3D.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

varying vec4 v_Color;

@import clay.util.srgb

void main()
{
#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(color * v_Color);
#else
 gl_FragColor = color * v_Color;
#endif
}
@end



@export ecgl.lines3D.clipNear

vec4 clipNear(vec4 p1, vec4 p2) {
 float n = (p1.w - near) / (p1.w - p2.w);
 return vec4(mix(p1.xy, p2.xy, n), -near, near);
}

@end

@export ecgl.lines3D.expandLine
#ifdef VERTEX_ANIMATION
 vec4 prevProj = worldViewProjection * vec4(mix(prevPositionPrev, positionPrev, percent), 1.0);
 vec4 currProj = worldViewProjection * vec4(mix(prevPosition, position, percent), 1.0);
 vec4 nextProj = worldViewProjection * vec4(mix(prevPositionNext, positionNext, percent), 1.0);
#else
 vec4 prevProj = worldViewProjection * vec4(positionPrev, 1.0);
 vec4 currProj = worldViewProjection * vec4(position, 1.0);
 vec4 nextProj = worldViewProjection * vec4(positionNext, 1.0);
#endif

 if (currProj.w < 0.0) {
 if (nextProj.w > 0.0) {
 currProj = clipNear(currProj, nextProj);
 }
 else if (prevProj.w > 0.0) {
 currProj = clipNear(currProj, prevProj);
 }
 }

 vec2 prevScreen = (prevProj.xy / abs(prevProj.w) + 1.0) * 0.5 * viewport.zw;
 vec2 currScreen = (currProj.xy / abs(currProj.w) + 1.0) * 0.5 * viewport.zw;
 vec2 nextScreen = (nextProj.xy / abs(nextProj.w) + 1.0) * 0.5 * viewport.zw;

 vec2 dir;
 float len = offset;
 if (position == positionPrev) {
 dir = normalize(nextScreen - currScreen);
 }
 else if (position == positionNext) {
 dir = normalize(currScreen - prevScreen);
 }
 else {
 vec2 dirA = normalize(currScreen - prevScreen);
 vec2 dirB = normalize(nextScreen - currScreen);

 vec2 tanget = normalize(dirA + dirB);

 float miter = 1.0 / max(dot(tanget, dirA), 0.5);
 len *= miter;
 dir = tanget;
 }

 dir = vec2(-dir.y, dir.x) * len;
 currScreen += dir;

 currProj.xy = (currScreen / viewport.zw - 0.5) * 2.0 * abs(currProj.w);
@end


@export ecgl.meshLines3D.vertex

attribute vec3 position: POSITION;
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float offset;
attribute vec4 a_Color : COLOR;

#ifdef VERTEX_ANIMATION
attribute vec3 prevPosition;
attribute vec3 prevPositionPrev;
attribute vec3 prevPositionNext;
uniform float percent : 1.0;
#endif

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform vec4 viewport : VIEWPORT;
uniform float near : NEAR;

varying vec4 v_Color;

@import ecgl.common.wireframe.vertexHeader

@import ecgl.lines3D.clipNear

void main()
{
 @import ecgl.lines3D.expandLine

 gl_Position = currProj;

 v_Color = a_Color;

 @import ecgl.common.wireframe.vertexMain
}
@end


@export ecgl.meshLines3D.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

varying vec4 v_Color;

@import ecgl.common.wireframe.fragmentHeader

@import clay.util.srgb

void main()
{
#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(color * v_Color);
#else
 gl_FragColor = color * v_Color;
#endif

 @import ecgl.common.wireframe.fragmentMain
}

@end`;var hv=te.firstNotNull;S.Shader.import(ds);var Mi={x:0,y:2,z:1};let sx=A.ComponentView.extend({type:"grid3D",__ecgl__:!0,init:function(e,t){var r=[["y","z","x",-1,"left"],["y","z","x",1,"right"],["x","y","z",-1,"bottom"],["x","y","z",1,"top"],["x","z","y",-1,"far"],["x","z","y",1,"near"]],i=["x","y","z"],n=new S.Material({shader:S.createShader("ecgl.color"),depthMask:!1,transparent:!0}),a=new S.Material({shader:S.createShader("ecgl.meshLines3D"),depthMask:!1,transparent:!0});n.define("fragment","DOUBLE_SIDED"),n.define("both","VERTEX_COLOR"),this.groupGL=new S.Node,this._control=new hs({zr:t.getZr()}),this._control.init(),this._faces=r.map(function(s){var l=new nx(s,a,n);return this.groupGL.add(l.rootNode),l},this),this._axes=i.map(function(s){var l=new ox(s,a);return this.groupGL.add(l.rootNode),l},this);var o=t.getDevicePixelRatio();this._axisLabelSurface=new Mu({width:256,height:256,devicePixelRatio:o}),this._axisLabelSurface.onupdate=function(){t.getZr().refresh()},this._axisPointerLineMesh=new S.Mesh({geometry:new Si({useNativeLine:!1}),material:a,castShadow:!1,ignorePicking:!0,renderOrder:3}),this.groupGL.add(this._axisPointerLineMesh),this._axisPointerLabelsSurface=new Mu({width:128,height:128,devicePixelRatio:o}),this._axisPointerLabelsMesh=new Lu({ignorePicking:!0,renderOrder:4,castShadow:!1}),this._axisPointerLabelsMesh.material.set("textureAtlas",this._axisPointerLabelsSurface.getTexture()),this.groupGL.add(this._axisPointerLabelsMesh),this._lightRoot=new S.Node,this._sceneHelper=new mn,this._sceneHelper.initLight(this._lightRoot)},render:function(e,t,r){this._model=e,this._api=r;var i=e.coordinateSystem;i.viewGL.add(this._lightRoot),e.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL);var n=this._control;n.setViewGL(i.viewGL);var a=e.getModel("viewControl");n.setFromViewControlModel(a,0),this._axisLabelSurface.clear(),n.off("update"),e.get("show")&&(this._faces.forEach(function(o){o.update(e,t,r)},this),this._axes.forEach(function(o){o.update(e,this._axisLabelSurface,r)},this)),n.on("update",this._onCameraChange.bind(this,e,r),this),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(e),i.viewGL.setPostEffect(e.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling")),this._initMouseHandler(e)},afterRender:function(e,t,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r)},showAxisPointer:function(e,t,r,i){this._doShowAxisPointer(),this._updateAxisPointer(i.value)},hideAxisPointer:function(e,t,r,i){this._doHideAxisPointer()},_initMouseHandler:function(e){var t=e.coordinateSystem,r=t.viewGL;e.get("show")&&e.get("axisPointer.show")?r.on("mousemove",this._updateAxisPointerOnMousePosition,this):r.off("mousemove",this._updateAxisPointerOnMousePosition)},_updateAxisPointerOnMousePosition:function(e){if(!e.target){for(var t=this._model,r=t.coordinateSystem,i=r.viewGL,n=i.castRay(e.offsetX,e.offsetY,new S.Ray),a,o=0;o<this._faces.length;o++){var s=this._faces[o];if(!s.rootNode.invisible){s.plane.normal.dot(i.camera.worldTransform.z)<0&&s.plane.normal.negate();var l=n.intersectPlane(s.plane);if(l){var u=r.getAxis(s.faceInfo[0]),h=r.getAxis(s.faceInfo[1]),f=Mi[s.faceInfo[0]],c=Mi[s.faceInfo[1]];u.contain(l.array[f])&&h.contain(l.array[c])&&(a=l)}}}if(a){var d=r.pointToData(a.array,[],!0);this._updateAxisPointer(d),this._doShowAxisPointer()}else this._doHideAxisPointer()}},_onCameraChange:function(e,t){e.get("show")&&(this._updateFaceVisibility(),this._updateAxisLinePosition());var r=this._control;t.dispatchAction({type:"grid3DChangeCamera",alpha:r.getAlpha(),beta:r.getBeta(),distance:r.getDistance(),center:r.getCenter(),from:this.uid,grid3DId:e.id})},_updateFaceVisibility:function(){var e=this._control.getCamera(),t=new S.Vector3;e.update();for(var r=0;r<this._faces.length/2;r++){for(var i=[],n=0;n<2;n++){var a=this._faces[r*2+n];a.rootNode.getWorldPosition(t),t.transformMat4(e.viewMatrix),i[n]=t.z}var o=i[0]>i[1]?0:1,s=this._faces[r*2+o],l=this._faces[r*2+1-o];s.rootNode.invisible=!0,l.rootNode.invisible=!1}},_updateAxisLinePosition:function(){var e=this._model.coordinateSystem,t=e.getAxis("x"),r=e.getAxis("y"),i=e.getAxis("z"),n=i.getExtentMax(),a=i.getExtentMin(),o=t.getExtentMin(),s=t.getExtentMax(),l=r.getExtentMax(),u=r.getExtentMin(),h=this._axes[0].rootNode,f=this._axes[1].rootNode,c=this._axes[2].rootNode,d=this._faces,v=d[4].rootNode.invisible?u:l,p=d[2].rootNode.invisible?n:a,_=d[0].rootNode.invisible?o:s,g=d[2].rootNode.invisible?n:a,m=d[0].rootNode.invisible?s:o,y=d[4].rootNode.invisible?u:l;h.rotation.identity(),f.rotation.identity(),c.rotation.identity(),d[4].rootNode.invisible&&(this._axes[0].flipped=!0,h.rotation.rotateX(Math.PI)),d[0].rootNode.invisible&&(this._axes[1].flipped=!0,f.rotation.rotateZ(Math.PI)),d[4].rootNode.invisible&&(this._axes[2].flipped=!0,c.rotation.rotateY(Math.PI)),h.position.set(0,p,v),f.position.set(_,g,0),c.position.set(m,0,y),h.update(),f.update(),c.update(),this._updateAxisLabelAlign()},_updateAxisLabelAlign:function(){var e=this._control.getCamera(),t=[new S.Vector4,new S.Vector4],r=new S.Vector4;this.groupGL.getWorldPosition(r),r.w=1,r.transformMat4(e.viewMatrix).transformMat4(e.projectionMatrix),r.x/=r.w,r.y/=r.w,this._axes.forEach(function(i){for(var n=i.axisLineCoords,a=i.labelsMesh.geometry,o=0;o<t.length;o++)t[o].setArray(n[o]),t[o].w=1,t[o].transformMat4(i.rootNode.worldTransform).transformMat4(e.viewMatrix).transformMat4(e.projectionMatrix),t[o].x/=t[o].w,t[o].y/=t[o].w;var s=t[1].x-t[0].x,l=t[1].y-t[0].y,u=(t[1].x+t[0].x)/2,h=(t[1].y+t[0].y)/2,f,c;Math.abs(l/s)<.5?(f="center",c=h>r.y?"bottom":"top"):(c="middle",f=u>r.x?"left":"right"),i.setSpriteAlign(f,c,this._api)},this)},_doShowAxisPointer:function(){this._axisPointerLineMesh.invisible&&(this._axisPointerLineMesh.invisible=!1,this._axisPointerLabelsMesh.invisible=!1,this._api.getZr().refresh())},_doHideAxisPointer:function(){this._axisPointerLineMesh.invisible||(this._axisPointerLineMesh.invisible=!0,this._axisPointerLabelsMesh.invisible=!0,this._api.getZr().refresh())},_updateAxisPointer:function(e){var t=this._model.coordinateSystem,r=t.dataToPoint(e),i=this._axisPointerLineMesh,n=i.geometry,a=this._model.getModel("axisPointer"),o=this._api.getDevicePixelRatio();n.convertToDynamicArray(!0);function s(b){return te.firstNotNull(b.model.get("axisPointer.show"),a.get("show"))}function l(b){var D=b.model.getModel("axisPointer",a),L=D.getModel("lineStyle"),M=S.parseColor(L.get("color")),R=hv(L.get("width"),1),I=hv(L.get("opacity"),1);return M[3]*=I,{color:M,lineWidth:R}}for(var u=0;u<this._faces.length;u++){var h=this._faces[u];if(!h.rootNode.invisible){for(var f=h.faceInfo,c=f[3]<0?t.getAxis(f[2]).getExtentMin():t.getAxis(f[2]).getExtentMax(),d=Mi[f[2]],v=0;v<2;v++){var p=f[v],_=f[1-v],g=t.getAxis(p),m=t.getAxis(_);if(s(g)){var y=[0,0,0],x=[0,0,0],w=Mi[p],T=Mi[_];y[w]=x[w]=r[w],y[d]=x[d]=c,y[T]=m.getExtentMin(),x[T]=m.getExtentMax();var E=l(g);n.addLine(y,x,E.color,E.lineWidth*o)}}if(s(t.getAxis(f[2]))){var y=r.slice(),x=r.slice();x[d]=c;var E=l(t.getAxis(f[2]));n.addLine(y,x,E.color,E.lineWidth*o)}}}n.convertToTypedArray(),this._updateAxisPointerLabelsMesh(e),this._api.getZr().refresh()},_updateAxisPointerLabelsMesh:function(e){var t=this._model,r=this._axisPointerLabelsMesh,i=this._axisPointerLabelsSurface,n=t.coordinateSystem,a=t.getModel("axisPointer");r.geometry.convertToDynamicArray(!0),i.clear();var o={x:"y",y:"x",z:"y"};this._axes.forEach(function(s,l){var u=n.getAxis(s.dim),h=u.model,f=h.getModel("axisPointer",a),c=f.getModel("label"),d=f.get("lineStyle.color");if(!(!c.get("show")||!f.get("show"))){var v=e[l],p=c.get("formatter"),_=u.scale.getLabel({value:v});if(p!=null)_=p(_,e);else if(u.scale.type==="interval"||u.scale.type==="log"){var g=A.number.getPrecisionSafe(u.scale.getTicks()[0]);_=v.toFixed(g+2)}var m=c.get("color"),y=new A.graphic.Text({style:gn(c,{text:_,fill:m||d,align:"left",verticalAlign:"top"})}),x=i.add(y),w=y.getBoundingRect(),T=this._api.getDevicePixelRatio(),E=s.rootNode.position.toArray(),b=Mi[o[s.dim]];E[b]+=(s.flipped?-1:1)*c.get("margin"),E[Mi[s.dim]]=u.dataToCoord(e[l]),r.geometry.addSprite(E,[w.width*T,w.height*T],x,s.textAlign,s.textVerticalAlign)}},this),i.getZr().refreshImmediately(),r.material.set("uvScale",i.getCoordsScale()),r.geometry.convertToTypedArray()},dispose:function(){this.groupGL.removeAll(),this._control.dispose(),this._axisLabelSurface.dispose(),this._axisPointerLabelsSurface.dispose()}});var lx=(function(){function e(t){this.type="cartesian",this._dimList=[],this._axes={},this.name=t||""}return e.prototype.getAxis=function(t){return this._axes[t]},e.prototype.getAxes=function(){return or(this._dimList,function(t){return this._axes[t]},this)},e.prototype.getAxesByScale=function(t){return t=t.toLowerCase(),_m(this.getAxes(),function(r){return r.scale.type===t})},e.prototype.addAxis=function(t){var r=t.dim;this._axes[r]=t,this._dimList.push(r)},e})();let fv=lx;function vs(e){fv.call(this,e),this.type="cartesian3D",this.dimensions=["x","y","z"],this.size=[0,0,0]}vs.prototype={constructor:vs,model:null,containPoint:function(e){return this.getAxis("x").contain(e[0])&&this.getAxis("y").contain(e[2])&&this.getAxis("z").contain(e[1])},containData:function(e){return this.getAxis("x").containData(e[0])&&this.getAxis("y").containData(e[1])&&this.getAxis("z").containData(e[2])},dataToPoint:function(e,t,r){return t=t||[],t[0]=this.getAxis("x").dataToCoord(e[0],r),t[2]=this.getAxis("y").dataToCoord(e[1],r),t[1]=this.getAxis("z").dataToCoord(e[2],r),t},pointToData:function(e,t,r){return t=t||[],t[0]=this.getAxis("x").coordToData(e[0],r),t[1]=this.getAxis("y").coordToData(e[2],r),t[2]=this.getAxis("z").coordToData(e[1],r),t}},A.util.inherits(vs,fv);let cv=vs;function ps(e,t,r){A.Axis.call(this,e,t,r)}ps.prototype={constructor:ps,getExtentMin:function(){var e=this._extent;return Math.min(e[0],e[1])},getExtentMax:function(){var e=this._extent;return Math.max(e[0],e[1])},calculateCategoryInterval:function(){return Math.floor(this.scale.count()/8)}},A.util.inherits(ps,A.Axis);let ux=ps;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Nu=function(e,t){return Nu=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},Nu(e,t)};function zA(e,t){Nu(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var dv=function(){return dv=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},dv.apply(this,arguments)};function HA(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(r[i]=e[i]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)t.indexOf(i[n])<0&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r}function VA(e,t,r,i){var n=arguments.length,a=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a}function kA(e,t){return function(r,i){t(r,i,e)}}function WA(e,t){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(e,t)}function XA(e,t,r,i){function n(a){return a instanceof r?a:new r(function(o){o(a)})}return new(r||(r=Promise))(function(a,o){function s(h){try{u(i.next(h))}catch(f){o(f)}}function l(h){try{u(i.throw(h))}catch(f){o(f)}}function u(h){h.done?a(h.value):n(h.value).then(s,l)}u((i=i.apply(e,t||[])).next())})}function jA(e,t){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},i,n,a,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(u){return function(h){return l([u,h])}}function l(u){if(i)throw new TypeError("Generator is already executing.");for(;r;)try{if(i=1,n&&(a=u[0]&2?n.return:u[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,u[1])).done)return a;switch(n=0,a&&(u=[u[0]&2,a.value]),u[0]){case 0:case 1:a=u;break;case 4:return r.label++,{value:u[1],done:!1};case 5:r.label++,n=u[1],u=[0];continue;case 7:u=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(u[0]===6||u[0]===2)){r=0;continue}if(u[0]===3&&(!a||u[1]>a[0]&&u[1]<a[3])){r.label=u[1];break}if(u[0]===6&&r.label<a[1]){r.label=a[1],a=u;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(u);break}a[2]&&r.ops.pop(),r.trys.pop();continue}u=t.call(e,r)}catch(h){u=[6,h],n=0}finally{i=a=0}if(u[0]&5)throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}}var vv=Object.create?(function(e,t,r,i){i===void 0&&(i=r),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[r]}})}):(function(e,t,r,i){i===void 0&&(i=r),e[i]=t[r]});function qA(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&vv(t,e,r)}function pv(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],i=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function hx(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var i=r.call(e),n,a=[],o;try{for(;(t===void 0||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(s){o={error:s}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a}function ZA(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(hx(arguments[t]));return e}function fx(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var i=Array(e),n=0,t=0;t<r;t++)for(var a=arguments[t],o=0,s=a.length;o<s;o++,n++)i[n]=a[o];return i}function _s(e){return this instanceof _s?(this.v=e,this):new _s(e)}function YA(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=r.apply(e,t||[]),n,a=[];return n={},o("next"),o("throw"),o("return"),n[Symbol.asyncIterator]=function(){return this},n;function o(c){i[c]&&(n[c]=function(d){return new Promise(function(v,p){a.push([c,d,v,p])>1||s(c,d)})})}function s(c,d){try{l(i[c](d))}catch(v){f(a[0][3],v)}}function l(c){c.value instanceof _s?Promise.resolve(c.value.v).then(u,h):f(a[0][2],c)}function u(c){s("next",c)}function h(c){s("throw",c)}function f(c,d){c(d),a.shift(),a.length&&s(a[0][0],a[0][1])}}function KA(e){var t,r;return t={},i("next"),i("throw",function(n){throw n}),i("return"),t[Symbol.iterator]=function(){return this},t;function i(n,a){t[n]=e[n]?function(o){return(r=!r)?{value:_s(e[n](o)),done:n==="return"}:a?a(o):o}:a}}function QA(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],r;return t?t.call(e):(e=typeof pv=="function"?pv(e):e[Symbol.iterator](),r={},i("next"),i("throw"),i("return"),r[Symbol.asyncIterator]=function(){return this},r);function i(a){r[a]=e[a]&&function(o){return new Promise(function(s,l){o=e[a](o),n(s,l,o.done,o.value)})}}function n(a,o,s,l){Promise.resolve(l).then(function(u){a({value:u,done:s})},o)}}function JA(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var cx=Object.create?(function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}):function(e,t){e.default=t};function $A(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.prototype.hasOwnProperty.call(e,r)&&vv(t,e,r);return cx(t,e),t}function eM(e){return e&&e.__esModule?e:{default:e}}function tM(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)}function rM(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r}var dx=".",Di="___EC__COMPONENT__CONTAINER___",_v="___EC__EXTENDED_CLASS___";function gs(e){var t={main:"",sub:""};if(e){var r=e.split(dx);t.main=r[0]||"",t.sub=r[1]||""}return t}function vx(e){ai(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(e),'componentType "'+e+'" illegal')}function iM(e){return!!(e&&e[_v])}function px(e,t){e.$constructor=e,e.extend=function(r){xe(t,function(a){r[a]||console.warn("Method `"+a+"` should be implemented"+(r.type?" in "+r.type:"")+".")});var i=this;function n(){for(var a=[],o=0;o<arguments.length;o++)a[o]=arguments[o];if(r.$constructor)r.$constructor.apply(this,arguments);else if(!_x(i))i.apply(this,arguments);else{var s=Zn(n.prototype,new(i.bind.apply(i,fx([void 0],a))));return s}}return n[_v]=!0,de(n.prototype,r),n.extend=this.extend,n.superCall=yx,n.superApply=xx,pm(n,this),n.superClass=i,n}}function _x(e){return typeof e=="function"&&/^class\s/.test(Function.prototype.toString.call(e))}function nM(e,t){e.extend=t.extend}var gx=Math.round(Math.random()*10);function mx(e){var t=["__\0is_clz",gx++].join("_");e.prototype[t]=!0,ai(!e.isInstance,'The method "is" can not be defined.'),e.isInstance=function(r){return!!(r&&r[t])}}function yx(e,t){for(var r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];return this.superClass.prototype[t].apply(e,r)}function xx(e,t,r){return this.superClass.prototype[t].apply(e,r)}function aM(e){var t={};e.registerClass=function(i){var n=i.type||i.prototype.type;if(n){vx(n),i.prototype.type=n;var a=gs(n);if(!a.sub)t[a.main]&&console.warn(a.main+" exists."),t[a.main]=i;else if(a.sub!==Di){var o=r(a);o[a.sub]=i}}return i},e.getClass=function(i,n,a){var o=t[i];if(o&&o[Di]&&(o=n?o[n]:null),a&&!o)throw new Error(n?"Component "+i+"."+(n||"")+" is used but not imported.":i+".type should be specified.");return o},e.getClassesByMainType=function(i){var n=gs(i),a=[],o=t[n.main];return o&&o[Di]?xe(o,function(s,l){l!==Di&&a.push(s)}):a.push(o),a},e.hasClass=function(i){var n=gs(i);return!!t[n.main]},e.getAllClassMainTypes=function(){var i=[];return xe(t,function(n,a){i.push(a)}),i},e.hasSubTypes=function(i){var n=gs(i),a=t[n.main];return a&&a[Di]};function r(i){var n=t[i.main];return(!n||!n[Di])&&(n=t[i.main]={},n[Di]=!0),n}}function Iu(e,t){for(var r=0;r<e.length;r++)e[r][1]||(e[r][1]=e[r][0]);return t=t||!1,function(i,n,a){for(var o={},s=0;s<e.length;s++){var l=e[s][1];if(!(n&&zt(n,l)>=0||a&&zt(a,l)<0)){var u=i.getShallow(l,t);u!=null&&(o[e[s][0]]=u)}}return o}}var Tx=[["fill","color"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["opacity"],["shadowColor"]],Sx=Iu(Tx),bx=(function(){function e(){}return e.prototype.getAreaStyle=function(t,r){return Sx(this,t,r)},e})(),Ex=["textStyle","color"],Ou=new qo,Ax=(function(){function e(){}return e.prototype.getTextColor=function(t){var r=this.ecModel;return this.getShallow("color")||(!t&&r?r.get(Ex):null)},e.prototype.getFont=function(){return ex({fontStyle:this.getShallow("fontStyle"),fontWeight:this.getShallow("fontWeight"),fontSize:this.getShallow("fontSize"),fontFamily:this.getShallow("fontFamily")},this.ecModel)},e.prototype.getTextRect=function(t){return Ou.useStyle({text:t,fontStyle:this.getShallow("fontStyle"),fontWeight:this.getShallow("fontWeight"),fontSize:this.getShallow("fontSize"),fontFamily:this.getShallow("fontFamily"),verticalAlign:this.getShallow("verticalAlign")||this.getShallow("baseline"),padding:this.getShallow("padding"),lineHeight:this.getShallow("lineHeight"),rich:this.getShallow("rich")}),Ou.update(),Ou.getBoundingRect()},e})();let Mx=Ax;var Dx=[["lineWidth","width"],["stroke","color"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["lineDash","type"],["lineDashOffset","dashOffset"],["lineCap","cap"],["lineJoin","join"],["miterLimit"]],Cx=Iu(Dx),Lx=(function(){function e(){}return e.prototype.getLineStyle=function(t){return Cx(this,t)},e})(),Px=[["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["lineDash","borderType"],["lineDashOffset","borderDashOffset"],["lineCap","borderCap"],["lineJoin","borderJoin"],["miterLimit","borderMiterLimit"]],Rx=Iu(Px),Nx=(function(){function e(){}return e.prototype.getItemStyle=function(t,r){return Rx(this,t,r)},e})(),Ci=(function(){function e(t,r,i){this.parentModel=r,this.ecModel=i,this.option=t}return e.prototype.init=function(t,r,i){for(var n=[],a=3;a<arguments.length;a++)n[a-3]=arguments[a]},e.prototype.mergeOption=function(t,r){Wn(this.option,t,!0)},e.prototype.get=function(t,r){return t==null?this.option:this._doGet(this.parsePath(t),!r&&this.parentModel)},e.prototype.getShallow=function(t,r){var i=this.option,n=i==null?i:i[t];if(n==null&&!r){var a=this.parentModel;a&&(n=a.getShallow(t))}return n},e.prototype.getModel=function(t,r){var i=t!=null,n=i?this.parsePath(t):null,a=i?this._doGet(n):this.option;return r=r||this.parentModel&&this.parentModel.getModel(this.resolveParentPath(n)),new e(a,r,this.ecModel)},e.prototype.isEmpty=function(){return this.option==null},e.prototype.restoreData=function(){},e.prototype.clone=function(){var t=this.constructor;return new t(Rt(this.option))},e.prototype.parsePath=function(t){return typeof t=="string"?t.split("."):t},e.prototype.resolveParentPath=function(t){return t},e.prototype.isAnimationEnabled=function(){if(!oa.node&&this.option){if(this.option.animation!=null)return!!this.option.animation;if(this.parentModel)return this.parentModel.isAnimationEnabled()}},e.prototype._doGet=function(t,r){var i=this.option;if(!t)return i;for(var n=0;n<t.length&&!(t[n]&&(i=i&&typeof i=="object"?i[t[n]]:null,i==null));n++);return i==null&&r&&(i=r._doGet(this.resolveParentPath(t),r.parentModel)),i},e})();px(Ci),mx(Ci),Pr(Ci,Lx),Pr(Ci,Nx),Pr(Ci,bx),Pr(Ci,Mx);let gv=Ci,Ix={time:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],monthAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayOfWeek:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayOfWeekAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},legend:{selector:{all:"All",inverse:"Inv"}},toolbox:{brush:{title:{rect:"Box Select",polygon:"Lasso Select",lineX:"Horizontally Select",lineY:"Vertically Select",keep:"Keep Selections",clear:"Clear Selections"}},dataView:{title:"Data View",lang:["Data View","Close","Refresh"]},dataZoom:{title:{zoom:"Zoom",back:"Zoom Reset"}},magicType:{title:{line:"Switch to Line Chart",bar:"Switch to Bar Chart",stack:"Stack",tiled:"Tile"}},restore:{title:"Restore"},saveAsImage:{title:"Save as Image",lang:["Right Click to Save Image"]}},series:{typeNames:{pie:"Pie chart",bar:"Bar chart",line:"Line chart",scatter:"Scatter plot",effectScatter:"Ripple scatter plot",radar:"Radar chart",tree:"Tree",treemap:"Treemap",boxplot:"Boxplot",candlestick:"Candlestick",k:"K line chart",heatmap:"Heat map",map:"Map",parallel:"Parallel coordinate map",lines:"Line graph",graph:"Relationship graph",sankey:"Sankey diagram",funnel:"Funnel chart",gauge:"Gauge",pictorialBar:"Pictorial bar",themeRiver:"Theme River Map",sunburst:"Sunburst"}},aria:{general:{withTitle:'This is a chart about "{title}"',withoutTitle:"This is a chart"},series:{single:{prefix:"",withName:" with type {seriesType} named {seriesName}.",withoutName:" with type {seriesType}."},multiple:{prefix:". It consists of {seriesCount} series count.",withName:" The {seriesId} series is a {seriesType} representing {seriesName}.",withoutName:" The {seriesId} series is a {seriesType}.",separator:{middle:"",end:""}}},data:{allData:"The data is as follows: ",partialData:"The first {displayCnt} items are: ",withName:"the data for {name} is {value}",withoutName:"{value}",separator:{middle:", ",end:". "}}}},Ox={time:{month:["\u4E00\u6708","\u4E8C\u6708","\u4E09\u6708","\u56DB\u6708","\u4E94\u6708","\u516D\u6708","\u4E03\u6708","\u516B\u6708","\u4E5D\u6708","\u5341\u6708","\u5341\u4E00\u6708","\u5341\u4E8C\u6708"],monthAbbr:["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708","7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"],dayOfWeek:["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"],dayOfWeekAbbr:["\u65E5","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D"]},legend:{selector:{all:"\u5168\u9009",inverse:"\u53CD\u9009"}},toolbox:{brush:{title:{rect:"\u77E9\u5F62\u9009\u62E9",polygon:"\u5708\u9009",lineX:"\u6A2A\u5411\u9009\u62E9",lineY:"\u7EB5\u5411\u9009\u62E9",keep:"\u4FDD\u6301\u9009\u62E9",clear:"\u6E05\u9664\u9009\u62E9"}},dataView:{title:"\u6570\u636E\u89C6\u56FE",lang:["\u6570\u636E\u89C6\u56FE","\u5173\u95ED","\u5237\u65B0"]},dataZoom:{title:{zoom:"\u533A\u57DF\u7F29\u653E",back:"\u533A\u57DF\u7F29\u653E\u8FD8\u539F"}},magicType:{title:{line:"\u5207\u6362\u4E3A\u6298\u7EBF\u56FE",bar:"\u5207\u6362\u4E3A\u67F1\u72B6\u56FE",stack:"\u5207\u6362\u4E3A\u5806\u53E0",tiled:"\u5207\u6362\u4E3A\u5E73\u94FA"}},restore:{title:"\u8FD8\u539F"},saveAsImage:{title:"\u4FDD\u5B58\u4E3A\u56FE\u7247",lang:["\u53F3\u952E\u53E6\u5B58\u4E3A\u56FE\u7247"]}},series:{typeNames:{pie:"\u997C\u56FE",bar:"\u67F1\u72B6\u56FE",line:"\u6298\u7EBF\u56FE",scatter:"\u6563\u70B9\u56FE",effectScatter:"\u6D9F\u6F2A\u6563\u70B9\u56FE",radar:"\u96F7\u8FBE\u56FE",tree:"\u6811\u56FE",treemap:"\u77E9\u5F62\u6811\u56FE",boxplot:"\u7BB1\u578B\u56FE",candlestick:"K\u7EBF\u56FE",k:"K\u7EBF\u56FE",heatmap:"\u70ED\u529B\u56FE",map:"\u5730\u56FE",parallel:"\u5E73\u884C\u5750\u6807\u56FE",lines:"\u7EBF\u56FE",graph:"\u5173\u7CFB\u56FE",sankey:"\u6851\u57FA\u56FE",funnel:"\u6F0F\u6597\u56FE",gauge:"\u4EEA\u8868\u76D8\u56FE",pictorialBar:"\u8C61\u5F62\u67F1\u56FE",themeRiver:"\u4E3B\u9898\u6CB3\u6D41\u56FE",sunburst:"\u65ED\u65E5\u56FE"}},aria:{general:{withTitle:"\u8FD9\u662F\u4E00\u4E2A\u5173\u4E8E\u201C{title}\u201D\u7684\u56FE\u8868\u3002",withoutTitle:"\u8FD9\u662F\u4E00\u4E2A\u56FE\u8868\uFF0C"},series:{single:{prefix:"",withName:"\u56FE\u8868\u7C7B\u578B\u662F{seriesType}\uFF0C\u8868\u793A{seriesName}\u3002",withoutName:"\u56FE\u8868\u7C7B\u578B\u662F{seriesType}\u3002"},multiple:{prefix:"\u5B83\u7531{seriesCount}\u4E2A\u56FE\u8868\u7CFB\u5217\u7EC4\u6210\u3002",withName:"\u7B2C{seriesId}\u4E2A\u7CFB\u5217\u662F\u4E00\u4E2A\u8868\u793A{seriesName}\u7684{seriesType}\uFF0C",withoutName:"\u7B2C{seriesId}\u4E2A\u7CFB\u5217\u662F\u4E00\u4E2A{seriesType}\uFF0C",separator:{middle:"\uFF1B",end:"\u3002"}}},data:{allData:"\u5176\u6570\u636E\u662F\u2014\u2014",partialData:"\u5176\u4E2D\uFF0C\u524D{displayCnt}\u9879\u662F\u2014\u2014",withName:"{name}\u7684\u6570\u636E\u662F{value}",withoutName:"{value}",separator:{middle:"\uFF0C",end:""}}}};var ms="ZH",Bu="EN",wa=Bu,ys={},Fu={},Bx=oa.domSupported?(function(){var e=(document.documentElement.lang||navigator.language||navigator.browserLanguage).toUpperCase();return e.indexOf(ms)>-1?ms:wa})():wa;function mv(e,t){e=e.toUpperCase(),Fu[e]=new gv(t),ys[e]=t}function oM(e){if(mr(e)){var t=ys[e.toUpperCase()]||{};return e===ms||e===Bu?Rt(t):Wn(Rt(t),Rt(ys[wa]),!1)}else return Wn(Rt(e),Rt(ys[wa]),!1)}function Fx(e){return Fu[e]}function Gx(){return Fu[wa]}mv(Bu,Ix),mv(ms,Ox);var Ux=1e3,zx=Ux*60,Hx=zx*60,Vx=Hx*24,sM=Vx*365,Sa={year:"{yyyy}",month:"{MMM}",day:"{d}",hour:"{HH}:{mm}",minute:"{HH}:{mm}",second:"{HH}:{mm}:{ss}",millisecond:"{hh}:{mm}:{ss} {SSS}",none:"{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}"},xs="{yyyy}-{MM}-{dd}",lM={year:"{yyyy}",month:"{yyyy}-{MM}",day:xs,hour:xs+" "+Sa.hour,minute:xs+" "+Sa.minute,second:xs+" "+Sa.second,millisecond:Sa.none},Gu=["year","month","day","hour","minute","second","millisecond"],kx=["year","half-year","quarter","month","week","half-week","day","half-day","quarter-day","hour","minute","second","millisecond"];function It(e,t){return e+="","0000".substr(0,t-e.length)+e}function Wx(e){switch(e){case"half-year":case"quarter":return"month";case"week":case"half-week":return"day";case"half-day":case"quarter-day":return"hour";default:return e}}function uM(e){return e===Wx(e)}function hM(e){switch(e){case"year":case"month":return"day";case"millisecond":return"millisecond";default:return"second"}}function yv(e,t,r,i){var n=pa(e),a=n[Tv(r)](),o=n[ba(r)]()+1,s=Math.floor((o-1)/4)+1,l=n[Uu(r)](),u=n["get"+(r?"UTC":"")+"Day"](),h=n[Ts(r)](),f=(h-1)%12+1,c=n[zu(r)](),d=n[Hu(r)](),v=n[Vu(r)](),p=i instanceof gv?i:Fx(i||Bx)||Gx(),_=p.getModel("time"),g=_.get("month"),m=_.get("monthAbbr"),y=_.get("dayOfWeek"),x=_.get("dayOfWeekAbbr");return(t||"").replace(/{yyyy}/g,a+"").replace(/{yy}/g,a%100+"").replace(/{Q}/g,s+"").replace(/{MMMM}/g,g[o-1]).replace(/{MMM}/g,m[o-1]).replace(/{MM}/g,It(o,2)).replace(/{M}/g,o+"").replace(/{dd}/g,It(l,2)).replace(/{d}/g,l+"").replace(/{eeee}/g,y[u]).replace(/{ee}/g,x[u]).replace(/{e}/g,u+"").replace(/{HH}/g,It(h,2)).replace(/{H}/g,h+"").replace(/{hh}/g,It(f+"",2)).replace(/{h}/g,f+"").replace(/{mm}/g,It(c,2)).replace(/{m}/g,c+"").replace(/{ss}/g,It(d,2)).replace(/{s}/g,d+"").replace(/{SSS}/g,It(v,3)).replace(/{S}/g,v+"")}function fM(e,t,r,i,n){var a=null;if(typeof r=="string")a=r;else if(typeof r=="function")a=r(e.value,t,{level:e.level});else{var o=de({},Sa);if(e.level>0)for(var s=0;s<Gu.length;++s)o[Gu[s]]="{primary|"+o[Gu[s]]+"}";var l=r?r.inherit===!1?r:Jt(r,o):o,u=xv(e.value,n);if(l[u])a=l[u];else if(l.inherit){for(var h=kx.indexOf(u),s=h-1;s>=0;--s)if(l[u]){a=l[u];break}a=a||o.none}if($t(a)){var f=e.level==null?0:e.level>=0?e.level:a.length+e.level;f=Math.min(f,a.length-1),a=a[f]}}return yv(new Date(e.value),a,n,i)}function xv(e,t){var r=pa(e),i=r[ba(t)]()+1,n=r[Uu(t)](),a=r[Ts(t)](),o=r[zu(t)](),s=r[Hu(t)](),l=r[Vu(t)](),u=l===0,h=u&&s===0,f=h&&o===0,c=f&&a===0,d=c&&n===1,v=d&&i===1;return v?"year":d?"month":c?"day":f?"hour":h?"minute":u?"second":"millisecond"}function cM(e,t,r){var i=typeof e=="number"?pa(e):e;switch(t=t||xv(e,r),t){case"year":return i[Tv(r)]();case"half-year":return i[ba(r)]()>=6?1:0;case"quarter":return Math.floor((i[ba(r)]()+1)/4);case"month":return i[ba(r)]();case"day":return i[Uu(r)]();case"half-day":return i[Ts(r)]()/24;case"hour":return i[Ts(r)]();case"minute":return i[zu(r)]();case"second":return i[Hu(r)]();case"millisecond":return i[Vu(r)]()}}function Tv(e){return e?"getUTCFullYear":"getFullYear"}function ba(e){return e?"getUTCMonth":"getMonth"}function Uu(e){return e?"getUTCDate":"getDate"}function Ts(e){return e?"getUTCHours":"getHours"}function zu(e){return e?"getUTCMinutes":"getMinutes"}function Hu(e){return e?"getUTCSeconds":"getSeconds"}function Vu(e){return e?"getUTCSeconds":"getSeconds"}function dM(e){return e?"setUTCFullYear":"setFullYear"}function vM(e){return e?"setUTCMonth":"setMonth"}function pM(e){return e?"setUTCDate":"setDate"}function _M(e){return e?"setUTCHours":"setHours"}function gM(e){return e?"setUTCMinutes":"setMinutes"}function mM(e){return e?"setUTCSeconds":"setSeconds"}function yM(e){return e?"setUTCSeconds":"setSeconds"}function xM(e,t,r,i,n,a,o,s){Jc("getTextRect is deprecated.");var l=new qo({style:{text:e,font:t,align:r,verticalAlign:i,padding:n,rich:a,overflow:o?"truncate":null,lineHeight:s}});return l.getBoundingRect()}function Xx(e){if(!Yc(e))return mr(e)?e:"-";var t=(e+"").split(".");return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(t.length>1?"."+t[1]:"")}function TM(e,t){return e=(e||"").toLowerCase().replace(/-(.)/g,function(r,i){return i.toUpperCase()}),t&&e&&(e=e.charAt(0).toUpperCase()+e.slice(1)),e}var wv=Of,jx=/([&<>"'])/g,qx={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ws(e){return e==null?"":(e+"").replace(jx,function(t,r){return qx[r]})}function wM(e,t,r){var i="{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}";function n(h){return h&&bl(h)?h:"-"}function a(h){return!!(h!=null&&!isNaN(h)&&isFinite(h))}var o=t==="time",s=e instanceof Date;if(o||s){var l=o?pa(e):e;if(isNaN(+l)){if(s)return"-"}else return yv(l,i,r)}if(t==="ordinal")return mo(e)?n(e):mm(e)&&a(e)?e+"":"-";var u=Zc(e);return a(u)?Xx(u):mo(e)?n(e):"-"}var Sv=["a","b","c","d","e","f","g"],ku=function(e,t){return"{"+e+(t??"")+"}"};function SM(e,t,r){$t(t)||(t=[t]);var i=t.length;if(!i)return"";for(var n=t[0].$vars||[],a=0;a<n.length;a++){var o=Sv[a];e=e.replace(ku(o),ku(o,0))}for(var s=0;s<i;s++)for(var l=0;l<n.length;l++){var u=t[s][n[l]];e=e.replace(ku(Sv[l],s),r?ws(u):u)}return e}function bM(e,t,r){return xe(t,function(i,n){e=e.replace("{"+n+"}",r?ws(i):i)}),e}function EM(e,t){var r=mr(e)?{color:e,extraCssText:t}:e||{},i=r.color,n=r.type;t=r.extraCssText;var a=r.renderMode||"html";if(!i)return"";if(a==="html")return n==="subItem"?'<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:'+ws(i)+";"+(t||"")+'"></span>':'<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:'+ws(i)+";"+(t||"")+'"></span>';var o=r.markerId||"markerX";return{renderMode:a,content:"{"+o+"|}  ",style:n==="subItem"?{width:4,height:4,borderRadius:2,backgroundColor:i}:{width:10,height:10,borderRadius:5,backgroundColor:i}}}function AM(e,t,r){_a("echarts.format.formatTime","echarts.time.format"),(e==="week"||e==="month"||e==="quarter"||e==="half-year"||e==="year")&&(e=`MM-dd
yyyy`);var i=pa(t),n=r?"UTC":"",a=i["get"+n+"FullYear"](),o=i["get"+n+"Month"]()+1,s=i["get"+n+"Date"](),l=i["get"+n+"Hours"](),u=i["get"+n+"Minutes"](),h=i["get"+n+"Seconds"](),f=i["get"+n+"Milliseconds"]();return e=e.replace("MM",It(o,2)).replace("M",o).replace("yyyy",a).replace("yy",a%100+"").replace("dd",It(s,2)).replace("d",s).replace("hh",It(l,2)).replace("h",l).replace("mm",It(u,2)).replace("m",u).replace("ss",It(h,2)).replace("s",h).replace("SSS",It(f,3)),e}function MM(e){return e&&e.charAt(0).toUpperCase()+e.substr(1)}function DM(e,t){return t=t||"transparent",mr(e)?e:st(e)&&e.colorStops&&(e.colorStops[0]||{}).color||t}function CM(e,t){if(t==="_blank"||t==="blank"){var r=window.open();r.opener=null,r.location.href=e}else window.open(e,t)}var Ss=xe,Zx=["left","right","top","bottom","width","height"],Li=[["width","left","right"],["height","top","bottom"]];function Wu(e,t,r,i,n){var a=0,o=0;i==null&&(i=1/0),n==null&&(n=1/0);var s=0;t.eachChild(function(l,u){var h=l.getBoundingRect(),f=t.childAt(u+1),c=f&&f.getBoundingRect(),d,v;if(e==="horizontal"){var p=h.width+(c?-c.x+h.x:0);d=a+p,d>i||l.newline?(a=0,d=p,o+=s+r,s=h.height):s=Math.max(s,h.height)}else{var _=h.height+(c?-c.y+h.y:0);v=o+_,v>n||l.newline?(a+=s+r,o=0,v=_,s=h.width):s=Math.max(s,h.width)}l.newline||(l.x=a,l.y=o,l.markRedraw(),e==="horizontal"?a=d+r:o=v+r)})}var LM=Wu,PM=Xn(Wu,"vertical"),RM=Xn(Wu,"horizontal");function NM(e,t,r){var i=t.width,n=t.height,a=cr(e.left,i),o=cr(e.top,n),s=cr(e.right,i),l=cr(e.bottom,n);return(isNaN(a)||isNaN(parseFloat(e.left)))&&(a=0),(isNaN(s)||isNaN(parseFloat(e.right)))&&(s=i),(isNaN(o)||isNaN(parseFloat(e.top)))&&(o=0),(isNaN(l)||isNaN(parseFloat(e.bottom)))&&(l=n),r=wv(r||0),{width:Math.max(s-a-r[1]-r[3],0),height:Math.max(l-o-r[0]-r[2],0)}}function Ea(e,t,r){r=wv(r||0);var i=t.width,n=t.height,a=cr(e.left,i),o=cr(e.top,n),s=cr(e.right,i),l=cr(e.bottom,n),u=cr(e.width,i),h=cr(e.height,n),f=r[2]+r[0],c=r[1]+r[3],d=e.aspect;switch(isNaN(u)&&(u=i-s-c-a),isNaN(h)&&(h=n-l-f-o),d!=null&&(isNaN(u)&&isNaN(h)&&(d>i/n?u=i*.8:h=n*.8),isNaN(u)&&(u=d*h),isNaN(h)&&(h=u/d)),isNaN(a)&&(a=i-s-u-c),isNaN(o)&&(o=n-l-h-f),e.left||e.right){case"center":a=i/2-u/2-r[3];break;case"right":a=i-u-c;break}switch(e.top||e.bottom){case"middle":case"center":o=n/2-h/2-r[0];break;case"bottom":o=n-h-f;break}a=a||0,o=o||0,isNaN(u)&&(u=i-c-a-(s||0)),isNaN(h)&&(h=n-f-o-(l||0));var v=new nt(a+r[3],o+r[0],u,h);return v.margin=r,v}function IM(e,t,r,i,n){var a=!n||!n.hv||n.hv[0],o=!n||!n.hv||n.hv[1],s=n&&n.boundingMode||"all";if(!(!a&&!o)){var l;if(s==="raw")l=e.type==="group"?new nt(0,0,+t.width||0,+t.height||0):e.getBoundingRect();else if(l=e.getBoundingRect(),e.needLocalTransform()){var u=e.getLocalTransform();l=l.clone(),l.applyTransform(u)}var h=Ea(Jt({width:l.width,height:l.height},t),r,i),f=a?h.x-l.x:0,c=o?h.y-l.y:0;s==="raw"?(e.x=f,e.y=c):(e.x+=f,e.y+=c),e.markRedraw()}}function OM(e,t){return e[Li[t][0]]!=null||e[Li[t][1]]!=null&&e[Li[t][2]]!=null}function BM(e){var t=e.layoutMode||e.constructor.layoutMode;return st(t)?t:t?{type:t}:null}function FM(e,t,r){var i=r&&r.ignoreSize;!$t(i)&&(i=[i,i]);var n=o(Li[0],0),a=o(Li[1],1);u(Li[0],e,n),u(Li[1],e,a);function o(h,f){var c={},d=0,v={},p=0,_=2;if(Ss(h,function(y){v[y]=e[y]}),Ss(h,function(y){s(t,y)&&(c[y]=v[y]=t[y]),l(c,y)&&d++,l(v,y)&&p++}),i[f])return l(t,h[1])?v[h[2]]=null:l(t,h[2])&&(v[h[1]]=null),v;if(p===_||!d)return v;if(d>=_)return c;for(var g=0;g<h.length;g++){var m=h[g];if(!s(c,m)&&s(e,m)){c[m]=e[m];break}}return c}function s(h,f){return h.hasOwnProperty(f)}function l(h,f){return h[f]!=null&&h[f]!=="auto"}function u(h,f,c){Ss(h,function(d){f[d]=c[d]})}}function GM(e){return Yx({},e)}function Yx(e,t){return t&&e&&Ss(Zx,function(r){t.hasOwnProperty(r)&&(e[r]=t[r])}),e}var Xu=function(){this._pool={},this._allocatedTextures=[]};Xu.prototype={constructor:Xu,get:function(e){var t=Ev(e);this._pool.hasOwnProperty(t)||(this._pool[t]=[]);var r=this._pool[t];if(!r.length){var i=new ee(e);return this._allocatedTextures.push(i),i}return r.pop()},put:function(e){var t=Ev(e);this._pool.hasOwnProperty(t)||(this._pool[t]=[]);var r=this._pool[t];r.push(e)},clear:function(e){for(var t=0;t<this._allocatedTextures.length;t++)this._allocatedTextures[t].dispose(e);this._pool={},this._allocatedTextures=[]}};var bv={width:512,height:512,type:O.UNSIGNED_BYTE,format:O.RGBA,wrapS:O.CLAMP_TO_EDGE,wrapT:O.CLAMP_TO_EDGE,minFilter:O.LINEAR_MIPMAP_LINEAR,magFilter:O.LINEAR,useMipmap:!0,anisotropic:1,flipY:!0,unpackAlignment:4,premultiplyAlpha:!1},ju=Object.keys(bv);function Ev(e){tt.defaultsWithPropList(e,bv,ju),Kx(e);for(var t="",r=0;r<ju.length;r++){var i=ju[r],n=e[i].toString();t+=n}return t}function Kx(e){var t=Qx(e.width,e.height);e.format===O.DEPTH_COMPONENT&&(e.useMipmap=!1),(!t||!e.useMipmap)&&(e.minFilter==O.NEAREST_MIPMAP_NEAREST||e.minFilter==O.NEAREST_MIPMAP_LINEAR?e.minFilter=O.NEAREST:(e.minFilter==O.LINEAR_MIPMAP_LINEAR||e.minFilter==O.LINEAR_MIPMAP_NEAREST)&&(e.minFilter=O.LINEAR)),t||(e.wrapS=O.CLAMP_TO_EDGE,e.wrapT=O.CLAMP_TO_EDGE)}function Qx(e,t){return(e&e-1)===0&&(t&t-1)===0}let Av=Xu,Jx=`@export clay.sm.depth.vertex
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
attribute vec3 position : POSITION;
attribute vec2 texcoord : TEXCOORD_0;
uniform vec2 uvRepeat = vec2(1.0, 1.0);
uniform vec2 uvOffset = vec2(0.0, 0.0);
@import clay.chunk.skinning_header
@import clay.chunk.instancing_header
varying vec4 v_ViewPosition;
varying vec2 v_Texcoord;
void main(){
 vec4 P = vec4(position, 1.0);
#ifdef SKINNING
 @import clay.chunk.skin_matrix
 P = skinMatrixWS * P;
#endif
#ifdef INSTANCING
 @import clay.chunk.instancing_matrix
 P = instanceMat * P;
#endif
 v_ViewPosition = worldViewProjection * P;
 gl_Position = v_ViewPosition;
 v_Texcoord = texcoord * uvRepeat + uvOffset;
}
@end
@export clay.sm.depth.fragment
varying vec4 v_ViewPosition;
varying vec2 v_Texcoord;
uniform float bias : 0.001;
uniform float slopeScale : 1.0;
uniform sampler2D alphaMap;
uniform float alphaCutoff: 0.0;
@import clay.util.encode_float
void main(){
 float depth = v_ViewPosition.z / v_ViewPosition.w;
 if (alphaCutoff > 0.0) {
 if (texture2D(alphaMap, v_Texcoord).a <= alphaCutoff) {
 discard;
 }
 }
#ifdef USE_VSM
 depth = depth * 0.5 + 0.5;
 float moment1 = depth;
 float moment2 = depth * depth;
 #ifdef SUPPORT_STANDARD_DERIVATIVES
 float dx = dFdx(depth);
 float dy = dFdy(depth);
 moment2 += 0.25*(dx*dx+dy*dy);
 #endif
 gl_FragColor = vec4(moment1, moment2, 0.0, 1.0);
#else
 #ifdef SUPPORT_STANDARD_DERIVATIVES
 float dx = dFdx(depth);
 float dy = dFdy(depth);
 depth += sqrt(dx*dx + dy*dy) * slopeScale + bias;
 #else
 depth += bias;
 #endif
 gl_FragColor = encodeFloat(depth * 0.5 + 0.5);
#endif
}
@end
@export clay.sm.debug_depth
uniform sampler2D depthMap;
varying vec2 v_Texcoord;
@import clay.util.decode_float
void main() {
 vec4 tex = texture2D(depthMap, v_Texcoord);
#ifdef USE_VSM
 gl_FragColor = vec4(tex.rgb, 1.0);
#else
 float depth = decodeFloat(tex);
 gl_FragColor = vec4(depth, depth, depth, 1.0);
#endif
}
@end
@export clay.sm.distance.vertex
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform mat4 world : WORLD;
attribute vec3 position : POSITION;
@import clay.chunk.skinning_header
varying vec3 v_WorldPosition;
void main (){
 vec4 P = vec4(position, 1.0);
#ifdef SKINNING
 @import clay.chunk.skin_matrix
 P = skinMatrixWS * P;
#endif
#ifdef INSTANCING
 @import clay.chunk.instancing_matrix
 P = instanceMat * P;
#endif
 gl_Position = worldViewProjection * P;
 v_WorldPosition = (world * P).xyz;
}
@end
@export clay.sm.distance.fragment
uniform vec3 lightPosition;
uniform float range : 100;
varying vec3 v_WorldPosition;
@import clay.util.encode_float
void main(){
 float dist = distance(lightPosition, v_WorldPosition);
#ifdef USE_VSM
 gl_FragColor = vec4(dist, dist * dist, 0.0, 0.0);
#else
 dist = dist / range;
 gl_FragColor = encodeFloat(dist);
#endif
}
@end
@export clay.plugin.shadow_map_common
@import clay.util.decode_float
float tapShadowMap(sampler2D map, vec2 uv, float z){
 vec4 tex = texture2D(map, uv);
 return step(z, decodeFloat(tex) * 2.0 - 1.0);
}
float pcf(sampler2D map, vec2 uv, float z, float textureSize, vec2 scale) {
 float shadowContrib = tapShadowMap(map, uv, z);
 vec2 offset = vec2(1.0 / textureSize) * scale;
#ifdef PCF_KERNEL_SIZE
 for (int _idx_ = 0; _idx_ < PCF_KERNEL_SIZE; _idx_++) {{
 shadowContrib += tapShadowMap(map, uv + offset * pcfKernel[_idx_], z);
 }}
 return shadowContrib / float(PCF_KERNEL_SIZE + 1);
#else
 shadowContrib += tapShadowMap(map, uv+vec2(offset.x, 0.0), z);
 shadowContrib += tapShadowMap(map, uv+vec2(offset.x, offset.y), z);
 shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, offset.y), z);
 shadowContrib += tapShadowMap(map, uv+vec2(0.0, offset.y), z);
 shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, 0.0), z);
 shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, -offset.y), z);
 shadowContrib += tapShadowMap(map, uv+vec2(offset.x, -offset.y), z);
 shadowContrib += tapShadowMap(map, uv+vec2(0.0, -offset.y), z);
 return shadowContrib / 9.0;
#endif
}
float pcf(sampler2D map, vec2 uv, float z, float textureSize) {
 return pcf(map, uv, z, textureSize, vec2(1.0));
}
float chebyshevUpperBound(vec2 moments, float z){
 float p = 0.0;
 z = z * 0.5 + 0.5;
 if (z <= moments.x) {
 p = 1.0;
 }
 float variance = moments.y - moments.x * moments.x;
 variance = max(variance, 0.0000001);
 float mD = moments.x - z;
 float pMax = variance / (variance + mD * mD);
 pMax = clamp((pMax-0.4)/(1.0-0.4), 0.0, 1.0);
 return max(p, pMax);
}
float computeShadowContrib(
 sampler2D map, mat4 lightVPM, vec3 position, float textureSize, vec2 scale, vec2 offset
) {
 vec4 posInLightSpace = lightVPM * vec4(position, 1.0);
 posInLightSpace.xyz /= posInLightSpace.w;
 float z = posInLightSpace.z;
 if(all(greaterThan(posInLightSpace.xyz, vec3(-0.99, -0.99, -1.0))) &&
 all(lessThan(posInLightSpace.xyz, vec3(0.99, 0.99, 1.0)))){
 vec2 uv = (posInLightSpace.xy+1.0) / 2.0;
 #ifdef USE_VSM
 vec2 moments = texture2D(map, uv * scale + offset).xy;
 return chebyshevUpperBound(moments, z);
 #else
 return pcf(map, uv * scale + offset, z, textureSize, scale);
 #endif
 }
 return 1.0;
}
float computeShadowContrib(sampler2D map, mat4 lightVPM, vec3 position, float textureSize) {
 return computeShadowContrib(map, lightVPM, position, textureSize, vec2(1.0), vec2(0.0));
}
float computeShadowContribOmni(samplerCube map, vec3 direction, float range)
{
 float dist = length(direction);
 vec4 shadowTex = textureCube(map, direction);
#ifdef USE_VSM
 vec2 moments = shadowTex.xy;
 float variance = moments.y - moments.x * moments.x;
 float mD = moments.x - dist;
 float p = variance / (variance + mD * mD);
 if(moments.x + 0.001 < dist){
 return clamp(p, 0.0, 1.0);
 }else{
 return 1.0;
 }
#else
 return step(dist, (decodeFloat(shadowTex) + 0.0002) * range);
#endif
}
@end
@export clay.plugin.compute_shadow_map
#if defined(SPOT_LIGHT_SHADOWMAP_COUNT) || defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT) || defined(POINT_LIGHT_SHADOWMAP_COUNT)
#ifdef SPOT_LIGHT_SHADOWMAP_COUNT
uniform sampler2D spotLightShadowMaps[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
uniform mat4 spotLightMatrices[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
uniform float spotLightShadowMapSizes[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
#endif
#ifdef DIRECTIONAL_LIGHT_SHADOWMAP_COUNT
#if defined(SHADOW_CASCADE)
uniform sampler2D directionalLightShadowMaps[1]:unconfigurable;
uniform mat4 directionalLightMatrices[SHADOW_CASCADE]:unconfigurable;
uniform float directionalLightShadowMapSizes[1]:unconfigurable;
uniform float shadowCascadeClipsNear[SHADOW_CASCADE]:unconfigurable;
uniform float shadowCascadeClipsFar[SHADOW_CASCADE]:unconfigurable;
#else
uniform sampler2D directionalLightShadowMaps[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
uniform mat4 directionalLightMatrices[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
uniform float directionalLightShadowMapSizes[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
#endif
#endif
#ifdef POINT_LIGHT_SHADOWMAP_COUNT
uniform samplerCube pointLightShadowMaps[POINT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;
#endif
uniform bool shadowEnabled : true;
#ifdef PCF_KERNEL_SIZE
uniform vec2 pcfKernel[PCF_KERNEL_SIZE];
#endif
@import clay.plugin.shadow_map_common
#if defined(SPOT_LIGHT_SHADOWMAP_COUNT)
void computeShadowOfSpotLights(vec3 position, inout float shadowContribs[SPOT_LIGHT_COUNT] ) {
 float shadowContrib;
 for(int _idx_ = 0; _idx_ < SPOT_LIGHT_SHADOWMAP_COUNT; _idx_++) {{
 shadowContrib = computeShadowContrib(
 spotLightShadowMaps[_idx_], spotLightMatrices[_idx_], position,
 spotLightShadowMapSizes[_idx_]
 );
 shadowContribs[_idx_] = shadowContrib;
 }}
 for(int _idx_ = SPOT_LIGHT_SHADOWMAP_COUNT; _idx_ < SPOT_LIGHT_COUNT; _idx_++){{
 shadowContribs[_idx_] = 1.0;
 }}
}
#endif
#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
#ifdef SHADOW_CASCADE
void computeShadowOfDirectionalLights(vec3 position, inout float shadowContribs[DIRECTIONAL_LIGHT_COUNT]){
 float depth = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far)
 / (gl_DepthRange.far - gl_DepthRange.near);
 float shadowContrib;
 shadowContribs[0] = 1.0;
 for (int _idx_ = 0; _idx_ < SHADOW_CASCADE; _idx_++) {{
 if (
 depth >= shadowCascadeClipsNear[_idx_] &&
 depth <= shadowCascadeClipsFar[_idx_]
 ) {
 shadowContrib = computeShadowContrib(
 directionalLightShadowMaps[0], directionalLightMatrices[_idx_], position,
 directionalLightShadowMapSizes[0],
 vec2(1.0 / float(SHADOW_CASCADE), 1.0),
 vec2(float(_idx_) / float(SHADOW_CASCADE), 0.0)
 );
 shadowContribs[0] = shadowContrib;
 }
 }}
 for(int _idx_ = DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++) {{
 shadowContribs[_idx_] = 1.0;
 }}
}
#else
void computeShadowOfDirectionalLights(vec3 position, inout float shadowContribs[DIRECTIONAL_LIGHT_COUNT]){
 float shadowContrib;
 for(int _idx_ = 0; _idx_ < DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_++) {{
 shadowContrib = computeShadowContrib(
 directionalLightShadowMaps[_idx_], directionalLightMatrices[_idx_], position,
 directionalLightShadowMapSizes[_idx_]
 );
 shadowContribs[_idx_] = shadowContrib;
 }}
 for(int _idx_ = DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++) {{
 shadowContribs[_idx_] = 1.0;
 }}
}
#endif
#endif
#if defined(POINT_LIGHT_SHADOWMAP_COUNT)
void computeShadowOfPointLights(vec3 position, inout float shadowContribs[POINT_LIGHT_COUNT] ){
 vec3 lightPosition;
 vec3 direction;
 for(int _idx_ = 0; _idx_ < POINT_LIGHT_SHADOWMAP_COUNT; _idx_++) {{
 lightPosition = pointLightPosition[_idx_];
 direction = position - lightPosition;
 shadowContribs[_idx_] = computeShadowContribOmni(pointLightShadowMaps[_idx_], direction, pointLightRange[_idx_]);
 }}
 for(int _idx_ = POINT_LIGHT_SHADOWMAP_COUNT; _idx_ < POINT_LIGHT_COUNT; _idx_++) {{
 shadowContribs[_idx_] = 1.0;
 }}
}
#endif
#endif
@end`;var Hr=["px","nx","py","ny","pz","nz"];V.import(Jx);function qu(e,t,r){if(r==="alphaMap")return e.material.get("diffuseMap");if(r==="alphaCutoff"){if(e.material.isDefined("fragment","ALPHA_TEST")&&e.material.get("diffuseMap")){var i=e.material.get("alphaCutoff");return i||0}return 0}else return r==="uvRepeat"?e.material.get("uvRepeat"):r==="uvOffset"?e.material.get("uvOffset"):t.get(r)}function Mv(e,t){var r=e.material,i=t.material;return r.get("diffuseMap")!==i.get("diffuseMap")||(r.get("alphaCutoff")||0)!==(i.get("alphaCutoff")||0)}var vr=vt.extend(function(){return{softShadow:vr.PCF,shadowBlur:1,lightFrustumBias:"auto",kernelPCF:new Float32Array([1,0,1,1,-1,1,0,1,-1,0,-1,-1,1,-1,0,-1]),precision:"highp",_lastRenderNotCastShadow:!1,_frameBuffer:new Je,_textures:{},_shadowMapNumber:{POINT_LIGHT:0,DIRECTIONAL_LIGHT:0,SPOT_LIGHT:0},_depthMaterials:{},_distanceMaterials:{},_receivers:[],_lightsCastShadow:[],_lightCameras:{},_lightMaterials:{},_texturePool:new Av}},function(){this._gaussianPassH=new Fe({fragment:V.source("clay.compositor.gaussian_blur")}),this._gaussianPassV=new Fe({fragment:V.source("clay.compositor.gaussian_blur")}),this._gaussianPassH.setUniform("blurSize",this.shadowBlur),this._gaussianPassH.setUniform("blurDir",0),this._gaussianPassV.setUniform("blurSize",this.shadowBlur),this._gaussianPassV.setUniform("blurDir",1),this._outputDepthPass=new Fe({fragment:V.source("clay.sm.debug_depth")})},{render:function(e,t,r,i){r||(r=t.getMainCamera()),this.trigger("beforerender",this,e,t,r),this._renderShadowPass(e,t,r,i),this.trigger("afterrender",this,e,t,r)},renderDebug:function(e,t){e.saveClear();var r=e.viewport,i=0,n=0,a=t||r.width/4,o=a;this.softShadow===vr.VSM?this._outputDepthPass.material.define("fragment","USE_VSM"):this._outputDepthPass.material.undefine("fragment","USE_VSM");for(var s in this._textures){var l=this._textures[s];e.setViewport(i,n,a*l.width/l.height,o),this._outputDepthPass.setUniform("depthMap",l),this._outputDepthPass.render(e),i+=a*l.width/l.height}e.setViewport(r),e.restoreClear()},_updateReceivers:function(e,t){if(t.receiveShadow?(this._receivers.push(t),t.material.set("shadowEnabled",1),t.material.set("pcfKernel",this.kernelPCF)):t.material.set("shadowEnabled",0),this.softShadow===vr.VSM)t.material.define("fragment","USE_VSM"),t.material.undefine("fragment","PCF_KERNEL_SIZE");else{t.material.undefine("fragment","USE_VSM");var r=this.kernelPCF;r&&r.length?t.material.define("fragment","PCF_KERNEL_SIZE",r.length/2):t.material.undefine("fragment","PCF_KERNEL_SIZE")}},_update:function(e,t){var r=this;t.traverse(function(a){a.isRenderable()&&r._updateReceivers(e,a)});for(var i=0;i<t.lights.length;i++){var n=t.lights[i];n.castShadow&&!n.invisible&&this._lightsCastShadow.push(n)}},_renderShadowPass:function(e,t,r,i){for(var n in this._shadowMapNumber)this._shadowMapNumber[n]=0;this._lightsCastShadow.length=0,this._receivers.length=0;var a=e.gl;if(i||t.update(),r&&r.update(),t.updateLights(),this._update(e,t),!this._lightsCastShadow.length&&this._lastRenderNotCastShadow)return;this._lastRenderNotCastShadow=this._lightsCastShadow===0,a.enable(a.DEPTH_TEST),a.depthMask(!0),a.disable(a.BLEND),a.clearColor(1,1,1,1);for(var o=[],s=[],l=[],u=[],h=[],f=[],c,d=0;d<this._lightsCastShadow.length;d++){var v=this._lightsCastShadow[d];if(v.type==="DIRECTIONAL_LIGHT"){if(c){console.warn("Only one direectional light supported with shadow cascade");continue}if(v.shadowCascade>4){console.warn("Support at most 4 cascade");continue}v.shadowCascade>1&&(c=v),this.renderDirectionalLightShadow(e,t,r,v,h,u,l)}else v.type==="SPOT_LIGHT"?this.renderSpotLightShadow(e,t,v,s,o):v.type==="POINT_LIGHT"&&this.renderPointLightShadow(e,t,v,f);this._shadowMapNumber[v.type]++}for(var p in this._shadowMapNumber)for(var _=this._shadowMapNumber[p],g=p+"_SHADOWMAP_COUNT",d=0;d<this._receivers.length;d++){var m=this._receivers[d],y=m.material;y.fragmentDefines[g]!==_&&(_>0?y.define("fragment",g,_):y.isDefined("fragment",g)&&y.undefine("fragment",g))}for(var d=0;d<this._receivers.length;d++){var m=this._receivers[d],y=m.material;c?y.define("fragment","SHADOW_CASCADE",c.shadowCascade):y.undefine("fragment","SHADOW_CASCADE")}var x=t.shadowUniforms;function w(L){return L.height}if(l.length>0){var T=l.map(w);if(x.directionalLightShadowMaps={value:l,type:"tv"},x.directionalLightMatrices={value:u,type:"m4v"},x.directionalLightShadowMapSizes={value:T,type:"1fv"},c){var E=h.slice(),b=h.slice();E.pop(),b.shift(),E.reverse(),b.reverse(),u.reverse(),x.shadowCascadeClipsNear={value:E,type:"1fv"},x.shadowCascadeClipsFar={value:b,type:"1fv"}}}if(o.length>0){var D=o.map(w),x=t.shadowUniforms;x.spotLightShadowMaps={value:o,type:"tv"},x.spotLightMatrices={value:s,type:"m4v"},x.spotLightShadowMapSizes={value:D,type:"1fv"}}f.length>0&&(x.pointLightShadowMaps={value:f,type:"tv"})},renderDirectionalLightShadow:(function(){var e=new rl,t=new W,r=new pt,i=new W,n=new W,a=new W,o=new W;return function(s,l,u,h,f,c,d){var v=this._getDepthMaterial(h),p={getMaterial:function(le){return le.shadowDepthMaterial||v},isMaterialChanged:Mv,getUniform:qu,ifRender:function(le){return le.castShadow},sortCompare:Nn.opaqueSortCompare};if(!l.viewBoundingBoxLastFrame.isFinite()){var _=l.getBoundingBox();l.viewBoundingBoxLastFrame.copy(_).applyTransform(u.viewMatrix)}var g=Math.min(-l.viewBoundingBoxLastFrame.min.z,u.far),m=Math.max(-l.viewBoundingBoxLastFrame.max.z,u.near),y=this._getDirectionalLightCamera(h,l,u),x=a.array;o.copy(y.projectionMatrix),U.invert(n.array,y.worldTransform.array),U.multiply(n.array,n.array,u.worldTransform.array),U.multiply(x,o.array,n.array);for(var w=[],T=u instanceof Qe,E=(u.near+u.far)/(u.near-u.far),b=2*u.near*u.far/(u.near-u.far),D=0;D<=h.shadowCascade;D++){var L=m*Math.pow(g/m,D/h.shadowCascade),M=m+(g-m)*D/h.shadowCascade,R=L*h.cascadeSplitLogFactor+M*(1-h.cascadeSplitLogFactor);w.push(R),f.push(-(-R*E+b)/-R)}var I=this._getTexture(h,h.shadowCascade);d.push(I);var P=s.viewport,N=s.gl;this._frameBuffer.attach(I),this._frameBuffer.bind(s),N.clear(N.COLOR_BUFFER_BIT|N.DEPTH_BUFFER_BIT);for(var D=0;D<h.shadowCascade;D++){var G=w[D],H=w[D+1];T?U.perspective(t.array,u.fov/180*Math.PI,u.aspect,G,H):U.ortho(t.array,u.left,u.right,u.bottom,u.top,G,H),e.setFromProjection(t),e.getTransformedBoundingBox(r,n),r.applyProjection(o);var F=r.min.array,re=r.max.array;F[0]=Math.max(F[0],-1),F[1]=Math.max(F[1],-1),re[0]=Math.min(re[0],1),re[1]=Math.min(re[1],1),i.ortho(F[0],re[0],F[1],re[1],1,-1),y.projectionMatrix.multiplyLeft(i);var B=h.shadowResolution||512;s.setViewport((h.shadowCascade-D-1)*B,0,B,B,1);var j=l.updateRenderList(y);s.renderPass(j.opaque,y,p),this.softShadow===vr.VSM&&this._gaussianFilter(s,I,I.width);var J=new W;J.copy(y.viewMatrix).multiplyLeft(y.projectionMatrix),c.push(J.array),y.projectionMatrix.copy(o)}this._frameBuffer.unbind(s),s.setViewport(P)}})(),renderSpotLightShadow:function(e,t,r,i,n){var a=this._getTexture(r),o=this._getSpotLightCamera(r),s=e.gl;this._frameBuffer.attach(a),this._frameBuffer.bind(e),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT);var l=this._getDepthMaterial(r),u={getMaterial:function(c){return c.shadowDepthMaterial||l},isMaterialChanged:Mv,getUniform:qu,ifRender:function(c){return c.castShadow},sortCompare:Nn.opaqueSortCompare},h=t.updateRenderList(o);e.renderPass(h.opaque,o,u),this._frameBuffer.unbind(e),this.softShadow===vr.VSM&&this._gaussianFilter(e,a,a.width);var f=new W;f.copy(o.worldTransform).invert().multiplyLeft(o.projectionMatrix),n.push(a),i.push(f.array)},renderPointLightShadow:function(e,t,r,i){var n=this._getTexture(r),a=e.gl;i.push(n);var o=this._getDepthMaterial(r),s={getMaterial:function(m){return m.shadowDepthMaterial||o},getUniform:qu,sortCompare:Nn.opaqueSortCompare},l={px:[],py:[],pz:[],nx:[],ny:[],nz:[]},u=new pt,h=r.getWorldPosition().array,f=new pt,c=r.range;f.min.setArray(h),f.max.setArray(h);var d=new z(c,c,c);f.max.add(d),f.min.sub(d);var v={px:!1,py:!1,pz:!1,nx:!1,ny:!1,nz:!1};t.traverse(function(m){if(m.isRenderable()&&m.castShadow){var y=m.geometry;if(!y.boundingBox){for(var x=0;x<Hr.length;x++)l[Hr[x]].push(m);return}if(u.transformFrom(y.boundingBox,m.worldTransform),!u.intersectBoundingBox(f))return;u.updateVertices();for(var x=0;x<Hr.length;x++)v[Hr[x]]=!1;for(var x=0;x<8;x++){var w=u.vertices[x],T=w[0]-h[0],E=w[1]-h[1],b=w[2]-h[2],D=Math.abs(T),L=Math.abs(E),M=Math.abs(b);D>L?D>M?v[T>0?"px":"nx"]=!0:v[b>0?"pz":"nz"]=!0:L>M?v[E>0?"py":"ny"]=!0:v[b>0?"pz":"nz"]=!0}for(var x=0;x<Hr.length;x++)v[Hr[x]]&&l[Hr[x]].push(m)}});for(var p=0;p<6;p++){var _=Hr[p],g=this._getPointLightCamera(r,_);this._frameBuffer.attach(n,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+p),this._frameBuffer.bind(e),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),e.renderPass(l[_],g,s)}this._frameBuffer.unbind(e)},_getDepthMaterial:function(e){var t=this._lightMaterials[e.__uid__],r=e.type==="POINT_LIGHT";if(!t){var i=r?"clay.sm.distance.":"clay.sm.depth.";t=new Gt({precision:this.precision,shader:new V(V.source(i+"vertex"),V.source(i+"fragment"))}),this._lightMaterials[e.__uid__]=t}return e.shadowSlopeScale!=null&&t.setUniform("slopeScale",e.shadowSlopeScale),e.shadowBias!=null&&t.setUniform("bias",e.shadowBias),this.softShadow===vr.VSM?t.define("fragment","USE_VSM"):t.undefine("fragment","USE_VSM"),r&&(t.set("lightPosition",e.getWorldPosition().array),t.set("range",e.range)),t},_gaussianFilter:function(e,t,r){var i={width:r,height:r,type:X.FLOAT},n=this._texturePool.get(i);this._frameBuffer.attach(n),this._frameBuffer.bind(e),this._gaussianPassH.setUniform("texture",t),this._gaussianPassH.setUniform("textureWidth",r),this._gaussianPassH.render(e),this._frameBuffer.attach(t),this._gaussianPassV.setUniform("texture",n),this._gaussianPassV.setUniform("textureHeight",r),this._gaussianPassV.render(e),this._frameBuffer.unbind(e),this._texturePool.put(n)},_getTexture:function(e,t){var r=e.__uid__,i=this._textures[r],n=e.shadowResolution||512;return t=t||1,i||(e.type==="POINT_LIGHT"?i=new Fn:i=new ee,i.width=n*t,i.height=n,this.softShadow===vr.VSM?(i.type=X.FLOAT,i.anisotropic=4):(i.minFilter=O.NEAREST,i.magFilter=O.NEAREST,i.useMipmap=!1),this._textures[r]=i),i},_getPointLightCamera:function(e,t){this._lightCameras.point||(this._lightCameras.point={px:new Qe,nx:new Qe,py:new Qe,ny:new Qe,pz:new Qe,nz:new Qe});var r=this._lightCameras.point[t];switch(r.far=e.range,r.fov=90,r.position.set(0,0,0),t){case"px":r.lookAt(z.POSITIVE_X,z.NEGATIVE_Y);break;case"nx":r.lookAt(z.NEGATIVE_X,z.NEGATIVE_Y);break;case"py":r.lookAt(z.POSITIVE_Y,z.POSITIVE_Z);break;case"ny":r.lookAt(z.NEGATIVE_Y,z.NEGATIVE_Z);break;case"pz":r.lookAt(z.POSITIVE_Z,z.NEGATIVE_Y);break;case"nz":r.lookAt(z.NEGATIVE_Z,z.NEGATIVE_Y);break}return e.getWorldPosition(r.position),r.update(),r},_getDirectionalLightCamera:(function(){var e=new W,t=new pt,r=new pt;return function(i,n,a){this._lightCameras.directional||(this._lightCameras.directional=new Ki);var o=this._lightCameras.directional;t.copy(n.viewBoundingBoxLastFrame),t.intersection(a.frustum.boundingBox),o.position.copy(t.min).add(t.max).scale(.5).transformMat4(a.worldTransform),o.rotation.copy(i.rotation),o.scale.copy(i.scale),o.updateWorldTransform(),W.invert(e,o.worldTransform),W.multiply(e,e,a.worldTransform),r.copy(t).applyTransform(e);var s=r.min.array,l=r.max.array;return o.position.set((s[0]+l[0])/2,(s[1]+l[1])/2,l[2]).transformMat4(o.worldTransform),o.near=0,o.far=-s[2]+l[2],isNaN(this.lightFrustumBias)?o.far*=4:o.far+=this.lightFrustumBias,o.left=s[0],o.right=l[0],o.top=l[1],o.bottom=s[1],o.update(!0),o}})(),_getSpotLightCamera:function(e){this._lightCameras.spot||(this._lightCameras.spot=new Qe);var t=this._lightCameras.spot;return t.fov=e.penumbraAngle*2,t.far=e.range,t.worldTransform.copy(e.worldTransform),t.updateProjectionMatrix(),U.invert(t.viewMatrix.array,t.worldTransform.array),t},dispose:function(e){var t=e.gl||e;this._frameBuffer&&this._frameBuffer.dispose(t);for(var r in this._textures)this._textures[r].dispose(t);this._texturePool.clear(e.gl),this._depthMaterials={},this._distanceMaterials={},this._textures={},this._lightCameras={},this._shadowMapNumber={POINT_LIGHT:0,DIRECTIONAL_LIGHT:0,SPOT_LIGHT:0},this._meshMaterials={};for(var i=0;i<this._receivers.length;i++){var n=this._receivers[i];if(n.material){var a=n.material;a.undefine("fragment","POINT_LIGHT_SHADOW_COUNT"),a.undefine("fragment","DIRECTIONAL_LIGHT_SHADOW_COUNT"),a.undefine("fragment","AMBIENT_LIGHT_SHADOW_COUNT"),a.set("shadowEnabled",0)}}this._receivers=[],this._lightsCastShadow=[]}});vr.VSM=1,vr.PCF=2;let $x=vr;var eT=vt.extend(function(){return{name:"",inputLinks:{},outputLinks:{},_prevOutputTextures:{},_outputTextures:{},_outputReferences:{},_rendering:!1,_rendered:!1,_compositor:null}},{updateParameter:function(e,t){var r=this.outputs[e],i=r.parameters,n=r._parametersCopy;if(n||(n=r._parametersCopy={}),i)for(var a in i)a!=="width"&&a!=="height"&&(n[a]=i[a]);var o,s;return i.width instanceof Function?o=i.width.call(this,t):o=i.width,i.height instanceof Function?s=i.height.call(this,t):s=i.height,(n.width!==o||n.height!==s)&&this._outputTextures[e]&&this._outputTextures[e].dispose(t.gl),n.width=o,n.height=s,n},setParameter:function(e,t){},getParameter:function(e){},setParameters:function(e){for(var t in e)this.setParameter(t,e[t])},render:function(){},getOutput:function(e,t){if(t==null)return t=e,this._outputTextures[t];var r=this.outputs[t];if(r)return this._rendered?r.outputLastFrame?this._prevOutputTextures[t]:this._outputTextures[t]:this._rendering?(this._prevOutputTextures[t]||(this._prevOutputTextures[t]=this._compositor.allocateTexture(r.parameters||{})),this._prevOutputTextures[t]):(this.render(e),this._outputTextures[t])},removeReference:function(e){if(this._outputReferences[e]--,this._outputReferences[e]===0){var t=this.outputs[e];t.keepLastFrame?(this._prevOutputTextures[e]&&this._compositor.releaseTexture(this._prevOutputTextures[e]),this._prevOutputTextures[e]=this._outputTextures[e]):this._compositor.releaseTexture(this._outputTextures[e])}},link:function(e,t,r){this.inputLinks[e]={node:t,pin:r},t.outputLinks[r]||(t.outputLinks[r]=[]),t.outputLinks[r].push({node:this,pin:e}),this.pass.material.enableTexture(e)},clear:function(){this.inputLinks={},this.outputLinks={}},updateReference:function(e){if(!this._rendering){this._rendering=!0;for(var t in this.inputLinks){var r=this.inputLinks[t];r.node.updateReference(r.pin)}this._rendering=!1}e&&this._outputReferences[e]++},beforeFrame:function(){this._rendered=!1;for(var e in this.outputLinks)this._outputReferences[e]=0},afterFrame:function(){for(var e in this.outputLinks)if(this._outputReferences[e]>0){var t=this.outputs[e];t.keepLastFrame?(this._prevOutputTextures[e]&&this._compositor.releaseTexture(this._prevOutputTextures[e]),this._prevOutputTextures[e]=this._outputTextures[e]):this._compositor.releaseTexture(this._outputTextures[e])}}});let Aa=eT;var tT=vt.extend(function(){return{nodes:[]}},{dirty:function(){this._dirty=!0},addNode:function(e){this.nodes.indexOf(e)>=0||(this.nodes.push(e),this._dirty=!0)},removeNode:function(e){typeof e=="string"&&(e=this.getNodeByName(e));var t=this.nodes.indexOf(e);t>=0&&(this.nodes.splice(t,1),this._dirty=!0)},getNodeByName:function(e){for(var t=0;t<this.nodes.length;t++)if(this.nodes[t].name===e)return this.nodes[t]},update:function(){for(var e=0;e<this.nodes.length;e++)this.nodes[e].clear();for(var e=0;e<this.nodes.length;e++){var t=this.nodes[e];if(t.inputs){for(var r in t.inputs)if(t.inputs[r]){if(t.pass&&!t.pass.material.isUniformEnabled(r)){console.warn("Pin "+t.name+"."+r+" not used.");continue}var i=t.inputs[r],n=this.findPin(i);n?t.link(r,n.node,n.pin):console.warn(typeof i=="string"?"Node "+i+" not exist":"Pin of "+i.node+"."+i.pin+" not exist")}}}},findPin:function(e){var t;if((typeof e=="string"||e instanceof Aa)&&(e={node:e}),typeof e.node=="string")for(var r=0;r<this.nodes.length;r++){var i=this.nodes[r];i.name===e.node&&(t=i)}else t=e.node;if(t){var n=e.pin;if(n||t.outputs&&(n=Object.keys(t.outputs)[0]),t.outputs[n])return{node:t,pin:n}}}});let Dv=tT;var rT=Dv.extend(function(){return{_outputs:[],_texturePool:new Av,_frameBuffer:new Je({depthBuffer:!1})}},{addNode:function(e){Dv.prototype.addNode.call(this,e),e._compositor=this},render:function(e,t){if(this._dirty){this.update(),this._dirty=!1,this._outputs.length=0;for(var r=0;r<this.nodes.length;r++)this.nodes[r].outputs||this._outputs.push(this.nodes[r])}for(var r=0;r<this.nodes.length;r++)this.nodes[r].beforeFrame();for(var r=0;r<this._outputs.length;r++)this._outputs[r].updateReference();for(var r=0;r<this._outputs.length;r++)this._outputs[r].render(e,t);for(var r=0;r<this.nodes.length;r++)this.nodes[r].afterFrame()},allocateTexture:function(e){return this._texturePool.get(e)},releaseTexture:function(e){this._texturePool.put(e)},getFrameBuffer:function(){return this._frameBuffer},dispose:function(e){this._texturePool.clear(e)}});let iT=rT;var nT=Aa.extend({name:"scene",scene:null,camera:null,autoUpdateScene:!0,preZ:!1},function(){this.frameBuffer=new Je},{render:function(e){this._rendering=!0;var t=e.gl;this.trigger("beforerender");var r;if(!this.outputs)r=e.render(this.scene,this.camera,!this.autoUpdateScene,this.preZ);else{var i=this.frameBuffer;for(var n in this.outputs){var a=this.updateParameter(n,e),o=this.outputs[n],s=this._compositor.allocateTexture(a);this._outputTextures[n]=s;var l=o.attachment||t.COLOR_ATTACHMENT0;typeof l=="string"&&(l=t[l]),i.attach(s,l)}i.bind(e);var u=e.getGLExtension("EXT_draw_buffers");if(u){var h=[];for(var l in this.outputs)l=parseInt(l),l>=t.COLOR_ATTACHMENT0&&l<=t.COLOR_ATTACHMENT0+8&&h.push(l);u.drawBuffersEXT(h)}e.saveClear(),e.clearBit=O.DEPTH_BUFFER_BIT|O.COLOR_BUFFER_BIT,r=e.render(this.scene,this.camera,!this.autoUpdateScene,this.preZ),e.restoreClear(),i.unbind(e)}this.trigger("afterrender",r),this._rendering=!1,this._rendered=!0}});let aT=nT;var oT=Aa.extend(function(){return{texture:null,outputs:{color:{}}}},function(){},{getOutput:function(e,t){return this.texture},beforeFrame:function(){},afterFrame:function(){}});let sT=oT;var lT=Aa.extend(function(){return{name:"",inputs:{},outputs:null,shader:"",inputLinks:{},outputLinks:{},pass:null,_prevOutputTextures:{},_outputTextures:{},_outputReferences:{},_rendering:!1,_rendered:!1,_compositor:null}},function(){var e=new Fe({fragment:this.shader});this.pass=e},{render:function(e,t){this.trigger("beforerender",e),this._rendering=!0;var r=e.gl;for(var i in this.inputLinks){var n=this.inputLinks[i],a=n.node.getOutput(e,n.pin);this.pass.setUniform(i,a)}if(!this.outputs)this.pass.outputs=null,this._compositor.getFrameBuffer().unbind(e),this.pass.render(e,t);else{this.pass.outputs={};var o={};for(var s in this.outputs){var l=this.updateParameter(s,e);isNaN(l.width)&&this.updateParameter(s,e);var u=this.outputs[s],h=this._compositor.allocateTexture(l);this._outputTextures[s]=h;var f=u.attachment||r.COLOR_ATTACHMENT0;typeof f=="string"&&(f=r[f]),o[f]=h}this._compositor.getFrameBuffer().bind(e);for(var f in o)this._compositor.getFrameBuffer().attach(o[f],f);this.pass.render(e),this._compositor.getFrameBuffer().updateMipmap(e)}for(var i in this.inputLinks){var n=this.inputLinks[i];n.node.removeReference(n.pin)}this._rendering=!1,this._rendered=!0,this.trigger("afterrender",e)},updateParameter:function(e,t){var r=this.outputs[e],i=r.parameters,n=r._parametersCopy;if(n||(n=r._parametersCopy={}),i)for(var a in i)a!=="width"&&a!=="height"&&(n[a]=i[a]);var o,s;return typeof i.width=="function"?o=i.width.call(this,t):o=i.width,typeof i.height=="function"?s=i.height.call(this,t):s=i.height,o=Math.ceil(o),s=Math.ceil(s),(n.width!==o||n.height!==s)&&this._outputTextures[e]&&this._outputTextures[e].dispose(t),n.width=o,n.height=s,n},setParameter:function(e,t){this.pass.setUniform(e,t)},getParameter:function(e){return this.pass.getUniform(e)},setParameters:function(e){for(var t in e)this.setParameter(t,e[t])},define:function(e,t){this.pass.material.define("fragment",e,t)},undefine:function(e){this.pass.material.undefine("fragment",e)},removeReference:function(e){if(this._outputReferences[e]--,this._outputReferences[e]===0){var t=this.outputs[e];t.keepLastFrame?(this._prevOutputTextures[e]&&this._compositor.releaseTexture(this._prevOutputTextures[e]),this._prevOutputTextures[e]=this._outputTextures[e]):this._compositor.releaseTexture(this._outputTextures[e])}},clear:function(){Aa.prototype.clear.call(this),this.pass.material.disableTexturesAll()}});let uT=lT,hT=`@export clay.compositor.coloradjust
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float brightness : 0.0;
uniform float contrast : 1.0;
uniform float exposure : 0.0;
uniform float gamma : 1.0;
uniform float saturation : 1.0;
const vec3 w = vec3(0.2125, 0.7154, 0.0721);
void main()
{
 vec4 tex = texture2D( texture, v_Texcoord);
 vec3 color = clamp(tex.rgb + vec3(brightness), 0.0, 1.0);
 color = clamp( (color-vec3(0.5))*contrast+vec3(0.5), 0.0, 1.0);
 color = clamp( color * pow(2.0, exposure), 0.0, 1.0);
 color = clamp( pow(color, vec3(gamma)), 0.0, 1.0);
 float luminance = dot( color, w );
 color = mix(vec3(luminance), color, saturation);
 gl_FragColor = vec4(color, tex.a);
}
@end
@export clay.compositor.brightness
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float brightness : 0.0;
void main()
{
 vec4 tex = texture2D( texture, v_Texcoord);
 vec3 color = tex.rgb + vec3(brightness);
 gl_FragColor = vec4(color, tex.a);
}
@end
@export clay.compositor.contrast
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float contrast : 1.0;
void main()
{
 vec4 tex = texture2D( texture, v_Texcoord);
 vec3 color = (tex.rgb-vec3(0.5))*contrast+vec3(0.5);
 gl_FragColor = vec4(color, tex.a);
}
@end
@export clay.compositor.exposure
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float exposure : 0.0;
void main()
{
 vec4 tex = texture2D(texture, v_Texcoord);
 vec3 color = tex.rgb * pow(2.0, exposure);
 gl_FragColor = vec4(color, tex.a);
}
@end
@export clay.compositor.gamma
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float gamma : 1.0;
void main()
{
 vec4 tex = texture2D(texture, v_Texcoord);
 vec3 color = pow(tex.rgb, vec3(gamma));
 gl_FragColor = vec4(color, tex.a);
}
@end
@export clay.compositor.saturation
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float saturation : 1.0;
const vec3 w = vec3(0.2125, 0.7154, 0.0721);
void main()
{
 vec4 tex = texture2D(texture, v_Texcoord);
 vec3 color = tex.rgb;
 float luminance = dot(color, w);
 color = mix(vec3(luminance), color, saturation);
 gl_FragColor = vec4(color, tex.a);
}
@end`,Cv=`@export clay.compositor.kernel.gaussian_9
float gaussianKernel[9];
gaussianKernel[0] = 0.07;
gaussianKernel[1] = 0.09;
gaussianKernel[2] = 0.12;
gaussianKernel[3] = 0.14;
gaussianKernel[4] = 0.16;
gaussianKernel[5] = 0.14;
gaussianKernel[6] = 0.12;
gaussianKernel[7] = 0.09;
gaussianKernel[8] = 0.07;
@end
@export clay.compositor.kernel.gaussian_13
float gaussianKernel[13];
gaussianKernel[0] = 0.02;
gaussianKernel[1] = 0.03;
gaussianKernel[2] = 0.06;
gaussianKernel[3] = 0.08;
gaussianKernel[4] = 0.11;
gaussianKernel[5] = 0.13;
gaussianKernel[6] = 0.14;
gaussianKernel[7] = 0.13;
gaussianKernel[8] = 0.11;
gaussianKernel[9] = 0.08;
gaussianKernel[10] = 0.06;
gaussianKernel[11] = 0.03;
gaussianKernel[12] = 0.02;
@end
@export clay.compositor.gaussian_blur
#define SHADER_NAME gaussian_blur
uniform sampler2D texture;varying vec2 v_Texcoord;
uniform float blurSize : 2.0;
uniform vec2 textureSize : [512.0, 512.0];
uniform float blurDir : 0.0;
@import clay.util.rgbm
@import clay.util.clamp_sample
void main (void)
{
 @import clay.compositor.kernel.gaussian_9
 vec2 off = blurSize / textureSize;
 off *= vec2(1.0 - blurDir, blurDir);
 vec4 sum = vec4(0.0);
 float weightAll = 0.0;
 for (int i = 0; i < 9; i++) {
 float w = gaussianKernel[i];
 vec4 texel = decodeHDR(clampSample(texture, v_Texcoord + float(i - 4) * off));
 sum += texel * w;
 weightAll += w;
 }
 gl_FragColor = encodeHDR(sum / max(weightAll, 0.01));
}
@end
`,fT=`@export clay.compositor.hdr.log_lum
varying vec2 v_Texcoord;
uniform sampler2D texture;
const vec3 w = vec3(0.2125, 0.7154, 0.0721);
@import clay.util.rgbm
void main()
{
 vec4 tex = decodeHDR(texture2D(texture, v_Texcoord));
 float luminance = dot(tex.rgb, w);
 luminance = log(luminance + 0.001);
 gl_FragColor = encodeHDR(vec4(vec3(luminance), 1.0));
}
@end
@export clay.compositor.hdr.lum_adaption
varying vec2 v_Texcoord;
uniform sampler2D adaptedLum;
uniform sampler2D currentLum;
uniform float frameTime : 0.02;
@import clay.util.rgbm
void main()
{
 float fAdaptedLum = decodeHDR(texture2D(adaptedLum, vec2(0.5, 0.5))).r;
 float fCurrentLum = exp(encodeHDR(texture2D(currentLum, vec2(0.5, 0.5))).r);
 fAdaptedLum += (fCurrentLum - fAdaptedLum) * (1.0 - pow(0.98, 30.0 * frameTime));
 gl_FragColor = encodeHDR(vec4(vec3(fAdaptedLum), 1.0));
}
@end
@export clay.compositor.lum
varying vec2 v_Texcoord;
uniform sampler2D texture;
const vec3 w = vec3(0.2125, 0.7154, 0.0721);
void main()
{
 vec4 tex = texture2D( texture, v_Texcoord );
 float luminance = dot(tex.rgb, w);
 gl_FragColor = vec4(vec3(luminance), 1.0);
}
@end`,Lv=`
@export clay.compositor.lut
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform sampler2D lookup;
void main()
{
 vec4 tex = texture2D(texture, v_Texcoord);
 float blueColor = tex.b * 63.0;
 vec2 quad1;
 quad1.y = floor(floor(blueColor) / 8.0);
 quad1.x = floor(blueColor) - (quad1.y * 8.0);
 vec2 quad2;
 quad2.y = floor(ceil(blueColor) / 8.0);
 quad2.x = ceil(blueColor) - (quad2.y * 8.0);
 vec2 texPos1;
 texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.r);
 texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.g);
 vec2 texPos2;
 texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.r);
 texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.g);
 vec4 newColor1 = texture2D(lookup, texPos1);
 vec4 newColor2 = texture2D(lookup, texPos2);
 vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
 gl_FragColor = vec4(newColor.rgb, tex.w);
}
@end`,cT=`@export clay.compositor.vignette
#define OUTPUT_ALPHA
varying vec2 v_Texcoord;
uniform sampler2D texture;
uniform float darkness: 1;
uniform float offset: 1;
@import clay.util.rgbm
void main()
{
 vec4 texel = decodeHDR(texture2D(texture, v_Texcoord));
 gl_FragColor.rgb = texel.rgb;
 vec2 uv = (v_Texcoord - vec2(0.5)) * vec2(offset);
 gl_FragColor = encodeHDR(vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a));
}
@end`,Pv=`@export clay.compositor.output
#define OUTPUT_ALPHA
varying vec2 v_Texcoord;
uniform sampler2D texture;
@import clay.util.rgbm
void main()
{
 vec4 tex = decodeHDR(texture2D(texture, v_Texcoord));
 gl_FragColor.rgb = tex.rgb;
#ifdef OUTPUT_ALPHA
 gl_FragColor.a = tex.a;
#else
 gl_FragColor.a = 1.0;
#endif
 gl_FragColor = encodeHDR(gl_FragColor);
#ifdef PREMULTIPLY_ALPHA
 gl_FragColor.rgb *= gl_FragColor.a;
#endif
}
@end`,Rv=`@export clay.compositor.bright
uniform sampler2D texture;
uniform float threshold : 1;
uniform float scale : 1.0;
uniform vec2 textureSize: [512, 512];
varying vec2 v_Texcoord;
const vec3 lumWeight = vec3(0.2125, 0.7154, 0.0721);
@import clay.util.rgbm
vec4 median(vec4 a, vec4 b, vec4 c)
{
 return a + b + c - min(min(a, b), c) - max(max(a, b), c);
}
void main()
{
 vec4 texel = decodeHDR(texture2D(texture, v_Texcoord));
#ifdef ANTI_FLICKER
 vec3 d = 1.0 / textureSize.xyx * vec3(1.0, 1.0, 0.0);
 vec4 s1 = decodeHDR(texture2D(texture, v_Texcoord - d.xz));
 vec4 s2 = decodeHDR(texture2D(texture, v_Texcoord + d.xz));
 vec4 s3 = decodeHDR(texture2D(texture, v_Texcoord - d.zy));
 vec4 s4 = decodeHDR(texture2D(texture, v_Texcoord + d.zy));
 texel = median(median(texel, s1, s2), s3, s4);
#endif
 float lum = dot(texel.rgb , lumWeight);
 vec4 color;
 if (lum > threshold && texel.a > 0.0)
 {
 color = vec4(texel.rgb * scale, texel.a * scale);
 }
 else
 {
 color = vec4(0.0);
 }
 gl_FragColor = encodeHDR(color);
}
@end
`,Nv=`@export clay.compositor.downsample
uniform sampler2D texture;
uniform vec2 textureSize : [512, 512];
varying vec2 v_Texcoord;
@import clay.util.rgbm
float brightness(vec3 c)
{
 return max(max(c.r, c.g), c.b);
}
@import clay.util.clamp_sample
void main()
{
 vec4 d = vec4(-1.0, -1.0, 1.0, 1.0) / textureSize.xyxy;
#ifdef ANTI_FLICKER
 vec3 s1 = decodeHDR(clampSample(texture, v_Texcoord + d.xy)).rgb;
 vec3 s2 = decodeHDR(clampSample(texture, v_Texcoord + d.zy)).rgb;
 vec3 s3 = decodeHDR(clampSample(texture, v_Texcoord + d.xw)).rgb;
 vec3 s4 = decodeHDR(clampSample(texture, v_Texcoord + d.zw)).rgb;
 float s1w = 1.0 / (brightness(s1) + 1.0);
 float s2w = 1.0 / (brightness(s2) + 1.0);
 float s3w = 1.0 / (brightness(s3) + 1.0);
 float s4w = 1.0 / (brightness(s4) + 1.0);
 float oneDivideSum = 1.0 / (s1w + s2w + s3w + s4w);
 vec4 color = vec4(
 (s1 * s1w + s2 * s2w + s3 * s3w + s4 * s4w) * oneDivideSum,
 1.0
 );
#else
 vec4 color = decodeHDR(clampSample(texture, v_Texcoord + d.xy));
 color += decodeHDR(clampSample(texture, v_Texcoord + d.zy));
 color += decodeHDR(clampSample(texture, v_Texcoord + d.xw));
 color += decodeHDR(clampSample(texture, v_Texcoord + d.zw));
 color *= 0.25;
#endif
 gl_FragColor = encodeHDR(color);
}
@end`,Iv=`
@export clay.compositor.upsample
#define HIGH_QUALITY
uniform sampler2D texture;
uniform vec2 textureSize : [512, 512];
uniform float sampleScale: 0.5;
varying vec2 v_Texcoord;
@import clay.util.rgbm
@import clay.util.clamp_sample
void main()
{
#ifdef HIGH_QUALITY
 vec4 d = vec4(1.0, 1.0, -1.0, 0.0) / textureSize.xyxy * sampleScale;
 vec4 s;
 s = decodeHDR(clampSample(texture, v_Texcoord - d.xy));
 s += decodeHDR(clampSample(texture, v_Texcoord - d.wy)) * 2.0;
 s += decodeHDR(clampSample(texture, v_Texcoord - d.zy));
 s += decodeHDR(clampSample(texture, v_Texcoord + d.zw)) * 2.0;
 s += decodeHDR(clampSample(texture, v_Texcoord )) * 4.0;
 s += decodeHDR(clampSample(texture, v_Texcoord + d.xw)) * 2.0;
 s += decodeHDR(clampSample(texture, v_Texcoord + d.zy));
 s += decodeHDR(clampSample(texture, v_Texcoord + d.wy)) * 2.0;
 s += decodeHDR(clampSample(texture, v_Texcoord + d.xy));
 gl_FragColor = encodeHDR(s / 16.0);
#else
 vec4 d = vec4(-1.0, -1.0, +1.0, +1.0) / textureSize.xyxy;
 vec4 s;
 s = decodeHDR(clampSample(texture, v_Texcoord + d.xy));
 s += decodeHDR(clampSample(texture, v_Texcoord + d.zy));
 s += decodeHDR(clampSample(texture, v_Texcoord + d.xw));
 s += decodeHDR(clampSample(texture, v_Texcoord + d.zw));
 gl_FragColor = encodeHDR(s / 4.0);
#endif
}
@end`,Ov=`@export clay.compositor.hdr.composite
#define TONEMAPPING
uniform sampler2D texture;
#ifdef BLOOM_ENABLED
uniform sampler2D bloom;
#endif
#ifdef LENSFLARE_ENABLED
uniform sampler2D lensflare;
uniform sampler2D lensdirt;
#endif
#ifdef LUM_ENABLED
uniform sampler2D lum;
#endif
#ifdef LUT_ENABLED
uniform sampler2D lut;
#endif
#ifdef COLOR_CORRECTION
uniform float brightness : 0.0;
uniform float contrast : 1.0;
uniform float saturation : 1.0;
#endif
#ifdef VIGNETTE
uniform float vignetteDarkness: 1.0;
uniform float vignetteOffset: 1.0;
#endif
uniform float exposure : 1.0;
uniform float bloomIntensity : 0.25;
uniform float lensflareIntensity : 1;
varying vec2 v_Texcoord;
@import clay.util.srgb
vec3 ACESToneMapping(vec3 color)
{
 const float A = 2.51;
 const float B = 0.03;
 const float C = 2.43;
 const float D = 0.59;
 const float E = 0.14;
 return (color * (A * color + B)) / (color * (C * color + D) + E);
}
float eyeAdaption(float fLum)
{
 return mix(0.2, fLum, 0.5);
}
#ifdef LUT_ENABLED
vec3 lutTransform(vec3 color) {
 float blueColor = color.b * 63.0;
 vec2 quad1;
 quad1.y = floor(floor(blueColor) / 8.0);
 quad1.x = floor(blueColor) - (quad1.y * 8.0);
 vec2 quad2;
 quad2.y = floor(ceil(blueColor) / 8.0);
 quad2.x = ceil(blueColor) - (quad2.y * 8.0);
 vec2 texPos1;
 texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.r);
 texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.g);
 vec2 texPos2;
 texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.r);
 texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.g);
 vec4 newColor1 = texture2D(lut, texPos1);
 vec4 newColor2 = texture2D(lut, texPos2);
 vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
 return newColor.rgb;
}
#endif
@import clay.util.rgbm
void main()
{
 vec4 texel = vec4(0.0);
 vec4 originalTexel = vec4(0.0);
#ifdef TEXTURE_ENABLED
 texel = decodeHDR(texture2D(texture, v_Texcoord));
 originalTexel = texel;
#endif
#ifdef BLOOM_ENABLED
 vec4 bloomTexel = decodeHDR(texture2D(bloom, v_Texcoord));
 texel.rgb += bloomTexel.rgb * bloomIntensity;
 texel.a += bloomTexel.a * bloomIntensity;
#endif
#ifdef LENSFLARE_ENABLED
 texel += decodeHDR(texture2D(lensflare, v_Texcoord)) * texture2D(lensdirt, v_Texcoord) * lensflareIntensity;
#endif
 texel.a = min(texel.a, 1.0);
#ifdef LUM_ENABLED
 float fLum = texture2D(lum, vec2(0.5, 0.5)).r;
 float adaptedLumDest = 3.0 / (max(0.1, 1.0 + 10.0*eyeAdaption(fLum)));
 float exposureBias = adaptedLumDest * exposure;
#else
 float exposureBias = exposure;
#endif
#ifdef TONEMAPPING
 texel.rgb *= exposureBias;
 texel.rgb = ACESToneMapping(texel.rgb);
#endif
 texel = linearTosRGB(texel);
#ifdef LUT_ENABLED
 texel.rgb = lutTransform(clamp(texel.rgb,vec3(0.0),vec3(1.0)));
#endif
#ifdef COLOR_CORRECTION
 texel.rgb = clamp(texel.rgb + vec3(brightness), 0.0, 1.0);
 texel.rgb = clamp((texel.rgb - vec3(0.5))*contrast+vec3(0.5), 0.0, 1.0);
 float lum = dot(texel.rgb, vec3(0.2125, 0.7154, 0.0721));
 texel.rgb = mix(vec3(lum), texel.rgb, saturation);
#endif
#ifdef VIGNETTE
 vec2 uv = (v_Texcoord - vec2(0.5)) * vec2(vignetteOffset);
 texel.rgb = mix(texel.rgb, vec3(1.0 - vignetteDarkness), dot(uv, uv));
#endif
 gl_FragColor = encodeHDR(texel);
#ifdef DEBUG
 #if DEBUG == 1
 gl_FragColor = encodeHDR(decodeHDR(texture2D(texture, v_Texcoord)));
 #elif DEBUG == 2
 gl_FragColor = encodeHDR(decodeHDR(texture2D(bloom, v_Texcoord)) * bloomIntensity);
 #elif DEBUG == 3
 gl_FragColor = encodeHDR(decodeHDR(texture2D(lensflare, v_Texcoord) * lensflareIntensity));
 #endif
#endif
 if (originalTexel.a <= 0.01 && gl_FragColor.a > 1e-5) {
 gl_FragColor.a = dot(gl_FragColor.rgb, vec3(0.2125, 0.7154, 0.0721));
 }
#ifdef PREMULTIPLY_ALPHA
 gl_FragColor.rgb *= gl_FragColor.a;
#endif
}
@end`,dT=`@export clay.compositor.lensflare
#define SAMPLE_NUMBER 8
uniform sampler2D texture;
uniform sampler2D lenscolor;
uniform vec2 textureSize : [512, 512];
uniform float dispersal : 0.3;
uniform float haloWidth : 0.4;
uniform float distortion : 1.0;
varying vec2 v_Texcoord;
@import clay.util.rgbm
vec4 textureDistorted(
 in vec2 texcoord,
 in vec2 direction,
 in vec3 distortion
) {
 return vec4(
 decodeHDR(texture2D(texture, texcoord + direction * distortion.r)).r,
 decodeHDR(texture2D(texture, texcoord + direction * distortion.g)).g,
 decodeHDR(texture2D(texture, texcoord + direction * distortion.b)).b,
 1.0
 );
}
void main()
{
 vec2 texcoord = -v_Texcoord + vec2(1.0); vec2 textureOffset = 1.0 / textureSize;
 vec2 ghostVec = (vec2(0.5) - texcoord) * dispersal;
 vec2 haloVec = normalize(ghostVec) * haloWidth;
 vec3 distortion = vec3(-textureOffset.x * distortion, 0.0, textureOffset.x * distortion);
 vec4 result = vec4(0.0);
 for (int i = 0; i < SAMPLE_NUMBER; i++)
 {
 vec2 offset = fract(texcoord + ghostVec * float(i));
 float weight = length(vec2(0.5) - offset) / length(vec2(0.5));
 weight = pow(1.0 - weight, 10.0);
 result += textureDistorted(offset, normalize(ghostVec), distortion) * weight;
 }
 result *= texture2D(lenscolor, vec2(length(vec2(0.5) - texcoord)) / length(vec2(0.5)));
 float weight = length(vec2(0.5) - fract(texcoord + haloVec)) / length(vec2(0.5));
 weight = pow(1.0 - weight, 10.0);
 vec2 offset = fract(texcoord + haloVec);
 result += textureDistorted(offset, normalize(ghostVec), distortion) * weight;
 gl_FragColor = result;
}
@end`,Bv=`@export clay.compositor.blend
#define SHADER_NAME blend
#ifdef TEXTURE1_ENABLED
uniform sampler2D texture1;
uniform float weight1 : 1.0;
#endif
#ifdef TEXTURE2_ENABLED
uniform sampler2D texture2;
uniform float weight2 : 1.0;
#endif
#ifdef TEXTURE3_ENABLED
uniform sampler2D texture3;
uniform float weight3 : 1.0;
#endif
#ifdef TEXTURE4_ENABLED
uniform sampler2D texture4;
uniform float weight4 : 1.0;
#endif
#ifdef TEXTURE5_ENABLED
uniform sampler2D texture5;
uniform float weight5 : 1.0;
#endif
#ifdef TEXTURE6_ENABLED
uniform sampler2D texture6;
uniform float weight6 : 1.0;
#endif
varying vec2 v_Texcoord;
@import clay.util.rgbm
void main()
{
 vec4 tex = vec4(0.0);
#ifdef TEXTURE1_ENABLED
 tex += decodeHDR(texture2D(texture1, v_Texcoord)) * weight1;
#endif
#ifdef TEXTURE2_ENABLED
 tex += decodeHDR(texture2D(texture2, v_Texcoord)) * weight2;
#endif
#ifdef TEXTURE3_ENABLED
 tex += decodeHDR(texture2D(texture3, v_Texcoord)) * weight3;
#endif
#ifdef TEXTURE4_ENABLED
 tex += decodeHDR(texture2D(texture4, v_Texcoord)) * weight4;
#endif
#ifdef TEXTURE5_ENABLED
 tex += decodeHDR(texture2D(texture5, v_Texcoord)) * weight5;
#endif
#ifdef TEXTURE6_ENABLED
 tex += decodeHDR(texture2D(texture6, v_Texcoord)) * weight6;
#endif
 gl_FragColor = encodeHDR(tex);
}
@end`,Fv=`@export clay.compositor.fxaa
uniform sampler2D texture;
uniform vec4 viewport : VIEWPORT;
varying vec2 v_Texcoord;
#define FXAA_REDUCE_MIN (1.0/128.0)
#define FXAA_REDUCE_MUL (1.0/8.0)
#define FXAA_SPAN_MAX 8.0
@import clay.util.rgbm
void main()
{
 vec2 resolution = 1.0 / viewport.zw;
 vec3 rgbNW = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ) ).xyz;
 vec3 rgbNE = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ) ).xyz;
 vec3 rgbSW = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ) ).xyz;
 vec3 rgbSE = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ) ).xyz;
 vec4 rgbaM = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution ) );
 vec3 rgbM = rgbaM.xyz;
 float opacity = rgbaM.w;
 vec3 luma = vec3( 0.299, 0.587, 0.114 );
 float lumaNW = dot( rgbNW, luma );
 float lumaNE = dot( rgbNE, luma );
 float lumaSW = dot( rgbSW, luma );
 float lumaSE = dot( rgbSE, luma );
 float lumaM = dot( rgbM, luma );
 float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );
 float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );
 vec2 dir;
 dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
 dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));
 float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );
 float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );
 dir = min( vec2( FXAA_SPAN_MAX, FXAA_SPAN_MAX),
 max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
 dir * rcpDirMin)) * resolution;
 vec3 rgbA = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * ( 1.0 / 3.0 - 0.5 ) ) ).xyz;
 rgbA += decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * ( 2.0 / 3.0 - 0.5 ) ) ).xyz;
 rgbA *= 0.5;
 vec3 rgbB = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * -0.5 ) ).xyz;
 rgbB += decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * 0.5 ) ).xyz;
 rgbB *= 0.25;
 rgbB += rgbA * 0.5;
 float lumaB = dot( rgbB, luma );
 if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) )
 {
 gl_FragColor = vec4( rgbA, opacity );
 }
 else {
 gl_FragColor = vec4( rgbB, opacity );
 }
}
@end`;function vT(e){e.import(hT),e.import(Cv),e.import(fT),e.import(Lv),e.import(cT),e.import(Pv),e.import(Rv),e.import(Nv),e.import(Iv),e.import(Ov),e.import(dT),e.import(Bv),e.import(Fv)}vT(V);var pT=/^#source\((.*?)\)/;function _T(e,t){var r=new iT;t=t||{};var i={textures:{},parameters:{}},n=function(s,l){for(var u=0;u<e.nodes.length;u++){var h=e.nodes[u],f=gT(h,i,t);f&&r.addNode(f)}};for(var a in e.parameters){var o=e.parameters[a];i.parameters[a]=Zu(o)}return xT(e,i,t,function(s){i.textures=s,n()}),r}function gT(e,t,r){var i=e.type||"filter",n,a,o;if(i==="filter"){var s=e.shader.trim(),l=pT.exec(s);if(l?n=V.source(l[1].trim()):s.charAt(0)==="#"&&(n=t.shaders[s.substr(1)]),n||(n=s),!n)return}if(e.inputs){a={};for(var u in e.inputs)typeof e.inputs[u]=="string"?a[u]=e.inputs[u]:a[u]={node:e.inputs[u].node,pin:e.inputs[u].pin}}if(e.outputs){o={};for(var u in e.outputs){var h=e.outputs[u];o[u]={},h.attachment!=null&&(o[u].attachment=h.attachment),h.keepLastFrame!=null&&(o[u].keepLastFrame=h.keepLastFrame),h.outputLastFrame!=null&&(o[u].outputLastFrame=h.outputLastFrame),h.parameters&&(o[u].parameters=Zu(h.parameters))}}var f;if(i==="scene"?f=new aT({name:e.name,scene:r.scene,camera:r.camera,outputs:o}):i==="texture"?f=new sT({name:e.name,outputs:o}):f=new uT({name:e.name,shader:n,inputs:a,outputs:o}),f){if(e.parameters)for(var u in e.parameters){var c=e.parameters[u];typeof c=="string"?(c=c.trim(),c.charAt(0)==="#"?c=t.textures[c.substr(1)]:f.on("beforerender",TT(u,Gv(c)))):typeof c=="function"&&f.on("beforerender",c),f.setParameter(u,c)}if(e.defines&&f.pass)for(var u in e.defines){var c=e.defines[u];f.pass.material.define("fragment",u,c)}}return f}function mT(e,t){return e}function yT(e,t){return t}function Zu(e){var t={};if(!e)return t;["type","minFilter","magFilter","wrapS","wrapT","flipY","useMipmap"].forEach(function(i){var n=e[i];n!=null&&(typeof n=="string"&&(n=X[n]),t[i]=n)});var r=e.scale||1;return["width","height"].forEach(function(i){if(e[i]!=null){var n=e[i];typeof n=="string"?(n=n.trim(),t[i]=wT(i,Gv(n),r)):t[i]=n}}),t.width||(t.width=mT),t.height||(t.height=yT),e.useMipmap!=null&&(t.useMipmap=e.useMipmap),t}function xT(e,t,r,i){if(!e.textures){i({});return}var n={},a=0,o=!1,s=r.textureRootPath;tt.each(e.textures,function(l,u){var h,f=l.path,c=Zu(l.parameters);if(Array.isArray(f)&&f.length===6)s&&(f=f.map(function(d){return tt.relative2absolute(d,s)})),h=new Fn(c);else if(typeof f=="string")s&&(f=tt.relative2absolute(f,s)),h=new ee(c);else return;h.load(f),a++,h.once("success",function(){n[u]=h,a--,a===0&&(i(n),o=!0)})}),a===0&&!o&&i(n)}function TT(e,t){return function(r){var i=r.getDevicePixelRatio(),n=r.getWidth(),a=r.getHeight(),o=t(n,a,i);this.setParameter(e,o)}}function wT(e,t,r){return r=r||1,function(i){var n=i.getDevicePixelRatio(),a=i.getWidth()*r,o=i.getHeight()*r;return t(a,o,n)}}function Gv(e){var t=/^expr\((.*)\)$/.exec(e);if(t)try{var r=new Function("width","height","dpr","return "+t[1]);return r(1,1),r}catch{throw new Error("Invalid expression.")}}let ST=_T;function bT(e,t){for(var r=0,i=1/t,n=e;n>0;)r=r+i*(n%t),n=Math.floor(n/t),i=i/t;return r}let yn=bT;V.import(`@export ecgl.ssao.estimate

uniform sampler2D depthTex;

uniform sampler2D normalTex;

uniform sampler2D noiseTex;

uniform vec2 depthTexSize;

uniform vec2 noiseTexSize;

uniform mat4 projection;

uniform mat4 projectionInv;

uniform mat4 viewInverseTranspose;

uniform vec3 kernel[KERNEL_SIZE];

uniform float radius : 1;

uniform float power : 1;

uniform float bias: 1e-2;

uniform float intensity: 1.0;

varying vec2 v_Texcoord;

float ssaoEstimator(in vec3 originPos, in mat3 kernelBasis) {
 float occlusion = 0.0;

 for (int i = 0; i < KERNEL_SIZE; i++) {
 vec3 samplePos = kernel[i];
#ifdef NORMALTEX_ENABLED
 samplePos = kernelBasis * samplePos;
#endif
 samplePos = samplePos * radius + originPos;

 vec4 texCoord = projection * vec4(samplePos, 1.0);
 texCoord.xy /= texCoord.w;

 vec4 depthTexel = texture2D(depthTex, texCoord.xy * 0.5 + 0.5);

 float sampleDepth = depthTexel.r * 2.0 - 1.0;
 if (projection[3][3] == 0.0) {
 sampleDepth = projection[3][2] / (sampleDepth * projection[2][3] - projection[2][2]);
 }
 else {
 sampleDepth = (sampleDepth - projection[3][2]) / projection[2][2];
 }
 
 float rangeCheck = smoothstep(0.0, 1.0, radius / abs(originPos.z - sampleDepth));
 occlusion += rangeCheck * step(samplePos.z, sampleDepth - bias);
 }
#ifdef NORMALTEX_ENABLED
 occlusion = 1.0 - occlusion / float(KERNEL_SIZE);
#else
 occlusion = 1.0 - clamp((occlusion / float(KERNEL_SIZE) - 0.6) * 2.5, 0.0, 1.0);
#endif
 return pow(occlusion, power);
}

void main()
{

 vec4 depthTexel = texture2D(depthTex, v_Texcoord);

#ifdef NORMALTEX_ENABLED
 vec4 tex = texture2D(normalTex, v_Texcoord);
 if (dot(tex.rgb, tex.rgb) == 0.0) {
 gl_FragColor = vec4(1.0);
 return;
 }
 vec3 N = tex.rgb * 2.0 - 1.0;
 N = (viewInverseTranspose * vec4(N, 0.0)).xyz;

 vec2 noiseTexCoord = depthTexSize / vec2(noiseTexSize) * v_Texcoord;
 vec3 rvec = texture2D(noiseTex, noiseTexCoord).rgb * 2.0 - 1.0;
 vec3 T = normalize(rvec - N * dot(rvec, N));
 vec3 BT = normalize(cross(N, T));
 mat3 kernelBasis = mat3(T, BT, N);
#else
 if (depthTexel.r > 0.99999) {
 gl_FragColor = vec4(1.0);
 return;
 }
 mat3 kernelBasis;
#endif

 float z = depthTexel.r * 2.0 - 1.0;

 vec4 projectedPos = vec4(v_Texcoord * 2.0 - 1.0, z, 1.0);
 vec4 p4 = projectionInv * projectedPos;

 vec3 position = p4.xyz / p4.w;

 float ao = ssaoEstimator(position, kernelBasis);
 ao = clamp(1.0 - (1.0 - ao) * intensity, 0.0, 1.0);
 gl_FragColor = vec4(vec3(ao), 1.0);
}

@end


@export ecgl.ssao.blur
#define SHADER_NAME SSAO_BLUR

uniform sampler2D ssaoTexture;

#ifdef NORMALTEX_ENABLED
uniform sampler2D normalTex;
#endif

varying vec2 v_Texcoord;

uniform vec2 textureSize;
uniform float blurSize : 1.0;

uniform int direction: 0.0;

#ifdef DEPTHTEX_ENABLED
uniform sampler2D depthTex;
uniform mat4 projection;
uniform float depthRange : 0.5;

float getLinearDepth(vec2 coord)
{
 float depth = texture2D(depthTex, coord).r * 2.0 - 1.0;
 return projection[3][2] / (depth * projection[2][3] - projection[2][2]);
}
#endif

void main()
{
 float kernel[5];
 kernel[0] = 0.122581;
 kernel[1] = 0.233062;
 kernel[2] = 0.288713;
 kernel[3] = 0.233062;
 kernel[4] = 0.122581;

 vec2 off = vec2(0.0);
 if (direction == 0) {
 off[0] = blurSize / textureSize.x;
 }
 else {
 off[1] = blurSize / textureSize.y;
 }

 vec2 coord = v_Texcoord;

 float sum = 0.0;
 float weightAll = 0.0;

#ifdef NORMALTEX_ENABLED
 vec3 centerNormal = texture2D(normalTex, v_Texcoord).rgb * 2.0 - 1.0;
#endif
#if defined(DEPTHTEX_ENABLED)
 float centerDepth = getLinearDepth(v_Texcoord);
#endif

 for (int i = 0; i < 5; i++) {
 vec2 coord = clamp(v_Texcoord + vec2(float(i) - 2.0) * off, vec2(0.0), vec2(1.0));

 float w = kernel[i];
#ifdef NORMALTEX_ENABLED
 vec3 normal = texture2D(normalTex, coord).rgb * 2.0 - 1.0;
 w *= clamp(dot(normal, centerNormal), 0.0, 1.0);
#endif
#ifdef DEPTHTEX_ENABLED
 float d = getLinearDepth(coord);
 w *= (1.0 - smoothstep(abs(centerDepth - d) / depthRange, 0.0, 1.0));
#endif

 weightAll += w;
 sum += texture2D(ssaoTexture, coord).r * w;
 }

 gl_FragColor = vec4(vec3(sum / weightAll), 1.0);
}

@end
`);function Uv(e){for(var t=new Uint8Array(e*e*4),r=0,i=new z,n=0;n<e;n++)for(var a=0;a<e;a++)i.set(Math.random()*2-1,Math.random()*2-1,0).normalize(),t[r++]=(i.x*.5+.5)*255,t[r++]=(i.y*.5+.5)*255,t[r++]=0,t[r++]=255;return t}function zv(e){return new ee({pixels:Uv(e),wrapS:X.REPEAT,wrapT:X.REPEAT,width:e,height:e})}function ET(e,t,r){var i=new Float32Array(e*3);t=t||0;for(var n=0;n<e;n++){var a=yn(n+t,2)*(r?1:2)*Math.PI,o=yn(n+t,3)*Math.PI,s=Math.random(),l=Math.cos(a)*Math.sin(o)*s,u=Math.cos(o)*s,h=Math.sin(a)*Math.sin(o)*s;i[n*3]=l,i[n*3+1]=u,i[n*3+2]=h}return i}function Tr(e){e=e||{},this._ssaoPass=new Fe({fragment:V.source("ecgl.ssao.estimate")}),this._blurPass=new Fe({fragment:V.source("ecgl.ssao.blur")}),this._framebuffer=new Je({depthBuffer:!1}),this._ssaoTexture=new ee,this._blurTexture=new ee,this._blurTexture2=new ee,this._depthTex=e.depthTexture,this._normalTex=e.normalTexture,this.setNoiseSize(4),this.setKernelSize(e.kernelSize||12),e.radius!=null&&this.setParameter("radius",e.radius),e.power!=null&&this.setParameter("power",e.power),this._normalTex||(this._ssaoPass.material.disableTexture("normalTex"),this._blurPass.material.disableTexture("normalTex")),this._depthTex||this._blurPass.material.disableTexture("depthTex"),this._blurPass.material.setUniform("normalTex",this._normalTex),this._blurPass.material.setUniform("depthTex",this._depthTex)}Tr.prototype.setDepthTexture=function(e){this._depthTex=e},Tr.prototype.setNormalTexture=function(e){this._normalTex=e,this._ssaoPass.material[e?"enableTexture":"disableTexture"]("normalTex"),this.setKernelSize(this._kernelSize)},Tr.prototype.update=function(e,t,r){var i=e.getWidth(),n=e.getHeight(),a=this._ssaoPass,o=this._blurPass;a.setUniform("kernel",this._kernels[r%this._kernels.length]),a.setUniform("depthTex",this._depthTex),this._normalTex!=null&&a.setUniform("normalTex",this._normalTex),a.setUniform("depthTexSize",[this._depthTex.width,this._depthTex.height]);var s=new W;W.transpose(s,t.worldTransform),a.setUniform("projection",t.projectionMatrix.array),a.setUniform("projectionInv",t.invProjectionMatrix.array),a.setUniform("viewInverseTranspose",s.array);var l=this._ssaoTexture,u=this._blurTexture,h=this._blurTexture2;l.width=i/2,l.height=n/2,u.width=i,u.height=n,h.width=i,h.height=n,this._framebuffer.attach(l),this._framebuffer.bind(e),e.gl.clearColor(1,1,1,1),e.gl.clear(e.gl.COLOR_BUFFER_BIT),a.render(e),o.setUniform("textureSize",[i/2,n/2]),o.setUniform("projection",t.projectionMatrix.array),this._framebuffer.attach(u),o.setUniform("direction",0),o.setUniform("ssaoTexture",l),o.render(e),this._framebuffer.attach(h),o.setUniform("textureSize",[i,n]),o.setUniform("direction",1),o.setUniform("ssaoTexture",u),o.render(e),this._framebuffer.unbind(e);var f=e.clearColor;e.gl.clearColor(f[0],f[1],f[2],f[3])},Tr.prototype.getTargetTexture=function(){return this._blurTexture2},Tr.prototype.setParameter=function(e,t){e==="noiseTexSize"?this.setNoiseSize(t):e==="kernelSize"?this.setKernelSize(t):e==="intensity"?this._ssaoPass.material.set("intensity",t):this._ssaoPass.setUniform(e,t)},Tr.prototype.setKernelSize=function(e){this._kernelSize=e,this._ssaoPass.material.define("fragment","KERNEL_SIZE",e),this._kernels=this._kernels||[];for(var t=0;t<30;t++)this._kernels[t]=ET(e,t*e,!!this._normalTex)},Tr.prototype.setNoiseSize=function(e){var t=this._ssaoPass.getUniform("noiseTex");t?(t.data=Uv(e),t.width=t.height=e,t.dirty()):(t=zv(e),this._ssaoPass.setUniform("noiseTex",zv(e))),this._ssaoPass.setUniform("noiseTexSize",[e,e])},Tr.prototype.dispose=function(e){this._blurTexture.dispose(e),this._ssaoTexture.dispose(e),this._blurTexture2.dispose(e)};let AT=Tr;V.import(`@export ecgl.ssr.main

#define SHADER_NAME SSR
#define MAX_ITERATION 20;
#define SAMPLE_PER_FRAME 5;
#define TOTAL_SAMPLES 128;

uniform sampler2D sourceTexture;
uniform sampler2D gBufferTexture1;
uniform sampler2D gBufferTexture2;
uniform sampler2D gBufferTexture3;
uniform samplerCube specularCubemap;
uniform float specularIntensity: 1;

uniform mat4 projection;
uniform mat4 projectionInv;
uniform mat4 toViewSpace;
uniform mat4 toWorldSpace;

uniform float maxRayDistance: 200;

uniform float pixelStride: 16;
uniform float pixelStrideZCutoff: 50; 
uniform float screenEdgeFadeStart: 0.9; 
uniform float eyeFadeStart : 0.2; uniform float eyeFadeEnd: 0.8; 
uniform float minGlossiness: 0.2; uniform float zThicknessThreshold: 1;

uniform float nearZ;
uniform vec2 viewportSize : VIEWPORT_SIZE;

uniform float jitterOffset: 0;

varying vec2 v_Texcoord;

#ifdef DEPTH_DECODE
@import clay.util.decode_float
#endif

#ifdef PHYSICALLY_CORRECT
uniform sampler2D normalDistribution;
uniform float sampleOffset: 0;
uniform vec2 normalDistributionSize;

vec3 transformNormal(vec3 H, vec3 N) {
 vec3 upVector = N.y > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
 vec3 tangentX = normalize(cross(N, upVector));
 vec3 tangentZ = cross(N, tangentX);
 return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);
}
vec3 importanceSampleNormalGGX(float i, float roughness, vec3 N) {
 float p = fract((i + sampleOffset) / float(TOTAL_SAMPLES));
 vec3 H = texture2D(normalDistribution,vec2(roughness, p)).rgb;
 return transformNormal(H, N);
}
float G_Smith(float g, float ndv, float ndl) {
 float roughness = 1.0 - g;
 float k = roughness * roughness / 2.0;
 float G1V = ndv / (ndv * (1.0 - k) + k);
 float G1L = ndl / (ndl * (1.0 - k) + k);
 return G1L * G1V;
}
vec3 F_Schlick(float ndv, vec3 spec) {
 return spec + (1.0 - spec) * pow(1.0 - ndv, 5.0);
}
#endif

float fetchDepth(sampler2D depthTexture, vec2 uv)
{
 vec4 depthTexel = texture2D(depthTexture, uv);
 return depthTexel.r * 2.0 - 1.0;
}

float linearDepth(float depth)
{
 if (projection[3][3] == 0.0) {
 return projection[3][2] / (depth * projection[2][3] - projection[2][2]);
 }
 else {
 return (depth - projection[3][2]) / projection[2][2];
 }
}

bool rayIntersectDepth(float rayZNear, float rayZFar, vec2 hitPixel)
{
 if (rayZFar > rayZNear)
 {
 float t = rayZFar; rayZFar = rayZNear; rayZNear = t;
 }
 float cameraZ = linearDepth(fetchDepth(gBufferTexture2, hitPixel));
 return rayZFar <= cameraZ && rayZNear >= cameraZ - zThicknessThreshold;
}


bool traceScreenSpaceRay(
 vec3 rayOrigin, vec3 rayDir, float jitter,
 out vec2 hitPixel, out vec3 hitPoint, out float iterationCount
)
{
 float rayLength = ((rayOrigin.z + rayDir.z * maxRayDistance) > -nearZ)
 ? (-nearZ - rayOrigin.z) / rayDir.z : maxRayDistance;

 vec3 rayEnd = rayOrigin + rayDir * rayLength;

 vec4 H0 = projection * vec4(rayOrigin, 1.0);
 vec4 H1 = projection * vec4(rayEnd, 1.0);

 float k0 = 1.0 / H0.w, k1 = 1.0 / H1.w;

 vec3 Q0 = rayOrigin * k0, Q1 = rayEnd * k1;

 vec2 P0 = (H0.xy * k0 * 0.5 + 0.5) * viewportSize;
 vec2 P1 = (H1.xy * k1 * 0.5 + 0.5) * viewportSize;

 P1 += dot(P1 - P0, P1 - P0) < 0.0001 ? 0.01 : 0.0;
 vec2 delta = P1 - P0;

 bool permute = false;
 if (abs(delta.x) < abs(delta.y)) {
 permute = true;
 delta = delta.yx;
 P0 = P0.yx;
 P1 = P1.yx;
 }
 float stepDir = sign(delta.x);
 float invdx = stepDir / delta.x;

 vec3 dQ = (Q1 - Q0) * invdx;
 float dk = (k1 - k0) * invdx;

 vec2 dP = vec2(stepDir, delta.y * invdx);

 float strideScaler = 1.0 - min(1.0, -rayOrigin.z / pixelStrideZCutoff);
 float pixStride = 1.0 + strideScaler * pixelStride;

 dP *= pixStride; dQ *= pixStride; dk *= pixStride;

 vec4 pqk = vec4(P0, Q0.z, k0);
 vec4 dPQK = vec4(dP, dQ.z, dk);

 pqk += dPQK * jitter;
 float rayZFar = (dPQK.z * 0.5 + pqk.z) / (dPQK.w * 0.5 + pqk.w);
 float rayZNear;

 bool intersect = false;

 vec2 texelSize = 1.0 / viewportSize;

 iterationCount = 0.0;

 for (int i = 0; i < MAX_ITERATION; i++)
 {
 pqk += dPQK;

 rayZNear = rayZFar;
 rayZFar = (dPQK.z * 0.5 + pqk.z) / (dPQK.w * 0.5 + pqk.w);

 hitPixel = permute ? pqk.yx : pqk.xy;
 hitPixel *= texelSize;

 intersect = rayIntersectDepth(rayZNear, rayZFar, hitPixel);

 iterationCount += 1.0;

 dPQK *= 1.2;

 if (intersect) {
 break;
 }
 }

 Q0.xy += dQ.xy * iterationCount;
 Q0.z = pqk.z;
 hitPoint = Q0 / pqk.w;

 return intersect;
}

float calculateAlpha(
 float iterationCount, float reflectivity,
 vec2 hitPixel, vec3 hitPoint, float dist, vec3 rayDir
)
{
 float alpha = clamp(reflectivity, 0.0, 1.0);
 alpha *= 1.0 - (iterationCount / float(MAX_ITERATION));
 vec2 hitPixelNDC = hitPixel * 2.0 - 1.0;
 float maxDimension = min(1.0, max(abs(hitPixelNDC.x), abs(hitPixelNDC.y)));
 alpha *= 1.0 - max(0.0, maxDimension - screenEdgeFadeStart) / (1.0 - screenEdgeFadeStart);

 float _eyeFadeStart = eyeFadeStart;
 float _eyeFadeEnd = eyeFadeEnd;
 if (_eyeFadeStart > _eyeFadeEnd) {
 float tmp = _eyeFadeEnd;
 _eyeFadeEnd = _eyeFadeStart;
 _eyeFadeStart = tmp;
 }

 float eyeDir = clamp(rayDir.z, _eyeFadeStart, _eyeFadeEnd);
 alpha *= 1.0 - (eyeDir - _eyeFadeStart) / (_eyeFadeEnd - _eyeFadeStart);

 alpha *= 1.0 - clamp(dist / maxRayDistance, 0.0, 1.0);

 return alpha;
}

@import clay.util.rand

@import clay.util.rgbm

void main()
{
 vec4 normalAndGloss = texture2D(gBufferTexture1, v_Texcoord);

 if (dot(normalAndGloss.rgb, vec3(1.0)) == 0.0) {
 discard;
 }

 float g = normalAndGloss.a;
#if !defined(PHYSICALLY_CORRECT)
 if (g <= minGlossiness) {
 discard;
 }
#endif

 float reflectivity = (g - minGlossiness) / (1.0 - minGlossiness);

 vec3 N = normalize(normalAndGloss.rgb * 2.0 - 1.0);
 N = normalize((toViewSpace * vec4(N, 0.0)).xyz);

 vec4 projectedPos = vec4(v_Texcoord * 2.0 - 1.0, fetchDepth(gBufferTexture2, v_Texcoord), 1.0);
 vec4 pos = projectionInv * projectedPos;
 vec3 rayOrigin = pos.xyz / pos.w;
 vec3 V = -normalize(rayOrigin);

 float ndv = clamp(dot(N, V), 0.0, 1.0);
 float iterationCount;
 float jitter = rand(fract(v_Texcoord + jitterOffset));

#ifdef PHYSICALLY_CORRECT
 vec4 color = vec4(vec3(0.0), 1.0);
 vec4 albedoMetalness = texture2D(gBufferTexture3, v_Texcoord);
 vec3 albedo = albedoMetalness.rgb;
 float m = albedoMetalness.a;
 vec3 diffuseColor = albedo * (1.0 - m);
 vec3 spec = mix(vec3(0.04), albedo, m);

 float jitter2 = rand(fract(v_Texcoord)) * float(TOTAL_SAMPLES);

 for (int i = 0; i < SAMPLE_PER_FRAME; i++) {
 vec3 H = importanceSampleNormalGGX(float(i) + jitter2, 1.0 - g, N);
 vec3 rayDir = normalize(reflect(-V, H));
#else
 vec3 rayDir = normalize(reflect(-V, N));
#endif
 vec2 hitPixel;
 vec3 hitPoint;

 bool intersect = traceScreenSpaceRay(rayOrigin, rayDir, jitter, hitPixel, hitPoint, iterationCount);

 float dist = distance(rayOrigin, hitPoint);

 vec3 hitNormal = texture2D(gBufferTexture1, hitPixel).rgb * 2.0 - 1.0;
 hitNormal = normalize((toViewSpace * vec4(hitNormal, 0.0)).xyz);
#ifdef PHYSICALLY_CORRECT
 float ndl = clamp(dot(N, rayDir), 0.0, 1.0);
 float vdh = clamp(dot(V, H), 0.0, 1.0);
 float ndh = clamp(dot(N, H), 0.0, 1.0);
 vec3 litTexel = vec3(0.0);
 if (dot(hitNormal, rayDir) < 0.0 && intersect) {
 litTexel = texture2D(sourceTexture, hitPixel).rgb;
 litTexel *= pow(clamp(1.0 - dist / 200.0, 0.0, 1.0), 3.0);

 }
 else {
 #ifdef SPECULARCUBEMAP_ENABLED
 vec3 rayDirW = normalize(toWorldSpace * vec4(rayDir, 0.0)).rgb;
 litTexel = RGBMDecode(textureCubeLodEXT(specularCubemap, rayDirW, 0.0), 8.12).rgb * specularIntensity;
#endif
 }
 color.rgb += ndl * litTexel * (
 F_Schlick(ndl, spec) * G_Smith(g, ndv, ndl) * vdh / (ndh * ndv + 0.001)
 );
 }
 color.rgb /= float(SAMPLE_PER_FRAME);
#else
 #if !defined(SPECULARCUBEMAP_ENABLED)
 if (dot(hitNormal, rayDir) >= 0.0) {
 discard;
 }
 if (!intersect) {
 discard;
 }
#endif
 float alpha = clamp(calculateAlpha(iterationCount, reflectivity, hitPixel, hitPoint, dist, rayDir), 0.0, 1.0);
 vec4 color = texture2D(sourceTexture, hitPixel);
 color.rgb *= alpha;

#ifdef SPECULARCUBEMAP_ENABLED
 vec3 rayDirW = normalize(toWorldSpace * vec4(rayDir, 0.0)).rgb;
 alpha = alpha * (intersect ? 1.0 : 0.0);
 float bias = (1.0 -g) * 5.0;
 color.rgb += (1.0 - alpha)
 * RGBMDecode(textureCubeLodEXT(specularCubemap, rayDirW, bias), 8.12).rgb
 * specularIntensity;
#endif

#endif

 gl_FragColor = encodeHDR(color);
}
@end

@export ecgl.ssr.blur

uniform sampler2D texture;
uniform sampler2D gBufferTexture1;
uniform sampler2D gBufferTexture2;
uniform mat4 projection;
uniform float depthRange : 0.05;

varying vec2 v_Texcoord;

uniform vec2 textureSize;
uniform float blurSize : 1.0;

#ifdef BLEND
 #ifdef SSAOTEX_ENABLED
uniform sampler2D ssaoTex;
 #endif
uniform sampler2D sourceTexture;
#endif

float getLinearDepth(vec2 coord)
{
 float depth = texture2D(gBufferTexture2, coord).r * 2.0 - 1.0;
 return projection[3][2] / (depth * projection[2][3] - projection[2][2]);
}

@import clay.util.rgbm


void main()
{
 @import clay.compositor.kernel.gaussian_9

 vec4 centerNTexel = texture2D(gBufferTexture1, v_Texcoord);
 float g = centerNTexel.a;
 float maxBlurSize = clamp(1.0 - g, 0.0, 1.0) * blurSize;
#ifdef VERTICAL
 vec2 off = vec2(0.0, maxBlurSize / textureSize.y);
#else
 vec2 off = vec2(maxBlurSize / textureSize.x, 0.0);
#endif

 vec2 coord = v_Texcoord;

 vec4 sum = vec4(0.0);
 float weightAll = 0.0;

 vec3 cN = centerNTexel.rgb * 2.0 - 1.0;
 float cD = getLinearDepth(v_Texcoord);
 for (int i = 0; i < 9; i++) {
 vec2 coord = clamp((float(i) - 4.0) * off + v_Texcoord, vec2(0.0), vec2(1.0));
 float w = gaussianKernel[i]
 * clamp(dot(cN, texture2D(gBufferTexture1, coord).rgb * 2.0 - 1.0), 0.0, 1.0);
 float d = getLinearDepth(coord);
 w *= (1.0 - smoothstep(abs(cD - d) / depthRange, 0.0, 1.0));

 weightAll += w;
 sum += decodeHDR(texture2D(texture, coord)) * w;
 }

#ifdef BLEND
 float aoFactor = 1.0;
 #ifdef SSAOTEX_ENABLED
 aoFactor = texture2D(ssaoTex, v_Texcoord).r;
 #endif
 gl_FragColor = encodeHDR(
 sum / weightAll * aoFactor + decodeHDR(texture2D(sourceTexture, v_Texcoord))
 );
#else
 gl_FragColor = encodeHDR(sum / weightAll);
#endif
}

@end`);function wr(e){e=e||{},this._ssrPass=new Fe({fragment:V.source("ecgl.ssr.main"),clearColor:[0,0,0,0]}),this._blurPass1=new Fe({fragment:V.source("ecgl.ssr.blur"),clearColor:[0,0,0,0]}),this._blurPass2=new Fe({fragment:V.source("ecgl.ssr.blur"),clearColor:[0,0,0,0]}),this._blendPass=new Fe({fragment:V.source("clay.compositor.blend")}),this._blendPass.material.disableTexturesAll(),this._blendPass.material.enableTexture(["texture1","texture2"]),this._ssrPass.setUniform("gBufferTexture1",e.normalTexture),this._ssrPass.setUniform("gBufferTexture2",e.depthTexture),this._blurPass1.setUniform("gBufferTexture1",e.normalTexture),this._blurPass1.setUniform("gBufferTexture2",e.depthTexture),this._blurPass2.setUniform("gBufferTexture1",e.normalTexture),this._blurPass2.setUniform("gBufferTexture2",e.depthTexture),this._blurPass2.material.define("fragment","VERTICAL"),this._blurPass2.material.define("fragment","BLEND"),this._ssrTexture=new ee({type:X.HALF_FLOAT}),this._texture2=new ee({type:X.HALF_FLOAT}),this._texture3=new ee({type:X.HALF_FLOAT}),this._prevTexture=new ee({type:X.HALF_FLOAT}),this._currentTexture=new ee({type:X.HALF_FLOAT}),this._frameBuffer=new Je({depthBuffer:!1}),this._normalDistribution=null,this._totalSamples=256,this._samplePerFrame=4,this._ssrPass.material.define("fragment","SAMPLE_PER_FRAME",this._samplePerFrame),this._ssrPass.material.define("fragment","TOTAL_SAMPLES",this._totalSamples),this._downScale=1}wr.prototype.setAmbientCubemap=function(e,t){this._ssrPass.material.set("specularCubemap",e),this._ssrPass.material.set("specularIntensity",t);var r=e&&t;this._ssrPass.material[r?"enableTexture":"disableTexture"]("specularCubemap")},wr.prototype.update=function(e,t,r,i){var n=e.getWidth(),a=e.getHeight(),o=this._ssrTexture,s=this._texture2,l=this._texture3;o.width=this._prevTexture.width=this._currentTexture.width=n/this._downScale,o.height=this._prevTexture.height=this._currentTexture.height=a/this._downScale,s.width=l.width=n,s.height=l.height=a;var u=this._frameBuffer,h=this._ssrPass,f=this._blurPass1,c=this._blurPass2,d=this._blendPass,v=new W,p=new W;W.transpose(v,t.worldTransform),W.transpose(p,t.viewMatrix),h.setUniform("sourceTexture",r),h.setUniform("projection",t.projectionMatrix.array),h.setUniform("projectionInv",t.invProjectionMatrix.array),h.setUniform("toViewSpace",v.array),h.setUniform("toWorldSpace",p.array),h.setUniform("nearZ",t.near);var _=i/this._totalSamples*this._samplePerFrame;if(h.setUniform("jitterOffset",_),h.setUniform("sampleOffset",i*this._samplePerFrame),f.setUniform("textureSize",[o.width,o.height]),c.setUniform("textureSize",[n,a]),c.setUniform("sourceTexture",r),f.setUniform("projection",t.projectionMatrix.array),c.setUniform("projection",t.projectionMatrix.array),u.attach(o),u.bind(e),h.render(e),this._physicallyCorrect&&(u.attach(this._currentTexture),d.setUniform("texture1",this._prevTexture),d.setUniform("texture2",o),d.material.set({weight1:i>=1?.95:0,weight2:i>=1?.05:1}),d.render(e)),u.attach(s),f.setUniform("texture",this._physicallyCorrect?this._currentTexture:o),f.render(e),u.attach(l),c.setUniform("texture",s),c.render(e),u.unbind(e),this._physicallyCorrect){var g=this._prevTexture;this._prevTexture=this._currentTexture,this._currentTexture=g}},wr.prototype.getTargetTexture=function(){return this._texture3},wr.prototype.setParameter=function(e,t){e==="maxIteration"?this._ssrPass.material.define("fragment","MAX_ITERATION",t):this._ssrPass.setUniform(e,t)},wr.prototype.setPhysicallyCorrect=function(e){e?(this._normalDistribution||(this._normalDistribution=fo.generateNormalDistribution(64,this._totalSamples)),this._ssrPass.material.define("fragment","PHYSICALLY_CORRECT"),this._ssrPass.material.set("normalDistribution",this._normalDistribution),this._ssrPass.material.set("normalDistributionSize",[64,this._totalSamples])):this._ssrPass.material.undefine("fragment","PHYSICALLY_CORRECT"),this._physicallyCorrect=e},wr.prototype.setSSAOTexture=function(e){var t=this._blurPass2;e?(t.material.enableTexture("ssaoTex"),t.material.set("ssaoTex",e)):t.material.disableTexture("ssaoTex")},wr.prototype.isFinished=function(e){return this._physicallyCorrect?e>this._totalSamples/this._samplePerFrame:!0},wr.prototype.dispose=function(e){this._ssrTexture.dispose(e),this._texture2.dispose(e),this._texture3.dispose(e),this._prevTexture.dispose(e),this._currentTexture.dispose(e),this._frameBuffer.dispose(e)};let MT=wr,Hv=[0,0,-.321585265978,-.154972575841,.458126042375,.188473391593,.842080129861,.527766490688,.147304551086,-.659453822776,-.331943915203,-.940619700594,.0479226680259,.54812163202,.701581552186,-.709825561388,-.295436780218,.940589268233,-.901489676764,.237713156085,.973570876096,-.109899459384,-.866792314779,-.451805525005,.330975007087,.800048655954,-.344275183665,.381779221166,-.386139432542,-.437418421534,-.576478634965,-.0148463392551,.385798197415,-.262426961053,-.666302061145,.682427250835,-.628010632582,-.732836215494,.10163141741,-.987658134403,.711995289051,-.320024291314,.0296005138058,.950296523438,.0130612307608,-.351024443122,-.879596633704,-.10478487883,.435712737232,.504254490347,.779203817497,.206477676721,.388264289969,-.896736162545,-.153106280781,-.629203242522,-.245517550697,.657969239148,.126830499058,.26862328493,-.634888119007,-.302301223431,.617074219636,.779817204925];V.import(`@export ecgl.normal.vertex

@import ecgl.common.transformUniforms

@import ecgl.common.uv.header

@import ecgl.common.attributes

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

@import ecgl.common.normalMap.vertexHeader

@import ecgl.common.vertexAnimation.header

void main()
{

 @import ecgl.common.vertexAnimation.main

 @import ecgl.common.uv.main

 v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);
 v_WorldPosition = (world * vec4(pos, 1.0)).xyz;

 @import ecgl.common.normalMap.vertexMain

 gl_Position = worldViewProjection * vec4(pos, 1.0);

}


@end


@export ecgl.normal.fragment

#define ROUGHNESS_CHANEL 0

uniform bool useBumpMap;
uniform bool useRoughnessMap;
uniform bool doubleSide;
uniform float roughness;

@import ecgl.common.uv.fragmentHeader

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform mat4 viewInverse : VIEWINVERSE;

@import ecgl.common.normalMap.fragmentHeader
@import ecgl.common.bumpMap.header

uniform sampler2D roughnessMap;

void main()
{
 vec3 N = v_Normal;
 
 bool flipNormal = false;
 if (doubleSide) {
 vec3 eyePos = viewInverse[3].xyz;
 vec3 V = normalize(eyePos - v_WorldPosition);

 if (dot(N, V) < 0.0) {
 flipNormal = true;
 }
 }

 @import ecgl.common.normalMap.fragmentMain

 if (useBumpMap) {
 N = bumpNormal(v_WorldPosition, v_Normal, N);
 }

 float g = 1.0 - roughness;

 if (useRoughnessMap) {
 float g2 = 1.0 - texture2D(roughnessMap, v_DetailTexcoord)[ROUGHNESS_CHANEL];
 g = clamp(g2 + (g - 0.5) * 2.0, 0.0, 1.0);
 }

 if (flipNormal) {
 N = -N;
 }

 gl_FragColor.rgb = (N.xyz + 1.0) * 0.5;
 gl_FragColor.a = g;
}
@end`);function Yu(e,t,r,i,n){var a=e.gl;t.setUniform(a,"1i",r,n),a.activeTexture(a.TEXTURE0+n),i.isRenderable()?i.bind(e):i.unbind(e)}function DT(e,t,r,i,n){var a,o,s,l,u=e.gl;return function(h,f,c){if(!(l&&l.material===h.material)){var d=h.material,v=h.__program,p=d.get("roughness");p==null&&(p=1);var _=d.get("normalMap")||t,g=d.get("roughnessMap"),m=d.get("bumpMap"),y=d.get("uvRepeat"),x=d.get("uvOffset"),w=d.get("detailUvRepeat"),T=d.get("detailUvOffset"),E=!!m&&d.isTextureEnabled("bumpMap"),b=!!g&&d.isTextureEnabled("roughnessMap"),D=d.isDefined("fragment","DOUBLE_SIDED");m=m||r,g=g||i,c!==f?(f.set("normalMap",_),f.set("bumpMap",m),f.set("roughnessMap",g),f.set("useBumpMap",E),f.set("useRoughnessMap",b),f.set("doubleSide",D),y!=null&&f.set("uvRepeat",y),x!=null&&f.set("uvOffset",x),w!=null&&f.set("detailUvRepeat",w),T!=null&&f.set("detailUvOffset",T),f.set("roughness",p)):(v.setUniform(u,"1f","roughness",p),a!==_&&Yu(e,v,"normalMap",_,0),o!==m&&m&&Yu(e,v,"bumpMap",m,1),s!==g&&g&&Yu(e,v,"roughnessMap",g,2),y!=null&&v.setUniform(u,"2f","uvRepeat",y),x!=null&&v.setUniform(u,"2f","uvOffset",x),w!=null&&v.setUniform(u,"2f","detailUvRepeat",w),T!=null&&v.setUniform(u,"2f","detailUvOffset",T),v.setUniform(u,"1i","useBumpMap",+E),v.setUniform(u,"1i","useRoughnessMap",+b),v.setUniform(u,"1i","doubleSide",+D)),a=_,o=m,s=g,l=h}}}function xn(e){e=e||{},this._depthTex=new ee({format:X.DEPTH_COMPONENT,type:X.UNSIGNED_INT}),this._normalTex=new ee({type:X.HALF_FLOAT}),this._framebuffer=new Je,this._framebuffer.attach(this._normalTex),this._framebuffer.attach(this._depthTex,Je.DEPTH_ATTACHMENT),this._normalMaterial=new Gt({shader:new V(V.source("ecgl.normal.vertex"),V.source("ecgl.normal.fragment"))}),this._normalMaterial.enableTexture(["normalMap","bumpMap","roughnessMap"]),this._defaultNormalMap=ri.createBlank("#000"),this._defaultBumpMap=ri.createBlank("#000"),this._defaultRoughessMap=ri.createBlank("#000"),this._debugPass=new Fe({fragment:V.source("clay.compositor.output")}),this._debugPass.setUniform("texture",this._normalTex),this._debugPass.material.undefine("fragment","OUTPUT_ALPHA")}xn.prototype.getDepthTexture=function(){return this._depthTex},xn.prototype.getNormalTexture=function(){return this._normalTex},xn.prototype.update=function(e,t,r){var i=e.getWidth(),n=e.getHeight(),a=this._depthTex,o=this._normalTex,s=this._normalMaterial;a.width=i,a.height=n,o.width=i,o.height=n;var l=t.getRenderList(r).opaque;this._framebuffer.bind(e),e.gl.clearColor(0,0,0,0),e.gl.clear(e.gl.COLOR_BUFFER_BIT|e.gl.DEPTH_BUFFER_BIT),e.gl.disable(e.gl.BLEND),e.renderPass(l,r,{getMaterial:function(){return s},ifRender:function(u){return u.renderNormal},beforeRender:DT(e,this._defaultNormalMap,this._defaultBumpMap,this._defaultRoughessMap,this._normalMaterial),sort:e.opaqueSortCompare}),this._framebuffer.unbind(e)},xn.prototype.renderDebug=function(e){this._debugPass.render(e)},xn.prototype.dispose=function(e){this._depthTex.dispose(e),this._normalTex.dispose(e)};let CT=xn;function Ma(e){e=e||{},this._edgePass=new Fe({fragment:V.source("ecgl.edge")}),this._edgePass.setUniform("normalTexture",e.normalTexture),this._edgePass.setUniform("depthTexture",e.depthTexture),this._targetTexture=new ee({type:X.HALF_FLOAT}),this._frameBuffer=new Je,this._frameBuffer.attach(this._targetTexture)}Ma.prototype.update=function(e,t,r,i){var n=e.getWidth(),a=e.getHeight(),o=this._targetTexture;o.width=n,o.height=a;var s=this._frameBuffer;s.bind(e),this._edgePass.setUniform("projectionInv",t.invProjectionMatrix.array),this._edgePass.setUniform("textureSize",[n,a]),this._edgePass.setUniform("texture",r),this._edgePass.render(e),s.unbind(e)},Ma.prototype.getTargetTexture=function(){return this._targetTexture},Ma.prototype.setParameter=function(e,t){this._edgePass.setUniform(e,t)},Ma.prototype.dispose=function(e){this._targetTexture.dispose(e),this._frameBuffer.dispose(e)};let LT=Ma,PT={type:"compositor",nodes:[{name:"source",type:"texture",outputs:{color:{}}},{name:"source_half",shader:"#source(clay.compositor.downsample)",inputs:{texture:"source"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"bright",shader:"#source(clay.compositor.bright)",inputs:{texture:"source_half"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{threshold:2,scale:4,textureSize:"expr([width * 1.0 / 2, height / 2])"}},{name:"bright_downsample_4",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 2, height / 2] )"}},{name:"bright_downsample_8",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_4"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 4, height / 4] )"}},{name:"bright_downsample_16",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_8"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 8, height / 8] )"}},{name:"bright_downsample_32",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_16"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 32)",height:"expr(height * 1.0 / 32)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 16, height / 16] )"}},{name:"bright_upsample_16_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_32"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 32, height / 32] )"}},{name:"bright_upsample_16_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_16_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 16, height * 1.0 / 16] )"}},{name:"bright_upsample_8_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_16"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 16, height * 1.0 / 16] )"}},{name:"bright_upsample_8_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_8_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 8, height * 1.0 / 8] )"}},{name:"bright_upsample_8_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_8_blur_v",texture2:"bright_upsample_16_blur_v"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_4_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_8"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 8, height * 1.0 / 8] )"}},{name:"bright_upsample_4_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_4_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 4, height * 1.0 / 4] )"}},{name:"bright_upsample_4_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_4_blur_v",texture2:"bright_upsample_8_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_2_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_4"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 4, height * 1.0 / 4] )"}},{name:"bright_upsample_2_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_2_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 2, height * 1.0 / 2] )"}},{name:"bright_upsample_2_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_2_blur_v",texture2:"bright_upsample_4_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_full_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 2, height * 1.0 / 2] )"}},{name:"bright_upsample_full_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_full_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"bloom_composite",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_full_blur_v",texture2:"bright_upsample_2_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"coc",shader:"#source(ecgl.dof.coc)",outputs:{color:{parameters:{minFilter:"NEAREST",magFilter:"NEAREST",width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},parameters:{focalDist:50,focalRange:30}},{name:"dof_far_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"source",coc:"coc"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"dof_near_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"source",coc:"coc"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"},defines:{BLUR_NEARFIELD:null}},{name:"dof_coc_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"coc"},outputs:{color:{parameters:{minFilter:"NEAREST",magFilter:"NEAREST",width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"},defines:{BLUR_COC:null}},{name:"dof_composite",shader:"#source(ecgl.dof.composite)",inputs:{original:"source",blurred:"dof_far_blur",nearfield:"dof_near_blur",coc:"coc",nearcoc:"dof_coc_blur"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}}},{name:"composite",shader:"#source(clay.compositor.hdr.composite)",inputs:{texture:"source",bloom:"bloom_composite"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},defines:{}},{name:"FXAA",shader:"#source(clay.compositor.fxaa)",inputs:{texture:"composite"}}]},RT=`@export ecgl.dof.coc

uniform sampler2D depth;

uniform float zNear: 0.1;
uniform float zFar: 2000;

uniform float focalDistance: 3;
uniform float focalRange: 1;
uniform float focalLength: 30;
uniform float fstop: 2.8;

varying vec2 v_Texcoord;

@import clay.util.encode_float

void main()
{
 float z = texture2D(depth, v_Texcoord).r * 2.0 - 1.0;

 float dist = 2.0 * zNear * zFar / (zFar + zNear - z * (zFar - zNear));

 float aperture = focalLength / fstop;

 float coc;

 float uppper = focalDistance + focalRange;
 float lower = focalDistance - focalRange;
 if (dist <= uppper && dist >= lower) {
 coc = 0.5;
 }
 else {
 float focalAdjusted = dist > uppper ? uppper : lower;

 coc = abs(aperture * (focalLength * (dist - focalAdjusted)) / (dist * (focalAdjusted - focalLength)));
 coc = clamp(coc, 0.0, 2.0) / 2.00001;

 if (dist < lower) {
 coc = -coc;
 }
 coc = coc * 0.5 + 0.5;
 }

 gl_FragColor = encodeFloat(coc);
}
@end


@export ecgl.dof.composite

#define DEBUG 0

uniform sampler2D original;
uniform sampler2D blurred;
uniform sampler2D nearfield;
uniform sampler2D coc;
uniform sampler2D nearcoc;
varying vec2 v_Texcoord;

@import clay.util.rgbm
@import clay.util.float

void main()
{
 vec4 blurredColor = texture2D(blurred, v_Texcoord);
 vec4 originalColor = texture2D(original, v_Texcoord);

 float fCoc = decodeFloat(texture2D(coc, v_Texcoord));

 fCoc = abs(fCoc * 2.0 - 1.0);

 float weight = smoothstep(0.0, 1.0, fCoc);
 
#ifdef NEARFIELD_ENABLED
 vec4 nearfieldColor = texture2D(nearfield, v_Texcoord);
 float fNearCoc = decodeFloat(texture2D(nearcoc, v_Texcoord));
 fNearCoc = abs(fNearCoc * 2.0 - 1.0);

 gl_FragColor = encodeHDR(
 mix(
 nearfieldColor, mix(originalColor, blurredColor, weight),
 pow(1.0 - fNearCoc, 4.0)
 )
 );
#else
 gl_FragColor = encodeHDR(mix(originalColor, blurredColor, weight));
#endif

}

@end



@export ecgl.dof.diskBlur

#define POISSON_KERNEL_SIZE 16;

uniform sampler2D texture;
uniform sampler2D coc;
varying vec2 v_Texcoord;

uniform float blurRadius : 10.0;
uniform vec2 textureSize : [512.0, 512.0];

uniform vec2 poissonKernel[POISSON_KERNEL_SIZE];

uniform float percent;

float nrand(const in vec2 n) {
 return fract(sin(dot(n.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

@import clay.util.rgbm
@import clay.util.float


void main()
{
 vec2 offset = blurRadius / textureSize;

 float rnd = 6.28318 * nrand(v_Texcoord + 0.07 * percent );
 float cosa = cos(rnd);
 float sina = sin(rnd);
 vec4 basis = vec4(cosa, -sina, sina, cosa);

#if !defined(BLUR_NEARFIELD) && !defined(BLUR_COC)
 offset *= abs(decodeFloat(texture2D(coc, v_Texcoord)) * 2.0 - 1.0);
#endif

#ifdef BLUR_COC
 float cocSum = 0.0;
#else
 vec4 color = vec4(0.0);
#endif


 float weightSum = 0.0;

 for (int i = 0; i < POISSON_KERNEL_SIZE; i++) {
 vec2 ofs = poissonKernel[i];

 ofs = vec2(dot(ofs, basis.xy), dot(ofs, basis.zw));

 vec2 uv = v_Texcoord + ofs * offset;
 vec4 texel = texture2D(texture, uv);

 float w = 1.0;
#ifdef BLUR_COC
 float fCoc = decodeFloat(texel) * 2.0 - 1.0;
 cocSum += clamp(fCoc, -1.0, 0.0) * w;
#else
 texel = texel;
 #if !defined(BLUR_NEARFIELD)
 float fCoc = decodeFloat(texture2D(coc, uv)) * 2.0 - 1.0;
 w *= abs(fCoc);
 #endif
 texel.rgb *= texel.a;
 color += texel * w;
#endif

 weightSum += w;
 }

#ifdef BLUR_COC
 gl_FragColor = encodeFloat(clamp(cocSum / weightSum, -1.0, 0.0) * 0.5 + 0.5);
#else
 color /= weightSum;
 color.rgb /= (color.a + 0.0001);
 gl_FragColor = color;
#endif
}

@end`,NT=`@export ecgl.edge

uniform sampler2D texture;

uniform sampler2D normalTexture;
uniform sampler2D depthTexture;

uniform mat4 projectionInv;

uniform vec2 textureSize;

uniform vec4 edgeColor: [0,0,0,0.8];

varying vec2 v_Texcoord;

vec3 packColor(vec2 coord) {
 float z = texture2D(depthTexture, coord).r * 2.0 - 1.0;
 vec4 p = vec4(v_Texcoord * 2.0 - 1.0, z, 1.0);
 vec4 p4 = projectionInv * p;

 return vec3(
 texture2D(normalTexture, coord).rg,
 -p4.z / p4.w / 5.0
 );
}

void main() {
 vec2 cc = v_Texcoord;
 vec3 center = packColor(cc);

 float size = clamp(1.0 - (center.z - 10.0) / 100.0, 0.0, 1.0) * 0.5;
 float dx = size / textureSize.x;
 float dy = size / textureSize.y;

 vec2 coord;
 vec3 topLeft = packColor(cc+vec2(-dx, -dy));
 vec3 top = packColor(cc+vec2(0.0, -dy));
 vec3 topRight = packColor(cc+vec2(dx, -dy));
 vec3 left = packColor(cc+vec2(-dx, 0.0));
 vec3 right = packColor(cc+vec2(dx, 0.0));
 vec3 bottomLeft = packColor(cc+vec2(-dx, dy));
 vec3 bottom = packColor(cc+vec2(0.0, dy));
 vec3 bottomRight = packColor(cc+vec2(dx, dy));

 vec3 v = -topLeft-2.0*top-topRight+bottomLeft+2.0*bottom+bottomRight;
 vec3 h = -bottomLeft-2.0*left-topLeft+bottomRight+2.0*right+topRight;

 float edge = sqrt(dot(h, h) + dot(v, v));

 edge = smoothstep(0.8, 1.0, edge);

 gl_FragColor = mix(texture2D(texture, v_Texcoord), vec4(edgeColor.rgb, 1.0), edgeColor.a * edge);
}
@end`;V.import(Cv),V.import(Lv),V.import(Pv),V.import(Rv),V.import(Nv),V.import(Iv),V.import(Ov),V.import(Bv),V.import(Fv),V.import(RT),V.import(NT);function Vv(e,t){return{color:{parameters:{width:e,height:t}}}}var Ku=["composite","FXAA"];function oe(){this._width,this._height,this._dpr,this._sourceTexture=new ee({type:X.HALF_FLOAT}),this._depthTexture=new ee({format:X.DEPTH_COMPONENT,type:X.UNSIGNED_INT}),this._framebuffer=new Je,this._framebuffer.attach(this._sourceTexture),this._framebuffer.attach(this._depthTexture,Je.DEPTH_ATTACHMENT),this._normalPass=new CT,this._compositor=ST(PT);var e=this._compositor.getNodeByName("source");e.texture=this._sourceTexture;var t=this._compositor.getNodeByName("coc");this._sourceNode=e,this._cocNode=t,this._compositeNode=this._compositor.getNodeByName("composite"),this._fxaaNode=this._compositor.getNodeByName("FXAA"),this._dofBlurNodes=["dof_far_blur","dof_near_blur","dof_coc_blur"].map(function(i){return this._compositor.getNodeByName(i)},this),this._dofBlurKernel=0,this._dofBlurKernelSize=new Float32Array(0),this._finalNodesChain=Ku.map(function(i){return this._compositor.getNodeByName(i)},this);var r={normalTexture:this._normalPass.getNormalTexture(),depthTexture:this._normalPass.getDepthTexture()};this._ssaoPass=new AT(r),this._ssrPass=new MT(r),this._edgePass=new LT(r)}oe.prototype.resize=function(i,n,r){r=r||1;var i=i*r,n=n*r,a=this._sourceTexture,o=this._depthTexture;a.width=i,a.height=n,o.width=i,o.height=n;var s={getWidth:function(){return i},getHeight:function(){return n},getDevicePixelRatio:function(){return r}};function l(u,h){if(typeof u[h]=="function"){var f=u[h].__original||u[h];u[h]=function(c){return f.call(this,s)},u[h].__original=f}}this._compositor.nodes.forEach(function(u){for(var h in u.outputs){var f=u.outputs[h].parameters;f&&(l(f,"width"),l(f,"height"))}for(var c in u.parameters)l(u.parameters,c)}),this._width=i,this._height=n,this._dpr=r},oe.prototype.getWidth=function(){return this._width},oe.prototype.getHeight=function(){return this._height},oe.prototype._ifRenderNormalPass=function(){return this._enableSSAO||this._enableEdge||this._enableSSR},oe.prototype._getPrevNode=function(e){for(var t=Ku.indexOf(e.name)-1,r=this._finalNodesChain[t];r&&!this._compositor.getNodeByName(r.name);)t-=1,r=this._finalNodesChain[t];return r},oe.prototype._getNextNode=function(e){for(var t=Ku.indexOf(e.name)+1,r=this._finalNodesChain[t];r&&!this._compositor.getNodeByName(r.name);)t+=1,r=this._finalNodesChain[t];return r},oe.prototype._addChainNode=function(e){var t=this._getPrevNode(e),r=this._getNextNode(e);t&&(e.inputs.texture=t.name,r?(e.outputs=Vv(this.getWidth.bind(this),this.getHeight.bind(this)),r.inputs.texture=e.name):e.outputs=null,this._compositor.addNode(e))},oe.prototype._removeChainNode=function(e){var t=this._getPrevNode(e),r=this._getNextNode(e);t&&(r?(t.outputs=Vv(this.getWidth.bind(this),this.getHeight.bind(this)),r.inputs.texture=t.name):t.outputs=null,this._compositor.removeNode(e))},oe.prototype.updateNormal=function(e,t,r,i){this._ifRenderNormalPass()&&this._normalPass.update(e,t,r)},oe.prototype.updateSSAO=function(e,t,r,i){this._ssaoPass.update(e,r,i)},oe.prototype.enableSSAO=function(){this._enableSSAO=!0},oe.prototype.disableSSAO=function(){this._enableSSAO=!1},oe.prototype.enableSSR=function(){this._enableSSR=!0},oe.prototype.disableSSR=function(){this._enableSSR=!1},oe.prototype.getSSAOTexture=function(){return this._ssaoPass.getTargetTexture()},oe.prototype.getSourceFrameBuffer=function(){return this._framebuffer},oe.prototype.getSourceTexture=function(){return this._sourceTexture},oe.prototype.disableFXAA=function(){this._removeChainNode(this._fxaaNode)},oe.prototype.enableFXAA=function(){this._addChainNode(this._fxaaNode)},oe.prototype.enableBloom=function(){this._compositeNode.inputs.bloom="bloom_composite",this._compositor.dirty()},oe.prototype.disableBloom=function(){this._compositeNode.inputs.bloom=null,this._compositor.dirty()},oe.prototype.enableDOF=function(){this._compositeNode.inputs.texture="dof_composite",this._compositor.dirty()},oe.prototype.disableDOF=function(){this._compositeNode.inputs.texture="source",this._compositor.dirty()},oe.prototype.enableColorCorrection=function(){this._compositeNode.define("COLOR_CORRECTION"),this._enableColorCorrection=!0},oe.prototype.disableColorCorrection=function(){this._compositeNode.undefine("COLOR_CORRECTION"),this._enableColorCorrection=!1},oe.prototype.enableEdge=function(){this._enableEdge=!0},oe.prototype.disableEdge=function(){this._enableEdge=!1},oe.prototype.setBloomIntensity=function(e){this._compositeNode.setParameter("bloomIntensity",e)},oe.prototype.setSSAOParameter=function(e,t){switch(e){case"quality":var r={low:6,medium:12,high:32,ultra:62}[t]||12;this._ssaoPass.setParameter("kernelSize",r);break;case"radius":this._ssaoPass.setParameter(e,t),this._ssaoPass.setParameter("bias",t/200);break;case"intensity":this._ssaoPass.setParameter(e,t);break;default:console.warn("Unkown SSAO parameter "+e)}},oe.prototype.setDOFParameter=function(e,t){switch(e){case"focalDistance":case"focalRange":case"fstop":this._cocNode.setParameter(e,t);break;case"blurRadius":for(var r=0;r<this._dofBlurNodes.length;r++)this._dofBlurNodes[r].setParameter("blurRadius",t);break;case"quality":var i={low:4,medium:8,high:16,ultra:32}[t]||8;this._dofBlurKernelSize=i;for(var r=0;r<this._dofBlurNodes.length;r++)this._dofBlurNodes[r].pass.material.define("POISSON_KERNEL_SIZE",i);this._dofBlurKernel=new Float32Array(i*2);break;default:console.warn("Unkown DOF parameter "+e)}},oe.prototype.setSSRParameter=function(e,t){if(t!=null)switch(e){case"quality":var r={low:10,medium:15,high:30,ultra:80}[t]||20,i={low:32,medium:16,high:8,ultra:4}[t]||16;this._ssrPass.setParameter("maxIteration",r),this._ssrPass.setParameter("pixelStride",i);break;case"maxRoughness":this._ssrPass.setParameter("minGlossiness",Math.max(Math.min(1-t,1),0));break;case"physical":this.setPhysicallyCorrectSSR(t);break;default:console.warn("Unkown SSR parameter "+e)}},oe.prototype.setPhysicallyCorrectSSR=function(e){this._ssrPass.setPhysicallyCorrect(e)},oe.prototype.setEdgeColor=function(e){var t=S.parseColor(e);this._edgePass.setParameter("edgeColor",t)},oe.prototype.setExposure=function(e){this._compositeNode.setParameter("exposure",Math.pow(2,e))},oe.prototype.setColorLookupTexture=function(e,t){this._compositeNode.pass.material.setTextureImage("lut",this._enableColorCorrection?e:"none",t,{minFilter:S.Texture.NEAREST,magFilter:S.Texture.NEAREST,flipY:!1})},oe.prototype.setColorCorrection=function(e,t){this._compositeNode.setParameter(e,t)},oe.prototype.isSSREnabled=function(){return this._enableSSR},oe.prototype.composite=function(e,t,r,i,n){var a=this._sourceTexture,o=a;this._enableEdge&&(this._edgePass.update(e,r,a,n),a=o=this._edgePass.getTargetTexture()),this._enableSSR&&(this._ssrPass.update(e,r,a,n),o=this._ssrPass.getTargetTexture(),this._ssrPass.setSSAOTexture(this._enableSSAO?this._ssaoPass.getTargetTexture():null)),this._sourceNode.texture=o,this._cocNode.setParameter("depth",this._depthTexture);for(var s=this._dofBlurKernel,l=this._dofBlurKernelSize,u=Math.floor(Hv.length/2/l),h=n%u,f=0;f<l*2;f++)s[f]=Hv[f+h*l*2];for(var f=0;f<this._dofBlurNodes.length;f++)this._dofBlurNodes[f].setParameter("percent",n/30),this._dofBlurNodes[f].setParameter("poissonKernel",s);this._cocNode.setParameter("zNear",r.near),this._cocNode.setParameter("zFar",r.far),this._compositor.render(e,i)},oe.prototype.dispose=function(e){this._sourceTexture.dispose(e),this._depthTexture.dispose(e),this._framebuffer.dispose(e),this._compositor.dispose(e),this._normalPass.dispose(e),this._ssaoPass.dispose(e)};let IT=oe;function Qu(e){for(var t=[],r=0;r<30;r++)t.push([yn(r,2),yn(r,3)]);this._haltonSequence=t,this._frame=0,this._sourceTex=new ee,this._sourceFb=new Je,this._sourceFb.attach(this._sourceTex),this._prevFrameTex=new ee,this._outputTex=new ee;var i=this._blendPass=new Fe({fragment:V.source("clay.compositor.blend")});i.material.disableTexturesAll(),i.material.enableTexture(["texture1","texture2"]),this._blendFb=new Je({depthBuffer:!1}),this._outputPass=new Fe({fragment:V.source("clay.compositor.output"),blendWithPrevious:!0}),this._outputPass.material.define("fragment","OUTPUT_ALPHA"),this._outputPass.material.blend=function(n){n.blendEquationSeparate(n.FUNC_ADD,n.FUNC_ADD),n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA)}}Qu.prototype={constructor:Qu,jitterProjection:function(e,t){var r=e.viewport,i=r.devicePixelRatio||e.getDevicePixelRatio(),n=r.width*i,a=r.height*i,o=this._haltonSequence[this._frame%this._haltonSequence.length],s=new W;s.array[12]=(o[0]*2-1)/n,s.array[13]=(o[1]*2-1)/a,W.mul(t.projectionMatrix,s,t.projectionMatrix),W.invert(t.invProjectionMatrix,t.projectionMatrix)},resetFrame:function(){this._frame=0},getFrame:function(){return this._frame},getSourceFrameBuffer:function(){return this._sourceFb},getOutputTexture:function(){return this._outputTex},resize:function(e,t){this._prevFrameTex.width=e,this._prevFrameTex.height=t,this._outputTex.width=e,this._outputTex.height=t,this._sourceTex.width=e,this._sourceTex.height=t,this._prevFrameTex.dirty(),this._outputTex.dirty(),this._sourceTex.dirty()},isFinished:function(){return this._frame>=this._haltonSequence.length},render:function(e,t,r){var i=this._blendPass;this._frame===0?(i.setUniform("weight1",0),i.setUniform("weight2",1)):(i.setUniform("weight1",.9),i.setUniform("weight2",.1)),i.setUniform("texture1",this._prevFrameTex),i.setUniform("texture2",t||this._sourceTex),this._blendFb.attach(this._outputTex),this._blendFb.bind(e),i.render(e),this._blendFb.unbind(e),r||(this._outputPass.setUniform("texture",this._outputTex),this._outputPass.render(e));var n=this._prevFrameTex;this._prevFrameTex=this._outputTex,this._outputTex=n,this._frame++},dispose:function(e){this._sourceFb.dispose(e),this._blendFb.dispose(e),this._prevFrameTex.dispose(e),this._outputTex.dispose(e),this._sourceTex.dispose(e),this._outputPass.dispose(e),this._blendPass.dispose(e)}};let OT=Qu;function Me(e){e=e||"perspective",this.layer=null,this.scene=new Cr,this.rootNode=this.scene,this.viewport={x:0,y:0,width:0,height:0},this.setProjection(e),this._compositor=new IT,this._temporalSS=new OT,this._shadowMapPass=new $x;for(var t=[],r=0,i=0;i<30;i++){for(var n=[],a=0;a<6;a++)n.push(yn(r,2)*4-2),n.push(yn(r,3)*4-2),r++;t.push(n)}this._pcfKernels=t,this.scene.on("beforerender",function(o,s,l){this.needsTemporalSS()&&this._temporalSS.jitterProjection(o,l)},this)}Me.prototype.setProjection=function(e){var t=this.camera;t&&t.update(),e==="perspective"?this.camera instanceof Qe||(this.camera=new Qe,t&&this.camera.setLocalTransform(t.localTransform)):this.camera instanceof Ki||(this.camera=new Ki,t&&this.camera.setLocalTransform(t.localTransform)),this.camera.near=.1,this.camera.far=2e3},Me.prototype.setViewport=function(e,t,r,i,n){this.camera instanceof Qe&&(this.camera.aspect=r/i),n=n||1,this.viewport.x=e,this.viewport.y=t,this.viewport.width=r,this.viewport.height=i,this.viewport.devicePixelRatio=n,this._compositor.resize(r*n,i*n),this._temporalSS.resize(r*n,i*n)},Me.prototype.containPoint=function(e,t){var r=this.viewport,i=this.layer.renderer.getHeight();return t=i-t,e>=r.x&&t>=r.y&&e<=r.x+r.width&&t<=r.y+r.height};var kv=new Pt;Me.prototype.castRay=function(e,t,r){var i=this.layer.renderer,n=i.viewport;return i.viewport=this.viewport,i.screenToNDC(e,t,kv),this.camera.castRay(kv,r),i.viewport=n,r},Me.prototype.prepareRender=function(){this.scene.update(),this.camera.update(),this.scene.updateLights();var e=this.scene.updateRenderList(this.camera);this._needsSortProgressively=!1;for(var t=0;t<e.transparent.length;t++){var r=e.transparent[t],i=r.geometry;i.needsSortVerticesProgressively&&i.needsSortVerticesProgressively()&&(this._needsSortProgressively=!0),i.needsSortTrianglesProgressively&&i.needsSortTrianglesProgressively()&&(this._needsSortProgressively=!0)}this._frame=0,this._temporalSS.resetFrame()},Me.prototype.render=function(e,t){this._doRender(e,t,this._frame),this._frame++},Me.prototype.needsAccumulate=function(){return this.needsTemporalSS()||this._needsSortProgressively},Me.prototype.needsTemporalSS=function(){var e=this._enableTemporalSS;return e==="auto"&&(e=this._enablePostEffect),e},Me.prototype.hasDOF=function(){return this._enableDOF},Me.prototype.isAccumulateFinished=function(){return this.needsTemporalSS()?this._temporalSS.isFinished():this._frame>30},Me.prototype._doRender=function(e,t,r){var i=this.scene,n=this.camera;r=r||0,this._updateTransparent(e,i,n,r),t||(this._shadowMapPass.kernelPCF=this._pcfKernels[0],this._shadowMapPass.render(e,i,n,!0)),this._updateShadowPCFKernel(r);var a=e.clearColor;if(e.gl.clearColor(a[0],a[1],a[2],a[3]),this._enablePostEffect&&(this.needsTemporalSS()&&this._temporalSS.jitterProjection(e,n),this._compositor.updateNormal(e,i,n,this._temporalSS.getFrame())),this._updateSSAO(e,i,n,this._temporalSS.getFrame()),this._enablePostEffect){var o=this._compositor.getSourceFrameBuffer();o.bind(e),e.gl.clear(e.gl.DEPTH_BUFFER_BIT|e.gl.COLOR_BUFFER_BIT),e.render(i,n,!0,!0),o.unbind(e),this.needsTemporalSS()&&t?(this._compositor.composite(e,i,n,this._temporalSS.getSourceFrameBuffer(),this._temporalSS.getFrame()),e.setViewport(this.viewport),this._temporalSS.render(e)):(e.setViewport(this.viewport),this._compositor.composite(e,i,n,null,0))}else if(this.needsTemporalSS()&&t){var o=this._temporalSS.getSourceFrameBuffer();o.bind(e),e.saveClear(),e.clearBit=e.gl.DEPTH_BUFFER_BIT|e.gl.COLOR_BUFFER_BIT,e.render(i,n,!0,!0),e.restoreClear(),o.unbind(e),e.setViewport(this.viewport),this._temporalSS.render(e)}else e.setViewport(this.viewport),e.render(i,n,!0,!0)},Me.prototype._updateTransparent=function(e,t,r,i){for(var n=new z,a=new W,o=r.getWorldPosition(),s=t.getRenderList(r).transparent,l=0;l<s.length;l++){var u=s[l],h=u.geometry;W.invert(a,u.worldTransform),z.transformMat4(n,o,a),h.needsSortTriangles&&h.needsSortTriangles()&&h.doSortTriangles(n,i),h.needsSortVertices&&h.needsSortVertices()&&h.doSortVertices(n,i)}},Me.prototype._updateSSAO=function(e,t,r){var i=this._enableSSAO&&this._enablePostEffect;i&&this._compositor.updateSSAO(e,t,r,this._temporalSS.getFrame());for(var n=t.getRenderList(r),a=0;a<n.opaque.length;a++){var o=n.opaque[a];o.renderNormal&&o.material[i?"enableTexture":"disableTexture"]("ssaoMap"),i&&o.material.set("ssaoMap",this._compositor.getSSAOTexture())}},Me.prototype._updateShadowPCFKernel=function(e){for(var t=this._pcfKernels[e%this._pcfKernels.length],r=this.scene.getRenderList(this.camera),i=r.opaque,n=0;n<i.length;n++)i[n].receiveShadow&&(i[n].material.set("pcfKernel",t),i[n].material.define("fragment","PCF_KERNEL_SIZE",t.length/2))},Me.prototype.dispose=function(e){this._compositor.dispose(e.gl),this._temporalSS.dispose(e.gl),this._shadowMapPass.dispose(e)},Me.prototype.setPostEffect=function(e,t){var r=this._compositor;this._enablePostEffect=e.get("enable");var i=e.getModel("bloom"),n=e.getModel("edge"),a=e.getModel("DOF",e.getModel("depthOfField")),o=e.getModel("SSAO",e.getModel("screenSpaceAmbientOcclusion")),s=e.getModel("SSR",e.getModel("screenSpaceReflection")),l=e.getModel("FXAA"),u=e.getModel("colorCorrection");i.get("enable")?r.enableBloom():r.disableBloom(),a.get("enable")?r.enableDOF():r.disableDOF(),s.get("enable")?r.enableSSR():r.disableSSR(),u.get("enable")?r.enableColorCorrection():r.disableColorCorrection(),n.get("enable")?r.enableEdge():r.disableEdge(),l.get("enable")?r.enableFXAA():r.disableFXAA(),this._enableDOF=a.get("enable"),this._enableSSAO=o.get("enable"),this._enableSSAO?r.enableSSAO():r.disableSSAO(),r.setBloomIntensity(i.get("intensity")),r.setEdgeColor(n.get("color")),r.setColorLookupTexture(u.get("lookupTexture"),t),r.setExposure(u.get("exposure")),["radius","quality","intensity"].forEach(function(h){r.setSSAOParameter(h,o.get(h))}),["quality","maxRoughness","physical"].forEach(function(h){r.setSSRParameter(h,s.get(h))}),["quality","focalDistance","focalRange","blurRadius","fstop"].forEach(function(h){r.setDOFParameter(h,a.get(h))}),["brightness","contrast","saturation"].forEach(function(h){r.setColorCorrection(h,u.get(h))})},Me.prototype.setDOFFocusOnPoint=function(e){if(this._enablePostEffect)return e>this.camera.far||e<this.camera.near?void 0:(this._compositor.setDOFParameter("focalDistance",e),!0)},Me.prototype.setTemporalSuperSampling=function(e){this._enableTemporalSS=e.get("enable")},Me.prototype.isLinearSpace=function(){return this._enablePostEffect},Me.prototype.setRootNode=function(e){if(this.rootNode!==e){for(var t=this.rootNode.children(),r=0;r<t.length;r++)e.add(t[r]);e!==this.scene&&this.scene.add(e),this.rootNode=e}},Me.prototype.add=function(e){this.rootNode.add(e)},Me.prototype.remove=function(e){this.rootNode.remove(e)},Me.prototype.removeAll=function(e){this.rootNode.removeAll(e)},Object.assign(Me.prototype,Fs);let Vr=Me;function BT(e,t){var r=e.getBoxLayoutParams(),i=Ea(r,{width:t.getWidth(),height:t.getHeight()});i.y=t.getHeight()-i.y-i.height,this.viewGL.setViewport(i.x,i.y,i.width,i.height,t.getDevicePixelRatio());var n=e.get("boxWidth"),a=e.get("boxHeight"),o=e.get("boxDepth");["x","y","z"].forEach(function(s){if(!this.getAxis(s))throw new Error("Grid"+e.id+" don't have "+s+"Axis")},this),this.getAxis("x").setExtent(-n/2,n/2),this.getAxis("y").setExtent(o/2,-o/2),this.getAxis("z").setExtent(-a/2,a/2),this.size=[n,a,o]}function FT(e,t){var r={};function i(n,a){r[n]=r[n]||[1/0,-1/0],r[n][0]=Math.min(a[0],r[n][0]),r[n][1]=Math.max(a[1],r[n][1])}e.eachSeries(function(n){if(n.coordinateSystem===this){var a=n.getData();["x","y","z"].forEach(function(o){a.mapDimensionsAll(o,!0).forEach(function(s){i(o,a.getDataExtent(s,!0))})})}},this),["xAxis3D","yAxis3D","zAxis3D"].forEach(function(n){e.eachComponent(n,function(a){var o=n.charAt(0),s=a.getReferringComponents("grid3D").models[0],l=s.coordinateSystem;if(l===this){var u=l.getAxis(o);if(u){console.warn("Can't have two %s in one grid3D",n);return}var h=A.helper.createScale(r[o]||[1/0,-1/0],a);u=new ux(o,h),u.type=a.get("type");var f=u.type==="category";u.onBand=f&&a.get("boundaryGap"),u.inverse=a.get("inverse"),a.axis=u,u.model=a,u.getLabelModel=function(){return a.getModel("axisLabel",s.getModel("axisLabel"))},u.getTickModel=function(){return a.getModel("axisTick",s.getModel("axisTick"))},l.addAxis(u)}},this)},this),this.resize(this.model,t)}var GT={dimensions:cv.prototype.dimensions,create:function(e,t){var r=[];e.eachComponent("grid3D",function(a){a.__viewGL=a.__viewGL||new Vr;var o=new cv;o.model=a,o.viewGL=a.__viewGL,a.coordinateSystem=o,r.push(o),o.resize=BT,o.update=FT});var i=["xAxis3D","yAxis3D","zAxis3D"];function n(a,o){return i.map(function(s){var l=a.getReferringComponents(s).models[0];if(l==null&&(l=o.getComponent(s)),!l)throw new Error(s+' "'+te.firstNotNull(a.get(s+"Index"),a.get(s+"Id"),0)+'" not found');return l})}return e.eachSeries(function(a){if(a.get("coordinateSystem")==="cartesian3D"){var o=a.getReferringComponents("grid3D").models[0];if(o==null){var s=n(a,e),o=s[0].getCoordSysModel();s.forEach(function(h){var f=h.getCoordSysModel();if(!f)throw new Error('grid3D "'+te.firstNotNull(h.get("gridIndex"),h.get("gridId"),0)+'" not found');if(f!==o)throw new Error("xAxis3D, yAxis3D, zAxis3D must use the same grid")})}var l=o.coordinateSystem;a.coordinateSystem=l}}),r}};let UT=GT;var Wv=A.ComponentModel.extend({type:"cartesian3DAxis",axis:null,getCoordSysModel:function(){return this.ecModel.queryComponents({mainType:"grid3D",index:this.option.gridIndex,id:this.option.gridId})[0]}});A.helper.mixinAxisModelCommonMethods(Wv);let zT=Wv;var Xv={show:!0,grid3DIndex:0,inverse:!1,name:"",nameLocation:"middle",nameTextStyle:{fontSize:16},nameGap:20,axisPointer:{},axisLine:{},axisTick:{},axisLabel:{},splitArea:{}},HT=A.util.merge({boundaryGap:!0,axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"},axisPointer:{label:{show:!1}}},Xv),Ju=A.util.merge({boundaryGap:[0,0],splitNumber:5,axisPointer:{label:{}}},Xv),VT=A.util.defaults({scale:!0,min:"dataMin",max:"dataMax"},Ju),jv=A.util.defaults({logBase:10},Ju);jv.scale=!0;let kT={categoryAxis3D:HT,valueAxis3D:Ju,timeAxis3D:VT,logAxis3D:jv};var WT=(function(){function e(t){this.categories=t.categories||[],this._needCollect=t.needCollect,this._deduplication=t.deduplication}return e.createByAxisModel=function(t){var r=t.option,i=r.data,n=i&&or(i,XT);return new e({categories:n,needCollect:!n,deduplication:r.dedplication!==!1})},e.prototype.getOrdinal=function(t){return this._getOrCreateMap().get(t)},e.prototype.parseAndCollect=function(t){var r,i=this._needCollect;if(typeof t!="string"&&!i)return t;if(i&&!this._deduplication)return r=this.categories.length,this.categories[r]=t,r;var n=this._getOrCreateMap();return r=n.get(t),r==null&&(i?(r=this.categories.length,this.categories[r]=t,n.set(t,r)):r=NaN),r},e.prototype._getOrCreateMap=function(){return this._map||(this._map=qn(this.categories))},e})();function XT(e){return st(e)&&e.value!=null?e.value:e+""}let jT=WT;var qT=["value","category","time","log"];function ZT(e,t,r,i,n){qT.forEach(function(a){var o=r.extend({type:t+"Axis3D."+a,__ordinalMeta:null,mergeDefaultAndTheme:function(s,l){var u=l.getTheme();A.util.merge(s,u.get(a+"Axis3D")),A.util.merge(s,this.getDefaultOption()),s.type=i(t,s)},optionUpdated:function(){var s=this.option;s.type==="category"&&(this.__ordinalMeta=jT.createByAxisModel(this))},getCategories:function(){if(this.option.type==="category")return this.__ordinalMeta.categories},getOrdinalMeta:function(){return this.__ordinalMeta},defaultOption:A.util.merge(A.util.clone(kT[a+"Axis3D"]),n||{},!0)});e.registerComponentModel(o)}),e.registerSubTypeDefaulter(t+"Axis3D",A.util.curry(i,t))}function YT(e,t){return t.type||(t.data?"category":"value")}function KT(e){e.registerComponentModel(Km),e.registerComponentView(sx),e.registerCoordinateSystem("grid3D",UT),["x","y","z"].forEach(function(t){ZT(e,t,zT,YT,{name:t.toUpperCase()});let r=e.ComponentView.extend({type:t+"Axis3D"});e.registerComponentView(r)}),e.registerAction({type:"grid3DChangeCamera",event:"grid3dcamerachanged",update:"series:updateCamera"},function(t,r){r.eachComponent({mainType:"grid3D",query:t},function(i){i.setView(t)})}),e.registerAction({type:"grid3DShowAxisPointer",event:"grid3dshowaxispointer",update:"grid3D:showAxisPointer"},function(t,r){}),e.registerAction({type:"grid3DHideAxisPointer",event:"grid3dhideaxispointer",update:"grid3D:hideAxisPointer"},function(t,r){})}(0,A.use)(KT);let Tn={defaultOption:{shading:null,realisticMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},lambertMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},colorMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},hatchingMaterial:{textureTiling:1,textureOffset:0,paperColor:"#fff"}}},qv={getFilledRegions:function(e,t){var r=(e||[]).slice(),i;if(typeof t=="string"?(t=A.getMap(t),i=t&&t.geoJson):t&&t.features&&(i=t),!i)return console.error("Map "+t+" not exists. You can download map file on http://echarts.baidu.com/download-map.html"),i.features||console.error("Invalid GeoJSON for map3D"),[];for(var n={},a=i.features,o=0;o<r.length;o++)n[r[o].name]=r[o];for(var o=0;o<a.length;o++){var s=a[o].properties.name;n[s]||r.push({name:s})}return r},defaultOption:{show:!0,zlevel:-10,map:"",left:0,top:0,width:"100%",height:"100%",boxWidth:100,boxHeight:10,boxDepth:"auto",regionHeight:3,environment:"auto",groundPlane:{show:!1,color:"#aaa"},shading:"lambert",light:{main:{alpha:40,beta:30}},viewControl:{alpha:40,beta:0,distance:100,orthographicSize:60,minAlpha:5,minBeta:-80,maxBeta:80},label:{show:!1,distance:2,textStyle:{fontSize:20,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:4}},itemStyle:{color:"#fff",borderWidth:0,borderColor:"#333"},emphasis:{itemStyle:{color:"#639fc0"},label:{show:!0}}}};var wn=A.ComponentModel.extend({type:"geo3D",layoutMode:"box",coordinateSystem:null,optionUpdated:function(){var e=this.option;e.regions=this.getFilledRegions(e.regions,e.map);var t=A.helper.createDimensions(e.data||[],{coordDimensions:["value"],encodeDefine:this.get("encode"),dimensionsDefine:this.get("dimensions")}),r=new A.List(t,this);r.initData(e.regions);var i={};r.each(function(n){var a=r.getName(n),o=r.getItemModel(n);i[a]=o}),this._regionModelMap=i,this._data=r},getData:function(){return this._data},getRegionModel:function(e){var t=this.getData().getName(e);return this._regionModelMap[t]||new A.Model(null,this)},getRegionPolygonCoords:function(e){var t=this.getData().getName(e),r=this.coordinateSystem.getRegion(t);return r?r.geometries:[]},getFormattedLabel:function(e,t){var r=this._data.getName(e),i=this.getRegionModel(e),n=i.get(t==="normal"?["label","formatter"]:["emphasis","label","formatter"]);n==null&&(n=i.get(["label","formatter"]));var a={name:r};if(typeof n=="function")return a.status=t,n(a);if(typeof n=="string"){var o=a.seriesName;return n.replace("{a}",o??"")}else return r},defaultOption:{regions:[]}});A.util.merge(wn.prototype,qv),A.util.merge(wn.prototype,Mo),A.util.merge(wn.prototype,en),A.util.merge(wn.prototype,tn),A.util.merge(wn.prototype,Tn);let QT=wn,JT=Zv;function Zv(e,t,r){r=r||2;var i=t&&t.length,n=i?t[0]*r:e.length,a=Yv(e,0,n,r,!0),o=[];if(!a)return o;var s,l,u,h,f,c,d;if(i&&(a=i2(e,t,a,r)),e.length>80*r){s=u=e[0],l=h=e[1];for(var v=r;v<n;v+=r)f=e[v],c=e[v+1],f<s&&(s=f),c<l&&(l=c),f>u&&(u=f),c>h&&(h=c);d=Math.max(u-s,h-l)}return Ca(a,o,r,s,l,d),o}function Yv(e,t,r,i,n){var a,o;if(n===th(e,t,r,i)>0)for(a=t;a<r;a+=i)o=Jv(a,e[a],e[a+1],o);else for(a=r-i;a>=t;a-=i)o=Jv(a,e[a],e[a+1],o);return o&&Pi(o,o.next)&&(Pa(o),o=o.next),o}function Da(e,t){if(!e)return e;t||(t=e);var r=e,i;do if(i=!1,!r.steiner&&(Pi(r,r.next)||xt(r.prev,r,r.next)===0)){if(Pa(r),r=t=r.prev,r===r.next)return null;i=!0}else r=r.next;while(i||r!==t);return t}function Ca(e,t,r,i,n,a,o){if(e){!o&&a&&s2(e,i,n,a);for(var s=e,l,u;e.prev!==e.next;){if(l=e.prev,u=e.next,a?e2(e,i,n,a):$T(e)){t.push(l.i/r),t.push(e.i/r),t.push(u.i/r),Pa(e),e=u.next,s=u.next;continue}if(e=u,e===s){o?o===1?(e=t2(e,t,r),Ca(e,t,r,i,n,a,2)):o===2&&r2(e,t,r,i,n,a):Ca(Da(e),t,r,i,n,a,1);break}}}}function $T(e){var t=e.prev,r=e,i=e.next;if(xt(t,r,i)>=0)return!1;for(var n=e.next.next;n!==e.prev;){if(bs(t.x,t.y,r.x,r.y,i.x,i.y,n.x,n.y)&&xt(n.prev,n,n.next)>=0)return!1;n=n.next}return!0}function e2(e,t,r,i){var n=e.prev,a=e,o=e.next;if(xt(n,a,o)>=0)return!1;for(var s=n.x<a.x?n.x<o.x?n.x:o.x:a.x<o.x?a.x:o.x,l=n.y<a.y?n.y<o.y?n.y:o.y:a.y<o.y?a.y:o.y,u=n.x>a.x?n.x>o.x?n.x:o.x:a.x>o.x?a.x:o.x,h=n.y>a.y?n.y>o.y?n.y:o.y:a.y>o.y?a.y:o.y,f=$u(s,l,t,r,i),c=$u(u,h,t,r,i),d=e.nextZ;d&&d.z<=c;){if(d!==e.prev&&d!==e.next&&bs(n.x,n.y,a.x,a.y,o.x,o.y,d.x,d.y)&&xt(d.prev,d,d.next)>=0)return!1;d=d.nextZ}for(d=e.prevZ;d&&d.z>=f;){if(d!==e.prev&&d!==e.next&&bs(n.x,n.y,a.x,a.y,o.x,o.y,d.x,d.y)&&xt(d.prev,d,d.next)>=0)return!1;d=d.prevZ}return!0}function t2(e,t,r){var i=e;do{var n=i.prev,a=i.next.next;!Pi(n,a)&&Kv(n,i,i.next,a)&&La(n,a)&&La(a,n)&&(t.push(n.i/r),t.push(i.i/r),t.push(a.i/r),Pa(i),Pa(i.next),i=e=a),i=i.next}while(i!==e);return i}function r2(e,t,r,i,n,a){var o=e;do{for(var s=o.next.next;s!==o.prev;){if(o.i!==s.i&&h2(o,s)){var l=Qv(o,s);o=Da(o,o.next),l=Da(l,l.next),Ca(o,t,r,i,n,a),Ca(l,t,r,i,n,a);return}s=s.next}o=o.next}while(o!==e)}function i2(e,t,r,i){var n=[],a,o,s,l,u;for(a=0,o=t.length;a<o;a++)s=t[a]*i,l=a<o-1?t[a+1]*i:e.length,u=Yv(e,s,l,i,!1),u===u.next&&(u.steiner=!0),n.push(u2(u));for(n.sort(n2),a=0;a<n.length;a++)a2(n[a],r),r=Da(r,r.next);return r}function n2(e,t){return e.x-t.x}function a2(e,t){if(t=o2(e,t),t){var r=Qv(t,e);Da(r,r.next)}}function o2(e,t){var r=t,i=e.x,n=e.y,a=-1/0,o;do{if(n<=r.y&&n>=r.next.y&&r.next.y!==r.y){var s=r.x+(n-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(s<=i&&s>a){if(a=s,s===i){if(n===r.y)return r;if(n===r.next.y)return r.next}o=r.x<r.next.x?r:r.next}}r=r.next}while(r!==t);if(!o)return null;if(i===a)return o.prev;var l=o,u=o.x,h=o.y,f=1/0,c;for(r=o.next;r!==l;)i>=r.x&&r.x>=u&&i!==r.x&&bs(n<h?i:a,n,u,h,n<h?a:i,n,r.x,r.y)&&(c=Math.abs(n-r.y)/(i-r.x),(c<f||c===f&&r.x>o.x)&&La(r,e)&&(o=r,f=c)),r=r.next;return o}function s2(e,t,r,i){var n=e;do n.z===null&&(n.z=$u(n.x,n.y,t,r,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==e);n.prevZ.nextZ=null,n.prevZ=null,l2(n)}function l2(e){var t,r,i,n,a,o,s,l,u=1;do{for(r=e,e=null,a=null,o=0;r;){for(o++,i=r,s=0,t=0;t<u&&(s++,i=i.nextZ,!!i);t++);for(l=u;s>0||l>0&&i;)s!==0&&(l===0||!i||r.z<=i.z)?(n=r,r=r.nextZ,s--):(n=i,i=i.nextZ,l--),a?a.nextZ=n:e=n,n.prevZ=a,a=n;r=i}a.nextZ=null,u*=2}while(o>1);return e}function $u(e,t,r,i,n){return e=32767*(e-r)/n,t=32767*(t-i)/n,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function u2(e){var t=e,r=e;do t.x<r.x&&(r=t),t=t.next;while(t!==e);return r}function bs(e,t,r,i,n,a,o,s){return(n-o)*(t-s)-(e-o)*(a-s)>=0&&(e-o)*(i-s)-(r-o)*(t-s)>=0&&(r-o)*(a-s)-(n-o)*(i-s)>=0}function h2(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!f2(e,t)&&La(e,t)&&La(t,e)&&c2(e,t)}function xt(e,t,r){return(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y)}function Pi(e,t){return e.x===t.x&&e.y===t.y}function Kv(e,t,r,i){return Pi(e,t)&&Pi(r,i)||Pi(e,i)&&Pi(r,t)?!0:xt(e,t,r)>0!=xt(e,t,i)>0&&xt(r,i,e)>0!=xt(r,i,t)>0}function f2(e,t){var r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==t.i&&r.next.i!==t.i&&Kv(r,r.next,e,t))return!0;r=r.next}while(r!==e);return!1}function La(e,t){return xt(e.prev,e,e.next)<0?xt(e,t,e.next)>=0&&xt(e,e.prev,t)>=0:xt(e,t,e.prev)<0||xt(e,e.next,t)<0}function c2(e,t){var r=e,i=!1,n=(e.x+t.x)/2,a=(e.y+t.y)/2;do r.y>a!=r.next.y>a&&r.next.y!==r.y&&n<(r.next.x-r.x)*(a-r.y)/(r.next.y-r.y)+r.x&&(i=!i),r=r.next;while(r!==e);return i}function Qv(e,t){var r=new eh(e.i,e.x,e.y),i=new eh(t.i,t.x,t.y),n=e.next,a=t.prev;return e.next=t,t.prev=e,r.next=n,n.prev=r,i.next=r,r.prev=i,a.next=i,i.prev=a,i}function Jv(e,t,r,i){var n=new eh(e,t,r);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function Pa(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function eh(e,t,r){this.i=e,this.x=t,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}Zv.deviation=function(e,t,r,i){var n=t&&t.length,a=n?t[0]*r:e.length,o=Math.abs(th(e,0,a,r));if(n)for(var s=0,l=t.length;s<l;s++){var u=t[s]*r,h=s<l-1?t[s+1]*r:e.length;o-=Math.abs(th(e,u,h,r))}var f=0;for(s=0;s<i.length;s+=3){var c=i[s]*r,d=i[s+1]*r,v=i[s+2]*r;f+=Math.abs((e[c]-e[v])*(e[d+1]-e[c+1])-(e[c]-e[d])*(e[v+1]-e[c+1]))}return o===0&&f===0?0:Math.abs((f-o)/o)};function th(e,t,r,i){for(var n=0,a=t,o=r-i;a<r;a+=i)n+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return n}function rh(e,t,r){var i=e[t];e[t]=e[r],e[r]=i}function $v(e,t,r,i,n){var a=r,o=e[t];rh(e,t,i);for(var s=r;s<i;s++)n(e[s],o)<0&&(rh(e,s,a),a++);return rh(e,i,a),a}function Es(e,t,r,i){if(r<i){var n=Math.floor((r+i)/2),a=$v(e,n,r,i,t);Es(e,t,r,a-1),Es(e,t,a+1,i)}}function ih(){this._parts=[]}ih.prototype.step=function(e,t,r){var i=e.length;if(r===0){this._parts=[],this._sorted=!1;var n=Math.floor(i/2);this._parts.push({pivot:n,left:0,right:i-1}),this._currentSortPartIdx=0}if(!this._sorted){var a=this._parts;if(a.length===0)return this._sorted=!0,!0;if(a.length<512){for(var o=0;o<a.length;o++)a[o].pivot=$v(e,a[o].pivot,a[o].left,a[o].right,t);for(var s=[],o=0;o<a.length;o++){var l=a[o].left,u=a[o].pivot-1;u>l&&s.push({pivot:Math.floor((u+l)/2),left:l,right:u});var l=a[o].pivot+1,u=a[o].right;u>l&&s.push({pivot:Math.floor((u+l)/2),left:l,right:u})}a=this._parts=s}else for(var o=0;o<Math.floor(a.length/10);o++){var h=a.length-1-this._currentSortPartIdx;if(Es(e,t,a[h].left,a[h].right),this._currentSortPartIdx++,this._currentSortPartIdx===a.length)return this._sorted=!0,!0}return!1}},ih.sort=Es;let As=ih;var Sn=Ue.vec3,ep=Sn.create(),tp=Sn.create(),rp=Sn.create();let nh={needsSortTriangles:function(){return this.indices&&this.sortTriangles},needsSortTrianglesProgressively:function(){return this.needsSortTriangles()&&this.triangleCount>=2e4},doSortTriangles:function(e,t){var r=this.indices;if(t===0){var i=this.attributes.position,e=e.array;(!this._triangleZList||this._triangleZList.length!==this.triangleCount)&&(this._triangleZList=new Float32Array(this.triangleCount),this._sortedTriangleIndices=new Uint32Array(this.triangleCount),this._indicesTmp=new r.constructor(r.length),this._triangleZListTmp=new Float32Array(this.triangleCount));for(var n=0,a,o=0;o<r.length;){i.get(r[o++],ep),i.get(r[o++],tp),i.get(r[o++],rp);var s=Sn.sqrDist(ep,e),l=Sn.sqrDist(tp,e),u=Sn.sqrDist(rp,e),h=Math.min(s,l);h=Math.min(h,u),o===3?(a=h,h=0):h=h-a,this._triangleZList[n++]=h}}for(var f=this._sortedTriangleIndices,o=0;o<f.length;o++)f[o]=o;if(this.triangleCount<2e4)t===0&&this._simpleSort(!0);else for(var o=0;o<3;o++)this._progressiveQuickSort(t*3+o);for(var c=this._indicesTmp,d=this._triangleZListTmp,v=this._triangleZList,o=0;o<this.triangleCount;o++){var p=f[o]*3,_=o*3;c[_++]=r[p++],c[_++]=r[p++],c[_]=r[p],d[o]=v[f[o]]}var g=this._indicesTmp;this._indicesTmp=this.indices,this.indices=g;var g=this._triangleZListTmp;this._triangleZListTmp=this._triangleZList,this._triangleZList=g,this.dirtyIndices()},_simpleSort:function(e){var t=this._triangleZList,r=this._sortedTriangleIndices;function i(n,a){return t[a]-t[n]}e?Array.prototype.sort.call(r,i):As.sort(r,i,0,r.length-1)},_progressiveQuickSort:function(e){var t=this._triangleZList,r=this._sortedTriangleIndices;this._quickSort=this._quickSort||new As,this._quickSort.step(r,function(i,n){return t[n]-t[i]},e)}};function d2(e){let t=e.getVisual("style");if(t){let r=e.getVisual("drawType");return t[r]}}function v2(e){return e.getVisual("style").opacity}function $e(e,t){let r=e.getItemVisual(t,"style");if(r){let i=e.getVisual("drawType");return r[i]}}function et(e,t){let r=e.getItemVisual(t,"style");return r&&r.opacity}var ip=1,np=2;function Ri(e,t,r){this._labelsMesh=new Lu,this._labelTextureSurface=new Mu({width:512,height:512,devicePixelRatio:r.getDevicePixelRatio(),onupdate:function(){r.getZr().refresh()}}),this._api=r,this._labelsMesh.material.set("textureAtlas",this._labelTextureSurface.getTexture())}Ri.prototype.getLabelPosition=function(e,t,r){return[0,0,0]},Ri.prototype.getLabelDistance=function(e,t,r){return 0},Ri.prototype.getMesh=function(){return this._labelsMesh},Ri.prototype.updateData=function(e,t,r){t==null&&(t=0),r==null&&(r=e.count()),(!this._labelsVisibilitiesBits||this._labelsVisibilitiesBits.length!==r-t)&&(this._labelsVisibilitiesBits=new Uint8Array(r-t));for(var i=["label","show"],n=["emphasis","label","show"],a=t;a<r;a++){var o=e.getItemModel(a),s=o.get(i),l=o.get(n);l==null&&(l=s);var u=(s?ip:0)|(l?np:0);this._labelsVisibilitiesBits[a-t]=u}this._start=t,this._end=r,this._data=e},Ri.prototype.updateLabels=function(e){if(this._data){e=e||[];for(var t=e.length>0,r={},i=0;i<e.length;i++)r[e[i]]=!0;this._labelsMesh.geometry.convertToDynamicArray(!0),this._labelTextureSurface.clear();for(var n=["label"],a=["emphasis","label"],o=this._data.hostModel,s=this._data,l=o.getModel(n),u=o.getModel(a,l),h={left:"right",right:"left",top:"center",bottom:"center"},f={left:"middle",right:"middle",top:"bottom",bottom:"top"},c=this._start;c<this._end;c++){var d=!1;t&&r[c]&&(d=!0);var v=this._labelsVisibilitiesBits[c-this._start]&(d?np:ip);if(v){var p=s.getItemModel(c),_=p.getModel(d?a:n,d?u:l),g=_.get("distance")||0,m=_.get("position"),y=this._api.getDevicePixelRatio(),x=o.getFormattedLabel(c,d?"emphasis":"normal");if(x==null||x==="")return;var w=new A.graphic.Text({style:gn(_,{text:x,fill:_.get("color")||$e(s,c)||"#000",align:"left",verticalAlign:"top",opacity:te.firstNotNull(_.get("opacity"),et(s,c),1)})}),T=w.getBoundingRect(),E=1.2;T.height*=E;var b=this._labelTextureSurface.add(w),D=h[m]||"center",L=f[m]||"bottom";this._labelsMesh.geometry.addSprite(this.getLabelPosition(c,m,g),[T.width*y,T.height*y],b,D,L,this.getLabelDistance(c,m,g)*y)}}this._labelsMesh.material.set("uvScale",this._labelTextureSurface.getCoordsScale()),this._labelTextureSurface.getZr().refreshImmediately(),this._labelsMesh.geometry.convertToTypedArray(),this._labelsMesh.geometry.dirty()}},Ri.prototype.dispose=function(){this._labelTextureSurface.dispose()};let ah=Ri;var At=Ue.vec3;S.Shader.import(ds);function oh(e){this.rootNode=new S.Node,this._triangulationResults={},this._shadersMap=S.COMMON_SHADERS.filter(function(r){return r!=="shadow"}).reduce(function(r,i){return r[i]=S.createShader("ecgl."+i),r},{}),this._linesShader=S.createShader("ecgl.meshLines3D");var t={};S.COMMON_SHADERS.forEach(function(r){t[r]=new S.Material({shader:S.createShader("ecgl."+r)})}),this._groundMaterials=t,this._groundMesh=new S.Mesh({geometry:new S.PlaneGeometry({dynamic:!0}),castShadow:!1,renderNormal:!0,$ignorePicking:!0}),this._groundMesh.rotation.rotateX(-Math.PI/2),this._labelsBuilder=new ah(512,512,e),this._labelsBuilder.getMesh().renderOrder=100,this._labelsBuilder.getMesh().material.depthTest=!1,this.rootNode.add(this._labelsBuilder.getMesh()),this._initMeshes(),this._api=e}oh.prototype={constructor:oh,extrudeY:!0,update:function(e,t,r,i,n){var a=e.getData();i==null&&(i=0),n==null&&(n=a.count()),this._startIndex=i,this._endIndex=n-1,this._triangulation(e,i,n);var o=this._getShader(e.get("shading"));this._prepareMesh(e,o,r,i,n),this.rootNode.updateWorldTransform(),this._updateRegionMesh(e,r,i,n);var s=e.coordinateSystem;s.type==="geo3D"&&this._updateGroundPlane(e,s,r);var l=this;this._labelsBuilder.updateData(a,i,n),this._labelsBuilder.getLabelPosition=function(u,h,f){var c=a.getName(u),d,v=f;if(s.type==="geo3D"){var p=s.getRegion(c);if(!p)return[NaN,NaN,NaN];d=p.getCenter();var _=s.dataToPoint([d[0],d[1],v]);return _}else var g=l._triangulationResults[u-l._startIndex],d=l.extrudeY?[(g.max[0]+g.min[0])/2,g.max[1]+v,(g.max[2]+g.min[2])/2]:[(g.max[0]+g.min[0])/2,(g.max[1]+g.min[1])/2,g.max[2]+v]},this._data=a,this._labelsBuilder.updateLabels(),this._updateDebugWireframe(e),this._lastHoverDataIndex=0},_initMeshes:function(){var e=this;function t(){var n=new S.Mesh({name:"Polygon",material:new S.Material({shader:e._shadersMap.lambert}),geometry:new S.Geometry({sortTriangles:!0,dynamic:!0}),culling:!1,ignorePicking:!0,renderNormal:!0});return Object.assign(n.geometry,nh),n}var r=t(),i=new S.Mesh({material:new S.Material({shader:this._linesShader}),castShadow:!1,ignorePicking:!0,$ignorePicking:!0,geometry:new Si({useNativeLine:!1})});this.rootNode.add(r),this.rootNode.add(i),r.material.define("both","VERTEX_COLOR"),r.material.define("fragment","DOUBLE_SIDED"),this._polygonMesh=r,this._linesMesh=i,this.rootNode.add(this._groundMesh)},_getShader:function(e){var t=this._shadersMap[e];return t||(console.warn("Unkown shading "+e),t=this._shadersMap.lambert),t.__shading=e,t},_prepareMesh:function(e,t,r,i,n){for(var a=0,o=0,s=0,l=0,u=i;u<n;u++){var h=this._getRegionPolygonInfo(u),f=this._getRegionLinesInfo(u,e,this._linesMesh.geometry);a+=h.vertexCount,o+=h.triangleCount,s+=f.vertexCount,l+=f.triangleCount}var c=this._polygonMesh,d=c.geometry;["position","normal","texcoord0","color"].forEach(function(v){d.attributes[v].init(a)}),d.indices=a>65535?new Uint32Array(o*3):new Uint16Array(o*3),c.material.shader!==t&&c.material.attachShader(t,!0),S.setMaterialFromModel(t.__shading,c.material,e,r),s>0&&(this._linesMesh.geometry.resetOffset(),this._linesMesh.geometry.setVertexCount(s),this._linesMesh.geometry.setTriangleCount(l)),this._dataIndexOfVertex=new Uint32Array(a),this._vertexRangeOfDataIndex=new Uint32Array((n-i)*2)},_updateRegionMesh:function(e,t,r,i){for(var n=e.getData(),a=0,o=0,s=!1,T=this._polygonMesh,l=this._linesMesh,u=r;u<i;u++){var h=e.getRegionModel(u),f=h.getModel("itemStyle"),c=te.firstNotNull($e(n,u),f.get("color"),"#fff"),d=te.firstNotNull(et(n,u),f.get("opacity"),1),v=S.parseColor(c),p=S.parseColor(f.get("borderColor"));v[3]*=d,p[3]*=d;var _=v[3]<.99;T.material.set("color",[1,1,1,1]),s=s||_;for(var g=te.firstNotNull(h.get("height",!0),e.get("regionHeight")),m=this._updatePolygonGeometry(e,T.geometry,u,g,a,o,v),y=a;y<m.vertexOffset;y++)this._dataIndexOfVertex[y]=u;this._vertexRangeOfDataIndex[(u-r)*2]=a,this._vertexRangeOfDataIndex[(u-r)*2+1]=m.vertexOffset,a=m.vertexOffset,o=m.triangleOffset;var x=f.get("borderWidth"),w=x>0;w&&(x*=t.getDevicePixelRatio(),this._updateLinesGeometry(l.geometry,e,u,g,x,e.coordinateSystem.transform)),l.invisible=!w,l.material.set({color:p})}var T=this._polygonMesh;T.material.transparent=s,T.material.depthMask=!s,T.geometry.updateBoundingBox(),T.frontFace=this.extrudeY?S.Mesh.CCW:S.Mesh.CW,T.material.get("normalMap")&&T.geometry.generateTangents(),T.seriesIndex=e.seriesIndex,T.on("mousemove",this._onmousemove,this),T.on("mouseout",this._onmouseout,this)},_updateDebugWireframe:function(e){var t=e.getModel("debug.wireframe");if(t.get("show")){var r=S.parseColor(t.get("lineStyle.color")||"rgba(0,0,0,0.5)"),i=te.firstNotNull(t.get("lineStyle.width"),1),n=this._polygonMesh;n.geometry.generateBarycentric(),n.material.define("both","WIREFRAME_TRIANGLE"),n.material.set("wireframeLineColor",r),n.material.set("wireframeLineWidth",i)}},_onmousemove:function(e){var t=this._dataIndexOfVertex[e.triangle[0]];t==null&&(t=-1),t!==this._lastHoverDataIndex&&(this.downplay(this._lastHoverDataIndex),this.highlight(t),this._labelsBuilder.updateLabels([t])),this._lastHoverDataIndex=t,this._polygonMesh.dataIndex=t},_onmouseout:function(e){e.target&&(this.downplay(this._lastHoverDataIndex),this._lastHoverDataIndex=-1,this._polygonMesh.dataIndex=-1),this._labelsBuilder.updateLabels([])},_updateGroundPlane:function(e,t,r){var i=e.getModel("groundPlane",e);if(this._groundMesh.invisible=!i.get("show",!0),!this._groundMesh.invisible){var n=e.get("shading"),a=this._groundMaterials[n];a||(console.warn("Unkown shading "+n),a=this._groundMaterials.lambert),S.setMaterialFromModel(n,a,i,r),a.get("normalMap")&&this._groundMesh.geometry.generateTangents(),this._groundMesh.material=a,this._groundMesh.material.set("color",S.parseColor(i.get("color"))),this._groundMesh.scale.set(t.size[0],t.size[2],1)}},_triangulation:function(e,t,r){this._triangulationResults=[];for(var i=[1/0,1/0,1/0],n=[-1/0,-1/0,-1/0],a=e.coordinateSystem,o=t;o<r;o++){for(var s=[],l=e.getRegionPolygonCoords(o),u=0;u<l.length;u++){var h=l[u].exterior,f=l[u].interiors,c=[],d=[];if(!(h.length<3)){for(var v=0,p=0;p<h.length;p++){var _=h[p];c[v++]=_[0],c[v++]=_[1]}for(var p=0;p<f.length;p++)if(!(f[p].length<3)){for(var g=c.length/2,m=0;m<f[p].length;m++){var _=f[p][m];c.push(_[0]),c.push(_[1])}d.push(g)}for(var y=JT(c,d),x=new Float64Array(c.length/2*3),w=[],T=[1/0,1/0,1/0],E=[-1/0,-1/0,-1/0],b=0,p=0;p<c.length;)At.set(w,c[p++],0,c[p++]),a&&a.transform&&At.transformMat4(w,w,a.transform),At.min(T,T,w),At.max(E,E,w),x[b++]=w[0],x[b++]=w[1],x[b++]=w[2];At.min(i,i,T),At.max(n,n,E),s.push({points:x,indices:y,min:T,max:E})}}this._triangulationResults.push(s)}this._geoBoundingBox=[i,n]},_getRegionPolygonInfo:function(e){for(var t=this._triangulationResults[e-this._startIndex],r=0,i=0,n=0;n<t.length;n++)r+=t[n].points.length/3,i+=t[n].indices.length/3;var a=r*2+r*4,o=i*2+r*2;return{vertexCount:a,triangleCount:o}},_updatePolygonGeometry:function(e,t,r,i,n,a,o){var s=e.get("projectUVOnGround"),l=t.attributes.position,u=t.attributes.normal,h=t.attributes.texcoord0,f=t.attributes.color,c=this._triangulationResults[r-this._startIndex],d=f.value&&o,v=t.indices,p=this.extrudeY?1:2,_=this.extrudeY?2:1,g=[this.rootNode.worldTransform.x.len(),this.rootNode.worldTransform.y.len(),this.rootNode.worldTransform.z.len()],m=At.mul([],this._geoBoundingBox[0],g),y=At.mul([],this._geoBoundingBox[1],g),x=Math.max(y[0]-m[0],y[2]-m[2]);function w(Le,ot,Ye){for(var ke=Le.points,tr=ke.length,Oe=[],lt=[],He=0;He<tr;He+=3)Oe[0]=ke[He],Oe[p]=ot,Oe[_]=ke[He+2],lt[0]=(ke[He]*g[0]-m[0])/x,lt[1]=(ke[He+2]*g[_]-m[2])/x,l.set(n,Oe),d&&f.set(n,o),h.set(n++,lt)}function T(Le,ot,Ye){var ke=n;w(Le,ot,Ye);for(var tr=Le.indices.length,Oe=0;Oe<tr;Oe++)v[a*3+Oe]=Le.indices[Oe]+ke;a+=Le.indices.length/3}for(var E=this.extrudeY?[0,1,0]:[0,0,1],b=At.negate([],E),D=0;D<c.length;D++){var L=n,M=c[D];T(M,0,0),T(M,i,0);for(var R=M.points.length/3,I=0;I<R;I++)u.set(L+I,b),u.set(L+I+R,E);for(var P=[0,3,1,1,3,2],N=[[],[],[],[]],G=[],H=[],F=[],re=[],B=0,I=0;I<R;I++){for(var j=(I+1)%R,J=(M.points[j*3]-M.points[I*3])*g[0],le=(M.points[j*3+2]-M.points[I*3+2])*g[_],ve=Math.sqrt(J*J+le*le),ne=0;ne<4;ne++){var ze=ne===0||ne===3,we=(ze?I:j)*3;N[ne][0]=M.points[we],N[ne][p]=ne>1?i:0,N[ne][_]=M.points[we+2],l.set(n+ne,N[ne]),s?(re[0]=(M.points[we]*g[0]-m[0])/x,re[1]=(M.points[we+2]*g[_]-m[_])/x):(re[0]=(ze?B:B+ve)/x,re[1]=(N[ne][p]*g[p]-m[p])/x),h.set(n+ne,re)}At.sub(G,N[1],N[0]),At.sub(H,N[3],N[0]),At.cross(F,G,H),At.normalize(F,F);for(var ne=0;ne<4;ne++)u.set(n+ne,F),d&&f.set(n+ne,o);for(var ne=0;ne<6;ne++)v[a*3+ne]=P[ne]+n;n+=4,a+=2,B+=ve}}return t.dirty(),{vertexOffset:n,triangleOffset:a}},_getRegionLinesInfo:function(e,t,r){var i=0,n=0,a=t.getRegionModel(e),o=a.getModel("itemStyle"),s=o.get("borderWidth");if(s>0){var l=t.getRegionPolygonCoords(e);l.forEach(function(u){var h=u.exterior,f=u.interiors;i+=r.getPolylineVertexCount(h),n+=r.getPolylineTriangleCount(h);for(var c=0;c<f.length;c++)i+=r.getPolylineVertexCount(f[c]),n+=r.getPolylineTriangleCount(f[c])},this)}return{vertexCount:i,triangleCount:n}},_updateLinesGeometry:function(e,t,r,i,n,a){function o(u){for(var h=new Float64Array(u.length*3),f=0,c=[],d=0;d<u.length;d++)c[0]=u[d][0],c[1]=i+.1,c[2]=u[d][1],a&&At.transformMat4(c,c,a),h[f++]=c[0],h[f++]=c[1],h[f++]=c[2];return h}var s=[1,1,1,1],l=t.getRegionPolygonCoords(r);l.forEach(function(u){var h=u.exterior,f=u.interiors;e.addPolyline(o(h),s,n);for(var c=0;c<f.length;c++)e.addPolyline(o(f[c]),s,n)})},highlight:function(e){var t=this._data;if(t){var r=t.getItemModel(e),i=r.getModel(["emphasis","itemStyle"]),n=i.get("color"),a=te.firstNotNull(i.get("opacity"),et(t,e),1);if(n==null){var o=$e(t,e);n=A.color.lift(o,-.4)}a==null&&(a=et(t,e));var s=S.parseColor(n);s[3]*=a,this._setColorOfDataIndex(t,e,s)}},downplay:function(e){var t=this._data;if(t){var r=t.getItemModel(e),i=te.firstNotNull($e(t,e),r.get(["itemStyle","color"]),"#fff"),n=te.firstNotNull(et(t,e),r.get(["itemStyle","opacity"]),1),a=S.parseColor(i);a[3]*=n,this._setColorOfDataIndex(t,e,a)}},dispose:function(){this._labelsBuilder.dispose()},_setColorOfDataIndex:function(e,t,r){if(!(t<this._startIndex&&t>this._endIndex)){t-=this._startIndex;for(var i=this._vertexRangeOfDataIndex[t*2];i<this._vertexRangeOfDataIndex[t*2+1];i++)this._polygonMesh.geometry.attributes.color.set(i,r);this._polygonMesh.geometry.dirty(),this._api.getZr().refresh()}}};let Ms=oh,p2=A.ComponentView.extend({type:"geo3D",__ecgl__:!0,init:function(e,t){this._geo3DBuilder=new Ms(t),this.groupGL=new S.Node,this._lightRoot=new S.Node,this._sceneHelper=new mn(this._lightRoot),this._sceneHelper.initLight(this._lightRoot),this._control=new hs({zr:t.getZr()}),this._control.init()},render:function(e,t,r){this.groupGL.add(this._geo3DBuilder.rootNode);var i=e.coordinateSystem;if(!(!i||!i.viewGL)){i.viewGL.add(this._lightRoot),e.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL);var n=this._control;n.setViewGL(i.viewGL);var a=e.getModel("viewControl");n.setFromViewControlModel(a,0),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(e),i.viewGL.setPostEffect(e.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling")),this._geo3DBuilder.update(e,t,r,0,e.getData().count());var o=i.viewGL.isLinearSpace()?"define":"undefine";this._geo3DBuilder.rootNode.traverse(function(s){s.material&&s.material[o]("fragment","SRGB_DECODE")}),n.off("update"),n.on("update",function(){r.dispatchAction({type:"geo3DChangeCamera",alpha:n.getAlpha(),beta:n.getBeta(),distance:n.getDistance(),center:n.getCenter(),from:this.uid,geo3DId:e.id})}),n.update()}},afterRender:function(e,t,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r)},dispose:function(){this._control.dispose(),this._geo3DBuilder.dispose()}});var _2={\u5357\u6D77\u8BF8\u5C9B:[32,80],\u5E7F\u4E1C:[0,-10],\u9999\u6E2F:[10,5],\u6FB3\u95E8:[-10,10],\u5929\u6D25:[5,5]};function g2(e,t){if(e==="china"){var r=_2[t.name];if(r){var i=t.getCenter();i[0]+=r[0]/10.5,i[1]+=-r[1]/14,t.setCenter(i)}}}var m2={Russia:[100,60],"United States":[-99,38],"United States of America":[-99,38]};function y2(e,t){if(e==="world"){var r=m2[t.name];if(r){var i=[r[0],r[1]];t.setCenter(i)}}}var x2=Ue.vec3,bn=Ue.mat4,T2=[g2,y2];function sh(e,t,r,i,n){this.name=e,this.map=t,this.regionHeight=0,this.regions=[],this._nameCoordMap={},this.loadGeoJson(r,i,n),this.transform=bn.identity(new Float64Array(16)),this.invTransform=bn.identity(new Float64Array(16)),this.extrudeY=!0,this.altitudeAxis}sh.prototype={constructor:sh,type:"geo3D",dimensions:["lng","lat","alt"],containPoint:function(){},loadGeoJson:function(e,t,r){var i=A.parseGeoJSON||A.parseGeoJson;try{this.regions=e?i(e):[]}catch(u){throw`Invalid geoJson format
`+u}t=t||{},r=r||{};for(var n=this.regions,a={},o=0;o<n.length;o++){var s=n[o].name;s=r[s]||s,n[o].name=s,a[s]=n[o],this.addGeoCoord(s,n[o].getCenter());var l=t[s];l&&n[o].transformTo(l.left,l.top,l.width,l.height)}this._regionsMap=a,this._geoRect=null,T2.forEach(function(u){u(this)},this)},getGeoBoundingRect:function(){if(this._geoRect)return this._geoRect;for(var e,t=this.regions,r=0;r<t.length;r++){var i=t[r].getBoundingRect();e=e||i.clone(),e.union(i)}return this._geoRect=e||new A.graphic.BoundingRect(0,0,0,0)},addGeoCoord:function(e,t){this._nameCoordMap[e]=t},getRegion:function(e){return this._regionsMap[e]},getRegionByCoord:function(e){for(var t=this.regions,r=0;r<t.length;r++)if(t[r].contain(e))return t[r]},setSize:function(e,t,r){this.size=[e,t,r];var i=this.getGeoBoundingRect(),n=e/i.width,a=-r/i.height,o=-e/2-i.x*n,s=r/2-i.y*a,l=this.extrudeY?[o,0,s]:[o,s,0],u=this.extrudeY?[n,1,a]:[n,a,1],h=this.transform;bn.identity(h),bn.translate(h,h,l),bn.scale(h,h,u),bn.invert(this.invTransform,h)},dataToPoint:function(e,t){t=t||[];var r=this.extrudeY?1:2,i=this.extrudeY?2:1,n=e[2];return isNaN(n)&&(n=0),t[0]=e[0],t[i]=e[1],this.altitudeAxis?t[r]=this.altitudeAxis.dataToCoord(n):t[r]=0,t[r]+=this.regionHeight,x2.transformMat4(t,t,this.transform),t},pointToData:function(e,t){}};let ap=sh;function w2(e,t){var r=e.getBoxLayoutParams(),i=Ea(r,{width:t.getWidth(),height:t.getHeight()});i.y=t.getHeight()-i.y-i.height,this.viewGL.setViewport(i.x,i.y,i.width,i.height,t.getDevicePixelRatio());var n=this.getGeoBoundingRect(),a=n.width/n.height*(e.get("aspectScale")||.75),o=e.get("boxWidth"),s=e.get("boxDepth"),l=e.get("boxHeight");l==null&&(l=5),isNaN(o)&&isNaN(s)&&(o=100),isNaN(s)?s=o/a:isNaN(o)&&(o=s/a),this.setSize(o,l,s),this.regionHeight=e.get("regionHeight"),this.altitudeAxis&&this.altitudeAxis.setExtent(0,Math.max(l-this.regionHeight,0))}function S2(e,t){var r=[1/0,-1/0];if(e.eachSeries(function(n){if(n.coordinateSystem===this&&n.type!=="series.map3D"){var a=n.getData(),o=n.coordDimToDataDim("alt"),s=o&&o[0];if(s){var l=a.getDataExtent(s,!0);r[0]=Math.min(r[0],l[0]),r[1]=Math.max(r[1],l[1])}}},this),r&&isFinite(r[1]-r[0])){var i=A.helper.createScale(r,{type:"value",min:"dataMin",max:"dataMax"});this.altitudeAxis=new A.Axis("altitude",i),this.resize(this.model,t)}}var b2=function(e){console.error("Map "+e+" not exists. You can download map file on http://echarts.baidu.com/download-map.html")},op=0,sp={dimensions:ap.prototype.dimensions,create:function(e,t){var r=[];if(!A.getMap)throw new Error("geo3D component depends on geo component");function i(n,a){var o=sp.createGeo3D(n);n.__viewGL=n.__viewGL||new Vr,o.viewGL=n.__viewGL,n.coordinateSystem=o,o.model=n,r.push(o),o.resize=w2,o.resize(n,t),o.update=S2}return e.eachComponent("geo3D",function(n,a){i(n,a)}),e.eachSeriesByType("map3D",function(n,a){var o=n.get("coordinateSystem");o==null&&(o="geo3D"),o==="geo3D"&&i(n,a)}),e.eachSeries(function(n){if(n.get("coordinateSystem")==="geo3D"){if(n.type==="series.map3D")return;var a=n.getReferringComponents("geo3D").models[0];if(a||(a=e.getComponent("geo3D")),!a)throw new Error('geo "'+te.firstNotNull(n.get("geo3DIndex"),n.get("geo3DId"),0)+'" not found');n.coordinateSystem=a.coordinateSystem}}),r},createGeo3D:function(e){var t=e.get("map"),r;if(typeof t=="string"?(r=t,t=A.getMap(t)):t&&t.features&&(t={geoJson:t}),t||b2(t),!t.geoJson.features)throw new Error("Invalid GeoJSON for map3D");return r==null&&(r="GEO_ANONYMOUS_"+op++),new ap(r+op++,r,t&&t.geoJson,t&&t.specialAreas,e.get("nameMap"))}};let lp=sp;var up="__ECGL_GEO3D_REGISTERED";function hp(e){e[up]||(e[up]=!0,e.registerComponentModel(QT),e.registerComponentView(p2),e.registerAction({type:"geo3DChangeCamera",event:"geo3dcamerachanged",update:"series:updateCamera"},function(t,r){r.eachComponent({mainType:"geo3D",query:t},function(i){i.setView(t)})}),e.registerCoordinateSystem("geo3D",lp))}(0,A.use)(hp);function fp(e,t){e.id=e.id||e.name||t+""}var Ni=A.ComponentModel.extend({type:"globe",layoutMode:"box",coordinateSystem:null,init:function(){Ni.superApply(this,"init",arguments),A.util.each(this.option.layers,function(e,t){A.util.merge(e,this.defaultLayerOption),fp(e,t)},this)},mergeOption:function(e){var t=this.option.layers;this.option.layers=null,Ni.superApply(this,"mergeOption",arguments);function r(o){return A.util.reduce(o,function(s,l,u){return fp(l,u),s[l.id]=l,s},{})}if(t&&t.length){var i=r(e.layers),n=r(t);for(var a in i)n[a]?A.util.merge(n[a],i[a],!0):t.push(e.layers[a]);this.option.layers=t}A.util.each(this.option.layers,function(o){A.util.merge(o,this.defaultLayerOption)},this)},optionUpdated:function(){this.updateDisplacementHash()},defaultLayerOption:{show:!0,type:"overlay"},defaultOption:{show:!0,zlevel:-10,left:0,top:0,width:"100%",height:"100%",environment:"auto",baseColor:"#fff",baseTexture:"",heightTexture:"",displacementTexture:"",displacementScale:0,displacementQuality:"medium",globeRadius:100,globeOuterRadius:150,shading:"lambert",light:{main:{time:""}},atmosphere:{show:!1,offset:5,color:"#ffffff",glowPower:6,innerGlowPower:2},viewControl:{autoRotate:!0,panSensitivity:0,targetCoord:null},layers:[]},setDisplacementData:function(e,t,r){this.displacementData=e,this.displacementWidth=t,this.displacementHeight=r},getDisplacementTexture:function(){return this.get("displacementTexture")||this.get("heightTexture")},getDisplacemenScale:function(){var e=this.getDisplacementTexture(),t=this.get("displacementScale");return(!e||e==="none")&&(t=0),t},hasDisplacement:function(){return this.getDisplacemenScale()>0},_displacementChanged:!0,_displacementScale:0,updateDisplacementHash:function(){var e=this.getDisplacementTexture(),t=this.getDisplacemenScale();this._displacementChanged=this._displacementTexture!==e||this._displacementScale!==t,this._displacementTexture=e,this._displacementScale=t},isDisplacementChanged:function(){return this._displacementChanged}});A.util.merge(Ni.prototype,Mo),A.util.merge(Ni.prototype,en),A.util.merge(Ni.prototype,tn),A.util.merge(Ni.prototype,Tn);let E2=Ni;var cp=Math.PI,kt=Math.sin,Sr=Math.cos,dp=Math.tan,vp=Math.asin,pp=Math.atan2,Ii=cp/180,A2=1e3*60*60*24,M2=2440588,D2=2451545;function C2(e){return e.valueOf()/A2-.5+M2}function L2(e){return C2(e)-D2}var Ds=Ii*23.4397;function P2(e,t){return pp(kt(e)*Sr(Ds)-dp(t)*kt(Ds),Sr(e))}function R2(e,t){return vp(kt(t)*Sr(Ds)+Sr(t)*kt(Ds)*kt(e))}function N2(e,t,r){return pp(kt(e),Sr(e)*kt(t)-dp(r)*Sr(t))}function I2(e,t,r){return vp(kt(t)*kt(r)+Sr(t)*Sr(r)*Sr(e))}function O2(e,t){return Ii*(280.16+360.9856235*e)-t}function B2(e){return Ii*(357.5291+.98560028*e)}function F2(e){var t=Ii*(1.9148*kt(e)+.02*kt(2*e)+3e-4*kt(3*e)),r=Ii*102.9372;return e+t+r+cp}function G2(e){var t=B2(e),r=F2(t);return{dec:R2(r,0),ra:P2(r,0)}}var _p={};_p.getPosition=function(e,t,r){var i=Ii*-r,n=Ii*t,a=L2(e),o=G2(a),s=O2(a,i)-o.ra;return{azimuth:N2(s,n,o.dec),altitude:I2(s,n,o.dec)}};let U2=_p,z2=`@export ecgl.atmosphere.vertex
attribute vec3 position: POSITION;
attribute vec3 normal : NORMAL;
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform mat4 normalMatrix : WORLDINVERSETRANSPOSE;

varying vec3 v_Normal;

void main() {
 v_Normal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);
 gl_Position = worldViewProjection * vec4(position, 1.0);
}
@end


@export ecgl.atmosphere.fragment
uniform mat4 viewTranspose: VIEWTRANSPOSE;
uniform float glowPower;
uniform vec3 glowColor;

varying vec3 v_Normal;

void main() {
 float intensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);
 gl_FragColor = vec4(glowColor, intensity * intensity);
}
@end`;S.Shader.import(Vf),S.Shader.import(z2);let H2=A.ComponentView.extend({type:"globe",__ecgl__:!0,_displacementScale:0,init:function(e,t){this.groupGL=new S.Node,this._sphereGeometry=new S.SphereGeometry({widthSegments:200,heightSegments:100,dynamic:!0}),this._overlayGeometry=new S.SphereGeometry({widthSegments:80,heightSegments:40}),this._planeGeometry=new S.PlaneGeometry,this._earthMesh=new S.Mesh({renderNormal:!0}),this._atmosphereMesh=new S.Mesh,this._atmosphereGeometry=new S.SphereGeometry({widthSegments:80,heightSegments:40}),this._atmosphereMaterial=new S.Material({shader:new S.Shader(S.Shader.source("ecgl.atmosphere.vertex"),S.Shader.source("ecgl.atmosphere.fragment")),transparent:!0}),this._atmosphereMesh.geometry=this._atmosphereGeometry,this._atmosphereMesh.material=this._atmosphereMaterial,this._atmosphereMesh.frontFace=S.Mesh.CW,this._lightRoot=new S.Node,this._sceneHelper=new mn,this._sceneHelper.initLight(this._lightRoot),this.groupGL.add(this._atmosphereMesh),this.groupGL.add(this._earthMesh),this._control=new hs({zr:t.getZr()}),this._control.init(),this._layerMeshes={}},render:function(e,t,r){var i=e.coordinateSystem,n=e.get("shading");i.viewGL.add(this._lightRoot),e.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL),this._sceneHelper.setScene(i.viewGL.scene),i.viewGL.setPostEffect(e.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling"));var a=this._earthMesh;a.geometry=this._sphereGeometry;var o="ecgl."+n;(!a.material||a.material.shader.name!==o)&&(a.material=S.createMaterial(o)),S.setMaterialFromModel(n,a.material,e,r),["roughnessMap","metalnessMap","detailMap","normalMap"].forEach(function(f){var c=a.material.get(f);c&&(c.flipY=!1)}),a.material.set("color",S.parseColor(e.get("baseColor")));var s=i.radius*.99;if(a.scale.set(s,s,s),e.get("atmosphere.show")){a.material.define("both","ATMOSPHERE_ENABLED"),this._atmosphereMesh.invisible=!1,this._atmosphereMaterial.setUniforms({glowPower:e.get("atmosphere.glowPower")||6,glowColor:e.get("atmosphere.color")||"#ffffff"}),a.material.setUniforms({glowPower:e.get("atmosphere.innerGlowPower")||2,glowColor:e.get("atmosphere.color")||"#ffffff"});var l=e.get("atmosphere.offset")||5;this._atmosphereMesh.scale.set(s+l,s+l,s+l)}else a.material.undefine("both","ATMOSPHERE_ENABLED"),this._atmosphereMesh.invisible=!0;var u=a.material.setTextureImage("diffuseMap",e.get("baseTexture"),r,{flipY:!1,anisotropic:8});u&&u.surface&&u.surface.attachToMesh(a);var h=a.material.setTextureImage("bumpMap",e.get("heightTexture"),r,{flipY:!1,anisotropic:8});h&&h.surface&&h.surface.attachToMesh(a),a.material[e.get("postEffect.enable")?"define":"undefine"]("fragment","SRGB_DECODE"),this._updateLight(e,r),this._displaceVertices(e,r),this._updateViewControl(e,r),this._updateLayers(e,r)},afterRender:function(e,t,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r)},_updateLayers:function(e,t){var r=e.coordinateSystem,i=e.get("layers"),n=r.radius,a=[],o=[],s=[],l=[];A.util.each(i,function(d){var v=new A.Model(d),p=v.get("type"),_=S.loadTexture(v.get("texture"),t,{flipY:!1,anisotropic:8});if(_.surface&&_.surface.attachToMesh(this._earthMesh),p==="blend"){var g=v.get("blendTo"),m=te.firstNotNull(v.get("intensity"),1);g==="emission"?(s.push(_),l.push(m)):(a.push(_),o.push(m))}else{var y=v.get("id"),x=this._layerMeshes[y];x||(x=this._layerMeshes[y]=new S.Mesh({geometry:this._overlayGeometry,castShadow:!1,ignorePicking:!0}));var w=v.get("shading");w==="lambert"?(x.material=x.__lambertMaterial||new S.Material({autoUpdateTextureStatus:!1,shader:S.createShader("ecgl.lambert"),transparent:!0,depthMask:!1}),x.__lambertMaterial=x.material):(x.material=x.__colorMaterial||new S.Material({autoUpdateTextureStatus:!1,shader:S.createShader("ecgl.color"),transparent:!0,depthMask:!1}),x.__colorMaterial=x.material),x.material.enableTexture("diffuseMap");var T=v.get("distance"),E=n+(T??r.radius/100);x.scale.set(E,E,E),n=E;var b=this._blankTexture||(this._blankTexture=S.createBlankTexture("rgba(255, 255, 255, 0)"));x.material.set("diffuseMap",b),S.loadTexture(v.get("texture"),t,{flipY:!1,anisotropic:8},function(D){D.surface&&D.surface.attachToMesh(x),x.material.set("diffuseMap",D),t.getZr().refresh()}),v.get("show")?this.groupGL.add(x):this.groupGL.remove(x)}},this);var u=this._earthMesh.material;u.define("fragment","LAYER_DIFFUSEMAP_COUNT",a.length),u.define("fragment","LAYER_EMISSIVEMAP_COUNT",s.length),u.set("layerDiffuseMap",a),u.set("layerDiffuseIntensity",o),u.set("layerEmissiveMap",s),u.set("layerEmissionIntensity",l);var h=e.getModel("debug.wireframe");if(h.get("show")){u.define("both","WIREFRAME_TRIANGLE");var f=S.parseColor(h.get("lineStyle.color")||"rgba(0,0,0,0.5)"),c=te.firstNotNull(h.get("lineStyle.width"),1);u.set("wireframeLineWidth",c),u.set("wireframeLineColor",f)}else u.undefine("both","WIREFRAME_TRIANGLE")},_updateViewControl:function(e,t){var r=e.coordinateSystem,i=e.getModel("viewControl"),n=r.viewGL.camera,a=this;function o(){return{type:"globeChangeCamera",alpha:s.getAlpha(),beta:s.getBeta(),distance:s.getDistance()-r.radius,center:s.getCenter(),from:a.uid,globeId:e.id}}var s=this._control;s.setViewGL(r.viewGL);var l=i.get("targetCoord"),u,h;l!=null&&(h=l[0]+90,u=l[1]),s.setFromViewControlModel(i,{baseDistance:r.radius,alpha:u,beta:h}),s.off("update"),s.on("update",function(){t.dispatchAction(o())})},_displaceVertices:function(e,t){var r=e.get("displacementQuality"),i=e.get("debug.wireframe.show"),n=e.coordinateSystem;if(!(!e.isDisplacementChanged()&&r===this._displacementQuality&&i===this._showDebugWireframe)){this._displacementQuality=r,this._showDebugWireframe=i;var a=this._sphereGeometry,o={low:100,medium:200,high:400,ultra:800}[r]||200,s=o/2;(a.widthSegments!==o||i)&&(a.widthSegments=o,a.heightSegments=s,a.build()),this._doDisplaceVertices(a,n),i&&a.generateBarycentric()}},_doDisplaceVertices:function(e,t){var r=e.attributes.position.value,i=e.attributes.texcoord0.value,n=e.__originalPosition;(!n||n.length!==r.length)&&(n=new Float32Array(r.length),n.set(r),e.__originalPosition=n);for(var a=t.displacementWidth,o=t.displacementHeight,s=t.displacementData,l=0;l<e.vertexCount;l++){var u=l*3,h=l*2,f=n[u+1],c=n[u+2],d=n[u+3],v=i[h++],p=i[h++],_=Math.round(v*(a-1)),g=Math.round(p*(o-1)),m=g*a+_,y=s?s[m]:0;r[u+1]=f+f*y,r[u+2]=c+c*y,r[u+3]=d+d*y}e.generateVertexNormals(),e.dirty(),e.updateBoundingBox()},_updateLight:function(e,t){var r=this._earthMesh;this._sceneHelper.updateLight(e);var i=this._sceneHelper.mainLight,n=e.get("light.main.time")||new Date,a=U2.getPosition(A.number.parseDate(n),0,0),o=Math.cos(a.altitude);i.position.y=-o*Math.cos(a.azimuth),i.position.x=Math.sin(a.altitude),i.position.z=o*Math.sin(a.azimuth),i.lookAt(r.getWorldPosition())},dispose:function(e,t){this.groupGL.removeAll(),this._control.dispose()}});var V2=Ue.vec3;function lh(e){this.radius=e,this.viewGL=null,this.altitudeAxis,this.displacementData=null,this.displacementWidth,this.displacementHeight}lh.prototype={constructor:lh,dimensions:["lng","lat","alt"],type:"globe",containPoint:function(){},setDisplacementData:function(e,t,r){this.displacementData=e,this.displacementWidth=t,this.displacementHeight=r},_getDisplacementScale:function(e,t){var r=(e+180)/360*(this.displacementWidth-1),i=(90-t)/180*(this.displacementHeight-1),n=Math.round(r)+Math.round(i)*this.displacementWidth;return this.displacementData[n]},dataToPoint:function(e,t){var r=e[0],i=e[1],n=e[2]||0,a=this.radius;this.displacementData&&(a*=1+this._getDisplacementScale(r,i)),this.altitudeAxis&&(a+=this.altitudeAxis.dataToCoord(n)),r=r*Math.PI/180,i=i*Math.PI/180;var o=Math.cos(i)*a;return t=t||[],t[0]=-o*Math.cos(r+Math.PI),t[1]=Math.sin(i)*a,t[2]=o*Math.sin(r+Math.PI),t},pointToData:function(e,t){var r=e[0],i=e[1],n=e[2],a=V2.len(e);r/=a,i/=a,n/=a;var o=Math.asin(i),s=Math.atan2(n,-r);s<0&&(s=Math.PI*2+s);var l=o*180/Math.PI,u=s*180/Math.PI-180;return t=t||[],t[0]=u,t[1]=l,t[2]=a-this.radius,this.altitudeAxis&&(t[2]=this.altitudeAxis.coordToData(t[2])),t}};let gp=lh;function k2(e,t){var r=document.createElement("canvas"),i=r.getContext("2d"),n=e.width,a=e.height;r.width=n,r.height=a,i.drawImage(e,0,0,n,a);for(var o=i.getImageData(0,0,n,a).data,s=new Float32Array(o.length/4),l=0;l<o.length/4;l++){var u=o[l*4];s[l]=u/255*t}return{data:s,width:n,height:a}}function W2(e,t){var r=e.getBoxLayoutParams(),i=Ea(r,{width:t.getWidth(),height:t.getHeight()});i.y=t.getHeight()-i.y-i.height,this.viewGL.setViewport(i.x,i.y,i.width,i.height,t.getDevicePixelRatio()),this.radius=e.get("globeRadius");var n=e.get("globeOuterRadius");this.altitudeAxis&&this.altitudeAxis.setExtent(0,n-this.radius)}function X2(e,t){var r=[1/0,-1/0];if(e.eachSeries(function(n){if(n.coordinateSystem===this){var a=n.getData(),o=n.coordDimToDataDim("alt"),s=o&&o[0];if(s){var l=a.getDataExtent(s,!0);r[0]=Math.min(r[0],l[0]),r[1]=Math.max(r[1],l[1])}}},this),r&&isFinite(r[1]-r[0])){var i=A.helper.createScale(r,{type:"value",min:"dataMin",max:"dataMax"});this.altitudeAxis=new A.Axis("altitude",i),this.resize(this.model,t)}}var j2={dimensions:gp.prototype.dimensions,create:function(e,t){var r=[];return e.eachComponent("globe",function(i){i.__viewGL=i.__viewGL||new Vr;var n=new gp;n.viewGL=i.__viewGL,i.coordinateSystem=n,n.model=i,r.push(n),n.resize=W2,n.resize(i,t),n.update=X2}),e.eachSeries(function(i){if(i.get("coordinateSystem")==="globe"){var n=i.getReferringComponents("globe").models[0];if(n||(n=e.getComponent("globe")),!n)throw new Error('globe "'+te.firstNotNull(i.get("globe3DIndex"),i.get("globe3DId"),0)+'" not found');var a=n.coordinateSystem;i.coordinateSystem=a}}),e.eachComponent("globe",function(i,n){var a=i.coordinateSystem,o=i.getDisplacementTexture(),s=i.getDisplacemenScale();if(i.isDisplacementChanged()){if(i.hasDisplacement()){var l=!0;S.loadTexture(o,t,function(u){var h=u.image,f=k2(h,s);i.setDisplacementData(f.data,f.width,f.height),l||t.dispatchAction({type:"globeUpdateDisplacment"})}),l=!1}else a.setDisplacementData(null,0,0);a.setDisplacementData(i.displacementData,i.displacementWidth,i.displacementHeight)}}),r}};let q2=j2;function Z2(e){e.registerComponentModel(E2),e.registerComponentView(H2),e.registerCoordinateSystem("globe",q2),e.registerAction({type:"globeChangeCamera",event:"globecamerachanged",update:"series:updateCamera"},function(t,r){r.eachComponent({mainType:"globe",query:t},function(i){i.setView(t)})}),e.registerAction({type:"globeUpdateDisplacment",event:"globedisplacementupdated",update:"update"},function(t,r){})}(0,A.use)(Z2);var mp=["zoom","center","pitch","bearing"],uh=A.ComponentModel.extend({type:"mapbox3D",layoutMode:"box",coordinateSystem:null,defaultOption:{zlevel:-10,style:"mapbox://styles/mapbox/light-v9",center:[0,0],zoom:0,pitch:0,bearing:0,light:{main:{alpha:20,beta:30}},altitudeScale:1,boxHeight:"auto"},getMapboxCameraOption:function(){var e=this;return mp.reduce(function(t,r){return t[r]=e.get(r),t},{})},setMapboxCameraOption:function(e){e!=null&&mp.forEach(function(t){e[t]!=null&&(this.option[t]=e[t])},this)},getMapbox:function(){return this._mapbox},setMapbox:function(e){this._mapbox=e}});A.util.merge(uh.prototype,en),A.util.merge(uh.prototype,tn);let Y2=uh;function kr(e,t){if(this.id=e,this.zr=t,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute;left:0;right:0;top:0;bottom:0;",!mapboxgl)throw new Error("Mapbox GL library must be included. See https://www.mapbox.com/mapbox-gl-js/api/");this._mapbox=new mapboxgl.Map({container:this.dom}),this._initEvents()}kr.prototype.setUnpainted=function(){},kr.prototype.resize=function(){this._mapbox.resize()},kr.prototype.getMapbox=function(){return this._mapbox},kr.prototype.clear=function(){},kr.prototype.refresh=function(){this._mapbox.resize()};var yp=["mousedown","mouseup","click","dblclick","mousemove","mousewheel","wheel","touchstart","touchend","touchmove","touchcancel"];kr.prototype._initEvents=function(){var e=this._mapbox.getCanvasContainer();this._handlers=this._handlers||{contextmenu:function(t){return t.preventDefault(),!1}},yp.forEach(function(t){this._handlers[t]=function(r){var i={};for(var n in r)i[n]=r[n];i.bubbles=!1;var a=new r.constructor(r.type,i);e.dispatchEvent(a)},this.zr.dom.addEventListener(t,this._handlers[t])},this),this.zr.dom.addEventListener("contextmenu",this._handlers.contextmenu)},kr.prototype.dispose=function(){yp.forEach(function(e){this.zr.dom.removeEventListener(e,this._handlers[e])},this)};let K2=kr,xp=`
@export ecgl.displayShadow.vertex

@import ecgl.common.transformUniforms

@import ecgl.common.uv.header

@import ecgl.common.attributes

varying vec3 v_WorldPosition;

varying vec3 v_Normal;

void main()
{
 @import ecgl.common.uv.main
 v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);

 v_WorldPosition = (world * vec4(position, 1.0)).xyz;
 gl_Position = worldViewProjection * vec4(position, 1.0);
}

@end


@export ecgl.displayShadow.fragment

@import ecgl.common.uv.fragmentHeader

varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform float roughness: 0.2;

#ifdef DIRECTIONAL_LIGHT_COUNT
@import clay.header.directional_light
#endif

@import ecgl.common.ssaoMap.header

@import clay.plugin.compute_shadow_map

void main()
{
 float shadow = 1.0;

 @import ecgl.common.ssaoMap.main

#if defined(DIRECTIONAL_LIGHT_COUNT) && defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)
 float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];
 if(shadowEnabled)
 {
 computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);
 }
 for (int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++) {
 shadow = min(shadow, shadowContribsDir[i] * 0.5 + 0.5);
 }
#endif

 shadow *= 0.5 + ao * 0.5;
 shadow = clamp(shadow, 0.0, 1.0);

 gl_FragColor = vec4(vec3(0.0), 1.0 - shadow);
}

@end`;S.Shader.import(xp);var kM=512;let Q2=A.ComponentView.extend({type:"mapbox3D",__ecgl__:!0,init:function(e,t){var r=t.getZr();this._zrLayer=new K2("mapbox3D",r),r.painter.insertLayer(-1e3,this._zrLayer),this._lightRoot=new S.Node,this._sceneHelper=new mn(this._lightRoot),this._sceneHelper.initLight(this._lightRoot);var i=this._zrLayer.getMapbox(),n=this._dispatchInteractAction.bind(this,t,i);["zoom","rotate","drag","pitch","rotate","move"].forEach(function(a){i.on(a,n)}),this._groundMesh=new S.Mesh({geometry:new S.PlaneGeometry,material:new S.Material({shader:new S.Shader({vertex:S.Shader.source("ecgl.displayShadow.vertex"),fragment:S.Shader.source("ecgl.displayShadow.fragment")}),depthMask:!1}),renderOrder:-100,culling:!1,castShadow:!1,$ignorePicking:!0,renderNormal:!0})},render:function(e,t,r){var i=this._zrLayer.getMapbox(),n=e.get("style"),a=JSON.stringify(n);a!==this._oldStyleStr&&n&&i.setStyle(n),this._oldStyleStr=a,i.setCenter(e.get("center")),i.setZoom(e.get("zoom")),i.setPitch(e.get("pitch")),i.setBearing(e.get("bearing")),e.setMapbox(i);var o=e.coordinateSystem;o.viewGL.scene.add(this._lightRoot),o.viewGL.add(this._groundMesh),this._updateGroundMesh(),this._sceneHelper.setScene(o.viewGL.scene),this._sceneHelper.updateLight(e),o.viewGL.setPostEffect(e.getModel("postEffect"),r),o.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling")),this._mapbox3DModel=e},afterRender:function(e,t,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r),e.coordinateSystem.viewGL.scene.traverse(function(a){a.material&&(a.material.define("fragment","NORMAL_UP_AXIS",2),a.material.define("fragment","NORMAL_FRONT_AXIS",1))})},updateCamera:function(e,t,r,i){e.coordinateSystem.setCameraOption(i),this._updateGroundMesh(),r.getZr().refresh()},_dispatchInteractAction:function(e,t,r){e.dispatchAction({type:"mapbox3DChangeCamera",pitch:t.getPitch(),zoom:t.getZoom(),center:t.getCenter().toArray(),bearing:t.getBearing(),mapbox3DId:this._mapbox3DModel&&this._mapbox3DModel.id})},_updateGroundMesh:function(){if(this._mapbox3DModel){var e=this._mapbox3DModel.coordinateSystem,t=e.dataToPoint(e.center);this._groundMesh.position.set(t[0],t[1],-.001);var r=new S.Plane(new S.Vector3(0,0,1),0),i=e.viewGL.camera.castRay(new S.Vector2(-1,-1)),n=e.viewGL.camera.castRay(new S.Vector2(1,1)),a=i.intersectPlane(r),o=n.intersectPlane(r),s=a.dist(o)/e.viewGL.rootNode.scale.x;this._groundMesh.scale.set(s,s,1)}},dispose:function(e,t){this._zrLayer&&this._zrLayer.dispose(),t.getZr().painter.delLayer(-1e3)}});var Wr=Ue.mat4,Ra=512,hh=.6435011087932844,Mt=Math.PI,En=1/10;function fh(){this.width=0,this.height=0,this.altitudeScale=1,this.boxHeight="auto",this.altitudeExtent,this.bearing=0,this.pitch=0,this.center=[0,0],this._origin,this.zoom=0,this._initialZoom,this.maxPitch=60,this.zoomOffset=0}fh.prototype={constructor:fh,dimensions:["lng","lat","alt"],containPoint:function(){},setCameraOption:function(e){this.bearing=e.bearing,this.pitch=e.pitch,this.center=e.center,this.zoom=e.zoom,this._origin||(this._origin=this.projectOnTileWithScale(this.center,Ra)),this._initialZoom==null&&(this._initialZoom=this.zoom),this.updateTransform()},updateTransform:function(){if(this.height){var e=.5/Math.tan(hh/2)*this.height*En,t=Math.max(Math.min(this.pitch,this.maxPitch),0)/180*Math.PI,r=hh/2,i=Math.PI/2+t,n=Math.sin(r)*e/Math.sin(Math.PI-i-r),a=Math.cos(Math.PI/2-t)*n+e,o=a*1.1;this.pitch>50&&(o=1e3);var s=[];Wr.perspective(s,hh,this.width/this.height,1,o),this.viewGL.camera.projectionMatrix.setArray(s),this.viewGL.camera.decomposeProjectionMatrix();var s=Wr.identity([]),l=this.dataToPoint(this.center);Wr.scale(s,s,[1,-1,1]),Wr.translate(s,s,[0,0,-e]),Wr.rotateX(s,s,t),Wr.rotateZ(s,s,-this.bearing/180*Math.PI),Wr.translate(s,s,[-l[0]*this.getScale()*En,-l[1]*this.getScale()*En,0]),this.viewGL.camera.viewMatrix.array=s;var u=[];Wr.invert(u,s),this.viewGL.camera.worldTransform.array=u,this.viewGL.camera.decomposeWorldTransform();var h=Ra*this.getScale(),f;if(this.altitudeExtent&&!isNaN(this.boxHeight)){var c=this.altitudeExtent[1]-this.altitudeExtent[0];f=this.boxHeight/c*this.getScale()/Math.pow(2,this._initialZoom-this.zoomOffset)}else f=h/(2*Math.PI*6378e3*Math.abs(Math.cos(this.center[1]*(Math.PI/180))))*this.altitudeScale*En;this.viewGL.rootNode.scale.set(this.getScale()*En,this.getScale()*En,f)}},getScale:function(){return Math.pow(2,this.zoom-this.zoomOffset)},projectOnTile:function(e,t){return this.projectOnTileWithScale(e,this.getScale()*Ra,t)},projectOnTileWithScale:function(e,t,r){var i=e[0],n=e[1],a=i*Mt/180,o=n*Mt/180,s=t*(a+Mt)/(2*Mt),l=t*(Mt-Math.log(Math.tan(Mt/4+o*.5)))/(2*Mt);return r=r||[],r[0]=s,r[1]=l,r},unprojectFromTile:function(e,t){return this.unprojectOnTileWithScale(e,this.getScale()*Ra,t)},unprojectOnTileWithScale:function(e,t,r){var i=e[0],n=e[1],a=i/t*(2*Mt)-Mt,o=2*(Math.atan(Math.exp(Mt-n/t*(2*Mt)))-Mt/4);return r=r||[],r[0]=a*180/Mt,r[1]=o*180/Mt,r},dataToPoint:function(e,t){return t=this.projectOnTileWithScale(e,Ra,t),t[0]-=this._origin[0],t[1]-=this._origin[1],t[2]=isNaN(e[2])?0:e[2],isNaN(e[2])||(t[2]=e[2],this.altitudeExtent&&(t[2]-=this.altitudeExtent[0])),t}};let Cs=fh;function Na(){Cs.apply(this,arguments)}Na.prototype=new Cs,Na.prototype.constructor=Na,Na.prototype.type="mapbox3D";let J2=Na;function Tp(e,t,r){function i(a,o){var s=o.getWidth(),l=o.getHeight(),u=o.getDevicePixelRatio();this.viewGL.setViewport(0,0,s,l,u),this.width=s,this.height=l,this.altitudeScale=a.get("altitudeScale"),this.boxHeight=a.get("boxHeight")}function n(a,o){if(this.model.get("boxHeight")!=="auto"){var s=[1/0,-1/0];a.eachSeries(function(l){if(l.coordinateSystem===this){var u=l.getData(),h=l.coordDimToDataDim("alt")[0];if(h){var f=u.getDataExtent(h,!0);s[0]=Math.min(s[0],f[0]),s[1]=Math.max(s[1],f[1])}}},this),s&&isFinite(s[1]-s[0])&&(this.altitudeExtent=s)}}return{dimensions:t.prototype.dimensions,create:function(a,o){var s=[];return a.eachComponent(e,function(l){var u=l.__viewGL;u||(u=l.__viewGL=new Vr,u.setRootNode(new S.Node));var h=new t;h.viewGL=l.__viewGL,h.resize=i,h.resize(l,o),s.push(h),l.coordinateSystem=h,h.model=l,h.update=n}),a.eachSeries(function(l){if(l.get("coordinateSystem")===e){var u=l.getReferringComponents(e).models[0];if(u||(u=a.getComponent(e)),!u)throw new Error(e+' "'+te.firstNotNull(l.get(e+"Index"),l.get(e+"Id"),0)+'" not found');l.coordinateSystem=u.coordinateSystem}}),r&&r(s,a,o),s}}}var $2=Tp("mapbox3D",J2,function(e){e.forEach(function(t){t.setCameraOption(t.model.getMapboxCameraOption())})});let ew=$2;function tw(e){e.registerComponentModel(Y2),e.registerComponentView(Q2),e.registerCoordinateSystem("mapbox3D",ew),e.registerAction({type:"mapbox3DChangeCamera",event:"mapbox3dcamerachanged",update:"mapbox3D:updateCamera"},function(t,r){r.eachComponent({mainType:"mapbox3D",query:t},function(i){i.setMapboxCameraOption(t)})})}(0,A.use)(tw);var wp=["zoom","center","pitch","bearing"],ch=A.ComponentModel.extend({type:"maptalks3D",layoutMode:"box",coordinateSystem:null,defaultOption:{zlevel:-10,urlTemplate:"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",attribution:'&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',center:[0,0],zoom:0,pitch:0,bearing:0,light:{main:{alpha:20,beta:30}},altitudeScale:1,boxHeight:"auto"},getMaptalksCameraOption:function(){var e=this;return wp.reduce(function(t,r){return t[r]=e.get(r),t},{})},setMaptalksCameraOption:function(e){e!=null&&wp.forEach(function(t){e[t]!=null&&(this.option[t]=e[t])},this)},getMaptalks:function(){return this._maptalks},setMaptalks:function(e){this._maptalks=e}});A.util.merge(ch.prototype,en),A.util.merge(ch.prototype,tn);let rw=ch;function Xr(e,t,r,i){if(this.id=e,this.zr=t,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute;left:0;right:0;top:0;bottom:0;",!maptalks)throw new Error("Maptalks library must be included. See https://maptalks.org");this._maptalks=new maptalks.Map(this.dom,{center:r,zoom:i,doubleClickZoom:!1,fog:!1}),this._initEvents()}Xr.prototype.setUnpainted=function(){},Xr.prototype.resize=function(){this._maptalks.checkSize()},Xr.prototype.getMaptalks=function(){return this._maptalks},Xr.prototype.clear=function(){},Xr.prototype.refresh=function(){this._maptalks.checkSize()};var Sp=["mousedown","mouseup","click","dblclick","mousemove","mousewheel","DOMMouseScroll","touchstart","touchend","touchmove","touchcancel"];Xr.prototype._initEvents=function(){var e=this.dom;this._handlers=this._handlers||{contextmenu:function(t){return t.preventDefault(),!1}},Sp.forEach(function(t){this._handlers[t]=function(r){var i={};for(var n in r)i[n]=r[n];i.bubbles=!1;var a=new r.constructor(r.type,i);t==="mousewheel"||t==="DOMMouseScroll"?e.dispatchEvent(a):e.firstElementChild.dispatchEvent(a)},this.zr.dom.addEventListener(t,this._handlers[t])},this),this.zr.dom.addEventListener("contextmenu",this._handlers.contextmenu)},Xr.prototype.dispose=function(){Sp.forEach(function(e){this.zr.dom.removeEventListener(e,this._handlers[e])},this),this._maptalks.remove()};let iw=Xr;S.Shader.import(xp);let nw=A.ComponentView.extend({type:"maptalks3D",__ecgl__:!0,init:function(e,t){this._groundMesh=new S.Mesh({geometry:new S.PlaneGeometry,material:new S.Material({shader:new S.Shader({vertex:S.Shader.source("ecgl.displayShadow.vertex"),fragment:S.Shader.source("ecgl.displayShadow.fragment")}),depthMask:!1}),renderOrder:-100,culling:!1,castShadow:!1,$ignorePicking:!0,renderNormal:!0})},_initMaptalksLayer:function(e,t){var r=t.getZr();this._zrLayer=new iw("maptalks3D",r,e.get("center"),e.get("zoom")),r.painter.insertLayer(-1e3,this._zrLayer),this._lightRoot=new S.Node,this._sceneHelper=new mn(this._lightRoot),this._sceneHelper.initLight(this._lightRoot);var i=this._zrLayer.getMaptalks(),n=this._dispatchInteractAction.bind(this,t,i);["zoomend","zooming","zoomstart","dragrotating","pitch","pitchend","movestart","moving","moveend","resize","touchstart","touchmove","touchend","animating"].forEach(function(a){i.on(a,n)})},render:function(e,t,r){this._zrLayer||this._initMaptalksLayer(e,r);var i=this._zrLayer.getMaptalks(),n=e.get("urlTemplate"),a=i.getBaseLayer();n!==this._oldUrlTemplate&&(a?a.setOptions({urlTemplate:n,attribution:e.get("attribution")}):(a=new maptalks.TileLayer("maptalks-echarts-gl-baselayer",{urlTemplate:n,subdomains:["a","b","c"],attribution:e.get("attribution")}),i.setBaseLayer(a))),this._oldUrlTemplate=n,i.setCenter(e.get("center")),i.setZoom(e.get("zoom"),{animation:!1}),i.setPitch(e.get("pitch")),i.setBearing(e.get("bearing")),e.setMaptalks(i);var o=e.coordinateSystem;o.viewGL.scene.add(this._lightRoot),o.viewGL.add(this._groundMesh),this._updateGroundMesh(),this._sceneHelper.setScene(o.viewGL.scene),this._sceneHelper.updateLight(e),o.viewGL.setPostEffect(e.getModel("postEffect"),r),o.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling")),this._maptalks3DModel=e},afterRender:function(e,t,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r),e.coordinateSystem.viewGL.scene.traverse(function(a){a.material&&(a.material.define("fragment","NORMAL_UP_AXIS",2),a.material.define("fragment","NORMAL_FRONT_AXIS",1))})},updateCamera:function(e,t,r,i){e.coordinateSystem.setCameraOption(i),this._updateGroundMesh(),r.getZr().refresh()},_dispatchInteractAction:function(e,t,r){e.dispatchAction({type:"maptalks3DChangeCamera",pitch:t.getPitch(),zoom:ow(t.getResolution())+1,center:t.getCenter().toArray(),bearing:t.getBearing(),maptalks3DId:this._maptalks3DModel&&this._maptalks3DModel.id})},_updateGroundMesh:function(){if(this._maptalks3DModel){var e=this._maptalks3DModel.coordinateSystem,t=e.dataToPoint(e.center);this._groundMesh.position.set(t[0],t[1],-.001);var r=new S.Plane(new S.Vector3(0,0,1),0),i=e.viewGL.camera.castRay(new S.Vector2(-1,-1)),n=e.viewGL.camera.castRay(new S.Vector2(1,1)),a=i.intersectPlane(r),o=n.intersectPlane(r),s=a.dist(o)/e.viewGL.rootNode.scale.x;this._groundMesh.scale.set(s,s,1)}},dispose:function(e,t){this._zrLayer&&this._zrLayer.dispose(),t.getZr().painter.delLayer(-1e3)}}),aw=2*6378137*Math.PI/(256*Math.pow(2,20));function ow(e){return 19-Math.log(e/aw)/Math.LN2}function Ia(){Cs.apply(this,arguments),this.maxPitch=85,this.zoomOffset=1}Ia.prototype=new Cs,Ia.prototype.constructor=Ia,Ia.prototype.type="maptalks3D";var sw=Tp("maptalks3D",Ia,function(e){e.forEach(function(t){t.setCameraOption(t.model.getMaptalksCameraOption())})});let lw=sw;function uw(e){e.registerComponentModel(rw),e.registerComponentView(nw),e.registerCoordinateSystem("maptalks3D",lw),e.registerAction({type:"maptalks3DChangeCamera",event:"maptalks3dcamerachanged",update:"maptalks3D:updateCamera"},function(t,r){r.eachComponent({mainType:"maptalks3D",query:t},function(i){i.setMaptalksCameraOption(t)})})}(0,A.use)(uw);var hw=Ue.vec3,fw=A.helper.dataStack.isDimensionStacked;function cw(e){var t=e[0],r=e[1];return!(t>0&&r>0||t<0&&r<0)}function dw(e,t){var r=e.getData(),i=e.get("barSize");if(i==null){var n=t.size,a,o,s=t.getAxis("x"),l=t.getAxis("y");s.type==="category"?a=s.getBandWidth()*.7:a=Math.round(n[0]/Math.sqrt(r.count()))*.6,l.type==="category"?o=l.getBandWidth()*.7:o=Math.round(n[1]/Math.sqrt(r.count()))*.6,i=[a,o]}else A.util.isArray(i)||(i=[i,i]);var u=t.getAxis("z").scale.getExtent(),h=cw(u),f=["x","y","z"].map(function(v){return e.coordDimToDataDim(v)[0]}),c=fw(r,f[2]),d=c?r.getCalculationInfo("stackResultDimension"):f[2];r.each(f,function(v,p,_,g){var m=r.get(d,g),y=c?m-_:h?0:u[0],x=t.dataToPoint([v,p,y]),w=t.dataToPoint([v,p,m]),T=hw.dist(x,w),E=[0,w[1]<x[1]?-1:1,0];Math.abs(T)===0&&(T=.1);var b=[i[0],T,i[1]];r.setItemLayout(g,[x,E,b])}),r.setLayout("orient",[1,0,0])}let vw=dw;function dh(e,t,r){for(var i=e.getDataExtent(t),n=e.getDataExtent(r),a=i[1]-i[0]||i[0],o=n[1]-n[0]||n[0],s=50,l=new Uint8Array(s*s),u=0;u<e.count();u++){var h=e.get(t,u),f=e.get(r,u),c=Math.floor((h-i[0])/a*(s-1)),d=Math.floor((f-n[0])/o*(s-1)),v=d*s+c;l[v]=l[v]||1}for(var p=0,u=0;u<l.length;u++)l[u]&&p++;return p/l.length}var bp=Ue.vec3,pw=A.helper.dataStack.isDimensionStacked;function _w(e,t){var r=e.getData(),i=e.get("minHeight")||0,n=e.get("barSize"),a=["lng","lat","alt"].map(function(u){return e.coordDimToDataDim(u)[0]});if(n==null){var o=t.radius*Math.PI,s=dh(r,a[0],a[1]);n=[o/Math.sqrt(r.count()/s),o/Math.sqrt(r.count()/s)]}else A.util.isArray(n)||(n=[n,n]);var l=vh(r,a);r.each(a,function(u,h,f,c){var d=r.get(l.dimension,c),v=l.isStacked?d-f:t.altitudeAxis.scale.getExtent()[0],p=Math.max(t.altitudeAxis.dataToCoord(f),i),_=t.dataToPoint([u,h,v]),g=t.dataToPoint([u,h,d]),m=bp.sub([],g,_);bp.normalize(m,m);var y=[n[0],p,n[1]];r.setItemLayout(c,[_,m,y])}),r.setLayout("orient",z.UP.array)}function gw(e,t){var r=e.getData(),i=e.get("barSize"),n=e.get("minHeight")||0,a=["lng","lat","alt"].map(function(h){return e.coordDimToDataDim(h)[0]});if(i==null){var o=Math.min(t.size[0],t.size[2]),s=dh(r,a[0],a[1]);i=[o/Math.sqrt(r.count()/s),o/Math.sqrt(r.count()/s)]}else A.util.isArray(i)||(i=[i,i]);var l=[0,1,0],u=vh(r,a);r.each(a,function(h,f,c,d){var v=r.get(u.dimension,d),p=u.isStacked?v-c:t.altitudeAxis.scale.getExtent()[0],_=Math.max(t.altitudeAxis.dataToCoord(c),n),g=t.dataToPoint([h,f,p]),m=[i[0],_,i[1]];r.setItemLayout(d,[g,l,m])}),r.setLayout("orient",[1,0,0])}function mw(e,t){var r=e.getData(),i=e.coordDimToDataDim("lng")[0],n=e.coordDimToDataDim("lat")[0],a=e.coordDimToDataDim("alt")[0],o=e.get("barSize"),s=e.get("minHeight")||0;if(o==null){var l=r.getDataExtent(i),u=r.getDataExtent(n),h=t.dataToPoint([l[0],u[0]]),f=t.dataToPoint([l[1],u[1]]),c=Math.min(Math.abs(h[0]-f[0]),Math.abs(h[1]-f[1]))||1,d=dh(r,i,n);o=[c/Math.sqrt(r.count()/d),c/Math.sqrt(r.count()/d)]}else A.util.isArray(o)||(o=[o,o]),o[0]/=t.getScale()/16,o[1]/=t.getScale()/16;var v=[0,0,1],p=[i,n,a],_=vh(r,p);r.each(p,function(g,m,y,x){var w=r.get(_.dimension,x),T=_.isStacked?w-y:0,E=t.dataToPoint([g,m,T]),b=t.dataToPoint([g,m,w]),D=Math.max(b[2]-E[2],s),L=[o[0],D,o[1]];r.setItemLayout(x,[E,v,L])}),r.setLayout("orient",[1,0,0])}function vh(e,t){var r=pw(e,t[2]);return{dimension:r?e.getCalculationInfo("stackResultDimension"):t[2],isStacked:r}}function yw(e){e.registerLayout(function(t,r){t.eachSeriesByType("bar3D",function(i){var n=i.coordinateSystem,a=n&&n.type;if(a==="globe")_w(i,n);else if(a==="cartesian3D")vw(i,n);else if(a==="geo3D")gw(i,n);else if(a==="mapbox3D"||a==="maptalks3D")mw(i,n);else throw n?new Error("bar3D doesn't support coordinate system "+n.type):new Error("bar3D doesn't have coordinate system.")})})}var ph={};ph.getFormattedLabel=function(e,t,r,i,n){r=r||"normal";var a=e.getData(i),o=a.getItemModel(t),s=e.getDataParams(t,i);n!=null&&s.value instanceof Array&&(s.value=s.value[n]);var l=o.get(r==="normal"?["label","formatter"]:["emphasis","label","formatter"]);l==null&&(l=o.get(["label","formatter"]));var u;return typeof l=="function"?(s.status=r,u=l(s)):typeof l=="string"&&(u=A.format.formatTpl(l,s)),u},ph.normalizeToArray=function(e){return e instanceof Array?e:e==null?[]:[e]};let An=ph;function xw(e,t){var r=[];return A.util.each(e.dimensions,function(i){var n=e.getDimensionInfo(i),a=n.otherDims,o=a[t];o!=null&&o!==!1&&(r[o]=n.name)}),r}function Oa(e,t,r){function i(f){var c=!0,d=[],v=xw(n,"tooltip");v.length?A.util.each(v,function(_){p(n.get(_,t),_)}):A.util.each(f,p);function p(_,g){var m=n.getDimensionInfo(g);if(!(!m||m.otherDims.tooltip===!1)){var y=m.type,x=(c?"- "+(m.tooltipName||m.name)+": ":"")+(y==="ordinal"?_+"":y==="time"?r?"":A.format.formatTime("yyyy/MM/dd hh:mm:ss",_):A.format.addCommas(_));x&&d.push(A.format.encodeHTML(x))}}return(c?"<br/>":"")+d.join(c?"<br/>":", ")}var n=e.getData(),a=e.getRawValue(t),o=A.util.isArray(a)?i(a):A.format.encodeHTML(A.format.addCommas(a)),s=n.getName(t),l=$e(n,t);A.util.isObject(l)&&l.colorStops&&(l=(l.colorStops[0]||{}).color),l=l||"transparent";var u=A.format.getTooltipMarker(l),h=e.name;return h==="\0-"&&(h=""),h=h?A.format.encodeHTML(h)+(r?": ":"<br/>"):"",r?u+h+o:h+u+(s?A.format.encodeHTML(s)+": "+o:o)}function Ls(e,t,r){r=r||e.getSource();var i=t||A.getCoordinateSystemDimensions(e.get("coordinateSystem"))||["x","y","z"],n=A.helper.createDimensions(r,{dimensionsDefine:r.dimensionsDefine||e.get("dimensions"),encodeDefine:r.encodeDefine||e.get("encode"),coordDimensions:i.map(function(s){var l=e.getReferringComponents(s+"Axis3D").models[0];return{type:l&&l.get("type")==="category"?"ordinal":"float",name:s}})});e.get("coordinateSystem")==="cartesian3D"&&n.forEach(function(s){if(i.indexOf(s.coordDim)>=0){var l=e.getReferringComponents(s.coordDim+"Axis3D").models[0];l&&l.get("type")==="category"&&(s.ordinalMeta=l.getOrdinalMeta())}});var a=A.helper.dataStack.enableDataStack(e,n,{byIndex:!0,stackedCoordDimension:"z"}),o=new A.List(n,e);return o.setCalculationInfo(a),o.initData(r),o}var Ep=A.SeriesModel.extend({type:"series.bar3D",dependencies:["globe"],visualStyleAccessPathvisu:"itemStyle",getInitialData:function(e,t){return Ls(this)},getFormattedLabel:function(e,t,r,i){var n=An.getFormattedLabel(this,e,t,r,i);return n==null&&(n=this.getData().get("z",e)),n},formatTooltip:function(e){return Oa(this,e)},defaultOption:{coordinateSystem:"cartesian3D",globeIndex:0,grid3DIndex:0,zlevel:-10,bevelSize:0,bevelSmoothness:2,onGridPlane:"xy",shading:"color",minHeight:0,itemStyle:{opacity:1},label:{show:!1,distance:2,textStyle:{fontSize:14,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:3}},emphasis:{label:{show:!0}},animationDurationUpdate:500}});A.util.merge(Ep.prototype,Tn);let Tw=Ep;var Ce=Ue.vec3,ww=Ue.mat3,_h=ce.extend(function(){return{attributes:{position:new ce.Attribute("position","float",3,"POSITION"),normal:new ce.Attribute("normal","float",3,"NORMAL"),color:new ce.Attribute("color","float",4,"COLOR"),prevPosition:new ce.Attribute("prevPosition","float",3),prevNormal:new ce.Attribute("prevNormal","float",3)},dynamic:!0,enableNormal:!1,bevelSize:1,bevelSegments:0,_dataIndices:null,_vertexOffset:0,_triangleOffset:0}},{resetOffset:function(){this._vertexOffset=0,this._triangleOffset=0},setBarCount:function(e){var t=this.enableNormal,r=this.getBarVertexCount()*e,i=this.getBarTriangleCount()*e;this.vertexCount!==r&&(this.attributes.position.init(r),t?this.attributes.normal.init(r):this.attributes.normal.value=null,this.attributes.color.init(r)),this.triangleCount!==i&&(this.indices=r>65535?new Uint32Array(i*3):new Uint16Array(i*3),this._dataIndices=new Uint32Array(r))},getBarVertexCount:function(){var e=this.bevelSize>0?this.bevelSegments:0;return e>0?this._getBevelBarVertexCount(e):this.enableNormal?24:8},getBarTriangleCount:function(){var e=this.bevelSize>0?this.bevelSegments:0;return e>0?this._getBevelBarTriangleCount(e):12},_getBevelBarVertexCount:function(e){return(e+1)*4*(e+1)*2},_getBevelBarTriangleCount:function(e){var t=e*4+3,r=e*2+1;return(t+1)*r*2+4},setColor:function(e,t){for(var r=this.getBarVertexCount(),i=r*e,n=r*(e+1),a=i;a<n;a++)this.attributes.color.set(a,t);this.dirtyAttribute("color")},getDataIndexOfVertex:function(e){return this._dataIndices?this._dataIndices[e]:null},addBar:(function(){for(var e=Ce.create,t=Ce.scaleAndAdd,r=e(),i=e(),n=e(),a=e(),o=e(),s=e(),l=e(),u=[],h=[],f=0;f<8;f++)u[f]=e();for(var c=[[0,1,5,4],[2,3,7,6],[4,5,6,7],[3,2,1,0],[0,4,7,3],[1,2,6,5]],d=[0,1,2,0,2,3],v=[],f=0;f<c.length;f++)for(var p=c[f],_=0;_<2;_++){for(var g=[],m=0;m<3;m++)g.push(p[d[_*3+m]]);v.push(g)}return function(y,x,w,T,E,b){var D=this._vertexOffset;if(this.bevelSize>0&&this.bevelSegments>0)this._addBevelBar(y,x,w,T,this.bevelSize,this.bevelSegments,E);else{Ce.copy(n,x),Ce.normalize(n,n),Ce.cross(a,w,n),Ce.normalize(a,a),Ce.cross(i,n,a),Ce.normalize(a,a),Ce.negate(o,i),Ce.negate(s,n),Ce.negate(l,a),t(u[0],y,i,T[0]/2),t(u[0],u[0],a,T[2]/2),t(u[1],y,i,T[0]/2),t(u[1],u[1],l,T[2]/2),t(u[2],y,o,T[0]/2),t(u[2],u[2],l,T[2]/2),t(u[3],y,o,T[0]/2),t(u[3],u[3],a,T[2]/2),t(r,y,n,T[1]),t(u[4],r,i,T[0]/2),t(u[4],u[4],a,T[2]/2),t(u[5],r,i,T[0]/2),t(u[5],u[5],l,T[2]/2),t(u[6],r,o,T[0]/2),t(u[6],u[6],l,T[2]/2),t(u[7],r,o,T[0]/2),t(u[7],u[7],a,T[2]/2);var L=this.attributes;if(this.enableNormal){h[0]=i,h[1]=o,h[2]=n,h[3]=s,h[4]=a,h[5]=l;for(var M=this._vertexOffset,R=0;R<c.length;R++){for(var I=this._triangleOffset*3,P=0;P<6;P++)this.indices[I++]=M+d[P];M+=4,this._triangleOffset+=2}for(var R=0;R<c.length;R++)for(var N=h[R],P=0;P<4;P++){var G=c[R][P];L.position.set(this._vertexOffset,u[G]),L.normal.set(this._vertexOffset,N),L.color.set(this._vertexOffset++,E)}}else{for(var R=0;R<v.length;R++){for(var I=this._triangleOffset*3,P=0;P<3;P++)this.indices[I+P]=v[R][P]+this._vertexOffset;this._triangleOffset++}for(var R=0;R<u.length;R++)L.position.set(this._vertexOffset,u[R]),L.color.set(this._vertexOffset++,E)}}for(var H=this._vertexOffset,R=D;R<H;R++)this._dataIndices[R]=b}})(),_addBevelBar:(function(){var e=Ce.create(),t=Ce.create(),r=Ce.create(),i=ww.create(),n=[],a=[1,-1,-1,1],o=[1,1,-1,-1],s=[2,0];return function(l,u,h,f,c,d,v){Ce.copy(t,u),Ce.normalize(t,t),Ce.cross(r,h,t),Ce.normalize(r,r),Ce.cross(e,t,r),Ce.normalize(r,r),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=t[0],i[4]=t[1],i[5]=t[2],i[6]=r[0],i[7]=r[1],i[8]=r[2],c=Math.min(f[0],f[2])/2*c;for(var p=0;p<3;p++)n[p]=Math.max(f[p]-c*2,0);for(var _=(f[0]-n[0])/2,g=(f[1]-n[1])/2,m=(f[2]-n[2])/2,y=[],x=[],w=this._vertexOffset,T=[],p=0;p<2;p++){T[p]=T[p]=[];for(var E=0;E<=d;E++)for(var b=0;b<4;b++){(E===0&&p===0||p===1&&E===d)&&T[p].push(w);for(var D=0;D<=d;D++){var L=D/d*Math.PI/2+Math.PI/2*b,M=E/d*Math.PI/2+Math.PI/2*p;x[0]=_*Math.cos(L)*Math.sin(M),x[1]=g*Math.cos(M),x[2]=m*Math.sin(L)*Math.sin(M),y[0]=x[0]+a[b]*n[0]/2,y[1]=x[1]+g+s[p]*n[1]/2,y[2]=x[2]+o[b]*n[2]/2,Math.abs(_-g)<1e-6&&Math.abs(g-m)<1e-6||(x[0]/=_*_,x[1]/=g*g,x[2]/=m*m),Ce.normalize(x,x),Ce.transformMat3(y,y,i),Ce.transformMat3(x,x,i),Ce.add(y,y,l),this.attributes.position.set(w,y),this.enableNormal&&this.attributes.normal.set(w,x),this.attributes.color.set(w,v),w++}}}for(var R=d*4+3,I=d*2+1,P=R+1,b=0;b<I;b++)for(var p=0;p<=R;p++){var N=b*P+p+this._vertexOffset,G=b*P+(p+1)%P+this._vertexOffset,H=(b+1)*P+(p+1)%P+this._vertexOffset,F=(b+1)*P+p+this._vertexOffset;this.setTriangleIndices(this._triangleOffset++,[H,N,G]),this.setTriangleIndices(this._triangleOffset++,[H,F,N])}this.setTriangleIndices(this._triangleOffset++,[T[0][0],T[0][2],T[0][1]]),this.setTriangleIndices(this._triangleOffset++,[T[0][0],T[0][3],T[0][2]]),this.setTriangleIndices(this._triangleOffset++,[T[1][0],T[1][1],T[1][2]]),this.setTriangleIndices(this._triangleOffset++,[T[1][0],T[1][2],T[1][3]]),this._vertexOffset=w}})()});A.util.defaults(_h.prototype,Ta),A.util.defaults(_h.prototype,nh);let Sw=_h;var bw=Ue.vec3;let Ew=A.ChartView.extend({type:"bar3D",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this._api=t,this._labelsBuilder=new ah(256,256,t);var r=this;this._labelsBuilder.getLabelPosition=function(i,n,a){if(r._data){var o=r._data.getItemLayout(i),s=o[0],l=o[1],u=o[2][1];return bw.scaleAndAdd([],s,l,a+u)}else return[0,0]},this._labelsBuilder.getMesh().renderOrder=100},render:function(e,t,r){var i=this._prevBarMesh;this._prevBarMesh=this._barMesh,this._barMesh=i,this._barMesh||(this._barMesh=new S.Mesh({geometry:new Sw,shadowDepthMaterial:new S.Material({shader:new S.Shader(S.Shader.source("ecgl.sm.depth.vertex"),S.Shader.source("ecgl.sm.depth.fragment"))}),culling:e.coordinateSystem.type==="cartesian3D",renderOrder:10,renderNormal:!0})),this.groupGL.remove(this._prevBarMesh),this.groupGL.add(this._barMesh),this.groupGL.add(this._labelsBuilder.getMesh());var n=e.coordinateSystem;if(this._doRender(e,r),n&&n.viewGL){n.viewGL.add(this.groupGL);var a=n.viewGL.isLinearSpace()?"define":"undefine";this._barMesh.material[a]("fragment","SRGB_DECODE")}this._data=e.getData(),this._labelsBuilder.updateData(this._data),this._labelsBuilder.updateLabels(),this._updateAnimation(e)},_updateAnimation:function(e){S.updateVertexAnimation([["prevPosition","position"],["prevNormal","normal"]],this._prevBarMesh,this._barMesh,e)},_doRender:function(e,t){var r=e.getData(),i=e.get("shading"),n=i!=="color",a=this,o=this._barMesh,s="ecgl."+i;(!o.material||o.material.shader.name!==s)&&(o.material=S.createMaterial(s,["VERTEX_COLOR"])),S.setMaterialFromModel(i,o.material,e,t),o.geometry.enableNormal=n,o.geometry.resetOffset();var l=e.get("bevelSize"),u=e.get("bevelSmoothness");o.geometry.bevelSegments=u,o.geometry.bevelSize=l;var h=[],f=new Float32Array(r.count()*4),c=0,_=0,d=!1;r.each(function(m){if(r.hasValue(m)){var y=$e(r,m),x=et(r,m);x==null&&(x=1),S.parseColor(y,h),h[3]*=x,f[c++]=h[0],f[c++]=h[1],f[c++]=h[2],f[c++]=h[3],h[3]>0&&(_++,h[3]<.99&&(d=!0))}}),o.geometry.setBarCount(_);var v=r.getLayout("orient"),p=this._barIndexOfData=new Int32Array(r.count()),_=0;r.each(function(m){if(!r.hasValue(m)){p[m]=-1;return}var y=r.getItemLayout(m),x=y[0],w=y[1],T=y[2],E=m*4;h[0]=f[E++],h[1]=f[E++],h[2]=f[E++],h[3]=f[E++],h[3]>0&&(a._barMesh.geometry.addBar(x,w,v,T,h,m),p[m]=_++)}),o.geometry.dirty(),o.geometry.updateBoundingBox();var g=o.material;g.transparent=d,g.depthMask=!d,o.geometry.sortTriangles=d,this._initHandler(e,t)},_initHandler:function(e,t){var r=e.getData(),i=this._barMesh,n=e.coordinateSystem.type==="cartesian3D";i.seriesIndex=e.seriesIndex;var a=-1;i.off("mousemove"),i.off("mouseout"),i.on("mousemove",function(o){var s=i.geometry.getDataIndexOfVertex(o.triangle[0]);s!==a&&(this._downplay(a),this._highlight(s),this._labelsBuilder.updateLabels([s]),n&&t.dispatchAction({type:"grid3DShowAxisPointer",value:[r.get("x",s),r.get("y",s),r.get("z",s,!0)]})),a=s,i.dataIndex=s},this),i.on("mouseout",function(o){this._downplay(a),this._labelsBuilder.updateLabels(),a=-1,i.dataIndex=-1,n&&t.dispatchAction({type:"grid3DHideAxisPointer"})},this)},_highlight:function(e){var t=this._data;if(t){var r=this._barIndexOfData[e];if(!(r<0)){var i=t.getItemModel(e),n=i.getModel("emphasis.itemStyle"),a=n.get("color"),o=n.get("opacity");if(a==null){var s=$e(t,e);a=A.color.lift(s,-.4)}o==null&&(o=et(t,e));var l=S.parseColor(a);l[3]*=o,this._barMesh.geometry.setColor(r,l),this._api.getZr().refresh()}}},_downplay:function(e){var t=this._data;if(t){var r=this._barIndexOfData[e];if(!(r<0)){var i=$e(t,e),n=et(t,e),a=S.parseColor(i);a[3]*=n,this._barMesh.geometry.setColor(r,a),this._api.getZr().refresh()}}},highlight:function(e,t,r,i){this._toggleStatus("highlight",e,t,r,i)},downplay:function(e,t,r,i){this._toggleStatus("downplay",e,t,r,i)},_toggleStatus:function(e,t,r,i,n){var a=t.getData(),o=te.queryDataIndex(a,n),s=this;o!=null?A.util.each(An.normalizeToArray(o),function(l){e==="highlight"?this._highlight(l):this._downplay(l)},this):a.each(function(l){e==="highlight"?s._highlight(l):s._downplay(l)})},remove:function(){this.groupGL.removeAll()},dispose:function(){this._labelsBuilder.dispose(),this.groupGL.removeAll()}});function Aw(e){e.registerChartView(Ew),e.registerSeriesModel(Tw),yw(e),e.registerProcessor(function(t,r){t.eachSeriesByType("bar3d",function(i){var n=i.getData();n.filterSelf(function(a){return n.hasValue(a)})})})}(0,A.use)(Aw);var Mw=A.SeriesModel.extend({type:"series.line3D",dependencies:["grid3D"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",getInitialData:function(e,t){return Ls(this)},formatTooltip:function(e){return Oa(this,e)},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,grid3DIndex:0,lineStyle:{width:2},animationDurationUpdate:500}});let Dw=Mw;var Cw=Ue.vec3;S.Shader.import(ds);let Lw=A.ChartView.extend({type:"line3D",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this._api=t},render:function(e,t,r){var i=this._prevLine3DMesh;this._prevLine3DMesh=this._line3DMesh,this._line3DMesh=i,this._line3DMesh||(this._line3DMesh=new S.Mesh({geometry:new Si({useNativeLine:!1,sortTriangles:!0}),material:new S.Material({shader:S.createShader("ecgl.meshLines3D")}),renderOrder:10}),this._line3DMesh.geometry.pick=this._pick.bind(this)),this.groupGL.remove(this._prevLine3DMesh),this.groupGL.add(this._line3DMesh);var n=e.coordinateSystem;if(n&&n.viewGL){n.viewGL.add(this.groupGL);var a=n.viewGL.isLinearSpace()?"define":"undefine";this._line3DMesh.material[a]("fragment","SRGB_DECODE")}this._doRender(e,r),this._data=e.getData(),this._camera=n.viewGL.camera,this.updateCamera(),this._updateAnimation(e)},updateCamera:function(){this._updateNDCPosition()},_doRender:function(e,t){var r=e.getData(),i=this._line3DMesh;i.geometry.resetOffset();var n=r.getLayout("points"),a=[],o=new Float32Array(n.length/3*4),s=0,l=!1;r.each(function(f){var c=$e(r,f),d=et(r,f);d==null&&(d=1),S.parseColor(c,a),a[3]*=d,o[s++]=a[0],o[s++]=a[1],o[s++]=a[2],o[s++]=a[3],a[3]<.99&&(l=!0)}),i.geometry.setVertexCount(i.geometry.getPolylineVertexCount(n)),i.geometry.setTriangleCount(i.geometry.getPolylineTriangleCount(n)),i.geometry.addPolyline(n,o,te.firstNotNull(e.get("lineStyle.width"),1)),i.geometry.dirty(),i.geometry.updateBoundingBox();var u=i.material;u.transparent=l,u.depthMask=!l;var h=e.getModel("debug.wireframe");h.get("show")?(i.geometry.createAttribute("barycentric","float",3),i.geometry.generateBarycentric(),i.material.set("both","WIREFRAME_TRIANGLE"),i.material.set("wireframeLineColor",S.parseColor(h.get("lineStyle.color")||"rgba(0,0,0,0.5)")),i.material.set("wireframeLineWidth",te.firstNotNull(h.get("lineStyle.width"),1))):i.material.set("both","WIREFRAME_TRIANGLE"),this._points=n,this._initHandler(e,t)},_updateAnimation:function(e){S.updateVertexAnimation([["prevPosition","position"],["prevPositionPrev","positionPrev"],["prevPositionNext","positionNext"]],this._prevLine3DMesh,this._line3DMesh,e)},_initHandler:function(e,t){var r=e.getData(),i=e.coordinateSystem,n=this._line3DMesh,a=-1;n.seriesIndex=e.seriesIndex,n.off("mousemove"),n.off("mouseout"),n.on("mousemove",function(o){var s=i.pointToData(o.point.array),l;e.indicesOfNearest?l=e.indicesOfNearest("x","x",s[0])[0]:l=r.indicesOfNearest("x",s[0])[0],l!==a&&(t.dispatchAction({type:"grid3DShowAxisPointer",value:[r.get("x",l),r.get("y",l),r.get("z",l)]}),n.dataIndex=l),a=l},this),n.on("mouseout",function(o){a=-1,n.dataIndex=-1,t.dispatchAction({type:"grid3DHideAxisPointer"})},this)},_updateNDCPosition:function(){var e=new W,t=this._camera;W.multiply(e,t.projectionMatrix,t.viewMatrix);var r=this._positionNDC,i=this._points,n=i.length/3;(!r||r.length/2!==n)&&(r=this._positionNDC=new Float32Array(n*2));for(var a=[],o=0;o<n;o++){var s=o*3,l=o*2;a[0]=i[s],a[1]=i[s+1],a[2]=i[s+2],a[3]=1,Cw.transformMat4(a,a,e.array),r[l]=a[0]/a[3],r[l+1]=a[1]/a[3]}},_pick:function(e,t,r,i,n,a){var o=this._positionNDC,s=this._data.hostModel,l=s.get("lineStyle.width"),u=-1,h=r.viewport.width,f=r.viewport.height,c=h*.5,d=f*.5;e=(e+1)*c,t=(t+1)*d;for(var v=1;v<o.length/2;v++){var p=(o[(v-1)*2]+1)*c,_=(o[(v-1)*2+1]+1)*d,g=(o[v*2]+1)*c,m=(o[v*2+1]+1)*d;if(_i(p,_,g,m,l,e,t)){var y=(p-e)*(p-e)+(_-t)*(_-t),x=(g-e)*(g-e)+(m-t)*(m-t);u=y<x?v-1:v}}if(u>=0){var w=u*3,T=new z(this._points[w],this._points[w+1],this._points[w+2]);a.push({dataIndex:u,point:T,pointWorld:T.clone(),target:this._line3DMesh,distance:this._camera.getWorldPosition().dist(T)})}},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll()}});function Pw(e){e.registerChartView(Lw),e.registerSeriesModel(Dw),e.registerLayout(function(t,r){t.eachSeriesByType("line3D",function(i){var n=i.getData(),a=i.coordinateSystem;if(a){if(a.type!=="cartesian3D"){console.error("line3D needs cartesian3D coordinateSystem");return}var o=new Float32Array(n.count()*3),s=[],l=[],u=a.dimensions,h=u.map(function(f){return i.coordDimToDataDim(f)[0]});a&&n.each(h,function(f,c,d,v){s[0]=f,s[1]=c,s[2]=d,a.dataToPoint(s,l),o[v*3]=l[0],o[v*3+1]=l[1],o[v*3+2]=l[2]}),n.setLayout("points",o)}})})}(0,A.use)(Pw);let Rw=A.SeriesModel.extend({type:"series.scatter3D",dependencies:["globe","grid3D","geo3D"],visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,getInitialData:function(e,t){return Ls(this)},getFormattedLabel:function(e,t,r,i){var n=An.getFormattedLabel(this,e,t,r,i);if(n==null){var a=this.getData(),o=a.dimensions[a.dimensions.length-1];n=a.get(o,e)}return n},formatTooltip:function(e){return Oa(this,e)},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,progressive:1e5,progressiveThreshold:1e5,grid3DIndex:0,globeIndex:0,symbol:"circle",symbolSize:10,blendMode:"source-over",label:{show:!1,position:"right",distance:5,textStyle:{fontSize:14,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:3}},itemStyle:{opacity:.8},emphasis:{label:{show:!0}},animationDurationUpdate:500}});function gh(e,i,r){var i=i||document.createElement("canvas");i.width=e,i.height=e;var n=i.getContext("2d");return r&&r(n),i}function Nw(e,t,r,i){A.util.isArray(t)||(t=[t,t]);var n=mh.getMarginByStyle(r,i),a=t[0]+n.left+n.right,o=t[1]+n.top+n.bottom,s=A.helper.createSymbol(e,0,0,t[0],t[1]),l=Math.max(a,o);s.x=n.left,s.y=n.top,a>o?s.y+=(l-o)/2:s.x+=(l-a)/2;var u=s.getBoundingRect();return s.x-=u.x,s.y-=u.y,s.setStyle(r),s.update(),s.__size=l,s}function Iw(e,t,r){var i=t.width,n=t.height,a=e.canvas.width,o=e.canvas.height,s=i/a,l=n/o;function u(g){return g<128?1:-1}function h(g,m){var y=1/0;g=Math.floor(g*s),m=Math.floor(m*l);for(var x=m*i+g,w=t.data[x*4],T=u(w),E=Math.max(m-r,0);E<Math.min(m+r,n);E++)for(var b=Math.max(g-r,0);b<Math.min(g+r,i);b++){var x=E*i+b,D=t.data[x*4],L=u(D),M=b-g,R=E-m;if(T!==L){var I=M*M+R*R;I<y&&(y=I)}}return T*Math.sqrt(y)}for(var f=e.createImageData(a,o),c=0;c<o;c++)for(var d=0;d<a;d++){var v=h(d,c),p=v/r*.5+.5,_=(c*a+d)*4;f.data[_++]=(1-p)*255,f.data[_++]=(1-p)*255,f.data[_++]=(1-p)*255,f.data[_++]=255}return f}var mh={getMarginByStyle:function(e){var t=e.minMargin||0,r=0;e.stroke&&e.stroke!=="none"&&(r=e.lineWidth==null?1:e.lineWidth);var i=e.shadowBlur||0,n=e.shadowOffsetX||0,a=e.shadowOffsetY||0,o={};return o.left=Math.max(r/2,-n+i,t),o.right=Math.max(r/2,n+i,t),o.top=Math.max(r/2,-a+i,t),o.bottom=Math.max(r/2,a+i,t),o},createSymbolSprite:function(e,t,r,i){var n=Nw(e,t,r),a=mh.getMarginByStyle(r);return{image:gh(n.__size,i,function(o){A.innerDrawElementOnCanvas(o,n)}),margin:a}},createSDFFromCanvas:function(e,t,r,i){return gh(t,i,function(n){var a=e.getContext("2d"),o=a.getImageData(0,0,e.width,e.height);n.putImageData(Iw(n,o,r),0,0)})},createSimpleSprite:function(e,t){return gh(e,t,function(r){var i=e/2;r.beginPath(),r.arc(i,i,60,0,Math.PI*2,!1),r.closePath();var n=r.createRadialGradient(i,i,0,i,i,i);n.addColorStop(0,"rgba(255, 255, 255, 1)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),n.addColorStop(1,"rgba(255, 255, 255, 0)"),r.fillStyle=n,r.fill()})}};let Ap=mh;var Mp=Ue.vec3;let Ow={needsSortVertices:function(){return this.sortVertices},needsSortVerticesProgressively:function(){return this.needsSortVertices()&&this.vertexCount>=2e4},doSortVertices:function(e,t){var r=this.indices,i=Mp.create();if(!r){r=this.indices=this.vertexCount>65535?new Uint32Array(this.vertexCount):new Uint16Array(this.vertexCount);for(var n=0;n<r.length;n++)r[n]=n}if(t===0){var a=this.attributes.position,e=e.array,o=0;(!this._zList||this._zList.length!==this.vertexCount)&&(this._zList=new Float32Array(this.vertexCount));for(var s,n=0;n<this.vertexCount;n++){a.get(n,i);var l=Mp.sqrDist(i,e);isNaN(l)&&(l=1e7,o++),n===0?(s=l,l=0):l=l-s,this._zList[n]=l}this._noneCount=o}if(this.vertexCount<2e4)t===0&&this._simpleSort(this._noneCount/this.vertexCount>.05);else for(var n=0;n<3;n++)this._progressiveQuickSort(t*3+n);this.dirtyIndices()},_simpleSort:function(e){var t=this._zList,r=this.indices;function i(n,a){return t[a]-t[n]}e?Array.prototype.sort.call(r,i):As.sort(r,i,0,r.length-1)},_progressiveQuickSort:function(e){var t=this._zList,r=this.indices;this._quickSort=this._quickSort||new As,this._quickSort.step(r,function(i,n){return t[n]-t[i]},e)}},Bw=`@export ecgl.sdfSprite.vertex

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform float elapsedTime : 0;

attribute vec3 position : POSITION;

#ifdef VERTEX_SIZE
attribute float size;
#else
uniform float u_Size;
#endif

#ifdef VERTEX_COLOR
attribute vec4 a_FillColor: COLOR;
varying vec4 v_Color;
#endif

#ifdef VERTEX_ANIMATION
attribute vec3 prevPosition;
attribute float prevSize;
uniform float percent : 1.0;
#endif


#ifdef POSITIONTEXTURE_ENABLED
uniform sampler2D positionTexture;
#endif

varying float v_Size;

void main()
{

#ifdef POSITIONTEXTURE_ENABLED
 gl_Position = worldViewProjection * vec4(texture2D(positionTexture, position.xy).xy, -10.0, 1.0);
#else

 #ifdef VERTEX_ANIMATION
 vec3 pos = mix(prevPosition, position, percent);
 #else
 vec3 pos = position;
 #endif
 gl_Position = worldViewProjection * vec4(pos, 1.0);
#endif

#ifdef VERTEX_SIZE
#ifdef VERTEX_ANIMATION
 v_Size = mix(prevSize, size, percent);
#else
 v_Size = size;
#endif
#else
 v_Size = u_Size;
#endif

#ifdef VERTEX_COLOR
 v_Color = a_FillColor;
 #endif

 gl_PointSize = v_Size;
}

@end

@export ecgl.sdfSprite.fragment

uniform vec4 color: [1, 1, 1, 1];
uniform vec4 strokeColor: [1, 1, 1, 1];
uniform float smoothing: 0.07;

uniform float lineWidth: 0.0;

#ifdef VERTEX_COLOR
varying vec4 v_Color;
#endif

varying float v_Size;

uniform sampler2D sprite;

@import clay.util.srgb

void main()
{
 gl_FragColor = color;

 vec4 _strokeColor = strokeColor;

#ifdef VERTEX_COLOR
 gl_FragColor *= v_Color;
 #endif

#ifdef SPRITE_ENABLED
 float d = texture2D(sprite, gl_PointCoord).r;
 gl_FragColor.a *= smoothstep(0.5 - smoothing, 0.5 + smoothing, d);

 if (lineWidth > 0.0) {
 float sLineWidth = lineWidth / 2.0;

 float outlineMaxValue0 = 0.5 + sLineWidth;
 float outlineMaxValue1 = 0.5 + sLineWidth + smoothing;
 float outlineMinValue0 = 0.5 - sLineWidth - smoothing;
 float outlineMinValue1 = 0.5 - sLineWidth;

 if (d <= outlineMaxValue1 && d >= outlineMinValue0) {
 float a = _strokeColor.a;
 if (d <= outlineMinValue1) {
 a = a * smoothstep(outlineMinValue0, outlineMinValue1, d);
 }
 else {
 a = a * smoothstep(outlineMaxValue1, outlineMaxValue0, d);
 }
 gl_FragColor.rgb = mix(gl_FragColor.rgb * gl_FragColor.a, _strokeColor.rgb, a);
 gl_FragColor.a = gl_FragColor.a * (1.0 - a) + a;
 }
 }
#endif

#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(gl_FragColor);
#endif
}
@end`;var yh=Ue.vec4;S.Shader.import(Bw);var Fw=S.Mesh.extend(function(){var e=new S.Geometry({dynamic:!0,attributes:{color:new S.Geometry.Attribute("color","float",4,"COLOR"),position:new S.Geometry.Attribute("position","float",3,"POSITION"),size:new S.Geometry.Attribute("size","float",1),prevPosition:new S.Geometry.Attribute("prevPosition","float",3),prevSize:new S.Geometry.Attribute("prevSize","float",1)}});Object.assign(e,Ow);var t=new S.Material({shader:S.createShader("ecgl.sdfSprite"),transparent:!0,depthMask:!1});t.enableTexture("sprite"),t.define("both","VERTEX_COLOR"),t.define("both","VERTEX_SIZE");var r=new S.Texture2D({image:document.createElement("canvas"),flipY:!1});return t.set("sprite",r),e.pick=this._pick.bind(this),{geometry:e,material:t,mode:S.Mesh.POINTS,sizeScale:1}},{_pick:function(e,t,r,i,n,a){var o=this._positionNDC;if(o)for(var s=r.viewport,l=2/s.width,u=2/s.height,h=this.geometry.vertexCount-1;h>=0;h--){var f;this.geometry.indices?f=this.geometry.indices[h]:f=h;var c=o[f*2],d=o[f*2+1],v=this.geometry.attributes.size.get(f)/this.sizeScale,p=v/2;if(e>c-p*l&&e<c+p*l&&t>d-p*u&&t<d+p*u){var _=new S.Vector3,g=new S.Vector3;this.geometry.attributes.position.get(f,_.array),S.Vector3.transformMat4(g,_,this.worldTransform),a.push({vertexIndex:f,point:_,pointWorld:g,target:this,distance:g.distance(i.getWorldPosition())})}}},updateNDCPosition:function(e,t,r){var i=this._positionNDC,n=this.geometry;(!i||i.length/2!==n.vertexCount)&&(i=this._positionNDC=new Float32Array(n.vertexCount*2));for(var a=yh.create(),o=0;o<n.vertexCount;o++)n.attributes.position.get(o,a),a[3]=1,yh.transformMat4(a,a,e.array),yh.scale(a,a,1/a[3]),i[o*2]=a[0],i[o*2+1]=a[1]}});let Gw=Fw;var Dp=20,Cp=-10;function Uw(e,t){return e&&t&&e[0]===t[0]&&e[1]===t[1]}function xh(e,t){this.rootNode=new S.Node,this.is2D=e,this._labelsBuilder=new ah(256,256,t),this._labelsBuilder.getMesh().renderOrder=100,this.rootNode.add(this._labelsBuilder.getMesh()),this._api=t,this._spriteImageCanvas=document.createElement("canvas"),this._startDataIndex=0,this._endDataIndex=0,this._sizeScale=1}xh.prototype={constructor:xh,highlightOnMouseover:!0,update:function(e,t,r,i,n){var a=this._prevMesh;this._prevMesh=this._mesh,this._mesh=a;var o=e.getData();if(i==null&&(i=0),n==null&&(n=o.count()),this._startDataIndex=i,this._endDataIndex=n-1,!this._mesh){var s=this._prevMesh&&this._prevMesh.material;this._mesh=new Gw({renderOrder:10,frustumCulling:!1}),s&&(this._mesh.material=s)}var s=this._mesh.material,l=this._mesh.geometry,u=l.attributes;this.rootNode.remove(this._prevMesh),this.rootNode.add(this._mesh),this._setPositionTextureToMesh(this._mesh,this._positionTexture);var h=this._getSymbolInfo(e,i,n),f=r.getDevicePixelRatio(),c=e.getModel("itemStyle").getItemStyle(),d=e.get("large"),v=1;h.maxSize>2?(v=this._updateSymbolSprite(e,c,h,f),s.enableTexture("sprite")):s.disableTexture("sprite"),u.position.init(n-i);var p=[];if(d){s.undefine("VERTEX_SIZE"),s.undefine("VERTEX_COLOR");var _=d2(o),g=v2(o);S.parseColor(_,p),p[3]*=g,s.set({color:p,u_Size:h.maxSize*this._sizeScale})}else s.set({color:[1,1,1,1]}),s.define("VERTEX_SIZE"),s.define("VERTEX_COLOR"),u.size.init(n-i),u.color.init(n-i),this._originalOpacity=new Float32Array(n-i);for(var m=o.getLayout("points"),y=u.position.value,x=!1,w=0;w<n-i;w++){var T=w*3,E=w*2;if(this.is2D?(y[T]=m[E],y[T+1]=m[E+1],y[T+2]=Cp):(y[T]=m[T],y[T+1]=m[T+1],y[T+2]=m[T+2]),!d){var _=$e(o,w),g=et(o,w);S.parseColor(_,p),p[3]*=g,u.color.set(w,p),p[3]<.99&&(x=!0);var b=o.getItemVisual(w,"symbolSize");b=b instanceof Array?Math.max(b[0],b[1]):b,isNaN(b)&&(b=0),u.size.value[w]=b*v*this._sizeScale,this._originalOpacity[w]=p[3]}}this._mesh.sizeScale=v,l.updateBoundingBox(),l.dirty(),this._updateMaterial(e,c);var D=e.coordinateSystem;if(D&&D.viewGL){var L=D.viewGL.isLinearSpace()?"define":"undefine";s[L]("fragment","SRGB_DECODE")}d||this._updateLabelBuilder(e,i,n),this._updateHandler(e,t,r),this._updateAnimation(e),this._api=r},getPointsMesh:function(){return this._mesh},updateLabels:function(e){this._labelsBuilder.updateLabels(e)},hideLabels:function(){this.rootNode.remove(this._labelsBuilder.getMesh())},showLabels:function(){this.rootNode.add(this._labelsBuilder.getMesh())},dispose:function(){this._labelsBuilder.dispose()},_updateSymbolSprite:function(e,t,r,i){r.maxSize=Math.min(r.maxSize*2,200);var n=[];return r.aspect>1?(n[0]=r.maxSize,n[1]=r.maxSize/r.aspect):(n[1]=r.maxSize,n[0]=r.maxSize*r.aspect),n[0]=n[0]||1,n[1]=n[1]||1,(this._symbolType!==r.type||!Uw(this._symbolSize,n)||this._lineWidth!==t.lineWidth)&&(Ap.createSymbolSprite(r.type,n,{fill:"#fff",lineWidth:t.lineWidth,stroke:"transparent",shadowColor:"transparent",minMargin:Math.min(n[0]/2,10)},this._spriteImageCanvas),Ap.createSDFFromCanvas(this._spriteImageCanvas,Math.min(this._spriteImageCanvas.width,32),Dp,this._mesh.material.get("sprite").image),this._symbolType=r.type,this._symbolSize=n,this._lineWidth=t.lineWidth),this._spriteImageCanvas.width/r.maxSize*i},_updateMaterial:function(e,t){var r=e.get("blendMode")==="lighter"?S.additiveBlend:null,i=this._mesh.material;i.blend=r,i.set("lineWidth",t.lineWidth/Dp);var n=S.parseColor(t.stroke);i.set("strokeColor",n),i.transparent=!0,i.depthMask=!1,i.depthTest=!this.is2D,i.sortVertices=!this.is2D},_updateLabelBuilder:function(e,o,r){var i=e.getData(),n=this._mesh.geometry,a=n.attributes.position.value,o=this._startDataIndex,s=this._mesh.sizeScale;this._labelsBuilder.updateData(i,o,r),this._labelsBuilder.getLabelPosition=function(l,u,h){var f=(l-o)*3;return[a[f],a[f+1],a[f+2]]},this._labelsBuilder.getLabelDistance=function(l,u,h){var f=n.attributes.size.get(l-o)/s;return f/2+h},this._labelsBuilder.updateLabels()},_updateAnimation:function(e){S.updateVertexAnimation([["prevPosition","position"],["prevSize","size"]],this._prevMesh,this._mesh,e)},_updateHandler:function(e,t,r){var i=e.getData(),n=this._mesh,a=this,o=-1,s=e.coordinateSystem&&e.coordinateSystem.type==="cartesian3D",l;s&&(l=e.coordinateSystem.model),n.seriesIndex=e.seriesIndex,n.off("mousemove"),n.off("mouseout"),n.on("mousemove",function(u){var h=u.vertexIndex+a._startDataIndex;h!==o&&(this.highlightOnMouseover&&(this.downplay(i,o),this.highlight(i,h),this._labelsBuilder.updateLabels([h])),s&&r.dispatchAction({type:"grid3DShowAxisPointer",value:[i.get(e.coordDimToDataDim("x")[0],h),i.get(e.coordDimToDataDim("y")[0],h),i.get(e.coordDimToDataDim("z")[0],h)],grid3DIndex:l.componentIndex})),n.dataIndex=h,o=h},this),n.on("mouseout",function(u){var h=u.vertexIndex+a._startDataIndex;this.highlightOnMouseover&&(this.downplay(i,h),this._labelsBuilder.updateLabels()),o=-1,n.dataIndex=-1,s&&r.dispatchAction({type:"grid3DHideAxisPointer",grid3DIndex:l.componentIndex})},this)},updateLayout:function(e,t,r){var i=e.getData();if(this._mesh){var n=this._mesh.geometry.attributes.position.value,a=i.getLayout("points");if(this.is2D)for(var o=0;o<a.length/2;o++){var s=o*3,l=o*2;n[s]=a[l],n[s+1]=a[l+1],n[s+2]=Cp}else for(var o=0;o<a.length;o++)n[o]=a[o];this._mesh.geometry.dirty(),r.getZr().refresh()}},updateView:function(e){if(this._mesh){var t=new W;W.mul(t,e.viewMatrix,this._mesh.worldTransform),W.mul(t,e.projectionMatrix,t),this._mesh.updateNDCPosition(t,this.is2D,this._api)}},highlight:function(e,t){if(!(t>this._endDataIndex||t<this._startDataIndex)){var r=e.getItemModel(t),i=r.getModel("emphasis.itemStyle"),n=i.get("color"),a=i.get("opacity");if(n==null){var o=$e(e,t);n=A.color.lift(o,-.4)}a==null&&(a=et(e,t));var s=S.parseColor(n);s[3]*=a,this._mesh.geometry.attributes.color.set(t-this._startDataIndex,s),this._mesh.geometry.dirtyAttribute("color"),this._api.getZr().refresh()}},downplay:function(e,t){if(!(t>this._endDataIndex||t<this._startDataIndex)){var r=$e(e,t),i=et(e,t),n=S.parseColor(r);n[3]*=i,this._mesh.geometry.attributes.color.set(t-this._startDataIndex,n),this._mesh.geometry.dirtyAttribute("color"),this._api.getZr().refresh()}},fadeOutAll:function(e){if(this._originalOpacity){for(var t=this._mesh.geometry,r=0;r<t.vertexCount;r++){var i=this._originalOpacity[r]*e;t.attributes.color.value[r*4+3]=i}t.dirtyAttribute("color"),this._api.getZr().refresh()}},fadeInAll:function(){this.fadeOutAll(1)},setPositionTexture:function(e){this._mesh&&this._setPositionTextureToMesh(this._mesh,e),this._positionTexture=e},removePositionTexture:function(){this._positionTexture=null,this._mesh&&this._setPositionTextureToMesh(this._mesh,null)},setSizeScale:function(e){if(e!==this._sizeScale){if(this._mesh){var t=this._mesh.material.get("u_Size");this._mesh.material.set("u_Size",t/this._sizeScale*e);var r=this._mesh.geometry.attributes;if(r.size.value)for(var i=0;i<r.size.value.length;i++)r.size.value[i]=r.size.value[i]/this._sizeScale*e}this._sizeScale=e}},_setPositionTextureToMesh:function(e,t){t&&e.material.set("positionTexture",t),e.material[t?"enableTexture":"disableTexture"]("positionTexture")},_getSymbolInfo:function(e,t,r){if(e.get("large")){var i=te.firstNotNull(e.get("symbolSize"),1),u,a;return i instanceof Array?(u=Math.max(i[0],i[1]),a=i[0]/i[1]):(u=i,a=1),{maxSize:i,type:e.get("symbol"),aspect:a}}for(var n=e.getData(),a,o=!1,s=n.getItemVisual(0,"symbol")||"circle",l=!1,u=0,h=t;h<r;h++){var i=n.getItemVisual(h,"symbolSize"),f=n.getItemVisual(h,"symbol"),c;if(i instanceof Array)c=i[0]/i[1],u=Math.max(Math.max(i[0],i[1]),u);else{if(isNaN(i))continue;c=1,u=Math.max(i,u)}a!=null&&Math.abs(c-a)>.05&&(o=!0),f!==s&&(l=!0),s=f,a=c}return o&&console.warn("Different symbol width / height ratio will be ignored."),l&&console.warn("Different symbol type will be ignored."),{maxSize:u,type:s,aspect:a}}};let Ba=xh,zw=A.ChartView.extend({type:"scatter3D",hasSymbolVisual:!0,__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this._pointsBuilderList=[],this._currentStep=0},render:function(e,t,r){if(this.groupGL.removeAll(),!!e.getData().count()){var i=e.coordinateSystem;if(i&&i.viewGL){i.viewGL.add(this.groupGL),this._camera=i.viewGL.camera;var n=this._pointsBuilderList[0];n||(n=this._pointsBuilderList[0]=new Ba(!1,r)),this._pointsBuilderList.length=1,this.groupGL.add(n.rootNode),n.update(e,t,r),n.updateView(i.viewGL.camera)}else throw new Error("Invalid coordinate system")}},incrementalPrepareRender:function(e,t,r){var i=e.coordinateSystem;if(i&&i.viewGL)i.viewGL.add(this.groupGL),this._camera=i.viewGL.camera;else throw new Error("Invalid coordinate system");this.groupGL.removeAll(),this._currentStep=0},incrementalRender:function(e,t,r,i){if(!(e.end<=e.start)){var n=this._pointsBuilderList[this._currentStep];n||(n=new Ba(!1,i),this._pointsBuilderList[this._currentStep]=n),this.groupGL.add(n.rootNode),n.update(t,r,i,e.start,e.end),n.updateView(t.coordinateSystem.viewGL.camera),this._currentStep++}},updateCamera:function(){this._pointsBuilderList.forEach(function(e){e.updateView(this._camera)},this)},highlight:function(e,t,r,i){this._toggleStatus("highlight",e,t,r,i)},downplay:function(e,t,r,i){this._toggleStatus("downplay",e,t,r,i)},_toggleStatus:function(e,t,r,i,n){var a=t.getData(),o=te.queryDataIndex(a,n),s=e==="highlight";o!=null?A.util.each(An.normalizeToArray(o),function(l){for(var u=0;u<this._pointsBuilderList.length;u++){var h=this._pointsBuilderList[u];s?h.highlight(a,l):h.downplay(a,l)}},this):a.each(function(l){for(var u=0;u<this._pointsBuilderList.length;u++){var h=this._pointsBuilderList[u];s?h.highlight(a,l):h.downplay(a,l)}})},dispose:function(){this._pointsBuilderList.forEach(function(e){e.dispose()}),this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});function Hw(e){e.registerChartView(zw),e.registerSeriesModel(Rw),e.registerLayout({seriesType:"scatter3D",reset:function(t){var r=t.coordinateSystem;if(r){var i=r.dimensions;if(i.length<3){console.error("scatter3D needs 3D coordinateSystem");return}var n=i.map(function(s){return t.coordDimToDataDim(s)[0]}),a=[],o=[];return{progress:function(s,l){for(var u=new Float32Array((s.end-s.start)*3),h=s.start;h<s.end;h++){var f=(h-s.start)*3;a[0]=l.get(n[0],h),a[1]=l.get(n[1],h),a[2]=l.get(n[2],h),r.dataToPoint(a,o),u[f]=o[0],u[f+1]=o[1],u[f+2]=o[2]}l.setLayout("points",u)}}}}})}(0,A.use)(Hw);var qe=Ue.vec3,Lp=Ue.vec2,br=qe.normalize,Ps=qe.cross,Pp=qe.sub,Th=qe.add,jr=qe.create,qr=jr(),Wt=jr(),Zr=jr(),Fa=jr(),Rp=[],Np=[];function Vw(e,t){Lp.copy(Rp,e[0]),Lp.copy(Np,e[1]);var r=[],i=r[0]=jr(),n=r[1]=jr(),a=r[2]=jr(),o=r[3]=jr();t.dataToPoint(Rp,i),t.dataToPoint(Np,o),br(qr,i),Pp(Wt,o,i),br(Wt,Wt),Ps(Zr,Wt,qr),br(Zr,Zr),Ps(Wt,qr,Zr),Th(n,qr,Wt),br(n,n),br(qr,o),Pp(Wt,i,o),br(Wt,Wt),Ps(Zr,Wt,qr),br(Zr,Zr),Ps(Wt,qr,Zr),Th(a,qr,Wt),br(a,a),Th(Fa,i,o),br(Fa,Fa);var s=qe.dot(i,Fa),l=qe.dot(Fa,n),u=(Math.max(qe.len(i),qe.len(o))-s)/l*2;return qe.scaleAndAdd(n,i,n,u),qe.scaleAndAdd(a,o,a,u),r}function kw(e,t,r){var i=[],n=i[0]=qe.create(),a=i[1]=qe.create(),o=i[2]=qe.create(),s=i[3]=qe.create();t.dataToPoint(e[0],n),t.dataToPoint(e[1],s);var l=qe.dist(n,s);return qe.lerp(a,n,s,.3),qe.lerp(o,n,s,.3),qe.scaleAndAdd(a,a,r,Math.min(l*.1,10)),qe.scaleAndAdd(o,o,r,Math.min(l*.1,10)),i}function Ip(e,t){for(var r=new Float32Array(e.length*3),i=0,n=[],a=0;a<e.length;a++)t.dataToPoint(e[a],n),r[i++]=n[0],r[i++]=n[1],r[i++]=n[2];return r}function Op(e){var t=[];return e.each(function(r){var i=e.getItemModel(r),n=i.option instanceof Array?i.option:i.getShallow("coords",!0);if(!(n instanceof Array&&n.length>0&&n[0]instanceof Array))throw new Error("Invalid coords "+JSON.stringify(n)+". Lines must have 2d coords array in data item.");t.push(n)}),{coordsList:t}}function Ww(e,t){var r=e.getData(),i=e.get("polyline");r.setLayout("lineType",i?"polyline":"cubicBezier");var n=Op(r);r.each(function(a){var o=n.coordsList[a],s=i?Ip:Vw;r.setItemLayout(a,s(o,t))})}function Bp(e,t,r){var i=e.getData(),n=e.get("polyline"),a=Op(i);i.setLayout("lineType",n?"polyline":"cubicBezier"),i.each(function(o){var s=a.coordsList[o],l=n?Ip(s,t):kw(s,t,r);i.setItemLayout(o,l)})}function Xw(e,t){e.eachSeriesByType("lines3D",function(r){var i=r.coordinateSystem;i.type==="globe"?Ww(r,i):i.type==="geo3D"?Bp(r,i,[0,1,0]):(i.type==="mapbox3D"||i.type==="maptalks3D")&&Bp(r,i,[0,0,1])})}let jw=A.SeriesModel.extend({type:"series.lines3D",dependencies:["globe"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",getInitialData:function(e,t){var r=new A.List(["value"],this);return r.hasItemOption=!1,r.initData(ho(e.data),[],function(i,n,a,o){if(i instanceof Array)return NaN;r.hasItemOption=!0;var s=i.value;if(s!=null)return s instanceof Array?s[o]:s}),r},defaultOption:{coordinateSystem:"globe",globeIndex:0,geo3DIndex:0,zlevel:-10,polyline:!1,effect:{show:!1,period:4,trailWidth:4,trailLength:.2,spotIntensity:6},silent:!0,blendMode:"source-over",lineStyle:{width:1,opacity:.5}}}),qw=`@export ecgl.trail2.vertex
attribute vec3 position: POSITION;
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float offset;
attribute float dist;
attribute float distAll;
attribute float start;

attribute vec4 a_Color : COLOR;

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform vec4 viewport : VIEWPORT;
uniform float near : NEAR;

uniform float speed : 0;
uniform float trailLength: 0.3;
uniform float time;
uniform float period: 1000;

uniform float spotSize: 1;

varying vec4 v_Color;
varying float v_Percent;
varying float v_SpotPercent;

@import ecgl.common.wireframe.vertexHeader

@import ecgl.lines3D.clipNear

void main()
{
 @import ecgl.lines3D.expandLine

 gl_Position = currProj;

 v_Color = a_Color;

 @import ecgl.common.wireframe.vertexMain

#ifdef CONSTANT_SPEED
 float t = mod((speed * time + start) / distAll, 1. + trailLength) - trailLength;
#else
 float t = mod((time + start) / period, 1. + trailLength) - trailLength;
#endif

 float trailLen = distAll * trailLength;

 v_Percent = (dist - t * distAll) / trailLen;

 v_SpotPercent = spotSize / distAll;

 }
@end


@export ecgl.trail2.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];
uniform float spotIntensity: 5;

varying vec4 v_Color;
varying float v_Percent;
varying float v_SpotPercent;

@import ecgl.common.wireframe.fragmentHeader

@import clay.util.srgb

void main()
{
 if (v_Percent > 1.0 || v_Percent < 0.0) {
 discard;
 }

 float fade = v_Percent;

#ifdef SRGB_DECODE
 gl_FragColor = sRGBToLinear(color * v_Color);
#else
 gl_FragColor = color * v_Color;
#endif

 @import ecgl.common.wireframe.fragmentMain

 if (v_Percent > (1.0 - v_SpotPercent)) {
 gl_FragColor.rgb *= spotIntensity;
 }

 gl_FragColor.a *= fade;
}

@end`;var Fp=Ue.vec3;function Zw(e){return e>0?1:-1}S.Shader.import(qw);let Yw=S.Mesh.extend(function(){var e=new S.Material({shader:new S.Shader(S.Shader.source("ecgl.trail2.vertex"),S.Shader.source("ecgl.trail2.fragment")),transparent:!0,depthMask:!1}),t=new Si({dynamic:!0});return t.createAttribute("dist","float",1),t.createAttribute("distAll","float",1),t.createAttribute("start","float",1),{geometry:t,material:e,culling:!1,$ignorePicking:!0}},{updateData:function(e,t,r){var i=e.hostModel,n=this.geometry,a=i.getModel("effect"),o=a.get("trailWidth")*t.getDevicePixelRatio(),s=a.get("trailLength"),l=i.get("effect.constantSpeed"),u=i.get("effect.period")*1e3,h=l!=null;this.getScene()||console.error("TrailMesh must been add to scene before updateData"),h?this.material.set("speed",l/1e3):this.material.set("period",u),this.material[h?"define":"undefine"]("vertex","CONSTANT_SPEED");var f=i.get("polyline");n.trailLength=s,this.material.set("trailLength",s),n.resetOffset(),["position","positionPrev","positionNext"].forEach(function(E){n.attributes[E].value=r.attributes[E].value});var c=["dist","distAll","start","offset","color"];c.forEach(function(E){n.attributes[E].init(n.vertexCount)}),n.indices=r.indices;var d=[],v=a.get("trailColor"),p=a.get("trailOpacity"),_=v!=null,g=p!=null;this.updateWorldTransform();var m=this.worldTransform.x.len(),y=this.worldTransform.y.len(),x=this.worldTransform.z.len(),w=0,T=0;e.each(function(E){var b=e.getItemLayout(E),D=g?p:et(e,E),L=$e(e,E);D==null&&(D=1),d=S.parseColor(_?v:L,d),d[3]*=D;for(var M=f?r.getPolylineVertexCount(b):r.getCubicCurveVertexCount(b[0],b[1],b[2],b[3]),R=0,I=[],P=[],N=w;N<w+M;N++)n.attributes.position.get(N,I),I[0]*=m,I[1]*=y,I[2]*=x,N>w&&(R+=Fp.dist(I,P)),n.attributes.dist.set(N,R),Fp.copy(P,I);T=Math.max(T,R);for(var G=Math.random()*(h?R:u),N=w;N<w+M;N++)n.attributes.distAll.set(N,R),n.attributes.start.set(N,G),n.attributes.offset.set(N,Zw(r.attributes.offset.get(N))*o/2),n.attributes.color.set(N,d);w+=M}),this.material.set("spotSize",T*.1*s),this.material.set("spotIntensity",a.get("spotIntensity")),n.dirty()},setAnimationTime:function(e){this.material.set("time",e)}});S.Shader.import(ds);function Kw(e){return e.radius!=null?e.radius:e.size!=null?Math.max(e.size[0],e.size[1],e.size[2]):100}let Qw=A.ChartView.extend({type:"lines3D",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this._meshLinesMaterial=new S.Material({shader:S.createShader("ecgl.meshLines3D"),transparent:!0,depthMask:!1}),this._linesMesh=new S.Mesh({geometry:new Si,material:this._meshLinesMaterial,$ignorePicking:!0}),this._trailMesh=new Yw},render:function(e,t,r){this.groupGL.add(this._linesMesh);var i=e.coordinateSystem,n=e.getData();if(i&&i.viewGL){var a=i.viewGL;a.add(this.groupGL),this._updateLines(e,t,r);var o=i.viewGL.isLinearSpace()?"define":"undefine";this._linesMesh.material[o]("fragment","SRGB_DECODE"),this._trailMesh.material[o]("fragment","SRGB_DECODE")}var s=this._trailMesh;if(s.stopAnimation(),e.get("effect.show")){this.groupGL.add(s),s.updateData(n,r,this._linesMesh.geometry),s.__time=s.__time||0;var l=3600*1e3;this._curveEffectsAnimator=s.animate("",{loop:!0}).when(l,{__time:l}).during(function(){s.setAnimationTime(s.__time)}).start()}else this.groupGL.remove(s),this._curveEffectsAnimator=null;this._linesMesh.material.blend=this._trailMesh.material.blend=e.get("blendMode")==="lighter"?S.additiveBlend:null},pauseEffect:function(){this._curveEffectsAnimator&&this._curveEffectsAnimator.pause()},resumeEffect:function(){this._curveEffectsAnimator&&this._curveEffectsAnimator.resume()},toggleEffect:function(){var e=this._curveEffectsAnimator;e&&(e.isPaused()?e.resume():e.pause())},_updateLines:function(e,t,r){var i=e.getData(),n=e.coordinateSystem,a=this._linesMesh.geometry,o=e.get("polyline");a.expandLine=!0;var s=Kw(n);a.segmentScale=s/20;var l="lineStyle.width".split("."),u=r.getDevicePixelRatio(),h=0;i.each(function(v){var p=i.getItemModel(v),_=p.get(l);_==null&&(_=1),i.setItemVisual(v,"lineWidth",_),h=Math.max(_,h)}),a.useNativeLine=!1;var f=0,c=0;i.each(function(v){var p=i.getItemLayout(v);o?(f+=a.getPolylineVertexCount(p),c+=a.getPolylineTriangleCount(p)):(f+=a.getCubicCurveVertexCount(p[0],p[1],p[2],p[3]),c+=a.getCubicCurveTriangleCount(p[0],p[1],p[2],p[3]))}),a.setVertexCount(f),a.setTriangleCount(c),a.resetOffset();var d=[];i.each(function(v){var p=i.getItemLayout(v),_=$e(i,v),g=et(i,v),m=i.getItemVisual(v,"lineWidth")*u;g==null&&(g=1),d=S.parseColor(_,d),d[3]*=g,o?a.addPolyline(p,d,m):a.addCubicCurve(p[0],p[1],p[2],p[3],d,m)}),a.dirty()},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll()}});function Jw(e){e.registerChartView(Qw),e.registerSeriesModel(jw),e.registerLayout(Xw),e.registerAction({type:"lines3DPauseEffect",event:"lines3deffectpaused",update:"series.lines3D:pauseEffect"},function(){}),e.registerAction({type:"lines3DResumeEffect",event:"lines3deffectresumed",update:"series.lines3D:resumeEffect"},function(){}),e.registerAction({type:"lines3DToggleEffect",event:"lines3deffectchanged",update:"series.lines3D:toggleEffect"},function(){})}(0,A.use)(Jw);function Gp(e,t){for(var r=[],i=0;i<t.length;i++)r.push(e.dataToPoint(t[i]));return r}var Up=A.SeriesModel.extend({type:"series.polygons3D",getRegionModel:function(e){return this.getData().getItemModel(e)},getRegionPolygonCoords:function(e){var t=this.coordinateSystem,r=this.getData().getItemModel(e),i=r.option instanceof Array?r.option:r.getShallow("coords");r.get("multiPolygon")||(i=[i]);for(var n=[],a=0;a<i.length;a++){for(var o=[],s=1;s<i[a].length;s++)o.push(Gp(t,i[a][s]));n.push({exterior:Gp(t,i[a][0]),interiors:o})}return n},getInitialData:function(e){var t=new A.List(["value"],this);return t.hasItemOption=!1,t.initData(ho(e.data),[],function(r,i,n,a){if(r instanceof Array)return NaN;t.hasItemOption=!0;var o=r.value;if(o!=null)return o instanceof Array?o[a]:o}),t},defaultOption:{show:!0,data:null,multiPolygon:!1,progressiveThreshold:1e3,progressive:1e3,zlevel:-10,label:{show:!1,distance:2,textStyle:{fontSize:20,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:4}},itemStyle:{color:"#fff",borderWidth:0,borderColor:"#333"},emphasis:{itemStyle:{color:"#639fc0"},label:{show:!0}}}});A.util.merge(Up.prototype,Tn);let $w=Up,eS=A.ChartView.extend({type:"polygons3D",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this._geo3DBuilderList=[],this._currentStep=0},render:function(e,t,r){this.groupGL.removeAll();var i=e.coordinateSystem;i&&i.viewGL&&i.viewGL.add(this.groupGL);var n=this._geo3DBuilderList[0];n||(n=new Ms(r),n.extrudeY=i.type!=="mapbox3D"&&i.type!=="maptalks3D",this._geo3DBuilderList[0]=n),this._updateShaderDefines(i,n),n.update(e,t,r),this._geo3DBuilderList.length=1,this.groupGL.add(n.rootNode)},incrementalPrepareRender:function(e,t,r){this.groupGL.removeAll();var i=e.coordinateSystem;i&&i.viewGL&&i.viewGL.add(this.groupGL),this._currentStep=0},incrementalRender:function(e,t,r,i){var n=this._geo3DBuilderList[this._currentStep],a=t.coordinateSystem;n||(n=new Ms(i),n.extrudeY=a.type!=="mapbox3D"&&a.type!=="maptalks3D",this._geo3DBuilderList[this._currentStep]=n),n.update(t,r,i,e.start,e.end),this.groupGL.add(n.rootNode),this._updateShaderDefines(a,n),this._currentStep++},_updateShaderDefines:function(e,t){var r=e.viewGL.isLinearSpace()?"define":"undefine";t.rootNode.traverse(function(i){i.material&&(i.material[r]("fragment","SRGB_DECODE"),(e.type==="mapbox3D"||e.type==="maptalks3D")&&(i.material.define("fragment","NORMAL_UP_AXIS",2),i.material.define("fragment","NORMAL_FRONT_AXIS",1)))})},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll(),this._geo3DBuilderList.forEach(function(e){e.dispose()})}});function tS(e){e.registerChartView(eS),e.registerSeriesModel($w)}(0,A.use)(tS);var zp=A.SeriesModel.extend({type:"series.surface",dependencies:["globe","grid3D","geo3D"],visualStyleAccessPath:"itemStyle",formatTooltip:function(e){return Oa(this,e)},getInitialData:function(e,t){var r=e.data;function i(H){return!(isNaN(H.min)||isNaN(H.max)||isNaN(H.step))}function n(H){var F=A.number.getPrecisionSafe;return Math.max(F(H.min),F(H.max),F(H.step))+1}if(!r)if(e.parametric){var x=e.parametricEquation||{},w=x.u||{},T=x.v||{};["u","v"].forEach(function(F){if(!i(x[F])){console.error("Invalid parametricEquation.%s",F);return}}),["x","y","z"].forEach(function(F){if(typeof x[F]!="function"){console.error("parametricEquation.%s needs to be function",F);return}});var E=Math.floor((w.max+w.step-w.min)/w.step),b=Math.floor((T.max+T.step-T.min)/T.step);r=new Float32Array(E*b*5);for(var D=n(w),L=n(T),c=0,d=0;d<b;d++)for(var v=0;v<E;v++){var M=v*w.step+w.min,R=d*T.step+T.min,I=A.number.round(Math.min(M,w.max),D),P=A.number.round(Math.min(R,T.max),L),p=x.x(I,P),_=x.y(I,P),y=x.z(I,P);r[c++]=p,r[c++]=_,r[c++]=y,r[c++]=I,r[c++]=P}}else{var a=e.equation||{},o=a.x||{},s=a.y||{};if(["x","y"].forEach(function(H){if(!i(a[H])){console.error("Invalid equation.%s",H);return}}),typeof a.z!="function"){console.error("equation.z needs to be function");return}var l=Math.floor((o.max+o.step-o.min)/o.step),u=Math.floor((s.max+s.step-s.min)/s.step);r=new Float32Array(l*u*3);for(var h=n(o),f=n(s),c=0,d=0;d<u;d++)for(var v=0;v<l;v++){var p=v*o.step+o.min,_=d*s.step+s.min,g=A.number.round(Math.min(p,o.max),h),m=A.number.round(Math.min(_,s.max),f),y=a.z(g,m);r[c++]=g,r[c++]=m,r[c++]=y}}var N=["x","y","z"];e.parametric&&N.push("u","v");var G=Ls(this,N,r);return G},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,grid3DIndex:0,shading:"lambert",parametric:!1,wireframe:{show:!0,lineStyle:{color:"rgba(0,0,0,0.5)",width:1}},equation:{x:{min:-1,max:1,step:.1},y:{min:-1,max:1,step:.1},z:null},parametricEquation:{u:{min:-1,max:1,step:.1},v:{min:-1,max:1,step:.1},x:null,y:null,z:null},dataShape:null,itemStyle:{},animationDurationUpdate:500}});A.util.merge(zp.prototype,Tn);let rS=zp;var Oi=Ue.vec3;function iS(e){return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])}let nS=A.ChartView.extend({type:"surface",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node},render:function(e,t,r){var i=this._prevSurfaceMesh;this._prevSurfaceMesh=this._surfaceMesh,this._surfaceMesh=i,this._surfaceMesh||(this._surfaceMesh=this._createSurfaceMesh()),this.groupGL.remove(this._prevSurfaceMesh),this.groupGL.add(this._surfaceMesh);var n=e.coordinateSystem,a=e.get("shading"),o=e.getData(),s="ecgl."+a;if((!this._surfaceMesh.material||this._surfaceMesh.material.shader.name!==s)&&(this._surfaceMesh.material=S.createMaterial(s,["VERTEX_COLOR","DOUBLE_SIDED"])),S.setMaterialFromModel(a,this._surfaceMesh.material,e,r),n&&n.viewGL){n.viewGL.add(this.groupGL);var l=n.viewGL.isLinearSpace()?"define":"undefine";this._surfaceMesh.material[l]("fragment","SRGB_DECODE")}var u=e.get("parametric"),h=e.get("dataShape");h||(h=this._getDataShape(o,u),e.get("data")&&console.warn("dataShape is not provided. Guess it is ",h));var f=e.getModel("wireframe"),c=f.get("lineStyle.width"),d=f.get("show")&&c>0;this._updateSurfaceMesh(this._surfaceMesh,e,h,d);var v=this._surfaceMesh.material;d?(v.define("WIREFRAME_QUAD"),v.set("wireframeLineWidth",c),v.set("wireframeLineColor",S.parseColor(f.get("lineStyle.color")))):v.undefine("WIREFRAME_QUAD"),this._initHandler(e,r),this._updateAnimation(e)},_updateAnimation:function(e){S.updateVertexAnimation([["prevPosition","position"],["prevNormal","normal"]],this._prevSurfaceMesh,this._surfaceMesh,e)},_createSurfaceMesh:function(){var e=new S.Mesh({geometry:new S.Geometry({dynamic:!0,sortTriangles:!0}),shadowDepthMaterial:new S.Material({shader:new S.Shader(S.Shader.source("ecgl.sm.depth.vertex"),S.Shader.source("ecgl.sm.depth.fragment"))}),culling:!1,renderOrder:10,renderNormal:!0});return e.geometry.createAttribute("barycentric","float",4),e.geometry.createAttribute("prevPosition","float",3),e.geometry.createAttribute("prevNormal","float",3),Object.assign(e.geometry,nh),e},_initHandler:function(e,t){var r=e.getData(),i=this._surfaceMesh,n=e.coordinateSystem;function a(s,l){for(var u=1/0,h=-1,f=[],c=0;c<s.length;c++){i.geometry.attributes.position.get(s[c],f);var d=Oi.dist(l.array,f);d<u&&(u=d,h=s[c])}return h}i.seriesIndex=e.seriesIndex;var o=-1;i.off("mousemove"),i.off("mouseout"),i.on("mousemove",function(s){var l=a(s.triangle,s.point);if(l>=0){var u=[];i.geometry.attributes.position.get(l,u);for(var h=n.pointToData(u),f=1/0,c=-1,d=[],v=0;v<r.count();v++){d[0]=r.get("x",v),d[1]=r.get("y",v),d[2]=r.get("z",v);var p=Oi.squaredDistance(d,h);p<f&&(c=v,f=p)}c!==o&&t.dispatchAction({type:"grid3DShowAxisPointer",value:h}),o=c,i.dataIndex=c}else i.dataIndex=-1},this),i.on("mouseout",function(s){o=-1,i.dataIndex=-1,t.dispatchAction({type:"grid3DHideAxisPointer"})},this)},_updateSurfaceMesh:function(e,t,r,i){var n=e.geometry,a=t.getData(),o=a.getLayout("points"),s=0;a.each(function(Oe){a.hasValue(Oe)||s++});var l=s||i,u=n.attributes.position,h=n.attributes.normal,f=n.attributes.texcoord0,c=n.attributes.barycentric,d=n.attributes.color,v=r[0],p=r[1],_=t.get("shading"),g=_!=="color";if(l){var m=(v-1)*(p-1)*4;u.init(m),i&&c.init(m)}else u.value=new Float32Array(o);d.init(n.vertexCount),f.init(n.vertexCount);var y=[0,3,1,1,3,2],x=[[1,1,0,0],[0,1,0,1],[1,0,0,1],[1,0,1,0]],w=n.indices=new(n.vertexCount>65535?Uint32Array:Uint16Array)((v-1)*(p-1)*6),T=function(Oe,lt,He){He[1]=Oe*p+lt,He[0]=Oe*p+lt+1,He[3]=(Oe+1)*p+lt+1,He[2]=(Oe+1)*p+lt},E=!1;if(l){var b=[],D=[],L=0;g?h.init(n.vertexCount):h.value=null;for(var M=[[],[],[]],R=[],I=[],P=Oi.create(),N=function(Oe,lt,He){var Dt=lt*3;return He[0]=Oe[Dt],He[1]=Oe[Dt+1],He[2]=Oe[Dt+2],He},G=new Float32Array(o.length),H=new Float32Array(o.length/3*4),F=0;F<a.count();F++)if(a.hasValue(F)){var Ye=S.parseColor($e(a,F)),re=et(a,F);re!=null&&(Ye[3]*=re),Ye[3]<.99&&(E=!0);for(var B=0;B<4;B++)H[F*4+B]=Ye[B]}for(var j=[1e7,1e7,1e7],F=0;F<v-1;F++)for(var J=0;J<p-1;J++){var le=F*(p-1)+J,ve=le*4;T(F,J,b);for(var ne=!1,B=0;B<4;B++)N(o,b[B],D),iS(D)&&(ne=!0);for(var B=0;B<4;B++)ne?u.set(ve+B,j):(N(o,b[B],D),u.set(ve+B,D)),i&&c.set(ve+B,x[B]);for(var B=0;B<6;B++)w[L++]=y[B]+ve;if(g&&!ne)for(var B=0;B<2;B++){for(var ze=B*3,we=0;we<3;we++){var Le=b[y[ze]+we];N(o,Le,M[we])}Oi.sub(R,M[0],M[1]),Oi.sub(I,M[1],M[2]),Oi.cross(P,R,I);for(var we=0;we<3;we++){var ot=b[y[ze]+we]*3;G[ot]=G[ot]+P[0],G[ot+1]=G[ot+1]+P[1],G[ot+2]=G[ot+2]+P[2]}}}if(g)for(var F=0;F<G.length/3;F++)N(G,F,P),Oi.normalize(P,P),G[F*3]=P[0],G[F*3+1]=P[1],G[F*3+2]=P[2];for(var Ye=[],ke=[],F=0;F<v-1;F++)for(var J=0;J<p-1;J++){var le=F*(p-1)+J,ve=le*4;T(F,J,b);for(var B=0;B<4;B++){for(var we=0;we<4;we++)Ye[we]=H[b[B]*4+we];d.set(ve+B,Ye),g&&(N(G,b[B],P),h.set(ve+B,P));var Le=b[B];ke[0]=Le%p/(p-1),ke[1]=Math.floor(Le/p)/(v-1),f.set(ve+B,ke)}le++}}else{for(var ke=[],F=0;F<a.count();F++){ke[0]=F%p/(p-1),ke[1]=Math.floor(F/p)/(v-1);var Ye=S.parseColor($e(a,F)),re=et(a,F);re!=null&&(Ye[3]*=re),Ye[3]<.99&&(E=!0),d.set(F,Ye),f.set(F,ke)}for(var b=[],tr=0,F=0;F<v-1;F++)for(var J=0;J<p-1;J++){T(F,J,b);for(var B=0;B<6;B++)w[tr++]=b[y[B]]}g?n.generateVertexNormals():h.value=null}e.material.get("normalMap")&&n.generateTangents(),n.updateBoundingBox(),n.dirty(),e.material.transparent=E,e.material.depthMask=!E},_getDataShape:function(e,t){for(var r=-1/0,i=0,n=0,a=0,o=!1,s=t?"u":"x",l=e.count(),u=0;u<l;u++){var h=e.get(s,u);h<r&&(a&&a!==n&&(o=!0),a=n,n=0,i++),r=h,n++}if((!i||n===1)&&(o=!0),!o)return[i+1,n];for(var f=Math.floor(Math.sqrt(l));f>0;){if(Math.floor(l/f)===l/f)return[f,l/f];f--}return f=Math.floor(Math.sqrt(l)),[f,f]},dispose:function(){this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});function aS(e){e.registerChartView(nS),e.registerSeriesModel(rS),e.registerLayout(function(t,r){t.eachSeriesByType("surface",function(i){var n=i.coordinateSystem;(!n||n.type!=="cartesian3D")&&console.error("Surface chart only support cartesian3D coordinateSystem");var a=i.getData(),o=new Float32Array(3*a.count()),s=[NaN,NaN,NaN];if(n&&n.type==="cartesian3D"){var l=n.dimensions,u=l.map(function(h){return i.coordDimToDataDim(h)[0]});a.each(u,function(h,f,c,d){var v;a.hasValue(d)?v=n.dataToPoint([h,f,c]):v=s,o[d*3]=v[0],o[d*3+1]=v[1],o[d*3+2]=v[2]})}a.setLayout("points",o)})})}(0,A.use)(aS);function Hp(e,t){for(var r=[],i=0;i<t.length;i++)r.push(e.dataToPoint(t[i]));return r}var Mn=A.SeriesModel.extend({type:"series.map3D",layoutMode:"box",coordinateSystem:null,visualStyleAccessPath:"itemStyle",optionUpdated:function(e){e=e||{};var t=this.get("coordinateSystem");if(!(t==null||t==="geo3D")){var r=["left","top","width","height","boxWidth","boxDepth","boxHeight","light","viewControl","postEffect","temporalSuperSampling","environment","groundPlane"],i=[];r.forEach(function(n){e[n]!=null&&i.push(n)}),i.length&&console.warn("Property %s in map3D series will be ignored if coordinate system is %s",i.join(", "),t),this.get("groundPlane.show")&&(this.option.groundPlane.show=!1),this._geo=null}},getInitialData:function(e){e.data=this.getFilledRegions(e.data,e.map);var t=A.helper.createDimensions(e.data,{coordDimensions:["value"]}),r=new A.List(t,this);r.initData(ho(e.data));var i={};return r.each(function(n){var a=r.getName(n),o=r.getItemModel(n);i[a]=o}),this._regionModelMap=i,r},formatTooltip:function(e){return Oa(this,e)},getRegionModel:function(e){var t=this.getData().getName(e);return this._regionModelMap[t]||new A.Model(null,this)},getRegionPolygonCoords:function(e){var t=this.coordinateSystem,r=this.getData().getName(e);if(t.transform){var i=t.getRegion(r);return i?i.geometries:[]}else{this._geo||(this._geo=lp.createGeo3D(this));for(var i=this._geo.getRegion(r),n=[],a=0;a<i.geometries.length;a++){var o=i.geometries[a],s=[],l=Hp(t,o.exterior);if(s&&s.length)for(var u=0;u<o.interiors.length;u++)s.push(Hp(t,s[u]));n.push({interiors:s,exterior:l})}return n}},getFormattedLabel:function(e,t){var r=An.getFormattedLabel(this,e,t);return r==null&&(r=this.getData().getName(e)),r},defaultOption:{coordinateSystem:"geo3D",data:null}});A.util.merge(Mn.prototype,qv),A.util.merge(Mn.prototype,Mo),A.util.merge(Mn.prototype,en),A.util.merge(Mn.prototype,tn),A.util.merge(Mn.prototype,Tn);let oS=Mn,sS=A.ChartView.extend({type:"map3D",__ecgl__:!0,init:function(e,t){this._geo3DBuilder=new Ms(t),this.groupGL=new S.Node},render:function(e,t,r){var i=e.coordinateSystem;if(!(!i||!i.viewGL)){this.groupGL.add(this._geo3DBuilder.rootNode),i.viewGL.add(this.groupGL);var n;if(i.type==="geo3D"){n=i,this._sceneHelper||(this._sceneHelper=new mn,this._sceneHelper.initLight(this.groupGL)),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(e),i.viewGL.setPostEffect(e.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(e.getModel("temporalSuperSampling"));var a=this._control;a||(a=this._control=new hs({zr:r.getZr()}),this._control.init());var o=e.getModel("viewControl");a.setViewGL(i.viewGL),a.setFromViewControlModel(o,0),a.off("update"),a.on("update",function(){r.dispatchAction({type:"map3DChangeCamera",alpha:a.getAlpha(),beta:a.getBeta(),distance:a.getDistance(),from:this.uid,map3DId:e.id})}),this._geo3DBuilder.extrudeY=!0}else this._control&&(this._control.dispose(),this._control=null),this._sceneHelper&&(this._sceneHelper.dispose(),this._sceneHelper=null),n=e.getData().getLayout("geo3D"),this._geo3DBuilder.extrudeY=!1;this._geo3DBuilder.update(e,t,r,0,e.getData().count());var s=i.viewGL.isLinearSpace()?"define":"undefine";this._geo3DBuilder.rootNode.traverse(function(l){l.material&&l.material[s]("fragment","SRGB_DECODE")})}},afterRender:function(e,t,r,i){var n=i.renderer,a=e.coordinateSystem;a&&a.type==="geo3D"&&(this._sceneHelper.updateAmbientCubemap(n,e,r),this._sceneHelper.updateSkybox(n,e,r))},dispose:function(){this.groupGL.removeAll(),this._control.dispose(),this._geo3DBuilder.dispose()}});function lS(e){hp(e),e.registerChartView(sS),e.registerSeriesModel(oS),e.registerAction({type:"map3DChangeCamera",event:"map3dcamerachanged",update:"series:updateCamera"},function(t,r){r.eachComponent({mainType:"series",subType:"map3D",query:t},function(i){i.setView(t)})})}(0,A.use)(lS);let uS=A.SeriesModel.extend({type:"series.scatterGL",dependencies:["grid","polar","geo","singleAxis"],visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,getInitialData:function(){return A.helper.createList(this)},defaultOption:{coordinateSystem:"cartesian2d",zlevel:10,progressive:1e5,progressiveThreshold:1e5,large:!1,symbol:"circle",symbolSize:10,zoomScale:0,blendMode:"source-over",itemStyle:{opacity:.8},postEffect:{enable:!1,colorCorrection:{exposure:0,brightness:0,contrast:1,saturation:1,enable:!0}}}});function Yr(e){this.viewGL=e}Yr.prototype.reset=function(e,t){this._updateCamera(t.getWidth(),t.getHeight(),t.getDevicePixelRatio()),this._viewTransform=rn(),this.updateTransform(e,t)},Yr.prototype.updateTransform=function(e,t){var r=e.coordinateSystem;r.getRoamTransform&&(Ol(this._viewTransform,r.getRoamTransform()),this._setCameraTransform(this._viewTransform),t.getZr().refresh())},Yr.prototype.dataToPoint=function(e,t,r){r=e.dataToPoint(t,null,r);var i=this._viewTransform;i&&Rr(r,r,i)},Yr.prototype.removeTransformInPoint=function(e){return this._viewTransform&&Rr(e,e,this._viewTransform),e},Yr.prototype.getZoom=function(){if(this._viewTransform){var e=this._viewTransform;return 1/Math.max(Math.sqrt(e[0]*e[0]+e[1]*e[1]),Math.sqrt(e[2]*e[2]+e[3]*e[3]))}return 1},Yr.prototype._setCameraTransform=function(e){var t=this.viewGL.camera;t.position.set(e[4],e[5],0),t.scale.set(Math.sqrt(e[0]*e[0]+e[1]*e[1]),Math.sqrt(e[2]*e[2]+e[3]*e[3]),1)},Yr.prototype._updateCamera=function(e,t,r){this.viewGL.setViewport(0,0,e,t,r);var i=this.viewGL.camera;i.left=i.top=0,i.bottom=t,i.right=e,i.near=0,i.far=100};let Vp=Yr,hS=A.ChartView.extend({type:"scatterGL",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this.viewGL=new Vr("orthographic"),this.viewGL.add(this.groupGL),this._pointsBuilderList=[],this._currentStep=0,this._sizeScale=1,this._glViewHelper=new Vp(this.viewGL)},render:function(e,t,r){if(this.groupGL.removeAll(),this._glViewHelper.reset(e,r),!!e.getData().count()){var i=this._pointsBuilderList[0];i||(i=this._pointsBuilderList[0]=new Ba(!0,r)),this._pointsBuilderList.length=1,this.groupGL.add(i.rootNode),this._removeTransformInPoints(e.getData().getLayout("points")),i.update(e,t,r),this.viewGL.setPostEffect(e.getModel("postEffect"),r)}},incrementalPrepareRender:function(e,t,r){this.groupGL.removeAll(),this._glViewHelper.reset(e,r),this._currentStep=0,this.viewGL.setPostEffect(e.getModel("postEffect"),r)},incrementalRender:function(e,t,r,i){if(!(e.end<=e.start)){var n=this._pointsBuilderList[this._currentStep];n||(n=new Ba(!0,i),this._pointsBuilderList[this._currentStep]=n),this.groupGL.add(n.rootNode),this._removeTransformInPoints(t.getData().getLayout("points")),n.setSizeScale(this._sizeScale),n.update(t,r,i,e.start,e.end),i.getZr().refresh(),this._currentStep++}},updateTransform:function(e,t,r){if(e.coordinateSystem.getRoamTransform){this._glViewHelper.updateTransform(e,r);var i=this._glViewHelper.getZoom(),n=Math.max((e.get("zoomScale")||0)*(i-1)+1,0);this._sizeScale=n,this._pointsBuilderList.forEach(function(a){a.setSizeScale(n)})}},_removeTransformInPoints:function(e){if(e)for(var t=[],r=0;r<e.length;r+=2)t[0]=e[r],t[1]=e[r+1],this._glViewHelper.removeTransformInPoint(t),e[r]=t[0],e[r+1]=t[1]},dispose:function(){this.groupGL.removeAll(),this._pointsBuilderList.forEach(function(e){e.dispose()})},remove:function(){this.groupGL.removeAll()}});function fS(e){e.registerChartView(hS),e.registerSeriesModel(uS),e.registerLayout({seriesType:"scatterGL",reset:function(t){var r=t.coordinateSystem,i=t.getData(),n;if(r){var a=r.dimensions.map(function(s){return i.mapDimension(s)}).slice(0,2),o=[];a.length===1?n=function(s){for(var l=new Float32Array((s.end-s.start)*2),u=s.start;u<s.end;u++){var h=(u-s.start)*2,f=i.get(a[0],u),c=r.dataToPoint(f);l[h]=c[0],l[h+1]=c[1]}i.setLayout("points",l)}:a.length===2&&(n=function(s){for(var l=new Float32Array((s.end-s.start)*2),u=s.start;u<s.end;u++){var h=(u-s.start)*2,f=i.get(a[0],u),c=i.get(a[1],u);o[0]=f,o[1]=c,o=r.dataToPoint(o),l[h]=o[0],l[h+1]=o[1]}i.setLayout("points",l)})}return{progress:n}}})}(0,A.use)(fS);function Dn(e){return"_EC_"+e}var cS=(function(){function e(t){this.type="graph",this.nodes=[],this.edges=[],this._nodesMap={},this._edgesMap={},this._directed=t||!1}return e.prototype.isDirected=function(){return this._directed},e.prototype.addNode=function(t,r){t=t==null?""+r:""+t;var i=this._nodesMap;if(i[Dn(t)]){console.error("Graph nodes have duplicate name or id");return}var n=new Bi(t,r);return n.hostGraph=this,this.nodes.push(n),i[Dn(t)]=n,n},e.prototype.getNodeByIndex=function(t){var r=this.data.getRawIndex(t);return this.nodes[r]},e.prototype.getNodeById=function(t){return this._nodesMap[Dn(t)]},e.prototype.addEdge=function(t,r,i){var n=this._nodesMap,a=this._edgesMap;if(typeof t=="number"&&(t=this.nodes[t]),typeof r=="number"&&(r=this.nodes[r]),t instanceof Bi||(t=n[Dn(t)]),r instanceof Bi||(r=n[Dn(r)]),!(!t||!r)){var o=t.id+"-"+r.id,s=new kp(t,r,i);return s.hostGraph=this,this._directed&&(t.outEdges.push(s),r.inEdges.push(s)),t.edges.push(s),t!==r&&r.edges.push(s),this.edges.push(s),a[o]=s,s}},e.prototype.getEdgeByIndex=function(t){var r=this.edgeData.getRawIndex(t);return this.edges[r]},e.prototype.getEdge=function(t,r){t instanceof Bi&&(t=t.id),r instanceof Bi&&(r=r.id);var i=this._edgesMap;return this._directed?i[t+"-"+r]:i[t+"-"+r]||i[r+"-"+t]},e.prototype.eachNode=function(t,r){for(var i=this.nodes,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&t.call(r,i[a],a)},e.prototype.eachEdge=function(t,r){for(var i=this.edges,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&i[a].node1.dataIndex>=0&&i[a].node2.dataIndex>=0&&t.call(r,i[a],a)},e.prototype.breadthFirstTraverse=function(t,r,i,n){if(r instanceof Bi||(r=this._nodesMap[Dn(r)]),!!r){for(var a=i==="out"?"outEdges":i==="in"?"inEdges":"edges",o=0;o<this.nodes.length;o++)this.nodes[o].__visited=!1;if(!t.call(n,r,null))for(var s=[r];s.length;)for(var l=s.shift(),u=l[a],o=0;o<u.length;o++){var h=u[o],f=h.node1===l?h.node2:h.node1;if(!f.__visited){if(t.call(n,f,l))return;s.push(f),f.__visited=!0}}}},e.prototype.update=function(){for(var t=this.data,r=this.edgeData,i=this.nodes,n=this.edges,a=0,o=i.length;a<o;a++)i[a].dataIndex=-1;for(var a=0,o=t.count();a<o;a++)i[t.getRawIndex(a)].dataIndex=a;r.filterSelf(function(s){var l=n[r.getRawIndex(s)];return l.node1.dataIndex>=0&&l.node2.dataIndex>=0});for(var a=0,o=n.length;a<o;a++)n[a].dataIndex=-1;for(var a=0,o=r.count();a<o;a++)n[r.getRawIndex(a)].dataIndex=a},e.prototype.clone=function(){for(var t=new e(this._directed),r=this.nodes,i=this.edges,n=0;n<r.length;n++)t.addNode(r[n].id,r[n].dataIndex);for(var n=0;n<i.length;n++){var a=i[n];t.addEdge(a.node1.id,a.node2.id,a.dataIndex)}return t},e})(),Bi=(function(){function e(t,r){this.inEdges=[],this.outEdges=[],this.edges=[],this.dataIndex=-1,this.id=t??"",this.dataIndex=r??-1}return e.prototype.degree=function(){return this.edges.length},e.prototype.inDegree=function(){return this.inEdges.length},e.prototype.outDegree=function(){return this.outEdges.length},e.prototype.getModel=function(t){if(!(this.dataIndex<0)){var r=this.hostGraph,i=r.data.getItemModel(this.dataIndex);return i.getModel(t)}},e.prototype.getAdjacentDataIndices=function(){for(var t={edge:[],node:[]},r=0;r<this.edges.length;r++){var i=this.edges[r];i.dataIndex<0||(t.edge.push(i.dataIndex),t.node.push(i.node1.dataIndex,i.node2.dataIndex))}return t},e})(),kp=(function(){function e(t,r,i){this.dataIndex=-1,this.node1=t,this.node2=r,this.dataIndex=i??-1}return e.prototype.getModel=function(t){if(!(this.dataIndex<0)){var r=this.hostGraph,i=r.edgeData.getItemModel(this.dataIndex);return i.getModel(t)}},e.prototype.getAdjacentDataIndices=function(){return{edge:[this.dataIndex],node:[this.node1.dataIndex,this.node2.dataIndex]}},e})();function Wp(e,t){return{getValue:function(r){var i=this[e][t];return i.get(i.getDimension(r||"value"),this.dataIndex)},setVisual:function(r,i){this.dataIndex>=0&&this[e][t].setItemVisual(this.dataIndex,r,i)},getVisual:function(r){return this[e][t].getItemVisual(this.dataIndex,r)},setLayout:function(r,i){this.dataIndex>=0&&this[e][t].setItemLayout(this.dataIndex,r,i)},getLayout:function(){return this[e][t].getItemLayout(this.dataIndex)},getGraphicEl:function(){return this[e][t].getItemGraphicEl(this.dataIndex)},getRawIndex:function(){return this[e][t].getRawIndex(this.dataIndex)}}}Pr(Bi,Wp("hostGraph","data")),Pr(kp,Wp("hostGraph","edgeData"));let dS=cS;var Xt=Jo();function vS(e){var t=e.mainData,r=e.datas;r||(r={main:t},e.datasAttr={main:"data"}),e.datas=e.mainData=null,Xp(t,r,e),xe(r,function(i){xe(t.TRANSFERABLE_METHODS,function(n){i.wrapMethod(n,Xn(pS,e))})}),t.wrapMethod("cloneShallow",Xn(gS,e)),xe(t.CHANGABLE_METHODS,function(i){t.wrapMethod(i,Xn(_S,e))}),ai(r[t.dataType]===t)}function pS(e,t){if(xS(this)){var r=de({},Xt(this).datas);r[this.dataType]=t,Xp(t,r,e)}else wh(t,this.dataType,Xt(this).mainData,e);return t}function _S(e,t){return e.struct&&e.struct.update(),t}function gS(e,t){return xe(Xt(t).datas,function(r,i){r!==t&&wh(r.cloneShallow(),i,t,e)}),t}function mS(e){var t=Xt(this).mainData;return e==null||t==null?t:Xt(t).datas[e]}function yS(){var e=Xt(this).mainData;return e==null?[{data:e}]:or(ht(Xt(e).datas),function(t){return{type:t,data:Xt(e).datas[t]}})}function xS(e){return Xt(e).mainData===e}function Xp(e,t,r){Xt(e).datas={},xe(t,function(i,n){wh(i,n,e,r)})}function wh(e,t,r,i){Xt(r).datas[t]=e,Xt(e).mainData=r,e.dataType=t,i.struct&&(e[i.structAttr]=i.struct,i.struct[i.datasAttr[t]]=e),e.getLinkedData=mS,e.getLinkedDataAll=yS}let TS=vS;function wS(e,t,r,i,n){for(var a=new dS(i),o=0;o<e.length;o++)a.addNode(te.firstNotNull(e[o].id,e[o].name,o),o);for(var s=[],l=[],u=0,o=0;o<t.length;o++){var h=t[o],f=h.source,c=h.target;a.addEdge(f,c,u)&&(l.push(h),s.push(te.firstNotNull(h.id,f+" > "+c)),u++)}var d,v=A.helper.createDimensions(e,{coordDimensions:["value"]});d=new A.List(v,r),d.initData(e);var p=new A.List(["value"],r);return p.initData(l,s),n&&n(d,p),TS({mainData:d,struct:a,structAttr:"graph",datas:{node:d,edge:p},datasAttr:{node:"data",edge:"edgeData"}}),a.update(),a}var Ga=A.SeriesModel.extend({type:"series.graphGL",visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,init:function(e){Ga.superApply(this,"init",arguments),this.legendDataProvider=function(){return this._categoriesData},this._updateCategoriesData()},mergeOption:function(e){Ga.superApply(this,"mergeOption",arguments),this._updateCategoriesData()},getFormattedLabel:function(e,t,r,i){var n=An.getFormattedLabel(this,e,t,r,i);if(n==null){var a=this.getData(),o=a.dimensions[a.dimensions.length-1];n=a.get(o,e)}return n},getInitialData:function(e,t){var r=e.edges||e.links||[],i=e.data||e.nodes||[],n=this;if(i&&r)return wS(i,r,this,!0,a).data;function a(o,s){o.wrapMethod("getItemModel",function(f){let c=n._categoriesModels,d=f.getShallow("category"),v=c[d];return v&&(v.parentModel=f.parentModel,f.parentModel=v),f});let l=t.getModel([]).getModel;function u(f,c){let d=l.call(this,f,c);return d.resolveParentPath=h,d}s.wrapMethod("getItemModel",function(f){return f.resolveParentPath=h,f.getModel=u,f});function h(f){if(f&&(f[0]==="label"||f[1]==="label")){let c=f.slice();return f[0]==="label"?c[0]="edgeLabel":f[1]==="label"&&(c[1]="edgeLabel"),c}return f}}},getGraph:function(){return this.getData().graph},getEdgeData:function(){return this.getGraph().edgeData},getCategoriesData:function(){return this._categoriesData},formatTooltip:function(e,t,r){if(r==="edge"){var i=this.getData(),n=this.getDataParams(e,r),a=i.graph.getEdgeByIndex(e),o=i.getName(a.node1.dataIndex),s=i.getName(a.node2.dataIndex),l=[];return o!=null&&l.push(o),s!=null&&l.push(s),l=A.format.encodeHTML(l.join(" > ")),n.value&&(l+=" : "+A.format.encodeHTML(n.value)),l}else return Ga.superApply(this,"formatTooltip",arguments)},_updateCategoriesData:function(){var e=(this.option.categories||[]).map(function(r){return r.value!=null?r:Object.assign({value:0},r)}),t=new A.List(["value"],this);t.initData(e),this._categoriesData=t,this._categoriesModels=t.mapArray(function(r){return t.getItemModel(r,!0)})},setView:function(e){e.zoom!=null&&(this.option.zoom=e.zoom),e.offset!=null&&(this.option.offset=e.offset)},setNodePosition:function(e){for(var t=0;t<e.length/2;t++){var r=e[t*2],i=e[t*2+1],n=this.getData().getRawDataItem(t);n.x=r,n.y=i}},isAnimationEnabled:function(){return Ga.superCall(this,"isAnimationEnabled")&&!(this.get("layout")==="force"&&this.get("force.layoutAnimation"))},defaultOption:{zlevel:10,z:2,legendHoverLink:!0,layout:"forceAtlas2",forceAtlas2:{initLayout:null,GPU:!0,steps:1,maxSteps:1e3,repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,edgeWeightInfluence:1,edgeWeight:[1,4],nodeWeight:[1,4],preventOverlap:!1,gravityCenter:null},focusNodeAdjacency:!0,focusNodeAdjacencyOn:"mouseover",left:"center",top:"center",symbol:"circle",symbolSize:5,roam:!1,center:null,zoom:1,label:{show:!1,formatter:"{b}",position:"right",distance:5,textStyle:{fontSize:14}},itemStyle:{},lineStyle:{color:"#aaa",width:1,opacity:.5},emphasis:{label:{show:!0}},animation:!1}});let SS=Ga;var Ze=Ue.vec2,jp=[[0,0],[1,1]],qp=ce.extend(function(){return{segmentScale:4,dynamic:!0,useNativeLine:!0,attributes:{position:new ce.Attribute("position","float",2,"POSITION"),normal:new ce.Attribute("normal","float",2),offset:new ce.Attribute("offset","float",1),color:new ce.Attribute("color","float",4,"COLOR")}}},{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0,this._itemVertexOffsets=[]},setVertexCount:function(e){var t=this.attributes;this.vertexCount!==e&&(t.position.init(e),t.color.init(e),this.useNativeLine||(t.offset.init(e),t.normal.init(e)),e>65535?this.indices instanceof Uint16Array&&(this.indices=new Uint32Array(this.indices)):this.indices instanceof Uint32Array&&(this.indices=new Uint16Array(this.indices)))},setTriangleCount:function(e){this.triangleCount!==e&&(e===0?this.indices=null:this.indices=this.vertexCount>65535?new Uint32Array(e*3):new Uint16Array(e*3))},_getCubicCurveApproxStep:function(e,t,r,i){var n=Ze.dist(e,t)+Ze.dist(r,t)+Ze.dist(i,r),a=1/(n+1)*this.segmentScale;return a},getCubicCurveVertexCount:function(e,t,r,i){var n=this._getCubicCurveApproxStep(e,t,r,i),a=Math.ceil(1/n);return this.useNativeLine?a*2:a*2+2},getCubicCurveTriangleCount:function(e,t,r,i){var n=this._getCubicCurveApproxStep(e,t,r,i),a=Math.ceil(1/n);return this.useNativeLine?0:a*2},getLineVertexCount:function(){return this.getPolylineVertexCount(jp)},getLineTriangleCount:function(){return this.getPolylineTriangleCount(jp)},getPolylineVertexCount:function(e){var t;if(typeof e=="number")t=e;else{var r=typeof e[0]!="number";t=r?e.length:e.length/2}return this.useNativeLine?(t-1)*2:(t-1)*2+2},getPolylineTriangleCount:function(e){var t;if(typeof e=="number")t=e;else{var r=typeof e[0]!="number";t=r?e.length:e.length/2}return this.useNativeLine?0:(t-1)*2},addCubicCurve:function(e,t,r,i,n,a){a==null&&(a=1);for(var o=e[0],s=e[1],l=t[0],u=t[1],h=r[0],f=r[1],c=i[0],d=i[1],v=this._getCubicCurveApproxStep(e,t,r,i),p=v*v,_=p*v,g=3*v,m=3*p,y=6*p,x=6*_,w=o-l*2+h,T=s-u*2+f,E=(l-h)*3-o+c,b=(u-f)*3-s+d,D=o,L=s,M=(l-o)*g+w*m+E*_,R=(u-s)*g+T*m+b*_,I=w*y+E*x,P=T*y+b*x,N=E*x,G=b*x,H=0,F=0,re=Math.ceil(1/v),B=new Float32Array((re+1)*3),B=[],j=0,F=0;F<re+1;F++)B[j++]=D,B[j++]=L,D+=M,L+=R,M+=I,R+=P,I+=N,P+=G,H+=v,H>1&&(D=M>0?Math.min(D,c):Math.max(D,c),L=R>0?Math.min(L,d):Math.max(L,d));this.addPolyline(B,n,a)},addLine:function(e,t,r,i){this.addPolyline([e,t],r,i)},addPolyline:(function(){var e=Ze.create(),t=Ze.create(),r=Ze.create(),i=Ze.create(),n=[],a=[],o=[];return function(s,l,u,h,f){if(s.length){var c=typeof s[0]!="number";if(f==null&&(f=c?s.length:s.length/2),!(f<2)){h==null&&(h=0),u==null&&(u=1),this._itemVertexOffsets.push(this._vertexOffset);for(var d=c?typeof l[0]!="number":l.length/4===f,v=this.attributes.position,p=this.attributes.color,_=this.attributes.offset,g=this.attributes.normal,m=this.indices,y=this._vertexOffset,x,w=0;w<f;w++){if(c)n=s[w+h],d?x=l[w+h]:x=l;else{var T=w*2+h;if(n=n||[],n[0]=s[T],n[1]=s[T+1],d){var E=w*4+h;x=x||[],x[0]=l[E],x[1]=l[E+1],x[2]=l[E+2],x[3]=l[E+3]}else x=l}if(this.useNativeLine)w>1&&(v.copy(y,y-1),p.copy(y,y-1),y++);else{var b;if(w<f-1){if(c)Ze.copy(a,s[w+1]);else{var T=(w+1)*2+h;a=a||[],a[0]=s[T],a[1]=s[T+1]}if(w>0){Ze.sub(e,n,o),Ze.sub(t,a,n),Ze.normalize(e,e),Ze.normalize(t,t),Ze.add(i,e,t),Ze.normalize(i,i);var D=u/2*Math.min(1/Ze.dot(e,i),2);r[0]=-i[1],r[1]=i[0],b=D}else Ze.sub(e,a,n),Ze.normalize(e,e),r[0]=-e[1],r[1]=e[0],b=u/2}else Ze.sub(e,n,o),Ze.normalize(e,e),r[0]=-e[1],r[1]=e[0],b=u/2;g.set(y,r),g.set(y+1,r),_.set(y,b),_.set(y+1,-b),Ze.copy(o,n),v.set(y,n),v.set(y+1,n),p.set(y,x),p.set(y+1,x),y+=2}if(this.useNativeLine)p.set(y,x),v.set(y,n),y++;else if(w>0){var L=this._faceOffset*3,m=this.indices;m[L]=y-4,m[L+1]=y-3,m[L+2]=y-2,m[L+3]=y-3,m[L+4]=y-1,m[L+5]=y-2,this._faceOffset+=2}}this._vertexOffset=y}}}})(),setItemColor:function(e,t){for(var r=this._itemVertexOffsets[e],i=e<this._itemVertexOffsets.length-1?this._itemVertexOffsets[e+1]:this._vertexOffset,n=r;n<i;n++)this.attributes.color.set(n,t);this.dirty("color")}});A.util.defaults(qp.prototype,Ta);let Zp=qp;S.Shader.import(`@export ecgl.forceAtlas2.updateNodeRepulsion

#define NODE_COUNT 0

uniform sampler2D positionTex;

uniform vec2 textureSize;
uniform float gravity;
uniform float scaling;
uniform vec2 gravityCenter;

uniform bool strongGravityMode;
uniform bool preventOverlap;

varying vec2 v_Texcoord;

void main() {

 vec4 n0 = texture2D(positionTex, v_Texcoord);

 vec2 force = vec2(0.0);
 for (int i = 0; i < NODE_COUNT; i++) {
 vec2 uv = vec2(
 mod(float(i), textureSize.x) / (textureSize.x - 1.0),
 floor(float(i) / textureSize.x) / (textureSize.y - 1.0)
 );
 vec4 n1 = texture2D(positionTex, uv);

 vec2 dir = n0.xy - n1.xy;
 float d2 = dot(dir, dir);

 if (d2 > 0.0) {
 float factor = 0.0;
 if (preventOverlap) {
 float d = sqrt(d2);
 d = d - n0.w - n1.w;
 if (d > 0.0) {
 factor = scaling * n0.z * n1.z / (d * d);
 }
 else if (d < 0.0) {
 factor = scaling * 100.0 * n0.z * n1.z;
 }
 }
 else {
 factor = scaling * n0.z * n1.z / d2;
 }
 force += dir * factor;
 }
 }

 vec2 dir = gravityCenter - n0.xy;
 float d = 1.0;
 if (!strongGravityMode) {
 d = length(dir);
 }

 force += dir * n0.z * gravity / (d + 1.0);

 gl_FragColor = vec4(force, 0.0, 1.0);
}
@end

@export ecgl.forceAtlas2.updateEdgeAttraction.vertex

attribute vec2 node1;
attribute vec2 node2;
attribute float weight;

uniform sampler2D positionTex;
uniform float edgeWeightInfluence;
uniform bool preventOverlap;
uniform bool linLogMode;

uniform vec2 windowSize: WINDOW_SIZE;

varying vec2 v_Force;

void main() {

 vec4 n0 = texture2D(positionTex, node1);
 vec4 n1 = texture2D(positionTex, node2);

 vec2 dir = n1.xy - n0.xy;
 float d = length(dir);
 float w;
 if (edgeWeightInfluence == 0.0) {
 w = 1.0;
 }
 else if (edgeWeightInfluence == 1.0) {
 w = weight;
 }
 else {
 w = pow(weight, edgeWeightInfluence);
 }
 vec2 offset = vec2(1.0 / windowSize.x, 1.0 / windowSize.y);
 vec2 scale = vec2((windowSize.x - 1.0) / windowSize.x, (windowSize.y - 1.0) / windowSize.y);
 vec2 pos = node1 * scale * 2.0 - 1.0;
 gl_Position = vec4(pos + offset, 0.0, 1.0);
 gl_PointSize = 1.0;

 float factor;
 if (preventOverlap) {
 d = d - n1.w - n0.w;
 }
 if (d <= 0.0) {
 v_Force = vec2(0.0);
 return;
 }

 if (linLogMode) {
 factor = w * log(d) / d;
 }
 else {
 factor = w;
 }
 v_Force = dir * factor;
}
@end

@export ecgl.forceAtlas2.updateEdgeAttraction.fragment

varying vec2 v_Force;

void main() {
 gl_FragColor = vec4(v_Force, 0.0, 0.0);
}
@end

@export ecgl.forceAtlas2.calcWeightedSum.vertex

attribute vec2 node;

varying vec2 v_NodeUv;

void main() {

 v_NodeUv = node;
 gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
 gl_PointSize = 1.0;
}
@end

@export ecgl.forceAtlas2.calcWeightedSum.fragment

varying vec2 v_NodeUv;

uniform sampler2D positionTex;
uniform sampler2D forceTex;
uniform sampler2D forcePrevTex;

void main() {
 vec2 force = texture2D(forceTex, v_NodeUv).rg;
 vec2 forcePrev = texture2D(forcePrevTex, v_NodeUv).rg;

 float mass = texture2D(positionTex, v_NodeUv).z;
 float swing = length(force - forcePrev) * mass;
 float traction = length(force + forcePrev) * 0.5 * mass;

 gl_FragColor = vec4(swing, traction, 0.0, 0.0);
}
@end

@export ecgl.forceAtlas2.calcGlobalSpeed

uniform sampler2D globalSpeedPrevTex;
uniform sampler2D weightedSumTex;
uniform float jitterTolerence;

void main() {
 vec2 weightedSum = texture2D(weightedSumTex, vec2(0.5)).xy;
 float prevGlobalSpeed = texture2D(globalSpeedPrevTex, vec2(0.5)).x;
 float globalSpeed = jitterTolerence * jitterTolerence
 * weightedSum.y / weightedSum.x;
 if (prevGlobalSpeed > 0.0) {
 globalSpeed = min(globalSpeed / prevGlobalSpeed, 1.5) * prevGlobalSpeed;
 }
 gl_FragColor = vec4(globalSpeed, 0.0, 0.0, 1.0);
}
@end

@export ecgl.forceAtlas2.updatePosition

uniform sampler2D forceTex;
uniform sampler2D forcePrevTex;
uniform sampler2D positionTex;
uniform sampler2D globalSpeedTex;

varying vec2 v_Texcoord;

void main() {
 vec2 force = texture2D(forceTex, v_Texcoord).xy;
 vec2 forcePrev = texture2D(forcePrevTex, v_Texcoord).xy;
 vec4 node = texture2D(positionTex, v_Texcoord);

 float globalSpeed = texture2D(globalSpeedTex, vec2(0.5)).r;
 float swing = length(force - forcePrev);
 float speed = 0.1 * globalSpeed / (0.1 + globalSpeed * sqrt(swing));

 float df = length(force);
 if (df > 0.0) {
 speed = min(df * speed, 10.0) / df;

 gl_FragColor = vec4(node.xy + speed * force, node.zw);
 }
 else {
 gl_FragColor = node;
 }
}
@end

@export ecgl.forceAtlas2.edges.vertex
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

attribute vec2 node;
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;

uniform sampler2D positionTex;

void main()
{
 gl_Position = worldViewProjection * vec4(
 texture2D(positionTex, node).xy, -10.0, 1.0
 );
 v_Color = a_Color;
}
@end

@export ecgl.forceAtlas2.edges.fragment
uniform vec4 color : [1.0, 1.0, 1.0, 1.0];
varying vec4 v_Color;
void main() {
 gl_FragColor = color * v_Color;
}
@end`);var Sh={repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,scaling:1,edgeWeightInfluence:1,jitterTolerence:.1,preventOverlap:!1,dissuadeHubs:!1,gravityCenter:null};function at(e){var t={type:S.Texture.FLOAT,minFilter:S.Texture.NEAREST,magFilter:S.Texture.NEAREST};this._positionSourceTex=new S.Texture2D(t),this._positionSourceTex.flipY=!1,this._positionTex=new S.Texture2D(t),this._positionPrevTex=new S.Texture2D(t),this._forceTex=new S.Texture2D(t),this._forcePrevTex=new S.Texture2D(t),this._weightedSumTex=new S.Texture2D(t),this._weightedSumTex.width=this._weightedSumTex.height=1,this._globalSpeedTex=new S.Texture2D(t),this._globalSpeedPrevTex=new S.Texture2D(t),this._globalSpeedTex.width=this._globalSpeedTex.height=1,this._globalSpeedPrevTex.width=this._globalSpeedPrevTex.height=1,this._nodeRepulsionPass=new Fe({fragment:S.Shader.source("ecgl.forceAtlas2.updateNodeRepulsion")}),this._positionPass=new Fe({fragment:S.Shader.source("ecgl.forceAtlas2.updatePosition")}),this._globalSpeedPass=new Fe({fragment:S.Shader.source("ecgl.forceAtlas2.calcGlobalSpeed")}),this._copyPass=new Fe({fragment:S.Shader.source("clay.compositor.output")});var r=function(i){i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ONE)};this._edgeForceMesh=new S.Mesh({geometry:new S.Geometry({attributes:{node1:new S.Geometry.Attribute("node1","float",2),node2:new S.Geometry.Attribute("node2","float",2),weight:new S.Geometry.Attribute("weight","float",1)},dynamic:!0,mainAttribute:"node1"}),material:new S.Material({transparent:!0,shader:S.createShader("ecgl.forceAtlas2.updateEdgeAttraction"),blend:r,depthMask:!1,depthText:!1}),mode:S.Mesh.POINTS}),this._weightedSumMesh=new S.Mesh({geometry:new S.Geometry({attributes:{node:new S.Geometry.Attribute("node","float",2)},dynamic:!0,mainAttribute:"node"}),material:new S.Material({transparent:!0,shader:S.createShader("ecgl.forceAtlas2.calcWeightedSum"),blend:r,depthMask:!1,depthText:!1}),mode:S.Mesh.POINTS}),this._framebuffer=new Je({depthBuffer:!1}),this._dummyCamera=new S.OrthographicCamera({left:-1,right:1,top:1,bottom:-1,near:0,far:100}),this._globalSpeed=0}at.prototype.updateOption=function(e){for(var t in Sh)this[t]=Sh[t];var r=this._nodes.length;if(r>5e4?this.jitterTolerence=10:r>5e3?this.jitterTolerence=1:this.jitterTolerence=.1,r>100?this.scaling=2:this.scaling=10,e)for(var t in Sh)e[t]!=null&&(this[t]=e[t]);if(this.repulsionByDegree)for(var i=this._positionSourceTex.pixels,n=0;n<this._nodes.length;n++)i[n*4+2]=(this._nodes[n].degree||0)+1},at.prototype._updateGravityCenter=function(e){var t=this._nodes,r=this._edges;if(this.gravityCenter)this._gravityCenter=this.gravityCenter;else{for(var i=[1/0,1/0],n=[-1/0,-1/0],a=0;a<t.length;a++)i[0]=Math.min(t[a].x,i[0]),i[1]=Math.min(t[a].y,i[1]),n[0]=Math.max(t[a].x,n[0]),n[1]=Math.max(t[a].y,n[1]);this._gravityCenter=[(i[0]+n[0])*.5,(i[1]+n[1])*.5]}for(var a=0;a<r.length;a++){var o=r[a].node1,s=r[a].node2;t[o].degree=(t[o].degree||0)+1,t[s].degree=(t[s].degree||0)+1}},at.prototype.initData=function(e,t){this._nodes=e,this._edges=t,this._updateGravityCenter();var r=Math.ceil(Math.sqrt(e.length)),i=r,n=new Float32Array(r*i*4);this._resize(r,i);for(var a=0,o=0;o<e.length;o++){var s=e[o];n[a++]=s.x||0,n[a++]=s.y||0,n[a++]=s.mass||1,n[a++]=s.size||1}this._positionSourceTex.pixels=n;var l=this._edgeForceMesh.geometry,u=t.length;l.attributes.node1.init(u*2),l.attributes.node2.init(u*2),l.attributes.weight.init(u*2);for(var h=[],o=0;o<t.length;o++){var f=l.attributes,c=t[o].weight;c==null&&(c=1),f.node1.set(o,this.getNodeUV(t[o].node1,h)),f.node2.set(o,this.getNodeUV(t[o].node2,h)),f.weight.set(o,c),f.node1.set(o+u,this.getNodeUV(t[o].node2,h)),f.node2.set(o+u,this.getNodeUV(t[o].node1,h)),f.weight.set(o+u,c)}var d=this._weightedSumMesh.geometry;d.attributes.node.init(e.length);for(var o=0;o<e.length;o++)d.attributes.node.set(o,this.getNodeUV(o,h));l.dirty(),d.dirty(),this._nodeRepulsionPass.material.define("fragment","NODE_COUNT",e.length),this._nodeRepulsionPass.material.setUniform("textureSize",[r,i]),this._inited=!1,this._frame=0},at.prototype.getNodes=function(){return this._nodes},at.prototype.getEdges=function(){return this._edges},at.prototype.step=function(e){this._inited||(this._initFromSource(e),this._inited=!0),this._frame++,this._framebuffer.attach(this._forceTex),this._framebuffer.bind(e);var t=this._nodeRepulsionPass;t.setUniform("strongGravityMode",this.strongGravityMode),t.setUniform("gravity",this.gravity),t.setUniform("gravityCenter",this._gravityCenter),t.setUniform("scaling",this.scaling),t.setUniform("preventOverlap",this.preventOverlap),t.setUniform("positionTex",this._positionPrevTex),t.render(e);var r=this._edgeForceMesh;r.material.set("linLogMode",this.linLogMode),r.material.set("edgeWeightInfluence",this.edgeWeightInfluence),r.material.set("preventOverlap",this.preventOverlap),r.material.set("positionTex",this._positionPrevTex),e.gl.enable(e.gl.BLEND),e.renderPass([r],this._dummyCamera),this._framebuffer.attach(this._weightedSumTex),e.gl.clearColor(0,0,0,0),e.gl.clear(e.gl.COLOR_BUFFER_BIT),e.gl.enable(e.gl.BLEND);var i=this._weightedSumMesh;i.material.set("positionTex",this._positionPrevTex),i.material.set("forceTex",this._forceTex),i.material.set("forcePrevTex",this._forcePrevTex),e.renderPass([i],this._dummyCamera),this._framebuffer.attach(this._globalSpeedTex);var n=this._globalSpeedPass;n.setUniform("globalSpeedPrevTex",this._globalSpeedPrevTex),n.setUniform("weightedSumTex",this._weightedSumTex),n.setUniform("jitterTolerence",this.jitterTolerence),e.gl.disable(e.gl.BLEND),n.render(e);var a=this._positionPass;this._framebuffer.attach(this._positionTex),a.setUniform("globalSpeedTex",this._globalSpeedTex),a.setUniform("positionTex",this._positionPrevTex),a.setUniform("forceTex",this._forceTex),a.setUniform("forcePrevTex",this._forcePrevTex),a.render(e),this._framebuffer.unbind(e),this._swapTexture()},at.prototype.update=function(e,t,r){t==null&&(t=1),t=Math.max(t,1);for(var i=0;i<t;i++)this.step(e);r&&r()},at.prototype.getNodePositionTexture=function(){return this._inited?this._positionPrevTex:this._positionSourceTex},at.prototype.getNodeUV=function(e,t){t=t||[];var r=this._positionTex.width,i=this._positionTex.height;return t[0]=e%r/(r-1),t[1]=Math.floor(e/r)/(i-1)||0,t},at.prototype.getNodePosition=function(e,t){var r=this._positionArr,i=this._positionTex.width,n=this._positionTex.height,a=i*n;(!r||r.length!==a*4)&&(r=this._positionArr=new Float32Array(a*4)),this._framebuffer.bind(e),this._framebuffer.attach(this._positionPrevTex),e.gl.readPixels(0,0,i,n,e.gl.RGBA,e.gl.FLOAT,r),this._framebuffer.unbind(e),t||(t=new Float32Array(this._nodes.length*2));for(var o=0;o<this._nodes.length;o++)t[o*2]=r[o*4],t[o*2+1]=r[o*4+1];return t},at.prototype.getTextureData=function(e,t){var r=this["_"+t+"Tex"],i=r.width,n=r.height;this._framebuffer.bind(e),this._framebuffer.attach(r);var a=new Float32Array(i*n*4);return e.gl.readPixels(0,0,i,n,e.gl.RGBA,e.gl.FLOAT,a),this._framebuffer.unbind(e),a},at.prototype.getTextureSize=function(){return{width:this._positionTex.width,height:this._positionTex.height}},at.prototype.isFinished=function(e){return this._frame>e},at.prototype._swapTexture=function(){var e=this._positionPrevTex;this._positionPrevTex=this._positionTex,this._positionTex=e;var e=this._forcePrevTex;this._forcePrevTex=this._forceTex,this._forceTex=e;var e=this._globalSpeedPrevTex;this._globalSpeedPrevTex=this._globalSpeedTex,this._globalSpeedTex=e},at.prototype._initFromSource=function(e){this._framebuffer.attach(this._positionPrevTex),this._framebuffer.bind(e),this._copyPass.setUniform("texture",this._positionSourceTex),this._copyPass.render(e),e.gl.clearColor(0,0,0,0),this._framebuffer.attach(this._forcePrevTex),e.gl.clear(e.gl.COLOR_BUFFER_BIT),this._framebuffer.attach(this._globalSpeedPrevTex),e.gl.clear(e.gl.COLOR_BUFFER_BIT),this._framebuffer.unbind(e)},at.prototype._resize=function(e,t){["_positionSourceTex","_positionTex","_positionPrevTex","_forceTex","_forcePrevTex"].forEach(function(r){this[r].width=e,this[r].height=t,this[r].dirty()},this)},at.prototype.dispose=function(e){this._framebuffer.dispose(e),this._copyPass.dispose(e),this._nodeRepulsionPass.dispose(e),this._positionPass.dispose(e),this._globalSpeedPass.dispose(e),this._edgeForceMesh.geometry.dispose(e),this._weightedSumMesh.geometry.dispose(e),this._positionSourceTex.dispose(e),this._positionTex.dispose(e),this._positionPrevTex.dispose(e),this._forceTex.dispose(e),this._forcePrevTex.dispose(e),this._weightedSumTex.dispose(e),this._globalSpeedTex.dispose(e),this._globalSpeedPrevTex.dispose(e)};let Rs=at;function bS(){var e={create:function(){return new Float32Array(2)},dist:function(l,u){var h=u[0]-l[0],f=u[1]-l[1];return Math.sqrt(h*h+f*f)},len:function(l){var u=l[0],h=l[1];return Math.sqrt(u*u+h*h)},scaleAndAdd:function(l,u,h,f){return l[0]=u[0]+h[0]*f,l[1]=u[1]+h[1]*f,l},scale:function(l,u,h){return l[0]=u[0]*h,l[1]=u[1]*h,l},add:function(l,u,h){return l[0]=u[0]+h[0],l[1]=u[1]+h[1],l},sub:function(l,u,h){return l[0]=u[0]-h[0],l[1]=u[1]-h[1],l},normalize:function(l,u){var h=u[0],f=u[1],c=h*h+f*f;return c>0&&(c=1/Math.sqrt(c),l[0]=u[0]*c,l[1]=u[1]*c),l},negate:function(l,u){return l[0]=-u[0],l[1]=-u[1],l},copy:function(l,u){return l[0]=u[0],l[1]=u[1],l},set:function(l,u,h){return l[0]=u,l[1]=h,l}};function t(){this.subRegions=[],this.nSubRegions=0,this.node=null,this.mass=0,this.centerOfMass=null,this.bbox=new Float32Array(4),this.size=0}var r=t.prototype;r.beforeUpdate=function(){for(var l=0;l<this.nSubRegions;l++)this.subRegions[l].beforeUpdate();this.mass=0,this.centerOfMass&&(this.centerOfMass[0]=0,this.centerOfMass[1]=0),this.nSubRegions=0,this.node=null},r.afterUpdate=function(){this.subRegions.length=this.nSubRegions;for(var l=0;l<this.nSubRegions;l++)this.subRegions[l].afterUpdate()},r.addNode=function(l){if(this.nSubRegions===0)if(this.node==null){this.node=l;return}else this._addNodeToSubRegion(this.node),this.node=null;this._addNodeToSubRegion(l),this._updateCenterOfMass(l)},r.findSubRegion=function(l,u){for(var h=0;h<this.nSubRegions;h++){var f=this.subRegions[h];if(f.contain(l,u))return f}},r.contain=function(l,u){return this.bbox[0]<=l&&this.bbox[2]>=l&&this.bbox[1]<=u&&this.bbox[3]>=u},r.setBBox=function(l,u,h,f){this.bbox[0]=l,this.bbox[1]=u,this.bbox[2]=h,this.bbox[3]=f,this.size=(h-l+f-u)/2},r._newSubRegion=function(){var l=this.subRegions[this.nSubRegions];return l||(l=new t,this.subRegions[this.nSubRegions]=l),this.nSubRegions++,l},r._addNodeToSubRegion=function(l){var u=this.findSubRegion(l.position[0],l.position[1]),h=this.bbox;if(!u){var f=(h[0]+h[2])/2,c=(h[1]+h[3])/2,d=(h[2]-h[0])/2,v=(h[3]-h[1])/2,p=l.position[0]>=f?1:0,_=l.position[1]>=c?1:0,u=this._newSubRegion();u.setBBox(p*d+h[0],_*v+h[1],(p+1)*d+h[0],(_+1)*v+h[1])}u.addNode(l)},r._updateCenterOfMass=function(l){this.centerOfMass==null&&(this.centerOfMass=new Float32Array(2));var u=this.centerOfMass[0]*this.mass,h=this.centerOfMass[1]*this.mass;u+=l.position[0]*l.mass,h+=l.position[1]*l.mass,this.mass+=l.mass,this.centerOfMass[0]=u/this.mass,this.centerOfMass[1]=h/this.mass};function i(){this.position=new Float32Array(2),this.force=e.create(),this.forcePrev=e.create(),this.mass=1,this.inDegree=0,this.outDegree=0}function n(l,u){this.source=l,this.target=u,this.weight=1}function a(){this.autoSettings=!0,this.barnesHutOptimize=!0,this.barnesHutTheta=1.5,this.repulsionByDegree=!0,this.linLogMode=!1,this.strongGravityMode=!1,this.gravity=1,this.scaling=1,this.edgeWeightInfluence=1,this.jitterTolerence=.1,this.preventOverlap=!1,this.dissuadeHubs=!1,this.rootRegion=new t,this.rootRegion.centerOfMass=e.create(),this.nodes=[],this.edges=[],this.bbox=new Float32Array(4),this.gravityCenter=null,this._massArr=null,this._swingingArr=null,this._sizeArr=null,this._globalSpeed=0}var o=a.prototype;o.initNodes=function(l,u,h){var f=u.length;this.nodes.length=0;for(var c=typeof h<"u",d=0;d<f;d++){var v=new i;v.position[0]=l[d*2],v.position[1]=l[d*2+1],v.mass=u[d],c&&(v.size=h[d]),this.nodes.push(v)}this._massArr=u,this._swingingArr=new Float32Array(f),c&&(this._sizeArr=h)},o.initEdges=function(l,u){var h=l.length/2;this.edges.length=0;for(var f=0;f<h;f++){var c=l[f*2],d=l[f*2+1],v=this.nodes[c],p=this.nodes[d];if(!v||!p){console.error("Node not exists, try initNodes before initEdges");return}v.outDegree++,p.inDegree++;var _=new n(v,p);u&&(_.weight=u[f]),this.edges.push(_)}},o.updateSettings=function(){if(this.repulsionByDegree)for(var l=0;l<this.nodes.length;l++){var u=this.nodes[l];u.mass=u.inDegree+u.outDegree+1}else for(var l=0;l<this.nodes.length;l++){var u=this.nodes[l];u.mass=this._massArr[l]}},o.update=function(){var l=this.nodes.length;if(this.updateSettings(),this.updateBBox(),this.barnesHutOptimize){this.rootRegion.setBBox(this.bbox[0],this.bbox[1],this.bbox[2],this.bbox[3]),this.rootRegion.beforeUpdate();for(var u=0;u<l;u++)this.rootRegion.addNode(this.nodes[u]);this.rootRegion.afterUpdate()}for(var u=0;u<l;u++){var h=this.nodes[u];e.copy(h.forcePrev,h.force),e.set(h.force,0,0)}for(var u=0;u<l;u++){var f=this.nodes[u];if(this.barnesHutOptimize)this.applyRegionToNodeRepulsion(this.rootRegion,f);else for(var c=u+1;c<l;c++){var d=this.nodes[c];this.applyNodeToNodeRepulsion(f,d,!1)}this.gravity>0&&(this.strongGravityMode?this.applyNodeStrongGravity(f):this.applyNodeGravity(f))}for(var u=0;u<this.edges.length;u++)this.applyEdgeAttraction(this.edges[u]);for(var v=0,p=0,_=e.create(),u=0;u<l;u++){var h=this.nodes[u],g=e.dist(h.force,h.forcePrev);v+=g*h.mass,e.add(_,h.force,h.forcePrev);var m=e.len(_)*.5;p+=m*h.mass,this._swingingArr[u]=g}var y=this.jitterTolerence*this.jitterTolerence*p/v;this._globalSpeed>0&&(y=Math.min(y/this._globalSpeed,1.5)*this._globalSpeed),this._globalSpeed=y;for(var u=0;u<l;u++){var h=this.nodes[u],g=this._swingingArr[u],x=.1*y/(1+y*Math.sqrt(g)),w=e.len(h.force);w>0&&(x=Math.min(w*x,10)/w,e.scaleAndAdd(h.position,h.position,h.force,x))}},o.applyRegionToNodeRepulsion=(function(){var l=e.create();return function(h,f){if(h.node)this.applyNodeToNodeRepulsion(h.node,f,!0);else{e.sub(l,f.position,h.centerOfMass);var c=l[0]*l[0]+l[1]*l[1];if(c>this.barnesHutTheta*h.size*h.size){var d=this.scaling*f.mass*h.mass/c;e.scaleAndAdd(f.force,f.force,l,d)}else for(var v=0;v<h.nSubRegions;v++)this.applyRegionToNodeRepulsion(h.subRegions[v],f)}}})(),o.applyNodeToNodeRepulsion=(function(){var l=e.create();return function(h,f,c){if(h!=f){e.sub(l,h.position,f.position);var d=l[0]*l[0]+l[1]*l[1];if(d!==0){var v;if(this.preventOverlap){var p=Math.sqrt(d);if(p=p-h.size-f.size,p>0)v=this.scaling*h.mass*f.mass/(p*p);else if(p<0)v=this.scaling*100*h.mass*f.mass;else return}else v=this.scaling*h.mass*f.mass/d;e.scaleAndAdd(h.force,h.force,l,v),e.scaleAndAdd(f.force,f.force,l,-v)}}}})(),o.applyEdgeAttraction=(function(){var l=e.create();return function(h){var f=h.source,c=h.target;e.sub(l,f.position,c.position);var d=e.len(l),v;this.edgeWeightInfluence===0?v=1:this.edgeWeightInfluence===1?v=h.weight:v=Math.pow(h.weight,this.edgeWeightInfluence);var p;this.preventOverlap&&(d=d-f.size-c.size,d<=0)||(this.linLogMode?p=-v*Math.log(d+1)/(d+1):p=-v,e.scaleAndAdd(f.force,f.force,l,p),e.scaleAndAdd(c.force,c.force,l,-p))}})(),o.applyNodeGravity=(function(){var l=e.create();return function(u){e.sub(l,this.gravityCenter,u.position);var h=e.len(l);e.scaleAndAdd(u.force,u.force,l,this.gravity*u.mass/(h+1))}})(),o.applyNodeStrongGravity=(function(){var l=e.create();return function(u){e.sub(l,this.gravityCenter,u.position),e.scaleAndAdd(u.force,u.force,l,this.gravity*u.mass)}})(),o.updateBBox=function(){for(var l=1/0,u=1/0,h=-1/0,f=-1/0,c=0;c<this.nodes.length;c++){var d=this.nodes[c].position;l=Math.min(l,d[0]),u=Math.min(u,d[1]),h=Math.max(h,d[0]),f=Math.max(f,d[1])}this.bbox[0]=l,this.bbox[1]=u,this.bbox[2]=h,this.bbox[3]=f},o.getGlobalSpeed=function(){return this._globalSpeed};var s=null;self.onmessage=function(l){switch(l.data.cmd){case"init":s=new a,s.initNodes(l.data.nodesPosition,l.data.nodesMass,l.data.nodesSize),s.initEdges(l.data.edges,l.data.edgesWeight);break;case"updateConfig":if(s)for(var u in l.data.config)s[u]=l.data.config[u];break;case"update":var h=l.data.steps;if(s){for(var f=0;f<h;f++)s.update();for(var c=s.nodes.length,d=new Float32Array(c*2),f=0;f<c;f++){var v=s.nodes[f];d[f*2]=v.position[0],d[f*2+1]=v.position[1]}self.postMessage({buffer:d.buffer,globalSpeed:s.getGlobalSpeed()},[d.buffer])}else{var p=new Float32Array;self.postMessage({buffer:p.buffer,globalSpeed:s.getGlobalSpeed()},[p.buffer])}break}}}var Ua=bS.toString();Ua=Ua.slice(Ua.indexOf("{")+1,Ua.lastIndexOf("}"));var za={barnesHutOptimize:!0,barnesHutTheta:1.5,repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,scaling:1,edgeWeightInfluence:1,jitterTolerence:.1,preventOverlap:!1,dissuadeHubs:!1,gravityCenter:null},Ot=function(e){for(var t in za)this[t]=za[t];if(e)for(var t in e)this[t]=e[t];this._nodes=[],this._edges=[],this._disposed=!1,this._positionTex=new ee({type:X.FLOAT,flipY:!1,minFilter:X.NEAREST,magFilter:X.NEAREST})};Ot.prototype.initData=function(e,t){var r=new Blob([Ua]),i=window.URL.createObjectURL(r);this._worker=new Worker(i),this._worker.onmessage=this._$onupdate.bind(this),this._nodes=e,this._edges=t,this._frame=0;for(var n=e.length,a=t.length,o=new Float32Array(n*2),s=new Float32Array(n),l=new Float32Array(n),u=new Float32Array(a*2),h=new Float32Array(a),f=0;f<e.length;f++){var c=e[f];o[f*2]=c.x,o[f*2+1]=c.y,s[f]=c.mass==null?1:c.mass,l[f]=c.size==null?1:c.size}for(var f=0;f<t.length;f++){var d=t[f],v=d.node1,p=d.node2;u[f*2]=v,u[f*2+1]=p,h[f]=d.weight==null?1:d.weight}var _=Math.ceil(Math.sqrt(e.length)),g=_,m=new Float32Array(_*g*4),y=this._positionTex;y.width=_,y.height=g,y.pixels=m,this._worker.postMessage({cmd:"init",nodesPosition:o,nodesMass:s,nodesSize:l,edges:u,edgesWeight:h}),this._globalSpeed=1/0},Ot.prototype.updateOption=function(e){var t={};for(var r in za)t[r]=za[r];var i=this._nodes,n=this._edges,a=i.length;if(a>5e4?t.jitterTolerence=10:a>5e3?t.jitterTolerence=1:t.jitterTolerence=.1,a>100?t.scaling=2:t.scaling=10,a>1e3?t.barnesHutOptimize=!0:t.barnesHutOptimize=!1,e)for(var r in za)e[r]!=null&&(t[r]=e[r]);if(!t.gravityCenter){for(var o=[1/0,1/0],s=[-1/0,-1/0],l=0;l<i.length;l++)o[0]=Math.min(i[l].x,o[0]),o[1]=Math.min(i[l].y,o[1]),s[0]=Math.max(i[l].x,s[0]),s[1]=Math.max(i[l].y,s[1]);t.gravityCenter=[(o[0]+s[0])*.5,(o[1]+s[1])*.5]}for(var l=0;l<n.length;l++){var u=n[l].node1,h=n[l].node2;i[u].degree=(i[u].degree||0)+1,i[h].degree=(i[h].degree||0)+1}this._worker&&this._worker.postMessage({cmd:"updateConfig",config:t})},Ot.prototype.update=function(e,t,r){t==null&&(t=1),t=Math.max(t,1),this._frame+=t,this._onupdate=r,this._worker&&this._worker.postMessage({cmd:"update",steps:Math.round(t)})},Ot.prototype._$onupdate=function(e){if(!this._disposed){var t=new Float32Array(e.data.buffer);this._globalSpeed=e.data.globalSpeed,this._positionArr=t,this._updateTexture(t),this._onupdate&&this._onupdate()}},Ot.prototype.getNodePositionTexture=function(){return this._positionTex},Ot.prototype.getNodeUV=function(e,t){t=t||[];var r=this._positionTex.width,i=this._positionTex.height;return t[0]=e%r/(r-1),t[1]=Math.floor(e/r)/(i-1),t},Ot.prototype.getNodes=function(){return this._nodes},Ot.prototype.getEdges=function(){return this._edges},Ot.prototype.isFinished=function(e){return this._frame>e},Ot.prototype.getNodePosition=function(e,t){if(t||(t=new Float32Array(this._nodes.length*2)),this._positionArr)for(var r=0;r<this._positionArr.length;r++)t[r]=this._positionArr[r];return t},Ot.prototype._updateTexture=function(e){for(var t=this._positionTex.pixels,r=0,i=0;i<e.length;)t[r++]=e[i++],t[r++]=e[i++],t[r++]=1,t[r++]=1;this._positionTex.dirty()},Ot.prototype.dispose=function(e){this._disposed=!0,this._worker=null};let bh=Ot;var ES=vt.extend(function(){return{zr:null,viewGL:null,minZoom:.2,maxZoom:5,_needsUpdate:!1,_dx:0,_dy:0,_zoom:1}},function(){this._mouseDownHandler=this._mouseDownHandler.bind(this),this._mouseWheelHandler=this._mouseWheelHandler.bind(this),this._mouseMoveHandler=this._mouseMoveHandler.bind(this),this._mouseUpHandler=this._mouseUpHandler.bind(this),this._update=this._update.bind(this)},{init:function(){var e=this.zr;e.on("mousedown",this._mouseDownHandler),e.on("mousewheel",this._mouseWheelHandler),e.on("globalout",this._mouseUpHandler),e.animation.on("frame",this._update)},setTarget:function(e){this._target=e},setZoom:function(e){this._zoom=Math.max(Math.min(e,this.maxZoom),this.minZoom),this._needsUpdate=!0},setOffset:function(e){this._dx=e[0],this._dy=e[1],this._needsUpdate=!0},getZoom:function(){return this._zoom},getOffset:function(){return[this._dx,this._dy]},_update:function(){if(this._target&&this._needsUpdate){var e=this._target,t=this._zoom;e.position.x=this._dx,e.position.y=this._dy,e.scale.set(t,t,t),this.zr.refresh(),this._needsUpdate=!1,this.trigger("update")}},_mouseDownHandler:function(e){if(!e.target){var t=e.offsetX,r=e.offsetY;if(!(this.viewGL&&!this.viewGL.containPoint(t,r))){this.zr.on("mousemove",this._mouseMoveHandler),this.zr.on("mouseup",this._mouseUpHandler);var i=this._convertPos(t,r);this._x=i.x,this._y=i.y}}},_convertPos:function(e,t){var r=this.viewGL.camera,i=this.viewGL.viewport;return{x:(e-i.x)/i.width*(r.right-r.left)+r.left,y:(t-i.y)/i.height*(r.bottom-r.top)+r.top}},_mouseMoveHandler:function(e){var t=this._convertPos(e.offsetX,e.offsetY);this._dx+=t.x-this._x,this._dy+=t.y-this._y,this._x=t.x,this._y=t.y,this._needsUpdate=!0},_mouseUpHandler:function(e){this.zr.off("mousemove",this._mouseMoveHandler),this.zr.off("mouseup",this._mouseUpHandler)},_mouseWheelHandler:function(e){e=e.event;var t=e.wheelDelta||-e.detail;if(t!==0){var r=e.offsetX,i=e.offsetY;if(!(this.viewGL&&!this.viewGL.containPoint(r,i))){var n=t>0?1.1:.9,a=Math.max(Math.min(this._zoom*n,this.maxZoom),this.minZoom);n=a/this._zoom;var o=this._convertPos(r,i),s=(o.x-this._dx)*(n-1),l=(o.y-this._dy)*(n-1);this._dx-=s,this._dy-=l,this._zoom=a,this._needsUpdate=!0}}},dispose:function(){var e=this.zr;e.off("mousedown",this._mouseDownHandler),e.off("mousemove",this._mouseMoveHandler),e.off("mouseup",this._mouseUpHandler),e.off("mousewheel",this._mouseWheelHandler),e.off("globalout",this._mouseUpHandler),e.animation.off("frame",this._update)}});let AS=ES,MS=`@export ecgl.lines2D.vertex

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

attribute vec2 position: POSITION;
attribute vec4 a_Color : COLOR;
varying vec4 v_Color;

#ifdef POSITIONTEXTURE_ENABLED
uniform sampler2D positionTexture;
#endif

void main()
{
 gl_Position = worldViewProjection * vec4(position, -10.0, 1.0);

 v_Color = a_Color;
}

@end

@export ecgl.lines2D.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

varying vec4 v_Color;

void main()
{
 gl_FragColor = color * v_Color;
}
@end


@export ecgl.meshLines2D.vertex

attribute vec2 position: POSITION;
attribute vec2 normal;
attribute float offset;
attribute vec4 a_Color : COLOR;

uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;
uniform vec4 viewport : VIEWPORT;

varying vec4 v_Color;
varying float v_Miter;

void main()
{
 vec4 p2 = worldViewProjection * vec4(position + normal, -10.0, 1.0);
 gl_Position = worldViewProjection * vec4(position, -10.0, 1.0);

 p2.xy /= p2.w;
 gl_Position.xy /= gl_Position.w;

 vec2 N = normalize(p2.xy - gl_Position.xy);
 gl_Position.xy += N * offset / viewport.zw * 2.0;

 gl_Position.xy *= gl_Position.w;

 v_Color = a_Color;
}
@end


@export ecgl.meshLines2D.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];

varying vec4 v_Color;
varying float v_Miter;

void main()
{
 gl_FragColor = color * v_Color;
}

@end`;var Ns=Ue.vec2;S.Shader.import(MS);var DS=1;let CS=A.ChartView.extend({type:"graphGL",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this.viewGL=new Vr("orthographic"),this.viewGL.camera.left=this.viewGL.camera.right=0,this.viewGL.add(this.groupGL),this._pointsBuilder=new Ba(!0,t),this._forceEdgesMesh=new S.Mesh({material:new S.Material({shader:S.createShader("ecgl.forceAtlas2.edges"),transparent:!0,depthMask:!1,depthTest:!1}),$ignorePicking:!0,geometry:new S.Geometry({attributes:{node:new S.Geometry.Attribute("node","float",2),color:new S.Geometry.Attribute("color","float",4,"COLOR")},dynamic:!0,mainAttribute:"node"}),renderOrder:-1,mode:S.Mesh.LINES}),this._edgesMesh=new S.Mesh({material:new S.Material({shader:S.createShader("ecgl.meshLines2D"),transparent:!0,depthMask:!1,depthTest:!1}),$ignorePicking:!0,geometry:new Zp({useNativeLine:!1,dynamic:!0}),renderOrder:-1,culling:!1}),this._layoutId=0,this._control=new AS({zr:t.getZr(),viewGL:this.viewGL}),this._control.setTarget(this.groupGL),this._control.init(),this._clickHandler=this._clickHandler.bind(this)},render:function(e,t,r){this.groupGL.add(this._pointsBuilder.rootNode),this._model=e,this._api=r,this._initLayout(e,t,r),this._pointsBuilder.update(e,t,r),this._forceLayoutInstance instanceof Rs||this.groupGL.remove(this._forceEdgesMesh),this._updateCamera(e,r),this._control.off("update"),this._control.on("update",function(){r.dispatchAction({type:"graphGLRoam",seriesId:e.id,zoom:this._control.getZoom(),offset:this._control.getOffset()}),this._pointsBuilder.updateView(this.viewGL.camera)},this),this._control.setZoom(te.firstNotNull(e.get("zoom"),1)),this._control.setOffset(e.get("offset")||[0,0]);var i=this._pointsBuilder.getPointsMesh();if(i.off("mousemove",this._mousemoveHandler),i.off("mouseout",this._mouseOutHandler,this),r.getZr().off("click",this._clickHandler),this._pointsBuilder.highlightOnMouseover=!0,e.get("focusNodeAdjacency")){var n=e.get("focusNodeAdjacencyOn");n==="click"?r.getZr().on("click",this._clickHandler):n==="mouseover"?(i.on("mousemove",this._mousemoveHandler,this),i.on("mouseout",this._mouseOutHandler,this),this._pointsBuilder.highlightOnMouseover=!1):console.warn("Unkown focusNodeAdjacencyOn value s"+n)}this._lastMouseOverDataIndex=-1},_clickHandler:function(e){if(!this._layouting){var t=this._pointsBuilder.getPointsMesh().dataIndex;t>=0?this._api.dispatchAction({type:"graphGLFocusNodeAdjacency",seriesId:this._model.id,dataIndex:t}):this._api.dispatchAction({type:"graphGLUnfocusNodeAdjacency",seriesId:this._model.id})}},_mousemoveHandler:function(e){if(!this._layouting){var t=this._pointsBuilder.getPointsMesh().dataIndex;t>=0?t!==this._lastMouseOverDataIndex&&this._api.dispatchAction({type:"graphGLFocusNodeAdjacency",seriesId:this._model.id,dataIndex:t}):this._mouseOutHandler(e),this._lastMouseOverDataIndex=t}},_mouseOutHandler:function(e){this._layouting||(this._api.dispatchAction({type:"graphGLUnfocusNodeAdjacency",seriesId:this._model.id}),this._lastMouseOverDataIndex=-1)},_updateForceEdgesGeometry:function(e,t){var r=this._forceEdgesMesh.geometry,i=t.getEdgeData(),n=0,a=this._forceLayoutInstance,o=i.count()*2;r.attributes.node.init(o),r.attributes.color.init(o),i.each(function(s){var l=e[s];r.attributes.node.set(n,a.getNodeUV(l.node1)),r.attributes.node.set(n+1,a.getNodeUV(l.node2));var u=$e(i,l.dataIndex),h=S.parseColor(u);h[3]*=te.firstNotNull(et(i,l.dataIndex),1),r.attributes.color.set(n,h),r.attributes.color.set(n+1,h),n+=2}),r.dirty()},_updateMeshLinesGeometry:function(){var t=this._model.getEdgeData(),e=this._edgesMesh.geometry,t=this._model.getEdgeData(),r=this._model.getData().getLayout("points");e.resetOffset(),e.setVertexCount(t.count()*e.getLineVertexCount()),e.setTriangleCount(t.count()*e.getLineTriangleCount());var i=[],n=[],a=["lineStyle","width"];this._originalEdgeColors=new Float32Array(t.count()*4),this._edgeIndicesMap=new Float32Array(t.count()),t.each(function(o){var s=t.graph.getEdgeByIndex(o),l=s.node1.dataIndex*2,u=s.node2.dataIndex*2;i[0]=r[l],i[1]=r[l+1],n[0]=r[u],n[1]=r[u+1];var h=$e(t,s.dataIndex),f=S.parseColor(h);f[3]*=te.firstNotNull(et(t,s.dataIndex),1);var c=t.getItemModel(s.dataIndex),d=te.firstNotNull(c.get(a),1)*this._api.getDevicePixelRatio();e.addLine(i,n,f,d);for(var v=0;v<4;v++)this._originalEdgeColors[s.dataIndex*4+v]=f[v];this._edgeIndicesMap[s.dataIndex]=o},this),e.dirty()},_updateForceNodesGeometry:function(e){for(var t=this._pointsBuilder.getPointsMesh(),r=[],i=0;i<e.count();i++)this._forceLayoutInstance.getNodeUV(i,r),t.geometry.attributes.position.set(i,r);t.geometry.dirty("position")},_initLayout:function(e,t,r){var i=e.get("layout"),n=e.getGraph(),a=e.getBoxLayoutParams(),o=Ea(a,{width:r.getWidth(),height:r.getHeight()});i==="force"&&(console.warn("Currently only forceAtlas2 layout supported."),i="forceAtlas2"),this.stopLayout(e,t,r,{beforeLayout:!0});var s=e.getData(),l=e.getData();if(i==="forceAtlas2"){var u=e.getModel("forceAtlas2"),h=this._forceLayoutInstance,f=[],c=[],d=s.getDataExtent("value"),v=l.getDataExtent("value"),p=te.firstNotNull(u.get("edgeWeight"),1),_=te.firstNotNull(u.get("nodeWeight"),1);typeof p=="number"&&(p=[p,p]),typeof _=="number"&&(_=[_,_]);var g=0,m={},y=new Float32Array(s.count()*2);if(n.eachNode(function(w){var T=w.dataIndex,E=s.get("value",T),b,D;if(s.hasItemOption){var L=s.getItemModel(T);b=L.get("x"),D=L.get("y")}b==null&&(b=o.x+Math.random()*o.width,D=o.y+Math.random()*o.height),y[g*2]=b,y[g*2+1]=D,m[w.id]=g++;var M=A.number.linearMap(E,d,_);isNaN(M)&&(isNaN(_[0])?M=1:M=_[0]),f.push({x:b,y:D,mass:M,size:s.getItemVisual(T,"symbolSize")})}),s.setLayout("points",y),n.eachEdge(function(w){var T=w.dataIndex,E=s.get("value",T),b=A.number.linearMap(E,v,p);isNaN(b)&&(isNaN(p[0])?b=1:b=p[0]),c.push({node1:m[w.node1.id],node2:m[w.node2.id],weight:b,dataIndex:T})}),!h){var x=u.get("GPU");this._forceLayoutInstance&&(x&&!(this._forceLayoutInstance instanceof Rs)||!x&&!(this._forceLayoutInstance instanceof bh))&&(this._forceLayoutInstanceToDispose=this._forceLayoutInstance),h=this._forceLayoutInstance=x?new Rs:new bh}h.initData(f,c),h.updateOption(u.option),this._updateForceEdgesGeometry(h.getEdges(),e),this._updatePositionTexture(),r.dispatchAction({type:"graphGLStartLayout",from:this.uid})}else{var y=new Float32Array(s.count()*2),g=0;n.eachNode(function(E){var b=E.dataIndex,D,L;if(s.hasItemOption){var M=s.getItemModel(b);D=M.get("x"),L=M.get("y")}y[g++]=D,y[g++]=L}),s.setLayout("points",y),this._updateAfterLayout(e,t,r)}},_updatePositionTexture:function(){var e=this._forceLayoutInstance.getNodePositionTexture();this._pointsBuilder.setPositionTexture(e),this._forceEdgesMesh.material.set("positionTex",e)},startLayout:function(e,t,a,i){if(!(i&&i.from!=null&&i.from!==this.uid)){var n=this.viewGL,a=this._api,o=this._forceLayoutInstance,s=this._model.getData(),l=this._model.getModel("forceAtlas2");if(!o){console.error("None layout don't have startLayout action");return}if(this.groupGL.remove(this._edgesMesh),this.groupGL.add(this._forceEdgesMesh),!!this._forceLayoutInstance){this._updateForceNodesGeometry(e.getData()),this._pointsBuilder.hideLabels();var u=this,h=this._layoutId=DS++,f=l.getShallow("maxSteps"),c=l.getShallow("steps"),d=0,v=Math.max(c*2,20),p=function(_){if(_===u._layoutId){if(o.isFinished(f)){a.dispatchAction({type:"graphGLStopLayout",from:u.uid}),a.dispatchAction({type:"graphGLFinishLayout",points:s.getLayout("points"),from:u.uid});return}o.update(n.layer.renderer,c,function(){u._updatePositionTexture(),d+=c,d>=v&&(u._syncNodePosition(e),d=0),a.getZr().refresh(),Cl(function(){p(_)})})}};Cl(function(){u._forceLayoutInstanceToDispose&&(u._forceLayoutInstanceToDispose.dispose(n.layer.renderer),u._forceLayoutInstanceToDispose=null),p(h)}),this._layouting=!0}}},stopLayout:function(e,t,r,i){i&&i.from!=null&&i.from!==this.uid||(this._layoutId=0,this.groupGL.remove(this._forceEdgesMesh),this.groupGL.add(this._edgesMesh),this._forceLayoutInstance&&this.viewGL.layer&&(i&&i.beforeLayout||(this._syncNodePosition(e),this._updateAfterLayout(e,t,r)),this._api.getZr().refresh(),this._layouting=!1))},_syncNodePosition:function(e){var t=this._forceLayoutInstance.getNodePosition(this.viewGL.layer.renderer);e.getData().setLayout("points",t),e.setNodePosition(t)},_updateAfterLayout:function(e,t,r){this._updateMeshLinesGeometry(),this._pointsBuilder.removePositionTexture(),this._pointsBuilder.updateLayout(e,t,r),this._pointsBuilder.updateView(this.viewGL.camera),this._pointsBuilder.updateLabels(),this._pointsBuilder.showLabels()},focusNodeAdjacency:function(e,t,r,i){var n=this._model.getData();this._downplayAll();var a=i.dataIndex,o=n.graph,s=[],l=o.getNodeByIndex(a);s.push(l),l.edges.forEach(function(h){h.dataIndex<0||(h.node1!==l&&s.push(h.node1),h.node2!==l&&s.push(h.node2))},this),this._pointsBuilder.fadeOutAll(.05),this._fadeOutEdgesAll(.05),s.forEach(function(h){this._pointsBuilder.highlight(n,h.dataIndex)},this),this._pointsBuilder.updateLabels(s.map(function(h){return h.dataIndex}));var u=[];l.edges.forEach(function(h){h.dataIndex>=0&&(this._highlightEdge(h.dataIndex),u.push(h))},this),this._focusNodes=s,this._focusEdges=u},unfocusNodeAdjacency:function(e,t,r,i){this._downplayAll(),this._pointsBuilder.fadeInAll(),this._fadeInEdgesAll(),this._pointsBuilder.updateLabels()},_highlightEdge:function(e){var t=this._model.getEdgeData().getItemModel(e),r=S.parseColor(t.get("emphasis.lineStyle.color")||t.get("lineStyle.color")),i=te.firstNotNull(t.get("emphasis.lineStyle.opacity"),t.get("lineStyle.opacity"),1);r[3]*=i,this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[e],r)},_downplayAll:function(){this._focusNodes&&this._focusNodes.forEach(function(e){this._pointsBuilder.downplay(this._model.getData(),e.dataIndex)},this),this._focusEdges&&this._focusEdges.forEach(function(e){this._downplayEdge(e.dataIndex)},this)},_downplayEdge:function(e){var t=this._getColor(e,[]);this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[e],t)},_setEdgeFade:(function(){var e=[];return function(t,r){this._getColor(t,e),e[3]*=r,this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[t],e)}})(),_getColor:function(e,t){for(var r=0;r<4;r++)t[r]=this._originalEdgeColors[e*4+r];return t},_fadeOutEdgesAll:function(e){var t=this._model.getData().graph;t.eachEdge(function(r){this._setEdgeFade(r.dataIndex,e)},this)},_fadeInEdgesAll:function(){this._fadeOutEdgesAll(1)},_updateCamera:function(e,t){this.viewGL.setViewport(0,0,t.getWidth(),t.getHeight(),t.getDevicePixelRatio());for(var r=this.viewGL.camera,i=e.getData(),n=i.getLayout("points"),a=Ns.create(1/0,1/0),o=Ns.create(-1/0,-1/0),s=[],l=0;l<n.length;)s[0]=n[l++],s[1]=n[l++],Ns.min(a,a,s),Ns.max(o,o,s);var u=(o[1]+a[1])/2,h=(o[0]+a[0])/2;if(!(h>r.left&&h<r.right&&u<r.bottom&&u>r.top)){var f=Math.max(o[0]-a[0],10),c=f/t.getWidth()*t.getHeight();f*=1.4,c*=1.4,a[0]-=f*.2,r.left=a[0],r.top=u-c/2,r.bottom=u+c/2,r.right=f+a[0],r.near=0,r.far=100}},dispose:function(){var e=this.viewGL.layer.renderer;this._forceLayoutInstance&&this._forceLayoutInstance.dispose(e),this.groupGL.removeAll(),this._layoutId=-1,this._pointsBuilder.dispose()},remove:function(){this.groupGL.removeAll(),this._control.dispose()}});var Is=A;function Os(e){return e instanceof Array||(e=[e,e]),e}function LS(e){Ll(Is,"ForceAtlas2",bh),Ll(Is,"ForceAtlas2GPU",Rs),e.registerChartView(CS),e.registerSeriesModel(SS),e.registerVisual(function(r){let i={};r.eachSeriesByType("graphGL",function(n){var a=n.getCategoriesData(),o=n.getData(),s={};a.each(function(l){var u=a.getName(l);s["ec-"+u]=l;var h=a.getItemModel(l),f=h.getModel("itemStyle").getItemStyle();f.fill||(f.fill=n.getColorFromPalette(u,i)),a.setItemVisual(l,"style",f);var c=["symbol","symbolSize","symbolKeepAspect"];for(let v=0;v<c.length;v++){var d=h.getShallow(c[v],!0);d!=null&&a.setItemVisual(l,c[v],d)}}),a.count()&&o.each(function(l){var u=o.getItemModel(l);let h=u.getShallow("category");if(h!=null){typeof h=="string"&&(h=s["ec-"+h]);var f=a.getItemVisual(h,"style"),c=o.ensureUniqueItemVisual(l,"style");Is.util.extend(c,f);var d=["symbol","symbolSize","symbolKeepAspect"];for(let v=0;v<d.length;v++)o.setItemVisual(l,d[v],a.getItemVisual(h,d[v]))}})})}),e.registerVisual(function(r){r.eachSeriesByType("graphGL",function(i){var n=i.getGraph(),a=i.getEdgeData(),o=Os(i.get("edgeSymbol")),s=Os(i.get("edgeSymbolSize"));a.setVisual("drawType","stroke"),a.setVisual("fromSymbol",o&&o[0]),a.setVisual("toSymbol",o&&o[1]),a.setVisual("fromSymbolSize",s&&s[0]),a.setVisual("toSymbolSize",s&&s[1]),a.setVisual("style",i.getModel("lineStyle").getLineStyle()),a.each(function(l){var u=a.getItemModel(l),h=n.getEdgeByIndex(l),f=Os(u.getShallow("symbol",!0)),c=Os(u.getShallow("symbolSize",!0)),d=u.getModel("lineStyle").getLineStyle(),v=a.ensureUniqueItemVisual(l,"style");switch(Is.util.extend(v,d),v.stroke){case"source":{var p=h.node1.getVisual("style");v.stroke=p&&p.fill;break}case"target":{var p=h.node2.getVisual("style");v.stroke=p&&p.fill;break}}f[0]&&h.setVisual("fromSymbol",f[0]),f[1]&&h.setVisual("toSymbol",f[1]),c[0]&&h.setVisual("fromSymbolSize",c[0]),c[1]&&h.setVisual("toSymbolSize",c[1])})})}),e.registerAction({type:"graphGLRoam",event:"graphglroam",update:"series.graphGL:roam"},function(r,i){i.eachComponent({mainType:"series",query:r},function(n){n.setView(r)})});function t(){}e.registerAction({type:"graphGLStartLayout",event:"graphgllayoutstarted",update:"series.graphGL:startLayout"},t),e.registerAction({type:"graphGLStopLayout",event:"graphgllayoutstopped",update:"series.graphGL:stopLayout"},t),e.registerAction({type:"graphGLFocusNodeAdjacency",event:"graphGLFocusNodeAdjacency",update:"series.graphGL:focusNodeAdjacency"},t),e.registerAction({type:"graphGLUnfocusNodeAdjacency",event:"graphGLUnfocusNodeAdjacency",update:"series.graphGL:unfocusNodeAdjacency"},t)}(0,A.use)(LS);let PS=A.SeriesModel.extend({type:"series.flowGL",dependencies:["geo","grid","bmap"],visualStyleAccessPath:"itemStyle",getInitialData:function(e,t){var r=this.get("coordinateSystem"),i=r==="geo"?["lng","lat"]:A.getCoordinateSystemDimensions(r)||["x","y"];if(i.length>2)throw new Error("flowGL can only be used on 2d coordinate systems.");i.push("vx","vy");var n=A.helper.createDimensions(this.getSource(),{coordDimensions:i,encodeDefine:this.get("encode"),dimensionsDefine:this.get("dimensions")}),a=new A.List(n,this);return a.initData(this.getSource()),a},defaultOption:{coordinateSystem:"cartesian2d",zlevel:10,supersampling:1,particleType:"point",particleDensity:128,particleSize:1,particleSpeed:1,particleTrail:2,colorTexture:null,gridWidth:"auto",gridHeight:"auto",itemStyle:{color:"#fff",opacity:.8}}});var RS=ce.extend(function(){return{dynamic:!0,attributes:{position:new ce.Attribute("position","float",3,"POSITION")}}},{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setLineCount:function(e){var t=this.attributes,r=4*e,i=2*e;this.vertexCount!==r&&t.position.init(r),this.triangleCount!==i&&(i===0?this.indices=null:this.indices=this.vertexCount>65535?new Uint32Array(i*3):new Uint16Array(i*3))},addLine:function(e){var t=this._vertexOffset;this.attributes.position.set(t,[e[0],e[1],1]),this.attributes.position.set(t+1,[e[0],e[1],-1]),this.attributes.position.set(t+2,[e[0],e[1],2]),this.attributes.position.set(t+3,[e[0],e[1],-2]),this.setTriangleIndices(this._faceOffset++,[t,t+1,t+2]),this.setTriangleIndices(this._faceOffset++,[t+1,t+2,t+3]),this._vertexOffset+=4}});let NS=RS;V.import(`@export ecgl.vfParticle.particle.fragment

uniform sampler2D particleTexture;
uniform sampler2D spawnTexture;
uniform sampler2D velocityTexture;

uniform float deltaTime;
uniform float elapsedTime;

uniform float speedScaling : 1.0;

uniform vec2 textureSize;
uniform vec4 region : [0, 0, 1, 1];
uniform float firstFrameTime;

varying vec2 v_Texcoord;


void main()
{
 vec4 p = texture2D(particleTexture, v_Texcoord);
 bool spawn = false;
 if (p.w <= 0.0) {
 p = texture2D(spawnTexture, fract(v_Texcoord + elapsedTime / 10.0));
 p.w -= firstFrameTime;
 spawn = true;
 }
 vec2 v = texture2D(velocityTexture, fract(p.xy * region.zw + region.xy)).xy;
 v = (v - 0.5) * 2.0;
 p.z = length(v);
 p.xy += v * deltaTime / 10.0 * speedScaling;
 p.w -= deltaTime;

 if (spawn || p.xy != fract(p.xy)) {
 p.z = 0.0;
 }
 p.xy = fract(p.xy);

 gl_FragColor = p;
}
@end

@export ecgl.vfParticle.renderPoints.vertex

#define PI 3.1415926

attribute vec2 texcoord : TEXCOORD_0;

uniform sampler2D particleTexture;
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

uniform float size : 1.0;

varying float v_Mag;
varying vec2 v_Uv;

void main()
{
 vec4 p = texture2D(particleTexture, texcoord);

 if (p.w > 0.0 && p.z > 1e-5) {
 gl_Position = worldViewProjection * vec4(p.xy * 2.0 - 1.0, 0.0, 1.0);
 }
 else {
 gl_Position = vec4(100000.0, 100000.0, 100000.0, 1.0);
 }

 v_Mag = p.z;
 v_Uv = p.xy;

 gl_PointSize = size;
}

@end

@export ecgl.vfParticle.renderPoints.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];
uniform sampler2D gradientTexture;
uniform sampler2D colorTexture;
uniform sampler2D spriteTexture;

varying float v_Mag;
varying vec2 v_Uv;

void main()
{
 gl_FragColor = color;
#ifdef SPRITETEXTURE_ENABLED
 gl_FragColor *= texture2D(spriteTexture, gl_PointCoord);
 if (color.a == 0.0) {
 discard;
 }
#endif
#ifdef GRADIENTTEXTURE_ENABLED
 gl_FragColor *= texture2D(gradientTexture, vec2(v_Mag, 0.5));
#endif
#ifdef COLORTEXTURE_ENABLED
 gl_FragColor *= texture2D(colorTexture, v_Uv);
#endif
}

@end

@export ecgl.vfParticle.renderLines.vertex

#define PI 3.1415926

attribute vec3 position : POSITION;

uniform sampler2D particleTexture;
uniform sampler2D prevParticleTexture;

uniform float size : 1.0;
uniform vec4 vp: VIEWPORT;
uniform mat4 worldViewProjection : WORLDVIEWPROJECTION;

varying float v_Mag;
varying vec2 v_Uv;

@import clay.util.rand

void main()
{
 vec4 p = texture2D(particleTexture, position.xy);
 vec4 p2 = texture2D(prevParticleTexture, position.xy);

 p.xy = p.xy * 2.0 - 1.0;
 p2.xy = p2.xy * 2.0 - 1.0;

 if (p.w > 0.0 && p.z > 1e-5) {
 vec2 dir = normalize(p.xy - p2.xy);
 vec2 norm = vec2(dir.y / vp.z, -dir.x / vp.w) * sign(position.z) * size;
 if (abs(position.z) == 2.0) {
 gl_Position = vec4(p.xy + norm, 0.0, 1.0);
 v_Uv = p.xy;
 v_Mag = p.z;
 }
 else {
 gl_Position = vec4(p2.xy + norm, 0.0, 1.0);
 v_Mag = p2.z;
 v_Uv = p2.xy;
 }
 gl_Position = worldViewProjection * gl_Position;
 }
 else {
 gl_Position = vec4(100000.0, 100000.0, 100000.0, 1.0);
 }
}

@end

@export ecgl.vfParticle.renderLines.fragment

uniform vec4 color : [1.0, 1.0, 1.0, 1.0];
uniform sampler2D gradientTexture;
uniform sampler2D colorTexture;

varying float v_Mag;
varying vec2 v_Uv;

void main()
{
 gl_FragColor = color;
 #ifdef GRADIENTTEXTURE_ENABLED
 gl_FragColor *= texture2D(gradientTexture, vec2(v_Mag, 0.5));
#endif
#ifdef COLORTEXTURE_ENABLED
 gl_FragColor *= texture2D(colorTexture, v_Uv);
#endif
}

@end
`);function IS(e){var t=document.createElement("canvas");t.width=t.height=e;var r=t.getContext("2d");return r.fillStyle="#fff",r.arc(e/2,e/2,e/2,0,Math.PI*2),r.fill(),t}var Eh=function(){this.motionBlurFactor=.99,this.vectorFieldTexture=new ee({type:X.FLOAT,flipY:!1}),this.particleLife=[5,20],this._particleType="point",this._particleSize=1,this.particleColor=[1,1,1,1],this.particleSpeedScaling=1,this._thisFrameTexture=null,this._particlePass=null,this._spawnTexture=null,this._particleTexture0=null,this._particleTexture1=null,this._particlePointsMesh=null,this._surfaceFrameBuffer=null,this._elapsedTime=0,this._scene=null,this._camera=null,this._lastFrameTexture=null,this._supersampling=1,this._downsampleTextures=[],this._width=512,this._height=512,this.init()};Eh.prototype={constructor:Eh,init:function(){var e={type:X.FLOAT,minFilter:X.NEAREST,magFilter:X.NEAREST,useMipmap:!1};this._spawnTexture=new ee(e),this._particleTexture0=new ee(e),this._particleTexture1=new ee(e),this._frameBuffer=new Je({depthBuffer:!1}),this._particlePass=new Fe({fragment:V.source("ecgl.vfParticle.particle.fragment")}),this._particlePass.setUniform("velocityTexture",this.vectorFieldTexture),this._particlePass.setUniform("spawnTexture",this._spawnTexture),this._downsamplePass=new Fe({fragment:V.source("clay.compositor.downsample")});var t=new Kr({renderOrder:10,material:new Gt({shader:new V(V.source("ecgl.vfParticle.renderPoints.vertex"),V.source("ecgl.vfParticle.renderPoints.fragment"))}),mode:Kr.POINTS,geometry:new ce({dynamic:!0,mainAttribute:"texcoord0"})}),r=new Kr({renderOrder:10,material:new Gt({shader:new V(V.source("ecgl.vfParticle.renderLines.vertex"),V.source("ecgl.vfParticle.renderLines.fragment"))}),geometry:new NS,culling:!1}),i=new Kr({material:new Gt({shader:new V(V.source("ecgl.color.vertex"),V.source("ecgl.color.fragment"))}),geometry:new oo});i.material.enableTexture("diffuseMap"),this._particlePointsMesh=t,this._particleLinesMesh=r,this._lastFrameFullQuadMesh=i,this._camera=new Ki,this._thisFrameTexture=new ee,this._lastFrameTexture=new ee},setParticleDensity:function(e,t){for(var r=e*t,i=new Float32Array(r*4),n=0,a=this.particleLife,o=0;o<e;o++)for(var s=0;s<t;s++,n++){i[n*4]=Math.random(),i[n*4+1]=Math.random(),i[n*4+2]=Math.random();var l=(a[1]-a[0])*Math.random()+a[0];i[n*4+3]=l}this._particleType==="line"?this._setLineGeometry(e,t):this._setPointsGeometry(e,t),this._spawnTexture.width=e,this._spawnTexture.height=t,this._spawnTexture.pixels=i,this._particleTexture0.width=this._particleTexture1.width=e,this._particleTexture0.height=this._particleTexture1.height=t,this._particlePass.setUniform("textureSize",[e,t])},_setPointsGeometry:function(e,t){var r=e*t,i=this._particlePointsMesh.geometry,n=i.attributes;n.texcoord0.init(r);for(var a=0,o=0;o<e;o++)for(var s=0;s<t;s++,a++)n.texcoord0.value[a*2]=o/e,n.texcoord0.value[a*2+1]=s/t;i.dirty()},_setLineGeometry:function(e,t){var r=e*t,i=this._getParticleMesh().geometry;i.setLineCount(r),i.resetOffset();for(var n=0;n<e;n++)for(var a=0;a<t;a++)i.addLine([n/e,a/t]);i.dirty()},_getParticleMesh:function(){return this._particleType==="line"?this._particleLinesMesh:this._particlePointsMesh},update:function(e,t,r,i){var n=this._getParticleMesh(),a=this._frameBuffer,o=this._particlePass;i&&this._updateDownsampleTextures(e,t),n.material.set("size",this._particleSize*this._supersampling),n.material.set("color",this.particleColor),o.setUniform("speedScaling",this.particleSpeedScaling),a.attach(this._particleTexture1),o.setUniform("firstFrameTime",i?(this.particleLife[1]+this.particleLife[0])/2:0),o.setUniform("particleTexture",this._particleTexture0),o.setUniform("deltaTime",r),o.setUniform("elapsedTime",this._elapsedTime),o.render(e,a),n.material.set("particleTexture",this._particleTexture1),n.material.set("prevParticleTexture",this._particleTexture0),a.attach(this._thisFrameTexture),a.bind(e),e.gl.clear(e.gl.DEPTH_BUFFER_BIT|e.gl.COLOR_BUFFER_BIT);var s=this._lastFrameFullQuadMesh;s.material.set("diffuseMap",this._lastFrameTexture),s.material.set("color",[1,1,1,this.motionBlurFactor]),this._camera.update(!0),e.renderPass([s,n],this._camera),a.unbind(e),this._downsample(e),this._swapTexture(),this._elapsedTime+=r},_downsample:function(e){var t=this._downsampleTextures;if(t.length!==0)for(var r=0,i=this._thisFrameTexture,n=t[r];n;)this._frameBuffer.attach(n),this._downsamplePass.setUniform("texture",i),this._downsamplePass.setUniform("textureSize",[i.width,i.height]),this._downsamplePass.render(e,this._frameBuffer),i=n,n=t[++r]},getSurfaceTexture:function(){var e=this._downsampleTextures;return e.length>0?e[e.length-1]:this._lastFrameTexture},setRegion:function(e){this._particlePass.setUniform("region",e)},resize:function(e,t){this._lastFrameTexture.width=e*this._supersampling,this._lastFrameTexture.height=t*this._supersampling,this._thisFrameTexture.width=e*this._supersampling,this._thisFrameTexture.height=t*this._supersampling,this._width=e,this._height=t},setParticleSize:function(e){var t=this._getParticleMesh();if(e<=2){t.material.disableTexture("spriteTexture"),t.material.transparent=!1;return}this._spriteTexture||(this._spriteTexture=new ee),(!this._spriteTexture.image||this._spriteTexture.image.width!==e)&&(this._spriteTexture.image=IS(e),this._spriteTexture.dirty()),t.material.transparent=!0,t.material.enableTexture("spriteTexture"),t.material.set("spriteTexture",this._spriteTexture),this._particleSize=e},setGradientTexture:function(e){var t=this._getParticleMesh().material;t[e?"enableTexture":"disableTexture"]("gradientTexture"),t.setUniform("gradientTexture",e)},setColorTextureImage:function(e,t){var r=this._getParticleMesh().material;r.setTextureImage("colorTexture",e,t,{flipY:!0})},setParticleType:function(e){this._particleType=e},clearFrame:function(e){var t=this._frameBuffer;t.attach(this._lastFrameTexture),t.bind(e),e.gl.clear(e.gl.DEPTH_BUFFER_BIT|e.gl.COLOR_BUFFER_BIT),t.unbind(e)},setSupersampling:function(e){this._supersampling=e,this.resize(this._width,this._height)},_updateDownsampleTextures:function(e,t){for(var r=this._downsampleTextures,i=Math.max(Math.floor(Math.log(this._supersampling/t.getDevicePixelRatio())/Math.log(2)),0),n=2,a=this._width*this._supersampling,o=this._height*this._supersampling,s=0;s<i;s++)r[s]=r[s]||new ee,r[s].width=a/n,r[s].height=o/n,n*=2;for(;s<r.length;s++)r[s].dispose(e);r.length=i},_swapTexture:function(){var e=this._particleTexture0;this._particleTexture0=this._particleTexture1,this._particleTexture1=e;var e=this._thisFrameTexture;this._thisFrameTexture=this._lastFrameTexture,this._lastFrameTexture=e},dispose:function(e){e.disposeFrameBuffer(this._frameBuffer),e.disposeTexture(this.vectorFieldTexture),e.disposeTexture(this._spawnTexture),e.disposeTexture(this._particleTexture0),e.disposeTexture(this._particleTexture1),e.disposeTexture(this._thisFrameTexture),e.disposeTexture(this._lastFrameTexture),e.disposeGeometry(this._particleLinesMesh.geometry),e.disposeGeometry(this._particlePointsMesh.geometry),e.disposeGeometry(this._lastFrameFullQuadMesh.geometry),this._spriteTexture&&e.disposeTexture(this._spriteTexture),this._particlePass.dispose(e),this._downsamplePass.dispose(e),this._downsampleTextures.forEach(function(t){t.dispose(e)})}};let OS=Eh,BS=A.ChartView.extend({type:"flowGL",__ecgl__:!0,init:function(e,t){this.viewGL=new Vr("orthographic"),this.groupGL=new S.Node,this.viewGL.add(this.groupGL),this._particleSurface=new OS;var r=new S.Mesh({geometry:new S.PlaneGeometry,material:new S.Material({shader:new S.Shader({vertex:S.Shader.source("ecgl.color.vertex"),fragment:S.Shader.source("ecgl.color.fragment")}),transparent:!0})});r.material.enableTexture("diffuseMap"),this.groupGL.add(r),this._planeMesh=r},render:function(e,t,r){var i=this._particleSurface;i.setParticleType(e.get("particleType")),i.setSupersampling(e.get("supersampling")),this._updateData(e,r),this._updateCamera(r.getWidth(),r.getHeight(),r.getDevicePixelRatio());var n=te.firstNotNull(e.get("particleDensity"),128);i.setParticleDensity(n,n);var a=this._planeMesh,o=+new Date,s=this,l=!0;a.__percent=0,a.stopAnimation(),a.animate("",{loop:!0}).when(1e5,{__percent:1}).during(function(){var f=+new Date,c=Math.min(f-o,20);o=o+c,s._renderer&&(i.update(s._renderer,r,c/1e3,l),a.material.set("diffuseMap",i.getSurfaceTexture())),l=!1}).start();var u=e.getModel("itemStyle"),h=S.parseColor(u.get("color"));h[3]*=te.firstNotNull(u.get("opacity"),1),a.material.set("color",h),i.setColorTextureImage(e.get("colorTexture"),r),i.setParticleSize(e.get("particleSize")),i.particleSpeedScaling=e.get("particleSpeed"),i.motionBlurFactor=1-Math.pow(.1,e.get("particleTrail"))},updateTransform:function(e,t,r){this._updateData(e,r)},afterRender:function(e,t,r,i){var n=i.renderer;this._renderer=n},_updateData:function(e,t){var r=e.coordinateSystem,i=r.dimensions.map(function(m){return e.coordDimToDataDim(m)[0]}),n=e.getData(),a=n.getDataExtent(i[0]),o=n.getDataExtent(i[1]),s=e.get("gridWidth"),l=e.get("gridHeight");if(s==null||s==="auto"){var u=(a[1]-a[0])/(o[1]-o[0]);s=Math.round(Math.sqrt(u*n.count()))}(l==null||l==="auto")&&(l=Math.ceil(n.count()/s));var h=this._particleSurface.vectorFieldTexture,f=h.pixels;if(!f||f.length!==l*s*4)f=h.pixels=new Float32Array(s*l*4);else for(var c=0;c<f.length;c++)f[c]=0;var d=0,v=1/0,p=new Float32Array(n.count()*2),_=0,g=[[1/0,1/0],[-1/0,-1/0]];n.each([i[0],i[1],"vx","vy"],function(m,y,x,w){var T=r.dataToPoint([m,y]);p[_++]=T[0],p[_++]=T[1],g[0][0]=Math.min(T[0],g[0][0]),g[0][1]=Math.min(T[1],g[0][1]),g[1][0]=Math.max(T[0],g[1][0]),g[1][1]=Math.max(T[1],g[1][1]);var E=Math.sqrt(x*x+w*w);d=Math.max(d,E),v=Math.min(v,E)}),n.each(["vx","vy"],function(m,y,x){var w=Math.round((p[x*2]-g[0][0])/(g[1][0]-g[0][0])*(s-1)),T=l-1-Math.round((p[x*2+1]-g[0][1])/(g[1][1]-g[0][1])*(l-1)),E=(T*s+w)*4;f[E]=m/d*.5+.5,f[E+1]=y/d*.5+.5,f[E+3]=1}),h.width=s,h.height=l,e.get("coordinateSystem")==="bmap"&&this._fillEmptyPixels(h),h.dirty(),this._updatePlanePosition(g[0],g[1],e,t),this._updateGradientTexture(n.getVisual("visualMeta"),[v,d])},_fillEmptyPixels:function(e){var t=e.pixels,r=e.width,i=e.height;function n(p,_,g){p=Math.max(Math.min(p,r-1),0),_=Math.max(Math.min(_,i-1),0);var m=(_*(r-1)+p)*4;return t[m+3]===0?!1:(g[0]=t[m],g[1]=t[m+1],!0)}function a(p,_,g){g[0]=p[0]+_[0],g[1]=p[1]+_[1]}for(var o=[],s=[],l=[],u=[],h=[],f=0,c=0;c<i;c++)for(var d=0;d<r;d++){var v=(c*(r-1)+d)*4;t[v+3]===0&&(f=o[0]=o[1]=0,n(d-1,c,s)&&(f++,a(s,o,o)),n(d+1,c,l)&&(f++,a(l,o,o)),n(d,c-1,u)&&(f++,a(u,o,o)),n(d,c+1,h)&&(f++,a(h,o,o)),o[0]/=f,o[1]/=f,t[v]=o[0],t[v+1]=o[1]),t[v+3]=1}},_updateGradientTexture:function(e,t){if(!e||!e.length){this._particleSurface.setGradientTexture(null);return}this._gradientTexture=this._gradientTexture||new S.Texture2D({image:document.createElement("canvas")});var r=this._gradientTexture,i=r.image;i.width=200,i.height=1;var n=i.getContext("2d"),a=n.createLinearGradient(0,.5,i.width,.5);e[0].stops.forEach(function(o){var s;t[1]===t[0]?s=0:(s=o.value/t[1],s=Math.min(Math.max(s,0),1)),a.addColorStop(s,o.color)}),n.fillStyle=a,n.fillRect(0,0,i.width,i.height),r.dirty(),this._particleSurface.setGradientTexture(this._gradientTexture)},_updatePlanePosition:function(e,t,r,i){var n=this._limitInViewportAndFullFill(e,t,r,i);e=n.leftTop,t=n.rightBottom,this._particleSurface.setRegion(n.region),this._planeMesh.position.set((e[0]+t[0])/2,i.getHeight()-(e[1]+t[1])/2,0);var a=t[0]-e[0],o=t[1]-e[1];this._planeMesh.scale.set(a/2,o/2,1),this._particleSurface.resize(Math.max(Math.min(a,2048),1),Math.max(Math.min(o,2048),1)),this._renderer&&this._particleSurface.clearFrame(this._renderer)},_limitInViewportAndFullFill:function(e,t,r,i){var n=[Math.max(e[0],0),Math.max(e[1],0)],a=[Math.min(t[0],i.getWidth()),Math.min(t[1],i.getHeight())];if(r.get("coordinateSystem")==="bmap"){var o=r.getData().getDataExtent(r.coordDimToDataDim("lng")[0]),s=Math.floor(o[1]-o[0])>=359;s&&(n[0]>0&&(n[0]=0),a[0]<i.getWidth()&&(a[0]=i.getWidth()))}var l=t[0]-e[0],u=t[1]-e[1],h=a[0]-n[0],f=a[1]-n[1],c=[(n[0]-e[0])/l,1-f/u-(n[1]-e[1])/u,h/l,f/u];return{leftTop:n,rightBottom:a,region:c}},_updateCamera:function(e,t,r){this.viewGL.setViewport(0,0,e,t,r);var i=this.viewGL.camera;i.left=i.bottom=0,i.top=t,i.right=e,i.near=0,i.far=100,i.position.z=10},remove:function(){this._planeMesh.stopAnimation(),this.groupGL.removeAll()},dispose:function(){this._renderer&&this._particleSurface.dispose(this._renderer),this.groupGL.removeAll()}});function FS(e){e.registerChartView(BS),e.registerSeriesModel(PS)}(0,A.use)(FS);var Ah=A.SeriesModel.extend({type:"series.linesGL",dependencies:["grid","geo"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",streamEnabled:!0,init:function(e){var t=this._processFlatCoordsArray(e.data);this._flatCoords=t.flatCoords,this._flatCoordsOffset=t.flatCoordsOffset,t.flatCoords&&(e.data=new Float32Array(t.count)),Ah.superApply(this,"init",arguments)},mergeOption:function(e){var t=this._processFlatCoordsArray(e.data);this._flatCoords=t.flatCoords,this._flatCoordsOffset=t.flatCoordsOffset,t.flatCoords&&(e.data=new Float32Array(t.count)),Ah.superApply(this,"mergeOption",arguments)},appendData:function(e){var t=this._processFlatCoordsArray(e.data);t.flatCoords&&(this._flatCoords?(this._flatCoords=Ff(this._flatCoords,t.flatCoords),this._flatCoordsOffset=Ff(this._flatCoordsOffset,t.flatCoordsOffset)):(this._flatCoords=t.flatCoords,this._flatCoordsOffset=t.flatCoordsOffset),e.data=new Float32Array(t.count)),this.getRawData().appendData(e.data)},_getCoordsFromItemModel:function(e){var t=this.getData().getItemModel(e),r=t.option instanceof Array?t.option:t.getShallow("coords");if(!(r instanceof Array&&r.length>0&&r[0]instanceof Array))throw new Error("Invalid coords "+JSON.stringify(r)+". Lines must have 2d coords array in data item.");return r},getLineCoordsCount:function(e){return this._flatCoordsOffset?this._flatCoordsOffset[e*2+1]:this._getCoordsFromItemModel(e).length},getLineCoords:function(e,t){if(this._flatCoordsOffset){for(var r=this._flatCoordsOffset[e*2],i=this._flatCoordsOffset[e*2+1],n=0;n<i;n++)t[n]=t[n]||[],t[n][0]=this._flatCoords[r+n*2],t[n][1]=this._flatCoords[r+n*2+1];return i}else{for(var a=this._getCoordsFromItemModel(e),n=0;n<a.length;n++)t[n]=t[n]||[],t[n][0]=a[n][0],t[n][1]=a[n][1];return a.length}},_processFlatCoordsArray:function(e){var t=0;if(this._flatCoords&&(t=this._flatCoords.length),typeof e[0]=="number"){for(var r=e.length,i=new Uint32Array(r),n=new Float64Array(r),a=0,o=0,s=0,l=0;l<r;){s++;var u=e[l++];i[o++]=a+t,i[o++]=u;for(var h=0;h<u;h++){var f=e[l++],c=e[l++];if(n[a++]=f,n[a++]=c,l>r)throw new Error("Invalid data format.")}}return{flatCoordsOffset:new Uint32Array(i.buffer,0,o),flatCoords:n,count:s}}return{flatCoordsOffset:null,flatCoords:null,count:e.length}},getInitialData:function(e,t){var r=new A.List(["value"],this);return r.hasItemOption=!1,r.initData(ho(e.data),[],function(i,n,a,o){if(i instanceof Array)return NaN;r.hasItemOption=!0;var s=i.value;if(s!=null)return s instanceof Array?s[o]:s}),r},defaultOption:{coordinateSystem:"geo",zlevel:10,progressive:1e4,progressiveThreshold:5e4,blendMode:"source-over",lineStyle:{opacity:.8},postEffect:{enable:!1,colorCorrection:{exposure:0,brightness:0,contrast:1,saturation:1,enable:!0}}}});let GS=Ah,US=A.ChartView.extend({type:"linesGL",__ecgl__:!0,init:function(e,t){this.groupGL=new S.Node,this.viewGL=new Vr("orthographic"),this.viewGL.add(this.groupGL),this._glViewHelper=new Vp(this.viewGL),this._nativeLinesShader=S.createShader("ecgl.lines3D"),this._meshLinesShader=S.createShader("ecgl.meshLines3D"),this._linesMeshes=[],this._currentStep=0},render:function(e,t,r){this.groupGL.removeAll(),this._glViewHelper.reset(e,r);var i=this._linesMeshes[0];i||(i=this._linesMeshes[0]=this._createLinesMesh(e)),this._linesMeshes.length=1,this.groupGL.add(i),this._updateLinesMesh(e,i,0,e.getData().count()),this.viewGL.setPostEffect(e.getModel("postEffect"),r)},incrementalPrepareRender:function(e,t,r){this.groupGL.removeAll(),this._glViewHelper.reset(e,r),this._currentStep=0,this.viewGL.setPostEffect(e.getModel("postEffect"),r)},incrementalRender:function(e,t,r,i){var n=this._linesMeshes[this._currentStep];n||(n=this._createLinesMesh(t),this._linesMeshes[this._currentStep]=n),this._updateLinesMesh(t,n,e.start,e.end),this.groupGL.add(n),i.getZr().refresh(),this._currentStep++},updateTransform:function(e,t,r){e.coordinateSystem.getRoamTransform&&this._glViewHelper.updateTransform(e,r)},_createLinesMesh:function(e){var t=new S.Mesh({$ignorePicking:!0,material:new S.Material({shader:S.createShader("ecgl.lines3D"),transparent:!0,depthMask:!1,depthTest:!1}),geometry:new Zp({segmentScale:10,useNativeLine:!0,dynamic:!1}),mode:S.Mesh.LINES,culling:!1});return t},_updateLinesMesh:function(e,t,r,i){var n=e.getData();t.material.blend=e.get("blendMode")==="lighter"?S.additiveBlend:null;var a=e.get("lineStyle.curveness")||0,o=e.get("polyline"),s=t.geometry,l=e.coordinateSystem,u=te.firstNotNull(e.get("lineStyle.width"),1);u>1?(t.material.shader!==this._meshLinesShader&&t.material.attachShader(this._meshLinesShader),t.mode=S.Mesh.TRIANGLES):(t.material.shader!==this._nativeLinesShader&&t.material.attachShader(this._nativeLinesShader),t.mode=S.Mesh.LINES),r=r||0,i=i||n.count(),s.resetOffset();var h=0,f=0,c=[],d=[],v=[],p=[],_=[],g=.3,m=.7;function y(){d[0]=c[0]*m+p[0]*g-(c[1]-p[1])*a,d[1]=c[1]*m+p[1]*g-(p[0]-c[0])*a,v[0]=c[0]*g+p[0]*m-(c[1]-p[1])*a,v[1]=c[1]*g+p[1]*m-(p[0]-c[0])*a}if(o||a!==0)for(var x=r;x<i;x++)if(o){var w=e.getLineCoordsCount(x);h+=s.getPolylineVertexCount(w),f+=s.getPolylineTriangleCount(w)}else e.getLineCoords(x,_),this._glViewHelper.dataToPoint(l,_[0],c),this._glViewHelper.dataToPoint(l,_[1],p),y(),h+=s.getCubicCurveVertexCount(c,d,v,p),f+=s.getCubicCurveTriangleCount(c,d,v,p);else{var T=i-r;h+=T*s.getLineVertexCount(),f+=T*s.getLineVertexCount()}s.setVertexCount(h),s.setTriangleCount(f);for(var E=r,b=[],x=r;x<i;x++){S.parseColor($e(n,E),b);var D=te.firstNotNull(et(n,E),1);b[3]*=D;for(var w=e.getLineCoords(x,_),L=0;L<w;L++)this._glViewHelper.dataToPoint(l,_[L],_[L]);o?s.addPolyline(_,b,u,0,w):a!==0?(c=_[0],p=_[1],y(),s.addCubicCurve(c,d,v,p,b,u)):s.addPolyline(_,b,u,0,2),E++}},dispose:function(){this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});function zS(e){e.registerChartView(US),e.registerSeriesModel(GS)}(0,A.use)(zS)}),"echarts/lib/echarts":(jt=>{jt.exports=Dh})},Er={};function Va(jt){if(Er[jt])return Er[jt].exports;var Cn=Er[jt]={exports:{}};return Ha[jt](Cn,Cn.exports,Va),Cn.exports}return Va.g=(function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch{if(typeof window=="object")return window}})(),Va.r=jt=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(jt,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(jt,"__esModule",{value:!0})},Va("./src/export/all.js")})()})});export default VS();
