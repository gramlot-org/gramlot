/** Engine-independent scatter configuration. */
export default {id:'scatter',label:'Scatter',controls:['category','measures'],threeD:false,
    doc:'Shows each row as a point, to reveal relations and clusters.',
    syntax:[
        {name:'captionField',parameter:'captionField',count:1,required:true,dtype:null,caption:'Category',doc:'The horizontal position of each point.'},
        {name:'measures',parameter:'valueFields',count:'many',required:false,dtype:'numeric',caption:'Measures',doc:'Each measure is one series of points, at its height.'}
    ]};
