const distance = require("google-distance-matrix");
distance.key(process.env.googleApiKey);

const LocationHelper = () => {
  const distanceBetweenLocations = async (address1, address2) => {
    return new Promise(resolve => {
      if (!address1 || !address1.address1 || !address2 || !address2.address1) {
        resolve(null);
      }
      var origins = [
        `${address1.address1}, ${address1.city}, ${address1.state}`
      ];
      var destinations = [
        `${address2.address1}, ${address2.city}, ${address2.state}`
      ];
      distance.mode("driving");
      distance.matrix(origins, destinations, function(err, distances) {
        if (distances.status == "OK") {
          for (var i = 0; i < origins.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
              if (
                distances.rows[i] &&
                distances.rows[i].elements[j] &&
                distances.rows[i].elements[j].status == "OK"
              ) {
                var distance = distances.rows[i].elements[j].distance;
                resolve(distance.value / 1000);
              } else {
                resolve(null);
              }
            }
          }
        }
        resolve(null);
      });
    });
  };

  return {
    distanceBetweenLocations
  };
};
module.exports = LocationHelper;
