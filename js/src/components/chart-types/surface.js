/** Engine-independent surface configuration. */
export default {id:'surface',label:'Surface',controls:['category','secondDimension','measures'],threeD:true,
    doc:'Shows a measured surface over a grid of two numeric dimensions.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'First dimension',doc:'The first axis; numeric or date values, at least two distinct.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Second dimension',doc:'The second axis; numeric or date values, at least two distinct.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one surface; each coordinate pair appears once.'}
    ]};
