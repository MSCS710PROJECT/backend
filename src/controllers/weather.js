const tomorrowAPI = require('../services/tomorrow')

exports.getHourlyWeather = async (req, res) => {
    console.log("getting weather from " + req.params.location)
    tomorrowAPI.getWeatherData(req.params.location, "1h", "now", "nowPlus12h").then(
            function(data) {res.send(data.data.timelines[0].intervals)},
            function(err) {
                console.log(err.code)
                res.send('')
            }
        )
};

exports.getDailyWeather = async (req, res) => {
    console.log("getting weather from " + req.params.location)
    tomorrowAPI.getWeatherData(req.params.location, "1d", "now", "nowPlus5d").then(
            function(data) {res.send(data.data.timelines[0].intervals)},
            function(err) {
                console.log(err.code)
                res.send('')
            }
        )
};