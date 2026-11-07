/** Engine-independent candlestick configuration: four measures read in the order open, high, low, close. */
export default {id:'candlestick',label:'Candlestick',controls:['category','measures'],threeD:false,domains:false,
    doc:'Shows the open, high, low and close of each period, as used for prices.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Period',doc:'One candle per row, in row order.'},
        {name:'open',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Open',doc:'The value at the start of the period.'},
        {name:'high',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'High',doc:'The highest value of the period.'},
        {name:'low',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Low',doc:'The lowest value of the period.'},
        {name:'close',parameter:'valueFields',count:1,required:true,dtype:'numeric',caption:'Close',doc:'The value at the end of the period.'}
    ]};
