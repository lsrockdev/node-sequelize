const distance = require("google-distance-matrix");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.js")[env];
distance.key(config.googleApiKey);

const LocationHelper = () => {
  const distanceBetweenLocations = async (address1, address2) => {
    if (!address1 || !address1.address1 || !address2 || !address2.address1) {
      return null;
    }
    var origins = address1.address1;
    var destinations = address2.address1;
    distance.mode("driving");
    distance.matrix(origins, destinations, function(err, distances) {
      if (err) {
        console.log(err);
        return null;
      }
      if (!distances) {
        return null;
      }
      if (distances.status == "OK") {
        for (var i = 0; i < origins.length; i++) {
          for (var j = 0; j < destinations.length; j++) {
            if (distances.rows[0].elements[j].status == "OK") {
              var distance = distances.rows[i].elements[j].distance;
              return distance.value / 1000;
            } else {
              return null;
            }
          }
        }
      }
    });
  };
  return {
    distanceBetweenLocations
  };
};
module.exports = LocationHelper;
