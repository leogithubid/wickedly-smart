function readData(file,id){
    d3.csv(file).then((data)=>graph(data,id));
}
function graph(data,id){
    let numCountries = 10;
//We are going to get the first and last dates - to avoid hard coding the time interval
//print the keys of the array
//   console.log(Object.keys(data[0]));
// map - to transfor the array - here to convert everything into date format
//filter - filterout values of the array - here the fields that can't be converted to date format
const dates = Object.keys(data[0])
            .map(function(date){
                let d = new Date(date);
                return d.getTime();
            })
            .filter(function(date){
                return !isNaN(date);
            });
const startDate = new Date(Math.min(...dates));
const endDate = new Date(Math.max(...dates));
//console.log(startDate,endDate);
//we are going to pick the top10 countries with the most covid cases
//so we have to pick the cases on the last date, for this last date in the data should match
//with the endDate we created. For this endDate we have to convert in the date format in the file
const lastDate = (endDate.getMonth()+1) + "/" + endDate.getDate() + "/" + (endDate.getFullYear()+"").slice(-2);
//console.log(lastDate);
//console.log(data[0][lastDate]);
//Now we are sorting the number of confirmed cases as on last Date
data.sort((a,b)=> parseInt(a[lastDate]) < parseInt(b[lastDate])? 1 : -1);
//console.log(data);
//get the top 10 countries
data = data.slice(0,numCountries);
//console.log(data);
//creating a parallel array for plotting graph 
const casesData = data.map((d) => 
	Object.entries(d)
		.filter((e) => (new Date(e[0]).getTime()))
		.map((e) => [(new Date(e[0])).getTime(), parseInt(e[1])]));
//console.log(casesData);
//find the maximum number of cases
const cases = casesData.flatMap((p)=>p.map((c)=>c[1]));
console.log(cases);
const maxCases = Math.max(...cases);
console.log(maxCases);
}