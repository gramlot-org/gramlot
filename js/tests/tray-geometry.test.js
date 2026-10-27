import test from 'node:test';
import assert from 'node:assert/strict';
import {contactFraction,overlaps} from '../src/components/tray-geometry.js';

test('swept contact handles all directions, diagonal crossing, edge sliding and corner grazing',()=>{
    const obstacle={left:100,top:100,width:40,height:40};
    for(const [from,to,fraction] of [
        [{left:0,top:110},{left:200,top:110},.4],
        [{left:200,top:110},{left:0,top:110},.3],
        [{left:110,top:0},{left:110,top:200},.4],
        [{left:110,top:200},{left:110,top:0},.3],
        [{left:0,top:0},{left:200,top:200},.4],
        [{left:80,top:110},{left:80,top:200},1],
        [{left:80,top:110},{left:0,top:110},1],
        [{left:0,top:80},{left:200,top:80},1],
        [{left:80,top:110},{left:90,top:110},0]
    ]) assert.equal(contactFraction({...from,width:20,height:20},{...to,width:20,height:20},[obstacle]),fraction);
    assert.equal(overlaps({left:80,top:110,width:20,height:20},obstacle),false);
});

test('resize stops at the first obstacle even when the requested rectangle crosses it completely',()=>{
    const from={left:0,top:0,width:20,height:20},to={...from,width:200,height:200};
    const near={left:60,top:60,width:20,height:20},far={left:120,top:120,width:20,height:20};
    assert.equal(contactFraction(from,to,[far,near]),40/180);
    assert.equal(contactFraction(from,{...from,width:10,height:10},[near]),1);
});

test('rotated rectangles use their actual sides rather than enclosing axis-aligned boxes',()=>{
    const a={left:0,top:0,width:100,height:10,rotation:45,scale:1};
    const b={left:16,top:25,width:10,height:10};
    assert.equal(overlaps(a,b),false);
    assert.equal(contactFraction(a,{...a,left:1},[b]),1);
});

test('rotation stops at first contact even when the end pose is free',()=>{
    const from={left:100,top:180,width:200,height:20,rotation:0,scale:1};
    const obstacle={left:190,top:240,width:20,height:20};
    const to={...from,rotation:180};
    assert.equal(overlaps(from,obstacle),false);assert.equal(overlaps(to,obstacle),false);
    const t=contactFraction(from,to,[obstacle],{width:500,height:500});
    assert.ok(t>0&&t<.5);
    assert.equal(overlaps({...from,rotation:180*(t-1e-7)},obstacle),false);
    assert.equal(overlaps({...from,rotation:180*(t+1e-7)},obstacle),true);
    assert.equal(contactFraction({...from,rotation:180*(t-1e-7)},from,[obstacle],{width:500,height:500}),1);
});

test('zoom stops at contact, permits shrinking, and respects transformed tray bounds',()=>{
    const from={left:100,top:100,width:100,height:100,rotation:0,scale:1};
    const obstacle={left:225,top:125,width:50,height:50};
    assert.equal(contactFraction(from,{...from,scale:3},[obstacle]),.25);
    assert.equal(contactFraction({...from,scale:1.5},from,[obstacle]),1);
    const t=contactFraction(from,{...from,rotation:90},[],{width:210,height:210});
    assert.ok(t>0&&t<.5);
    assert.equal(contactFraction({...from,rotation:90*t},from,[],{width:210,height:210}),1);
});


test('many full turns retain continuous first contact without iterating each turn',()=>{
    const from={left:100,top:180,width:200,height:20,rotation:0,scale:1};
    const obstacle={left:190,top:240,width:20,height:20};
    const first=contactFraction(from,{...from,rotation:360},[obstacle]);
    assert.ok(Math.abs(contactFraction(from,{...from,rotation:3600000},[obstacle])*10000-first)<1e-12);
    assert.equal(contactFraction(from,{...from,rotation:3600000},[],{width:500,height:500}),1);
});
