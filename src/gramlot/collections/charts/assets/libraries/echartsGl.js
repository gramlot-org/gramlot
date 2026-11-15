(function(Ra,Ns,Fa,Is){(function(_n,Br){typeof Ra=="object"&&typeof Ns=="object"?Ns.exports=Br(Is("echarts")):typeof Fa=="function"&&Fa.amd?Fa(["echarts"],Br):typeof Ra=="object"?Ra["echarts-gl"]=Br(Is("echarts")):_n["echarts-gl"]=Br(_n.echarts)})(self,(function(_n){return(()=>{"use strict";var Br={535:(_e,bi,yn)=>{yn.r(bi);var M=yn(83);function Rs(t,e,r){typeof e=="object"&&(r=e,e=null);var i,n=this;if(!(t instanceof Function))for(var a in i=[],t)t.hasOwnProperty(a)&&i.push(a);var o=function(l){if(n.apply(this,arguments),t instanceof Function?Fs(this,t.call(this,l)):Xh(this,t,i),this.constructor===o)for(var u=o.__initializers__,h=0;h<u.length;h++)u[h].apply(this,arguments)};o.__super__=n,n.__initializers__?o.__initializers__=n.__initializers__.slice():o.__initializers__=[],e&&o.__initializers__.push(e);var s=function(){};return s.prototype=n.prototype,o.prototype=new s,o.prototype.constructor=o,Fs(o.prototype,r),o.extend=n.extend,o.derive=n.extend,o}function Fs(t,e){if(e)for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])}function Xh(t,e,r){for(var i=0;i<r.length;i++){var n=r[i];t[n]=e[n]}}let qh={extend:Rs,derive:Rs};function Zh(t,e){this.action=t,this.context=e}let za={trigger:function(t){if(this.hasOwnProperty("__handlers__")&&this.__handlers__.hasOwnProperty(t)){var e=this.__handlers__[t],r=e.length,i=-1,n=arguments;switch(n.length){case 1:for(;++i<r;)e[i].action.call(e[i].context);return;case 2:for(;++i<r;)e[i].action.call(e[i].context,n[1]);return;case 3:for(;++i<r;)e[i].action.call(e[i].context,n[1],n[2]);return;case 4:for(;++i<r;)e[i].action.call(e[i].context,n[1],n[2],n[3]);return;case 5:for(;++i<r;)e[i].action.call(e[i].context,n[1],n[2],n[3],n[4]);return;default:for(;++i<r;)e[i].action.apply(e[i].context,Array.prototype.slice.call(n,1));return}}},on:function(t,e,r){if(t&&e){var i=this.__handlers__||(this.__handlers__={});if(i[t]){if(this.has(t,e))return}else i[t]=[];var n=new Zh(e,r||this);return i[t].push(n),this}},once:function(t,e,r){if(t&&e){var i=this;return this.on(t,(function n(){i.off(t,n),e.apply(this,arguments)}),r)}},before:function(t,e,r){if(t&&e)return t="before"+t,this.on(t,e,r)},after:function(t,e,r){if(t&&e)return t="after"+t,this.on(t,e,r)},success:function(t,e){return this.once("success",t,e)},error:function(t,e){return this.once("error",t,e)},off:function(t,e){var r=this.__handlers__||(this.__handlers__={});if(e){if(r[t]){for(var i=r[t],n=[],a=0;a<i.length;a++)e&&i[a].action!==e&&n.push(i[a]);r[t]=n}return this}r[t]=[]},has:function(t,e){var r=this.__handlers__;if(!r||!r[t])return!1;for(var i=r[t],n=0;n<i.length;n++)if(i[n].action===e)return!0}};var Yh=0,Kh=Array.prototype.forEach,wi={genGUID:function(){return++Yh},relative2absolute:function(t,e){if(!e||t.match(/^\//))return t;for(var r=t.split("/"),i=e.split("/"),n=r[0];n==="."||n==="..";)n===".."&&i.pop(),r.shift(),n=r[0];return i.join("/")+"/"+r.join("/")},extend:function(t,e){if(e)for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},defaults:function(t,e){if(e)for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t},extendWithPropList:function(t,e,r){if(e)for(var i=0;i<r.length;i++){var n=r[i];t[n]=e[n]}return t},defaultsWithPropList:function(t,e,r){if(e)for(var i=0;i<r.length;i++){var n=r[i];t[n]==null&&(t[n]=e[n])}return t},each:function(t,e,r){if(t&&e)if(t.forEach&&t.forEach===Kh)t.forEach(e,r);else if(t.length===+t.length)for(var i=0,n=t.length;i<n;i++)e.call(r,t[i],i,t);else for(var a in t)t.hasOwnProperty(a)&&e.call(r,t[a],a,t)},isObject:function(t){return t===Object(t)},isArray:function(t){return Array.isArray(t)},isArrayLike:function(t){return!!t&&t.length===+t.length},clone:function(t){if(wi.isObject(t)){if(wi.isArray(t))return t.slice();if(wi.isArrayLike(t)){for(var e=new t.constructor(t.length),r=0;r<t.length;r++)e[r]=t[r];return e}return wi.extend({},t)}return t}};let zt=wi;var xn=function(){this.__uid__=zt.genGUID()};xn.__initializers__=[function(t){zt.extend(this,t)}],zt.extend(xn,qh),zt.extend(xn.prototype,za);let jt=xn;var Be,bn=1e-6,Gt=Array,zr=Math.random,Y={create:function(){var t=new Gt(3);return t[0]=0,t[1]=0,t[2]=0,t},clone:function(t){var e=new Gt(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},fromValues:function(t,e,r){var i=new Gt(3);return i[0]=t,i[1]=e,i[2]=r,i},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},set:function(t,e,r,i){return t[0]=e,t[1]=r,t[2]=i,t},add:function(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t},subtract:function(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t}};Y.sub=Y.subtract,Y.multiply=function(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t},Y.mul=Y.multiply,Y.divide=function(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t},Y.div=Y.divide,Y.min=function(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t},Y.max=function(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t},Y.scale=function(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t},Y.scaleAndAdd=function(t,e,r,i){return t[0]=e[0]+r[0]*i,t[1]=e[1]+r[1]*i,t[2]=e[2]+r[2]*i,t},Y.distance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1],n=e[2]-t[2];return Math.sqrt(r*r+i*i+n*n)},Y.dist=Y.distance,Y.squaredDistance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1],n=e[2]-t[2];return r*r+i*i+n*n},Y.sqrDist=Y.squaredDistance,Y.length=function(t){var e=t[0],r=t[1],i=t[2];return Math.sqrt(e*e+r*r+i*i)},Y.len=Y.length,Y.squaredLength=function(t){var e=t[0],r=t[1],i=t[2];return e*e+r*r+i*i},Y.sqrLen=Y.squaredLength,Y.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t},Y.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t},Y.normalize=function(t,e){var r=e[0],i=e[1],n=e[2],a=r*r+i*i+n*n;return a>0&&(a=1/Math.sqrt(a),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a),t},Y.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]},Y.cross=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=r[0],s=r[1],l=r[2];return t[0]=n*l-a*s,t[1]=a*o-i*l,t[2]=i*s-n*o,t},Y.lerp=function(t,e,r,i){var n=e[0],a=e[1],o=e[2];return t[0]=n+i*(r[0]-n),t[1]=a+i*(r[1]-a),t[2]=o+i*(r[2]-o),t},Y.random=function(t,e){e=e||1;var r=2*zr()*Math.PI,i=2*zr()-1,n=Math.sqrt(1-i*i)*e;return t[0]=Math.cos(r)*n,t[1]=Math.sin(r)*n,t[2]=i*e,t},Y.transformMat4=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=r[3]*i+r[7]*n+r[11]*a+r[15];return o=o||1,t[0]=(r[0]*i+r[4]*n+r[8]*a+r[12])/o,t[1]=(r[1]*i+r[5]*n+r[9]*a+r[13])/o,t[2]=(r[2]*i+r[6]*n+r[10]*a+r[14])/o,t},Y.transformMat3=function(t,e,r){var i=e[0],n=e[1],a=e[2];return t[0]=i*r[0]+n*r[3]+a*r[6],t[1]=i*r[1]+n*r[4]+a*r[7],t[2]=i*r[2]+n*r[5]+a*r[8],t},Y.transformQuat=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=r[0],s=r[1],l=r[2],u=r[3],h=u*i+s*a-l*n,c=u*n+l*i-o*a,f=u*a+o*n-s*i,p=-o*i-s*n-l*a;return t[0]=h*u+p*-o+c*-l-f*-s,t[1]=c*u+p*-s+f*-o-h*-l,t[2]=f*u+p*-l+h*-s-c*-o,t},Y.rotateX=function(t,e,r,i){var n=[],a=[];return n[0]=e[0]-r[0],n[1]=e[1]-r[1],n[2]=e[2]-r[2],a[0]=n[0],a[1]=n[1]*Math.cos(i)-n[2]*Math.sin(i),a[2]=n[1]*Math.sin(i)+n[2]*Math.cos(i),t[0]=a[0]+r[0],t[1]=a[1]+r[1],t[2]=a[2]+r[2],t},Y.rotateY=function(t,e,r,i){var n=[],a=[];return n[0]=e[0]-r[0],n[1]=e[1]-r[1],n[2]=e[2]-r[2],a[0]=n[2]*Math.sin(i)+n[0]*Math.cos(i),a[1]=n[1],a[2]=n[2]*Math.cos(i)-n[0]*Math.sin(i),t[0]=a[0]+r[0],t[1]=a[1]+r[1],t[2]=a[2]+r[2],t},Y.rotateZ=function(t,e,r,i){var n=[],a=[];return n[0]=e[0]-r[0],n[1]=e[1]-r[1],n[2]=e[2]-r[2],a[0]=n[0]*Math.cos(i)-n[1]*Math.sin(i),a[1]=n[0]*Math.sin(i)+n[1]*Math.cos(i),a[2]=n[2],t[0]=a[0]+r[0],t[1]=a[1]+r[1],t[2]=a[2]+r[2],t},Y.forEach=(Be=Y.create(),function(t,e,r,i,n,a){var o,s;for(e||(e=3),r||(r=0),s=i?Math.min(i*e+r,t.length):t.length,o=r;o<s;o+=e)Be[0]=t[o],Be[1]=t[o+1],Be[2]=t[o+2],n(Be,Be,a),t[o]=Be[0],t[o+1]=Be[1],t[o+2]=Be[2];return t}),Y.angle=function(t,e){var r=Y.fromValues(t[0],t[1],t[2]),i=Y.fromValues(e[0],e[1],e[2]);Y.normalize(r,r),Y.normalize(i,i);var n=Y.dot(r,i);return n>1?0:Math.acos(n)};let E=Y;var Z=function(t,e,r){t=t||0,e=e||0,r=r||0,this.array=E.fromValues(t,e,r),this._dirty=!0};Z.prototype={constructor:Z,add:function(t){return E.add(this.array,this.array,t.array),this._dirty=!0,this},set:function(t,e,r){return this.array[0]=t,this.array[1]=e,this.array[2]=r,this._dirty=!0,this},setArray:function(t){return this.array[0]=t[0],this.array[1]=t[1],this.array[2]=t[2],this._dirty=!0,this},clone:function(){return new Z(this.x,this.y,this.z)},copy:function(t){return E.copy(this.array,t.array),this._dirty=!0,this},cross:function(t,e){return E.cross(this.array,t.array,e.array),this._dirty=!0,this},dist:function(t){return E.dist(this.array,t.array)},distance:function(t){return E.distance(this.array,t.array)},div:function(t){return E.div(this.array,this.array,t.array),this._dirty=!0,this},divide:function(t){return E.divide(this.array,this.array,t.array),this._dirty=!0,this},dot:function(t){return E.dot(this.array,t.array)},len:function(){return E.len(this.array)},length:function(){return E.length(this.array)},lerp:function(t,e,r){return E.lerp(this.array,t.array,e.array,r),this._dirty=!0,this},min:function(t){return E.min(this.array,this.array,t.array),this._dirty=!0,this},max:function(t){return E.max(this.array,this.array,t.array),this._dirty=!0,this},mul:function(t){return E.mul(this.array,this.array,t.array),this._dirty=!0,this},multiply:function(t){return E.multiply(this.array,this.array,t.array),this._dirty=!0,this},negate:function(){return E.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return E.normalize(this.array,this.array),this._dirty=!0,this},random:function(t){return E.random(this.array,t),this._dirty=!0,this},scale:function(t){return E.scale(this.array,this.array,t),this._dirty=!0,this},scaleAndAdd:function(t,e){return E.scaleAndAdd(this.array,this.array,t.array,e),this._dirty=!0,this},sqrDist:function(t){return E.sqrDist(this.array,t.array)},squaredDistance:function(t){return E.squaredDistance(this.array,t.array)},sqrLen:function(){return E.sqrLen(this.array)},squaredLength:function(){return E.squaredLength(this.array)},sub:function(t){return E.sub(this.array,this.array,t.array),this._dirty=!0,this},subtract:function(t){return E.subtract(this.array,this.array,t.array),this._dirty=!0,this},transformMat3:function(t){return E.transformMat3(this.array,this.array,t.array),this._dirty=!0,this},transformMat4:function(t){return E.transformMat4(this.array,this.array,t.array),this._dirty=!0,this},transformQuat:function(t){return E.transformQuat(this.array,this.array,t.array),this._dirty=!0,this},applyProjection:function(t){var e=this.array;if((t=t.array)[15]===0){var r=-1/e[2];e[0]=t[0]*e[0]*r,e[1]=t[5]*e[1]*r,e[2]=(t[10]*e[2]+t[14])*r}else e[0]=t[0]*e[0]+t[12],e[1]=t[5]*e[1]+t[13],e[2]=t[10]*e[2]+t[14];return this._dirty=!0,this},eulerFromQuat:function(t,e){Z.eulerFromQuat(this,t,e)},eulerFromMat3:function(t,e){Z.eulerFromMat3(this,t,e)},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var wn=Object.defineProperty;if(wn){var Ga=Z.prototype;wn(Ga,"x",{get:function(){return this.array[0]},set:function(t){this.array[0]=t,this._dirty=!0}}),wn(Ga,"y",{get:function(){return this.array[1]},set:function(t){this.array[1]=t,this._dirty=!0}}),wn(Ga,"z",{get:function(){return this.array[2]},set:function(t){this.array[2]=t,this._dirty=!0}})}function le(t,e,r){return t<e?e:t>r?r:t}Z.add=function(t,e,r){return E.add(t.array,e.array,r.array),t._dirty=!0,t},Z.set=function(t,e,r,i){E.set(t.array,e,r,i),t._dirty=!0},Z.copy=function(t,e){return E.copy(t.array,e.array),t._dirty=!0,t},Z.cross=function(t,e,r){return E.cross(t.array,e.array,r.array),t._dirty=!0,t},Z.distance=Z.dist=function(t,e){return E.distance(t.array,e.array)},Z.divide=Z.div=function(t,e,r){return E.divide(t.array,e.array,r.array),t._dirty=!0,t},Z.dot=function(t,e){return E.dot(t.array,e.array)},Z.len=function(t){return E.length(t.array)},Z.lerp=function(t,e,r,i){return E.lerp(t.array,e.array,r.array,i),t._dirty=!0,t},Z.min=function(t,e,r){return E.min(t.array,e.array,r.array),t._dirty=!0,t},Z.max=function(t,e,r){return E.max(t.array,e.array,r.array),t._dirty=!0,t},Z.multiply=Z.mul=function(t,e,r){return E.multiply(t.array,e.array,r.array),t._dirty=!0,t},Z.negate=function(t,e){return E.negate(t.array,e.array),t._dirty=!0,t},Z.normalize=function(t,e){return E.normalize(t.array,e.array),t._dirty=!0,t},Z.random=function(t,e){return E.random(t.array,e),t._dirty=!0,t},Z.scale=function(t,e,r){return E.scale(t.array,e.array,r),t._dirty=!0,t},Z.scaleAndAdd=function(t,e,r,i){return E.scaleAndAdd(t.array,e.array,r.array,i),t._dirty=!0,t},Z.squaredDistance=Z.sqrDist=function(t,e){return E.sqrDist(t.array,e.array)},Z.squaredLength=Z.sqrLen=function(t){return E.sqrLen(t.array)},Z.subtract=Z.sub=function(t,e,r){return E.subtract(t.array,e.array,r.array),t._dirty=!0,t},Z.transformMat3=function(t,e,r){return E.transformMat3(t.array,e.array,r.array),t._dirty=!0,t},Z.transformMat4=function(t,e,r){return E.transformMat4(t.array,e.array,r.array),t._dirty=!0,t},Z.transformQuat=function(t,e,r){return E.transformQuat(t.array,e.array,r.array),t._dirty=!0,t};var ct=Math.atan2,ue=Math.asin,Gr=Math.abs;Z.eulerFromQuat=function(t,e,r){t._dirty=!0,e=e.array;var i=t.array,n=e[0],a=e[1],o=e[2],s=e[3],l=n*n,u=a*a,h=o*o,c=s*s;switch(r=(r||"XYZ").toUpperCase()){case"XYZ":i[0]=ct(2*(n*s-a*o),c-l-u+h),i[1]=ue(le(2*(n*o+a*s),-1,1)),i[2]=ct(2*(o*s-n*a),c+l-u-h);break;case"YXZ":i[0]=ue(le(2*(n*s-a*o),-1,1)),i[1]=ct(2*(n*o+a*s),c-l-u+h),i[2]=ct(2*(n*a+o*s),c-l+u-h);break;case"ZXY":i[0]=ue(le(2*(n*s+a*o),-1,1)),i[1]=ct(2*(a*s-o*n),c-l-u+h),i[2]=ct(2*(o*s-n*a),c-l+u-h);break;case"ZYX":i[0]=ct(2*(n*s+o*a),c-l-u+h),i[1]=ue(le(2*(a*s-n*o),-1,1)),i[2]=ct(2*(n*a+o*s),c+l-u-h);break;case"YZX":i[0]=ct(2*(n*s-o*a),c-l+u-h),i[1]=ct(2*(a*s-n*o),c+l-u-h),i[2]=ue(le(2*(n*a+o*s),-1,1));break;case"XZY":i[0]=ct(2*(n*s+a*o),c-l+u-h),i[1]=ct(2*(n*o+a*s),c+l-u-h),i[2]=ue(le(2*(o*s-n*a),-1,1));break;default:console.warn("Unkown order: "+r)}return t},Z.eulerFromMat3=function(t,e,r){var i=e.array,n=i[0],a=i[3],o=i[6],s=i[1],l=i[4],u=i[7],h=i[2],c=i[5],f=i[8],p=t.array;switch(r=(r||"XYZ").toUpperCase()){case"XYZ":p[1]=ue(le(o,-1,1)),Gr(o)<.99999?(p[0]=ct(-u,f),p[2]=ct(-a,n)):(p[0]=ct(c,l),p[2]=0);break;case"YXZ":p[0]=ue(-le(u,-1,1)),Gr(u)<.99999?(p[1]=ct(o,f),p[2]=ct(s,l)):(p[1]=ct(-h,n),p[2]=0);break;case"ZXY":p[0]=ue(le(c,-1,1)),Gr(c)<.99999?(p[1]=ct(-h,f),p[2]=ct(-a,l)):(p[1]=0,p[2]=ct(s,n));break;case"ZYX":p[1]=ue(-le(h,-1,1)),Gr(h)<.99999?(p[0]=ct(c,f),p[2]=ct(s,n)):(p[0]=0,p[2]=ct(-a,l));break;case"YZX":p[2]=ue(le(s,-1,1)),Gr(s)<.99999?(p[0]=ct(-u,l),p[1]=ct(-h,n)):(p[0]=0,p[1]=ct(o,f));break;case"XZY":p[2]=ue(-le(a,-1,1)),Gr(a)<.99999?(p[0]=ct(c,l),p[1]=ct(o,n)):(p[0]=ct(-u,f),p[1]=0);break;default:console.warn("Unkown order: "+r)}return t._dirty=!0,t},Object.defineProperties(Z,{POSITIVE_X:{get:function(){return new Z(1,0,0)}},NEGATIVE_X:{get:function(){return new Z(-1,0,0)}},POSITIVE_Y:{get:function(){return new Z(0,1,0)}},NEGATIVE_Y:{get:function(){return new Z(0,-1,0)}},POSITIVE_Z:{get:function(){return new Z(0,0,1)}},NEGATIVE_Z:{get:function(){return new Z(0,0,-1)}},UP:{get:function(){return new Z(0,1,0)}},ZERO:{get:function(){return new Z}}});let F=Z;var it={create:function(){var t=new Gt(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},clone:function(t){var e=new Gt(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},fromValues:function(t,e,r,i){var n=new Gt(4);return n[0]=t,n[1]=e,n[2]=r,n[3]=i,n},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},set:function(t,e,r,i,n){return t[0]=e,t[1]=r,t[2]=i,t[3]=n,t},add:function(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t},subtract:function(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t}};it.sub=it.subtract,it.multiply=function(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t[3]=e[3]*r[3],t},it.mul=it.multiply,it.divide=function(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t[3]=e[3]/r[3],t},it.div=it.divide,it.min=function(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t[3]=Math.min(e[3],r[3]),t},it.max=function(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t[3]=Math.max(e[3],r[3]),t},it.scale=function(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t},it.scaleAndAdd=function(t,e,r,i){return t[0]=e[0]+r[0]*i,t[1]=e[1]+r[1]*i,t[2]=e[2]+r[2]*i,t[3]=e[3]+r[3]*i,t},it.distance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1],n=e[2]-t[2],a=e[3]-t[3];return Math.sqrt(r*r+i*i+n*n+a*a)},it.dist=it.distance,it.squaredDistance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1],n=e[2]-t[2],a=e[3]-t[3];return r*r+i*i+n*n+a*a},it.sqrDist=it.squaredDistance,it.length=function(t){var e=t[0],r=t[1],i=t[2],n=t[3];return Math.sqrt(e*e+r*r+i*i+n*n)},it.len=it.length,it.squaredLength=function(t){var e=t[0],r=t[1],i=t[2],n=t[3];return e*e+r*r+i*i+n*n},it.sqrLen=it.squaredLength,it.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},it.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t},it.normalize=function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=r*r+i*i+n*n+a*a;return o>0&&(o=1/Math.sqrt(o),t[0]=e[0]*o,t[1]=e[1]*o,t[2]=e[2]*o,t[3]=e[3]*o),t},it.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},it.lerp=function(t,e,r,i){var n=e[0],a=e[1],o=e[2],s=e[3];return t[0]=n+i*(r[0]-n),t[1]=a+i*(r[1]-a),t[2]=o+i*(r[2]-o),t[3]=s+i*(r[3]-s),t},it.random=function(t,e){return e=e||1,t[0]=zr(),t[1]=zr(),t[2]=zr(),t[3]=zr(),it.normalize(t,t),it.scale(t,t,e),t},it.transformMat4=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3];return t[0]=r[0]*i+r[4]*n+r[8]*a+r[12]*o,t[1]=r[1]*i+r[5]*n+r[9]*a+r[13]*o,t[2]=r[2]*i+r[6]*n+r[10]*a+r[14]*o,t[3]=r[3]*i+r[7]*n+r[11]*a+r[15]*o,t},it.transformQuat=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=r[0],s=r[1],l=r[2],u=r[3],h=u*i+s*a-l*n,c=u*n+l*i-o*a,f=u*a+o*n-s*i,p=-o*i-s*n-l*a;return t[0]=h*u+p*-o+c*-l-f*-s,t[1]=c*u+p*-s+f*-o-h*-l,t[2]=f*u+p*-l+h*-s-c*-o,t},it.forEach=(function(){var t=it.create();return function(e,r,i,n,a,o){var s,l;for(r||(r=4),i||(i=0),l=n?Math.min(n*r+i,e.length):e.length,s=i;s<l;s+=r)t[0]=e[s],t[1]=e[s+1],t[2]=e[s+2],t[3]=e[s+3],a(t,t,o),e[s]=t[0],e[s+1]=t[1],e[s+2]=t[2],e[s+3]=t[3];return e}})();let G=it;var Me={create:function(){var t=new Gt(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},fromMat4:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},clone:function(t){var e=new Gt(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},transpose:function(t,e){if(t===e){var r=e[1],i=e[2],n=e[5];t[1]=e[3],t[2]=e[6],t[3]=r,t[5]=e[7],t[6]=i,t[7]=n}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},invert:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=e[6],u=e[7],h=e[8],c=h*o-s*u,f=-h*a+s*l,p=u*a-o*l,d=r*c+i*f+n*p;return d?(d=1/d,t[0]=c*d,t[1]=(-h*i+n*u)*d,t[2]=(s*i-n*o)*d,t[3]=f*d,t[4]=(h*r-n*l)*d,t[5]=(-s*r+n*a)*d,t[6]=p*d,t[7]=(-u*r+i*l)*d,t[8]=(o*r-i*a)*d,t):null},adjoint:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=e[6],u=e[7],h=e[8];return t[0]=o*h-s*u,t[1]=n*u-i*h,t[2]=i*s-n*o,t[3]=s*l-a*h,t[4]=r*h-n*l,t[5]=n*a-r*s,t[6]=a*u-o*l,t[7]=i*l-r*u,t[8]=r*o-i*a,t},determinant:function(t){var e=t[0],r=t[1],i=t[2],n=t[3],a=t[4],o=t[5],s=t[6],l=t[7],u=t[8];return e*(u*a-o*l)+r*(-u*n+o*s)+i*(l*n-a*s)},multiply:function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=e[6],h=e[7],c=e[8],f=r[0],p=r[1],d=r[2],m=r[3],g=r[4],_=r[5],y=r[6],x=r[7],v=r[8];return t[0]=f*i+p*o+d*u,t[1]=f*n+p*s+d*h,t[2]=f*a+p*l+d*c,t[3]=m*i+g*o+_*u,t[4]=m*n+g*s+_*h,t[5]=m*a+g*l+_*c,t[6]=y*i+x*o+v*u,t[7]=y*n+x*s+v*h,t[8]=y*a+x*l+v*c,t}};Me.mul=Me.multiply,Me.translate=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=e[6],h=e[7],c=e[8],f=r[0],p=r[1];return t[0]=i,t[1]=n,t[2]=a,t[3]=o,t[4]=s,t[5]=l,t[6]=f*i+p*o+u,t[7]=f*n+p*s+h,t[8]=f*a+p*l+c,t},Me.rotate=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=e[6],h=e[7],c=e[8],f=Math.sin(r),p=Math.cos(r);return t[0]=p*i+f*o,t[1]=p*n+f*s,t[2]=p*a+f*l,t[3]=p*o-f*i,t[4]=p*s-f*n,t[5]=p*l-f*a,t[6]=u,t[7]=h,t[8]=c,t},Me.scale=function(t,e,r){var i=r[0],n=r[1];return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=n*e[3],t[4]=n*e[4],t[5]=n*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},Me.fromMat2d=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t},Me.fromQuat=function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=r+r,s=i+i,l=n+n,u=r*o,h=i*o,c=i*s,f=n*o,p=n*s,d=n*l,m=a*o,g=a*s,_=a*l;return t[0]=1-c-d,t[3]=h-_,t[6]=f+g,t[1]=h+_,t[4]=1-u-d,t[7]=p-m,t[2]=f-g,t[5]=p+m,t[8]=1-u-c,t},Me.normalFromMat4=function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=e[6],u=e[7],h=e[8],c=e[9],f=e[10],p=e[11],d=e[12],m=e[13],g=e[14],_=e[15],y=r*s-i*o,x=r*l-n*o,v=r*u-a*o,w=i*l-n*s,b=i*u-a*s,S=n*u-a*l,A=h*m-c*d,D=h*g-f*d,P=h*_-p*d,L=c*g-f*m,O=c*_-p*m,N=f*_-p*g,C=y*N-x*O+v*L+w*P-b*D+S*A;return C?(C=1/C,t[0]=(s*N-l*O+u*L)*C,t[1]=(l*P-o*N-u*D)*C,t[2]=(o*O-s*P+u*A)*C,t[3]=(n*O-i*N-a*L)*C,t[4]=(r*N-n*P+a*D)*C,t[5]=(i*P-r*O-a*A)*C,t[6]=(m*S-g*b+_*w)*C,t[7]=(g*v-d*S-_*x)*C,t[8]=(d*b-m*v+_*y)*C,t):null},Me.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))};let tt=Me;var ve,Bs,zs,ye,at={create:function(){var t=new Gt(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}};at.rotationTo=(ve=E.create(),Bs=E.fromValues(1,0,0),zs=E.fromValues(0,1,0),function(t,e,r){var i=E.dot(e,r);return i<-.999999?(E.cross(ve,Bs,e),E.length(ve)<1e-6&&E.cross(ve,zs,e),E.normalize(ve,ve),at.setAxisAngle(t,ve,Math.PI),t):i>.999999?(t[0]=0,t[1]=0,t[2]=0,t[3]=1,t):(E.cross(ve,e,r),t[0]=ve[0],t[1]=ve[1],t[2]=ve[2],t[3]=1+i,at.normalize(t,t))}),at.setAxes=(ye=tt.create(),function(t,e,r,i){return ye[0]=r[0],ye[3]=r[1],ye[6]=r[2],ye[1]=i[0],ye[4]=i[1],ye[7]=i[2],ye[2]=-e[0],ye[5]=-e[1],ye[8]=-e[2],at.normalize(t,at.fromMat3(t,ye))}),at.clone=G.clone,at.fromValues=G.fromValues,at.copy=G.copy,at.set=G.set,at.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},at.setAxisAngle=function(t,e,r){r*=.5;var i=Math.sin(r);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(r),t},at.add=G.add,at.multiply=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=r[0],l=r[1],u=r[2],h=r[3];return t[0]=i*h+o*s+n*u-a*l,t[1]=n*h+o*l+a*s-i*u,t[2]=a*h+o*u+i*l-n*s,t[3]=o*h-i*s-n*l-a*u,t},at.mul=at.multiply,at.scale=G.scale,at.rotateX=function(t,e,r){r*=.5;var i=e[0],n=e[1],a=e[2],o=e[3],s=Math.sin(r),l=Math.cos(r);return t[0]=i*l+o*s,t[1]=n*l+a*s,t[2]=a*l-n*s,t[3]=o*l-i*s,t},at.rotateY=function(t,e,r){r*=.5;var i=e[0],n=e[1],a=e[2],o=e[3],s=Math.sin(r),l=Math.cos(r);return t[0]=i*l-a*s,t[1]=n*l+o*s,t[2]=a*l+i*s,t[3]=o*l-n*s,t},at.rotateZ=function(t,e,r){r*=.5;var i=e[0],n=e[1],a=e[2],o=e[3],s=Math.sin(r),l=Math.cos(r);return t[0]=i*l+n*s,t[1]=n*l-i*s,t[2]=a*l+o*s,t[3]=o*l-a*s,t},at.calculateW=function(t,e){var r=e[0],i=e[1],n=e[2];return t[0]=r,t[1]=i,t[2]=n,t[3]=Math.sqrt(Math.abs(1-r*r-i*i-n*n)),t},at.dot=G.dot,at.lerp=G.lerp,at.slerp=function(t,e,r,i){var n,a,o,s,l,u=e[0],h=e[1],c=e[2],f=e[3],p=r[0],d=r[1],m=r[2],g=r[3];return(a=u*p+h*d+c*m+f*g)<0&&(a=-a,p=-p,d=-d,m=-m,g=-g),1-a>1e-6?(n=Math.acos(a),o=Math.sin(n),s=Math.sin((1-i)*n)/o,l=Math.sin(i*n)/o):(s=1-i,l=i),t[0]=s*u+l*p,t[1]=s*h+l*d,t[2]=s*c+l*m,t[3]=s*f+l*g,t},at.invert=function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=r*r+i*i+n*n+a*a,s=o?1/o:0;return t[0]=-r*s,t[1]=-i*s,t[2]=-n*s,t[3]=a*s,t},at.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},at.length=G.length,at.len=at.length,at.squaredLength=G.squaredLength,at.sqrLen=at.squaredLength,at.normalize=G.normalize,at.fromMat3=function(t,e){var r,i=e[0]+e[4]+e[8];if(i>0)r=Math.sqrt(i+1),t[3]=.5*r,r=.5/r,t[0]=(e[5]-e[7])*r,t[1]=(e[6]-e[2])*r,t[2]=(e[1]-e[3])*r;else{var n=0;e[4]>e[0]&&(n=1),e[8]>e[3*n+n]&&(n=2);var a=(n+1)%3,o=(n+2)%3;r=Math.sqrt(e[3*n+n]-e[3*a+a]-e[3*o+o]+1),t[n]=.5*r,r=.5/r,t[3]=(e[3*a+o]-e[3*o+a])*r,t[a]=(e[3*a+n]+e[3*n+a])*r,t[o]=(e[3*o+n]+e[3*n+o])*r}return t};let q=at;var Ti,dt=function(t,e,r,i){t=t||0,e=e||0,r=r||0,i=i===void 0?1:i,this.array=q.fromValues(t,e,r,i),this._dirty=!0};dt.prototype={constructor:dt,add:function(t){return q.add(this.array,this.array,t.array),this._dirty=!0,this},calculateW:function(){return q.calculateW(this.array,this.array),this._dirty=!0,this},set:function(t,e,r,i){return this.array[0]=t,this.array[1]=e,this.array[2]=r,this.array[3]=i,this._dirty=!0,this},setArray:function(t){return this.array[0]=t[0],this.array[1]=t[1],this.array[2]=t[2],this.array[3]=t[3],this._dirty=!0,this},clone:function(){return new dt(this.x,this.y,this.z,this.w)},conjugate:function(){return q.conjugate(this.array,this.array),this._dirty=!0,this},copy:function(t){return q.copy(this.array,t.array),this._dirty=!0,this},dot:function(t){return q.dot(this.array,t.array)},fromMat3:function(t){return q.fromMat3(this.array,t.array),this._dirty=!0,this},fromMat4:(Ti=tt.create(),function(t){return tt.fromMat4(Ti,t.array),tt.transpose(Ti,Ti),q.fromMat3(this.array,Ti),this._dirty=!0,this}),identity:function(){return q.identity(this.array),this._dirty=!0,this},invert:function(){return q.invert(this.array,this.array),this._dirty=!0,this},len:function(){return q.len(this.array)},length:function(){return q.length(this.array)},lerp:function(t,e,r){return q.lerp(this.array,t.array,e.array,r),this._dirty=!0,this},mul:function(t){return q.mul(this.array,this.array,t.array),this._dirty=!0,this},mulLeft:function(t){return q.multiply(this.array,t.array,this.array),this._dirty=!0,this},multiply:function(t){return q.multiply(this.array,this.array,t.array),this._dirty=!0,this},multiplyLeft:function(t){return q.multiply(this.array,t.array,this.array),this._dirty=!0,this},normalize:function(){return q.normalize(this.array,this.array),this._dirty=!0,this},rotateX:function(t){return q.rotateX(this.array,this.array,t),this._dirty=!0,this},rotateY:function(t){return q.rotateY(this.array,this.array,t),this._dirty=!0,this},rotateZ:function(t){return q.rotateZ(this.array,this.array,t),this._dirty=!0,this},rotationTo:function(t,e){return q.rotationTo(this.array,t.array,e.array),this._dirty=!0,this},setAxes:function(t,e,r){return q.setAxes(this.array,t.array,e.array,r.array),this._dirty=!0,this},setAxisAngle:function(t,e){return q.setAxisAngle(this.array,t.array,e),this._dirty=!0,this},slerp:function(t,e,r){return q.slerp(this.array,t.array,e.array,r),this._dirty=!0,this},sqrLen:function(){return q.sqrLen(this.array)},squaredLength:function(){return q.squaredLength(this.array)},fromEuler:function(t,e){return dt.fromEuler(this,t,e)},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Si=Object.defineProperty;if(Si){var Tn=dt.prototype;Si(Tn,"x",{get:function(){return this.array[0]},set:function(t){this.array[0]=t,this._dirty=!0}}),Si(Tn,"y",{get:function(){return this.array[1]},set:function(t){this.array[1]=t,this._dirty=!0}}),Si(Tn,"z",{get:function(){return this.array[2]},set:function(t){this.array[2]=t,this._dirty=!0}}),Si(Tn,"w",{get:function(){return this.array[3]},set:function(t){this.array[3]=t,this._dirty=!0}})}dt.add=function(t,e,r){return q.add(t.array,e.array,r.array),t._dirty=!0,t},dt.set=function(t,e,r,i,n){q.set(t.array,e,r,i,n),t._dirty=!0},dt.copy=function(t,e){return q.copy(t.array,e.array),t._dirty=!0,t},dt.calculateW=function(t,e){return q.calculateW(t.array,e.array),t._dirty=!0,t},dt.conjugate=function(t,e){return q.conjugate(t.array,e.array),t._dirty=!0,t},dt.identity=function(t){return q.identity(t.array),t._dirty=!0,t},dt.invert=function(t,e){return q.invert(t.array,e.array),t._dirty=!0,t},dt.dot=function(t,e){return q.dot(t.array,e.array)},dt.len=function(t){return q.length(t.array)},dt.lerp=function(t,e,r,i){return q.lerp(t.array,e.array,r.array,i),t._dirty=!0,t},dt.slerp=function(t,e,r,i){return q.slerp(t.array,e.array,r.array,i),t._dirty=!0,t},dt.multiply=dt.mul=function(t,e,r){return q.multiply(t.array,e.array,r.array),t._dirty=!0,t},dt.rotateX=function(t,e,r){return q.rotateX(t.array,e.array,r),t._dirty=!0,t},dt.rotateY=function(t,e,r){return q.rotateY(t.array,e.array,r),t._dirty=!0,t},dt.rotateZ=function(t,e,r){return q.rotateZ(t.array,e.array,r),t._dirty=!0,t},dt.setAxisAngle=function(t,e,r){return q.setAxisAngle(t.array,e.array,r),t._dirty=!0,t},dt.normalize=function(t,e){return q.normalize(t.array,e.array),t._dirty=!0,t},dt.squaredLength=dt.sqrLen=function(t){return q.sqrLen(t.array)},dt.fromMat3=function(t,e){return q.fromMat3(t.array,e.array),t._dirty=!0,t},dt.setAxes=function(t,e,r,i){return q.setAxes(t.array,e.array,r.array,i.array),t._dirty=!0,t},dt.rotationTo=function(t,e,r){return q.rotationTo(t.array,e.array,r.array),t._dirty=!0,t},dt.fromEuler=function(t,e,r){t._dirty=!0,e=e.array;var i=t.array,n=Math.cos(e[0]/2),a=Math.cos(e[1]/2),o=Math.cos(e[2]/2),s=Math.sin(e[0]/2),l=Math.sin(e[1]/2),u=Math.sin(e[2]/2);switch(r=(r||"XYZ").toUpperCase()){case"XYZ":i[0]=s*a*o+n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o-s*l*u;break;case"YXZ":i[0]=s*a*o+n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o+s*l*u;break;case"ZXY":i[0]=s*a*o-n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o-s*l*u;break;case"ZYX":i[0]=s*a*o-n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o+s*l*u;break;case"YZX":i[0]=s*a*o+n*l*u,i[1]=n*l*o+s*a*u,i[2]=n*a*u-s*l*o,i[3]=n*a*o-s*l*u;break;case"XZY":i[0]=s*a*o-n*l*u,i[1]=n*l*o-s*a*u,i[2]=n*a*u+s*l*o,i[3]=n*a*o+s*l*u}};let Gs=dt;var Ot={create:function(){var t=new Gt(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},clone:function(t){var e=new Gt(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},transpose:function(t,e){if(t===e){var r=e[1],i=e[2],n=e[3],a=e[6],o=e[7],s=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=r,t[6]=e[9],t[7]=e[13],t[8]=i,t[9]=a,t[11]=e[14],t[12]=n,t[13]=o,t[14]=s}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t},invert:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=e[6],u=e[7],h=e[8],c=e[9],f=e[10],p=e[11],d=e[12],m=e[13],g=e[14],_=e[15],y=r*s-i*o,x=r*l-n*o,v=r*u-a*o,w=i*l-n*s,b=i*u-a*s,S=n*u-a*l,A=h*m-c*d,D=h*g-f*d,P=h*_-p*d,L=c*g-f*m,O=c*_-p*m,N=f*_-p*g,C=y*N-x*O+v*L+w*P-b*D+S*A;return C?(C=1/C,t[0]=(s*N-l*O+u*L)*C,t[1]=(n*O-i*N-a*L)*C,t[2]=(m*S-g*b+_*w)*C,t[3]=(f*b-c*S-p*w)*C,t[4]=(l*P-o*N-u*D)*C,t[5]=(r*N-n*P+a*D)*C,t[6]=(g*v-d*S-_*x)*C,t[7]=(h*S-f*v+p*x)*C,t[8]=(o*O-s*P+u*A)*C,t[9]=(i*P-r*O-a*A)*C,t[10]=(d*b-m*v+_*y)*C,t[11]=(c*v-h*b-p*y)*C,t[12]=(s*D-o*L-l*A)*C,t[13]=(r*L-i*D+n*A)*C,t[14]=(m*x-d*w-g*y)*C,t[15]=(h*w-c*x+f*y)*C,t):null},adjoint:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=e[6],u=e[7],h=e[8],c=e[9],f=e[10],p=e[11],d=e[12],m=e[13],g=e[14],_=e[15];return t[0]=s*(f*_-p*g)-c*(l*_-u*g)+m*(l*p-u*f),t[1]=-(i*(f*_-p*g)-c*(n*_-a*g)+m*(n*p-a*f)),t[2]=i*(l*_-u*g)-s*(n*_-a*g)+m*(n*u-a*l),t[3]=-(i*(l*p-u*f)-s*(n*p-a*f)+c*(n*u-a*l)),t[4]=-(o*(f*_-p*g)-h*(l*_-u*g)+d*(l*p-u*f)),t[5]=r*(f*_-p*g)-h*(n*_-a*g)+d*(n*p-a*f),t[6]=-(r*(l*_-u*g)-o*(n*_-a*g)+d*(n*u-a*l)),t[7]=r*(l*p-u*f)-o*(n*p-a*f)+h*(n*u-a*l),t[8]=o*(c*_-p*m)-h*(s*_-u*m)+d*(s*p-u*c),t[9]=-(r*(c*_-p*m)-h*(i*_-a*m)+d*(i*p-a*c)),t[10]=r*(s*_-u*m)-o*(i*_-a*m)+d*(i*u-a*s),t[11]=-(r*(s*p-u*c)-o*(i*p-a*c)+h*(i*u-a*s)),t[12]=-(o*(c*g-f*m)-h*(s*g-l*m)+d*(s*f-l*c)),t[13]=r*(c*g-f*m)-h*(i*g-n*m)+d*(i*f-n*c),t[14]=-(r*(s*g-l*m)-o*(i*g-n*m)+d*(i*l-n*s)),t[15]=r*(s*f-l*c)-o*(i*f-n*c)+h*(i*l-n*s),t},determinant:function(t){var e=t[0],r=t[1],i=t[2],n=t[3],a=t[4],o=t[5],s=t[6],l=t[7],u=t[8],h=t[9],c=t[10],f=t[11],p=t[12],d=t[13],m=t[14],g=t[15];return(e*o-r*a)*(c*g-f*m)-(e*s-i*a)*(h*g-f*d)+(e*l-n*a)*(h*m-c*d)+(r*s-i*o)*(u*g-f*p)-(r*l-n*o)*(u*m-c*p)+(i*l-n*s)*(u*d-h*p)},multiply:function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=e[6],h=e[7],c=e[8],f=e[9],p=e[10],d=e[11],m=e[12],g=e[13],_=e[14],y=e[15],x=r[0],v=r[1],w=r[2],b=r[3];return t[0]=x*i+v*s+w*c+b*m,t[1]=x*n+v*l+w*f+b*g,t[2]=x*a+v*u+w*p+b*_,t[3]=x*o+v*h+w*d+b*y,x=r[4],v=r[5],w=r[6],b=r[7],t[4]=x*i+v*s+w*c+b*m,t[5]=x*n+v*l+w*f+b*g,t[6]=x*a+v*u+w*p+b*_,t[7]=x*o+v*h+w*d+b*y,x=r[8],v=r[9],w=r[10],b=r[11],t[8]=x*i+v*s+w*c+b*m,t[9]=x*n+v*l+w*f+b*g,t[10]=x*a+v*u+w*p+b*_,t[11]=x*o+v*h+w*d+b*y,x=r[12],v=r[13],w=r[14],b=r[15],t[12]=x*i+v*s+w*c+b*m,t[13]=x*n+v*l+w*f+b*g,t[14]=x*a+v*u+w*p+b*_,t[15]=x*o+v*h+w*d+b*y,t},multiplyAffine:function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[4],s=e[5],l=e[6],u=e[8],h=e[9],c=e[10],f=e[12],p=e[13],d=e[14],m=r[0],g=r[1],_=r[2];return t[0]=m*i+g*o+_*u,t[1]=m*n+g*s+_*h,t[2]=m*a+g*l+_*c,m=r[4],g=r[5],_=r[6],t[4]=m*i+g*o+_*u,t[5]=m*n+g*s+_*h,t[6]=m*a+g*l+_*c,m=r[8],g=r[9],_=r[10],t[8]=m*i+g*o+_*u,t[9]=m*n+g*s+_*h,t[10]=m*a+g*l+_*c,m=r[12],g=r[13],_=r[14],t[12]=m*i+g*o+_*u+f,t[13]=m*n+g*s+_*h+p,t[14]=m*a+g*l+_*c+d,t}};Ot.mul=Ot.multiply,Ot.mulAffine=Ot.multiplyAffine,Ot.translate=function(t,e,r){var i,n,a,o,s,l,u,h,c,f,p,d,m=r[0],g=r[1],_=r[2];return e===t?(t[12]=e[0]*m+e[4]*g+e[8]*_+e[12],t[13]=e[1]*m+e[5]*g+e[9]*_+e[13],t[14]=e[2]*m+e[6]*g+e[10]*_+e[14],t[15]=e[3]*m+e[7]*g+e[11]*_+e[15]):(i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=e[6],h=e[7],c=e[8],f=e[9],p=e[10],d=e[11],t[0]=i,t[1]=n,t[2]=a,t[3]=o,t[4]=s,t[5]=l,t[6]=u,t[7]=h,t[8]=c,t[9]=f,t[10]=p,t[11]=d,t[12]=i*m+s*g+c*_+e[12],t[13]=n*m+l*g+f*_+e[13],t[14]=a*m+u*g+p*_+e[14],t[15]=o*m+h*g+d*_+e[15]),t},Ot.scale=function(t,e,r){var i=r[0],n=r[1],a=r[2];return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*a,t[9]=e[9]*a,t[10]=e[10]*a,t[11]=e[11]*a,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},Ot.rotate=function(t,e,r,i){var n,a,o,s,l,u,h,c,f,p,d,m,g,_,y,x,v,w,b,S,A,D,P,L,O=i[0],N=i[1],C=i[2],B=Math.sqrt(O*O+N*N+C*C);return Math.abs(B)<bn?null:(O*=B=1/B,N*=B,C*=B,n=Math.sin(r),o=1-(a=Math.cos(r)),s=e[0],l=e[1],u=e[2],h=e[3],c=e[4],f=e[5],p=e[6],d=e[7],m=e[8],g=e[9],_=e[10],y=e[11],x=O*O*o+a,v=N*O*o+C*n,w=C*O*o-N*n,b=O*N*o-C*n,S=N*N*o+a,A=C*N*o+O*n,D=O*C*o+N*n,P=N*C*o-O*n,L=C*C*o+a,t[0]=s*x+c*v+m*w,t[1]=l*x+f*v+g*w,t[2]=u*x+p*v+_*w,t[3]=h*x+d*v+y*w,t[4]=s*b+c*S+m*A,t[5]=l*b+f*S+g*A,t[6]=u*b+p*S+_*A,t[7]=h*b+d*S+y*A,t[8]=s*D+c*P+m*L,t[9]=l*D+f*P+g*L,t[10]=u*D+p*P+_*L,t[11]=h*D+d*P+y*L,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)},Ot.rotateX=function(t,e,r){var i=Math.sin(r),n=Math.cos(r),a=e[4],o=e[5],s=e[6],l=e[7],u=e[8],h=e[9],c=e[10],f=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=a*n+u*i,t[5]=o*n+h*i,t[6]=s*n+c*i,t[7]=l*n+f*i,t[8]=u*n-a*i,t[9]=h*n-o*i,t[10]=c*n-s*i,t[11]=f*n-l*i,t},Ot.rotateY=function(t,e,r){var i=Math.sin(r),n=Math.cos(r),a=e[0],o=e[1],s=e[2],l=e[3],u=e[8],h=e[9],c=e[10],f=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=a*n-u*i,t[1]=o*n-h*i,t[2]=s*n-c*i,t[3]=l*n-f*i,t[8]=a*i+u*n,t[9]=o*i+h*n,t[10]=s*i+c*n,t[11]=l*i+f*n,t},Ot.rotateZ=function(t,e,r){var i=Math.sin(r),n=Math.cos(r),a=e[0],o=e[1],s=e[2],l=e[3],u=e[4],h=e[5],c=e[6],f=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=a*n+u*i,t[1]=o*n+h*i,t[2]=s*n+c*i,t[3]=l*n+f*i,t[4]=u*n-a*i,t[5]=h*n-o*i,t[6]=c*n-s*i,t[7]=f*n-l*i,t},Ot.fromRotationTranslation=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=i+i,l=n+n,u=a+a,h=i*s,c=i*l,f=i*u,p=n*l,d=n*u,m=a*u,g=o*s,_=o*l,y=o*u;return t[0]=1-(p+m),t[1]=c+y,t[2]=f-_,t[3]=0,t[4]=c-y,t[5]=1-(h+m),t[6]=d+g,t[7]=0,t[8]=f+_,t[9]=d-g,t[10]=1-(h+p),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},Ot.fromQuat=function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=r+r,s=i+i,l=n+n,u=r*o,h=i*o,c=i*s,f=n*o,p=n*s,d=n*l,m=a*o,g=a*s,_=a*l;return t[0]=1-c-d,t[1]=h+_,t[2]=f-g,t[3]=0,t[4]=h-_,t[5]=1-u-d,t[6]=p+m,t[7]=0,t[8]=f+g,t[9]=p-m,t[10]=1-u-c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},Ot.frustum=function(t,e,r,i,n,a,o){var s=1/(r-e),l=1/(n-i),u=1/(a-o);return t[0]=2*a*s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*a*l,t[6]=0,t[7]=0,t[8]=(r+e)*s,t[9]=(n+i)*l,t[10]=(o+a)*u,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*a*2*u,t[15]=0,t},Ot.perspective=function(t,e,r,i,n){var a=1/Math.tan(e/2),o=1/(i-n);return t[0]=a/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(n+i)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*n*i*o,t[15]=0,t},Ot.ortho=function(t,e,r,i,n,a,o){var s=1/(e-r),l=1/(i-n),u=1/(a-o);return t[0]=-2*s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*u,t[11]=0,t[12]=(e+r)*s,t[13]=(n+i)*l,t[14]=(o+a)*u,t[15]=1,t},Ot.lookAt=function(t,e,r,i){var n,a,o,s,l,u,h,c,f,p,d=e[0],m=e[1],g=e[2],_=i[0],y=i[1],x=i[2],v=r[0],w=r[1],b=r[2];return Math.abs(d-v)<bn&&Math.abs(m-w)<bn&&Math.abs(g-b)<bn?Ot.identity(t):(h=d-v,c=m-w,f=g-b,n=y*(f*=p=1/Math.sqrt(h*h+c*c+f*f))-x*(c*=p),a=x*(h*=p)-_*f,o=_*c-y*h,(p=Math.sqrt(n*n+a*a+o*o))?(n*=p=1/p,a*=p,o*=p):(n=0,a=0,o=0),s=c*o-f*a,l=f*n-h*o,u=h*a-c*n,(p=Math.sqrt(s*s+l*l+u*u))?(s*=p=1/p,l*=p,u*=p):(s=0,l=0,u=0),t[0]=n,t[1]=s,t[2]=h,t[3]=0,t[4]=a,t[5]=l,t[6]=c,t[7]=0,t[8]=o,t[9]=u,t[10]=f,t[11]=0,t[12]=-(n*d+a*m+o*g),t[13]=-(s*d+l*m+u*g),t[14]=-(h*d+c*m+f*g),t[15]=1,t)},Ot.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))};let R=Ot;var mt=function(){this._axisX=new F,this._axisY=new F,this._axisZ=new F,this.array=R.create(),this._dirty=!0};mt.prototype={constructor:mt,setArray:function(t){for(var e=0;e<this.array.length;e++)this.array[e]=t[e];return this._dirty=!0,this},adjoint:function(){return R.adjoint(this.array,this.array),this._dirty=!0,this},clone:function(){return new mt().copy(this)},copy:function(t){return R.copy(this.array,t.array),this._dirty=!0,this},determinant:function(){return R.determinant(this.array)},fromQuat:function(t){return R.fromQuat(this.array,t.array),this._dirty=!0,this},fromRotationTranslation:function(t,e){return R.fromRotationTranslation(this.array,t.array,e.array),this._dirty=!0,this},fromMat2d:function(t){return mt.fromMat2d(this,t),this},frustum:function(t,e,r,i,n,a){return R.frustum(this.array,t,e,r,i,n,a),this._dirty=!0,this},identity:function(){return R.identity(this.array),this._dirty=!0,this},invert:function(){return R.invert(this.array,this.array),this._dirty=!0,this},lookAt:function(t,e,r){return R.lookAt(this.array,t.array,e.array,r.array),this._dirty=!0,this},mul:function(t){return R.mul(this.array,this.array,t.array),this._dirty=!0,this},mulLeft:function(t){return R.mul(this.array,t.array,this.array),this._dirty=!0,this},multiply:function(t){return R.multiply(this.array,this.array,t.array),this._dirty=!0,this},multiplyLeft:function(t){return R.multiply(this.array,t.array,this.array),this._dirty=!0,this},ortho:function(t,e,r,i,n,a){return R.ortho(this.array,t,e,r,i,n,a),this._dirty=!0,this},perspective:function(t,e,r,i){return R.perspective(this.array,t,e,r,i),this._dirty=!0,this},rotate:function(t,e){return R.rotate(this.array,this.array,t,e.array),this._dirty=!0,this},rotateX:function(t){return R.rotateX(this.array,this.array,t),this._dirty=!0,this},rotateY:function(t){return R.rotateY(this.array,this.array,t),this._dirty=!0,this},rotateZ:function(t){return R.rotateZ(this.array,this.array,t),this._dirty=!0,this},scale:function(t){return R.scale(this.array,this.array,t.array),this._dirty=!0,this},translate:function(t){return R.translate(this.array,this.array,t.array),this._dirty=!0,this},transpose:function(){return R.transpose(this.array,this.array),this._dirty=!0,this},decomposeMatrix:(function(){var t=E.create(),e=E.create(),r=E.create(),i=tt.create();return function(n,a,o){var s=this.array;E.set(t,s[0],s[1],s[2]),E.set(e,s[4],s[5],s[6]),E.set(r,s[8],s[9],s[10]);var l=E.length(t),u=E.length(e),h=E.length(r);this.determinant()<0&&(l=-l),n&&n.set(l,u,h),o.set(s[12],s[13],s[14]),tt.fromMat4(i,s),i[0]/=l,i[1]/=l,i[2]/=l,i[3]/=u,i[4]/=u,i[5]/=u,i[6]/=h,i[7]/=h,i[8]/=h,q.fromMat3(a.array,i),q.normalize(a.array,a.array),a._dirty=!0,o._dirty=!0}})(),toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Sn=Object.defineProperty;if(Sn){var Ua=mt.prototype;Sn(Ua,"z",{get:function(){var t=this.array;return this._axisZ.set(t[8],t[9],t[10]),this._axisZ},set:function(t){var e=this.array;t=t.array,e[8]=t[0],e[9]=t[1],e[10]=t[2],this._dirty=!0}}),Sn(Ua,"y",{get:function(){var t=this.array;return this._axisY.set(t[4],t[5],t[6]),this._axisY},set:function(t){var e=this.array;t=t.array,e[4]=t[0],e[5]=t[1],e[6]=t[2],this._dirty=!0}}),Sn(Ua,"x",{get:function(){var t=this.array;return this._axisX.set(t[0],t[1],t[2]),this._axisX},set:function(t){var e=this.array;t=t.array,e[0]=t[0],e[1]=t[1],e[2]=t[2],this._dirty=!0}})}mt.adjoint=function(t,e){return R.adjoint(t.array,e.array),t._dirty=!0,t},mt.copy=function(t,e){return R.copy(t.array,e.array),t._dirty=!0,t},mt.determinant=function(t){return R.determinant(t.array)},mt.identity=function(t){return R.identity(t.array),t._dirty=!0,t},mt.ortho=function(t,e,r,i,n,a,o){return R.ortho(t.array,e,r,i,n,a,o),t._dirty=!0,t},mt.perspective=function(t,e,r,i,n){return R.perspective(t.array,e,r,i,n),t._dirty=!0,t},mt.lookAt=function(t,e,r,i){return R.lookAt(t.array,e.array,r.array,i.array),t._dirty=!0,t},mt.invert=function(t,e){return R.invert(t.array,e.array),t._dirty=!0,t},mt.multiply=mt.mul=function(t,e,r){return R.mul(t.array,e.array,r.array),t._dirty=!0,t},mt.fromQuat=function(t,e){return R.fromQuat(t.array,e.array),t._dirty=!0,t},mt.fromRotationTranslation=function(t,e,r){return R.fromRotationTranslation(t.array,e.array,r.array),t._dirty=!0,t},mt.fromMat2d=function(t,e){return t._dirty=!0,e=e.array,(t=t.array)[0]=e[0],t[4]=e[2],t[12]=e[4],t[1]=e[1],t[5]=e[3],t[13]=e[5],t},mt.rotate=function(t,e,r,i){return R.rotate(t.array,e.array,r,i.array),t._dirty=!0,t},mt.rotateX=function(t,e,r){return R.rotateX(t.array,e.array,r),t._dirty=!0,t},mt.rotateY=function(t,e,r){return R.rotateY(t.array,e.array,r),t._dirty=!0,t},mt.rotateZ=function(t,e,r){return R.rotateZ(t.array,e.array,r),t._dirty=!0,t},mt.scale=function(t,e,r){return R.scale(t.array,e.array,r.array),t._dirty=!0,t},mt.transpose=function(t,e){return R.transpose(t.array,e.array),t._dirty=!0,t},mt.translate=function(t,e,r){return R.translate(t.array,e.array,r.array),t._dirty=!0,t};let k=mt;var Ae,Ee,Ce,De,Le,Pe,je=E.set,Mn=E.copy,An=function(t,e){this.min=t||new F(1/0,1/0,1/0),this.max=e||new F(-1/0,-1/0,-1/0),this.vertices=null};An.prototype={constructor:An,updateFromVertices:function(t){if(t.length>0){var e=this.min,r=this.max,i=e.array,n=r.array;Mn(i,t[0]),Mn(n,t[0]);for(var a=1;a<t.length;a++){var o=t[a];o[0]<i[0]&&(i[0]=o[0]),o[1]<i[1]&&(i[1]=o[1]),o[2]<i[2]&&(i[2]=o[2]),o[0]>n[0]&&(n[0]=o[0]),o[1]>n[1]&&(n[1]=o[1]),o[2]>n[2]&&(n[2]=o[2])}e._dirty=!0,r._dirty=!0}},union:function(t){var e=this.min,r=this.max;return E.min(e.array,e.array,t.min.array),E.max(r.array,r.array,t.max.array),e._dirty=!0,r._dirty=!0,this},intersection:function(t){var e=this.min,r=this.max;return E.max(e.array,e.array,t.min.array),E.min(r.array,r.array,t.max.array),e._dirty=!0,r._dirty=!0,this},intersectBoundingBox:function(t){var e=this.min.array,r=this.max.array,i=t.min.array,n=t.max.array;return!(e[0]>n[0]||e[1]>n[1]||e[2]>n[2]||r[0]<i[0]||r[1]<i[1]||r[2]<i[2])},containBoundingBox:function(t){var e=this.min.array,r=this.max.array,i=t.min.array,n=t.max.array;return e[0]<=i[0]&&e[1]<=i[1]&&e[2]<=i[2]&&r[0]>=n[0]&&r[1]>=n[1]&&r[2]>=n[2]},containPoint:function(t){var e=this.min.array,r=this.max.array,i=t.array;return e[0]<=i[0]&&e[1]<=i[1]&&e[2]<=i[2]&&r[0]>=i[0]&&r[1]>=i[1]&&r[2]>=i[2]},isFinite:function(){var t=this.min.array,e=this.max.array;return isFinite(t[0])&&isFinite(t[1])&&isFinite(t[2])&&isFinite(e[0])&&isFinite(e[1])&&isFinite(e[2])},applyTransform:function(t){this.transformFrom(this,t)},transformFrom:(Ae=E.create(),Ee=E.create(),Ce=E.create(),De=E.create(),Le=E.create(),Pe=E.create(),function(t,e){var r=t.min.array,i=t.max.array,n=e.array;return Ae[0]=n[0]*r[0],Ae[1]=n[1]*r[0],Ae[2]=n[2]*r[0],Ee[0]=n[0]*i[0],Ee[1]=n[1]*i[0],Ee[2]=n[2]*i[0],Ce[0]=n[4]*r[1],Ce[1]=n[5]*r[1],Ce[2]=n[6]*r[1],De[0]=n[4]*i[1],De[1]=n[5]*i[1],De[2]=n[6]*i[1],Le[0]=n[8]*r[2],Le[1]=n[9]*r[2],Le[2]=n[10]*r[2],Pe[0]=n[8]*i[2],Pe[1]=n[9]*i[2],Pe[2]=n[10]*i[2],r=this.min.array,i=this.max.array,r[0]=Math.min(Ae[0],Ee[0])+Math.min(Ce[0],De[0])+Math.min(Le[0],Pe[0])+n[12],r[1]=Math.min(Ae[1],Ee[1])+Math.min(Ce[1],De[1])+Math.min(Le[1],Pe[1])+n[13],r[2]=Math.min(Ae[2],Ee[2])+Math.min(Ce[2],De[2])+Math.min(Le[2],Pe[2])+n[14],i[0]=Math.max(Ae[0],Ee[0])+Math.max(Ce[0],De[0])+Math.max(Le[0],Pe[0])+n[12],i[1]=Math.max(Ae[1],Ee[1])+Math.max(Ce[1],De[1])+Math.max(Le[1],Pe[1])+n[13],i[2]=Math.max(Ae[2],Ee[2])+Math.max(Ce[2],De[2])+Math.max(Le[2],Pe[2])+n[14],this.min._dirty=!0,this.max._dirty=!0,this}),applyProjection:function(t){var e=this.min.array,r=this.max.array,i=t.array,n=e[0],a=e[1],o=e[2],s=r[0],l=r[1],u=e[2],h=r[0],c=r[1],f=r[2];if(i[15]===1)e[0]=i[0]*n+i[12],e[1]=i[5]*a+i[13],r[2]=i[10]*o+i[14],r[0]=i[0]*h+i[12],r[1]=i[5]*c+i[13],e[2]=i[10]*f+i[14];else{var p=-1/o;e[0]=i[0]*n*p,e[1]=i[5]*a*p,r[2]=(i[10]*o+i[14])*p,p=-1/u,r[0]=i[0]*s*p,r[1]=i[5]*l*p,p=-1/f,e[2]=(i[10]*f+i[14])*p}return this.min._dirty=!0,this.max._dirty=!0,this},updateVertices:function(){var t=this.vertices;if(!t){t=[];for(var e=0;e<8;e++)t[e]=E.fromValues(0,0,0);this.vertices=t}var r=this.min.array,i=this.max.array;return je(t[0],r[0],r[1],r[2]),je(t[1],r[0],i[1],r[2]),je(t[2],i[0],r[1],r[2]),je(t[3],i[0],i[1],r[2]),je(t[4],r[0],r[1],i[2]),je(t[5],r[0],i[1],i[2]),je(t[6],i[0],r[1],i[2]),je(t[7],i[0],i[1],i[2]),this},copy:function(t){var e=this.min,r=this.max;return Mn(e.array,t.min.array),Mn(r.array,t.max.array),e._dirty=!0,r._dirty=!0,this},clone:function(){var t=new An;return t.copy(this),t}};let Xt=An;var ka,Va,Ha,Wa,Qh=0;let Oe=jt.extend({name:"",position:null,rotation:null,scale:null,worldTransform:null,localTransform:null,autoUpdateLocalTransform:!0,_parent:null,_scene:null,_needsUpdateWorldTransform:!0,_inIterating:!1,__depth:0},(function(){this.name||(this.name=(this.type||"NODE")+"_"+Qh++),this.position||(this.position=new F),this.rotation||(this.rotation=new Gs),this.scale||(this.scale=new F(1,1,1)),this.worldTransform=new k,this.localTransform=new k,this._children=[]}),{target:null,invisible:!1,isSkinnedMesh:function(){return!1},isRenderable:function(){return!1},setName:function(t){var e=this._scene;if(e){var r=e._nodeRepository;delete r[this.name],r[t]=this}this.name=t},add:function(t){var e=t._parent;if(e!==this){e&&e.remove(t),t._parent=this,this._children.push(t);var r=this._scene;r&&r!==t.scene&&t.traverse(this._addSelfToScene,this),t._needsUpdateWorldTransform=!0}},remove:function(t){var e=this._children,r=e.indexOf(t);r<0||(e.splice(r,1),t._parent=null,this._scene&&t.traverse(this._removeSelfFromScene,this))},removeAll:function(){for(var t=this._children,e=0;e<t.length;e++)t[e]._parent=null,this._scene&&t[e].traverse(this._removeSelfFromScene,this);this._children=[]},getScene:function(){return this._scene},getParent:function(){return this._parent},_removeSelfFromScene:function(t){t._scene.removeFromScene(t),t._scene=null},_addSelfToScene:function(t){this._scene.addToScene(t),t._scene=this._scene},isAncestor:function(t){for(var e=t._parent;e;){if(e===this)return!0;e=e._parent}return!1},children:function(){return this._children.slice()},childAt:function(t){return this._children[t]},getChildByName:function(t){for(var e=this._children,r=0;r<e.length;r++)if(e[r].name===t)return e[r]},getDescendantByName:function(t){for(var e=this._children,r=0;r<e.length;r++){var i=e[r];if(i.name===t)return i;var n=i.getDescendantByName(t);if(n)return n}},queryNode:function(t){if(t){for(var e=t.split("/"),r=this,i=0;i<e.length;i++){var n=e[i];if(n){for(var a=!1,o=r._children,s=0;s<o.length;s++){var l=o[s];if(l.name===n){r=l,a=!0;break}}if(!a)return}}return r}},getPath:function(t){if(!this._parent)return"/";for(var e=this._parent,r=this.name;e._parent&&(r=e.name+"/"+r,e._parent!=t);)e=e._parent;return!e._parent&&t?null:r},traverse:function(t,e){t.call(e,this);for(var r=this._children,i=0,n=r.length;i<n;i++)r[i].traverse(t,e)},eachChild:function(t,e){for(var r=this._children,i=0,n=r.length;i<n;i++){var a=r[i];t.call(e,a,i)}},setLocalTransform:function(t){R.copy(this.localTransform.array,t.array),this.decomposeLocalTransform()},decomposeLocalTransform:function(t){var e=t?null:this.scale;this.localTransform.decomposeMatrix(e,this.rotation,this.position)},setWorldTransform:function(t){R.copy(this.worldTransform.array,t.array),this.decomposeWorldTransform()},decomposeWorldTransform:(Wa=R.create(),function(t){var e=this.localTransform,r=this.worldTransform;this._parent?(R.invert(Wa,this._parent.worldTransform.array),R.multiply(e.array,Wa,r.array)):R.copy(e.array,r.array);var i=t?null:this.scale;e.decomposeMatrix(i,this.rotation,this.position)}),transformNeedsUpdate:function(){return this.position._dirty||this.rotation._dirty||this.scale._dirty},updateLocalTransform:function(){var t=this.position,e=this.rotation,r=this.scale;if(this.transformNeedsUpdate()){var i=this.localTransform.array;R.fromRotationTranslation(i,e.array,t.array),R.scale(i,i,r.array),e._dirty=!1,r._dirty=!1,t._dirty=!1,this._needsUpdateWorldTransform=!0}},_updateWorldTransformTopDown:function(){var t=this.localTransform.array,e=this.worldTransform.array;this._parent?R.multiplyAffine(e,this._parent.worldTransform.array,t):R.copy(e,t)},updateWorldTransform:function(){for(var t=this;t&&t.getParent()&&t.getParent().transformNeedsUpdate();)t=t.getParent();t.update()},update:function(t){this.autoUpdateLocalTransform?this.updateLocalTransform():t=!0,(t||this._needsUpdateWorldTransform)&&(this._updateWorldTransformTopDown(),t=!0,this._needsUpdateWorldTransform=!1);for(var e=this._children,r=0,i=e.length;r<i;r++)e[r].update(t)},getBoundingBox:(function(){function t(n){return!n.invisible&&n.geometry}var e=new Xt,r=new k,i=new k;return function(n,a){return a=a||new Xt,n=n||t,this._parent?k.invert(i,this._parent.worldTransform):k.identity(i),this.traverse((function(o){o.geometry&&o.geometry.boundingBox&&(e.copy(o.geometry.boundingBox),k.multiply(r,i,o.worldTransform),e.applyTransform(r),a.union(e))}),this,t),a}})(),getWorldPosition:function(t){this.transformNeedsUpdate()&&this.updateWorldTransform();var e=this.worldTransform.array;if(t){var r=t.array;return r[0]=e[12],r[1]=e[13],r[2]=e[14],t}return new F(e[12],e[13],e[14])},clone:function(){var t=new this.constructor,e=this._children;t.setName(this.name),t.position.copy(this.position),t.rotation.copy(this.rotation),t.scale.copy(this.scale);for(var r=0;r<e.length;r++)t.add(e[r].clone());return t},rotateAround:(Va=new F,Ha=new k,function(t,e,r){Va.copy(this.position).subtract(t);var i=this.localTransform;i.identity(),i.translate(t),i.rotate(r,e),Ha.fromRotationTranslation(this.rotation,Va),i.multiply(Ha),i.scale(this.scale),this.decomposeLocalTransform(),this._needsUpdateWorldTransform=!0}),lookAt:(ka=new k,function(t,e){ka.lookAt(this.position,t,e||this.localTransform.y).invert(),this.setLocalTransform(ka),this.target=t})}),ja=1028,En=1029,Xa=2304,Cn=2305,Dn=5121,Ln=5126,Pn=6402,qa=6408,Mi=9728,Ai=9729,Za=9984,Ya=9985,Ka=9986,Ei=9987,Qa=10497,sr=33071,Ja=33306;var $a,re=Oe.extend({material:null,geometry:null,mode:4,_renderInfo:null},{__program:null,lightGroup:0,renderOrder:0,culling:!0,cullFace:En,frontFace:Cn,frustumCulling:!0,receiveShadow:!0,castShadow:!0,ignorePicking:!1,ignorePreZ:!1,ignoreGBuffer:!1,isRenderable:function(){return this.geometry&&this.material&&this.material.shader&&!this.invisible&&this.geometry.vertexCount>0},beforeRender:function(t){},afterRender:function(t,e){},getBoundingBox:function(t,e){return e=Oe.prototype.getBoundingBox.call(this,t,e),this.geometry&&this.geometry.boundingBox&&e.union(this.geometry.boundingBox),e},clone:($a=["castShadow","receiveShadow","mode","culling","cullFace","frontFace","frustumCulling","renderOrder","lineWidth","ignorePicking","ignorePreZ","ignoreGBuffer"],function(){var t=Oe.prototype.clone.call(this);t.geometry=this.geometry,t.material=this.material;for(var e=0;e<$a.length;e++){var r=$a[e];t[r]!==this[r]&&(t[r]=this[r])}return t})});re.POINTS=0,re.LINES=1,re.LINE_LOOP=2,re.LINE_STRIP=3,re.TRIANGLES=4,re.TRIANGLE_STRIP=5,re.TRIANGLE_FAN=6,re.BACK=En,re.FRONT=ja,re.FRONT_AND_BACK=1032,re.CW=Xa,re.CCW=Cn;let to=re;var ie=to.extend({skeleton:null,joints:null},(function(){this.joints||(this.joints=[])}),{offsetMatrix:null,isInstancedMesh:function(){return!1},isSkinnedMesh:function(){return!!(this.skeleton&&this.joints&&this.joints.length>0)},clone:function(){var t=to.prototype.clone.call(this);return t.skeleton=this.skeleton,this.joints&&(t.joints=this.joints.slice()),t}});ie.POINTS=0,ie.LINES=1,ie.LINE_LOOP=2,ie.LINE_STRIP=3,ie.TRIANGLES=4,ie.TRIANGLE_STRIP=5,ie.TRIANGLE_FAN=6,ie.BACK=En,ie.FRONT=ja,ie.FRONT_AND_BACK=1032,ie.CW=Xa,ie.CCW=Cn;let lr=ie;var Us=["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear","OES_standard_derivatives","OES_vertex_array_object","OES_element_index_uint","WEBGL_compressed_texture_s3tc","WEBGL_depth_texture","EXT_texture_filter_anisotropic","EXT_shader_texture_lod","WEBGL_draw_buffers","EXT_frag_depth","EXT_sRGB","ANGLE_instanced_arrays"],ks=["MAX_TEXTURE_SIZE","MAX_CUBE_MAP_TEXTURE_SIZE"];let Jh=function(t){for(var e={},r={},i=0;i<Us.length;i++)a(Us[i]);for(i=0;i<ks.length;i++){var n=ks[i];r[n]=t.getParameter(t[n])}function a(o){if(t.getExtension){var s=t.getExtension(o);s||(s=t.getExtension("MOZ_"+o)),s||(s=t.getExtension("WEBKIT_"+o)),e[o]=s}}this.getExtension=function(o){return o in e||a(o),e[o]},this.getParameter=function(o){return r[o]}},$h={get:function(t){var e=new XMLHttpRequest;e.open("get",t.url),e.responseType=t.responseType||"text",t.onprogress&&(e.onprogress=function(r){if(r.lengthComputable){var i=r.loaded/r.total;t.onprogress(i,r.loaded,r.total)}else t.onprogress(null)}),e.onload=function(r){e.status>=400?t.onerror&&t.onerror():t.onload&&t.onload(e.response)},t.onerror&&(e.onerror=t.onerror),e.send(null)}};var eo,Qt={supportWebGL:function(){if(eo==null)try{var t=document.createElement("canvas");if(!t.getContext("webgl")&&!t.getContext("experimental-webgl"))throw new Error}catch{eo=!1}return eo}};Qt.Int8Array=typeof Int8Array>"u"?Array:Int8Array,Qt.Uint8Array=typeof Uint8Array>"u"?Array:Uint8Array,Qt.Uint16Array=typeof Uint16Array>"u"?Array:Uint16Array,Qt.Uint32Array=typeof Uint32Array>"u"?Array:Uint32Array,Qt.Int16Array=typeof Int16Array>"u"?Array:Int16Array,Qt.Float32Array=typeof Float32Array>"u"?Array:Float32Array,Qt.Float64Array=typeof Float64Array>"u"?Array:Float64Array;var ur={};typeof window<"u"?ur=window:yn.g!==void 0&&(ur=yn.g),Qt.requestAnimationFrame=ur.requestAnimationFrame||ur.msRequestAnimationFrame||ur.mozRequestAnimationFrame||ur.webkitRequestAnimationFrame||function(t){setTimeout(t,16)},Qt.createCanvas=function(){return document.createElement("canvas")},Qt.createImage=function(){return new ur.Image},Qt.request={get:$h.get},Qt.addEventListener=function(t,e,r,i){t.addEventListener(e,r,i)},Qt.removeEventListener=function(t,e,r){t.removeEventListener(e,r)};let At=Qt;var Nt=function(){this.head=null,this.tail=null,this._length=0};Nt.prototype.insert=function(t){var e=new Nt.Entry(t);return this.insertEntry(e),e},Nt.prototype.insertAt=function(t,e){if(!(t<0)){for(var r=this.head,i=0;r&&i!=t;)r=r.next,i++;if(r){var n=new Nt.Entry(e),a=r.prev;a?(a.next=n,n.prev=a):this.head=n,n.next=r,r.prev=n}else this.insert(e)}},Nt.prototype.insertBeforeEntry=function(t,e){var r=new Nt.Entry(t),i=e.prev;i?(i.next=r,r.prev=i):this.head=r,r.next=e,e.prev=r,this._length++},Nt.prototype.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,this.tail=t):this.head=this.tail=t,this._length++},Nt.prototype.remove=function(t){var e=t.prev,r=t.next;e?e.next=r:this.head=r,r?r.prev=e:this.tail=e,t.next=t.prev=null,this._length--},Nt.prototype.removeAt=function(t){if(!(t<0)){for(var e=this.head,r=0;e&&r!=t;)e=e.next,r++;return e?(this.remove(e),e.value):void 0}},Nt.prototype.getHead=function(){if(this.head)return this.head.value},Nt.prototype.getTail=function(){if(this.tail)return this.tail.value},Nt.prototype.getAt=function(t){if(!(t<0)){for(var e=this.head,r=0;e&&r!=t;)e=e.next,r++;return e.value}},Nt.prototype.indexOf=function(t){for(var e=this.head,r=0;e;){if(e.value===t)return r;e=e.next,r++}},Nt.prototype.length=function(){return this._length},Nt.prototype.isEmpty=function(){return this._length===0},Nt.prototype.forEach=function(t,e){for(var r=this.head,i=0,n=e!==void 0;r;)n?t.call(e,r.value,i):t(r.value,i),r=r.next,i++},Nt.prototype.clear=function(){this.tail=this.head=null,this._length=0},Nt.Entry=function(t){this.value=t,this.next=null,this.prev=null};let tc=Nt;var Ur=function(t){this._list=new tc,this._map={},this._maxSize=t||10};Ur.prototype.setMaxSize=function(t){this._maxSize=t},Ur.prototype.put=function(t,e){if(!this._map.hasOwnProperty(t)){var r=this._list.length();if(r>=this._maxSize&&r>0){var i=this._list.head;this._list.remove(i),delete this._map[i.key]}var n=this._list.insert(e);n.key=t,this._map[t]=n}},Ur.prototype.get=function(t){var e=this._map[t];if(this._map.hasOwnProperty(t))return e!==this._list.tail&&(this._list.remove(e),this._list.insertEntry(e)),e.value},Ur.prototype.remove=function(t){var e=this._map[t];e!==void 0&&(delete this._map[t],this._list.remove(e))},Ur.prototype.clear=function(){this._list.clear(),this._map={}};let Vs=Ur;var vt={},Hs={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function xe(t){return(t=Math.round(t))<0?0:t>255?255:t}function Ci(t){return t<0?0:t>1?1:t}function ro(t){return t.length&&t.charAt(t.length-1)==="%"?xe(parseFloat(t)/100*255):xe(parseInt(t,10))}function kr(t){return t.length&&t.charAt(t.length-1)==="%"?Ci(parseFloat(t)/100):Ci(parseFloat(t))}function io(t,e,r){return r<0?r+=1:r>1&&(r-=1),6*r<1?t+(e-t)*r*6:2*r<1?e:3*r<2?t+(e-t)*(.6666666666666666-r)*6:t}function Xe(t,e,r){return t+(e-t)*r}function be(t,e,r,i,n){return t[0]=e,t[1]=r,t[2]=i,t[3]=n,t}function no(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}var Ws=new Vs(20),On=null;function Vr(t,e){On&&no(On,e),On=Ws.put(t,On||e.slice())}function ao(t,e){var r=(parseFloat(t[0])%360+360)%360/360,i=kr(t[1]),n=kr(t[2]),a=n<=.5?n*(i+1):n+i-n*i,o=2*n-a;return be(e=e||[],xe(255*io(o,a,r+.3333333333333333)),xe(255*io(o,a,r)),xe(255*io(o,a,r-.3333333333333333)),1),t.length===4&&(e[3]=t[3]),e}vt.parse=function(t,e){if(t){e=e||[];var r=Ws.get(t);if(r)return no(e,r);var i,n=(t+="").replace(/ /g,"").toLowerCase();if(n in Hs)return no(e,Hs[n]),Vr(t,e),e;if(n.charAt(0)==="#")return n.length===4?(i=parseInt(n.substr(1),16))>=0&&i<=4095?(be(e,(3840&i)>>4|(3840&i)>>8,240&i|(240&i)>>4,15&i|(15&i)<<4,1),Vr(t,e),e):void be(e,0,0,0,1):n.length===7?(i=parseInt(n.substr(1),16))>=0&&i<=16777215?(be(e,(16711680&i)>>16,(65280&i)>>8,255&i,1),Vr(t,e),e):void be(e,0,0,0,1):void 0;var a=n.indexOf("("),o=n.indexOf(")");if(a!==-1&&o+1===n.length){var s=n.substr(0,a),l=n.substr(a+1,o-(a+1)).split(","),u=1;switch(s){case"rgba":if(l.length!==4)return void be(e,0,0,0,1);u=kr(l.pop());case"rgb":return l.length!==3?void be(e,0,0,0,1):(be(e,ro(l[0]),ro(l[1]),ro(l[2]),u),Vr(t,e),e);case"hsla":return l.length!==4?void be(e,0,0,0,1):(l[3]=kr(l[3]),ao(l,e),Vr(t,e),e);case"hsl":return l.length!==3?void be(e,0,0,0,1):(ao(l,e),Vr(t,e),e);default:return}}be(e,0,0,0,1)}},vt.parseToFloat=function(t,e){if(e=vt.parse(t,e))return e[0]/=255,e[1]/=255,e[2]/=255,e},vt.lift=function(t,e){var r=vt.parse(t);if(r){for(var i=0;i<3;i++)r[i]=e<0?r[i]*(1-e)|0:(255-r[i])*e+r[i]|0;return vt.stringify(r,r.length===4?"rgba":"rgb")}},vt.toHex=function(t){var e=vt.parse(t);if(e)return(16777216+(e[0]<<16)+(e[1]<<8)+ +e[2]).toString(16).slice(1)},vt.fastLerp=function(t,e,r){if(e&&e.length&&t>=0&&t<=1){r=r||[];var i=t*(e.length-1),n=Math.floor(i),a=Math.ceil(i),o=e[n],s=e[a],l=i-n;return r[0]=xe(Xe(o[0],s[0],l)),r[1]=xe(Xe(o[1],s[1],l)),r[2]=xe(Xe(o[2],s[2],l)),r[3]=Ci(Xe(o[3],s[3],l)),r}},vt.fastMapToColor=vt.fastLerp,vt.lerp=function(t,e,r){if(e&&e.length&&t>=0&&t<=1){var i=t*(e.length-1),n=Math.floor(i),a=Math.ceil(i),o=vt.parse(e[n]),s=vt.parse(e[a]),l=i-n,u=vt.stringify([xe(Xe(o[0],s[0],l)),xe(Xe(o[1],s[1],l)),xe(Xe(o[2],s[2],l)),Ci(Xe(o[3],s[3],l))],"rgba");return r?{color:u,leftIndex:n,rightIndex:a,value:i}:u}},vt.mapToColor=vt.lerp,vt.modifyHSL=function(t,e,r,i){if(t=vt.parse(t))return t=(function(a){if(a){var o,s,l=a[0]/255,u=a[1]/255,h=a[2]/255,c=Math.min(l,u,h),f=Math.max(l,u,h),p=f-c,d=(f+c)/2;if(p===0)o=0,s=0;else{s=d<.5?p/(f+c):p/(2-f-c);var m=((f-l)/6+p/2)/p,g=((f-u)/6+p/2)/p,_=((f-h)/6+p/2)/p;l===f?o=_-g:u===f?o=.3333333333333333+m-_:h===f&&(o=.6666666666666666+g-m),o<0&&(o+=1),o>1&&(o-=1)}var y=[360*o,s,d];return a[3]!=null&&y.push(a[3]),y}})(t),e!=null&&(t[0]=(n=e,(n=Math.round(n))<0?0:n>360?360:n)),r!=null&&(t[1]=kr(r)),i!=null&&(t[2]=kr(i)),vt.stringify(ao(t),"rgba");var n},vt.modifyAlpha=function(t,e){if((t=vt.parse(t))&&e!=null)return t[3]=Ci(e),vt.stringify(t,"rgba")},vt.stringify=function(t,e){if(t&&t.length){var r=t[0]+","+t[1]+","+t[2];return e!=="rgba"&&e!=="hsva"&&e!=="hsla"||(r+=","+t[3]),e+"("+r+")"}};var ec=vt.parseToFloat,oo={};function js(t){var e=Object.keys(t);e.sort();for(var r=[],i=0;i<e.length;i++){var n=e[i],a=t[n];a===null?r.push(n):r.push(n+" "+a.toString())}return r.join(`
`)}let he=jt.extend((function(){return{name:"",depthTest:!0,depthMask:!0,transparent:!1,blend:null,autoUpdateTextureStatus:!0,uniforms:{},vertexDefines:{},fragmentDefines:{},_textureStatus:{},_enabledUniforms:null}}),(function(){this.name||(this.name="MATERIAL_"+this.__uid__),this.shader&&this.attachShader(this.shader,!0)}),{precision:"highp",setUniform:function(t,e){e===void 0&&console.warn('Uniform value "'+t+'" is undefined');var r=this.uniforms[t];r&&(typeof e=="string"&&(e=ec(e)||e),r.value=e,this.autoUpdateTextureStatus&&r.type==="t"&&(e?this.enableTexture(t):this.disableTexture(t)))},setUniforms:function(t){for(var e in t){var r=t[e];this.setUniform(e,r)}},isUniformEnabled:function(t){return this._enabledUniforms.indexOf(t)>=0},getEnabledUniforms:function(){return this._enabledUniforms},getTextureUniforms:function(){return this._textureUniforms},set:function(t,e){if(typeof t=="object")for(var r in t){var i=t[r];this.setUniform(r,i)}else this.setUniform(t,e)},get:function(t){var e=this.uniforms[t];if(e)return e.value},attachShader:function(t,e){var r=this.uniforms;this.uniforms=t.createUniforms(),this.shader=t;var i=this.uniforms;this._enabledUniforms=Object.keys(i),this._enabledUniforms.sort(),this._textureUniforms=this._enabledUniforms.filter((function(u){var h=this.uniforms[u].type;return h==="t"||h==="tv"}),this);var n=this.vertexDefines,a=this.fragmentDefines;if(this.vertexDefines=zt.clone(t.vertexDefines),this.fragmentDefines=zt.clone(t.fragmentDefines),e){for(var o in r)i[o]&&(i[o].value=r[o].value);zt.defaults(this.vertexDefines,n),zt.defaults(this.fragmentDefines,a)}var s={};for(var l in t.textures)s[l]={shaderType:t.textures[l].shaderType,type:t.textures[l].type,enabled:!(!e||!this._textureStatus[l])&&this._textureStatus[l].enabled};this._textureStatus=s,this._programKey=""},clone:function(){var t=new this.constructor({name:this.name,shader:this.shader});for(var e in this.uniforms)t.uniforms[e].value=this.uniforms[e].value;return t.depthTest=this.depthTest,t.depthMask=this.depthMask,t.transparent=this.transparent,t.blend=this.blend,t.vertexDefines=zt.clone(this.vertexDefines),t.fragmentDefines=zt.clone(this.fragmentDefines),t.enableTexture(this.getEnabledTextures()),t.precision=this.precision,t},define:function(t,e,r){var i=this.vertexDefines,n=this.fragmentDefines;t!=="vertex"&&t!=="fragment"&&t!=="both"&&arguments.length<3&&(r=e,e=t,t="both"),r=r??null,t!=="vertex"&&t!=="both"||i[e]!==r&&(i[e]=r,this._programKey=""),t!=="fragment"&&t!=="both"||n[e]!==r&&(n[e]=r,t!=="both"&&(this._programKey=""))},undefine:function(t,e){t!=="vertex"&&t!=="fragment"&&t!=="both"&&arguments.length<2&&(e=t,t="both"),t!=="vertex"&&t!=="both"||this.isDefined("vertex",e)&&(delete this.vertexDefines[e],this._programKey=""),t!=="fragment"&&t!=="both"||this.isDefined("fragment",e)&&(delete this.fragmentDefines[e],t!=="both"&&(this._programKey=""))},isDefined:function(t,e){switch(t){case"vertex":return this.vertexDefines[e]!==void 0;case"fragment":return this.fragmentDefines[e]!==void 0}},getDefine:function(t,e){switch(t){case"vertex":return this.vertexDefines[e];case"fragment":return this.fragmentDefines[e]}},enableTexture:function(t){if(Array.isArray(t))for(var e=0;e<t.length;e++)this.enableTexture(t[e]);else{var r=this._textureStatus[t];r&&(r.enabled||(r.enabled=!0,this._programKey=""))}},enableTexturesAll:function(){var t=this._textureStatus;for(var e in t)t[e].enabled=!0;this._programKey=""},disableTexture:function(t){if(Array.isArray(t))for(var e=0;e<t.length;e++)this.disableTexture(t[e]);else{var r=this._textureStatus[t];r&&(!r.enabled||(r.enabled=!1,this._programKey=""))}},disableTexturesAll:function(){var t=this._textureStatus;for(var e in t)t[e].enabled=!1;this._programKey=""},isTextureEnabled:function(t){var e=this._textureStatus;return!!e[t]&&e[t].enabled},getEnabledTextures:function(){var t=[],e=this._textureStatus;for(var r in e)e[r].enabled&&t.push(r);return t},dirtyDefines:function(){this._programKey=""},getProgramKey:function(){return this._programKey||(this._programKey=(function(t,e,r){r.sort();for(var i=[],n=0;n<r.length;n++){var a=r[n];i.push(a)}var o=js(t)+`
`+js(e)+`
`+i.join(`
`);if(oo[o])return oo[o];var s=zt.genGUID();return oo[o]=s,s})(this.vertexDefines,this.fragmentDefines,this.getEnabledTextures())),this._programKey}});var et={create:function(){var t=new Gt(2);return t[0]=0,t[1]=0,t},clone:function(t){var e=new Gt(2);return e[0]=t[0],e[1]=t[1],e},fromValues:function(t,e){var r=new Gt(2);return r[0]=t,r[1]=e,r},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t},set:function(t,e,r){return t[0]=e,t[1]=r,t},add:function(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t},subtract:function(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t}};et.sub=et.subtract,et.multiply=function(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t},et.mul=et.multiply,et.divide=function(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t},et.div=et.divide,et.min=function(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t},et.max=function(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t},et.scale=function(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t},et.scaleAndAdd=function(t,e,r,i){return t[0]=e[0]+r[0]*i,t[1]=e[1]+r[1]*i,t},et.distance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1];return Math.sqrt(r*r+i*i)},et.dist=et.distance,et.squaredDistance=function(t,e){var r=e[0]-t[0],i=e[1]-t[1];return r*r+i*i},et.sqrDist=et.squaredDistance,et.length=function(t){var e=t[0],r=t[1];return Math.sqrt(e*e+r*r)},et.len=et.length,et.squaredLength=function(t){var e=t[0],r=t[1];return e*e+r*r},et.sqrLen=et.squaredLength,et.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t},et.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t},et.normalize=function(t,e){var r=e[0],i=e[1],n=r*r+i*i;return n>0&&(n=1/Math.sqrt(n),t[0]=e[0]*n,t[1]=e[1]*n),t},et.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},et.cross=function(t,e,r){var i=e[0]*r[1]-e[1]*r[0];return t[0]=t[1]=0,t[2]=i,t},et.lerp=function(t,e,r,i){var n=e[0],a=e[1];return t[0]=n+i*(r[0]-n),t[1]=a+i*(r[1]-a),t},et.random=function(t,e){e=e||1;var r=2*GLMAT_RANDOM()*Math.PI;return t[0]=Math.cos(r)*e,t[1]=Math.sin(r)*e,t},et.transformMat2=function(t,e,r){var i=e[0],n=e[1];return t[0]=r[0]*i+r[2]*n,t[1]=r[1]*i+r[3]*n,t},et.transformMat2d=function(t,e,r){var i=e[0],n=e[1];return t[0]=r[0]*i+r[2]*n+r[4],t[1]=r[1]*i+r[3]*n+r[5],t},et.transformMat3=function(t,e,r){var i=e[0],n=e[1];return t[0]=r[0]*i+r[3]*n+r[6],t[1]=r[1]*i+r[4]*n+r[7],t},et.transformMat4=function(t,e,r){var i=e[0],n=e[1];return t[0]=r[0]*i+r[4]*n+r[12],t[1]=r[1]*i+r[5]*n+r[13],t},et.forEach=(function(){var t=et.create();return function(e,r,i,n,a,o){var s,l;for(r||(r=2),i||(i=0),l=n?Math.min(n*r+i,e.length):e.length,s=i;s<l;s+=r)t[0]=e[s],t[1]=e[s+1],a(t,t,o),e[s]=t[0],e[s+1]=t[1];return e}})();let W=et;var ot=function(t,e){t=t||0,e=e||0,this.array=W.fromValues(t,e),this._dirty=!0};if(ot.prototype={constructor:ot,add:function(t){return W.add(this.array,this.array,t.array),this._dirty=!0,this},set:function(t,e){return this.array[0]=t,this.array[1]=e,this._dirty=!0,this},setArray:function(t){return this.array[0]=t[0],this.array[1]=t[1],this._dirty=!0,this},clone:function(){return new ot(this.x,this.y)},copy:function(t){return W.copy(this.array,t.array),this._dirty=!0,this},cross:function(t,e){return W.cross(t.array,this.array,e.array),t._dirty=!0,this},dist:function(t){return W.dist(this.array,t.array)},distance:function(t){return W.distance(this.array,t.array)},div:function(t){return W.div(this.array,this.array,t.array),this._dirty=!0,this},divide:function(t){return W.divide(this.array,this.array,t.array),this._dirty=!0,this},dot:function(t){return W.dot(this.array,t.array)},len:function(){return W.len(this.array)},length:function(){return W.length(this.array)},lerp:function(t,e,r){return W.lerp(this.array,t.array,e.array,r),this._dirty=!0,this},min:function(t){return W.min(this.array,this.array,t.array),this._dirty=!0,this},max:function(t){return W.max(this.array,this.array,t.array),this._dirty=!0,this},mul:function(t){return W.mul(this.array,this.array,t.array),this._dirty=!0,this},multiply:function(t){return W.multiply(this.array,this.array,t.array),this._dirty=!0,this},negate:function(){return W.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return W.normalize(this.array,this.array),this._dirty=!0,this},random:function(t){return W.random(this.array,t),this._dirty=!0,this},scale:function(t){return W.scale(this.array,this.array,t),this._dirty=!0,this},scaleAndAdd:function(t,e){return W.scaleAndAdd(this.array,this.array,t.array,e),this._dirty=!0,this},sqrDist:function(t){return W.sqrDist(this.array,t.array)},squaredDistance:function(t){return W.squaredDistance(this.array,t.array)},sqrLen:function(){return W.sqrLen(this.array)},squaredLength:function(){return W.squaredLength(this.array)},sub:function(t){return W.sub(this.array,this.array,t.array),this._dirty=!0,this},subtract:function(t){return W.subtract(this.array,this.array,t.array),this._dirty=!0,this},transformMat2:function(t){return W.transformMat2(this.array,this.array,t.array),this._dirty=!0,this},transformMat2d:function(t){return W.transformMat2d(this.array,this.array,t.array),this._dirty=!0,this},transformMat3:function(t){return W.transformMat3(this.array,this.array,t.array),this._dirty=!0,this},transformMat4:function(t){return W.transformMat4(this.array,this.array,t.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},Object.defineProperty){var Xs=ot.prototype;Object.defineProperty(Xs,"x",{get:function(){return this.array[0]},set:function(t){this.array[0]=t,this._dirty=!0}}),Object.defineProperty(Xs,"y",{get:function(){return this.array[1]},set:function(t){this.array[1]=t,this._dirty=!0}})}ot.add=function(t,e,r){return W.add(t.array,e.array,r.array),t._dirty=!0,t},ot.set=function(t,e,r){return W.set(t.array,e,r),t._dirty=!0,t},ot.copy=function(t,e){return W.copy(t.array,e.array),t._dirty=!0,t},ot.cross=function(t,e,r){return W.cross(t.array,e.array,r.array),t._dirty=!0,t},ot.distance=ot.dist=function(t,e){return W.distance(t.array,e.array)},ot.divide=ot.div=function(t,e,r){return W.divide(t.array,e.array,r.array),t._dirty=!0,t},ot.dot=function(t,e){return W.dot(t.array,e.array)},ot.len=function(t){return W.length(t.array)},ot.lerp=function(t,e,r,i){return W.lerp(t.array,e.array,r.array,i),t._dirty=!0,t},ot.min=function(t,e,r){return W.min(t.array,e.array,r.array),t._dirty=!0,t},ot.max=function(t,e,r){return W.max(t.array,e.array,r.array),t._dirty=!0,t},ot.multiply=ot.mul=function(t,e,r){return W.multiply(t.array,e.array,r.array),t._dirty=!0,t},ot.negate=function(t,e){return W.negate(t.array,e.array),t._dirty=!0,t},ot.normalize=function(t,e){return W.normalize(t.array,e.array),t._dirty=!0,t},ot.random=function(t,e){return W.random(t.array,e),t._dirty=!0,t},ot.scale=function(t,e,r){return W.scale(t.array,e.array,r),t._dirty=!0,t},ot.scaleAndAdd=function(t,e,r,i){return W.scaleAndAdd(t.array,e.array,r.array,i),t._dirty=!0,t},ot.squaredDistance=ot.sqrDist=function(t,e){return W.sqrDist(t.array,e.array)},ot.squaredLength=ot.sqrLen=function(t){return W.sqrLen(t.array)},ot.subtract=ot.sub=function(t,e,r){return W.subtract(t.array,e.array,r.array),t._dirty=!0,t},ot.transformMat2=function(t,e,r){return W.transformMat2(t.array,e.array,r.array),t._dirty=!0,t},ot.transformMat2d=function(t,e,r){return W.transformMat2d(t.array,e.array,r.array),t._dirty=!0,t},ot.transformMat3=function(t,e,r){return W.transformMat3(t.array,e.array,r.array),t._dirty=!0,t},ot.transformMat4=function(t,e,r){return W.transformMat4(t.array,e.array,r.array),t._dirty=!0,t};let ne=ot;var qs={};function rc(t){for(var e=t.split(`
`),r=0,i=e.length;r<i;r++)e[r]=r+1+": "+e[r];return e.join(`
`)}function Zs(t,e,r){if(!t.getShaderParameter(e,t.COMPILE_STATUS))return[t.getShaderInfoLog(e),rc(r)].join(`
`)}var Ys=new At.Float32Array(16);let ic=jt.extend({uniformSemantics:{},attributes:{}},(function(){this._locations={},this._textureSlot=0,this._program=null}),{bind:function(t){this._textureSlot=0,t.gl.useProgram(this._program)},hasUniform:function(t){return this._locations[t]!=null},useTextureSlot:function(t,e,r){e&&(t.gl.activeTexture(t.gl.TEXTURE0+r),e.isRenderable()?e.bind(t):e.unbind(t))},currentTextureSlot:function(){return this._textureSlot},resetTextureSlot:function(t){this._textureSlot=t||0},takeCurrentTextureSlot:function(t,e){var r=this._textureSlot;return this.useTextureSlot(t,e,r),this._textureSlot++,r},setUniform:function(t,e,r,i){var n=this._locations[r];if(n==null)return!1;switch(e){case"m4":if(!(i instanceof Float32Array)){for(var a=0;a<i.length;a++)Ys[a]=i[a];i=Ys}t.uniformMatrix4fv(n,!1,i);break;case"2i":t.uniform2i(n,i[0],i[1]);break;case"2f":t.uniform2f(n,i[0],i[1]);break;case"3i":t.uniform3i(n,i[0],i[1],i[2]);break;case"3f":t.uniform3f(n,i[0],i[1],i[2]);break;case"4i":t.uniform4i(n,i[0],i[1],i[2],i[3]);break;case"4f":t.uniform4f(n,i[0],i[1],i[2],i[3]);break;case"1i":t.uniform1i(n,i);break;case"1f":t.uniform1f(n,i);break;case"1fv":t.uniform1fv(n,i);break;case"1iv":t.uniform1iv(n,i);break;case"2iv":t.uniform2iv(n,i);break;case"2fv":t.uniform2fv(n,i);break;case"3iv":t.uniform3iv(n,i);break;case"3fv":t.uniform3fv(n,i);break;case"4iv":t.uniform4iv(n,i);break;case"4fv":t.uniform4fv(n,i);break;case"m2":case"m2v":t.uniformMatrix2fv(n,!1,i);break;case"m3":case"m3v":t.uniformMatrix3fv(n,!1,i);break;case"m4v":if(Array.isArray(i)&&Array.isArray(i[0])){var o=new At.Float32Array(16*i.length),s=0;for(a=0;a<i.length;a++)for(var l=i[a],u=0;u<16;u++)o[s++]=l[u];t.uniformMatrix4fv(n,!1,o)}else t.uniformMatrix4fv(n,!1,i)}return!0},setUniformOfSemantic:function(t,e,r){var i=this.uniformSemantics[e];return!!i&&this.setUniform(t,i.type,i.symbol,r)},enableAttributes:function(t,e,r){var i,n=t.gl,a=this._program,o=this._locations;(i=r?r.__enabledAttributeList:qs[t.__uid__])||(i=r?r.__enabledAttributeList=[]:qs[t.__uid__]=[]);for(var s=[],l=0;l<e.length;l++){var u=e[l];if(this.attributes[u]){var h=o[u];if(h==null){if((h=n.getAttribLocation(a,u))===-1){s[l]=-1;continue}o[u]=h}s[l]=h,i[h]?i[h]=2:i[h]=1}else s[l]=-1}for(l=0;l<i.length;l++)switch(i[l]){case 1:n.enableVertexAttribArray(l),i[l]=3;break;case 2:i[l]=3;break;case 3:n.disableVertexAttribArray(l),i[l]=0}return s},getAttribLocation:function(t,e){var r=this._locations,i=r[e];return i==null&&(i=t.getAttribLocation(this._program,e),r[e]=i),i},buildProgram:function(t,e,r,i){var n=t.createShader(t.VERTEX_SHADER),a=t.createProgram();t.shaderSource(n,r),t.compileShader(n);var o=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(o,i),t.compileShader(o);var s=Zs(t,n,r);if(s||(s=Zs(t,o,i)))return s;if(t.attachShader(a,n),t.attachShader(a,o),e.attributeSemantics.POSITION)t.bindAttribLocation(a,0,e.attributeSemantics.POSITION.symbol);else{var l=Object.keys(this.attributes);t.bindAttribLocation(a,0,l[0])}if(t.linkProgram(a),t.deleteShader(n),t.deleteShader(o),this._program=a,this.vertexCode=r,this.fragmentCode=i,!t.getProgramParameter(a,t.LINK_STATUS))return`Could not link program
`+t.getProgramInfoLog(a);for(var u=0;u<e.uniforms.length;u++){var h=e.uniforms[u];this._locations[h]=t.getUniformLocation(a,h)}}});var nc=/for\s*?\(int\s*?_idx_\s*\=\s*([\w-]+)\;\s*_idx_\s*<\s*([\w-]+);\s*_idx_\s*\+\+\s*\)\s*\{\{([\s\S]+?)(?=\}\})\}\}/g;function Ks(t,e,r){var i={};for(var n in r)i[n+"_COUNT"]=r[n];return t.replace(nc,(function(a,o,s,l){var u="";isNaN(o)&&(o=o in e?e[o]:i[o]),isNaN(s)&&(s=s in e?e[s]:i[s]);for(var h=parseInt(o);h<parseInt(s);h++)u+="{"+l.replace(/float\s*\(\s*_idx_\s*\)/g,h.toFixed(1)).replace(/_idx_/g,h)+"}";return u}))}function so(t,e,r){var i=[];if(e)for(var n in e){var a=e[n];a>0&&i.push("#define "+n.toUpperCase()+"_COUNT "+a)}if(r)for(var o=0;o<r.length;o++){var s=r[o];i.push("#define "+s.toUpperCase()+"_ENABLED")}for(var s in t){var l=t[s];l===null?i.push("#define "+s):i.push("#define "+s+" "+l.toString())}return i.join(`
`)}function Qs(t){this._renderer=t,this._cache={}}Qs.prototype.getProgram=function(t,e,r){var i=this._cache,n=t.isSkinnedMesh&&t.isSkinnedMesh(),a=t.isInstancedMesh&&t.isInstancedMesh(),o="s"+e.shader.shaderID+"m"+e.getProgramKey();if(r&&(o+="se"+r.getProgramKey(t.lightGroup)),n&&(o+=",sk"+t.joints.length),a&&(o+=",is"),y=i[o])return y;var s=r?r.getLightsNumbers(t.lightGroup):{},l=this._renderer,u=l.gl,h=e.getEnabledTextures(),c="";if(n){var f={SKINNING:null,JOINT_COUNT:t.joints.length};t.joints.length>l.getMaxJointNumber()&&(f.USE_SKIN_MATRICES_TEXTURE=null),c+=`
`+so(f)+`
`}a&&(c+=`
#define INSTANCING
`);var p=c+so(e.vertexDefines,s,h),d=c+so(e.fragmentDefines,s,h),m=p+`
`+e.shader.vertex,g=["OES_standard_derivatives","EXT_shader_texture_lod"].filter((function(S){return l.getGLExtension(S)!=null}));g.indexOf("EXT_shader_texture_lod")>=0&&(d+=`
#define SUPPORT_TEXTURE_LOD`),g.indexOf("OES_standard_derivatives")>=0&&(d+=`
#define SUPPORT_STANDARD_DERIVATIVES`);var _,y,x=(function(S){for(var A=[],D=0;D<S.length;D++)A.push("#extension GL_"+S[D]+" : enable");return A.join(`
`)})(g)+`
`+["precision",_=e.precision,"float"].join(" ")+`;
`+["precision",_,"int"].join(" ")+`;
`+["precision",_,"sampler2D"].join(" ")+`;

`+d+`
`+e.shader.fragment,v=Ks(m,e.vertexDefines,s),w=Ks(x,e.fragmentDefines,s);(y=new ic).uniformSemantics=e.shader.uniformSemantics,y.attributes=e.shader.attributes;var b=y.buildProgram(u,e.shader,v,w);return y.__error=b,i[o]=y,y};let ac=Qs;var Js=/uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g,oc=/attribute\s+(float|int|vec2|vec3|vec4)\s+([\s\S]*?);/g,$s=/#define\s+(\w+)?(\s+[\d-.]+)?\s*;?\s*\n/g,sc={bool:"1i",int:"1i",sampler2D:"t",samplerCube:"t",float:"1f",vec2:"2f",vec3:"3f",vec4:"4f",ivec2:"2i",ivec3:"3i",ivec4:"4i",mat2:"m2",mat3:"m3",mat4:"m4"};function ze(t){for(var e=[],r=0;r<t;r++)e[r]=0;return e}var tl={bool:function(){return!0},int:function(){return 0},float:function(){return 0},sampler2D:function(){return null},samplerCube:function(){return null},vec2:function(){return ze(2)},vec3:function(){return ze(3)},vec4:function(){return ze(4)},ivec2:function(){return ze(2)},ivec3:function(){return ze(3)},ivec4:function(){return ze(4)},mat2:function(){return ze(4)},mat3:function(){return ze(9)},mat4:function(){return ze(16)},array:function(){return[]}},lo=["POSITION","NORMAL","BINORMAL","TANGENT","TEXCOORD","TEXCOORD_0","TEXCOORD_1","COLOR","JOINT","WEIGHT"],el=["SKIN_MATRIX","VIEWPORT_SIZE","VIEWPORT","DEVICEPIXELRATIO","WINDOW_SIZE","NEAR","FAR","TIME"],rl=["WORLD","VIEW","PROJECTION","WORLDVIEW","VIEWPROJECTION","WORLDVIEWPROJECTION","WORLDINVERSE","VIEWINVERSE","PROJECTIONINVERSE","WORLDVIEWINVERSE","VIEWPROJECTIONINVERSE","WORLDVIEWPROJECTIONINVERSE","WORLDTRANSPOSE","VIEWTRANSPOSE","PROJECTIONTRANSPOSE","WORLDVIEWTRANSPOSE","VIEWPROJECTIONTRANSPOSE","WORLDVIEWPROJECTIONTRANSPOSE","WORLDINVERSETRANSPOSE","VIEWINVERSETRANSPOSE","PROJECTIONINVERSETRANSPOSE","WORLDVIEWINVERSETRANSPOSE","VIEWPROJECTIONINVERSETRANSPOSE","WORLDVIEWPROJECTIONINVERSETRANSPOSE"],lc={vec4:4,vec3:3,vec2:2,float:1},uo={},il={};function nl(t){return t.replace(/[ \t]*\/\/.*\n/g,"").replace(/[ \t]*\/\*[\s\S]*?\*\//g,"")}function Hr(){console.error("Wrong uniform/attributes syntax")}function al(t,e){for(var r=/[,=\(\):]/,i=e.replace(/:\s*\[\s*(.*)\s*\]/g,"="+t+"($1)").replace(/\s+/g,"").split(/(?=[,=\(\):])/g),n=[],a=0;a<i.length;a++)i[a].match(r)?n.push(i[a].charAt(0),i[a].slice(1)):n.push(i[a]);var o,s=0,l={},u=null;function h(p){p||Hr();var d=p.match(/\[(.*?)\]/);o=p.replace(/\[(.*?)\]/,""),l[o]={},d&&(l[o].isArray=!0,l[o].arraySize=d[1])}for(h((i=n)[0]),a=1;a<i.length;a++){var c=i[a];if(c)if(c!=="=")if(c!==":")if(c!==",")if(c!==")")if(c!=="(")if(c.indexOf("vec")>=0){if(s!==1&&s!==4){Hr();break}s=2,u=[]}else if(s!==1)if(s!==4)h(c),s=0;else{var f=c;lo.indexOf(f)>=0||el.indexOf(f)>=0||rl.indexOf(f)>=0?l[o].semantic=f:f==="ignore"||f==="unconfigurable"?l[o].ignore=!0:l[o].value=t==="bool"?f==="true":parseFloat(f)}else l[o].value=t==="bool"?c==="true":parseFloat(c),u=null;else{if(s!==2){Hr();break}if(!(u instanceof Array)){Hr();break}u.push(+i[++a])}else l[o].value=new At.Float32Array(u),u=null,s=5;else if(s===2){if(!(u instanceof Array)){Hr();break}u.push(+i[++a])}else s=5;else s=4;else{if(s!==0&&s!==3){Hr();break}s=1}}return l}function Dt(t,e){typeof t=="object"&&(e=t.fragment,t=t.vertex),t=nl(t),e=nl(e),this._shaderID=(function(r,i){var n="vertex:"+r+"fragment:"+i;if(uo[n])return uo[n];var a=zt.genGUID();return uo[n]=a,il[a]={vertex:r,fragment:i},a})(t,e),this._vertexCode=Dt.parseImport(t),this._fragmentCode=Dt.parseImport(e),this.attributeSemantics={},this.matrixSemantics={},this.uniformSemantics={},this.matrixSemanticKeys=[],this.uniformTemplates={},this.attributes={},this.textures={},this.vertexDefines={},this.fragmentDefines={},this._parseAttributes(),this._parseUniforms(),this._parseDefines()}Dt.prototype={constructor:Dt,createUniforms:function(){var t={};for(var e in this.uniformTemplates){var r=this.uniformTemplates[e];t[e]={type:r.type,value:r.value()}}return t},_parseImport:function(){this._vertexCode=Dt.parseImport(this.vertex),this._fragmentCode=Dt.parseImport(this.fragment)},_addSemanticUniform:function(t,e,r){if(lo.indexOf(r)>=0)this.attributeSemantics[r]={symbol:t,type:e};else if(rl.indexOf(r)>=0){var i=!1,n=r;r.match(/TRANSPOSE$/)&&(i=!0,n=r.slice(0,-9)),this.matrixSemantics[r]={symbol:t,type:e,isTranspose:i,semanticNoTranspose:n}}else el.indexOf(r)>=0&&(this.uniformSemantics[r]={symbol:t,type:e})},_addMaterialUniform:function(t,e,r,i,n,a){a[t]={type:r,value:n?tl.array:i||tl[e],semantic:null}},_parseUniforms:function(){var t={},e=this;function r(n){return n!=null?function(){return n}:null}function i(n,a,o){var s=al(a,o),l=[];for(var u in s){var h=s[u],c=h.semantic,f=u,p=sc[a],d=r(s[u].value);s[u].isArray&&(f+="["+s[u].arraySize+"]",p+="v"),l.push(f),e._uniformList.push(u),h.ignore||(a!=="sampler2D"&&a!=="samplerCube"||(e.textures[u]={shaderType:"fragment",type:a}),c?e._addSemanticUniform(u,p,c):e._addMaterialUniform(u,a,p,d,s[u].isArray,t))}return l.length>0?"uniform "+a+" "+l.join(",")+`;
`:""}this._uniformList=[],this._vertexCode=this._vertexCode.replace(Js,i),this._fragmentCode=this._fragmentCode.replace(Js,i),e.matrixSemanticKeys=Object.keys(this.matrixSemantics),this.uniformTemplates=t},_parseAttributes:function(){var t={},e=this;this._vertexCode=this._vertexCode.replace(oc,(function(r,i,n){var a=al(i,n),o=lc[i]||1,s=[];for(var l in a){var u=a[l].semantic;if(t[l]={type:"float",size:o,semantic:u||null},u){if(lo.indexOf(u)<0)throw new Error('Unkown semantic "'+u+'"');e.attributeSemantics[u]={symbol:l,type:i}}s.push(l)}return"attribute "+i+" "+s.join(",")+`;
`})),this.attributes=t},_parseDefines:function(){var t=this;function e(r,i,n){var a=t.fragmentDefines;return a[i]||(a[i]=n!=="false"&&(n==="true"||(n?isNaN(parseFloat(n))?n.trim():parseFloat(n):null))),""}this._vertexCode=this._vertexCode.replace($s,e),this._fragmentCode=this._fragmentCode.replace($s,e)},clone:function(){var t=il[this._shaderID];return new Dt(t.vertex,t.fragment)}},Object.defineProperty&&(Object.defineProperty(Dt.prototype,"shaderID",{get:function(){return this._shaderID}}),Object.defineProperty(Dt.prototype,"vertex",{get:function(){return this._vertexCode}}),Object.defineProperty(Dt.prototype,"fragment",{get:function(){return this._fragmentCode}}),Object.defineProperty(Dt.prototype,"uniforms",{get:function(){return this._uniformList}}));var uc=/(@import)\s*([0-9a-zA-Z_\-\.]*)/g;Dt.parseImport=function(t){return t.replace(uc,(function(e,r,i){return(e=Dt.source(i))?Dt.parseImport(e):(console.error('Shader chunk "'+i+'" not existed in library'),"")}))};var hc=/(@export)\s*([0-9a-zA-Z_\-\.]*)\s*\n([\s\S]*?)@end/g;Dt.import=function(t){t.replace(hc,(function(e,r,i,n){if(n=n.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+\x24)/g,"")){for(var a,o=i.split("."),s=Dt.codes,l=0;l<o.length-1;)s[a=o[l++]]||(s[a]={}),s=s[a];s[a=o[l]]=n}return n}))},Dt.codes={},Dt.source=function(t){for(var e=t.split("."),r=Dt.codes,i=0;r&&i<e.length;)r=r[e[i++]];return typeof r!="string"?(console.error('Shader "'+t+'" not existed in library'),""):r};let z=Dt,ol=`@export clay.prez.vertex
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
@end`;z.import(ol);var gt=R.create,sl={};function ll(t){return t.material}function cc(t,e,r){return e.uniforms[r].value}function dc(t,e,r,i){return r!==i}function fc(t){return!0}function ul(){}var hl={float:Ln,byte:5120,ubyte:Dn,short:5122,ushort:5123};function pc(t,e,r){this.availableAttributes=t,this.availableAttributeSymbols=e,this.indicesBuffer=r,this.vao=null}function mc(t){var e,r;this.bind=function(i){e||((e=At.createCanvas()).width=e.height=1,e.getContext("2d"));var n=i.gl,a=!r;a&&(r=n.createTexture()),n.bindTexture(n.TEXTURE_2D,r),a&&n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,e)},this.unbind=function(i){i.gl.bindTexture(i.gl.TEXTURE_2D,null)},this.isRenderable=function(){return!0}}var qe=jt.extend((function(){return{canvas:null,_width:100,_height:100,devicePixelRatio:typeof window<"u"&&window.devicePixelRatio||1,clearColor:[0,0,0,0],clearBit:17664,alpha:!0,depth:!0,stencil:!1,antialias:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1,throwError:!0,gl:null,viewport:{},maxJointNumber:20,__currentFrameBuffer:null,_viewportStack:[],_clearStack:[],_sceneRendering:null}}),(function(){this.canvas||(this.canvas=At.createCanvas());var t=this.canvas;try{var e={alpha:this.alpha,depth:this.depth,stencil:this.stencil,antialias:this.antialias,premultipliedAlpha:this.premultipliedAlpha,preserveDrawingBuffer:this.preserveDrawingBuffer};if(this.gl=t.getContext("webgl",e)||t.getContext("experimental-webgl",e),!this.gl)throw new Error;this._glinfo=new Jh(this.gl),this.gl.targetRenderer&&console.error("Already created a renderer"),this.gl.targetRenderer=this,this.resize()}catch(r){throw"Error creating WebGL Context "+r}this._programMgr=new ac(this),this._placeholderTexture=new mc(this)}),{resize:function(t,e){var r=this.canvas,i=this.devicePixelRatio;t!=null?(r.style&&(r.style.width=t+"px",r.style.height=e+"px"),r.width=t*i,r.height=e*i,this._width=t,this._height=e):(this._width=r.width/i,this._height=r.height/i),this.setViewport(0,0,this._width,this._height)},getWidth:function(){return this._width},getHeight:function(){return this._height},getViewportAspect:function(){var t=this.viewport;return t.width/t.height},setDevicePixelRatio:function(t){this.devicePixelRatio=t,this.resize(this._width,this._height)},getDevicePixelRatio:function(){return this.devicePixelRatio},getGLExtension:function(t){return this._glinfo.getExtension(t)},getGLParameter:function(t){return this._glinfo.getParameter(t)},setViewport:function(t,e,r,i,n){if(typeof t=="object"){var a=t;t=a.x,e=a.y,r=a.width,i=a.height,n=a.devicePixelRatio}n=n||this.devicePixelRatio,this.gl.viewport(t*n,e*n,r*n,i*n),this.viewport={x:t,y:e,width:r,height:i,devicePixelRatio:n}},saveViewport:function(){this._viewportStack.push(this.viewport)},restoreViewport:function(){this._viewportStack.length>0&&this.setViewport(this._viewportStack.pop())},saveClear:function(){this._clearStack.push({clearBit:this.clearBit,clearColor:this.clearColor})},restoreClear:function(){if(this._clearStack.length>0){var t=this._clearStack.pop();this.clearColor=t.clearColor,this.clearBit=t.clearBit}},bindSceneRendering:function(t){this._sceneRendering=t},render:function(t,e,r,i){var n=this.gl,a=this.clearColor;if(this.clearBit){n.colorMask(!0,!0,!0,!0),n.depthMask(!0);var o=this.viewport,s=!1,l=o.devicePixelRatio;(o.width!==this._width||o.height!==this._height||l&&l!==this.devicePixelRatio||o.x||o.y)&&(s=!0,n.enable(n.SCISSOR_TEST),n.scissor(o.x*l,o.y*l,o.width*l,o.height*l)),n.clearColor(a[0],a[1],a[2],a[3]),n.clear(this.clearBit),s&&n.disable(n.SCISSOR_TEST)}if(r||t.update(!1),t.updateLights(),e=e||t.getMainCamera()){e.update();var u=t.updateRenderList(e,!0);this._sceneRendering=t;var h=u.opaque,c=u.transparent,f=t.material;t.trigger("beforerender",this,t,e,u),i?(this.renderPreZ(h,t,e),n.depthFunc(n.LEQUAL)):n.depthFunc(n.LESS);for(var p=gt(),d=E.create(),m=0;m<c.length;m++){var g=c[m];R.multiplyAffine(p,e.viewMatrix.array,g.worldTransform.array),E.transformMat4(d,g.position.array,p),g.__depth=d[2]}this.renderPass(h,e,{getMaterial:function(_){return f||_.material},sortCompare:this.opaqueSortCompare}),this.renderPass(c,e,{getMaterial:function(_){return f||_.material},sortCompare:this.transparentSortCompare}),t.trigger("afterrender",this,t,e,u),this._sceneRendering=null}else console.error("Can't find camera in the scene.")},getProgram:function(t,e,r){return e=e||t.material,this._programMgr.getProgram(t,e,r)},validateProgram:function(t){if(t.__error){var e=t.__error;if(sl[t.__uid__])return;if(sl[t.__uid__]=!0,this.throwError)throw new Error(e);this.trigger("error",e)}},updatePrograms:function(t,e,r){var i=r&&r.getMaterial||ll;e=e||null;for(var n=0;n<t.length;n++){var a=t[n],o=i.call(this,a);if(n>0){var s=t[n-1],l=s.joints?s.joints.length:0;if((a.joints?a.joints.length:0)===l&&a.material===s.material&&a.lightGroup===s.lightGroup){a.__program=s.__program;continue}}var u=this._programMgr.getProgram(a,o,e);this.validateProgram(u),a.__program=u}},renderPass:function(t,e,r){this.trigger("beforerenderpass",this,t,e,r),(r=r||{}).getMaterial=r.getMaterial||ll,r.getUniform=r.getUniform||cc,r.isMaterialChanged=r.isMaterialChanged||dc,r.beforeRender=r.beforeRender||ul,r.afterRender=r.afterRender||ul;var i=r.ifRender||fc;this.updatePrograms(t,this._sceneRendering,r),r.sortCompare&&t.sort(r.sortCompare);var n=this.viewport,a=n.devicePixelRatio,o=[n.x*a,n.y*a,n.width*a,n.height*a],s=this.devicePixelRatio,l=this.__currentFrameBuffer?[this.__currentFrameBuffer.getTextureWidth(),this.__currentFrameBuffer.getTextureHeight()]:[this._width*s,this._height*s],u=[o[2],o[3]],h=Date.now();e?(R.copy(_t.VIEW,e.viewMatrix.array),R.copy(_t.PROJECTION,e.projectionMatrix.array),R.copy(_t.VIEWINVERSE,e.worldTransform.array)):(R.identity(_t.VIEW),R.identity(_t.PROJECTION),R.identity(_t.VIEWINVERSE)),R.multiply(_t.VIEWPROJECTION,_t.PROJECTION,_t.VIEW),R.invert(_t.PROJECTIONINVERSE,_t.PROJECTION),R.invert(_t.VIEWPROJECTIONINVERSE,_t.VIEWPROJECTION);for(var c,f,p,d,m,g,_,y,x,v,w,b,S=this.gl,A=this._sceneRendering,D=0;D<t.length;D++){var P,L=t[D],O=L.worldTransform!=null;if(i(L)){O&&(P=L.isSkinnedMesh&&L.isSkinnedMesh()?L.offsetMatrix?L.offsetMatrix.array:_t.IDENTITY:L.worldTransform.array);var N=L.geometry,C=r.getMaterial.call(this,L),B=L.__program,I=C.shader,X=N.__uid__+"-"+B.__uid__,V=X!==v;v=X,O&&(R.copy(_t.WORLD,P),R.multiply(_t.WORLDVIEWPROJECTION,_t.VIEWPROJECTION,P),R.multiplyAffine(_t.WORLDVIEW,_t.VIEW,P),(I.matrixSemantics.WORLDINVERSE||I.matrixSemantics.WORLDINVERSETRANSPOSE)&&R.invert(_t.WORLDINVERSE,P),(I.matrixSemantics.WORLDVIEWINVERSE||I.matrixSemantics.WORLDVIEWINVERSETRANSPOSE)&&R.invert(_t.WORLDVIEWINVERSE,_t.WORLDVIEW),(I.matrixSemantics.WORLDVIEWPROJECTIONINVERSE||I.matrixSemantics.WORLDVIEWPROJECTIONINVERSETRANSPOSE)&&R.invert(_t.WORLDVIEWPROJECTIONINVERSE,_t.WORLDVIEWPROJECTION)),L.beforeRender&&L.beforeRender(this),r.beforeRender.call(this,L,C,c);var st=B!==f;st?(B.bind(this),B.setUniformOfSemantic(S,"VIEWPORT",o),B.setUniformOfSemantic(S,"WINDOW_SIZE",l),e&&(B.setUniformOfSemantic(S,"NEAR",e.near),B.setUniformOfSemantic(S,"FAR",e.far)),B.setUniformOfSemantic(S,"DEVICEPIXELRATIO",a),B.setUniformOfSemantic(S,"TIME",h),B.setUniformOfSemantic(S,"VIEWPORT_SIZE",u),A&&A.setLightUniforms(B,L.lightGroup,this)):B=f,(st||r.isMaterialChanged(L,p,C,c))&&(C.depthTest!==d&&(C.depthTest?S.enable(S.DEPTH_TEST):S.disable(S.DEPTH_TEST),d=C.depthTest),C.depthMask!==m&&(S.depthMask(C.depthMask),m=C.depthMask),C.transparent!==x&&(C.transparent?S.enable(S.BLEND):S.disable(S.BLEND),x=C.transparent),C.transparent&&(C.blend?C.blend(S):(S.blendEquationSeparate(S.FUNC_ADD,S.FUNC_ADD),S.blendFuncSeparate(S.SRC_ALPHA,S.ONE_MINUS_SRC_ALPHA,S.ONE,S.ONE_MINUS_SRC_ALPHA))),b=this._bindMaterial(L,C,B,p||null,c||null,f||null,r.getUniform),c=C);var U=I.matrixSemanticKeys;if(O)for(var Tt=0;Tt<U.length;Tt++){var lt=U[Tt],ht=I.matrixSemantics[lt],Q=_t[lt];if(ht.isTranspose){var ee=_t[ht.semanticNoTranspose];R.transpose(Q,ee)}B.setUniform(S,ht.type,ht.symbol,Q)}L.cullFace!==_&&(_=L.cullFace,S.cullFace(_)),L.frontFace!==y&&(y=L.frontFace,S.frontFace(y)),L.culling!==g&&((g=L.culling)?S.enable(S.CULL_FACE):S.disable(S.CULL_FACE)),this._updateSkeleton(L,B,b),V&&(w=this._bindVAO(null,I,N,B)),this._renderObject(L,w,B),r.afterRender(this,L),L.afterRender&&L.afterRender(this),f=B,p=L}}this.trigger("afterrenderpass",this,t,e,r)},getMaxJointNumber:function(){return this.maxJointNumber},_updateSkeleton:function(t,e,r){var i=this.gl,n=t.skeleton;if(n)if(n.update(),t.joints.length>this.getMaxJointNumber()){var a=n.getSubSkinMatricesTexture(t.__uid__,t.joints);e.useTextureSlot(this,a,r),e.setUniform(i,"1i","skinMatricesTexture",r),e.setUniform(i,"1f","skinMatricesTextureSize",a.width)}else{var o=n.getSubSkinMatrices(t.__uid__,t.joints);e.setUniformOfSemantic(i,"SKIN_MATRIX",o)}},_renderObject:function(t,e,r){var i=this.gl,n=t.geometry,a=t.mode;a==null&&(a=4);var o=null,s=t.isInstancedMesh&&t.isInstancedMesh();if(!s||(o=this.getGLExtension("ANGLE_instanced_arrays"))){var l;if(s&&(l=this._bindInstancedAttributes(t,r,o)),e.indicesBuffer){var u=this.getGLExtension("OES_element_index_uint")&&n.indices instanceof Uint32Array?i.UNSIGNED_INT:i.UNSIGNED_SHORT;s?o.drawElementsInstancedANGLE(a,e.indicesBuffer.count,u,0,t.getInstanceCount()):i.drawElements(a,e.indicesBuffer.count,u,0)}else s?o.drawArraysInstancedANGLE(a,0,n.vertexCount,t.getInstanceCount()):i.drawArrays(a,0,n.vertexCount);if(s)for(var h=0;h<l.length;h++)i.disableVertexAttribArray(l[h])}else console.warn("Device not support ANGLE_instanced_arrays extension")},_bindInstancedAttributes:function(t,e,r){for(var i=this.gl,n=t.getInstancedAttributesBuffers(this),a=[],o=0;o<n.length;o++){var s=n[o],l=e.getAttribLocation(i,s.symbol);if(!(l<0)){var u=hl[s.type]||i.FLOAT;i.enableVertexAttribArray(l),i.bindBuffer(i.ARRAY_BUFFER,s.buffer),i.vertexAttribPointer(l,s.size,u,!1,0,0),r.vertexAttribDivisorANGLE(l,s.divisor),a.push(l)}}return a},_bindMaterial:function(t,e,r,i,n,a,o){for(var s=this.gl,l=a===r,u=r.currentTextureSlot(),h=e.getEnabledUniforms(),c=e.getTextureUniforms(),f=this._placeholderTexture,p=0;p<c.length;p++){var d=o(t,e,_=c[p]);if((g=e.uniforms[_].type)==="t"&&d)d.__slot=-1;else if(g==="tv")for(var m=0;m<d.length;m++)d[m]&&(d[m].__slot=-1)}for(f.__slot=-1,p=0;p<h.length;p++){var g,_=h[p],y=e.uniforms[_],x=(d=o(t,e,_),(g=y.type)==="t");if(x&&(d&&d.isRenderable()||(d=f)),n&&l){var v=o(i,n,_);if(x&&(v&&v.isRenderable()||(v=f)),v===d){if(x)r.takeCurrentTextureSlot(this,null);else if(g==="tv"&&d)for(m=0;m<d.length;m++)r.takeCurrentTextureSlot(this,null);continue}}if(d!=null)if(x)if(d.__slot<0){var w=r.currentTextureSlot();r.setUniform(s,"1i",_,w)&&(r.takeCurrentTextureSlot(this,d),d.__slot=w)}else r.setUniform(s,"1i",_,d.__slot);else if(Array.isArray(d)){if(d.length===0)continue;if(g==="tv"){if(!r.hasUniform(_))continue;var b=[];for(m=0;m<d.length;m++){var S=d[m];S.__slot<0?(w=r.currentTextureSlot(),b.push(w),r.takeCurrentTextureSlot(this,S),S.__slot=w):b.push(S.__slot)}r.setUniform(s,"1iv",_,b)}else r.setUniform(s,y.type,_,d)}else r.setUniform(s,y.type,_,d)}var A=r.currentTextureSlot();return r.resetTextureSlot(u),A},_bindVAO:function(t,e,r,i){var n=!r.dynamic,a=this.gl,o=this.__uid__+"-"+i.__uid__,s=r.__vaoCache[o];if(!s){var l=r.getBufferChunks(this);if(!l||!l.length)return;for(var u=l[0],h=u.attributeBuffers,c=u.indicesBuffer,f=[],p=[],d=0;d<h.length;d++){var m,g=(b=h[d]).name,_=b.semantic;if(_){var y=e.attributeSemantics[_];m=y&&y.symbol}else m=g;m&&i.attributes[m]&&(f.push(b),p.push(m))}s=new pc(f,p,c),n&&(r.__vaoCache[o]=s)}var x=!0;if(t&&n&&(s.vao==null?s.vao=t.createVertexArrayOES():x=!1,t.bindVertexArrayOES(s.vao)),f=s.availableAttributes,c=s.indicesBuffer,x){var v=i.enableAttributes(this,s.availableAttributeSymbols,t&&n&&s);for(d=0;d<f.length;d++){var w=v[d];if(w!==-1){var b,S=(b=f[d]).buffer,A=b.size,D=hl[b.type]||a.FLOAT;a.bindBuffer(a.ARRAY_BUFFER,S),a.vertexAttribPointer(w,A,D,!1,0,0)}}r.isUseIndices()&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,c.buffer)}return s},renderPreZ:function(t,e,r){var i=this.gl,n=this._prezMaterial||new he({shader:new z(z.source("clay.prez.vertex"),z.source("clay.prez.fragment"))});this._prezMaterial=n,i.colorMask(!1,!1,!1,!1),i.depthMask(!0),this.renderPass(t,r,{ifRender:function(a){return!a.ignorePreZ},isMaterialChanged:function(a,o){var s=a.material,l=o.material;return s.get("diffuseMap")!==l.get("diffuseMap")||(s.get("alphaCutoff")||0)!==(l.get("alphaCutoff")||0)},getUniform:function(a,o,s){return s==="alphaMap"?a.material.get("diffuseMap"):s==="alphaCutoff"?a.material.isDefined("fragment","ALPHA_TEST")&&a.material.get("diffuseMap")&&a.material.get("alphaCutoff")||0:s==="uvRepeat"?a.material.get("uvRepeat"):s==="uvOffset"?a.material.get("uvOffset"):o.get(s)},getMaterial:function(){return n},sort:this.opaqueSortCompare}),i.colorMask(!0,!0,!0,!0),i.depthMask(!0)},disposeScene:function(t){this.disposeNode(t,!0,!0),t.dispose()},disposeNode:function(t,e,r){t.getParent()&&t.getParent().remove(t);var i={};t.traverse((function(n){var a=n.material;if(n.geometry&&e&&n.geometry.dispose(this),r&&a&&!i[a.__uid__]){for(var o=a.getTextureUniforms(),s=0;s<o.length;s++){var l=o[s],u=a.uniforms[l].value,h=a.uniforms[l].type;if(u){if(h==="t")u.dispose&&u.dispose(this);else if(h==="tv")for(var c=0;c<u.length;c++)u[c]&&u[c].dispose&&u[c].dispose(this)}}i[a.__uid__]=!0}n.dispose&&n.dispose(this)}),this)},disposeGeometry:function(t){t.dispose(this)},disposeTexture:function(t){t.dispose(this)},disposeFrameBuffer:function(t){t.dispose(this)},dispose:function(){},screenToNDC:function(t,e,r){r||(r=new ne),e=this._height-e;var i=this.viewport,n=r.array;return n[0]=(t-i.x)/i.width,n[0]=2*n[0]-1,n[1]=(e-i.y)/i.height,n[1]=2*n[1]-1,r}});qe.opaqueSortCompare=qe.prototype.opaqueSortCompare=function(t,e){return t.renderOrder===e.renderOrder?t.__program===e.__program?t.material===e.material?t.geometry.__uid__-e.geometry.__uid__:t.material.__uid__-e.material.__uid__:t.__program&&e.__program?t.__program.__uid__-e.__program.__uid__:0:t.renderOrder-e.renderOrder},qe.transparentSortCompare=qe.prototype.transparentSortCompare=function(t,e){return t.renderOrder===e.renderOrder?t.__depth===e.__depth?t.__program===e.__program?t.material===e.material?t.geometry.__uid__-e.geometry.__uid__:t.material.__uid__-e.material.__uid__:t.__program&&e.__program?t.__program.__uid__-e.__program.__uid__:0:t.__depth-e.__depth:t.renderOrder-e.renderOrder};var _t={IDENTITY:gt(),WORLD:gt(),VIEW:gt(),PROJECTION:gt(),WORLDVIEW:gt(),VIEWPROJECTION:gt(),WORLDVIEWPROJECTION:gt(),WORLDINVERSE:gt(),VIEWINVERSE:gt(),PROJECTIONINVERSE:gt(),WORLDVIEWINVERSE:gt(),VIEWPROJECTIONINVERSE:gt(),WORLDVIEWPROJECTIONINVERSE:gt(),WORLDTRANSPOSE:gt(),VIEWTRANSPOSE:gt(),PROJECTIONTRANSPOSE:gt(),WORLDVIEWTRANSPOSE:gt(),VIEWPROJECTIONTRANSPOSE:gt(),WORLDVIEWPROJECTIONTRANSPOSE:gt(),WORLDINVERSETRANSPOSE:gt(),VIEWINVERSETRANSPOSE:gt(),PROJECTIONINVERSETRANSPOSE:gt(),WORLDVIEWINVERSETRANSPOSE:gt(),VIEWPROJECTIONINVERSETRANSPOSE:gt(),WORLDVIEWPROJECTIONINVERSETRANSPOSE:gt()};qe.COLOR_BUFFER_BIT=16384,qe.DEPTH_BUFFER_BIT=256,qe.STENCIL_BUFFER_BIT=1024;let Di=qe;var Li="__dt__",ho=function(){this._contextId=0,this._caches=[],this._context={}};(ho.prototype={use:function(t,e){var r=this._caches;r[t]||(r[t]={},e&&(r[t]=e())),this._contextId=t,this._context=r[t]},put:function(t,e){this._context[t]=e},get:function(t){return this._context[t]},dirty:function(t){var e=Li+(t=t||"");this.put(e,!0)},dirtyAll:function(t){for(var e=Li+(t=t||""),r=this._caches,i=0;i<r.length;i++)r[i]&&(r[i][e]=!0)},fresh:function(t){var e=Li+(t=t||"");this.put(e,!1)},freshAll:function(t){for(var e=Li+(t=t||""),r=this._caches,i=0;i<r.length;i++)r[i]&&(r[i][e]=!1)},isDirty:function(t){var e=Li+(t=t||""),r=this._context;return!r.hasOwnProperty(e)||r[e]===!0},deleteContext:function(t){delete this._caches[t],this._context={}},delete:function(t){delete this._context[t]},clearAll:function(){this._caches={}},getContext:function(){return this._context},eachContext:function(t,e){Object.keys(this._caches).forEach((function(r){t&&t.call(e,r)}))},miss:function(t){return!this._context.hasOwnProperty(t)}}).constructor=ho;let co=ho;var rt=jt.extend({width:512,height:512,type:Dn,format:qa,wrapS:Qa,wrapT:Qa,minFilter:Ei,magFilter:Ai,useMipmap:!0,anisotropic:1,flipY:!0,sRGB:!0,unpackAlignment:4,premultiplyAlpha:!1,dynamic:!1,NPOT:!1,__used:0},(function(){this._cache=new co}),{getWebGLTexture:function(t){var e=t.gl,r=this._cache;return r.use(t.__uid__),r.miss("webgl_texture")&&r.put("webgl_texture",e.createTexture()),this.dynamic?this.update(t):r.isDirty()&&(this.update(t),r.fresh()),r.get("webgl_texture")},bind:function(){},unbind:function(){},dirty:function(){this._cache&&this._cache.dirtyAll()},update:function(t){},updateCommon:function(t){var e=t.gl;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,this.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,this.unpackAlignment),this.format===Pn&&(this.useMipmap=!1);var r=t.getGLExtension("EXT_sRGB");this.format!==rt.SRGB||r||(this.format=rt.RGB),this.format!==rt.SRGB_ALPHA||r||(this.format=rt.RGBA),this.NPOT=!this.isPowerOfTwo()},getAvailableWrapS:function(){return this.NPOT?sr:this.wrapS},getAvailableWrapT:function(){return this.NPOT?sr:this.wrapT},getAvailableMinFilter:function(){var t=this.minFilter;return this.NPOT||!this.useMipmap?t===Za||t===Ka?Mi:t===Ei||t===Ya?Ai:t:t},getAvailableMagFilter:function(){return this.magFilter},nextHighestPowerOfTwo:function(t){--t;for(var e=1;e<32;e<<=1)t|=t>>e;return t+1},dispose:function(t){var e=this._cache;e.use(t.__uid__);var r=e.get("webgl_texture");r&&t.gl.deleteTexture(r),e.deleteContext(t.__uid__)},isRenderable:function(){},isPowerOfTwo:function(){}});Object.defineProperty(rt.prototype,"width",{get:function(){return this._width},set:function(t){this._width=t}}),Object.defineProperty(rt.prototype,"height",{get:function(){return this._height},set:function(t){this._height=t}}),rt.BYTE=5120,rt.UNSIGNED_BYTE=Dn,rt.SHORT=5122,rt.UNSIGNED_SHORT=5123,rt.INT=5124,rt.UNSIGNED_INT=5125,rt.FLOAT=Ln,rt.HALF_FLOAT=36193,rt.UNSIGNED_INT_24_8_WEBGL=34042,rt.DEPTH_COMPONENT=Pn,rt.DEPTH_STENCIL=34041,rt.ALPHA=6406,rt.RGB=6407,rt.RGBA=qa,rt.LUMINANCE=6409,rt.LUMINANCE_ALPHA=6410,rt.SRGB=35904,rt.SRGB_ALPHA=35906,rt.COMPRESSED_RGB_S3TC_DXT1_EXT=33776,rt.COMPRESSED_RGBA_S3TC_DXT1_EXT=33777,rt.COMPRESSED_RGBA_S3TC_DXT3_EXT=33778,rt.COMPRESSED_RGBA_S3TC_DXT5_EXT=33779,rt.NEAREST=Mi,rt.LINEAR=Ai,rt.NEAREST_MIPMAP_NEAREST=Za,rt.LINEAR_MIPMAP_NEAREST=Ya,rt.NEAREST_MIPMAP_LINEAR=Ka,rt.LINEAR_MIPMAP_LINEAR=Ei,rt.REPEAT=Qa,rt.CLAMP_TO_EDGE=sr,rt.MIRRORED_REPEAT=33648;let H=rt,cl={isPowerOfTwo:function(t){return(t&t-1)==0},nextPowerOfTwo:function(t){return t--,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,++t},nearestPowerOfTwo:function(t){return Math.pow(2,Math.round(Math.log(t)/Math.LN2))}};var dl=cl.isPowerOfTwo;function fl(t){return Math.pow(2,Math.round(Math.log(t)/Math.LN2))}var fo=H.extend((function(){return{image:null,pixels:null,mipmaps:[],convertToPOT:!1}}),{textureType:"texture2D",update:function(t){var e=t.gl;e.bindTexture(e.TEXTURE_2D,this._cache.get("webgl_texture")),this.updateCommon(t);var r=this.format,i=this.type,n=!(!this.convertToPOT||this.mipmaps.length||!this.image||this.wrapS!==H.REPEAT&&this.wrapT!==H.REPEAT||!this.NPOT);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,n?this.wrapS:this.getAvailableWrapS()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,n?this.wrapT:this.getAvailableWrapT()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,n?this.magFilter:this.getAvailableMagFilter()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n?this.minFilter:this.getAvailableMinFilter());var a=t.getGLExtension("EXT_texture_filter_anisotropic");if(a&&this.anisotropic>1&&e.texParameterf(e.TEXTURE_2D,a.TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropic),i===36193&&(t.getGLExtension("OES_texture_half_float")||(i=Ln)),this.mipmaps.length)for(var o=this.width,s=this.height,l=0;l<this.mipmaps.length;l++){var u=this.mipmaps[l];this._updateTextureData(e,u,l,o,s,r,i,!1),o/=2,s/=2}else this._updateTextureData(e,this,0,this.width,this.height,r,i,n),!this.useMipmap||this.NPOT&&!n||e.generateMipmap(e.TEXTURE_2D);e.bindTexture(e.TEXTURE_2D,null)},_updateTextureData:function(t,e,r,i,n,a,o,s){if(e.image){var l=e.image;s&&(this._potCanvas=(function(u,h){var c=fl(u.width),f=fl(u.height);return(h=h||document.createElement("canvas")).width=c,h.height=f,h.getContext("2d").drawImage(u.image,0,0,c,f),h})(this,this._potCanvas),l=this._potCanvas),t.texImage2D(t.TEXTURE_2D,r,a,a,o,l)}else a<=H.COMPRESSED_RGBA_S3TC_DXT5_EXT&&a>=H.COMPRESSED_RGB_S3TC_DXT1_EXT?t.compressedTexImage2D(t.TEXTURE_2D,r,a,i,n,0,e.pixels):t.texImage2D(t.TEXTURE_2D,r,a,i,n,0,a,o,e.pixels)},generateMipmap:function(t){var e=t.gl;this.useMipmap&&!this.NPOT&&(e.bindTexture(e.TEXTURE_2D,this._cache.get("webgl_texture")),e.generateMipmap(e.TEXTURE_2D))},isPowerOfTwo:function(){return dl(this.width)&&dl(this.height)},isRenderable:function(){return this.image?this.image.width>0&&this.image.height>0:!(!this.width||!this.height)},bind:function(t){t.gl.bindTexture(t.gl.TEXTURE_2D,this.getWebGLTexture(t))},unbind:function(t){t.gl.bindTexture(t.gl.TEXTURE_2D,null)},load:function(t,e){var r=At.createImage();e&&(r.crossOrigin=e);var i=this;return r.onload=function(){i.dirty(),i.trigger("success",i)},r.onerror=function(){i.trigger("error",i)},r.src=t,this.image=r,this}});Object.defineProperty(fo.prototype,"width",{get:function(){return this.image?this.image.width:this._width},set:function(t){this.image?console.warn("Texture from image can't set width"):(this._width!==t&&this.dirty(),this._width=t)}}),Object.defineProperty(fo.prototype,"height",{get:function(){return this.image?this.image.height:this._height},set:function(t){this.image?console.warn("Texture from image can't set height"):(this._height!==t&&this.dirty(),this._height=t)}});let K=fo;function pl(t){return{byte:At.Int8Array,ubyte:At.Uint8Array,short:At.Int16Array,ushort:At.Uint16Array}[t]||At.Float32Array}function po(t){return"attr_"+t}function Wr(t,e,r,i){switch(this.name=t,this.type=e,this.size=r,this.semantic=i||"",this.value=null,r){case 1:this.get=function(n){return this.value[n]},this.set=function(n,a){this.value[n]=a},this.copy=function(n,a){this.value[n]=this.value[n]};break;case 2:this.get=function(n,a){var o=this.value;return a[0]=o[2*n],a[1]=o[2*n+1],a},this.set=function(n,a){var o=this.value;o[2*n]=a[0],o[2*n+1]=a[1]},this.copy=function(n,a){var o=this.value;a*=2,o[n*=2]=o[a],o[n+1]=o[a+1]};break;case 3:this.get=function(n,a){var o=3*n,s=this.value;return a[0]=s[o],a[1]=s[o+1],a[2]=s[o+2],a},this.set=function(n,a){var o=3*n,s=this.value;s[o]=a[0],s[o+1]=a[1],s[o+2]=a[2]},this.copy=function(n,a){var o=this.value;a*=3,o[n*=3]=o[a],o[n+1]=o[a+1],o[n+2]=o[a+2]};break;case 4:this.get=function(n,a){var o=this.value,s=4*n;return a[0]=o[s],a[1]=o[s+1],a[2]=o[s+2],a[3]=o[s+3],a},this.set=function(n,a){var o=this.value,s=4*n;o[s]=a[0],o[s+1]=a[1],o[s+2]=a[2],o[s+3]=a[3]},this.copy=function(n,a){var o=this.value;a*=4,o[n*=4]=o[a],o[n+1]=o[a+1],o[n+2]=o[a+2],o[n+3]=o[a+3]}}}function ml(t,e,r,i,n){this.name=t,this.type=e,this.buffer=r,this.size=i,this.semantic=n,this.symbol="",this.needsRemove=!1}function gl(t){this.buffer=t,this.count=0}Wr.prototype.init=function(t){if(!this.value||this.value.length!==t*this.size){var e=pl(this.type);this.value=new e(t*this.size)}},Wr.prototype.fromArray=function(t){var e,r=pl(this.type);if(t[0]&&t[0].length){var i=0,n=this.size;e=new r(t.length*n);for(var a=0;a<t.length;a++)for(var o=0;o<n;o++)e[i++]=t[a][o]}else e=new r(t);this.value=e},Wr.prototype.clone=function(t){var e=new Wr(this.name,this.type,this.size,this.semantic);return t&&console.warn("todo"),e};var Ge=jt.extend((function(){return{attributes:{},indices:null,dynamic:!0,_enabledAttributes:null,__used:0}}),(function(){this._cache=new co,this._attributeList=Object.keys(this.attributes),this.__vaoCache={}}),{mainAttribute:"",pick:null,pickByRay:null,dirty:function(){for(var t=this.getEnabledAttributes(),e=0;e<t.length;e++)this.dirtyAttribute(t[e]);this.dirtyIndices(),this._enabledAttributes=null,this._cache.dirty("any")},dirtyIndices:function(){this._cache.dirtyAll("indices")},dirtyAttribute:function(t){this._cache.dirtyAll(po(t)),this._cache.dirtyAll("attributes")},getTriangleIndices:function(t,e){if(t<this.triangleCount&&t>=0){e||(e=[]);var r=this.indices;return e[0]=r[3*t],e[1]=r[3*t+1],e[2]=r[3*t+2],e}},setTriangleIndices:function(t,e){var r=this.indices;r[3*t]=e[0],r[3*t+1]=e[1],r[3*t+2]=e[2]},isUseIndices:function(){return!!this.indices},initIndicesFromArray:function(t){var e,r=this.vertexCount>65535?At.Uint32Array:At.Uint16Array;if(t[0]&&t[0].length){var i=0;e=new r(3*t.length);for(var n=0;n<t.length;n++)for(var a=0;a<3;a++)e[i++]=t[n][a]}else e=new r(t);this.indices=e},createAttribute:function(t,e,r,i){var n=new Wr(t,e,r,i);return this.attributes[t]&&this.removeAttribute(t),this.attributes[t]=n,this._attributeList.push(t),n},removeAttribute:function(t){var e=this._attributeList,r=e.indexOf(t);return r>=0&&(e.splice(r,1),delete this.attributes[t],!0)},getAttribute:function(t){return this.attributes[t]},getEnabledAttributes:function(){var t=this._enabledAttributes,e=this._attributeList;if(t)return t;for(var r=[],i=this.vertexCount,n=0;n<e.length;n++){var a=e[n],o=this.attributes[a];o.value&&o.value.length===i*o.size&&r.push(a)}return this._enabledAttributes=r,r},getBufferChunks:function(t){var e=this._cache;e.use(t.__uid__);var r=e.isDirty("attributes"),i=e.isDirty("indices");if(r||i){this._updateBuffer(t.gl,r,i);for(var n=this.getEnabledAttributes(),a=0;a<n.length;a++)e.fresh(po(n[a]));e.fresh("attributes"),e.fresh("indices")}return e.fresh("any"),e.get("chunks")},_updateBuffer:function(t,e,r){var i=this._cache,n=i.get("chunks"),a=!1;n||((n=[])[0]={attributeBuffers:[],indicesBuffer:null},i.put("chunks",n),a=!0);var o=n[0],s=o.attributeBuffers,l=o.indicesBuffer;if(e||a){var u=this.getEnabledAttributes(),h={};if(!a)for(var c=0;c<s.length;c++)h[s[c].name]=s[c];for(var f=0;f<u.length;f++){var p,d,m=u[f],g=this.attributes[m];a||(p=h[m]),d=p?p.buffer:t.createBuffer(),i.isDirty(po(m))&&(t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,g.value,this.dynamic?t.DYNAMIC_DRAW:t.STATIC_DRAW)),s[f]=new ml(m,g.type,d,g.size,g.semantic)}for(c=f;c<s.length;c++)t.deleteBuffer(s[c].buffer);s.length=f}this.isUseIndices()&&(r||a)&&(l||(l=new gl(t.createBuffer()),o.indicesBuffer=l),l.count=this.indices.length,t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,l.buffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.indices,this.dynamic?t.DYNAMIC_DRAW:t.STATIC_DRAW))},dispose:function(t){var e=this._cache;e.use(t.__uid__);var r=e.get("chunks");if(r)for(var i=0;i<r.length;i++){for(var n=r[i],a=0;a<n.attributeBuffers.length;a++){var o=n.attributeBuffers[a];t.gl.deleteBuffer(o.buffer)}n.indicesBuffer&&t.gl.deleteBuffer(n.indicesBuffer.buffer)}if(this.__vaoCache){var s=t.getGLExtension("OES_vertex_array_object");for(var l in this.__vaoCache){var u=this.__vaoCache[l].vao;u&&s.deleteVertexArrayOES(u)}}this.__vaoCache={},e.deleteContext(t.__uid__)}});Object.defineProperty&&(Object.defineProperty(Ge.prototype,"vertexCount",{enumerable:!1,get:function(){var t=this.attributes[this.mainAttribute];return t||(t=this.attributes[this._attributeList[0]]),t&&t.value?t.value.length/t.size:0}}),Object.defineProperty(Ge.prototype,"triangleCount",{enumerable:!1,get:function(){var t=this.indices;return t?t.length/3:0}})),Ge.STATIC_DRAW=35044,Ge.DYNAMIC_DRAW=35048,Ge.STREAM_DRAW=35040,Ge.AttributeBuffer=ml,Ge.IndicesBuffer=gl,Ge.Attribute=Wr;let hr=Ge;var qt=E.create,jr=E.add,cr=E.set,Ne=hr.Attribute,dr=hr.extend((function(){return{attributes:{position:new Ne("position","float",3,"POSITION"),texcoord0:new Ne("texcoord0","float",2,"TEXCOORD_0"),texcoord1:new Ne("texcoord1","float",2,"TEXCOORD_1"),normal:new Ne("normal","float",3,"NORMAL"),tangent:new Ne("tangent","float",4,"TANGENT"),color:new Ne("color","float",4,"COLOR"),weight:new Ne("weight","float",3,"WEIGHT"),joint:new Ne("joint","float",4,"JOINT"),barycentric:new Ne("barycentric","float",3,null)},boundingBox:null}}),{mainAttribute:"position",updateBoundingBox:function(){var t=this.boundingBox;t||(t=this.boundingBox=new Xt);var e=this.attributes.position.value;if(e&&e.length){var r=t.min,i=t.max,n=r.array,a=i.array;E.set(n,e[0],e[1],e[2]),E.set(a,e[0],e[1],e[2]);for(var o=3;o<e.length;){var s=e[o++],l=e[o++],u=e[o++];s<n[0]&&(n[0]=s),l<n[1]&&(n[1]=l),u<n[2]&&(n[2]=u),s>a[0]&&(a[0]=s),l>a[1]&&(a[1]=l),u>a[2]&&(a[2]=u)}r._dirty=!0,i._dirty=!0}},generateVertexNormals:function(){if(this.vertexCount){var t=this.indices,e=this.attributes,r=e.position.value,i=e.normal.value;if(i&&i.length===r.length)for(var n=0;n<i.length;n++)i[n]=0;else i=e.normal.value=new At.Float32Array(r.length);for(var a,o,s,l=qt(),u=qt(),h=qt(),c=qt(),f=qt(),p=qt(),d=t?t.length:this.vertexCount,m=0;m<d;)for(t?(a=t[m++],o=t[m++],s=t[m++]):(a=m++,o=m++,s=m++),cr(l,r[3*a],r[3*a+1],r[3*a+2]),cr(u,r[3*o],r[3*o+1],r[3*o+2]),cr(h,r[3*s],r[3*s+1],r[3*s+2]),E.sub(c,l,u),E.sub(f,u,h),E.cross(p,c,f),n=0;n<3;n++)i[3*a+n]=i[3*a+n]+p[n],i[3*o+n]=i[3*o+n]+p[n],i[3*s+n]=i[3*s+n]+p[n];for(n=0;n<i.length;)cr(p,i[n],i[n+1],i[n+2]),E.normalize(p,p),i[n++]=p[0],i[n++]=p[1],i[n++]=p[2];this.dirty()}},generateFaceNormals:function(){if(this.vertexCount){this.isUniqueVertex()||this.generateUniqueVertex();var t=this.indices,e=this.attributes,r=e.position.value,i=e.normal.value,n=qt(),a=qt(),o=qt(),s=qt(),l=qt(),u=qt();i||(i=e.normal.value=new Float32Array(r.length));for(var h,c,f,p=t?t.length:this.vertexCount,d=0;d<p;){t?(h=t[d++],c=t[d++],f=t[d++]):(h=d++,c=d++,f=d++),cr(n,r[3*h],r[3*h+1],r[3*h+2]),cr(a,r[3*c],r[3*c+1],r[3*c+2]),cr(o,r[3*f],r[3*f+1],r[3*f+2]),E.sub(s,n,a),E.sub(l,a,o),E.cross(u,s,l),E.normalize(u,u);for(var m=0;m<3;m++)i[3*h+m]=u[m],i[3*c+m]=u[m],i[3*f+m]=u[m]}this.dirty()}},generateTangents:function(){if(this.vertexCount){var t=this.vertexCount,e=this.attributes;e.tangent.value||(e.tangent.value=new Float32Array(4*t));var r=e.texcoord0.value,i=e.position.value,n=e.tangent.value,a=e.normal.value;if(r){for(var o=[],s=[],l=0;l<t;l++)o[l]=[0,0,0],s[l]=[0,0,0];var u,h,c,f=[0,0,0],p=[0,0,0],d=this.indices,m=d?d.length:this.vertexCount;for(l=0;l<m;){d?(u=d[l++],h=d[l++],c=d[l++]):(u=l++,h=l++,c=l++);var g=r[2*u],_=r[2*h],y=r[2*c],x=r[2*u+1],v=r[2*h+1],w=r[2*c+1],b=i[3*u],S=i[3*h],A=i[3*c],D=i[3*u+1],P=i[3*h+1],L=i[3*c+1],O=i[3*u+2],N=S-b,C=A-b,B=P-D,I=L-D,X=i[3*h+2]-O,V=i[3*c+2]-O,st=_-g,U=y-g,Tt=v-x,lt=w-x,ht=1/(st*lt-Tt*U);f[0]=(lt*N-Tt*C)*ht,f[1]=(lt*B-Tt*I)*ht,f[2]=(lt*X-Tt*V)*ht,p[0]=(st*C-U*N)*ht,p[1]=(st*I-U*B)*ht,p[2]=(st*V-U*X)*ht,jr(o[u],o[u],f),jr(o[h],o[h],f),jr(o[c],o[c],f),jr(s[u],s[u],p),jr(s[h],s[h],p),jr(s[c],s[c],p)}var Q=qt(),ee=qt(),pt=qt();for(l=0;l<t;l++){pt[0]=a[3*l],pt[1]=a[3*l+1],pt[2]=a[3*l+2];var Wt=o[l];E.scale(Q,pt,E.dot(pt,Wt)),E.sub(Q,Wt,Q),E.normalize(Q,Q),E.cross(ee,pt,Wt),n[4*l]=Q[0],n[4*l+1]=Q[1],n[4*l+2]=Q[2],n[4*l+3]=E.dot(ee,s[l])<0?-1:1}this.dirty()}else console.warn("Geometry without texcoords can't generate tangents.")}},isUniqueVertex:function(){return!this.isUseIndices()||this.vertexCount===this.indices.length},generateUniqueVertex:function(){if(this.vertexCount&&this.indices){this.indices.length>65535&&(this.indices=new At.Uint32Array(this.indices));for(var t=this.attributes,e=this.indices,r=this.getEnabledAttributes(),i={},n=0;n<r.length;n++)i[l=r[n]]=t[l].value,t[l].init(this.indices.length);for(var a=0,o=0;o<e.length;o++){var s=e[o];for(n=0;n<r.length;n++)for(var l,u=t[l=r[n]].value,h=t[l].size,c=0;c<h;c++)u[a*h+c]=i[l][s*h+c];e[o]=a,a++}this.dirty()}},generateBarycentric:function(){if(this.vertexCount){this.isUniqueVertex()||this.generateUniqueVertex();var t=this.attributes,e=t.barycentric.value,r=this.indices;if(!e||e.length!==3*r.length){e=t.barycentric.value=new Float32Array(3*r.length);for(var i=0;i<(r?r.length:this.vertexCount/3);)for(var n=0;n<3;n++)e[3*(r?r[i++]:3*i+n)+n]=1;this.dirty()}}},applyTransform:function(t){var e=this.attributes,r=e.position.value,i=e.normal.value,n=e.tangent.value;t=t.array;var a=R.create();R.invert(a,t),R.transpose(a,a);var o=E.transformMat4,s=E.forEach;s(r,3,0,null,o,t),i&&s(i,3,0,null,o,a),n&&s(n,4,0,null,o,a),this.boundingBox&&this.updateBoundingBox()},dispose:function(t){var e=this._cache;e.use(t.__uid__);var r=e.get("chunks");if(r)for(var i=0;i<r.length;i++){for(var n=r[i],a=0;a<n.attributeBuffers.length;a++){var o=n.attributeBuffers[a];t.gl.deleteBuffer(o.buffer)}n.indicesBuffer&&t.gl.deleteBuffer(n.indicesBuffer.buffer)}if(this.__vaoCache){var s=t.getGLExtension("OES_vertex_array_object");for(var l in this.__vaoCache){var u=this.__vaoCache[l].vao;u&&s.deleteVertexArrayOES(u)}}this.__vaoCache={},e.deleteContext(t.__uid__)}});dr.STATIC_DRAW=hr.STATIC_DRAW,dr.DYNAMIC_DRAW=hr.DYNAMIC_DRAW,dr.STREAM_DRAW=hr.STREAM_DRAW,dr.AttributeBuffer=hr.AttributeBuffer,dr.IndicesBuffer=hr.IndicesBuffer,dr.Attribute=Ne;let nt=dr;var Xr="@export clay.header.",qr="@end",Ut=":unconfigurable;";let gc=[Xr+"directional_light","uniform vec3 directionalLightDirection[DIRECTIONAL_LIGHT_COUNT]"+Ut,"uniform vec3 directionalLightColor[DIRECTIONAL_LIGHT_COUNT]"+Ut,qr,Xr+"ambient_light","uniform vec3 ambientLightColor[AMBIENT_LIGHT_COUNT]"+Ut,qr,Xr+"ambient_sh_light","uniform vec3 ambientSHLightColor[AMBIENT_SH_LIGHT_COUNT]"+Ut,"uniform vec3 ambientSHLightCoefficients[AMBIENT_SH_LIGHT_COUNT * 9]"+Ut,`vec3 calcAmbientSHLight(int idx, vec3 N) {
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
}`,qr,Xr+"ambient_cubemap_light","uniform vec3 ambientCubemapLightColor[AMBIENT_CUBEMAP_LIGHT_COUNT]"+Ut,"uniform samplerCube ambientCubemapLightCubemap[AMBIENT_CUBEMAP_LIGHT_COUNT]"+Ut,"uniform sampler2D ambientCubemapLightBRDFLookup[AMBIENT_CUBEMAP_LIGHT_COUNT]"+Ut,qr,Xr+"point_light","uniform vec3 pointLightPosition[POINT_LIGHT_COUNT]"+Ut,"uniform float pointLightRange[POINT_LIGHT_COUNT]"+Ut,"uniform vec3 pointLightColor[POINT_LIGHT_COUNT]"+Ut,qr,Xr+"spot_light","uniform vec3 spotLightPosition[SPOT_LIGHT_COUNT]"+Ut,"uniform vec3 spotLightDirection[SPOT_LIGHT_COUNT]"+Ut,"uniform float spotLightRange[SPOT_LIGHT_COUNT]"+Ut,"uniform float spotLightUmbraAngleCosine[SPOT_LIGHT_COUNT]"+Ut,"uniform float spotLightPenumbraAngleCosine[SPOT_LIGHT_COUNT]"+Ut,"uniform float spotLightFalloffFactor[SPOT_LIGHT_COUNT]"+Ut,"uniform vec3 spotLightColor[SPOT_LIGHT_COUNT]"+Ut,qr].join(`
`);z.import(gc);let we=Oe.extend((function(){return{color:[1,1,1],intensity:1,castShadow:!0,shadowResolution:512,group:0}}),{type:"",clone:function(){var t=Oe.prototype.clone.call(this);return t.color=Array.prototype.slice.call(this.color),t.intensity=this.intensity,t.castShadow=this.castShadow,t.shadowResolution=this.shadowResolution,t}});var Pi,Zr,Yr,Kr,Nn=function(t,e){this.normal=t||new F(0,1,0),this.distance=e||0};Nn.prototype={constructor:Nn,distanceToPoint:function(t){return E.dot(t.array,this.normal.array)-this.distance},projectPoint:function(t,e){e||(e=new F);var r=this.distanceToPoint(t);return E.scaleAndAdd(e.array,t.array,this.normal.array,-r),e._dirty=!0,e},normalize:function(){var t=1/E.len(this.normal.array);E.scale(this.normal.array,t),this.distance*=t},intersectFrustum:function(t){for(var e=t.vertices,r=this.normal.array,i=E.dot(e[0].array,r)>this.distance,n=1;n<8;n++)if(E.dot(e[n].array,r)>this.distance!=i)return!0},intersectLine:(Kr=E.create(),function(t,e,r){var i=this.distanceToPoint(t),n=this.distanceToPoint(e);if(i>0&&n>0||i<0&&n<0)return null;var a=this.normal.array,o=this.distance,s=t.array;E.sub(Kr,e.array,t.array),E.normalize(Kr,Kr);var l=E.dot(a,Kr);if(l===0)return null;r||(r=new F);var u=(E.dot(a,s)-o)/l;return E.scaleAndAdd(r.array,s,Kr,-u),r._dirty=!0,r}),applyTransform:(Pi=R.create(),Zr=G.create(),Yr=G.create(),Yr[3]=1,function(t){t=t.array,E.scale(Yr,this.normal.array,this.distance),G.transformMat4(Yr,Yr,t),this.distance=E.dot(Yr,this.normal.array),R.invert(Pi,t),R.transpose(Pi,Pi),Zr[3]=0,E.copy(Zr,this.normal.array),G.transformMat4(Zr,Zr,Pi),E.copy(this.normal.array,Zr)}),copy:function(t){E.copy(this.normal.array,t.normal.array),this.normal._dirty=!0,this.distance=t.distance},clone:function(){var t=new Nn;return t.copy(this),t}};let _l=Nn;var Te,St=E.set,vl=E.copy,yl=E.transformMat4,mo=Math.min,go=Math.max,xl=function(){this.planes=[];for(var t=0;t<6;t++)this.planes.push(new _l);for(this.boundingBox=new Xt,this.vertices=[],t=0;t<8;t++)this.vertices[t]=E.fromValues(0,0,0)};xl.prototype={setFromProjection:function(t){var e=this.planes,r=t.array,i=r[0],n=r[1],a=r[2],o=r[3],s=r[4],l=r[5],u=r[6],h=r[7],c=r[8],f=r[9],p=r[10],d=r[11],m=r[12],g=r[13],_=r[14],y=r[15];St(e[0].normal.array,o-i,h-s,d-c),e[0].distance=-(y-m),e[0].normalize(),St(e[1].normal.array,o+i,h+s,d+c),e[1].distance=-(y+m),e[1].normalize(),St(e[2].normal.array,o+n,h+l,d+f),e[2].distance=-(y+g),e[2].normalize(),St(e[3].normal.array,o-n,h-l,d-f),e[3].distance=-(y-g),e[3].normalize(),St(e[4].normal.array,o-a,h-u,d-p),e[4].distance=-(y-_),e[4].normalize(),St(e[5].normal.array,o+a,h+u,d+p),e[5].distance=-(y+_),e[5].normalize();var x=this.boundingBox,v=this.vertices;if(y===0){var w=l/i,b=-_/(p-1),S=-_/(p+1),A=-S/l,D=-b/l;x.min.set(-A*w,-A,S),x.max.set(A*w,A,b),St(v[0],-A*w,-A,S),St(v[1],-A*w,A,S),St(v[2],A*w,-A,S),St(v[3],A*w,A,S),St(v[4],-D*w,-D,b),St(v[5],-D*w,D,b),St(v[6],D*w,-D,b),St(v[7],D*w,D,b)}else{var P=(-1-m)/i,L=(1-m)/i,O=(1-g)/l,N=(-1-g)/l,C=(-1-_)/p,B=(1-_)/p;x.min.set(Math.min(P,L),Math.min(N,O),Math.min(B,C)),x.max.set(Math.max(L,P),Math.max(O,N),Math.max(C,B));var I=x.min.array,X=x.max.array;St(v[0],I[0],I[1],I[2]),St(v[1],I[0],X[1],I[2]),St(v[2],X[0],I[1],I[2]),St(v[3],X[0],X[1],I[2]),St(v[4],I[0],I[1],X[2]),St(v[5],I[0],X[1],X[2]),St(v[6],X[0],I[1],X[2]),St(v[7],X[0],X[1],X[2])}},getTransformedBoundingBox:(Te=E.create(),function(t,e){var r=this.vertices,i=e.array,n=t.min,a=t.max,o=n.array,s=a.array,l=r[0];yl(Te,l,i),vl(o,Te),vl(s,Te);for(var u=1;u<8;u++)l=r[u],yl(Te,l,i),o[0]=mo(Te[0],o[0]),o[1]=mo(Te[1],o[1]),o[2]=mo(Te[2],o[2]),s[0]=go(Te[0],s[0]),s[1]=go(Te[1],s[1]),s[2]=go(Te[2],s[2]);return n._dirty=!0,a._dirty=!0,t})};let _o=xl;var Oi,In,Ni,Ze,Rn=function(t,e){this.origin=t||new F,this.direction=e||new F};Rn.prototype={constructor:Rn,intersectPlane:function(t,e){var r=t.normal.array,i=t.distance,n=this.origin.array,a=this.direction.array,o=E.dot(r,a);if(o===0)return null;e||(e=new F);var s=(E.dot(r,n)-i)/o;return E.scaleAndAdd(e.array,n,a,-s),e._dirty=!0,e},mirrorAgainstPlane:function(t){var e=E.dot(t.normal.array,this.direction.array);E.scaleAndAdd(this.direction.array,this.direction.array,t.normal.array,2*-e),this.direction._dirty=!0},distanceToPoint:(function(){var t=E.create();return function(e){E.sub(t,e,this.origin.array);var r=E.dot(t,this.direction.array);if(r<0)return E.distance(this.origin.array,e);var i=E.lenSquared(t);return Math.sqrt(i-r*r)}})(),intersectSphere:(function(){var t=E.create();return function(e,r,i){var n=this.origin.array,a=this.direction.array;e=e.array,E.sub(t,e,n);var o=E.dot(t,a),s=E.squaredLength(t)-o*o,l=r*r;if(!(s>l)){var u=Math.sqrt(l-s),h=o-u,c=o+u;return i||(i=new F),h<0?c<0?null:(E.scaleAndAdd(i.array,n,a,c),i):(E.scaleAndAdd(i.array,n,a,h),i)}}})(),intersectBoundingBox:function(t,e){var r,i,n,a,o,s,l=this.direction.array,u=this.origin.array,h=t.min.array,c=t.max.array,f=1/l[0],p=1/l[1],d=1/l[2];if(f>=0?(r=(h[0]-u[0])*f,i=(c[0]-u[0])*f):(i=(h[0]-u[0])*f,r=(c[0]-u[0])*f),p>=0?(n=(h[1]-u[1])*p,a=(c[1]-u[1])*p):(a=(h[1]-u[1])*p,n=(c[1]-u[1])*p),r>a||n>i||((n>r||r!=r)&&(r=n),(a<i||i!=i)&&(i=a),d>=0?(o=(h[2]-u[2])*d,s=(c[2]-u[2])*d):(s=(h[2]-u[2])*d,o=(c[2]-u[2])*d),r>s||o>i)||((o>r||r!=r)&&(r=o),(s<i||i!=i)&&(i=s),i<0))return null;var m=r>=0?r:i;return e||(e=new F),E.scaleAndAdd(e.array,u,l,m),e},intersectTriangle:(Oi=E.create(),In=E.create(),Ni=E.create(),Ze=E.create(),function(t,e,r,i,n,a){var o=this.direction.array,s=this.origin.array;t=t.array,e=e.array,r=r.array,E.sub(Oi,e,t),E.sub(In,r,t),E.cross(Ze,In,o);var l=E.dot(Oi,Ze);if(i){if(l>-1e-5)return null}else if(l>-1e-5&&l<1e-5)return null;E.sub(Ni,s,t);var u=E.dot(Ze,Ni)/l;if(u<0||u>1)return null;E.cross(Ze,Oi,Ni);var h=E.dot(o,Ze)/l;if(h<0||h>1||u+h>1)return null;E.cross(Ze,Oi,In);var c=-E.dot(Ni,Ze)/l;return c<0?null:(n||(n=new F),a&&F.set(a,1-u-h,u,h),E.scaleAndAdd(n.array,s,o,c),n)}),applyTransform:function(t){F.add(this.direction,this.direction,this.origin),F.transformMat4(this.origin,this.origin,t),F.transformMat4(this.direction,this.direction,t),F.sub(this.direction,this.direction,this.origin),F.normalize(this.direction,this.direction)},copy:function(t){F.copy(this.origin,t.origin),F.copy(this.direction,t.direction)},clone:function(){var t=new Rn;return t.copy(this),t}};let Fn=Rn;var Ht;let Qr=Oe.extend((function(){return{projectionMatrix:new k,invProjectionMatrix:new k,viewMatrix:new k,frustum:new _o}}),(function(){this.update(!0)}),{update:function(t){Oe.prototype.update.call(this,t),k.invert(this.viewMatrix,this.worldTransform),this.updateProjectionMatrix(),k.invert(this.invProjectionMatrix,this.projectionMatrix),this.frustum.setFromProjection(this.projectionMatrix)},setViewMatrix:function(t){k.copy(this.viewMatrix,t),k.invert(this.worldTransform,t),this.decomposeWorldTransform()},decomposeProjectionMatrix:function(){},setProjectionMatrix:function(t){k.copy(this.projectionMatrix,t),k.invert(this.invProjectionMatrix,t),this.decomposeProjectionMatrix()},updateProjectionMatrix:function(){},castRay:(Ht=G.create(),function(t,e){var r=e!==void 0?e:new Fn,i=t.array[0],n=t.array[1];return G.set(Ht,i,n,-1,1),G.transformMat4(Ht,Ht,this.invProjectionMatrix.array),G.transformMat4(Ht,Ht,this.worldTransform.array),E.scale(r.origin.array,Ht,1/Ht[3]),G.set(Ht,i,n,1,1),G.transformMat4(Ht,Ht,this.invProjectionMatrix.array),G.transformMat4(Ht,Ht,this.worldTransform.array),E.scale(Ht,Ht,1/Ht[3]),E.sub(r.direction.array,Ht,r.origin.array),E.normalize(r.direction.array,r.direction.array),r.direction._dirty=!0,r.origin._dirty=!0,r})});var Ie,Ii,_c=R.create(),bl=R.create(),vo={};function vc(t){var e=[],r=Object.keys(t);r.sort();for(var i=0;i<r.length;i++){var n=r[i];e.push(n+" "+t[n])}var a=e.join(`
`);if(vo[a])return vo[a];var o=zt.genGUID();return vo[a]=o,o}function Bn(){this.opaque=[],this.transparent=[],this._opaqueCount=0,this._transparentCount=0}function yc(t,e){if(e.castShadow&&!t.castShadow)return!0}Bn.prototype.startCount=function(){this._opaqueCount=0,this._transparentCount=0},Bn.prototype.add=function(t,e){e?this.transparent[this._transparentCount++]=t:this.opaque[this._opaqueCount++]=t},Bn.prototype.endCount=function(){this.transparent.length=this._transparentCount,this.opaque.length=this._opaqueCount};let Ye=Oe.extend((function(){return{material:null,lights:[],viewBoundingBoxLastFrame:new Xt,shadowUniforms:{},_cameraList:[],_lightUniforms:{},_previousLightNumber:{},_lightNumber:{},_lightProgramKeys:{},_nodeRepository:{},_renderLists:new Vs(20)}}),(function(){this._scene=this}),{addToScene:function(t){t instanceof Qr?(this._cameraList.length>0&&console.warn("Found multiple camera in one scene. Use the fist one."),this._cameraList.push(t)):t instanceof we&&this.lights.push(t),t.name&&(this._nodeRepository[t.name]=t)},removeFromScene:function(t){var e;t instanceof Qr?(e=this._cameraList.indexOf(t))>=0&&this._cameraList.splice(e,1):t instanceof we&&(e=this.lights.indexOf(t))>=0&&this.lights.splice(e,1),t.name&&delete this._nodeRepository[t.name]},getNode:function(t){return this._nodeRepository[t]},setMainCamera:function(t){var e=this._cameraList.indexOf(t);e>=0&&this._cameraList.splice(e,1),this._cameraList.unshift(t)},getMainCamera:function(){return this._cameraList[0]},getLights:function(){return this.lights},updateLights:function(){var t=this.lights;this._previousLightNumber=this._lightNumber;for(var e={},r=0;r<t.length;r++){var i=t[r];if(!i.invisible){var n=i.group;e[n]||(e[n]={}),e[n][i.type]=e[n][i.type]||0,e[n][i.type]++}}for(var a in this._lightNumber=e,e)this._lightProgramKeys[a]=vc(e[a]);this._updateLightUniforms()},cloneNode:function(t){var e=t.clone(),r={};return(function i(n,a){r[n.__uid__]=a;for(var o=0;o<n._children.length;o++)i(n._children[o],a._children[o])})(t,e),e.traverse((function(i){i.skeleton&&(i.skeleton=i.skeleton.clone(r)),i.material&&(i.material=i.material.clone())})),e},updateRenderList:function(t,e){var r=t.__uid__,i=this._renderLists.get(r);i||(i=new Bn,this._renderLists.put(r,i)),i.startCount(),e&&(this.viewBoundingBoxLastFrame.min.set(1/0,1/0,1/0),this.viewBoundingBoxLastFrame.max.set(-1/0,-1/0,-1/0));var n=this.material&&this.material.transparent||!1;return this._doUpdateRenderList(this,t,n,i,e),i.endCount(),i},getRenderList:function(t){return this._renderLists.get(t.__uid__)},_doUpdateRenderList:function(t,e,r,i,n){if(!t.invisible)for(var a=0;a<t._children.length;a++){var o=t._children[a];if(o.isRenderable()){var s=o.isSkinnedMesh()?_c:o.worldTransform.array,l=o.geometry;R.multiplyAffine(bl,e.viewMatrix.array,s),(n&&!l.boundingBox||!this.isFrustumCulled(o,e,bl))&&i.add(o,o.material.transparent||r)}o._children.length>0&&this._doUpdateRenderList(o,e,r,i,n)}},isFrustumCulled:(Ie=new Xt,Ii=new k,function(t,e,r){var i=t.boundingBox;if(i||(i=t.skeleton&&t.skeleton.boundingBox?t.skeleton.boundingBox:t.geometry.boundingBox),!i)return!1;if(Ii.array=r,Ie.transformFrom(i,Ii),t.castShadow&&this.viewBoundingBoxLastFrame.union(Ie),t.frustumCulling){if(!Ie.intersectBoundingBox(e.frustum.boundingBox))return!0;Ii.array=e.projectionMatrix.array,Ie.max.array[2]>0&&Ie.min.array[2]<0&&(Ie.max.array[2]=-1e-20),Ie.applyProjection(Ii);var n=Ie.min.array,a=Ie.max.array;if(a[0]<-1||n[0]>1||a[1]<-1||n[1]>1||a[2]<-1||n[2]>1)return!0}return!1}),_updateLightUniforms:function(){var t=this.lights;t.sort(yc);var e=this._lightUniforms;for(var r in e)for(var i in e[r])e[r][i].value.length=0;for(var n=0;n<t.length;n++){var a=t[n];if(!a.invisible)for(var i in r=a.group,a.uniformTemplates){var o=a.uniformTemplates[i],s=o.value(a);if(s!=null){e[r]||(e[r]={}),e[r][i]||(e[r][i]={type:"",value:[]});var l=e[r][i];switch(l.type=o.type+"v",o.type){case"1i":case"1f":case"t":l.value.push(s);break;case"2f":case"3f":case"4f":for(var u=0;u<s.length;u++)l.value.push(s[u]);break;default:console.error("Unkown light uniform type "+o.type)}}}}},getLightGroups:function(){var t=[];for(var e in this._lightNumber)t.push(e);return t},getNumberChangedLightGroups:function(){var t=[];for(var e in this._lightNumber)this.isLightNumberChanged(e)&&t.push(e);return t},isLightNumberChanged:function(t){var e=this._previousLightNumber,r=this._lightNumber;for(var i in r[t])if(!e[t]||r[t][i]!==e[t][i])return!0;for(var i in e[t])if(!r[t]||r[t][i]!==e[t][i])return!0;return!1},getLightsNumbers:function(t){return this._lightNumber[t]},getProgramKey:function(t){return this._lightProgramKeys[t]},setLightUniforms:(function(){function t(e,r,i){for(var n in e){var a=e[n];if(a.type==="tv"){if(!r.hasUniform(n))continue;for(var o=[],s=0;s<a.value.length;s++){var l=a.value[s],u=r.takeCurrentTextureSlot(i,l);o.push(u)}r.setUniform(i.gl,"1iv",n,o)}else r.setUniform(i.gl,a.type,n,a.value)}}return function(e,r,i){t(this._lightUniforms[r],e,i),t(this.shadowUniforms,e,i)}})(),dispose:function(){this.material=null,this._opaqueList=[],this._transparentList=[],this.lights=[],this._lightUniforms={},this._lightNumber={},this._nodeRepository={}}});var wl=function(t){this.value=t},xc=(function(){function t(){this._len=0}return t.prototype.insert=function(e){var r=new wl(e);return this.insertEntry(r),r},t.prototype.insertEntry=function(e){this.head?(this.tail.next=e,e.prev=this.tail,e.next=null,this.tail=e):this.head=this.tail=e,this._len++},t.prototype.remove=function(e){var r=e.prev,i=e.next;r?r.next=i:this.head=i,i?i.prev=r:this.tail=r,e.next=e.prev=null,this._len--},t.prototype.len=function(){return this._len},t.prototype.clear=function(){this.head=this.tail=null,this._len=0},t})();let Tl=(function(){function t(e){this._list=new xc,this._maxSize=10,this._map={},this._maxSize=e}return t.prototype.put=function(e,r){var i=this._list,n=this._map,a=null;if(n[e]==null){var o=i.len(),s=this._lastRemovedEntry;if(o>=this._maxSize&&o>0){var l=i.head;i.remove(l),delete n[l.key],a=l.value,this._lastRemovedEntry=l}s?s.value=r:s=new wl(r),s.key=e,i.insertEntry(s),n[e]=s}return a},t.prototype.get=function(e){var r=this._map[e],i=this._list;if(r!=null)return r!==i.tail&&(i.remove(r),i.insertEntry(r)),r.value},t.prototype.clear=function(){this._list.clear(),this._map={}},t.prototype.len=function(){return this._list.len()},t})();var zn=cl.isPowerOfTwo,bc=["px","nx","py","ny","pz","nz"],yo=H.extend((function(){return{image:{px:null,nx:null,py:null,ny:null,pz:null,nz:null},pixels:{px:null,nx:null,py:null,ny:null,pz:null,nz:null},mipmaps:[]}}),{textureType:"textureCube",update:function(t){var e=t.gl;e.bindTexture(e.TEXTURE_CUBE_MAP,this._cache.get("webgl_texture")),this.updateCommon(t);var r=this.format,i=this.type;e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,this.getAvailableWrapS()),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,this.getAvailableWrapT()),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,this.getAvailableMagFilter()),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,this.getAvailableMinFilter());var n=t.getGLExtension("EXT_texture_filter_anisotropic");if(n&&this.anisotropic>1&&e.texParameterf(e.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropic),i===36193&&(t.getGLExtension("OES_texture_half_float")||(i=Ln)),this.mipmaps.length)for(var a=this.width,o=this.height,s=0;s<this.mipmaps.length;s++){var l=this.mipmaps[s];this._updateTextureData(e,l,s,a,o,r,i),a/=2,o/=2}else this._updateTextureData(e,this,0,this.width,this.height,r,i),!this.NPOT&&this.useMipmap&&e.generateMipmap(e.TEXTURE_CUBE_MAP);e.bindTexture(e.TEXTURE_CUBE_MAP,null)},_updateTextureData:function(t,e,r,i,n,a,o){for(var s=0;s<6;s++){var l=bc[s],u=e.image&&e.image[l];u?t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+s,r,a,a,o,u):t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+s,r,a,i,n,0,a,o,e.pixels&&e.pixels[l])}},generateMipmap:function(t){var e=t.gl;this.useMipmap&&!this.NPOT&&(e.bindTexture(e.TEXTURE_CUBE_MAP,this._cache.get("webgl_texture")),e.generateMipmap(e.TEXTURE_CUBE_MAP))},bind:function(t){t.gl.bindTexture(t.gl.TEXTURE_CUBE_MAP,this.getWebGLTexture(t))},unbind:function(t){t.gl.bindTexture(t.gl.TEXTURE_CUBE_MAP,null)},isPowerOfTwo:function(){return this.image.px?zn(this.image.px.width)&&zn(this.image.px.height):zn(this.width)&&zn(this.height)},isRenderable:function(){return this.image.px?Jr(this.image.px)&&Jr(this.image.nx)&&Jr(this.image.py)&&Jr(this.image.ny)&&Jr(this.image.pz)&&Jr(this.image.nz):!(!this.width||!this.height)},load:function(t,e){var r=0,i=this;return zt.each(t,(function(n,a){var o=At.createImage();e&&(o.crossOrigin=e),o.onload=function(){--r==0&&(i.dirty(),i.trigger("success",i))},o.onerror=function(){r--},r++,o.src=n,i.image[a]=o})),this}});function Jr(t){return t.width>0&&t.height>0}Object.defineProperty(yo.prototype,"width",{get:function(){return this.image&&this.image.px?this.image.px.width:this._width},set:function(t){this.image&&this.image.px?console.warn("Texture from image can't set width"):(this._width!==t&&this.dirty(),this._width=t)}}),Object.defineProperty(yo.prototype,"height",{get:function(){return this.image&&this.image.px?this.image.px.height:this._height},set:function(t){this.image&&this.image.px?console.warn("Texture from image can't set height"):(this._height!==t&&this.dirty(),this._height=t)}});let Ri=yo,It=Qr.extend({fov:50,aspect:1,near:.1,far:2e3},{updateProjectionMatrix:function(){var t=this.fov/180*Math.PI;this.projectionMatrix.perspective(t,this.aspect,this.near,this.far)},decomposeProjectionMatrix:function(){var t=this.projectionMatrix.array,e=2*Math.atan(1/t[5]);this.fov=e/Math.PI*180,this.aspect=t[5]/t[0],this.near=t[14]/(t[10]-1),this.far=t[14]/(t[10]+1)},clone:function(){var t=Qr.prototype.clone.call(this);return t.fov=this.fov,t.aspect=this.aspect,t.near=this.near,t.far=this.far,t}});var Gn="framebuffer",$r="renderbuffer",Sl="renderbuffer_width",Ml="renderbuffer_height",xo="renderbuffer_attached",bo="depthtexture_attached",fr=36160,Fi=36161,Bi=36096,zi=jt.extend({depthBuffer:!0,viewport:null,_width:0,_height:0,_textures:null,_boundRenderer:null},(function(){this._cache=new co,this._textures={}}),{getTextureWidth:function(){return this._width},getTextureHeight:function(){return this._height},bind:function(t){if(t.__currentFrameBuffer){if(t.__currentFrameBuffer===this)return;console.warn("Renderer already bound with another framebuffer. Unbind it first")}t.__currentFrameBuffer=this;var e=t.gl;e.bindFramebuffer(fr,this._getFrameBufferGL(t)),this._boundRenderer=t;var r=this._cache;r.put("viewport",t.viewport);var i,n,a=!1;for(var o in this._textures){a=!0;var s=this._textures[o];s&&(i=s.texture.width,n=s.texture.height,this._doAttach(t,s.texture,o,s.target))}this._width=i,this._height=n,!a&&this.depthBuffer&&console.error("Must attach texture before bind, or renderbuffer may have incorrect width and height."),this.viewport?t.setViewport(this.viewport):t.setViewport(0,0,i,n,1);var l=r.get("attached_textures");if(l){for(var o in l)if(!this._textures[o]){var u=l[o];this._doDetach(e,o,u)}}if(!r.get(bo)&&this.depthBuffer){r.miss($r)&&r.put($r,e.createRenderbuffer());var h=r.get($r);i===r.get(Sl)&&n===r.get(Ml)||(e.bindRenderbuffer(Fi,h),e.renderbufferStorage(Fi,e.DEPTH_COMPONENT16,i,n),r.put(Sl,i),r.put(Ml,n),e.bindRenderbuffer(Fi,null)),r.get(xo)||(e.framebufferRenderbuffer(fr,Bi,Fi,h),r.put(xo,!0))}},unbind:function(t){t.__currentFrameBuffer=null,t.gl.bindFramebuffer(fr,null),this._boundRenderer=null,this._cache.use(t.__uid__);var e=this._cache.get("viewport");e&&t.setViewport(e),this.updateMipmap(t)},updateMipmap:function(t){var e=t.gl;for(var r in this._textures){var i=this._textures[r];if(i){var n=i.texture;if(!n.NPOT&&n.useMipmap&&n.minFilter===H.LINEAR_MIPMAP_LINEAR){var a=n.textureType==="textureCube"?34067:3553;e.bindTexture(a,n.getWebGLTexture(t)),e.generateMipmap(a),e.bindTexture(a,null)}}}},checkStatus:function(t){return t.checkFramebufferStatus(fr)},_getFrameBufferGL:function(t){var e=this._cache;return e.use(t.__uid__),e.miss(Gn)&&e.put(Gn,t.gl.createFramebuffer()),e.get(Gn)},attach:function(t,e,r){if(!t.width)throw new Error("The texture attached to color buffer is not a valid.");e=e||36064,r=r||3553;var i,n=this._boundRenderer;if(n&&n.gl){var a=this._cache;a.use(n.__uid__),i=a.get("attached_textures")}var o=this._textures[e];if(!o||o.target!==r||o.texture!==t||!i||i[e]==null){var s=!0;n&&(s=this._doAttach(n,t,e,r),this.viewport||n.setViewport(0,0,t.width,t.height,1)),s&&(this._textures[e]=this._textures[e]||{},this._textures[e].texture=t,this._textures[e].target=r)}},_doAttach:function(t,e,r,i){var n=t.gl,a=e.getWebGLTexture(t),o=this._cache.get("attached_textures");if(o&&o[r]){var s=o[r];if(s.texture===e&&s.target===i)return}var l=!0;if(((r=+r)===Bi||r===Ja)&&(t.getGLExtension("WEBGL_depth_texture")||(console.error("Depth texture is not supported by the browser"),l=!1),e.format!==Pn&&e.format!==34041&&(console.error("The texture attached to depth buffer is not a valid."),l=!1),l)){var u=this._cache.get($r);u&&(n.framebufferRenderbuffer(fr,Bi,Fi,null),n.deleteRenderbuffer(u),this._cache.put($r,!1)),this._cache.put(xo,!1),this._cache.put(bo,!0)}return n.framebufferTexture2D(fr,r,i,a,0),o||(o={},this._cache.put("attached_textures",o)),o[r]=o[r]||{},o[r].texture=e,o[r].target=i,l},_doDetach:function(t,e,r){t.framebufferTexture2D(fr,e,r,null,0);var i=this._cache.get("attached_textures");i&&i[e]&&(i[e]=null),e!==Bi&&e!==Ja||this._cache.put(bo,!1)},detach:function(t,e){this._textures[t]=null,this._boundRenderer&&(this._cache.use(this._boundRenderer.__uid__),this._doDetach(this._boundRenderer.gl,t,e))},dispose:function(t){var e=t.gl,r=this._cache;r.use(t.__uid__);var i=r.get($r);i&&e.deleteRenderbuffer(i);var n=r.get(Gn);n&&e.deleteFramebuffer(n),r.deleteContext(t.__uid__),this._textures={}}});zi.DEPTH_ATTACHMENT=Bi,zi.COLOR_ATTACHMENT0=36064,zi.STENCIL_ATTACHMENT=36128,zi.DEPTH_STENCIL_ATTACHMENT=Ja;let kt=zi;var wc=["px","nx","py","ny","pz","nz"];let wo=jt.extend((function(){var t={position:new F,far:1e3,near:.1,texture:null,shadowMapPass:null},e=t._cameras={px:new It({fov:90}),nx:new It({fov:90}),py:new It({fov:90}),ny:new It({fov:90}),pz:new It({fov:90}),nz:new It({fov:90})};return e.px.lookAt(F.POSITIVE_X,F.NEGATIVE_Y),e.nx.lookAt(F.NEGATIVE_X,F.NEGATIVE_Y),e.py.lookAt(F.POSITIVE_Y,F.POSITIVE_Z),e.ny.lookAt(F.NEGATIVE_Y,F.NEGATIVE_Z),e.pz.lookAt(F.POSITIVE_Z,F.NEGATIVE_Y),e.nz.lookAt(F.NEGATIVE_Z,F.NEGATIVE_Y),t._frameBuffer=new kt,t}),{getCamera:function(t){return this._cameras[t]},render:function(t,e,r){var i=t.gl;r||e.update();for(var n=this.texture.width,a=2*Math.atan(n/(n-.5))/Math.PI*180,o=0;o<6;o++){var s=wc[o],l=this._cameras[s];if(F.copy(l.position,this.position),l.far=this.far,l.near=this.near,l.fov=a,this.shadowMapPass){l.update();var u=e.getBoundingBox();u.applyTransform(l.viewMatrix),e.viewBoundingBoxLastFrame.copy(u),this.shadowMapPass.render(t,e,l,!0)}this._frameBuffer.attach(this.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+o),this._frameBuffer.bind(t),t.render(e,l,!0),this._frameBuffer.unbind(t)}},dispose:function(t){this._frameBuffer.dispose(t)}}),Un=nt.extend({dynamic:!1,widthSegments:1,heightSegments:1},(function(){this.build()}),{build:function(){for(var t=this.heightSegments,e=this.widthSegments,r=this.attributes,i=[],n=[],a=[],o=[],s=0;s<=t;s++)for(var l=s/t,u=0;u<=e;u++){var h=u/e;if(i.push([2*h-1,2*l-1,0]),n&&n.push([h,l]),a&&a.push([0,0,1]),u<e&&s<t){var c=u+s*(e+1);o.push([c,c+1,c+e+1]),o.push([c+e+1,c+1,c+e+2])}}r.position.fromArray(i),r.texcoord0.fromArray(n),r.normal.fromArray(a),this.initIndicesFromArray(o),this.boundingBox=new Xt,this.boundingBox.min.set(-1,-1,0),this.boundingBox.max.set(1,1,0)}});var xt=new k;function ti(t,e,r){xt.identity();var i=new Un({widthSegments:e,heightSegments:r});switch(t){case"px":k.translate(xt,xt,F.POSITIVE_X),k.rotateY(xt,xt,Math.PI/2);break;case"nx":k.translate(xt,xt,F.NEGATIVE_X),k.rotateY(xt,xt,-Math.PI/2);break;case"py":k.translate(xt,xt,F.POSITIVE_Y),k.rotateX(xt,xt,-Math.PI/2);break;case"ny":k.translate(xt,xt,F.NEGATIVE_Y),k.rotateX(xt,xt,Math.PI/2);break;case"pz":k.translate(xt,xt,F.POSITIVE_Z);break;case"nz":k.translate(xt,xt,F.NEGATIVE_Z),k.rotateY(xt,xt,Math.PI)}return i.applyTransform(xt),i}let Al=nt.extend({dynamic:!1,widthSegments:1,heightSegments:1,depthSegments:1,inside:!1},(function(){this.build()}),{build:function(){var t={px:ti("px",this.depthSegments,this.heightSegments),nx:ti("nx",this.depthSegments,this.heightSegments),py:ti("py",this.widthSegments,this.depthSegments),ny:ti("ny",this.widthSegments,this.depthSegments),pz:ti("pz",this.widthSegments,this.heightSegments),nz:ti("nz",this.widthSegments,this.heightSegments)},e=["position","texcoord0","normal"],r=0,i=0;for(var n in t)r+=t[n].vertexCount,i+=t[n].indices.length;for(var a=0;a<e.length;a++)this.attributes[e[a]].init(r);this.indices=new At.Uint16Array(i);var o=0,s=0;for(var n in t){var l=t[n];for(a=0;a<e.length;a++)for(var u=e[a],h=l.attributes[u].value,c=l.attributes[u].size,f=u==="normal",p=0;p<h.length;p++){var d=h[p];this.inside&&f&&(d=-d),this.attributes[u].value[p+c*s]=d}var m=l.indices.length;for(p=0;p<l.indices.length;p++)this.indices[p+o]=s+l.indices[this.inside?m-p-1:p];o+=l.indices.length,s+=l.vertexCount}this.boundingBox=new Xt,this.boundingBox.max.set(1,1,1),this.boundingBox.min.set(-1,-1,-1)}});z.import(`@export clay.skybox.vertex
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
@end`);let kn=lr.extend((function(){var t=new z({vertex:z.source("clay.skybox.vertex"),fragment:z.source("clay.skybox.fragment")}),e=new he({shader:t,depthMask:!1});return{scene:null,geometry:new Al,material:e,environmentMap:null,culling:!1,_dummyCamera:new It}}),(function(){var t=this.scene;t&&this.attachScene(t),this.environmentMap&&this.setEnvironmentMap(this.environmentMap)}),{attachScene:function(t){this.scene&&this.detachScene(),t.skybox=this,this.scene=t,t.on("beforerender",this._beforeRenderScene,this)},detachScene:function(){this.scene&&(this.scene.off("beforerender",this._beforeRenderScene),this.scene.skybox=null),this.scene=null},dispose:function(t){this.detachScene(),this.geometry.dispose(t)},setEnvironmentMap:function(t){t.textureType==="texture2D"?(this.material.define("EQUIRECTANGULAR"),t.minFilter=H.LINEAR):this.material.undefine("EQUIRECTANGULAR"),this.material.set("environmentMap",t)},getEnvironmentMap:function(){return this.material.get("environmentMap")},_beforeRenderScene:function(t,e,r){this.renderSkybox(t,r)},renderSkybox:function(t,e){var r=this._dummyCamera;r.aspect=t.getViewportAspect(),r.fov=e.fov||50,r.updateProjectionMatrix(),k.invert(r.invProjectionMatrix,r.projectionMatrix),r.worldTransform.copy(e.worldTransform),r.viewMatrix.copy(e.viewMatrix),this.position.copy(e.getWorldPosition()),this.update(),t.gl.disable(t.gl.BLEND),this.material.get("lod")>0?this.material.define("fragment","LOD"):this.material.undefine("fragment","LOD"),t.renderPass([this],r)}}),El=kn;function To(t){return t.charCodeAt(0)+(t.charCodeAt(1)<<8)+(t.charCodeAt(2)<<16)+(t.charCodeAt(3)<<24)}var Tc=To("DXT1"),Sc=To("DXT3"),Mc=To("DXT5");let Ac=function(t,e){var r=new Int32Array(t,0,31);if(r[0]!==542327876||4&!r(20))return null;var i,n,a=r(21),o=r[4],s=r[3],l=512&r[28],u=131072&r[2];switch(a){case Tc:i=8,n=H.COMPRESSED_RGB_S3TC_DXT1_EXT;break;case Sc:i=16,n=H.COMPRESSED_RGBA_S3TC_DXT3_EXT;break;case Mc:i=16,n=H.COMPRESSED_RGBA_S3TC_DXT5_EXT;break;default:return null}var h=r[1]+4,c=l?6:1,f=1;u&&(f=Math.max(1,r[7]));for(var p=[],d=0;d<c;d++){var m=o,g=s;p[d]=new K({width:m,height:g,format:n});for(var _=[],y=0;y<f;y++){var x=Math.max(4,m)/4*Math.max(4,g)/4*i,v=new Uint8Array(t,h,x);h+=x,m*=.5,g*=.5,_[y]=v}p[d].pixels=_[0],u&&(p[d].mipmaps=_)}if(!e)return p[0];e.width=p[0].width,e.height=p[0].height,e.format=p[0].format,e.pixels=p[0].pixels,e.mipmaps=p[0].mipmaps};var Vn=String.fromCharCode;function Ec(t,e,r,i){if(t[3]>0){var n=Math.pow(2,t[3]-128-8+i);e[r+0]=t[0]*n,e[r+1]=t[1]*n,e[r+2]=t[2]*n}else e[r+0]=0,e[r+1]=0,e[r+2]=0;return e[r+3]=1,e}function Cl(t,e,r,i){for(var n,a,o=0,s=0,l=i;l>0;)if(t[s][0]=e[r++],t[s][1]=e[r++],t[s][2]=e[r++],t[s][3]=e[r++],t[s][0]===1&&t[s][1]===1&&t[s][2]===1){for(var u=t[s][3]<<o>>>0;u>0;u--)n=t[s-1],(a=t[s])[0]=n[0],a[1]=n[1],a[2]=n[2],a[3]=n[3],s++,l--;o+=8}else s++,l--,o=0;return r}function Cc(t,e,r,i){if(i<8|i>32767)return Cl(t,e,r,i);if((n=e[r++])!=2)return Cl(t,e,r-1,i);if(t[0][1]=e[r++],t[0][2]=e[r++],n=e[r++],(t[0][2]<<8>>>0|n)>>>0!==i)return null;for(var n=0;n<4;n++)for(var a=0;a<i;){var o=e[r++];if(o>128){o=(127&o)>>>0;for(var s=e[r++];o--;)t[a++][n]=s}else for(;o--;)t[a++][n]=e[r++]}return r}let Dc=function(t,e,r){r==null&&(r=0);var i=new Uint8Array(t),n=i.length;if((function(y,x,v){for(var w="",b=0;b<2;b++)w+=Vn(y[b]);return w})(i)==="#?"){for(var a=2;a<n&&(Vn(i[a])!==`
`||Vn(i[a+1])!==`
`);a++);if(!(a>=n)){a+=2;for(var o="";a<n;a++){var s=Vn(i[a]);if(s===`
`)break;o+=s}var l=o.split(" "),u=parseInt(l[1]),h=parseInt(l[3]);if(h&&u){for(var c=a+1,f=[],p=0;p<h;p++){f[p]=[];for(var d=0;d<4;d++)f[p][d]=0}for(var m=new Float32Array(h*u*4),g=0,_=0;_<u;_++){if(!(c=Cc(f,i,c,h)))return null;for(p=0;p<h;p++)Ec(f[p],m,g,r),g+=4}return e||(e=new K),e.width=h,e.height=u,e.pixels=m,e.type=H.FLOAT,e}}}};var Hn={loadTexture:function(t,e,r,i){var n;if(typeof e=="function"?(i=r=e,e={}):e=e||{},typeof t=="string"){if(t.match(/.hdr$/)||e.fileType==="hdr")return n=new K({width:0,height:0,sRGB:!1}),Hn._fetchTexture(t,(function(a){Dc(a,n,e.exposure),n.dirty(),r&&r(n)}),i),n;t.match(/.dds$/)||e.fileType==="dds"?(n=new K({width:0,height:0}),Hn._fetchTexture(t,(function(a){Ac(a,n),n.dirty(),r&&r(n)}),i)):((n=new K).load(t),n.success(r),n.error(i))}else typeof t=="object"&&t.px!==void 0&&((n=new Ri).load(t),n.success(r),n.error(i));return n},loadPanorama:function(t,e,r,i,n,a){var o=this;typeof i=="function"?(a=n=i,i={}):i=i||{},Hn.loadTexture(e,i,(function(s){s.flipY=i.flipY||!1,o.panoramaToCubeMap(t,s,r,i),s.dispose(t),n&&n(r)}),a)},panoramaToCubeMap:function(t,e,r,i){var n=new wo,a=new El({scene:new Ye});return a.setEnvironmentMap(e),(i=i||{}).encodeRGBM&&a.material.define("fragment","RGBM_ENCODE"),r.sRGB=e.sRGB,n.texture=r,n.render(t,a.scene),n.texture=null,n.dispose(t),r},heightToNormal:function(t,e){var r=document.createElement("canvas"),i=r.width=t.width,n=r.height=t.height,a=r.getContext("2d");a.drawImage(t,0,0,i,n),e=e||!1;for(var o=a.getImageData(0,0,i,n),s=a.createImageData(i,n),l=0;l<o.data.length;l+=4){if(e){var u=o.data[l],h=o.data[l+1],c=o.data[l+2];if(Math.abs(u-h)+Math.abs(h-c)>20)return console.warn("Given image is not a height map"),t}var f,p,d,m;l%(4*i)==0?(f=o.data[l],d=o.data[l+4]):l%(4*i)==4*(i-1)?(f=o.data[l-4],d=o.data[l]):(f=o.data[l-4],d=o.data[l+4]),l<4*i?(p=o.data[l],m=o.data[l+4*i]):l>i*(n-1)*4?(p=o.data[l-4*i],m=o.data[l]):(p=o.data[l-4*i],m=o.data[l+4*i]),s.data[l]=f-d+127,s.data[l+1]=p-m+127,s.data[l+2]=255,s.data[l+3]=255}return a.putImageData(s,0,0),r},isHeightImage:function(t,e,r){if(!t||!t.width||!t.height)return!1;var i=document.createElement("canvas"),n=i.getContext("2d"),a=e||32;r=r||20,i.width=i.height=a,n.drawImage(t,0,0,a,a);for(var o=n.getImageData(0,0,a,a),s=0;s<o.data.length;s+=4){var l=o.data[s],u=o.data[s+1],h=o.data[s+2];if(Math.abs(l-u)+Math.abs(u-h)>r)return!1}return!0},_fetchTexture:function(t,e,r){At.request.get({url:t,responseType:"arraybuffer",onload:e,onerror:r})},createChessboard:function(t,e,r,i){t=t||512,e=e||64,r=r||"black",i=i||"white";var n=Math.ceil(t/e),a=document.createElement("canvas");a.width=t,a.height=t;var o=a.getContext("2d");o.fillStyle=i,o.fillRect(0,0,t,t),o.fillStyle=r;for(var s=0;s<n;s++)for(var l=0;l<n;l++)(l%2?s%2:s%2-1)&&o.fillRect(s*e,l*e,e,e);return new K({image:a,anisotropic:8})},createBlank:function(t){var e=document.createElement("canvas");e.width=1,e.height=1;var r=e.getContext("2d");return r.fillStyle=t,r.fillRect(0,0,1,1),new K({image:e})}};let pr=Hn;function Wn(t){return t&&typeof t=="object"&&!Array.isArray(t)&&typeof t.count=="function"&&typeof t.getItem=="function"&&typeof t.getSource!="function"&&(t.getSource=function(){return{sourceFormat:"original",seriesLayoutBy:"column",startIndex:0,dimensionsDefine:null}},t.persistent==null&&(t.persistent=!0)),t}function Dl(t,e){if(!t.__ECGLOnRefresh){t.__ECGLOnRefresh=!0;var r=t._refresh?"_refresh":"refreshImmediately",i=t[r];t[r]=function(){i.apply(this,arguments),e()}}}var So=["mousedown","mouseup","mousemove","mouseover","mouseout","click","dblclick","contextmenu"];function Mo(t){return"_on"+t}var Ao=function(t){var e=this;this._texture=new K({anisotropic:32,flipY:!1,surface:this,dispose:function(r){e.dispose(),K.prototype.dispose.call(this,r)}}),So.forEach((function(r){this[Mo(r)]=function(i){i.triangle&&this._meshes.forEach((function(n){this.dispatchEvent(r,n,i.triangle,i.point)}),this)}}),this),this._meshes=[],t&&this.setECharts(t),this.onupdate=null};Ao.prototype={constructor:Ao,getTexture:function(){return this._texture},setECharts:function(t){this._chart=t;var e=t.getDom();if(e instanceof HTMLCanvasElement){var r=this;Dl(t.getZr(),(function(){r._texture.dirty(),r.onupdate&&r.onupdate()}))}else console.error("ECharts must init on canvas if it is used as texture."),e=document.createElement("canvas");this._texture.image=e,this._texture.dirty(),this.onupdate&&this.onupdate()},dispatchEvent:(function(){var t=new F,e=new F,r=new F,i=new ne,n=new ne,a=new ne,o=new ne,s=new F;return function(l,u,h,c){var f=u.geometry,p=f.attributes.position,d=f.attributes.texcoord0,m=F.dot,g=F.cross;p.get(h[0],t.array),p.get(h[1],e.array),p.get(h[2],r.array),d.get(h[0],i.array),d.get(h[1],n.array),d.get(h[2],a.array),g(s,e,r);var _=m(t,s),y=m(c,s)/_;g(s,r,t);var x=m(c,s)/_;g(s,t,e);var v=m(c,s)/_;ne.scale(o,i,y),ne.scaleAndAdd(o,o,n,x),ne.scaleAndAdd(o,o,a,v);var w=o.x*this._chart.getWidth(),b=o.y*this._chart.getHeight();this._chart.getZr().handler.dispatch(l,{zrX:w,zrY:b})}})(),attachToMesh:function(t){this._meshes.indexOf(t)>=0||(So.forEach((function(e){t.on(e,this[Mo(e)],this)}),this),this._meshes.push(t))},detachFromMesh:function(t){var e=this._meshes.indexOf(t);e>=0&&this._meshes.splice(e,1),So.forEach((function(r){t.off(r,this[Mo(r)])}),this)},dispose:function(){this._meshes.forEach((function(t){this.detachFromMesh(t)}),this)}};let Lc=Ao,ei=Qr.extend({left:-1,right:1,near:-1,far:1,top:1,bottom:-1},{updateProjectionMatrix:function(){this.projectionMatrix.ortho(this.left,this.right,this.bottom,this.top,this.near,this.far)},decomposeProjectionMatrix:function(){var t=this.projectionMatrix.array;this.left=(-1-t[12])/t[0],this.right=(1-t[12])/t[0],this.top=(1-t[13])/t[5],this.bottom=(-1-t[13])/t[5],this.near=-(-1-t[14])/t[10],this.far=-(1-t[14])/t[10]},clone:function(){var t=Qr.prototype.clone.call(this);return t.left=this.left,t.right=this.right,t.near=this.near,t.far=this.far,t.top=this.top,t.bottom=this.bottom,t}});z.import(`
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
@end`);var Pc=new Un,Ll=new lr({geometry:Pc,frustumCulling:!1}),Oc=new ei;let Et=jt.extend((function(){return{fragment:"",outputs:null,material:null,blendWithPrevious:!1,clearColor:!1,clearDepth:!0}}),(function(){var t=new z(z.source("clay.compositor.vertex"),this.fragment),e=new he({shader:t});e.enableTexturesAll(),this.material=e}),{setUniform:function(t,e){this.material.setUniform(t,e)},getUniform:function(t){var e=this.material.uniforms[t];if(e)return e.value},attachOutput:function(t,e){this.outputs||(this.outputs={}),e=e||36064,this.outputs[e]=t},detachOutput:function(t){for(var e in this.outputs)this.outputs[e]===t&&(this.outputs[e]=null)},bind:function(t,e){if(this.outputs)for(var r in this.outputs){var i=this.outputs[r];i&&e.attach(i,r)}e&&e.bind(t)},unbind:function(t,e){e.unbind(t)},render:function(t,e){var r=t.gl;if(e){this.bind(t,e);var i=t.getGLExtension("EXT_draw_buffers");if(i&&this.outputs){var n=[];for(var a in this.outputs)(a=+a)>=r.COLOR_ATTACHMENT0&&a<=r.COLOR_ATTACHMENT0+8&&n.push(a);i.drawBuffersEXT(n)}}this.trigger("beforerender",this,t);var o=this.clearDepth?r.DEPTH_BUFFER_BIT:0;if(r.depthMask(!0),this.clearColor){o|=r.COLOR_BUFFER_BIT,r.colorMask(!0,!0,!0,!0);var s=this.clearColor;Array.isArray(s)&&r.clearColor(s[0],s[1],s[2],s[3])}r.clear(o),this.blendWithPrevious?(r.enable(r.BLEND),this.material.transparent=!0):(r.disable(r.BLEND),this.material.transparent=!1),this.renderQuad(t),this.trigger("afterrender",this,t),e&&this.unbind(t,e)},renderQuad:function(t){Ll.material=this.material,t.renderPass([Ll],Oc)},dispose:function(t){}});var mr={},Eo=["px","nx","py","ny","pz","nz"];mr.prefilterEnvironmentMap=function(t,e,r,i,n){n&&i||(i=mr.generateNormalDistribution(),n=mr.integrateBRDF(t,i));var a=(r=r||{}).width||64,o=r.height||64,s=r.type||e.type,l=new Ri({width:a,height:o,type:s,flipY:!1,mipmaps:[]});l.isPowerOfTwo()||console.warn("Width and height must be power of two to enable mipmap.");var u=Math.min(a,o),h=Math.log(u)/Math.log(2)+1,c=new he({shader:new z({vertex:z.source("clay.skybox.vertex"),fragment:`#define SHADER_NAME prefilter
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
`})});c.set("normalDistribution",i),r.encodeRGBM&&c.define("fragment","RGBM_ENCODE"),r.decodeRGBM&&c.define("fragment","RGBM_DECODE");var f,p=new Ye;if(e.textureType==="texture2D"){var d=new Ri({width:a,height:o,type:s===H.FLOAT?H.HALF_FLOAT:s});pr.panoramaToCubeMap(t,e,d,{encodeRGBM:r.decodeRGBM}),e=d}(f=new kn({scene:p,material:c})).material.set("environmentMap",e);var m=new wo({texture:l});r.encodeRGBM&&(s=l.type=H.UNSIGNED_BYTE);for(var g=new K({width:a,height:o,type:s}),_=new kt({depthBuffer:!1}),y=At[s===H.UNSIGNED_BYTE?"Uint8Array":"Float32Array"],x=0;x<h;x++){l.mipmaps[x]={pixels:{}},f.material.set("roughness",x/(h-1));for(var v=g.width,w=2*Math.atan(v/(v-.5))/Math.PI*180,b=0;b<Eo.length;b++){var S=new y(g.width*g.height*4);_.attach(g),_.bind(t);var A=m.getCamera(Eo[b]);A.fov=w,t.render(p,A),t.gl.readPixels(0,0,g.width,g.height,H.RGBA,s,S),_.unbind(t),l.mipmaps[x].pixels[Eo[b]]=S}g.width/=2,g.height/=2,g.dirty()}return _.dispose(t),g.dispose(t),f.dispose(t),i.dispose(t),{environmentMap:l,brdfLookup:n,normalDistribution:i,maxMipmapLevel:h}},mr.integrateBRDF=function(t,e){e=e||mr.generateNormalDistribution();var r=new kt({depthBuffer:!1}),i=new Et({fragment:`#define SAMPLE_NUMBER 1024
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
`}),n=new K({width:512,height:256,type:H.HALF_FLOAT,wrapS:H.CLAMP_TO_EDGE,wrapT:H.CLAMP_TO_EDGE,minFilter:H.NEAREST,magFilter:H.NEAREST,useMipmap:!1});return i.setUniform("normalDistribution",e),i.setUniform("viewportSize",[512,256]),i.attachOutput(n),i.render(t,r),r.dispose(t),n},mr.generateNormalDistribution=function(t,e){for(var r=new K({width:t=t||256,height:e=e||1024,type:H.FLOAT,minFilter:H.NEAREST,magFilter:H.NEAREST,wrapS:H.CLAMP_TO_EDGE,wrapT:H.CLAMP_TO_EDGE,useMipmap:!1}),i=new Float32Array(e*t*4),n=[],a=0;a<t;a++){for(var o=a/t,s=o*o,l=0;l<e;l++){var u=(l<<16|l>>>16)>>>0;u=(((16711935&(u=((252645135&(u=((858993459&(u=((1431655765&u)<<1|(2863311530&u)>>>1)>>>0))<<2|(3435973836&u)>>>2)>>>0))<<4|(4042322160&u)>>>4)>>>0))<<8|(4278255360&u)>>>8)>>>0)/4294967296;var h=Math.sqrt((1-u)/(1+(s*s-1)*u));n[l]=h}for(l=0;l<e;l++){var c=4*(l*t+a),f=(h=n[l],Math.sqrt(1-h*h)),p=l/e,d=2*Math.PI*p;i[c]=f*Math.cos(d),i[c+1]=h,i[c+2]=f*Math.sin(d),i[c+3]=1}}return r.pixels=i,r};let jn=mr,Nc=we.extend({cubemap:null,castShadow:!1,_normalDistribution:null,_brdfLookup:null},{type:"AMBIENT_CUBEMAP_LIGHT",prefilter:function(t,e){if(t.getGLExtension("EXT_shader_texture_lod")){this._brdfLookup||(this._normalDistribution=jn.generateNormalDistribution(),this._brdfLookup=jn.integrateBRDF(t,this._normalDistribution));var r=this.cubemap;if(!r.__prefiltered){var i=jn.prefilterEnvironmentMap(t,r,{encodeRGBM:!0,width:e,height:e},this._normalDistribution,this._brdfLookup);this.cubemap=i.environmentMap,this.cubemap.__prefiltered=!0,r.dispose(t)}}else console.warn("Device not support textureCubeLodEXT")},getBRDFLookup:function(){return this._brdfLookup},uniformTemplates:{ambientCubemapLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}},ambientCubemapLightCubemap:{type:"t",value:function(t){return t.cubemap}},ambientCubemapLightBRDFLookup:{type:"t",value:function(t){return t._brdfLookup}}}}),Ic=we.extend({castShadow:!1,coefficients:[]},(function(){this._coefficientsTmpArr=new At.Float32Array(27)}),{type:"AMBIENT_SH_LIGHT",uniformTemplates:{ambientSHLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}},ambientSHLightCoefficients:{type:"3f",value:function(t){for(var e=t._coefficientsTmpArr,r=0;r<t.coefficients.length;r++)e[r]=t.coefficients[r];return e}}}});var Pl={},gr=["px","nx","py","ny","pz","nz"];function Rc(t,e){var r=t[0],i=t[1],n=t[2];return e===0?1:e===1?r:e===2?i:e===3?n:e===4?r*n:e===5?i*n:e===6?r*i:e===7?3*n*n-1:r*r-i*i}var Fc={px:[2,1,0,-1,-1,1],nx:[2,1,0,1,-1,-1],py:[0,2,1,1,-1,-1],ny:[0,2,1,1,1,1],pz:[0,1,2,-1,-1,-1],nz:[0,1,2,1,-1,1]};Pl.projectEnvironmentMap=function(t,e,r){var i;(r=r||{}).lod=r.lod||0;var n=new Ye,a=64;e.textureType==="texture2D"?i=new El({scene:n,environmentMap:e}):(a=e.image&&e.image.px?e.image.px.width:e.width,i=new kn({scene:n,environmentMap:e}));var o=Math.ceil(a/Math.pow(2,r.lod)),s=Math.ceil(a/Math.pow(2,r.lod)),l=new K({width:o,height:s}),u=new kt;i.material.define("fragment","RGBM_ENCODE"),r.decodeRGBM&&i.material.define("fragment","RGBM_DECODE"),i.material.set("lod",r.lod);for(var h=new wo({texture:l}),c={},f=0;f<gr.length;f++){c[gr[f]]=new Uint8Array(o*s*4);var p=h.getCamera(gr[f]);p.fov=90,u.attach(l),u.bind(t),t.render(n,p),t.gl.readPixels(0,0,o,s,H.RGBA,H.UNSIGNED_BYTE,c[gr[f]]),u.unbind(t)}return i.dispose(t),u.dispose(t),l.dispose(t),(function(d,m,g,_){for(var y=new At.Float32Array(27),x=E.create(),v=E.create(),w=E.create(),b=0;b<9;b++){for(var S=E.create(),A=0;A<gr.length;A++){for(var D=m[gr[A]],P=E.create(),L=0,O=0,N=Fc[gr[A]],C=0;C<_;C++)for(var B=0;B<g;B++){x[0]=B/(g-1)*2-1,x[1]=C/(_-1)*2-1,x[2]=-1,E.normalize(x,x),w[0]=x[N[0]]*N[3],w[1]=x[N[1]]*N[4],w[2]=x[N[2]]*N[5],v[0]=D[O++]/255,v[1]=D[O++]/255,v[2]=D[O++]/255;var I=D[O++]/255*8.12;v[0]*=I,v[1]*=I,v[2]*=I,E.scaleAndAdd(P,P,v,Rc(w,b)*-x[2]),L+=-x[2]}E.scaleAndAdd(S,S,P,1/L)}y[3*b]=S[0]/6,y[3*b+1]=S[1]/6,y[3*b+2]=S[2]/6}return y})(0,c,o,s)};let Bc=Pl,J=function(){for(var t=0,e=arguments.length;t<e;t++)if(arguments[t]!=null)return arguments[t]},Ol=function(t,e){return e.dataIndexInside!=null?e.dataIndexInside:e.dataIndex!=null?M.util.isArray(e.dataIndex)?M.util.map(e.dataIndex,(function(r){return t.indexOfRawIndex(r)})):t.indexOfRawIndex(e.dataIndex):e.name!=null?M.util.isArray(e.name)?M.util.map(e.name,(function(r){return t.indexOfName(r)})):t.indexOfName(e.name):void 0},zc=nt.extend({dynamic:!1,widthSegments:40,heightSegments:20,phiStart:0,phiLength:2*Math.PI,thetaStart:0,thetaLength:Math.PI,radius:1},(function(){this.build()}),{build:function(){var t=this.heightSegments,e=this.widthSegments,r=this.attributes.position,i=this.attributes.texcoord0,n=this.attributes.normal,a=(e+1)*(t+1);r.init(a),i.init(a),n.init(a);var o,s,l,u,h,c,f,p,d,m,g,_=a>65535?Uint32Array:Uint16Array,y=this.indices=new _(e*t*6),x=this.radius,v=this.phiStart,w=this.phiLength,b=this.thetaStart,S=this.thetaLength,A=[],D=[],P=0,L=1/(x=this.radius);for(f=0;f<=t;f++)for(c=0;c<=e;c++)u=c/e,h=f/t,o=-x*Math.cos(v+u*w)*Math.sin(b+h*S),s=x*Math.cos(b+h*S),l=x*Math.sin(v+u*w)*Math.sin(b+h*S),A[0]=o,A[1]=s,A[2]=l,D[0]=u,D[1]=h,r.set(P,A),i.set(P,D),A[0]*=L,A[1]*=L,A[2]*=L,n.set(P,A),P++;var O=e+1,N=0;for(f=0;f<t;f++)for(c=0;c<e;c++)d=f*O+c,p=f*O+c+1,g=(f+1)*O+c+1,m=(f+1)*O+c,y[N++]=p,y[N++]=d,y[N++]=g,y[N++]=d,y[N++]=m,y[N++]=g;this.boundingBox=new Xt,this.boundingBox.max.set(x,x,x),this.boundingBox.min.set(-x,-x,-x)}}),Gc=we.extend({castShadow:!1},{type:"AMBIENT_LIGHT",uniformTemplates:{ambientLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}}}}),Uc=we.extend({shadowBias:.001,shadowSlopeScale:2,shadowCascade:1,cascadeSplitLogFactor:.2},{type:"DIRECTIONAL_LIGHT",uniformTemplates:{directionalLightDirection:{type:"3f",value:function(t){return t.__dir=t.__dir||new F,t.__dir.copy(t.worldTransform.z).normalize().negate().array}},directionalLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}}},clone:function(){var t=we.prototype.clone.call(this);return t.shadowBias=this.shadowBias,t.shadowSlopeScale=this.shadowSlopeScale,t}}),kc=we.extend({range:100,castShadow:!1},{type:"POINT_LIGHT",uniformTemplates:{pointLightPosition:{type:"3f",value:function(t){return t.getWorldPosition().array}},pointLightRange:{type:"1f",value:function(t){return t.range}},pointLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}}},clone:function(){var t=we.prototype.clone.call(this);return t.range=this.range,t}}),Vc=we.extend({range:20,umbraAngle:30,penumbraAngle:45,falloffFactor:2,shadowBias:.001,shadowSlopeScale:2},{type:"SPOT_LIGHT",uniformTemplates:{spotLightPosition:{type:"3f",value:function(t){return t.getWorldPosition().array}},spotLightRange:{type:"1f",value:function(t){return t.range}},spotLightUmbraAngleCosine:{type:"1f",value:function(t){return Math.cos(t.umbraAngle*Math.PI/180)}},spotLightPenumbraAngleCosine:{type:"1f",value:function(t){return Math.cos(t.penumbraAngle*Math.PI/180)}},spotLightFalloffFactor:{type:"1f",value:function(t){return t.falloffFactor}},spotLightDirection:{type:"3f",value:function(t){return t.__dir=t.__dir||new F,t.__dir.copy(t.worldTransform.z).negate().array}},spotLightColor:{type:"3f",value:function(t){var e=t.color,r=t.intensity;return[e[0]*r,e[1]*r,e[2]*r]}}},clone:function(){var t=we.prototype.clone.call(this);return t.range=this.range,t.umbraAngle=this.umbraAngle,t.penumbraAngle=this.penumbraAngle,t.falloffFactor=this.falloffFactor,t.shadowBias=this.shadowBias,t.shadowSlopeScale=this.shadowSlopeScale,t}});var ut=function(t,e,r,i){t=t||0,e=e||0,r=r||0,i=i||0,this.array=G.fromValues(t,e,r,i),this._dirty=!0};ut.prototype={constructor:ut,add:function(t){return G.add(this.array,this.array,t.array),this._dirty=!0,this},set:function(t,e,r,i){return this.array[0]=t,this.array[1]=e,this.array[2]=r,this.array[3]=i,this._dirty=!0,this},setArray:function(t){return this.array[0]=t[0],this.array[1]=t[1],this.array[2]=t[2],this.array[3]=t[3],this._dirty=!0,this},clone:function(){return new ut(this.x,this.y,this.z,this.w)},copy:function(t){return G.copy(this.array,t.array),this._dirty=!0,this},dist:function(t){return G.dist(this.array,t.array)},distance:function(t){return G.distance(this.array,t.array)},div:function(t){return G.div(this.array,this.array,t.array),this._dirty=!0,this},divide:function(t){return G.divide(this.array,this.array,t.array),this._dirty=!0,this},dot:function(t){return G.dot(this.array,t.array)},len:function(){return G.len(this.array)},length:function(){return G.length(this.array)},lerp:function(t,e,r){return G.lerp(this.array,t.array,e.array,r),this._dirty=!0,this},min:function(t){return G.min(this.array,this.array,t.array),this._dirty=!0,this},max:function(t){return G.max(this.array,this.array,t.array),this._dirty=!0,this},mul:function(t){return G.mul(this.array,this.array,t.array),this._dirty=!0,this},multiply:function(t){return G.multiply(this.array,this.array,t.array),this._dirty=!0,this},negate:function(){return G.negate(this.array,this.array),this._dirty=!0,this},normalize:function(){return G.normalize(this.array,this.array),this._dirty=!0,this},random:function(t){return G.random(this.array,t),this._dirty=!0,this},scale:function(t){return G.scale(this.array,this.array,t),this._dirty=!0,this},scaleAndAdd:function(t,e){return G.scaleAndAdd(this.array,this.array,t.array,e),this._dirty=!0,this},sqrDist:function(t){return G.sqrDist(this.array,t.array)},squaredDistance:function(t){return G.squaredDistance(this.array,t.array)},sqrLen:function(){return G.sqrLen(this.array)},squaredLength:function(){return G.squaredLength(this.array)},sub:function(t){return G.sub(this.array,this.array,t.array),this._dirty=!0,this},subtract:function(t){return G.subtract(this.array,this.array,t.array),this._dirty=!0,this},transformMat4:function(t){return G.transformMat4(this.array,this.array,t.array),this._dirty=!0,this},transformQuat:function(t){return G.transformQuat(this.array,this.array,t.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}};var Gi=Object.defineProperty;if(Gi){var Xn=ut.prototype;Gi(Xn,"x",{get:function(){return this.array[0]},set:function(t){this.array[0]=t,this._dirty=!0}}),Gi(Xn,"y",{get:function(){return this.array[1]},set:function(t){this.array[1]=t,this._dirty=!0}}),Gi(Xn,"z",{get:function(){return this.array[2]},set:function(t){this.array[2]=t,this._dirty=!0}}),Gi(Xn,"w",{get:function(){return this.array[3]},set:function(t){this.array[3]=t,this._dirty=!0}})}ut.add=function(t,e,r){return G.add(t.array,e.array,r.array),t._dirty=!0,t},ut.set=function(t,e,r,i,n){G.set(t.array,e,r,i,n),t._dirty=!0},ut.copy=function(t,e){return G.copy(t.array,e.array),t._dirty=!0,t},ut.distance=ut.dist=function(t,e){return G.distance(t.array,e.array)},ut.divide=ut.div=function(t,e,r){return G.divide(t.array,e.array,r.array),t._dirty=!0,t},ut.dot=function(t,e){return G.dot(t.array,e.array)},ut.len=function(t){return G.length(t.array)},ut.lerp=function(t,e,r,i){return G.lerp(t.array,e.array,r.array,i),t._dirty=!0,t},ut.min=function(t,e,r){return G.min(t.array,e.array,r.array),t._dirty=!0,t},ut.max=function(t,e,r){return G.max(t.array,e.array,r.array),t._dirty=!0,t},ut.multiply=ut.mul=function(t,e,r){return G.multiply(t.array,e.array,r.array),t._dirty=!0,t},ut.negate=function(t,e){return G.negate(t.array,e.array),t._dirty=!0,t},ut.normalize=function(t,e){return G.normalize(t.array,e.array),t._dirty=!0,t},ut.random=function(t,e){return G.random(t.array,e),t._dirty=!0,t},ut.scale=function(t,e,r){return G.scale(t.array,e.array,r),t._dirty=!0,t},ut.scaleAndAdd=function(t,e,r,i){return G.scaleAndAdd(t.array,e.array,r.array,i),t._dirty=!0,t},ut.squaredDistance=ut.sqrDist=function(t,e){return G.sqrDist(t.array,e.array)},ut.squaredLength=ut.sqrLen=function(t){return G.sqrLen(t.array)},ut.subtract=ut.sub=function(t,e,r){return G.subtract(t.array,e.array,r.array),t._dirty=!0,t},ut.transformMat4=function(t,e,r){return G.transformMat4(t.array,e.array,r.array),t._dirty=!0,t},ut.transformQuat=function(t,e,r){return G.transformQuat(t.array,e.array,r.array),t._dirty=!0,t};let Hc=ut;var _r={create:function(){var t=new Gt(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},clone:function(t){var e=new Gt(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},transpose:function(t,e){if(t===e){var r=e[1];t[1]=e[2],t[2]=r}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t},invert:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=r*a-n*i;return o?(o=1/o,t[0]=a*o,t[1]=-i*o,t[2]=-n*o,t[3]=r*o,t):null},adjoint:function(t,e){var r=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=r,t},determinant:function(t){return t[0]*t[3]-t[2]*t[1]},multiply:function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=r[0],l=r[1],u=r[2],h=r[3];return t[0]=i*s+a*l,t[1]=n*s+o*l,t[2]=i*u+a*h,t[3]=n*u+o*h,t}};_r.mul=_r.multiply,_r.rotate=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=Math.sin(r),l=Math.cos(r);return t[0]=i*l+a*s,t[1]=n*l+o*s,t[2]=i*-s+a*l,t[3]=n*-s+o*l,t},_r.scale=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=r[0],l=r[1];return t[0]=i*s,t[1]=n*s,t[2]=a*l,t[3]=o*l,t},_r.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},_r.LDU=function(t,e,r,i){return t[2]=i[2]/i[0],r[0]=i[0],r[1]=i[1],r[3]=i[3]-t[2]*r[1],[t,e,r]};let wt=_r;var Jt=function(){this.array=wt.create(),this._dirty=!0};Jt.prototype={constructor:Jt,setArray:function(t){for(var e=0;e<this.array.length;e++)this.array[e]=t[e];return this._dirty=!0,this},clone:function(){return new Jt().copy(this)},copy:function(t){return wt.copy(this.array,t.array),this._dirty=!0,this},adjoint:function(){return wt.adjoint(this.array,this.array),this._dirty=!0,this},determinant:function(){return wt.determinant(this.array)},identity:function(){return wt.identity(this.array),this._dirty=!0,this},invert:function(){return wt.invert(this.array,this.array),this._dirty=!0,this},mul:function(t){return wt.mul(this.array,this.array,t.array),this._dirty=!0,this},mulLeft:function(t){return wt.mul(this.array,t.array,this.array),this._dirty=!0,this},multiply:function(t){return wt.multiply(this.array,this.array,t.array),this._dirty=!0,this},multiplyLeft:function(t){return wt.multiply(this.array,t.array,this.array),this._dirty=!0,this},rotate:function(t){return wt.rotate(this.array,this.array,t),this._dirty=!0,this},scale:function(t){return wt.scale(this.array,this.array,t.array),this._dirty=!0,this},transpose:function(){return wt.transpose(this.array,this.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},Jt.adjoint=function(t,e){return wt.adjoint(t.array,e.array),t._dirty=!0,t},Jt.copy=function(t,e){return wt.copy(t.array,e.array),t._dirty=!0,t},Jt.determinant=function(t){return wt.determinant(t.array)},Jt.identity=function(t){return wt.identity(t.array),t._dirty=!0,t},Jt.invert=function(t,e){return wt.invert(t.array,e.array),t._dirty=!0,t},Jt.multiply=Jt.mul=function(t,e,r){return wt.mul(t.array,e.array,r.array),t._dirty=!0,t},Jt.rotate=function(t,e,r){return wt.rotate(t.array,e.array,r),t._dirty=!0,t},Jt.scale=function(t,e,r){return wt.scale(t.array,e.array,r.array),t._dirty=!0,t},Jt.transpose=function(t,e){return wt.transpose(t.array,e.array),t._dirty=!0,t};let Wc=Jt;var vr={create:function(){var t=new Gt(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},clone:function(t){var e=new Gt(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},invert:function(t,e){var r=e[0],i=e[1],n=e[2],a=e[3],o=e[4],s=e[5],l=r*a-i*n;return l?(l=1/l,t[0]=a*l,t[1]=-i*l,t[2]=-n*l,t[3]=r*l,t[4]=(n*s-a*o)*l,t[5]=(i*o-r*s)*l,t):null},determinant:function(t){return t[0]*t[3]-t[1]*t[2]},multiply:function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=r[0],h=r[1],c=r[2],f=r[3],p=r[4],d=r[5];return t[0]=i*u+a*h,t[1]=n*u+o*h,t[2]=i*c+a*f,t[3]=n*c+o*f,t[4]=i*p+a*d+s,t[5]=n*p+o*d+l,t}};vr.mul=vr.multiply,vr.rotate=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=Math.sin(r),h=Math.cos(r);return t[0]=i*h+a*u,t[1]=n*h+o*u,t[2]=i*-u+a*h,t[3]=n*-u+o*h,t[4]=s,t[5]=l,t},vr.scale=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=r[0],h=r[1];return t[0]=i*u,t[1]=n*u,t[2]=a*h,t[3]=o*h,t[4]=s,t[5]=l,t},vr.translate=function(t,e,r){var i=e[0],n=e[1],a=e[2],o=e[3],s=e[4],l=e[5],u=r[0],h=r[1];return t[0]=i,t[1]=n,t[2]=a,t[3]=o,t[4]=i*u+a*h+s,t[5]=n*u+o*h+l,t},vr.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)};let Ct=vr;var ae=function(){this.array=Ct.create(),this._dirty=!0};ae.prototype={constructor:ae,setArray:function(t){for(var e=0;e<this.array.length;e++)this.array[e]=t[e];return this._dirty=!0,this},clone:function(){return new ae().copy(this)},copy:function(t){return Ct.copy(this.array,t.array),this._dirty=!0,this},determinant:function(){return Ct.determinant(this.array)},identity:function(){return Ct.identity(this.array),this._dirty=!0,this},invert:function(){return Ct.invert(this.array,this.array),this._dirty=!0,this},mul:function(t){return Ct.mul(this.array,this.array,t.array),this._dirty=!0,this},mulLeft:function(t){return Ct.mul(this.array,t.array,this.array),this._dirty=!0,this},multiply:function(t){return Ct.multiply(this.array,this.array,t.array),this._dirty=!0,this},multiplyLeft:function(t){return Ct.multiply(this.array,t.array,this.array),this._dirty=!0,this},rotate:function(t){return Ct.rotate(this.array,this.array,t),this._dirty=!0,this},scale:function(t){return Ct.scale(this.array,this.array,t.array),this._dirty=!0,this},translate:function(t){return Ct.translate(this.array,this.array,t.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},ae.copy=function(t,e){return Ct.copy(t.array,e.array),t._dirty=!0,t},ae.determinant=function(t){return Ct.determinant(t.array)},ae.identity=function(t){return Ct.identity(t.array),t._dirty=!0,t},ae.invert=function(t,e){return Ct.invert(t.array,e.array),t._dirty=!0,t},ae.multiply=ae.mul=function(t,e,r){return Ct.mul(t.array,e.array,r.array),t._dirty=!0,t},ae.rotate=function(t,e,r){return Ct.rotate(t.array,e.array,r),t._dirty=!0,t},ae.scale=function(t,e,r){return Ct.scale(t.array,e.array,r.array),t._dirty=!0,t},ae.translate=function(t,e,r){return Ct.translate(t.array,e.array,r.array),t._dirty=!0,t};let jc=ae;var Rt=function(){this.array=tt.create(),this._dirty=!0};Rt.prototype={constructor:Rt,setArray:function(t){for(var e=0;e<this.array.length;e++)this.array[e]=t[e];return this._dirty=!0,this},adjoint:function(){return tt.adjoint(this.array,this.array),this._dirty=!0,this},clone:function(){return new Rt().copy(this)},copy:function(t){return tt.copy(this.array,t.array),this._dirty=!0,this},determinant:function(){return tt.determinant(this.array)},fromMat2d:function(t){return tt.fromMat2d(this.array,t.array),this._dirty=!0,this},fromMat4:function(t){return tt.fromMat4(this.array,t.array),this._dirty=!0,this},fromQuat:function(t){return tt.fromQuat(this.array,t.array),this._dirty=!0,this},identity:function(){return tt.identity(this.array),this._dirty=!0,this},invert:function(){return tt.invert(this.array,this.array),this._dirty=!0,this},mul:function(t){return tt.mul(this.array,this.array,t.array),this._dirty=!0,this},mulLeft:function(t){return tt.mul(this.array,t.array,this.array),this._dirty=!0,this},multiply:function(t){return tt.multiply(this.array,this.array,t.array),this._dirty=!0,this},multiplyLeft:function(t){return tt.multiply(this.array,t.array,this.array),this._dirty=!0,this},rotate:function(t){return tt.rotate(this.array,this.array,t),this._dirty=!0,this},scale:function(t){return tt.scale(this.array,this.array,t.array),this._dirty=!0,this},translate:function(t){return tt.translate(this.array,this.array,t.array),this._dirty=!0,this},normalFromMat4:function(t){return tt.normalFromMat4(this.array,t.array),this._dirty=!0,this},transpose:function(){return tt.transpose(this.array,this.array),this._dirty=!0,this},toString:function(){return"["+Array.prototype.join.call(this.array,",")+"]"},toArray:function(){return Array.prototype.slice.call(this.array)}},Rt.adjoint=function(t,e){return tt.adjoint(t.array,e.array),t._dirty=!0,t},Rt.copy=function(t,e){return tt.copy(t.array,e.array),t._dirty=!0,t},Rt.determinant=function(t){return tt.determinant(t.array)},Rt.identity=function(t){return tt.identity(t.array),t._dirty=!0,t},Rt.invert=function(t,e){return tt.invert(t.array,e.array),t},Rt.multiply=Rt.mul=function(t,e,r){return tt.mul(t.array,e.array,r.array),t._dirty=!0,t},Rt.fromMat2d=function(t,e){return tt.fromMat2d(t.array,e.array),t._dirty=!0,t},Rt.fromMat4=function(t,e){return tt.fromMat4(t.array,e.array),t._dirty=!0,t},Rt.fromQuat=function(t,e){return tt.fromQuat(t.array,e.array),t._dirty=!0,t},Rt.normalFromMat4=function(t,e){return tt.normalFromMat4(t.array,e.array),t._dirty=!0,t},Rt.rotate=function(t,e,r){return tt.rotate(t.array,e.array,r),t._dirty=!0,t},Rt.scale=function(t,e,r){return tt.scale(t.array,e.array,r.array),t._dirty=!0,t},Rt.transpose=function(t,e){return tt.transpose(t.array,e.array),t._dirty=!0,t},Rt.translate=function(t,e,r){return tt.translate(t.array,e.array,r.array),t._dirty=!0,t};let Xc=Rt;var qn={linear:function(t){return t},quadraticIn:function(t){return t*t},quadraticOut:function(t){return t*(2-t)},quadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},cubicIn:function(t){return t*t*t},cubicOut:function(t){return--t*t*t+1},cubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},quarticIn:function(t){return t*t*t*t},quarticOut:function(t){return 1- --t*t*t*t},quarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},quinticIn:function(t){return t*t*t*t*t},quinticOut:function(t){return--t*t*t*t*t+1},quinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},sinusoidalIn:function(t){return 1-Math.cos(t*Math.PI/2)},sinusoidalOut:function(t){return Math.sin(t*Math.PI/2)},sinusoidalInOut:function(t){return .5*(1-Math.cos(Math.PI*t))},exponentialIn:function(t){return t===0?0:Math.pow(1024,t-1)},exponentialOut:function(t){return t===1?1:1-Math.pow(2,-10*t)},exponentialInOut:function(t){return t===0?0:t===1?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))},circularIn:function(t){return 1-Math.sqrt(1-t*t)},circularOut:function(t){return Math.sqrt(1- --t*t)},circularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},elasticIn:function(t){var e,r=.1;return t===0?0:t===1?1:(!r||r<1?(r=1,e=.1):e=.4*Math.asin(1/r)/(2*Math.PI),-r*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4))},elasticOut:function(t){var e,r=.1;return t===0?0:t===1?1:(!r||r<1?(r=1,e=.1):e=.4*Math.asin(1/r)/(2*Math.PI),r*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/.4)+1)},elasticInOut:function(t){var e,r=.1;return t===0?0:t===1?1:(!r||r<1?(r=1,e=.1):e=.4*Math.asin(1/r)/(2*Math.PI),(t*=2)<1?r*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*-.5:r*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*.5+1)},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},backInOut:function(t){var e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2)},bounceIn:function(t){return 1-qn.bounceOut(1-t)},bounceOut:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bounceInOut:function(t){return t<.5?.5*qn.bounceIn(2*t):.5*qn.bounceOut(2*t-1)+.5}};let qc=qn,Zc=(function(){function t(e){this._initialized=!1,this._startTime=0,this._pausedTime=0,this._paused=!1,this._life=e.life||1e3,this._delay=e.delay||0,this.loop=e.loop!=null&&e.loop,this.gap=e.gap||0,this.easing=e.easing||"linear",this.onframe=e.onframe,this.ondestroy=e.ondestroy,this.onrestart=e.onrestart}return t.prototype.step=function(e,r){if(this._initialized||(this._startTime=e+this._delay,this._initialized=!0),!this._paused){var i=(e-this._startTime-this._pausedTime)/this._life;i<0&&(i=0),i=Math.min(i,1);var n=this.easing,a=typeof n=="string"?qc[n]:n,o=typeof a=="function"?a(i):i;if(this.onframe&&this.onframe(o),i===1){if(!this.loop)return!0;this._restart(e),this.onrestart&&this.onrestart()}return!1}this._pausedTime+=r},t.prototype._restart=function(e){var r=(e-this._startTime-this._pausedTime)%this._life;this._startTime=e-r+this.gap,this._pausedTime=0},t.prototype.pause=function(){this._paused=!0},t.prototype.resume=function(){this._paused=!1},t})();var Nl={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function Ui(t){return(t=Math.round(t))<0?0:t>255?255:t}function Il(t){return t<0?0:t>1?1:t}function Co(t){var e=t;return e.length&&e.charAt(e.length-1)==="%"?Ui(parseFloat(e)/100*255):Ui(parseInt(e,10))}function Zn(t){var e=t;return e.length&&e.charAt(e.length-1)==="%"?Il(parseFloat(e)/100):Il(parseFloat(e))}function Do(t,e,r){return r<0?r+=1:r>1&&(r-=1),6*r<1?t+(e-t)*r*6:2*r<1?e:3*r<2?t+(e-t)*(.6666666666666666-r)*6:t}function ce(t,e,r,i,n){return t[0]=e,t[1]=r,t[2]=i,t[3]=n,t}function Lo(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}var Rl=new Tl(20),Yn=null;function ri(t,e){Yn&&Lo(Yn,e),Yn=Rl.put(t,Yn||e.slice())}function Fl(t,e){if(t){e=e||[];var r=Rl.get(t);if(r)return Lo(e,r);var i=(t+="").replace(/ /g,"").toLowerCase();if(i in Nl)return Lo(e,Nl[i]),ri(t,e),e;var n,a=i.length;if(i.charAt(0)==="#")return a===4||a===5?(n=parseInt(i.slice(1,4),16))>=0&&n<=4095?(ce(e,(3840&n)>>4|(3840&n)>>8,240&n|(240&n)>>4,15&n|(15&n)<<4,a===5?parseInt(i.slice(4),16)/15:1),ri(t,e),e):void ce(e,0,0,0,1):a===7||a===9?(n=parseInt(i.slice(1,7),16))>=0&&n<=16777215?(ce(e,(16711680&n)>>16,(65280&n)>>8,255&n,a===9?parseInt(i.slice(7),16)/255:1),ri(t,e),e):void ce(e,0,0,0,1):void 0;var o=i.indexOf("("),s=i.indexOf(")");if(o!==-1&&s+1===a){var l=i.substr(0,o),u=i.substr(o+1,s-(o+1)).split(","),h=1;switch(l){case"rgba":if(u.length!==4)return u.length===3?ce(e,+u[0],+u[1],+u[2],1):ce(e,0,0,0,1);h=Zn(u.pop());case"rgb":return u.length!==3?void ce(e,0,0,0,1):(ce(e,Co(u[0]),Co(u[1]),Co(u[2]),h),ri(t,e),e);case"hsla":return u.length!==4?void ce(e,0,0,0,1):(u[3]=Zn(u[3]),Bl(u,e),ri(t,e),e);case"hsl":return u.length!==3?void ce(e,0,0,0,1):(Bl(u,e),ri(t,e),e);default:return}}ce(e,0,0,0,1)}}function Bl(t,e){var r=(parseFloat(t[0])%360+360)%360/360,i=Zn(t[1]),n=Zn(t[2]),a=n<=.5?n*(i+1):n+i-n*i,o=2*n-a;return ce(e=e||[],Ui(255*Do(o,a,r+.3333333333333333)),Ui(255*Do(o,a,r)),Ui(255*Do(o,a,r-.3333333333333333)),1),t.length===4&&(e[3]=t[3]),e}var Yc=Object.prototype.toString,Kn=Array.prototype,Kc=Kn.forEach,Qc=Kn.filter,zl=Kn.slice,Jc=Kn.map,Gl=function(){}.constructor,Qn=Gl?Gl.prototype:null;function Ul(t,e){if(Object.assign)Object.assign(t,e);else for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t}function kl(t,e,r){if(t="prototype"in t?t.prototype:t,e="prototype"in e?e.prototype:e,Object.getOwnPropertyNames)for(var i=Object.getOwnPropertyNames(e),n=0;n<i.length;n++){var a=i[n];a!=="constructor"&&(r?e[a]!=null:t[a]==null)&&(t[a]=e[a])}else(function(o,s,l){for(var u=ni(s),h=0;h<u.length;h++){var c=u[h];(l?s[c]!=null:o[c]==null)&&(o[c]=s[c])}})(t,e,r)}function Jn(t){return!!t&&typeof t!="string"&&typeof t.length=="number"}function ii(t,e,r){if(t&&e)if(t.forEach&&t.forEach===Kc)t.forEach(e,r);else if(t.length===+t.length)for(var i=0,n=t.length;i<n;i++)e.call(r,t[i],i,t);else for(var a in t)t.hasOwnProperty(a)&&e.call(r,t[a],a,t)}function Po(t,e,r){if(!t)return[];if(!e)return Vl(t);if(t.map&&t.map===Jc)return t.map(e,r);for(var i=[],n=0,a=t.length;n<a;n++)i.push(e.call(r,t[n],n,t));return i}function ni(t){if(!t)return[];if(Object.keys)return Object.keys(t);var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e}function ki(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return function(){return t.apply(this,e.concat(zl.call(arguments)))}}function Vi(t,e){return t??e}function Vl(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return zl.apply(t,e)}Qn&&typeof Qn.bind=="function"&&Qn.call.bind(Qn.bind);var $c=(function(){function t(e){this.data={};var r,i=(r=e,Array.isArray?Array.isArray(r):Yc.call(r)==="[object Array]");this.data={};var n=this;function a(o,s){i?n.set(o,s):n.set(s,o)}e instanceof t?e.each(a):e&&ii(e,a)}return t.prototype.get=function(e){return this.data.hasOwnProperty(e)?this.data[e]:null},t.prototype.set=function(e,r){return this.data[e]=r},t.prototype.each=function(e,r){for(var i in this.data)this.data.hasOwnProperty(i)&&e.call(r,this.data[i],i)},t.prototype.keys=function(){return ni(this.data)},t.prototype.removeKey=function(e){delete this.data[e]},t})();function Hl(t,e){for(var r=new t.constructor(t.length+e.length),i=0;i<t.length;i++)r[i]=t[i];var n=t.length;for(i=0;i<e.length;i++)r[i+n]=e[i];return r}var Oo=Array.prototype.slice;function No(t,e,r){return(e-t)*r+t}function Wl(t,e,r,i){for(var n=e.length,a=0;a<n;a++)t[a]=No(e[a],r[a],i)}function $n(t,e,r,i){for(var n=e.length,a=0;a<n;a++)t[a]=e[a]+r[a]*i;return t}function jl(t,e,r,i){for(var n=e.length,a=n&&e[0].length,o=0;o<n;o++){t[o]||(t[o]=[]);for(var s=0;s<a;s++)t[o][s]=e[o][s]+r[o][s]*i}return t}function td(t,e,r){var i=t,n=e;if(i.push&&n.push){var a=i.length,o=n.length;if(a!==o)if(a>o)i.length=o;else for(var s=a;s<o;s++)i.push(r===1?n[s]:Oo.call(n[s]));var l=i[0]&&i[0].length;for(s=0;s<i.length;s++)if(r===1)isNaN(i[s])&&(i[s]=n[s]);else for(var u=0;u<l;u++)isNaN(i[s][u])&&(i[s][u]=n[s][u])}}function Xl(t,e){var r=t.length;if(r!==e.length)return!1;for(var i=0;i<r;i++)if(t[i]!==e[i])return!1;return!0}function Io(t,e,r,i,n,a,o){var s=.5*(r-t),l=.5*(i-e);return(2*(e-r)+s+l)*o+(-3*(e-r)-2*s-l)*a+s*n+e}function ql(t,e,r,i,n,a,o,s){for(var l=e.length,u=0;u<l;u++)t[u]=Io(e[u],r[u],i[u],n[u],a,o,s)}function Ro(t){if(Jn(t)){var e=t.length;if(Jn(t[0])){for(var r=[],i=0;i<e;i++)r.push(Oo.call(t[i]));return r}return Oo.call(t)}return t}function Hi(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")"}var Wi=[0,0,0,0],ed=(function(){function t(e){this.keyframes=[],this.maxTime=0,this.arrDim=0,this.interpolable=!0,this._needsSort=!1,this._isAllValueEqual=!0,this._lastFrame=0,this._lastFramePercent=0,this.propName=e}return t.prototype.isFinished=function(){return this._finished},t.prototype.setFinished=function(){this._finished=!0,this._additiveTrack&&this._additiveTrack.setFinished()},t.prototype.needsAnimate=function(){return!this._isAllValueEqual&&this.keyframes.length>=2&&this.interpolable},t.prototype.getAdditiveTrack=function(){return this._additiveTrack},t.prototype.addKeyframe=function(e,r){e>=this.maxTime?this.maxTime=e:this._needsSort=!0;var i=this.keyframes,n=i.length;if(this.interpolable)if(Jn(r)){var a=(function(u){return Jn(u&&u[0])?2:1})(r);if(n>0&&this.arrDim!==a)return void(this.interpolable=!1);if(a===1&&typeof r[0]!="number"||a===2&&typeof r[0][0]!="number")return void(this.interpolable=!1);if(n>0){var o=i[n-1];this._isAllValueEqual&&(a===1&&Xl(r,o.value)||(this._isAllValueEqual=!1))}this.arrDim=a}else{if(this.arrDim>0)return void(this.interpolable=!1);if(typeof r=="string"){var s=Fl(r);s?(r=s,this.isValueColor=!0):this.interpolable=!1}else if(typeof r!="number"||isNaN(r))return void(this.interpolable=!1);this._isAllValueEqual&&n>0&&(o=i[n-1],(this.isValueColor&&!Xl(o.value,r)||o.value!==r)&&(this._isAllValueEqual=!1))}var l={time:e,value:r,percent:0};return this.keyframes.push(l),l},t.prototype.prepare=function(e){var r=this.keyframes;this._needsSort&&r.sort((function(l,u){return l.time-u.time}));for(var i=this.arrDim,n=r.length,a=r[n-1],o=0;o<n;o++)r[o].percent=r[o].time/this.maxTime,i>0&&o!==n-1&&td(r[o].value,a.value,i);if(e&&this.needsAnimate()&&e.needsAnimate()&&i===e.arrDim&&this.isValueColor===e.isValueColor&&!e._finished){this._additiveTrack=e;var s=r[0].value;for(o=0;o<n;o++)i===0?this.isValueColor?r[o].additiveValue=$n([],r[o].value,s,-1):r[o].additiveValue=r[o].value-s:i===1?r[o].additiveValue=$n([],r[o].value,s,-1):i===2&&(r[o].additiveValue=jl([],r[o].value,s,-1))}},t.prototype.step=function(e,r){if(!this._finished){this._additiveTrack&&this._additiveTrack._finished&&(this._additiveTrack=null);var i,n=this._additiveTrack!=null,a=n?"additiveValue":"value",o=this.keyframes,s=this.keyframes.length,l=this.propName,u=this.arrDim,h=this.isValueColor;if(r<0)i=0;else if(r<this._lastFramePercent){for(i=Math.min(this._lastFrame+1,s-1);i>=0&&!(o[i].percent<=r);i--);i=Math.min(i,s-2)}else{for(i=this._lastFrame;i<s&&!(o[i].percent>r);i++);i=Math.min(i-1,s-2)}var c=o[i+1],f=o[i];if(f&&c){this._lastFrame=i,this._lastFramePercent=r;var p=c.percent-f.percent;if(p!==0){var d=(r-f.percent)/p,m=n?this._additiveValue:h?Wi:e[l];if((u>0||h)&&!m&&(m=this._additiveValue=[]),this.useSpline){var g=o[i][a],_=o[i===0?i:i-1][a],y=o[i>s-2?s-1:i+1][a],x=o[i>s-3?s-1:i+2][a];if(u>0)u===1?ql(m,_,g,y,x,d,d*d,d*d*d):(function(w,b,S,A,D,P,L,O){for(var N=b.length,C=b[0].length,B=0;B<N;B++){w[B]||(w[1]=[]);for(var I=0;I<C;I++)w[B][I]=Io(b[B][I],S[B][I],A[B][I],D[B][I],P,L,O)}})(m,_,g,y,x,d,d*d,d*d*d);else if(h)ql(m,_,g,y,x,d,d*d,d*d*d),n||(e[l]=Hi(m));else{var v=void 0;v=this.interpolable?Io(_,g,y,x,d,d*d,d*d*d):y,n?this._additiveValue=v:e[l]=v}}else u>0?u===1?Wl(m,f[a],c[a],d):(function(w,b,S,A){for(var D=b.length,P=D&&b[0].length,L=0;L<D;L++){w[L]||(w[L]=[]);for(var O=0;O<P;O++)w[L][O]=No(b[L][O],S[L][O],A)}})(m,f[a],c[a],d):h?(Wl(m,f[a],c[a],d),n||(e[l]=Hi(m))):(v=void 0,v=this.interpolable?No(f[a],c[a],d):(function(w,b,S){return S>.5?b:w})(f[a],c[a],d),n?this._additiveValue=v:e[l]=v);n&&this._addToTarget(e)}}}},t.prototype._addToTarget=function(e){var r=this.arrDim,i=this.propName,n=this._additiveValue;r===0?this.isValueColor?(Fl(e[i],Wi),$n(Wi,Wi,n,1),e[i]=Hi(Wi)):e[i]=e[i]+n:r===1?$n(e[i],e[i],n,1):r===2&&jl(e[i],e[i],n,1)},t})();let rd=(function(){function t(e,r,i){this._tracks={},this._trackKeys=[],this._delay=0,this._maxTime=0,this._paused=!1,this._started=0,this._clip=null,this._target=e,this._loop=r,r&&i?(function(){for(var n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];typeof console<"u"&&console.error.apply(console,n)})("Can' use additive animation on looped animation."):this._additiveAnimators=i}return t.prototype.getTarget=function(){return this._target},t.prototype.changeTarget=function(e){this._target=e},t.prototype.when=function(e,r){return this.whenWithKeys(e,r,ni(r))},t.prototype.whenWithKeys=function(e,r,i){for(var n=this._tracks,a=0;a<i.length;a++){var o=i[a],s=n[o];if(!s){s=n[o]=new ed(o);var l=void 0,u=this._getAdditiveTrack(o);if(u){var h=u.keyframes[u.keyframes.length-1];l=h&&h.value,u.isValueColor&&l&&(l=Hi(l))}else l=this._target[o];if(l==null)continue;e!==0&&s.addKeyframe(0,Ro(l)),this._trackKeys.push(o)}s.addKeyframe(e,Ro(r[o]))}return this._maxTime=Math.max(this._maxTime,e),this},t.prototype.pause=function(){this._clip.pause(),this._paused=!0},t.prototype.resume=function(){this._clip.resume(),this._paused=!1},t.prototype.isPaused=function(){return!!this._paused},t.prototype._doneCallback=function(){this._setTracksFinished(),this._clip=null;var e=this._doneList;if(e)for(var r=e.length,i=0;i<r;i++)e[i].call(this)},t.prototype._abortedCallback=function(){this._setTracksFinished();var e=this.animation,r=this._abortedList;if(e&&e.removeClip(this._clip),this._clip=null,r)for(var i=0;i<r.length;i++)r[i].call(this)},t.prototype._setTracksFinished=function(){for(var e=this._tracks,r=this._trackKeys,i=0;i<r.length;i++)e[r[i]].setFinished()},t.prototype._getAdditiveTrack=function(e){var r,i=this._additiveAnimators;if(i)for(var n=0;n<i.length;n++){var a=i[n].getTrack(e);a&&(r=a)}return r},t.prototype.start=function(e,r){if(!(this._started>0)){this._started=1;for(var i=this,n=[],a=0;a<this._trackKeys.length;a++){var o=this._trackKeys[a],s=this._tracks[o],l=this._getAdditiveTrack(o),u=s.keyframes;if(s.prepare(l),s.needsAnimate())n.push(s);else if(!s.interpolable){var h=u[u.length-1];h&&(i._target[s.propName]=h.value)}}if(n.length||r){var c=new Zc({life:this._maxTime,loop:this._loop,delay:this._delay,onframe:function(f){i._started=2;var p=i._additiveAnimators;if(p){for(var d=!1,m=0;m<p.length;m++)if(p[m]._clip){d=!0;break}d||(i._additiveAnimators=null)}for(m=0;m<n.length;m++)n[m].step(i._target,f);var g=i._onframeList;if(g)for(m=0;m<g.length;m++)g[m](i._target,f)},ondestroy:function(){i._doneCallback()}});this._clip=c,this.animation&&this.animation.addClip(c),e&&e!=="spline"&&(c.easing=e)}else this._doneCallback();return this}},t.prototype.stop=function(e){if(this._clip){var r=this._clip;e&&r.onframe(1),this._abortedCallback()}},t.prototype.delay=function(e){return this._delay=e,this},t.prototype.during=function(e){return e&&(this._onframeList||(this._onframeList=[]),this._onframeList.push(e)),this},t.prototype.done=function(e){return e&&(this._doneList||(this._doneList=[]),this._doneList.push(e)),this},t.prototype.aborted=function(e){return e&&(this._abortedList||(this._abortedList=[]),this._abortedList.push(e)),this},t.prototype.getClip=function(){return this._clip},t.prototype.getTrack=function(e){return this._tracks[e]},t.prototype.stopTracks=function(e,r){if(!e.length||!this._clip)return!0;for(var i=this._tracks,n=this._trackKeys,a=0;a<e.length;a++){var o=i[e[a]];o&&(r?o.step(this._target,1):this._started===1&&o.step(this._target,0),o.setFinished())}var s=!0;for(a=0;a<n.length;a++)if(!i[n[a]].isFinished()){s=!1;break}return s&&this._abortedCallback(),s},t.prototype.saveFinalToTarget=function(e,r){if(e){r=r||this._trackKeys;for(var i=0;i<r.length;i++){var n=r[i],a=this._tracks[n];if(a&&!a.isFinished()){var o=a.keyframes,s=o[o.length-1];if(s){var l=Ro(s.value);a.isValueColor&&(l=Hi(l)),e[n]=l}}}}},t.prototype.__changeFinalValue=function(e,r){r=r||ni(e);for(var i=0;i<r.length;i++){var n=r[i],a=this._tracks[n];if(a){var o=a.keyframes;if(o.length>1){var s=o.pop();a.addKeyframe(s.time,e[n]),a.prepare(a.getAdditiveTrack())}}}},t})(),id={_animators:null,getAnimators:function(){return this._animators=this._animators||[],this._animators},animate:function(t,e){var r;if(this._animators=this._animators||[],t){for(var i=t.split("."),n=this,a=0,o=i.length;a<o;a++)n&&(n=n[i[a]]);n&&(r=n)}else r=this;if(r==null)throw new Error("Target "+t+" not exists");var s=this._animators,l=new rd(r,e),u=this;return l.during((function(){u.__zr&&u.__zr.refresh()})).done((function(){var h=s.indexOf(l);h>=0&&s.splice(h,1)})),s.push(l),this.__zr&&this.__zr.animation.addAnimator(l),l},stopAnimation:function(t){this._animators=this._animators||[];for(var e=this._animators,r=e.length,i=0;i<r;i++)e[i].stop(t);return e.length=0,this},addAnimatorsToZr:function(t){if(this._animators)for(var e=0;e<this._animators.length;e++)t.animation.addAnimator(this._animators[e])},removeAnimatorsFromZr:function(t){if(this._animators)for(var e=0;e<this._animators.length;e++)t.animation.removeAnimator(this._animators[e])}},Zl=`
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
@end`;function Yl(t){return t instanceof HTMLCanvasElement||t instanceof HTMLImageElement||t instanceof Image}Object.assign(Oe.prototype,id),z.import(Zl),z.import(ol),z.import(`
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
`),z.import(`@export ecgl.color.vertex

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
@end`),z.import(`/**
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

@end`),z.import(`@export ecgl.realistic.vertex

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

@end`),z.import(`@export ecgl.hatching.vertex

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
`),z.import(`@export ecgl.sm.depth.vertex

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

@end`);var nd=Ye.prototype.addToScene,ad=Ye.prototype.removeFromScene;Ye.prototype.addToScene=function(t){if(nd.call(this,t),this.__zr){var e=this.__zr;t.traverse((function(r){r.__zr=e,r.addAnimatorsToZr&&r.addAnimatorsToZr(e)}))}},Ye.prototype.removeFromScene=function(t){ad.call(this,t),t.traverse((function(e){var r=e.__zr;e.__zr=null,r&&e.removeAnimatorsFromZr&&e.removeAnimatorsFromZr(r)}))},he.prototype.setTextureImage=function(t,e,r,i){if(this.shader){var n,a=r.getZr(),o=this;return o.autoUpdateTextureStatus=!1,o.disableTexture(t),!(s=e)||s==="none"||(n=j.loadTexture(e,r,i,(function(l){o.enableTexture(t),a&&a.refresh()})),o.set(t,n)),n}var s};var j={};j.Renderer=Di,j.Node=Oe,j.Mesh=lr,j.Shader=z,j.Material=he,j.Texture=H,j.Texture2D=K,j.Geometry=nt,j.SphereGeometry=zc,j.PlaneGeometry=Un,j.CubeGeometry=Al,j.AmbientLight=Gc,j.DirectionalLight=Uc,j.PointLight=kc,j.SpotLight=Vc,j.PerspectiveCamera=It,j.OrthographicCamera=ei,j.Vector2=ne,j.Vector3=F,j.Vector4=Hc,j.Quaternion=Gs,j.Matrix2=Wc,j.Matrix2d=jc,j.Matrix3=Xc,j.Matrix4=k,j.Plane=_l,j.Ray=Fn,j.BoundingBox=Xt,j.Frustum=_o;var Fo=null;function Kl(t){return Math.pow(2,Math.round(Math.log(t)/Math.LN2))}function Ql(t){if((t.wrapS===H.REPEAT||t.wrapT===H.REPEAT)&&t.image){var e=Kl(t.width),r=Kl(t.height);if(e!==t.width||r!==t.height){var i=document.createElement("canvas");i.width=e,i.height=r,i.getContext("2d").drawImage(t.image,0,0,e,r),t.image=i}}}j.loadTexture=function(t,e,r,i){typeof r=="function"&&(i=r,r={}),r=r||{};for(var n=Object.keys(r).sort(),a="",o=0;o<n.length;o++)a+=n[o]+"_"+r[n[o]]+"_";var s,l=e.__textureCache=e.__textureCache||new Tl(20);if((s=t).getZr&&s.setOption){var u=t.__textureid__;if(c=l.get(a+u))c.texture.surface.setECharts(t),i&&i(c.texture);else{var h=new Lc(t);for(h.onupdate=function(){e.getZr().refresh()},c={texture:h.getTexture()},o=0;o<n.length;o++)c.texture[n[o]]=r[n[o]];u=t.__textureid__||"__ecgl_ec__"+c.texture.__uid__,t.__textureid__=u,l.put(a+u,c),i&&i(c.texture)}return c.texture}if(Yl(t)){var c;if(u=t.__textureid__,!(c=l.get(a+u))){for(c={texture:new j.Texture2D({image:t})},o=0;o<n.length;o++)c.texture[n[o]]=r[n[o]];u=t.__textureid__||"__ecgl_image__"+c.texture.__uid__,t.__textureid__=u,l.put(a+u,c),Ql(c.texture),i&&i(c.texture)}return c.texture}if(c=l.get(a+t))c.callbacks?c.callbacks.push(i):i&&i(c.texture);else if(t.match(/.hdr$|^data:application\/octet-stream/)){c={callbacks:[i]};var f=pr.loadTexture(t,{exposure:r.exposure,fileType:"hdr"},(function(){f.dirty(),c.callbacks.forEach((function(d){d&&d(f)})),c.callbacks=null}));c.texture=f,l.put(a+t,c)}else{for(f=new j.Texture2D({image:new Image}),o=0;o<n.length;o++)f[n[o]]=r[n[o]];c={texture:f,callbacks:[i]};var p=f.image;p.onload=function(){f.image=p,Ql(f),f.dirty(),c.callbacks.forEach((function(d){d&&d(f)})),c.callbacks=null},p.crossOrigin="Anonymous",p.src=t,f.image=Fo!==null?Fo:Fo=pr.createBlank("rgba(255,255,255,0)").image,l.put(a+t,c)}return c.texture},j.createAmbientCubemap=function(t,e,r,i){var n=(t=t||{}).texture,a=J(t.exposure,1),o=new Nc({intensity:J(t.specularIntensity,1)}),s=new Ic({intensity:J(t.diffuseIntensity,1),coefficients:[.844,.712,.691,-.037,.083,.167,.343,.288,.299,-.041,-.021,-.009,-.003,-.041,-.064,-.011,-.007,-.004,-.031,.034,.081,-.06,-.049,-.06,.046,.056,.05]});return o.cubemap=j.loadTexture(n,r,{exposure:a},(function(){o.cubemap.flipY=!1,o.prefilter(e,32),s.coefficients=Bc.projectEnvironmentMap(e,o.cubemap,{lod:1}),i&&i()})),{specular:o,diffuse:s}},j.createBlankTexture=pr.createBlank,j.isImage=Yl,j.additiveBlend=function(t){t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE)},j.parseColor=function(t,e){return t instanceof Array?(e||(e=[]),e[0]=t[0],e[1]=t[1],e[2]=t[2],t.length>3?e[3]=t[3]:e[3]=1,e):((e=M.color.parse(t||"#000",e)||[0,0,0,0])[0]/=255,e[1]/=255,e[2]/=255,e)},j.directionFromAlphaBeta=function(t,e){var r=t/180*Math.PI+Math.PI/2,i=-e/180*Math.PI+Math.PI/2,n=[],a=Math.sin(r);return n[0]=a*Math.cos(i),n[1]=-Math.cos(r),n[2]=a*Math.sin(i),n},j.getShadowResolution=function(t){var e=1024;switch(t){case"low":e=512;break;case"medium":break;case"high":e=2048;break;case"ultra":e=4096}return e},j.COMMON_SHADERS=["lambert","color","realistic","hatching","shadow"],j.createShader=function(t){t==="ecgl.shadow"&&(t="ecgl.displayShadow");var e=z.source(t+".vertex"),r=z.source(t+".fragment");e||console.error("Vertex shader of '%s' not exits",t),r||console.error("Fragment shader of '%s' not exits",t);var i=new z(e,r);return i.name=t,i},j.createMaterial=function(t,e){e instanceof Array||(e=[e]);var r=j.createShader(t),i=new he({shader:r});return e.forEach((function(n){typeof n=="string"&&i.define(n)})),i},j.setMaterialFromModel=function(t,e,r,i){e.autoUpdateTextureStatus=!1;var n=r.getModel(t+"Material"),a=n.get("detailTexture"),o=J(n.get("textureTiling"),1),s=J(n.get("textureOffset"),0);typeof o=="number"&&(o=[o,o]),typeof s=="number"&&(s=[s,s]);var l=o[0]>1||o[1]>1?j.Texture.REPEAT:j.Texture.CLAMP_TO_EDGE,u={anisotropic:8,wrapS:l,wrapT:l};if(t==="realistic"){var h=n.get("roughness"),c=n.get("metalness");c!=null?isNaN(c)&&(e.setTextureImage("metalnessMap",c,i,u),c=J(n.get("metalnessAdjust"),.5)):c=0,h!=null?isNaN(h)&&(e.setTextureImage("roughnessMap",h,i,u),h=J(n.get("roughnessAdjust"),.5)):h=.5;var f=n.get("normalTexture");e.setTextureImage("detailMap",a,i,u),e.setTextureImage("normalMap",f,i,u),e.set({roughness:h,metalness:c,detailUvRepeat:o,detailUvOffset:s})}else if(t==="lambert")e.setTextureImage("detailMap",a,i,u),e.set({detailUvRepeat:o,detailUvOffset:s});else if(t==="color")e.setTextureImage("detailMap",a,i,u),e.set({detailUvRepeat:o,detailUvOffset:s});else if(t==="hatching"){var p=n.get("hatchingTextures")||[];p.length;for(var d=0;d<6;d++)e.setTextureImage("hatch"+(d+1),p[d],i,{anisotropic:8,wrapS:j.Texture.REPEAT,wrapT:j.Texture.REPEAT});e.set({detailUvRepeat:o,detailUvOffset:s})}},j.updateVertexAnimation=function(t,e,r,i){var n=i.get("animation"),a=i.get("animationDurationUpdate"),o=i.get("animationEasingUpdate"),s=r.shadowDepthMaterial;if(n&&e&&a>0&&e.geometry.vertexCount===r.geometry.vertexCount){r.material.define("vertex","VERTEX_ANIMATION"),r.ignorePreZ=!0,s&&s.define("vertex","VERTEX_ANIMATION");for(var l=0;l<t.length;l++)r.geometry.attributes[t[l][0]].value=e.geometry.attributes[t[l][1]].value;r.geometry.dirty(),r.__percent=0,r.material.set("percent",0),r.stopAnimation(),r.animate().when(a,{__percent:1}).during((function(){r.material.set("percent",r.__percent),s&&s.set("percent",r.__percent)})).done((function(){r.ignorePreZ=!1,r.material.undefine("vertex","VERTEX_ANIMATION"),s&&s.undefine("vertex","VERTEX_ANIMATION")})).start(o)}else r.material.undefine("vertex","VERTEX_ANIMATION"),s&&s.undefine("vertex","VERTEX_ANIMATION")};let T=j;var ta,ea,ra,yr,Bo,zo=jt.extend({scene:null,camera:null,renderer:null},(function(){this._ray=new Fn,this._ndc=new ne}),{pick:function(t,e,r){return this.pickAll(t,e,[],r)[0]||null},pickAll:function(t,e,r,i){return this.renderer.screenToNDC(t,e,this._ndc),this.camera.castRay(this._ndc,this._ray),r=r||[],this._intersectNode(this.scene,r,i||!1),r.sort(this._intersectionCompareFunc),r},_intersectNode:function(t,e,r){t instanceof to&&t.isRenderable()&&(t.ignorePicking&&!r||!(t.mode===4&&t.geometry.isUseIndices()||t.geometry.pickByRay||t.geometry.pick)||this._intersectRenderable(t,e));for(var i=0;i<t._children.length;i++)this._intersectNode(t._children[i],e,r)},_intersectRenderable:(ta=new F,ea=new F,ra=new F,yr=new Fn,Bo=new k,function(t,e){var r=t.isSkinnedMesh();yr.copy(this._ray),k.invert(Bo,t.worldTransform),r||yr.applyTransform(Bo);var i=t.geometry,n=r?t.skeleton.boundingBox:i.boundingBox;if(!n||yr.intersectBoundingBox(n))if(i.pick)i.pick(this._ndc.x,this._ndc.y,this.renderer,this.camera,t,e);else if(i.pickByRay)i.pickByRay(yr,t,e);else{var a,o,s=t.cullFace===En&&t.frontFace===Cn||t.cullFace===ja&&t.frontFace===Xa,l=i.indices,u=i.attributes.position,h=i.attributes.weight,c=i.attributes.joint,f=[];if(u&&u.value&&l){if(r){o=t.skeleton.getSubSkinMatrices(t.__uid__,t.joints);for(var p=0;p<t.joints.length;p++){f[p]=f[p]||[];for(var d=0;d<16;d++)f[p][d]=o[16*p+d]}var m=[],g=[],_=[],y=[],x=[],v=i.attributes.skinnedPosition;for(v&&v.value||(i.createAttribute("skinnedPosition","f",3),(v=i.attributes.skinnedPosition).init(i.vertexCount)),p=0;p<i.vertexCount;p++){for(u.get(p,m),h.get(p,g),c.get(p,_),g[3]=1-g[0]-g[1]-g[2],E.set(y,0,0,0),d=0;d<4;d++)_[d]>=0&&g[d]>1e-4&&(E.transformMat4(x,m,f[_[d]]),E.scaleAndAdd(y,y,x,g[d]));v.set(p,y)}}for(p=0;p<l.length;p+=3){var w=l[p],b=l[p+1],S=l[p+2],A=r?i.attributes.skinnedPosition:u;if(A.get(w,ta.array),A.get(b,ea.array),A.get(S,ra.array),a=s?yr.intersectTriangle(ta,ea,ra,t.culling):yr.intersectTriangle(ta,ra,ea,t.culling)){var D=new F;r?F.copy(D,a):F.transformMat4(D,a,t.worldTransform),e.push(new zo.Intersection(a,D,t,[w,b,S],p/3,F.dist(D,this._ray.origin)))}}}}}),_intersectionCompareFunc:function(t,e){return t.distance-e.distance}});zo.Intersection=function(t,e,r,i,n,a){this.point=t,this.pointWorld=e,this.target=r,this.triangle=i,this.triangleIndex=n,this.distance=a};let od=zo,Go=typeof window<"u"&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){return setTimeout(t,16)};var ft=function(t,e){this.id=t,this.zr=e;try{this.renderer=new Di({clearBit:0,devicePixelRatio:e.painter.dpr,preserveDrawingBuffer:!0,premultipliedAlpha:!0}),this.renderer.resize(e.painter.getWidth(),e.painter.getHeight())}catch(i){return this.renderer=null,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute; left: 0; top: 0; right: 0; bottom: 0;",this.dom.className="ecgl-nowebgl",this.dom.innerHTML="Sorry, your browser does not support WebGL",void console.error(i)}this.onglobalout=this.onglobalout.bind(this),e.on("globalout",this.onglobalout),this.dom=this.renderer.canvas;var r=this.dom.style;r.position="absolute",r.left="0",r.top="0",this.views=[],this._picking=new od({renderer:this.renderer}),this._viewsToDispose=[],this._accumulatingId=0,this._zrEventProxy=new M.graphic.Rect({shape:{x:-1,y:-1,width:2,height:2},__isGLToZRProxy:!0}),this._backgroundColor=null,this._disposed=!1};function Jl(t){var e=t.__zr;t.__zr=null,e&&t.removeAnimatorsFromZr&&t.removeAnimatorsFromZr(e)}ft.prototype.setUnpainted=function(){},ft.prototype.addView=function(t){if(t.layer!==this){var e=this._viewsToDispose.indexOf(t);e>=0&&this._viewsToDispose.splice(e,1),this.views.push(t),t.layer=this;var r=this.zr;t.scene.traverse((function(i){i.__zr=r,i.addAnimatorsToZr&&i.addAnimatorsToZr(r)}))}},ft.prototype.removeView=function(t){if(t.layer===this){var e=this.views.indexOf(t);e>=0&&(this.views.splice(e,1),t.scene.traverse(Jl,this),t.layer=null,this._viewsToDispose.push(t))}},ft.prototype.removeViewsAll=function(){this.views.forEach((function(t){t.scene.traverse(Jl,this),t.layer=null,this._viewsToDispose.push(t)}),this),this.views.length=0},ft.prototype.resize=function(t,e){this.renderer.resize(t,e)},ft.prototype.clear=function(){var t=this.renderer.gl,e=this._backgroundColor||[0,0,0,0];t.clearColor(e[0],e[1],e[2],e[3]),t.depthMask(!0),t.colorMask(!0,!0,!0,!0),t.clear(t.DEPTH_BUFFER_BIT|t.COLOR_BUFFER_BIT)},ft.prototype.clearDepth=function(){var t=this.renderer.gl;t.clear(t.DEPTH_BUFFER_BIT)},ft.prototype.clearColor=function(){var t=this.renderer.gl;t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)},ft.prototype.needsRefresh=function(){this.zr.refresh()},ft.prototype.refresh=function(t){this._backgroundColor=t?T.parseColor(t):[0,0,0,0],this.renderer.clearColor=this._backgroundColor;for(var e=0;e<this.views.length;e++)this.views[e].prepareRender(this.renderer);for(this._doRender(!1),this._trackAndClean(),e=0;e<this._viewsToDispose.length;e++)this._viewsToDispose[e].dispose(this.renderer);this._viewsToDispose.length=0,this._startAccumulating()},ft.prototype.renderToCanvas=function(t){this._startAccumulating(!0),t.drawImage(this.dom,0,0,t.canvas.width,t.canvas.height)},ft.prototype._doRender=function(t){this.clear(),this.renderer.saveViewport();for(var e=0;e<this.views.length;e++)this.views[e].render(this.renderer,t);this.renderer.restoreViewport()},ft.prototype._stopAccumulating=function(){this._accumulatingId=0,clearTimeout(this._accumulatingTimeout)};var sd=1;function ia(t){for(var e=0;e<t.length;e++)t[e].__used__=0}function na(t,e){for(var r=0;r<e.length;r++)e[r].__used__||e[r].dispose(t)}function aa(t,e){t.__used__=t.__used__||0,t.__used__++,t.__used__===1&&e.push(t)}function ld(t,e,r){var i,n;t.traverse((function(o){if(o.isRenderable()){var s=o.geometry,l=o.material;if(l!==i)for(var u=l.getTextureUniforms(),h=0;h<u.length;h++){var c=u[h],f=l.uniforms[c].value;if(f){if(f instanceof H)aa(f,e);else if(f instanceof Array)for(var p=0;p<f.length;p++)f[p]instanceof H&&aa(f[p],e)}}s!==n&&aa(s,r),i=l,n=s}}));for(var a=0;a<t.lights.length;a++)t.lights[a].cubemap&&aa(t.lights[a].cubemap,e)}ft.prototype._startAccumulating=function(t){var e=this;this._stopAccumulating();for(var r=!1,i=0;i<this.views.length;i++)r=this.views[i].needsAccumulate()||r;function n(a){if(e._accumulatingId&&a===e._accumulatingId){for(var o=!0,s=0;s<e.views.length;s++)o=e.views[s].isAccumulateFinished()&&r;o||(e._doRender(!0),t?n(a):Go((function(){n(a)})))}}r&&(this._accumulatingId=sd++,t?n(e._accumulatingId):this._accumulatingTimeout=setTimeout((function(){n(e._accumulatingId)}),50))},ft.prototype._trackAndClean=function(){var t=[],e=[];this._textureList&&(ia(this._textureList),ia(this._geometriesList));for(var r=0;r<this.views.length;r++)ld(this.views[r].scene,t,e);this._textureList&&(na(this.renderer,this._textureList),na(this.renderer,this._geometriesList)),this._textureList=t,this._geometriesList=e},ft.prototype.dispose=function(){this._disposed||(this._stopAccumulating(),this._textureList&&(ia(this._textureList),ia(this._geometriesList),na(this.renderer,this._textureList),na(this.renderer,this._geometriesList)),this.zr.off("globalout",this.onglobalout),this._disposed=!0)},ft.prototype.onmousedown=function(t){if(!t.target||!t.target.__isGLToZRProxy){t=t.event;var e=this.pickObject(t.offsetX,t.offsetY);e&&(this._dispatchEvent("mousedown",t,e),this._dispatchDataEvent("mousedown",t,e)),this._downX=t.offsetX,this._downY=t.offsetY}},ft.prototype.onmousemove=function(t){if(!t.target||!t.target.__isGLToZRProxy){t=t.event;var e=this.pickObject(t.offsetX,t.offsetY),r=e&&e.target,i=this._hovered;this._hovered=e,i&&r!==i.target&&(i.relatedTarget=r,this._dispatchEvent("mouseout",t,i),this.zr.setCursorStyle("default")),this._dispatchEvent("mousemove",t,e),e&&(this.zr.setCursorStyle("pointer"),i&&r===i.target||this._dispatchEvent("mouseover",t,e)),this._dispatchDataEvent("mousemove",t,e)}},ft.prototype.onmouseup=function(t){if(!t.target||!t.target.__isGLToZRProxy){t=t.event;var e=this.pickObject(t.offsetX,t.offsetY);e&&(this._dispatchEvent("mouseup",t,e),this._dispatchDataEvent("mouseup",t,e)),this._upX=t.offsetX,this._upY=t.offsetY}},ft.prototype.onclick=ft.prototype.dblclick=function(t){if(!t.target||!t.target.__isGLToZRProxy){var e=this._upX-this._downX,r=this._upY-this._downY;if(!(Math.sqrt(e*e+r*r)>20)){t=t.event;var i=this.pickObject(t.offsetX,t.offsetY);i&&(this._dispatchEvent(t.type,t,i),this._dispatchDataEvent(t.type,t,i));var n=this._clickToSetFocusPoint(t);n&&n.view.setDOFFocusOnPoint(n.distance)&&this.zr.refresh()}}},ft.prototype._clickToSetFocusPoint=function(t){for(var e=this.renderer,r=e.viewport,i=this.views.length-1;i>=0;i--){var n=this.views[i];if(n.hasDOF()&&n.containPoint(t.offsetX,t.offsetY)){this._picking.scene=n.scene,this._picking.camera=n.camera,e.viewport=n.viewport;var a=this._picking.pick(t.offsetX,t.offsetY,!0);if(a)return a.view=n,a}}e.viewport=r},ft.prototype.onglobalout=function(t){var e=this._hovered;e&&this._dispatchEvent("mouseout",t,{target:e.target})},ft.prototype.pickObject=function(t,e){for(var r=[],i=this.renderer,n=i.viewport,a=0;a<this.views.length;a++){var o=this.views[a];o.containPoint(t,e)&&(this._picking.scene=o.scene,this._picking.camera=o.camera,i.viewport=o.viewport,this._picking.pickAll(t,e,r))}return i.viewport=n,r.sort((function(s,l){return s.distance-l.distance})),r[0]},ft.prototype._dispatchEvent=function(t,e,r){r||(r={});var i=r.target;for(r.cancelBubble=!1,r.event=e,r.type=t,r.offsetX=e.offsetX,r.offsetY=e.offsetY;i&&(i.trigger(t,r),i=i.getParent(),!r.cancelBubble););this._dispatchToView(t,r)},ft.prototype._dispatchDataEvent=function(t,e,r){var i=r&&r.target,n=i&&i.dataIndex,a=i&&i.seriesIndex,o=i&&i.eventData,s=!1,l=this._zrEventProxy;l.x=e.offsetX,l.y=e.offsetY,l.update();var u={target:l};let h=M.helper.getECData(l);t==="mousemove"&&(n!=null?n!==this._lastDataIndex&&(parseInt(this._lastDataIndex,10)>=0&&(h.dataIndex=this._lastDataIndex,h.seriesIndex=this._lastSeriesIndex,this.zr.handler.dispatchToElement(u,"mouseout",e)),s=!0):o!=null&&o!==this._lastEventData&&(this._lastEventData!=null&&(h.eventData=this._lastEventData,this.zr.handler.dispatchToElement(u,"mouseout",e)),s=!0),this._lastEventData=o,this._lastDataIndex=n,this._lastSeriesIndex=a),h.eventData=o,h.dataIndex=n,h.seriesIndex=a,(o!=null||parseInt(n,10)>=0&&parseInt(a,10)>=0)&&(this.zr.handler.dispatchToElement(u,t,e),s&&this.zr.handler.dispatchToElement(u,"mouseover",e))},ft.prototype._dispatchToView=function(t,e){for(var r=0;r<this.views.length;r++)this.views[r].containPoint(e.offsetX,e.offsetY)&&this.views[r].trigger(t,e)},Object.assign(ft.prototype,za);let $l=ft;var ud=["bar3D","line3D","map3D","scatter3D","surface","lines3D","scatterGL","scatter3D"];function ji(t,e){if(t&&t[e]&&(t[e].normal||t[e].emphasis)){var r=t[e].normal,i=t[e].emphasis;r&&(t[e]=r),i&&(t.emphasis=t.emphasis||{},t.emphasis[e]=i)}}function oa(t){t&&(t instanceof Array||(t=[t]),M.util.each(t,(function(e){if(e.axisLabel){var r=e.axisLabel;Object.assign(r,r.textStyle),r.textStyle=null}})))}function Uo(t,e,r){try{return Object.defineProperty(t,e,{value:r,configurable:!0,writable:!0}),!0}catch{}try{return Reflect.set(t,e,r)}catch{}return!1}var Xi=M;function tu(t){this._layers={},this._zr=t}Uo(Xi,"graphicGL",T),tu.prototype.update=function(t,e){var r=this,i=e.getZr();if(i.getWidth()&&i.getHeight()){for(var n in this._layers)this._layers[n].removeViewsAll();t.eachComponent((function(s,l){if(s!=="series"){var u=e.getViewOfComponentModel(l),h=l.coordinateSystem;if(u.__ecgl__){if(h){if(!h.viewGL)return void console.error("Can't find viewGL in coordinateSystem of component "+l.id);c=h.viewGL}else{if(!l.viewGL)return void console.error("Can't find viewGL of component "+l.id);c=h.viewGL}var c=h.viewGL,f=a(l);f.addView(c),u.afterRender&&u.afterRender(l,t,e,f),o(u.groupGL,l.get("silent"))}}})),t.eachSeries((function(s){var l=e.getViewOfSeriesModel(s),u=s.coordinateSystem;if(l.__ecgl__){if(u&&!u.viewGL&&!l.viewGL)return void console.error("Can't find viewGL of series "+l.id);var h=u&&u.viewGL||l.viewGL,c=a(s);c.addView(h),l.afterRender&&l.afterRender(s,t,e,c),o(l.groupGL,s.get("silent"))}}))}else console.warn("Dom has no width or height");function a(s){var l;i.setSleepAfterStill(0),s.coordinateSystem&&s.coordinateSystem.model,l=s.get("zlevel");var u=r._layers,h=u[l];if(!h){if(h=u[l]=new $l("gl-"+l,i),i.painter.isSingleCanvas()){h.virtual=!0;var c=new Xi.graphic.Image({z:1e4,style:{image:h.renderer.canvas},silent:!0});h.__hostImage=c,i.add(c)}i.painter.insertLayer(l,h)}return h.__hostImage&&h.__hostImage.setStyle({width:h.renderer.getWidth(),height:h.renderer.getHeight()}),h}function o(s,l){s&&s.traverse((function(u){u.isRenderable&&u.isRenderable()&&(u.ignorePicking=u.$ignorePicking!=null?u.$ignorePicking:l)}))}},Xi.registerPostInit((function(t){var e=t.getZr(),r=e.painter.dispose;e.painter.dispose=function(){typeof this.eachOtherLayer=="function"&&this.eachOtherLayer((function(i){i instanceof $l&&i.dispose()})),r.call(this)}})),Xi.registerPostUpdate((function(t,e){var r=e.getZr();(r.__egl=r.__egl||new tu(r)).update(t,e)})),Xi.registerPreprocessor((function(t){M.util.each(t.series,(function(e){M.util.indexOf(ud,e.type)>=0&&((function(r){ji(r,"itemStyle"),ji(r,"lineStyle"),ji(r,"areaStyle"),ji(r,"label")})(e),e.coordinateSystem==="mapbox"&&(e.coordinateSystem="mapbox3D",t.mapbox3D=t.mapbox))})),oa(t.xAxis3D),oa(t.yAxis3D),oa(t.zAxis3D),oa(t.grid3D),ji(t.geo3D)}));let sa={defaultOption:{viewControl:{projection:"perspective",autoRotate:!1,autoRotateDirection:"cw",autoRotateSpeed:10,autoRotateAfterStill:3,damping:.8,rotateSensitivity:1,zoomSensitivity:1,panSensitivity:1,panMouseButton:"middle",rotateMouseButton:"left",distance:150,minDistance:40,maxDistance:400,orthographicSize:150,maxOrthographicSize:400,minOrthographicSize:20,center:[0,0,0],alpha:0,beta:0,minAlpha:-90,maxAlpha:90}},setView:function(t){t=t||{},this.option.viewControl=this.option.viewControl||{},t.alpha!=null&&(this.option.viewControl.alpha=t.alpha),t.beta!=null&&(this.option.viewControl.beta=t.beta),t.distance!=null&&(this.option.viewControl.distance=t.distance),t.center!=null&&(this.option.viewControl.center=t.center)}},ai={defaultOption:{postEffect:{enable:!1,bloom:{enable:!0,intensity:.1},depthOfField:{enable:!1,focalRange:20,focalDistance:50,blurRadius:10,fstop:2.8,quality:"medium"},screenSpaceAmbientOcclusion:{enable:!1,radius:2,quality:"medium",intensity:1},screenSpaceReflection:{enable:!1,quality:"medium",maxRoughness:.8},colorCorrection:{enable:!0,exposure:0,brightness:0,contrast:1,saturation:1,lookupTexture:""},edge:{enable:!1},FXAA:{enable:!1}},temporalSuperSampling:{enable:"auto"}}},oi={defaultOption:{light:{main:{shadow:!1,shadowQuality:"high",color:"#fff",intensity:1,alpha:0,beta:0},ambient:{color:"#fff",intensity:.2},ambientCubemap:{texture:null,exposure:1,diffuseIntensity:.5,specularIntensity:.5}}}};var la=M.ComponentModel.extend({type:"grid3D",dependencies:["xAxis3D","yAxis3D","zAxis3D"],defaultOption:{show:!0,zlevel:-10,left:0,top:0,width:"100%",height:"100%",environment:"auto",boxWidth:100,boxHeight:100,boxDepth:100,axisPointer:{show:!0,lineStyle:{color:"rgba(0, 0, 0, 0.8)",width:1},label:{show:!0,formatter:null,margin:8,textStyle:{fontSize:14,color:"#fff",backgroundColor:"rgba(0,0,0,0.5)",padding:3,borderRadius:3}}},axisLine:{show:!0,lineStyle:{color:"#333",width:2,type:"solid"}},axisTick:{show:!0,inside:!1,length:3,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,margin:8,textStyle:{fontSize:12}},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},light:{main:{alpha:30,beta:40},ambient:{intensity:.4}},viewControl:{alpha:20,beta:40,autoRotate:!1,distance:200,minDistance:40,maxDistance:400}}});M.util.merge(la.prototype,sa),M.util.merge(la.prototype,ai),M.util.merge(la.prototype,oi);let hd=la;function si(t,e){switch(t){case"center":case"middle":t="50%";break;case"left":case"top":t="0%";break;case"right":case"bottom":t="100%"}return typeof t=="string"?(r=t,r.replace(/^\s+|\s+$/g,"")).match(/%$/)?parseFloat(t)/100*e:parseFloat(t):t==null?NaN:+t;var r}function eu(){var t="__ec_inner_"+cd++;return function(e){return e[t]||(e[t]={})}}var cd=Math.round(9*Math.random()),ko={};function ua(t,e,r,i,n){var a={};return(function(o,s,l,u,h){l=l||ko;var c,f=s.ecModel,p=f&&f.option.textStyle,d=(function(x){for(var v;x&&x!==x.ecModel;){var w=(x.option||ko).rich;if(w){v=v||{};for(var b=ni(w),S=0;S<b.length;S++)v[b[S]]=1}x=x.parentModel}return v})(s);if(d){for(var m in c={},d)if(d.hasOwnProperty(m)){var g=s.getModel(["rich",m]);au(c[m]={},g,p,l,u,h,!1,!0)}}c&&(o.rich=c);var _=s.get("overflow");_&&(o.overflow=_);var y=s.get("minMargin");y!=null&&(o.margin=y),au(o,s,p,l,u,h,!0,!1)})(a,t,r,i,n),e&&Ul(a,e),a}var ru=["fontStyle","fontWeight","fontSize","fontFamily","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY"],iu=["align","lineHeight","width","height","tag","verticalAlign"],nu=["padding","borderWidth","borderRadius","borderDashOffset","backgroundColor","borderColor","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY"];function au(t,e,r,i,n,a,o,s){r=!n&&r||ko;var l=i&&i.inheritColor,u=e.getShallow("color"),h=e.getShallow("textBorderColor"),c=Vi(e.getShallow("opacity"),r.opacity);u!=="inherit"&&u!=="auto"||(u=l||null),h!=="inherit"&&h!=="auto"||(h=l||null),a||(u=u||r.color,h=h||r.textBorderColor),u!=null&&(t.fill=u),h!=null&&(t.stroke=h);var f=Vi(e.getShallow("textBorderWidth"),r.textBorderWidth);f!=null&&(t.lineWidth=f);var p=Vi(e.getShallow("textBorderType"),r.textBorderType);p!=null&&(t.lineDash=p);var d=Vi(e.getShallow("textBorderDashOffset"),r.textBorderDashOffset);d!=null&&(t.lineDashOffset=d),n||c!=null||s||(c=i&&i.defaultOpacity),c!=null&&(t.opacity=c),n||a||t.fill==null&&i.inheritColor&&(t.fill=i.inheritColor);for(var m=0;m<ru.length;m++){var g=ru[m];(y=Vi(e.getShallow(g),r[g]))!=null&&(t[g]=y)}for(m=0;m<iu.length;m++)g=iu[m],(y=e.getShallow(g))!=null&&(t[g]=y);if(t.verticalAlign==null){var _=e.getShallow("baseline");_!=null&&(t.verticalAlign=_)}if(!o||!i.disableBox){for(m=0;m<nu.length;m++){var y;g=nu[m],(y=e.getShallow(g))!=null&&(t[g]=y)}var x=e.getShallow("borderType");x!=null&&(t.borderDash=x),t.backgroundColor!=="auto"&&t.backgroundColor!=="inherit"||!l||(t.backgroundColor=l),t.borderColor!=="auto"&&t.borderColor!=="inherit"||!l||(t.borderColor=l)}}eu();var qi=J,ou={left:0,middle:1,right:2};function su(t){return t instanceof Array||(t=[t,t]),t}var lu=jt.extend((function(){return{zr:null,viewGL:null,_center:new F,minDistance:.5,maxDistance:1.5,maxOrthographicSize:300,minOrthographicSize:30,minAlpha:-90,maxAlpha:90,minBeta:-1/0,maxBeta:1/0,autoRotateAfterStill:0,autoRotateDirection:"cw",autoRotateSpeed:60,damping:.8,rotateSensitivity:1,zoomSensitivity:1,panSensitivity:1,panMouseButton:"middle",rotateMouseButton:"left",_mode:"rotate",_camera:null,_needsUpdate:!1,_rotating:!1,_phi:0,_theta:0,_mouseX:0,_mouseY:0,_rotateVelocity:new ne,_panVelocity:new ne,_distance:500,_zoomSpeed:0,_stillTimeout:0,_animators:[]}}),(function(){["_mouseDownHandler","_mouseWheelHandler","_mouseMoveHandler","_mouseUpHandler","_pinchHandler","_contextMenuHandler","_update"].forEach((function(t){this[t]=this[t].bind(this)}),this)}),{init:function(){var t=this.zr;t&&(t.on("mousedown",this._mouseDownHandler),t.on("globalout",this._mouseUpHandler),t.on("mousewheel",this._mouseWheelHandler),t.on("pinch",this._pinchHandler),t.animation.on("frame",this._update),t.dom.addEventListener("contextmenu",this._contextMenuHandler))},dispose:function(){var t=this.zr;t&&(t.off("mousedown",this._mouseDownHandler),t.off("mousemove",this._mouseMoveHandler),t.off("mouseup",this._mouseUpHandler),t.off("mousewheel",this._mouseWheelHandler),t.off("pinch",this._pinchHandler),t.off("globalout",this._mouseUpHandler),t.dom.removeEventListener("contextmenu",this._contextMenuHandler),t.animation.off("frame",this._update)),this.stopAllAnimation()},getDistance:function(){return this._distance},setDistance:function(t){this._distance=t,this._needsUpdate=!0},getOrthographicSize:function(){return this._orthoSize},setOrthographicSize:function(t){this._orthoSize=t,this._needsUpdate=!0},getAlpha:function(){return this._theta/Math.PI*180},getBeta:function(){return-this._phi/Math.PI*180},getCenter:function(){return this._center.toArray()},setAlpha:function(t){t=Math.max(Math.min(this.maxAlpha,t),this.minAlpha),this._theta=t/180*Math.PI,this._needsUpdate=!0},setBeta:function(t){t=Math.max(Math.min(this.maxBeta,t),this.minBeta),this._phi=-t/180*Math.PI,this._needsUpdate=!0},setCenter:function(t){this._center.setArray(t)},setViewGL:function(t){this.viewGL=t},getCamera:function(){return this.viewGL.camera},setFromViewControlModel:function(t,e){var r=(e=e||{}).baseDistance||0,i=e.baseOrthoSize||1,n=t.get("projection");n!=="perspective"&&n!=="orthographic"&&n!=="isometric"&&(n="perspective"),this._projection=n,this.viewGL.setProjection(n);var a=t.get("distance")+r,o=t.get("orthographicSize")+i;[["damping",.8],["autoRotate",!1],["autoRotateAfterStill",3],["autoRotateDirection","cw"],["autoRotateSpeed",10],["minDistance",30],["maxDistance",400],["minOrthographicSize",30],["maxOrthographicSize",300],["minAlpha",-90],["maxAlpha",90],["minBeta",-1/0],["maxBeta",1/0],["rotateSensitivity",1],["zoomSensitivity",1],["panSensitivity",1],["panMouseButton","left"],["rotateMouseButton","middle"]].forEach((function(f){this[f[0]]=qi(t.get(f[0]),f[1])}),this),this.minDistance+=r,this.maxDistance+=r,this.minOrthographicSize+=i,this.maxOrthographicSize+=i;var s=t.ecModel,l={};["animation","animationDurationUpdate","animationEasingUpdate"].forEach((function(f){l[f]=qi(t.get(f),s&&s.get(f))}));var u=qi(e.alpha,t.get("alpha"))||0,h=qi(e.beta,t.get("beta"))||0,c=qi(e.center,t.get("center"))||[0,0,0];l.animation&&l.animationDurationUpdate>0&&this._notFirst?this.animateTo({alpha:u,beta:h,center:c,distance:a,orthographicSize:o,easing:l.animationEasingUpdate,duration:l.animationDurationUpdate}):(this.setDistance(a),this.setAlpha(u),this.setBeta(h),this.setCenter(c),this.setOrthographicSize(o)),this._notFirst=!0,this._validateProperties()},_validateProperties:function(){},animateTo:function(t){var e=this.zr,r=this,i={},n={};return t.distance!=null&&(i.distance=this.getDistance(),n.distance=t.distance),t.orthographicSize!=null&&(i.orthographicSize=this.getOrthographicSize(),n.orthographicSize=t.orthographicSize),t.alpha!=null&&(i.alpha=this.getAlpha(),n.alpha=t.alpha),t.beta!=null&&(i.beta=this.getBeta(),n.beta=t.beta),t.center!=null&&(i.center=this.getCenter(),n.center=t.center),this._addAnimator(e.animation.animate(i).when(t.duration||1e3,n).during((function(){i.alpha!=null&&r.setAlpha(i.alpha),i.beta!=null&&r.setBeta(i.beta),i.distance!=null&&r.setDistance(i.distance),i.center!=null&&r.setCenter(i.center),i.orthographicSize!=null&&r.setOrthographicSize(i.orthographicSize),r._needsUpdate=!0}))).start(t.easing||"linear")},stopAllAnimation:function(){for(var t=0;t<this._animators.length;t++)this._animators[t].stop();this._animators.length=0},update:function(){this._needsUpdate=!0,this._update(20)},_isAnimating:function(){return this._animators.length>0},_update:function(t){if(this._rotating){var e=(this.autoRotateDirection==="cw"?1:-1)*this.autoRotateSpeed/180*Math.PI;this._phi-=e*t/1e3,this._needsUpdate=!0}else this._rotateVelocity.len()>0&&(this._needsUpdate=!0);(Math.abs(this._zoomSpeed)>.1||this._panVelocity.len()>0)&&(this._needsUpdate=!0),this._needsUpdate&&(t=Math.min(t,50),this._updateDistanceOrSize(t),this._updatePan(t),this._updateRotate(t),this._updateTransform(),this.getCamera().update(),this.zr&&this.zr.refresh(),this.trigger("update"),this._needsUpdate=!1)},_updateRotate:function(t){var e=this._rotateVelocity;this._phi=e.y*t/20+this._phi,this._theta=e.x*t/20+this._theta,this.setAlpha(this.getAlpha()),this.setBeta(this.getBeta()),this._vectorDamping(e,Math.pow(this.damping,t/16))},_updateDistanceOrSize:function(t){this._projection==="perspective"?this._setDistance(this._distance+this._zoomSpeed*t/20):this._setOrthoSize(this._orthoSize+this._zoomSpeed*t/20),this._zoomSpeed*=Math.pow(this.damping,t/16)},_setDistance:function(t){this._distance=Math.max(Math.min(t,this.maxDistance),this.minDistance)},_setOrthoSize:function(t){this._orthoSize=Math.max(Math.min(t,this.maxOrthographicSize),this.minOrthographicSize);var e=this.getCamera(),r=this._orthoSize,i=r/this.viewGL.viewport.height*this.viewGL.viewport.width;e.left=-i/2,e.right=i/2,e.top=r/2,e.bottom=-r/2},_updatePan:function(t){var e=this._panVelocity,r=this._distance,i=this.getCamera(),n=i.worldTransform.y,a=i.worldTransform.x;this._center.scaleAndAdd(a,-e.x*r/200).scaleAndAdd(n,-e.y*r/200),this._vectorDamping(e,0)},_updateTransform:function(){var t=this.getCamera(),e=new F,r=this._theta+Math.PI/2,i=this._phi+Math.PI/2,n=Math.sin(r);e.x=n*Math.cos(i),e.y=-Math.cos(r),e.z=n*Math.sin(i),t.position.copy(this._center).scaleAndAdd(e,this._distance),t.rotation.identity().rotateY(-this._phi).rotateX(-this._theta)},_startCountingStill:function(){clearTimeout(this._stillTimeout);var t=this.autoRotateAfterStill,e=this;!isNaN(t)&&t>0&&(this._stillTimeout=setTimeout((function(){e._rotating=!0}),1e3*t))},_vectorDamping:function(t,e){var r=t.len();(r*=e)<1e-4&&(r=0),t.normalize().scale(r)},_decomposeTransform:function(){if(this.getCamera()){this.getCamera().updateWorldTransform();var t=this.getCamera().worldTransform.z,e=Math.asin(t.y),r=Math.atan2(t.x,t.z);this._theta=e,this._phi=-r,this.setBeta(this.getBeta()),this.setAlpha(this.getAlpha()),this.getCamera().aspect?this._setDistance(this.getCamera().position.dist(this._center)):this._setOrthoSize(this.getCamera().top-this.getCamera().bottom)}},_mouseDownHandler:function(t){if(!t.target&&!this._isAnimating()){var e=t.offsetX,r=t.offsetY;this.viewGL&&!this.viewGL.containPoint(e,r)||(this.zr.on("mousemove",this._mouseMoveHandler),this.zr.on("mouseup",this._mouseUpHandler),t.event.targetTouches?t.event.targetTouches.length===1&&(this._mode="rotate"):t.event.button===ou[this.rotateMouseButton]?this._mode="rotate":t.event.button===ou[this.panMouseButton]?this._mode="pan":this._mode="",this._rotateVelocity.set(0,0),this._rotating=!1,this.autoRotate&&this._startCountingStill(),this._mouseX=t.offsetX,this._mouseY=t.offsetY)}},_mouseMoveHandler:function(t){if(!(t.target&&t.target.__isGLToZRProxy||this._isAnimating())){var e=su(this.panSensitivity),r=su(this.rotateSensitivity);this._mode==="rotate"?(this._rotateVelocity.y=(t.offsetX-this._mouseX)/this.zr.getHeight()*2*r[0],this._rotateVelocity.x=(t.offsetY-this._mouseY)/this.zr.getWidth()*2*r[1]):this._mode==="pan"&&(this._panVelocity.x=(t.offsetX-this._mouseX)/this.zr.getWidth()*e[0]*400,this._panVelocity.y=(-t.offsetY+this._mouseY)/this.zr.getHeight()*e[1]*400),this._mouseX=t.offsetX,this._mouseY=t.offsetY,t.event.preventDefault()}},_mouseWheelHandler:function(t){if(!this._isAnimating()){var e=t.event.wheelDelta||-t.event.detail;this._zoomHandler(t,e)}},_pinchHandler:function(t){this._isAnimating()||(this._zoomHandler(t,t.pinchScale>1?1:-1),this._mode="")},_zoomHandler:function(t,e){if(e!==0){var r,i=t.offsetX,n=t.offsetY;this.viewGL&&!this.viewGL.containPoint(i,n)||(r=this._projection==="perspective"?Math.max(Math.max(Math.min(this._distance-this.minDistance,this.maxDistance-this._distance))/20,.5):Math.max(Math.max(Math.min(this._orthoSize-this.minOrthographicSize,this.maxOrthographicSize-this._orthoSize))/20,.5),this._zoomSpeed=(e>0?-1:1)*r*this.zoomSensitivity,this._rotating=!1,this.autoRotate&&this._mode==="rotate"&&this._startCountingStill(),t.event.preventDefault())}},_mouseUpHandler:function(){this.zr.off("mousemove",this._mouseMoveHandler),this.zr.off("mouseup",this._mouseUpHandler)},_isRightMouseButtonUsed:function(){return this.rotateMouseButton==="right"||this.panMouseButton==="right"},_contextMenuHandler:function(t){this._isRightMouseButtonUsed()&&t.preventDefault()},_addAnimator:function(t){var e=this._animators;return e.push(t),t.done((function(){var r=e.indexOf(t);r>=0&&e.splice(r,1)})),t}});Object.defineProperty(lu.prototype,"autoRotate",{get:function(t){return this._autoRotate},set:function(t){this._autoRotate=t,this._rotating=t}});let ha=lu,Zi={convertToDynamicArray:function(t){t&&this.resetOffset();var e=this.attributes;for(var r in e)t||!e[r].value?e[r].value=[]:e[r].value=Array.prototype.slice.call(e[r].value);t||!this.indices?this.indices=[]:this.indices=Array.prototype.slice.call(this.indices)},convertToTypedArray:function(){var t=this.attributes;for(var e in t)t[e].value&&t[e].value.length>0?t[e].value=new Float32Array(t[e].value):t[e].value=null;this.indices&&this.indices.length>0&&(this.indices=this.vertexCount>65535?new Uint32Array(this.indices):new Uint16Array(this.indices)),this.dirty()}},Mt={vec2:W,vec3:E,vec4:G,mat2:wt,mat2d:Ct,mat3:tt,mat4:R,quat:q};var Vo=Mt.vec3,uu=[[0,0],[1,1]],hu=nt.extend((function(){return{segmentScale:1,dynamic:!0,useNativeLine:!0,attributes:{position:new nt.Attribute("position","float",3,"POSITION"),positionPrev:new nt.Attribute("positionPrev","float",3),positionNext:new nt.Attribute("positionNext","float",3),prevPositionPrev:new nt.Attribute("prevPositionPrev","float",3),prevPosition:new nt.Attribute("prevPosition","float",3),prevPositionNext:new nt.Attribute("prevPositionNext","float",3),offset:new nt.Attribute("offset","float",1),color:new nt.Attribute("color","float",4,"COLOR")}}}),{resetOffset:function(){this._vertexOffset=0,this._triangleOffset=0,this._itemVertexOffsets=[]},setVertexCount:function(t){var e=this.attributes;this.vertexCount!==t&&(e.position.init(t),e.color.init(t),this.useNativeLine||(e.positionPrev.init(t),e.positionNext.init(t),e.offset.init(t)),t>65535?this.indices instanceof Uint16Array&&(this.indices=new Uint32Array(this.indices)):this.indices instanceof Uint32Array&&(this.indices=new Uint16Array(this.indices)))},setTriangleCount:function(t){this.triangleCount!==t&&(this.indices=t===0?null:this.vertexCount>65535?new Uint32Array(3*t):new Uint16Array(3*t))},_getCubicCurveApproxStep:function(t,e,r,i){return 1/(Vo.dist(t,e)+Vo.dist(r,e)+Vo.dist(i,r)+1)*this.segmentScale},getCubicCurveVertexCount:function(t,e,r,i){var n=this._getCubicCurveApproxStep(t,e,r,i),a=Math.ceil(1/n);return this.useNativeLine?2*a:2*a+2},getCubicCurveTriangleCount:function(t,e,r,i){var n=this._getCubicCurveApproxStep(t,e,r,i),a=Math.ceil(1/n);return this.useNativeLine?0:2*a},getLineVertexCount:function(){return this.getPolylineVertexCount(uu)},getLineTriangleCount:function(){return this.getPolylineTriangleCount(uu)},getPolylineVertexCount:function(t){var e;return e=typeof t=="number"?t:typeof t[0]!="number"?t.length:t.length/3,this.useNativeLine?2*(e-1):2*(e-1)+2},getPolylineTriangleCount:function(t){var e;return e=typeof t=="number"?t:typeof t[0]!="number"?t.length:t.length/3,this.useNativeLine?0:2*Math.max(e-1,0)},addCubicCurve:function(t,e,r,i,n,a){a==null&&(a=1);var o=t[0],s=t[1],l=t[2],u=e[0],h=e[1],c=e[2],f=r[0],p=r[1],d=r[2],m=i[0],g=i[1],_=i[2],y=this._getCubicCurveApproxStep(t,e,r,i),x=y*y,v=x*y,w=3*y,b=3*x,S=6*x,A=6*v,D=o-2*u+f,P=s-2*h+p,L=l-2*c+d,O=3*(u-f)-o+m,N=3*(h-p)-s+g,C=3*(c-d)-l+_,B=o,I=s,X=l,V=(u-o)*w+D*b+O*v,st=(h-s)*w+P*b+N*v,U=(c-l)*w+L*b+C*v,Tt=D*S+O*A,lt=P*S+N*A,ht=L*S+C*A,Q=O*A,ee=N*A,pt=C*A,Wt=0,se=0,Rr=Math.ceil(1/y),ge=new Float32Array(3*(Rr+1)),Fr=(ge=[],0);for(se=0;se<Rr+1;se++)ge[Fr++]=B,ge[Fr++]=I,ge[Fr++]=X,B+=V,I+=st,X+=U,V+=Tt,st+=lt,U+=ht,Tt+=Q,lt+=ee,ht+=pt,(Wt+=y)>1&&(B=V>0?Math.min(B,m):Math.max(B,m),I=st>0?Math.min(I,g):Math.max(I,g),X=U>0?Math.min(X,_):Math.max(X,_));return this.addPolyline(ge,n,a)},addLine:function(t,e,r,i){return this.addPolyline([t,e],r,i)},addPolyline:function(t,e,r,i,n){if(t.length){var a=typeof t[0]!="number";if(n==null&&(n=a?t.length:t.length/3),!(n<2)){i==null&&(i=0),r==null&&(r=1),this._itemVertexOffsets.push(this._vertexOffset);var o,s,l=(a=typeof t[0]!="number")?typeof e[0]!="number":e.length/4===n,u=this.attributes.position,h=this.attributes.positionPrev,c=this.attributes.positionNext,f=this.attributes.color,p=this.attributes.offset,d=this.indices,m=this._vertexOffset;r=Math.max(r,.01);for(var g=i;g<n;g++){if(a)o=t[g],s=l?e[g]:e;else{var _=3*g;if((o=o||[])[0]=t[_],o[1]=t[_+1],o[2]=t[_+2],l){var y=4*g;(s=s||[])[0]=e[y],s[1]=e[y+1],s[2]=e[y+2],s[3]=e[y+3]}else s=e}if(this.useNativeLine?g>1&&(u.copy(m,m-1),f.copy(m,m-1),m++):(g<n-1&&(h.set(m+2,o),h.set(m+3,o)),g>0&&(c.set(m-2,o),c.set(m-1,o)),u.set(m,o),u.set(m+1,o),f.set(m,s),f.set(m+1,s),p.set(m,r/2),p.set(m+1,-r/2),m+=2),this.useNativeLine)f.set(m,s),u.set(m,o),m++;else if(g>0){var x=3*this._triangleOffset;(d=this.indices)[x]=m-4,d[x+1]=m-3,d[x+2]=m-2,d[x+3]=m-3,d[x+4]=m-1,d[x+5]=m-2,this._triangleOffset+=2}}if(!this.useNativeLine){var v=this._vertexOffset,w=this._vertexOffset+2*n;h.copy(v,v+2),h.copy(v+1,v+3),c.copy(w-1,w-3),c.copy(w-2,w-4)}return this._vertexOffset=m,this._vertexOffset}}},setItemColor:function(t,e){for(var r=this._itemVertexOffsets[t],i=t<this._itemVertexOffsets.length-1?this._itemVertexOffsets[t+1]:this._vertexOffset,n=r;n<i;n++)this.attributes.color.set(n,e);this.dirty("color")},currentTriangleOffset:function(){return this._triangleOffset},currentVertexOffset:function(){return this._vertexOffset}});M.util.defaults(hu.prototype,Zi);let xr=hu;function ca(t,e,r,i,n,a,o){this._zr=t,this._x=0,this._y=0,this._rowHeight=0,this.width=i,this.height=n,this.offsetX=e,this.offsetY=r,this.dpr=o,this.gap=a}function cu(t){(t=t||{}).width=t.width||512,t.height=t.height||512,t.devicePixelRatio=t.devicePixelRatio||1,t.gap=t.gap==null?2:t.gap;var e=document.createElement("canvas");e.width=t.width*t.devicePixelRatio,e.height=t.height*t.devicePixelRatio,this._canvas=e,this._texture=new K({image:e,flipY:!1});var r=this;this._zr=M.zrender.init(e),Dl(this._zr,(function(){r._texture.dirty(),r.onupdate&&r.onupdate()})),this._dpr=t.devicePixelRatio,this._coords={},this.onupdate=t.onupdate,this._gap=t.gap,this._textureAtlasNodes=[new ca(this._zr,0,0,t.width,t.height,this._gap,this._dpr)],this._nodeWidth=t.width,this._nodeHeight=t.height,this._currentNodeIdx=0}ca.prototype={constructor:ca,clear:function(){this._x=0,this._y=0,this._rowHeight=0},add:function(t,e,r){var i=t.getBoundingRect();e==null&&(e=i.width),r==null&&(r=i.height),e*=this.dpr,r*=this.dpr,this._fitElement(t,e,r);var n=this._x,a=this._y,o=this.width*this.dpr,s=this.height*this.dpr,l=this.gap;if(n+e+l>o&&(n=this._x=0,a+=this._rowHeight+l,this._y=a,this._rowHeight=0),this._x+=e+l,this._rowHeight=Math.max(this._rowHeight,r),a+r+l>s)return null;t.x+=this.offsetX*this.dpr+n,t.y+=this.offsetY*this.dpr+a,this._zr.add(t);var u=[this.offsetX/this.width,this.offsetY/this.height];return[[n/o+u[0],a/s+u[1]],[(n+e)/o+u[0],(a+r)/s+u[1]]]},_fitElement:function(t,e,r){var i=t.getBoundingRect(),n=e/i.width,a=r/i.height;t.x=-i.x*n,t.y=-i.y*a,t.scaleX=n,t.scaleY=a,t.update()}},cu.prototype={clear:function(){for(var t=0;t<this._textureAtlasNodes.length;t++)this._textureAtlasNodes[t].clear();this._currentNodeIdx=0,this._zr.clear(),this._coords={}},getWidth:function(){return this._width},getHeight:function(){return this._height},getTexture:function(){return this._texture},getDevicePixelRatio:function(){return this._dpr},getZr:function(){return this._zr},_getCurrentNode:function(){return this._textureAtlasNodes[this._currentNodeIdx]},_expand:function(){if(this._currentNodeIdx++,this._textureAtlasNodes[this._currentNodeIdx])return this._textureAtlasNodes[this._currentNodeIdx];var t=4096/this._dpr,e=this._textureAtlasNodes.length,r=e*this._nodeWidth%t,i=Math.floor(e*this._nodeWidth/t)*this._nodeHeight;if(!(i>=t)){var n=(r+this._nodeWidth)*this._dpr,a=(i+this._nodeHeight)*this._dpr;try{this._zr.resize({width:n,height:a})}catch{this._canvas.width=n,this._canvas.height=a}var o=new ca(this._zr,r,i,this._nodeWidth,this._nodeHeight,this._gap,this._dpr);return this._textureAtlasNodes.push(o),o}},add:function(t,e,r){if(this._coords[t.id])return this._coords[t.id];var i=this._getCurrentNode().add(t,e,r);if(!i){var n=this._expand();if(!n)return;i=n.add(t,e,r)}return this._coords[t.id]=i,i},getCoordsScale:function(){var t=this._dpr;return[this._nodeWidth/this._canvas.width*t,this._nodeHeight/this._canvas.height*t]},getCoords:function(t){return this._coords[t]},dispose:function(){this._zr.dispose()}};let Ho=cu;function Wo(){}Wo.prototype={constructor:Wo,setScene:function(t){this._scene=t,this._skybox&&this._skybox.attachScene(this._scene)},initLight:function(t){this._lightRoot=t,this.mainLight=new T.DirectionalLight({shadowBias:.005}),this.ambientLight=new T.AmbientLight,t.add(this.mainLight),t.add(this.ambientLight)},dispose:function(){this._lightRoot&&(this._lightRoot.remove(this.mainLight),this._lightRoot.remove(this.ambientLight))},updateLight:function(t){var e=this.mainLight,r=this.ambientLight,i=t.getModel("light"),n=i.getModel("main"),a=i.getModel("ambient");e.intensity=n.get("intensity"),r.intensity=a.get("intensity"),e.color=T.parseColor(n.get("color")).slice(0,3),r.color=T.parseColor(a.get("color")).slice(0,3);var o=n.get("alpha")||0,s=n.get("beta")||0;e.position.setArray(T.directionFromAlphaBeta(o,s)),e.lookAt(T.Vector3.ZERO),e.castShadow=n.get("shadow"),e.shadowResolution=T.getShadowResolution(n.get("shadowQuality"))},updateAmbientCubemap:function(t,e,r){var i=e.getModel("light.ambientCubemap"),n=i.get("texture");if(n){this._cubemapLightsCache=this._cubemapLightsCache||{};var a=this._cubemapLightsCache[n];if(!a){var o=this;a=this._cubemapLightsCache[n]=T.createAmbientCubemap(i.option,t,r,(function(){o._isSkyboxFromAmbientCubemap&&o._skybox.setEnvironmentMap(a.specular.cubemap),r.getZr().refresh()}))}this._lightRoot.add(a.diffuse),this._lightRoot.add(a.specular),this._currentCubemapLights=a}else this._currentCubemapLights&&(this._lightRoot.remove(this._currentCubemapLights.diffuse),this._lightRoot.remove(this._currentCubemapLights.specular),this._currentCubemapLights=null)},updateSkybox:function(t,e,r){var i=e.get("environment"),n=this,a=(n._skybox=n._skybox||new kn,n._skybox);if(i&&i!=="none")if(i==="auto")if(this._isSkyboxFromAmbientCubemap=!0,this._currentCubemapLights){var o=this._currentCubemapLights.specular.cubemap;a.setEnvironmentMap(o),this._scene&&a.attachScene(this._scene),a.material.set("lod",3)}else this._skybox&&this._skybox.detachScene();else if(typeof i=="object"&&i.colorStops||typeof i=="string"&&M.color.parse(i)){this._isSkyboxFromAmbientCubemap=!1;var s=new T.Texture2D({anisotropic:8,flipY:!1});a.setEnvironmentMap(s);var l=s.image=document.createElement("canvas");l.width=l.height=16;var u=l.getContext("2d"),h=new M.graphic.Rect({shape:{x:0,y:0,width:16,height:16},style:{fill:i}});M.innerDrawElementOnCanvas(u,h),a.attachScene(this._scene)}else this._isSkyboxFromAmbientCubemap=!1,s=T.loadTexture(i,r,{anisotropic:8,flipY:!1}),a.setEnvironmentMap(s),a.attachScene(this._scene);else this._skybox&&this._skybox.detachScene(this._scene),this._skybox=null;var c=e.coordinateSystem;if(this._skybox)if(!c||!c.viewGL||i==="auto"||i.match&&i.match(/.hdr$/))this._skybox.material.undefine("fragment","SRGB_DECODE");else{var f=c.viewGL.isLinearSpace()?"define":"undefine";this._skybox.material[f]("fragment","SRGB_DECODE")}}};let li=Wo;var br=Mt.vec3,du=nt.extend((function(){return{segmentScale:1,useNativeLine:!0,attributes:{position:new nt.Attribute("position","float",3,"POSITION"),normal:new nt.Attribute("normal","float",3,"NORMAL"),color:new nt.Attribute("color","float",4,"COLOR")}}}),{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setQuadCount:function(t){var e=this.attributes,r=this.getQuadVertexCount()*t,i=this.getQuadTriangleCount()*t;this.vertexCount!==r&&(e.position.init(r),e.normal.init(r),e.color.init(r)),this.triangleCount!==i&&(this.indices=r>65535?new Uint32Array(3*i):new Uint16Array(3*i))},getQuadVertexCount:function(){return 4},getQuadTriangleCount:function(){return 2},addQuad:(function(){var t=br.create(),e=br.create(),r=br.create(),i=[0,3,1,3,2,1];return function(n,a){var o=this.attributes.position,s=this.attributes.normal,l=this.attributes.color;br.sub(t,n[1],n[0]),br.sub(e,n[2],n[1]),br.cross(r,t,e),br.normalize(r,r);for(var u=0;u<4;u++)o.set(this._vertexOffset+u,n[u]),l.set(this._vertexOffset+u,a),s.set(this._vertexOffset+u,r);var h=3*this._faceOffset;for(u=0;u<6;u++)this.indices[h+u]=i[u]+this._vertexOffset;this._vertexOffset+=4,this._faceOffset+=2}})()});M.util.defaults(du.prototype,Zi);let dd=du;var jo=J,fd={x:0,y:2,z:1};function da(t,e,r){this.rootNode=new T.Node;var i=new T.Mesh({geometry:new xr({useNativeLine:!1}),material:e,castShadow:!1,ignorePicking:!0,$ignorePicking:!0,renderOrder:1}),n=new T.Mesh({geometry:new dd,material:r,castShadow:!1,culling:!1,ignorePicking:!0,$ignorePicking:!0,renderOrder:0});this.rootNode.add(n),this.rootNode.add(i),this.faceInfo=t,this.plane=new T.Plane,this.linesMesh=i,this.quadsMesh=n}da.prototype.update=function(t,e,r){var i=t.coordinateSystem,n=[i.getAxis(this.faceInfo[0]),i.getAxis(this.faceInfo[1])],a=this.linesMesh.geometry,o=this.quadsMesh.geometry;a.convertToDynamicArray(!0),o.convertToDynamicArray(!0),this._updateSplitLines(a,n,t,r),this._udpateSplitAreas(o,n,t,r),a.convertToTypedArray(),o.convertToTypedArray();var s=i.getAxis(this.faceInfo[2]);(function(l,u,h,c){var f=[0,0,0],p=c<0?h.getExtentMin():h.getExtentMax();f[fd[h.dim]]=p,l.position.setArray(f),l.rotation.identity(),u.distance=-Math.abs(p),u.normal.set(0,0,0),h.dim==="x"?(l.rotation.rotateY(c*Math.PI/2),u.normal.x=-c):h.dim==="z"?(l.rotation.rotateX(-c*Math.PI/2),u.normal.y=-c):(c>0&&l.rotation.rotateY(Math.PI),u.normal.z=-c)})(this.rootNode,this.plane,s,this.faceInfo[3])},da.prototype._updateSplitLines=function(t,e,r,i){var n=i.getDevicePixelRatio();e.forEach((function(a,o){var s=a.model,l=e[1-o].getExtent();if(!a.scale.isBlank()){var u=s.getModel("splitLine",r.getModel("splitLine"));if(u.get("show")){var h=u.getModel("lineStyle"),c=h.get("color"),f=jo(h.get("opacity"),1),p=jo(h.get("width"),1);c=M.util.isArray(c)?c:[c];for(var d=a.getTicksCoords({tickModel:u}),m=0,g=0;g<d.length;g++){var _=d[g].coord,y=T.parseColor(c[m%c.length]);y[3]*=f;var x=[0,0,0],v=[0,0,0];x[o]=v[o]=_,x[1-o]=l[0],v[1-o]=l[1],t.addLine(x,v,y,p*n),m++}}}}))},da.prototype._udpateSplitAreas=function(t,e,r,i){e.forEach((function(n,a){var o=n.model,s=e[1-a].getExtent();if(!n.scale.isBlank()){var l=o.getModel("splitArea",r.getModel("splitArea"));if(l.get("show")){var u=l.getModel("areaStyle"),h=u.get("color"),c=jo(u.get("opacity"),1);h=M.util.isArray(h)?h:[h];for(var f=n.getTicksCoords({tickModel:l,clamp:!0}),p=0,d=[0,0,0],m=[0,0,0],g=0;g<f.length;g++){var _=f[g].coord,y=[0,0,0],x=[0,0,0];if(y[a]=x[a]=_,y[1-a]=s[0],x[1-a]=s[1],g!==0){var v=T.parseColor(h[p%h.length]);v[3]*=c,t.addQuad([d,y,x,m],v),d=y,m=x,p++}else d=y,m=x}}}}))};let pd=da;var fu=[0,1,2,0,2,3],pu=nt.extend((function(){return{attributes:{position:new nt.Attribute("position","float",3,"POSITION"),texcoord:new nt.Attribute("texcoord","float",2,"TEXCOORD_0"),offset:new nt.Attribute("offset","float",2),color:new nt.Attribute("color","float",4,"COLOR")}}}),{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setSpriteCount:function(t){this._spriteCount=t;var e=4*t,r=2*t;this.vertexCount!==e&&(this.attributes.position.init(e),this.attributes.offset.init(e),this.attributes.color.init(e)),this.triangleCount!==r&&(this.indices=e>65535?new Uint32Array(3*r):new Uint16Array(3*r))},setSpriteAlign:function(t,e,r,i,n){var a,o,s,l;switch(r==null&&(r="left"),i==null&&(i="top"),n=n||0,r){case"left":a=n,s=e[0]+n;break;case"center":case"middle":a=-e[0]/2,s=e[0]/2;break;case"right":a=-e[0]-n,s=-n}switch(i){case"bottom":o=n,l=e[1]+n;break;case"middle":o=-e[1]/2,l=e[1]/2;break;case"top":o=-e[1]-n,l=-n}var u=4*t,h=this.attributes.offset;h.set(u,[a,l]),h.set(u+1,[s,l]),h.set(u+2,[s,o]),h.set(u+3,[a,o])},addSprite:function(t,e,r,i,n,a){var o=this._vertexOffset;this.setSprite(this._vertexOffset/4,t,e,r,i,n,a);for(var s=0;s<fu.length;s++)this.indices[3*this._faceOffset+s]=fu[s]+o;return this._faceOffset+=2,this._vertexOffset+=4,o/4},setSprite:function(t,e,r,i,n,a,o){for(var s=4*t,l=this.attributes,u=0;u<4;u++)l.position.set(s+u,e);var h=l.texcoord;h.set(s,[i[0][0],i[0][1]]),h.set(s+1,[i[1][0],i[0][1]]),h.set(s+2,[i[1][0],i[1][1]]),h.set(s+3,[i[0][0],i[1][1]]),this.setSpriteAlign(t,r,n,a,o)}});M.util.defaults(pu.prototype,Zi);let md=pu;T.Shader.import(`@export ecgl.labels.vertex

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

@end`);let Xo=T.Mesh.extend((function(){return{geometry:new md({dynamic:!0}),material:new T.Material({shader:T.createShader("ecgl.labels"),transparent:!0,depthMask:!1}),culling:!1,castShadow:!1,ignorePicking:!0}}));var wr=J,Tr={x:0,y:2,z:1};function qo(t,e){var r=new T.Mesh({geometry:new xr({useNativeLine:!1}),material:e,castShadow:!1,ignorePicking:!0,renderOrder:2}),i=new Xo;i.material.depthMask=!1;var n=new T.Node;n.add(r),n.add(i),this.rootNode=n,this.dim=t,this.linesMesh=r,this.labelsMesh=i,this.axisLineCoords=null,this.labelElements=[]}var Zo={x:"y",y:"x",z:"y"};qo.prototype.update=function(t,e,r){var i=t.coordinateSystem.getAxis(this.dim),n=this.linesMesh.geometry,a=this.labelsMesh.geometry;n.convertToDynamicArray(!0),a.convertToDynamicArray(!0);var o=i.model,s=i.getExtent(),l=r.getDevicePixelRatio(),u=o.getModel("axisLine",t.getModel("axisLine")),h=o.getModel("axisTick",t.getModel("axisTick")),c=o.getModel("axisLabel",t.getModel("axisLabel")),f=u.get("lineStyle.color");if(u.get("show")){var p=u.getModel("lineStyle"),d=[0,0,0];(A=[0,0,0])[D=Tr[i.dim]]=s[0],d[D]=s[1],this.axisLineCoords=[A,d];var m=T.parseColor(f),g=wr(p.get("width"),1),_=wr(p.get("opacity"),1);m[3]*=_,n.addLine(A,d,m,g*l)}if(h.get("show")){var y=h.getModel("lineStyle"),x=T.parseColor(wr(y.get("color"),f));g=wr(y.get("width"),1),x[3]*=wr(y.get("opacity"),1);for(var v=i.getTicksCoords(),w=h.get("length"),b=0;b<v.length;b++){var S=v[b].coord,A=[0,0,0],D=(d=[0,0,0],Tr[i.dim]),P=Tr[Zo[i.dim]];A[D]=d[D]=S,d[P]=w,n.addLine(A,d,x,g*l)}}if(this.labelElements=[],l=r.getDevicePixelRatio(),c.get("show")){v=i.getTicksCoords();var L=o.get("data"),O=c.get("margin"),N=i.getViewLabels();for(b=0;b<N.length;b++){var C=M.util.isObject(N[b].tick)?N[b].tick.value:N[b].tickValue,B=N[b].formattedLabel,I=N[b].rawLabel,X=(S=i.dataToCoord(C),[0,0,0]);D=Tr[i.dim],P=Tr[Zo[i.dim]],X[D]=X[D]=S,X[P]=O;var V=c;L&&L[C]&&L[C].textStyle&&(V=new M.Model(L[C].textStyle,c,o.ecModel));var st=wr(V.get("color"),f),U=new M.graphic.Text({style:ua(V,{text:B,fill:typeof st=="function"?st(i.type==="category"?I:i.type==="value"?C+"":C,b):st,verticalAlign:"top",align:"left"})}),Tt=e.add(U),lt=U.getBoundingRect();a.addSprite(X,[lt.width*l,lt.height*l],Tt),this.labelElements.push(U)}}if(o.get("name")){var ht=o.getModel("nameTextStyle"),Q=(X=[0,0,0],D=Tr[i.dim],P=Tr[Zo[i.dim]],wr(ht.get("color"),f)),ee=ht.get("borderColor");g=ht.get("borderWidth"),X[D]=X[D]=(s[0]+s[1])/2,X[P]=o.get("nameGap"),U=new M.graphic.Text({style:ua(ht,{text:o.get("name"),fill:Q,stroke:ee,lineWidth:g})}),Tt=e.add(U),lt=U.getBoundingRect(),a.addSprite(X,[lt.width*l,lt.height*l],Tt),U.__idx=this.labelElements.length,this.nameLabelElement=U}this.labelsMesh.material.set("textureAtlas",e.getTexture()),this.labelsMesh.material.set("uvScale",e.getCoordsScale()),n.convertToTypedArray(),a.convertToTypedArray()},qo.prototype.setSpriteAlign=function(t,e,r){for(var i=r.getDevicePixelRatio(),n=this.labelsMesh.geometry,a=0;a<this.labelElements.length;a++){var o=this.labelElements[a].getBoundingRect();n.setSpriteAlign(a,[o.width*i,o.height*i],t,e)}var s=this.nameLabelElement;s&&(o=s.getBoundingRect(),n.setSpriteAlign(s.__idx,[o.width*i,o.height*i],t,e),n.dirty()),this.textAlign=t,this.textVerticalAlign=e};let gd=qo,fa=`@export ecgl.lines3D.vertex

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

@end`;var mu=J;T.Shader.import(fa);var Sr={x:0,y:2,z:1};let _d=M.ComponentView.extend({type:"grid3D",__ecgl__:!0,init:function(t,e){var r=new T.Material({shader:T.createShader("ecgl.color"),depthMask:!1,transparent:!0}),i=new T.Material({shader:T.createShader("ecgl.meshLines3D"),depthMask:!1,transparent:!0});r.define("fragment","DOUBLE_SIDED"),r.define("both","VERTEX_COLOR"),this.groupGL=new T.Node,this._control=new ha({zr:e.getZr()}),this._control.init(),this._faces=[["y","z","x",-1,"left"],["y","z","x",1,"right"],["x","y","z",-1,"bottom"],["x","y","z",1,"top"],["x","z","y",-1,"far"],["x","z","y",1,"near"]].map((function(a){var o=new pd(a,i,r);return this.groupGL.add(o.rootNode),o}),this),this._axes=["x","y","z"].map((function(a){var o=new gd(a,i);return this.groupGL.add(o.rootNode),o}),this);var n=e.getDevicePixelRatio();this._axisLabelSurface=new Ho({width:256,height:256,devicePixelRatio:n}),this._axisLabelSurface.onupdate=function(){e.getZr().refresh()},this._axisPointerLineMesh=new T.Mesh({geometry:new xr({useNativeLine:!1}),material:i,castShadow:!1,ignorePicking:!0,renderOrder:3}),this.groupGL.add(this._axisPointerLineMesh),this._axisPointerLabelsSurface=new Ho({width:128,height:128,devicePixelRatio:n}),this._axisPointerLabelsMesh=new Xo({ignorePicking:!0,renderOrder:4,castShadow:!1}),this._axisPointerLabelsMesh.material.set("textureAtlas",this._axisPointerLabelsSurface.getTexture()),this.groupGL.add(this._axisPointerLabelsMesh),this._lightRoot=new T.Node,this._sceneHelper=new li,this._sceneHelper.initLight(this._lightRoot)},render:function(t,e,r){this._model=t,this._api=r;var i=t.coordinateSystem;i.viewGL.add(this._lightRoot),t.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL);var n=this._control;n.setViewGL(i.viewGL);var a=t.getModel("viewControl");n.setFromViewControlModel(a,0),this._axisLabelSurface.clear(),n.off("update"),t.get("show")&&(this._faces.forEach((function(o){o.update(t,e,r)}),this),this._axes.forEach((function(o){o.update(t,this._axisLabelSurface,r)}),this)),n.on("update",this._onCameraChange.bind(this,t,r),this),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(t),i.viewGL.setPostEffect(t.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling")),this._initMouseHandler(t)},afterRender:function(t,e,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r)},showAxisPointer:function(t,e,r,i){this._doShowAxisPointer(),this._updateAxisPointer(i.value)},hideAxisPointer:function(t,e,r,i){this._doHideAxisPointer()},_initMouseHandler:function(t){var e=t.coordinateSystem.viewGL;t.get("show")&&t.get("axisPointer.show")?e.on("mousemove",this._updateAxisPointerOnMousePosition,this):e.off("mousemove",this._updateAxisPointerOnMousePosition)},_updateAxisPointerOnMousePosition:function(t){if(!t.target){for(var e,r=this._model.coordinateSystem,i=r.viewGL,n=i.castRay(t.offsetX,t.offsetY,new T.Ray),a=0;a<this._faces.length;a++){var o=this._faces[a];if(!o.rootNode.invisible){o.plane.normal.dot(i.camera.worldTransform.z)<0&&o.plane.normal.negate();var s=n.intersectPlane(o.plane);if(s){var l=r.getAxis(o.faceInfo[0]),u=r.getAxis(o.faceInfo[1]),h=Sr[o.faceInfo[0]],c=Sr[o.faceInfo[1]];l.contain(s.array[h])&&u.contain(s.array[c])&&(e=s)}}}if(e){var f=r.pointToData(e.array,[],!0);this._updateAxisPointer(f),this._doShowAxisPointer()}else this._doHideAxisPointer()}},_onCameraChange:function(t,e){t.get("show")&&(this._updateFaceVisibility(),this._updateAxisLinePosition());var r=this._control;e.dispatchAction({type:"grid3DChangeCamera",alpha:r.getAlpha(),beta:r.getBeta(),distance:r.getDistance(),center:r.getCenter(),from:this.uid,grid3DId:t.id})},_updateFaceVisibility:function(){var t=this._control.getCamera(),e=new T.Vector3;t.update();for(var r=0;r<this._faces.length/2;r++){for(var i=[],n=0;n<2;n++)this._faces[2*r+n].rootNode.getWorldPosition(e),e.transformMat4(t.viewMatrix),i[n]=e.z;var a=i[0]>i[1]?0:1,o=this._faces[2*r+a],s=this._faces[2*r+1-a];o.rootNode.invisible=!0,s.rootNode.invisible=!1}},_updateAxisLinePosition:function(){var t=this._model.coordinateSystem,e=t.getAxis("x"),r=t.getAxis("y"),i=t.getAxis("z"),n=i.getExtentMax(),a=i.getExtentMin(),o=e.getExtentMin(),s=e.getExtentMax(),l=r.getExtentMax(),u=r.getExtentMin(),h=this._axes[0].rootNode,c=this._axes[1].rootNode,f=this._axes[2].rootNode,p=this._faces,d=p[4].rootNode.invisible?u:l,m=p[2].rootNode.invisible?n:a,g=p[0].rootNode.invisible?o:s,_=p[2].rootNode.invisible?n:a,y=p[0].rootNode.invisible?s:o,x=p[4].rootNode.invisible?u:l;h.rotation.identity(),c.rotation.identity(),f.rotation.identity(),p[4].rootNode.invisible&&(this._axes[0].flipped=!0,h.rotation.rotateX(Math.PI)),p[0].rootNode.invisible&&(this._axes[1].flipped=!0,c.rotation.rotateZ(Math.PI)),p[4].rootNode.invisible&&(this._axes[2].flipped=!0,f.rotation.rotateY(Math.PI)),h.position.set(0,m,d),c.position.set(g,_,0),f.position.set(y,0,x),h.update(),c.update(),f.update(),this._updateAxisLabelAlign()},_updateAxisLabelAlign:function(){var t=this._control.getCamera(),e=[new T.Vector4,new T.Vector4],r=new T.Vector4;this.groupGL.getWorldPosition(r),r.w=1,r.transformMat4(t.viewMatrix).transformMat4(t.projectionMatrix),r.x/=r.w,r.y/=r.w,this._axes.forEach((function(i){for(var n=i.axisLineCoords,a=(i.labelsMesh.geometry,0);a<e.length;a++)e[a].setArray(n[a]),e[a].w=1,e[a].transformMat4(i.rootNode.worldTransform).transformMat4(t.viewMatrix).transformMat4(t.projectionMatrix),e[a].x/=e[a].w,e[a].y/=e[a].w;var o,s,l=e[1].x-e[0].x,u=e[1].y-e[0].y,h=(e[1].x+e[0].x)/2,c=(e[1].y+e[0].y)/2;Math.abs(u/l)<.5?(o="center",s=c>r.y?"bottom":"top"):(s="middle",o=h>r.x?"left":"right"),i.setSpriteAlign(o,s,this._api)}),this)},_doShowAxisPointer:function(){this._axisPointerLineMesh.invisible&&(this._axisPointerLineMesh.invisible=!1,this._axisPointerLabelsMesh.invisible=!1,this._api.getZr().refresh())},_doHideAxisPointer:function(){this._axisPointerLineMesh.invisible||(this._axisPointerLineMesh.invisible=!0,this._axisPointerLabelsMesh.invisible=!0,this._api.getZr().refresh())},_updateAxisPointer:function(t){var e=this._model.coordinateSystem,r=e.dataToPoint(t),i=this._axisPointerLineMesh.geometry,n=this._model.getModel("axisPointer"),a=this._api.getDevicePixelRatio();function o(S){return J(S.model.get("axisPointer.show"),n.get("show"))}function s(S){var A=S.model.getModel("axisPointer",n).getModel("lineStyle"),D=T.parseColor(A.get("color")),P=mu(A.get("width"),1),L=mu(A.get("opacity"),1);return D[3]*=L,{color:D,lineWidth:P}}i.convertToDynamicArray(!0);for(var l=0;l<this._faces.length;l++){var u=this._faces[l];if(!u.rootNode.invisible){for(var h=u.faceInfo,c=h[3]<0?e.getAxis(h[2]).getExtentMin():e.getAxis(h[2]).getExtentMax(),f=Sr[h[2]],p=0;p<2;p++){var d=h[p],m=h[1-p],g=e.getAxis(d),_=e.getAxis(m);if(o(g)){var y=Sr[d],x=Sr[m];(b=[0,0,0])[y]=(w=[0,0,0])[y]=r[y],b[f]=w[f]=c,b[x]=_.getExtentMin(),w[x]=_.getExtentMax();var v=s(g);i.addLine(b,w,v.color,v.lineWidth*a)}}if(o(e.getAxis(h[2]))){var w,b=r.slice();(w=r.slice())[f]=c,v=s(e.getAxis(h[2])),i.addLine(b,w,v.color,v.lineWidth*a)}}}i.convertToTypedArray(),this._updateAxisPointerLabelsMesh(t),this._api.getZr().refresh()},_updateAxisPointerLabelsMesh:function(t){var e=this._model,r=this._axisPointerLabelsMesh,i=this._axisPointerLabelsSurface,n=e.coordinateSystem,a=e.getModel("axisPointer");r.geometry.convertToDynamicArray(!0),i.clear();var o={x:"y",y:"x",z:"y"};this._axes.forEach((function(s,l){var u=n.getAxis(s.dim),h=u.model.getModel("axisPointer",a),c=h.getModel("label"),f=h.get("lineStyle.color");if(c.get("show")&&h.get("show")){var p=t[l],d=c.get("formatter"),m=u.scale.getLabel({value:p});if(d!=null)m=d(m,t);else if(u.scale.type==="interval"||u.scale.type==="log"){var g=M.number.getPrecisionSafe(u.scale.getTicks()[0]);m=p.toFixed(g+2)}var _=c.get("color"),y=new M.graphic.Text({style:ua(c,{text:m,fill:_||f,align:"left",verticalAlign:"top"})}),x=i.add(y),v=y.getBoundingRect(),w=this._api.getDevicePixelRatio(),b=s.rootNode.position.toArray();b[Sr[o[s.dim]]]+=(s.flipped?-1:1)*c.get("margin"),b[Sr[s.dim]]=u.dataToCoord(t[l]),r.geometry.addSprite(b,[v.width*w,v.height*w],x,s.textAlign,s.textVerticalAlign)}}),this),i.getZr().refreshImmediately(),r.material.set("uvScale",i.getCoordsScale()),r.geometry.convertToTypedArray()},dispose:function(){this.groupGL.removeAll(),this._control.dispose(),this._axisLabelSurface.dispose(),this._axisPointerLabelsSurface.dispose()}}),gu=(function(){function t(e){this.type="cartesian",this._dimList=[],this._axes={},this.name=e||""}return t.prototype.getAxis=function(e){return this._axes[e]},t.prototype.getAxes=function(){return Po(this._dimList,(function(e){return this._axes[e]}),this)},t.prototype.getAxesByScale=function(e){return e=e.toLowerCase(),(function(r,i,n){if(!r)return[];if(!i)return Vl(r);if(r.filter&&r.filter===Qc)return r.filter(i,n);for(var a=[],o=0,s=r.length;o<s;o++)i.call(n,r[o],o,r)&&a.push(r[o]);return a})(this.getAxes(),(function(r){return r.scale.type===e}))},t.prototype.addAxis=function(e){var r=e.dim;this._axes[r]=e,this._dimList.push(r)},t})();function pa(t){gu.call(this,t),this.type="cartesian3D",this.dimensions=["x","y","z"],this.size=[0,0,0]}pa.prototype={constructor:pa,model:null,containPoint:function(t){return this.getAxis("x").contain(t[0])&&this.getAxis("y").contain(t[2])&&this.getAxis("z").contain(t[1])},containData:function(t){return this.getAxis("x").containData(t[0])&&this.getAxis("y").containData(t[1])&&this.getAxis("z").containData(t[2])},dataToPoint:function(t,e,r){return(e=e||[])[0]=this.getAxis("x").dataToCoord(t[0],r),e[2]=this.getAxis("y").dataToCoord(t[1],r),e[1]=this.getAxis("z").dataToCoord(t[2],r),e},pointToData:function(t,e,r){return(e=e||[])[0]=this.getAxis("x").coordToData(t[0],r),e[1]=this.getAxis("y").coordToData(t[2],r),e[2]=this.getAxis("z").coordToData(t[1],r),e}},M.util.inherits(pa,gu);let _u=pa;function ma(t,e,r){M.Axis.call(this,t,e,r)}ma.prototype={constructor:ma,getExtentMin:function(){var t=this._extent;return Math.min(t[0],t[1])},getExtentMax:function(){var t=this._extent;return Math.max(t[0],t[1])},calculateCategoryInterval:function(){return Math.floor(this.scale.count()/8)}},M.util.inherits(ma,M.Axis);let vd=ma;function vu(t,e,r){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+r[0],t[5]=e[5]+r[1],t}let Zt=(function(){function t(e,r){this.x=e||0,this.y=r||0}return t.prototype.copy=function(e){return this.x=e.x,this.y=e.y,this},t.prototype.clone=function(){return new t(this.x,this.y)},t.prototype.set=function(e,r){return this.x=e,this.y=r,this},t.prototype.equal=function(e){return e.x===this.x&&e.y===this.y},t.prototype.add=function(e){return this.x+=e.x,this.y+=e.y,this},t.prototype.scale=function(e){this.x*=e,this.y*=e},t.prototype.scaleAndAdd=function(e,r){this.x+=e.x*r,this.y+=e.y*r},t.prototype.sub=function(e){return this.x-=e.x,this.y-=e.y,this},t.prototype.dot=function(e){return this.x*e.x+this.y*e.y},t.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},t.prototype.lenSquare=function(){return this.x*this.x+this.y*this.y},t.prototype.normalize=function(){var e=this.len();return this.x/=e,this.y/=e,this},t.prototype.distance=function(e){var r=this.x-e.x,i=this.y-e.y;return Math.sqrt(r*r+i*i)},t.prototype.distanceSquare=function(e){var r=this.x-e.x,i=this.y-e.y;return r*r+i*i},t.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},t.prototype.transform=function(e){if(e){var r=this.x,i=this.y;return this.x=e[0]*r+e[2]*i+e[4],this.y=e[1]*r+e[3]*i+e[5],this}},t.prototype.toArray=function(e){return e[0]=this.x,e[1]=this.y,e},t.prototype.fromArray=function(e){this.x=e[0],this.y=e[1]},t.set=function(e,r,i){e.x=r,e.y=i},t.copy=function(e,r){e.x=r.x,e.y=r.y},t.len=function(e){return Math.sqrt(e.x*e.x+e.y*e.y)},t.lenSquare=function(e){return e.x*e.x+e.y*e.y},t.dot=function(e,r){return e.x*r.x+e.y*r.y},t.add=function(e,r,i){e.x=r.x+i.x,e.y=r.y+i.y},t.sub=function(e,r,i){e.x=r.x-i.x,e.y=r.y-i.y},t.scale=function(e,r,i){e.x=r.x*i,e.y=r.y*i},t.scaleAndAdd=function(e,r,i,n){e.x=r.x+i.x*n,e.y=r.y+i.y*n},t.lerp=function(e,r,i,n){var a=1-n;e.x=a*r.x+n*i.x,e.y=a*r.y+n*i.y},t})();var ga=Math.min,_a=Math.max,Mr=new Zt,Ar=new Zt,Er=new Zt,Cr=new Zt,Yi=new Zt,Ki=new Zt;let yd=(function(){function t(e,r,i,n){i<0&&(e+=i,i=-i),n<0&&(r+=n,n=-n),this.x=e,this.y=r,this.width=i,this.height=n}return t.prototype.union=function(e){var r=ga(e.x,this.x),i=ga(e.y,this.y);isFinite(this.x)&&isFinite(this.width)?this.width=_a(e.x+e.width,this.x+this.width)-r:this.width=e.width,isFinite(this.y)&&isFinite(this.height)?this.height=_a(e.y+e.height,this.y+this.height)-i:this.height=e.height,this.x=r,this.y=i},t.prototype.applyTransform=function(e){t.applyTransform(this,this,e)},t.prototype.calculateTransform=function(e){var r=this,i=e.width/r.width,n=e.height/r.height,a=[1,0,0,1,0,0];return vu(a,a,[-r.x,-r.y]),(function(o,s,l){var u=l[0],h=l[1];o[0]=s[0]*u,o[1]=s[1]*h,o[2]=s[2]*u,o[3]=s[3]*h,o[4]=s[4]*u,o[5]=s[5]*h})(a,a,[i,n]),vu(a,a,[e.x,e.y]),a},t.prototype.intersect=function(e,r){if(!e)return!1;e instanceof t||(e=t.create(e));var i=this,n=i.x,a=i.x+i.width,o=i.y,s=i.y+i.height,l=e.x,u=e.x+e.width,h=e.y,c=e.y+e.height,f=!(a<l||u<n||s<h||c<o);if(r){var p=1/0,d=0,m=Math.abs(a-l),g=Math.abs(u-n),_=Math.abs(s-h),y=Math.abs(c-o),x=Math.min(m,g),v=Math.min(_,y);a<l||u<n?x>d&&(d=x,m<g?Zt.set(Ki,-m,0):Zt.set(Ki,g,0)):x<p&&(p=x,m<g?Zt.set(Yi,m,0):Zt.set(Yi,-g,0)),s<h||c<o?v>d&&(d=v,_<y?Zt.set(Ki,0,-_):Zt.set(Ki,0,y)):x<p&&(p=x,_<y?Zt.set(Yi,0,_):Zt.set(Yi,0,-y))}return r&&Zt.copy(r,f?Yi:Ki),f},t.prototype.contain=function(e,r){var i=this;return e>=i.x&&e<=i.x+i.width&&r>=i.y&&r<=i.y+i.height},t.prototype.clone=function(){return new t(this.x,this.y,this.width,this.height)},t.prototype.copy=function(e){t.copy(this,e)},t.prototype.plain=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},t.prototype.isFinite=function(){return isFinite(this.x)&&isFinite(this.y)&&isFinite(this.width)&&isFinite(this.height)},t.prototype.isZero=function(){return this.width===0||this.height===0},t.create=function(e){return new t(e.x,e.y,e.width,e.height)},t.copy=function(e,r){e.x=r.x,e.y=r.y,e.width=r.width,e.height=r.height},t.applyTransform=function(e,r,i){if(i){if(i[1]<1e-5&&i[1]>-1e-5&&i[2]<1e-5&&i[2]>-1e-5){var n=i[0],a=i[3],o=i[4],s=i[5];return e.x=r.x*n+o,e.y=r.y*a+s,e.width=r.width*n,e.height=r.height*a,e.width<0&&(e.x+=e.width,e.width=-e.width),void(e.height<0&&(e.y+=e.height,e.height=-e.height))}Mr.x=Er.x=r.x,Mr.y=Cr.y=r.y,Ar.x=Cr.x=r.x+r.width,Ar.y=Er.y=r.y+r.height,Mr.transform(i),Cr.transform(i),Ar.transform(i),Er.transform(i),e.x=ga(Mr.x,Ar.x,Er.x,Cr.x),e.y=ga(Mr.y,Ar.y,Er.y,Cr.y);var l=_a(Mr.x,Ar.x,Er.x,Cr.x),u=_a(Mr.y,Ar.y,Er.y,Cr.y);e.width=l-e.x,e.height=u-e.y}else e!==r&&t.copy(e,r)},t})();function yu(t,e,r,i,n){var a=0,o=0;i==null&&(i=1/0),n==null&&(n=1/0);var s=0;e.eachChild((function(l,u){var h,c,f=l.getBoundingRect(),p=e.childAt(u+1),d=p&&p.getBoundingRect();if(t==="horizontal"){var m=f.width+(d?-d.x+f.x:0);(h=a+m)>i||l.newline?(a=0,h=m,o+=s+r,s=f.height):s=Math.max(s,f.height)}else{var g=f.height+(d?-d.y+f.y:0);(c=o+g)>n||l.newline?(a+=s+r,o=0,c=g,s=f.width):s=Math.max(s,f.width)}l.newline||(l.x=a,l.y=o,l.markRedraw(),t==="horizontal"?a=h+r:o=c+r)}))}function va(t,e,r){r=(function(m){if(typeof m=="number")return[m,m,m,m];var g=m.length;return g===2?[m[0],m[1],m[0],m[1]]:g===3?[m[0],m[1],m[2],m[1]]:m})(r||0);var i=e.width,n=e.height,a=si(t.left,i),o=si(t.top,n),s=si(t.right,i),l=si(t.bottom,n),u=si(t.width,i),h=si(t.height,n),c=r[2]+r[0],f=r[1]+r[3],p=t.aspect;switch(isNaN(u)&&(u=i-s-f-a),isNaN(h)&&(h=n-l-c-o),p!=null&&(isNaN(u)&&isNaN(h)&&(p>i/n?u=.8*i:h=.8*n),isNaN(u)&&(u=p*h),isNaN(h)&&(h=u/p)),isNaN(a)&&(a=i-s-u-f),isNaN(o)&&(o=n-l-h-c),t.left||t.right){case"center":a=i/2-u/2-r[3];break;case"right":a=i-u-f}switch(t.top||t.bottom){case"middle":case"center":o=n/2-h/2-r[0];break;case"bottom":o=n-h-c}a=a||0,o=o||0,isNaN(u)&&(u=i-f-a-(s||0)),isNaN(h)&&(h=n-c-o-(l||0));var d=new yd(a+r[3],o+r[0],u,h);return d.margin=r,d}ki(yu,"vertical"),ki(yu,"horizontal");var Yo=function(){this._pool={},this._allocatedTextures=[]};Yo.prototype={constructor:Yo,get:function(t){var e=bu(t);this._pool.hasOwnProperty(e)||(this._pool[e]=[]);var r=this._pool[e];if(!r.length){var i=new K(t);return this._allocatedTextures.push(i),i}return r.pop()},put:function(t){var e=bu(t);this._pool.hasOwnProperty(e)||(this._pool[e]=[]),this._pool[e].push(t)},clear:function(t){for(var e=0;e<this._allocatedTextures.length;e++)this._allocatedTextures[e].dispose(t);this._pool={},this._allocatedTextures=[]}};var xu={width:512,height:512,type:Dn,format:qa,wrapS:sr,wrapT:sr,minFilter:Ei,magFilter:Ai,useMipmap:!0,anisotropic:1,flipY:!0,unpackAlignment:4,premultiplyAlpha:!1},Ko=Object.keys(xu);function bu(t){var e,r,i,n;zt.defaultsWithPropList(t,xu,Ko),r=(e=t).width,i=e.height,n=(r&r-1)==0&&(i&i-1)==0,e.format===Pn&&(e.useMipmap=!1),n&&e.useMipmap||(e.minFilter==Za||e.minFilter==Ka?e.minFilter=Mi:e.minFilter!=Ei&&e.minFilter!=Ya||(e.minFilter=Ai)),n||(e.wrapS=sr,e.wrapT=sr);for(var a="",o=0;o<Ko.length;o++)a+=t[Ko[o]].toString();return a}let wu=Yo;var Ke=["px","nx","py","ny","pz","nz"];function Qo(t,e,r){return r==="alphaMap"?t.material.get("diffuseMap"):r==="alphaCutoff"?t.material.isDefined("fragment","ALPHA_TEST")&&t.material.get("diffuseMap")&&t.material.get("alphaCutoff")||0:r==="uvRepeat"?t.material.get("uvRepeat"):r==="uvOffset"?t.material.get("uvOffset"):e.get(r)}function Tu(t,e){var r=t.material,i=e.material;return r.get("diffuseMap")!==i.get("diffuseMap")||(r.get("alphaCutoff")||0)!==(i.get("alphaCutoff")||0)}z.import(`@export clay.sm.depth.vertex
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
@end`);var Jo,ya,Qi,$o,ui,Su,Ji,Re=jt.extend((function(){return{softShadow:Re.PCF,shadowBlur:1,lightFrustumBias:"auto",kernelPCF:new Float32Array([1,0,1,1,-1,1,0,1,-1,0,-1,-1,1,-1,0,-1]),precision:"highp",_lastRenderNotCastShadow:!1,_frameBuffer:new kt,_textures:{},_shadowMapNumber:{POINT_LIGHT:0,DIRECTIONAL_LIGHT:0,SPOT_LIGHT:0},_depthMaterials:{},_distanceMaterials:{},_receivers:[],_lightsCastShadow:[],_lightCameras:{},_lightMaterials:{},_texturePool:new wu}}),(function(){this._gaussianPassH=new Et({fragment:z.source("clay.compositor.gaussian_blur")}),this._gaussianPassV=new Et({fragment:z.source("clay.compositor.gaussian_blur")}),this._gaussianPassH.setUniform("blurSize",this.shadowBlur),this._gaussianPassH.setUniform("blurDir",0),this._gaussianPassV.setUniform("blurSize",this.shadowBlur),this._gaussianPassV.setUniform("blurDir",1),this._outputDepthPass=new Et({fragment:z.source("clay.sm.debug_depth")})}),{render:function(t,e,r,i){r||(r=e.getMainCamera()),this.trigger("beforerender",this,t,e,r),this._renderShadowPass(t,e,r,i),this.trigger("afterrender",this,t,e,r)},renderDebug:function(t,e){t.saveClear();var r=t.viewport,i=0,n=e||r.width/4,a=n;for(var o in this.softShadow===Re.VSM?this._outputDepthPass.material.define("fragment","USE_VSM"):this._outputDepthPass.material.undefine("fragment","USE_VSM"),this._textures){var s=this._textures[o];t.setViewport(i,0,n*s.width/s.height,a),this._outputDepthPass.setUniform("depthMap",s),this._outputDepthPass.render(t),i+=n*s.width/s.height}t.setViewport(r),t.restoreClear()},_updateReceivers:function(t,e){if(e.receiveShadow?(this._receivers.push(e),e.material.set("shadowEnabled",1),e.material.set("pcfKernel",this.kernelPCF)):e.material.set("shadowEnabled",0),this.softShadow===Re.VSM)e.material.define("fragment","USE_VSM"),e.material.undefine("fragment","PCF_KERNEL_SIZE");else{e.material.undefine("fragment","USE_VSM");var r=this.kernelPCF;r&&r.length?e.material.define("fragment","PCF_KERNEL_SIZE",r.length/2):e.material.undefine("fragment","PCF_KERNEL_SIZE")}},_update:function(t,e){var r=this;e.traverse((function(a){a.isRenderable()&&r._updateReceivers(t,a)}));for(var i=0;i<e.lights.length;i++){var n=e.lights[i];n.castShadow&&!n.invisible&&this._lightsCastShadow.push(n)}},_renderShadowPass:function(t,e,r,i){for(var n in this._shadowMapNumber)this._shadowMapNumber[n]=0;this._lightsCastShadow.length=0,this._receivers.length=0;var a=t.gl;if(i||e.update(),r&&r.update(),e.updateLights(),this._update(t,e),this._lightsCastShadow.length||!this._lastRenderNotCastShadow){this._lastRenderNotCastShadow=this._lightsCastShadow===0,a.enable(a.DEPTH_TEST),a.depthMask(!0),a.disable(a.BLEND),a.clearColor(1,1,1,1);for(var o,s=[],l=[],u=[],h=[],c=[],f=[],p=0;p<this._lightsCastShadow.length;p++){var d=this._lightsCastShadow[p];if(d.type==="DIRECTIONAL_LIGHT"){if(o){console.warn("Only one direectional light supported with shadow cascade");continue}if(d.shadowCascade>4){console.warn("Support at most 4 cascade");continue}d.shadowCascade>1&&(o=d),this.renderDirectionalLightShadow(t,e,r,d,c,h,u)}else d.type==="SPOT_LIGHT"?this.renderSpotLightShadow(t,e,d,l,s):d.type==="POINT_LIGHT"&&this.renderPointLightShadow(t,e,d,f);this._shadowMapNumber[d.type]++}for(var m in this._shadowMapNumber){var g=this._shadowMapNumber[m],_=m+"_SHADOWMAP_COUNT";for(p=0;p<this._receivers.length;p++)(y=this._receivers[p].material).fragmentDefines[_]!==g&&(g>0?y.define("fragment",_,g):y.isDefined("fragment",_)&&y.undefine("fragment",_))}for(p=0;p<this._receivers.length;p++){var y=this._receivers[p].material;o?y.define("fragment","SHADOW_CASCADE",o.shadowCascade):y.undefine("fragment","SHADOW_CASCADE")}var x=e.shadowUniforms;if(u.length>0){var v=u.map(A);if(x.directionalLightShadowMaps={value:u,type:"tv"},x.directionalLightMatrices={value:h,type:"m4v"},x.directionalLightShadowMapSizes={value:v,type:"1fv"},o){var w=c.slice(),b=c.slice();w.pop(),b.shift(),w.reverse(),b.reverse(),h.reverse(),x.shadowCascadeClipsNear={value:w,type:"1fv"},x.shadowCascadeClipsFar={value:b,type:"1fv"}}}if(s.length>0){var S=s.map(A);(x=e.shadowUniforms).spotLightShadowMaps={value:s,type:"tv"},x.spotLightMatrices={value:l,type:"m4v"},x.spotLightShadowMapSizes={value:S,type:"1fv"}}f.length>0&&(x.pointLightShadowMaps={value:f,type:"tv"})}function A(D){return D.height}},renderDirectionalLightShadow:(Jo=new _o,ya=new k,Qi=new Xt,$o=new k,ui=new k,Su=new k,Ji=new k,function(t,e,r,i,n,a,o){var s=this._getDepthMaterial(i),l={getMaterial:function(I){return I.shadowDepthMaterial||s},isMaterialChanged:Tu,getUniform:Qo,ifRender:function(I){return I.castShadow},sortCompare:Di.opaqueSortCompare};if(!e.viewBoundingBoxLastFrame.isFinite()){var u=e.getBoundingBox();e.viewBoundingBoxLastFrame.copy(u).applyTransform(r.viewMatrix)}var h=Math.min(-e.viewBoundingBoxLastFrame.min.z,r.far),c=Math.max(-e.viewBoundingBoxLastFrame.max.z,r.near),f=this._getDirectionalLightCamera(i,e,r),p=Su.array;Ji.copy(f.projectionMatrix),R.invert(ui.array,f.worldTransform.array),R.multiply(ui.array,ui.array,r.worldTransform.array),R.multiply(p,Ji.array,ui.array);for(var d=[],m=r instanceof It,g=(r.near+r.far)/(r.near-r.far),_=2*r.near*r.far/(r.near-r.far),y=0;y<=i.shadowCascade;y++){var x=c*Math.pow(h/c,y/i.shadowCascade),v=c+(h-c)*y/i.shadowCascade,w=x*i.cascadeSplitLogFactor+v*(1-i.cascadeSplitLogFactor);d.push(w),n.push(-(-w*g+_)/-w)}var b=this._getTexture(i,i.shadowCascade);o.push(b);var S=t.viewport,A=t.gl;for(this._frameBuffer.attach(b),this._frameBuffer.bind(t),A.clear(A.COLOR_BUFFER_BIT|A.DEPTH_BUFFER_BIT),y=0;y<i.shadowCascade;y++){var D=d[y],P=d[y+1];m?R.perspective(ya.array,r.fov/180*Math.PI,r.aspect,D,P):R.ortho(ya.array,r.left,r.right,r.bottom,r.top,D,P),Jo.setFromProjection(ya),Jo.getTransformedBoundingBox(Qi,ui),Qi.applyProjection(Ji);var L=Qi.min.array,O=Qi.max.array;L[0]=Math.max(L[0],-1),L[1]=Math.max(L[1],-1),O[0]=Math.min(O[0],1),O[1]=Math.min(O[1],1),$o.ortho(L[0],O[0],L[1],O[1],1,-1),f.projectionMatrix.multiplyLeft($o);var N=i.shadowResolution||512;t.setViewport((i.shadowCascade-y-1)*N,0,N,N,1);var C=e.updateRenderList(f);t.renderPass(C.opaque,f,l),this.softShadow===Re.VSM&&this._gaussianFilter(t,b,b.width);var B=new k;B.copy(f.viewMatrix).multiplyLeft(f.projectionMatrix),a.push(B.array),f.projectionMatrix.copy(Ji)}this._frameBuffer.unbind(t),t.setViewport(S)}),renderSpotLightShadow:function(t,e,r,i,n){var a=this._getTexture(r),o=this._getSpotLightCamera(r),s=t.gl;this._frameBuffer.attach(a),this._frameBuffer.bind(t),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT);var l=this._getDepthMaterial(r),u={getMaterial:function(f){return f.shadowDepthMaterial||l},isMaterialChanged:Tu,getUniform:Qo,ifRender:function(f){return f.castShadow},sortCompare:Di.opaqueSortCompare},h=e.updateRenderList(o);t.renderPass(h.opaque,o,u),this._frameBuffer.unbind(t),this.softShadow===Re.VSM&&this._gaussianFilter(t,a,a.width);var c=new k;c.copy(o.worldTransform).invert().multiplyLeft(o.projectionMatrix),n.push(a),i.push(c.array)},renderPointLightShadow:function(t,e,r,i){var n=this._getTexture(r),a=t.gl;i.push(n);var o=this._getDepthMaterial(r),s={getMaterial:function(y){return y.shadowDepthMaterial||o},getUniform:Qo,sortCompare:Di.opaqueSortCompare},l={px:[],py:[],pz:[],nx:[],ny:[],nz:[]},u=new Xt,h=r.getWorldPosition().array,c=new Xt,f=r.range;c.min.setArray(h),c.max.setArray(h);var p=new F(f,f,f);c.max.add(p),c.min.sub(p);var d={px:!1,py:!1,pz:!1,nx:!1,ny:!1,nz:!1};e.traverse((function(y){if(y.isRenderable()&&y.castShadow){var x=y.geometry;if(!x.boundingBox){for(var v=0;v<Ke.length;v++)l[Ke[v]].push(y);return}if(u.transformFrom(x.boundingBox,y.worldTransform),!u.intersectBoundingBox(c))return;for(u.updateVertices(),v=0;v<Ke.length;v++)d[Ke[v]]=!1;for(v=0;v<8;v++){var w=u.vertices[v],b=w[0]-h[0],S=w[1]-h[1],A=w[2]-h[2],D=Math.abs(b),P=Math.abs(S),L=Math.abs(A);D>P?D>L?d[b>0?"px":"nx"]=!0:d[A>0?"pz":"nz"]=!0:P>L?d[S>0?"py":"ny"]=!0:d[A>0?"pz":"nz"]=!0}for(v=0;v<Ke.length;v++)d[Ke[v]]&&l[Ke[v]].push(y)}}));for(var m=0;m<6;m++){var g=Ke[m],_=this._getPointLightCamera(r,g);this._frameBuffer.attach(n,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+m),this._frameBuffer.bind(t),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),t.renderPass(l[g],_,s)}this._frameBuffer.unbind(t)},_getDepthMaterial:function(t){var e=this._lightMaterials[t.__uid__],r=t.type==="POINT_LIGHT";if(!e){var i=r?"clay.sm.distance.":"clay.sm.depth.";e=new he({precision:this.precision,shader:new z(z.source(i+"vertex"),z.source(i+"fragment"))}),this._lightMaterials[t.__uid__]=e}return t.shadowSlopeScale!=null&&e.setUniform("slopeScale",t.shadowSlopeScale),t.shadowBias!=null&&e.setUniform("bias",t.shadowBias),this.softShadow===Re.VSM?e.define("fragment","USE_VSM"):e.undefine("fragment","USE_VSM"),r&&(e.set("lightPosition",t.getWorldPosition().array),e.set("range",t.range)),e},_gaussianFilter:function(t,e,r){var i={width:r,height:r,type:H.FLOAT},n=this._texturePool.get(i);this._frameBuffer.attach(n),this._frameBuffer.bind(t),this._gaussianPassH.setUniform("texture",e),this._gaussianPassH.setUniform("textureWidth",r),this._gaussianPassH.render(t),this._frameBuffer.attach(e),this._gaussianPassV.setUniform("texture",n),this._gaussianPassV.setUniform("textureHeight",r),this._gaussianPassV.render(t),this._frameBuffer.unbind(t),this._texturePool.put(n)},_getTexture:function(t,e){var r=t.__uid__,i=this._textures[r],n=t.shadowResolution||512;return e=e||1,i||((i=t.type==="POINT_LIGHT"?new Ri:new K).width=n*e,i.height=n,this.softShadow===Re.VSM?(i.type=H.FLOAT,i.anisotropic=4):(i.minFilter=Mi,i.magFilter=Mi,i.useMipmap=!1),this._textures[r]=i),i},_getPointLightCamera:function(t,e){this._lightCameras.point||(this._lightCameras.point={px:new It,nx:new It,py:new It,ny:new It,pz:new It,nz:new It});var r=this._lightCameras.point[e];switch(r.far=t.range,r.fov=90,r.position.set(0,0,0),e){case"px":r.lookAt(F.POSITIVE_X,F.NEGATIVE_Y);break;case"nx":r.lookAt(F.NEGATIVE_X,F.NEGATIVE_Y);break;case"py":r.lookAt(F.POSITIVE_Y,F.POSITIVE_Z);break;case"ny":r.lookAt(F.NEGATIVE_Y,F.NEGATIVE_Z);break;case"pz":r.lookAt(F.POSITIVE_Z,F.NEGATIVE_Y);break;case"nz":r.lookAt(F.NEGATIVE_Z,F.NEGATIVE_Y)}return t.getWorldPosition(r.position),r.update(),r},_getDirectionalLightCamera:(function(){var t=new k,e=new Xt,r=new Xt;return function(i,n,a){this._lightCameras.directional||(this._lightCameras.directional=new ei);var o=this._lightCameras.directional;e.copy(n.viewBoundingBoxLastFrame),e.intersection(a.frustum.boundingBox),o.position.copy(e.min).add(e.max).scale(.5).transformMat4(a.worldTransform),o.rotation.copy(i.rotation),o.scale.copy(i.scale),o.updateWorldTransform(),k.invert(t,o.worldTransform),k.multiply(t,t,a.worldTransform),r.copy(e).applyTransform(t);var s=r.min.array,l=r.max.array;return o.position.set((s[0]+l[0])/2,(s[1]+l[1])/2,l[2]).transformMat4(o.worldTransform),o.near=0,o.far=-s[2]+l[2],isNaN(this.lightFrustumBias)?o.far*=4:o.far+=this.lightFrustumBias,o.left=s[0],o.right=l[0],o.top=l[1],o.bottom=s[1],o.update(!0),o}})(),_getSpotLightCamera:function(t){this._lightCameras.spot||(this._lightCameras.spot=new It);var e=this._lightCameras.spot;return e.fov=2*t.penumbraAngle,e.far=t.range,e.worldTransform.copy(t.worldTransform),e.updateProjectionMatrix(),R.invert(e.viewMatrix.array,e.worldTransform.array),e},dispose:function(t){var e=t.gl||t;for(var r in this._frameBuffer&&this._frameBuffer.dispose(e),this._textures)this._textures[r].dispose(e);this._texturePool.clear(t.gl),this._depthMaterials={},this._distanceMaterials={},this._textures={},this._lightCameras={},this._shadowMapNumber={POINT_LIGHT:0,DIRECTIONAL_LIGHT:0,SPOT_LIGHT:0},this._meshMaterials={};for(var i=0;i<this._receivers.length;i++){var n=this._receivers[i];if(n.material){var a=n.material;a.undefine("fragment","POINT_LIGHT_SHADOW_COUNT"),a.undefine("fragment","DIRECTIONAL_LIGHT_SHADOW_COUNT"),a.undefine("fragment","AMBIENT_LIGHT_SHADOW_COUNT"),a.set("shadowEnabled",0)}}this._receivers=[],this._lightsCastShadow=[]}});Re.VSM=1,Re.PCF=2;let xd=Re,$i=jt.extend((function(){return{name:"",inputLinks:{},outputLinks:{},_prevOutputTextures:{},_outputTextures:{},_outputReferences:{},_rendering:!1,_rendered:!1,_compositor:null}}),{updateParameter:function(t,e){var r,i,n=this.outputs[t],a=n.parameters,o=n._parametersCopy;if(o||(o=n._parametersCopy={}),a)for(var s in a)s!=="width"&&s!=="height"&&(o[s]=a[s]);return r=a.width instanceof Function?a.width.call(this,e):a.width,i=a.height instanceof Function?a.height.call(this,e):a.height,o.width===r&&o.height===i||this._outputTextures[t]&&this._outputTextures[t].dispose(e.gl),o.width=r,o.height=i,o},setParameter:function(t,e){},getParameter:function(t){},setParameters:function(t){for(var e in t)this.setParameter(e,t[e])},render:function(){},getOutput:function(t,e){if(e==null)return e=t,this._outputTextures[e];var r=this.outputs[e];return r?this._rendered?r.outputLastFrame?this._prevOutputTextures[e]:this._outputTextures[e]:this._rendering?(this._prevOutputTextures[e]||(this._prevOutputTextures[e]=this._compositor.allocateTexture(r.parameters||{})),this._prevOutputTextures[e]):(this.render(t),this._outputTextures[e]):void 0},removeReference:function(t){this._outputReferences[t]--,this._outputReferences[t]===0&&(this.outputs[t].keepLastFrame?(this._prevOutputTextures[t]&&this._compositor.releaseTexture(this._prevOutputTextures[t]),this._prevOutputTextures[t]=this._outputTextures[t]):this._compositor.releaseTexture(this._outputTextures[t]))},link:function(t,e,r){this.inputLinks[t]={node:e,pin:r},e.outputLinks[r]||(e.outputLinks[r]=[]),e.outputLinks[r].push({node:this,pin:t}),this.pass.material.enableTexture(t)},clear:function(){this.inputLinks={},this.outputLinks={}},updateReference:function(t){if(!this._rendering){for(var e in this._rendering=!0,this.inputLinks){var r=this.inputLinks[e];r.node.updateReference(r.pin)}this._rendering=!1}t&&this._outputReferences[t]++},beforeFrame:function(){for(var t in this._rendered=!1,this.outputLinks)this._outputReferences[t]=0},afterFrame:function(){for(var t in this.outputLinks)this._outputReferences[t]>0&&(this.outputs[t].keepLastFrame?(this._prevOutputTextures[t]&&this._compositor.releaseTexture(this._prevOutputTextures[t]),this._prevOutputTextures[t]=this._outputTextures[t]):this._compositor.releaseTexture(this._outputTextures[t]))}}),Mu=jt.extend((function(){return{nodes:[]}}),{dirty:function(){this._dirty=!0},addNode:function(t){this.nodes.indexOf(t)>=0||(this.nodes.push(t),this._dirty=!0)},removeNode:function(t){typeof t=="string"&&(t=this.getNodeByName(t));var e=this.nodes.indexOf(t);e>=0&&(this.nodes.splice(e,1),this._dirty=!0)},getNodeByName:function(t){for(var e=0;e<this.nodes.length;e++)if(this.nodes[e].name===t)return this.nodes[e]},update:function(){for(var t=0;t<this.nodes.length;t++)this.nodes[t].clear();for(t=0;t<this.nodes.length;t++){var e=this.nodes[t];if(e.inputs){for(var r in e.inputs)if(e.inputs[r])if(!e.pass||e.pass.material.isUniformEnabled(r)){var i=e.inputs[r],n=this.findPin(i);n?e.link(r,n.node,n.pin):console.warn(typeof i=="string"?"Node "+i+" not exist":"Pin of "+i.node+"."+i.pin+" not exist")}else console.warn("Pin "+e.name+"."+r+" not used.")}}},findPin:function(t){var e;if((typeof t=="string"||t instanceof $i)&&(t={node:t}),typeof t.node=="string")for(var r=0;r<this.nodes.length;r++){var i=this.nodes[r];i.name===t.node&&(e=i)}else e=t.node;if(e){var n=t.pin;if(n||e.outputs&&(n=Object.keys(e.outputs)[0]),e.outputs[n])return{node:e,pin:n}}}}),bd=Mu.extend((function(){return{_outputs:[],_texturePool:new wu,_frameBuffer:new kt({depthBuffer:!1})}}),{addNode:function(t){Mu.prototype.addNode.call(this,t),t._compositor=this},render:function(t,e){if(this._dirty){this.update(),this._dirty=!1,this._outputs.length=0;for(var r=0;r<this.nodes.length;r++)this.nodes[r].outputs||this._outputs.push(this.nodes[r])}for(r=0;r<this.nodes.length;r++)this.nodes[r].beforeFrame();for(r=0;r<this._outputs.length;r++)this._outputs[r].updateReference();for(r=0;r<this._outputs.length;r++)this._outputs[r].render(t,e);for(r=0;r<this.nodes.length;r++)this.nodes[r].afterFrame()},allocateTexture:function(t){return this._texturePool.get(t)},releaseTexture:function(t){this._texturePool.put(t)},getFrameBuffer:function(){return this._frameBuffer},dispose:function(t){this._texturePool.clear(t)}}),wd=$i.extend({name:"scene",scene:null,camera:null,autoUpdateScene:!0,preZ:!1},(function(){this.frameBuffer=new kt}),{render:function(t){this._rendering=!0;var e,r=t.gl;if(this.trigger("beforerender"),this.outputs){var i=this.frameBuffer;for(var n in this.outputs){var a=this.updateParameter(n,t),o=this.outputs[n],s=this._compositor.allocateTexture(a);this._outputTextures[n]=s,typeof(h=o.attachment||r.COLOR_ATTACHMENT0)=="string"&&(h=r[h]),i.attach(s,h)}i.bind(t);var l=t.getGLExtension("EXT_draw_buffers");if(l){var u=[];for(var h in this.outputs)(h=parseInt(h))>=r.COLOR_ATTACHMENT0&&h<=r.COLOR_ATTACHMENT0+8&&u.push(h);l.drawBuffersEXT(u)}t.saveClear(),t.clearBit=16640,e=t.render(this.scene,this.camera,!this.autoUpdateScene,this.preZ),t.restoreClear(),i.unbind(t)}else e=t.render(this.scene,this.camera,!this.autoUpdateScene,this.preZ);this.trigger("afterrender",e),this._rendering=!1,this._rendered=!0}}),Td=$i.extend((function(){return{texture:null,outputs:{color:{}}}}),(function(){}),{getOutput:function(t,e){return this.texture},beforeFrame:function(){},afterFrame:function(){}}),Sd=$i.extend((function(){return{name:"",inputs:{},outputs:null,shader:"",inputLinks:{},outputLinks:{},pass:null,_prevOutputTextures:{},_outputTextures:{},_outputReferences:{},_rendering:!1,_rendered:!1,_compositor:null}}),(function(){var t=new Et({fragment:this.shader});this.pass=t}),{render:function(t,e){this.trigger("beforerender",t),this._rendering=!0;var r=t.gl;for(var i in this.inputLinks){var n=(c=this.inputLinks[i]).node.getOutput(t,c.pin);this.pass.setUniform(i,n)}if(this.outputs){this.pass.outputs={};var a={};for(var o in this.outputs){var s=this.updateParameter(o,t);isNaN(s.width)&&this.updateParameter(o,t);var l=this.outputs[o],u=this._compositor.allocateTexture(s);this._outputTextures[o]=u,typeof(h=l.attachment||r.COLOR_ATTACHMENT0)=="string"&&(h=r[h]),a[h]=u}for(var h in this._compositor.getFrameBuffer().bind(t),a)this._compositor.getFrameBuffer().attach(a[h],h);this.pass.render(t),this._compositor.getFrameBuffer().updateMipmap(t)}else this.pass.outputs=null,this._compositor.getFrameBuffer().unbind(t),this.pass.render(t,e);for(var i in this.inputLinks){var c;(c=this.inputLinks[i]).node.removeReference(c.pin)}this._rendering=!1,this._rendered=!0,this.trigger("afterrender",t)},updateParameter:function(t,e){var r,i,n=this.outputs[t],a=n.parameters,o=n._parametersCopy;if(o||(o=n._parametersCopy={}),a)for(var s in a)s!=="width"&&s!=="height"&&(o[s]=a[s]);return r=typeof a.width=="function"?a.width.call(this,e):a.width,i=typeof a.height=="function"?a.height.call(this,e):a.height,r=Math.ceil(r),i=Math.ceil(i),o.width===r&&o.height===i||this._outputTextures[t]&&this._outputTextures[t].dispose(e),o.width=r,o.height=i,o},setParameter:function(t,e){this.pass.setUniform(t,e)},getParameter:function(t){return this.pass.getUniform(t)},setParameters:function(t){for(var e in t)this.setParameter(e,t[e])},define:function(t,e){this.pass.material.define("fragment",t,e)},undefine:function(t){this.pass.material.undefine("fragment",t)},removeReference:function(t){this._outputReferences[t]--,this._outputReferences[t]===0&&(this.outputs[t].keepLastFrame?(this._prevOutputTextures[t]&&this._compositor.releaseTexture(this._prevOutputTextures[t]),this._prevOutputTextures[t]=this._outputTextures[t]):this._compositor.releaseTexture(this._outputTextures[t]))},clear:function(){$i.prototype.clear.call(this),this.pass.material.disableTexturesAll()}}),Au=`@export clay.compositor.kernel.gaussian_9
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
`,Eu=`
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
@end`,Cu=`@export clay.compositor.output
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
@end`,Du=`@export clay.compositor.bright
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
`,Lu=`@export clay.compositor.downsample
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
@end`,Pu=`
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
@end`,Ou=`@export clay.compositor.hdr.composite
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
@end`,Nu=`@export clay.compositor.blend
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
@end`,Iu=`@export clay.compositor.fxaa
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
@end`;(function(t){t.import(`@export clay.compositor.coloradjust
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
@end`),t.import(Au),t.import(`@export clay.compositor.hdr.log_lum
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
@end`),t.import(Eu),t.import(`@export clay.compositor.vignette
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
@end`),t.import(Cu),t.import(Du),t.import(Lu),t.import(Pu),t.import(Ou),t.import(`@export clay.compositor.lensflare
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
@end`),t.import(Nu),t.import(Iu)})(z);var Md=/^#source\((.*?)\)/;function Ad(t,e,r){var i,n,a,o,s=t.type||"filter";if(s==="filter"){var l=t.shader.trim(),u=Md.exec(l);if(u?i=z.source(u[1].trim()):l.charAt(0)==="#"&&(i=e.shaders[l.substr(1)]),i||(i=l),!i)return}if(t.inputs)for(var h in n={},t.inputs)typeof t.inputs[h]=="string"?n[h]=t.inputs[h]:n[h]={node:t.inputs[h].node,pin:t.inputs[h].pin};if(t.outputs)for(var h in a={},t.outputs){var c=t.outputs[h];a[h]={},c.attachment!=null&&(a[h].attachment=c.attachment),c.keepLastFrame!=null&&(a[h].keepLastFrame=c.keepLastFrame),c.outputLastFrame!=null&&(a[h].outputLastFrame=c.outputLastFrame),c.parameters&&(a[h].parameters=ts(c.parameters))}if(o=s==="scene"?new wd({name:t.name,scene:r.scene,camera:r.camera,outputs:a}):s==="texture"?new Td({name:t.name,outputs:a}):new Sd({name:t.name,shader:i,inputs:n,outputs:a})){if(t.parameters)for(var h in t.parameters)typeof(f=t.parameters[h])=="string"?(f=f.trim()).charAt(0)==="#"?f=e.textures[f.substr(1)]:o.on("beforerender",Dd(h,Ru(f))):typeof f=="function"&&o.on("beforerender",f),o.setParameter(h,f);if(t.defines&&o.pass)for(var h in t.defines){var f=t.defines[h];o.pass.material.define("fragment",h,f)}}return o}function Ed(t,e){return t}function Cd(t,e){return e}function ts(t){var e={};if(!t)return e;["type","minFilter","magFilter","wrapS","wrapT","flipY","useMipmap"].forEach((function(i){var n=t[i];n!=null&&(typeof n=="string"&&(n=H[n]),e[i]=n)}));var r=t.scale||1;return["width","height"].forEach((function(i){if(t[i]!=null){var n=t[i];typeof n=="string"?(n=n.trim(),e[i]=(a=Ru(n),o=(o=r)||1,function(s){var l=s.getDevicePixelRatio(),u=s.getWidth()*o,h=s.getHeight()*o;return a(u,h,l)})):e[i]=n}var a,o})),e.width||(e.width=Ed),e.height||(e.height=Cd),t.useMipmap!=null&&(e.useMipmap=t.useMipmap),e}function Dd(t,e){return function(r){var i=r.getDevicePixelRatio(),n=r.getWidth(),a=r.getHeight(),o=e(n,a,i);this.setParameter(t,o)}}function Ru(t){var e=/^expr\((.*)\)$/.exec(t);if(e)try{var r=new Function("width","height","dpr","return "+e[1]);return r(1,1),r}catch{throw new Error("Invalid expression.")}}let hi=function(t,e){for(var r=0,i=1/e,n=t;n>0;)r+=i*(n%e),n=Math.floor(n/e),i/=e;return r};function Fu(t){for(var e=new Uint8Array(t*t*4),r=0,i=new F,n=0;n<t;n++)for(var a=0;a<t;a++)i.set(2*Math.random()-1,2*Math.random()-1,0).normalize(),e[r++]=255*(.5*i.x+.5),e[r++]=255*(.5*i.y+.5),e[r++]=0,e[r++]=255;return e}function Bu(t){return new K({pixels:Fu(t),wrapS:H.REPEAT,wrapT:H.REPEAT,width:t,height:t})}function Ld(t,e,r){var i=new Float32Array(3*t);e=e||0;for(var n=0;n<t;n++){var a=hi(n+e,2)*(r?1:2)*Math.PI,o=hi(n+e,3)*Math.PI,s=Math.random(),l=Math.cos(a)*Math.sin(o)*s,u=Math.cos(o)*s,h=Math.sin(a)*Math.sin(o)*s;i[3*n]=l,i[3*n+1]=u,i[3*n+2]=h}return i}function Ue(t){t=t||{},this._ssaoPass=new Et({fragment:z.source("ecgl.ssao.estimate")}),this._blurPass=new Et({fragment:z.source("ecgl.ssao.blur")}),this._framebuffer=new kt({depthBuffer:!1}),this._ssaoTexture=new K,this._blurTexture=new K,this._blurTexture2=new K,this._depthTex=t.depthTexture,this._normalTex=t.normalTexture,this.setNoiseSize(4),this.setKernelSize(t.kernelSize||12),t.radius!=null&&this.setParameter("radius",t.radius),t.power!=null&&this.setParameter("power",t.power),this._normalTex||(this._ssaoPass.material.disableTexture("normalTex"),this._blurPass.material.disableTexture("normalTex")),this._depthTex||this._blurPass.material.disableTexture("depthTex"),this._blurPass.material.setUniform("normalTex",this._normalTex),this._blurPass.material.setUniform("depthTex",this._depthTex)}z.import(`@export ecgl.ssao.estimate

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
`),Ue.prototype.setDepthTexture=function(t){this._depthTex=t},Ue.prototype.setNormalTexture=function(t){this._normalTex=t,this._ssaoPass.material[t?"enableTexture":"disableTexture"]("normalTex"),this.setKernelSize(this._kernelSize)},Ue.prototype.update=function(t,e,r){var i=t.getWidth(),n=t.getHeight(),a=this._ssaoPass,o=this._blurPass;a.setUniform("kernel",this._kernels[r%this._kernels.length]),a.setUniform("depthTex",this._depthTex),this._normalTex!=null&&a.setUniform("normalTex",this._normalTex),a.setUniform("depthTexSize",[this._depthTex.width,this._depthTex.height]);var s=new k;k.transpose(s,e.worldTransform),a.setUniform("projection",e.projectionMatrix.array),a.setUniform("projectionInv",e.invProjectionMatrix.array),a.setUniform("viewInverseTranspose",s.array);var l=this._ssaoTexture,u=this._blurTexture,h=this._blurTexture2;l.width=i/2,l.height=n/2,u.width=i,u.height=n,h.width=i,h.height=n,this._framebuffer.attach(l),this._framebuffer.bind(t),t.gl.clearColor(1,1,1,1),t.gl.clear(t.gl.COLOR_BUFFER_BIT),a.render(t),o.setUniform("textureSize",[i/2,n/2]),o.setUniform("projection",e.projectionMatrix.array),this._framebuffer.attach(u),o.setUniform("direction",0),o.setUniform("ssaoTexture",l),o.render(t),this._framebuffer.attach(h),o.setUniform("textureSize",[i,n]),o.setUniform("direction",1),o.setUniform("ssaoTexture",u),o.render(t),this._framebuffer.unbind(t);var c=t.clearColor;t.gl.clearColor(c[0],c[1],c[2],c[3])},Ue.prototype.getTargetTexture=function(){return this._blurTexture2},Ue.prototype.setParameter=function(t,e){t==="noiseTexSize"?this.setNoiseSize(e):t==="kernelSize"?this.setKernelSize(e):t==="intensity"?this._ssaoPass.material.set("intensity",e):this._ssaoPass.setUniform(t,e)},Ue.prototype.setKernelSize=function(t){this._kernelSize=t,this._ssaoPass.material.define("fragment","KERNEL_SIZE",t),this._kernels=this._kernels||[];for(var e=0;e<30;e++)this._kernels[e]=Ld(t,e*t,!!this._normalTex)},Ue.prototype.setNoiseSize=function(t){var e=this._ssaoPass.getUniform("noiseTex");e?(e.data=Fu(t),e.width=e.height=t,e.dirty()):(e=Bu(t),this._ssaoPass.setUniform("noiseTex",Bu(t))),this._ssaoPass.setUniform("noiseTexSize",[t,t])},Ue.prototype.dispose=function(t){this._blurTexture.dispose(t),this._ssaoTexture.dispose(t),this._blurTexture2.dispose(t)};let Pd=Ue;function ke(t){t=t||{},this._ssrPass=new Et({fragment:z.source("ecgl.ssr.main"),clearColor:[0,0,0,0]}),this._blurPass1=new Et({fragment:z.source("ecgl.ssr.blur"),clearColor:[0,0,0,0]}),this._blurPass2=new Et({fragment:z.source("ecgl.ssr.blur"),clearColor:[0,0,0,0]}),this._blendPass=new Et({fragment:z.source("clay.compositor.blend")}),this._blendPass.material.disableTexturesAll(),this._blendPass.material.enableTexture(["texture1","texture2"]),this._ssrPass.setUniform("gBufferTexture1",t.normalTexture),this._ssrPass.setUniform("gBufferTexture2",t.depthTexture),this._blurPass1.setUniform("gBufferTexture1",t.normalTexture),this._blurPass1.setUniform("gBufferTexture2",t.depthTexture),this._blurPass2.setUniform("gBufferTexture1",t.normalTexture),this._blurPass2.setUniform("gBufferTexture2",t.depthTexture),this._blurPass2.material.define("fragment","VERTICAL"),this._blurPass2.material.define("fragment","BLEND"),this._ssrTexture=new K({type:H.HALF_FLOAT}),this._texture2=new K({type:H.HALF_FLOAT}),this._texture3=new K({type:H.HALF_FLOAT}),this._prevTexture=new K({type:H.HALF_FLOAT}),this._currentTexture=new K({type:H.HALF_FLOAT}),this._frameBuffer=new kt({depthBuffer:!1}),this._normalDistribution=null,this._totalSamples=256,this._samplePerFrame=4,this._ssrPass.material.define("fragment","SAMPLE_PER_FRAME",this._samplePerFrame),this._ssrPass.material.define("fragment","TOTAL_SAMPLES",this._totalSamples),this._downScale=1}z.import(`@export ecgl.ssr.main

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

@end`),ke.prototype.setAmbientCubemap=function(t,e){this._ssrPass.material.set("specularCubemap",t),this._ssrPass.material.set("specularIntensity",e);var r=t&&e;this._ssrPass.material[r?"enableTexture":"disableTexture"]("specularCubemap")},ke.prototype.update=function(t,e,r,i){var n=t.getWidth(),a=t.getHeight(),o=this._ssrTexture,s=this._texture2,l=this._texture3;o.width=this._prevTexture.width=this._currentTexture.width=n/this._downScale,o.height=this._prevTexture.height=this._currentTexture.height=a/this._downScale,s.width=l.width=n,s.height=l.height=a;var u=this._frameBuffer,h=this._ssrPass,c=this._blurPass1,f=this._blurPass2,p=this._blendPass,d=new k,m=new k;k.transpose(d,e.worldTransform),k.transpose(m,e.viewMatrix),h.setUniform("sourceTexture",r),h.setUniform("projection",e.projectionMatrix.array),h.setUniform("projectionInv",e.invProjectionMatrix.array),h.setUniform("toViewSpace",d.array),h.setUniform("toWorldSpace",m.array),h.setUniform("nearZ",e.near);var g=i/this._totalSamples*this._samplePerFrame;if(h.setUniform("jitterOffset",g),h.setUniform("sampleOffset",i*this._samplePerFrame),c.setUniform("textureSize",[o.width,o.height]),f.setUniform("textureSize",[n,a]),f.setUniform("sourceTexture",r),c.setUniform("projection",e.projectionMatrix.array),f.setUniform("projection",e.projectionMatrix.array),u.attach(o),u.bind(t),h.render(t),this._physicallyCorrect&&(u.attach(this._currentTexture),p.setUniform("texture1",this._prevTexture),p.setUniform("texture2",o),p.material.set({weight1:i>=1?.95:0,weight2:i>=1?.05:1}),p.render(t)),u.attach(s),c.setUniform("texture",this._physicallyCorrect?this._currentTexture:o),c.render(t),u.attach(l),f.setUniform("texture",s),f.render(t),u.unbind(t),this._physicallyCorrect){var _=this._prevTexture;this._prevTexture=this._currentTexture,this._currentTexture=_}},ke.prototype.getTargetTexture=function(){return this._texture3},ke.prototype.setParameter=function(t,e){t==="maxIteration"?this._ssrPass.material.define("fragment","MAX_ITERATION",e):this._ssrPass.setUniform(t,e)},ke.prototype.setPhysicallyCorrect=function(t){t?(this._normalDistribution||(this._normalDistribution=jn.generateNormalDistribution(64,this._totalSamples)),this._ssrPass.material.define("fragment","PHYSICALLY_CORRECT"),this._ssrPass.material.set("normalDistribution",this._normalDistribution),this._ssrPass.material.set("normalDistributionSize",[64,this._totalSamples])):this._ssrPass.material.undefine("fragment","PHYSICALLY_CORRECT"),this._physicallyCorrect=t},ke.prototype.setSSAOTexture=function(t){var e=this._blurPass2;t?(e.material.enableTexture("ssaoTex"),e.material.set("ssaoTex",t)):e.material.disableTexture("ssaoTex")},ke.prototype.isFinished=function(t){return!this._physicallyCorrect||t>this._totalSamples/this._samplePerFrame},ke.prototype.dispose=function(t){this._ssrTexture.dispose(t),this._texture2.dispose(t),this._texture3.dispose(t),this._prevTexture.dispose(t),this._currentTexture.dispose(t),this._frameBuffer.dispose(t)};let Od=ke,zu=[0,0,-.321585265978,-.154972575841,.458126042375,.188473391593,.842080129861,.527766490688,.147304551086,-.659453822776,-.331943915203,-.940619700594,.0479226680259,.54812163202,.701581552186,-.709825561388,-.295436780218,.940589268233,-.901489676764,.237713156085,.973570876096,-.109899459384,-.866792314779,-.451805525005,.330975007087,.800048655954,-.344275183665,.381779221166,-.386139432542,-.437418421534,-.576478634965,-.0148463392551,.385798197415,-.262426961053,-.666302061145,.682427250835,-.628010632582,-.732836215494,.10163141741,-.987658134403,.711995289051,-.320024291314,.0296005138058,.950296523438,.0130612307608,-.351024443122,-.879596633704,-.10478487883,.435712737232,.504254490347,.779203817497,.206477676721,.388264289969,-.896736162545,-.153106280781,-.629203242522,-.245517550697,.657969239148,.126830499058,.26862328493,-.634888119007,-.302301223431,.617074219636,.779817204925];function es(t,e,r,i,n){var a=t.gl;e.setUniform(a,"1i",r,n),a.activeTexture(a.TEXTURE0+n),i.isRenderable()?i.bind(t):i.unbind(t)}function Nd(t,e,r,i,n){var a,o,s,l,u=t.gl;return function(h,c,f){if(!l||l.material!==h.material){var p=h.material,d=h.__program,m=p.get("roughness");m==null&&(m=1);var g=p.get("normalMap")||e,_=p.get("roughnessMap"),y=p.get("bumpMap"),x=p.get("uvRepeat"),v=p.get("uvOffset"),w=p.get("detailUvRepeat"),b=p.get("detailUvOffset"),S=!!y&&p.isTextureEnabled("bumpMap"),A=!!_&&p.isTextureEnabled("roughnessMap"),D=p.isDefined("fragment","DOUBLE_SIDED");y=y||r,_=_||i,f!==c?(c.set("normalMap",g),c.set("bumpMap",y),c.set("roughnessMap",_),c.set("useBumpMap",S),c.set("useRoughnessMap",A),c.set("doubleSide",D),x!=null&&c.set("uvRepeat",x),v!=null&&c.set("uvOffset",v),w!=null&&c.set("detailUvRepeat",w),b!=null&&c.set("detailUvOffset",b),c.set("roughness",m)):(d.setUniform(u,"1f","roughness",m),a!==g&&es(t,d,"normalMap",g,0),o!==y&&y&&es(t,d,"bumpMap",y,1),s!==_&&_&&es(t,d,"roughnessMap",_,2),x!=null&&d.setUniform(u,"2f","uvRepeat",x),v!=null&&d.setUniform(u,"2f","uvOffset",v),w!=null&&d.setUniform(u,"2f","detailUvRepeat",w),b!=null&&d.setUniform(u,"2f","detailUvOffset",b),d.setUniform(u,"1i","useBumpMap",+S),d.setUniform(u,"1i","useRoughnessMap",+A),d.setUniform(u,"1i","doubleSide",+D)),a=g,o=y,s=_,l=h}}}function ci(t){t=t||{},this._depthTex=new K({format:H.DEPTH_COMPONENT,type:H.UNSIGNED_INT}),this._normalTex=new K({type:H.HALF_FLOAT}),this._framebuffer=new kt,this._framebuffer.attach(this._normalTex),this._framebuffer.attach(this._depthTex,kt.DEPTH_ATTACHMENT),this._normalMaterial=new he({shader:new z(z.source("ecgl.normal.vertex"),z.source("ecgl.normal.fragment"))}),this._normalMaterial.enableTexture(["normalMap","bumpMap","roughnessMap"]),this._defaultNormalMap=pr.createBlank("#000"),this._defaultBumpMap=pr.createBlank("#000"),this._defaultRoughessMap=pr.createBlank("#000"),this._debugPass=new Et({fragment:z.source("clay.compositor.output")}),this._debugPass.setUniform("texture",this._normalTex),this._debugPass.material.undefine("fragment","OUTPUT_ALPHA")}z.import(`@export ecgl.normal.vertex

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
@end`),ci.prototype.getDepthTexture=function(){return this._depthTex},ci.prototype.getNormalTexture=function(){return this._normalTex},ci.prototype.update=function(t,e,r){var i=t.getWidth(),n=t.getHeight(),a=this._depthTex,o=this._normalTex,s=this._normalMaterial;a.width=i,a.height=n,o.width=i,o.height=n;var l=e.getRenderList(r).opaque;this._framebuffer.bind(t),t.gl.clearColor(0,0,0,0),t.gl.clear(t.gl.COLOR_BUFFER_BIT|t.gl.DEPTH_BUFFER_BIT),t.gl.disable(t.gl.BLEND),t.renderPass(l,r,{getMaterial:function(){return s},ifRender:function(u){return u.renderNormal},beforeRender:Nd(t,this._defaultNormalMap,this._defaultBumpMap,this._defaultRoughessMap,this._normalMaterial),sort:t.opaqueSortCompare}),this._framebuffer.unbind(t)},ci.prototype.renderDebug=function(t){this._debugPass.render(t)},ci.prototype.dispose=function(t){this._depthTex.dispose(t),this._normalTex.dispose(t)};let Id=ci;function tn(t){t=t||{},this._edgePass=new Et({fragment:z.source("ecgl.edge")}),this._edgePass.setUniform("normalTexture",t.normalTexture),this._edgePass.setUniform("depthTexture",t.depthTexture),this._targetTexture=new K({type:H.HALF_FLOAT}),this._frameBuffer=new kt,this._frameBuffer.attach(this._targetTexture)}tn.prototype.update=function(t,e,r,i){var n=t.getWidth(),a=t.getHeight(),o=this._targetTexture;o.width=n,o.height=a;var s=this._frameBuffer;s.bind(t),this._edgePass.setUniform("projectionInv",e.invProjectionMatrix.array),this._edgePass.setUniform("textureSize",[n,a]),this._edgePass.setUniform("texture",r),this._edgePass.render(t),s.unbind(t)},tn.prototype.getTargetTexture=function(){return this._targetTexture},tn.prototype.setParameter=function(t,e){this._edgePass.setUniform(t,e)},tn.prototype.dispose=function(t){this._targetTexture.dispose(t),this._frameBuffer.dispose(t)};let Rd=tn,Fd={type:"compositor",nodes:[{name:"source",type:"texture",outputs:{color:{}}},{name:"source_half",shader:"#source(clay.compositor.downsample)",inputs:{texture:"source"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"bright",shader:"#source(clay.compositor.bright)",inputs:{texture:"source_half"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{threshold:2,scale:4,textureSize:"expr([width * 1.0 / 2, height / 2])"}},{name:"bright_downsample_4",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 2, height / 2] )"}},{name:"bright_downsample_8",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_4"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 4, height / 4] )"}},{name:"bright_downsample_16",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_8"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 8, height / 8] )"}},{name:"bright_downsample_32",shader:"#source(clay.compositor.downsample)",inputs:{texture:"bright_downsample_16"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 32)",height:"expr(height * 1.0 / 32)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0 / 16, height / 16] )"}},{name:"bright_upsample_16_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_32"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 32, height / 32] )"}},{name:"bright_upsample_16_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_16_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 16)",height:"expr(height * 1.0 / 16)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 16, height * 1.0 / 16] )"}},{name:"bright_upsample_8_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_16"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 16, height * 1.0 / 16] )"}},{name:"bright_upsample_8_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_8_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 8, height * 1.0 / 8] )"}},{name:"bright_upsample_8_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_8_blur_v",texture2:"bright_upsample_16_blur_v"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 8)",height:"expr(height * 1.0 / 8)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_4_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_8"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 8, height * 1.0 / 8] )"}},{name:"bright_upsample_4_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_4_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 4, height * 1.0 / 4] )"}},{name:"bright_upsample_4_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_4_blur_v",texture2:"bright_upsample_8_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 4)",height:"expr(height * 1.0 / 4)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_2_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_downsample_4"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 4, height * 1.0 / 4] )"}},{name:"bright_upsample_2_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_2_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0 / 2, height * 1.0 / 2] )"}},{name:"bright_upsample_2_blend",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_2_blur_v",texture2:"bright_upsample_4_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0 / 2)",height:"expr(height * 1.0 / 2)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"bright_upsample_full_blur_h",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:0,textureSize:"expr( [width * 1.0 / 2, height * 1.0 / 2] )"}},{name:"bright_upsample_full_blur_v",shader:"#source(clay.compositor.gaussian_blur)",inputs:{texture:"bright_upsample_full_blur_h"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{blurSize:1,blurDir:1,textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"bloom_composite",shader:"#source(clay.compositor.blend)",inputs:{texture1:"bright_upsample_full_blur_v",texture2:"bright_upsample_2_blend"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{weight1:.3,weight2:.7}},{name:"coc",shader:"#source(ecgl.dof.coc)",outputs:{color:{parameters:{minFilter:"NEAREST",magFilter:"NEAREST",width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},parameters:{focalDist:50,focalRange:30}},{name:"dof_far_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"source",coc:"coc"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"}},{name:"dof_near_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"source",coc:"coc"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"},defines:{BLUR_NEARFIELD:null}},{name:"dof_coc_blur",shader:"#source(ecgl.dof.diskBlur)",inputs:{texture:"coc"},outputs:{color:{parameters:{minFilter:"NEAREST",magFilter:"NEAREST",width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},parameters:{textureSize:"expr( [width * 1.0, height * 1.0] )"},defines:{BLUR_COC:null}},{name:"dof_composite",shader:"#source(ecgl.dof.composite)",inputs:{original:"source",blurred:"dof_far_blur",nearfield:"dof_near_blur",coc:"coc",nearcoc:"dof_coc_blur"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)",type:"HALF_FLOAT"}}}},{name:"composite",shader:"#source(clay.compositor.hdr.composite)",inputs:{texture:"source",bloom:"bloom_composite"},outputs:{color:{parameters:{width:"expr(width * 1.0)",height:"expr(height * 1.0)"}}},defines:{}},{name:"FXAA",shader:"#source(clay.compositor.fxaa)",inputs:{texture:"composite"}}]};function Gu(t,e){return{color:{parameters:{width:t,height:e}}}}z.import(Au),z.import(Eu),z.import(Cu),z.import(Du),z.import(Lu),z.import(Pu),z.import(Ou),z.import(Nu),z.import(Iu),z.import(`@export ecgl.dof.coc

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

@end`),z.import(`@export ecgl.edge

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
@end`);var rs=["composite","FXAA"];function $(){this._width,this._height,this._dpr,this._sourceTexture=new K({type:H.HALF_FLOAT}),this._depthTexture=new K({format:H.DEPTH_COMPONENT,type:H.UNSIGNED_INT}),this._framebuffer=new kt,this._framebuffer.attach(this._sourceTexture),this._framebuffer.attach(this._depthTexture,kt.DEPTH_ATTACHMENT),this._normalPass=new Id,this._compositor=(function(i,n){var a=new bd;n=n||{};var o={textures:{},parameters:{}};for(var s in i.parameters){var l=i.parameters[s];o.parameters[s]=ts(l)}return(function(u,h,c,f){if(u.textures){var p={},d=0,m=!1,g=c.textureRootPath;zt.each(u.textures,(function(_,y){var x,v=_.path,w=ts(_.parameters);if(Array.isArray(v)&&v.length===6)g&&(v=v.map((function(b){return zt.relative2absolute(b,g)}))),x=new Ri(w);else{if(typeof v!="string")return;g&&(v=zt.relative2absolute(v,g)),x=new K(w)}x.load(v),d++,x.once("success",(function(){p[y]=x,--d==0&&(f(p),m=!0)}))})),d!==0||m||f(p)}else f({})})(i,0,n,(function(u){o.textures=u,(function(h,c){for(var f=0;f<i.nodes.length;f++){var p=Ad(i.nodes[f],o,n);p&&a.addNode(p)}})()})),a})(Fd);var t=this._compositor.getNodeByName("source");t.texture=this._sourceTexture;var e=this._compositor.getNodeByName("coc");this._sourceNode=t,this._cocNode=e,this._compositeNode=this._compositor.getNodeByName("composite"),this._fxaaNode=this._compositor.getNodeByName("FXAA"),this._dofBlurNodes=["dof_far_blur","dof_near_blur","dof_coc_blur"].map((function(i){return this._compositor.getNodeByName(i)}),this),this._dofBlurKernel=0,this._dofBlurKernelSize=new Float32Array(0),this._finalNodesChain=rs.map((function(i){return this._compositor.getNodeByName(i)}),this);var r={normalTexture:this._normalPass.getNormalTexture(),depthTexture:this._normalPass.getDepthTexture()};this._ssaoPass=new Pd(r),this._ssrPass=new Od(r),this._edgePass=new Rd(r)}$.prototype.resize=function(t,e,r){t*=r=r||1,e*=r;var i=this._sourceTexture,n=this._depthTexture;i.width=t,i.height=e,n.width=t,n.height=e;var a={getWidth:function(){return t},getHeight:function(){return e},getDevicePixelRatio:function(){return r}};function o(s,l){if(typeof s[l]=="function"){var u=s[l].__original||s[l];s[l]=function(h){return u.call(this,a)},s[l].__original=u}}this._compositor.nodes.forEach((function(s){for(var l in s.outputs){var u=s.outputs[l].parameters;u&&(o(u,"width"),o(u,"height"))}for(var h in s.parameters)o(s.parameters,h)})),this._width=t,this._height=e,this._dpr=r},$.prototype.getWidth=function(){return this._width},$.prototype.getHeight=function(){return this._height},$.prototype._ifRenderNormalPass=function(){return this._enableSSAO||this._enableEdge||this._enableSSR},$.prototype._getPrevNode=function(t){for(var e=rs.indexOf(t.name)-1,r=this._finalNodesChain[e];r&&!this._compositor.getNodeByName(r.name);)e-=1,r=this._finalNodesChain[e];return r},$.prototype._getNextNode=function(t){for(var e=rs.indexOf(t.name)+1,r=this._finalNodesChain[e];r&&!this._compositor.getNodeByName(r.name);)e+=1,r=this._finalNodesChain[e];return r},$.prototype._addChainNode=function(t){var e=this._getPrevNode(t),r=this._getNextNode(t);e&&(t.inputs.texture=e.name,r?(t.outputs=Gu(this.getWidth.bind(this),this.getHeight.bind(this)),r.inputs.texture=t.name):t.outputs=null,this._compositor.addNode(t))},$.prototype._removeChainNode=function(t){var e=this._getPrevNode(t),r=this._getNextNode(t);e&&(r?(e.outputs=Gu(this.getWidth.bind(this),this.getHeight.bind(this)),r.inputs.texture=e.name):e.outputs=null,this._compositor.removeNode(t))},$.prototype.updateNormal=function(t,e,r,i){this._ifRenderNormalPass()&&this._normalPass.update(t,e,r)},$.prototype.updateSSAO=function(t,e,r,i){this._ssaoPass.update(t,r,i)},$.prototype.enableSSAO=function(){this._enableSSAO=!0},$.prototype.disableSSAO=function(){this._enableSSAO=!1},$.prototype.enableSSR=function(){this._enableSSR=!0},$.prototype.disableSSR=function(){this._enableSSR=!1},$.prototype.getSSAOTexture=function(){return this._ssaoPass.getTargetTexture()},$.prototype.getSourceFrameBuffer=function(){return this._framebuffer},$.prototype.getSourceTexture=function(){return this._sourceTexture},$.prototype.disableFXAA=function(){this._removeChainNode(this._fxaaNode)},$.prototype.enableFXAA=function(){this._addChainNode(this._fxaaNode)},$.prototype.enableBloom=function(){this._compositeNode.inputs.bloom="bloom_composite",this._compositor.dirty()},$.prototype.disableBloom=function(){this._compositeNode.inputs.bloom=null,this._compositor.dirty()},$.prototype.enableDOF=function(){this._compositeNode.inputs.texture="dof_composite",this._compositor.dirty()},$.prototype.disableDOF=function(){this._compositeNode.inputs.texture="source",this._compositor.dirty()},$.prototype.enableColorCorrection=function(){this._compositeNode.define("COLOR_CORRECTION"),this._enableColorCorrection=!0},$.prototype.disableColorCorrection=function(){this._compositeNode.undefine("COLOR_CORRECTION"),this._enableColorCorrection=!1},$.prototype.enableEdge=function(){this._enableEdge=!0},$.prototype.disableEdge=function(){this._enableEdge=!1},$.prototype.setBloomIntensity=function(t){this._compositeNode.setParameter("bloomIntensity",t)},$.prototype.setSSAOParameter=function(t,e){switch(t){case"quality":var r={low:6,medium:12,high:32,ultra:62}[e]||12;this._ssaoPass.setParameter("kernelSize",r);break;case"radius":this._ssaoPass.setParameter(t,e),this._ssaoPass.setParameter("bias",e/200);break;case"intensity":this._ssaoPass.setParameter(t,e)}},$.prototype.setDOFParameter=function(t,e){switch(t){case"focalDistance":case"focalRange":case"fstop":this._cocNode.setParameter(t,e);break;case"blurRadius":for(var r=0;r<this._dofBlurNodes.length;r++)this._dofBlurNodes[r].setParameter("blurRadius",e);break;case"quality":var i={low:4,medium:8,high:16,ultra:32}[e]||8;for(this._dofBlurKernelSize=i,r=0;r<this._dofBlurNodes.length;r++)this._dofBlurNodes[r].pass.material.define("POISSON_KERNEL_SIZE",i);this._dofBlurKernel=new Float32Array(2*i)}},$.prototype.setSSRParameter=function(t,e){if(e!=null)switch(t){case"quality":var r={low:10,medium:15,high:30,ultra:80}[e]||20,i={low:32,medium:16,high:8,ultra:4}[e]||16;this._ssrPass.setParameter("maxIteration",r),this._ssrPass.setParameter("pixelStride",i);break;case"maxRoughness":this._ssrPass.setParameter("minGlossiness",Math.max(Math.min(1-e,1),0));break;case"physical":this.setPhysicallyCorrectSSR(e);break;default:console.warn("Unkown SSR parameter "+t)}},$.prototype.setPhysicallyCorrectSSR=function(t){this._ssrPass.setPhysicallyCorrect(t)},$.prototype.setEdgeColor=function(t){var e=T.parseColor(t);this._edgePass.setParameter("edgeColor",e)},$.prototype.setExposure=function(t){this._compositeNode.setParameter("exposure",Math.pow(2,t))},$.prototype.setColorLookupTexture=function(t,e){this._compositeNode.pass.material.setTextureImage("lut",this._enableColorCorrection?t:"none",e,{minFilter:T.Texture.NEAREST,magFilter:T.Texture.NEAREST,flipY:!1})},$.prototype.setColorCorrection=function(t,e){this._compositeNode.setParameter(t,e)},$.prototype.isSSREnabled=function(){return this._enableSSR},$.prototype.composite=function(t,e,r,i,n){var a=this._sourceTexture,o=a;this._enableEdge&&(this._edgePass.update(t,r,a,n),a=o=this._edgePass.getTargetTexture()),this._enableSSR&&(this._ssrPass.update(t,r,a,n),o=this._ssrPass.getTargetTexture(),this._ssrPass.setSSAOTexture(this._enableSSAO?this._ssaoPass.getTargetTexture():null)),this._sourceNode.texture=o,this._cocNode.setParameter("depth",this._depthTexture);for(var s=this._dofBlurKernel,l=this._dofBlurKernelSize,u=n%Math.floor(zu.length/2/l),h=0;h<2*l;h++)s[h]=zu[h+u*l*2];for(h=0;h<this._dofBlurNodes.length;h++)this._dofBlurNodes[h].setParameter("percent",n/30),this._dofBlurNodes[h].setParameter("poissonKernel",s);this._cocNode.setParameter("zNear",r.near),this._cocNode.setParameter("zFar",r.far),this._compositor.render(t,i)},$.prototype.dispose=function(t){this._sourceTexture.dispose(t),this._depthTexture.dispose(t),this._framebuffer.dispose(t),this._compositor.dispose(t),this._normalPass.dispose(t),this._ssaoPass.dispose(t)};let Bd=$;function is(t){for(var e=[],r=0;r<30;r++)e.push([hi(r,2),hi(r,3)]);this._haltonSequence=e,this._frame=0,this._sourceTex=new K,this._sourceFb=new kt,this._sourceFb.attach(this._sourceTex),this._prevFrameTex=new K,this._outputTex=new K;var i=this._blendPass=new Et({fragment:z.source("clay.compositor.blend")});i.material.disableTexturesAll(),i.material.enableTexture(["texture1","texture2"]),this._blendFb=new kt({depthBuffer:!1}),this._outputPass=new Et({fragment:z.source("clay.compositor.output"),blendWithPrevious:!0}),this._outputPass.material.define("fragment","OUTPUT_ALPHA"),this._outputPass.material.blend=function(n){n.blendEquationSeparate(n.FUNC_ADD,n.FUNC_ADD),n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA)}}is.prototype={constructor:is,jitterProjection:function(t,e){var r=t.viewport,i=r.devicePixelRatio||t.getDevicePixelRatio(),n=r.width*i,a=r.height*i,o=this._haltonSequence[this._frame%this._haltonSequence.length],s=new k;s.array[12]=(2*o[0]-1)/n,s.array[13]=(2*o[1]-1)/a,k.mul(e.projectionMatrix,s,e.projectionMatrix),k.invert(e.invProjectionMatrix,e.projectionMatrix)},resetFrame:function(){this._frame=0},getFrame:function(){return this._frame},getSourceFrameBuffer:function(){return this._sourceFb},getOutputTexture:function(){return this._outputTex},resize:function(t,e){this._prevFrameTex.width=t,this._prevFrameTex.height=e,this._outputTex.width=t,this._outputTex.height=e,this._sourceTex.width=t,this._sourceTex.height=e,this._prevFrameTex.dirty(),this._outputTex.dirty(),this._sourceTex.dirty()},isFinished:function(){return this._frame>=this._haltonSequence.length},render:function(t,e,r){var i=this._blendPass;this._frame===0?(i.setUniform("weight1",0),i.setUniform("weight2",1)):(i.setUniform("weight1",.9),i.setUniform("weight2",.1)),i.setUniform("texture1",this._prevFrameTex),i.setUniform("texture2",e||this._sourceTex),this._blendFb.attach(this._outputTex),this._blendFb.bind(t),i.render(t),this._blendFb.unbind(t),r||(this._outputPass.setUniform("texture",this._outputTex),this._outputPass.render(t));var n=this._prevFrameTex;this._prevFrameTex=this._outputTex,this._outputTex=n,this._frame++},dispose:function(t){this._sourceFb.dispose(t),this._blendFb.dispose(t),this._prevFrameTex.dispose(t),this._outputTex.dispose(t),this._sourceTex.dispose(t),this._outputPass.dispose(t),this._blendPass.dispose(t)}};let zd=is;function yt(t){t=t||"perspective",this.layer=null,this.scene=new Ye,this.rootNode=this.scene,this.viewport={x:0,y:0,width:0,height:0},this.setProjection(t),this._compositor=new Bd,this._temporalSS=new zd,this._shadowMapPass=new xd;for(var e=[],r=0,i=0;i<30;i++){for(var n=[],a=0;a<6;a++)n.push(4*hi(r,2)-2),n.push(4*hi(r,3)-2),r++;e.push(n)}this._pcfKernels=e,this.scene.on("beforerender",(function(o,s,l){this.needsTemporalSS()&&this._temporalSS.jitterProjection(o,l)}),this)}yt.prototype.setProjection=function(t){var e=this.camera;e&&e.update(),t==="perspective"?this.camera instanceof It||(this.camera=new It,e&&this.camera.setLocalTransform(e.localTransform)):this.camera instanceof ei||(this.camera=new ei,e&&this.camera.setLocalTransform(e.localTransform)),this.camera.near=.1,this.camera.far=2e3},yt.prototype.setViewport=function(t,e,r,i,n){this.camera instanceof It&&(this.camera.aspect=r/i),n=n||1,this.viewport.x=t,this.viewport.y=e,this.viewport.width=r,this.viewport.height=i,this.viewport.devicePixelRatio=n,this._compositor.resize(r*n,i*n),this._temporalSS.resize(r*n,i*n)},yt.prototype.containPoint=function(t,e){var r=this.viewport;return e=this.layer.renderer.getHeight()-e,t>=r.x&&e>=r.y&&t<=r.x+r.width&&e<=r.y+r.height};var Uu=new ne;yt.prototype.castRay=function(t,e,r){var i=this.layer.renderer,n=i.viewport;return i.viewport=this.viewport,i.screenToNDC(t,e,Uu),this.camera.castRay(Uu,r),i.viewport=n,r},yt.prototype.prepareRender=function(){this.scene.update(),this.camera.update(),this.scene.updateLights();var t=this.scene.updateRenderList(this.camera);this._needsSortProgressively=!1;for(var e=0;e<t.transparent.length;e++){var r=t.transparent[e].geometry;r.needsSortVerticesProgressively&&r.needsSortVerticesProgressively()&&(this._needsSortProgressively=!0),r.needsSortTrianglesProgressively&&r.needsSortTrianglesProgressively()&&(this._needsSortProgressively=!0)}this._frame=0,this._temporalSS.resetFrame()},yt.prototype.render=function(t,e){this._doRender(t,e,this._frame),this._frame++},yt.prototype.needsAccumulate=function(){return this.needsTemporalSS()||this._needsSortProgressively},yt.prototype.needsTemporalSS=function(){var t=this._enableTemporalSS;return t==="auto"&&(t=this._enablePostEffect),t},yt.prototype.hasDOF=function(){return this._enableDOF},yt.prototype.isAccumulateFinished=function(){return this.needsTemporalSS()?this._temporalSS.isFinished():this._frame>30},yt.prototype._doRender=function(t,e,r){var i=this.scene,n=this.camera;r=r||0,this._updateTransparent(t,i,n,r),e||(this._shadowMapPass.kernelPCF=this._pcfKernels[0],this._shadowMapPass.render(t,i,n,!0)),this._updateShadowPCFKernel(r);var a,o=t.clearColor;t.gl.clearColor(o[0],o[1],o[2],o[3]),this._enablePostEffect&&(this.needsTemporalSS()&&this._temporalSS.jitterProjection(t,n),this._compositor.updateNormal(t,i,n,this._temporalSS.getFrame())),this._updateSSAO(t,i,n,this._temporalSS.getFrame()),this._enablePostEffect?((a=this._compositor.getSourceFrameBuffer()).bind(t),t.gl.clear(t.gl.DEPTH_BUFFER_BIT|t.gl.COLOR_BUFFER_BIT),t.render(i,n,!0,!0),a.unbind(t),this.needsTemporalSS()&&e?(this._compositor.composite(t,i,n,this._temporalSS.getSourceFrameBuffer(),this._temporalSS.getFrame()),t.setViewport(this.viewport),this._temporalSS.render(t)):(t.setViewport(this.viewport),this._compositor.composite(t,i,n,null,0))):this.needsTemporalSS()&&e?((a=this._temporalSS.getSourceFrameBuffer()).bind(t),t.saveClear(),t.clearBit=t.gl.DEPTH_BUFFER_BIT|t.gl.COLOR_BUFFER_BIT,t.render(i,n,!0,!0),t.restoreClear(),a.unbind(t),t.setViewport(this.viewport),this._temporalSS.render(t)):(t.setViewport(this.viewport),t.render(i,n,!0,!0))},yt.prototype._updateTransparent=function(t,e,r,i){for(var n=new F,a=new k,o=r.getWorldPosition(),s=e.getRenderList(r).transparent,l=0;l<s.length;l++){var u=s[l],h=u.geometry;k.invert(a,u.worldTransform),F.transformMat4(n,o,a),h.needsSortTriangles&&h.needsSortTriangles()&&h.doSortTriangles(n,i),h.needsSortVertices&&h.needsSortVertices()&&h.doSortVertices(n,i)}},yt.prototype._updateSSAO=function(t,e,r){var i=this._enableSSAO&&this._enablePostEffect;i&&this._compositor.updateSSAO(t,e,r,this._temporalSS.getFrame());for(var n=e.getRenderList(r),a=0;a<n.opaque.length;a++){var o=n.opaque[a];o.renderNormal&&o.material[i?"enableTexture":"disableTexture"]("ssaoMap"),i&&o.material.set("ssaoMap",this._compositor.getSSAOTexture())}},yt.prototype._updateShadowPCFKernel=function(t){for(var e=this._pcfKernels[t%this._pcfKernels.length],r=this.scene.getRenderList(this.camera).opaque,i=0;i<r.length;i++)r[i].receiveShadow&&(r[i].material.set("pcfKernel",e),r[i].material.define("fragment","PCF_KERNEL_SIZE",e.length/2))},yt.prototype.dispose=function(t){this._compositor.dispose(t.gl),this._temporalSS.dispose(t.gl),this._shadowMapPass.dispose(t)},yt.prototype.setPostEffect=function(t,e){var r=this._compositor;this._enablePostEffect=t.get("enable");var i=t.getModel("bloom"),n=t.getModel("edge"),a=t.getModel("DOF",t.getModel("depthOfField")),o=t.getModel("SSAO",t.getModel("screenSpaceAmbientOcclusion")),s=t.getModel("SSR",t.getModel("screenSpaceReflection")),l=t.getModel("FXAA"),u=t.getModel("colorCorrection");i.get("enable")?r.enableBloom():r.disableBloom(),a.get("enable")?r.enableDOF():r.disableDOF(),s.get("enable")?r.enableSSR():r.disableSSR(),u.get("enable")?r.enableColorCorrection():r.disableColorCorrection(),n.get("enable")?r.enableEdge():r.disableEdge(),l.get("enable")?r.enableFXAA():r.disableFXAA(),this._enableDOF=a.get("enable"),this._enableSSAO=o.get("enable"),this._enableSSAO?r.enableSSAO():r.disableSSAO(),r.setBloomIntensity(i.get("intensity")),r.setEdgeColor(n.get("color")),r.setColorLookupTexture(u.get("lookupTexture"),e),r.setExposure(u.get("exposure")),["radius","quality","intensity"].forEach((function(h){r.setSSAOParameter(h,o.get(h))})),["quality","maxRoughness","physical"].forEach((function(h){r.setSSRParameter(h,s.get(h))})),["quality","focalDistance","focalRange","blurRadius","fstop"].forEach((function(h){r.setDOFParameter(h,a.get(h))})),["brightness","contrast","saturation"].forEach((function(h){r.setColorCorrection(h,u.get(h))}))},yt.prototype.setDOFFocusOnPoint=function(t){if(this._enablePostEffect)return t>this.camera.far||t<this.camera.near?void 0:(this._compositor.setDOFParameter("focalDistance",t),!0)},yt.prototype.setTemporalSuperSampling=function(t){this._enableTemporalSS=t.get("enable")},yt.prototype.isLinearSpace=function(){return this._enablePostEffect},yt.prototype.setRootNode=function(t){if(this.rootNode!==t){for(var e=this.rootNode.children(),r=0;r<e.length;r++)t.add(e[r]);t!==this.scene&&this.scene.add(t),this.rootNode=t}},yt.prototype.add=function(t){this.rootNode.add(t)},yt.prototype.remove=function(t){this.rootNode.remove(t)},yt.prototype.removeAll=function(t){this.rootNode.removeAll(t)},Object.assign(yt.prototype,za);let Qe=yt;function Gd(t,e){var r=va(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});r.y=e.getHeight()-r.y-r.height,this.viewGL.setViewport(r.x,r.y,r.width,r.height,e.getDevicePixelRatio());var i=t.get("boxWidth"),n=t.get("boxHeight"),a=t.get("boxDepth");this.getAxis("x").setExtent(-i/2,i/2),this.getAxis("y").setExtent(a/2,-a/2),this.getAxis("z").setExtent(-n/2,n/2),this.size=[i,n,a]}function Ud(t,e){var r={};t.eachSeries((function(i){if(i.coordinateSystem===this){var n=i.getData();["x","y","z"].forEach((function(a){n.mapDimensionsAll(a,!0).forEach((function(o){var s,l;s=a,l=n.getDataExtent(o,!0),r[s]=r[s]||[1/0,-1/0],r[s][0]=Math.min(l[0],r[s][0]),r[s][1]=Math.max(l[1],r[s][1])}))}))}}),this),["xAxis3D","yAxis3D","zAxis3D"].forEach((function(i){t.eachComponent(i,(function(n){var a=i.charAt(0),o=n.getReferringComponents("grid3D").models[0],s=o.coordinateSystem;if(s===this){var l=s.getAxis(a);if(!l){var u=M.helper.createScale(r[a]||[1/0,-1/0],n);(l=new vd(a,u)).type=n.get("type");var h=l.type==="category";l.onBand=h&&n.get("boundaryGap"),l.inverse=n.get("inverse"),n.axis=l,l.model=n,l.getLabelModel=function(){return n.getModel("axisLabel",o.getModel("axisLabel"))},l.getTickModel=function(){return n.getModel("axisTick",o.getModel("axisTick"))},s.addAxis(l)}}}),this)}),this),this.resize(this.model,e)}let kd={dimensions:_u.prototype.dimensions,create:function(t,e){var r=[];t.eachComponent("grid3D",(function(n){n.__viewGL=n.__viewGL||new Qe;var a=new _u;a.model=n,a.viewGL=n.__viewGL,n.coordinateSystem=a,r.push(a),a.resize=Gd,a.update=Ud}));var i=["xAxis3D","yAxis3D","zAxis3D"];return t.eachSeries((function(n){if(n.get("coordinateSystem")==="cartesian3D"){if((o=n.getReferringComponents("grid3D").models[0])==null){var a=(function(l,u){return i.map((function(h){var c=l.getReferringComponents(h).models[0];return c==null&&(c=u.getComponent(h)),c}))})(n,t),o=a[0].getCoordSysModel();a.forEach((function(l){l.getCoordSysModel()}))}var s=o.coordinateSystem;n.coordinateSystem=s}})),r}};var ku=M.ComponentModel.extend({type:"cartesian3DAxis",axis:null,getCoordSysModel:function(){return this.ecModel.queryComponents({mainType:"grid3D",index:this.option.gridIndex,id:this.option.gridId})[0]}});M.helper.mixinAxisModelCommonMethods(ku);let Vd=ku;var Vu={show:!0,grid3DIndex:0,inverse:!1,name:"",nameLocation:"middle",nameTextStyle:{fontSize:16},nameGap:20,axisPointer:{},axisLine:{},axisTick:{},axisLabel:{},splitArea:{}},Hd=M.util.merge({boundaryGap:!0,axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"},axisPointer:{label:{show:!1}}},Vu),ns=M.util.merge({boundaryGap:[0,0],splitNumber:5,axisPointer:{label:{}}},Vu),Wd=M.util.defaults({scale:!0,min:"dataMin",max:"dataMax"},ns),Hu=M.util.defaults({logBase:10},ns);Hu.scale=!0;let jd={categoryAxis3D:Hd,valueAxis3D:ns,timeAxis3D:Wd,logAxis3D:Hu};function Xd(t){return((r=typeof(e=t))=="function"||e&&r==="object")&&t.value!=null?t.value:t+"";var e,r}let qd=(function(){function t(e){this.categories=e.categories||[],this._needCollect=e.needCollect,this._deduplication=e.deduplication}return t.createByAxisModel=function(e){var r=e.option,i=r.data,n=i&&Po(i,Xd);return new t({categories:n,needCollect:!n,deduplication:r.dedplication!==!1})},t.prototype.getOrdinal=function(e){return this._getOrCreateMap().get(e)},t.prototype.parseAndCollect=function(e){var r,i=this._needCollect;if(typeof e!="string"&&!i)return e;if(i&&!this._deduplication)return r=this.categories.length,this.categories[r]=e,r;var n=this._getOrCreateMap();return(r=n.get(e))==null&&(i?(r=this.categories.length,this.categories[r]=e,n.set(e,r)):r=NaN),r},t.prototype._getOrCreateMap=function(){return this._map||(this._map=(e=this.categories,new $c(e)));var e},t})();var Zd=["value","category","time","log"];function Yd(t,e){return e.type||(e.data?"category":"value")}(0,M.use)((function(t){t.registerComponentModel(hd),t.registerComponentView(_d),t.registerCoordinateSystem("grid3D",kd),["x","y","z"].forEach((function(e){(function(i,n,a,o,s){Zd.forEach((function(l){var u=a.extend({type:n+"Axis3D."+l,__ordinalMeta:null,mergeDefaultAndTheme:function(h,c){var f=c.getTheme();M.util.merge(h,f.get(l+"Axis3D")),M.util.merge(h,this.getDefaultOption()),h.type=o(n,h)},optionUpdated:function(){this.option.type==="category"&&(this.__ordinalMeta=qd.createByAxisModel(this))},getCategories:function(){if(this.option.type==="category")return this.__ordinalMeta.categories},getOrdinalMeta:function(){return this.__ordinalMeta},defaultOption:M.util.merge(M.util.clone(jd[l+"Axis3D"]),s||{},!0)});i.registerComponentModel(u)})),i.registerSubTypeDefaulter(n+"Axis3D",M.util.curry(o,n))})(t,e,Vd,Yd,{name:e.toUpperCase()});let r=t.ComponentView.extend({type:e+"Axis3D"});t.registerComponentView(r)})),t.registerAction({type:"grid3DChangeCamera",event:"grid3dcamerachanged",update:"series:updateCamera"},(function(e,r){r.eachComponent({mainType:"grid3D",query:e},(function(i){i.setView(e)}))})),t.registerAction({type:"grid3DShowAxisPointer",event:"grid3dshowaxispointer",update:"grid3D:showAxisPointer"},(function(e,r){})),t.registerAction({type:"grid3DHideAxisPointer",event:"grid3dhideaxispointer",update:"grid3D:hideAxisPointer"},(function(e,r){}))}));let di={defaultOption:{shading:null,realisticMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},lambertMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},colorMaterial:{textureTiling:1,textureOffset:0,detailTexture:null},hatchingMaterial:{textureTiling:1,textureOffset:0,paperColor:"#fff"}}},Wu={getFilledRegions:function(t,e){var r,i=(t||[]).slice();if(typeof e=="string"?r=(e=M.getMap(e))&&e.geoJson:e&&e.features&&(r=e),!r)return[];for(var n={},a=r.features,o=0;o<i.length;o++)n[i[o].name]=i[o];for(o=0;o<a.length;o++){var s=a[o].properties.name;n[s]||i.push({name:s})}return i},defaultOption:{show:!0,zlevel:-10,map:"",left:0,top:0,width:"100%",height:"100%",boxWidth:100,boxHeight:10,boxDepth:"auto",regionHeight:3,environment:"auto",groundPlane:{show:!1,color:"#aaa"},shading:"lambert",light:{main:{alpha:40,beta:30}},viewControl:{alpha:40,beta:0,distance:100,orthographicSize:60,minAlpha:5,minBeta:-80,maxBeta:80},label:{show:!1,distance:2,textStyle:{fontSize:20,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:4}},itemStyle:{color:"#fff",borderWidth:0,borderColor:"#333"},emphasis:{itemStyle:{color:"#639fc0"},label:{show:!0}}}};var fi=M.ComponentModel.extend({type:"geo3D",layoutMode:"box",coordinateSystem:null,optionUpdated:function(){var t=this.option;t.regions=this.getFilledRegions(t.regions,t.map);var e=M.helper.createDimensions(t.data||[],{coordDimensions:["value"],encodeDefine:this.get("encode"),dimensionsDefine:this.get("dimensions")}),r=new M.List(e,this);r.initData(t.regions);var i={};r.each((function(n){var a=r.getName(n),o=r.getItemModel(n);i[a]=o})),this._regionModelMap=i,this._data=r},getData:function(){return this._data},getRegionModel:function(t){var e=this.getData().getName(t);return this._regionModelMap[e]||new M.Model(null,this)},getRegionPolygonCoords:function(t){var e=this.getData().getName(t),r=this.coordinateSystem.getRegion(e);return r?r.geometries:[]},getFormattedLabel:function(t,e){var r=this._data.getName(t),i=this.getRegionModel(t),n=i.get(e==="normal"?["label","formatter"]:["emphasis","label","formatter"]);n==null&&(n=i.get(["label","formatter"]));var a={name:r};if(typeof n=="function")return a.status=e,n(a);if(typeof n=="string"){var o=a.seriesName;return n.replace("{a}",o??"")}return r},defaultOption:{regions:[]}});M.util.merge(fi.prototype,Wu),M.util.merge(fi.prototype,sa),M.util.merge(fi.prototype,ai),M.util.merge(fi.prototype,oi),M.util.merge(fi.prototype,di);let Kd=fi,Qd=ju;function ju(t,e,r){r=r||2;var i,n,a,o,s,l,u,h=e&&e.length,c=h?e[0]*r:t.length,f=Xu(t,0,c,r,!0),p=[];if(!f)return p;if(h&&(f=(function(m,g,_,y){var x,v,w,b=[];for(x=0,v=g.length;x<v;x++)(w=Xu(m,g[x]*y,x<v-1?g[x+1]*y:m.length,y,!1))===w.next&&(w.steiner=!0),b.push(af(w));for(b.sort(rf),x=0;x<b.length;x++)nf(b[x],_),_=en(_,_.next);return _})(t,e,f,r)),t.length>80*r){i=a=t[0],n=o=t[1];for(var d=r;d<c;d+=r)(s=t[d])<i&&(i=s),(l=t[d+1])<n&&(n=l),s>a&&(a=s),l>o&&(o=l);u=Math.max(a-i,o-n)}return rn(f,p,r,i,n,u),p}function Xu(t,e,r,i,n){var a,o;if(n===ss(t,e,r,i)>0)for(a=e;a<r;a+=i)o=Yu(a,t[a],t[a+1],o);else for(a=r-i;a>=e;a-=i)o=Yu(a,t[a],t[a+1],o);return o&&Dr(o,o.next)&&(an(o),o=o.next),o}function en(t,e){if(!t)return t;e||(e=t);var r,i=t;do if(r=!1,i.steiner||!Dr(i,i.next)&&Yt(i.prev,i,i.next)!==0)i=i.next;else{if(an(i),(i=e=i.prev)===i.next)return null;r=!0}while(r||i!==e);return e}function rn(t,e,r,i,n,a,o){if(t){!o&&a&&(function(h,c,f,p){var d=h;do d.z===null&&(d.z=as(d.x,d.y,c,f,p)),d.prevZ=d.prev,d.nextZ=d.next,d=d.next;while(d!==h);d.prevZ.nextZ=null,d.prevZ=null,(function(m){var g,_,y,x,v,w,b,S,A=1;do{for(_=m,m=null,v=null,w=0;_;){for(w++,y=_,b=0,g=0;g<A&&(b++,y=y.nextZ);g++);for(S=A;b>0||S>0&&y;)b!==0&&(S===0||!y||_.z<=y.z)?(x=_,_=_.nextZ,b--):(x=y,y=y.nextZ,S--),v?v.nextZ=x:m=x,x.prevZ=v,v=x;_=y}v.nextZ=null,A*=2}while(w>1)})(d)})(t,i,n,a);for(var s,l,u=t;t.prev!==t.next;)if(s=t.prev,l=t.next,a?$d(t,i,n,a):Jd(t))e.push(s.i/r),e.push(t.i/r),e.push(l.i/r),an(t),t=l.next,u=l.next;else if((t=l)===u){o?o===1?rn(t=tf(t,e,r),e,r,i,n,a,2):o===2&&ef(t,e,r,i,n,a):rn(en(t),e,r,i,n,a,1);break}}}function Jd(t){var e=t.prev,r=t,i=t.next;if(Yt(e,r,i)>=0)return!1;for(var n=t.next.next;n!==t.prev;){if(xa(e.x,e.y,r.x,r.y,i.x,i.y,n.x,n.y)&&Yt(n.prev,n,n.next)>=0)return!1;n=n.next}return!0}function $d(t,e,r,i){var n=t.prev,a=t,o=t.next;if(Yt(n,a,o)>=0)return!1;for(var s=n.x<a.x?n.x<o.x?n.x:o.x:a.x<o.x?a.x:o.x,l=n.y<a.y?n.y<o.y?n.y:o.y:a.y<o.y?a.y:o.y,u=n.x>a.x?n.x>o.x?n.x:o.x:a.x>o.x?a.x:o.x,h=n.y>a.y?n.y>o.y?n.y:o.y:a.y>o.y?a.y:o.y,c=as(s,l,e,r,i),f=as(u,h,e,r,i),p=t.nextZ;p&&p.z<=f;){if(p!==t.prev&&p!==t.next&&xa(n.x,n.y,a.x,a.y,o.x,o.y,p.x,p.y)&&Yt(p.prev,p,p.next)>=0)return!1;p=p.nextZ}for(p=t.prevZ;p&&p.z>=c;){if(p!==t.prev&&p!==t.next&&xa(n.x,n.y,a.x,a.y,o.x,o.y,p.x,p.y)&&Yt(p.prev,p,p.next)>=0)return!1;p=p.prevZ}return!0}function tf(t,e,r){var i=t;do{var n=i.prev,a=i.next.next;!Dr(n,a)&&qu(n,i,i.next,a)&&nn(n,a)&&nn(a,n)&&(e.push(n.i/r),e.push(i.i/r),e.push(a.i/r),an(i),an(i.next),i=t=a),i=i.next}while(i!==t);return i}function ef(t,e,r,i,n,a){var o=t;do{for(var s=o.next.next;s!==o.prev;){if(o.i!==s.i&&of(o,s)){var l=Zu(o,s);return o=en(o,o.next),l=en(l,l.next),rn(o,e,r,i,n,a),void rn(l,e,r,i,n,a)}s=s.next}o=o.next}while(o!==t)}function rf(t,e){return t.x-e.x}function nf(t,e){if(e=(function(i,n){var a,o=n,s=i.x,l=i.y,u=-1/0;do{if(l<=o.y&&l>=o.next.y&&o.next.y!==o.y){var h=o.x+(l-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(h<=s&&h>u){if(u=h,h===s){if(l===o.y)return o;if(l===o.next.y)return o.next}a=o.x<o.next.x?o:o.next}}o=o.next}while(o!==n);if(!a)return null;if(s===u)return a.prev;var c,f=a,p=a.x,d=a.y,m=1/0;for(o=a.next;o!==f;)s>=o.x&&o.x>=p&&s!==o.x&&xa(l<d?s:u,l,p,d,l<d?u:s,l,o.x,o.y)&&((c=Math.abs(l-o.y)/(s-o.x))<m||c===m&&o.x>a.x)&&nn(o,i)&&(a=o,m=c),o=o.next;return a})(t,e)){var r=Zu(e,t);en(r,r.next)}}function as(t,e,r,i,n){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=32767*(t-r)/n)|t<<8))|t<<4))|t<<2))|t<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=32767*(e-i)/n)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function af(t){var e=t,r=t;do e.x<r.x&&(r=e),e=e.next;while(e!==t);return r}function xa(t,e,r,i,n,a,o,s){return(n-o)*(e-s)-(t-o)*(a-s)>=0&&(t-o)*(i-s)-(r-o)*(e-s)>=0&&(r-o)*(a-s)-(n-o)*(i-s)>=0}function of(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!(function(r,i){var n=r;do{if(n.i!==r.i&&n.next.i!==r.i&&n.i!==i.i&&n.next.i!==i.i&&qu(n,n.next,r,i))return!0;n=n.next}while(n!==r);return!1})(t,e)&&nn(t,e)&&nn(e,t)&&(function(r,i){var n=r,a=!1,o=(r.x+i.x)/2,s=(r.y+i.y)/2;do n.y>s!=n.next.y>s&&n.next.y!==n.y&&o<(n.next.x-n.x)*(s-n.y)/(n.next.y-n.y)+n.x&&(a=!a),n=n.next;while(n!==r);return a})(t,e)}function Yt(t,e,r){return(e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function Dr(t,e){return t.x===e.x&&t.y===e.y}function qu(t,e,r,i){return!!(Dr(t,e)&&Dr(r,i)||Dr(t,i)&&Dr(r,e))||Yt(t,e,r)>0!=Yt(t,e,i)>0&&Yt(r,i,t)>0!=Yt(r,i,e)>0}function nn(t,e){return Yt(t.prev,t,t.next)<0?Yt(t,e,t.next)>=0&&Yt(t,t.prev,e)>=0:Yt(t,e,t.prev)<0||Yt(t,t.next,e)<0}function Zu(t,e){var r=new os(t.i,t.x,t.y),i=new os(e.i,e.x,e.y),n=t.next,a=e.prev;return t.next=e,e.prev=t,r.next=n,n.prev=r,i.next=r,r.prev=i,a.next=i,i.prev=a,i}function Yu(t,e,r,i){var n=new os(t,e,r);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function an(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function os(t,e,r){this.i=t,this.x=e,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ss(t,e,r,i){for(var n=0,a=e,o=r-i;a<r;a+=i)n+=(t[o]-t[a])*(t[a+1]+t[o+1]),o=a;return n}function ls(t,e,r){var i=t[e];t[e]=t[r],t[r]=i}function Ku(t,e,r,i,n){var a=r,o=t[e];ls(t,e,i);for(var s=r;s<i;s++)n(t[s],o)<0&&(ls(t,s,a),a++);return ls(t,i,a),a}function ba(t,e,r,i){if(r<i){var n=Ku(t,Math.floor((r+i)/2),r,i,e);ba(t,e,r,n-1),ba(t,e,n+1,i)}}function us(){this._parts=[]}ju.deviation=function(t,e,r,i){var n=e&&e.length,a=n?e[0]*r:t.length,o=Math.abs(ss(t,0,a,r));if(n)for(var s=0,l=e.length;s<l;s++){var u=e[s]*r,h=s<l-1?e[s+1]*r:t.length;o-=Math.abs(ss(t,u,h,r))}var c=0;for(s=0;s<i.length;s+=3){var f=i[s]*r,p=i[s+1]*r,d=i[s+2]*r;c+=Math.abs((t[f]-t[d])*(t[p+1]-t[f+1])-(t[f]-t[p])*(t[d+1]-t[f+1]))}return o===0&&c===0?0:Math.abs((c-o)/o)},us.prototype.step=function(t,e,r){var i=t.length;if(r===0){this._parts=[],this._sorted=!1;var n=Math.floor(i/2);this._parts.push({pivot:n,left:0,right:i-1}),this._currentSortPartIdx=0}if(!this._sorted){var a=this._parts;if(a.length===0)return this._sorted=!0,!0;if(a.length<512){for(var o=0;o<a.length;o++)a[o].pivot=Ku(t,a[o].pivot,a[o].left,a[o].right,e);var s=[];for(o=0;o<a.length;o++){var l,u=a[o].left;(l=a[o].pivot-1)>u&&s.push({pivot:Math.floor((l+u)/2),left:u,right:l}),u=a[o].pivot+1,(l=a[o].right)>u&&s.push({pivot:Math.floor((l+u)/2),left:u,right:l})}a=this._parts=s}else for(o=0;o<Math.floor(a.length/10);o++){var h=a.length-1-this._currentSortPartIdx;if(ba(t,e,a[h].left,a[h].right),this._currentSortPartIdx++,this._currentSortPartIdx===a.length)return this._sorted=!0,!0}return!1}},us.sort=ba;let wa=us;var pi=Mt.vec3,Qu=pi.create(),Ju=pi.create(),$u=pi.create();let hs={needsSortTriangles:function(){return this.indices&&this.sortTriangles},needsSortTrianglesProgressively:function(){return this.needsSortTriangles()&&this.triangleCount>=2e4},doSortTriangles:function(t,e){var r=this.indices;if(e===0){var i=this.attributes.position;t=t.array,this._triangleZList&&this._triangleZList.length===this.triangleCount||(this._triangleZList=new Float32Array(this.triangleCount),this._sortedTriangleIndices=new Uint32Array(this.triangleCount),this._indicesTmp=new r.constructor(r.length),this._triangleZListTmp=new Float32Array(this.triangleCount));for(var n,a=0,o=0;o<r.length;){i.get(r[o++],Qu),i.get(r[o++],Ju),i.get(r[o++],$u);var s=pi.sqrDist(Qu,t),l=pi.sqrDist(Ju,t),u=pi.sqrDist($u,t),h=Math.min(s,l);h=Math.min(h,u),o===3?(n=h,h=0):h-=n,this._triangleZList[a++]=h}}var c=this._sortedTriangleIndices;for(o=0;o<c.length;o++)c[o]=o;if(this.triangleCount<2e4)e===0&&this._simpleSort(!0);else for(o=0;o<3;o++)this._progressiveQuickSort(3*e+o);var f=this._indicesTmp,p=this._triangleZListTmp,d=this._triangleZList;for(o=0;o<this.triangleCount;o++){var m=3*c[o],g=3*o;f[g++]=r[m++],f[g++]=r[m++],f[g]=r[m],p[o]=d[c[o]]}var _=this._indicesTmp;this._indicesTmp=this.indices,this.indices=_,_=this._triangleZListTmp,this._triangleZListTmp=this._triangleZList,this._triangleZList=_,this.dirtyIndices()},_simpleSort:function(t){var e=this._triangleZList,r=this._sortedTriangleIndices;function i(n,a){return e[a]-e[n]}t?Array.prototype.sort.call(r,i):wa.sort(r,i,0,r.length-1)},_progressiveQuickSort:function(t){var e=this._triangleZList,r=this._sortedTriangleIndices;this._quickSort=this._quickSort||new wa,this._quickSort.step(r,(function(i,n){return e[n]-e[i]}),t)}};function Ft(t,e){let r=t.getItemVisual(e,"style");if(r)return r[t.getVisual("drawType")]}function Bt(t,e){let r=t.getItemVisual(e,"style");return r&&r.opacity}function Lr(t,e,r){this._labelsMesh=new Xo,this._labelTextureSurface=new Ho({width:512,height:512,devicePixelRatio:r.getDevicePixelRatio(),onupdate:function(){r.getZr().refresh()}}),this._api=r,this._labelsMesh.material.set("textureAtlas",this._labelTextureSurface.getTexture())}Lr.prototype.getLabelPosition=function(t,e,r){return[0,0,0]},Lr.prototype.getLabelDistance=function(t,e,r){return 0},Lr.prototype.getMesh=function(){return this._labelsMesh},Lr.prototype.updateData=function(t,e,r){e==null&&(e=0),r==null&&(r=t.count()),this._labelsVisibilitiesBits&&this._labelsVisibilitiesBits.length===r-e||(this._labelsVisibilitiesBits=new Uint8Array(r-e));for(var i=["label","show"],n=["emphasis","label","show"],a=e;a<r;a++){var o=t.getItemModel(a),s=o.get(i),l=o.get(n);l==null&&(l=s);var u=(s?1:0)|(l?2:0);this._labelsVisibilitiesBits[a-e]=u}this._start=e,this._end=r,this._data=t},Lr.prototype.updateLabels=function(t){if(this._data){for(var e=(t=t||[]).length>0,r={},i=0;i<t.length;i++)r[t[i]]=!0;this._labelsMesh.geometry.convertToDynamicArray(!0),this._labelTextureSurface.clear();for(var n=["label"],a=["emphasis","label"],o=this._data.hostModel,s=this._data,l=o.getModel(n),u=o.getModel(a,l),h={left:"right",right:"left",top:"center",bottom:"center"},c={left:"middle",right:"middle",top:"bottom",bottom:"top"},f=this._start;f<this._end;f++){var p=!1;if(e&&r[f]&&(p=!0),this._labelsVisibilitiesBits[f-this._start]&(p?2:1)){var d=s.getItemModel(f).getModel(p?a:n,p?u:l),m=d.get("distance")||0,g=d.get("position"),_=this._api.getDevicePixelRatio(),y=o.getFormattedLabel(f,p?"emphasis":"normal");if(y==null||y==="")return;var x=new M.graphic.Text({style:ua(d,{text:y,fill:d.get("color")||Ft(s,f)||"#000",align:"left",verticalAlign:"top",opacity:J(d.get("opacity"),Bt(s,f),1)})}),v=x.getBoundingRect();v.height*=1.2;var w=this._labelTextureSurface.add(x),b=h[g]||"center",S=c[g]||"bottom";this._labelsMesh.geometry.addSprite(this.getLabelPosition(f,g,m),[v.width*_,v.height*_],w,b,S,this.getLabelDistance(f,g,m)*_)}}this._labelsMesh.material.set("uvScale",this._labelTextureSurface.getCoordsScale()),this._labelTextureSurface.getZr().refreshImmediately(),this._labelsMesh.geometry.convertToTypedArray(),this._labelsMesh.geometry.dirty()}},Lr.prototype.dispose=function(){this._labelTextureSurface.dispose()};let cs=Lr;var $t=Mt.vec3;function ds(t){this.rootNode=new T.Node,this._triangulationResults={},this._shadersMap=T.COMMON_SHADERS.filter((function(r){return r!=="shadow"})).reduce((function(r,i){return r[i]=T.createShader("ecgl."+i),r}),{}),this._linesShader=T.createShader("ecgl.meshLines3D");var e={};T.COMMON_SHADERS.forEach((function(r){e[r]=new T.Material({shader:T.createShader("ecgl."+r)})})),this._groundMaterials=e,this._groundMesh=new T.Mesh({geometry:new T.PlaneGeometry({dynamic:!0}),castShadow:!1,renderNormal:!0,$ignorePicking:!0}),this._groundMesh.rotation.rotateX(-Math.PI/2),this._labelsBuilder=new cs(512,512,t),this._labelsBuilder.getMesh().renderOrder=100,this._labelsBuilder.getMesh().material.depthTest=!1,this.rootNode.add(this._labelsBuilder.getMesh()),this._initMeshes(),this._api=t}T.Shader.import(fa),ds.prototype={constructor:ds,extrudeY:!0,update:function(t,e,r,i,n){var a=t.getData();i==null&&(i=0),n==null&&(n=a.count()),this._startIndex=i,this._endIndex=n-1,this._triangulation(t,i,n);var o=this._getShader(t.get("shading"));this._prepareMesh(t,o,r,i,n),this.rootNode.updateWorldTransform(),this._updateRegionMesh(t,r,i,n);var s=t.coordinateSystem;s.type==="geo3D"&&this._updateGroundPlane(t,s,r);var l=this;this._labelsBuilder.updateData(a,i,n),this._labelsBuilder.getLabelPosition=function(u,h,c){var f=a.getName(u),p=c;if(s.type==="geo3D"){var d=s.getRegion(f);return d?(g=d.getCenter(),s.dataToPoint([g[0],g[1],p])):[NaN,NaN,NaN]}var m=l._triangulationResults[u-l._startIndex],g=l.extrudeY?[(m.max[0]+m.min[0])/2,m.max[1]+p,(m.max[2]+m.min[2])/2]:[(m.max[0]+m.min[0])/2,(m.max[1]+m.min[1])/2,m.max[2]+p]},this._data=a,this._labelsBuilder.updateLabels(),this._updateDebugWireframe(t),this._lastHoverDataIndex=0},_initMeshes:function(){var t=this,e=(function(){var i=new T.Mesh({name:"Polygon",material:new T.Material({shader:t._shadersMap.lambert}),geometry:new T.Geometry({sortTriangles:!0,dynamic:!0}),culling:!1,ignorePicking:!0,renderNormal:!0});return Object.assign(i.geometry,hs),i})(),r=new T.Mesh({material:new T.Material({shader:this._linesShader}),castShadow:!1,ignorePicking:!0,$ignorePicking:!0,geometry:new xr({useNativeLine:!1})});this.rootNode.add(e),this.rootNode.add(r),e.material.define("both","VERTEX_COLOR"),e.material.define("fragment","DOUBLE_SIDED"),this._polygonMesh=e,this._linesMesh=r,this.rootNode.add(this._groundMesh)},_getShader:function(t){var e=this._shadersMap[t];return e||(e=this._shadersMap.lambert),e.__shading=t,e},_prepareMesh:function(t,e,r,i,n){for(var a=0,o=0,s=0,l=0,u=i;u<n;u++){var h=this._getRegionPolygonInfo(u),c=this._getRegionLinesInfo(u,t,this._linesMesh.geometry);a+=h.vertexCount,o+=h.triangleCount,s+=c.vertexCount,l+=c.triangleCount}var f=this._polygonMesh,p=f.geometry;["position","normal","texcoord0","color"].forEach((function(d){p.attributes[d].init(a)})),p.indices=a>65535?new Uint32Array(3*o):new Uint16Array(3*o),f.material.shader!==e&&f.material.attachShader(e,!0),T.setMaterialFromModel(e.__shading,f.material,t,r),s>0&&(this._linesMesh.geometry.resetOffset(),this._linesMesh.geometry.setVertexCount(s),this._linesMesh.geometry.setTriangleCount(l)),this._dataIndexOfVertex=new Uint32Array(a),this._vertexRangeOfDataIndex=new Uint32Array(2*(n-i))},_updateRegionMesh:function(t,e,r,i){for(var n=t.getData(),a=0,o=0,s=!1,l=this._polygonMesh,u=this._linesMesh,h=r;h<i;h++){var c=t.getRegionModel(h),f=c.getModel("itemStyle"),p=J(Ft(n,h),f.get("color"),"#fff"),d=J(Bt(n,h),f.get("opacity"),1),m=T.parseColor(p),g=T.parseColor(f.get("borderColor"));m[3]*=d,g[3]*=d;var _=m[3]<.99;l.material.set("color",[1,1,1,1]),s=s||_;for(var y=J(c.get("height",!0),t.get("regionHeight")),x=this._updatePolygonGeometry(t,l.geometry,h,y,a,o,m),v=a;v<x.vertexOffset;v++)this._dataIndexOfVertex[v]=h;this._vertexRangeOfDataIndex[2*(h-r)]=a,this._vertexRangeOfDataIndex[2*(h-r)+1]=x.vertexOffset,a=x.vertexOffset,o=x.triangleOffset;var w=f.get("borderWidth"),b=w>0;b&&(w*=e.getDevicePixelRatio(),this._updateLinesGeometry(u.geometry,t,h,y,w,t.coordinateSystem.transform)),u.invisible=!b,u.material.set({color:g})}(l=this._polygonMesh).material.transparent=s,l.material.depthMask=!s,l.geometry.updateBoundingBox(),l.frontFace=this.extrudeY?T.Mesh.CCW:T.Mesh.CW,l.material.get("normalMap")&&l.geometry.generateTangents(),l.seriesIndex=t.seriesIndex,l.on("mousemove",this._onmousemove,this),l.on("mouseout",this._onmouseout,this)},_updateDebugWireframe:function(t){var e=t.getModel("debug.wireframe");if(e.get("show")){var r=T.parseColor(e.get("lineStyle.color")||"rgba(0,0,0,0.5)"),i=J(e.get("lineStyle.width"),1),n=this._polygonMesh;n.geometry.generateBarycentric(),n.material.define("both","WIREFRAME_TRIANGLE"),n.material.set("wireframeLineColor",r),n.material.set("wireframeLineWidth",i)}},_onmousemove:function(t){var e=this._dataIndexOfVertex[t.triangle[0]];e==null&&(e=-1),e!==this._lastHoverDataIndex&&(this.downplay(this._lastHoverDataIndex),this.highlight(e),this._labelsBuilder.updateLabels([e])),this._lastHoverDataIndex=e,this._polygonMesh.dataIndex=e},_onmouseout:function(t){t.target&&(this.downplay(this._lastHoverDataIndex),this._lastHoverDataIndex=-1,this._polygonMesh.dataIndex=-1),this._labelsBuilder.updateLabels([])},_updateGroundPlane:function(t,e,r){var i=t.getModel("groundPlane",t);if(this._groundMesh.invisible=!i.get("show",!0),!this._groundMesh.invisible){var n=t.get("shading"),a=this._groundMaterials[n];a||(a=this._groundMaterials.lambert),T.setMaterialFromModel(n,a,i,r),a.get("normalMap")&&this._groundMesh.geometry.generateTangents(),this._groundMesh.material=a,this._groundMesh.material.set("color",T.parseColor(i.get("color"))),this._groundMesh.scale.set(e.size[0],e.size[2],1)}},_triangulation:function(t,e,r){this._triangulationResults=[];for(var i=[1/0,1/0,1/0],n=[-1/0,-1/0,-1/0],a=t.coordinateSystem,o=e;o<r;o++){for(var s=[],l=t.getRegionPolygonCoords(o),u=0;u<l.length;u++){var h=l[u].exterior,c=l[u].interiors,f=[],p=[];if(!(h.length<3)){for(var d=0,m=0;m<h.length;m++){var g=h[m];f[d++]=g[0],f[d++]=g[1]}for(m=0;m<c.length;m++)if(!(c[m].length<3)){for(var _=f.length/2,y=0;y<c[m].length;y++)g=c[m][y],f.push(g[0]),f.push(g[1]);p.push(_)}var x=Qd(f,p),v=new Float64Array(f.length/2*3),w=[],b=[1/0,1/0,1/0],S=[-1/0,-1/0,-1/0],A=0;for(m=0;m<f.length;)$t.set(w,f[m++],0,f[m++]),a&&a.transform&&$t.transformMat4(w,w,a.transform),$t.min(b,b,w),$t.max(S,S,w),v[A++]=w[0],v[A++]=w[1],v[A++]=w[2];$t.min(i,i,b),$t.max(n,n,S),s.push({points:v,indices:x,min:b,max:S})}}this._triangulationResults.push(s)}this._geoBoundingBox=[i,n]},_getRegionPolygonInfo:function(t){for(var e=this._triangulationResults[t-this._startIndex],r=0,i=0,n=0;n<e.length;n++)r+=e[n].points.length/3,i+=e[n].indices.length/3;return{vertexCount:2*r+4*r,triangleCount:2*i+2*r}},_updatePolygonGeometry:function(t,e,r,i,n,a,o){var s=t.get("projectUVOnGround"),l=e.attributes.position,u=e.attributes.normal,h=e.attributes.texcoord0,c=e.attributes.color,f=this._triangulationResults[r-this._startIndex],p=c.value&&o,d=e.indices,m=this.extrudeY?1:2,g=this.extrudeY?2:1,_=[this.rootNode.worldTransform.x.len(),this.rootNode.worldTransform.y.len(),this.rootNode.worldTransform.z.len()],y=$t.mul([],this._geoBoundingBox[0],_),x=$t.mul([],this._geoBoundingBox[1],_),v=Math.max(x[0]-y[0],x[2]-y[2]);function w(Wt,se,Rr){var ge=n;(function(or,Se,Na){for(var gn=or.points,Ap=gn.length,Ia=[],Os=[],xi=0;xi<Ap;xi+=3)Ia[0]=gn[xi],Ia[m]=Se,Ia[g]=gn[xi+2],Os[0]=(gn[xi]*_[0]-y[0])/v,Os[1]=(gn[xi+2]*_[g]-y[2])/v,l.set(n,Ia),p&&c.set(n,o),h.set(n++,Os)})(Wt,se);for(var Fr=Wt.indices.length,Kt=0;Kt<Fr;Kt++)d[3*a+Kt]=Wt.indices[Kt]+ge;a+=Wt.indices.length/3}for(var b=this.extrudeY?[0,1,0]:[0,0,1],S=$t.negate([],b),A=0;A<f.length;A++){var D=n,P=f[A];w(P,0),w(P,i);for(var L=P.points.length/3,O=0;O<L;O++)u.set(D+O,S),u.set(D+O+L,b);var N=[0,3,1,1,3,2],C=[[],[],[],[]],B=[],I=[],X=[],V=[],st=0;for(O=0;O<L;O++){for(var U=(O+1)%L,Tt=(P.points[3*U]-P.points[3*O])*_[0],lt=(P.points[3*U+2]-P.points[3*O+2])*_[g],ht=Math.sqrt(Tt*Tt+lt*lt),Q=0;Q<4;Q++){var ee=Q===0||Q===3,pt=3*(ee?O:U);C[Q][0]=P.points[pt],C[Q][m]=Q>1?i:0,C[Q][g]=P.points[pt+2],l.set(n+Q,C[Q]),s?(V[0]=(P.points[pt]*_[0]-y[0])/v,V[1]=(P.points[pt+2]*_[g]-y[g])/v):(V[0]=(ee?st:st+ht)/v,V[1]=(C[Q][m]*_[m]-y[m])/v),h.set(n+Q,V)}for($t.sub(B,C[1],C[0]),$t.sub(I,C[3],C[0]),$t.cross(X,B,I),$t.normalize(X,X),Q=0;Q<4;Q++)u.set(n+Q,X),p&&c.set(n+Q,o);for(Q=0;Q<6;Q++)d[3*a+Q]=N[Q]+n;n+=4,a+=2,st+=ht}}return e.dirty(),{vertexOffset:n,triangleOffset:a}},_getRegionLinesInfo:function(t,e,r){var i=0,n=0;return e.getRegionModel(t).getModel("itemStyle").get("borderWidth")>0&&e.getRegionPolygonCoords(t).forEach((function(a){var o=a.exterior,s=a.interiors;i+=r.getPolylineVertexCount(o),n+=r.getPolylineTriangleCount(o);for(var l=0;l<s.length;l++)i+=r.getPolylineVertexCount(s[l]),n+=r.getPolylineTriangleCount(s[l])}),this),{vertexCount:i,triangleCount:n}},_updateLinesGeometry:function(t,e,r,i,n,a){function o(l){for(var u=new Float64Array(3*l.length),h=0,c=[],f=0;f<l.length;f++)c[0]=l[f][0],c[1]=i+.1,c[2]=l[f][1],a&&$t.transformMat4(c,c,a),u[h++]=c[0],u[h++]=c[1],u[h++]=c[2];return u}var s=[1,1,1,1];e.getRegionPolygonCoords(r).forEach((function(l){var u=l.exterior,h=l.interiors;t.addPolyline(o(u),s,n);for(var c=0;c<h.length;c++)t.addPolyline(o(h[c]),s,n)}))},highlight:function(t){var e=this._data;if(e){var r=e.getItemModel(t).getModel(["emphasis","itemStyle"]),i=r.get("color"),n=J(r.get("opacity"),Bt(e,t),1);if(i==null){var a=Ft(e,t);i=M.color.lift(a,-.4)}n==null&&(n=Bt(e,t));var o=T.parseColor(i);o[3]*=n,this._setColorOfDataIndex(e,t,o)}},downplay:function(t){var e=this._data;if(e){var r=e.getItemModel(t),i=J(Ft(e,t),r.get(["itemStyle","color"]),"#fff"),n=J(Bt(e,t),r.get(["itemStyle","opacity"]),1),a=T.parseColor(i);a[3]*=n,this._setColorOfDataIndex(e,t,a)}},dispose:function(){this._labelsBuilder.dispose()},_setColorOfDataIndex:function(t,e,r){if(!(e<this._startIndex&&e>this._endIndex)){e-=this._startIndex;for(var i=this._vertexRangeOfDataIndex[2*e];i<this._vertexRangeOfDataIndex[2*e+1];i++)this._polygonMesh.geometry.attributes.color.set(i,r);this._polygonMesh.geometry.dirty(),this._api.getZr().refresh()}}};let Ta=ds,sf=M.ComponentView.extend({type:"geo3D",__ecgl__:!0,init:function(t,e){this._geo3DBuilder=new Ta(e),this.groupGL=new T.Node,this._lightRoot=new T.Node,this._sceneHelper=new li(this._lightRoot),this._sceneHelper.initLight(this._lightRoot),this._control=new ha({zr:e.getZr()}),this._control.init()},render:function(t,e,r){this.groupGL.add(this._geo3DBuilder.rootNode);var i=t.coordinateSystem;if(i&&i.viewGL){i.viewGL.add(this._lightRoot),t.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL);var n=this._control;n.setViewGL(i.viewGL);var a=t.getModel("viewControl");n.setFromViewControlModel(a,0),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(t),i.viewGL.setPostEffect(t.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling")),this._geo3DBuilder.update(t,e,r,0,t.getData().count());var o=i.viewGL.isLinearSpace()?"define":"undefine";this._geo3DBuilder.rootNode.traverse((function(s){s.material&&s.material[o]("fragment","SRGB_DECODE")})),n.off("update"),n.on("update",(function(){r.dispatchAction({type:"geo3DChangeCamera",alpha:n.getAlpha(),beta:n.getBeta(),distance:n.getDistance(),center:n.getCenter(),from:this.uid,geo3DId:t.id})})),n.update()}},afterRender:function(t,e,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r)},dispose:function(){this._control.dispose(),this._geo3DBuilder.dispose()}});var lf={\u5357\u6D77\u8BF8\u5C9B:[32,80],\u5E7F\u4E1C:[0,-10],\u9999\u6E2F:[10,5],\u6FB3\u95E8:[-10,10],\u5929\u6D25:[5,5]},uf={Russia:[100,60],"United States":[-99,38],"United States of America":[-99,38]},hf=Mt.vec3,mi=Mt.mat4,cf=[function(t,e){if(t==="china"){var r=lf[e.name];if(r){var i=e.getCenter();i[0]+=r[0]/10.5,i[1]+=-r[1]/14,e.setCenter(i)}}},function(t,e){if(t==="world"){var r=uf[e.name];if(r){var i=[r[0],r[1]];e.setCenter(i)}}}];function fs(t,e,r,i,n){this.name=t,this.map=e,this.regionHeight=0,this.regions=[],this._nameCoordMap={},this.loadGeoJson(r,i,n),this.transform=mi.identity(new Float64Array(16)),this.invTransform=mi.identity(new Float64Array(16)),this.extrudeY=!0,this.altitudeAxis}fs.prototype={constructor:fs,type:"geo3D",dimensions:["lng","lat","alt"],containPoint:function(){},loadGeoJson:function(t,e,r){var i=M.parseGeoJSON||M.parseGeoJson;try{this.regions=t?i(t):[]}catch(u){throw`Invalid geoJson format
`+u}e=e||{},r=r||{};for(var n=this.regions,a={},o=0;o<n.length;o++){var s=n[o].name;s=r[s]||s,n[o].name=s,a[s]=n[o],this.addGeoCoord(s,n[o].getCenter());var l=e[s];l&&n[o].transformTo(l.left,l.top,l.width,l.height)}this._regionsMap=a,this._geoRect=null,cf.forEach((function(u){u(this)}),this)},getGeoBoundingRect:function(){if(this._geoRect)return this._geoRect;for(var t,e=this.regions,r=0;r<e.length;r++){var i=e[r].getBoundingRect();(t=t||i.clone()).union(i)}return this._geoRect=t||new M.graphic.BoundingRect(0,0,0,0)},addGeoCoord:function(t,e){this._nameCoordMap[t]=e},getRegion:function(t){return this._regionsMap[t]},getRegionByCoord:function(t){for(var e=this.regions,r=0;r<e.length;r++)if(e[r].contain(t))return e[r]},setSize:function(t,e,r){this.size=[t,e,r];var i=this.getGeoBoundingRect(),n=t/i.width,a=-r/i.height,o=-t/2-i.x*n,s=r/2-i.y*a,l=this.extrudeY?[o,0,s]:[o,s,0],u=this.extrudeY?[n,1,a]:[n,a,1],h=this.transform;mi.identity(h),mi.translate(h,h,l),mi.scale(h,h,u),mi.invert(this.invTransform,h)},dataToPoint:function(t,e){e=e||[];var r=this.extrudeY?1:2,i=this.extrudeY?2:1,n=t[2];return isNaN(n)&&(n=0),e[0]=t[0],e[i]=t[1],this.altitudeAxis?e[r]=this.altitudeAxis.dataToCoord(n):e[r]=0,e[r]+=this.regionHeight,hf.transformMat4(e,e,this.transform),e},pointToData:function(t,e){}};let th=fs;function df(t,e){var r=va(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});r.y=e.getHeight()-r.y-r.height,this.viewGL.setViewport(r.x,r.y,r.width,r.height,e.getDevicePixelRatio());var i=this.getGeoBoundingRect(),n=i.width/i.height*(t.get("aspectScale")||.75),a=t.get("boxWidth"),o=t.get("boxDepth"),s=t.get("boxHeight");s==null&&(s=5),isNaN(a)&&isNaN(o)&&(a=100),isNaN(o)?o=a/n:isNaN(a)&&(a=o/n),this.setSize(a,s,o),this.regionHeight=t.get("regionHeight"),this.altitudeAxis&&this.altitudeAxis.setExtent(0,Math.max(s-this.regionHeight,0))}function ff(t,e){var r=[1/0,-1/0];if(t.eachSeries((function(n){if(n.coordinateSystem===this&&n.type!=="series.map3D"){var a=n.getData(),o=n.coordDimToDataDim("alt"),s=o&&o[0];if(s){var l=a.getDataExtent(s,!0);r[0]=Math.min(r[0],l[0]),r[1]=Math.max(r[1],l[1])}}}),this),r&&isFinite(r[1]-r[0])){var i=M.helper.createScale(r,{type:"value",min:"dataMin",max:"dataMax"});this.altitudeAxis=new M.Axis("altitude",i),this.resize(this.model,e)}}var eh=0,rh={dimensions:th.prototype.dimensions,create:function(t,e){var r=[];if(!M.getMap)throw new Error("geo3D component depends on geo component");function i(n,a){var o=rh.createGeo3D(n);n.__viewGL=n.__viewGL||new Qe,o.viewGL=n.__viewGL,n.coordinateSystem=o,o.model=n,r.push(o),o.resize=df,o.resize(n,e),o.update=ff}return t.eachComponent("geo3D",(function(n,a){i(n)})),t.eachSeriesByType("map3D",(function(n,a){var o=n.get("coordinateSystem");o==null&&(o="geo3D"),o==="geo3D"&&i(n)})),t.eachSeries((function(n){if(n.get("coordinateSystem")==="geo3D"){if(n.type==="series.map3D")return;var a=n.getReferringComponents("geo3D").models[0];if(a||(a=t.getComponent("geo3D")),!a)throw new Error('geo "'+J(n.get("geo3DIndex"),n.get("geo3DId"),0)+'" not found');n.coordinateSystem=a.coordinateSystem}})),r},createGeo3D:function(t){var e,r=t.get("map");return typeof r=="string"?(e=r,r=M.getMap(r)):r&&r.features&&(r={geoJson:r}),e==null&&(e="GEO_ANONYMOUS_"+eh++),new th(e+eh++,e,r&&r.geoJson,r&&r.specialAreas,t.get("nameMap"))}};let ih=rh;var nh="__ECGL_GEO3D_REGISTERED";function ah(t){t[nh]||(t[nh]=!0,t.registerComponentModel(Kd),t.registerComponentView(sf),t.registerAction({type:"geo3DChangeCamera",event:"geo3dcamerachanged",update:"series:updateCamera"},(function(e,r){r.eachComponent({mainType:"geo3D",query:e},(function(i){i.setView(e)}))})),t.registerCoordinateSystem("geo3D",ih))}function oh(t,e){t.id=t.id||t.name||e+""}(0,M.use)(ah);var Pr=M.ComponentModel.extend({type:"globe",layoutMode:"box",coordinateSystem:null,init:function(){Pr.superApply(this,"init",arguments),M.util.each(this.option.layers,(function(t,e){M.util.merge(t,this.defaultLayerOption),oh(t,e)}),this)},mergeOption:function(t){var e=this.option.layers;function r(o){return M.util.reduce(o,(function(s,l,u){return oh(l,u),s[l.id]=l,s}),{})}if(this.option.layers=null,Pr.superApply(this,"mergeOption",arguments),e&&e.length){var i=r(t.layers),n=r(e);for(var a in i)n[a]?M.util.merge(n[a],i[a],!0):e.push(t.layers[a]);this.option.layers=e}M.util.each(this.option.layers,(function(o){M.util.merge(o,this.defaultLayerOption)}),this)},optionUpdated:function(){this.updateDisplacementHash()},defaultLayerOption:{show:!0,type:"overlay"},defaultOption:{show:!0,zlevel:-10,left:0,top:0,width:"100%",height:"100%",environment:"auto",baseColor:"#fff",baseTexture:"",heightTexture:"",displacementTexture:"",displacementScale:0,displacementQuality:"medium",globeRadius:100,globeOuterRadius:150,shading:"lambert",light:{main:{time:""}},atmosphere:{show:!1,offset:5,color:"#ffffff",glowPower:6,innerGlowPower:2},viewControl:{autoRotate:!0,panSensitivity:0,targetCoord:null},layers:[]},setDisplacementData:function(t,e,r){this.displacementData=t,this.displacementWidth=e,this.displacementHeight=r},getDisplacementTexture:function(){return this.get("displacementTexture")||this.get("heightTexture")},getDisplacemenScale:function(){var t=this.getDisplacementTexture(),e=this.get("displacementScale");return t&&t!=="none"||(e=0),e},hasDisplacement:function(){return this.getDisplacemenScale()>0},_displacementChanged:!0,_displacementScale:0,updateDisplacementHash:function(){var t=this.getDisplacementTexture(),e=this.getDisplacemenScale();this._displacementChanged=this._displacementTexture!==t||this._displacementScale!==e,this._displacementTexture=t,this._displacementScale=e},isDisplacementChanged:function(){return this._displacementChanged}});M.util.merge(Pr.prototype,sa),M.util.merge(Pr.prototype,ai),M.util.merge(Pr.prototype,oi),M.util.merge(Pr.prototype,di);let pf=Pr;var sh=Math.PI,de=Math.sin,Ve=Math.cos,lh=Math.tan,uh=Math.asin,hh=Math.atan2,Or=sh/180,Sa=23.4397*Or;function mf(t,e){return hh(de(t)*Ve(Sa)-lh(e)*de(Sa),Ve(t))}function gf(t,e,r){return hh(de(t),Ve(t)*de(e)-lh(r)*Ve(e))}function _f(t,e,r){return uh(de(e)*de(r)+Ve(e)*Ve(r)*Ve(t))}var ch={};ch.getPosition=function(t,e,r){var i=Or*-r,n=Or*e,a=(function(l){return(function(u){return u.valueOf()/864e5-.5+2440588})(l)-2451545})(t),o=(function(l){var u,h,c=(h=(function(f){return Or*(357.5291+.98560028*f)})(l))+Or*(1.9148*de(h)+.02*de(2*h)+3e-4*de(3*h))+102.9372*Or+sh;return{dec:(u=c,uh(de(0)*Ve(Sa)+Ve(0)*de(Sa)*de(u))),ra:mf(c,0)}})(a),s=(function(l,u){return Or*(280.16+360.9856235*l)-u})(a,i)-o.ra;return{azimuth:gf(s,n,o.dec),altitude:_f(s,n,o.dec)}};let vf=ch;T.Shader.import(Zl),T.Shader.import(`@export ecgl.atmosphere.vertex
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
@end`);let yf=M.ComponentView.extend({type:"globe",__ecgl__:!0,_displacementScale:0,init:function(t,e){this.groupGL=new T.Node,this._sphereGeometry=new T.SphereGeometry({widthSegments:200,heightSegments:100,dynamic:!0}),this._overlayGeometry=new T.SphereGeometry({widthSegments:80,heightSegments:40}),this._planeGeometry=new T.PlaneGeometry,this._earthMesh=new T.Mesh({renderNormal:!0}),this._atmosphereMesh=new T.Mesh,this._atmosphereGeometry=new T.SphereGeometry({widthSegments:80,heightSegments:40}),this._atmosphereMaterial=new T.Material({shader:new T.Shader(T.Shader.source("ecgl.atmosphere.vertex"),T.Shader.source("ecgl.atmosphere.fragment")),transparent:!0}),this._atmosphereMesh.geometry=this._atmosphereGeometry,this._atmosphereMesh.material=this._atmosphereMaterial,this._atmosphereMesh.frontFace=T.Mesh.CW,this._lightRoot=new T.Node,this._sceneHelper=new li,this._sceneHelper.initLight(this._lightRoot),this.groupGL.add(this._atmosphereMesh),this.groupGL.add(this._earthMesh),this._control=new ha({zr:e.getZr()}),this._control.init(),this._layerMeshes={}},render:function(t,e,r){var i=t.coordinateSystem,n=t.get("shading");i.viewGL.add(this._lightRoot),t.get("show")?i.viewGL.add(this.groupGL):i.viewGL.remove(this.groupGL),this._sceneHelper.setScene(i.viewGL.scene),i.viewGL.setPostEffect(t.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling"));var a=this._earthMesh;a.geometry=this._sphereGeometry;var o="ecgl."+n;a.material&&a.material.shader.name===o||(a.material=T.createMaterial(o)),T.setMaterialFromModel(n,a.material,t,r),["roughnessMap","metalnessMap","detailMap","normalMap"].forEach((function(c){var f=a.material.get(c);f&&(f.flipY=!1)})),a.material.set("color",T.parseColor(t.get("baseColor")));var s=.99*i.radius;if(a.scale.set(s,s,s),t.get("atmosphere.show")){a.material.define("both","ATMOSPHERE_ENABLED"),this._atmosphereMesh.invisible=!1,this._atmosphereMaterial.setUniforms({glowPower:t.get("atmosphere.glowPower")||6,glowColor:t.get("atmosphere.color")||"#ffffff"}),a.material.setUniforms({glowPower:t.get("atmosphere.innerGlowPower")||2,glowColor:t.get("atmosphere.color")||"#ffffff"});var l=t.get("atmosphere.offset")||5;this._atmosphereMesh.scale.set(s+l,s+l,s+l)}else a.material.undefine("both","ATMOSPHERE_ENABLED"),this._atmosphereMesh.invisible=!0;var u=a.material.setTextureImage("diffuseMap",t.get("baseTexture"),r,{flipY:!1,anisotropic:8});u&&u.surface&&u.surface.attachToMesh(a);var h=a.material.setTextureImage("bumpMap",t.get("heightTexture"),r,{flipY:!1,anisotropic:8});h&&h.surface&&h.surface.attachToMesh(a),a.material[t.get("postEffect.enable")?"define":"undefine"]("fragment","SRGB_DECODE"),this._updateLight(t,r),this._displaceVertices(t,r),this._updateViewControl(t,r),this._updateLayers(t,r)},afterRender:function(t,e,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r)},_updateLayers:function(t,e){var r=t.coordinateSystem,i=t.get("layers"),n=r.radius,a=[],o=[],s=[],l=[];M.util.each(i,(function(p){var d=new M.Model(p),m=d.get("type"),g=T.loadTexture(d.get("texture"),e,{flipY:!1,anisotropic:8});if(g.surface&&g.surface.attachToMesh(this._earthMesh),m==="blend"){var _=d.get("blendTo"),y=J(d.get("intensity"),1);_==="emission"?(s.push(g),l.push(y)):(a.push(g),o.push(y))}else{var x=d.get("id"),v=this._layerMeshes[x];v||(v=this._layerMeshes[x]=new T.Mesh({geometry:this._overlayGeometry,castShadow:!1,ignorePicking:!0})),d.get("shading")==="lambert"?(v.material=v.__lambertMaterial||new T.Material({autoUpdateTextureStatus:!1,shader:T.createShader("ecgl.lambert"),transparent:!0,depthMask:!1}),v.__lambertMaterial=v.material):(v.material=v.__colorMaterial||new T.Material({autoUpdateTextureStatus:!1,shader:T.createShader("ecgl.color"),transparent:!0,depthMask:!1}),v.__colorMaterial=v.material),v.material.enableTexture("diffuseMap");var w=d.get("distance"),b=n+(w??r.radius/100);v.scale.set(b,b,b),n=b;var S=this._blankTexture||(this._blankTexture=T.createBlankTexture("rgba(255, 255, 255, 0)"));v.material.set("diffuseMap",S),T.loadTexture(d.get("texture"),e,{flipY:!1,anisotropic:8},(function(A){A.surface&&A.surface.attachToMesh(v),v.material.set("diffuseMap",A),e.getZr().refresh()})),d.get("show")?this.groupGL.add(v):this.groupGL.remove(v)}}),this);var u=this._earthMesh.material;u.define("fragment","LAYER_DIFFUSEMAP_COUNT",a.length),u.define("fragment","LAYER_EMISSIVEMAP_COUNT",s.length),u.set("layerDiffuseMap",a),u.set("layerDiffuseIntensity",o),u.set("layerEmissiveMap",s),u.set("layerEmissionIntensity",l);var h=t.getModel("debug.wireframe");if(h.get("show")){u.define("both","WIREFRAME_TRIANGLE");var c=T.parseColor(h.get("lineStyle.color")||"rgba(0,0,0,0.5)"),f=J(h.get("lineStyle.width"),1);u.set("wireframeLineWidth",f),u.set("wireframeLineColor",c)}else u.undefine("both","WIREFRAME_TRIANGLE")},_updateViewControl:function(t,e){var r=t.coordinateSystem,i=t.getModel("viewControl"),n=(r.viewGL.camera,this),a=this._control;a.setViewGL(r.viewGL);var o,s,l=i.get("targetCoord");l!=null&&(s=l[0]+90,o=l[1]),a.setFromViewControlModel(i,{baseDistance:r.radius,alpha:o,beta:s}),a.off("update"),a.on("update",(function(){e.dispatchAction({type:"globeChangeCamera",alpha:a.getAlpha(),beta:a.getBeta(),distance:a.getDistance()-r.radius,center:a.getCenter(),from:n.uid,globeId:t.id})}))},_displaceVertices:function(t,e){var r=t.get("displacementQuality"),i=t.get("debug.wireframe.show"),n=t.coordinateSystem;if(t.isDisplacementChanged()||r!==this._displacementQuality||i!==this._showDebugWireframe){this._displacementQuality=r,this._showDebugWireframe=i;var a=this._sphereGeometry,o={low:100,medium:200,high:400,ultra:800}[r]||200,s=o/2;(a.widthSegments!==o||i)&&(a.widthSegments=o,a.heightSegments=s,a.build()),this._doDisplaceVertices(a,n),i&&a.generateBarycentric()}},_doDisplaceVertices:function(t,e){var r=t.attributes.position.value,i=t.attributes.texcoord0.value,n=t.__originalPosition;n&&n.length===r.length||((n=new Float32Array(r.length)).set(r),t.__originalPosition=n);for(var a=e.displacementWidth,o=e.displacementHeight,s=e.displacementData,l=0;l<t.vertexCount;l++){var u=3*l,h=2*l,c=n[u+1],f=n[u+2],p=n[u+3],d=i[h++],m=i[h++],g=Math.round(d*(a-1)),_=Math.round(m*(o-1)),y=s?s[_*a+g]:0;r[u+1]=c+c*y,r[u+2]=f+f*y,r[u+3]=p+p*y}t.generateVertexNormals(),t.dirty(),t.updateBoundingBox()},_updateLight:function(t,e){var r=this._earthMesh;this._sceneHelper.updateLight(t);var i=this._sceneHelper.mainLight,n=t.get("light.main.time")||new Date,a=vf.getPosition(M.number.parseDate(n),0,0),o=Math.cos(a.altitude);i.position.y=-o*Math.cos(a.azimuth),i.position.x=Math.sin(a.altitude),i.position.z=o*Math.sin(a.azimuth),i.lookAt(r.getWorldPosition())},dispose:function(t,e){this.groupGL.removeAll(),this._control.dispose()}});var xf=Mt.vec3;function ps(t){this.radius=t,this.viewGL=null,this.altitudeAxis,this.displacementData=null,this.displacementWidth,this.displacementHeight}ps.prototype={constructor:ps,dimensions:["lng","lat","alt"],type:"globe",containPoint:function(){},setDisplacementData:function(t,e,r){this.displacementData=t,this.displacementWidth=e,this.displacementHeight=r},_getDisplacementScale:function(t,e){var r=(t+180)/360*(this.displacementWidth-1),i=(90-e)/180*(this.displacementHeight-1),n=Math.round(r)+Math.round(i)*this.displacementWidth;return this.displacementData[n]},dataToPoint:function(t,e){var r=t[0],i=t[1],n=t[2]||0,a=this.radius;this.displacementData&&(a*=1+this._getDisplacementScale(r,i)),this.altitudeAxis&&(a+=this.altitudeAxis.dataToCoord(n)),r=r*Math.PI/180,i=i*Math.PI/180;var o=Math.cos(i)*a;return(e=e||[])[0]=-o*Math.cos(r+Math.PI),e[1]=Math.sin(i)*a,e[2]=o*Math.sin(r+Math.PI),e},pointToData:function(t,e){var r=t[0],i=t[1],n=t[2],a=xf.len(t);r/=a,i/=a,n/=a;var o=Math.asin(i),s=Math.atan2(n,-r);s<0&&(s=2*Math.PI+s);var l=180*o/Math.PI,u=180*s/Math.PI-180;return(e=e||[])[0]=u,e[1]=l,e[2]=a-this.radius,this.altitudeAxis&&(e[2]=this.altitudeAxis.coordToData(e[2])),e}};let dh=ps;function bf(t,e){var r=va(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});r.y=e.getHeight()-r.y-r.height,this.viewGL.setViewport(r.x,r.y,r.width,r.height,e.getDevicePixelRatio()),this.radius=t.get("globeRadius");var i=t.get("globeOuterRadius");this.altitudeAxis&&this.altitudeAxis.setExtent(0,i-this.radius)}function wf(t,e){var r=[1/0,-1/0];if(t.eachSeries((function(n){if(n.coordinateSystem===this){var a=n.getData(),o=n.coordDimToDataDim("alt"),s=o&&o[0];if(s){var l=a.getDataExtent(s,!0);r[0]=Math.min(r[0],l[0]),r[1]=Math.max(r[1],l[1])}}}),this),r&&isFinite(r[1]-r[0])){var i=M.helper.createScale(r,{type:"value",min:"dataMin",max:"dataMax"});this.altitudeAxis=new M.Axis("altitude",i),this.resize(this.model,e)}}let Tf={dimensions:dh.prototype.dimensions,create:function(t,e){var r=[];return t.eachComponent("globe",(function(i){i.__viewGL=i.__viewGL||new Qe;var n=new dh;n.viewGL=i.__viewGL,i.coordinateSystem=n,n.model=i,r.push(n),n.resize=bf,n.resize(i,e),n.update=wf})),t.eachSeries((function(i){if(i.get("coordinateSystem")==="globe"){var n=i.getReferringComponents("globe").models[0];if(n||(n=t.getComponent("globe")),!n)throw new Error('globe "'+J(i.get("globe3DIndex"),i.get("globe3DId"),0)+'" not found');var a=n.coordinateSystem;i.coordinateSystem=a}})),t.eachComponent("globe",(function(i,n){var a=i.coordinateSystem,o=i.getDisplacementTexture(),s=i.getDisplacemenScale();if(i.isDisplacementChanged()){if(i.hasDisplacement()){var l=!0;T.loadTexture(o,e,(function(u){var h=(function(c,f){var p=document.createElement("canvas"),d=p.getContext("2d"),m=c.width,g=c.height;p.width=m,p.height=g,d.drawImage(c,0,0,m,g);for(var _=d.getImageData(0,0,m,g).data,y=new Float32Array(_.length/4),x=0;x<_.length/4;x++){var v=_[4*x];y[x]=v/255*f}return{data:y,width:m,height:g}})(u.image,s);i.setDisplacementData(h.data,h.width,h.height),l||e.dispatchAction({type:"globeUpdateDisplacment"})})),l=!1}else a.setDisplacementData(null,0,0);a.setDisplacementData(i.displacementData,i.displacementWidth,i.displacementHeight)}})),r}};(0,M.use)((function(t){t.registerComponentModel(pf),t.registerComponentView(yf),t.registerCoordinateSystem("globe",Tf),t.registerAction({type:"globeChangeCamera",event:"globecamerachanged",update:"series:updateCamera"},(function(e,r){r.eachComponent({mainType:"globe",query:e},(function(i){i.setView(e)}))})),t.registerAction({type:"globeUpdateDisplacment",event:"globedisplacementupdated",update:"update"},(function(e,r){}))}));var fh=["zoom","center","pitch","bearing"],ms=M.ComponentModel.extend({type:"mapbox3D",layoutMode:"box",coordinateSystem:null,defaultOption:{zlevel:-10,style:"mapbox://styles/mapbox/light-v9",center:[0,0],zoom:0,pitch:0,bearing:0,light:{main:{alpha:20,beta:30}},altitudeScale:1,boxHeight:"auto"},getMapboxCameraOption:function(){var t=this;return fh.reduce((function(e,r){return e[r]=t.get(r),e}),{})},setMapboxCameraOption:function(t){t!=null&&fh.forEach((function(e){t[e]!=null&&(this.option[e]=t[e])}),this)},getMapbox:function(){return this._mapbox},setMapbox:function(t){this._mapbox=t}});M.util.merge(ms.prototype,ai),M.util.merge(ms.prototype,oi);let Sf=ms;function Je(t,e){if(this.id=t,this.zr=e,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute;left:0;right:0;top:0;bottom:0;",!mapboxgl)throw new Error("Mapbox GL library must be included. See https://www.mapbox.com/mapbox-gl-js/api/");this._mapbox=new mapboxgl.Map({container:this.dom}),this._initEvents()}Je.prototype.setUnpainted=function(){},Je.prototype.resize=function(){this._mapbox.resize()},Je.prototype.getMapbox=function(){return this._mapbox},Je.prototype.clear=function(){},Je.prototype.refresh=function(){this._mapbox.resize()};var ph=["mousedown","mouseup","click","dblclick","mousemove","mousewheel","wheel","touchstart","touchend","touchmove","touchcancel"];Je.prototype._initEvents=function(){var t=this._mapbox.getCanvasContainer();this._handlers=this._handlers||{contextmenu:function(e){return e.preventDefault(),!1}},ph.forEach((function(e){this._handlers[e]=function(r){var i={};for(var n in r)i[n]=r[n];i.bubbles=!1;var a=new r.constructor(r.type,i);t.dispatchEvent(a)},this.zr.dom.addEventListener(e,this._handlers[e])}),this),this.zr.dom.addEventListener("contextmenu",this._handlers.contextmenu)},Je.prototype.dispose=function(){ph.forEach((function(t){this.zr.dom.removeEventListener(t,this._handlers[t])}),this)};let Mf=Je,mh=`
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

@end`;T.Shader.import(mh);let Af=M.ComponentView.extend({type:"mapbox3D",__ecgl__:!0,init:function(t,e){var r=e.getZr();this._zrLayer=new Mf("mapbox3D",r),r.painter.insertLayer(-1e3,this._zrLayer),this._lightRoot=new T.Node,this._sceneHelper=new li(this._lightRoot),this._sceneHelper.initLight(this._lightRoot);var i=this._zrLayer.getMapbox(),n=this._dispatchInteractAction.bind(this,e,i);["zoom","rotate","drag","pitch","rotate","move"].forEach((function(a){i.on(a,n)})),this._groundMesh=new T.Mesh({geometry:new T.PlaneGeometry,material:new T.Material({shader:new T.Shader({vertex:T.Shader.source("ecgl.displayShadow.vertex"),fragment:T.Shader.source("ecgl.displayShadow.fragment")}),depthMask:!1}),renderOrder:-100,culling:!1,castShadow:!1,$ignorePicking:!0,renderNormal:!0})},render:function(t,e,r){var i=this._zrLayer.getMapbox(),n=t.get("style"),a=JSON.stringify(n);a!==this._oldStyleStr&&n&&i.setStyle(n),this._oldStyleStr=a,i.setCenter(t.get("center")),i.setZoom(t.get("zoom")),i.setPitch(t.get("pitch")),i.setBearing(t.get("bearing")),t.setMapbox(i);var o=t.coordinateSystem;o.viewGL.scene.add(this._lightRoot),o.viewGL.add(this._groundMesh),this._updateGroundMesh(),this._sceneHelper.setScene(o.viewGL.scene),this._sceneHelper.updateLight(t),o.viewGL.setPostEffect(t.getModel("postEffect"),r),o.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling")),this._mapbox3DModel=t},afterRender:function(t,e,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r),t.coordinateSystem.viewGL.scene.traverse((function(a){a.material&&(a.material.define("fragment","NORMAL_UP_AXIS",2),a.material.define("fragment","NORMAL_FRONT_AXIS",1))}))},updateCamera:function(t,e,r,i){t.coordinateSystem.setCameraOption(i),this._updateGroundMesh(),r.getZr().refresh()},_dispatchInteractAction:function(t,e,r){t.dispatchAction({type:"mapbox3DChangeCamera",pitch:e.getPitch(),zoom:e.getZoom(),center:e.getCenter().toArray(),bearing:e.getBearing(),mapbox3DId:this._mapbox3DModel&&this._mapbox3DModel.id})},_updateGroundMesh:function(){if(this._mapbox3DModel){var t=this._mapbox3DModel.coordinateSystem,e=t.dataToPoint(t.center);this._groundMesh.position.set(e[0],e[1],-.001);var r=new T.Plane(new T.Vector3(0,0,1),0),i=t.viewGL.camera.castRay(new T.Vector2(-1,-1)),n=t.viewGL.camera.castRay(new T.Vector2(1,1)),a=i.intersectPlane(r),o=n.intersectPlane(r),s=a.dist(o)/t.viewGL.rootNode.scale.x;this._groundMesh.scale.set(s,s,1)}},dispose:function(t,e){this._zrLayer&&this._zrLayer.dispose(),e.getZr().painter.delLayer(-1e3)}});var $e=Mt.mat4,on=512,gs=.6435011087932844,te=Math.PI,gi=.1;function _s(){this.width=0,this.height=0,this.altitudeScale=1,this.boxHeight="auto",this.altitudeExtent,this.bearing=0,this.pitch=0,this.center=[0,0],this._origin,this.zoom=0,this._initialZoom,this.maxPitch=60,this.zoomOffset=0}_s.prototype={constructor:_s,dimensions:["lng","lat","alt"],containPoint:function(){},setCameraOption:function(t){this.bearing=t.bearing,this.pitch=t.pitch,this.center=t.center,this.zoom=t.zoom,this._origin||(this._origin=this.projectOnTileWithScale(this.center,on)),this._initialZoom==null&&(this._initialZoom=this.zoom),this.updateTransform()},updateTransform:function(){if(this.height){var t=.5/Math.tan(gs/2)*this.height*gi,e=Math.max(Math.min(this.pitch,this.maxPitch),0)/180*Math.PI,r=gs/2,i=Math.PI/2+e,n=Math.sin(r)*t/Math.sin(Math.PI-i-r),a=1.1*(Math.cos(Math.PI/2-e)*n+t);this.pitch>50&&(a=1e3);var o=[];$e.perspective(o,gs,this.width/this.height,1,a),this.viewGL.camera.projectionMatrix.setArray(o),this.viewGL.camera.decomposeProjectionMatrix(),o=$e.identity([]);var s=this.dataToPoint(this.center);$e.scale(o,o,[1,-1,1]),$e.translate(o,o,[0,0,-t]),$e.rotateX(o,o,e),$e.rotateZ(o,o,-this.bearing/180*Math.PI),$e.translate(o,o,[-s[0]*this.getScale()*gi,-s[1]*this.getScale()*gi,0]),this.viewGL.camera.viewMatrix.array=o;var l=[];$e.invert(l,o),this.viewGL.camera.worldTransform.array=l,this.viewGL.camera.decomposeWorldTransform();var u,h=on*this.getScale();if(this.altitudeExtent&&!isNaN(this.boxHeight)){var c=this.altitudeExtent[1]-this.altitudeExtent[0];u=this.boxHeight/c*this.getScale()/Math.pow(2,this._initialZoom-this.zoomOffset)}else u=h/(2*Math.PI*6378e3*Math.abs(Math.cos(this.center[1]*(Math.PI/180))))*this.altitudeScale*gi;this.viewGL.rootNode.scale.set(this.getScale()*gi,this.getScale()*gi,u)}},getScale:function(){return Math.pow(2,this.zoom-this.zoomOffset)},projectOnTile:function(t,e){return this.projectOnTileWithScale(t,this.getScale()*on,e)},projectOnTileWithScale:function(t,e,r){var i=t[0],n=t[1]*te/180,a=e*(i*te/180+te)/(2*te),o=e*(te-Math.log(Math.tan(te/4+.5*n)))/(2*te);return(r=r||[])[0]=a,r[1]=o,r},unprojectFromTile:function(t,e){return this.unprojectOnTileWithScale(t,this.getScale()*on,e)},unprojectOnTileWithScale:function(t,e,r){var i=t[0],n=t[1],a=i/e*(2*te)-te,o=2*(Math.atan(Math.exp(te-n/e*(2*te)))-te/4);return(r=r||[])[0]=180*a/te,r[1]=180*o/te,r},dataToPoint:function(t,e){return(e=this.projectOnTileWithScale(t,on,e))[0]-=this._origin[0],e[1]-=this._origin[1],e[2]=isNaN(t[2])?0:t[2],isNaN(t[2])||(e[2]=t[2],this.altitudeExtent&&(e[2]-=this.altitudeExtent[0])),e}};let Ma=_s;function sn(){Ma.apply(this,arguments)}function gh(t,e,r){function i(a,o){var s=o.getWidth(),l=o.getHeight(),u=o.getDevicePixelRatio();this.viewGL.setViewport(0,0,s,l,u),this.width=s,this.height=l,this.altitudeScale=a.get("altitudeScale"),this.boxHeight=a.get("boxHeight")}function n(a,o){if(this.model.get("boxHeight")!=="auto"){var s=[1/0,-1/0];a.eachSeries((function(l){if(l.coordinateSystem===this){var u=l.getData(),h=l.coordDimToDataDim("alt")[0];if(h){var c=u.getDataExtent(h,!0);s[0]=Math.min(s[0],c[0]),s[1]=Math.max(s[1],c[1])}}}),this),s&&isFinite(s[1]-s[0])&&(this.altitudeExtent=s)}}return{dimensions:e.prototype.dimensions,create:function(a,o){var s=[];return a.eachComponent(t,(function(l){var u=l.__viewGL;u||(u=l.__viewGL=new Qe).setRootNode(new T.Node);var h=new e;h.viewGL=l.__viewGL,h.resize=i,h.resize(l,o),s.push(h),l.coordinateSystem=h,h.model=l,h.update=n})),a.eachSeries((function(l){if(l.get("coordinateSystem")===t){var u=l.getReferringComponents(t).models[0];if(u||(u=a.getComponent(t)),!u)throw new Error(t+' "'+J(l.get(t+"Index"),l.get(t+"Id"),0)+'" not found');l.coordinateSystem=u.coordinateSystem}})),r&&r(s,a,o),s}}}sn.prototype=new Ma,sn.prototype.constructor=sn,sn.prototype.type="mapbox3D";let Ef=gh("mapbox3D",sn,(function(t){t.forEach((function(e){e.setCameraOption(e.model.getMapboxCameraOption())}))}));(0,M.use)((function(t){t.registerComponentModel(Sf),t.registerComponentView(Af),t.registerCoordinateSystem("mapbox3D",Ef),t.registerAction({type:"mapbox3DChangeCamera",event:"mapbox3dcamerachanged",update:"mapbox3D:updateCamera"},(function(e,r){r.eachComponent({mainType:"mapbox3D",query:e},(function(i){i.setMapboxCameraOption(e)}))}))}));var _h=["zoom","center","pitch","bearing"],vs=M.ComponentModel.extend({type:"maptalks3D",layoutMode:"box",coordinateSystem:null,defaultOption:{zlevel:-10,urlTemplate:"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",attribution:'&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',center:[0,0],zoom:0,pitch:0,bearing:0,light:{main:{alpha:20,beta:30}},altitudeScale:1,boxHeight:"auto"},getMaptalksCameraOption:function(){var t=this;return _h.reduce((function(e,r){return e[r]=t.get(r),e}),{})},setMaptalksCameraOption:function(t){t!=null&&_h.forEach((function(e){t[e]!=null&&(this.option[e]=t[e])}),this)},getMaptalks:function(){return this._maptalks},setMaptalks:function(t){this._maptalks=t}});M.util.merge(vs.prototype,ai),M.util.merge(vs.prototype,oi);let Cf=vs;function tr(t,e,r,i){if(this.id=t,this.zr=e,this.dom=document.createElement("div"),this.dom.style.cssText="position:absolute;left:0;right:0;top:0;bottom:0;",!maptalks)throw new Error("Maptalks library must be included. See https://maptalks.org");this._maptalks=new maptalks.Map(this.dom,{center:r,zoom:i,doubleClickZoom:!1,fog:!1}),this._initEvents()}tr.prototype.setUnpainted=function(){},tr.prototype.resize=function(){this._maptalks.checkSize()},tr.prototype.getMaptalks=function(){return this._maptalks},tr.prototype.clear=function(){},tr.prototype.refresh=function(){this._maptalks.checkSize()};var vh=["mousedown","mouseup","click","dblclick","mousemove","mousewheel","DOMMouseScroll","touchstart","touchend","touchmove","touchcancel"];tr.prototype._initEvents=function(){var t=this.dom;this._handlers=this._handlers||{contextmenu:function(e){return e.preventDefault(),!1}},vh.forEach((function(e){this._handlers[e]=function(r){var i={};for(var n in r)i[n]=r[n];i.bubbles=!1;var a=new r.constructor(r.type,i);e==="mousewheel"||e==="DOMMouseScroll"?t.dispatchEvent(a):t.firstElementChild.dispatchEvent(a)},this.zr.dom.addEventListener(e,this._handlers[e])}),this),this.zr.dom.addEventListener("contextmenu",this._handlers.contextmenu)},tr.prototype.dispose=function(){vh.forEach((function(t){this.zr.dom.removeEventListener(t,this._handlers[t])}),this),this._maptalks.remove()};let Df=tr;T.Shader.import(mh);let Lf=M.ComponentView.extend({type:"maptalks3D",__ecgl__:!0,init:function(t,e){this._groundMesh=new T.Mesh({geometry:new T.PlaneGeometry,material:new T.Material({shader:new T.Shader({vertex:T.Shader.source("ecgl.displayShadow.vertex"),fragment:T.Shader.source("ecgl.displayShadow.fragment")}),depthMask:!1}),renderOrder:-100,culling:!1,castShadow:!1,$ignorePicking:!0,renderNormal:!0})},_initMaptalksLayer:function(t,e){var r=e.getZr();this._zrLayer=new Df("maptalks3D",r,t.get("center"),t.get("zoom")),r.painter.insertLayer(-1e3,this._zrLayer),this._lightRoot=new T.Node,this._sceneHelper=new li(this._lightRoot),this._sceneHelper.initLight(this._lightRoot);var i=this._zrLayer.getMaptalks(),n=this._dispatchInteractAction.bind(this,e,i);["zoomend","zooming","zoomstart","dragrotating","pitch","pitchend","movestart","moving","moveend","resize","touchstart","touchmove","touchend","animating"].forEach((function(a){i.on(a,n)}))},render:function(t,e,r){this._zrLayer||this._initMaptalksLayer(t,r);var i=this._zrLayer.getMaptalks(),n=t.get("urlTemplate"),a=i.getBaseLayer();n!==this._oldUrlTemplate&&(a?a.setOptions({urlTemplate:n,attribution:t.get("attribution")}):(a=new maptalks.TileLayer("maptalks-echarts-gl-baselayer",{urlTemplate:n,subdomains:["a","b","c"],attribution:t.get("attribution")}),i.setBaseLayer(a))),this._oldUrlTemplate=n,i.setCenter(t.get("center")),i.setZoom(t.get("zoom"),{animation:!1}),i.setPitch(t.get("pitch")),i.setBearing(t.get("bearing")),t.setMaptalks(i);var o=t.coordinateSystem;o.viewGL.scene.add(this._lightRoot),o.viewGL.add(this._groundMesh),this._updateGroundMesh(),this._sceneHelper.setScene(o.viewGL.scene),this._sceneHelper.updateLight(t),o.viewGL.setPostEffect(t.getModel("postEffect"),r),o.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling")),this._maptalks3DModel=t},afterRender:function(t,e,r,i){var n=i.renderer;this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r),t.coordinateSystem.viewGL.scene.traverse((function(a){a.material&&(a.material.define("fragment","NORMAL_UP_AXIS",2),a.material.define("fragment","NORMAL_FRONT_AXIS",1))}))},updateCamera:function(t,e,r,i){t.coordinateSystem.setCameraOption(i),this._updateGroundMesh(),r.getZr().refresh()},_dispatchInteractAction:function(t,e,r){var i;t.dispatchAction({type:"maptalks3DChangeCamera",pitch:e.getPitch(),zoom:(i=e.getResolution(),19-Math.log(i/Pf)/Math.LN2+1),center:e.getCenter().toArray(),bearing:e.getBearing(),maptalks3DId:this._maptalks3DModel&&this._maptalks3DModel.id})},_updateGroundMesh:function(){if(this._maptalks3DModel){var t=this._maptalks3DModel.coordinateSystem,e=t.dataToPoint(t.center);this._groundMesh.position.set(e[0],e[1],-.001);var r=new T.Plane(new T.Vector3(0,0,1),0),i=t.viewGL.camera.castRay(new T.Vector2(-1,-1)),n=t.viewGL.camera.castRay(new T.Vector2(1,1)),a=i.intersectPlane(r),o=n.intersectPlane(r),s=a.dist(o)/t.viewGL.rootNode.scale.x;this._groundMesh.scale.set(s,s,1)}},dispose:function(t,e){this._zrLayer&&this._zrLayer.dispose(),e.getZr().painter.delLayer(-1e3)}}),Pf=12756274*Math.PI/(256*Math.pow(2,20));function ln(){Ma.apply(this,arguments),this.maxPitch=85,this.zoomOffset=1}ln.prototype=new Ma,ln.prototype.constructor=ln,ln.prototype.type="maptalks3D";let Of=gh("maptalks3D",ln,(function(t){t.forEach((function(e){e.setCameraOption(e.model.getMaptalksCameraOption())}))}));(0,M.use)((function(t){t.registerComponentModel(Cf),t.registerComponentView(Lf),t.registerCoordinateSystem("maptalks3D",Of),t.registerAction({type:"maptalks3DChangeCamera",event:"maptalks3dcamerachanged",update:"maptalks3D:updateCamera"},(function(e,r){r.eachComponent({mainType:"maptalks3D",query:e},(function(i){i.setMaptalksCameraOption(e)}))}))}));var Nf=Mt.vec3,If=M.helper.dataStack.isDimensionStacked;function ys(t,e,r){for(var i=t.getDataExtent(e),n=t.getDataExtent(r),a=i[1]-i[0]||i[0],o=n[1]-n[0]||n[0],s=new Uint8Array(2500),l=0;l<t.count();l++){var u=t.get(e,l),h=t.get(r,l),c=Math.floor((u-i[0])/a*49),f=50*Math.floor((h-n[0])/o*49)+c;s[f]=s[f]||1}var p=0;for(l=0;l<s.length;l++)s[l]&&p++;return p/s.length}var yh=Mt.vec3,Rf=M.helper.dataStack.isDimensionStacked;function xs(t,e){var r=Rf(t,e[2]);return{dimension:r?t.getCalculationInfo("stackResultDimension"):e[2],isStacked:r}}function Ff(t){t.registerLayout((function(e,r){e.eachSeriesByType("bar3D",(function(i){var n=i.coordinateSystem,a=n&&n.type;a==="globe"?(function(o,s){var l=o.getData(),u=o.get("minHeight")||0,h=o.get("barSize"),c=["lng","lat","alt"].map((function(m){return o.coordDimToDataDim(m)[0]}));if(h==null){var f=s.radius*Math.PI,p=ys(l,c[0],c[1]);h=[f/Math.sqrt(l.count()/p),f/Math.sqrt(l.count()/p)]}else M.util.isArray(h)||(h=[h,h]);var d=xs(l,c);l.each(c,(function(m,g,_,y){var x=l.get(d.dimension,y),v=d.isStacked?x-_:s.altitudeAxis.scale.getExtent()[0],w=Math.max(s.altitudeAxis.dataToCoord(_),u),b=s.dataToPoint([m,g,v]),S=s.dataToPoint([m,g,x]),A=yh.sub([],S,b);yh.normalize(A,A);var D=[h[0],w,h[1]];l.setItemLayout(y,[b,A,D])})),l.setLayout("orient",F.UP.array)})(i,n):a==="cartesian3D"?(function(o,s){var l=o.getData(),u=o.get("barSize");if(u==null){var h,c,f=s.size,p=s.getAxis("x"),d=s.getAxis("y");h=p.type==="category"?.7*p.getBandWidth():.6*Math.round(f[0]/Math.sqrt(l.count())),c=d.type==="category"?.7*d.getBandWidth():.6*Math.round(f[1]/Math.sqrt(l.count())),u=[h,c]}else M.util.isArray(u)||(u=[u,u]);var m,g,_,y=s.getAxis("z").scale.getExtent(),x=(g=(m=y)[0],_=m[1],!(g>0&&_>0||g<0&&_<0)),v=["x","y","z"].map((function(S){return o.coordDimToDataDim(S)[0]})),w=If(l,v[2]),b=w?l.getCalculationInfo("stackResultDimension"):v[2];l.each(v,(function(S,A,D,P){var L=l.get(b,P),O=w?L-D:x?0:y[0],N=s.dataToPoint([S,A,O]),C=s.dataToPoint([S,A,L]),B=Nf.dist(N,C),I=[0,C[1]<N[1]?-1:1,0];Math.abs(B)===0&&(B=.1);var X=[u[0],B,u[1]];l.setItemLayout(P,[N,I,X])})),l.setLayout("orient",[1,0,0])})(i,n):a==="geo3D"?(function(o,s){var l=o.getData(),u=o.get("barSize"),h=o.get("minHeight")||0,c=["lng","lat","alt"].map((function(g){return o.coordDimToDataDim(g)[0]}));if(u==null){var f=Math.min(s.size[0],s.size[2]),p=ys(l,c[0],c[1]);u=[f/Math.sqrt(l.count()/p),f/Math.sqrt(l.count()/p)]}else M.util.isArray(u)||(u=[u,u]);var d=[0,1,0],m=xs(l,c);l.each(c,(function(g,_,y,x){var v=l.get(m.dimension,x),w=m.isStacked?v-y:s.altitudeAxis.scale.getExtent()[0],b=Math.max(s.altitudeAxis.dataToCoord(y),h),S=s.dataToPoint([g,_,w]),A=[u[0],b,u[1]];l.setItemLayout(x,[S,d,A])})),l.setLayout("orient",[1,0,0])})(i,n):(a==="mapbox3D"||a==="maptalks3D")&&(function(o,s){var l=o.getData(),u=o.coordDimToDataDim("lng")[0],h=o.coordDimToDataDim("lat")[0],c=o.coordDimToDataDim("alt")[0],f=o.get("barSize"),p=o.get("minHeight")||0;if(f==null){var d=l.getDataExtent(u),m=l.getDataExtent(h),g=s.dataToPoint([d[0],m[0]]),_=s.dataToPoint([d[1],m[1]]),y=Math.min(Math.abs(g[0]-_[0]),Math.abs(g[1]-_[1]))||1,x=ys(l,u,h);f=[y/Math.sqrt(l.count()/x),y/Math.sqrt(l.count()/x)]}else M.util.isArray(f)||(f=[f,f]),f[0]/=s.getScale()/16,f[1]/=s.getScale()/16;var v=[0,0,1],w=[u,h,c],b=xs(l,w);l.each(w,(function(S,A,D,P){var L=l.get(b.dimension,P),O=b.isStacked?L-D:0,N=s.dataToPoint([S,A,O]),C=s.dataToPoint([S,A,L]),B=Math.max(C[2]-N[2],p),I=[f[0],B,f[1]];l.setItemLayout(P,[N,v,I])})),l.setLayout("orient",[1,0,0])})(i,n)}))}))}let _i={getFormattedLabel:function(t,e,r,i,n){r=r||"normal";var a=t.getData(i).getItemModel(e),o=t.getDataParams(e,i);n!=null&&o.value instanceof Array&&(o.value=o.value[n]);var s,l=a.get(r==="normal"?["label","formatter"]:["emphasis","label","formatter"]);return l==null&&(l=a.get(["label","formatter"])),typeof l=="function"?(o.status=r,s=l(o)):typeof l=="string"&&(s=M.format.formatTpl(l,o)),s},normalizeToArray:function(t){return t instanceof Array?t:t==null?[]:[t]}};function un(t,e,r){var i=t.getData(),n=t.getRawValue(e),a=M.util.isArray(n)?(function(h){var c=[],f=(function(d,m){var g=[];return M.util.each(d.dimensions,(function(_){var y=d.getDimensionInfo(_),x=y.otherDims.tooltip;x!=null&&x!==!1&&(g[x]=y.name)})),g})(i);function p(d,m){var g=i.getDimensionInfo(m);if(g&&g.otherDims.tooltip!==!1){var _=g.type,y="- "+(g.tooltipName||g.name)+": "+(_==="ordinal"?d+"":_==="time"?r?"":M.format.formatTime("yyyy/MM/dd hh:mm:ss",d):M.format.addCommas(d));y&&c.push(M.format.encodeHTML(y))}}return f.length?M.util.each(f,(function(d){p(i.get(d,e),d)})):M.util.each(h,p),"<br/>"+c.join("<br/>")})(n):M.format.encodeHTML(M.format.addCommas(n)),o=i.getName(e),s=Ft(i,e);M.util.isObject(s)&&s.colorStops&&(s=(s.colorStops[0]||{}).color),s=s||"transparent";var l=M.format.getTooltipMarker(s),u=t.name;return u==="\0-"&&(u=""),u=u?M.format.encodeHTML(u)+(r?": ":"<br/>"):"",r?l+u+a:u+l+(o?M.format.encodeHTML(o)+": "+a:a)}function Aa(t,e,r){r=r||t.getSource();var i=e||M.getCoordinateSystemDimensions(t.get("coordinateSystem"))||["x","y","z"],n=M.helper.createDimensions(r,{dimensionsDefine:r.dimensionsDefine||t.get("dimensions"),encodeDefine:r.encodeDefine||t.get("encode"),coordDimensions:i.map((function(s){var l=t.getReferringComponents(s+"Axis3D").models[0];return{type:l&&l.get("type")==="category"?"ordinal":"float",name:s}}))});t.get("coordinateSystem")==="cartesian3D"&&n.forEach((function(s){if(i.indexOf(s.coordDim)>=0){var l=t.getReferringComponents(s.coordDim+"Axis3D").models[0];l&&l.get("type")==="category"&&(s.ordinalMeta=l.getOrdinalMeta())}}));var a=M.helper.dataStack.enableDataStack(t,n,{byIndex:!0,stackedCoordDimension:"z"}),o=new M.List(n,t);return o.setCalculationInfo(a),o.initData(r),o}var xh=M.SeriesModel.extend({type:"series.bar3D",dependencies:["globe"],visualStyleAccessPathvisu:"itemStyle",getInitialData:function(t,e){return Aa(this)},getFormattedLabel:function(t,e,r,i){var n=_i.getFormattedLabel(this,t,e,r,i);return n==null&&(n=this.getData().get("z",t)),n},formatTooltip:function(t){return un(this,t)},defaultOption:{coordinateSystem:"cartesian3D",globeIndex:0,grid3DIndex:0,zlevel:-10,bevelSize:0,bevelSmoothness:2,onGridPlane:"xy",shading:"color",minHeight:0,itemStyle:{opacity:1},label:{show:!1,distance:2,textStyle:{fontSize:14,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:3}},emphasis:{label:{show:!0}},animationDurationUpdate:500}});M.util.merge(xh.prototype,di);let Bf=xh;var hn,He,Fe,fe,er,bh,wh,Th,bt=Mt.vec3,zf=Mt.mat3,bs=nt.extend((function(){return{attributes:{position:new nt.Attribute("position","float",3,"POSITION"),normal:new nt.Attribute("normal","float",3,"NORMAL"),color:new nt.Attribute("color","float",4,"COLOR"),prevPosition:new nt.Attribute("prevPosition","float",3),prevNormal:new nt.Attribute("prevNormal","float",3)},dynamic:!0,enableNormal:!1,bevelSize:1,bevelSegments:0,_dataIndices:null,_vertexOffset:0,_triangleOffset:0}}),{resetOffset:function(){this._vertexOffset=0,this._triangleOffset=0},setBarCount:function(t){var e=this.enableNormal,r=this.getBarVertexCount()*t,i=this.getBarTriangleCount()*t;this.vertexCount!==r&&(this.attributes.position.init(r),e?this.attributes.normal.init(r):this.attributes.normal.value=null,this.attributes.color.init(r)),this.triangleCount!==i&&(this.indices=r>65535?new Uint32Array(3*i):new Uint16Array(3*i),this._dataIndices=new Uint32Array(r))},getBarVertexCount:function(){var t=this.bevelSize>0?this.bevelSegments:0;return t>0?this._getBevelBarVertexCount(t):this.enableNormal?24:8},getBarTriangleCount:function(){var t=this.bevelSize>0?this.bevelSegments:0;return t>0?this._getBevelBarTriangleCount(t):12},_getBevelBarVertexCount:function(t){return 4*(t+1)*(t+1)*2},_getBevelBarTriangleCount:function(t){return(4*t+3+1)*(2*t+1)*2+4},setColor:function(t,e){for(var r=this.getBarVertexCount(),i=r*(t+1),n=r*t;n<i;n++)this.attributes.color.set(n,e);this.dirtyAttribute("color")},getDataIndexOfVertex:function(t){return this._dataIndices?this._dataIndices[t]:null},addBar:(function(){for(var t=bt.create,e=bt.scaleAndAdd,r=t(),i=t(),n=t(),a=t(),o=t(),s=t(),l=t(),u=[],h=[],c=0;c<8;c++)u[c]=t();var f=[[0,1,5,4],[2,3,7,6],[4,5,6,7],[3,2,1,0],[0,4,7,3],[1,2,6,5]],p=[0,1,2,0,2,3],d=[];for(c=0;c<f.length;c++)for(var m=f[c],g=0;g<2;g++){for(var _=[],y=0;y<3;y++)_.push(m[p[3*g+y]]);d.push(_)}return function(x,v,w,b,S,A){var D=this._vertexOffset;if(this.bevelSize>0&&this.bevelSegments>0)this._addBevelBar(x,v,w,b,this.bevelSize,this.bevelSegments,S);else{bt.copy(n,v),bt.normalize(n,n),bt.cross(a,w,n),bt.normalize(a,a),bt.cross(i,n,a),bt.normalize(a,a),bt.negate(o,i),bt.negate(s,n),bt.negate(l,a),e(u[0],x,i,b[0]/2),e(u[0],u[0],a,b[2]/2),e(u[1],x,i,b[0]/2),e(u[1],u[1],l,b[2]/2),e(u[2],x,o,b[0]/2),e(u[2],u[2],l,b[2]/2),e(u[3],x,o,b[0]/2),e(u[3],u[3],a,b[2]/2),e(r,x,n,b[1]),e(u[4],r,i,b[0]/2),e(u[4],u[4],a,b[2]/2),e(u[5],r,i,b[0]/2),e(u[5],u[5],l,b[2]/2),e(u[6],r,o,b[0]/2),e(u[6],u[6],l,b[2]/2),e(u[7],r,o,b[0]/2),e(u[7],u[7],a,b[2]/2);var P=this.attributes;if(this.enableNormal){h[0]=i,h[1]=o,h[2]=n,h[3]=s,h[4]=a,h[5]=l;for(var L=this._vertexOffset,O=0;O<f.length;O++){for(var N=3*this._triangleOffset,C=0;C<6;C++)this.indices[N++]=L+p[C];L+=4,this._triangleOffset+=2}for(O=0;O<f.length;O++){var B=h[O];for(C=0;C<4;C++){var I=f[O][C];P.position.set(this._vertexOffset,u[I]),P.normal.set(this._vertexOffset,B),P.color.set(this._vertexOffset++,S)}}}else{for(O=0;O<d.length;O++){for(N=3*this._triangleOffset,C=0;C<3;C++)this.indices[N+C]=d[O][C]+this._vertexOffset;this._triangleOffset++}for(O=0;O<u.length;O++)P.position.set(this._vertexOffset,u[O]),P.color.set(this._vertexOffset++,S)}}var X=this._vertexOffset;for(O=D;O<X;O++)this._dataIndices[O]=A}})(),_addBevelBar:(hn=bt.create(),He=bt.create(),Fe=bt.create(),fe=zf.create(),er=[],bh=[1,-1,-1,1],wh=[1,1,-1,-1],Th=[2,0],function(t,e,r,i,n,a,o){bt.copy(He,e),bt.normalize(He,He),bt.cross(Fe,r,He),bt.normalize(Fe,Fe),bt.cross(hn,He,Fe),bt.normalize(Fe,Fe),fe[0]=hn[0],fe[1]=hn[1],fe[2]=hn[2],fe[3]=He[0],fe[4]=He[1],fe[5]=He[2],fe[6]=Fe[0],fe[7]=Fe[1],fe[8]=Fe[2],n=Math.min(i[0],i[2])/2*n;for(var s=0;s<3;s++)er[s]=Math.max(i[s]-2*n,0);var l=(i[0]-er[0])/2,u=(i[1]-er[1])/2,h=(i[2]-er[2])/2,c=[],f=[],p=this._vertexOffset,d=[];for(s=0;s<2;s++){d[s]=d[s]=[];for(var m=0;m<=a;m++)for(var g=0;g<4;g++){(m===0&&s===0||s===1&&m===a)&&d[s].push(p);for(var _=0;_<=a;_++){var y=_/a*Math.PI/2+Math.PI/2*g,x=m/a*Math.PI/2+Math.PI/2*s;f[0]=l*Math.cos(y)*Math.sin(x),f[1]=u*Math.cos(x),f[2]=h*Math.sin(y)*Math.sin(x),c[0]=f[0]+bh[g]*er[0]/2,c[1]=f[1]+u+Th[s]*er[1]/2,c[2]=f[2]+wh[g]*er[2]/2,Math.abs(l-u)<1e-6&&Math.abs(u-h)<1e-6||(f[0]/=l*l,f[1]/=u*u,f[2]/=h*h),bt.normalize(f,f),bt.transformMat3(c,c,fe),bt.transformMat3(f,f,fe),bt.add(c,c,t),this.attributes.position.set(p,c),this.enableNormal&&this.attributes.normal.set(p,f),this.attributes.color.set(p,o),p++}}}var v=4*a+3,w=2*a+1,b=v+1;for(g=0;g<w;g++)for(s=0;s<=v;s++){var S=g*b+s+this._vertexOffset,A=g*b+(s+1)%b+this._vertexOffset,D=(g+1)*b+(s+1)%b+this._vertexOffset,P=(g+1)*b+s+this._vertexOffset;this.setTriangleIndices(this._triangleOffset++,[D,S,A]),this.setTriangleIndices(this._triangleOffset++,[D,P,S])}this.setTriangleIndices(this._triangleOffset++,[d[0][0],d[0][2],d[0][1]]),this.setTriangleIndices(this._triangleOffset++,[d[0][0],d[0][3],d[0][2]]),this.setTriangleIndices(this._triangleOffset++,[d[1][0],d[1][1],d[1][2]]),this.setTriangleIndices(this._triangleOffset++,[d[1][0],d[1][2],d[1][3]]),this._vertexOffset=p})});M.util.defaults(bs.prototype,Zi),M.util.defaults(bs.prototype,hs);let Gf=bs;var Uf=Mt.vec3;let kf=M.ChartView.extend({type:"bar3D",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this._api=e,this._labelsBuilder=new cs(256,256,e);var r=this;this._labelsBuilder.getLabelPosition=function(i,n,a){if(r._data){var o=r._data.getItemLayout(i),s=o[0],l=o[1],u=o[2][1];return Uf.scaleAndAdd([],s,l,a+u)}return[0,0]},this._labelsBuilder.getMesh().renderOrder=100},render:function(t,e,r){var i=this._prevBarMesh;this._prevBarMesh=this._barMesh,this._barMesh=i,this._barMesh||(this._barMesh=new T.Mesh({geometry:new Gf,shadowDepthMaterial:new T.Material({shader:new T.Shader(T.Shader.source("ecgl.sm.depth.vertex"),T.Shader.source("ecgl.sm.depth.fragment"))}),culling:t.coordinateSystem.type==="cartesian3D",renderOrder:10,renderNormal:!0})),this.groupGL.remove(this._prevBarMesh),this.groupGL.add(this._barMesh),this.groupGL.add(this._labelsBuilder.getMesh());var n=t.coordinateSystem;if(this._doRender(t,r),n&&n.viewGL){n.viewGL.add(this.groupGL);var a=n.viewGL.isLinearSpace()?"define":"undefine";this._barMesh.material[a]("fragment","SRGB_DECODE")}this._data=t.getData(),this._labelsBuilder.updateData(this._data),this._labelsBuilder.updateLabels(),this._updateAnimation(t)},_updateAnimation:function(t){T.updateVertexAnimation([["prevPosition","position"],["prevNormal","normal"]],this._prevBarMesh,this._barMesh,t)},_doRender:function(t,e){var r=t.getData(),i=t.get("shading"),n=i!=="color",a=this,o=this._barMesh,s="ecgl."+i;o.material&&o.material.shader.name===s||(o.material=T.createMaterial(s,["VERTEX_COLOR"])),T.setMaterialFromModel(i,o.material,t,e),o.geometry.enableNormal=n,o.geometry.resetOffset();var l=t.get("bevelSize"),u=t.get("bevelSmoothness");o.geometry.bevelSegments=u,o.geometry.bevelSize=l;var h=[],c=new Float32Array(4*r.count()),f=0,p=0,d=!1;r.each((function(y){if(r.hasValue(y)){var x=Ft(r,y),v=Bt(r,y);v==null&&(v=1),T.parseColor(x,h),h[3]*=v,c[f++]=h[0],c[f++]=h[1],c[f++]=h[2],c[f++]=h[3],h[3]>0&&(p++,h[3]<.99&&(d=!0))}})),o.geometry.setBarCount(p);var m=r.getLayout("orient"),g=this._barIndexOfData=new Int32Array(r.count());p=0,r.each((function(y){if(r.hasValue(y)){var x=r.getItemLayout(y),v=x[0],w=x[1],b=x[2],S=4*y;h[0]=c[S++],h[1]=c[S++],h[2]=c[S++],h[3]=c[S++],h[3]>0&&(a._barMesh.geometry.addBar(v,w,m,b,h,y),g[y]=p++)}else g[y]=-1})),o.geometry.dirty(),o.geometry.updateBoundingBox();var _=o.material;_.transparent=d,_.depthMask=!d,o.geometry.sortTriangles=d,this._initHandler(t,e)},_initHandler:function(t,e){var r=t.getData(),i=this._barMesh,n=t.coordinateSystem.type==="cartesian3D";i.seriesIndex=t.seriesIndex;var a=-1;i.off("mousemove"),i.off("mouseout"),i.on("mousemove",(function(o){var s=i.geometry.getDataIndexOfVertex(o.triangle[0]);s!==a&&(this._downplay(a),this._highlight(s),this._labelsBuilder.updateLabels([s]),n&&e.dispatchAction({type:"grid3DShowAxisPointer",value:[r.get("x",s),r.get("y",s),r.get("z",s,!0)]})),a=s,i.dataIndex=s}),this),i.on("mouseout",(function(o){this._downplay(a),this._labelsBuilder.updateLabels(),a=-1,i.dataIndex=-1,n&&e.dispatchAction({type:"grid3DHideAxisPointer"})}),this)},_highlight:function(t){var e=this._data;if(e){var r=this._barIndexOfData[t];if(!(r<0)){var i=e.getItemModel(t).getModel("emphasis.itemStyle"),n=i.get("color"),a=i.get("opacity");if(n==null){var o=Ft(e,t);n=M.color.lift(o,-.4)}a==null&&(a=Bt(e,t));var s=T.parseColor(n);s[3]*=a,this._barMesh.geometry.setColor(r,s),this._api.getZr().refresh()}}},_downplay:function(t){var e=this._data;if(e){var r=this._barIndexOfData[t];if(!(r<0)){var i=Ft(e,t),n=Bt(e,t),a=T.parseColor(i);a[3]*=n,this._barMesh.geometry.setColor(r,a),this._api.getZr().refresh()}}},highlight:function(t,e,r,i){this._toggleStatus("highlight",t,e,r,i)},downplay:function(t,e,r,i){this._toggleStatus("downplay",t,e,r,i)},_toggleStatus:function(t,e,r,i,n){var a=e.getData(),o=Ol(a,n),s=this;o!=null?M.util.each(_i.normalizeToArray(o),(function(l){t==="highlight"?this._highlight(l):this._downplay(l)}),this):a.each((function(l){t==="highlight"?s._highlight(l):s._downplay(l)}))},remove:function(){this.groupGL.removeAll()},dispose:function(){this._labelsBuilder.dispose(),this.groupGL.removeAll()}});(0,M.use)((function(t){t.registerChartView(kf),t.registerSeriesModel(Bf),Ff(t),t.registerProcessor((function(e,r){e.eachSeriesByType("bar3d",(function(i){var n=i.getData();n.filterSelf((function(a){return n.hasValue(a)}))}))}))}));let Vf=M.SeriesModel.extend({type:"series.line3D",dependencies:["grid3D"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",getInitialData:function(t,e){return Aa(this)},formatTooltip:function(t){return un(this,t)},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,grid3DIndex:0,lineStyle:{width:2},animationDurationUpdate:500}});function Hf(t,e,r,i,n,a,o){if(n===0)return!1;var s,l=n;if(o>e+l&&o>i+l||o<e-l&&o<i-l||a>t+l&&a>r+l||a<t-l&&a<r-l)return!1;if(t===r)return Math.abs(a-t)<=l/2;var u=(s=(e-i)/(t-r))*a-o+(t*i-r*e)/(t-r);return u*u/(s*s+1)<=l/2*l/2}var Wf=Mt.vec3;T.Shader.import(fa);let jf=M.ChartView.extend({type:"line3D",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this._api=e},render:function(t,e,r){var i=this._prevLine3DMesh;this._prevLine3DMesh=this._line3DMesh,this._line3DMesh=i,this._line3DMesh||(this._line3DMesh=new T.Mesh({geometry:new xr({useNativeLine:!1,sortTriangles:!0}),material:new T.Material({shader:T.createShader("ecgl.meshLines3D")}),renderOrder:10}),this._line3DMesh.geometry.pick=this._pick.bind(this)),this.groupGL.remove(this._prevLine3DMesh),this.groupGL.add(this._line3DMesh);var n=t.coordinateSystem;if(n&&n.viewGL){n.viewGL.add(this.groupGL);var a=n.viewGL.isLinearSpace()?"define":"undefine";this._line3DMesh.material[a]("fragment","SRGB_DECODE")}this._doRender(t,r),this._data=t.getData(),this._camera=n.viewGL.camera,this.updateCamera(),this._updateAnimation(t)},updateCamera:function(){this._updateNDCPosition()},_doRender:function(t,e){var r=t.getData(),i=this._line3DMesh;i.geometry.resetOffset();var n=r.getLayout("points"),a=[],o=new Float32Array(n.length/3*4),s=0,l=!1;r.each((function(c){var f=Ft(r,c),p=Bt(r,c);p==null&&(p=1),T.parseColor(f,a),a[3]*=p,o[s++]=a[0],o[s++]=a[1],o[s++]=a[2],o[s++]=a[3],a[3]<.99&&(l=!0)})),i.geometry.setVertexCount(i.geometry.getPolylineVertexCount(n)),i.geometry.setTriangleCount(i.geometry.getPolylineTriangleCount(n)),i.geometry.addPolyline(n,o,J(t.get("lineStyle.width"),1)),i.geometry.dirty(),i.geometry.updateBoundingBox();var u=i.material;u.transparent=l,u.depthMask=!l;var h=t.getModel("debug.wireframe");h.get("show")?(i.geometry.createAttribute("barycentric","float",3),i.geometry.generateBarycentric(),i.material.set("both","WIREFRAME_TRIANGLE"),i.material.set("wireframeLineColor",T.parseColor(h.get("lineStyle.color")||"rgba(0,0,0,0.5)")),i.material.set("wireframeLineWidth",J(h.get("lineStyle.width"),1))):i.material.set("both","WIREFRAME_TRIANGLE"),this._points=n,this._initHandler(t,e)},_updateAnimation:function(t){T.updateVertexAnimation([["prevPosition","position"],["prevPositionPrev","positionPrev"],["prevPositionNext","positionNext"]],this._prevLine3DMesh,this._line3DMesh,t)},_initHandler:function(t,e){var r=t.getData(),i=t.coordinateSystem,n=this._line3DMesh,a=-1;n.seriesIndex=t.seriesIndex,n.off("mousemove"),n.off("mouseout"),n.on("mousemove",(function(o){var s,l=i.pointToData(o.point.array);(s=t.indicesOfNearest?t.indicesOfNearest("x","x",l[0])[0]:r.indicesOfNearest("x",l[0])[0])!==a&&(e.dispatchAction({type:"grid3DShowAxisPointer",value:[r.get("x",s),r.get("y",s),r.get("z",s)]}),n.dataIndex=s),a=s}),this),n.on("mouseout",(function(o){a=-1,n.dataIndex=-1,e.dispatchAction({type:"grid3DHideAxisPointer"})}),this)},_updateNDCPosition:function(){var t=new k,e=this._camera;k.multiply(t,e.projectionMatrix,e.viewMatrix);var r=this._positionNDC,i=this._points,n=i.length/3;r&&r.length/2===n||(r=this._positionNDC=new Float32Array(2*n));for(var a=[],o=0;o<n;o++){var s=3*o,l=2*o;a[0]=i[s],a[1]=i[s+1],a[2]=i[s+2],a[3]=1,Wf.transformMat4(a,a,t.array),r[l]=a[0]/a[3],r[l+1]=a[1]/a[3]}},_pick:function(t,e,r,i,n,a){var o=this._positionNDC,s=this._data.hostModel.get("lineStyle.width"),l=-1,u=.5*r.viewport.width,h=.5*r.viewport.height;t=(t+1)*u,e=(e+1)*h;for(var c=1;c<o.length/2;c++){var f=(o[2*(c-1)]+1)*u,p=(o[2*(c-1)+1]+1)*h,d=(o[2*c]+1)*u,m=(o[2*c+1]+1)*h;Hf(f,p,d,m,s,t,e)&&(l=(f-t)*(f-t)+(p-e)*(p-e)<(d-t)*(d-t)+(m-e)*(m-e)?c-1:c)}if(l>=0){var g=3*l,_=new F(this._points[g],this._points[g+1],this._points[g+2]);a.push({dataIndex:l,point:_,pointWorld:_.clone(),target:this._line3DMesh,distance:this._camera.getWorldPosition().dist(_)})}},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll()}});(0,M.use)((function(t){t.registerChartView(jf),t.registerSeriesModel(Vf),t.registerLayout((function(e,r){e.eachSeriesByType("line3D",(function(i){var n=i.getData(),a=i.coordinateSystem;if(a){if(a.type!=="cartesian3D")return;var o=new Float32Array(3*n.count()),s=[],l=[],u=a.dimensions.map((function(h){return i.coordDimToDataDim(h)[0]}));a&&n.each(u,(function(h,c,f,p){s[0]=h,s[1]=c,s[2]=f,a.dataToPoint(s,l),o[3*p]=l[0],o[3*p+1]=l[1],o[3*p+2]=l[2]})),n.setLayout("points",o)}}))}))}));let Xf=M.SeriesModel.extend({type:"series.scatter3D",dependencies:["globe","grid3D","geo3D"],visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,getInitialData:function(t,e){return Aa(this)},getFormattedLabel:function(t,e,r,i){var n=_i.getFormattedLabel(this,t,e,r,i);if(n==null){var a=this.getData(),o=a.dimensions[a.dimensions.length-1];n=a.get(o,t)}return n},formatTooltip:function(t){return un(this,t)},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,progressive:1e5,progressiveThreshold:1e5,grid3DIndex:0,globeIndex:0,symbol:"circle",symbolSize:10,blendMode:"source-over",label:{show:!1,position:"right",distance:5,textStyle:{fontSize:14,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:3}},itemStyle:{opacity:.8},emphasis:{label:{show:!0}},animationDurationUpdate:500}});function ws(t,e,r){(e=e||document.createElement("canvas")).width=t,e.height=t;var i=e.getContext("2d");return r&&r(i),e}var Ts={getMarginByStyle:function(t){var e=t.minMargin||0,r=0;t.stroke&&t.stroke!=="none"&&(r=t.lineWidth==null?1:t.lineWidth);var i=t.shadowBlur||0,n=t.shadowOffsetX||0,a=t.shadowOffsetY||0,o={};return o.left=Math.max(r/2,-n+i,e),o.right=Math.max(r/2,n+i,e),o.top=Math.max(r/2,-a+i,e),o.bottom=Math.max(r/2,a+i,e),o},createSymbolSprite:function(t,e,r,i){var n=(function(o,s,l,u){M.util.isArray(s)||(s=[s,s]);var h=Ts.getMarginByStyle(l,void 0),c=s[0]+h.left+h.right,f=s[1]+h.top+h.bottom,p=M.helper.createSymbol(o,0,0,s[0],s[1]),d=Math.max(c,f);p.x=h.left,p.y=h.top,c>f?p.y+=(d-f)/2:p.x+=(d-c)/2;var m=p.getBoundingRect();return p.x-=m.x,p.y-=m.y,p.setStyle(l),p.update(),p.__size=d,p})(t,e,r),a=Ts.getMarginByStyle(r);return{image:ws(n.__size,i,(function(o){M.innerDrawElementOnCanvas(o,n)})),margin:a}},createSDFFromCanvas:function(t,e,r,i){return ws(e,i,(function(n){var a=t.getContext("2d").getImageData(0,0,t.width,t.height);n.putImageData((function(o,s,l){var u=s.width,h=s.height,c=o.canvas.width,f=o.canvas.height,p=u/c,d=h/f;function m(b){return b<128?1:-1}function g(b,S){var A=1/0;b=Math.floor(b*p);for(var D=(S=Math.floor(S*d))*u+b,P=m(s.data[4*D]),L=Math.max(S-l,0);L<Math.min(S+l,h);L++)for(var O=Math.max(b-l,0);O<Math.min(b+l,u);O++){D=L*u+O;var N=O-b,C=L-S;if(P!==m(s.data[4*D])){var B=N*N+C*C;B<A&&(A=B)}}return P*Math.sqrt(A)}for(var _=o.createImageData(c,f),y=0;y<f;y++)for(var x=0;x<c;x++){var v=g(x,y)/l*.5+.5,w=4*(y*c+x);_.data[w++]=255*(1-v),_.data[w++]=255*(1-v),_.data[w++]=255*(1-v),_.data[w++]=255}return _})(n,a,r),0,0)}))},createSimpleSprite:function(t,e){return ws(t,e,(function(r){var i=t/2;r.beginPath(),r.arc(i,i,60,0,2*Math.PI,!1),r.closePath();var n=r.createRadialGradient(i,i,0,i,i,i);n.addColorStop(0,"rgba(255, 255, 255, 1)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),n.addColorStop(1,"rgba(255, 255, 255, 0)"),r.fillStyle=n,r.fill()}))}};let Sh=Ts;var Mh=Mt.vec3;let qf={needsSortVertices:function(){return this.sortVertices},needsSortVerticesProgressively:function(){return this.needsSortVertices()&&this.vertexCount>=2e4},doSortVertices:function(t,e){var r=this.indices,i=Mh.create();if(!r){r=this.indices=this.vertexCount>65535?new Uint32Array(this.vertexCount):new Uint16Array(this.vertexCount);for(var n=0;n<r.length;n++)r[n]=n}if(e===0){var a,o=this.attributes.position,s=(t=t.array,0);for(this._zList&&this._zList.length===this.vertexCount||(this._zList=new Float32Array(this.vertexCount)),n=0;n<this.vertexCount;n++){o.get(n,i);var l=Mh.sqrDist(i,t);isNaN(l)&&(l=1e7,s++),n===0?(a=l,l=0):l-=a,this._zList[n]=l}this._noneCount=s}if(this.vertexCount<2e4)e===0&&this._simpleSort(this._noneCount/this.vertexCount>.05);else for(n=0;n<3;n++)this._progressiveQuickSort(3*e+n);this.dirtyIndices()},_simpleSort:function(t){var e=this._zList,r=this.indices;function i(n,a){return e[a]-e[n]}t?Array.prototype.sort.call(r,i):wa.sort(r,i,0,r.length-1)},_progressiveQuickSort:function(t){var e=this._zList,r=this.indices;this._quickSort=this._quickSort||new wa,this._quickSort.step(r,(function(i,n){return e[n]-e[i]}),t)}};var Ss=Mt.vec4;T.Shader.import(`@export ecgl.sdfSprite.vertex

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
@end`);let Zf=T.Mesh.extend((function(){var t=new T.Geometry({dynamic:!0,attributes:{color:new T.Geometry.Attribute("color","float",4,"COLOR"),position:new T.Geometry.Attribute("position","float",3,"POSITION"),size:new T.Geometry.Attribute("size","float",1),prevPosition:new T.Geometry.Attribute("prevPosition","float",3),prevSize:new T.Geometry.Attribute("prevSize","float",1)}});Object.assign(t,qf);var e=new T.Material({shader:T.createShader("ecgl.sdfSprite"),transparent:!0,depthMask:!1});e.enableTexture("sprite"),e.define("both","VERTEX_COLOR"),e.define("both","VERTEX_SIZE");var r=new T.Texture2D({image:document.createElement("canvas"),flipY:!1});return e.set("sprite",r),t.pick=this._pick.bind(this),{geometry:t,material:e,mode:T.Mesh.POINTS,sizeScale:1}}),{_pick:function(t,e,r,i,n,a){var o=this._positionNDC;if(o)for(var s=r.viewport,l=2/s.width,u=2/s.height,h=this.geometry.vertexCount-1;h>=0;h--){var c,f=o[2*(c=this.geometry.indices?this.geometry.indices[h]:h)],p=o[2*c+1],d=this.geometry.attributes.size.get(c)/this.sizeScale/2;if(t>f-d*l&&t<f+d*l&&e>p-d*u&&e<p+d*u){var m=new T.Vector3,g=new T.Vector3;this.geometry.attributes.position.get(c,m.array),T.Vector3.transformMat4(g,m,this.worldTransform),a.push({vertexIndex:c,point:m,pointWorld:g,target:this,distance:g.distance(i.getWorldPosition())})}}},updateNDCPosition:function(t,e,r){var i=this._positionNDC,n=this.geometry;i&&i.length/2===n.vertexCount||(i=this._positionNDC=new Float32Array(2*n.vertexCount));for(var a=Ss.create(),o=0;o<n.vertexCount;o++)n.attributes.position.get(o,a),a[3]=1,Ss.transformMat4(a,a,t.array),Ss.scale(a,a,1/a[3]),i[2*o]=a[0],i[2*o+1]=a[1]}});function Ms(t,e){this.rootNode=new T.Node,this.is2D=t,this._labelsBuilder=new cs(256,256,e),this._labelsBuilder.getMesh().renderOrder=100,this.rootNode.add(this._labelsBuilder.getMesh()),this._api=e,this._spriteImageCanvas=document.createElement("canvas"),this._startDataIndex=0,this._endDataIndex=0,this._sizeScale=1}Ms.prototype={constructor:Ms,highlightOnMouseover:!0,update:function(t,e,r,i,n){var a=this._prevMesh;this._prevMesh=this._mesh,this._mesh=a;var o=t.getData();if(i==null&&(i=0),n==null&&(n=o.count()),this._startDataIndex=i,this._endDataIndex=n-1,!this._mesh){var s=this._prevMesh&&this._prevMesh.material;this._mesh=new Zf({renderOrder:10,frustumCulling:!1}),s&&(this._mesh.material=s)}s=this._mesh.material;var l=this._mesh.geometry,u=l.attributes;this.rootNode.remove(this._prevMesh),this.rootNode.add(this._mesh),this._setPositionTextureToMesh(this._mesh,this._positionTexture);var h=this._getSymbolInfo(t,i,n),c=r.getDevicePixelRatio(),f=t.getModel("itemStyle").getItemStyle(),p=t.get("large"),d=1;h.maxSize>2?(d=this._updateSymbolSprite(t,f,h,c),s.enableTexture("sprite")):s.disableTexture("sprite"),u.position.init(n-i);var m=[];if(p){s.undefine("VERTEX_SIZE"),s.undefine("VERTEX_COLOR");var g=(function(D){let P=D.getVisual("style");if(P)return P[D.getVisual("drawType")]})(o),_=(function(D){return D.getVisual("style").opacity})(o);T.parseColor(g,m),m[3]*=_,s.set({color:m,u_Size:h.maxSize*this._sizeScale})}else s.set({color:[1,1,1,1]}),s.define("VERTEX_SIZE"),s.define("VERTEX_COLOR"),u.size.init(n-i),u.color.init(n-i),this._originalOpacity=new Float32Array(n-i);for(var y=o.getLayout("points"),x=u.position.value,v=0;v<n-i;v++){var w=3*v,b=2*v;if(this.is2D?(x[w]=y[b],x[w+1]=y[b+1],x[w+2]=-10):(x[w]=y[w],x[w+1]=y[w+1],x[w+2]=y[w+2]),!p){g=Ft(o,v),_=Bt(o,v),T.parseColor(g,m),m[3]*=_,u.color.set(v,m),m[3];var S=o.getItemVisual(v,"symbolSize");S=S instanceof Array?Math.max(S[0],S[1]):S,isNaN(S)&&(S=0),u.size.value[v]=S*d*this._sizeScale,this._originalOpacity[v]=m[3]}}this._mesh.sizeScale=d,l.updateBoundingBox(),l.dirty(),this._updateMaterial(t,f);var A=t.coordinateSystem;A&&A.viewGL&&s[A.viewGL.isLinearSpace()?"define":"undefine"]("fragment","SRGB_DECODE"),p||this._updateLabelBuilder(t,i,n),this._updateHandler(t,e,r),this._updateAnimation(t),this._api=r},getPointsMesh:function(){return this._mesh},updateLabels:function(t){this._labelsBuilder.updateLabels(t)},hideLabels:function(){this.rootNode.remove(this._labelsBuilder.getMesh())},showLabels:function(){this.rootNode.add(this._labelsBuilder.getMesh())},dispose:function(){this._labelsBuilder.dispose()},_updateSymbolSprite:function(t,e,r,i){r.maxSize=Math.min(2*r.maxSize,200);var n,a,o=[];return r.aspect>1?(o[0]=r.maxSize,o[1]=r.maxSize/r.aspect):(o[1]=r.maxSize,o[0]=r.maxSize*r.aspect),o[0]=o[0]||1,o[1]=o[1]||1,this._symbolType===r.type&&(a=o,(n=this._symbolSize)&&a&&n[0]===a[0]&&n[1]===a[1])&&this._lineWidth===e.lineWidth||(Sh.createSymbolSprite(r.type,o,{fill:"#fff",lineWidth:e.lineWidth,stroke:"transparent",shadowColor:"transparent",minMargin:Math.min(o[0]/2,10)},this._spriteImageCanvas),Sh.createSDFFromCanvas(this._spriteImageCanvas,Math.min(this._spriteImageCanvas.width,32),20,this._mesh.material.get("sprite").image),this._symbolType=r.type,this._symbolSize=o,this._lineWidth=e.lineWidth),this._spriteImageCanvas.width/r.maxSize*i},_updateMaterial:function(t,e){var r=t.get("blendMode")==="lighter"?T.additiveBlend:null,i=this._mesh.material;i.blend=r,i.set("lineWidth",e.lineWidth/20);var n=T.parseColor(e.stroke);i.set("strokeColor",n),i.transparent=!0,i.depthMask=!1,i.depthTest=!this.is2D,i.sortVertices=!this.is2D},_updateLabelBuilder:function(t,e,r){var i=t.getData(),n=this._mesh.geometry,a=n.attributes.position.value,o=(e=this._startDataIndex,this._mesh.sizeScale);this._labelsBuilder.updateData(i,e,r),this._labelsBuilder.getLabelPosition=function(s,l,u){var h=3*(s-e);return[a[h],a[h+1],a[h+2]]},this._labelsBuilder.getLabelDistance=function(s,l,u){return n.attributes.size.get(s-e)/o/2+u},this._labelsBuilder.updateLabels()},_updateAnimation:function(t){T.updateVertexAnimation([["prevPosition","position"],["prevSize","size"]],this._prevMesh,this._mesh,t)},_updateHandler:function(t,e,r){var i,n=t.getData(),a=this._mesh,o=this,s=-1,l=t.coordinateSystem&&t.coordinateSystem.type==="cartesian3D";l&&(i=t.coordinateSystem.model),a.seriesIndex=t.seriesIndex,a.off("mousemove"),a.off("mouseout"),a.on("mousemove",(function(u){var h=u.vertexIndex+o._startDataIndex;h!==s&&(this.highlightOnMouseover&&(this.downplay(n,s),this.highlight(n,h),this._labelsBuilder.updateLabels([h])),l&&r.dispatchAction({type:"grid3DShowAxisPointer",value:[n.get(t.coordDimToDataDim("x")[0],h),n.get(t.coordDimToDataDim("y")[0],h),n.get(t.coordDimToDataDim("z")[0],h)],grid3DIndex:i.componentIndex})),a.dataIndex=h,s=h}),this),a.on("mouseout",(function(u){var h=u.vertexIndex+o._startDataIndex;this.highlightOnMouseover&&(this.downplay(n,h),this._labelsBuilder.updateLabels()),s=-1,a.dataIndex=-1,l&&r.dispatchAction({type:"grid3DHideAxisPointer",grid3DIndex:i.componentIndex})}),this)},updateLayout:function(t,e,r){var i=t.getData();if(this._mesh){var n=this._mesh.geometry.attributes.position.value,a=i.getLayout("points");if(this.is2D)for(var o=0;o<a.length/2;o++){var s=3*o,l=2*o;n[s]=a[l],n[s+1]=a[l+1],n[s+2]=-10}else for(o=0;o<a.length;o++)n[o]=a[o];this._mesh.geometry.dirty(),r.getZr().refresh()}},updateView:function(t){if(this._mesh){var e=new k;k.mul(e,t.viewMatrix,this._mesh.worldTransform),k.mul(e,t.projectionMatrix,e),this._mesh.updateNDCPosition(e,this.is2D,this._api)}},highlight:function(t,e){if(!(e>this._endDataIndex||e<this._startDataIndex)){var r=t.getItemModel(e).getModel("emphasis.itemStyle"),i=r.get("color"),n=r.get("opacity");if(i==null){var a=Ft(t,e);i=M.color.lift(a,-.4)}n==null&&(n=Bt(t,e));var o=T.parseColor(i);o[3]*=n,this._mesh.geometry.attributes.color.set(e-this._startDataIndex,o),this._mesh.geometry.dirtyAttribute("color"),this._api.getZr().refresh()}},downplay:function(t,e){if(!(e>this._endDataIndex||e<this._startDataIndex)){var r=Ft(t,e),i=Bt(t,e),n=T.parseColor(r);n[3]*=i,this._mesh.geometry.attributes.color.set(e-this._startDataIndex,n),this._mesh.geometry.dirtyAttribute("color"),this._api.getZr().refresh()}},fadeOutAll:function(t){if(this._originalOpacity){for(var e=this._mesh.geometry,r=0;r<e.vertexCount;r++){var i=this._originalOpacity[r]*t;e.attributes.color.value[4*r+3]=i}e.dirtyAttribute("color"),this._api.getZr().refresh()}},fadeInAll:function(){this.fadeOutAll(1)},setPositionTexture:function(t){this._mesh&&this._setPositionTextureToMesh(this._mesh,t),this._positionTexture=t},removePositionTexture:function(){this._positionTexture=null,this._mesh&&this._setPositionTextureToMesh(this._mesh,null)},setSizeScale:function(t){if(t!==this._sizeScale){if(this._mesh){var e=this._mesh.material.get("u_Size");this._mesh.material.set("u_Size",e/this._sizeScale*t);var r=this._mesh.geometry.attributes;if(r.size.value)for(var i=0;i<r.size.value.length;i++)r.size.value[i]=r.size.value[i]/this._sizeScale*t}this._sizeScale=t}},_setPositionTextureToMesh:function(t,e){e&&t.material.set("positionTexture",e),t.material[e?"enableTexture":"disableTexture"]("positionTexture")},_getSymbolInfo:function(t,e,r){if(t.get("large"))return(u=J(t.get("symbolSize"),1))instanceof Array?(o=Math.max(u[0],u[1]),i=u[0]/u[1]):(o=u,i=1),{maxSize:u,type:t.get("symbol"),aspect:i};for(var i,n=t.getData(),a=n.getItemVisual(0,"symbol")||"circle",o=0,s=e;s<r;s++){var l,u=n.getItemVisual(s,"symbolSize"),h=n.getItemVisual(s,"symbol");if(u instanceof Array)l=u[0]/u[1],o=Math.max(Math.max(u[0],u[1]),o);else{if(isNaN(u))continue;l=1,o=Math.max(u,o)}a=h,i=l}return{maxSize:o,type:a,aspect:i}}};let cn=Ms,Yf=M.ChartView.extend({type:"scatter3D",hasSymbolVisual:!0,__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this._pointsBuilderList=[],this._currentStep=0},render:function(t,e,r){if(this.groupGL.removeAll(),t.getData().count()){var i=t.coordinateSystem;if(i&&i.viewGL){i.viewGL.add(this.groupGL),this._camera=i.viewGL.camera;var n=this._pointsBuilderList[0];n||(n=this._pointsBuilderList[0]=new cn(!1,r)),this._pointsBuilderList.length=1,this.groupGL.add(n.rootNode),n.update(t,e,r),n.updateView(i.viewGL.camera)}}},incrementalPrepareRender:function(t,e,r){var i=t.coordinateSystem;i&&i.viewGL&&(i.viewGL.add(this.groupGL),this._camera=i.viewGL.camera),this.groupGL.removeAll(),this._currentStep=0},incrementalRender:function(t,e,r,i){if(!(t.end<=t.start)){var n=this._pointsBuilderList[this._currentStep];n||(n=new cn(!1,i),this._pointsBuilderList[this._currentStep]=n),this.groupGL.add(n.rootNode),n.update(e,r,i,t.start,t.end),n.updateView(e.coordinateSystem.viewGL.camera),this._currentStep++}},updateCamera:function(){this._pointsBuilderList.forEach((function(t){t.updateView(this._camera)}),this)},highlight:function(t,e,r,i){this._toggleStatus("highlight",t,e,r,i)},downplay:function(t,e,r,i){this._toggleStatus("downplay",t,e,r,i)},_toggleStatus:function(t,e,r,i,n){var a=e.getData(),o=Ol(a,n),s=t==="highlight";o!=null?M.util.each(_i.normalizeToArray(o),(function(l){for(var u=0;u<this._pointsBuilderList.length;u++){var h=this._pointsBuilderList[u];s?h.highlight(a,l):h.downplay(a,l)}}),this):a.each((function(l){for(var u=0;u<this._pointsBuilderList.length;u++){var h=this._pointsBuilderList[u];s?h.highlight(a,l):h.downplay(a,l)}}))},dispose:function(){this._pointsBuilderList.forEach((function(t){t.dispose()})),this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});(0,M.use)((function(t){t.registerChartView(Yf),t.registerSeriesModel(Xf),t.registerLayout({seriesType:"scatter3D",reset:function(e){var r=e.coordinateSystem;if(r){var i=r.dimensions;if(i.length<3)return;var n=i.map((function(s){return e.coordDimToDataDim(s)[0]})),a=[],o=[];return{progress:function(s,l){for(var u=new Float32Array(3*(s.end-s.start)),h=s.start;h<s.end;h++){var c=3*(h-s.start);a[0]=l.get(n[0],h),a[1]=l.get(n[1],h),a[2]=l.get(n[2],h),r.dataToPoint(a,o),u[c]=o[0],u[c+1]=o[1],u[c+2]=o[2]}l.setLayout("points",u)}}}}})}));var Lt=Mt.vec3,Ah=Mt.vec2,We=Lt.normalize,Ea=Lt.cross,Eh=Lt.sub,As=Lt.add,rr=Lt.create,ir=rr(),pe=rr(),nr=rr(),dn=rr(),Ch=[],Dh=[];function Kf(t,e){Ah.copy(Ch,t[0]),Ah.copy(Dh,t[1]);var r=[],i=r[0]=rr(),n=r[1]=rr(),a=r[2]=rr(),o=r[3]=rr();e.dataToPoint(Ch,i),e.dataToPoint(Dh,o),We(ir,i),Eh(pe,o,i),We(pe,pe),Ea(nr,pe,ir),We(nr,nr),Ea(pe,ir,nr),As(n,ir,pe),We(n,n),We(ir,o),Eh(pe,i,o),We(pe,pe),Ea(nr,pe,ir),We(nr,nr),Ea(pe,ir,nr),As(a,ir,pe),We(a,a),As(dn,i,o),We(dn,dn);var s=Lt.dot(i,dn),l=Lt.dot(dn,n),u=(Math.max(Lt.len(i),Lt.len(o))-s)/l*2;return Lt.scaleAndAdd(n,i,n,u),Lt.scaleAndAdd(a,o,a,u),r}function Lh(t,e){for(var r=new Float32Array(3*t.length),i=0,n=[],a=0;a<t.length;a++)e.dataToPoint(t[a],n),r[i++]=n[0],r[i++]=n[1],r[i++]=n[2];return r}function Ph(t){var e=[];return t.each((function(r){var i=t.getItemModel(r),n=i.option instanceof Array?i.option:i.getShallow("coords",!0);e.push(n)})),{coordsList:e}}function Oh(t,e,r){var i=t.getData(),n=t.get("polyline"),a=Ph(i);i.setLayout("lineType",n?"polyline":"cubicBezier"),i.each((function(o){var s=a.coordsList[o],l=n?Lh(s,e):(function(u,h,c){var f=[],p=f[0]=Lt.create(),d=f[1]=Lt.create(),m=f[2]=Lt.create(),g=f[3]=Lt.create();h.dataToPoint(u[0],p),h.dataToPoint(u[1],g);var _=Lt.dist(p,g);return Lt.lerp(d,p,g,.3),Lt.lerp(m,p,g,.3),Lt.scaleAndAdd(d,d,c,Math.min(.1*_,10)),Lt.scaleAndAdd(m,m,c,Math.min(.1*_,10)),f})(s,e,r);i.setItemLayout(o,l)}))}function Qf(t,e){t.eachSeriesByType("lines3D",(function(r){var i=r.coordinateSystem;i.type==="globe"?(function(n,a){var o=n.getData(),s=n.get("polyline");o.setLayout("lineType",s?"polyline":"cubicBezier");var l=Ph(o);o.each((function(u){var h=l.coordsList[u],c=s?Lh:Kf;o.setItemLayout(u,c(h,a))}))})(r,i):i.type==="geo3D"?Oh(r,i,[0,1,0]):i.type!=="mapbox3D"&&i.type!=="maptalks3D"||Oh(r,i,[0,0,1])}))}let Jf=M.SeriesModel.extend({type:"series.lines3D",dependencies:["globe"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",getInitialData:function(t,e){var r=new M.List(["value"],this);return r.hasItemOption=!1,r.initData(Wn(t.data),[],(function(i,n,a,o){if(i instanceof Array)return NaN;r.hasItemOption=!0;var s=i.value;return s!=null?s instanceof Array?s[o]:s:void 0})),r},defaultOption:{coordinateSystem:"globe",globeIndex:0,geo3DIndex:0,zlevel:-10,polyline:!1,effect:{show:!1,period:4,trailWidth:4,trailLength:.2,spotIntensity:6},silent:!0,blendMode:"source-over",lineStyle:{width:1,opacity:.5}}});var Nh=Mt.vec3;T.Shader.import(`@export ecgl.trail2.vertex
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

@end`);let $f=T.Mesh.extend((function(){var t=new T.Material({shader:new T.Shader(T.Shader.source("ecgl.trail2.vertex"),T.Shader.source("ecgl.trail2.fragment")),transparent:!0,depthMask:!1}),e=new xr({dynamic:!0});return e.createAttribute("dist","float",1),e.createAttribute("distAll","float",1),e.createAttribute("start","float",1),{geometry:e,material:t,culling:!1,$ignorePicking:!0}}),{updateData:function(t,e,r){var i=t.hostModel,n=this.geometry,a=i.getModel("effect"),o=a.get("trailWidth")*e.getDevicePixelRatio(),s=a.get("trailLength"),l=i.get("effect.constantSpeed"),u=1e3*i.get("effect.period"),h=l!=null;h?this.material.set("speed",l/1e3):this.material.set("period",u),this.material[h?"define":"undefine"]("vertex","CONSTANT_SPEED");var c=i.get("polyline");n.trailLength=s,this.material.set("trailLength",s),n.resetOffset(),["position","positionPrev","positionNext"].forEach((function(b){n.attributes[b].value=r.attributes[b].value})),["dist","distAll","start","offset","color"].forEach((function(b){n.attributes[b].init(n.vertexCount)})),n.indices=r.indices;var f=[],p=a.get("trailColor"),d=a.get("trailOpacity"),m=p!=null,g=d!=null;this.updateWorldTransform();var _=this.worldTransform.x.len(),y=this.worldTransform.y.len(),x=this.worldTransform.z.len(),v=0,w=0;t.each((function(b){var S=t.getItemLayout(b),A=g?d:Bt(t,b),D=Ft(t,b);A==null&&(A=1),(f=T.parseColor(m?p:D,f))[3]*=A;for(var P=c?r.getPolylineVertexCount(S):r.getCubicCurveVertexCount(S[0],S[1],S[2],S[3]),L=0,O=[],N=[],C=v;C<v+P;C++)n.attributes.position.get(C,O),O[0]*=_,O[1]*=y,O[2]*=x,C>v&&(L+=Nh.dist(O,N)),n.attributes.dist.set(C,L),Nh.copy(N,O);w=Math.max(w,L);var B=Math.random()*(h?L:u);for(C=v;C<v+P;C++)n.attributes.distAll.set(C,L),n.attributes.start.set(C,B),n.attributes.offset.set(C,(r.attributes.offset.get(C)>0?1:-1)*o/2),n.attributes.color.set(C,f);v+=P})),this.material.set("spotSize",.1*w*s),this.material.set("spotIntensity",a.get("spotIntensity")),n.dirty()},setAnimationTime:function(t){this.material.set("time",t)}});T.Shader.import(fa);let tp=M.ChartView.extend({type:"lines3D",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this._meshLinesMaterial=new T.Material({shader:T.createShader("ecgl.meshLines3D"),transparent:!0,depthMask:!1}),this._linesMesh=new T.Mesh({geometry:new xr,material:this._meshLinesMaterial,$ignorePicking:!0}),this._trailMesh=new $f},render:function(t,e,r){this.groupGL.add(this._linesMesh);var i=t.coordinateSystem,n=t.getData();if(i&&i.viewGL){i.viewGL.add(this.groupGL),this._updateLines(t,e,r);var a=i.viewGL.isLinearSpace()?"define":"undefine";this._linesMesh.material[a]("fragment","SRGB_DECODE"),this._trailMesh.material[a]("fragment","SRGB_DECODE")}var o=this._trailMesh;if(o.stopAnimation(),t.get("effect.show")){this.groupGL.add(o),o.updateData(n,r,this._linesMesh.geometry),o.__time=o.__time||0;var s=36e5;this._curveEffectsAnimator=o.animate("",{loop:!0}).when(s,{__time:s}).during((function(){o.setAnimationTime(o.__time)})).start()}else this.groupGL.remove(o),this._curveEffectsAnimator=null;this._linesMesh.material.blend=this._trailMesh.material.blend=t.get("blendMode")==="lighter"?T.additiveBlend:null},pauseEffect:function(){this._curveEffectsAnimator&&this._curveEffectsAnimator.pause()},resumeEffect:function(){this._curveEffectsAnimator&&this._curveEffectsAnimator.resume()},toggleEffect:function(){var t=this._curveEffectsAnimator;t&&(t.isPaused()?t.resume():t.pause())},_updateLines:function(t,e,r){var i=t.getData(),n=t.coordinateSystem,a=this._linesMesh.geometry,o=t.get("polyline");a.expandLine=!0;var s=(function(d){return d.radius!=null?d.radius:d.size!=null?Math.max(d.size[0],d.size[1],d.size[2]):100})(n);a.segmentScale=s/20;var l="lineStyle.width".split("."),u=r.getDevicePixelRatio(),h=0;i.each((function(d){var m=i.getItemModel(d).get(l);m==null&&(m=1),i.setItemVisual(d,"lineWidth",m),h=Math.max(m,h)})),a.useNativeLine=!1;var c=0,f=0;i.each((function(d){var m=i.getItemLayout(d);o?(c+=a.getPolylineVertexCount(m),f+=a.getPolylineTriangleCount(m)):(c+=a.getCubicCurveVertexCount(m[0],m[1],m[2],m[3]),f+=a.getCubicCurveTriangleCount(m[0],m[1],m[2],m[3]))})),a.setVertexCount(c),a.setTriangleCount(f),a.resetOffset();var p=[];i.each((function(d){var m=i.getItemLayout(d),g=Ft(i,d),_=Bt(i,d),y=i.getItemVisual(d,"lineWidth")*u;_==null&&(_=1),(p=T.parseColor(g,p))[3]*=_,o?a.addPolyline(m,p,y):a.addCubicCurve(m[0],m[1],m[2],m[3],p,y)})),a.dirty()},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll()}});function Ih(t,e){for(var r=[],i=0;i<e.length;i++)r.push(t.dataToPoint(e[i]));return r}(0,M.use)((function(t){t.registerChartView(tp),t.registerSeriesModel(Jf),t.registerLayout(Qf),t.registerAction({type:"lines3DPauseEffect",event:"lines3deffectpaused",update:"series.lines3D:pauseEffect"},(function(){})),t.registerAction({type:"lines3DResumeEffect",event:"lines3deffectresumed",update:"series.lines3D:resumeEffect"},(function(){})),t.registerAction({type:"lines3DToggleEffect",event:"lines3deffectchanged",update:"series.lines3D:toggleEffect"},(function(){}))}));var Rh=M.SeriesModel.extend({type:"series.polygons3D",getRegionModel:function(t){return this.getData().getItemModel(t)},getRegionPolygonCoords:function(t){var e=this.coordinateSystem,r=this.getData().getItemModel(t),i=r.option instanceof Array?r.option:r.getShallow("coords");r.get("multiPolygon")||(i=[i]);for(var n=[],a=0;a<i.length;a++){for(var o=[],s=1;s<i[a].length;s++)o.push(Ih(e,i[a][s]));n.push({exterior:Ih(e,i[a][0]),interiors:o})}return n},getInitialData:function(t){var e=new M.List(["value"],this);return e.hasItemOption=!1,e.initData(Wn(t.data),[],(function(r,i,n,a){if(r instanceof Array)return NaN;e.hasItemOption=!0;var o=r.value;return o!=null?o instanceof Array?o[a]:o:void 0})),e},defaultOption:{show:!0,data:null,multiPolygon:!1,progressiveThreshold:1e3,progressive:1e3,zlevel:-10,label:{show:!1,distance:2,textStyle:{fontSize:20,color:"#000",backgroundColor:"rgba(255,255,255,0.7)",padding:3,borderRadius:4}},itemStyle:{color:"#fff",borderWidth:0,borderColor:"#333"},emphasis:{itemStyle:{color:"#639fc0"},label:{show:!0}}}});M.util.merge(Rh.prototype,di);let ep=Rh,rp=M.ChartView.extend({type:"polygons3D",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this._geo3DBuilderList=[],this._currentStep=0},render:function(t,e,r){this.groupGL.removeAll();var i=t.coordinateSystem;i&&i.viewGL&&i.viewGL.add(this.groupGL);var n=this._geo3DBuilderList[0];n||((n=new Ta(r)).extrudeY=i.type!=="mapbox3D"&&i.type!=="maptalks3D",this._geo3DBuilderList[0]=n),this._updateShaderDefines(i,n),n.update(t,e,r),this._geo3DBuilderList.length=1,this.groupGL.add(n.rootNode)},incrementalPrepareRender:function(t,e,r){this.groupGL.removeAll();var i=t.coordinateSystem;i&&i.viewGL&&i.viewGL.add(this.groupGL),this._currentStep=0},incrementalRender:function(t,e,r,i){var n=this._geo3DBuilderList[this._currentStep],a=e.coordinateSystem;n||((n=new Ta(i)).extrudeY=a.type!=="mapbox3D"&&a.type!=="maptalks3D",this._geo3DBuilderList[this._currentStep]=n),n.update(e,r,i,t.start,t.end),this.groupGL.add(n.rootNode),this._updateShaderDefines(a,n),this._currentStep++},_updateShaderDefines:function(t,e){var r=t.viewGL.isLinearSpace()?"define":"undefine";e.rootNode.traverse((function(i){i.material&&(i.material[r]("fragment","SRGB_DECODE"),t.type!=="mapbox3D"&&t.type!=="maptalks3D"||(i.material.define("fragment","NORMAL_UP_AXIS",2),i.material.define("fragment","NORMAL_FRONT_AXIS",1)))}))},remove:function(){this.groupGL.removeAll()},dispose:function(){this.groupGL.removeAll(),this._geo3DBuilderList.forEach((function(t){t.dispose()}))}});(0,M.use)((function(t){t.registerChartView(rp),t.registerSeriesModel(ep)}));var Fh=M.SeriesModel.extend({type:"series.surface",dependencies:["globe","grid3D","geo3D"],visualStyleAccessPath:"itemStyle",formatTooltip:function(t){return un(this,t)},getInitialData:function(t,e){var r=t.data;function i(I){return!(isNaN(I.min)||isNaN(I.max)||isNaN(I.step))}function n(I){var X=M.number.getPrecisionSafe;return Math.max(X(I.min),X(I.max),X(I.step))+1}if(!r)if(t.parametric){var a=t.parametricEquation||{},o=a.u||{},s=a.v||{};["u","v"].forEach((function(I){i(a[I])})),["x","y","z"].forEach((function(I){a[I]}));var l=Math.floor((o.max+o.step-o.min)/o.step),u=Math.floor((s.max+s.step-s.min)/s.step);r=new Float32Array(l*u*5);var h=n(o),c=n(s);for(S=0,A=0;A<u;A++)for(D=0;D<l;D++){var f=D*o.step+o.min,p=A*s.step+s.min,d=M.number.round(Math.min(f,o.max),h),m=M.number.round(Math.min(p,s.max),c);P=a.x(d,m),L=a.y(d,m),C=a.z(d,m),r[S++]=P,r[S++]=L,r[S++]=C,r[S++]=d,r[S++]=m}}else{var g=t.equation||{},_=g.x||{},y=g.y||{};if(["x","y"].forEach((function(I){i(g[I])})),typeof g.z!="function")return;var x=Math.floor((_.max+_.step-_.min)/_.step),v=Math.floor((y.max+y.step-y.min)/y.step);r=new Float32Array(x*v*3);for(var w=n(_),b=n(y),S=0,A=0;A<v;A++)for(var D=0;D<x;D++){var P=D*_.step+_.min,L=A*y.step+y.min,O=M.number.round(Math.min(P,_.max),w),N=M.number.round(Math.min(L,y.max),b),C=g.z(O,N);r[S++]=O,r[S++]=N,r[S++]=C}}var B=["x","y","z"];return t.parametric&&B.push("u","v"),Aa(this,B,r)},defaultOption:{coordinateSystem:"cartesian3D",zlevel:-10,grid3DIndex:0,shading:"lambert",parametric:!1,wireframe:{show:!0,lineStyle:{color:"rgba(0,0,0,0.5)",width:1}},equation:{x:{min:-1,max:1,step:.1},y:{min:-1,max:1,step:.1},z:null},parametricEquation:{u:{min:-1,max:1,step:.1},v:{min:-1,max:1,step:.1},x:null,y:null,z:null},dataShape:null,itemStyle:{},animationDurationUpdate:500}});M.util.merge(Fh.prototype,di);let ip=Fh;var Nr=Mt.vec3;let np=M.ChartView.extend({type:"surface",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node},render:function(t,e,r){var i=this._prevSurfaceMesh;this._prevSurfaceMesh=this._surfaceMesh,this._surfaceMesh=i,this._surfaceMesh||(this._surfaceMesh=this._createSurfaceMesh()),this.groupGL.remove(this._prevSurfaceMesh),this.groupGL.add(this._surfaceMesh);var n=t.coordinateSystem,a=t.get("shading"),o=t.getData(),s="ecgl."+a;if(this._surfaceMesh.material&&this._surfaceMesh.material.shader.name===s||(this._surfaceMesh.material=T.createMaterial(s,["VERTEX_COLOR","DOUBLE_SIDED"])),T.setMaterialFromModel(a,this._surfaceMesh.material,t,r),n&&n.viewGL){n.viewGL.add(this.groupGL);var l=n.viewGL.isLinearSpace()?"define":"undefine";this._surfaceMesh.material[l]("fragment","SRGB_DECODE")}var u=t.get("parametric"),h=t.get("dataShape");h||(h=this._getDataShape(o,u));var c=t.getModel("wireframe"),f=c.get("lineStyle.width"),p=c.get("show")&&f>0;this._updateSurfaceMesh(this._surfaceMesh,t,h,p);var d=this._surfaceMesh.material;p?(d.define("WIREFRAME_QUAD"),d.set("wireframeLineWidth",f),d.set("wireframeLineColor",T.parseColor(c.get("lineStyle.color")))):d.undefine("WIREFRAME_QUAD"),this._initHandler(t,r),this._updateAnimation(t)},_updateAnimation:function(t){T.updateVertexAnimation([["prevPosition","position"],["prevNormal","normal"]],this._prevSurfaceMesh,this._surfaceMesh,t)},_createSurfaceMesh:function(){var t=new T.Mesh({geometry:new T.Geometry({dynamic:!0,sortTriangles:!0}),shadowDepthMaterial:new T.Material({shader:new T.Shader(T.Shader.source("ecgl.sm.depth.vertex"),T.Shader.source("ecgl.sm.depth.fragment"))}),culling:!1,renderOrder:10,renderNormal:!0});return t.geometry.createAttribute("barycentric","float",4),t.geometry.createAttribute("prevPosition","float",3),t.geometry.createAttribute("prevNormal","float",3),Object.assign(t.geometry,hs),t},_initHandler:function(t,e){var r=t.getData(),i=this._surfaceMesh,n=t.coordinateSystem;i.seriesIndex=t.seriesIndex;var a=-1;i.off("mousemove"),i.off("mouseout"),i.on("mousemove",(function(o){var s=(function(m,g){for(var _=1/0,y=-1,x=[],v=0;v<m.length;v++){i.geometry.attributes.position.get(m[v],x);var w=Nr.dist(g.array,x);w<_&&(_=w,y=m[v])}return y})(o.triangle,o.point);if(s>=0){var l=[];i.geometry.attributes.position.get(s,l);for(var u=n.pointToData(l),h=1/0,c=-1,f=[],p=0;p<r.count();p++){f[0]=r.get("x",p),f[1]=r.get("y",p),f[2]=r.get("z",p);var d=Nr.squaredDistance(f,u);d<h&&(c=p,h=d)}c!==a&&e.dispatchAction({type:"grid3DShowAxisPointer",value:u}),a=c,i.dataIndex=c}else i.dataIndex=-1}),this),i.on("mouseout",(function(o){a=-1,i.dataIndex=-1,e.dispatchAction({type:"grid3DHideAxisPointer"})}),this)},_updateSurfaceMesh:function(t,e,r,i){var n=t.geometry,a=e.getData(),o=a.getLayout("points"),s=0;a.each((function(Kt){a.hasValue(Kt)||s++}));var l=s||i,u=n.attributes.position,h=n.attributes.normal,c=n.attributes.texcoord0,f=n.attributes.barycentric,p=n.attributes.color,d=r[0],m=r[1],g=e.get("shading")!=="color";if(l){var _=(d-1)*(m-1)*4;u.init(_),i&&f.init(_)}else u.value=new Float32Array(o);p.init(n.vertexCount),c.init(n.vertexCount);var y,x=[0,3,1,1,3,2],v=[[1,1,0,0],[0,1,0,1],[1,0,0,1],[1,0,1,0]],w=n.indices=new(n.vertexCount>65535?Uint32Array:Uint16Array)((d-1)*(m-1)*6),b=function(Kt,or,Se){Se[1]=Kt*m+or,Se[0]=Kt*m+or+1,Se[3]=(Kt+1)*m+or+1,Se[2]=(Kt+1)*m+or},S=!1;if(l){var A=[],D=[],P=0;g?h.init(n.vertexCount):h.value=null;for(var L=[[],[],[]],O=[],N=[],C=Nr.create(),B=function(Kt,or,Se){var Na=3*or;return Se[0]=Kt[Na],Se[1]=Kt[Na+1],Se[2]=Kt[Na+2],Se},I=new Float32Array(o.length),X=new Float32Array(o.length/3*4),V=0;V<a.count();V++)if(a.hasValue(V)){var st=T.parseColor(Ft(a,V));(ge=Bt(a,V))!=null&&(st[3]*=ge),st[3]<.99&&(S=!0);for(var U=0;U<4;U++)X[4*V+U]=st[U]}var Tt=[1e7,1e7,1e7];for(V=0;V<d-1;V++)for(var lt=0;lt<m-1;lt++){var ht=4*(V*(m-1)+lt);b(V,lt,A);var Q=!1;for(U=0;U<4;U++)B(o,A[U],D),y=D,(isNaN(y[0])||isNaN(y[1])||isNaN(y[2]))&&(Q=!0);for(U=0;U<4;U++)Q?u.set(ht+U,Tt):(B(o,A[U],D),u.set(ht+U,D)),i&&f.set(ht+U,v[U]);for(U=0;U<6;U++)w[P++]=x[U]+ht;if(g&&!Q)for(U=0;U<2;U++){for(var ee=3*U,pt=0;pt<3;pt++)B(o,Rr=A[x[ee]+pt],L[pt]);for(Nr.sub(O,L[0],L[1]),Nr.sub(N,L[1],L[2]),Nr.cross(C,O,N),pt=0;pt<3;pt++){var Wt=3*A[x[ee]+pt];I[Wt]=I[Wt]+C[0],I[Wt+1]=I[Wt+1]+C[1],I[Wt+2]=I[Wt+2]+C[2]}}}if(g)for(V=0;V<I.length/3;V++)B(I,V,C),Nr.normalize(C,C),I[3*V]=C[0],I[3*V+1]=C[1],I[3*V+2]=C[2];st=[];var se=[];for(V=0;V<d-1;V++)for(lt=0;lt<m-1;lt++)for(ht=4*(V*(m-1)+lt),b(V,lt,A),U=0;U<4;U++){for(pt=0;pt<4;pt++)st[pt]=X[4*A[U]+pt];p.set(ht+U,st),g&&(B(I,A[U],C),h.set(ht+U,C));var Rr=A[U];se[0]=Rr%m/(m-1),se[1]=Math.floor(Rr/m)/(d-1),c.set(ht+U,se)}}else{for(se=[],V=0;V<a.count();V++){var ge;se[0]=V%m/(m-1),se[1]=Math.floor(V/m)/(d-1),st=T.parseColor(Ft(a,V)),(ge=Bt(a,V))!=null&&(st[3]*=ge),st[3]<.99&&(S=!0),p.set(V,st),c.set(V,se)}A=[];var Fr=0;for(V=0;V<d-1;V++)for(lt=0;lt<m-1;lt++)for(b(V,lt,A),U=0;U<6;U++)w[Fr++]=A[x[U]];g?n.generateVertexNormals():h.value=null}t.material.get("normalMap")&&n.generateTangents(),n.updateBoundingBox(),n.dirty(),t.material.transparent=S,t.material.depthMask=!S},_getDataShape:function(t,e){for(var r=-1/0,i=0,n=0,a=!1,o=e?"u":"x",s=t.count(),l=0;l<s;l++){var u=t.get(o,l);u<r&&(n=0,i++),r=u,n++}if(i&&n!==1||(a=!0),!a)return[i+1,n];for(var h=Math.floor(Math.sqrt(s));h>0;){if(Math.floor(s/h)===s/h)return[h,s/h];h--}return[h=Math.floor(Math.sqrt(s)),h]},dispose:function(){this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});function Bh(t,e){for(var r=[],i=0;i<e.length;i++)r.push(t.dataToPoint(e[i]));return r}(0,M.use)((function(t){t.registerChartView(np),t.registerSeriesModel(ip),t.registerLayout((function(e,r){e.eachSeriesByType("surface",(function(i){var n=i.coordinateSystem;n&&n.type;var a=i.getData(),o=new Float32Array(3*a.count()),s=[NaN,NaN,NaN];if(n&&n.type==="cartesian3D"){var l=n.dimensions.map((function(u){return i.coordDimToDataDim(u)[0]}));a.each(l,(function(u,h,c,f){var p;p=a.hasValue(f)?n.dataToPoint([u,h,c]):s,o[3*f]=p[0],o[3*f+1]=p[1],o[3*f+2]=p[2]}))}a.setLayout("points",o)}))}))}));var vi=M.SeriesModel.extend({type:"series.map3D",layoutMode:"box",coordinateSystem:null,visualStyleAccessPath:"itemStyle",optionUpdated:function(t){t=t||{};var e=this.get("coordinateSystem");e!=null&&e!=="geo3D"&&(this.get("groundPlane.show")&&(this.option.groundPlane.show=!1),this._geo=null)},getInitialData:function(t){t.data=this.getFilledRegions(t.data,t.map);var e=M.helper.createDimensions(t.data,{coordDimensions:["value"]}),r=new M.List(e,this);r.initData(Wn(t.data));var i={};return r.each((function(n){var a=r.getName(n),o=r.getItemModel(n);i[a]=o})),this._regionModelMap=i,r},formatTooltip:function(t){return un(this,t)},getRegionModel:function(t){var e=this.getData().getName(t);return this._regionModelMap[e]||new M.Model(null,this)},getRegionPolygonCoords:function(t){var e=this.coordinateSystem,r=this.getData().getName(t);if(e.transform)return(i=e.getRegion(r))?i.geometries:[];this._geo||(this._geo=ih.createGeo3D(this));for(var i=this._geo.getRegion(r),n=[],a=0;a<i.geometries.length;a++){var o=i.geometries[a],s=[],l=Bh(e,o.exterior);if(s&&s.length)for(var u=0;u<o.interiors.length;u++)s.push(Bh(e,s[u]));n.push({interiors:s,exterior:l})}return n},getFormattedLabel:function(t,e){var r=_i.getFormattedLabel(this,t,e);return r==null&&(r=this.getData().getName(t)),r},defaultOption:{coordinateSystem:"geo3D",data:null}});M.util.merge(vi.prototype,Wu),M.util.merge(vi.prototype,sa),M.util.merge(vi.prototype,ai),M.util.merge(vi.prototype,oi),M.util.merge(vi.prototype,di);let ap=vi,op=M.ChartView.extend({type:"map3D",__ecgl__:!0,init:function(t,e){this._geo3DBuilder=new Ta(e),this.groupGL=new T.Node},render:function(t,e,r){var i=t.coordinateSystem;if(i&&i.viewGL){if(this.groupGL.add(this._geo3DBuilder.rootNode),i.viewGL.add(this.groupGL),i.type==="geo3D"){this._sceneHelper||(this._sceneHelper=new li,this._sceneHelper.initLight(this.groupGL)),this._sceneHelper.setScene(i.viewGL.scene),this._sceneHelper.updateLight(t),i.viewGL.setPostEffect(t.getModel("postEffect"),r),i.viewGL.setTemporalSuperSampling(t.getModel("temporalSuperSampling"));var n=this._control;n||(n=this._control=new ha({zr:r.getZr()}),this._control.init());var a=t.getModel("viewControl");n.setViewGL(i.viewGL),n.setFromViewControlModel(a,0),n.off("update"),n.on("update",(function(){r.dispatchAction({type:"map3DChangeCamera",alpha:n.getAlpha(),beta:n.getBeta(),distance:n.getDistance(),from:this.uid,map3DId:t.id})})),this._geo3DBuilder.extrudeY=!0}else this._control&&(this._control.dispose(),this._control=null),this._sceneHelper&&(this._sceneHelper.dispose(),this._sceneHelper=null),t.getData().getLayout("geo3D"),this._geo3DBuilder.extrudeY=!1;this._geo3DBuilder.update(t,e,r,0,t.getData().count());var o=i.viewGL.isLinearSpace()?"define":"undefine";this._geo3DBuilder.rootNode.traverse((function(s){s.material&&s.material[o]("fragment","SRGB_DECODE")}))}},afterRender:function(t,e,r,i){var n=i.renderer,a=t.coordinateSystem;a&&a.type==="geo3D"&&(this._sceneHelper.updateAmbientCubemap(n,t,r),this._sceneHelper.updateSkybox(n,t,r))},dispose:function(){this.groupGL.removeAll(),this._control.dispose(),this._geo3DBuilder.dispose()}});(0,M.use)((function(t){ah(t),t.registerChartView(op),t.registerSeriesModel(ap),t.registerAction({type:"map3DChangeCamera",event:"map3dcamerachanged",update:"series:updateCamera"},(function(e,r){r.eachComponent({mainType:"series",subType:"map3D",query:e},(function(i){i.setView(e)}))}))}));let sp=M.SeriesModel.extend({type:"series.scatterGL",dependencies:["grid","polar","geo","singleAxis"],visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,getInitialData:function(){return M.helper.createList(this)},defaultOption:{coordinateSystem:"cartesian2d",zlevel:10,progressive:1e5,progressiveThreshold:1e5,large:!1,symbol:"circle",symbolSize:10,zoomScale:0,blendMode:"source-over",itemStyle:{opacity:.8},postEffect:{enable:!1,colorCorrection:{exposure:0,brightness:0,contrast:1,saturation:1,enable:!0}}}});function zh(t,e,r){var i=e[0],n=e[1];return t[0]=r[0]*i+r[2]*n+r[4],t[1]=r[1]*i+r[3]*n+r[5],t}function ar(t){this.viewGL=t}ar.prototype.reset=function(t,e){this._updateCamera(e.getWidth(),e.getHeight(),e.getDevicePixelRatio()),this._viewTransform=[1,0,0,1,0,0],this.updateTransform(t,e)},ar.prototype.updateTransform=function(t,e){var r,i,n,a,o,s,l,u,h,c=t.coordinateSystem;c.getRoamTransform&&(r=this._viewTransform,n=(i=c.getRoamTransform())[0],a=i[2],o=i[4],s=i[1],l=i[3],u=i[5],(h=n*l-s*a)&&(h=1/h,r[0]=l*h,r[1]=-s*h,r[2]=-a*h,r[3]=n*h,r[4]=(a*u-l*o)*h,r[5]=(s*o-n*u)*h),this._setCameraTransform(this._viewTransform),e.getZr().refresh())},ar.prototype.dataToPoint=function(t,e,r){r=t.dataToPoint(e,null,r);var i=this._viewTransform;i&&zh(r,r,i)},ar.prototype.removeTransformInPoint=function(t){return this._viewTransform&&zh(t,t,this._viewTransform),t},ar.prototype.getZoom=function(){if(this._viewTransform){var t=this._viewTransform;return 1/Math.max(Math.sqrt(t[0]*t[0]+t[1]*t[1]),Math.sqrt(t[2]*t[2]+t[3]*t[3]))}return 1},ar.prototype._setCameraTransform=function(t){var e=this.viewGL.camera;e.position.set(t[4],t[5],0),e.scale.set(Math.sqrt(t[0]*t[0]+t[1]*t[1]),Math.sqrt(t[2]*t[2]+t[3]*t[3]),1)},ar.prototype._updateCamera=function(t,e,r){this.viewGL.setViewport(0,0,t,e,r);var i=this.viewGL.camera;i.left=i.top=0,i.bottom=e,i.right=t,i.near=0,i.far=100};let Gh=ar,lp=M.ChartView.extend({type:"scatterGL",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this.viewGL=new Qe("orthographic"),this.viewGL.add(this.groupGL),this._pointsBuilderList=[],this._currentStep=0,this._sizeScale=1,this._glViewHelper=new Gh(this.viewGL)},render:function(t,e,r){if(this.groupGL.removeAll(),this._glViewHelper.reset(t,r),t.getData().count()){var i=this._pointsBuilderList[0];i||(i=this._pointsBuilderList[0]=new cn(!0,r)),this._pointsBuilderList.length=1,this.groupGL.add(i.rootNode),this._removeTransformInPoints(t.getData().getLayout("points")),i.update(t,e,r),this.viewGL.setPostEffect(t.getModel("postEffect"),r)}},incrementalPrepareRender:function(t,e,r){this.groupGL.removeAll(),this._glViewHelper.reset(t,r),this._currentStep=0,this.viewGL.setPostEffect(t.getModel("postEffect"),r)},incrementalRender:function(t,e,r,i){if(!(t.end<=t.start)){var n=this._pointsBuilderList[this._currentStep];n||(n=new cn(!0,i),this._pointsBuilderList[this._currentStep]=n),this.groupGL.add(n.rootNode),this._removeTransformInPoints(e.getData().getLayout("points")),n.setSizeScale(this._sizeScale),n.update(e,r,i,t.start,t.end),i.getZr().refresh(),this._currentStep++}},updateTransform:function(t,e,r){if(t.coordinateSystem.getRoamTransform){this._glViewHelper.updateTransform(t,r);var i=this._glViewHelper.getZoom(),n=Math.max((t.get("zoomScale")||0)*(i-1)+1,0);this._sizeScale=n,this._pointsBuilderList.forEach((function(a){a.setSizeScale(n)}))}},_removeTransformInPoints:function(t){if(t)for(var e=[],r=0;r<t.length;r+=2)e[0]=t[r],e[1]=t[r+1],this._glViewHelper.removeTransformInPoint(e),t[r]=e[0],t[r+1]=e[1]},dispose:function(){this.groupGL.removeAll(),this._pointsBuilderList.forEach((function(t){t.dispose()}))},remove:function(){this.groupGL.removeAll()}});function yi(t){return"_EC_"+t}(0,M.use)((function(t){t.registerChartView(lp),t.registerSeriesModel(sp),t.registerLayout({seriesType:"scatterGL",reset:function(e){var r,i=e.coordinateSystem,n=e.getData();if(i){var a=i.dimensions.map((function(s){return n.mapDimension(s)})).slice(0,2),o=[];a.length===1?r=function(s){for(var l=new Float32Array(2*(s.end-s.start)),u=s.start;u<s.end;u++){var h=2*(u-s.start),c=n.get(a[0],u),f=i.dataToPoint(c);l[h]=f[0],l[h+1]=f[1]}n.setLayout("points",l)}:a.length===2&&(r=function(s){for(var l=new Float32Array(2*(s.end-s.start)),u=s.start;u<s.end;u++){var h=2*(u-s.start),c=n.get(a[0],u),f=n.get(a[1],u);o[0]=c,o[1]=f,o=i.dataToPoint(o),l[h]=o[0],l[h+1]=o[1]}n.setLayout("points",l)})}return{progress:r}}})}));var up=(function(){function t(e){this.type="graph",this.nodes=[],this.edges=[],this._nodesMap={},this._edgesMap={},this._directed=e||!1}return t.prototype.isDirected=function(){return this._directed},t.prototype.addNode=function(e,r){e=e==null?""+r:""+e;var i=this._nodesMap;if(!i[yi(e)]){var n=new Ir(e,r);return n.hostGraph=this,this.nodes.push(n),i[yi(e)]=n,n}},t.prototype.getNodeByIndex=function(e){var r=this.data.getRawIndex(e);return this.nodes[r]},t.prototype.getNodeById=function(e){return this._nodesMap[yi(e)]},t.prototype.addEdge=function(e,r,i){var n=this._nodesMap,a=this._edgesMap;if(typeof e=="number"&&(e=this.nodes[e]),typeof r=="number"&&(r=this.nodes[r]),e instanceof Ir||(e=n[yi(e)]),r instanceof Ir||(r=n[yi(r)]),e&&r){var o=e.id+"-"+r.id,s=new Uh(e,r,i);return s.hostGraph=this,this._directed&&(e.outEdges.push(s),r.inEdges.push(s)),e.edges.push(s),e!==r&&r.edges.push(s),this.edges.push(s),a[o]=s,s}},t.prototype.getEdgeByIndex=function(e){var r=this.edgeData.getRawIndex(e);return this.edges[r]},t.prototype.getEdge=function(e,r){e instanceof Ir&&(e=e.id),r instanceof Ir&&(r=r.id);var i=this._edgesMap;return this._directed?i[e+"-"+r]:i[e+"-"+r]||i[r+"-"+e]},t.prototype.eachNode=function(e,r){for(var i=this.nodes,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&e.call(r,i[a],a)},t.prototype.eachEdge=function(e,r){for(var i=this.edges,n=i.length,a=0;a<n;a++)i[a].dataIndex>=0&&i[a].node1.dataIndex>=0&&i[a].node2.dataIndex>=0&&e.call(r,i[a],a)},t.prototype.breadthFirstTraverse=function(e,r,i,n){if(r instanceof Ir||(r=this._nodesMap[yi(r)]),r){for(var a=i==="out"?"outEdges":i==="in"?"inEdges":"edges",o=0;o<this.nodes.length;o++)this.nodes[o].__visited=!1;if(!e.call(n,r,null))for(var s=[r];s.length;){var l=s.shift(),u=l[a];for(o=0;o<u.length;o++){var h=u[o],c=h.node1===l?h.node2:h.node1;if(!c.__visited){if(e.call(n,c,l))return;s.push(c),c.__visited=!0}}}}},t.prototype.update=function(){for(var e=this.data,r=this.edgeData,i=this.nodes,n=this.edges,a=0,o=i.length;a<o;a++)i[a].dataIndex=-1;for(a=0,o=e.count();a<o;a++)i[e.getRawIndex(a)].dataIndex=a;for(r.filterSelf((function(s){var l=n[r.getRawIndex(s)];return l.node1.dataIndex>=0&&l.node2.dataIndex>=0})),a=0,o=n.length;a<o;a++)n[a].dataIndex=-1;for(a=0,o=r.count();a<o;a++)n[r.getRawIndex(a)].dataIndex=a},t.prototype.clone=function(){for(var e=new t(this._directed),r=this.nodes,i=this.edges,n=0;n<r.length;n++)e.addNode(r[n].id,r[n].dataIndex);for(n=0;n<i.length;n++){var a=i[n];e.addEdge(a.node1.id,a.node2.id,a.dataIndex)}return e},t})(),Ir=(function(){function t(e,r){this.inEdges=[],this.outEdges=[],this.edges=[],this.dataIndex=-1,this.id=e??"",this.dataIndex=r??-1}return t.prototype.degree=function(){return this.edges.length},t.prototype.inDegree=function(){return this.inEdges.length},t.prototype.outDegree=function(){return this.outEdges.length},t.prototype.getModel=function(e){if(!(this.dataIndex<0))return this.hostGraph.data.getItemModel(this.dataIndex).getModel(e)},t.prototype.getAdjacentDataIndices=function(){for(var e={edge:[],node:[]},r=0;r<this.edges.length;r++){var i=this.edges[r];i.dataIndex<0||(e.edge.push(i.dataIndex),e.node.push(i.node1.dataIndex,i.node2.dataIndex))}return e},t})(),Uh=(function(){function t(e,r,i){this.dataIndex=-1,this.node1=e,this.node2=r,this.dataIndex=i??-1}return t.prototype.getModel=function(e){if(!(this.dataIndex<0))return this.hostGraph.edgeData.getItemModel(this.dataIndex).getModel(e)},t.prototype.getAdjacentDataIndices=function(){return{edge:[this.dataIndex],node:[this.node1.dataIndex,this.node2.dataIndex]}},t})();function kh(t,e){return{getValue:function(r){var i=this[t][e];return i.get(i.getDimension(r||"value"),this.dataIndex)},setVisual:function(r,i){this.dataIndex>=0&&this[t][e].setItemVisual(this.dataIndex,r,i)},getVisual:function(r){return this[t][e].getItemVisual(this.dataIndex,r)},setLayout:function(r,i){this.dataIndex>=0&&this[t][e].setItemLayout(this.dataIndex,r,i)},getLayout:function(){return this[t][e].getItemLayout(this.dataIndex)},getGraphicEl:function(){return this[t][e].getItemGraphicEl(this.dataIndex)},getRawIndex:function(){return this[t][e].getRawIndex(this.dataIndex)}}}kl(Ir,kh("hostGraph","data")),kl(Uh,kh("hostGraph","edgeData"));let hp=up;var me=eu();function cp(t,e){if(me(this).mainData===this){var r=Ul({},me(this).datas);r[this.dataType]=e,Vh(e,r,t)}else Es(e,this.dataType,me(this).mainData,t);return e}function dp(t,e){return t.struct&&t.struct.update(),e}function fp(t,e){return ii(me(e).datas,(function(r,i){r!==e&&Es(r.cloneShallow(),i,e,t)})),e}function pp(t){var e=me(this).mainData;return t==null||e==null?e:me(e).datas[t]}function mp(){var t=me(this).mainData;return t==null?[{data:t}]:Po(ni(me(t).datas),(function(e){return{type:e,data:me(t).datas[e]}}))}function Vh(t,e,r){me(t).datas={},ii(e,(function(i,n){Es(i,n,t,r)}))}function Es(t,e,r,i){me(r).datas[e]=t,me(t).mainData=r,t.dataType=e,i.struct&&(t[i.structAttr]=i.struct,i.struct[i.datasAttr[e]]=t),t.getLinkedData=pp,t.getLinkedDataAll=mp}var fn=M.SeriesModel.extend({type:"series.graphGL",visualStyleAccessPath:"itemStyle",hasSymbolVisual:!0,init:function(t){fn.superApply(this,"init",arguments),this.legendDataProvider=function(){return this._categoriesData},this._updateCategoriesData()},mergeOption:function(t){fn.superApply(this,"mergeOption",arguments),this._updateCategoriesData()},getFormattedLabel:function(t,e,r,i){var n=_i.getFormattedLabel(this,t,e,r,i);if(n==null){var a=this.getData(),o=a.dimensions[a.dimensions.length-1];n=a.get(o,t)}return n},getInitialData:function(t,e){var r=t.edges||t.links||[],i=t.data||t.nodes||[],n=this;if(i&&r)return(function(a,o,s,l,u){for(var h=new hp(!0),c=0;c<a.length;c++)h.addNode(J(a[c].id,a[c].name,c),c);var f,p=[],d=[],m=0;for(c=0;c<o.length;c++){var g=o[c],_=g.source,y=g.target;h.addEdge(_,y,m)&&(d.push(g),p.push(J(g.id,_+" > "+y)),m++)}var x=M.helper.createDimensions(a,{coordDimensions:["value"]});(f=new M.List(x,s)).initData(a);var v,w,b,S=new M.List(["value"],s);return S.initData(d,p),u&&u(f,S),w=(v={mainData:f,struct:h,structAttr:"graph",datas:{node:f,edge:S},datasAttr:{node:"data",edge:"edgeData"}}).mainData,(b=v.datas)||(b={main:w},v.datasAttr={main:"data"}),v.datas=v.mainData=null,Vh(w,b,v),ii(b,(function(A){ii(w.TRANSFERABLE_METHODS,(function(D){A.wrapMethod(D,ki(cp,v))}))})),w.wrapMethod("cloneShallow",ki(fp,v)),ii(w.CHANGABLE_METHODS,(function(A){w.wrapMethod(A,ki(dp,v))})),(function(A,D){if(!A)throw new Error(void 0)})(b[w.dataType]===w),h.update(),h})(i,r,this,0,(function(a,o){a.wrapMethod("getItemModel",(function(h){let c=n._categoriesModels[h.getShallow("category")];return c&&(c.parentModel=h.parentModel,h.parentModel=c),h}));let s=e.getModel([]).getModel;function l(h,c){let f=s.call(this,h,c);return f.resolveParentPath=u,f}function u(h){if(h&&(h[0]==="label"||h[1]==="label")){let c=h.slice();return h[0]==="label"?c[0]="edgeLabel":h[1]==="label"&&(c[1]="edgeLabel"),c}return h}o.wrapMethod("getItemModel",(function(h){return h.resolveParentPath=u,h.getModel=l,h}))})).data},getGraph:function(){return this.getData().graph},getEdgeData:function(){return this.getGraph().edgeData},getCategoriesData:function(){return this._categoriesData},formatTooltip:function(t,e,r){if(r==="edge"){var i=this.getData(),n=this.getDataParams(t,r),a=i.graph.getEdgeByIndex(t),o=i.getName(a.node1.dataIndex),s=i.getName(a.node2.dataIndex),l=[];return o!=null&&l.push(o),s!=null&&l.push(s),l=M.format.encodeHTML(l.join(" > ")),n.value&&(l+=" : "+M.format.encodeHTML(n.value)),l}return fn.superApply(this,"formatTooltip",arguments)},_updateCategoriesData:function(){var t=(this.option.categories||[]).map((function(r){return r.value!=null?r:Object.assign({value:0},r)})),e=new M.List(["value"],this);e.initData(t),this._categoriesData=e,this._categoriesModels=e.mapArray((function(r){return e.getItemModel(r,!0)}))},setView:function(t){t.zoom!=null&&(this.option.zoom=t.zoom),t.offset!=null&&(this.option.offset=t.offset)},setNodePosition:function(t){for(var e=0;e<t.length/2;e++){var r=t[2*e],i=t[2*e+1],n=this.getData().getRawDataItem(e);n.x=r,n.y=i}},isAnimationEnabled:function(){return fn.superCall(this,"isAnimationEnabled")&&!(this.get("layout")==="force"&&this.get("force.layoutAnimation"))},defaultOption:{zlevel:10,z:2,legendHoverLink:!0,layout:"forceAtlas2",forceAtlas2:{initLayout:null,GPU:!0,steps:1,maxSteps:1e3,repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,edgeWeightInfluence:1,edgeWeight:[1,4],nodeWeight:[1,4],preventOverlap:!1,gravityCenter:null},focusNodeAdjacency:!0,focusNodeAdjacencyOn:"mouseover",left:"center",top:"center",symbol:"circle",symbolSize:5,roam:!1,center:null,zoom:1,label:{show:!1,formatter:"{b}",position:"right",distance:5,textStyle:{fontSize:14}},itemStyle:{},lineStyle:{color:"#aaa",width:1,opacity:.5},emphasis:{label:{show:!0}},animation:!1}});let gp=fn;var Pt=Mt.vec2,Hh=[[0,0],[1,1]],Wh=nt.extend((function(){return{segmentScale:4,dynamic:!0,useNativeLine:!0,attributes:{position:new nt.Attribute("position","float",2,"POSITION"),normal:new nt.Attribute("normal","float",2),offset:new nt.Attribute("offset","float",1),color:new nt.Attribute("color","float",4,"COLOR")}}}),{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0,this._itemVertexOffsets=[]},setVertexCount:function(t){var e=this.attributes;this.vertexCount!==t&&(e.position.init(t),e.color.init(t),this.useNativeLine||(e.offset.init(t),e.normal.init(t)),t>65535?this.indices instanceof Uint16Array&&(this.indices=new Uint32Array(this.indices)):this.indices instanceof Uint32Array&&(this.indices=new Uint16Array(this.indices)))},setTriangleCount:function(t){this.triangleCount!==t&&(this.indices=t===0?null:this.vertexCount>65535?new Uint32Array(3*t):new Uint16Array(3*t))},_getCubicCurveApproxStep:function(t,e,r,i){return 1/(Pt.dist(t,e)+Pt.dist(r,e)+Pt.dist(i,r)+1)*this.segmentScale},getCubicCurveVertexCount:function(t,e,r,i){var n=this._getCubicCurveApproxStep(t,e,r,i),a=Math.ceil(1/n);return this.useNativeLine?2*a:2*a+2},getCubicCurveTriangleCount:function(t,e,r,i){var n=this._getCubicCurveApproxStep(t,e,r,i),a=Math.ceil(1/n);return this.useNativeLine?0:2*a},getLineVertexCount:function(){return this.getPolylineVertexCount(Hh)},getLineTriangleCount:function(){return this.getPolylineTriangleCount(Hh)},getPolylineVertexCount:function(t){var e;return e=typeof t=="number"?t:typeof t[0]!="number"?t.length:t.length/2,this.useNativeLine?2*(e-1):2*(e-1)+2},getPolylineTriangleCount:function(t){var e;return e=typeof t=="number"?t:typeof t[0]!="number"?t.length:t.length/2,this.useNativeLine?0:2*(e-1)},addCubicCurve:function(t,e,r,i,n,a){a==null&&(a=1);var o=t[0],s=t[1],l=e[0],u=e[1],h=r[0],c=r[1],f=i[0],p=i[1],d=this._getCubicCurveApproxStep(t,e,r,i),m=d*d,g=m*d,_=3*d,y=3*m,x=6*m,v=6*g,w=o-2*l+h,b=s-2*u+c,S=3*(l-h)-o+f,A=3*(u-c)-s+p,D=o,P=s,L=(l-o)*_+w*y+S*g,O=(u-s)*_+b*y+A*g,N=w*x+S*v,C=b*x+A*v,B=S*v,I=A*v,X=0,V=0,st=Math.ceil(1/d),U=new Float32Array(3*(st+1)),Tt=(U=[],0);for(V=0;V<st+1;V++)U[Tt++]=D,U[Tt++]=P,D+=L,P+=O,L+=N,O+=C,N+=B,C+=I,(X+=d)>1&&(D=L>0?Math.min(D,f):Math.max(D,f),P=O>0?Math.min(P,p):Math.max(P,p));this.addPolyline(U,n,a)},addLine:function(t,e,r,i){this.addPolyline([t,e],r,i)},addPolyline:(function(){var t=Pt.create(),e=Pt.create(),r=Pt.create(),i=Pt.create(),n=[],a=[],o=[];return function(s,l,u,h,c){if(s.length){var f=typeof s[0]!="number";if(c==null&&(c=f?s.length:s.length/2),!(c<2)){h==null&&(h=0),u==null&&(u=1),this._itemVertexOffsets.push(this._vertexOffset);for(var p,d=f?typeof l[0]!="number":l.length/4===c,m=this.attributes.position,g=this.attributes.color,_=this.attributes.offset,y=this.attributes.normal,x=this.indices,v=this._vertexOffset,w=0;w<c;w++){if(f)n=s[w+h],p=d?l[w+h]:l;else{var b=2*w+h;if((n=n||[])[0]=s[b],n[1]=s[b+1],d){var S=4*w+h;(p=p||[])[0]=l[S],p[1]=l[S+1],p[2]=l[S+2],p[3]=l[S+3]}else p=l}if(this.useNativeLine)w>1&&(m.copy(v,v-1),g.copy(v,v-1),v++);else{var A;if(w<c-1)if(f?Pt.copy(a,s[w+1]):(b=2*(w+1)+h,(a=a||[])[0]=s[b],a[1]=s[b+1]),w>0){Pt.sub(t,n,o),Pt.sub(e,a,n),Pt.normalize(t,t),Pt.normalize(e,e),Pt.add(i,t,e),Pt.normalize(i,i);var D=u/2*Math.min(1/Pt.dot(t,i),2);r[0]=-i[1],r[1]=i[0],A=D}else Pt.sub(t,a,n),Pt.normalize(t,t),r[0]=-t[1],r[1]=t[0],A=u/2;else Pt.sub(t,n,o),Pt.normalize(t,t),r[0]=-t[1],r[1]=t[0],A=u/2;y.set(v,r),y.set(v+1,r),_.set(v,A),_.set(v+1,-A),Pt.copy(o,n),m.set(v,n),m.set(v+1,n),g.set(v,p),g.set(v+1,p),v+=2}if(this.useNativeLine)g.set(v,p),m.set(v,n),v++;else if(w>0){var P=3*this._faceOffset;(x=this.indices)[P]=v-4,x[P+1]=v-3,x[P+2]=v-2,x[P+3]=v-3,x[P+4]=v-1,x[P+5]=v-2,this._faceOffset+=2}}this._vertexOffset=v}}}})(),setItemColor:function(t,e){for(var r=this._itemVertexOffsets[t],i=t<this._itemVertexOffsets.length-1?this._itemVertexOffsets[t+1]:this._vertexOffset,n=r;n<i;n++)this.attributes.color.set(n,e);this.dirty("color")}});M.util.defaults(Wh.prototype,Zi);let jh=Wh;T.Shader.import(`@export ecgl.forceAtlas2.updateNodeRepulsion

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
@end`);var Cs={repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,scaling:1,edgeWeightInfluence:1,jitterTolerence:.1,preventOverlap:!1,dissuadeHubs:!1,gravityCenter:null};function Vt(t){var e={type:T.Texture.FLOAT,minFilter:T.Texture.NEAREST,magFilter:T.Texture.NEAREST};this._positionSourceTex=new T.Texture2D(e),this._positionSourceTex.flipY=!1,this._positionTex=new T.Texture2D(e),this._positionPrevTex=new T.Texture2D(e),this._forceTex=new T.Texture2D(e),this._forcePrevTex=new T.Texture2D(e),this._weightedSumTex=new T.Texture2D(e),this._weightedSumTex.width=this._weightedSumTex.height=1,this._globalSpeedTex=new T.Texture2D(e),this._globalSpeedPrevTex=new T.Texture2D(e),this._globalSpeedTex.width=this._globalSpeedTex.height=1,this._globalSpeedPrevTex.width=this._globalSpeedPrevTex.height=1,this._nodeRepulsionPass=new Et({fragment:T.Shader.source("ecgl.forceAtlas2.updateNodeRepulsion")}),this._positionPass=new Et({fragment:T.Shader.source("ecgl.forceAtlas2.updatePosition")}),this._globalSpeedPass=new Et({fragment:T.Shader.source("ecgl.forceAtlas2.calcGlobalSpeed")}),this._copyPass=new Et({fragment:T.Shader.source("clay.compositor.output")});var r=function(i){i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ONE)};this._edgeForceMesh=new T.Mesh({geometry:new T.Geometry({attributes:{node1:new T.Geometry.Attribute("node1","float",2),node2:new T.Geometry.Attribute("node2","float",2),weight:new T.Geometry.Attribute("weight","float",1)},dynamic:!0,mainAttribute:"node1"}),material:new T.Material({transparent:!0,shader:T.createShader("ecgl.forceAtlas2.updateEdgeAttraction"),blend:r,depthMask:!1,depthText:!1}),mode:T.Mesh.POINTS}),this._weightedSumMesh=new T.Mesh({geometry:new T.Geometry({attributes:{node:new T.Geometry.Attribute("node","float",2)},dynamic:!0,mainAttribute:"node"}),material:new T.Material({transparent:!0,shader:T.createShader("ecgl.forceAtlas2.calcWeightedSum"),blend:r,depthMask:!1,depthText:!1}),mode:T.Mesh.POINTS}),this._framebuffer=new kt({depthBuffer:!1}),this._dummyCamera=new T.OrthographicCamera({left:-1,right:1,top:1,bottom:-1,near:0,far:100}),this._globalSpeed=0}Vt.prototype.updateOption=function(t){for(var e in Cs)this[e]=Cs[e];var r=this._nodes.length;if(this.jitterTolerence=r>5e4?10:r>5e3?1:.1,this.scaling=r>100?2:10,t)for(var e in Cs)t[e]!=null&&(this[e]=t[e]);if(this.repulsionByDegree)for(var i=this._positionSourceTex.pixels,n=0;n<this._nodes.length;n++)i[4*n+2]=(this._nodes[n].degree||0)+1},Vt.prototype._updateGravityCenter=function(t){var e=this._nodes,r=this._edges;if(this.gravityCenter)this._gravityCenter=this.gravityCenter;else{for(var i=[1/0,1/0],n=[-1/0,-1/0],a=0;a<e.length;a++)i[0]=Math.min(e[a].x,i[0]),i[1]=Math.min(e[a].y,i[1]),n[0]=Math.max(e[a].x,n[0]),n[1]=Math.max(e[a].y,n[1]);this._gravityCenter=[.5*(i[0]+n[0]),.5*(i[1]+n[1])]}for(a=0;a<r.length;a++){var o=r[a].node1,s=r[a].node2;e[o].degree=(e[o].degree||0)+1,e[s].degree=(e[s].degree||0)+1}},Vt.prototype.initData=function(t,e){this._nodes=t,this._edges=e,this._updateGravityCenter();var r=Math.ceil(Math.sqrt(t.length)),i=r,n=new Float32Array(r*i*4);this._resize(r,i);for(var a=0,o=0;o<t.length;o++){var s=t[o];n[a++]=s.x||0,n[a++]=s.y||0,n[a++]=s.mass||1,n[a++]=s.size||1}this._positionSourceTex.pixels=n;var l=this._edgeForceMesh.geometry,u=e.length;l.attributes.node1.init(2*u),l.attributes.node2.init(2*u),l.attributes.weight.init(2*u);var h=[];for(o=0;o<e.length;o++){var c=l.attributes,f=e[o].weight;f==null&&(f=1),c.node1.set(o,this.getNodeUV(e[o].node1,h)),c.node2.set(o,this.getNodeUV(e[o].node2,h)),c.weight.set(o,f),c.node1.set(o+u,this.getNodeUV(e[o].node2,h)),c.node2.set(o+u,this.getNodeUV(e[o].node1,h)),c.weight.set(o+u,f)}var p=this._weightedSumMesh.geometry;for(p.attributes.node.init(t.length),o=0;o<t.length;o++)p.attributes.node.set(o,this.getNodeUV(o,h));l.dirty(),p.dirty(),this._nodeRepulsionPass.material.define("fragment","NODE_COUNT",t.length),this._nodeRepulsionPass.material.setUniform("textureSize",[r,i]),this._inited=!1,this._frame=0},Vt.prototype.getNodes=function(){return this._nodes},Vt.prototype.getEdges=function(){return this._edges},Vt.prototype.step=function(t){this._inited||(this._initFromSource(t),this._inited=!0),this._frame++,this._framebuffer.attach(this._forceTex),this._framebuffer.bind(t);var e=this._nodeRepulsionPass;e.setUniform("strongGravityMode",this.strongGravityMode),e.setUniform("gravity",this.gravity),e.setUniform("gravityCenter",this._gravityCenter),e.setUniform("scaling",this.scaling),e.setUniform("preventOverlap",this.preventOverlap),e.setUniform("positionTex",this._positionPrevTex),e.render(t);var r=this._edgeForceMesh;r.material.set("linLogMode",this.linLogMode),r.material.set("edgeWeightInfluence",this.edgeWeightInfluence),r.material.set("preventOverlap",this.preventOverlap),r.material.set("positionTex",this._positionPrevTex),t.gl.enable(t.gl.BLEND),t.renderPass([r],this._dummyCamera),this._framebuffer.attach(this._weightedSumTex),t.gl.clearColor(0,0,0,0),t.gl.clear(t.gl.COLOR_BUFFER_BIT),t.gl.enable(t.gl.BLEND);var i=this._weightedSumMesh;i.material.set("positionTex",this._positionPrevTex),i.material.set("forceTex",this._forceTex),i.material.set("forcePrevTex",this._forcePrevTex),t.renderPass([i],this._dummyCamera),this._framebuffer.attach(this._globalSpeedTex);var n=this._globalSpeedPass;n.setUniform("globalSpeedPrevTex",this._globalSpeedPrevTex),n.setUniform("weightedSumTex",this._weightedSumTex),n.setUniform("jitterTolerence",this.jitterTolerence),t.gl.disable(t.gl.BLEND),n.render(t);var a=this._positionPass;this._framebuffer.attach(this._positionTex),a.setUniform("globalSpeedTex",this._globalSpeedTex),a.setUniform("positionTex",this._positionPrevTex),a.setUniform("forceTex",this._forceTex),a.setUniform("forcePrevTex",this._forcePrevTex),a.render(t),this._framebuffer.unbind(t),this._swapTexture()},Vt.prototype.update=function(t,e,r){e==null&&(e=1),e=Math.max(e,1);for(var i=0;i<e;i++)this.step(t);r&&r()},Vt.prototype.getNodePositionTexture=function(){return this._inited?this._positionPrevTex:this._positionSourceTex},Vt.prototype.getNodeUV=function(t,e){e=e||[];var r=this._positionTex.width,i=this._positionTex.height;return e[0]=t%r/(r-1),e[1]=Math.floor(t/r)/(i-1)||0,e},Vt.prototype.getNodePosition=function(t,e){var r=this._positionArr,i=this._positionTex.width,n=this._positionTex.height,a=i*n;r&&r.length===4*a||(r=this._positionArr=new Float32Array(4*a)),this._framebuffer.bind(t),this._framebuffer.attach(this._positionPrevTex),t.gl.readPixels(0,0,i,n,t.gl.RGBA,t.gl.FLOAT,r),this._framebuffer.unbind(t),e||(e=new Float32Array(2*this._nodes.length));for(var o=0;o<this._nodes.length;o++)e[2*o]=r[4*o],e[2*o+1]=r[4*o+1];return e},Vt.prototype.getTextureData=function(t,e){var r=this["_"+e+"Tex"],i=r.width,n=r.height;this._framebuffer.bind(t),this._framebuffer.attach(r);var a=new Float32Array(i*n*4);return t.gl.readPixels(0,0,i,n,t.gl.RGBA,t.gl.FLOAT,a),this._framebuffer.unbind(t),a},Vt.prototype.getTextureSize=function(){return{width:this._positionTex.width,height:this._positionTex.height}},Vt.prototype.isFinished=function(t){return this._frame>t},Vt.prototype._swapTexture=function(){var t=this._positionPrevTex;this._positionPrevTex=this._positionTex,this._positionTex=t,t=this._forcePrevTex,this._forcePrevTex=this._forceTex,this._forceTex=t,t=this._globalSpeedPrevTex,this._globalSpeedPrevTex=this._globalSpeedTex,this._globalSpeedTex=t},Vt.prototype._initFromSource=function(t){this._framebuffer.attach(this._positionPrevTex),this._framebuffer.bind(t),this._copyPass.setUniform("texture",this._positionSourceTex),this._copyPass.render(t),t.gl.clearColor(0,0,0,0),this._framebuffer.attach(this._forcePrevTex),t.gl.clear(t.gl.COLOR_BUFFER_BIT),this._framebuffer.attach(this._globalSpeedPrevTex),t.gl.clear(t.gl.COLOR_BUFFER_BIT),this._framebuffer.unbind(t)},Vt.prototype._resize=function(t,e){["_positionSourceTex","_positionTex","_positionPrevTex","_forceTex","_forcePrevTex"].forEach((function(r){this[r].width=t,this[r].height=e,this[r].dirty()}),this)},Vt.prototype.dispose=function(t){this._framebuffer.dispose(t),this._copyPass.dispose(t),this._nodeRepulsionPass.dispose(t),this._positionPass.dispose(t),this._globalSpeedPass.dispose(t),this._edgeForceMesh.geometry.dispose(t),this._weightedSumMesh.geometry.dispose(t),this._positionSourceTex.dispose(t),this._positionTex.dispose(t),this._positionPrevTex.dispose(t),this._forceTex.dispose(t),this._forcePrevTex.dispose(t),this._weightedSumTex.dispose(t),this._globalSpeedTex.dispose(t),this._globalSpeedPrevTex.dispose(t)};let Ca=Vt;var pn=function(){var t=function(){return new Float32Array(2)},e=function(d,m){var g=m[0]-d[0],_=m[1]-d[1];return Math.sqrt(g*g+_*_)},r=function(d){var m=d[0],g=d[1];return Math.sqrt(m*m+g*g)},i=function(d,m,g,_){return d[0]=m[0]+g[0]*_,d[1]=m[1]+g[1]*_,d},n=function(d,m,g){return d[0]=m[0]+g[0],d[1]=m[1]+g[1],d},a=function(d,m,g){return d[0]=m[0]-g[0],d[1]=m[1]-g[1],d},o=function(d,m,g){return d[0]=m,d[1]=g,d};function s(){this.subRegions=[],this.nSubRegions=0,this.node=null,this.mass=0,this.centerOfMass=null,this.bbox=new Float32Array(4),this.size=0}var l=s.prototype;function u(){this.position=new Float32Array(2),this.force=t(),this.forcePrev=t(),this.mass=1,this.inDegree=0,this.outDegree=0}function h(d,m){this.source=d,this.target=m,this.weight=1}function c(){this.autoSettings=!0,this.barnesHutOptimize=!0,this.barnesHutTheta=1.5,this.repulsionByDegree=!0,this.linLogMode=!1,this.strongGravityMode=!1,this.gravity=1,this.scaling=1,this.edgeWeightInfluence=1,this.jitterTolerence=.1,this.preventOverlap=!1,this.dissuadeHubs=!1,this.rootRegion=new s,this.rootRegion.centerOfMass=t(),this.nodes=[],this.edges=[],this.bbox=new Float32Array(4),this.gravityCenter=null,this._massArr=null,this._swingingArr=null,this._sizeArr=null,this._globalSpeed=0}l.beforeUpdate=function(){for(var d=0;d<this.nSubRegions;d++)this.subRegions[d].beforeUpdate();this.mass=0,this.centerOfMass&&(this.centerOfMass[0]=0,this.centerOfMass[1]=0),this.nSubRegions=0,this.node=null},l.afterUpdate=function(){this.subRegions.length=this.nSubRegions;for(var d=0;d<this.nSubRegions;d++)this.subRegions[d].afterUpdate()},l.addNode=function(d){if(this.nSubRegions===0){if(this.node==null)return void(this.node=d);this._addNodeToSubRegion(this.node),this.node=null}this._addNodeToSubRegion(d),this._updateCenterOfMass(d)},l.findSubRegion=function(d,m){for(var g=0;g<this.nSubRegions;g++){var _=this.subRegions[g];if(_.contain(d,m))return _}},l.contain=function(d,m){return this.bbox[0]<=d&&this.bbox[2]>=d&&this.bbox[1]<=m&&this.bbox[3]>=m},l.setBBox=function(d,m,g,_){this.bbox[0]=d,this.bbox[1]=m,this.bbox[2]=g,this.bbox[3]=_,this.size=(g-d+_-m)/2},l._newSubRegion=function(){var d=this.subRegions[this.nSubRegions];return d||(d=new s,this.subRegions[this.nSubRegions]=d),this.nSubRegions++,d},l._addNodeToSubRegion=function(d){var m=this.findSubRegion(d.position[0],d.position[1]),g=this.bbox;if(!m){var _=(g[0]+g[2])/2,y=(g[1]+g[3])/2,x=(g[2]-g[0])/2,v=(g[3]-g[1])/2,w=d.position[0]>=_?1:0,b=d.position[1]>=y?1:0;(m=this._newSubRegion()).setBBox(w*x+g[0],b*v+g[1],(w+1)*x+g[0],(b+1)*v+g[1])}m.addNode(d)},l._updateCenterOfMass=function(d){this.centerOfMass==null&&(this.centerOfMass=new Float32Array(2));var m=this.centerOfMass[0]*this.mass,g=this.centerOfMass[1]*this.mass;m+=d.position[0]*d.mass,g+=d.position[1]*d.mass,this.mass+=d.mass,this.centerOfMass[0]=m/this.mass,this.centerOfMass[1]=g/this.mass};var f=c.prototype;f.initNodes=function(d,m,g){var _=m.length;this.nodes.length=0;for(var y=g!==void 0,x=0;x<_;x++){var v=new u;v.position[0]=d[2*x],v.position[1]=d[2*x+1],v.mass=m[x],y&&(v.size=g[x]),this.nodes.push(v)}this._massArr=m,this._swingingArr=new Float32Array(_),y&&(this._sizeArr=g)},f.initEdges=function(d,m){var g=d.length/2;this.edges.length=0;for(var _=0;_<g;_++){var y=d[2*_],x=d[2*_+1],v=this.nodes[y],w=this.nodes[x];if(!v||!w)return void console.error("Node not exists, try initNodes before initEdges");v.outDegree++,w.inDegree++;var b=new h(v,w);m&&(b.weight=m[_]),this.edges.push(b)}},f.updateSettings=function(){if(this.repulsionByDegree)for(var d=0;d<this.nodes.length;d++)(m=this.nodes[d]).mass=m.inDegree+m.outDegree+1;else for(d=0;d<this.nodes.length;d++){var m;(m=this.nodes[d]).mass=this._massArr[d]}},f.update=function(){var d,m,g=this.nodes.length;if(this.updateSettings(),this.updateBBox(),this.barnesHutOptimize){this.rootRegion.setBBox(this.bbox[0],this.bbox[1],this.bbox[2],this.bbox[3]),this.rootRegion.beforeUpdate();for(var _=0;_<g;_++)this.rootRegion.addNode(this.nodes[_]);this.rootRegion.afterUpdate()}for(_=0;_<g;_++){var y=this.nodes[_];d=y.forcePrev,m=y.force,d[0]=m[0],d[1]=m[1],o(y.force,0,0)}for(_=0;_<g;_++){var x=this.nodes[_];if(this.barnesHutOptimize)this.applyRegionToNodeRepulsion(this.rootRegion,x);else for(var v=_+1;v<g;v++){var w=this.nodes[v];this.applyNodeToNodeRepulsion(x,w,!1)}this.gravity>0&&(this.strongGravityMode?this.applyNodeStrongGravity(x):this.applyNodeGravity(x))}for(_=0;_<this.edges.length;_++)this.applyEdgeAttraction(this.edges[_]);var b=0,S=0,A=t();for(_=0;_<g;_++)y=this.nodes[_],b+=(P=e(y.force,y.forcePrev))*y.mass,n(A,y.force,y.forcePrev),S+=.5*r(A)*y.mass,this._swingingArr[_]=P;var D=this.jitterTolerence*this.jitterTolerence*S/b;for(this._globalSpeed>0&&(D=Math.min(D/this._globalSpeed,1.5)*this._globalSpeed),this._globalSpeed=D,_=0;_<g;_++){y=this.nodes[_];var P=this._swingingArr[_],L=.1*D/(1+D*Math.sqrt(P)),O=r(y.force);O>0&&(L=Math.min(O*L,10)/O,i(y.position,y.position,y.force,L))}},f.applyRegionToNodeRepulsion=(function(){var d=t();return function(m,g){if(m.node)this.applyNodeToNodeRepulsion(m.node,g,!0);else{a(d,g.position,m.centerOfMass);var _=d[0]*d[0]+d[1]*d[1];if(_>this.barnesHutTheta*m.size*m.size){var y=this.scaling*g.mass*m.mass/_;i(g.force,g.force,d,y)}else for(var x=0;x<m.nSubRegions;x++)this.applyRegionToNodeRepulsion(m.subRegions[x],g)}}})(),f.applyNodeToNodeRepulsion=(function(){var d=t();return function(m,g,_){if(m!=g){a(d,m.position,g.position);var y=d[0]*d[0]+d[1]*d[1];if(y!==0){var x;if(this.preventOverlap){var v=Math.sqrt(y);if((v=v-m.size-g.size)>0)x=this.scaling*m.mass*g.mass/(v*v);else{if(!(v<0))return;x=100*this.scaling*m.mass*g.mass}}else x=this.scaling*m.mass*g.mass/y;i(m.force,m.force,d,x),i(g.force,g.force,d,-x)}}}})(),f.applyEdgeAttraction=(function(){var d=t();return function(m){var g=m.source,_=m.target;a(d,g.position,_.position);var y,x,v=r(d);y=this.edgeWeightInfluence===0?1:this.edgeWeightInfluence===1?m.weight:Math.pow(m.weight,this.edgeWeightInfluence),this.preventOverlap&&(v=v-g.size-_.size)<=0||(x=this.linLogMode?-y*Math.log(v+1)/(v+1):-y,i(g.force,g.force,d,x),i(_.force,_.force,d,-x))}})(),f.applyNodeGravity=(function(){var d=t();return function(m){a(d,this.gravityCenter,m.position);var g=r(d);i(m.force,m.force,d,this.gravity*m.mass/(g+1))}})(),f.applyNodeStrongGravity=(function(){var d=t();return function(m){a(d,this.gravityCenter,m.position),i(m.force,m.force,d,this.gravity*m.mass)}})(),f.updateBBox=function(){for(var d=1/0,m=1/0,g=-1/0,_=-1/0,y=0;y<this.nodes.length;y++){var x=this.nodes[y].position;d=Math.min(d,x[0]),m=Math.min(m,x[1]),g=Math.max(g,x[0]),_=Math.max(_,x[1])}this.bbox[0]=d,this.bbox[1]=m,this.bbox[2]=g,this.bbox[3]=_},f.getGlobalSpeed=function(){return this._globalSpeed};var p=null;self.onmessage=function(d){switch(d.data.cmd){case"init":(p=new c).initNodes(d.data.nodesPosition,d.data.nodesMass,d.data.nodesSize),p.initEdges(d.data.edges,d.data.edgesWeight);break;case"updateConfig":if(p)for(var m in d.data.config)p[m]=d.data.config[m];break;case"update":var g=d.data.steps;if(p){for(var _=0;_<g;_++)p.update();var y=p.nodes.length,x=new Float32Array(2*y);for(_=0;_<y;_++){var v=p.nodes[_];x[2*_]=v.position[0],x[2*_+1]=v.position[1]}self.postMessage({buffer:x.buffer,globalSpeed:p.getGlobalSpeed()},[x.buffer])}else{var w=new Float32Array;self.postMessage({buffer:w.buffer,globalSpeed:p.getGlobalSpeed()},[w.buffer])}}}}.toString();pn=pn.slice(pn.indexOf("{")+1,pn.lastIndexOf("}"));var mn={barnesHutOptimize:!0,barnesHutTheta:1.5,repulsionByDegree:!0,linLogMode:!1,strongGravityMode:!1,gravity:1,scaling:1,edgeWeightInfluence:1,jitterTolerence:.1,preventOverlap:!1,dissuadeHubs:!1,gravityCenter:null},oe=function(t){for(var e in mn)this[e]=mn[e];if(t)for(var e in t)this[e]=t[e];this._nodes=[],this._edges=[],this._disposed=!1,this._positionTex=new K({type:H.FLOAT,flipY:!1,minFilter:H.NEAREST,magFilter:H.NEAREST})};oe.prototype.initData=function(t,e){var r=new Blob([pn]),i=window.URL.createObjectURL(r);this._worker=new Worker(i),this._worker.onmessage=this._$onupdate.bind(this),this._nodes=t,this._edges=e,this._frame=0;for(var n=t.length,a=e.length,o=new Float32Array(2*n),s=new Float32Array(n),l=new Float32Array(n),u=new Float32Array(2*a),h=new Float32Array(a),c=0;c<t.length;c++){var f=t[c];o[2*c]=f.x,o[2*c+1]=f.y,s[c]=f.mass==null?1:f.mass,l[c]=f.size==null?1:f.size}for(c=0;c<e.length;c++){var p=e[c],d=p.node1,m=p.node2;u[2*c]=d,u[2*c+1]=m,h[c]=p.weight==null?1:p.weight}var g=Math.ceil(Math.sqrt(t.length)),_=g,y=new Float32Array(g*_*4),x=this._positionTex;x.width=g,x.height=_,x.pixels=y,this._worker.postMessage({cmd:"init",nodesPosition:o,nodesMass:s,nodesSize:l,edges:u,edgesWeight:h}),this._globalSpeed=1/0},oe.prototype.updateOption=function(t){var e={};for(var r in mn)e[r]=mn[r];var i=this._nodes,n=this._edges,a=i.length;if(e.jitterTolerence=a>5e4?10:a>5e3?1:.1,e.scaling=a>100?2:10,e.barnesHutOptimize=a>1e3,t)for(var r in mn)t[r]!=null&&(e[r]=t[r]);if(!e.gravityCenter){for(var o=[1/0,1/0],s=[-1/0,-1/0],l=0;l<i.length;l++)o[0]=Math.min(i[l].x,o[0]),o[1]=Math.min(i[l].y,o[1]),s[0]=Math.max(i[l].x,s[0]),s[1]=Math.max(i[l].y,s[1]);e.gravityCenter=[.5*(o[0]+s[0]),.5*(o[1]+s[1])]}for(l=0;l<n.length;l++){var u=n[l].node1,h=n[l].node2;i[u].degree=(i[u].degree||0)+1,i[h].degree=(i[h].degree||0)+1}this._worker&&this._worker.postMessage({cmd:"updateConfig",config:e})},oe.prototype.update=function(t,e,r){e==null&&(e=1),e=Math.max(e,1),this._frame+=e,this._onupdate=r,this._worker&&this._worker.postMessage({cmd:"update",steps:Math.round(e)})},oe.prototype._$onupdate=function(t){if(!this._disposed){var e=new Float32Array(t.data.buffer);this._globalSpeed=t.data.globalSpeed,this._positionArr=e,this._updateTexture(e),this._onupdate&&this._onupdate()}},oe.prototype.getNodePositionTexture=function(){return this._positionTex},oe.prototype.getNodeUV=function(t,e){e=e||[];var r=this._positionTex.width,i=this._positionTex.height;return e[0]=t%r/(r-1),e[1]=Math.floor(t/r)/(i-1),e},oe.prototype.getNodes=function(){return this._nodes},oe.prototype.getEdges=function(){return this._edges},oe.prototype.isFinished=function(t){return this._frame>t},oe.prototype.getNodePosition=function(t,e){if(e||(e=new Float32Array(2*this._nodes.length)),this._positionArr)for(var r=0;r<this._positionArr.length;r++)e[r]=this._positionArr[r];return e},oe.prototype._updateTexture=function(t){for(var e=this._positionTex.pixels,r=0,i=0;i<t.length;)e[r++]=t[i++],e[r++]=t[i++],e[r++]=1,e[r++]=1;this._positionTex.dirty()},oe.prototype.dispose=function(t){this._disposed=!0,this._worker=null};let Ds=oe,_p=jt.extend((function(){return{zr:null,viewGL:null,minZoom:.2,maxZoom:5,_needsUpdate:!1,_dx:0,_dy:0,_zoom:1}}),(function(){this._mouseDownHandler=this._mouseDownHandler.bind(this),this._mouseWheelHandler=this._mouseWheelHandler.bind(this),this._mouseMoveHandler=this._mouseMoveHandler.bind(this),this._mouseUpHandler=this._mouseUpHandler.bind(this),this._update=this._update.bind(this)}),{init:function(){var t=this.zr;t.on("mousedown",this._mouseDownHandler),t.on("mousewheel",this._mouseWheelHandler),t.on("globalout",this._mouseUpHandler),t.animation.on("frame",this._update)},setTarget:function(t){this._target=t},setZoom:function(t){this._zoom=Math.max(Math.min(t,this.maxZoom),this.minZoom),this._needsUpdate=!0},setOffset:function(t){this._dx=t[0],this._dy=t[1],this._needsUpdate=!0},getZoom:function(){return this._zoom},getOffset:function(){return[this._dx,this._dy]},_update:function(){if(this._target&&this._needsUpdate){var t=this._target,e=this._zoom;t.position.x=this._dx,t.position.y=this._dy,t.scale.set(e,e,e),this.zr.refresh(),this._needsUpdate=!1,this.trigger("update")}},_mouseDownHandler:function(t){if(!t.target){var e=t.offsetX,r=t.offsetY;if(!this.viewGL||this.viewGL.containPoint(e,r)){this.zr.on("mousemove",this._mouseMoveHandler),this.zr.on("mouseup",this._mouseUpHandler);var i=this._convertPos(e,r);this._x=i.x,this._y=i.y}}},_convertPos:function(t,e){var r=this.viewGL.camera,i=this.viewGL.viewport;return{x:(t-i.x)/i.width*(r.right-r.left)+r.left,y:(e-i.y)/i.height*(r.bottom-r.top)+r.top}},_mouseMoveHandler:function(t){var e=this._convertPos(t.offsetX,t.offsetY);this._dx+=e.x-this._x,this._dy+=e.y-this._y,this._x=e.x,this._y=e.y,this._needsUpdate=!0},_mouseUpHandler:function(t){this.zr.off("mousemove",this._mouseMoveHandler),this.zr.off("mouseup",this._mouseUpHandler)},_mouseWheelHandler:function(t){var e=(t=t.event).wheelDelta||-t.detail;if(e!==0){var r=t.offsetX,i=t.offsetY;if(!this.viewGL||this.viewGL.containPoint(r,i)){var n=e>0?1.1:.9,a=Math.max(Math.min(this._zoom*n,this.maxZoom),this.minZoom);n=a/this._zoom;var o=this._convertPos(r,i),s=(o.x-this._dx)*(n-1),l=(o.y-this._dy)*(n-1);this._dx-=s,this._dy-=l,this._zoom=a,this._needsUpdate=!0}}},dispose:function(){var t=this.zr;t.off("mousedown",this._mouseDownHandler),t.off("mousemove",this._mouseMoveHandler),t.off("mouseup",this._mouseUpHandler),t.off("mousewheel",this._mouseWheelHandler),t.off("globalout",this._mouseUpHandler),t.animation.off("frame",this._update)}});var Da=Mt.vec2;T.Shader.import(`@export ecgl.lines2D.vertex

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

@end`);var vp=1;let yp=M.ChartView.extend({type:"graphGL",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this.viewGL=new Qe("orthographic"),this.viewGL.camera.left=this.viewGL.camera.right=0,this.viewGL.add(this.groupGL),this._pointsBuilder=new cn(!0,e),this._forceEdgesMesh=new T.Mesh({material:new T.Material({shader:T.createShader("ecgl.forceAtlas2.edges"),transparent:!0,depthMask:!1,depthTest:!1}),$ignorePicking:!0,geometry:new T.Geometry({attributes:{node:new T.Geometry.Attribute("node","float",2),color:new T.Geometry.Attribute("color","float",4,"COLOR")},dynamic:!0,mainAttribute:"node"}),renderOrder:-1,mode:T.Mesh.LINES}),this._edgesMesh=new T.Mesh({material:new T.Material({shader:T.createShader("ecgl.meshLines2D"),transparent:!0,depthMask:!1,depthTest:!1}),$ignorePicking:!0,geometry:new jh({useNativeLine:!1,dynamic:!0}),renderOrder:-1,culling:!1}),this._layoutId=0,this._control=new _p({zr:e.getZr(),viewGL:this.viewGL}),this._control.setTarget(this.groupGL),this._control.init(),this._clickHandler=this._clickHandler.bind(this)},render:function(t,e,r){this.groupGL.add(this._pointsBuilder.rootNode),this._model=t,this._api=r,this._initLayout(t,e,r),this._pointsBuilder.update(t,e,r),this._forceLayoutInstance instanceof Ca||this.groupGL.remove(this._forceEdgesMesh),this._updateCamera(t,r),this._control.off("update"),this._control.on("update",(function(){r.dispatchAction({type:"graphGLRoam",seriesId:t.id,zoom:this._control.getZoom(),offset:this._control.getOffset()}),this._pointsBuilder.updateView(this.viewGL.camera)}),this),this._control.setZoom(J(t.get("zoom"),1)),this._control.setOffset(t.get("offset")||[0,0]);var i=this._pointsBuilder.getPointsMesh();if(i.off("mousemove",this._mousemoveHandler),i.off("mouseout",this._mouseOutHandler,this),r.getZr().off("click",this._clickHandler),this._pointsBuilder.highlightOnMouseover=!0,t.get("focusNodeAdjacency")){var n=t.get("focusNodeAdjacencyOn");n==="click"?r.getZr().on("click",this._clickHandler):n==="mouseover"&&(i.on("mousemove",this._mousemoveHandler,this),i.on("mouseout",this._mouseOutHandler,this),this._pointsBuilder.highlightOnMouseover=!1)}this._lastMouseOverDataIndex=-1},_clickHandler:function(t){if(!this._layouting){var e=this._pointsBuilder.getPointsMesh().dataIndex;e>=0?this._api.dispatchAction({type:"graphGLFocusNodeAdjacency",seriesId:this._model.id,dataIndex:e}):this._api.dispatchAction({type:"graphGLUnfocusNodeAdjacency",seriesId:this._model.id})}},_mousemoveHandler:function(t){if(!this._layouting){var e=this._pointsBuilder.getPointsMesh().dataIndex;e>=0?e!==this._lastMouseOverDataIndex&&this._api.dispatchAction({type:"graphGLFocusNodeAdjacency",seriesId:this._model.id,dataIndex:e}):this._mouseOutHandler(t),this._lastMouseOverDataIndex=e}},_mouseOutHandler:function(t){this._layouting||(this._api.dispatchAction({type:"graphGLUnfocusNodeAdjacency",seriesId:this._model.id}),this._lastMouseOverDataIndex=-1)},_updateForceEdgesGeometry:function(t,e){var r=this._forceEdgesMesh.geometry,i=e.getEdgeData(),n=0,a=this._forceLayoutInstance,o=2*i.count();r.attributes.node.init(o),r.attributes.color.init(o),i.each((function(s){var l=t[s];r.attributes.node.set(n,a.getNodeUV(l.node1)),r.attributes.node.set(n+1,a.getNodeUV(l.node2));var u=Ft(i,l.dataIndex),h=T.parseColor(u);h[3]*=J(Bt(i,l.dataIndex),1),r.attributes.color.set(n,h),r.attributes.color.set(n+1,h),n+=2})),r.dirty()},_updateMeshLinesGeometry:function(){var t=this._model.getEdgeData(),e=this._edgesMesh.geometry,r=(t=this._model.getEdgeData(),this._model.getData().getLayout("points"));e.resetOffset(),e.setVertexCount(t.count()*e.getLineVertexCount()),e.setTriangleCount(t.count()*e.getLineTriangleCount());var i=[],n=[],a=["lineStyle","width"];this._originalEdgeColors=new Float32Array(4*t.count()),this._edgeIndicesMap=new Float32Array(t.count()),t.each((function(o){var s=t.graph.getEdgeByIndex(o),l=2*s.node1.dataIndex,u=2*s.node2.dataIndex;i[0]=r[l],i[1]=r[l+1],n[0]=r[u],n[1]=r[u+1];var h=Ft(t,s.dataIndex),c=T.parseColor(h);c[3]*=J(Bt(t,s.dataIndex),1);var f=t.getItemModel(s.dataIndex),p=J(f.get(a),1)*this._api.getDevicePixelRatio();e.addLine(i,n,c,p);for(var d=0;d<4;d++)this._originalEdgeColors[4*s.dataIndex+d]=c[d];this._edgeIndicesMap[s.dataIndex]=o}),this),e.dirty()},_updateForceNodesGeometry:function(t){for(var e=this._pointsBuilder.getPointsMesh(),r=[],i=0;i<t.count();i++)this._forceLayoutInstance.getNodeUV(i,r),e.geometry.attributes.position.set(i,r);e.geometry.dirty("position")},_initLayout:function(t,e,r){var i=t.get("layout"),n=t.getGraph(),a=va(t.getBoxLayoutParams(),{width:r.getWidth(),height:r.getHeight()});i==="force"&&(i="forceAtlas2"),this.stopLayout(t,e,r,{beforeLayout:!0});var o=t.getData(),s=t.getData();if(i==="forceAtlas2"){var l=t.getModel("forceAtlas2"),u=this._forceLayoutInstance,h=[],c=[],f=o.getDataExtent("value"),p=s.getDataExtent("value"),d=J(l.get("edgeWeight"),1),m=J(l.get("nodeWeight"),1);typeof d=="number"&&(d=[d,d]),typeof m=="number"&&(m=[m,m]);var g=0,_={},y=new Float32Array(2*o.count());if(n.eachNode((function(v){var w,b,S=v.dataIndex,A=o.get("value",S);if(o.hasItemOption){var D=o.getItemModel(S);w=D.get("x"),b=D.get("y")}w==null&&(w=a.x+Math.random()*a.width,b=a.y+Math.random()*a.height),y[2*g]=w,y[2*g+1]=b,_[v.id]=g++;var P=M.number.linearMap(A,f,m);isNaN(P)&&(P=isNaN(m[0])?1:m[0]),h.push({x:w,y:b,mass:P,size:o.getItemVisual(S,"symbolSize")})})),o.setLayout("points",y),n.eachEdge((function(v){var w=v.dataIndex,b=o.get("value",w),S=M.number.linearMap(b,p,d);isNaN(S)&&(S=isNaN(d[0])?1:d[0]),c.push({node1:_[v.node1.id],node2:_[v.node2.id],weight:S,dataIndex:w})})),!u){var x=l.get("GPU");this._forceLayoutInstance&&((!x||this._forceLayoutInstance instanceof Ca)&&(x||this._forceLayoutInstance instanceof Ds)||(this._forceLayoutInstanceToDispose=this._forceLayoutInstance)),u=this._forceLayoutInstance=x?new Ca:new Ds}u.initData(h,c),u.updateOption(l.option),this._updateForceEdgesGeometry(u.getEdges(),t),this._updatePositionTexture(),r.dispatchAction({type:"graphGLStartLayout",from:this.uid})}else y=new Float32Array(2*o.count()),g=0,n.eachNode((function(v){var w,b,S=v.dataIndex;if(o.hasItemOption){var A=o.getItemModel(S);w=A.get("x"),b=A.get("y")}y[g++]=w,y[g++]=b})),o.setLayout("points",y),this._updateAfterLayout(t,e,r)},_updatePositionTexture:function(){var t=this._forceLayoutInstance.getNodePositionTexture();this._pointsBuilder.setPositionTexture(t),this._forceEdgesMesh.material.set("positionTex",t)},startLayout:function(t,e,r,i){if(!i||i.from==null||i.from===this.uid){var n=this.viewGL,a=(r=this._api,this._forceLayoutInstance),o=this._model.getData(),s=this._model.getModel("forceAtlas2");if(a&&(this.groupGL.remove(this._edgesMesh),this.groupGL.add(this._forceEdgesMesh),this._forceLayoutInstance)){this._updateForceNodesGeometry(t.getData()),this._pointsBuilder.hideLabels();var l=this,u=this._layoutId=vp++,h=s.getShallow("maxSteps"),c=s.getShallow("steps"),f=0,p=Math.max(2*c,20),d=function(m){if(m===l._layoutId)return a.isFinished(h)?(r.dispatchAction({type:"graphGLStopLayout",from:l.uid}),void r.dispatchAction({type:"graphGLFinishLayout",points:o.getLayout("points"),from:l.uid})):void a.update(n.layer.renderer,c,(function(){l._updatePositionTexture(),(f+=c)>=p&&(l._syncNodePosition(t),f=0),r.getZr().refresh(),Go((function(){d(m)}))}))};Go((function(){l._forceLayoutInstanceToDispose&&(l._forceLayoutInstanceToDispose.dispose(n.layer.renderer),l._forceLayoutInstanceToDispose=null),d(u)})),this._layouting=!0}}},stopLayout:function(t,e,r,i){i&&i.from!=null&&i.from!==this.uid||(this._layoutId=0,this.groupGL.remove(this._forceEdgesMesh),this.groupGL.add(this._edgesMesh),this._forceLayoutInstance&&this.viewGL.layer&&(i&&i.beforeLayout||(this._syncNodePosition(t),this._updateAfterLayout(t,e,r)),this._api.getZr().refresh(),this._layouting=!1))},_syncNodePosition:function(t){var e=this._forceLayoutInstance.getNodePosition(this.viewGL.layer.renderer);t.getData().setLayout("points",e),t.setNodePosition(e)},_updateAfterLayout:function(t,e,r){this._updateMeshLinesGeometry(),this._pointsBuilder.removePositionTexture(),this._pointsBuilder.updateLayout(t,e,r),this._pointsBuilder.updateView(this.viewGL.camera),this._pointsBuilder.updateLabels(),this._pointsBuilder.showLabels()},focusNodeAdjacency:function(t,e,r,i){var n=this._model.getData();this._downplayAll();var a=i.dataIndex,o=n.graph,s=[],l=o.getNodeByIndex(a);s.push(l),l.edges.forEach((function(h){h.dataIndex<0||(h.node1!==l&&s.push(h.node1),h.node2!==l&&s.push(h.node2))}),this),this._pointsBuilder.fadeOutAll(.05),this._fadeOutEdgesAll(.05),s.forEach((function(h){this._pointsBuilder.highlight(n,h.dataIndex)}),this),this._pointsBuilder.updateLabels(s.map((function(h){return h.dataIndex})));var u=[];l.edges.forEach((function(h){h.dataIndex>=0&&(this._highlightEdge(h.dataIndex),u.push(h))}),this),this._focusNodes=s,this._focusEdges=u},unfocusNodeAdjacency:function(t,e,r,i){this._downplayAll(),this._pointsBuilder.fadeInAll(),this._fadeInEdgesAll(),this._pointsBuilder.updateLabels()},_highlightEdge:function(t){var e=this._model.getEdgeData().getItemModel(t),r=T.parseColor(e.get("emphasis.lineStyle.color")||e.get("lineStyle.color")),i=J(e.get("emphasis.lineStyle.opacity"),e.get("lineStyle.opacity"),1);r[3]*=i,this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[t],r)},_downplayAll:function(){this._focusNodes&&this._focusNodes.forEach((function(t){this._pointsBuilder.downplay(this._model.getData(),t.dataIndex)}),this),this._focusEdges&&this._focusEdges.forEach((function(t){this._downplayEdge(t.dataIndex)}),this)},_downplayEdge:function(t){var e=this._getColor(t,[]);this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[t],e)},_setEdgeFade:(La=[],function(t,e){this._getColor(t,La),La[3]*=e,this._edgesMesh.geometry.setItemColor(this._edgeIndicesMap[t],La)}),_getColor:function(t,e){for(var r=0;r<4;r++)e[r]=this._originalEdgeColors[4*t+r];return e},_fadeOutEdgesAll:function(t){this._model.getData().graph.eachEdge((function(e){this._setEdgeFade(e.dataIndex,t)}),this)},_fadeInEdgesAll:function(){this._fadeOutEdgesAll(1)},_updateCamera:function(t,e){this.viewGL.setViewport(0,0,e.getWidth(),e.getHeight(),e.getDevicePixelRatio());for(var r=this.viewGL.camera,i=t.getData().getLayout("points"),n=Da.create(1/0,1/0),a=Da.create(-1/0,-1/0),o=[],s=0;s<i.length;)o[0]=i[s++],o[1]=i[s++],Da.min(n,n,o),Da.max(a,a,o);var l=(a[1]+n[1])/2,u=(a[0]+n[0])/2;if(!(u>r.left&&u<r.right&&l<r.bottom&&l>r.top)){var h=Math.max(a[0]-n[0],10),c=h/e.getWidth()*e.getHeight();h*=1.4,c*=1.4,n[0]-=.2*h,r.left=n[0],r.top=l-c/2,r.bottom=l+c/2,r.right=h+n[0],r.near=0,r.far=100}},dispose:function(){var t=this.viewGL.layer.renderer;this._forceLayoutInstance&&this._forceLayoutInstance.dispose(t),this.groupGL.removeAll(),this._layoutId=-1,this._pointsBuilder.dispose()},remove:function(){this.groupGL.removeAll(),this._control.dispose()}});var La,Pa=M;function Oa(t){return t instanceof Array||(t=[t,t]),t}(0,M.use)((function(t){function e(){}Uo(Pa,"ForceAtlas2",Ds),Uo(Pa,"ForceAtlas2GPU",Ca),t.registerChartView(yp),t.registerSeriesModel(gp),t.registerVisual((function(r){let i={};r.eachSeriesByType("graphGL",(function(n){var a=n.getCategoriesData(),o=n.getData(),s={};a.each((function(l){var u=a.getName(l);s["ec-"+u]=l;var h=a.getItemModel(l),c=h.getModel("itemStyle").getItemStyle();c.fill||(c.fill=n.getColorFromPalette(u,i)),a.setItemVisual(l,"style",c);var f=["symbol","symbolSize","symbolKeepAspect"];for(let d=0;d<f.length;d++){var p=h.getShallow(f[d],!0);p!=null&&a.setItemVisual(l,f[d],p)}})),a.count()&&o.each((function(l){let u=o.getItemModel(l).getShallow("category");if(u!=null){typeof u=="string"&&(u=s["ec-"+u]);var h=a.getItemVisual(u,"style"),c=o.ensureUniqueItemVisual(l,"style");Pa.util.extend(c,h);var f=["symbol","symbolSize","symbolKeepAspect"];for(let p=0;p<f.length;p++)o.setItemVisual(l,f[p],a.getItemVisual(u,f[p]))}}))}))})),t.registerVisual((function(r){r.eachSeriesByType("graphGL",(function(i){var n=i.getGraph(),a=i.getEdgeData(),o=Oa(i.get("edgeSymbol")),s=Oa(i.get("edgeSymbolSize"));a.setVisual("drawType","stroke"),a.setVisual("fromSymbol",o&&o[0]),a.setVisual("toSymbol",o&&o[1]),a.setVisual("fromSymbolSize",s&&s[0]),a.setVisual("toSymbolSize",s&&s[1]),a.setVisual("style",i.getModel("lineStyle").getLineStyle()),a.each((function(l){var u=a.getItemModel(l),h=n.getEdgeByIndex(l),c=Oa(u.getShallow("symbol",!0)),f=Oa(u.getShallow("symbolSize",!0)),p=u.getModel("lineStyle").getLineStyle(),d=a.ensureUniqueItemVisual(l,"style");switch(Pa.util.extend(d,p),d.stroke){case"source":var m=h.node1.getVisual("style");d.stroke=m&&m.fill;break;case"target":m=h.node2.getVisual("style"),d.stroke=m&&m.fill}c[0]&&h.setVisual("fromSymbol",c[0]),c[1]&&h.setVisual("toSymbol",c[1]),f[0]&&h.setVisual("fromSymbolSize",f[0]),f[1]&&h.setVisual("toSymbolSize",f[1])}))}))})),t.registerAction({type:"graphGLRoam",event:"graphglroam",update:"series.graphGL:roam"},(function(r,i){i.eachComponent({mainType:"series",query:r},(function(n){n.setView(r)}))})),t.registerAction({type:"graphGLStartLayout",event:"graphgllayoutstarted",update:"series.graphGL:startLayout"},e),t.registerAction({type:"graphGLStopLayout",event:"graphgllayoutstopped",update:"series.graphGL:stopLayout"},e),t.registerAction({type:"graphGLFocusNodeAdjacency",event:"graphGLFocusNodeAdjacency",update:"series.graphGL:focusNodeAdjacency"},e),t.registerAction({type:"graphGLUnfocusNodeAdjacency",event:"graphGLUnfocusNodeAdjacency",update:"series.graphGL:unfocusNodeAdjacency"},e)}));let xp=M.SeriesModel.extend({type:"series.flowGL",dependencies:["geo","grid","bmap"],visualStyleAccessPath:"itemStyle",getInitialData:function(t,e){var r=this.get("coordinateSystem"),i=r==="geo"?["lng","lat"]:M.getCoordinateSystemDimensions(r)||["x","y"];i.push("vx","vy");var n=M.helper.createDimensions(this.getSource(),{coordDimensions:i,encodeDefine:this.get("encode"),dimensionsDefine:this.get("dimensions")}),a=new M.List(n,this);return a.initData(this.getSource()),a},defaultOption:{coordinateSystem:"cartesian2d",zlevel:10,supersampling:1,particleType:"point",particleDensity:128,particleSize:1,particleSpeed:1,particleTrail:2,colorTexture:null,gridWidth:"auto",gridHeight:"auto",itemStyle:{color:"#fff",opacity:.8}}}),bp=nt.extend((function(){return{dynamic:!0,attributes:{position:new nt.Attribute("position","float",3,"POSITION")}}}),{resetOffset:function(){this._vertexOffset=0,this._faceOffset=0},setLineCount:function(t){var e=this.attributes,r=4*t,i=2*t;this.vertexCount!==r&&e.position.init(r),this.triangleCount!==i&&(this.indices=i===0?null:this.vertexCount>65535?new Uint32Array(3*i):new Uint16Array(3*i))},addLine:function(t){var e=this._vertexOffset;this.attributes.position.set(e,[t[0],t[1],1]),this.attributes.position.set(e+1,[t[0],t[1],-1]),this.attributes.position.set(e+2,[t[0],t[1],2]),this.attributes.position.set(e+3,[t[0],t[1],-2]),this.setTriangleIndices(this._faceOffset++,[e,e+1,e+2]),this.setTriangleIndices(this._faceOffset++,[e+1,e+2,e+3]),this._vertexOffset+=4}});z.import(`@export ecgl.vfParticle.particle.fragment

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
`);var Ls=function(){this.motionBlurFactor=.99,this.vectorFieldTexture=new K({type:H.FLOAT,flipY:!1}),this.particleLife=[5,20],this._particleType="point",this._particleSize=1,this.particleColor=[1,1,1,1],this.particleSpeedScaling=1,this._thisFrameTexture=null,this._particlePass=null,this._spawnTexture=null,this._particleTexture0=null,this._particleTexture1=null,this._particlePointsMesh=null,this._surfaceFrameBuffer=null,this._elapsedTime=0,this._scene=null,this._camera=null,this._lastFrameTexture=null,this._supersampling=1,this._downsampleTextures=[],this._width=512,this._height=512,this.init()};Ls.prototype={constructor:Ls,init:function(){var t={type:H.FLOAT,minFilter:H.NEAREST,magFilter:H.NEAREST,useMipmap:!1};this._spawnTexture=new K(t),this._particleTexture0=new K(t),this._particleTexture1=new K(t),this._frameBuffer=new kt({depthBuffer:!1}),this._particlePass=new Et({fragment:z.source("ecgl.vfParticle.particle.fragment")}),this._particlePass.setUniform("velocityTexture",this.vectorFieldTexture),this._particlePass.setUniform("spawnTexture",this._spawnTexture),this._downsamplePass=new Et({fragment:z.source("clay.compositor.downsample")});var e=new lr({renderOrder:10,material:new he({shader:new z(z.source("ecgl.vfParticle.renderPoints.vertex"),z.source("ecgl.vfParticle.renderPoints.fragment"))}),mode:lr.POINTS,geometry:new nt({dynamic:!0,mainAttribute:"texcoord0"})}),r=new lr({renderOrder:10,material:new he({shader:new z(z.source("ecgl.vfParticle.renderLines.vertex"),z.source("ecgl.vfParticle.renderLines.fragment"))}),geometry:new bp,culling:!1}),i=new lr({material:new he({shader:new z(z.source("ecgl.color.vertex"),z.source("ecgl.color.fragment"))}),geometry:new Un});i.material.enableTexture("diffuseMap"),this._particlePointsMesh=e,this._particleLinesMesh=r,this._lastFrameFullQuadMesh=i,this._camera=new ei,this._thisFrameTexture=new K,this._lastFrameTexture=new K},setParticleDensity:function(t,e){for(var r=new Float32Array(t*e*4),i=0,n=this.particleLife,a=0;a<t;a++)for(var o=0;o<e;o++,i++){r[4*i]=Math.random(),r[4*i+1]=Math.random(),r[4*i+2]=Math.random();var s=(n[1]-n[0])*Math.random()+n[0];r[4*i+3]=s}this._particleType==="line"?this._setLineGeometry(t,e):this._setPointsGeometry(t,e),this._spawnTexture.width=t,this._spawnTexture.height=e,this._spawnTexture.pixels=r,this._particleTexture0.width=this._particleTexture1.width=t,this._particleTexture0.height=this._particleTexture1.height=e,this._particlePass.setUniform("textureSize",[t,e])},_setPointsGeometry:function(t,e){var r=t*e,i=this._particlePointsMesh.geometry,n=i.attributes;n.texcoord0.init(r);for(var a=0,o=0;o<t;o++)for(var s=0;s<e;s++,a++)n.texcoord0.value[2*a]=o/t,n.texcoord0.value[2*a+1]=s/e;i.dirty()},_setLineGeometry:function(t,e){var r=t*e,i=this._getParticleMesh().geometry;i.setLineCount(r),i.resetOffset();for(var n=0;n<t;n++)for(var a=0;a<e;a++)i.addLine([n/t,a/e]);i.dirty()},_getParticleMesh:function(){return this._particleType==="line"?this._particleLinesMesh:this._particlePointsMesh},update:function(t,e,r,i){var n=this._getParticleMesh(),a=this._frameBuffer,o=this._particlePass;i&&this._updateDownsampleTextures(t,e),n.material.set("size",this._particleSize*this._supersampling),n.material.set("color",this.particleColor),o.setUniform("speedScaling",this.particleSpeedScaling),a.attach(this._particleTexture1),o.setUniform("firstFrameTime",i?(this.particleLife[1]+this.particleLife[0])/2:0),o.setUniform("particleTexture",this._particleTexture0),o.setUniform("deltaTime",r),o.setUniform("elapsedTime",this._elapsedTime),o.render(t,a),n.material.set("particleTexture",this._particleTexture1),n.material.set("prevParticleTexture",this._particleTexture0),a.attach(this._thisFrameTexture),a.bind(t),t.gl.clear(t.gl.DEPTH_BUFFER_BIT|t.gl.COLOR_BUFFER_BIT);var s=this._lastFrameFullQuadMesh;s.material.set("diffuseMap",this._lastFrameTexture),s.material.set("color",[1,1,1,this.motionBlurFactor]),this._camera.update(!0),t.renderPass([s,n],this._camera),a.unbind(t),this._downsample(t),this._swapTexture(),this._elapsedTime+=r},_downsample:function(t){var e=this._downsampleTextures;if(e.length!==0)for(var r=0,i=this._thisFrameTexture,n=e[r];n;)this._frameBuffer.attach(n),this._downsamplePass.setUniform("texture",i),this._downsamplePass.setUniform("textureSize",[i.width,i.height]),this._downsamplePass.render(t,this._frameBuffer),i=n,n=e[++r]},getSurfaceTexture:function(){var t=this._downsampleTextures;return t.length>0?t[t.length-1]:this._lastFrameTexture},setRegion:function(t){this._particlePass.setUniform("region",t)},resize:function(t,e){this._lastFrameTexture.width=t*this._supersampling,this._lastFrameTexture.height=e*this._supersampling,this._thisFrameTexture.width=t*this._supersampling,this._thisFrameTexture.height=e*this._supersampling,this._width=t,this._height=e},setParticleSize:function(t){var e=this._getParticleMesh();if(t<=2)return e.material.disableTexture("spriteTexture"),void(e.material.transparent=!1);this._spriteTexture||(this._spriteTexture=new K),this._spriteTexture.image&&this._spriteTexture.image.width===t||(this._spriteTexture.image=(function(r){var i=document.createElement("canvas");i.width=i.height=r;var n=i.getContext("2d");return n.fillStyle="#fff",n.arc(r/2,r/2,r/2,0,2*Math.PI),n.fill(),i})(t),this._spriteTexture.dirty()),e.material.transparent=!0,e.material.enableTexture("spriteTexture"),e.material.set("spriteTexture",this._spriteTexture),this._particleSize=t},setGradientTexture:function(t){var e=this._getParticleMesh().material;e[t?"enableTexture":"disableTexture"]("gradientTexture"),e.setUniform("gradientTexture",t)},setColorTextureImage:function(t,e){this._getParticleMesh().material.setTextureImage("colorTexture",t,e,{flipY:!0})},setParticleType:function(t){this._particleType=t},clearFrame:function(t){var e=this._frameBuffer;e.attach(this._lastFrameTexture),e.bind(t),t.gl.clear(t.gl.DEPTH_BUFFER_BIT|t.gl.COLOR_BUFFER_BIT),e.unbind(t)},setSupersampling:function(t){this._supersampling=t,this.resize(this._width,this._height)},_updateDownsampleTextures:function(t,e){for(var r=this._downsampleTextures,i=Math.max(Math.floor(Math.log(this._supersampling/e.getDevicePixelRatio())/Math.log(2)),0),n=2,a=this._width*this._supersampling,o=this._height*this._supersampling,s=0;s<i;s++)r[s]=r[s]||new K,r[s].width=a/n,r[s].height=o/n,n*=2;for(;s<r.length;s++)r[s].dispose(t);r.length=i},_swapTexture:function(){var t=this._particleTexture0;this._particleTexture0=this._particleTexture1,this._particleTexture1=t,t=this._thisFrameTexture,this._thisFrameTexture=this._lastFrameTexture,this._lastFrameTexture=t},dispose:function(t){t.disposeFrameBuffer(this._frameBuffer),t.disposeTexture(this.vectorFieldTexture),t.disposeTexture(this._spawnTexture),t.disposeTexture(this._particleTexture0),t.disposeTexture(this._particleTexture1),t.disposeTexture(this._thisFrameTexture),t.disposeTexture(this._lastFrameTexture),t.disposeGeometry(this._particleLinesMesh.geometry),t.disposeGeometry(this._particlePointsMesh.geometry),t.disposeGeometry(this._lastFrameFullQuadMesh.geometry),this._spriteTexture&&t.disposeTexture(this._spriteTexture),this._particlePass.dispose(t),this._downsamplePass.dispose(t),this._downsampleTextures.forEach((function(e){e.dispose(t)}))}};let wp=Ls,Tp=M.ChartView.extend({type:"flowGL",__ecgl__:!0,init:function(t,e){this.viewGL=new Qe("orthographic"),this.groupGL=new T.Node,this.viewGL.add(this.groupGL),this._particleSurface=new wp;var r=new T.Mesh({geometry:new T.PlaneGeometry,material:new T.Material({shader:new T.Shader({vertex:T.Shader.source("ecgl.color.vertex"),fragment:T.Shader.source("ecgl.color.fragment")}),transparent:!0})});r.material.enableTexture("diffuseMap"),this.groupGL.add(r),this._planeMesh=r},render:function(t,e,r){var i=this._particleSurface;i.setParticleType(t.get("particleType")),i.setSupersampling(t.get("supersampling")),this._updateData(t,r),this._updateCamera(r.getWidth(),r.getHeight(),r.getDevicePixelRatio());var n=J(t.get("particleDensity"),128);i.setParticleDensity(n,n);var a=this._planeMesh,o=+new Date,s=this,l=!0;a.__percent=0,a.stopAnimation(),a.animate("",{loop:!0}).when(1e5,{__percent:1}).during((function(){var c=+new Date,f=Math.min(c-o,20);o+=f,s._renderer&&(i.update(s._renderer,r,f/1e3,l),a.material.set("diffuseMap",i.getSurfaceTexture())),l=!1})).start();var u=t.getModel("itemStyle"),h=T.parseColor(u.get("color"));h[3]*=J(u.get("opacity"),1),a.material.set("color",h),i.setColorTextureImage(t.get("colorTexture"),r),i.setParticleSize(t.get("particleSize")),i.particleSpeedScaling=t.get("particleSpeed"),i.motionBlurFactor=1-Math.pow(.1,t.get("particleTrail"))},updateTransform:function(t,e,r){this._updateData(t,r)},afterRender:function(t,e,r,i){var n=i.renderer;this._renderer=n},_updateData:function(t,e){var r=t.coordinateSystem,i=r.dimensions.map((function(y){return t.coordDimToDataDim(y)[0]})),n=t.getData(),a=n.getDataExtent(i[0]),o=n.getDataExtent(i[1]),s=t.get("gridWidth"),l=t.get("gridHeight");if(s==null||s==="auto"){var u=(a[1]-a[0])/(o[1]-o[0]);s=Math.round(Math.sqrt(u*n.count()))}l!=null&&l!=="auto"||(l=Math.ceil(n.count()/s));var h=this._particleSurface.vectorFieldTexture,c=h.pixels;if(c&&c.length===l*s*4)for(var f=0;f<c.length;f++)c[f]=0;else c=h.pixels=new Float32Array(s*l*4);var p=0,d=1/0,m=new Float32Array(2*n.count()),g=0,_=[[1/0,1/0],[-1/0,-1/0]];n.each([i[0],i[1],"vx","vy"],(function(y,x,v,w){var b=r.dataToPoint([y,x]);m[g++]=b[0],m[g++]=b[1],_[0][0]=Math.min(b[0],_[0][0]),_[0][1]=Math.min(b[1],_[0][1]),_[1][0]=Math.max(b[0],_[1][0]),_[1][1]=Math.max(b[1],_[1][1]);var S=Math.sqrt(v*v+w*w);p=Math.max(p,S),d=Math.min(d,S)})),n.each(["vx","vy"],(function(y,x,v){var w=Math.round((m[2*v]-_[0][0])/(_[1][0]-_[0][0])*(s-1)),b=4*((l-1-Math.round((m[2*v+1]-_[0][1])/(_[1][1]-_[0][1])*(l-1)))*s+w);c[b]=y/p*.5+.5,c[b+1]=x/p*.5+.5,c[b+3]=1})),h.width=s,h.height=l,t.get("coordinateSystem")==="bmap"&&this._fillEmptyPixels(h),h.dirty(),this._updatePlanePosition(_[0],_[1],t,e),this._updateGradientTexture(n.getVisual("visualMeta"),[d,p])},_fillEmptyPixels:function(t){var e=t.pixels,r=t.width,i=t.height;function n(m,g,_){m=Math.max(Math.min(m,r-1),0);var y=4*((g=Math.max(Math.min(g,i-1),0))*(r-1)+m);return e[y+3]!==0&&(_[0]=e[y],_[1]=e[y+1],!0)}function a(m,g,_){_[0]=m[0]+g[0],_[1]=m[1]+g[1]}for(var o=[],s=[],l=[],u=[],h=[],c=0,f=0;f<i;f++)for(var p=0;p<r;p++){var d=4*(f*(r-1)+p);e[d+3]===0&&(c=o[0]=o[1]=0,n(p-1,f,s)&&(c++,a(s,o,o)),n(p+1,f,l)&&(c++,a(l,o,o)),n(p,f-1,u)&&(c++,a(u,o,o)),n(p,f+1,h)&&(c++,a(h,o,o)),o[0]/=c,o[1]/=c,e[d]=o[0],e[d+1]=o[1]),e[d+3]=1}},_updateGradientTexture:function(t,e){if(t&&t.length){this._gradientTexture=this._gradientTexture||new T.Texture2D({image:document.createElement("canvas")});var r=this._gradientTexture,i=r.image;i.width=200,i.height=1;var n=i.getContext("2d"),a=n.createLinearGradient(0,.5,i.width,.5);t[0].stops.forEach((function(o){var s;e[1]===e[0]?s=0:(s=o.value/e[1],s=Math.min(Math.max(s,0),1)),a.addColorStop(s,o.color)})),n.fillStyle=a,n.fillRect(0,0,i.width,i.height),r.dirty(),this._particleSurface.setGradientTexture(this._gradientTexture)}else this._particleSurface.setGradientTexture(null)},_updatePlanePosition:function(t,e,r,i){var n=this._limitInViewportAndFullFill(t,e,r,i);t=n.leftTop,e=n.rightBottom,this._particleSurface.setRegion(n.region),this._planeMesh.position.set((t[0]+e[0])/2,i.getHeight()-(t[1]+e[1])/2,0);var a=e[0]-t[0],o=e[1]-t[1];this._planeMesh.scale.set(a/2,o/2,1),this._particleSurface.resize(Math.max(Math.min(a,2048),1),Math.max(Math.min(o,2048),1)),this._renderer&&this._particleSurface.clearFrame(this._renderer)},_limitInViewportAndFullFill:function(t,e,r,i){var n=[Math.max(t[0],0),Math.max(t[1],0)],a=[Math.min(e[0],i.getWidth()),Math.min(e[1],i.getHeight())];if(r.get("coordinateSystem")==="bmap"){var o=r.getData().getDataExtent(r.coordDimToDataDim("lng")[0]);Math.floor(o[1]-o[0])>=359&&(n[0]>0&&(n[0]=0),a[0]<i.getWidth()&&(a[0]=i.getWidth()))}var s=e[0]-t[0],l=e[1]-t[1],u=a[0]-n[0],h=a[1]-n[1];return{leftTop:n,rightBottom:a,region:[(n[0]-t[0])/s,1-h/l-(n[1]-t[1])/l,u/s,h/l]}},_updateCamera:function(t,e,r){this.viewGL.setViewport(0,0,t,e,r);var i=this.viewGL.camera;i.left=i.bottom=0,i.top=e,i.right=t,i.near=0,i.far=100,i.position.z=10},remove:function(){this._planeMesh.stopAnimation(),this.groupGL.removeAll()},dispose:function(){this._renderer&&this._particleSurface.dispose(this._renderer),this.groupGL.removeAll()}});(0,M.use)((function(t){t.registerChartView(Tp),t.registerSeriesModel(xp)}));var Ps=M.SeriesModel.extend({type:"series.linesGL",dependencies:["grid","geo"],visualStyleAccessPath:"lineStyle",visualDrawType:"stroke",streamEnabled:!0,init:function(t){var e=this._processFlatCoordsArray(t.data);this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset,e.flatCoords&&(t.data=new Float32Array(e.count)),Ps.superApply(this,"init",arguments)},mergeOption:function(t){var e=this._processFlatCoordsArray(t.data);this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset,e.flatCoords&&(t.data=new Float32Array(e.count)),Ps.superApply(this,"mergeOption",arguments)},appendData:function(t){var e=this._processFlatCoordsArray(t.data);e.flatCoords&&(this._flatCoords?(this._flatCoords=Hl(this._flatCoords,e.flatCoords),this._flatCoordsOffset=Hl(this._flatCoordsOffset,e.flatCoordsOffset)):(this._flatCoords=e.flatCoords,this._flatCoordsOffset=e.flatCoordsOffset),t.data=new Float32Array(e.count)),this.getRawData().appendData(t.data)},_getCoordsFromItemModel:function(t){var e=this.getData().getItemModel(t);return e.option instanceof Array?e.option:e.getShallow("coords")},getLineCoordsCount:function(t){return this._flatCoordsOffset?this._flatCoordsOffset[2*t+1]:this._getCoordsFromItemModel(t).length},getLineCoords:function(t,e){if(this._flatCoordsOffset){for(var r=this._flatCoordsOffset[2*t],i=this._flatCoordsOffset[2*t+1],n=0;n<i;n++)e[n]=e[n]||[],e[n][0]=this._flatCoords[r+2*n],e[n][1]=this._flatCoords[r+2*n+1];return i}var a=this._getCoordsFromItemModel(t);for(n=0;n<a.length;n++)e[n]=e[n]||[],e[n][0]=a[n][0],e[n][1]=a[n][1];return a.length},_processFlatCoordsArray:function(t){var e=0;if(this._flatCoords&&(e=this._flatCoords.length),typeof t[0]=="number"){for(var r=t.length,i=new Uint32Array(r),n=new Float64Array(r),a=0,o=0,s=0,l=0;l<r;){s++;var u=t[l++];i[o++]=a+e,i[o++]=u;for(var h=0;h<u;h++){var c=t[l++],f=t[l++];n[a++]=c,n[a++]=f}}return{flatCoordsOffset:new Uint32Array(i.buffer,0,o),flatCoords:n,count:s}}return{flatCoordsOffset:null,flatCoords:null,count:t.length}},getInitialData:function(t,e){var r=new M.List(["value"],this);return r.hasItemOption=!1,r.initData(Wn(t.data),[],(function(i,n,a,o){if(i instanceof Array)return NaN;r.hasItemOption=!0;var s=i.value;return s!=null?s instanceof Array?s[o]:s:void 0})),r},defaultOption:{coordinateSystem:"geo",zlevel:10,progressive:1e4,progressiveThreshold:5e4,blendMode:"source-over",lineStyle:{opacity:.8},postEffect:{enable:!1,colorCorrection:{exposure:0,brightness:0,contrast:1,saturation:1,enable:!0}}}});let Sp=Ps,Mp=M.ChartView.extend({type:"linesGL",__ecgl__:!0,init:function(t,e){this.groupGL=new T.Node,this.viewGL=new Qe("orthographic"),this.viewGL.add(this.groupGL),this._glViewHelper=new Gh(this.viewGL),this._nativeLinesShader=T.createShader("ecgl.lines3D"),this._meshLinesShader=T.createShader("ecgl.meshLines3D"),this._linesMeshes=[],this._currentStep=0},render:function(t,e,r){this.groupGL.removeAll(),this._glViewHelper.reset(t,r);var i=this._linesMeshes[0];i||(i=this._linesMeshes[0]=this._createLinesMesh(t)),this._linesMeshes.length=1,this.groupGL.add(i),this._updateLinesMesh(t,i,0,t.getData().count()),this.viewGL.setPostEffect(t.getModel("postEffect"),r)},incrementalPrepareRender:function(t,e,r){this.groupGL.removeAll(),this._glViewHelper.reset(t,r),this._currentStep=0,this.viewGL.setPostEffect(t.getModel("postEffect"),r)},incrementalRender:function(t,e,r,i){var n=this._linesMeshes[this._currentStep];n||(n=this._createLinesMesh(e),this._linesMeshes[this._currentStep]=n),this._updateLinesMesh(e,n,t.start,t.end),this.groupGL.add(n),i.getZr().refresh(),this._currentStep++},updateTransform:function(t,e,r){t.coordinateSystem.getRoamTransform&&this._glViewHelper.updateTransform(t,r)},_createLinesMesh:function(t){return new T.Mesh({$ignorePicking:!0,material:new T.Material({shader:T.createShader("ecgl.lines3D"),transparent:!0,depthMask:!1,depthTest:!1}),geometry:new jh({segmentScale:10,useNativeLine:!0,dynamic:!1}),mode:T.Mesh.LINES,culling:!1})},_updateLinesMesh:function(t,e,r,i){var n=t.getData();e.material.blend=t.get("blendMode")==="lighter"?T.additiveBlend:null;var a=t.get("lineStyle.curveness")||0,o=t.get("polyline"),s=e.geometry,l=t.coordinateSystem,u=J(t.get("lineStyle.width"),1);u>1?(e.material.shader!==this._meshLinesShader&&e.material.attachShader(this._meshLinesShader),e.mode=T.Mesh.TRIANGLES):(e.material.shader!==this._nativeLinesShader&&e.material.attachShader(this._nativeLinesShader),e.mode=T.Mesh.LINES),r=r||0,i=i||n.count(),s.resetOffset();var h=0,c=0,f=[],p=[],d=[],m=[],g=[],_=.3,y=.7;function x(){p[0]=f[0]*y+m[0]*_-(f[1]-m[1])*a,p[1]=f[1]*y+m[1]*_-(m[0]-f[0])*a,d[0]=f[0]*_+m[0]*y-(f[1]-m[1])*a,d[1]=f[1]*_+m[1]*y-(m[0]-f[0])*a}if(o||a!==0)for(var v=r;v<i;v++)if(o){var w=t.getLineCoordsCount(v);h+=s.getPolylineVertexCount(w),c+=s.getPolylineTriangleCount(w)}else t.getLineCoords(v,g),this._glViewHelper.dataToPoint(l,g[0],f),this._glViewHelper.dataToPoint(l,g[1],m),x(),h+=s.getCubicCurveVertexCount(f,p,d,m),c+=s.getCubicCurveTriangleCount(f,p,d,m);else{var b=i-r;h+=b*s.getLineVertexCount(),c+=b*s.getLineVertexCount()}s.setVertexCount(h),s.setTriangleCount(c);var S=r,A=[];for(v=r;v<i;v++){T.parseColor(Ft(n,S),A);var D=J(Bt(n,S),1);A[3]*=D,w=t.getLineCoords(v,g);for(var P=0;P<w;P++)this._glViewHelper.dataToPoint(l,g[P],g[P]);o?s.addPolyline(g,A,u,0,w):a!==0?(f=g[0],m=g[1],x(),s.addCubicCurve(f,p,d,m,A,u)):s.addPolyline(g,A,u,0,2),S++}},dispose:function(){this.groupGL.removeAll()},remove:function(){this.groupGL.removeAll()}});(0,M.use)((function(t){t.registerChartView(Mp),t.registerSeriesModel(Sp)}))},83:_e=>{_e.exports=_n}},Ba={};function vn(_e){if(Ba[_e])return Ba[_e].exports;var bi=Ba[_e]={exports:{}};return Br[_e](bi,bi.exports,vn),bi.exports}return vn.g=(function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch{if(typeof window=="object")return window}})(),vn.r=_e=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(_e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(_e,"__esModule",{value:!0})},vn(535)})()}))}).call(globalThis);
