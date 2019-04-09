export const config = {
    imageUrl: (id) => {
      return   `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${id}&t=l`
    } ,
    drugChemicalStructureUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/',
    db:{
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'drugcombdb'
    }
};