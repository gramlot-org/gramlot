/** Engine-independent 3d bars configuration. */
export default {id:'bar3D',label:'3D bars',controls:[],threeD:true,
    doc:'Shows a value for each pair of two dimensions as 3D columns.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'First dimension',doc:'The first axis of the grid.'},
        {name:'secondCaptionField',parameter:'secondCaptionField',count:1,required:true,dtype:null,caption:'Second dimension',doc:'The second axis of the grid; it must differ from the first.'},
        {name:'measures',parameter:'valueFields',count:'many',required:true,dtype:'numeric',caption:'Measures',doc:'Each measure is one series of heights on the grid of the two dimensions.'}
    ]};
