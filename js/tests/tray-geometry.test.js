import test from 'node:test';
import assert from 'node:assert/strict';
import {arrangeGrid,contactFraction,overlaps} from '../src/components/tray-geometry.js';

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

const card=(extra={})=>({aspectRatio:null,minWidth:10,minHeight:10,...extra});
const disjoint=rectangles=>rectangles.every((a,i)=>rectangles.slice(i+1).every(b=>!overlaps(a,b)));
const inside=(rectangles,width,height)=>rectangles.every(r=>r.left>=-1e-9&&r.top>=-1e-9
    &&r.left+r.width<=width+1e-9&&r.top+r.height<=height+1e-9);

test('arrangeGrid chooses the column count with the largest 16/9 card area, in item order',()=>{
    const ratio=16/9,items=count=>Array.from({length:count},()=>card({aspectRatio:ratio}));
    assert.deepEqual(arrangeGrid({width:800,height:450,gap:0,fit:true,items:[]}),[]);
    const one=arrangeGrid({width:800,height:450,gap:0,fit:true,items:items(1)});
    assert.deepEqual(one,[{left:0,top:0,width:800,height:450}]);
    const four=arrangeGrid({width:800,height:450,gap:0,fit:true,items:items(4)});
    assert.deepEqual(four.map(r=>[r.left,r.top,r.width,r.height]),[[0,0,400,225],[400,0,400,225],[0,225,400,225],[400,225,400,225]]);
    // A tall pane stacks 16/9 cards in one column rather than shrinking them side by side.
    const tall=arrangeGrid({width:320,height:900,gap:0,fit:true,items:items(3)});
    assert.deepEqual(tall.map(r=>[r.left,r.top,r.width]),[[0,60,320],[0,360,320],[0,660,320]]);
    for(let count=1;count<=9;count++) {
        const rectangles=arrangeGrid({width:1000,height:600,gap:10,fit:true,items:items(count)});
        assert.equal(rectangles.length,count);assert.ok(disjoint(rectangles));assert.ok(inside(rectangles,1000,600));
        for(const r of rectangles)assert.ok(Math.abs(r.width/r.height-ratio)<1e-9);
    }
});

test('arrangeGrid fills free cells, centers an incomplete last row and keeps ratio when growing to minima',()=>{
    const free=arrangeGrid({width:300,height:200,gap:10,fit:true,items:[card(),card()]});
    assert.deepEqual(free.map(r=>[r.left,r.top,r.width,r.height]),[[10,10,135,180],[155,10,135,180]]);
    const squares=arrangeGrid({width:300,height:200,gap:0,fit:true,items:Array.from({length:5},()=>card({aspectRatio:1}))});
    assert.deepEqual(squares.map(r=>[r.left,r.top,r.width,r.height]),
        [[0,0,100,100],[100,0,100,100],[200,0,100,100],[50,100,100,100],[150,100,100,100]]);
    // Minimums win over the visible area; a ratio card grows on both axes.
    const grown=arrangeGrid({width:100,height:100,gap:0,fit:true,items:[card({aspectRatio:2,minHeight:80})]});
    assert.deepEqual(grown,[{left:-30,top:10,width:160,height:80}]);
    const minimum=arrangeGrid({width:100,height:100,gap:0,fit:true,items:[card({minWidth:150})]});
    assert.equal(minimum[0].width,150);assert.equal(minimum[0].height,100);
});

test('arrangeGrid without fit keeps every size and picks the grid with the widest margin',()=>{
    const items=[{width:100,height:80},{width:100,height:80},{width:60,height:40}].map(card);
    const rectangles=arrangeGrid({width:400,height:120,gap:10,fit:false,items});
    assert.deepEqual(rectangles.map(r=>[r.width,r.height]),[[100,80],[100,80],[60,40]]);
    assert.deepEqual(rectangles.map(r=>r.top),[20,20,40]);
    assert.ok(disjoint(rectangles));assert.ok(inside(rectangles,400,120));
    assert.deepEqual(arrangeGrid({width:400,height:120,gap:10,fit:false,items}),rectangles);
});
