




export const getListParseQuery = (query: {filter:string, sort: string,range: string} ) => {
  try {          
    const range = JSON.parse(query.range) as [number,number];
    const sorts = JSON.parse(query.sort) as [string,string];
    return {
      filter: JSON.parse(query.filter),
      sort:  sorts.length ? [sorts[0], sorts[1]?.toUpperCase() === 'DESC' ? 'DESC':'ASC']:[],
      skip: range[0],
      limit: range[1]-range[0]+1,
      range
    }
  } catch(err) {
    console.log(err);
    return {
      filter: {},
      sort:[],
      skip: 0,
      limit: 10,
      range: [0,9]
    }
  }
}