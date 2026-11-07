/** Engine-independent radar configuration: each measure is an axis, each row a polygon. */
export default {id:'radar',label:'Radar',controls:[],threeD:false,domains:false,
    doc:'Compares items on several measures; each measure is an axis, each row a polygon.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Item',doc:'One polygon per row; a row with any empty measure is left out.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one axis of the radar.'}
    ]};
