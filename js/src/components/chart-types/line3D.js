/** Engine-independent 3d lines configuration. */
export default {id:'line3D',label:'3D lines',controls:[],threeD:true,
    doc:'Shows values along two dimensions as lines in 3D space.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'First dimension',doc:'The first axis.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Second dimension',doc:'The second axis; it must differ from the first.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one series of heights on the grid of the two dimensions.'}
    ]};
