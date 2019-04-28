module.exports = (lattitude, longitude) => {
    return axios.get('https://api.opencagedata.com/geocode/v1/json?q=' + latitude + '+' + longitude + '&key=aafdab68af81466d9fcc0b6f307e59f4')
    .then(data => {
        try {
            return data.data.results.city;
        }
        catch (err) {
            return '';
        }
    });
}